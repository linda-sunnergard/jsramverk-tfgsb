<script setup>
import 'leaflet/dist/leaflet.css';
import L from "leaflet";
import { onMounted, ref, inject } from 'vue';

const socket = inject('socket').value;
const zoom = ref(5);
const {currentTrainRef} = inject('currentTrainRef');

const standardIcon = L.divIcon({
    html: '<div class="map-marker-standard"></div>',
    className: 'map-marker',
    iconSize: [26, 26],
    iconAnchor: [12, 26],
})
const delayedIcon = L.divIcon({
    html: '<div class="map-marker-delayed"></div>',
    className: 'map-marker',
    iconSize: [26, 26],
    iconAnchor: [12, 26],
})

onMounted(() => {
    const map = L.map('map').setView([62.173276, 14.942265], 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);


    let markers = {};

    socket.on("message", (data) => {
        let icon = data.delayed ? delayedIcon : standardIcon
        if (currentTrainRef.value.OperationalTrainNumber == data.trainnumber) {
            if (Object.hasOwn(markers, data.trainnumber)) {
                let marker = markers[data.trainnumber]

                marker.setLatLng(data.position);
            } else {
                let marker = L.marker(data.position, {icon: icon}).bindPopup(data.trainnumber).addTo(map);

                markers[data.trainnumber] = marker
            }
        }
    });
    
})
</script>

<template>
    <l-map class="map" id="map" ref="map" v-model:zoom="zoom" :center="[62.173276, 14.942265]">

    </l-map>
</template>

<style scoped>
#map >>> .map-marker-standard {
  position: absolute;
  vertical-align: bottom;
  
  border-radius: 50% 50% 50% 0;
  border: 4px solid #2B82CB;
  width: 100%;
  height: 100%;
  transform: rotate(-45deg);
}

#map >>> .map-marker-delayed {
  position: absolute;
  vertical-align: bottom;
  
  border-radius: 50% 50% 50% 0;
  border: 4px solid #c2543e;
  width: 100%;
  height: 100%;
  transform: rotate(-45deg);
}
</style>