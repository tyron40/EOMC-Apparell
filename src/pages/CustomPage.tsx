import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface CustomPageData {
  id: string;
  slug: string;
  title: string;
  content: string;
  active: boolean;
}

export default function CustomPage() {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CustomPageData | null>(null);
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
      }
    } catch (error) {
      console.error('Error loading page:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{page.title}</h1>
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </div>
    </div>
  );
}
