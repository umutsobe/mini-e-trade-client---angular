import { Create_Order_Item } from './create_order_item';

export class Create_Order {
  userId: string;
  address: string;
  description: string;
  orderItems: Create_Order_Item[];
}
