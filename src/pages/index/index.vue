<template>
  <!-- 直接从 store 中访问 state -->
  <div>Current Count: {{ counter.count }}</div>
  <div>Current DoubleCount: {{ counter.doubleCount }}</div>
  <uv-button type="primary" @click="counter.increment">+1</uv-button>
  <uv-button
    type="primary"
    @click="counter.$patch({ count: counter.count + 1 })"
    >+1</uv-button
  >
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
</script>
