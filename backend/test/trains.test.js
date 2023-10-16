require('jest-fetch-mock').enableMocks();
const fetchTrainPositions = require('../models/trains.js');
import WS from "jest-websocket-mock";
const { MockEvent, EventSource } = require('mocksse');

test("A test", async () => {
  fetch.mockResponseOnce(JSON.stringify(
    {
        RESPONSE: {
            RESULT: [
                {
                    INFO: {
                          SSEURL: "http://faketrains:2000/positions"
                      },
                },
            ],
        },
    }));

  const eventHandler = new MockEvent({
    url: 'http://faketrains:2000/positions',
    setInterval: [100, 200],
    response: (mockEvent, evtSource) => {
      const data = [
        { data1: "trains" },
        { data2: "more trains" }
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

  await fetchTrainPositions(io);
  
  await io.connected;

  await client.send("yes");

  await expect(io).toReceiveMessage("yes");
  expect(io).toHaveReceivedMessages(["yes"]);


  expect(fetch.mock.calls[0][0]).toEqual('https://api.trafikinfo.trafikverket.se/v2/data.json');
  expect(fetch.mock.calls.length).toEqual(1);

  await io.close();
  
  
});

// sseurl https://api.trafikinfo.trafikverket.se/v2/data.json?ssereqid=0c989f3d-4c0c-4e2e-b886-1a52612f4a49
