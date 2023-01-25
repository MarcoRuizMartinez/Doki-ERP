import { INivelesComision, NivelesComision } from "./NivelesComision"

export interface IComision
{
  niveles : INivelesComision
}

export class Comision implements IComision
{
  niveles : INivelesComision

  constructor()
  {
    this.niveles  = new NivelesComision()
  }
}
