import {  TTipoAcuerdo, 
          TIPO_ACUERDO          } from "src/areas/acuerdos/models/ConstantesAcuerdos"

export interface IEnlaceAnticipo
{ 
  id_enlace                 : number
  id_objeto                 : number
  tipo                      : TTipoAcuerdo
}

export class EnlaceAnticipo implements IEnlaceAnticipo
{
  id_enlace                 : number
  id_objeto                 : number
  tipo                      : TTipoAcuerdo

  constructor()
  {
    this.id_enlace          = 0
    this.id_objeto          = 0
    this.tipo               = TIPO_ACUERDO.NULO
  }

  static enlaceApiToEnlace( enlaceApi : any  ) : IEnlaceAnticipo
  {
    enlaceApi.id_enlace     = +enlaceApi.id_enlace
    enlaceApi.id_objeto     = +enlaceApi.id_objeto
    enlaceApi.tipo          =   enlaceApi.tipo === "commande"        ? TIPO_ACUERDO.PEDIDO
                              : enlaceApi.tipo === "propal"          ? TIPO_ACUERDO.COTIZACION
                              : enlaceApi.tipo === "order_supplier"  ? TIPO_ACUERDO.OC_PROVEEDOR
                              : TIPO_ACUERDO.NULO
    const enlace            = Object.assign( new EnlaceAnticipo(), enlaceApi ) as IEnlaceAnticipo   
    return enlace
  }
}