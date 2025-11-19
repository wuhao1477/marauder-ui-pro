<template>
  <div class="h-screen flex flex-col bg-yellow-50 p-4 gap-4">
    <MobileBlocker />

    <!-- 页眉 -->
    <div
      class="bg-pink-400 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 flex justify-between items-center">
      <h1 class="text-3xl font-black">marauder-ui-pro</h1>
      <div class="flex items-center space-x-4">
        <!-- 演示模式按钮 -->
        <button v-if="!serialConnection.isConnected.value" @click="toggleDemoMode"
          class="px-3 py-1 text-sm font-bold rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          :class="isDemoMode ? 'bg-purple-500 text-white' : 'bg-white'">
          {{ isDemoMode ? '退出演示' : '体验演示' }}
        </button>

        <span class="text-sm">状态：</span>
        <button @click="handleConnect" v-if="!serialConnection.isConnected.value"
          class="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
          连接
        </button>
        <button @click="handleDisconnect" v-if="serialConnection.isConnected.value"
          class="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
          断开
        </button>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="flex-1 flex gap-4 min-h-0">
      <!-- 左侧边栏 -->
      <div class="w-1/4 flex flex-col gap-4">
        <!-- 命令构建器 -->
        <div class="bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
          <CommandBuilder :rightContentView="rightContentView" />
        </div>

        <!-- 工作流 -->
        <div
          class="flex-1 bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 overflow-auto">
          <h2 class="text-xl font-bold mb-4">工作流</h2>
          <div class="space-y-2">
            <button v-for="workflow in workflows" :key="workflow.id" @click="openWorkflow(workflow)"
              class="w-full px-3 py-2 text-left text-sm bg-gray-100 hover:bg-gray-200 rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
              {{ workflow.name }}
            </button>
          </div>
        </div>
      </div>


      <!-- 右侧内容 -->
      <div class="flex-1 flex flex-col gap-4">
        <!-- 切换按钮 -->
        <div class="mb-2 flex justify-end">
          <button @click="rightContentView = rightContentView === 'ap' ? 'bt' : 'ap'"
            class="px-4 py-2 font-bold rounded border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-blue-500 text-white hover:bg-blue-600">
            {{ rightContentView === 'ap' ? '蓝牙设备' : 'WiFi 接入点' }}
          </button>
        </div>
        <!-- AP 或蓝牙列表 -->
        <div class="flex-1 bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 min-h-0">
          <AccessPointTable v-if="rightContentView === 'ap'" />
          <BluetoothDeviceTable v-else />
        </div>
      </div>
    </div>

    <!-- 终端输出 -->
    <div class="h-64 bg-white rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4">
      <TerminalOutput />
    </div>
  </div>

  <Teleport to="body">
    <WorkflowDialog v-if="selectedWorkflow" :workflow="selectedWorkflow" @close="selectedWorkflow = null"
      @execute="executeWorkflow" />
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import MobileBlocker from './components/MobileBlocker.vue'
import CommandBuilder from './components/CommandBuilder.vue'
import TerminalOutput from './components/TerminalOutput.vue'
import AccessPointTable from './components/AccessPointTable.vue'
import BluetoothDeviceTable from './components/BluetoothDeviceTable.vue'
import WorkflowDialog from './components/WorkflowDialog.vue'
import { useSerialConnection } from './utils/serialConnection'
import { generateDemoData, generateDemoTerminalOutput } from './utils/demoData'
const isDemoMode = ref(false)
const demoUpdateInterval = ref(null)

// 右侧内容视图切换状态
const rightContentView = ref('ap')

// 移动端检测
const isMobileDevice = ref(false)

onMounted(() => {
  const checkMobile = () => {
    isMobileDevice.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.innerWidth <= 768
  }

  // 挂载时检测
  checkMobile()

  // 监听窗口尺寸
  window.addEventListener('resize', checkMobile)

  // 清理事件
  onUnmounted(() => {
    window.removeEventListener('resize', checkMobile)
  })
})

