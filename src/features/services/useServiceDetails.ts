import { useState, useEffect, useCallback } from 'react';
import { getServiceById } from '../../api/services';
import { showErrorToast } from '../../utils/toast';
import { ServiceFeatures } from '../../../types/sub';
import { useTheme } from '../../context/ModeContext';

export default function useServiceDetails(serviceId: number) {
  const { t } = useTheme();
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
      showErrorToast(t('err_network'), t('error'));
    } finally {
      setLoading(false);
    }
  }, [serviceId, t]);

  useEffect(() => {
    fetchService();
  }, [fetchService]);

  return { service, loading, refetch: fetchService ,serviceFeatures};
}