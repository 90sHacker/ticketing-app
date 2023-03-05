import { TicketCreatedListener } from "../ticket-created-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketCreatedEvent } from "@ticketszone/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";


const setup = async () => {
  // create an instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client)

  // mimick a data event
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 2000,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0
  }

  // mimick a message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return {listener, data, msg}
}


it('creates a ticket and saves it', async () => {
  const {listener, data, msg } = await setup();
  // call the onMessage funtion with the data and message object
  await listener.onMessage(data, msg);

  // assert that the ticket is created
  const ticket = await Ticket.findById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it('acks the message', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled();
})