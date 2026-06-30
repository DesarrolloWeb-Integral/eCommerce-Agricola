import type { ProductoFormData, ProductoFormErrors } from '../types/producto.types';

export function validateProductoForm(data: ProductoFormData): ProductoFormErrors {
  const errors: ProductoFormErrors = {};

  if (!data.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio.';
  } else if (data.nombre.trim().length > 150) {
    errors.nombre = 'El nombre no puede superar los 150 caracteres.';
  }

  if (!data.descripcion.trim()) {
    errors.descripcion = 'La descripción es obligatoria.';
  } else if (data.descripcion.trim().length > 1000) {
    errors.descripcion = 'La descripción no puede superar los 1000 caracteres.';
  }

  if (!data.categoria) {
    errors.categoria = 'La categoría es obligatoria.';
  }

  const precio = parseFloat(data.precio);
  if (!data.precio || isNaN(precio)) {
    errors.precio = 'El precio es obligatorio.';
  } else if (precio <= 0) {
    errors.precio = 'El precio debe ser mayor a cero.';
  }

  const cantidad = parseInt(data.cantidad, 10);
  if (data.cantidad === '') {
    errors.cantidad = 'La cantidad es obligatoria.';
  } else if (isNaN(cantidad) || cantidad < 0) {
    errors.cantidad = 'La cantidad no puede ser negativa.';
  }

  return errors;
}

export function isFormValid(errors: ProductoFormErrors): boolean {
  return Object.keys(errors).length === 0;
}
