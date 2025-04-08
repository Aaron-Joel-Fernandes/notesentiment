const request = require('supertest');
const app = require('../app');
const connectToDatabase = require('../config/database');
let token = '';
let noteId = '';
let noteId1 = '';
let noteId2 = '';
beforeAll(async () => {
  await request(app)
    .post('/api/register')
    .send({ username: 'noteuser', password: 'note@123' });

  const res = await request(app)
    .post('/api/login')
    .send({ username: 'noteuser', password: 'note@123' });

  token = res.body.token;
});

describe('Note Routes', () => {
  it('should create a new note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('token', `${token}`)
      .send({ title: 'Note Title', note: 'This is a valid note content.' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    noteId = res.body.id;
  });

  it('should create a +ve note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('token', `${token}`)
      .send({ title: 'Note Title Happy', note: 'This is a happy note content.' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    noteId1 = res.body.id;
  });

  it('should create a -ve note', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('token', `${token}`)
      .send({ title: 'Note Title sad', note: 'This is a sad note content.' });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
    noteId2 = res.body.id;
  });

  it('should not create note with invalid data', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('token', `${token}`)
      .send({ title: '', note: 'short' });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/at least 10 characters/i);
  });

  it('should not create note with invalid data', async () => {
    const res = await request(app)
      .post('/api/notes')
      .set('token', `${token}`)
      .send({ title: '', note: 'shortten chars' });

    expect(res.statusCode).toBe(400);
  });

  it('should fetch all notes', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('token', `${token}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should return 500 if DB error occurs during sentiment fetch', async () => {
    const originalGet = app.locals.db.get;
  
    app.locals.db.get = function (_q, _p, cb) {
      cb(new Error('Simulated DB fetch failure'));
    };
  
    const res = await request(app)
      .get('/api/1/analyze')
      .set('token', `${token}`);
  
    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error.toLowerCase()).toContain('database');
  
    app.locals.db.get = originalGet;
  });

  it('should analyze sentiment of a note', async () => {
    const res = await request(app)
      .get(`/api/${noteId}/analyze`)
      .set('token', `${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('sentiment');
    expect(res.body).toHaveProperty('score');
  });

  it('should analyze sentiment of a note', async () => {
    const res = await request(app)
      .get(`/api/${noteId1}/analyze`)
      .set('token', `${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('sentiment');
    expect(res.body).toHaveProperty('score');
  });

  it('should analyze sentiment of a note', async () => {
    const res = await request(app)
      .get(`/api/${noteId2}/analyze`)
      .set('token', `${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('sentiment');
    expect(res.body).toHaveProperty('score');
  });

  it('should return 404 for non-existent note analysis', async () => {
    const res = await request(app)
      .get('/api/99999/analyze')
      .set('token', `${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe('Note not found');
  });

  it('should return 403 for missing token', async () => {
    const res = await request(app)
      .get('/api/notes');

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('should return 403 for malformed token', async () => {
    const res = await request(app)
      .get('/api/notes')
      .set('token', `InvalidToken`);

    expect(res.statusCode).toBe(403);
    expect(res.body.error).toBe('Unauthorized');
  });

  it('should return 404 when note does not exist for sentiment analysis', async () => {
    const res = await request(app)
      .get('/api/99999/analyze')
      .set('token', `${token}`);
  
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
    expect(res.body.error.toLowerCase()).toContain('note not found');
  });
});

