export interface ITipoAcuerdo
{  
  label               : string
  value               : string
  plural              : string
  icono               : string
  imagen              : string
  emoji               : string
  color               : string
  pathDolibarr        : string
}

export class TipoAcuerdo implements ITipoAcuerdo
{
  label               : string
  value               : string
  plural              : string
  icono               : string
  imagen              : string
  emoji               : string  
  color               : string
  pathDolibarr        : string

  constructor()
  {
    this.label        = ""
    this.value        = ""
    this.plural       = ""
    this.icono        = ""
    this.imagen       = ""
    this.emoji        = ""
    this.color        = ""
    this.pathDolibarr = ""
  }
}