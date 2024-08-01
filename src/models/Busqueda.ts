import {  TIPO_ACUERDO, TTipoAcuerdo    } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  Areas,
          ILabelValue,  
          labelValueNulo                } from "src/models/TiposVarios"
import {  IUsuario, Usuario             } from "src/areas/usuarios/models/Usuario"
import {  IMunicipio, Municipio         } from "src/models/Municipio"
import {  INCENTIVO_ESTADO,
          INCENTIVO_RAZON,
          INCENTIVO_ORIGEN,
          INCENTIVO_ESTADO_PAGO         } from "src/areas/nomina/models/Incentivo"
import {  Prioridades, Cuando, Progresos} from "src/areas/comunicacion/models/Accion"            
import {  Anticipo                      } from "src/areas/acuerdos/models/Anticipo"
import {  DIMENSIONES                   } from "src/areas/acuerdos/models/SerieAcuerdo"
import {  Periodo, PERIODO              } from "src/models/TiposInformes"
import {  TiposProductosProveedor       } from "src/areas/productos/models/TipoProductoProveedor"
import {  Incentivo                     } from "src/areas/nomina//models/Incentivo"
import {  estadosCtz, estadosPed,
          estadosOC,  estadosEnt        } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  getUsuarioDB,
          getUnidadesDB,
          getMunicipioDB,
          getFormasPagoDB,
          getCategoriasDB,
          getNaturalezasDB,
          getProveedoresDB,
          getMetodosEntregaDB,
          getUsuariosByGrupoDB,
          getCondicionesPagoDB,
          getOrigenesContactoDB         } from "src/composables/useDexie"
import {  LocationQuery                 } from "vue-router"
import {  ToolQuery, ToolType, Tool     } from "src/composables/useTools"

export interface      IQuery {
  //tipo                 ?: string
  id                   ?: number
  refs                 ?: string // Array de referencias
  acuerdo              ?: TTipoAcuerdo
  user                 ?: number
  usuario              ?: string | number
  usuarios             ?: string  // Array de IDs de usuarios 1_2_4
  creadores            ?: string  // Array de IDs de usuarios 1_2_4
  creador              ?: string | number
  buscar               ?: string
  buscar1              ?: string
  buscar2              ?: string
  buscar3              ?: string
  buscar4              ?: string
  idTercero            ?: number
  contacto             ?: string
  estados              ?: string
  tpp                  ?: string  // Tipo Producto Proveedor
  cuando               ?: string
  prioridad            ?: string
  progreso             ?: string
  origenes             ?: string
  condiciones          ?: string
  formaPago            ?: string
  entrega              ?: string
  estadoAnticipo       ?: string
  tipoAnticipo         ?: string

  fechaDesde           ?: string
  fechaHasta           ?: string
  desde2               ?: string
  hasta2               ?: string  

  diasDesde            ?: number
  diasHasta            ?: number
  diasDDesde           ?: number
  diasDHasta           ?: number

  //valiDesde            ?: string
  //valiHasta            ?: string
  aproDesdeDia          ?: number
  aproHastaDia          ?: number

  //enviaDesde           ?: string
  //enviaHasta           ?: string
  enviaDesdeDia         ?: number
  enviaHastaDia         ?: number

  proveedorId          ?: number
  categoriaId          ?: number
  und                  ?: number
  ntz                  ?: number
  facturado            ?: number
  conIva               ?: number
  conTotal             ?: number
  interno              ?: number
  conOrdenes           ?: number
  listoDespacho        ?: number
  l1                   ?: number
  l2                   ?: number
  l3                   ?: number
  l4                   ?: number
  l5                   ?: number
  l6                   ?: number
  l7                   ?: number
  l8                   ?: number
  l9                   ?: number
  l11                  ?: number
  l12                  ?: number
  l13                  ?: number
  l14                  ?: number
  l15                  ?: number
  l16                  ?: number
  l17                  ?: number
  l18                  ?: number
  l19                  ?: number
  aprobado             ?: number
  extra                ?: number
  limite               ?: number
  offset               ?: number
  count                ?: number
  area                 ?: string
  orden                ?: "ASC"  | "DESC"
  municipio            ?: number | string
  municipioContacto    ?: number | string
  origenId             ?: number
  valorMin             ?: number
  valorMax             ?: number
  min1                 ?: number
  max1                 ?: number
  min2                 ?: number
  max2                 ?: number
  min3                 ?: number
  max3                 ?: number
  min4                 ?: number
  max4                 ?: number
  min5                 ?: number
  max5                 ?: number      
  min6                 ?: number
  max6                 ?: number
  incEstado            ?: INCENTIVO_ESTADO
  incRazon             ?: INCENTIVO_RAZON
  incOrigen            ?: INCENTIVO_ORIGEN
  incPago              ?: INCENTIVO_ESTADO_PAGO
  origenTipo           ?: number

  // * //////////////   Terceros
  favorito             ?: number
  destacado            ?: number  
  tipoTercero          ?: number
  esCliente            ?: number
  esProveedor          ?: number
  color                ?: number
  activo               ?: string
  disponible           ?: string
  actualizado          ?: string

  // * //////////////   Producto
  nombre               ?: string
  qty                  ?: number
  peso                 ?: number
  altura               ?: number
  ancho                ?: number
  fondo                ?: number

  // * //////////////   Informes
  periodo              ?: Periodo
  dimension            ?: string

  // * //////////////   Informes
  codigo               ?: string 
  elementoId           ?: number
  elementoTipo         ?: string

  // * //////////////   Acciones o eventos
  permisos             ?: number

  // * //////////////   
  envioOC              ?: number
  aceptado             ?: number
}

interface               IOpciones {
  opcionesOk            : boolean
  usuarios              : ILabelValue[]
  creadores             : ILabelValue[]  
  condicionesPago       : ILabelValue[]
  formasPago            : ILabelValue[]
  metodosEntrega        : ILabelValue[]
  proveedores           : ILabelValue[]
  categorias            : ILabelValue[]
  origenes              : ILabelValue[]
  estados               : ILabelValue[]
  tiposProductosProv    : ILabelValue[]
  naturalezas           : ILabelValue[]
  unidades              : ILabelValue[]
}

