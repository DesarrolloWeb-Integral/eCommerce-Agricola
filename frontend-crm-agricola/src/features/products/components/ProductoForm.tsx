import React from 'react';
import { CATEGORIAS } from '../types/producto.types';
import type { Producto } from '../types/producto.types';
import { useProductoForm } from '../hooks/useProductoForm';

interface Props {
  productoExistente?: Producto | null;
  onSuccess: (p: Producto) => void;
  onCancel: () => void;
}

export function ProductoForm({ productoExistente = null, onSuccess, onCancel }: Props) {
  const { form, errors, isLoading, apiError, isEditing, handleChange, handleBlur, handleSubmit } =
    useProductoForm(productoExistente, onSuccess);
  const field = (name: keyof typeof form) => ({
    id: name,
    value: form[name] as string,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      handleChange(name, e.target.value),
    onBlur: () => handleBlur(name),
    className: `form-control${errors[name] ? ' is-invalid' : ''}`,
    disabled: isLoading,
  });
  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3 className="mb-3">{isEditing ? 'Editar producto' : 'Registrar producto'}</h3>
      {apiError && <div className="alert alert-danger">{apiError}</div>}
      <div className="mb-3">
        <label htmlFor="nombre" className="form-label fw-semibold">
          Nombre <span className="text-danger">*</span>
        </label>
        <input type="text" maxLength={150} {...field('nombre')} />
        {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label fw-semibold">
          Descripción <span className="text-danger">*</span>
        </label>
        <textarea rows={3} maxLength={1000} {...field('descripcion')} />
        {errors.descripcion && <div className="invalid-feedback">{errors.descripcion}</div>}
      </div>
      <div className="mb-3">
        <label htmlFor="categoria" className="form-label fw-semibold">
          Categoría <span className="text-danger">*</span>
        </label>
        <select {...field('categoria')}>
          <option value="">Selecciona una categoría</option>
          {CATEGORIAS.map((c) => (
            <option key={c} value={c}>
              {c.charAt(0) + c.slice(1).toLowerCase()}
            </option>
          ))}
        </select>
        {errors.categoria && <div className="invalid-feedback">{errors.categoria}</div>}
      </div>
      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label htmlFor="precio" className="form-label fw-semibold">
            Precio (MXN) <span className="text-danger">*</span>
          </label>
          <input type="number" min="0.01" step="0.01" {...field('precio')} />
          {errors.precio && <div className="invalid-feedback">{errors.precio}</div>}
        </div>
        <div className="col-md-6">
          <label htmlFor="cantidad" className="form-label fw-semibold">
            Cantidad <span className="text-danger">*</span>
          </label>
          <input type="number" min="0" step="1" {...field('cantidad')} />
          {errors.cantidad && <div className="invalid-feedback">{errors.cantidad}</div>}
        </div>
      </div>
      <div className="mb-4 form-check">
        <input
          type="checkbox"
          className="form-check-input"
          id="disponible"
          checked={form.disponible}
          onChange={(e) => handleChange('disponible', e.target.checked)}
          disabled={isLoading}
        />
        <label className="form-check-label" htmlFor="disponible">
          Disponible para compra
        </label>
      </div>
      <div className="d-flex gap-2">
        <button type="submit" className="btn btn-success" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              {isEditing ? 'Guardando…' : 'Registrando…'}
            </>
          ) : isEditing ? (
            'Guardar cambios'
          ) : (
            'Registrar producto'
          )}
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
