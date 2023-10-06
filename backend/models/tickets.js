const { ObjectId } = require('mongodb');
const database = require('../db/database.js');

const tickets = {
    getTickets: async function getTickets(req, res){
        const db = await database.openDb();
        const allTickets = await db.collection('tickets').find({}).toArray();

        // await db.client.close();
        // console.log(allTickets);
        return res.json({
            data: allTickets
        });
    },

    // getTicket: async function getTicket(req, res){
    //     const db = await database.openDb();
    //     const ticket = await db.collection('tickets').findOne({
    //         _id : ObjectId(req.params.ticketId)
    //     }).toArray();

    //     // await db.client.close();
    //     return res.json({
    //         data: allTickets
    //     });
    // },

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
    },

    updateTicket: async function updateTicket(req, res){
        const db = await database.openDb();
        console.log("attempting to update ticket: " + req.params.ticketId)
        const result = await db.collection('tickets').updateOne(
            { _id : new ObjectId(req.params.ticketId) },
            { $set : {
                code: req.body.code,
            }}
        );

        return res.json({
            result: result
        });
    }
};

module.exports = tickets;
