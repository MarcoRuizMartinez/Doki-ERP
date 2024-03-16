export enum TIPO_ACUERDO
{
  NULO                        = "",
  COTIZACION_CLI              = "cotización", // Igual que el END POINT del servicio
  COTIZACION_PRO              = "cotizaciónPro", // Igual que el END POINT del servicio
  PEDIDO_CLI                  = "pedido",
  PEDIDO_PRO                  = "pedidoPro",
  ENTREGA_CLI                 = "entrega",
  ENTREGA_PRO                 = "entregaPro",
  FACTURA_CLI                 = "factura",
  FACTURA_PRO                 = "facturaPro",
}

export type TTipoAcuerdo      =   TIPO_ACUERDO.COTIZACION_CLI
                                | TIPO_ACUERDO.COTIZACION_PRO
                                | TIPO_ACUERDO.PEDIDO_CLI
                                | TIPO_ACUERDO.PEDIDO_PRO
                                | TIPO_ACUERDO.ENTREGA_CLI
                                | TIPO_ACUERDO.ENTREGA_PRO
                                | TIPO_ACUERDO.FACTURA_CLI
                                | TIPO_ACUERDO.FACTURA_PRO
                                | TIPO_ACUERDO.NULO

enum COLORES
{
  NEGRO                       = "#1A1A1A",
  GRIS                        = "#a0a0a0",
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
  ENTREGANDO                  = 2,
  ENTREGADO                   = 3,
}


export enum ESTADO_ENT
{
  NO_GUARDADO                 = -2,
  CANCELADO                   = -1,
  BORRADOR                    = 0,
  VALIDADO                    = 1,
  ENTREGADO                   = 2,
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
    if( tipo === TIPO_ACUERDO.COTIZACION_CLI ){
      valor                     = estado == ESTADO_CTZ.NO_GUARDADO      ? "Boceto"
                                : estado == ESTADO_CTZ.BORRADOR         ? "Edición"
                                : estado == ESTADO_CTZ.COTIZADO         ? "Cotizado"
                                : estado == ESTADO_CTZ.APROBADO         ? "Aprobado"
                                : estado == ESTADO_CTZ.RECHAZADO        ? "Rechazado"
                                : estado == ESTADO_CTZ.FACTURADO        ? "Facturado"
                                : ""
    }
    else
    if( tipo === TIPO_ACUERDO.PEDIDO_CLI ){
      valor                     = estado == ESTADO_PED.NO_GUARDADO      ? "Boceto"
                                : estado == ESTADO_PED.CANCELADO        ? "Cancelado"
                                : estado == ESTADO_PED.BORRADOR         ? "Borrador"
                                : estado == ESTADO_PED.VALIDADO         ? "Validado"
                                : estado == ESTADO_PED.ENTREGANDO       ? "Entregando"
                                : estado == ESTADO_PED.ENTREGADO        ? "Entregado"
                                : ""
    }
    else
    if( tipo === TIPO_ACUERDO.ENTREGA_CLI ){
      valor                     = estado == ESTADO_ENT.NO_GUARDADO      ? "Boceto"
                                : estado == ESTADO_ENT.CANCELADO        ? "Cancelado"
                                : estado == ESTADO_ENT.BORRADOR         ? "Borrador"
                                : estado == ESTADO_ENT.VALIDADO         ? "Programado"
                                : estado == ESTADO_ENT.ENTREGADO        ? "Entregado"
                                : ""
    }
    else
    if( tipo === TIPO_ACUERDO.PEDIDO_PRO ){
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
    if( tipo === TIPO_ACUERDO.COTIZACION_CLI ){
      color                     = estado == ESTADO_CTZ.NO_GUARDADO      ? COLORES.NEGRO
                                : estado == ESTADO_CTZ.BORRADOR         ? COLORES.GRIS
                                : estado == ESTADO_CTZ.COTIZADO         ? COLORES.AZUL
                                : estado == ESTADO_CTZ.APROBADO         ? COLORES.VERDE
                                : estado == ESTADO_CTZ.RECHAZADO        ? COLORES.MORADO
                                : estado == ESTADO_CTZ.FACTURADO        ? COLORES.NARANJA
                                : "transparent"
    }
    else
    if( tipo === TIPO_ACUERDO.PEDIDO_CLI ){
      color                     = estado == ESTADO_PED.NO_GUARDADO      ? COLORES.NEGRO
                                : estado == ESTADO_PED.CANCELADO        ? COLORES.MORADO
                                : estado == ESTADO_PED.BORRADOR         ? COLORES.GRIS
                                : estado == ESTADO_PED.VALIDADO         ? COLORES.NARANJA
                                : estado == ESTADO_PED.ENTREGANDO       ? COLORES.AZUL
                                : estado == ESTADO_PED.ENTREGADO        ? COLORES.VERDE
                                : "transparent"
    }
    else
    if( tipo === TIPO_ACUERDO.ENTREGA_CLI ){
      color                     = estado == ESTADO_ENT.NO_GUARDADO      ? COLORES.NEGRO
                                : estado == ESTADO_ENT.CANCELADO        ? COLORES.MORADO
                                : estado == ESTADO_ENT.BORRADOR         ? COLORES.GRIS
                                : estado == ESTADO_ENT.VALIDADO         ? COLORES.NARANJA
                                : estado == ESTADO_ENT.ENTREGADO        ? COLORES.VERDE
                                : "transparent"
    }
    else
    if( tipo === TIPO_ACUERDO.PEDIDO_PRO ){
      color                     = estado == ESTADO_OC.NO_GUARDADO       ? COLORES.NEGRO
                                : estado == ESTADO_OC.BORRADOR          ? COLORES.GRIS
                                : estado == ESTADO_OC.VALIDADO          ? COLORES.AZUL_OSCURO
                                : estado == ESTADO_OC.APROBADO          ? COLORES.NARANJA
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
    if( tipo === TIPO_ACUERDO.COTIZACION_CLI ){
      icono                     = estado == ESTADO_CTZ.NO_GUARDADO      ? "mdi-eraser-variant"
                                : estado == ESTADO_CTZ.BORRADOR         ? "mdi-circle-edit-outline"
                                : estado == ESTADO_CTZ.COTIZADO         ? "mdi-notebook-check"
                                : estado == ESTADO_CTZ.APROBADO         ? "mdi-check-decagram"
                                : estado == ESTADO_CTZ.RECHAZADO        ? "mdi-close-circle"
                                : estado == ESTADO_CTZ.FACTURADO        ? "mdi-lock-check"
                                : ""
    }
    else
    if( tipo === TIPO_ACUERDO.PEDIDO_CLI ){
      icono                     = estado == ESTADO_PED.NO_GUARDADO      ? "mdi-eraser-variant"
                                : estado == ESTADO_PED.CANCELADO        ? "mdi-close-circle"
                                : estado == ESTADO_PED.BORRADOR         ? "mdi-circle-edit-outline"
                                : estado == ESTADO_PED.VALIDADO         ? "mdi-check-bold"
                                : estado == ESTADO_PED.ENTREGANDO       ? "mdi-truck-delivery"
                                : estado == ESTADO_PED.ENTREGADO        ? "mdi-truck-check"
                                : ""
    }
    else
    if( tipo === TIPO_ACUERDO.ENTREGA_CLI ){
      icono                     = estado == ESTADO_ENT.NO_GUARDADO      ? "mdi-eraser-variant"
                                : estado == ESTADO_ENT.CANCELADO        ? "mdi-close-circle"
                                : estado == ESTADO_ENT.BORRADOR         ? "mdi-circle-edit-outline"
                                : estado == ESTADO_ENT.VALIDADO         ? "mdi-calendar-check"
                                : estado == ESTADO_ENT.ENTREGADO        ? "mdi-truck-check"
                                : ""
    }
    else
    if( tipo === TIPO_ACUERDO.PEDIDO_PRO ){
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
  { value: ESTADO_CTZ.NO_GUARDADO,      label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.COTIZACION_CLI,   ESTADO_CTZ.NO_GUARDADO ) },
  { value: ESTADO_CTZ.BORRADOR,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.COTIZACION_CLI,   ESTADO_CTZ.BORRADOR    ) },
  { value: ESTADO_CTZ.COTIZADO,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.COTIZACION_CLI,   ESTADO_CTZ.COTIZADO    ) },
  { value: ESTADO_CTZ.APROBADO,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.COTIZACION_CLI,   ESTADO_CTZ.APROBADO    ) },
  { value: ESTADO_CTZ.RECHAZADO,        label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.COTIZACION_CLI,   ESTADO_CTZ.RECHAZADO   ) },
  { value: ESTADO_CTZ.FACTURADO,        label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.COTIZACION_CLI,   ESTADO_CTZ.FACTURADO   ) },
]

