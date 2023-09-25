<script setup>
// import Trains from '../components/Trains.vue'
import MapTrain from '../components/MapTrain.vue'

import { defineAsyncComponent } from 'vue'

const Trains = defineAsyncComponent(() =>
  import('../components/Trains.vue')
)
</script>

<template>
  <main>
    <div class="container">
      <Suspense>
        <Trains />
      </Suspense>
      <MapTrain />
  </div>
  </main>
</template>
