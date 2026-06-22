export type Product = {
  id: number;
  title: string;
  price: number;
  category?: string;
  image?: string;
  images?: string[];
  description?: string;
  stock?: number;
  availabilityStatus?: string;
  discountPercentage?: number;
};
