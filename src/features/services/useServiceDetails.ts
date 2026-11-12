import { useState, useEffect, useCallback } from 'react';
import { getServiceById } from '../../api/services';
import { showErrorToast } from '../../utils/toast';
import { ServiceFeatures } from '../../../types/sub';

export default function useServiceDetails(serviceId: number) {
  const [service, setService] = useState<any>(null);
  const [serviceFeatures, setServiceFeatures] = useState<ServiceFeatures[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchService = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getServiceById(serviceId);
      setService(res.data.service); 
      setServiceFeatures(res.data.features); 
    } catch (e) {
      console.log('Error fetching service:', e);
      showErrorToast('تعذر تحميل بيانات الخدمة.');
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  return { service, loading, refetch: fetchService ,serviceFeatures};
}