import { ToolArray, ToolType } from "src/composables/useTools"

export interface  IItemMenu {
  dataApi             : any
  ref                 : string
  url                 : string
  icono               : string
  color               : string
  orden               : number
  titulo              : string
  descripcion         : string
  label               : string
  enlace              : string
  alerta              : boolean
  gruposUsuarios      : number[]
  urlParams           : [ string, string ][]
  tipoAcuerdo         : string
  cuenta              : number
}

export class ItemMenu implements IItemMenu
{
  dataApi             : any    
  label               : string
  enlace              : string
  tipoAcuerdo         : string                = ""
  cuenta              : number                = 0
  urlParams           : [ string, string ][]  = []
  
  constructor( data : any )
  {
    this.dataApi  = data
    this.label    = this.titulo
    this.enlace   = this.url
  }
  
  get ref         (): string  { return this.dataApi?.ref ?? "" }
  get descripcion (): string  { return this.dataApi?.answer ?? "" }
  get titulo      (): string  { return this.dataApi?.question ?? "" }
  get url         (): string  { return this.dataApi?.array_options?.options_url   ?? "" }
  get icono       (): string  { return this.dataApi?.array_options?.options_icono ?? "" }
  get color       (): string  { return this.dataApi?.array_options?.options_color ?? "" }
  get orden       (): number  { return ToolType.anyToNum( this.dataApi?.array_options?.options_orden )  }
  get alerta      (): boolean { return Boolean( parseInt( this.dataApi?.array_options?.options_alerta ) ?? 0  )}

  get gruposUsuarios () : number[] { return ToolArray.getArrayNumDeStr(this.dataApi?.array_options?.options_grupos_usuarios ) }

}