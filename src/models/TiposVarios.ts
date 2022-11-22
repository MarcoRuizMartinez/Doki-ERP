export const enum CODES_FETCH{
  AbortError          = 20,
  OK                  = 200,
  errorConsulta       = -20,
  errorDesconocido    = -21,
  sinConexion         = -2,
}

export interface IResultado {
  data?:      object | any[] | string | number | object[]
  codigo:     CODES_FETCH
  ok:         boolean
}

export interface ILabelValue {
  label:      string
  value:      any
}
export const labelValueNulo : ILabelValue = { label: "", value: null }

export type  EstadoVerificar  = "off" | "verificando"  | "check" | "alert"
export type  ModosVentana     = "normal" | "buscando" | "esperando-busqueda" | "sin-resultados"

export const enum ALMACEN_LOCAL { 
  COLOR           = "v3-color",
  FONDO           = "v3-fondo",
  PATRON          = "v3-patron",
  TOKEN           = "v3-token",
  FECHA_LOGIN     = "v3-fecha",
  USUARIO         = "v3-usuario",
  PERMISOS        = "v3-permisos",
  MENU_IZQUIERDO  = "v3-menuIzquierdo",
  COL_TERCEROS    = "v3-colTerceros",
  COL_ACUERDOS    = "v3-colAcuerdos",
  COL_COTIZACIONES= "v3-colCotizaciones",
  COL_PEDIDOS     = "v3-colPedidos",
  COL_OC_PROVEE   = "v3-colOcProveedor",
  COL_PRODUCTOS   = "v3-colProductos",
  FECHA_LISTAS    = "v3-fechaListas",
}

export const AlmacenesLimpiar  : string[] = [  
  ALMACEN_LOCAL.COL_TERCEROS,
  ALMACEN_LOCAL.COL_ACUERDOS,
  ALMACEN_LOCAL.COL_COTIZACIONES,
  ALMACEN_LOCAL.COL_PEDIDOS,
  ALMACEN_LOCAL.COL_OC_PROVEE,  
  ALMACEN_LOCAL.COL_PRODUCTOS,
  ALMACEN_LOCAL.FECHA_LISTAS
]

export const enum ORIGEN {
  APP             = "app",
  LOGIN           = "login",
}

export const enum TIPO_USUARIO {
  NULO            = "",
  COMERCIAL       = "1",
  ADMINISTRACION  = "2",
  GERENCIA        = "3",
  PRODUCTOS       = "4",
  LOGISTICA       = "5",    
}

export const enum AREA {
  NULO            = "",
  ESCOM           = "1",
  MUBLEX          = "2",
  GLOBAL          = "3",
}

export const Areas = [
{ label: "Global", value: AREA.GLOBAL   },
{ label: "Escom",  value: AREA.ESCOM    },
{ label: "Mublex", value: AREA.MUBLEX   }
]

export function getArea( area : AREA ) : string
{
  return    area === AREA.ESCOM   ? "Escom"
          : area === AREA.MUBLEX  ? "Mublex"
          : area === AREA.GLOBAL  ? "Global"
          : ""
}

export const enum GRUPO_USUARIO {
  ADMINISTRACION  = "Administración",
  COMERCIALES     = "Comerciales",
  GERENCIA        = "Gerencia",
  PRODUCCION      = "Producción",
  PRODUCTOS       = "Productos",
  DESARROLLO      = "Desarrollo",
}


export interface ILoading {
  carga           ?: boolean
  crear           ?: boolean
  borrar          ?: boolean
  validar         ?: boolean
  editar          ?: boolean
  anular          ?: boolean
  aprobar         ?: boolean
  pdf             ?: boolean
  origen          ?: boolean
  ref             ?: boolean
  comercial       ?: boolean
  fechaFinValidez ?: boolean
  fechaEntrega    ?: boolean
  condicionPago   ?: boolean
  formaPago       ?: boolean
  metodoEntrega   ?: boolean
  tiempoEntrega   ?: boolean
  conTotal        ?: boolean
  conIVA          ?: boolean  
  conAIU          ?: boolean
  valoresAIU      ?: boolean  
  añadir          ?: boolean
  borrarLinea     ?: boolean
  editarLinea     ?: boolean
  editarLote      ?: boolean
  borrarLote      ?: boolean
  editarGrupo     ?: boolean
  subtotal        ?: boolean
  notaPublica     ?: boolean
  notaPrivada     ?: boolean
  url             ?: boolean
  proyecto        ?: boolean
}

export const LoadingDefault = {
  carga           : false,
  crear           : false,
  borrar          : false,
  validar         : false,
  editar          : false,
  anular          : false,
  aprobar         : false,
  pdf             : false,
  origen          : false,
  ref             : false,
  comercial       : false,
  fechaFinValidez : false,
  fechaEntrega    : false,
  condicionPago   : false,
  formaPago       : false,
  metodoEntrega   : false,
  tiempoEntrega   : false,
  conTotal        : false,
  conIVA          : false,
  conAIU          : false,
  valoresAIU      : false,
  añadir          : false,
  borrarLinea     : false,
  editarLinea     : false,
  editarLote      : false,
  borrarLote      : false,
  editarGrupo     : false,
  subtotal        : false,
  notaPublica     : false,
  notaPrivada     : false,
  url             : false,
  proyecto        : false,
}


export interface IModales {
  formulario      ?: boolean
  editarEnLote    ?: boolean
  añadirProductos ?: boolean
}

export const ModalesDefault = {
  formulario      : false,
  editarEnLote    : false,
  añadirProductos : false,
}