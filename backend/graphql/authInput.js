const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull,
    GraphQLInputObjectType
} = require('graphql');

const AuthInput = new GraphQLInputObjectType({
    name: 'AuthInput',
    description: 'This represents an auth input',
    fields: {
        username: { type: new GraphQLNonNull(GraphQLString) },
        password:  { type: new GraphQLNonNull(GraphQLString) }
    }
})

module.exports = AuthInput;