interface               ICampos {
  copiando              : boolean
  buscar                : string
  buscar1               : string
  buscar2               : string
  buscar3               : string
  buscar4               : string
  contacto              : string

  desde                 : Date | string
  hasta                 : Date | string
  desde2                : Date | string
  hasta2                : Date | string  
  diasDesde             : number | undefined
  diasHasta             : number | undefined
  diasDDesde            : number | undefined
  diasDHasta            : number | undefined  

  //valiDesde             : Date | string
  //valiHasta             : Date | string
  aproDesdeDia           : number | undefined
  aproHastaDia           : number | undefined

  //enviaDesde            : Date | string
  //enviaHasta            : Date | string
  enviaDesdeDia          : number | undefined
  enviaHastaDia          : number | undefined

  valorMin              : number | undefined
  valorMax              : number | undefined
  min1                  : number | undefined
  max1                  : number | undefined
  min2                  : number | undefined
  max2                  : number | undefined
  min3                  : number | undefined
  max3                  : number | undefined
  min4                  : number | undefined
  max4                  : number | undefined
  min5                  : number | undefined
  max5                  : number | undefined      
  min6                  : number | undefined
  max6                  : number | undefined
  
  estados               : ILabelValue[]
  tiposProProve         : ILabelValue[]
  cuando                : ILabelValue[]
  prioridad             : ILabelValue[]
  progreso              : ILabelValue[]
  origenes              : ILabelValue[]
  usuarios              : ILabelValue[]
  creadores             : ILabelValue[]  
  condiciones           : ILabelValue[]
  formaPago             : ILabelValue[]
  entrega               : ILabelValue[]
  estadoAnticipo        : ILabelValue[]
  tipoAnticipo          : ILabelValue[]  
  area                  : ILabelValue
  facturado             : ILabelValue
  conIva                : ILabelValue
  totalizado            : ILabelValue
  tipoTercero           : ILabelValue
  envioOC               : ILabelValue
  aceptado              : ILabelValue
  terceroInterno        : ILabelValue
  conOrdenes            : ILabelValue
  listoDespacho         : ILabelValue
  l1                    : ILabelValue
  l2                    : ILabelValue
  l3                    : ILabelValue
  l4                    : ILabelValue
  l5                    : ILabelValue
  l6                    : ILabelValue
  l7                    : ILabelValue
  l8                    : ILabelValue
  l9                    : ILabelValue
  l11                   : ILabelValue
  l12                   : ILabelValue
  l13                   : ILabelValue
  l14                   : ILabelValue
  l15                   : ILabelValue
  l16                   : ILabelValue
  l17                   : ILabelValue
  l18                   : ILabelValue
  l19                   : ILabelValue
  aprobado              : ILabelValue
  extra                 : ILabelValue
  proveedores           : ILabelValue  
  categorias            : ILabelValue  
  und                   : ILabelValue  
  ntz                   : ILabelValue  
  incPago               : ILabelValue
  incEstado             : ILabelValue
  incRazon              : ILabelValue
  incOrigen             : ILabelValue  
  activo                : ILabelValue
  disponible            : ILabelValue
  actualizado           : ILabelValue
  dimension             : ILabelValue
  periodo               : ILabelValue  
  municipio             : IMunicipio
  municipioContacto     : IMunicipio
  usuario              ?: IUsuario
  creador              ?: IUsuario
  resultadosXPage       : number
  pagina                : number  
  favorito              : boolean
  destacado             : boolean
  color                 : boolean
  nombre                : string
  qty                   : number | undefined
  peso                  : number | undefined
  altura                : number | undefined
  ancho                 : number | undefined
  fondo                 : number | undefined
}

import {  Router           } from "vue-router"
//import { Permisos } from '../areas/usuarios/models/Permisos';

export interface        IBusqueda {
  query                 : IQuery
  usuarioId             : number        // id de usuario que busca
  router                : Router | null
  rourterQ              : LocationQuery
  acuerdo               : TTipoAcuerdo
  f                     : ICampos       // f de fiels
  o                     : IOpciones     // o de opciones
  usuarioIdInicio       : number
  haySiguientePagina    : boolean
  montadoOk             : boolean
  puedeCambiarUser      : boolean
  haceAutoSelect        : boolean
  copiaPagina           : number
  label                 : string
  color                 : string

  // * /////////////////  Geters
  queryVacia            : boolean
  esCotizacion          : boolean
  esPedido              : boolean
  esOCProveedor         : boolean
  esEntrega             : boolean
  puedeBuscar           : boolean
  camposVacios          : boolean

  // * /////////////////  Metodos
  initClass             : ()=> void
  iniciarOpciones       : ( grupoUsuarios : string )=> Promise<void>
  copiarQueryACampos    : ( cambioEnQuery ?: boolean )=> Promise<void>
  desmontarBusqueda     : ()=> void
  copiarQueryARourter   : ()=> void
  checkPage             : ()=> boolean
  limpiarQueryDeRouter  : ()=> Promise< boolean >
  siguientePagina       : ( largo : number )=>number
  montarBusqueda        : ( idUsuario         : number,
                            r                 : Router,
                            autoSelect       ?: boolean,
                            canChangeUser    ?: boolean,
                            resultadosXPage  ?: number,
                            acuerdoTipo      ?: TTipoAcuerdo,
                            grupoUsuarios    ?: string
                          ) => Promise<void>
}

export class Busqueda implements IBusqueda
{
  rourterQ              : LocationQuery = {}
  acuerdo               : TTipoAcuerdo 
  usuarioId             : number        = 0
  f                     : ICampos       = Busqueda.getFieldsStart()
  o                     : IOpciones     = Busqueda.getOptionsStart()
  usuarioIdInicio       : number        = 0
  haySiguientePagina    : boolean       = false
  puedeCambiarUser      : boolean       = false
  haceAutoSelect        : boolean       = false
  montadoOk             : boolean
  router                : Router | null = null
  copiaPagina           : number        = 1
  label                 : string        = ""
  color                 : string        = ""

