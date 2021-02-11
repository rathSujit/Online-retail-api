const Item = require("../mongo/models/items");

exports.addItem = async (req, res, next) => {
    let response = {};
    try {
        const item = new Item({
            ...req.body,
            owner: req.user._id
        });

        await item.save();
        response = {
            "error": false,
            "status": 200,
            "result": { data: item },
            "message": "Item added."
        }

    } catch (error) {
        response = {
            "error": true,
            "status": 400,
            "errorMesage": error
        }
        res.status(400).send(response)
    }
}

exports.fetchItems = async (req, res, next) => {
    let response = {};

    try {
        await req.user.populate("items").execPopulate();
        response = {
            "error": false,
            "status": 200,
            "result": { data: req.user.items },
            "message": "items fetched"
        }

    } catch (error) {
        response = {
            "error": true,
            "status": 400,
            "errorMesage": error
        }
        res.status(400).send(response)
    }
}

exports.fetchSingleItem = async (req, res, next) => {
    let response = {};
    try {
        const _id = req.params.id;

        const item = await Item.findOne({ _id, owner: req.user._id });

        if (!item) {
            response = {
                "error": true,
                "status": 400,
                "message": "Task not found"
            }
            return res.status(400).send(response);
        }
        response = {
            "error": false,
            "status": 200,
            "result": { data: item },
            "message": "Item found"
        }

        res.status(200).send(response);

    } catch (error) {
        response = {
            "error": true,
            "status": 400,
            "errorMesage": error
        }
        res.status(400).send(response)
    }
}

exports.deleteItem = async (req, res, next) => {
    let response = {};
    try {
        const item = await Item.findOneAndDelete({ _id: req.params.id, owner: req.use._id });

        if (!item) {
            response = {
                "error": true,
                "message": "Item not found."
            }
            return res.status(400).send(response);
        }

        response = {
            "error": false,
            "result": { data: item },
            "message": "Item deleted"
        }
        res.status(200).send(response);

    } catch (error) {
        response = {
            "error": true,
            "status": 400,
            "errorMesage": error
        }
        res.status(400).send(response)
    }
}