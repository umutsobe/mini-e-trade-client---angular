import { Image } from './image';

export class List_Product_Detail {
  id: string;
  name: string;
  stock: number;
  price: number;
  description: string;
  createdDate: Date;
  url: string;
  updatedDate: Date;
  averageStar: number;
  totalRatingNumber: number;
  productImageFiles?: Image[]; //null gelebilir
}
