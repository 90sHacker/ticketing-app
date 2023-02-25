import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async () => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20
  });
  await ticket.save()

  return ticket
}

it('gets a list of tickets for a specific user', async () => {
  //create three tickets
  const ticketOne = await buildTicket();
  const ticketTwo = await buildTicket();
  const ticketThree = await buildTicket();

  //create two users, and associate separate tickets with them
  const userOne = global.signin()
  const userTwo = global.signin()

  const { body: orderOne} = await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ticketId: ticketOne.id})
    .expect(201)

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ticketId: ticketTwo.id})
    .expect(201)

  const { body: orderThree} = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ticketId: ticketThree.id})
    .expect(201)

  //make a request to get the tickets for a user
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .send()
    .expect(200)

  expect(response.body.length).toEqual(2)
  expect(response.body[0].id).toEqual(orderTwo.id)
  expect(response.body[1].id).toEqual(orderThree.id)
})