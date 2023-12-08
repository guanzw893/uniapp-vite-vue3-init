<template>
  <!-- 直接从 store 中访问 state -->
  <div>Current Count: {{ counter.count }}</div>
  <button @click="counter.increment">+1</button>
  <button @click="counter.$patch({ count: counter.count + 1 })">+1</button>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
const counter = useCounterStore()
</script>
