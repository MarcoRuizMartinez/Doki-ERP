export interface iBusquedaTercero {
    nombre: string
    correo: string
    nit:    void | number
}

export const busquedaVacia : iBusquedaTercero  = {
    nombre:       "",
    correo:       "",
    nit:          undefined,
}

export function busquedaEstaVacia( busqueda : Object) : boolean
{
    return Object.entries(busqueda).toString() === Object.entries(busquedaVacia).toString()
} 