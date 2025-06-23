export interface Product {
  id: string;
  name: string;
  description: string;
  quantity: number;
  price: number;
}

export interface Transaction {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  date: string;
  notes?: string;
}