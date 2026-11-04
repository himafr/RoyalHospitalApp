import { useCallback, useEffect, useRef, useState } from 'react';
import { BloodType, Patient } from '../../../types/user';
import { MedicalRecord } from '../../../types/medical';
import { getMedicalRecord, getPatient, updateBloodType, updateEmergencyContact } from '../../api/patient';

type UsePatientResult = {
  patient: Patient |null;
  medicalRecord: MedicalRecord | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  emergencyContactUpdate: (v:any) => Promise<void>;
  bloodTypeUpdate: (bloodType:BloodType) => Promise<void>;
};

export default function usePatient(): UsePatientResult {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 
  const [error, setError] = useState<Error | null>(null);

  const mountedRef = useRef<boolean>(true);

  async function emergencyContactUpdate(v: any) {
      setLoading(true);
      setError(null);
  
      try {
        await updateEmergencyContact(v);
      } catch (e) {
        if (mountedRef.current) setError(e as Error);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }
  async function bloodTypeUpdate(bloodType: BloodType) {
      setLoading(true);
      setError(null);
  
      try {
        await updateBloodType(bloodType);
      } catch (e) {
        if (mountedRef.current) setError(e as Error);
      } finally {
        if (mountedRef.current) setLoading(false);
      }
    }

  const fetchPatient = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const res = await getPatient();
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

  return { patient, loading, error, refetch: fetchPatient,medicalRecord ,emergencyContactUpdate,bloodTypeUpdate};
}