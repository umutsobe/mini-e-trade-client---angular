import { Create_Order_Item } from './create_order_item';

export class Create_Order {
  userId: string;
  address: string;
  description: string;
  orderItems: Create_Order_Item[];
}

// public string UserId { get; set; }
// public string Description { get; set; }
// public string Address { get; set; }
// public List<OrderItem> OrderItems { get; set; }
