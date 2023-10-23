require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const graphqlHandler = require('./models/graphql.js');
const subscribeTrainPositions = require('./models/trains.js');
const delayed = require('./models/delayed.js');
const authModel = require('./models/auth.js')

const app = express()
const httpServer = require("http").createServer(app);

app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// Set up CORS to the correct local/remote site
let ioOrigin = "https://www.student.bth.se";

if (process.env.NODE_ENV == "development") {
    ioOrigin = "http://localhost:5173";
}

const io = require("socket.io")(httpServer, {
    cors: {
        origin: ioOrigin,
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 1337;

app.use((res, req, next) => {
    const graphqlQuery = req.req.body.query.replaceAll(/\s/g,"");

    if (graphqlQuery.startsWith("{auth") || authModel.verifyRequest(req.req)) {
        return next();
    }

    return res.res.json({
        message: "Invalid authentication token."
    });
});

// GraphQL endpoint
app.use("/graphql", graphqlHandler);

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

subscribeTrainPositions(io);
delayed.subscribeDelayedTrains(io);

process.on('exit', () => {
    io.disconnect();
});
