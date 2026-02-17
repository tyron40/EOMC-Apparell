import HeroCarousel from '../components/HeroCarousel';
import PhotoGallery from '../components/PhotoGallery';
import CollectionsGrid from '../components/CollectionsGrid';
import VideoBillboard from '../components/VideoBillboard';
import ProductShowcase from '../components/ProductShowcase';
import Testimonials from '../components/Testimonials';
import VideoSection from '../components/VideoSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel - Full width hero images */}
      <HeroCarousel />

      {/* Photo Gallery - One row auto-playing slider */}
      <PhotoGallery />

      {/* New Arrivals - Product showcase with EOMC products */}
      <ProductShowcase />

      {/* Collections Grid - Category cards on black background */}
      <CollectionsGrid />

      {/* Auto-playing Video Section */}
      <VideoSection />

      {/* Video/Billboard Section - Full width brand showcase */}
      <VideoBillboard />

      {/* Testimonials - Customer reviews */}
      <Testimonials />
    </div>
  );
}
