import { Publisher, OrderCancelledEvent, Subjects } from "@ticketszone/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled;
}