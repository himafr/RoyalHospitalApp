import { useState, useEffect, useCallback, useRef } from 'react';
import { showErrorToast } from '../utils/toast';

interface UseInfiniteScrollProps {
  fetchApi: (params: {
    page: number;
    size: number;
    specialty?: string;
  }) => Promise<any>;
  selectedSpec: string;
}

export default function useInfiniteScroll({
  fetchApi,
  selectedSpec,
}: UseInfiniteScrollProps) {
  const [data, setData] = useState<any[]>([]);

  const [page, setPage] = useState(0);

  const [loading, setLoading] = useState(false);

  const [loadingMore, setLoadingMore] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);

  const fetchData = useCallback(
    async (pageNum: number, isLoadMore = false) => {
      if (isLoadMore) {
        if (!hasMoreRef.current || loadingMoreRef.current) return;
        loadingMoreRef.current = true;
        setLoadingMore(true);
      } else {
        setLoading(true);
      }
      setError(null);

      try {
        const res = await fetchApi({
          page: pageNum,
          size: 3,
          specialty: selectedSpec || undefined,
        });
        const responseData = res.data;
        const content = responseData.content || []; 
        const isLast = responseData.last;

        if (isLoadMore) {
          setData(prev => [...prev, ...content]);
        } else {
          setData(content);
        }

        hasMoreRef.current = !isLast;
        setHasMore(!isLast);
        setPage(pageNum);
      } catch (caughtError) {
        console.log('Error fetching data:', caughtError);
        if (isLoadMore) {
          showErrorToast('تعذر تحميل المزيد. حاول مرة أخرى.');
        } else {
          setError('تحقق من اتصالك بالإنترنت ثم حاول مرة أخرى.');
        }
      } finally {
        setLoading(false);
        loadingMoreRef.current = false;
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [fetchApi, selectedSpec],
  );

  useEffect(() => {
    setPage(0);
    hasMoreRef.current = true;
    setHasMore(true);
    fetchData(0, false);
  }, [fetchData]);

  const loadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      fetchData(page + 1, true); 
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    setHasMore(true);
    fetchData(0, false); 
  };

  return {
    data,
    loading,
    loadingMore,
    hasMore,
    refreshing,
    error,
    loadMore,
    onRefresh,
  };
}
