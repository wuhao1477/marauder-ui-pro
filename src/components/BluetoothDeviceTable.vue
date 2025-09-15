<template>
  <div class="h-full flex flex-col">
    <div class="flex flex-col gap-4 mb-4">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-2">
          <h2 class="text-xl font-bold">Bluetooth Devices</h2>
          <span class="text-sm text-gray-600">({{ devices.size }} devices)</span>
        </div>
        <div class="flex items-center space-x-2">
          <button @click="refreshList"
            class="px-3 py-1 text-sm font-bold bg-blue-500 text-white rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
            :disabled="!isConnected">
            Refresh
          </button>
          <button @click="clearTable"
            class="px-3 py-1 text-sm font-bold bg-orange-500 text-white rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
            Clear
          </button>
        </div>
      </div>
      <div class="flex space-x-4">
        <div class="flex-1">
          <input type="text" v-model="search" placeholder="Search by Name, MAC, or Vendor..."
            class="w-full px-3 py-2 text-sm bg-white rounded border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500">
        </div>
        <select v-model="sortBy"
          class="px-3 py-2 text-sm bg-white rounded border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="rssi">Sort by Signal</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>
    </div>
    <div class="flex-1 min-h-0 overflow-auto border-2 border-black rounded bg-white">
      <table class="w-full text-sm">
        <thead class="bg-blue-300 sticky top-0 z-10">
          <tr>
            <th class="px-2 py-1 text-left border-b-2 border-black font-bold w-12">#</th>
            <th class="px-2 py-1 text-left border-b-2 border-black font-bold">MAC</th>
            <th class="px-2 py-1 text-left border-b-2 border-black font-bold">Name</th>
            <th class="px-2 py-1 text-left border-b-2 border-black w-16 font-bold">RSSI</th>
            <th class="px-2 py-1 text-left border-b-2 border-black w-24 font-bold">Vendor</th>
            <th class="px-2 py-1 text-left border-b-2 border-black w-24 font-bold">Last Seen</th>
          </tr>
        </thead>
        <tbody>
          <template v-for="device in sortedDevices" :key="device.mac || device.name">
            <tr class="hover:bg-blue-50 border-b border-gray-200 cursor-pointer">
              <td class="px-2 py-1 font-mono">{{ device.index }}</td>
              <td class="px-2 py-1 font-mono">{{ device.mac || '-' }}</td>
              <td class="px-2 py-1 font-medium">{{ device.name || '-' }}</td>
              <td class="px-2 py-1">{{ device.rssi || 'N/A' }}</td>
              <td class="px-2 py-1">{{ device.vendor || 'Unknown' }}</td>
              <td class="px-2 py-1 text-gray-600">{{ formatLastSeen(device.lastSeen) }}</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useSerialConnection } from '../utils/serialConnection'

const { sendCommand, isConnected, terminalOutput } = useSerialConnection()
const devices = ref(new Map())
const search = ref('')
const sortBy = ref('rssi')

const sortedDevices = computed(() => {
  let arr = Array.from(devices.value.values())
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    arr = arr.filter(device =>
      device.name?.toLowerCase().includes(searchLower) ||
      device.mac?.toLowerCase().includes(searchLower) ||
      device.vendor?.toLowerCase().includes(searchLower)
    )
  }
  return arr.sort((a, b) => {
    switch (sortBy.value) {
      case 'rssi':
        return (b.rssi ?? -999) - (a.rssi ?? -999) || a.name.localeCompare(b.name)
      case 'name':
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })
})

const formatLastSeen = (date) => {
  if (!date) return 'N/A'
  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds < 60) return `${seconds}s`
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  return `${Math.floor(seconds / 3600)}h`
}

const clearTable = () => {
  devices.value = new Map();
}

const refreshList = async () => {
  if (isConnected.value) {
    await sendCommand('sniffbt') // Comando para escanear y mostrar dispositivos Bluetooth
  }
}

watch(() => terminalOutput.value, (newLines) => {
  let idx = 1;
  newLines.forEach(line => {
    const plainLine = line.replace(/<[^>]+>/g, '').trim();
    // Parse formato: RSSI: <valor> Device: <mac|name>
  const match = plainLine.match(/^RSSI:\s*(-?\d+)\s*Device:\s*(.+)$/);
    if (match) {
      const [_, rssi, device] = match;
      const isMac = /^([0-9a-fA-F]{2}:){5}[0-9a-fA-F]{2}$/.test(device);
      let mac = '-';
      let name = '-';
      let key = device;
      // Buscar si ya existe un objeto con la misma MAC o nombre
      let existing = undefined;
      if (isMac) {
        mac = device;
        // Buscar por MAC
        existing = Array.from(devices.value.values()).find(d => d.mac === mac);
        if (existing) {
          name = existing.name || '-';
          key = existing.mac || mac;
        }
      } else {
        name = device;
        // Buscar por nombre
        existing = Array.from(devices.value.values()).find(d => d.name === name);
        if (existing) {
          mac = existing.mac || '-';
          key = existing.name || name;
        }
      }
      const newDevices = new Map(devices.value);
      newDevices.set(key, {
        ...existing,
        index: idx++,
        mac,
        name,
        rssi: parseInt(rssi),
        lastSeen: new Date()
      });
      devices.value = newDevices;
    }
  });
}, { deep: true });

const cleanup = () => {
  const now = new Date()
  for (const [key, device] of devices.value.entries()) {
    if ((now - device.lastSeen) > 5 * 60 * 1000) {
      devices.value.delete(key)
    }
  }
}

onMounted(() => {
  const interval = setInterval(cleanup, 30000)
  onUnmounted(() => clearInterval(interval))
})
</script>
