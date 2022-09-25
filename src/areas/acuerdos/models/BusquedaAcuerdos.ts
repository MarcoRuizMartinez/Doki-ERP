import {  TIPO_ACUERDO    } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  ILabelValue,
          labelValueNulo  } from "src/models/TiposVarios"
import {  IUsuario            } from "src/areas/usuarios/models/Usuario"


export interface IQueryAcuerdo {
  tipo                 ?:  string
  acuerdo              ?:  TIPO_ACUERDO
  idTercero            ?:  number
  idComercial          ?:  string | number
  filtroTexto          ?:  string
  tercero              ?:  string
  contacto             ?:  string
  estado               ?:  string
  origen               ?:  string
  fechaDesde           ?:  string
  fechaHasta           ?:  string
  subtotalMin          ?:  number
  subtotalMax          ?:  number
  conIva               ?:  number
  conTotal             ?:  number
  limite               ?:  number
  offset               ?:  number
  area                 ?:  string
  orden                ?:  "ASC" | "DESC"
  municipio            ?:  string
  //idEspecial?:       number
}

export interface IBusquedaAcuerdo {
  query                 : IQueryAcuerdo
  acuerdo               : TIPO_ACUERDO
  tercero               : string
  contacto              : string  
  desde                 : Date | string
  hasta                 : Date | string  
  precioMinimo          : number | undefined
  precioMaximo          : number | undefined  
  estado                : ILabelValue[]
  origen                : ILabelValue[]
  conIva                : ILabelValue
  totalizado            : ILabelValue
  responsable    ?      : IUsuario
  resultadosXPage       : number
  pagina                : number
  filtroTexto           : string
  esCotizacion          : boolean
  esPedido              : boolean
}


export class BusquedaAcuerdo implements IBusquedaAcuerdo
{
  acuerdo               : TIPO_ACUERDO
  tercero               : string
  contacto              : string  
  desde                 : Date | string
  hasta                 : Date | string  
  precioMinimo          : number | undefined
  precioMaximo          : number | undefined  
  estado                : ILabelValue[]
  origen                : ILabelValue[]
  conIva                : ILabelValue
  totalizado            : ILabelValue
  responsable          ?: IUsuario
  resultadosXPage       : number
  pagina                : number
  filtroTexto           : string

  constructor( acuerdoTipo : TIPO_ACUERDO = TIPO_ACUERDO.NULO )
  {
    this.acuerdo          = acuerdoTipo
    this.tercero          = ""
    this.contacto         = ""
    this.desde            = ""
    this.hasta            = ""    
    this.precioMinimo     = undefined
    this.precioMaximo     = undefined
    this.estado           = []
    this.origen           = []
    this.conIva           = labelValueNulo
    this.totalizado       = labelValueNulo
    this.resultadosXPage  = 25
    this.pagina           = 1
    this.filtroTexto      = ""
  }

  get esCotizacion() : boolean{
    return this.acuerdo === TIPO_ACUERDO.COTIZACION
  }
  get esPedido() : boolean  {
    return this.acuerdo === TIPO_ACUERDO.PEDIDO
  }

  get query() : IQueryAcuerdo {
    const q : IQueryAcuerdo       = {} 
    if(this.tercero.length  > 3)  q.tercero       = this.tercero
    if(this.contacto.length > 3)  q.contacto      = this.contacto
    if(!!this.precioMinimo)       q.subtotalMin   = this.precioMinimo
    if(!!this.precioMaximo)       q.subtotalMax   = this.precioMaximo

    if(!!this.estado.length)      q.estado        = this.estado.map( e => e.value ).join("-")
    if(!!this.origen.length)      q.origen        = this.origen.map( e => e.value ).join("-")
    if(!!this.conIva.label)       q.conIva        = this.conIva.value
    if(!!this.totalizado.label)   q.conTotal      = this.totalizado.value

    if(!!this.responsable)        q.idComercial   = this.responsable.id
    if(this.desde instanceof Date && !isNaN(this.desde.valueOf()))  q.fechaDesde  = this.desde.toLocaleDateString('sv-SE')
    if(this.hasta instanceof Date && !isNaN(this.hasta.valueOf()))  q.fechaHasta  = this.hasta.toLocaleDateString('sv-SE')

    
    return q
  }

} 