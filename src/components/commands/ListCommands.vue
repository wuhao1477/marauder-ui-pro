<template>
    <div class="command-group">
      <div class="space-y-3">
        <div class="grid grid-cols-2 gap-3">
          <button @click="emitCommand('list -s')" class="command-btn">
            列出终端
          </button>
          <button @click="emitCommand('list -a')" class="command-btn">
            列出 AP
          </button>
          <button @click="emitCommand('list -c')" class="command-btn">
            列出捕获项
          </button>
          <button @click="emitCommand('clearlist -a')" class="command-btn bg-red-500 hover:bg-red-600">
            清空全部
          </button>
        </div>

        <div class="bg-white p-4 rounded-lg border-2 border-black mt-3">
          <h3 class="font-bold mb-2">过滤选项</h3>
          <div class="space-y-3">
            <input v-model="filterText" type="text" class="input-field" placeholder="过滤关键字">
            <select v-model="filterType" class="input-field">
              <option value="a">接入点</option>
              <option value="s">终端</option>
              <option value="c">捕获记录</option>
            </select>
            <button @click="buildFilterCommand" class="command-btn w-full">
              应用过滤
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue'

  const emit = defineEmits(['command-built'])
  const filterText = ref('')
  const filterType = ref('a')

  const emitCommand = (command) => {
    emit('command-built', command)
  }

  const buildFilterCommand = () => {
    if (!filterText.value) return
    const cmd = `select -${filterType.value} -f "${filterText.value}"`
    emit('command-built', cmd)
  }
  </script>
