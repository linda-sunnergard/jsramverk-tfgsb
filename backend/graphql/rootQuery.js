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

const codes = require("../models/codes.js");
const delayed = require("../models/delayed.js");
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
                const verified = auth.verifyToken(context.token);

                if (verified.success) {
                    return await codes.getCodes();
                }
            }
        },
        delayed: {
            type: new GraphQLList(DelayedType),
            description: 'List of all delayed trains',
            resolve: async (_, __, context) => {
                const verified = auth.verifyToken(context.token);

                if (verified.success) {
                    return await delayed.getDelayedTrains();
                }
            }
        },
        tickets: {
            type: new GraphQLList(TicketType),
            description: 'List of all tickets',
            resolve: async (_, __, context) => {
                const verified = auth.verifyToken(context.token);

                if (verified.success) {
                    return await tickets.getTickets();
                }
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

async function getPeople(entity) {
    let courseArray = await courses.getAll();
    let people = [];
    let acronyms = [];
    courseArray.forEach(function(course) {
        course[entity].forEach(function(person) {
            if (acronyms.indexOf(person.acronym) === -1) {
                people.push(person);
                acronyms.push(person.acronym);
            }
        });
    });

    return people;
}

module.exports = RootQueryType;
