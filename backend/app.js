require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const fetchTrainPositions = require('./models/trains.js')
const delayed = require('./routes/delayed.js');
const tickets = require('./routes/tickets.js');
const codes = require('./routes/codes.js');

const app = express()
const httpServer = require("http").createServer(app);

app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Set up CORS to the correct local/remote site
let ioOrigin = "https://www.student.bth.se";

if (process.env.NODE_ENV === "development") {
  ioOrigin = "http://localhost:5173";
}

const io = require("socket.io")(httpServer, {
  cors: {
    origin: ioOrigin,
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 1337;

app.get('/', (req, res) => {
  res.json({
      data: 'Hello World!'
  })
})

app.get('/mode', (req, res) => {
  res.json({
      data: process.env.NODE_ENV
  })
})

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

fetchTrainPositions(io);

process.on('exit', () => {
  io.disconnect();
});