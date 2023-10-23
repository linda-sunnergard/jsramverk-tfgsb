const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLInputObjectType
} = require('graphql');

const TicketInput = new GraphQLInputObjectType({
    name: 'TicketInput',
    description: 'This represents a ticket input',
    fields: {
        _id:  { type: GraphQLString },
        code: { type: GraphQLString },
        trainnumber: { type: GraphQLInt },
        traindate:  { type: GraphQLString }
    }
})

module.exports = TicketInput;
