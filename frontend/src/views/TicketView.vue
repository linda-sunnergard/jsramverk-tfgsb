<script setup>
    import TicketComponent from '../components/TicketComponent.vue';
    import SingleMapTrain from '../components/SingleMapTrain.vue'
    import { io } from "socket.io-client";
    import { provide, ref } from 'vue';

    const socketIo = import.meta.env.VITE_BACKEND;
    const socket = ref(io(socketIo));
    provide('socket', socket)
</script>

<template>
    <main>
        <div class="container">
            <TicketComponent />
            <SingleMapTrain />
        </div>
    </main>
</template>

<style>

</style>
