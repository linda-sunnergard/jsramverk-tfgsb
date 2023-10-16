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
    registerUser: async function(username, password) {
        const db = await database.openDb();
        let success = false;
        let message = null;
        let userid = null;
        let token = null;
        let salt = null;

        // Check if there are any users with that name in the db
        const readResult = await db.collection('users').find({ username }).toArray();

        if (readResult.length > 0) {
            message = "Error: User with that name already exists."
            return { success, message};
        }

        // Generate salt
        await bcrypt.genSalt().then(async (generatedSalt) => {
            salt = generatedSalt
        });

        if (!salt) {
            return { success, message };
        }

        // Hash password
        await bcrypt.hash(password, salt).then(async (hash) => {
            // Prepare document
            const doc = {
                username,
                password: hash
            }

            // Create user and get the response
            const insertResult = await db.collection('users').insertOne(doc);

            if (!insertResult.insertedId) {
                message = "Error: Problem inserting document in database.";

                return;
            }

            userid = insertResult.insertedId;
            token = auth.checkoutToken({ username, userid });
            message = "User created successfully.";
            success = true;

            return
        });

        return { success, message, username, userid, token}
    },

    loginUser: async function(username, password) {
        console.log("Attempted login");

        const db = await database.openDb();
        let success = false;
        let message = null;
        let userid = null;
        let token = null;

        // Check if there are any users with that name in the db
        const readResult = await db.collection('users').find({ username }).toArray();

        // console.log(readResult.length)
        if (readResult.length === 0) {
            message = "Error: No user with that name exists.";
            return { success, message, username };
        }

        // console.log(readResult);
        const hash = readResult[0].password;
        userid = readResult[0]._id;

        await bcrypt.compare(password, hash).then(async (res) => {
            if (res) {
                const payload = { username, userid };

                success = true;
                message = "Login successful.";
                token = auth.checkoutToken(payload);

                return;
            }

            message = "Error: Wrong password."
        });

        return { success, message, username, userid, token };
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
            success,
            payload
        };
    },

    verifyRequest: function(req) {
        const token = req.headers['x-access-token'];
        const result = auth.verifyToken(token);

        if (result.success) {
            return true;
        }

        return false;
    }
};

module.exports = auth;
