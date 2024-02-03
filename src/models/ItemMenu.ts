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
}

export class ItemMenu implements IItemMenu
{
  dataApi             : any    
  label               : string
  enlace              : string
  
  constructor( data : any )
  {
    this.dataApi  = data
    this.label    = this.titulo
    this.enlace   = this.url
  }
  
  get ref         (): string{ return this.dataApi?.ref ?? "" }
  get descripcion (): string{ return this.dataApi?.answer ?? "" }
  get titulo      (): string{ return this.dataApi?.question ?? "" }
  get url         (): string{ return this.dataApi?.array_options?.options_url   ?? "" }
  get icono       (): string{ return this.dataApi?.array_options?.options_icono ?? "" }
  get color       (): string{ return this.dataApi?.array_options?.options_color ?? "" }
  get orden       (): number{ return parseInt( this.dataApi?.array_options?.options_orden ) ?? 0 }
}