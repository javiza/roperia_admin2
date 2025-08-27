export interface Usuario {    
    id?: number;
    nombre_usuario: string;
    rut: string;
    password: string;
    role?: string; // Opcional si no siempre se usa
}

export interface Roperia {
    id?: number;
    nombre_encargado: string;
    telefono: string;
    email: string;
    usuario_id: number;
}

export interface Prenda {
    id?: number;
    id_roperia: number;
    nombre: string;
    descripcion: string;
    cantidad: number;
    tipo: string;
    fecha_ingreso: string;
}

export interface Lavanderia {
    id?: number;
    id_roperia: number;
    nombre: string;
    rut: string;          // CORREGIDO: agregada propiedad rut
    direccion: string;
    telefono: string;
    email: string;
    gerencia?: string;        // opcional
    jefe_operaciones?: string; // opcional
}

export interface Lavado {
    id?: number;
    id_prenda: number;
    cantidad: number;
    fecha_ingreso: string;
    id_lavanderia: number;
}

export interface Unidad {
    id?: number;
    id_roperia: number;     // CORREGIDO: debía existir para el CRUD
    nombre_unidad: string;  // CORREGIDO: agregada propiedad
    coordinador: string;
    telefono: string;
    mail: string;
}

export interface Unidad_retorno {
    id?: number;
    id_unidad: number;
    id_prenda: number;
    cantidad_devuelta: number;
    fecha_retorno: string;
}

export interface Reparacion {
    id?: number;
    id_prenda: number;
    detalle_reparacion: string;
    cantidad: number;
    fecha_ingreso: string;
}

export interface Reparacion_retorno {
    id?: number;
    id_reparacion: number;
    id_prenda: number;
    cantidad_devuelta: number;
    fecha_retorno: string;
}

export interface Bajas {
    id?: number;
    id_prenda: number;
    cantidad: number;
    detalle: string;
    destino: string;
    fecha_ingreso: string;
}
