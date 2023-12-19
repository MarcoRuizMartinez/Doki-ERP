/* export enum ESTADO_ANTICIPO
{
  ANULADO                     = 0,
  PENDIENTE                   = 1,
  VERIFICADO                  = 2,
  CREDITO                     = 3,
} */

export interface IEstado
{ 
  id                        : number
  label                     : string
  color                     : string
  icono                     : string
}

export class Estado implements IEstado
{
  id                        : number = 0
  label                     : string = ""
  color                     : string = ""
  icono                     : string = ""

  constructor( id : number )
  {
    this.id                 = id
  }
}