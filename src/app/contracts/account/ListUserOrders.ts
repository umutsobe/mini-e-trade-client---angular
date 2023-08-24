import { ListUserOrderItems } from './ListUserOrderItems';

export class ListUserOrders {
  orderCode: string;
  createdDate: string;
  totalPrice: number;
  adress: string;
  orderItems: ListUserOrderItems[];
}
