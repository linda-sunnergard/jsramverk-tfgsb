require('jest-fetch-mock').enableMocks();
const codes = require('../models/codes.js');

const mockResponse = {
    json: jest.fn(),
  };

test ('Get codes', async () => {
    const body = `{
        "RESPONSE": {
            "RESULT": [
                {
                    "ReasonCode": [
                        {
                            "Code": "ANA002",
                            "Level1Description": "Avvikelse",
                            "Level2Description": "Nationell",
                            "Level3Description": "Bakre tåg"
                        },
                        {
                            "Code": "ANA004",
                            "Level1Description": "Avvikelse",
                            "Level2Description": "Nationell",
                            "Level3Description": "Brofel"
                        }
                    ]
                }
            ]
        }
    }`;
    fetch.mockResponse(body);

    const result = await codes.getCodes();

    expect(fetch.mock.calls[0][0]).toEqual('https://api.trafikinfo.trafikverket.se/v2/data.json');
    expect(fetch.mock.calls.length).toEqual(1);

    expect(result[0].Code).toBe('ANA002');
});