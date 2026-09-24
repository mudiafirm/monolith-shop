const request = require('supertest');

const app = require('../app');
const pool = require('../db/database');

describe('Monolith Shop API', () => {

    // ---------------------------------------
    // BASIC API TEST
    // ---------------------------------------

    test('GET / should return API message', async () => {
        const response = await request(app)
            .get('/');

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty(
            'message',
            'Monolith Shop API is running'
        );
    });


    // ---------------------------------------
    // PRODUCT TESTS
    // ---------------------------------------

    test('GET /api/products should return products', async () => {
        const response = await request(app)
            .get('/api/products');

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty('products');

        expect(Array.isArray(response.body.products))
            .toBe(true);
    });

    test('GET /api/products/:id should return 404 for missing product', async () => {
    const response = await request(app)
        .get('/api/products/999999');

    expect(response.statusCode).toBe(404);

    expect(response.body).toHaveProperty(
        'message',
        'Product not found'
    );
});


    test('POST /api/products should reject missing token', async () => {
        const response = await request(app)
            .post('/api/products')
            .send({
                name: 'Test Product',
                description: 'Test product',
                price: 1000,
                stock: 10
            });

        expect(response.statusCode).toBe(401);
    });


    test('POST /api/products should reject invalid data', async () => {

        // First login
        const login = await request(app)
            .post('/api/users/login')
            .send({
                email: 'john@example.com',
                password: 'mypassword'
            });

        expect(login.statusCode).toBe(200);

        const token = login.body.token;

        // Send invalid product
        const response = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: '',
                description: '',
                price: -500,
                stock: -10
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.message)
            .toBe('Validation failed');

        expect(response.body.errors)
            .toContain('Product name is required');

        expect(response.body.errors)
            .toContain('Product description is required');

        expect(response.body.errors)
            .toContain('Price must be greater than zero');

        expect(response.body.errors)
            .toContain('Stock must be a non-negative integer');
    });


    // ---------------------------------------
    // ORDER TESTS
    // ---------------------------------------

    test('POST /api/orders should reject missing token', async () => {

        const response = await request(app)
            .post('/api/orders')
            .send({
                items: [
                    {
                        productId: 1,
                        quantity: 2
                    }
                ]
            });

        expect(response.statusCode).toBe(401);
    });


    test('POST /api/orders should reject empty items', async () => {

        const login = await request(app)
            .post('/api/users/login')
            .send({
                email: 'john@example.com',
                password: 'mypassword'
            });

        const token = login.body.token;

        const response = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                items: []
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.message)
            .toBe('Validation failed');

        expect(response.body.errors)
            .toContain('Order must contain at least one item');
    });


    test('POST /api/orders should reject invalid productId', async () => {

        const login = await request(app)
            .post('/api/users/login')
            .send({
                email: 'john@example.com',
                password: 'mypassword'
            });

        const token = login.body.token;

        const response = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                items: [
                    {
                        productId: -1,
                        quantity: 2
                    }
                ]
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.errors)
            .toContain(
                'Item 1: productId must be a positive integer'
            );
    });


    // ---------------------------------------
    // SUCCESSFUL PRODUCT TEST
    // ---------------------------------------

    test('POST /api/products should create a product with valid token', async () => {

        const login = await request(app)
            .post('/api/users/login')
            .send({
                email: 'john@example.com',
                password: 'mypassword'
            });

        expect(login.statusCode).toBe(200);

        const token = login.body.token;

        const response = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Test Solar Panel',
                description: 'Automated test solar panel',
                price: 250000,
                stock: 10
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toHaveProperty(
            'message',
            'Product created successfully'
        );

        expect(response.body.product).toHaveProperty('id');
        expect(response.body.product.name).toBe('Test Solar Panel');
    });

    // ---------------------------------------
    // PRODUCT UPDATE TEST
    // ---------------------------------------

    test('PUT /api/products/:id should update a product with valid token', async () => {

        const login = await request(app)
            .post('/api/users/login')
            .send({
                email: 'john@example.com',
                password: 'mypassword'
            });

        expect(login.statusCode).toBe(200);

        const token = login.body.token;

        // Create a product first
        const created = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Product Before Update',
                description: 'Original description',
                price: 100000,
                stock: 5
            });

        expect(created.statusCode).toBe(201);

        const productId = created.body.product.id;

        // Update the product
        const response = await request(app)
            .put(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Product After Update',
                description: 'Updated description',
                price: 150000,
                stock: 20
            });

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty(
            'message',
            'Product updated successfully'
        );

        expect(response.body.product.name)
            .toBe('Product After Update');

        expect(Number(response.body.product.price))
            .toBe(150000);

        expect(response.body.product.stock)
            .toBe(20);
    });

    // ---------------------------------------
    // PRODUCT DELETE TEST
    // ---------------------------------------

    test('DELETE /api/products/:id should delete a product with valid token', async () => {

        const login = await request(app)
            .post('/api/users/login')
            .send({
                email: 'john@example.com',
                password: 'mypassword'
            });

        expect(login.statusCode).toBe(200);

        const token = login.body.token;

        // Create a product first
        const created = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Product To Delete',
                description: 'Temporary product',
                price: 50000,
                stock: 5
            });

        expect(created.statusCode).toBe(201);

        const productId = created.body.product.id;

        // Delete the product
        const response = await request(app)
            .delete(`/api/products/${productId}`)
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(200);

        expect(response.body).toHaveProperty(
            'message',
            'Product deleted successfully'
        );

        expect(response.body.product.id).toBe(productId);

        // Verify the product no longer exists
        const check = await request(app)
            .get(`/api/products/${productId}`);

        expect(check.statusCode).toBe(404);
    });

    // ---------------------------------------
    // SUCCESSFUL ORDER TEST
    // ---------------------------------------

    test('POST /api/orders should create an order with valid token', async () => {

        const login = await request(app)
            .post('/api/users/login')
            .send({
                email: 'john@example.com',
                password: 'mypassword'
            });

        expect(login.statusCode).toBe(200);

        const token = login.body.token;

        // Create a product
        const product = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Order Test Product',
                description: 'Product for order testing',
                price: 100000,
                stock: 10
            });

        expect(product.statusCode).toBe(201);

        const productId = product.body.product.id;

        // Create the order
        const response = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                items: [
                    {
                        productId,
                        quantity: 2
                    }
                ]
            });

        expect(response.statusCode).toBe(201);

        expect(response.body).toHaveProperty(
            'message',
            'Order created successfully'
        );

        expect(response.body.order).toHaveProperty('id');

        expect(response.body.order.status)
            .toBe('pending');

        expect(Number(response.body.order.totalAmount))
            .toBe(200000);

        expect(response.body.order.items[0].productId)
            .toBe(productId);

        expect(response.body.order.items[0].quantity)
            .toBe(2);
    });


    // ---------------------------------------
    // PAYMENT TESTS
    // ---------------------------------------

    test('GET /api/payments should reject missing token', async () => {

        const response = await request(app)
            .get('/api/payments');

        expect(response.statusCode).toBe(401);
    });

    // ---------------------------------------
    // SUCCESSFUL PAYMENT TEST
    // ---------------------------------------

    test('POST /api/payments should process payment successfully', async () => {

        const login = await request(app)
            .post('/api/users/login')
            .send({
                email: 'john@example.com',
                password: 'mypassword'
            });

        expect(login.statusCode).toBe(200);

        const token = login.body.token;

        // Create a product
        const product = await request(app)
            .post('/api/products')
            .set('Authorization', `Bearer ${token}`)
            .send({
                name: 'Payment Test Product',
                description: 'Product for payment testing',
                price: 75000,
                stock: 10
            });

        expect(product.statusCode).toBe(201);

        const productId = product.body.product.id;

        // Create an order
        const order = await request(app)
            .post('/api/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                items: [
                    {
                        productId,
                        quantity: 2
                    }
                ]
            });

        expect(order.statusCode).toBe(201);

        const orderId = order.body.order.id;

        expect(order.body.order.status)
            .toBe('pending');

        expect(Number(order.body.order.totalAmount))
            .toBe(150000);

        // Make payment
        const payment = await request(app)
            .post('/api/payments')
            .set('Authorization', `Bearer ${token}`)
            .send({
                orderId,
                paymentMethod: 'card'
            });

        expect(payment.statusCode).toBe(201);

        expect(payment.body).toHaveProperty(
            'message',
            'Payment successful'
        );

        expect(payment.body.payment).toHaveProperty('id');

        expect(payment.body.payment.order_id)
            .toBe(orderId);

        expect(payment.body.payment.status)
            .toBe('successful');

        expect(Number(payment.body.payment.amount))
            .toBe(150000);

        // Verify order is now paid
        const orders = await request(app)
            .get('/api/orders')
            .set('Authorization', `Bearer ${token}`);

        expect(orders.statusCode).toBe(200);

        const paidOrder = orders.body.orders.find(
            order => order.id === orderId
        );

        expect(paidOrder).toBeDefined();

        expect(paidOrder.status)
            .toBe('paid');
    });


afterAll(async () => {
    await pool.end();
  });


});
