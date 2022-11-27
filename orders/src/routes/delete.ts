import express, { Request, Response } from 'express';
import { requireAuth, NotFoundError, NotAuthorizedError } from '@ticketszone/common';
import { Order, OrderStatus } from '../models/order';

const router = express.Router();

router.delete('/api/orders/orderId', async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.orderId)

  if(!order) {
    return new NotFoundError()
  };

  if(order.userId !== req.currentUser!.id) {
    return new NotAuthorizedError()
  };

  order.status = OrderStatus.Cancelled

  //emit a cancelled order event

  res.status(204).send(order);
});

export { router as deleteOrderRouter };