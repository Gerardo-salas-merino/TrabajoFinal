const { getAll, create, getOne, remove, update } = require('../controllers/cart.controller');
const express = require('express');

const routerCart = express.Router();

routerCart.route('/')
    .get(getAll)
    .post(create);

routerCart.route('/:id')
    .get(getOne)
    .put(update)
    .delete(remove);
    

module.exports = routerCart;