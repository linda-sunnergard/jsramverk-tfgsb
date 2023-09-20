require('jest-fetch-mock').enableMocks();
const fetchTrainPositions = require('../models/trains.js');
import WS from "jest-websocket-mock";
const { MockEvent } = require('mocksse');




test("A test", async () => {
  fetch.mockResponseOnce(JSON.stringify(
    {
        RESPONSE: {
            RESULT: [
                {
                    INFO: {
                          SSEURL: "http://fakestreet:2000/trains"
                      },
                },
            ],
        },
    }));

  new MockEvent({
    url: 'http://fakestreet:2000/trains',
    setInterval: [100, 200],
    response: (mockEvent, evtSource) => {
      const data = [
        { data: "trains" },
        { data: "more trains" }
      ];
      
      mockEvent.stream(data);
    }
  });
    
  const io = new WS("ws://localhost:9000");
  const client = new WebSocket("ws://localhost:9000");
  const messages = [];

  client.onmessage = (e) => {

    messages.push(e.data);
  };

  await io.connected;

  await client.send("yes");

  await expect(io).toReceiveMessage("yes");
  expect(io).toHaveReceivedMessages(["yes"]);

  await fetchTrainPositions(io);

  expect(fetch.mock.calls[0][0]).toEqual('https://api.trafikinfo.trafikverket.se/v2/data.json');
  expect(fetch.mock.calls.length).toEqual(1);

});

