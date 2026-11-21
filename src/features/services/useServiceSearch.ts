import { useState, useEffect, useCallback } from 'react';
import { searchServices } from '../../api/services';
import { showErrorToast } from '../../utils/toast';

export default function useServiceSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(async (term: string) => {
    if (!term || term.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setLoading(true);
    setIsSearching(true);
    try {
      const res = await searchServices(term.trim());
      setResults(res.data.content || []);
    } catch (e) {
      console.log('Error searching services:', e);
      showErrorToast('تعذر البحث عن الخدمات.',"خطا");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, performSearch]);

  const clearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setIsSearching(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    results,
    loading,
    isSearching,
    clearSearch,
  };
}