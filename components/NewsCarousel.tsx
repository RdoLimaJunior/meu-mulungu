import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ExternalLink, Loader2, ChevronRight } from 'lucide-react';
import { NewsItem } from '../types';
import { getNewsImage } from '../lib/news-images';

export const NewsCarousel: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Embla Carousel Setup with Autoplay
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Falha');
      const data = await response.json();
      setNews(data.news);
    } catch (err) {
      console.error(err);
      // Keep empty to show nothing or fallback if needed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', onSelect);
  }, [emblaApi, onSelect]);

  if (loading) {
    return (
      <div className="w-full h-48 md:h-64 rounded-2xl bg-slate-200 animate-pulse flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
      </div>
    );
  }

  if (news.length === 0) return null;

  return (
    <div className="relative group rounded-2xl overflow-hidden shadow-lg border border-slate-100">
      
      {/* Embla Viewport */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {news.map((item, index) => {
            const bgImage = getNewsImage(item.category);
            
            return (
              <div 
                key={index} 
                className="relative flex-[0_0_100%] min-w-0 h-48 md:h-64 cursor-pointer"
                onClick={() => window.open(item.link, '_blank')}
              >
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />
                
                {/* Dark Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-5 md:p-8 flex flex-col justify-end h-full">
                  <div className="mb-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-mulungu-600/90 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm shadow-sm border border-white/20">
                      {item.category || 'Destaque'}
                    </span>
                  </div>
                  
                  <h3 className="text-lg md:text-2xl font-bold text-white leading-tight mb-2 line-clamp-2 drop-shadow-sm">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">{item.date}</span>
                    <button className="text-xs font-bold text-white flex items-center gap-1 hover:text-mulungu-300 transition-colors">
                      Ler Notícia <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-3 right-4 flex gap-1.5 z-10">
        {news.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              index === selectedIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
            }`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};