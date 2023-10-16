const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');

const TicketType = require("./ticket.js");
const TicketInput = require("./ticketInput.js");
const AuthType = require('./auth.js');

const tickets = require("../models/tickets.js");
const auth = require("../models/auth.js");
const AuthInput = require('./authInput.js');

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        createTicket: {
            type: TicketType,
            description: 'Add a new ticket',
            args: {
                input: { type: TicketInput }
            },
            resolve: async (_, args, context) => {
                return await tickets.createTicket(
                    args.input.code,
                    args.input.trainnumber,
                    args.input.traindate
                );
            }
        },
        updateTicket: {
            type: TicketType,
            description: 'Update a ticket',
            args: {
                input: { type: TicketInput }
            },
            resolve: async (_, args, context) => {
                return await tickets.updateTicket(
                    args.input._id,
                    args.input.code
                );
            }
        },
        authRegister: {
            type: AuthType,
            description: "Register a new user",
            args: {
                input: { type: AuthInput }
            },
            resolve: async (_, args) => {
                const username = args.input.username;
                const password = args.input.password;
                const register = await auth.registerUser(username, password);

                return register;
            }
        }
    })
});

module.exports = RootMutationType;
