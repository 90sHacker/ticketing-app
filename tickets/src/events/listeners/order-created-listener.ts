import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@ticketszone/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { NotFoundError } from "@ticketszone/common";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    // find the ticket that needs to be reserved by the order
    const ticket = await Ticket.findById(data.ticket.id);
    //handle ticket not found
    if(!ticket) {
      throw new NotFoundError();
    }
    //set the orderId on the ticket to reserve it, and save the ticket
    ticket.set({orderId: data.id});
    await ticket.save();
    //ack the message
    msg.ack();
  }
}