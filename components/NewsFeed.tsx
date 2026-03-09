import React, { useState, useMemo } from 'react';
import { NewsArticle } from '../types';
import { MapPin, ExternalLink, Calendar, Search, Filter } from 'lucide-react';

interface NewsFeedProps {
  articles: NewsArticle[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ articles }) => {
  const [selectedLocation, setSelectedLocation] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const locations = useMemo(() => {
    const locs = new Set(articles.map(a => a.location));
    return ['All', ...Array.from(locs).sort()];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesLocation = selectedLocation === 'All' || article.location === selectedLocation;
      const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            article.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLocation && matchesSearch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [articles, selectedLocation, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-black text-[#1A1A1A] mb-4 tracking-tight uppercase">
          Infrastructure News
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
          Stay updated with the latest infrastructure developments, tracking projects across the Philippines through trusted local networks.
        </p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 mb-8 justify-between items-center sticky top-24 z-30">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent focus:border-[#8B3A2B] focus:ring-2 focus:ring-[#8B3A2B]/20 rounded-xl transition-all outline-none font-medium placeholder-gray-400"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Filter className="w-5 h-5 text-gray-400" />
          <span className="font-semibold text-gray-700 whitespace-nowrap">Location:</span>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full sm:w-auto">
            {locations.map(loc => (
              <button
                key={loc}
                onClick={() => setSelectedLocation(loc)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedLocation === loc 
                    ? 'bg-[#8B3A2B] text-white shadow-md shadow-[#8B3A2B]/20' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {loc}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-400">No articles found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or location filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map(article => (
            <a 
              key={article.id} 
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full cursor-pointer"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/95 backdrop-blur-sm text-[#8B3A2B] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm flex items-center gap-1.5 border border-white/20">
                    <MapPin className="w-3 h-3" />
                    {article.location}
                  </span>
                </div>
                <div className="absolute top-4 right-4">
                  <span className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-white/10">
                    {article.network}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#8B3A2B] transition-colors line-clamp-2 leading-tight">
                  {article.title}
                </h3>
                
                <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-grow">
                  {article.summary}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-500 font-medium">
                    <Calendar className="w-4 h-4 mr-1.5" />
                    {new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#8B3A2B] transition-colors">
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsFeed;
