export type User = {
  name: string;
  age: number;
  email: string;
  role: string;
  status: string;
};

export type Product = {
  name: string;
  price: number;
  category: string;
  stock: number;
  status: string;
};

export type Category = {
  name: string;
  brand: string;
  productCount: number;
  status: string;
};
