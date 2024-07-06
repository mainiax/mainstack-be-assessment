import { SoftDeleteDocument } from "mongoose-delete";

export interface IProduct extends SoftDeleteDocument {
  name: string;
  price: number;
  category: string;
  description?: string;
  stock: number;
  imageUrl: string;
  user: string;
}

export type IProductPayload = Pick<
  IProduct,
  "name" | "price" | "category" | "description" | "stock"
> & { image: File };
