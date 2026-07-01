export type CategoriaProducto = 'FRUTAS' | 'VERDURAS' | 'GRANOS' | 'LACTEOS' | 'CARNES' | 'OTROS';

export const CATEGORIAS: CategoriaProducto[] = [
  'FRUTAS',
  'VERDURAS',
  'GRANOS',
  'LACTEOS',
  'CARNES',
  'OTROS',
];

export const CATEGORIA_LABELS: Record<CategoriaProducto, string> = {
  FRUTAS: 'Frutas',
  VERDURAS: 'Verduras',
  GRANOS: 'Granos',
  LACTEOS: 'Lácteos',
  CARNES: 'Carnes',
  OTROS: 'Otros',
};

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

export interface ProductoDetalle extends Producto {
  productor: {
    id: string;
    businessName: string;
    generalLocation: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
    socialLinks: Record<string, string>;
  };
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
