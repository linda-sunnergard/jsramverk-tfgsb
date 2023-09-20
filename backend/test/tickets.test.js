import database from '../db/database.js'
const tickets = require('../models/tickets.js')

jest.mock('../db/database.js'); // Mock our database

const dbConnection = {
    all: jest.fn().mockResolvedValue('tickets'),
    run: jest.fn().mockResolvedValue({lastID: '000'}),
    close: jest.fn().mockName('close'),
}; // Mock the database connection and it's built in functions

const mockResponse = {
    json: jest.fn(),
  }; // Mock the response sent in and out

const mockRequest = {
    body: {
        code: '123',
        trainnumber: '456',
        traindate: 'today',
    },
}; // Mock the request being sent into createTicket

test('Get A Ticket', async () => {
    database.openDb.mockResolvedValue(dbConnection);

    await tickets.getTickets({}, mockResponse);

    expect(database.openDb).toHaveBeenCalledTimes(1);
    expect(dbConnection.all).toHaveBeenCalledTimes(1);
    expect(dbConnection.close).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json.mock.calls[0][0].data).toBe('tickets');

});

test('Create A Ticket', async () => {
    database.openDb.mockResolvedValue(dbConnection);

    await tickets.createTicket(mockRequest, mockResponse);

    expect(database.openDb).toHaveBeenCalledTimes(1);
    expect(dbConnection.run).toHaveBeenCalledTimes(1);
    expect(dbConnection.close).toHaveBeenCalledTimes(1);
    expect(mockResponse.json).toHaveBeenCalledTimes(1);
    expect(mockResponse.json.mock.calls[0][0].data.id).toBe('000');
    expect(mockResponse.json.mock.calls[0][0].data.code).toBe('123');
    expect(mockResponse.json.mock.calls[0][0].data.trainnumber).toBe('456');
    expect(mockResponse.json.mock.calls[0][0].data.traindate).toBe('today');

});

// https://jestjs.io/docs/mock-functions
// https://jestjs.io/docs/mock-function-api
// https://jestjs.io/docs/expect