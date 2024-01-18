import { ToolDate } from "src/composables/useTools"

export interface  IObjetivo {
  id:             string
  createdTime:    string 

  area:           string
  objetivo:       string
  estado:         string
  descripcion:    string
  dias:           number
  novedad?:       string
  orden:          number
  fecha:          string
  fechaEstimada:  string
  color:          string
  icon:           string
}

export class Objetivo implements IObjetivo
{
  id:             string
  createdTime:    string 

  area:           string
  objetivo:       string
  estado:         string
  descripcion:    string
  dias:           number
  novedad?:       string
  orden:          number
  fecha:          string
  
  constructor()
  {
    this.id             = ""
    this.createdTime    = ""
    this.objetivo       = ""
    this.area           = ""
    this.estado         = ""
    this.descripcion    = ""
    this.dias           = 0
    this.novedad        = ""
    this.orden          = 0
    this.fecha          = ""
  }

  get fechaEstimada() :string {
    return ToolDate.fechaLarga( ToolDate.getDateToStr( this.fecha, "UTC") )
  }

  get icon() : string
  {
    const icon    =   this.estado.includes("🚴") ? "mdi-run" 
                    : this.estado.includes("⏭") ? "mdi-fast-forward" 
                    : this.estado.includes("🎯") ? "mdi-target" 
                    : this.estado.includes("✅") ? "mdi-check-bold"
                    : "" 
    return icon
  }
  
  get color() : string
  {
    const color   =   this.estado.includes("🚴") ? "blue" 
                    : this.estado.includes("⏭") ? "accent" 
                    : this.estado.includes("🎯") ? "teal-10" 
                    : this.estado.includes("✅") ? "positive"
                    : "" 
    return color
  }

  static ItemsAirTableToObjetivos( itemsApi : any ) :IObjetivo[]
  {
    let arrayTem        = []
    if(itemsApi.hasOwnProperty("records") && Array.isArray(itemsApi.records) )
      arrayTem          = itemsApi.records.sort ( ( a : any, b : any ) =>
      {
        if(a.fields.orden < b.fields.orden) return -1
        if(a.fields.orden > b.fields.orden) return 1
        return 0
      })  

    const objetivos :IObjetivo[]  = []
    for (const item of arrayTem)
    {
      objetivos.push( Objetivo.ItemAirTableToObjetivo(item) )
    }

    return objetivos
  }

  static ItemAirTableToObjetivo( itemApi : any, lado : "left" | "right" = "left" ) :IObjetivo
  {
    const objetivo        = new Objetivo()
    
    objetivo.id           = itemApi.id
    objetivo.createdTime  = itemApi.createdTime
    objetivo.dias         = +itemApi.fields?.dias         ?? 0
    objetivo.orden        = +itemApi.fields?.orden        ?? 0
    objetivo.area         =  itemApi.fields?.area         ?? ""
    objetivo.objetivo     =  itemApi.fields?.objetivo     ?? ""
    objetivo.estado       =  itemApi.fields?.estado       ?? ""
    objetivo.descripcion  =  itemApi.fields?.descripcion  ?? ""
    objetivo.novedad      =  itemApi.fields?.novedad      ?? ""
    objetivo.fecha        =  itemApi.fields?.fecha        ?? ""

    return objetivo
  }
}
