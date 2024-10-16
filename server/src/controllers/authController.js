const userService = require('../Services/userService')
const jwtprovider = require('../config/jwtprovider')
const cartService = require('../Services/cartService')
const bcrypt = require('bcrypt')
const User = require('../models/userModel')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const register = async (req, res) => {
    try {
        const user = await userService.createUser(req.body);
        const jwt = jwtprovider.generateToken(user._id);
        await cartService.createCart(user);
        return res.status(200).send({ jwt, message: "Register Sucessfully" })
    } catch (error) {
        console.log(error, "error")
        return res.status(500).send({ error: error.message })

    }
}


const login = async (req, res) => {
    const { password, email } = req.body;
    try {

        const user = await userService.getUserByEmail(email);
        // if (!user) {
        //     return res.status(404).send({ message: "User not found with email" });
        // }


        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).send({ error: "Invalid Password" });
        }

        // Generate JWT token with user ID and role
        const jwt = jwtprovider.generateToken(user._id, user.role);

        // Logic for admin and normal users
        if (user.role === "ADMIN") {
            // Handle logic for admin login if needed (e.g., logging, auditing, etc.)
            return res.status(200).send({
                jwt,
                message: "Admin logged in successfully",
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role, // Admin role
                },
            });
        } else {
            // Handle normal user login
            return res.status(200).send({
                jwt,
                message: "User logged in successfully",
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role, // Normal user role
                },
            });
        }
    } catch (error) {
        return res.status(500).send({ error: error.message });
    }
};



const GoogleLogin = async (req, res) => {
    try {

        const { googleToken } = req.body;
        const ticket = await client.verifyIdToken({
            idToken: googleToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const googleUser = ticket.getPayload();

        if (!googleUser) {
            return res.status(400).json({ message: "Invalid Google token" });
        }

        const user = await userService.getUserByEmail(googleUser.email);

        if (user) {
            const token = jwtprovider.generateToken(user._id);
            return res.status(200).json({ message: "Login successful", token });
        }

        const newUser = await User.create({
            firstName: googleUser.given_name,
            lastName: googleUser.family_name,
            email: googleUser.email,
            password: process.env.SECRET_KEY + googleUser.email,
        });


        const token = jwtprovider.generateToken(newUser._id);

        return res.status(201).json({
            message: "User created and logged in",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        console.error('Error logging in with Google:', error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


module.exports = { login, register, GoogleLogin }
