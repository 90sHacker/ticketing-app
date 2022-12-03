import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { Order, OrderStatus } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('returns an error if a ticket does not exist', async () => {
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId})
    .expect(404)
}, 30000);

it('returns an error if the ticket is already reserved', async () => {
  const ticket = Ticket.build({
    title: 'USA v England 2022',
    price: 3000
  })
  await ticket.save()

  const order = Order.build({
    userId: 'u001',
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket
  })
  await order.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(400)
});

it('reserves a ticket', async () => {
  const ticket = Ticket.build({
    title: 'Japan v Germany 2022',
    price: 3000
  });
  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(201)
})

it('emits an order created event', async () => {
  const ticket = Ticket.build({
    title: 'Japan v Germany 2022',
    price: 3000
  });
  await ticket.save()

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ticketId: ticket.id})
    .expect(201)

  expect(natsWrapper.client.publish).toHaveBeenCalled();
})