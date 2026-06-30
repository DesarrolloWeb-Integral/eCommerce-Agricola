import type { ProductoFormData, ProductoFormErrors } from '../types/producto.types';
import { validateSafeText } from '../../../shared/validators/security.validators';

export function validateProductoForm(data: ProductoFormData): ProductoFormErrors {
  const errors: ProductoFormErrors = {};

  if (!data.nombre.trim()) {
    errors.nombre = 'El nombre es obligatorio.';
  } else if (validateSafeText(data.nombre, 'El nombre') !== true) {
    errors.nombre = 'El nombre no puede contener HTML o JavaScript.';
  } else if (data.nombre.trim().length > 150) {
    errors.nombre = 'El nombre no puede superar los 150 caracteres.';
  }

  if (!data.descripcion.trim()) {
    errors.descripcion = 'La descripción es obligatoria.';
  } else if (validateSafeText(data.descripcion, 'La descripción') !== true) {
    errors.descripcion = 'La descripción no puede contener HTML o JavaScript.';
  } else if (data.descripcion.trim().length > 1000) {
    errors.descripcion = 'La descripción no puede superar los 1000 caracteres.';
  }

  if (!data.categoria) {
    errors.categoria = 'La categoría es obligatoria.';
  }

  const precio = Number(data.precio);
  if (!data.precio.trim() || Number.isNaN(precio)) {
    errors.precio = 'El precio es obligatorio.';
  } else if (precio <= 0) {
    errors.precio = 'El precio debe ser mayor a cero.';
  }

  const cantidad = Number(data.cantidad);
  if (data.cantidad.trim() === '') {
    errors.cantidad = 'La cantidad es obligatoria.';
  } else if (Number.isNaN(cantidad) || cantidad < 0) {
    errors.cantidad = 'La cantidad no puede ser negativa.';
  } else if (!Number.isInteger(cantidad)) {
    errors.cantidad = 'La cantidad debe ser un número entero.';
  }

  return errors;
}

export function isFormValid(errors: ProductoFormErrors): boolean {
  return Object.keys(errors).length === 0;
}
