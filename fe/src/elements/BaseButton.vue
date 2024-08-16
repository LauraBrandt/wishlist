<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  isTextButton: { type: Boolean, default: false },
  isDelete: { type: Boolean, default: false },
  isOutlined: { type: Boolean, default: false },
  isSmall: { type: Boolean, default: false },
  isDisabled: { type: Boolean, default: false },
})

const buttonClass = computed(() => {
  let ret = 'button'
  if (props.isTextButton) {
    ret = 'text-button'
  }
  if (props.isDelete) {
    ret += ' is-delete'
  }
  if (props.isDisabled) {
    ret += ' is-disabled'
  }
  if (props.isOutlined) {
    ret += ' is-outlined'
  }
  if (props.isSmall) {
    ret += ' is-small'
  }
  return ret
})

const emit = defineEmits(['click'])
</script>

<template>
  <button
    :class="buttonClass"
    :disabled="isDisabled"
    :aria-label="label"
    @click="emit('click')"
  >
    <slot>
      {{ label }}
    </slot>
  </button>
</template>

<style scoped>
.button {
  background-color: var(--lb-c-teal);
  color: var(--vt-c-white);
  border: 1px solid var(--lb-c-teal);
  border-radius: 6px;
  padding: 0.25rem 0.75rem;
  cursor: pointer;
  height: 30px;
}

.button:hover {
  background-color: var(--lb-c-teal-hover);
  border-color: var(--lb-c-teal-hover);
}

.button.is-delete {
  background-color: var(--lb-c-red);
  border-color: var(--lb-c-red);
}

.button.is-delete:hover {
  background-color: var(--lb-c-red-hover);
  border-color: var(--lb-c-red-hover);
}

.button.is-outlined {
  background-color: var(--color-background);
  color: var(--lb-c-teal);
}

.button.is-outlined:hover {
  background-color: var(--color-background);
  color: var(--lb-c-teal-hover);
}

.button.is-danger.is-outlined {
  background-color: var(--color-background);
  color: var(--lb-c-red);
}

.button.is-danger.is-outlined:hover {
  background-color: var(--color-background);
  color: var(--lb-c-red-hover);
}

.button.is-small {
  height: auto;
}

.button.is-disabled, .text-button.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-button {
  padding: 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--lb-c-teal);
}

.text-button:hover {
  color: var(--lb-c-teal-hover);
}

.text-button.is-delete {
  color: var(--lb-c-red);
}

.text-button.is-delete:hover {
  color: var(--lb-c-red-hover);
}
</style>
