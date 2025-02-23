export interface Producto {    
    id?: number;
    nombre: string;
    descripcion: string;
    cantidad: number;
}

export interface Lavanderia {
    id?: number;
    nombre_prenda: string;
    cantidad: number;
    roperia_id: number;
}

export interface Unidad {
    id?: number;
    nombre_prenda: string;
    cantidad: number;
    roperia_id: number;
}

export interface Bajas {
    id?: number;
    nombre_prenda: string;
    cantidad: number;
    roperia_id: number;
}

export interface Funcionario {
    id?: number;
    nombre_funcionario: string;
    nombre_prenda: string;
    roperia_id: number;
}
export interface Usuario {
    id?: number;
    nombre_usuario: string;
    rut: string;
    password : string;
    roperia_id: number;
}
export interface Admin {
    id?: number;
    nombre_admin: string;
    rut: string;
    password : string;
    roperia_id: number;
}

