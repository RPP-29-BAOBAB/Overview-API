const app = require('../app.js');
const request = require('supertest');
const mongoDB = require('../db/db')

let server, agent;

beforeAll(async () => {
  await mongoDB.connect(); // connect to db
  server = await app.listen(4000) // assign app to use the allocated port
  agent = request.agent(server);
});
afterAll(async () => {
  await server.close();
  await mongoDB.disconnect();
})

// testing all get routes
describe('Test GET routes', () => {

  test('It should response to /products', async () => {
    const res = await agent.get('/products');
    expect(res.statusCode).toBe(200);
  });

  test('It should response to /products with queries', async () => {
    const queryString =
      `page=${Math.round(Math.random() * 50000)}&count=${Math.round(Math.random() * 20)}`;
    const res = await agent.get(`/products?${queryString}`);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe('object');
  });

  test('It should response to /products/:product_id', async () => {
    const productId = Math.round(Math.random() * 999999);
    const res = await agent.get(`/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe('object');
  });

  test('It should response to /products/:product_id/styles', async () => {
    const productId = Math.round(Math.random() * 999999);
    const res = await agent.get(`/products/${productId}/styles`);
    expect(res.statusCode).toBe(200);
    expect(typeof res.body).toBe('object');
  });
});

describe('Test if routes handle errors', () => {

  test('/products should handle errors', async () => {
    const res = await agent.get('/products?page=99999999');
    expect(res.statusCode).toBe(400);
  });

  test('/products/:product_id should handle errors', async () => {
    const res = await agent.get('/products/99999999');
    expect(res.statusCode).toBe(404);
  });

  test('/products/:product_id/styles should handle errors', async () => {
    const res = await agent.get('/products/99999999/styles');
    expect(res.statusCode).toBe(404);
  });
});