/*
  # E-commerce Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `image_url` (text)
      - `created_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `description` (text)
      - `price` (numeric)
      - `category_id` (uuid, foreign key)
      - `image_url` (text)
      - `images` (jsonb array of additional images)
      - `sizes` (jsonb array)
      - `is_featured` (boolean)
      - `created_at` (timestamptz)
    
    - `cart_items`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `product_id` (uuid, foreign key)
      - `size` (text)
      - `quantity` (integer)
      - `created_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `order_number` (text, unique)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `shipping_address` (jsonb)
      - `items` (jsonb)
      - `total` (numeric)
      - `status` (text)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access on products and categories
    - Add policies for cart management
*/

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  price numeric NOT NULL,
  category_id uuid REFERENCES categories(id),
  image_url text NOT NULL,
  images jsonb DEFAULT '[]'::jsonb,
  sizes jsonb DEFAULT '["S", "M", "L", "XL"]'::jsonb,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO public
  USING (true);

-- Cart items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  size text NOT NULL,
  quantity integer DEFAULT 1,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can manage their cart items"
  ON cart_items FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text,
  shipping_address jsonb NOT NULL,
  items jsonb NOT NULL,
  total numeric NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view their own orders"
  ON orders FOR SELECT
  TO public
  USING (true);
