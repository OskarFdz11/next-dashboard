import { useEffect, useState, useCallback, useRef } from "react";

export function useFormPersistence<T>(
  key: string,
  initialData: T,
  dependencies: any[] = []
) {
  const initialDataRef = useRef(initialData);
  const [data, setData] = useState<T>(initialData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    initialDataRef.current = initialData;
  }, [initialData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          setData({ ...initialDataRef.current, ...parsed });
        } catch (error) {
          console.error("Error parsing saved form data:", error);
          localStorage.removeItem(key);
          setData(initialDataRef.current);
        }
      } else {
        setData(initialDataRef.current);
      }
      setIsLoaded(true);
    }
  }, [key]);

  useEffect(() => {
    if (!isLoaded || typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(data));
  }, [data, key, isLoaded]);

  useEffect(() => {
    if (!isLoaded || dependencies.length === 0) return;
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
    setData(initialDataRef.current);
  }, [isLoaded, key, ...dependencies]);

  const updateData = useCallback((updates: Partial<T>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const clearData = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
    setData(initialDataRef.current);
  }, [key]);

  const resetToInitial = useCallback(() => {
    setData(initialDataRef.current);
  }, []);

  return { data, updateData, clearData, resetToInitial, isLoaded };
}
