const { GraphQLSchema } = require("graphql");
const graphqlHttp = require('graphql-http/lib/use/express');

const RootQueryType = require("../graphql/rootQuery.js");
const RootMutationType = require('../graphql/rootMutation.js')

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

module.exports = graphqlHandler;