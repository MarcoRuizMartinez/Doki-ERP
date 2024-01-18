import { ToolNum } from "src/composables/useTools"

export interface ICostoEnvio
{ 
  origen                    : string
  destino                   : string
  carrier                   : string  // name
  servicio                  : string  // name
  tipoServicios             : string  // service_types[]
  diasTransito              : number  // transit_days
  producto                  : string

  seguro                    : number
  totalSeguro               : number
  precio                    : number  // price
  qty                       : number
  precioConIVA              : number
  totalSinIVA               : number
  totalConIVA               : number
  peso                      : number
  altura                    : number
  ancho                     : number
  fondo                     : number
  sku                       : string  // Codigo que lo diferencia de los otros costos
}

export class CostoEnvio implements ICostoEnvio
{
  origen                    : string
  destino                   : string  
  precio                    : number  
  carrier                   : string  
  servicio                  : string  
  tipoServicios             : string  
  diasTransito              : number  
  qty                       : number
  producto                  : string
  seguro                    : number
  peso                      : number
  altura                    : number
  ancho                     : number
  fondo                     : number

  constructor()
  {
    this.origen             = ""
    this.destino            = ""
    this.precio             = 0
    this.carrier            = ""
    this.servicio           = ""
    this.tipoServicios      = ""
    this.diasTransito       = 0
    this.qty                = 0      
    this.producto           = ""      
    this.seguro             = 0
    this.peso               = 0
    this.altura             = 0
    this.ancho              = 0
    this.fondo              = 0
  }
  
  get precioConIVA  () : number { return ToolNum.X100_Aumento( this.precio, parseInt( process.env.IVA ?? "0" ))  }
  get totalSinIVA   () : number { return this.precio * ( !this.qty ? 1 : this.qty ) }
  get totalConIVA   () : number { return this.precioConIVA * ( !this.qty ? 1 : this.qty ) }
  get totalSeguro   () : number { return this.seguro * ( !this.qty ? 1 : this.qty ) }
  get sku           () : string {
    return this.carrier + this.servicio + this.qty.toString() + this.precio.toString()
  }

  static getCostosFromApi( data : any[] ) : ICostoEnvio[]
  {
    const costos : ICostoEnvio[] = []

    for (const trans of data)
    {       
      trans.carrier           = trans?.name ?? ""
      if("services" in trans && Array.isArray( trans.services )) 
      {
        for (const item of trans.services)
        {
          const costo           = new CostoEnvio()
          costo.carrier         = trans.carrier
          costo.precio          = parseInt( item?.price ?? 0 )
          costo.servicio        = item?.name ?? ""
          costo.diasTransito    = parseInt( item?.transit_days ?? 0 )
          if("service_types" in item && Array.isArray( item.service_types ) )
            costo.tipoServicios = item.service_types.join(",")
          if("cost_freight_information" in item && typeof item.cost_freight_information === "object")
            if( "original_price" in item.cost_freight_information && typeof item.cost_freight_information.original_price === "number")
              costo.seguro      = costo.precio - item.cost_freight_information.original_price ?? 0
            

          costos.push( costo )
        }      
      }
    }
        
    return costos
  }

}