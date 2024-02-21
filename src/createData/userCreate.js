const User = require("../models/User");

const userCreate = async() => {
    await User.create(
        {
            firstName: 'Fernando',
            lastName: 'Hernandez',
            email: 'fernando@gmail.com',
            password: 'fernando123',
            phone: '+3454435'
        }
    )
}

module.exports = userCreate;