<script setup>
import { onMounted, onBeforeUnmount } from 'vue'

const active = defineModel('active')

defineProps({
  title: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
})

const emit = defineEmits(['update:active'])

function close() {
  emit('update:active', false)
}

function keyPress({ key }) {
  if (active.value && (key === 'Escape' || key === 'Esc')) {
    this.close()
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
      document.addEventListener('keyup', keyPress)
  }
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined') {
    document.removeEventListener('keyup', keyPress)
  }
})
</script>

<template>
  <div
    v-show="active"
    class="modal is-active"
    tabindex="-1"
    role="dialog"
    :aria-label="ariaLabel"
    aria-modal
  >
    <div
      class="modal-background"
      @click="close"
    />
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title" v-if="title">{{ title }}</p>
        <button
          type="button"
          class="modal-close"
          aria-label="close"
          @click="close"
        />
      </header>
      <section class="modal-card-body">
        <slot />
      </section>
      <footer class="modal-card-foot">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<style scoped>
.modal {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 40;
  position: fixed;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.modal-background {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: absolute;
  background-color: hsla(221, 14%, 4%, 0.8);
}

.modal-card {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - 2.5rem);
  width: 500px;
  overflow: hidden;
  position: relative;
}

.modal-card-head {
  background-color: var(--color-background);
  border-start-start-radius: 0.75rem;
  border-start-end-radius: 0.75rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 1.5rem;
  position: relative;
}

.modal-card-title {
  flex-grow: 1;
  flex-shrink: 0;
  font-size: 1.25rem;
  font-family: var(--header-font);
  font-weight: 600;
  line-height: 1;
}

.modal-close {
  appearance: none;
  background-color: hsla(221, 14%, 0%, 0.5);
  border: none;
  border-radius: 9999px;
  cursor: pointer;
  display: inline-flex;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: 1em;
  pointer-events: auto;
  height: 1.25rem;
  width: 1.25rem;
  max-height: 1.25rem;
  max-width: 1.25rem;
  min-height: 1.25rem;
  min-width: 1.25rem;
  position: relative;
  vertical-align: top;
  outline: none;
}

.modal-close::before, .modal-close::after {
  background-color: hsl(221, 14%, 100%);
  content: "";
  display: block;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-50%) rotate(45deg);
  transform-origin: center center;
}

.modal-close::before {
  height: 2px;
  width: 50%;
}

.modal-close::after {
  height: 50%;
  width: 2px;
}

.modal-close:hover, .modal-close:focus {
  background-color: hsla(221, 14%, 0%, 0.4);
}

.modal-close:active {
  background-color: hsla(221, 14%, 0%, 0.5);
}

.modal-card-body {
  background-color: var(--color-background);
  -webkit-overflow-scrolling: touch;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: auto;
  padding: 0 2rem;
}

.modal-card-foot {
  background-color: var(--color-background);
  border-end-start-radius: 0.75rem;
  border-end-end-radius: 0.75rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  position: relative;
}

@media only screen and (max-width: 950px) {
  .modal-card {
    width: calc(100vw - 3rem)
  }

  .modal-card-head {
    padding: 1.5rem 1.25rem;
  }

  .modal-card-body {
    padding: 0 1.25rem;
  }

  .modal-card-foot {
    padding: 1.5rem 1.25rem;
  }
}
</style>
