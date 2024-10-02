<template>
  <div class="kbd-box">
    <kbd>{{ word }}</kbd>
    <div>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'Kbd',
})
const { word } = defineProps<{ word: string }>()
</script>

<style scoped>
.kbd-box {
  --uno: 'text-center';
}
</style>
