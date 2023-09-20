const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.ATLAS_USERNAME}:${process.env.ATLAS_PASSWORD}@jsramverk-tfgsb.u5erkz3.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        monitorCommands: true,
    }
});

const database = {
    client: client,

    openDb: async function openDb() {
        // select correct database
        let dbName = `main`;

        if (process.env.NODE_ENV === 'test') {
            dbName = "test";
        }

        // console.log(client);

        return await client.db(dbName);
    }
};

module.exports = database;
