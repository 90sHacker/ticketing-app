import { Publisher, Subjects, TicketCreatedEvent } from '@ticketszone/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
};