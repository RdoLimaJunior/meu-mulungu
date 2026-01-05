import React, { useEffect, useState } from 'react';
import { Newspaper, ExternalLink, RefreshCw } from 'lucide-react';
import { NewsItem } from '../types';

export const NewsWidget: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch('/api/news');
      if (!response.ok) throw new Error('Falha ao carregar notícias');
      const data = await response.json();
      setNews(data.news);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  if (error) {
    return (
      <div className="bg-white p-4 rounded-xl border border-slate-100 text-center py-6">
        <p className="text-sm text-slate-400 mb-2">Não foi possível carregar as notícias.</p>
        <button 
          onClick={fetchNews}
          className="text-xs text-mulungu-600 font-bold uppercase flex items-center justify-center gap-1 mx-auto hover:underline"
        >
          <RefreshCw className="w-3 h-3" /> Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-1">
        <Newspaper className="w-4 h-4 text-mulungu-600" />
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Últimas do Município</h3>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {loading ? (
          // Skeletons
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm animate-pulse h-28 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="h-2 w-16 bg-slate-200 rounded"></div>
                <div className="h-4 w-full bg-slate-200 rounded"></div>
                <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
              </div>
            </div>
          ))
        ) : (
          news.slice(0, 3).map((item, index) => (
            <div 
              key={index} 
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-mulungu-200 transition-all group cursor-pointer"
              onClick={() => window.open(item.link, '_blank')}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold text-mulungu-600 bg-mulungu-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {item.category || 'Geral'}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {item.date}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-mulungu-700">
                  {item.title}
                </h4>
              </div>
              
              <div className="mt-3 flex items-center justify-end">
                <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 group-hover:text-mulungu-600">
                  Ler matéria <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};