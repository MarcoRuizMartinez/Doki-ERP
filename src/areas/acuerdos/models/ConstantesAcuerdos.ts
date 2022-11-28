export enum TIPO_ACUERDO
{
  NULO                        = "",
  COTIZACION                  = "cotización", // Igual que el END POINT del servicio
  PEDIDO                      = "pedido",
  ENTREGA                     = "entrega",
  OC_PROVEEDOR                = "oc_proveedor",
  FACTURA                     = "factura",
}

export type TTipoAcuerdo      =   TIPO_ACUERDO.COTIZACION
                                | TIPO_ACUERDO.PEDIDO
                                | TIPO_ACUERDO.ENTREGA
                                | TIPO_ACUERDO.OC_PROVEEDOR
                                | TIPO_ACUERDO.FACTURA
                                | TIPO_ACUERDO.NULO

enum COLORES
{
  NEGRO                       = "#1A1A1A",
  GRIS                        = "#BCBABA",
  MORADO                      = "#832362",
  AZUL                        = "#0f61dd",
  AZUL_OSCURO                 = "#0B215B",
  VERDE                       = "#06c700", 
  NARANJA                     = "#FF6805",
}

export enum ESTADO_ACU
{
  NO_GUARDADO                 = -2,
  BORRADOR                    = 0,
  VALIDADO                    = 1,
}

export enum ESTADO_CTZ
{
  NO_GUARDADO                 = -2,
  BORRADOR                    = 0,
  COTIZADO                    = 1,
  APROBADO                    = 2,
  RECHAZADO                   = 3,
  FACTURADO                   = 4,
}

export enum ESTADO_PED
{
  NO_GUARDADO                 = -2,
  CANCELADO                   = -1,
  BORRADOR                    = 0,
  VALIDADO                    = 1,
  PROCESO                     = 2,
  ENTREGADO                   = 3,
}

export enum ESTADO_OC
{
  NO_GUARDADO                 = -2,  
  BORRADOR                    = 0,
  VALIDADO                    = 1,
  APROBADO                    = 2,
  PEDIDO_ENVIADO              = 3,
  RECIBIDO_PARCIAL            = 4,
  RECIBIDO_TOTAL              = 5,
  CANCELADO                   = 6,
  CANCELADO_OLD               = 7,
}

export class EstadosAcuerdos
{
  //* /////////////////////////////////////////////////////////////////////////// Label
  static estadoToName(  tipo : TTipoAcuerdo, estado : number  ): string
  {
    let valor : string          = ""
    if( tipo === TIPO_ACUERDO.COTIZACION ){
      valor                     = estado == ESTADO_CTZ.NO_GUARDADO      ? "Boceto"
                                : estado == ESTADO_CTZ.BORRADOR         ? "Edición"
                                : estado == ESTADO_CTZ.COTIZADO         ? "Cotizado"
                                : estado == ESTADO_CTZ.APROBADO         ? "Aprobado"
                                : estado == ESTADO_CTZ.RECHAZADO        ? "Rechazado"
                                : estado == ESTADO_CTZ.FACTURADO        ? "Facturado"
                                : ""
    }
    else
    if( tipo === TIPO_ACUERDO.PEDIDO ){
      valor                     = estado == ESTADO_PED.NO_GUARDADO      ? "Boceto"
                                : estado == ESTADO_PED.CANCELADO        ? "Cancelado"
                                : estado == ESTADO_PED.BORRADOR         ? "Borrador"
                                : estado == ESTADO_PED.VALIDADO         ? "Validado"
                                : estado == ESTADO_PED.PROCESO          ? "Entregando"
                                : estado == ESTADO_PED.ENTREGADO        ? "Entregado"
                                : ""
    }
    else
    if( tipo === TIPO_ACUERDO.OC_PROVEEDOR ){
      valor                     = estado == ESTADO_OC.NO_GUARDADO       ? "Boceto"
                                : estado == ESTADO_OC.BORRADOR          ? "Edición"
                                : estado == ESTADO_OC.VALIDADO          ? "Validado"
                                : estado == ESTADO_OC.APROBADO          ? "Aprobado"
                                : estado == ESTADO_OC.PEDIDO_ENVIADO    ? "Enviado"
                                : estado == ESTADO_OC.RECIBIDO_PARCIAL  ? "Entrega parcial"
                                : estado == ESTADO_OC.RECIBIDO_TOTAL    ? "Entrega total"
                                : estado == ESTADO_OC.CANCELADO         ? "Cancelado"
                                : estado == ESTADO_OC.CANCELADO_OLD     ? "Cancelado"
                                : ""
    }

    return valor
  }

