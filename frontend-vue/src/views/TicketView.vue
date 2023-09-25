<script setup>
    import api from '../models/ApiModel.js';
    import utils from '../models/Utils.js';
    // const trainNumber = $router.params.trainNumber;
    // const trains = api.delayed();
    // const train = trains.forEach((train) => {
    //    if (train.OperationalTrainNumber === trainNumber) {
    //        return train;
    //    }
    //});
    const train = utils.trainHolder;
    const tickets = api.getTickets();
    const ticketCount = tickets.length;
</script>

<template>
    <div class="ticket-container">
        <div class="ticket">
            <a href="" id="back">&lt- Tillbaka</a>
            <h1>Nytt ärende #{{ ticketCount + 1 }}</h1>
            {{ train.FromLocation ? "<h3>Tåg från " + train.FromLocation[0].LocationName + " till " + train.ToLocation[0].LocationName + ". Just nu i " + train.LocationSignature + ".</h3>" : "" }}
            <p><strong>Försenad:</strong> {{ utils.outputDelay(train) }}</p>
            <form id="new-ticket-form">
                <label>Orsakskod</label><br>
                <select id="reason-code"></select><br><br>
                <input type="submit" value="Skapa nytt ärende" />
            </form>
        </div>
        <br>
        <div class="old-tickets" id="old-tickets">
            <h2>Befintliga ärenden</h2>
            <div v-for="ticket in tickets">
                <div>{{ ticket.traindate }} - {{ ticket.code }} - {{ ticket.trainnumber }} - {{ ticket._id }}</div>
            </div>
        </div>
    </div>
</template>

<style>

</style>
