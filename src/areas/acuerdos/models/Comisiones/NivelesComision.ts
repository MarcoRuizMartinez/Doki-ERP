export interface INivelesComision
{
  alfa  : number
  a     : number
  b     : number
  c     : number
  d     : number
  e     : number
}

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