  //* /////////////////////////////////////////////////////////////////////////// Label
  static estadoToColor(  tipo : TTipoAcuerdo, estado : number  ): string
  {
    let color : string          = ""
    if( tipo === TIPO_ACUERDO.COTIZACION ){
      color                     = estado == ESTADO_CTZ.NO_GUARDADO      ? COLORES.NEGRO
                                : estado == ESTADO_CTZ.BORRADOR         ? COLORES.GRIS
                                : estado == ESTADO_CTZ.COTIZADO         ? COLORES.AZUL
                                : estado == ESTADO_CTZ.APROBADO         ? COLORES.VERDE
                                : estado == ESTADO_CTZ.RECHAZADO        ? COLORES.MORADO
                                : estado == ESTADO_CTZ.FACTURADO        ? COLORES.NARANJA
                                : "transparent"
    }
    else
    if( tipo === TIPO_ACUERDO.PEDIDO ){
      color                     = estado == ESTADO_PED.NO_GUARDADO      ? COLORES.NEGRO
                                : estado == ESTADO_PED.CANCELADO        ? COLORES.MORADO
                                : estado == ESTADO_PED.BORRADOR         ? COLORES.GRIS
                                : estado == ESTADO_PED.VALIDADO         ? COLORES.NARANJA
                                : estado == ESTADO_PED.PROCESO          ? COLORES.AZUL
                                : estado == ESTADO_PED.ENTREGADO        ? COLORES.VERDE
                                : "transparent"
    }
    else
    if( tipo === TIPO_ACUERDO.OC_PROVEEDOR ){
      color                     = estado == ESTADO_OC.NO_GUARDADO       ? COLORES.NEGRO
                                : estado == ESTADO_OC.BORRADOR          ? COLORES.GRIS
                                : estado == ESTADO_OC.VALIDADO          ? COLORES.AZUL_OSCURO
                                : estado == ESTADO_OC.APROBADO          ? COLORES.AZUL
                                : estado == ESTADO_OC.PEDIDO_ENVIADO    ? COLORES.AZUL
                                : estado == ESTADO_OC.RECIBIDO_PARCIAL  ? COLORES.NARANJA
                                : estado == ESTADO_OC.RECIBIDO_TOTAL    ? COLORES.VERDE
                                : estado == ESTADO_OC.CANCELADO         ? COLORES.MORADO
                                : estado == ESTADO_OC.CANCELADO_OLD     ? COLORES.MORADO
                                : "transparent"
    }

    return color
  }

  // * ///////////////////////////////////////////////////////////////////////////////  Icono
  static estadoIcono( tipo : TTipoAcuerdo, estado : number ): string
  {
    let icono : string          = ""
    if( tipo === TIPO_ACUERDO.COTIZACION ){
      icono                     = estado == ESTADO_CTZ.NO_GUARDADO      ? "mdi-eraser-variant"
                                : estado == ESTADO_CTZ.BORRADOR         ? "mdi-circle-edit-outline"
                                : estado == ESTADO_CTZ.COTIZADO         ? "mdi-notebook-check"
                                : estado == ESTADO_CTZ.APROBADO         ? "mdi-check-decagram"
                                : estado == ESTADO_CTZ.RECHAZADO        ? "mdi-close-circle"
                                : estado == ESTADO_CTZ.FACTURADO        ? "mdi-lock-check"
                                : ""
    }
    else
    if( tipo === TIPO_ACUERDO.PEDIDO ){
      icono                     = estado == ESTADO_PED.NO_GUARDADO      ? "mdi-eraser-variant"
                                : estado == ESTADO_PED.CANCELADO        ? "mdi-close-circle"
                                : estado == ESTADO_PED.BORRADOR         ? "mdi-circle-edit-outline"
                                : estado == ESTADO_PED.VALIDADO         ? "mdi-check-bold"
                                : estado == ESTADO_PED.PROCESO          ? "mdi-airplane-takeoff"
                                : estado == ESTADO_PED.ENTREGADO        ? "mdi-truck-check"
                                : ""
    }
    else
    if( tipo === TIPO_ACUERDO.OC_PROVEEDOR ){
      icono                     = estado == ESTADO_OC.NO_GUARDADO       ? "mdi-eraser-variant"
                                : estado == ESTADO_OC.BORRADOR          ? "mdi-circle-edit-outline"
                                : estado == ESTADO_OC.VALIDADO          ? "mdi-check-bold"
                                : estado == ESTADO_OC.APROBADO          ? "mdi-check-decagram"
                                : estado == ESTADO_OC.PEDIDO_ENVIADO    ? "mdi-email-check"
                                : estado == ESTADO_OC.RECIBIDO_PARCIAL  ? "mdi-truck"
                                : estado == ESTADO_OC.RECIBIDO_TOTAL    ? "mdi-truck-check"
                                : estado == ESTADO_OC.CANCELADO         ? "mdi-close-circle"
                                : estado == ESTADO_OC.CANCELADO_OLD     ? "mdi-close-circle"
                                : ""
    }

    return icono
  }

