import {  TTipoAcuerdo, 
          TIPO_ACUERDO    } from "src/areas/acuerdos/models/ConstantesAcuerdos"

import {  ToolType        } from "src/composables/useTools"

interface IIdTipo 
{
  id     : number
  tipo   : TTipoAcuerdo
}

export interface IEnlaceAcuerdo
{ 
  enlace        : IIdTipo
  destino       : IIdTipo
  origen        : IIdTipo
  destinoSmart  : IIdTipo
}

export class EnlaceAcuerdo implements IEnlaceAcuerdo
{
  enlace        : IIdTipo
  destino       : IIdTipo
  origen        : IIdTipo  

  constructor( id : number, padre : TTipoAcuerdo )
  {
    this.enlace   = { id, tipo: padre              }
    this.destino  = { id: 0, tipo: TIPO_ACUERDO.NULO  }
    this.origen   = { id: 0, tipo: TIPO_ACUERDO.NULO  }
    this.destino  = { id: 0, tipo: TIPO_ACUERDO.NULO  }
  }

  get destinoSmart() : IIdTipo  
  {
    return    this.origen.tipo  === this.enlace.tipo  ? { id: this.destino.id,  tipo: this.destino.tipo }
            : this.destino.tipo === this.enlace.tipo  ? { id: this.origen.id,   tipo: this.origen.tipo  }
            :                                           { id: 0,                tipo: TIPO_ACUERDO.NULO }
  }

  /* static enlacesApiToEnlaces( enlacesApi : any, padre : TTipoAcuerdo ) : IEnlaceAcuerdo[]
  {
    if(typeof enlacesApi != "string" || !enlacesApi ) return []
    
    const enlaces  : IEnlaceAcuerdo[] = []

    const json = JSON.parse( enlacesApi )
    for (const link of json)
      enlaces.push( EnlaceAcuerdo.enlaceApiToEnlace( link, padre ) )
    return enlaces
  } */

  static enlacesApiToEnlaces2( enlacesApi : any[], padre : TTipoAcuerdo, id_origen : number ) : IEnlaceAcuerdo[]
  {
    if(!Array.isArray( enlacesApi ) || !enlacesApi ) return []
    
    const enlaces  : IEnlaceAcuerdo[] = []    
    for (const link of enlacesApi)
    {
      const enlace    = EnlaceAcuerdo.enlaceApiToEnlace( link, padre )

      if(enlace.origen.tipo == enlace.destino.tipo && enlace.destino.id == id_origen) // Cuando esta invertido el origen y el destino
      {
        enlace.destino.id = enlace.origen.id
        enlace.origen.id  = id_origen
      }
      enlaces.push( enlace )
    }
    return enlaces
  }  

  static enlaceApiToEnlace( eApi : any, padre : TTipoAcuerdo ) : IEnlaceAcuerdo
  {
    const enlace        = new EnlaceAcuerdo( ToolType.keyNumberValido(eApi, "enlaceId" ),  padre )
    enlace.destino      = getIdTipo( ToolType.keyNumberValido(eApi, "destinoId" ), ToolType.keyStringValido(eApi, "destinoTipo") )
    enlace.origen       = getIdTipo( ToolType.keyNumberValido(eApi, "origenId" ),  ToolType.keyStringValido(eApi, "origenTipo") )

    return enlace

    function getIdTipo( id : number, tipo : string) : IIdTipo
    {
      return { id, tipo: getTipo( tipo ) }
    }

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