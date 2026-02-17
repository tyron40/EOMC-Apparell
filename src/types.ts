export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  category_id: string;
  image_url: string;
  images: string[];
  sizes: string[];
  is_featured: boolean;
  stock_quantity: number;
  low_stock_threshold: number;
  is_available: boolean;
  image_fit: 'contain' | 'cover' | 'fill';
  position_x: number;
  position_y: number;
  zoom: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  image_fit: 'contain' | 'cover' | 'fill';
  position_x: number;
  position_y: number;
  zoom: number;
  created_at: string;
}

export interface CartItem {
  id: string;
  session_id: string;
  product_id: string;
  size: string;
  quantity: number;
  product?: Product;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  items: Array<{
    product_id: string;
    product_name: string;
    size: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: string;
  tracking_number?: string;
  carrier?: string;
  shipping_date?: string;
  label_url?: string;
  shipping_notes?: string;
  weight?: number;
  dimensions?: {
    length?: number;
    width?: number;
    height?: number;
  };
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  isAdmin: boolean;
}