  //* /////////////////////////////////////////////////////////////////////////// Color cotizacion desdes estado string  
  static estadoStrCtzToColor( estado : string ): string {
    let color :string           = estado == "Boceto"    ? COLORES.NEGRO
                                : estado == "Edición"   ? COLORES.GRIS
                                : estado == "Cotizado"  ? COLORES.AZUL
                                : estado == "Aprobado"  ? COLORES.VERDE
                                : estado == "Rechazado" ? COLORES.MORADO
                                : estado == "Facturado" ? COLORES.NARANJA
                                : "transparent"
    return color
  }
}

export const estadosCtz       = [
  { value: ESTADO_CTZ.NO_GUARDADO,      label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.COTIZACION,   ESTADO_CTZ.NO_GUARDADO ) },
  { value: ESTADO_CTZ.BORRADOR,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.COTIZACION,   ESTADO_CTZ.BORRADOR    ) },
  { value: ESTADO_CTZ.COTIZADO,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.COTIZACION,   ESTADO_CTZ.COTIZADO    ) },
  { value: ESTADO_CTZ.APROBADO,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.COTIZACION,   ESTADO_CTZ.APROBADO    ) },
  { value: ESTADO_CTZ.RECHAZADO,        label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.COTIZACION,   ESTADO_CTZ.RECHAZADO   ) },
  { value: ESTADO_CTZ.FACTURADO,        label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.COTIZACION,   ESTADO_CTZ.FACTURADO   ) },
]

export const estadosPed       = [
  { value: ESTADO_PED.NO_GUARDADO,      label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO,       ESTADO_PED.NO_GUARDADO ) },
  { value: ESTADO_PED.CANCELADO,        label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO,       ESTADO_PED.CANCELADO ) },
  { value: ESTADO_PED.BORRADOR,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO,       ESTADO_PED.BORRADOR ) },
  { value: ESTADO_PED.VALIDADO,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO,       ESTADO_PED.VALIDADO ) },
  { value: ESTADO_PED.PROCESO,          label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO,       ESTADO_PED.PROCESO ) },
  { value: ESTADO_PED.ENTREGADO,        label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO,       ESTADO_PED.ENTREGADO ) },
]

export const estadosOC       = [
  { value: ESTADO_OC.BORRADOR,          label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.OC_PROVEEDOR, ESTADO_OC.BORRADOR ) },
  { value: ESTADO_OC.VALIDADO,          label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.OC_PROVEEDOR, ESTADO_OC.VALIDADO ) },
  { value: ESTADO_OC.APROBADO,          label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.OC_PROVEEDOR, ESTADO_OC.APROBADO ) },
  { value: ESTADO_OC.PEDIDO_ENVIADO,    label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.OC_PROVEEDOR, ESTADO_OC.PEDIDO_ENVIADO ) },
  { value: ESTADO_OC.RECIBIDO_PARCIAL,  label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.OC_PROVEEDOR, ESTADO_OC.RECIBIDO_PARCIAL ) },
  { value: ESTADO_OC.RECIBIDO_TOTAL,    label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.OC_PROVEEDOR, ESTADO_OC.RECIBIDO_TOTAL ) },
  { value: ESTADO_OC.CANCELADO,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.OC_PROVEEDOR, ESTADO_OC.CANCELADO ) },
]