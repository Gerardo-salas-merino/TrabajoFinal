const request = require('supertest')
const app = require('../app');

const BASE_URL = '/users';

let TOKEN

let userId;

const user = {
    firstName: 'Gerardo',
    lastName: 'Merino',
    email: 'gerardo@gmail.com',
    password: 'gerardo123',
    phone: '2214559901'
};

////////////////////TESTING DE ENDPOINTS PROTEGIDOS Y PUBLICOS//////////////////

// debemos de hacer un hook login con el nuevo usuario 
beforeAll(async() => {
    const user = {
        email: 'fernando@gmail.com',
        password: 'fernando123',

    }
    const res = await request(app)
     .post(`${BASE_URL}/login`)
     .send(user)
    
    TOKEN = res.body.token
    
});


test("GET '/users', should return statusCode: 200, res.body to defined and res.body.length === 1 ", async() => {

    const res = await request(app)
     .get(BASE_URL)
     .set('Authorization', `Bearer ${TOKEN}`)

    

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
});

test("POST '/users',  should retur statusCode: 201, res.body to be defined and res.body.firstName === user.firstName", async() => {


    const res = await request(app)
     .post(BASE_URL)
     .send(user)
    
    userId = res.body.id

    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(user.firstName)

});


// test de PUT que es un endpoint protegindo
test("PUT '/users/:id', should return statusCode: 200, res.body to be defined and res.body.firstName = 'Jorgito'  ", async() => {
    const res = await request(app)
     .put(`${BASE_URL}/${userId}`)
     .send({firstName: "Lalo"})
     .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe('Lalo')
    
});

test("POST 'BASE_URL/login', should return statusCode 200, res.body to be defined, res.body.user.email === user.email, and res.body.token to be defined ", async() => {
    const userLogin = {
        email: 'gerardo@gmail.com',
        password: 'gerardo123',
    }

    const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(userLogin)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.user.email).toBe(userLogin.email)
    expect(res.body.token).toBeDefined()


});

// testing del password para validar si el usuario ingreso con una contrasena incorrecta
test("POST 'BASE_URL/login', should return statusCode: 401  ", async() => {
    const userLogin = {
        email: 'gerardo@gmail.com',
        password: 'invalid password'
    }

    const res = await request(app)
    .post(`${BASE_URL}/login`)
    .send(userLogin)

    expect(res.statusCode).toBe(401)
});

test("DELETE 'BASE_URL/:id', should return statusCode: 204 ", async() => {
    const res = await request(app)
     .delete(`${BASE_URL}/${userId}`)
     .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.statusCode).toBe(204)
})
