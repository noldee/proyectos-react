export type Tallas = "S" | "M" | "L" | "XL";

export type Producto = {
  id: number;
  imagen: string;
  nombre: string;
  tecnologia: string;
  color: string;
  tallas: Tallas[];
  precio: number;
  descripcion: string;
};

export type CartItem = Producto & { cantidad: number };
