const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLBoolean,
    GraphQLNonNull
} = require('graphql');

const AuthType = new GraphQLObjectType({
    name: 'Auth',
    description: 'This represents an authetication',
    fields: () => ({
        success: { type: new GraphQLNonNull(GraphQLBoolean) },
        message: { type: GraphQLString },
        username: { type: GraphQLString },
        userid: { type: GraphQLString },
        token: { type: GraphQLString }
    })
})

module.exports = AuthType;
