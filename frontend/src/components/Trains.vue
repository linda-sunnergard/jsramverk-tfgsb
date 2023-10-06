<script setup>
    import api from '../models/ApiModel.js';
    import utils from '../models/Utils.js';
    import { useRouter } from 'vue-router';
    import { inject } from 'vue';

    const {currentTrainRef, updateCurrentTrainRef} = inject('currentTrainRef');
    const delayedTrains = await api.delayed();
    const router= useRouter();

    function ticketHref(train) {
        updateCurrentTrainRef(train)
        console.log(currentTrainRef);
        router.push({path: "/ticket/"});
    };
</script>

<template>
    <div class="delayed">
        <h1>Försenade tåg</h1>

        <div id="delayed-trains" class="delayed-trains" v-for="item in delayedTrains">
            <div @click="ticketHref(item)">
                <div class="train-number">
                    {{ item.OperationalTrainNumber }}
                </div>
                <div class="current-station">
                    <div>{{ item.LocationSignature }}</div>
                    <div>{{ item.FromLocation ? item.FromLocation[0].LocationName + " -> " : "" }} {{ item.ToLocation ? item.ToLocation[0].LocationName : "" }}</div>
                </div>
                <div class="delay">
                    {{ utils.outputDelay(item) }}
                </div>
            </div>
        </div>
    </div>
</template>