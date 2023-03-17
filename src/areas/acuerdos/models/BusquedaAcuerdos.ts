import {  TIPO_ACUERDO, TTipoAcuerdo    } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  Areas,
          ILabelValue,  
          labelValueNulo                } from "src/models/TiposVarios"
import {  IUsuario, Usuario             } from "src/areas/usuarios/models/Usuario"
import {  IMunicipio, Municipio         } from "src/models/Municipio"
import {  INCENTIVO_ESTADO_PAGO         } from "src/areas/nomina/models/Incentivo"  
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

export interface      IQueryAcuerdo {
  tipo                 ?: string
  acuerdo              ?: TTipoAcuerdo
  comercial            ?: string | number
  creador              ?: string | number
  tercero              ?: string
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
  subtotalMin          ?: number
  subtotalMax          ?: number
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
  comision             ?: INCENTIVO_ESTADO_PAGO
}

interface IOpciones {
  opcionesOk            : boolean
  condicionesPago       : ILabelValue[]
  formasPago            : ILabelValue[]
  metodosEntrega        : ILabelValue[]
  proveedores           : ILabelValue[]
  origenes              : ILabelValue[]
  estados               : ILabelValue[]
}

interface ICampos {
  copiando              : boolean
  tercero               : string
  contacto              : string
  desde                 : Date | string
  hasta                 : Date | string  
  precioMinimo          : number | undefined
  precioMaximo          : number | undefined  
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
  comision              : ILabelValue
  municipio             : IMunicipio
  municipioContacto     : IMunicipio
  comercial            ?: IUsuario
  creador              ?: IUsuario
  resultadosXPage       : number
  pagina                : number
}


export interface        IBusquedaAcuerdo {
  query                 : IQueryAcuerdo
  rourterQ              : LocationQuery
  acuerdo               : TTipoAcuerdo
  f                     : ICampos       // f de fiels
  o                     : IOpciones     // o de opciones
  comercialIdInicio     : number

  // * /////////////////  Geters
  queryVacia            : boolean
  hayComercialInicio    : boolean
  esCotizacion          : boolean
  esPedido              : boolean
  esOCProveedor         : boolean
  esEntrega             : boolean
  puedeBuscar           : boolean

  inicializarBusqueda   : ()=>void
  iniciarOpciones       : ( q : LocationQuery )=>void
  copiarQueryACampos    : ( limpiar? : "limpiar" | "" )=>void
  montarBusqueda        : ( acuerdoTipo : TTipoAcuerdo )=>void
  desmontarBusqueda     : ()=>void
}

export class BusquedaAcuerdo implements IBusquedaAcuerdo
{
  rourterQ              : LocationQuery
  acuerdo               : TTipoAcuerdo  
  f                     : ICampos;
  o                     : IOpciones
  comercialIdInicio     : number

  constructor()
  {
    this.acuerdo          = TIPO_ACUERDO.NULO
    this.inicializarBusqueda()
  }

