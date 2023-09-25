import database from '../db/database.js';
const tickets = require('../models/tickets.js');

jest.mock('../db/database.js');

const findResponse = {
    toArray: jest.fn().mockReturnValue(['allTickets']),
};

const collectionResponse = {
    find: jest.fn().mockReturnValue(findResponse),
    insertOne: jest.fn().mockResolvedValue({insertedId: '000'}),
}

const dbConnection = {
    collection: jest.fn().mockReturnValue(collectionResponse),
}; 

const mockResponse = {
    json: jest.fn(),
  };

const mockRequest = {
    body: {
        code: '123',
        trainnumber: '456',
        traindate: 'today',
    },
};

test('Get A Ticket', async () => {
    database.openDb.mockResolvedValue(dbConnection);

    await tickets.getTickets({}, mockResponse);

    expect(database.openDb).toHaveBeenCalledTimes(1);
    expect(dbConnection.collection).toHaveBeenCalledTimes(1);
    expect(collectionResponse.find).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json.mock.calls[0][0].data).toEqual(['allTickets']);

});

test('Create A Ticket', async () => {
    database.openDb.mockResolvedValue(dbConnection);

    await tickets.createTicket(mockRequest, mockResponse);

    expect(database.openDb).toHaveBeenCalledTimes(1);
    expect(collectionResponse.insertOne).toHaveBeenCalledTimes(1);
    expect(collectionResponse.insertOne.mock.calls[0][0].code).toBe('123');
    expect(collectionResponse.insertOne.mock.calls[0][0].trainnumber).toBe('456');
    expect(collectionResponse.insertOne.mock.calls[0][0].traindate).toBe('today');
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json.mock.calls[0][0].data.id).toBe('000');
    expect(mockResponse.json.mock.calls[0][0].data.code).toBe('123');
    expect(mockResponse.json.mock.calls[0][0].data.trainnumber).toBe('456');
    expect(mockResponse.json.mock.calls[0][0].data.traindate).toBe('today');

});

// https://jestjs.io/docs/mock-functions
// https://jestjs.io/docs/mock-function-api
// https://jestjs.io/docs/expect