const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull
} = require('graphql');

const TicketType = new GraphQLObjectType({
    name: 'Ticket',
    description: 'This represents a ticket',
    fields: () => ({
        _id: { type: GraphQLString },
        code: { type: GraphQLString },
        trainnumber: { type: GraphQLInt },
        traindate:  { type: GraphQLString }
    })
})

module.exports = TicketType;
