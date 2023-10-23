import database from '../db/database.js';
const tickets = require('../models/tickets.js');

jest.mock('../db/database.js');

const findResponse = {
    toArray: jest.fn().mockReturnValue(['allTickets']),
};

const collectionResponse = {
    find: jest.fn().mockReturnValue(findResponse),
    insertOne: jest.fn().mockResolvedValue({insertedId: '000'}),
};

const dbConnection = {
    collection: jest.fn().mockReturnValue(collectionResponse),
};

test('Get A Ticket', async () => {
    database.openDb.mockResolvedValue(dbConnection);

    const result = await tickets.getTickets();

    expect(database.openDb).toHaveBeenCalledTimes(1);
    expect(dbConnection.collection).toHaveBeenCalledTimes(1);
    expect(collectionResponse.find).toHaveBeenCalledTimes(1);
    expect(result).toEqual(['allTickets']);

});

test('Create A Ticket', async () => {
    database.openDb.mockResolvedValue(dbConnection);

    const result = await tickets.createTicket("222", 455, "yesterday");

    expect(database.openDb).toHaveBeenCalledTimes(1);
    expect(collectionResponse.insertOne).toHaveBeenCalledTimes(1);
    expect(result).toStrictEqual({
        code: "222",
        traindate: "yesterday",
        trainnumber: 455,
        _id: "000"
    });

});

// https://jestjs.io/docs/mock-functions
// https://jestjs.io/docs/mock-function-api
// https://jestjs.io/docs/expect