require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { GraphQLSchema } = require("graphql");
const graphqlHttp = require('graphql-http/lib/use/express');

const fetchTrainPositions = require('./models/trains.js');

const RootQueryType = require("./graphql/rootQuery.js");
const RootMutationType = require('./graphql/rootMutation.js')
const schema = new GraphQLSchema({ 
    query: RootQueryType,
    mutation: RootMutationType
});
const graphqlHandler = graphqlHttp.createHandler({
        schema,
        context: async (req) => {
            return { token: req.headers["x-access-token"] };
        }
});

const auth = require('./routes/auth.js');

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

// GraphQL endpoint
app.use("/graphql", graphqlHandler);

httpServer.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

fetchTrainPositions(io);

process.on('exit', () => {
    io.disconnect();
});
