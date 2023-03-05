import { TicketUpdatedEvent } from "@ticketszone/common"
import mongoose from "mongoose"
import { Message } from "node-nats-streaming"
import { Ticket } from "../../../models/ticket"
import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedListener } from "../ticket-updated-listener"

const setup = async () => {
  //create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'Concert',
    price: 2000
  });
  await ticket.save();

  //create a listener object
  const listener = new TicketUpdatedListener(natsWrapper.client);

  //create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    title: 'new concert',
    price: ticket.price,
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1
  }

  //create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, data, msg, ticket }
}

it('finds, updates, and saves a ticket', async () => {
  const { listener, data, msg, ticket } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const {listener, data, msg} = await setup();

  await listener.onMessage(data, msg)

  expect(msg.ack).toHaveBeenCalled();
});

it('does not ack the message if the ticket has a skipped version number', async () => {
  const { listener, data, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {
    return;
  };

  expect(msg.ack).not.toHaveBeenCalled();
})