export enum TIPO_ACUERDO
{
  COTIZACION                  = "cotizaciones", // Igual que el END POINT del servicio
  PEDIDO                      = "pedido",
  ENTREGA                     = "entraga",
  FACTURA                     = "factura",
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



export function estadoCtzToName( estado : number ): string {
  let valor :string         =   estado == ESTADO_CTZ.NO_GUARDADO  ? "Boceto"
                              : estado == ESTADO_CTZ.BORRADOR     ? "Edición"
                              : estado == ESTADO_CTZ.COTIZADO     ? "Cotizado"
                              : estado == ESTADO_CTZ.APROBADO     ? "Aprobado"
                              : estado == ESTADO_CTZ.RECHAZADO    ? "Rechazado"
                              : estado == ESTADO_CTZ.FACTURADO    ? "Facturado"
                              : ""
  return valor
}
export function estadoPedToName( estado : number ): string {
  let valor :string         =   estado == ESTADO_PED.NO_GUARDADO  ? "Boceto"
                              : estado == ESTADO_PED.CANCELADO    ? "Cancelado"
                              : estado == ESTADO_PED.BORRADOR     ? "Edición"
                              : estado == ESTADO_PED.VALIDADO     ? "Validado"
                              : estado == ESTADO_PED.PROCESO      ? "Entregando"
                              : estado == ESTADO_PED.ENTREGADO    ? "Entregado"
                              : ""
  return valor
}


export function estadoCtzToColor( estado : number ): string
{
  let color :string           = estado == ESTADO_CTZ.NO_GUARDADO ? "#1A1A1A"
                              : estado == ESTADO_CTZ.BORRADOR    ? "#BCBABA"
                              : estado == ESTADO_CTZ.COTIZADO    ? "#0f61dd"
                              : estado == ESTADO_CTZ.APROBADO    ? "#06c700"
                              : estado == ESTADO_CTZ.RECHAZADO   ? "#832362"
                              : estado == ESTADO_CTZ.FACTURADO   ? "#FF6805"
                              : "transparent"
  return color
}


export function estadoPedToColor( estado : number ): string
{
  let color :string           = estado == ESTADO_PED.NO_GUARDADO  ? "#1A1A1A"
                              : estado == ESTADO_PED.CANCELADO    ? "#BCBABA"
                              : estado == ESTADO_PED.BORRADOR     ? "#0f61dd"
                              : estado == ESTADO_PED.VALIDADO     ? "#06c700"
                              : estado == ESTADO_PED.PROCESO      ? "#832362"
                              : estado == ESTADO_PED.ENTREGADO    ? "#FF6805"
                              : "transparent"
  return color
}

export const estadosCtz       = [
  { value: ESTADO_CTZ.NO_GUARDADO,  label: estadoCtzToName( ESTADO_CTZ.NO_GUARDADO ) },
  { value: ESTADO_CTZ.BORRADOR,     label: estadoCtzToName( ESTADO_CTZ.BORRADOR    ) },
  { value: ESTADO_CTZ.COTIZADO,     label: estadoCtzToName( ESTADO_CTZ.COTIZADO    ) },
  { value: ESTADO_CTZ.APROBADO,     label: estadoCtzToName( ESTADO_CTZ.APROBADO    ) },
  { value: ESTADO_CTZ.RECHAZADO,    label: estadoCtzToName( ESTADO_CTZ.RECHAZADO   ) },
  { value: ESTADO_CTZ.FACTURADO,    label: estadoCtzToName( ESTADO_CTZ.FACTURADO   ) },
]

export const estadosPed       = [
  { value: ESTADO_PED.NO_GUARDADO,  label: estadoPedToName( ESTADO_PED.NO_GUARDADO ) },
  { value: ESTADO_PED.CANCELADO,    label: estadoPedToName( ESTADO_PED.CANCELADO ) },
  { value: ESTADO_PED.BORRADOR,     label: estadoPedToName( ESTADO_PED.BORRADOR ) },
  { value: ESTADO_PED.VALIDADO,     label: estadoPedToName( ESTADO_PED.VALIDADO ) },
  { value: ESTADO_PED.PROCESO,      label: estadoPedToName( ESTADO_PED.PROCESO ) },
  { value: ESTADO_PED.ENTREGADO,    label: estadoPedToName( ESTADO_PED.ENTREGADO ) },
]

export function estadoStrCtzToColor( estado : string ): string
{
  let color :string           = estado == "Boceto"    ? "#1A1A1A"
                              : estado == "Edición"   ? "#BCBABA"
                              : estado == "Cotizado"  ? "#0f61dd"
                              : estado == "Aprobado"  ? "#06c700"
                              : estado == "Rechazado" ? "#832362"
                              : estado == "Facturado" ? "#FF6805"
                              : "transparent"
  return color
}
