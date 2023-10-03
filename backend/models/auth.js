const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const database = require('../db/database');

const tokenExpiration = "1h";

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
                const insertResult = await db.collection('users').insertOne(doc);
                // const userid = await db.collection('users').insertOne(doc).getInsertedId();

                // TODO: Check result for errors somehow
                if (!insertResult.insertedId) {
                    return res.json({
                        data: {
                            message: "Error: Problem inserting document in database."
                        }
                    });
                }

                const payload = {
                    username: newUser,
                    userid: insertResult.insertedId
                }
                const token = auth.checkoutToken(payload);

                // Return a confirmation. 
                // TODO: Return json web token at this point as well
                return res.json({
                    data: {
                        message: "User created successfully.",
                        username: newUser,
                        token: token
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

        // console.log(readResult);
        const hash = readResult[0].password;
        const userid = readResult[0]._id;

        bcrypt.compare(req.body.password, hash, (err, compareResult) => {
            if (err) {
                return res.json({
                    data: {
                        message: "Error: Problem comparing password with hash."
                    }
                });
            } else if (compareResult) {
                const payload = {
                    username: newUser,
                    userid: userid
                };
                const token = auth.checkoutToken(payload);

                return res.json({
                    data: {
                        message: "Login successful.",
                        username: newUser,
                        token: token
                    }
                });
            }
            return res.json({
                data: {
                    message: "Error: Wrong password."
                }
            });
        });

        return;
    },

    checkoutToken: function(payload) {
        const secret = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secret, {expiresIn: tokenExpiration});

        return token;
    },

    verifyToken: function(token) {
        const secret = process.env.JWT_SECRET;
        let success = false;
        let payload = {};

        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                return;
            }

            success = true;
            payload = decoded;
            return;
        });

        return {
            success: success,
            payload: payload
        };
    },

    verify: function(req, res, next) {
        const token = req.headers['x-access-token'];
        const result = auth.verifyToken(token);

        if (result.success) {
            next();
            return;
        }
        
        return res.json({
            data: {
                message: "Error: No valid login token.",
                failedVerification: true
            }
        });
    }
};

module.exports = auth;