  constructor()
  {
    this.acuerdo          = TIPO_ACUERDO.NULO
    this.montadoOk        = false
    this.initClass()
  }

  initClass()
  {    
    this.rourterQ         = {}
    this.usuarioIdInicio  = 0
    this.copiaPagina      = 1
    this.f                = Busqueda.getFieldsStart()
    this.o                = Busqueda.getOptionsStart()
  } 
  
  async iniciarOpciones( grupoUsuarios : string ) : Promise<void>
  {
    this.o.opcionesOk                       = false
    this.o.usuarios                         = await getUsuariosByGrupoDB( grupoUsuarios )
    this.o.creadores                        = await getUsuariosByGrupoDB( "Producci" )

    if(this.esOCProveedor || this.esProducto)
      this.o.proveedores                    = await getProveedoresDB()

    if(this.esProducto)
    {
      this.o.tiposProductosProv             = TiposProductosProveedor        
      this.o.categorias                     = await getCategoriasDB()
      this.o.unidades                       = await getUnidadesDB()
      this.o.naturalezas                    = await getNaturalezasDB()
    }
    else
    {
      this.o.origenes                       = await getOrigenesContactoDB()
      this.o.condicionesPago                = await getCondicionesPagoDB()
      this.o.formasPago                     = await getFormasPagoDB()
      this.o.metodosEntrega                 = await getMetodosEntregaDB()
      
      this.o.estados                        =   this.esCotizacion ? estadosCtz.filter(e => e.value >= -1)
                                              : this.esPedido     ? estadosPed.filter(e => e.value >= -1)
                                              : this.esOCProveedor? estadosOC .filter(e => e.value >= -1)
                                              : this.esEntrega    ? estadosEnt.filter(e => e.value >= -1)
                                              : []
    }

    this.o.opcionesOk                       = true
  }

