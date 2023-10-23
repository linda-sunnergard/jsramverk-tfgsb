<script setup>
import { io } from "socket.io-client";
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import { onMounted, ref, inject } from 'vue';

const zoom = ref(5);

const mapIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
});

onMounted(() => {
    const socket = inject('socketIo');
    const map = L.map('map').setView([62.173276, 14.942265], 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let markers = {};

        socket.on("mapUpdate", (data) => {
            if (markers.hasOwnProperty(data.trainnumber)) {
                let marker = markers[data.trainnumber]

                marker.setLatLng(data.position);
            } else {
                let marker = L.marker(data.position, {icon: mapIcon}).bindPopup(data.trainnumber).addTo(map);

                markers[data.trainnumber] = marker
            }
            
        });
})
</script>

<template>
    <!-- <div ref="map" id="map" class="map">Loading...</div> */ -->
    <l-map class="map" id="map" ref="map" v-model:zoom="zoom" :center="[62.173276, 14.942265]">

    </l-map>
</template>
