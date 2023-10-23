<script setup>
import Trains from '../components/Trains.vue'
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
            <Trains />
            <MapTrain />
        </div>
    </main>
</template>
