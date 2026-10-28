import { useState, useEffect, useCallback } from 'react';

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

  const fetchData = useCallback(
    async (pageNum: number, isLoadMore = false) => {
      if (isLoadMore) {
        if (!hasMore || loadingMore) return;
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        await new Promise(resolve => setTimeout(resolve, 3000));

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

        setHasMore(!isLast);
        setPage(pageNum);
      } catch (error) {
        console.log('Error fetching data:', error);
        if (!isLoadMore) setData([]);
      } finally {
        setLoading(false);
        setLoadingMore(false);
        setRefreshing(false);
      }
    },
    [fetchApi, selectedSpec, hasMore, loadingMore],
  );

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchData(0, false);
  }, [selectedSpec]);

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
    loadMore,
    onRefresh,
  };
}
