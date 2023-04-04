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
import {  Anticipo                      } from "src/areas/acuerdos/models/Anticipo"
import {  Incentivo                     } from "src/areas/nomina//models/Incentivo"
import {  estadosCtz, estadosPed,
          estadosOC,  estadosEnt        } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  getUsuarioDB,
          getMunicipioDB,
          getFormasPagoDB,
          getProveedoresDB,
          getMetodosEntregaDB,
          getCondicionesPagoDB,
          getOrigenesContactoDB         } from "src/services/useDexie"
import {  LocationQuery                 } from "vue-router"
import {  getQueryRouterDate,
          getQueryRouterNumber,
          getQueryRouterString,
          getQueryRouterLabelValue,
          getQueryRouterLabelValueArray } from "src/useSimpleOk/useTools"

export interface      IQuery {
  //tipo                 ?: string
  id                   ?: number
  acuerdo              ?: TTipoAcuerdo
  usuario              ?: string | number
  creador              ?: string | number
  buscar               ?: string
  idTercero            ?: number
  contacto             ?: string
  estados              ?: string
  origenes             ?: string
  condiciones          ?: string
  formaPago            ?: string
  entrega              ?: string
  estadoAnticipo       ?: string
  tipoAnticipo         ?: string
  fechaDesde           ?: string
  fechaHasta           ?: string
  proveedorId          ?: number
  facturado            ?: number
  conIva               ?: number
  conTotal             ?: number
  interno              ?: number
  conOrdenes           ?: number
  limite               ?: number
  offset               ?: number
  area                 ?: string
  orden                ?: "ASC" | "DESC"
  municipio            ?: number
  municipioContacto    ?: number
  origenId             ?: number
  valorMin             ?: number
  valorMax             ?: number 
  incEstado            ?: INCENTIVO_ESTADO
  incRazon             ?: INCENTIVO_RAZON
  incOrigen            ?: INCENTIVO_ORIGEN
  incPago              ?: INCENTIVO_ESTADO_PAGO
  origenTipo           ?: number
}

interface               IOpciones {
  opcionesOk            : boolean
  condicionesPago       : ILabelValue[]
  formasPago            : ILabelValue[]
  metodosEntrega        : ILabelValue[]
  proveedores           : ILabelValue[]
  origenes              : ILabelValue[]
  estados               : ILabelValue[]
}

interface               ICampos {
  copiando              : boolean
  buscar                : string
  contacto              : string
  desde                 : Date | string
  hasta                 : Date | string  
  valorMin              : number | undefined
  valorMax              : number | undefined  
  estados               : ILabelValue[]
  origenes              : ILabelValue[]
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
  conOrdenes            : ILabelValue
  proveedores           : ILabelValue  
  incPago               : ILabelValue
  incEstado             : ILabelValue
  incRazon              : ILabelValue
  incOrigen             : ILabelValue  
  municipio             : IMunicipio
  municipioContacto     : IMunicipio
  usuario              ?: IUsuario
  creador              ?: IUsuario
  resultadosXPage       : number
  pagina                : number  
}

import {  Router           } from "vue-router"

export interface        IBusqueda {
  query                 : IQuery
  usuarioId             : number        // id de usuario que busca
  router                : Router
  rourterQ              : LocationQuery
  acuerdo               : TTipoAcuerdo
  f                     : ICampos       // f de fiels
  o                     : IOpciones     // o de opciones
  usuarioIdInicio       : number
  haySiguientePagina    : boolean
  montadoOk             : boolean
  puedeCambiarUser      : boolean
  haceAutoSelect        : boolean

  // * /////////////////  Geters
  queryVacia            : boolean
  esCotizacion          : boolean
  esPedido              : boolean
  esOCProveedor         : boolean
  esEntrega             : boolean
  puedeBuscar           : boolean
  camposVacios          : boolean

  // * /////////////////  Metodos
  initClass             : ()=>void
  iniciarOpciones       : ()=>void
  copiarQueryACampos    : ()=>void
  desmontarBusqueda     : ()=>void
  copiarQueryARourter   : ()=>void
  limpiarQueryDeRouter  : ()=>Promise< boolean >
  siguientePagina       : ( largo : number )=>number
  montarBusqueda        : ( idUsuario : number, r : Router, autoSelect : boolean, canChangeUser : boolean, acuerdoTipo? : TTipoAcuerdo )=>void
}

