const request = require('supertest');
const app = require('../app');
require('../models')
const Product = require("../models/Product")

const URL_USER = '/users/login'
const URL_BASE = '/cart'
let TOKEN;
let bodyCart;
let bodyProduct;
let product;
let userId;
let cartId;


beforeAll(async() => {
    const user = {
        email: 'fernando@gmail.com',
        password: 'fernando123',
    }

    const res = await request(app)
     .post(URL_USER)
     .send(user)
     
    TOKEN = res.body.token
    userId = res.body.user.id


    bodyProduct = {
        title: 'titulo 1',
        description: 'lorem 5',
        price: 45.20,
    }

    product = await Product.create(bodyProduct)

    bodyCart= {
        quantity: 1,
        productId: product.id
    }

   
   
});

test("POST -> 'URL_BASE', should return statusCode: 201, res.body to be defined and res.body.quantity === bodyCart.quantity ", async() => {

    const res = await request(app)
     .post(URL_BASE)
     .send(bodyCart)
     .set('Authorization', `Bearer ${TOKEN}`)

    cartId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.userId).toBe(userId)

    

});

test("GET -> 'URL_BASE',  should status 200, res.body to be defined and res.body.length === 1", async() => {
    const res = await request(app)
     .get(URL_BASE)
     .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

    expect(res.body[0].userId).toBeDefined()
    expect(res.body[0].userId).toBe(userId)

    expect(res.body[0].productId).toBeDefined()
    expect(res.body[0].productId).toBe(product.id)

   
});

test("GET_ONE -> 'URL_BASE/:id', should return statusCode: 200, res.body to be defined, and res.body.quantity to be 3", async() => {
    const res = await request(app)
     .get(`${URL_BASE}/${cartId}`)
     .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(bodyCart.quantity)
   
    expect(res.body.userId).toBeDefined()
    expect(res.body.userId).toBe(userId)
   
    expect(res.body.productId).toBeDefined()
    expect(res.body.productId).toBe(product.id)

    

});


test("PUT -> 'UR_BASE/:id', should return statusCode: 200, res.body to be defined, and res.body.quantity to be 3 ", async() => {
    const res = await request(app)
     .put(`${URL_BASE}/${cartId}`)
     .set('Authorization', `Bearer ${TOKEN}`)
     .send({quantity: 3})

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.quantity).toBe(3)

   

});

test("DELETE -> 'URL_BASE/:id', should return statusCode: 204 ", async() => {
    const res = await request(app)
     .delete(`${URL_BASE}/${cartId}`)
     .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(204)
    

    await product.destroy()
});