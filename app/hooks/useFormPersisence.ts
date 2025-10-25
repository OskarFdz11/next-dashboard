// app/hooks/useFormPersistence.ts
import { useEffect, useState } from "react";

export function useFormPersistence<T>(
  key: string,
  initialData: T,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar datos del localStorage al montar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setData({ ...initialData, ...parsedData });
        } catch (error) {
          console.error("Error parsing saved form data:", error);
        }
      }
      setIsLoaded(true);
    }
  }, [key]);

  // Guardar datos en localStorage cuando cambian
  useEffect(() => {
    if (isLoaded && typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  }, [data, key, isLoaded]);

  // Limpiar localStorage cuando se especifican dependencias
  useEffect(() => {
    if (dependencies.length > 0) {
      localStorage.removeItem(key);
      setData(initialData);
    }
  }, dependencies);

  const updateData = (updates: Partial<T>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const clearData = () => {
    localStorage.removeItem(key);
    setData(initialData);
  };

  return {
    data,
    updateData,
    clearData,
    isLoaded,
  };
}
