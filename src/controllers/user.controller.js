const catchError = require('../utils/catchError');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const getAll = catchError(async(req, res) => {
    const results = await User.findAll();
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const result = await User.create(req.body);
    return res.status(201).json(result);
});



const remove = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.destroy({ where: {id} });
    if(!result) return res.sendStatus(404);
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;

    delete req.body.password
    delete req.body.email

    const result = await User.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const login = catchError(async(req, res) => {
    const { email, password } = req.body

    // VAALIDAMOS EL EMAIL

    //buscamos el usuario con ese email
    const user = await User.findOne({where: { email } })
    //si user no se encuentra retornamos un 404
    if(!user) return res.sendStatus(401).json({ error: 'User not found'})

    // comparamos la contrasena
    const isValided = await bcrypt.compare(password, user.password)
    if(!isValided) return res.sendStatus(401).json({ error: 'User not found'})

    // VALIDAMOS EL PASSWORD
    const token = jwt.sign(
        {user},
        process.env.TOKEN_SECRET,
        { expiresIn: "1d"}
    )

    return res.json({user, token})
});

module.exports = {
    getAll,
    create,
    remove,
    update,
    login
}