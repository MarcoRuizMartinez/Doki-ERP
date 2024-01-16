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
  id                  : number              = 0
  ref                 : string              = ""
  label               : string              = ""
  tipoId              : TIPO_CUENTA_DINERO  = 0
  logoUrl             : string              = "defecto.png"
  virtual             : boolean             = false

  get value()     : number  { return this.id }
  get imagenUrl() : string  { return `/images/iconos/cuentasDinero/${this.logoUrl}` }
}