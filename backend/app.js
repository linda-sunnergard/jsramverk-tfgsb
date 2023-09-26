require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan') //TODO: Not used. Look into why?
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

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Set up CORS to the correct local/remote site
let ioOrigin = "http://localhost:9000";

if (process.env.PORT) {
  ioOrigin = "https://www.student.bth.se";
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

app.use("/delayed", delayed);
app.use("/tickets", tickets);
app.use("/codes", codes);

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

fetchTrainPositions(io);
