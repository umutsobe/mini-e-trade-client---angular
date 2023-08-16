import { Single_Order_Order_Item } from './single-order-order-item';

export class SingleOrder {
  address: string;
  orderItems: Single_Order_Order_Item[];
  createdDate: Date;
  description: string;
  id: string;
  orderCode: string;
}
