export interface Producto {    
    id?: number;
    nombre: string;
    descripcion: string;
}

export interface Lavanderia {
    id?: number;
    nombre_prenda: string;
    roperia_id: number;
}

export interface Unidad {
    id?: number;
    nombre_prenda: string;
    roperia_id: number;
}

export interface Bajas {
    id?: number;
    nombre_prenda: string;
    roperia_id: number;
}

export interface Funcionario {
    id?: number;
    nombre_funcionario: string;
    nombre_prenda: string;
    roperia_id: number;
}

