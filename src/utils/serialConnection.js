import { ref, computed } from 'vue'
import { generateDemoData } from './demoData'

// 创建单例实例
const port = ref(null)
const reader = ref(null)
const isConnected = ref(false)
const terminalOutput = ref([])
const isDemoMode = ref(false)
let buffer = ''

export const useSerialConnection = () => {
  const connect = async () => {
    console.log('开始执行连接逻辑')
    try {
      if (!navigator.serial) {
        console.error('当前环境不支持 Web Serial API')
        throw new Error('该浏览器不支持 Web Serial API')
      }

      console.log('正在请求串口访问权限...')
      port.value = await navigator.serial.requestPort()
      console.log('已选择串口:', port.value)

      console.log('正在打开串口...')
      await port.value.open({ baudRate: 115200 })
      console.log('串口打开成功')

      isConnected.value = true
      addToTerminal('✓ 已连接串口', 'success')
      startReading()
    } catch (error) {
      console.error('连接错误：', error)
      isConnected.value = false
      addToTerminal(`✗ 连接失败：${error.message}`, 'error')
      throw error
    }
  }

  const disconnect = async () => {
    if (port.value) {
      try {
        if (reader.value) {
          await reader.value.cancel()
        }
        await port.value.close()
        port.value = null
        reader.value = null
        isConnected.value = false
        addToTerminal('✗ 已断开串口连接', 'error')
      } catch (error) {
        console.error('断开错误：', error)
        addToTerminal(`✗ 断开时出现错误：${error.message}`, 'error')
      }
    }
  }

  const startReading = async () => {
    while (port.value && port.value.readable) {
      try {
        const textDecoder = new TextDecoderStream()
        const readableStreamClosed = port.value.readable.pipeTo(textDecoder.writable)
        reader.value = textDecoder.readable.getReader()

        try {
          while (true) {
            const { value, done } = await reader.value.read()
            if (done) break

            if (value) {
              // 累加缓冲区并处理完整行
              buffer += value
              const lines = buffer.split('\n')
              buffer = lines.pop() // 保留最后一行未完成内容

              // 处理完整行
              lines.forEach(line => {
                if (line.trim()) {
                  addToTerminal(line.trim())
                }
              })
            }
          }
        } catch (error) {
          console.error('读取错误：', error)
        } finally {
          if (reader.value) {
            reader.value.releaseLock()
          }
        }
      } catch (error) {
        addToTerminal(`✗ 读取错误：${error.message}`, 'error')
        break
      }
    }
  }

  const sendCommand = async (command) => {
    console.log(isDemoMode.value)
    if (isDemoMode.value) {
      // 处理演示模式命令
      addToTerminal(`> ${command}`, 'command')

      // 根据命令模拟响应
      switch (command) {
        case 'scanap':
          addToTerminal('正在扫描 AP，使用 stopscan 可终止')
          setTimeout(() => {
            generateDemoData().forEach(ap => {
              addToTerminal(`RSSI: ${ap.rssi} Ch: ${ap.channel} BSSID: ${ap.bssid} ESSID: ${ap.essid}`)
            })
          }, 500)
          break
        case 'list -a':
          generateDemoData().forEach(ap => {
            addToTerminal(`[${ap.index}][CH:${ap.channel}] ${ap.essid}${ap.isSelected ? ' (selected)' : ''}`)
          })
          break
        case 'stopscan':
          addToTerminal('正在停止所有扫描...')
          break
        default:
          addToTerminal(`执行：${command}`)
      }
      return
    }

    if (!command || !port.value) {
      addToTerminal('✗ 未连接或无命令可执行', 'error')
      return
    }

    try {
      const writer = port.value.writable.getWriter()
      const encoder = new TextEncoder()
      const data = encoder.encode(command + '\n')
      await writer.write(data)
      addToTerminal(`> ${command}`, 'command')
      writer.releaseLock()
    } catch (error) {
      console.error('发送错误：', error)
      addToTerminal(`✗ 发送命令失败：${error.message}`, 'error')
    }
  }

  const addToTerminal = (text, type = 'normal') => {
    console.log('写入终端：', text, type) // 调试日志
    if (text.trim()) {
      const lineClass = getTypeClass(type)
      terminalOutput.value = [...terminalOutput.value, `<span class="${lineClass}">${text}</span>`]

      // 仅保留最近 1000 行
      if (terminalOutput.value.length > 1000) {
        terminalOutput.value = terminalOutput.value.slice(-1000)
      }
    }
  }

  const getTypeClass = (type) => {
    const classes = {
      normal: 'text-green-400',
      success: 'text-blue-400',
      error: 'text-red-500',
      command: 'text-yellow-400'
    }
    return classes[type] || classes.normal
  }

  return {
    isConnected: computed(() => isConnected.value), // 暴露响应式连接状态
    isDemoMode,
    terminalOutput,
    connect,
    disconnect,
    sendCommand
  }
}