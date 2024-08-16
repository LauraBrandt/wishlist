<template>
  <div class="header-container">
    <h1 class="title">Wish Lists</h1>
  </div>
</template>

<style scoped>
.header-container {
  background-color: var(--lb-c-cream);
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.title {
  font-size: 2rem;
  font-family: var(--title-font);
}

@media only screen and (max-width: 950px) {
  .title {
    font-size: 1.5rem;
  }
}
</style>