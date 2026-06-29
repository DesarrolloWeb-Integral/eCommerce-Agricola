import { useState, useMemo, useCallback } from 'react';
import type { Producto, ProductoFormData, ProductoFormErrors } from '../types/producto.types';
import { validateProductoForm, isFormValid } from '../services/producto.validators';
import { registrarProducto, editarProducto } from '../services/producto.service';

const INITIAL_FORM: ProductoFormData = {
  nombre: '',
  descripcion: '',
  categoria: '',
  precio: '',
  cantidad: '',
  disponible: true,
};

export function useProductoForm(
  productoExistente: Producto | null,
  onSuccess: (p: Producto) => void
) {
  const [form, setForm] = useState<ProductoFormData>(
    productoExistente
      ? {
          nombre: productoExistente.nombre,
          descripcion: productoExistente.descripcion,
          categoria: productoExistente.categoria,
          precio: String(productoExistente.precio),
          cantidad: String(productoExistente.cantidad),
          disponible: productoExistente.disponible,
        }
      : INITIAL_FORM
  );
  const [touched, setTouched] = useState<Partial<Record<keyof ProductoFormData, boolean>>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const errors = useMemo<ProductoFormErrors>(() => {
    const all = validateProductoForm(form);
    const relevant: ProductoFormErrors = {};
    for (const key of Object.keys(all) as (keyof ProductoFormErrors)[]) {
      if (touched[key]) relevant[key] = all[key];
    }
    return relevant;
  }, [form, touched]);

  const handleChange = useCallback((field: keyof ProductoFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleBlur = useCallback((field: keyof ProductoFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setApiError(null);
      setTouched(
        Object.fromEntries(Object.keys(INITIAL_FORM).map((k) => [k, true])) as typeof touched
      );
      if (!isFormValid(validateProductoForm(form))) return;
      setIsLoading(true);
      try {
        const payload = {
          nombre: form.nombre.trim(),
          descripcion: form.descripcion.trim(),
          categoria: form.categoria,
          precio: parseFloat(form.precio),
          cantidad: parseInt(form.cantidad, 10),
          disponible: form.disponible,
        };
        const saved = productoExistente
          ? await editarProducto(productoExistente.id, payload)
          : await registrarProducto(payload);
        onSuccess(saved);
      } catch (err: unknown) {
        setApiError(err instanceof Error ? err.message : 'Ocurrió un error.');
      } finally {
        setIsLoading(false);
      }
    },
    [form, productoExistente, onSuccess]
  );

  return {
    form,
    errors,
    isLoading,
    apiError,
    isEditing: !!productoExistente,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
