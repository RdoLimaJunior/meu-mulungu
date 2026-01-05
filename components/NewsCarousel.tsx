import React, { useEffect, useState, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Loader2, ExternalLink } from 'lucide-react';
import { getNewsImage } from '../lib/news-images';

interface NewsItem {
  id: number;
  title: string;
  category: string;
  date: string;
  link: string;
  imageUrl?: string | null;
}

const FALLBACK_NEWS: NewsItem[] = [
  { 
    id: 183, 
    title: "Prefeitura de Mulungu realiza licitação para concessão de quiosques em pontos turísticos da cidade", 
    category: "Administração", 
    date: "Há 34 dias", 
    link: "https://www.mulungu.ce.gov.br/informa/183/prefeitura-de-mulungu-realiza-licita-o-para-conces",
    imageUrl: "https://www.mulungu.ce.gov.br/fotos/183/Img0_600x400.jpg"
  },
  { 
    id: 181, 
    title: "Mulungu conquista o Selo TCE Ceará Sustentável", 
    category: "MeioAmbiente", 
    date: "Há 46 dias", 
    link: "https://www.mulungu.ce.gov.br/informa/181/mulungu-conquista-o-selo-tce-cear-sustent-vel",
    imageUrl: "https://www.mulungu.ce.gov.br/fotos/181/Capa181.jpg"
  },
  { 
    id: 180, 
    title: "6° CONFERÊNCIA MUNICIPAL DAS CIDADES", 
    category: "Desenvolvimento", 
    date: "Há 205 dias", 
    link: "https://www.mulungu.ce.gov.br/informa/180/6-confer-ncia-municipal-das-cidades",
    imageUrl: "https://filesystem.assesi.com.br/capa/173/180/051e06498ade9579ff26e7a2a9213822"
  },
  { 
    id: 179, 
    title: "Festa Anual das Árvores 2025 em Mulungu: Por um Ceará Mais Verde e Sustentável", 
    category: "MeioAmbiente", 
    date: "Há 282 dias", 
    link: "https://www.mulungu.ce.gov.br/informa/179/festa-anual-das-rvores-2025-em-mulungu-por-um-cear",
    imageUrl: "https://filesystem.assesi.com.br/capa/173/179/cf18655dae5ba2b544d530cb24f1aee4"
  },
  { 
    id: 178, 
    title: "Mulungu realiza a 1ª Corrida de Rua na Semana do Município", 
    category: "Esporte", 
    date: "Há 296 dias", 
    link: "https://www.mulungu.ce.gov.br/informa/178/mulungu-realiza-a-1-corrida-de-rua-na-semana-do-mu",
    imageUrl: "https://filesystem.assesi.com.br/capa/173/178/db31c846ee2a38819bb0c1354b6b68ba"
  }
];

export const NewsCarousel: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    const loadNews = async () => {
      try {
        const response = await fetch('/api/news');
        if (!response.ok) throw new Error(`API Error: ${response.status}`);
        const data = await response.json();
        if (mounted) {
          const validNews = data.news && data.news.length > 0 ? data.news : FALLBACK_NEWS;
          setNews(validNews);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setNews(FALLBACK_NEWS);
          setLoading(false);
        }
      }
    };
    loadNews();
    return () => { mounted = false; };
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
      <div className="w-full h-48 md:h-64 rounded-3xl bg-slate-100 animate-pulse flex items-center justify-center border border-slate-200 mb-8">
        <Loader2 className="w-6 h-6 text-slate-300 animate-spin" />
      </div>
    );
  }

  if (news.length === 0) return null;

  return (
    <div className="mb-8 w-full group animate-fade-in">
      <div className="flex justify-between items-end mb-3 px-2">
        <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Destaques</h2>
      </div>
      
      {/* Increased Border Radius to 3xl to match header/weather widget style */}
      <div className="overflow-hidden rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 bg-white" ref={emblaRef}>
        <div className="flex">
          {news.map((item, index) => {
            const bgImage = item.imageUrl || getNewsImage(item.category);
            return (
              <div 
                key={item.id || index} 
                className="relative flex-[0_0_100%] min-w-0 h-48 md:h-64 cursor-pointer"
                onClick={() => window.open(item.link, '_blank')}
                role="button"
                tabIndex={0}
                aria-label={`Ler notícia: ${item.title}`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                  style={{ backgroundImage: `url(${bgImage})` }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end h-full z-10">
                  <div className="mb-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-mulungu-600/90 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur-sm shadow-sm border border-white/10">
                      {item.category}
                    </span>
                  </div>
                  
                  <h3 className="text-lg md:text-2xl font-bold text-white leading-tight mb-2 line-clamp-2 drop-shadow-md">
                    {item.title}
                  </h3>
                  
                  <div className="flex items-center gap-3 text-xs text-slate-300 font-medium mt-1">
                    <span>{item.date}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                    <span className="flex items-center gap-1 hover:text-white transition-colors">
                      Ler notícia <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-4">
        {news.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
              index === selectedIndex ? 'w-8 bg-mulungu-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
            }`}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
            aria-label={`Ir para notícia ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};