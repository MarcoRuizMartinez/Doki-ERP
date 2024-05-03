export interface IMunicipio
{
  id                        : number  // zip
  municipio                 : string  // town
  departamento              : string
  departamentoSigla         : string
  departamentoId            : string  // fk_departement
  label                     : string
  nombreCompleto            : string
  value                     : number
  indicativo                : string
  codigoDian                : string
  codigoDianLargo           : string
}

export class Municipio implements IMunicipio
{
  id                        : number
  municipio                 : string
  departamento              : string
  departamentoSigla         : string
  departamentoId            : string
  indicativo                : string
  codigoDian                : string

  constructor()
  {
    this.id                 = 0
    this.municipio          = ""  
    this.departamento       = ""
    this.departamentoSigla  = ""
    this.departamentoId     = ""
    this.indicativo         = ""
    this.codigoDian         = ""
  }

  get departamentoIdInt() : number { return parseInt( this.departamentoId ) }
  get codigoDianLargo()   : string { return this.codigoDian + "000" }
  get nombreCompleto()    : string { return this.municipio + " " + this.departamento }

  
  get label():string {
    return !!this.municipio ? this.municipio + " (" + this.departamentoSigla + ")" : ""
  }

  set label( valor : string ) {
    this.municipio = valor 
  }

  get value():number {
    return this.id
  }

  set value( valor : number ){
    this.id = valor
  }
}