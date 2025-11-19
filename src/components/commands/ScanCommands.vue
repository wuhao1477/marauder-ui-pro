<template>
    <div class="command-group">
      <div class="grid grid-cols-2 gap-3">
        <button @click="emitCommand('scanap')" class="command-btn">
          扫描 AP
        </button>
        <button @click="emitCommand('scansta')" class="command-btn">
          扫描终端
        </button>
        <button @click="emitCommand('stopscan')" class="command-btn bg-red-500 hover:bg-red-600">
          停止扫描
        </button>
        <button @click="emitCommand('wardrive -s')" class="command-btn">
          Wardrive
        </button>
      </div>
    </div>
  </template>

  <script setup>
  const emit = defineEmits(['command-built'])

  const emitCommand = (command) => {
    emit('command-built', command)
  }
  </script>
