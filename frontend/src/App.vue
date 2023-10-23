<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { provide, ref } from 'vue'
import { io } from 'socket.io-client';

const backendServer = import.meta.env.VITE_BACKEND;

const currentTicket = ref({});

function updateCurrentTicket(newTicket) {
  currentTicket.value = newTicket
}

provide('currentTicket', {
  currentTicket,
  updateCurrentTicket
})

const currentTrainRef = ref({});

function updateCurrentTrainRef(newTicket) {
  currentTrainRef.value = newTicket
}

provide('currentTrainRef', {
  currentTrainRef,
  updateCurrentTrainRef
})

provide('socketIo', io(backendServer))

const changeMap = ref(false);

function updateChangeMap(newFlag) {
  changeMap.value = newFlag
}

provide('changeMap', {
  changeMap,
  updateChangeMap
})

</script>

<template>
  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
