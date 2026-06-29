export type CategoriaProducto = 'FRUTAS' | 'VERDURAS' | 'GRANOS' | 'LACTEOS' | 'CARNES' | 'OTROS';

export const CATEGORIAS: CategoriaProducto[] = [
  'FRUTAS',
  'VERDURAS',
  'GRANOS',
  'LACTEOS',
  'CARNES',
  'OTROS',
];

export interface Producto {
  id: string;
  producerProfileId: string;
  nombre: string;
  descripcion: string;
  categoria: CategoriaProducto;
  precio: number;
  cantidad: number;
  disponible: boolean;
  creadoEn: string;
  actualizadoEn: string;
}

export interface ProductoFormData {
  nombre: string;
  descripcion: string;
  categoria: CategoriaProducto | '';
  precio: string;
  cantidad: string;
  disponible: boolean;
}

export type ProductoFormErrors = Partial<Record<keyof ProductoFormData, string>>;
