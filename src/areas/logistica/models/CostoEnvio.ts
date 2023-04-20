
export interface ICostoEnvio
{ 
  precio                    : number  // price
  carrier                   : string  // name
  servicio                  : string  // name
  tipoServicios             : string  // service_types[]
  diasTransito              : number  // transit_days
}

export class CostoEnvio implements ICostoEnvio
{
  precio                    : number  
  carrier                   : string  
  servicio                  : string  
  tipoServicios             : string  
  diasTransito              : number  

  constructor()
  {
    this.precio             = 0
    this.carrier            = ""
    this.servicio           = ""
    this.tipoServicios      = ""
    this.diasTransito       = 0
  }

  static getCostosFromApi( data : any[]  ) : ICostoEnvio[]
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

          costos.push( costo )
        }      
      }
    }
        
    return costos
  }

}