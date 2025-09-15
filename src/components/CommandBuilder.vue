<template>
    <div class="space-y-4">
      <!-- Quick Actions -->
      <div class="flex space-x-2">
        <button 
          @click="sendCommand('stopscan')"
          class="flex-1 px-3 py-2 text-sm font-bold bg-red-500 text-white rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          Stop
        </button>
        <button 
          @click="sendCommand(props.rightContentView === 'bt' ? 'list -t' : 'list -a')"
          class="flex-1 px-3 py-2 text-sm font-bold bg-blue-500 text-white rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          {{ props.rightContentView === 'bt' ? 'List Airtags' : 'List APs' }}
        </button>
      </div>
  
      <!-- Scan Commands -->
      <div class="grid grid-cols-2 gap-2">
        <button 
          v-for="cmd in scanCommands" 
          :key="cmd.command"
          @click="sendCommand(cmd.command)"
          class="px-3 py-2 text-sm font-bold bg-blue-500 text-white rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          {{ cmd.label }}
        </button>
      </div>

      <!-- BLE Spam Buttons (only in Bluetooth view) -->
      <div v-if="props.rightContentView === 'bt'" class="grid grid-cols-2 gap-2 mt-2">
        <button @click="sendCommand('blespam -t apple')"
          class="px-3 py-2 text-sm font-bold bg-yellow-500 text-black rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-600">
          Spam BLE Apple
        </button>
        <button @click="sendCommand('blespam -t windows')"
          class="px-3 py-2 text-sm font-bold bg-yellow-500 text-black rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-600">
          Spam BLE Swift
        </button>
        <button @click="sendCommand('blespam -t samsung')"
          class="px-3 py-2 text-sm font-bold bg-yellow-500 text-black rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-600">
          Spam BLE Samsung
        </button>
        <button @click="sendCommand('blespam -t flipper')"
          class="px-3 py-2 text-sm font-bold bg-yellow-500 text-black rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-600">
          Spam BLE Flipper
        </button>
        <button @click="sendCommand('blespam -t all')"
          class="px-3 py-2 text-sm font-bold bg-yellow-500 text-black rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-600">
          Spam BLE All
        </button>
      </div>
  
      <!-- Custom Command -->
      <div class="flex space-x-2">
        <input 
          v-model="customCommand"
          @keyup.enter="sendCustomCommand"
          type="text"
          class="flex-1 px-3 py-2 text-sm bg-white rounded border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter command..."
        >
        <button 
          @click="sendCustomCommand"
          class="px-3 py-2 text-sm font-bold bg-blue-500 text-white rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          Send
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, defineProps } from 'vue'
  import { useSerialConnection } from '../utils/serialConnection'

  const props = defineProps({
    rightContentView: {
      type: String,
      default: 'ap'
    }
  })

  const { sendCommand: serialSendCommand } = useSerialConnection()
  const customCommand = ref('')

  const wifiCommands = [
    { label: 'Scan AP', command: 'scanap' },
    { label: 'Scan STA', command: 'scansta' },
    { label: 'Sniff Beacon', command: 'sniffbeacon' },
    { label: 'Sniff Deauth', command: 'sniffdeauth' },
    { label: 'Sniff PMKID', command: 'sniffpmkid' },
    { label: 'Wardrive', command: 'wardrive -s' }
  ]

  const btCommands = [
    { label: 'Scan Bluetooth', command: 'sniffbt' },
    { label: 'Scan Flipper', command: 'sniffbt -t flipper' },
    { label: 'Scan Airtag', command: 'sniffbt -t airtag' },
    { label: 'Wardrive', command: 'btwardrive' }
  ]

  const scanCommands = computed(() => {
    return props.rightContentView === 'bt' ? btCommands : wifiCommands
  })

  const sendCommand = async (cmd) => {
    await serialSendCommand(cmd)
  }

  const sendCustomCommand = async () => {
    if (customCommand.value.trim()) {
      await sendCommand(customCommand.value)
      customCommand.value = ''
    }
  }
  </script>