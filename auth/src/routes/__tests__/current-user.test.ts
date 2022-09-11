import request from 'supertest';
import { app } from '../../app';

it('returns details of the current user', async () => {
  const cookie = await global.signin()

  const response = await request(app)
    .get('/api/users/currentuser')
    .set("Cookie", cookie)
    .send()
    .expect(200)
  return expect(response.body.currentUser.email).toEqual('test@test.com')
});

it('responds with null if not authenticated', async() => {
  const response = await request(app)
    .get('/api/users/currentuser')
    .send()
    .expect(200)
  return expect(response.body.currentUser).toBeNull()
})