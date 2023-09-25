<script setup>
    import api from '../models/ApiModel.js';
    import utils from '../models/Utils.js';
    const delayedTrains = await api.delayed();
    // console.log(delayedTrains);
    function ticketHref(train) {
        utils.trainHolder = train;
        location.href = "/ticket";
    };
</script>

<template>
    <div class="delayed">
        <h1>Försenade tåg</h1>

        <div id="delayed-trains" class="delayed-trains" v-for="item in delayedTrains">
            {{ console.log(item) }}
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