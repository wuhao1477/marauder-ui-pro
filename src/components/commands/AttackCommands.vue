<template>
    <div class="command-group">
      <div class="space-y-3">
        <select v-model="attackType" class="input-field">
          <option value="">选择攻击类型</option>
          <option value="deauth">去认证</option>
          <option value="probe">探测</option>
          <option value="rickroll">Rickroll</option>
        </select>

        <div v-if="attackType === 'deauth'" class="space-y-2">
          <input v-model="timeout" type="number" class="input-field" placeholder="超时时间（秒）">
        </div>

        <button
          @click="buildAttackCommand"
          class="command-btn w-full"
          :disabled="!attackType"
        >
          发动攻击
        </button>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue'

  const emit = defineEmits(['command-built'])
  const attackType = ref('')
  const timeout = ref('')

  const buildAttackCommand = () => {
    if (!attackType.value) return

    let cmd = `attack -t ${attackType.value}`
    if (attackType.value === 'deauth' && timeout.value) {
      cmd += ` -d ${timeout.value}`
    }
    emit('command-built', cmd)
  }
  </script>
