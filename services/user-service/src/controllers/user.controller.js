const userService = require("../services/user.service");

const getUsers = async (req, res) => {
    console.log(req.query);
    const users = await userService.getUsers();
    res.json(users)
}

const getUserById = async (req, res) => {
    const id =Number(req.params.id);
    if(!Number.isInteger(id) || id <=0){
        const error = new Error("Invalid user ID");
        error.statusCode = 400;
        throw error;
    }
    const user = await userService.getUserById(id);
    res.json(user);
}

const createUser = async (req, res) => {
    console.log(req.body);
    const user = await userService.createUser(req.body);
    res.status(200).json(user);
}

module.exports = {
    getUsers,
    getUserById,
    createUser
}