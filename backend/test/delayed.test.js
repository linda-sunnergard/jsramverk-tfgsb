require('jest-fetch-mock').enableMocks();
const delayed = require('../models/delayed.js');

const mockResponse = {
    json: jest.fn(),
  };

test ('Get Delayed Trains', async () => {
    fetch.mockResponseOnce(JSON.stringify(
        {
            RESPONSE: {
                RESULT: [
                    {
                        TrainAnnouncement: 'delayed'
                    },
                ],
            },
        }));

    let reponse = await delayed.getDelayedTrains({}, mockResponse);

    expect(fetch.mock.calls[0][0]).toEqual('https://api.trafikinfo.trafikverket.se/v2/data.json');
    expect(fetch.mock.calls.length).toEqual(1);

    expect(mockResponse.json.mock.calls[0][0].data).toBe('delayed');

});