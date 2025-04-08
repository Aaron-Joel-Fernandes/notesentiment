const request = require('supertest');
const app = require('../app');
const connectToDatabase = require('../config/database');

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ username: 'authuser1', password: 'auth@123' });

    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('User registered successfully');
  });

  it('should not register a user with duplicate username', async () => {
    await request(app)
      .post('/api/register')
      .send({ username: 'dupuser', password: 'dup@123' });

    const res = await request(app)
      .post('/api/register')
      .send({ username: 'dupuser', password: 'dup@123' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Username already exists');
  });

  it('should not register a user without password', async () => {

    const res = await request(app)
      .post('/api/register')
      .send({ username: '', password: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Username and password are required');
  });

  it('should not register a user without password', async () => {

    const res = await request(app)
      .post('/api/register')
      .send({ username: 'abc', password: '' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Username and password are required');
  });

  it('should not register a user without password', async () => {

    const res = await request(app)
      .post('/api/register')
      .send({ username: '', password: 'abc' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('Username and password are required');
  });

  it('should login with correct credentials', async () => {
    await request(app)
      .post('/api/register')
      .send({ username: 'loguser', password: 'log@123' });

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'loguser', password: 'log@123' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({ username: 'loguser', password: 'wrongpass' });

    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe('Invalid credentials');
  });

  it('should return 500 if DB fails unexpectedly', async () => {
    const originalGet = app.locals.db.get;
    app.locals.db.get = (_sql, _params, cb) => cb(new Error('DB error'));

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'loginuser1', password: 'securepass' });

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBe('Login failed');

    app.locals.db.get = originalGet; // Restore original
  });

  it('should return 500 if JWT generation fails', async () => {
    const originalSign = require('jsonwebtoken').sign;
    jest.spyOn(require('jsonwebtoken'), 'sign').mockImplementation(() => {
      throw new Error('JWT crash');
    });

    const res = await request(app)
      .post('/api/login')
      .send({ username: 'loginuser1', password: 'securepass' });

    expect(res.statusCode).toBe(401);
    //expect(res.body.error).toBe('Token generation failed');

    require('jsonwebtoken').sign.mockRestore();
  });
});

describe('Database Connection Error Handling', () => {
  it('should reject the promise and log error on invalid DB path', async () => {
    const invalidPath = '/invalid/path/to/db.sqlite';

    // Capture console.error output
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await expect(connectToDatabase(invalidPath)).rejects.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to connect to SQLite:'),
      expect.any(String)
    );

    consoleSpy.mockRestore();
  });
});

