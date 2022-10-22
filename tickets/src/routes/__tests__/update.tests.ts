import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';

it('returns a 404 if the provided ticket id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Rolling Loud 2022',
      price: 480
    })
    .expect(404)
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: 'Rolling Loud 2022',
      price: 480
    })
    .expect(401)
});

it('returns a 401 if the user does not own a ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({
      title: 'Rolling Loud 2022',
      price: 480
    })
    .expect(201)
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'Rolling Loud 2023',
      price: 1000
    })
    .expect(401)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

  //check if the ticket props remain unchanged
  expect(ticketResponse.body.title).toEqual('Rolling Loud 2022');
  expect(ticketResponse.body.price).toEqual(480)
});

it('returns a 400 if the user does provides an invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets/')
    .set('Cookie', cookie)
    .send({
      title: 'Rolling Loud 2022',
      price: 480
    })
    .expect(201)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 1000
    })
    .expect(400)
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Rolling Loud 2023',
      price: -100
    })
    .expect(400)
});
it('updates a ticket with valid title and price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({
      title: 'Rolling Loud 2022',
      price: 480
    })
    .expect(201)
  
  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'Rolling Loud 2023',
      price: 1000
    })
    .expect(200)

    const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200)

  //check if the ticket props are changed
  expect(ticketResponse.body.title).toEqual('Rolling Loud 2023');
  expect(ticketResponse.body.price).toEqual(1000)

});