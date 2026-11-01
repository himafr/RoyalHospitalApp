import { useCallback, useEffect, useRef, useState } from 'react';
import { getMedicalRecord, getPatient } from '../api/patient';
import { Patient } from '../../types/user';
import { MedicalRecord } from '../../types/medical';

type UsePatientResult = {
  patient: Patient |null;
  medicalRecord: MedicalRecord | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
};

export default function usePatient(): UsePatientResult {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<Error | null>(null);

  const mountedRef = useRef<boolean>(true);

  const fetchPatient = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const res = await getPatient();
      console.log(res)
      if (mountedRef.current) setPatient(res.data);
    } catch (e) {
      if (mountedRef.current) setError(e as Error);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);
  const fetchMedicalRecord = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const res = await getMedicalRecord();
      console.log(res)
      if (mountedRef.current) setMedicalRecord(res.data);
    } catch (e) {
      if (mountedRef.current) setError(e as Error);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    fetchPatient();
    fetchMedicalRecord();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchPatient,fetchMedicalRecord]);

  return { patient, loading, error, refetch: fetchPatient,medicalRecord };
}