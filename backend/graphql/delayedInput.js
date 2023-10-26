const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLInputObjectType
} = require('graphql');

const DelayedInput = new GraphQLInputObjectType({
    name: 'DelayedInput',
    description: 'This represents a a delayed train input',
    fields: {
        OperationalTrainNumber: { type: GraphQLInt }
    }
})

module.exports = DelayedInput;