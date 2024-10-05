<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../stores/auth'
import BaseButton from '../elements/BaseButton.vue'
import BaseDropdown from '../elements/BaseDropdown.vue'
import BaseModal from '../elements/BaseModal.vue'

const authStore = useAuthStore()
const { isLoggedIn, firebaseUser } = storeToRefs(authStore)
const { changeDisplayName, logout } = authStore

const nameModalActive = ref(false)
const displayName = ref('')
function openNameModal() {
  displayName.value = firebaseUser.value?.displayName || ''
  nameModalActive.value = true
}
function saveName() {
  nameModalActive.value = false
  changeDisplayName(displayName.value)
}
</script>

<template>
  <div class="header-container">
    <div class="title-container">
      <router-link to="/" class="title-router">
        <h1 class="title">Wish Lists</h1>
      </router-link>
    </div>
    <div class="button-container">
      <template v-if="isLoggedIn">
        <BaseDropdown
          :items="[
            { text: 'Change Display Name', action: openNameModal },
            { text: 'Sign Out', action: logout },
          ]"
        >
          <template #trigger>
            <BaseButton>
              Account
              <FAIcon :icon="['fas', 'caret-down']" class="trigger-button-icon" />
            </BaseButton>
          </template>
        </BaseDropdown>
      </template>
      <template v-else>
        <router-link to="/login">
          <BaseButton label="Sign in" class="login-button" />
        </router-link>
        <router-link to="/register">
          <BaseButton label="Sign up" />
        </router-link>
      </template>
    </div>
    <BaseModal
      v-model:active="nameModalActive"
      title="Change Display Name"
      aria-label="change display name modal"
    >
      <input v-model="displayName" type="text" class="name-input" />
      <template #footer>
        <div/>
        <BaseButton
          label="Save"
          @click="saveName"
        />
      </template>
    </BaseModal>
  </div>
</template>

<style scoped>
.header-container {
  background-color: var(--lb-c-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border-bottom: 1px solid var(--color-border);
}

.title-container {
  flex: 1;
  text-align: center;
}

.title-router {
  color: black;
  text-decoration: none;
}

.title {
  font-size: 2rem;
  font-family: var(--title-font);
}

.button-container {
  margin-right: 1.5rem;
}

.login-button {
  margin-right: 0.75rem;
}

.trigger-button-icon {
  margin-left: 0.5rem;
}

.name-input {
  display: block;
  margin-top: 0.5rem;
  margin-bottom: 1rem;
  width: 75%;
  font-size: 1rem;
  padding: 0.5rem 0.75rem;
}

@media only screen and (max-width: 950px) {
  .title {
    font-size: 1.5rem;
  }

  .button-container {
    display: none;
  }
}
</style>