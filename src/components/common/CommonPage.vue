<template>
  <PageHeader :title="title"></PageHeader>
  <div class="mt-16 p-3">
    <slot name="main"></slot>
  </div>
</template>

<script setup lang="ts">
import PageHeader from './PageHeader.vue'

const props = defineProps<{
  title: string
}>()
</script>

<style lang="scss"></style>
