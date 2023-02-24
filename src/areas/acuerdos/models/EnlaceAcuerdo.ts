import {  TTipoAcuerdo, 
          TIPO_ACUERDO          } from "src/areas/acuerdos/models/ConstantesAcuerdos"

export interface IEnlaceAcuerdo
{ 
  enlaceId      : number
  destinoId     : number
  destinoTipo   : TTipoAcuerdo
  origenId      : number
  origenTipo    : TTipoAcuerdo  
}

export class EnlaceAcuerdo implements IEnlaceAcuerdo
{
  enlaceId      : number
  destinoId     : number
  destinoTipo   : TTipoAcuerdo
  origenId      : number
  origenTipo    : TTipoAcuerdo  

  constructor()
  {
    this.enlaceId           = 0
    this.destinoId          = 0
    this.destinoTipo        = TIPO_ACUERDO.NULO
    this.origenId           = 0
    this.origenTipo         = TIPO_ACUERDO.NULO
  }

  static enlacesApiToEnlaces( enlacesApi : any  ) : IEnlaceAcuerdo[]
  {
    if(typeof enlacesApi != "string" || !enlacesApi ) return []
    
    const enlaces  : IEnlaceAcuerdo[] = []

    const json = JSON.parse( enlacesApi )
    for (const link of json)
      enlaces.push( EnlaceAcuerdo.enlaceApiToEnlace( link ) )
    return enlaces
  }

  static enlaceApiToEnlace( enlaceApi : any  ) : IEnlaceAcuerdo
  {
    enlaceApi.enlaceId      = +enlaceApi.enlaceId
    enlaceApi.destinoId     = +enlaceApi.destinoId
    enlaceApi.origenId      = +enlaceApi.origenId
    enlaceApi.destinoTipo   = getTipo( enlaceApi.destinoTipo )
    enlaceApi.origenTipo    = getTipo( enlaceApi.origenTipo )

    const enlace            = Object.assign( new EnlaceAcuerdo(), enlaceApi ) as IEnlaceAcuerdo
    return enlace

    function getTipo( tipo : string) : TTipoAcuerdo
    {
      return  tipo === "commande"         ? TIPO_ACUERDO.PEDIDO_CLI
            : tipo === "propal"           ? TIPO_ACUERDO.COTIZACION_CLI
            : tipo === "order_supplier"   ? TIPO_ACUERDO.PEDIDO_PRO
            : tipo === "shipping"         ? TIPO_ACUERDO.ENTREGA_CLI
            : TIPO_ACUERDO.NULO
    }
  }
}