  async copiarQueryACampos( cambioEnQuery : boolean = false ) : Promise<void> // cambioEnQuery es cuando la url cambia, primero y toca detectar ese cambio
  {
    this.f.copiando           = true
    this.rourterQ             = this.router?.currentRoute.value.query ?? {}    
    this.f.desde              = ToolQuery.getQueryRouterDate      ( this.rourterQ .fechaDesde     )
    this.f.hasta              = ToolQuery.getQueryRouterDate      ( this.rourterQ .fechaHasta     )
    this.f.desde2             = ToolQuery.getQueryRouterDate      ( this.rourterQ .desde2         )
    this.f.hasta2             = ToolQuery.getQueryRouterDate      ( this.rourterQ .hasta2         )

    this.f.diasDesde          = ToolQuery.getQueryRouterNumber    ( this.rourterQ .diasDesde      )
    this.f.diasHasta          = ToolQuery.getQueryRouterNumber    ( this.rourterQ .diasHasta      )
    this.f.diasDDesde         = ToolQuery.getQueryRouterNumber    ( this.rourterQ .diasDDesde     )
    this.f.diasDHasta         = ToolQuery.getQueryRouterNumber    ( this.rourterQ .diasDHasta     )    
    this.f.aproDesdeDia       = ToolQuery.getQueryRouterNumber    ( this.rourterQ .aproDesdeDia   )
    this.f.aproHastaDia       = ToolQuery.getQueryRouterNumber    ( this.rourterQ .aproHastaDia   )
    this.f.enviaDesdeDia      = ToolQuery.getQueryRouterNumber    ( this.rourterQ .enviaDesdeDia  )
    this.f.enviaHastaDia      = ToolQuery.getQueryRouterNumber    ( this.rourterQ .enviaHastaDia  )

    this.f.buscar             = ToolQuery.getQueryRouterString    ( this.rourterQ .buscar       )
    this.f.buscar1            = ToolQuery.getQueryRouterString    ( this.rourterQ .buscar1      )
    this.f.buscar2            = ToolQuery.getQueryRouterString    ( this.rourterQ .buscar2      )
    this.f.buscar3            = ToolQuery.getQueryRouterString    ( this.rourterQ .buscar3      )
    this.f.buscar4            = ToolQuery.getQueryRouterString    ( this.rourterQ .buscar4      )
    this.f.contacto           = ToolQuery.getQueryRouterString    ( this.rourterQ .contacto     )
    this.f.nombre             = ToolQuery.getQueryRouterString    ( this.rourterQ .nombre       )
    this.f.valorMin           = ToolQuery.getQueryRouterNumber    ( this.rourterQ .valorMin     )
    this.f.valorMax           = ToolQuery.getQueryRouterNumber    ( this.rourterQ .valorMax     )    
    this.f.min1               = ToolQuery.getQueryRouterNumber    ( this.rourterQ .min1         )
    this.f.max1               = ToolQuery.getQueryRouterNumber    ( this.rourterQ .max1         )
    this.f.min2               = ToolQuery.getQueryRouterNumber    ( this.rourterQ .min2         )
    this.f.max2               = ToolQuery.getQueryRouterNumber    ( this.rourterQ .max2         )
    this.f.min3               = ToolQuery.getQueryRouterNumber    ( this.rourterQ .min3         )
    this.f.max3               = ToolQuery.getQueryRouterNumber    ( this.rourterQ .max3         )    
    this.f.min4               = ToolQuery.getQueryRouterNumber    ( this.rourterQ .min4         )
    this.f.max4               = ToolQuery.getQueryRouterNumber    ( this.rourterQ .max4         )    
    this.f.min5               = ToolQuery.getQueryRouterNumber    ( this.rourterQ .min5         )
    this.f.max5               = ToolQuery.getQueryRouterNumber    ( this.rourterQ .max5         )    
    this.f.min6               = ToolQuery.getQueryRouterNumber    ( this.rourterQ .min6         )
    this.f.max6               = ToolQuery.getQueryRouterNumber    ( this.rourterQ .max6         )
    this.f.qty                = ToolQuery.getQueryRouterNumber    ( this.rourterQ .qty          )
    this.f.peso               = ToolQuery.getQueryRouterNumber    ( this.rourterQ .peso         )
    this.f.altura             = ToolQuery.getQueryRouterNumber    ( this.rourterQ .altura       )
    this.f.ancho              = ToolQuery.getQueryRouterNumber    ( this.rourterQ .ancho        )
    this.f.fondo              = ToolQuery.getQueryRouterNumber    ( this.rourterQ .fondo        )
    this.f.fondo              = ToolQuery.getQueryRouterNumber    ( this.rourterQ .fondo        )    
    this.f.destacado          = ToolQuery.getQueryRouterBoolean   ( this.rourterQ .destacado    )
    this.f.favorito           = ToolQuery.getQueryRouterBoolean   ( this.rourterQ .favorito     )
    this.f.color              = ToolQuery.getQueryRouterBoolean   ( this.rourterQ .color        )    

    if(!!this.rourterQ.limite)
      this.f.resultadosXPage  = ToolQuery.getQueryRouterNumber    ( this.rourterQ .limite       )         ?? 10
    this.f.area               = ToolQuery.getQueryRouterLabelValue( this.rourterQ .area,                  Areas                         )    
    this.f.facturado          = ToolQuery.getQueryRouterLabelValue( this.rourterQ .facturado,             Busqueda.listaFacturado       )
    this.f.incPago            = ToolQuery.getQueryRouterLabelValue( this.rourterQ .incPago,               Incentivo.estadosPago         )
    this.f.incEstado          = ToolQuery.getQueryRouterLabelValue( this.rourterQ .incEstado,             Incentivo.estados             )
    this.f.incRazon           = ToolQuery.getQueryRouterLabelValue( this.rourterQ .incRazon,              Incentivo.razones             )
    this.f.incOrigen          = ToolQuery.getQueryRouterLabelValue( this.rourterQ .incOrigen,             Incentivo.origenes            )    
    this.f.conIva             = ToolQuery.getQueryRouterLabelValue( this.rourterQ .conIva,                Busqueda.listaIVA             )
    this.f.totalizado         = ToolQuery.getQueryRouterLabelValue( this.rourterQ .conTotal,              Busqueda.listaTotales         )
    this.f.terceroInterno     = ToolQuery.getQueryRouterLabelValue( this.rourterQ .interno,               Busqueda.listaTerceroInterno  )
    this.f.conOrdenes         = ToolQuery.getQueryRouterLabelValue( this.rourterQ .conOrdenes,            Busqueda.listaOrdenesProv     )
    this.f.listoDespacho      = ToolQuery.getQueryRouterLabelValue( this.rourterQ .listoDespacho,         Busqueda.listaListoDespachar  )
    this.f.l1                 = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l1,                    Busqueda.listaBase            )
    this.f.l2                 = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l2,                    Busqueda.listaBase            )
    this.f.l3                 = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l3,                    Busqueda.listaBase            )
    this.f.l4                 = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l4,                    Busqueda.listaBase            )
    this.f.l5                 = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l5,                    Busqueda.listaBase            )
    this.f.l6                 = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l6,                    Busqueda.listaBase            )
    this.f.l7                 = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l7,                    Busqueda.listaBase            )
    this.f.l8                 = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l8,                    Busqueda.listaBase            )
    this.f.l9                 = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l9,                    Busqueda.listaBase            )
    this.f.l11                = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l11,                   Busqueda.listaBase            )
    this.f.l12                = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l12,                   Busqueda.listaBase            )
    this.f.l13                = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l13,                   Busqueda.listaBase            )
    this.f.l14                = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l14,                   Busqueda.listaBase            )
    this.f.l15                = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l15,                   Busqueda.listaBase            )
    this.f.l16                = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l16,                   Busqueda.listaBase            )
    this.f.l17                = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l17,                   Busqueda.listaBase            )
    this.f.l18                = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l18,                   Busqueda.listaBase            )
    this.f.l19                = ToolQuery.getQueryRouterLabelValue( this.rourterQ .l19,                   Busqueda.listaBase            )
    this.f.aprobado           = ToolQuery.getQueryRouterLabelValue( this.rourterQ .aprobado,              Busqueda.listaAprobado        )
    this.f.extra              = ToolQuery.getQueryRouterLabelValue( this.rourterQ .extra,                 Busqueda.listaExtra           )
    this.f.tipoTercero        = ToolQuery.getQueryRouterLabelValue( this.rourterQ .tipoTercero,           Busqueda.listaTipoTercero     )
    this.f.envioOC            = ToolQuery.getQueryRouterLabelValue( this.rourterQ .envioOC,               Busqueda.listaEnvioOC         )
    this.f.aceptado           = ToolQuery.getQueryRouterLabelValue( this.rourterQ .aceptado,              Busqueda.listaAceptado        )
    this.f.activo             = ToolQuery.getQueryRouterLabelValue( this.rourterQ .activo,                Busqueda.listaActivo          )
    this.f.disponible         = ToolQuery.getQueryRouterLabelValue( this.rourterQ .disponible,            Busqueda.listaActivo          )
    this.f.actualizado        = ToolQuery.getQueryRouterLabelValue( this.rourterQ .actualizado,           Busqueda.listaActualizado     )
    this.f.proveedores        = ToolQuery.getQueryRouterLabelValue( this.rourterQ .proveedorId,           this.o.proveedores            )
    this.f.categorias         = ToolQuery.getQueryRouterLabelValue( this.rourterQ .categoriaId,           this.o.categorias             )
    this.f.und                = ToolQuery.getQueryRouterLabelValue( this.rourterQ .und,                   this.o.unidades               )
    this.f.ntz                = ToolQuery.getQueryRouterLabelValue( this.rourterQ .ntz,                   this.o.naturalezas            )
    this.f.dimension          = ToolQuery.getQueryRouterLabelValue( this.rourterQ .dimension,             Busqueda.listaDimensiones,  "string")    
    this.f.periodo            = ToolQuery.getQueryRouterLabelValue( this.rourterQ .periodo,               Busqueda.listaPeriodos,     "string")

    this.f.estadoAnticipo     = ToolQuery.getQueryRouterLabelValueArray ( this.rourterQ .estadoAnticipo,  Anticipo.estados              )
    this.f.tipoAnticipo       = ToolQuery.getQueryRouterLabelValueArray ( this.rourterQ .tipoAnticipo,    Anticipo.tipos                )
    this.f.estados            = ToolQuery.getQueryRouterLabelValueArray ( this.rourterQ .estados,         this.o.estados                )
    this.f.tiposProProve      = ToolQuery.getQueryRouterLabelValueArray ( this.rourterQ .tiposp,          this.o.tiposProductosProv     )
    this.f.cuando             = ToolQuery.getQueryRouterLabelValueArray ( this.rourterQ .cuando,          Cuando                        )
    this.f.prioridad          = ToolQuery.getQueryRouterLabelValueArray ( this.rourterQ .prioridad,       Prioridades                   )
    this.f.progreso           = ToolQuery.getQueryRouterLabelValueArray ( this.rourterQ .progreso,        Progresos                     )
    this.f.formaPago          = ToolQuery.getQueryRouterLabelValueArray ( this.rourterQ .formaPago,       this.o.formasPago             )
    this.f.entrega            = ToolQuery.getQueryRouterLabelValueArray ( this.rourterQ .entrega,         this.o.metodosEntrega         )
    this.f.usuarios           = ToolQuery.getQueryRouterLabelValueArray ( this.rourterQ .usuarios,        this.o.usuarios               )
    this.f.creadores          = ToolQuery.getQueryRouterLabelValueArray ( this.rourterQ .creadores,       this.o.creadores              )
    this.f.condiciones        = ToolQuery.getQueryRouterLabelValueArray ( this.rourterQ .condiciones,     this.o.condicionesPago        )
    this.f.origenes           = ToolQuery.getQueryRouterLabelValueArray ( this.rourterQ .origenes,        this.o.origenes               )

    const municipioId         = ToolQuery.getQueryRouterNumber( this.rourterQ .municipio ) 
    this.f.municipio          = !!municipioId     ? await getMunicipioDB( municipioId )     : new Municipio()

    const municipioContId     = ToolQuery.getQueryRouterNumber( this.rourterQ .municipioContacto ) 
    this.f.municipioContacto  = !!municipioContId ? await getMunicipioDB( municipioContId ) : new Municipio()

    const creadorId           = ToolQuery.getQueryRouterNumber( this.rourterQ.creador ) ?? 0
    this.f.creador            = creadorId > 0 ? await getUsuarioDB( creadorId ) : new Usuario()
    if(cambioEnQuery){
      const usurioId          = ToolQuery.getQueryRouterNumber( this.rourterQ.usuario ) ?? 0
      this.f.usuario          = usurioId > 0 ? await getUsuarioDB( usurioId ) : new Usuario()
    }
    else
      await this.setUsuario()
    this.f.copiando           = false
  }

  async setUsuario()
  {
    if(!this.montadoOk) // Pasa cuando se monta
    {
      if( this.puedeCambiarUser )
      {
        if( !!this.usuarioIdInicio )
          this.f.usuario      = await getUsuarioDB( this.usuarioIdInicio )
        else
        if( this.haceAutoSelect )
          this.f.usuario      = await getUsuarioDB( this.usuarioId )
      }
      else
        this.f.usuario        = await getUsuarioDB( this.usuarioId )
    }
    else // Solo pasa cuando se limpia
    {
      if(this.puedeCambiarUser)
        this.f.usuario        = new Usuario()
    }
    
  }

  async montarBusqueda(
    idUsuario                 : number,
    r                         : Router,
    autoSelect                : boolean       = false,
    canChangeUser             : boolean       = false, 
    resultadosXPage           : number        = 10,
    acuerdoTipo               : TTipoAcuerdo  = TIPO_ACUERDO.NULO,
    grupoUsuarios             : string        = "Comerci"
  ) : Promise<void>
  {
    this.montadoOk            = false
    this.haceAutoSelect       = autoSelect
    this.puedeCambiarUser     = canChangeUser
    this.usuarioId            = idUsuario
    this.initClass()
    this.f.resultadosXPage    = resultadosXPage
    this.router               = r
    this.rourterQ             = this.router.currentRoute.value.query
    this.usuarioIdInicio      = ToolQuery.getQueryRouterNumber( this.rourterQ.usuario ) ?? 0
    const cambioTipo          = this.acuerdo != acuerdoTipo
    if(cambioTipo)
      this.acuerdo            = acuerdoTipo

    await this.iniciarOpciones( grupoUsuarios )
    await this.copiarQueryACampos()
    
    this.montadoOk          = true
  }

  copiarQueryARourter()
  {
    if(!!this.router)
      this.router.replace({ query: { ...this.query }  })
  }


  checkPage() : boolean
  {
    let sinCorreccion     = true
    if( this.f.pagina     > 1 && this.copiaPagina === this.f.pagina){
      this.f.pagina       = 1
      sinCorreccion       = false
    }

    this.copiaPagina      = this.f.pagina

    return sinCorreccion
  }

  async limpiarQueryDeRouter() : Promise< boolean >
  {
    this.label              = ""
    this.color              = ""
    if(!this.montadoOk) return false

    this.rourterQ           = {}

    if(!this.camposVacios)
    {
      if(!!this.router)
      {
        this.router.replace({ query: {} })
      }
      await Tool.pausa( 100 )  
      await this.copiarQueryACampos()
    }
    
    if(!!this.router)
    {
      this.router.replace({ query: {} })
    }

    this.f.pagina           = 1

    return true
  }

  desmontarBusqueda()
  {
    this.montadoOk          = false
    this.acuerdo            = TIPO_ACUERDO.NULO
    this.initClass()
  }

  siguientePagina( largo : number ) : number
  {
    const resultadosATope   = largo >= this.f.resultadosXPage
    const aumentoPagina     = resultadosATope ? 1 : 0
    const pagNow            = this.f.pagina
    const pagNext           = pagNow + aumentoPagina
    this.haySiguientePagina = pagNext > pagNow
    return pagNext
  }

  get camposVacios        () : boolean
  {
    for(const [key, value] of Object.entries( this.f ))
    {
      if(key == "copiando" || key == "resultadosXPage" || key == "pagina" ) continue

      if( ( !!value && ( typeof value === "string" || typeof value === "boolean" || typeof value === "number" ) )
          ||
          ( Array.isArray(value) && !!value.length )
          ||
          ( typeof value === "object" && "label" in value && !!value.label  )
          ||
          ( value instanceof Date )
      )
      {
        return false
      } 
    }

    return true
  }

  get queryVacia          () : boolean { return !Object.keys(this.query).length               }

  get esProducto          () : boolean { return this.acuerdo === TIPO_ACUERDO.NULO            }
  get esCotizacion        () : boolean { return this.acuerdo === TIPO_ACUERDO.COTIZACION_CLI  }
  get esPedido            () : boolean { return this.acuerdo === TIPO_ACUERDO.PEDIDO_CLI      }
  get esOCProveedor       () : boolean { return this.acuerdo === TIPO_ACUERDO.PEDIDO_PRO      }
  get esEntrega           () : boolean { return this.acuerdo === TIPO_ACUERDO.ENTREGA_CLI     }
  get puedeBuscar         () : boolean
  {
    return    this.o.opcionesOk 
          && !this.f.copiando 
          && !this.camposVacios
  }

  get query() : IQuery
  { 
    const q : IQuery       = {}

    if( this.camposVacios ) return q

    if(this.f.buscar.length   >= 3)     q.buscar            = this.f.buscar
    if(this.f.buscar1.length  >= 3)     q.buscar1           = this.f.buscar1
    if(this.f.buscar2.length  >= 3)     q.buscar2           = this.f.buscar2
    if(this.f.buscar3.length  >= 3)     q.buscar3           = this.f.buscar3
    if(this.f.buscar4.length  >= 3)     q.buscar4           = this.f.buscar4
    if(this.f.contacto.length >= 3)     q.contacto          = this.f.contacto
    if(this.f.nombre.length   >= 3)     q.nombre            = this.f.nombre
    if(this.f.destacado)                q.destacado         = 1
    if(this.f.favorito)                 q.favorito          = 1
    if(this.f.color)                    q.color             = 1
    if(!!this.f.valorMin)               q.valorMin          = this.f.valorMin
    if(!!this.f.valorMax)               q.valorMax          = this.f.valorMax
    if(!!this.f.min1)                   q.min1              = this.f.min1
    if(!!this.f.max1)                   q.max1              = this.f.max1    
    if(!!this.f.min2)                   q.min2              = this.f.min2
    if(!!this.f.max2)                   q.max2              = this.f.max2
    if(!!this.f.min3)                   q.min3              = this.f.min3
    if(!!this.f.max3)                   q.max3              = this.f.max3
    if(!!this.f.min4)                   q.min4              = this.f.min4
    if(!!this.f.max4)                   q.max4              = this.f.max4
    if(!!this.f.min5)                   q.min5              = this.f.min5
    if(!!this.f.max5)                   q.max5              = this.f.max5
    if(!!this.f.min6)                   q.min6              = this.f.min6
    if(!!this.f.max6)                   q.max6              = this.f.max6
    if(!!this.f.peso)                   q.peso              = this.f.peso
    if(!!this.f.qty)                    q.qty               = this.f.qty
    if(!!this.f.altura)                 q.altura            = this.f.altura
    if(!!this.f.ancho)                  q.ancho             = this.f.ancho
    if(!!this.f.fondo)                  q.fondo             = this.f.fondo

    if(ToolType.valorValido(this.f.diasDesde))    q.diasDesde       = this.f.diasDesde
    if(ToolType.valorValido(this.f.diasHasta))    q.diasHasta       = this.f.diasHasta
    if(ToolType.valorValido(this.f.diasDDesde))   q.diasDDesde      = this.f.diasDDesde
    if(ToolType.valorValido(this.f.diasDHasta))   q.diasDHasta      = this.f.diasDHasta    
    if(ToolType.valorValido(this.f.aproDesdeDia))  q.aproDesdeDia   = this.f.aproDesdeDia
    if(ToolType.valorValido(this.f.aproHastaDia))  q.aproHastaDia   = this.f.aproHastaDia
    if(ToolType.valorValido(this.f.enviaDesdeDia)) q.enviaDesdeDia  = this.f.enviaDesdeDia
    if(ToolType.valorValido(this.f.enviaHastaDia)) q.enviaHastaDia  = this.f.enviaHastaDia

    if(!!this.f.estados.length)         q.estados           = this.f.estados        .map( e => e.value ).join("_")
    if(!!this.f.tiposProProve.length)   q.tpp               = this.f.tiposProProve  .map( e => e.value ).join("_")
    if(!!this.f.cuando.length)          q.cuando            = this.f.cuando         .map( e => e.value ).join("_")
    if(!!this.f.prioridad.length)       q.prioridad         = this.f.prioridad      .map( e => e.value ).join("_")
    if(!!this.f.progreso.length)        q.progreso          = this.f.progreso       .map( e => e.value ).join("_")
    if(!!this.f.origenes.length)        q.origenes          = this.f.origenes       .map( e => e.value ).join("_")
    if(!!this.f.usuarios.length)        q.usuarios          = this.f.usuarios       .map( e => e.value ).join("_")
    if(!!this.f.creadores.length)       q.creadores         = this.f.creadores      .map( e => e.value ).join("_")
    if(!!this.f.condiciones.length)     q.condiciones       = this.f.condiciones    .map( e => e.value ).join("_")
    if(!!this.f.formaPago.length)       q.formaPago         = this.f.formaPago      .map( e => e.value ).join("_")
    if(!!this.f.entrega.length)         q.entrega           = this.f.entrega        .map( e => e.value ).join("_")
    if(!!this.f.estadoAnticipo.length)  q.estadoAnticipo    = this.f.estadoAnticipo .map( e => e.value ).join("_")
    if(!!this.f.tipoAnticipo.length)    q.tipoAnticipo      = this.f.tipoAnticipo   .map( e => e.value ).join("_")    
    if(!!this.f.area.label)             q.area              = this.f.area.value
    if(!!this.f.facturado.label)        q.facturado         = this.f.facturado.value
    if(!!this.f.incPago.label)          q.incPago           = this.f.incPago.value
    if(!!this.f.incEstado.label)        q.incEstado         = this.f.incEstado.value
    if(!!this.f.incRazon.label)         q.incRazon          = this.f.incRazon.value 
    if(!!this.f.incOrigen.label)        q.incOrigen         = this.f.incOrigen.value   
    if(!!this.f.conIva.label)           q.conIva            = this.f.conIva.value
    if(!!this.f.totalizado.label)       q.conTotal          = this.f.totalizado.value
    if(!!this.f.terceroInterno.label)   q.interno           = this.f.terceroInterno.value
    if(!!this.f.municipio.id)           q.municipio         = this.f.municipio.id
    if(!!this.f.municipioContacto.id)   q.municipioContacto = this.f.municipioContacto.id
    if(!!this.f.conOrdenes.label)       q.conOrdenes        = this.f.conOrdenes.value
    if(!!this.f.listoDespacho.label)    q.listoDespacho     = this.f.listoDespacho.value
    if(!!this.f.l1.label)               q.l1                = this.f.l1.value
    if(!!this.f.l2.label)               q.l2                = this.f.l2.value
    if(!!this.f.l3.label)               q.l3                = this.f.l3.value
    if(!!this.f.l4.label)               q.l4                = this.f.l4.value
    if(!!this.f.l5.label)               q.l5                = this.f.l5.value
    if(!!this.f.l6.label)               q.l6                = this.f.l6.value
    if(!!this.f.l7.label)               q.l7                = this.f.l7.value
    if(!!this.f.l8.label)               q.l8                = this.f.l8.value
    if(!!this.f.l9.label)               q.l9                = this.f.l9.value
    if(!!this.f.l11.label)              q.l11               = this.f.l11.value
    if(!!this.f.l12.label)              q.l12               = this.f.l12.value
    if(!!this.f.l13.label)              q.l13               = this.f.l13.value
    if(!!this.f.l14.label)              q.l14               = this.f.l14.value
    if(!!this.f.l15.label)              q.l15               = this.f.l15.value
    if(!!this.f.l16.label)              q.l16               = this.f.l16.value
    if(!!this.f.l17.label)              q.l17               = this.f.l17.value
    if(!!this.f.l18.label)              q.l18               = this.f.l18.value
    if(!!this.f.l19.label)              q.l19               = this.f.l19.value
    if(!!this.f.aprobado.label)         q.aprobado          = this.f.aprobado.value
    if(!!this.f.extra.label)            q.extra             = this.f.extra.value
    if(!!this.f.tipoTercero.label)      q.tipoTercero       = this.f.tipoTercero.value
    if(!!this.f.envioOC.label)          q.envioOC           = this.f.envioOC.value
    if(!!this.f.aceptado.label)         q.aceptado          = this.f.aceptado.value
    if(!!this.f.activo.label)           q.activo            = this.f.activo.value
    if(!!this.f.disponible.label)       q.disponible        = this.f.disponible.value
    if(!!this.f.actualizado.label)      q.actualizado       = this.f.actualizado.value
    if(!!this.f.dimension.label)        q.dimension         = this.f.dimension.value
    if(!!this.f.periodo.label)          q.periodo           = this.f.periodo.value
    if(!!this.f.usuario && this.f.usuario.id  > 0 && !this.esOCProveedor )
      q.usuario                                             = this.f.usuario.id     
    if(!!this.f.creador   && this.f.creador.id    > 0)
      q.creador                                           = this.f.creador.id
    if((this.esOCProveedor || this.esProducto ) && !!this.f.proveedores.label)
      q.proveedorId                                       = this.f.proveedores.value

    if(this.esProducto)
    {
      if(!!this.f.categorias.label) q.categoriaId         = this.f.categorias.value
      if(!!this.f.und.label)        q.und                 = this.f.und.value
      if(!!this.f.ntz.label)        q.ntz                 = this.f.ntz.value
    }
        
    if(this.f.desde       instanceof Date && !isNaN(this.f.desde.valueOf()))      q.fechaDesde  = this.f.desde.toLocaleDateString('sv-SE')
    if(this.f.hasta       instanceof Date && !isNaN(this.f.hasta.valueOf()))      q.fechaHasta  = this.f.hasta.toLocaleDateString('sv-SE')
    if(this.f.desde2      instanceof Date && !isNaN(this.f.desde2.valueOf()))     q.desde2      = this.f.desde2.toLocaleDateString('sv-SE')
    if(this.f.hasta2      instanceof Date && !isNaN(this.f.hasta2.valueOf()))     q.hasta2      = this.f.hasta2.toLocaleDateString('sv-SE')

    if(!!Object.keys(q).length){
      q.limite                    = this.f.resultadosXPage
      q.offset                    = q.limite * (this.f.pagina - 1)
    }

    return q
  }

  // * /////////////////////////////////////////////////////////////////////// Lista de opciones
  static listaFacturado           = [{value:0, label:'No facturado'},         {value:1, label:'Facturado'           }]
  static listaTotales             = [{value:0, label:'Sin totalizar'},        {value:1, label:'Totalizado'          }]
  static listaIVA                 = [{value:0, label:'Sin IVA'},              {value:1, label:'Con IVA'             }]
  static listaTerceroInterno      = [{value:0, label:'Externo'},              {value:1, label:'Interno'             }]
  static listaOrdenesProv         = [{value:0, label:'Sin ordenes'},          {value:1, label:'Con ordenes'         }]
  static listaListoDespachar      = [{value:1, label:'Listo para despacho'},  {value:0, label:'No esta listo'       }]
  static listaAprobado            = [{value:1, label:'✅Aprobado'},          {value:0, label:'✖️No aprobado'       }]
  static listaExtra               = [{value:1, label:'✅Extra'},             {value:0, label:'✖️No extra'          }]
  static listaBase                = [{value:1, label:'Si'},                   {value:0, label:'No'                  }]
  static listaActivo              = [{value:1, label:'Activo'},               {value:0, label:'Inactivo'            }]  
  static listaActualizado         = [{value:1, label:'Actualizado'},          {value:0, label:'Desactualizado'      }]
  static listaActivoProducto      = [{value:1, label:'En catalogo'},          {value:0, label:'Descontinuado'       }]  
  static listaDisponible          = [{value:1, label:'Disponible'},           {value:0, label:'Agotado'             }]  
  static listaEnvioOC             = [{value:1, label:'Con correo enviado'},   {value:0, label:'Sin correo enviado'  }]
  static listaAceptado            = [{value:1, label:'Pedido en progreso'},   {value:0, label:'Pedido sin confirmar'}]
  static listaAreas               = Areas  
  static listaEstadosPago         = Incentivo.estadosPago
  static listaAnticipoEstados     = Anticipo.estados
  static listaAnticipoTipos       = Anticipo.tipos  
  static listaResultadosXPag      = [ {value: 25,     label: '25',   },
                                      {value: 50,     label: '50',   },
                                      {value: 100,    label: '100',  },
                                      {value: 200,    label: '200',  },
                                    ]
  static listaTipoTercero         = [ {value: 0,      label: 'Es cliente'               },
                                      {value: 1,      label: 'Es proveedor'             },
                                      {value: 2,      label: 'Cliente y Proveedor'      },
                                      {value: 3,      label: 'Ni cliente ni proveedor'  },
                                    ]
  static listaPeriodos            = [ {value: PERIODO.SEMANA,     label: 'Semanal'      },
                                      {value: PERIODO.MES,        label: 'Mensual'      },
                                      {value: PERIODO.TRIMESTRE,  label: 'Trimestral'   },
                                      {value: PERIODO.AÑO,        label: 'Anual'        },
                                    ]
  static listaDimensiones         = [ {value: DIMENSIONES.ASESORES,     label: 'Comerciales'      },
                                      {value: DIMENSIONES.ORIGEN,       label: 'Origen'           },
                                      {value: DIMENSIONES.ESTADOS,      label: 'Estados'          },
                                      {value: DIMENSIONES.NIVELES,      label: 'Nivel de precios' },
                                      {value: DIMENSIONES.CONDICIONES,  label: 'Condiciones'      },
                                      {value: DIMENSIONES.UNIDAD_N,     label: 'Área'             },
                                      {value: DIMENSIONES.REGION,       label: 'Municipio'        },
                                    ]
  static getOptionsStart() : IOpciones
  {
    return {
      opcionesOk          : false,
      usuarios            : [],
      creadores           : [],
      condicionesPago     : [],
      formasPago          : [],
      metodosEntrega      : [],
      proveedores         : [],
      categorias          : [],
      origenes            : [],
      estados             : [],
      tiposProductosProv  : [],
      naturalezas         : [],
      unidades            : [],
    }
  }
                                                                  
  static getFieldsStart() : ICampos
  {
    return {
      copiando            : false,
      buscar              : "",
      buscar1             : "",
      buscar2             : "",
      buscar3             : "",
      buscar4             : "",
      contacto            : "",

      desde               : "",
      hasta               : "",
      desde2              : "",
      hasta2              : "",      
      diasDesde           : undefined,
      diasHasta           : undefined,
      diasDDesde          : undefined,
      diasDHasta          : undefined,      

      //valiDesde           : "",
      //valiHasta           : "",
      aproDesdeDia        : undefined,
      aproHastaDia        : undefined,

      //enviaDesde          : "",
      //enviaHasta          : "",
      enviaDesdeDia       : undefined,
      enviaHastaDia       : undefined,
      valorMin            : undefined,
      valorMax            : undefined,
      min1                : undefined,
      max1                : undefined,
      min2                : undefined,
      max2                : undefined,
      min3                : undefined,
      max3                : undefined,
      min4                : undefined,
      max4                : undefined,
      min5                : undefined,
      max5                : undefined,
      min6                : undefined,
      max6                : undefined,
      estados             : [],
      tiposProProve       : [],
      cuando              : [],
      prioridad           : [],
      progreso            : [],
      origenes            : [],
      usuarios            : [],
      creadores           : [],
      condiciones         : [],
      formaPago           : [],
      entrega             : [],
      estadoAnticipo      : [],
      tipoAnticipo        : [],      
      area                : labelValueNulo,
      facturado           : labelValueNulo,
      conIva              : labelValueNulo,
      terceroInterno      : labelValueNulo,
      tipoTercero         : labelValueNulo,
      envioOC             : labelValueNulo,
      aceptado            : labelValueNulo,
      totalizado          : labelValueNulo,
      conOrdenes          : labelValueNulo,
      listoDespacho       : labelValueNulo,
      l1                  : labelValueNulo,
      l2                  : labelValueNulo,
      l3                  : labelValueNulo,
      l4                  : labelValueNulo,
      l5                  : labelValueNulo,
      l6                  : labelValueNulo,
      l7                  : labelValueNulo,
      l8                  : labelValueNulo,
      l9                  : labelValueNulo,
      l11                 : labelValueNulo,
      l12                 : labelValueNulo,
      l13                 : labelValueNulo,
      l14                 : labelValueNulo,
      l15                 : labelValueNulo,
      l16                 : labelValueNulo,
      l17                 : labelValueNulo,
      l18                 : labelValueNulo,
      l19                 : labelValueNulo,
      aprobado            : labelValueNulo,
      extra               : labelValueNulo,
      proveedores         : labelValueNulo,
      categorias          : labelValueNulo,
      und                 : labelValueNulo,
      ntz                 : labelValueNulo,
      incPago             : labelValueNulo,
      incEstado           : labelValueNulo,
      incRazon            : labelValueNulo,
      incOrigen           : labelValueNulo,
      activo              : labelValueNulo,
      disponible          : labelValueNulo,
      actualizado         : labelValueNulo,
      dimension           : labelValueNulo,
      periodo             : labelValueNulo,
      municipio           : new Municipio(),
      municipioContacto   : new Municipio(),
      resultadosXPage     : 10,
      pagina              : 1,
      usuario             : new Usuario(),
      creador             : new Usuario(),
      favorito            : false,
      destacado           : false,
      color               : false,
      nombre              : "",
      qty                 : 0,
      peso                : 0,
      altura              : undefined,
      ancho               : undefined,
      fondo               : undefined,
    }   
  }
}