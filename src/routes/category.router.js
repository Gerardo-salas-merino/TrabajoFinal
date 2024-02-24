const { getAll, create, remove } = require('../controllers/category.controller');
const express = require('express');
const verifyJwt = require('../utils/verifyJWT');

const routerCategory = express.Router();

routerCategory.route('/')
    .get(getAll)
    .post(verifyJwt, create);

// con el verifyJWT definimos que las rutas son privadas
routerCategory.route('/:id')
    .delete(verifyJwt, remove)
    

module.exports = routerCategory;