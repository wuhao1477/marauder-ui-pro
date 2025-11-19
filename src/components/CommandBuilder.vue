<template>
    <div class="space-y-4">
      <!-- 快捷操作 -->
      <div class="flex space-x-2">
        <button
          @click="sendCommand('stopscan')"
          class="flex-1 px-3 py-2 text-sm font-bold bg-red-500 text-white rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          停止
        </button>
        <button
          @click="sendCommand(props.rightContentView === 'bt' ? 'list -t' : 'list -a')"
          class="flex-1 px-3 py-2 text-sm font-bold bg-blue-500 text-white rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          {{ props.rightContentView === 'bt' ? '列出 AirTag 标签' : '列出 AP' }}
        </button>
      </div>

      <!-- 扫描命令 -->
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

      <!-- BLE 垃圾短信按钮（仅蓝牙视图显示） -->
      <div v-if="props.rightContentView === 'bt'" class="grid grid-cols-2 gap-2 mt-2">
        <button @click="sendCommand('blespam -t apple')"
          class="px-3 py-2 text-sm font-bold bg-yellow-500 text-black rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-600">
          BLE 骚扰（Apple）
        </button>
        <button @click="sendCommand('blespam -t windows')"
          class="px-3 py-2 text-sm font-bold bg-yellow-500 text-black rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-600">
          BLE 骚扰（Swift）
        </button>
        <button @click="sendCommand('blespam -t samsung')"
          class="px-3 py-2 text-sm font-bold bg-yellow-500 text-black rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-600">
          BLE 骚扰（三星）
        </button>
        <button @click="sendCommand('blespam -t flipper')"
          class="px-3 py-2 text-sm font-bold bg-yellow-500 text-black rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-600">
          BLE 骚扰（Flipper）
        </button>
        <button @click="sendCommand('blespam -t all')"
          class="px-3 py-2 text-sm font-bold bg-yellow-500 text-black rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-yellow-600">
          BLE 骚扰（全部）
        </button>
      </div>

      <!-- 自定义命令 -->
      <div class="flex space-x-2">
        <input
          v-model="customCommand"
          @keyup.enter="sendCustomCommand"
          type="text"
          class="flex-1 px-3 py-2 text-sm bg-white rounded border-2 border-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="输入自定义命令..."
        >
        <button
          @click="sendCustomCommand"
          class="px-3 py-2 text-sm font-bold bg-blue-500 text-white rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
        >
          发送
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
    { label: '扫描 AP', command: 'scanap' },
    { label: '扫描终端', command: 'scansta' },
    { label: '嗅探信标', command: 'sniffbeacon' },
    { label: '嗅探去认证', command: 'sniffdeauth' },
    { label: '嗅探 PMKID', command: 'sniffpmkid' },
    { label: 'Wardrive 模式', command: 'wardrive -s' }
  ]

  const btCommands = [
    { label: '扫描蓝牙', command: 'sniffbt' },
    { label: '扫描 Flipper', command: 'sniffbt -t flipper' },
    { label: '扫描 AirTag', command: 'sniffbt -t airtag' },
    { label: 'Wardrive 模式', command: 'btwardrive' }
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
