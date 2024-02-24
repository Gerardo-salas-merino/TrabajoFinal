const request = require('supertest');
const app = require('../app');
const Category = require('../models/Category');
require('../models');


const BASE_URL_USERS = '/users/login';
const BASE_URL = '/products';


let TOKEN;
let category;
let product;
let productId;


// Con el beforeAll simulamos el inicio de sesion de un usuario
// inyectando informacion en nuestra DB

beforeAll(async () => {

    //LOGIN
    const user = {
        email: 'fernando@gmail.com',
        password: 'fernando123',
    };

    const res = await request(app)
    .post (BASE_URL_USERS)
    .send(user)
   
   TOKEN = res.body.token;
   
   category = await Category.create({name: "Tecnologia"})

    product = {
        title: "pendrive 64gb",
        description: "Lorem 5",
        price: "20.5",
        categoryId: category.id
    
    };

});


test("POST -> 'BASE_URL', should return statusCode 201, res.body to be defined and res.body.title === product", async() => {
    const res = await request(app)
     .post(BASE_URL)
     .send(product)
     .set("Authorization", `Bearer ${TOKEN} `)

    productId = res.body.id 

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)

    
});

test("GET -> 'BASE_URL', should return statusCode 200, re.body to be defined and res.body to haveLength === 1 ", async() => {
    
    const res = await request(app)
     .get(BASE_URL)

    

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)

    expect(res.body[0].category).toBeDefined()
    expect(res.body[0].category.id).toBe(category.id)


    

});


test("GET -> 'BASE_URL', should return status code 200, res.body to be defined, and res.body.length ==== 1, res.body[0].categoryId === category.id , and res.body[0].category.id === category.id", async() => {

    const res = await request(app)
    .get(`${BASE_URL}?category=${category.id}`)

     expect(res.status).toBe(200)
     expect(res.body).toBeDefined()
     expect(res.body).toHaveLength(1)

  expect(res.body[0].categoryId).toBeDefined()
  expect(res.body[0].categoryId).toBe(category.id)

  expect(res.body[0].category).toBeDefined()
  expect(res.body[0].category.id).toBe(category.id)

  
});

test("GET_ONE -> 'BASE_URL/:productId', should return status code 200, res.body to be defined, res.body.title === product.title, res.body.category.id to be defined, and res.body.category.id === category.id", async () => {
    const res = await request(app)
      .get(`${BASE_URL}/${productId}`)
  
    console.log(res.body);
  
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)
  
  
    expect(res.body.category.id).toBeDefined()
    expect(res.body.category.id).toBe(category.id)
  
    
  
});

test("PUT -> 'URL_BASE/productId', should return status code 200, res.body to be defined and res.body.title === 'Ropa'", async () => {

    const res = await request(app)
      .put(`${BASE_URL}/${productId}`)
      .send({ title: "Ropa" })
      .set('Authorization', `Bearer ${TOKEN}`)
  
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe('Ropa')
    
    
});

test("DELETE -> 'URL_BASE/:productId', should return status code 204", async () => {
    const res = await request(app)
      .delete(`${BASE_URL}/${productId}`)
      .set('Authorization', `Bearer ${TOKEN}`)
  
    expect(res.status).toBe(204)
    await category.destroy()
  })





