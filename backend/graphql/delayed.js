const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLFloat,
    GraphQLNonNull
} = require('graphql');

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
        FromLocation: { type: GraphQLString },
        ToLocation: { type: GraphQLString },
        LocationSignature: { type: GraphQLString },
        TimeAtLocation: { type: GraphQLString },
        TrainOwner: { type: GraphQLString }
    })
})

module.exports = DelayedType;