export class Busqueda implements IBusqueda
{
  rourterQ              : LocationQuery
  acuerdo               : TTipoAcuerdo 
  usuarioId             : number
  f                     : ICampos
  o                     : IOpciones
  usuarioIdInicio       : number
  haySiguientePagina    : boolean
  montadoOk             : boolean
  puedeCambiarUser      : boolean
  haceAutoSelect        : boolean  
  router                : Router

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
    this.o                = {
      opcionesOk          : false,
      condicionesPago     : [],
      formasPago          : [],
      metodosEntrega      : [],
      proveedores         : [],
      origenes            : [],
      estados             : [],
    }
    this.f                = {
      copiando            : false,
      buscar              : "",
      contacto            : "",
      desde               : "",
      hasta               : ""    ,
      valorMin            : undefined,
      valorMax            : undefined,
      estados             : [],
      origenes            : [],
      condiciones         : [],
      formaPago           : [],
      entrega             : [],
      estadoAnticipo      : [],
      tipoAnticipo        : [],
      area                : labelValueNulo,
      facturado           : labelValueNulo,
      conIva              : labelValueNulo,
      tipoTercero         : labelValueNulo,
      totalizado          : labelValueNulo,
      conOrdenes          : labelValueNulo,
      proveedores         : labelValueNulo,
      incPago             : labelValueNulo,
      incEstado           : labelValueNulo,
      incRazon            : labelValueNulo,
      incOrigen           : labelValueNulo,
      municipio           : new Municipio(),
      municipioContacto   : new Municipio(),
      resultadosXPage     : 10,
      pagina              : 1,
      usuario             : new Usuario(),
      creador             : new Usuario(),
    }   
  }
  
  async iniciarOpciones()
  {
    this.o.opcionesOk                       = false
    this.o.origenes                         = await getOrigenesContactoDB()
    this.o.condicionesPago                  = await getCondicionesPagoDB()
    this.o.formasPago                       = await getFormasPagoDB()
    this.o.metodosEntrega                   = await getMetodosEntregaDB()    
    this.o.estados                          =   this.esCotizacion ? estadosCtz.filter(e => e.value >= -1)
                                              : this.esPedido     ? estadosPed.filter(e => e.value >= -1)
                                              : this.esOCProveedor? estadosOC .filter(e => e.value >= -1)
                                              : this.esEntrega    ? estadosEnt.filter(e => e.value >= -1)
                                              : []
    if(this.esOCProveedor)
      this.o.proveedores                    = await getProveedoresDB()

    this.o.opcionesOk                       = true
  }

  async copiarQueryACampos()
  {
    this.f.copiando           = true
    this.f.buscar             = getQueryRouterString    ( this.rourterQ .buscar       )
    this.f.contacto           = getQueryRouterString    ( this.rourterQ .contacto     )
    this.f.desde              = getQueryRouterDate      ( this.rourterQ .fechaDesde   )
    this.f.hasta              = getQueryRouterDate      ( this.rourterQ .fechaHasta   )
    this.f.valorMin           = getQueryRouterNumber    ( this.rourterQ .valorMin     )
    this.f.valorMax           = getQueryRouterNumber    ( this.rourterQ .valorMax     )
    if(!!this.rourterQ .limite)
      this.f.resultadosXPage  = getQueryRouterNumber    ( this.rourterQ .limite       )
    this.f.area               = getQueryRouterLabelValue( this.rourterQ .area,                  Areas                     )
    this.f.facturado          = getQueryRouterLabelValue( this.rourterQ .facturado,             Busqueda.listaFacturado   )
    this.f.incPago            = getQueryRouterLabelValue( this.rourterQ .incPago,               Incentivo.estadosPago     )
    this.f.incEstado          = getQueryRouterLabelValue( this.rourterQ .incEstado,             Incentivo.estados         )
    this.f.incRazon           = getQueryRouterLabelValue( this.rourterQ .incRazon,              Incentivo.razones         )
    this.f.incOrigen          = getQueryRouterLabelValue( this.rourterQ .incOrigen,             Incentivo.origenes        )    
    this.f.conIva             = getQueryRouterLabelValue( this.rourterQ .conIva,                Busqueda.listaIVA         )
    this.f.totalizado         = getQueryRouterLabelValue( this.rourterQ .conTotal,              Busqueda.listaTotales     )
    this.f.tipoTercero        = getQueryRouterLabelValue( this.rourterQ .interno,               Busqueda.listaTerceroTipo )
    this.f.conOrdenes         = getQueryRouterLabelValue( this.rourterQ .conOrdenes,            Busqueda.listaOrdenesProv )
    this.f.estadoAnticipo     = getQueryRouterLabelValueArray ( this.rourterQ .estadoAnticipo,  Anticipo.estados          )
    this.f.tipoAnticipo       = getQueryRouterLabelValueArray ( this.rourterQ .tipoAnticipo,    Anticipo.tipos            )
    this.f.estados            = getQueryRouterLabelValueArray ( this.rourterQ .estados,         this.o.estados            )    
    this.f.formaPago          = getQueryRouterLabelValueArray ( this.rourterQ .formaPago,       this.o.formasPago         )
    this.f.entrega            = getQueryRouterLabelValueArray ( this.rourterQ .entrega,         this.o.metodosEntrega     )
    this.f.condiciones        = getQueryRouterLabelValueArray ( this.rourterQ .condiciones,     this.o.condicionesPago    )
    this.f.origenes           = getQueryRouterLabelValueArray ( this.rourterQ .origenes,        this.o.origenes           )

    const municipioId         = getQueryRouterNumber( this.rourterQ .municipio ) 
    this.f.municipio          = !!municipioId     ? await getMunicipioDB( municipioId )     : new Municipio()

    const municipioContId     = getQueryRouterNumber( this.rourterQ .municipioContacto ) 
    this.f.municipioContacto  = !!municipioContId ? await getMunicipioDB( municipioContId ) : new Municipio()

    const creadorlId          = getQueryRouterNumber( this.rourterQ.creador )
    this.f.creador            = creadorlId > 0 ? await getUsuarioDB( creadorlId ) : new Usuario()
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

  async montarBusqueda( idUsuario : number, r : Router, autoSelect : boolean, canChangeUser : boolean, acuerdoTipo : TTipoAcuerdo = TIPO_ACUERDO.NULO )
  {
    this.montadoOk            = false
    this.haceAutoSelect       = autoSelect
    this.puedeCambiarUser     = canChangeUser
    this.usuarioId            = idUsuario
    this.initClass()
    this.router               = r
    this.rourterQ             = this.router.currentRoute.value.query
    this.usuarioIdInicio      = getQueryRouterNumber( this.rourterQ.usuario ) ?? 0
    const cambioTipo          = this.acuerdo != acuerdoTipo
    if(cambioTipo)
      this.acuerdo            = acuerdoTipo

    await this.iniciarOpciones()
    await this.copiarQueryACampos()
    
    this.montadoOk          = true
  }

  copiarQueryARourter()
  {
    this.router.replace({ query: { ...this.query }  })
  }

  async limpiarQueryDeRouter() : Promise< boolean >
  {
    if(!this.montadoOk) return false
    this.rourterQ = {}
    if(!this.camposVacios)
      await this.copiarQueryACampos()
    this.router.replace({ query: {} })

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

  get camposVacios        () : boolean {    
    for(const [key, value] of Object.entries( this.f ))
    {
      if(key == "copiando" || key == "resultadosXPage" || key == "pagina" ) continue

      if( ( !!value && ( typeof value === "string" || typeof value === "boolean" || typeof value === "number" ) )
          ||
          ( Array.isArray(value) && !!value.length )
          ||
          ( typeof value === "object" && "label" in value && !!value.label  )
      )
      {
        return false
      } 
    }

    return true
  }

  get queryVacia          () : boolean { return !Object.keys(this.query).length               }
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

    if(this.f.buscar.length  > 3)       q.buscar            = this.f.buscar
    if(this.f.contacto.length > 3)      q.contacto          = this.f.contacto
    if(!!this.f.valorMin)               q.valorMin          = this.f.valorMin
    if(!!this.f.valorMax)               q.valorMax          = this.f.valorMax
    if(!!this.f.estados.length)         q.estados           = this.f.estados        .map( e => e.value ).join("_")
    if(!!this.f.origenes.length)        q.origenes          = this.f.origenes       .map( e => e.value ).join("_")
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
    if(!!this.f.tipoTercero.label)      q.interno           = this.f.tipoTercero.value
    if(!!this.f.municipio.id)           q.municipio         = this.f.municipio.id
    if(!!this.f.municipioContacto.id)   q.municipioContacto = this.f.municipioContacto.id
    if(!!this.f.conOrdenes.label)       q.conOrdenes        = this.f.conOrdenes.value
    if(!!this.f.usuario && this.f.usuario.id  > 0 && !this.esOCProveedor )
      q.usuario                                             = this.f.usuario.id     
    if(!!this.f.creador   && this.f.creador.id    > 0)
      q.creador                                           = this.f.creador.id
    if(this.esOCProveedor && !!this.f.proveedores.label)
      q.proveedorId                                       = this.f.proveedores.value
    // proveedores
    if(this.f.desde instanceof Date && !isNaN(this.f.desde.valueOf()))  q.fechaDesde  = this.f.desde.toLocaleDateString('sv-SE')
    if(this.f.hasta instanceof Date && !isNaN(this.f.hasta.valueOf()))  q.fechaHasta  = this.f.hasta.toLocaleDateString('sv-SE')

    if(!!Object.keys(q).length){
      q.limite                    = this.f.resultadosXPage
      q.offset                    = q.limite * (this.f.pagina - 1)
    }

    return q
  }

  // * /////////////////////////////////////////////////////////////////////// Lista de opciones
  static listaFacturado           = [{value:0, label:'No facturado'},   {value:1, label:'Facturado'   }]
  static listaTotales             = [{value:0, label:'Sin totalizar'},  {value:1, label:'Totalizado'  }]
  static listaIVA                 = [{value:0, label:'Sin IVA'},        {value:1, label:'Con IVA'     }]
  static listaTerceroTipo         = [{value:0, label:'Externo'},        {value:1, label:'Interno'     }]
  static listaOrdenesProv         = [{value:0, label:'Sin ordenes'},    {value:1, label:'Con ordenes' }]  
  static listaAreas               = Areas  
  static listaEstadosPago         = Incentivo.estadosPago
  static listaAnticipoEstados     = Anticipo.estados
  static listaAnticipoTipos       = Anticipo.tipos  
  static listaResultadosXPag      = [ {label: '10',   value: 10   },
                                      {label: '25',   value: 25   },
                                      {label: '50',   value: 50   },
                                      {label: '100',  value: 100  }
                                    ]
} 