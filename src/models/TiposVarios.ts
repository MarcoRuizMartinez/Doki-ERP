export const enum CODES_FETCH{
  AbortError          = 20,
  OK                  = 200,
  errorConsulta       = -20,
  errorDesconocido    = -21,
  sinConexion         = -2,
}

export interface IResultado {
  data?:      any | any[] | object | object[] | string | number
  codigo:     CODES_FETCH
  ok:         boolean
}

export interface ILabelValue {
  label:      string
  value:      any
}
export const labelValueNulo : ILabelValue = { label: "", value: null }

export type  EstadoVerificar  = "off" | "verificando"  | "check" | "alert"
export type  TModosVentana    = "normal" | "buscando" | "esperando-busqueda" | "sin-resultados"

export function BuscarLabelValue( opciones : ILabelValue[], value : number | string ) : ILabelValue
{
  return opciones.find( lv => lv.value === value ) ?? labelValueNulo
}

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
  COL_ENTREGAS    = "v3-colEntregas",
  COL_PRODUCTOS   = "v3-colProductos",
  COL_INVENTIVOS  = "v3-colProductos",
  COL_TAREAS      = "v3-coltTareas",
  COL_COTZ_ENVI   = "v3-colCotizEnvio",
  FECHA_LISTAS    = "v3-fechaListas",
  VERSION_DEXIE   = "v3-VD",
  VISTA_PEDIDO    = "v3-vPedido",
  VISTA_ENTREGA   = "v3-vEntrega",
  VISTA_OC        = "v3-vOC",
  VISTA_COTIZA    = "v3-vCotizacion",
}

export const AlmacenesLimpiar  : string[] = [
  ALMACEN_LOCAL.COL_TERCEROS,
  ALMACEN_LOCAL.COL_ACUERDOS,
  ALMACEN_LOCAL.COL_COTIZACIONES,
  ALMACEN_LOCAL.COL_PEDIDOS,
  ALMACEN_LOCAL.COL_ENTREGAS,
  ALMACEN_LOCAL.COL_OC_PROVEE,
  ALMACEN_LOCAL.COL_PRODUCTOS,
  ALMACEN_LOCAL.COL_INVENTIVOS,
  ALMACEN_LOCAL.COL_TAREAS,
  ALMACEN_LOCAL.COL_COTZ_ENVI,
  ALMACEN_LOCAL.FECHA_LISTAS,
  ALMACEN_LOCAL.VISTA_PEDIDO,
  ALMACEN_LOCAL.VISTA_ENTREGA,
  ALMACEN_LOCAL.VISTA_OC,
  ALMACEN_LOCAL.VISTA_COTIZA,
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

export function getArea( area : string ) : string
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
  CONTABLE        = "Contable",
  EN_NOMINA       = "Nomina",
  MIEMBRO         = "Miembro",
}

// #region Loading
export interface ILoading {
  carga           ?: boolean
  crear           ?: boolean
  borrar          ?: boolean
  validar         ?: boolean
  cerrar          ?: boolean
  editar          ?: boolean
  anular          ?: boolean
  aprobar         ?: boolean
  pdf             ?: boolean
  origen          ?: boolean
  ref             ?: boolean
  comercial       ?: boolean
  fechaFinValidez ?: boolean
  fechaEntrega    ?: boolean
  fechaADespachar ?: boolean
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
  ordenando       ?: boolean
  borrarLote      ?: boolean
  editarGrupo     ?: boolean
  subtotal        ?: boolean
  notaPublica     ?: boolean
  notaPrivada     ?: boolean
  url             ?: boolean
  proyecto        ?: boolean
  enlaces         ?: boolean
  incentivo       ?: boolean
  calificacion    ?: boolean
  commentsLoad    ?: boolean
  eventosLoad     ?: boolean
  entregas        ?: boolean
  facturar        ?: boolean
  aceptarProveedor?: boolean
}

export const LoadingDefault = {
  carga           : false,
  crear           : false,
  borrar          : false,
  validar         : false,
  cerrar          : false,
  editar          : false,
  anular          : false,
  aprobar         : false,
  pdf             : false,
  origen          : false,
  ref             : false,
  comercial       : false,
  fechaFinValidez : false,
  fechaEntrega    : false,
  fechaADespachar : false,
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
  ordenando       : false,
  borrarLote      : false,
  editarGrupo     : false,
  subtotal        : false,
  notaPublica     : false,
  notaPrivada     : false,
  url             : false,
  proyecto        : false,
  enlaces         : false,
  incentivo       : false,
  calificacion    : false,
  commentsLoad    : false,
  eventosLoad     : false,
  entregas        : false,
  facturar        : false,
  aceptarProveedor: false,
}

// #region Modales
export interface IModales {
  formulario      ?: boolean
  editarEnLote    ?: boolean
  añadirProductos ?: boolean
  ordenar         ?: boolean
  pdf             ?: boolean
  remision        ?: boolean
  rotulos         ?: boolean
  comisiones      ?: boolean
  nuevaEntrega    ?: boolean
  incentivo       ?: boolean
  detalles        ?: boolean
  calendario      ?: boolean
  siigo           ?: boolean
  entrega         ?: boolean
  acta            ?: boolean
}

export const ModalesDefault = {
  formulario      : false,
  editarEnLote    : false,
  añadirProductos : false,
  ordenar         : false,
  pdf             : false,
  remision        : false,
  rotulos         : false,
  comisiones      : false,
  nuevaEntrega    : false,
  incentivo       : false,
  detalles        : false,
  calendario      : false,
  siigo           : false,
  entrega         : false,
  acta            : false,
}



// #region Orden CSS
export interface IOrdenCSS {
  productos       : number
  entregas        : number
  /* tercero         : number
  condiciones     : number
  totales         : number
  contactos       : number
  enlaces         : number
  documentos      : number
  anticipos       : number
  notas           : number */
}


export const OrdenCSS : IOrdenCSS = {
  productos       : 80,
  entregas        : 90,
  /* tercero         : 10,
  condiciones     : 20,
  totales         : 30,
  contactos       : 40,
  enlaces         : 50,
  documentos      : 60,
  anticipos       : 70,
  notas           : 100, */
}



