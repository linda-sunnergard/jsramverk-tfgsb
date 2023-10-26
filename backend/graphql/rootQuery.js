const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

const CodeType = require("./code.js");
const DelayedType = require("./delayed.js");
const TicketType = require("./ticket.js");
const AuthType = require("./auth.js");
const AuthInput = require("./authInput.js");
const DelayedInput = require("./delayedInput.js")

const codes = require("../models/codes.js");
const delayedModel = require("../models/delayed.js");
const tickets = require("../models/tickets.js");
const auth = require("../models/auth.js");

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        codes: {
            type: new GraphQLList(CodeType),
            description: 'List of all ticket codes',
            resolve: async (_, __, context) => {
                return await codes.getCodes();
            }
        },
        delayed: {
            type: new GraphQLList(DelayedType),
            description: 'List of all delayed trains',
            args: {
                input: { type: DelayedInput }
            },
            resolve: async (_, args, context) => {
                const delayed = await delayedModel.getDelayedTrains()

                if (args && args.input && args.input.OperationalTrainNumber) {
                    const input = args.input.OperationalTrainNumber
                    for (const train of delayed) {
                        if (train.OperationalTrainNumber == input) {
                            return [ train ]
                        }
                    }
                }

                return delayed
            }
        },
        tickets: {
            type: new GraphQLList(TicketType),
            description: 'List of all tickets',
            resolve: async (_, __, context) => {
                return await tickets.getTickets();
            }
        },
        authLogin: {
            type: AuthType,
            description: 'Log in and receive credentials',
            args: {
                input: { type: AuthInput }
            },
            resolve: async (_, args) => {
                const username = args.input.username;
                const password = args.input.password;
                const login = await auth.loginUser(username, password);

                return login;
            }
        }
    })
});

module.exports = RootQueryType;