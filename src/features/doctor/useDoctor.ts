import { useCallback, useEffect, useRef, useState } from "react";
import { Doctor } from "../../../types/user";
import { getDoctor } from "../../api/doctors";
import { certificationAdd, certificationDelete, editCertificationById } from "../../api/certification";
import { Certification } from "../../../types/sub";

interface UseDoctorResult {
    doctor: Doctor |null;
    // medicalRecord: MedicalRecord | null;
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    addCertification: (v:any) => Promise<void>;
    getCertificationById: (id:number) => Certification;
    editCertification: ({id,fData}:{id:number;fData:any}) => Promise<void>;
    deleteCertificationById: (id:number) => Promise<void>;
    // bloodTypeUpdate: (bloodType:BloodType) => Promise<void>;

}

export default function useDoctor():UseDoctorResult {
    const [doctor, setDoctor] = useState<Doctor | null>(null);
    const [loading, setLoading] = useState<boolean>(true); 
    const [error, setError] = useState<Error | null>(null);
    
    const mountedRef = useRef<boolean>(true);
    
    
    function getCertificationById(id:number){
      
      return  doctor?.certifications.find((c: any) => c.id === id) as Certification;
    }
    
    
      async function editCertification({id,fData}:{id:number,fData:any}) {
          setLoading(true);
          setError(null);
      
          try {
           await editCertificationById({id,data:fData});
          } catch (e) {
            if (mountedRef.current) setError(e as Error);
          } finally {
            if (mountedRef.current) setLoading(false);
          }
        }
      async function addCertification(v: any) {
          setLoading(true);
          setError(null);
      
          try {
         await certificationAdd(v);
          } catch (e) {
            if (mountedRef.current) setError(e as Error);
          } finally {
            if (mountedRef.current) setLoading(false);
          }
        }
      async function deleteCertificationById(id:number) {
          setLoading(true);
          setError(null);
      
          try {
            await certificationDelete({id});
          } catch (e) {
            if (mountedRef.current) setError(e as Error);
          } finally {
            if (mountedRef.current) setLoading(false);
          }
        }
    
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
    
    //   const fetchMedicalRecord = useCallback(async (): Promise<void> => {
    //     setLoading(true);
    //     setError(null);
    
    //     try {
    //       const res = await getMedicalRecord();
    //       console.log(res)
    //       if (mountedRef.current) setMedicalRecord(res.data);
    //     } catch (e) {
    //       if (mountedRef.current) setError(e as Error);
    //     } finally {
    //       if (mountedRef.current) setLoading(false);
    //     }
    //   }, []);
    
      useEffect(() => {
        mountedRef.current = true;
        fetchDoctor();
        // fetchMedicalRecord();
        return () => {
          mountedRef.current = false;
        };
      }, [fetchDoctor]);
    
      return { doctor, loading, error, refetch: fetchDoctor ,addCertification,deleteCertificationById,getCertificationById,editCertification};
    }

