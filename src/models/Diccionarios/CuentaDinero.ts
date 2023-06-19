export enum TIPO_CUENTA_DINERO
{
  AHORROS                     = 0,
  CORRIENTE                   = 1,
  EFECTIVO                    = 2,
}

export interface ICuentaDinero
{
  id:                 number  
  ref:                string
  label:              string
  tipoId:             TIPO_CUENTA_DINERO
  logoUrl:            string
  virtual:            boolean
  imagenUrl:          string
  value:              number
}

export class CuentaDinero implements ICuentaDinero
{
  id:                 number  
  ref:                string
  label:              string
  tipoId:             TIPO_CUENTA_DINERO
  logoUrl:            string
  virtual:            boolean

  constructor()
  {
    this.id           = 0
    this.ref          = ""
    this.label        = ""
    this.tipoId       = 0
    this.logoUrl      = "defecto.png"
    this.virtual      = false
  }
  
  get value()     : number  { return this.id }
  get imagenUrl() : string  { return `/images/iconos/cuentasDinero/${this.logoUrl}` }
}