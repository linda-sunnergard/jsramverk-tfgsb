const database = require('../db/database.js');

const tickets = {
    getTickets: async function getTickets(req, res){ //req never used?
        const db = await database.openDb();
        const allTickets = await db.collection('tickets').find({}).toArray();

        // await db.client.close();
        // console.log(allTickets);
        return res.json({
            data: allTickets
        });
    },

    createTicket: async function createTicket(req, res){
        const db = await database.openDb();

        const doc = {
            code: req.body.code,
            trainnumber: req.body.trainnumber,
            traindate: req.body.traindate
        };

        const result = await db.collection('tickets').insertOne(doc);

        // console.log(result.insertedId)
        return res.json({
            data: {
                id: result.insertedId,
                code: req.body.code,
                trainnumber: req.body.trainnumber,
                traindate: req.body.traindate,
            }
        });
    }
};

module.exports = tickets;
