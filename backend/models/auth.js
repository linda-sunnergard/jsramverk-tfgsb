const bcrypt = require('bcryptjs');
const database = require('../db/database');
const tokenTimeLimit = "1h";

const auth = {
    /**
     * Register a new user. 
     * Content-Type should be 'application/x-www-form-urlencoded'
     * Body must include 'username' and 'password'
     * Password is sent as plain text
     * @param {*} req http request
     * @param {*} res api response
     * @returns json response
     */
    registerUser: async function(req, res) {
        // Make sure there is both a username and a password
        if (!req.body.username || !req.body.password) {
            return res.json({
                data: {
                    message: "Error: Body parameter username or password missing."
                }
            });
        }

        const db = await database.openDb();

        // Check if there are any users with that name in the db
        const newUser = req.body.username;
        const readResult = await db.collection('users').find({ username: newUser }).toArray();

        if (readResult.length > 0) {
            return res.json({
                data: {
                    message: "Error: User with that name already exists."
                }
            });
        }

        // Generate salt
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return res.json({
                    data: {
                        message: "Error: Problem generating salt.",
                        error: err
                    }
                });
            }
            // Hash password
            bcrypt.hash(req.body.password, salt, async (err, hash) => {
                if (err) {
                    return res.json({
                        data: {
                            message: "Error: Problem hashing password.",
                            error: err
                        }
                    });
                }

                // Prepare document
                const doc = {
                    username: newUser,
                    password: hash
                }

                // Create user and get the response
                // const createResult = await db.collection('users').insertOne(doc);
                await db.collection('users').insertOne(doc);

                // TODO: Check result for errors somehow

                // Return a confirmation. 
                // TODO: Return json web token at this point as well
                return res.json({
                    data: {
                        message: "User created successfully.",
                        username: newUser
                    }
                });
            });
        });
    },
    loginUser: async function(req, res) {
        // Make sure there is both a username and a password
        if (!req.body.username || !req.body.password) {
            return res.json({
                data: {
                    message: "Error: Body parameter username or password missing."
                }
            });
        }

        const db = await database.openDb();

        // Check if there are any users with that name in the db
        const newUser = req.body.username;
        const readResult = await db.collection('users').find({ username: newUser }).toArray();

        if (readResult.length === 0) {
            return res.json({
                data: {
                    message: "Error: No user with that name exists."
                }
            });
        }

        console.log(readResult);
        const hash = readResult[0].password;

        bcrypt.compare(req.body.password, hash, (err, compareResult) => {
            if (err) {
                return res.json({
                    data: {
                        message: "Error: Problem comparing password with hash."
                    }
                });
            } else if (compareResult) {
                return res.json({
                    data: {
                        message: "Login successful.",
                        username: newUser,
                        token: ""
                    }
                });
                
            }
            return res.json({
                data: {
                    message: "Error: Wrong password."
                }
            });
        });

        return res.json({
            data: {
                message: "Error: Unknown login error."
            }
        });
    }

    // checkoutToken: function(payload)
};

module.exports = auth;

// const tickets = {
//     getTickets: async function getTickets(req, res){
//         const db = await database.openDb();
//         const allTickets = await db.collection('tickets').find({}).toArray();

//         // await db.client.close();
//         // console.log(allTickets);
//         return res.json({
//             data: allTickets
//         });
//     },

//     createTicket: async function createTicket(req, res){
//         const db = await database.openDb();

//         const doc = {
//             code: req.body.code,
//             trainnumber: req.body.trainnumber,
//             traindate: req.body.traindate
//         };

//         const result = await db.collection('tickets').insertOne(doc);

//         // console.log(result.insertedId)
//         return res.json({
//             data: {
//                 id: result.insertedId,
//                 code: req.body.code,
//                 trainnumber: req.body.trainnumber,
//                 traindate: req.body.traindate,
//             }
//         });
//     }
// };



// const myPlaintextPassword = 'longandhardP4$w0rD';
// const hash = 'superlonghashedpasswordfetchedfromthedatabase';

// bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
//     // res innehåller nu true eller false beroende på om det är rätt lösenord.
// });

