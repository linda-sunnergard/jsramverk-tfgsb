<script setup>
import TrainsComponent from '../components/TrainsComponent.vue'
import MapTrain from '../components/MapTrain.vue'
import { io } from "socket.io-client";
import { provide, ref } from 'vue';

const socketIo = import.meta.env.VITE_BACKEND;
const socket = ref(io(socketIo));
provide('socket', socket)


</script>

<template>
    <main>
        <div class="container">
            <TrainsComponent />
            <MapTrain />
        </div>
    </main>
</template>
