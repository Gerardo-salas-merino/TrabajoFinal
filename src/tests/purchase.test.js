require('../models');
const request = require('supertest');
const app = require('../app');
const Product = require('../models/Product');

const URL_USER = '/users/login'
const URL_PURCHASE = '/purchase'
let TOKEN;
let userId;
let product;
let productBody;
let bodyCart

beforeAll(async() => {
    const user = {
        email: 'fernando@gmail.com',
        password: 'fernando123'
    }
    const res = await request(app)
     .post(URL_USER)
     .send(user)
    
    TOKEN = res.body.token
    // userId=res.body.user
    
    // declaramos la variable userId porque tenemos una columna userId en nuestro modelo
    userId = res.body.user.id

    //PRODUCT
    productBody = {
        title: 'Titulo 1',
        description: 'lorem 5',
        price: 4.28
    }

    product = await Product.create(productBody)

    //Carrito de compras
    bodyCart = {
        productId: product.id,
        quantity: 3
    }

    await request(app)
     .post('/cart')
     .send(bodyCart)
     .set('Authorization', `Bearer ${TOKEN}`)


});

test("POST 'URL_PURCHASE', should return statusCode 201, res.body to be defined and res.body.quantity === product.quantity ", async() => {
    const res = await request(app)
     .post(URL_PURCHASE)
     .set('Authorization', `Bearer ${TOKEN}`) 
     .send(bodyCart);
     
    expect(res.statusCode).toBe(201);
    expect(res.body[0]).toBeDefined();
    expect(res.body[0].quantity).toBe(bodyCart.quantity);

    
});


test("GET -> 'URL_PURCHASE', should return statusCode 200, res.body to be defined and res.body.length === 1 ", async() => {

    const res = await request(app)
     .get(URL_PURCHASE)
     .set('Authorization', `Bearer ${TOKEN}`)
    
     expect(res.statusCode).toBe(200)
     expect(res.body).toBeDefined()
     expect(res.body).toHaveLength(1)

     expect(res.body[0].productId).toBeDefined()
     expect(res.body[0].productId).toBe(product.id)

     expect(res.body[0].userId).toBeDefined()
     expect(res.body[0].userId).toBe(userId)
     
     await product.destroy()
    
});