const serialConnection = useSerialConnection()
const selectedWorkflow = ref(null)
const workflows = [
  {
    id: 'random-beacon-spam-list',
    name: '随机信标骚扰（列表）',
    description: '生成随机 SSID 列表，并用该列表广播信标帧。',
    steps: [
      { command: 'ssid -a -g 50', description: '生成 50 个随机 SSID' },
      { command: 'list -s', description: '查看生成的 SSID' },
      { command: 'attack -t beacon -l', description: '执行列表信标攻击' }
    ]
  },
  {
    id: 'random-beacon-spam-auto',
    name: '随机信标骚扰（自动）',
    description: '自动生成随机 SSID 并广播信标帧。',
    steps: [
      { command: 'attack -t beacon -r', description: '执行随机信标骚扰攻击' }
    ]
  },
  {
    id: 'targeted-pmkid-sniff',
    name: '定向主动 PMKID 嗅探',
    description: '针对所选接入点执行 PMKID 嗅探。',
    steps: [
      { command: 'scanap', description: '扫描接入点' },
      { command: 'list -a', description: '列出可用接入点' },
      {
        command: 'select -a {targets}',
        description: '选择目标接入点',
        requiresInput: true,
        inputLabel: '目标 AP 索引（逗号分隔）',
        placeholder: '0,1,2'
      },
      { command: 'list -a', description: '确认所选接入点' },
      { command: 'sniffpmkid -d -l', description: '执行定向 PMKID 嗅探' }
    ]
  },
  {
    id: 'random-beacon-spam-list',
    name: '随机信标骚扰（列表）',
    description: '生成随机 SSID 列表，并用该列表广播信标帧。',
    steps: [
      { command: 'ssid -a -g 50', description: '生成 50 个随机 SSID' },
      { command: 'list -s', description: '查看生成的 SSID' },
      { command: 'attack -t beacon -l', description: '执行列表信标攻击' }
    ]
  },
  {
    id: 'list-beacon-spam',
    name: '自定义列表信标骚扰',
    description: '创建自定义 SSID 列表并广播信标帧。',
    steps: [
      {
        command: 'ssid -a -{type} {value}',
        description: '向列表添加 SSID',
        requiresInput: true,
        inputLabel: 'SSID 生成方式',
        placeholder: 'g 3 或 n MySSID',
        help: '使用 "g 数量" 生成随机 SSID，或用 "n 名称" 指定 SSID'
      },
      { command: 'list -s', description: '查看生成的 SSID' },
      { command: 'attack -t beacon -l', description: '执行列表信标攻击' }
    ]
  },
  {
    id: 'ap-clone-spam',
    name: 'AP 克隆骚扰',
    description: '克隆附近 AP 并以稍作修改的名称广播。',
    steps: [
      { command: 'scanap', description: '扫描接入点' },
      { command: 'list -a', description: '列出可用接入点' },
      {
        command: 'select -a {targets}',
        description: '选择目标接入点',
        requiresInput: true,
        inputLabel: '目标 AP 索引（逗号分隔）',
        placeholder: '0,1,2'
      },
      { command: 'list -a', description: '确认所选接入点' },
      { command: 'attack -t beacon -a', description: '执行克隆信标骚扰' }
    ]
  },
  {
    id: 'deauth-flood',
    name: '去认证洪泛',
    description: '向所选 AP 的全部客户端广播去认证帧。',
    steps: [
      { command: 'scanap', description: '扫描接入点' },
      { command: 'list -a', description: '列出可用接入点' },
      {
        command: 'select -a {targets}',
        description: '选择目标接入点',
        requiresInput: true,
        inputLabel: '目标 AP 索引（逗号分隔）',
        placeholder: '0,1'
      },
      { command: 'list -a', description: '确认所选接入点' },
      { command: 'attack -t deauth', description: '执行去认证洪泛攻击' }
    ]
  },
  {
    id: 'targeted-deauth',
    name: '定向去认证',
    description: '针对连接至所选 AP 的特定终端。',
    steps: [
      { command: 'scanap', description: '扫描接入点' },
      { command: 'list -a', description: '列出可用接入点' },
      {
        command: 'select -a {apTargets}',
        description: '选择目标接入点',
        requiresInput: true,
        inputLabel: '目标 AP 索引（逗号分隔）',
        placeholder: '0,1'
      },
      { command: 'list -a', description: '确认所选接入点' },
      { command: 'scansta', description: '扫描终端' },
      { command: 'list -c', description: '列出可用终端' },
      {
        command: 'select -c {staTargets}',
        description: '选择目标终端',
        requiresInput: true,
        inputLabel: '目标终端索引（逗号分隔）',
        placeholder: '0,12'
      },
      { command: 'list -c', description: '确认所选终端' },
      { command: 'attack -t deauth -c', description: '执行定向去认证' }
    ]
  },
  {
    id: 'manual-deauth',
    name: '手动去认证',
    description: '自定义去认证帧的源地址与目标地址。',
    steps: [
      {
        command: 'attack -t deauth -s {source} -d {dest}',
        description: '执行手动去认证攻击',
        requiresInput: true,
        inputLabel: '源 MAC',
        placeholder: '00:00:00:00:00:00',
        requiresSecondInput: true,
        secondInputLabel: '目标 MAC',
        secondPlaceholder: 'ff:ff:ff:ff:ff:ff'
      }
    ]
  },
  {
    id: 'signal-monitor',
    name: '信号监测',
    description: '监控所选接入点的信号强度。',
    steps: [
      { command: 'scanap', description: '扫描接入点' },
      { command: 'list -a', description: '列出可用接入点' },
      {
        command: 'select -a {targets}',
        description: '选择目标接入点',
        requiresInput: true,
        inputLabel: '目标 AP 索引（逗号分隔）',
        placeholder: '0,1'
      },
      { command: 'list -a', description: '确认所选接入点' },
      { command: 'sigmon', description: '启动信号监测' }
    ]
  }
]

const openWorkflow = (workflow) => {
  console.log('正在打开工作流：', workflow) // 调试日志
  selectedWorkflow.value = workflow
}

const executeWorkflow = async (commands) => {
  console.log('执行命令序列：', commands) // 调试日志
  for (const command of commands) {
    await serialConnection.sendCommand(command)
    // 命令之间留出短暂间隔
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  selectedWorkflow.value = null
}

const handleConnect = async () => {
  console.log('尝试连接...')
  try {
    await serialConnection.connect()
  } catch (error) {
    console.error('连接错误：', error)
  }
}

const handleDisconnect = async () => {
  console.log('尝试断开...')
  try {
    await serialConnection.disconnect()
  } catch (error) {
    console.error('断开错误：', error)
  }
}

const sendCommand = async (cmd) => {
  try {
    await serialConnection.sendCommand(cmd)
  } catch (error) {
    console.error('命令错误：', error)
  }
}

const toggleDemoMode = () => {
  isDemoMode.value = !isDemoMode.value

  serialConnection.isDemoMode = isDemoMode.value
  if (isDemoMode.value) {
    // 初始化演示数据
    serialConnection.terminalOutput.value = generateDemoTerminalOutput()
  } else {
    // 清空演示数据
    clearInterval(demoUpdateInterval.value)
    serialConnection.terminalOutput.value = []
  }
}

// 组件卸载时清理
onUnmounted(() => {
  if (demoUpdateInterval.value) {
    clearInterval(demoUpdateInterval.value)
  }
})
</script>

<style>
.workflow-dialog {
  z-index: 9999;
}
</style>
