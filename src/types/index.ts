export interface Cliente {
  id: number;
  nombre: string;
  telefono: string;
  direccion: string;
}

export interface Fiado {
  id: number;
  clienteId: number;
  descripcion: string;
  monto: number;
  fecha: string;
}

export interface Abono {
  id: number;
  fiadoId: number;
  monto: number;
  fecha: string;
}