import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const category = searchParams.get('category');

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    setLoading(true);
    let query = supabase.from('products').select('*');

    if (category) {
      const { data: categoryData } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', category)
        .maybeSingle();

      if (categoryData) {
        query = query.eq('category_id', categoryData.id);
      }
    }

    const { data } = await query.order('created_at', { ascending: false });

    if (data) {
      setProducts(data);
    }
    setLoading(false);
  };

  const categoryTitle = category
    ? category.charAt(0).toUpperCase() + category.slice(1)
    : 'All Products';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">{categoryTitle}</h1>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg">No products found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onUpdate={loadProducts} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
