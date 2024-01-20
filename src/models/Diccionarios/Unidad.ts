export interface IUnidad
{
  id                  : number
  nombre              : string
  label               : string
  codigo              : string
  sigla               : string
  tipo                : string
  value               : number
  orden               : number
}

export class Unidad implements IUnidad
{
  id                  : number  = 1
  nombre              : string  = ""
  codigo              : string  = ""
  sigla               : string  = ""
  tipo                : string  = ""
  orden               : number  = 0

  get value() : number  { return this.id }
  get label() : string  {
    let label         =   this.nombre == "SizeUnitcm"     ? "Centímetro"
                        : this.nombre == "SizeUnitdm"     ? "Decímetro"
                        : this.nombre == "SizeUnitm"      ? "Metro"
                        : this.nombre == "SurfaceUnitdm2" ? "Decímetro 2"
                        : this.nombre == "SurfaceUnitm2"  ? "Metro 2"
                        : this.nombre == "SizeUnitfoot"   ? "Pie"
                        : this.nombre
    return this.sigla.toUpperCase() + " - " + label
  }
}