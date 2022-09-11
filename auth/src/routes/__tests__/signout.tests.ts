import request from 'supertest';
import { app } from '../../app';

it('clears cookies on signout', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: "test@test.com",
      password: "password"
    })
    .expect(201)

  const response = await request(app)
    .post('/api/users/signout')
    .send({})
  return expect(response.get('Set-Cookie')).toBeUndefined();
})