  inicializarBusqueda()
  {    
    this.rourterQ         = {}
    this.comercialIdInicio= 0
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
      tercero             : "",
      contacto            : "",
      desde               : "",
      hasta               : ""    ,
      precioMinimo        : undefined,
      precioMaximo        : undefined,
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
      comision            : labelValueNulo,
      municipio           : new Municipio(),
      municipioContacto   : new Municipio(),
      resultadosXPage     : 10,
      pagina              : 1,
      comercial           : new Usuario(),
      creador             : new Usuario(),
    }   
  }
  
  async iniciarOpciones( q : LocationQuery )
  {
    console.log("iniciarOpciones: ");
    this.o.opcionesOk                       = false
    this.rourterQ                           = q
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

    this.comercialIdInicio                  = getQueryRouterNumber( this.rourterQ.comercial ) ?? 0
    this.o.opcionesOk                       = true
    await this.copiarQueryACampos()
  }

  async copiarQueryACampos( limpiar : "limpiar" | "" = "" )
  {
    this.f.copiando           = true
    if(!!limpiar)             this.rourterQ = {}
    this.f.tercero            = getQueryRouterString    ( this.rourterQ .tercero      )
    this.f.contacto           = getQueryRouterString    ( this.rourterQ .contacto     )
    this.f.desde              = getQueryRouterDate      ( this.rourterQ .fechaDesde   )
    this.f.hasta              = getQueryRouterDate      ( this.rourterQ .fechaHasta   )
    this.f.precioMinimo       = getQueryRouterNumber    ( this.rourterQ .subtotalMin  )
    this.f.precioMaximo       = getQueryRouterNumber    ( this.rourterQ .subtotalMax  )
    if(!!this.rourterQ .limite)
      this.f.resultadosXPage  = getQueryRouterNumber    ( this.rourterQ .limite       )
    this.f.area               = getQueryRouterLabelValue( this.rourterQ .area,                  Areas                         )
    this.f.facturado          = getQueryRouterLabelValue( this.rourterQ .facturado,             BusquedaAcuerdo.listaFacturado )
    this.f.comision           = getQueryRouterLabelValue( this.rourterQ .comision,              Incentivo.estadosPago )
    this.f.conIva             = getQueryRouterLabelValue( this.rourterQ .conIva,                BusquedaAcuerdo.listaIVA           )
    this.f.totalizado         = getQueryRouterLabelValue( this.rourterQ .conTotal,              BusquedaAcuerdo.listaTotales       )
    this.f.tipoTercero        = getQueryRouterLabelValue( this.rourterQ .interno,               BusquedaAcuerdo.listaTerceroTipo   )
    this.f.conOrdenes         = getQueryRouterLabelValue( this.rourterQ .conOrdenes,            BusquedaAcuerdo.listaOrdenesProv   )
    this.f.estadoAnticipo     = getQueryRouterLabelValueArray ( this.rourterQ .estadoAnticipo,  Anticipo.estados      )
    this.f.tipoAnticipo       = getQueryRouterLabelValueArray ( this.rourterQ .tipoAnticipo,    Anticipo.tipos        )
    this.f.estados            = getQueryRouterLabelValueArray ( this.rourterQ .estados,         this.o.estados          )    
    this.f.formaPago          = getQueryRouterLabelValueArray ( this.rourterQ .formaPago,       this.o.formasPago       )
    this.f.entrega            = getQueryRouterLabelValueArray ( this.rourterQ .entrega,         this.o.metodosEntrega   )
    this.f.condiciones        = getQueryRouterLabelValueArray ( this.rourterQ .condiciones,     this.o.condicionesPago  )
    this.f.origenes           = getQueryRouterLabelValueArray ( this.rourterQ .origenes,        this.o.origenes         )

    const municipioId         = getQueryRouterNumber( this.rourterQ .municipio ) 
    this.f.municipio          = !!municipioId     ? await getMunicipioDB( municipioId )     : new Municipio()

    const municipioContId     = getQueryRouterNumber( this.rourterQ .municipioContacto ) 
    this.f.municipioContacto  = !!municipioContId ? await getMunicipioDB( municipioContId ) : new Municipio()

    const comercialId         = getQueryRouterNumber( this.rourterQ.comercial  )
    this.f.comercial          = comercialId > 0 ? await getUsuarioDB( comercialId ) : new Usuario()

    const creadorlId          = getQueryRouterNumber( this.rourterQ.creador )
    this.f.creador            = creadorlId > 0 ? await getUsuarioDB( creadorlId ) : new Usuario()

    this.f.copiando           = false
  }

  montarBusqueda( acuerdoTipo : TTipoAcuerdo )
  {
    this.acuerdo            = acuerdoTipo
    this.inicializarBusqueda()
  }

  desmontarBusqueda()
  {
    this.acuerdo            = TIPO_ACUERDO.NULO
    this.inicializarBusqueda()
  }

  get puedeBuscar         () : boolean { return this.o.opcionesOk && !this.f.copiando }
  get queryVacia          () : boolean { return !Object.keys(this.query).length   }
  get hayComercialInicio  () : boolean { return !!this.comercialIdInicio          }
  get esCotizacion        () : boolean { return this.acuerdo === TIPO_ACUERDO.COTIZACION_CLI   }
  get esPedido            () : boolean { return this.acuerdo === TIPO_ACUERDO.PEDIDO_CLI       }
  get esOCProveedor       () : boolean { return this.acuerdo === TIPO_ACUERDO.PEDIDO_PRO       }
  get esEntrega           () : boolean { return this.acuerdo === TIPO_ACUERDO.ENTREGA_CLI      }

  get query() : IQueryAcuerdo
  {
    const q : IQueryAcuerdo       = {}

    if(this.f.tercero.length  > 3)      q.tercero           = this.f.tercero
    if(this.f.contacto.length > 3)      q.contacto          = this.f.contacto
    if(!!this.f.precioMinimo)           q.subtotalMin       = this.f.precioMinimo
    if(!!this.f.precioMaximo)           q.subtotalMax       = this.f.precioMaximo
    if(!!this.f.estados.length)         q.estados           = this.f.estados        .map( e => e.value ).join("_")
    if(!!this.f.origenes.length)        q.origenes          = this.f.origenes       .map( e => e.value ).join("_")
    if(!!this.f.condiciones.length)     q.condiciones       = this.f.condiciones    .map( e => e.value ).join("_")
    if(!!this.f.formaPago.length)       q.formaPago         = this.f.formaPago      .map( e => e.value ).join("_")
    if(!!this.f.entrega.length)         q.entrega           = this.f.entrega        .map( e => e.value ).join("_")
    if(!!this.f.estadoAnticipo.length)  q.estadoAnticipo    = this.f.estadoAnticipo .map( e => e.value ).join("_")
    if(!!this.f.tipoAnticipo.length)    q.tipoAnticipo      = this.f.tipoAnticipo   .map( e => e.value ).join("_")
    if(!!this.f.area.label)             q.area              = this.f.area.value
    if(!!this.f.facturado.label)        q.facturado         = this.f.facturado.value
    if(!!this.f.comision.label)         q.comision          = this.f.comision.value
    if(!!this.f.conIva.label)           q.conIva            = this.f.conIva.value
    if(!!this.f.totalizado.label)       q.conTotal          = this.f.totalizado.value
    if(!!this.f.tipoTercero.label)      q.interno           = this.f.tipoTercero.value
    if(!!this.f.municipio.id)           q.municipio         = this.f.municipio.id
    if(!!this.f.municipioContacto.id)   q.municipioContacto = this.f.municipioContacto.id
    if(!!this.f.conOrdenes.label)       q.conOrdenes        = this.f.conOrdenes.value
    if(!!this.f.comercial && this.f.comercial.id  > 0 && !this.esOCProveedor )
      q.comercial                                         = this.f.comercial.id     
    if(!!this.f.creador   && this.f.creador.id    > 0)
      q.creador                                           = this.f.creador.id
    if(this.esOCProveedor && !!this.f.proveedores.label)
      q.proveedorId                                       = this.f.proveedores.value

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
} 