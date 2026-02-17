import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, X, Trash2, Plus } from 'lucide-react';
import { useEditMode } from '../context/EditModeContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import ImageUploadWithResize from './ImageUploadWithResize';
import { uploadImage } from '../lib/storage';

interface Collection {
  id: string;
  name: string;
  slug: string;
  image_url: string;
}

export default function CollectionsGrid() {
  const { user } = useAuth();
  const { isEditMode } = useEditMode();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      if (data && data.length > 0) {
        setCollections(data);
      }
    } catch (error) {
      console.error('Error fetching collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (collectionId: string) => {
    if (!confirm('Delete this collection? This will not delete products in this category.')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', collectionId);

      if (error) throw error;

      setCollections(collections.filter(c => c.id !== collectionId));
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert('Failed to delete collection');
    }
  };

  const handleSave = async () => {
    if (!editingCollection) return;

    if (!editingCollection.name || !editingCollection.slug || !editingCollection.image_url) {
      alert('Please fill in all required fields');
      return;
    }

    setSaving(true);
    try {
      if (isAddingNew) {
        const { data, error } = await supabase
          .from('categories')
          .insert([{
            name: editingCollection.name,
            slug: editingCollection.slug,
            image_url: editingCollection.image_url,
          }])
          .select()
          .single();

        if (error) throw error;

        if (data) {
          setCollections([...collections, data]);
        }
      } else {
        const { error } = await supabase
          .from('categories')
          .update({
            name: editingCollection.name,
            slug: editingCollection.slug,
            image_url: editingCollection.image_url,
          })
          .eq('id', editingCollection.id);

        if (error) throw error;

        setCollections(collections.map(c =>
          c.id === editingCollection.id ? editingCollection : c
        ));
      }

      setEditingCollection(null);
      setIsAddingNew(false);
    } catch (error) {
      console.error('Error saving collection:', error);
      alert('Failed to save collection');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (file: File, shouldResize: boolean) => {
    if (!editingCollection) return;

    setUploading(true);
    try {
      const url = await uploadImage(file, {
        resize: shouldResize,
        context: 'category'
      });
      setEditingCollection({ ...editingCollection, image_url: url });
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingCollection({
      id: '',
      name: '',
      slug: '',
      image_url: '',
    });
  };

  if (loading) {
    return (
      <section className="py-12 sm:py-16 md:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-12 w-64 bg-gray-700 animate-pulse mx-auto rounded mb-8" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="aspect-[4/3] bg-gray-700 animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (collections.length === 0) {
    if (isEditMode && user?.isAdmin) {
      return (
        <section className="py-12 sm:py-16 md:py-20 bg-black relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center p-12 border-2 border-dashed border-gray-600 rounded-lg">
              <h2 className="text-2xl font-bold text-white mb-4">No Collections</h2>
              <p className="text-gray-400 mb-6">
                Create product categories in the Product Manager to display them here.
              </p>
              <Link
                to="/admin/products"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Edit3 className="w-5 h-5" />
                Manage Categories
              </Link>
            </div>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-black relative">
      {isEditMode && user?.isAdmin && (
        <button
          onClick={handleAddNew}
          className="absolute top-4 right-4 z-20 p-3 bg-white hover:bg-gray-50 rounded-full shadow-lg transition-all hover:scale-110 border border-gray-200 group"
          title="Add New Collection"
        >
          <Plus className="w-5 h-5 text-black" />
          <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Add Collection
          </span>
        </button>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-8 sm:mb-10 md:mb-12">
          COLLECTIONS
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {collections.map((collection) => (
            <div key={collection.id} className="relative">
              <Link
                to={`/products?category=${collection.slug}`}
                className="relative group overflow-hidden rounded-lg aspect-[4/3] cursor-pointer block"
              >
                <img
                  src={collection.image_url}
                  alt={collection.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-wider px-2 text-center">
                    {collection.name}
                  </h3>
                </div>
              </Link>

              {isEditMode && user?.isAdmin && (
                <div className="absolute top-2 right-2 flex gap-2 z-10">
                  <button
                    onClick={() => {
                      setIsAddingNew(false);
                      setEditingCollection(collection);
                    }}
                    className="p-2 bg-white hover:bg-gray-100 rounded-full shadow-lg transition-all"
                    title="Edit collection"
                  >
                    <Edit3 className="w-4 h-4 text-black" />
                  </button>
                  <button
                    onClick={() => handleDelete(collection.id)}
                    className="p-2 bg-white hover:bg-red-50 rounded-full shadow-lg transition-all"
                    title="Delete collection"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {editingCollection && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">
                {isAddingNew ? 'Add New Collection' : 'Edit Collection'}
              </h3>
              <button
                onClick={() => {
                  setEditingCollection(null);
                  setIsAddingNew(false);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Collection Image</label>
                <ImageUploadWithResize
                  currentImageUrl={editingCollection.image_url}
                  context="category"
                  onFileSelect={handleImageUpload}
                  uploading={uploading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Collection Name</label>
                <input
                  type="text"
                  value={editingCollection.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setEditingCollection({ ...editingCollection, name, slug });
                  }}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., Sweaters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL Slug</label>
                <input
                  type="text"
                  value={editingCollection.slug}
                  onChange={(e) =>
                    setEditingCollection({ ...editingCollection, slug: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="e.g., sweaters"
                />
                <p className="text-sm text-gray-500 mt-1">
                  URL: /products?category={editingCollection.slug || 'slug'}
                </p>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setEditingCollection(null);
                  setIsAddingNew(false);
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving...' : isAddingNew ? 'Add Collection' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
