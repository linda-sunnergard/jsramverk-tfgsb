const { ObjectId } = require('mongodb');
const database = require('../db/database.js');

const tickets = {
    getTickets: async function getTickets(req, res){
        const db = await database.openDb();
        const allTickets = await db.collection('tickets').find({}).toArray();

        // await db.client.close();
        // console.log(allTickets);
        return allTickets;
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

    createTicket: async function createTicket(code, trainnumber, traindate) {
        const db = await database.openDb();

        const doc = {
            code,
            trainnumber,
            traindate
        };

        const result = await db.collection('tickets').insertOne(doc);

        // console.log(result.insertedId)
        return {
                _id: result.insertedId,
                code,
                trainnumber,
                traindate,
        }
    },

    updateTicket: async function updateTicket(ticketId, newCode){
        const db = await database.openDb();
        console.log("attempting to update ticket: " + ticketId)
        const result = await db.collection('tickets').updateOne(
            { _id : new ObjectId(ticketId) },
            { $set : {
                code: newCode,
            }}
        );

        return result
    }
};

module.exports = tickets;
