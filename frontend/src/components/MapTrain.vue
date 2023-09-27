<script setup>
import { io } from "socket.io-client";
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import { onMounted } from 'vue';

onMounted(() => {
    const socket = io("http://localhost:1337");
    const map = L.map('map').setView([62.173276, 14.942265], 5);


    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let markers = {};

        socket.on("message", (data) => {
            if (markers.hasOwnProperty(data.trainnumber)) {
                let marker = markers[data.trainnumber]

                marker.setLatLng(data.position);
            } else {
                let marker = L.marker(data.position).bindPopup(data.trainnumber).addTo(map);

                markers[data.trainnumber] = marker
            }
            
        });
})

</script>

<template>
    <div ref="map" id="map" class="map">Loading...</div>
</template>

