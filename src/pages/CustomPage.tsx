import { useEffect, useState } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Edit3 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useEditMode } from '../context/EditModeContext';
import ProductCard from '../components/ProductCard';

interface CustomPageData {
  id: string;
  slug: string;
  title: string;
  content: string;
  active: boolean;
  category_id?: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  image_url: string;
  category_id?: string;
}

export default function CustomPage() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { isEditMode } = useEditMode();
  const [page, setPage] = useState<CustomPageData | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadPage();
  }, [slug]);

  const loadPage = async () => {
    if (!slug) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('custom_pages')
        .select('*')
        .eq('slug', slug)
        .eq('active', true)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        setNotFound(true);
      } else {
        setPage(data);

        if (data.category_id) {
          await loadProducts(data.category_id);
        }
      }
    } catch (error) {
      console.error('Error loading page:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (data) {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (notFound || !page) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 relative">
          {isEditMode && user?.isAdmin && (
            <Link
              to={`/admin/settings`}
              className="absolute top-4 right-4 p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-all hover:scale-110 border border-gray-200 group"
              title="Edit Page Settings"
            >
              <Edit3 className="w-5 h-5 text-black" />
              <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                Edit Page
              </span>
            </Link>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">{page.title}</h1>

          {page.content && (
            <div
              className="prose prose-lg max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          )}

          {products.length > 0 && (
            <div className="mt-8 sm:mt-12">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}

          {isEditMode && user?.isAdmin && products.length === 0 && !page.category_id && (
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Tip:</strong> To display products on this page, go to Admin Settings and assign a category to this page.
                Products from that category will automatically appear here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
