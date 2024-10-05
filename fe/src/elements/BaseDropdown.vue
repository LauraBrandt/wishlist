<script setup>
import { ref } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    validator: value => value.every(item => !!item.text && typeof item.text === 'string' && !!item.action && typeof item.action === 'function'),
  },
})

const isActive = ref(false)

function toggle() {
  isActive.value = !isActive.value
}

function itemClicked(item) {
  item.action()
  isActive.value = false
}
</script>

<template>
  <div class="dropdown">
    <a
      ref="trigger"
      class="dropdown-trigger"
      aria-haspopup="true"
      @click="toggle"
    >
      <slot name="trigger" :active="isActive"/>
    </a>
    <div v-if="isActive" class="dropdown-content">
      <a
        v-for="item in items"
        :key="item.text"
        class="dropdown-item"
        @click="itemClicked(item)"
      >
        {{ item.text }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
}

.dropdown-content {
  position: absolute;
  right: 0;
  top: 2rem;
  background-color: var(--color-background);
  min-width: 200px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  border-radius: 2px;
  z-index: 10;
  padding: 0.5rem 0;
}

.dropdown-item {
  display: block;
  color: var(--color-text);
  text-decoration: none;
  padding: 0.25rem 1rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #ddd;
}
</style>
