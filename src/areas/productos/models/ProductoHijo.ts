export interface IProductoHijo
{
  id                  : number
  padre_id            : number
  hijo_id             : number
  qty                 : number
  orden               : number
  //* /////////////// Siigo
  linea               : number
  grupo               : number
  codigo              : number  
  codigoFull          : string

  padreLinea          : number
  padreGrupo          : number
  padreCodigo         : number  

  enSiigo             : boolean
  unidad              : string
}

export class ProductoHijo implements IProductoHijo
{
  ref                 : string  = ""
  nombre              : string  = ""
  id                  : number  = 0
  padre_id            : number  = 0
  hijo_id             : number  = 0
  qty                 : number  = 0
  orden               : number  = 0

  linea               : number  = 0
  grupo               : number  = 0
  codigo              : number  = 0

  padreLinea          : number  = 0
  padreGrupo          : number  = 0
  padreCodigo         : number  = 0    

  enSiigo             : boolean = false
  unidad              : string  = ""

  get codigoFull() { return `${this.linea}${this.grupo}${this.codigo}`}
}