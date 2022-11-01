import { Publisher, Subjects, TicketUpdatedEvent } from '@ticketszone/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
};