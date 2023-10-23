<script setup>
import 'leaflet/dist/leaflet.css';

import L, { marker } from "leaflet";
import { onMounted, ref, inject, watch } from 'vue';

const zoom = ref(5);
const {changeMap, updateChangeMap} = inject('changeMap');
const socket = inject('socketIo');

const mapIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    // shadowSize: [68, 95],
    // shadowAnchor: [22, 94]
});

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

let markers = {};

onMounted(() => {
    const socket = inject('socketIo');
    const map = L.map('map').setView([62.173276, 14.942265], 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

    let markers = {};

    socket.on("message", (data) => {
        let icon = data.delayed ? delayedIcon : standardIcon
        if (changeMap.value == false || data.delayed == true) {
            if (markers.hasOwnProperty(data.trainnumber)) {
                let marker = markers[data.trainnumber]

                marker.setLatLng(data.position);
            } else {
                let marker = L.marker(data.position, {icon: icon}).bindPopup(data.trainnumber).addTo(map);

                markers[data.trainnumber] = marker
            }
        }
    });

    watch(changeMap, () => {
        for (let trainNumber in markers) {
            let marker = markers[trainNumber]

            marker.removeFrom(map)
            delete markers[trainNumber]
        };
    }, { immediate: true });
    
})
</script>

<template>
    <!-- <div ref="map" id="map" class="map">Loading...</div> */ -->
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