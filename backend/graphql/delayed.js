const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull
} = require('graphql');
const LocationType = require('./location.js');

const DelayedType = new GraphQLObjectType({
    name: 'Delayed',
    description: 'This represents a delayed train',
    fields: () => ({
        ActivityId: { type: GraphQLString },
        ActivityType: { type: GraphQLString },
        AdvertisedTimeAtLocation: { type: GraphQLString },
        EstimatedTimeAtLocation: { type: GraphQLString },
        AdvertisedTrainIdent: { type: GraphQLString },
        OperationalTrainNumber: { type: GraphQLString },
        Canceled: { type: GraphQLString },
        FromLocation: { type: new GraphQLList(LocationType) },
        ToLocation: { type: new GraphQLList(LocationType) },
        LocationSignature: { type: GraphQLString },
        TimeAtLocation: { type: GraphQLString },
        TrainOwner: { type: GraphQLString }
    })
})

module.exports = DelayedType;
