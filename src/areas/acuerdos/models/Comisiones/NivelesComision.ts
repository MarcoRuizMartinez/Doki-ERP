export interface INivelesComision
{
  alfa  : number
  a     : number
  b     : number
  c     : number
  d     : number
  e     : number
}

export enum NIVELES_COMISION
{
  ALFA  = "alfa",
  A     = "a",
  B     = "b",
  C     = "c",
  D     = "d",
  E     = "e",
  X     = "x",
}

export type TNivelesComision  =   NIVELES_COMISION.ALFA
                                | NIVELES_COMISION.A
                                | NIVELES_COMISION.B
                                | NIVELES_COMISION.C
                                | NIVELES_COMISION.D
                                | NIVELES_COMISION.E
                                | NIVELES_COMISION.X

export class NivelesComision implements INivelesComision
{
  alfa  : number
  a     : number
  b     : number
  c     : number
  d     : number
  e     : number

  constructor()
  {
    this.alfa   = 0
    this.a      = 0
    this.b      = 0
    this.c      = 0
    this.d      = 0
    this.e      = 0
  }
}
