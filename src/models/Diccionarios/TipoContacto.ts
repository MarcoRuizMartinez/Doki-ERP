export interface ITipoContacto
{
  id:                 number  
  codigo:             string
  tipo:               string
  origen:             string
  value:              number
}

export class TipoContacto implements ITipoContacto
{
  id                  : number  = 0  
  codigo              : string  = ""
  tipo                : string  = ""
  origen              : string  = ""

  get value() : number  { return this.id }
}