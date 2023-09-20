require('jest-fetch-mock').enableMocks();
const codes = require('../models/codes.js');

const mockResponse = {
    json: jest.fn(),
  };

test ('Get codes', async () => {
    fetch.mockResponseOnce(JSON.stringify(
        {
            RESPONSE: {
                RESULT: [
                    {
                        ReasonCode: '123456789'
                    },
                ],
            },
        }));

    await codes.getCodes({}, mockResponse);

    expect(fetch.mock.calls[0][0]).toEqual('https://api.trafikinfo.trafikverket.se/v2/data.json');
    expect(fetch.mock.calls.length).toEqual(1);

    expect(mockResponse.json.mock.calls[0][0].data).toBe('123456789');
});