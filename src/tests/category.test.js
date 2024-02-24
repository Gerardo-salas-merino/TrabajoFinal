const request = require('supertest');
const app = require('../app');


const BASE_URL = '/categories';
const BASE_URL_USERS =  '/users'

const category = {
    name: 'Shoes'
};

let TOKEN;

let categoryId;

// en el hook beforeAll pasamos un usuario que intenta hacer login
beforeAll(async() => {

    const user = {
        email: 'fernando@gmail.com',
        password: 'fernando123',
    }

    const res = await request(app)
     .post(`${BASE_URL_USERS}/login`)
     .send(user)
    
    TOKEN = res.body.token
})




// cuando es un endpoint protegido usamos el metodo .SET()
test("POST -> 'BASE_URL', should return statusCode 201, res.body to be defined and res.body.name === category.name ", async() => {

    const res = await request(app)
     .post(BASE_URL)
     .send(category)
     .set("Authorization", `Bearer ${TOKEN} `)
    
    categoryId = res.body.id
     
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(category.name)

});

test("GET_ALL -> 'BASE_URL/categories', should return statusCode: 200, res.body to be defined and res.body to have length === 1 ", async() => {
    const res = await request(app)
     .get(BASE_URL)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
});

test("DELETE -> 'BASE_URL/:id', should return statusCode: 200, res.body to be defined and res.body to have length === 1 ", async() => {
    const res = await request(app)
     .delete(`${BASE_URL}/${categoryId}`)
     .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(204)
    
});