export const estadosPed       = [
  { value: ESTADO_PED.NO_GUARDADO,      label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO_CLI,       ESTADO_PED.NO_GUARDADO ) },
  { value: ESTADO_PED.CANCELADO,        label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO_CLI,       ESTADO_PED.CANCELADO ) },
  { value: ESTADO_PED.BORRADOR,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO_CLI,       ESTADO_PED.BORRADOR ) },
  { value: ESTADO_PED.VALIDADO,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO_CLI,       ESTADO_PED.VALIDADO ) },
  { value: ESTADO_PED.ENTREGANDO,       label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO_CLI,       ESTADO_PED.ENTREGANDO ) },
  { value: ESTADO_PED.ENTREGADO,        label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO_CLI,       ESTADO_PED.ENTREGADO ) },
]

export const estadosEnt       = [
  { value: ESTADO_ENT.NO_GUARDADO,      label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.ENTREGA_CLI,      ESTADO_ENT.NO_GUARDADO ) },
  { value: ESTADO_ENT.CANCELADO,        label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.ENTREGA_CLI,      ESTADO_ENT.CANCELADO ) },
  { value: ESTADO_ENT.BORRADOR,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.ENTREGA_CLI,      ESTADO_ENT.BORRADOR ) },
  { value: ESTADO_ENT.VALIDADO,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.ENTREGA_CLI,      ESTADO_ENT.VALIDADO ) },
  { value: ESTADO_ENT.ENTREGADO,        label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.ENTREGA_CLI,      ESTADO_ENT.ENTREGADO ) },
]

export const estadosOC       = [
  { value: ESTADO_OC.BORRADOR,          label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO_PRO, ESTADO_OC.BORRADOR ) },
  { value: ESTADO_OC.VALIDADO,          label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO_PRO, ESTADO_OC.VALIDADO ) },
  { value: ESTADO_OC.APROBADO,          label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO_PRO, ESTADO_OC.APROBADO ) },
  { value: ESTADO_OC.PEDIDO_ENVIADO,    label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO_PRO, ESTADO_OC.PEDIDO_ENVIADO ) },
  { value: ESTADO_OC.RECIBIDO_PARCIAL,  label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO_PRO, ESTADO_OC.RECIBIDO_PARCIAL ) },
  { value: ESTADO_OC.RECIBIDO_TOTAL,    label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO_PRO, ESTADO_OC.RECIBIDO_TOTAL ) },
  { value: ESTADO_OC.CANCELADO,         label: EstadosAcuerdos.estadoToName( TIPO_ACUERDO.PEDIDO_PRO, ESTADO_OC.CANCELADO ) },
]