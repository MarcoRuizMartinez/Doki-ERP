export interface INaturalezaProducto
{
  id                  : number
  codigo              : number
  nombre              : string
  label               : string
  value               : number
  esSimple            : boolean
  esCompuesto         : boolean
  esParte             : boolean
  esKit               : boolean
  esMateria           : boolean
}

export class NaturalezaProducto implements INaturalezaProducto
{
  id                  : number  = 0
  nombre              : string  = ""
  codigo              : number  = 0

  get value() : number  { return this.codigo }
  get label() : string  { return this.nombre }

  get esSimple   () : boolean { return this.codigo === 1 }
  get esCompuesto() : boolean { return this.codigo === 2 }
  get esKit      () : boolean { return this.codigo === 3 }
  get esParte    () : boolean { return this.codigo === 4 }
  get esMateria  () : boolean { return this.codigo === 5 }
}