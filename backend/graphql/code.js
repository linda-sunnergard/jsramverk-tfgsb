const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull
} = require('graphql');

const CodeType = new GraphQLObjectType({
    name: 'Code',
    description: 'This represents a ticket code',
    fields: () => ({
        Code: { type: new GraphQLNonNull(GraphQLString) },
        Level1Description: { type: GraphQLString },
        Level2Description: { type: GraphQLString },
        Level3Description: { type: GraphQLString }
    })
})

module.exports = CodeType;
