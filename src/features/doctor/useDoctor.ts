import { useCallback, useEffect, useRef, useState } from 'react';
import { Doctor } from '../../../types/user';
import { doctorUpdate, getDoctor } from '../../api/doctors';
import {
  certificationAdd,
  certificationDelete,
  editCertificationById,
} from '../../api/certification';
import { Certification } from '../../../types/sub';
import type { Asset } from 'react-native-image-picker';

interface UseDoctorResult {
  doctor: Doctor | null;
  // medicalRecord: MedicalRecord | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  addCertification: (
    data: Record<string, unknown>,
    photo?: Asset | null,
  ) => Promise<void>;
  editDoctorCareer: (v: any) => Promise<void>;
  getCertificationById: (id: number) => Certification;
  editCertification: ({
    id,
    fData,
  }: {
    id: number;
    fData: Record<string, unknown>;
    photo?: Asset | null;
  }) => Promise<void>;
  deleteCertificationById: (id: number) => Promise<void>;
  // bloodTypeUpdate: (bloodType:BloodType) => Promise<void>;
}

export default function useDoctor(): UseDoctorResult {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const mountedRef = useRef<boolean>(true);

  const fetchDoctor = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      const res = await getDoctor();
      if (mountedRef.current) setDoctor(res.data);
    } catch (e) {
      if (mountedRef.current) setError(e as Error);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  async function editDoctorCareer({ data }: { data: any }) {
    setLoading(true);
    setError(null);

    try {
      await doctorUpdate(data);
    } catch (e) {
      if (mountedRef.current) setError(e as Error);
      throw e;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }

  const getCertificationById = useCallback(
    (id: number) =>
      doctor?.certifications.find((certification: any) => certification.id === id) as Certification,
    [doctor],
  );

  async function editCertification({
    id,
    fData,
    photo,
  }: {
    id: number;
    fData: Record<string, unknown>;
    photo?: Asset | null;
  }) {
    setLoading(true);
    setError(null);

    try {
      await editCertificationById({ id, data: fData, photo });
    } catch (e) {
      if (mountedRef.current) setError(e as Error);
      throw e;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }
  async function addCertification(
    data: Record<string, unknown>,
    photo?: Asset | null,
  ) {
    setLoading(true);
    setError(null);

    try {
      await certificationAdd(data, photo);
    } catch (e) {
      if (mountedRef.current) setError(e as Error);
      throw e;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }
  async function deleteCertificationById(id: number) {
    setLoading(true);
    setError(null);

    try {
      await certificationDelete({ id });
    } catch (e) {
      if (mountedRef.current) setError(e as Error);
      throw e;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }

  useEffect(() => {
    mountedRef.current = true;
    fetchDoctor();
    // fetchMedicalRecord();
    return () => {
      mountedRef.current = false;
    };
  }, [fetchDoctor]);

  return {
    doctor,
    loading,
    error,
    refetch: fetchDoctor,
    addCertification,
    deleteCertificationById,
    getCertificationById,
    editCertification,
    editDoctorCareer,
  };
}
