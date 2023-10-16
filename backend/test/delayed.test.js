require('jest-fetch-mock').enableMocks();
const delayed = require('../models/delayed.js');

const mockResponse = {
    json: jest.fn(),
  };

test ('Get Delayed Trains', async () => {
    const body = `{
        "RESPONSE": {
            "RESULT": [
                {
                    "TrainAnnouncement": [
                        {
                            "ActivityId": "1500adde-095d-334b-08db-bd60fb77a372",
                            "ActivityType": "Avgang",
                            "AdvertisedTimeAtLocation": "2023-10-10T19:06:00.000+02:00",
                            "AdvertisedTrainIdent": "17671",
                            "Canceled": false,
                            "EstimatedTimeAtLocation": "2023-10-10T19:24:00.000+02:00",
                            "FromLocation": [
                                {
                                    "LocationName": "V",
                                    "Priority": 1,
                                    "Order": 0
                                }
                            ],
                            "LocationSignature": "Rym",
                            "OperationalTrainNumber": "17671",
                            "ToLocation": [
                                {
                                    "LocationName": "Av",
                                    "Priority": 1,
                                    "Order": 0
                                }
                            ],
                            "TrainOwner": "JLT"
                        },
                        {
                            "ActivityId": "1500adde-095d-334b-08db-bd6193219cf4",
                            "ActivityType": "Avgang",
                            "AdvertisedTimeAtLocation": "2023-10-10T19:07:00.000+02:00",
                            "AdvertisedTrainIdent": "7618",
                            "Canceled": false,
                            "EstimatedTimeAtLocation": "2023-10-10T19:22:00.000+02:00",
                            "FromLocation": [
                                {
                                    "LocationName": "V",
                                    "Priority": 1,
                                    "Order": 0
                                }
                            ],
                            "LocationSignature": "Syd",
                            "OperationalTrainNumber": "7618",
                            "ToLocation": [
                                {
                                    "LocationName": "Jö",
                                    "Priority": 1,
                                    "Order": 0
                                }
                            ],
                            "TrainOwner": "JLT"
                        }
                    ]
                }
            ]
        }
    }`;

    fetch.mockResponse(body);

    let response = await delayed.getDelayedTrains();

    expect(fetch.mock.calls[0][0]).toEqual('https://api.trafikinfo.trafikverket.se/v2/data.json');
    expect(fetch.mock.calls.length).toEqual(1);

    expect(response[0].ActivityId).toBe("1500adde-095d-334b-08db-bd60fb77a372");
});