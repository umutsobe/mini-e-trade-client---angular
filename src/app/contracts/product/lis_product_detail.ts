import { List_Product_Image } from './list_product_image';

export class List_Product_Detail {
  id: string;
  name: string;
  stock: number;
  price: number;
  description: string;
  createdDate: Date;
  url: string;
  updatedDate: Date;
  productImageFiles?: List_Product_Image[]; //null gelebilir
}
