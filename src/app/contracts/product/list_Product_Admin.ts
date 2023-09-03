import { List_Product_Image } from './list_product_image';

export class List_Product_Admin {
  id: string;
  name: string;
  stock: number;
  price: number;
  createdDate: Date;
  url: string;
  updatedDate: Date;
  productImageFiles?: List_Product_Image[]; //null gelebilir
  imagePath?: string;
  //admin
  isActive: boolean;
  description: string;
  totalBasketAdded: number;
  totalOrderNumber: number;
}
