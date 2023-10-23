const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull
} = require('graphql');

const LocationType = new GraphQLObjectType({
    name: 'Location',
    description: 'This represents a train location',
    fields: () => ({
        LocationName: { type: GraphQLString },
        Priority: { type: GraphQLInt },
        Order: { type: GraphQLInt }
    })
})

module.exports = LocationType;
