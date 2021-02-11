const User = require("../mongo/models/users");


exports.createUser = async (req, res, next) => {
    let response = {};
    try {
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        response = {
            "error": false,
            "result": { data: { user, token } },
            "status": 201,
            "message": "User created."
        }
        res.status(201).send(response)

    } catch (error) {
        response = {
            "error": true,
            "status": 400,
            "errorMesage": error
        }
        res.status(400).send(response)
    }

}

exports.loginUser = async (req, res, next) => {
    let response = {};
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        response = {
            "error": false,
            "status": 200,
            "result": { data: { user, token } },
            "message": "User logged in."
        }
        res.status(200).send(response)

    } catch (error) {
        response = {
            "error": true,
            "status": 400,
            "errorMesage": error
        }
        res.status(400).send(response)
    }
}

exports.logoutUser = async (req, res, next) => {
    let response = {};
    try {
        req.users.tokens = req.user.tokens.filter(token => {
            return token.token != req.token
        })
        await req.user.save();
        response = {
            "error": false,
            "status": 200,
            "message": "Logged out"
        }
        res.status(200).send(response)

    } catch (error) {
        response = {
            "error": true,
            "status": 400,
            "errorMesage": error
        }
        res.status(400).send(response)
    }
}

exports.logoutAll = async (req, res, next) => {
    let response = {};
    try {
        req.users.tokens = [];
        await req.user.save();
        response = {
            "error": false,
            "status": 200,
            "message": "Loggoed out from all devices."
        }
        res.status(400).send(response)

    } catch (error) {
        response = {
            "error": true,
            "status": 400,
            "errorMesage": error
        }
        res.status(400).send(response)
    }
}

exports.userProfile = async (req, res, next) => {
    let response = {};

    try {
        response = {
            "error": false,
            "status": 200,
            "result": { data: req.user },
            "message": "Profile fetched"
        }
        res.status(200).send(response)

    } catch (error) {
        response = {
            "error": true,
            "status": 400,
            "errorMesage": error
        }
        res.status(400).send(response)
    }
}

exports.updateUser = async (req, res, next) => {
    let response = {};
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ["name", "email", "password"];
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            response = {
                "error": true,
                "status": 400,
                "message": "Invalid Updates!"
            }
            return res.status(400).send(response)
        }

        updates.forEach(update => req.user[update] = req.body.update);
        await req.user.save();
        response = {
            "error": false,
            "status": 200,
            "message": "User updated"
        }
        res.status(200).send(response)

    } catch (error) {
        response = {
            "error": true,
            "status": 500,
            "errorMesage": error
        }
        res.status(500).send(response)
    }
}

exports.deleteUser = async (req, res, next) => {
    let response = {};
    try {
        await req.user.remove();
        response = {
            "error": true,
            "status": 200,
            "message": "User Deleted."
        }
        res.status(200).send(response)

    } catch (error) {
        response = {
            "error": true,
            "status": 400,
            "errorMesage": error
        }
        res.status(400).send(response)
    }

}