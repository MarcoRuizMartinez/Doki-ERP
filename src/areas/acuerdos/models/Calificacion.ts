//* ///////////////////////////////////////// Core
import {  getUsuarioDB      } from "src/composables/useDexie"

//* ///////////////////////////////////////// Modelos
import {  IUsuario, Usuario } from "src/areas/usuarios/models/Usuario"
import {  IArchivo, Archivo } from "src/models/Archivo"
import {  getDateToStr      } from "src/composables/useTools"

//type TNota              = 0 | 1 | 2 | 3 | 4 | 5

interface ICamposCal {
  detalles              : string
  filename              : string
  nota_atencion         : number
  nota_calidad          : number
  nota_precio           : number
  nota_tiempos          : number // 0 | 1 | 2 | 3 | 4 | 5
}

export interface ICalificacion
{
  id                    : number
  tipo                  : 1 | 2   // 1 = cotizacion; 2 = pedido
  esCotizacion          : boolean
  esPedido              : boolean
  acuerdo_id            : number
  editor                : IUsuario
  editorNow_id          : number
  fecha_edicion         : Date
  fecha_creacion        : Date
  esValida              : boolean
  dataForApi            : any
  file                  : IArchivo
  f                     : ICamposCal // f de Fields
  promedio              : number
}

export class Calificacion implements ICalificacion
{
  id                    : number
  tipo                  : 1 | 2
  acuerdo_id            : number  
  editor                : IUsuario
  editorNow_id          : number
  fecha_edicion         : Date
  fecha_creacion        : Date
  file                  : IArchivo
  f                     : ICamposCal

  constructor( tipo : 1 | 2 )
  {
    this.id             = 0
    this.tipo           = tipo
    this.acuerdo_id     = 0
    this.editor         = new Usuario()
    this.editorNow_id   = 0
    this.fecha_edicion  = new Date()
    this.fecha_creacion = new Date()
    this.file           = new Archivo()
    this.f              = {
      detalles          : "",
      filename          : "",
      nota_atencion     : 0,
      nota_calidad      : 0,
      nota_precio       : 0,
      nota_tiempos      : 0,
    }
  }

  get esCotizacion()    : boolean { return this.tipo === 1 }
  get esPedido()        : boolean { return this.tipo === 2 }
  get esValida()        : boolean { return !!this.f.nota_atencion && !!this.f.nota_calidad && !!this.f.nota_precio && !!this.f.nota_tiempos && !!this.f.filename }
  get promedio()        : number  { return ( this.f.nota_atencion + this.f.nota_calidad + this.f.nota_precio + this.f.nota_tiempos ) / 4 }
  get dataForApi()      : any {
    const data = {
      id            : this.id,
      acuerdo       : this.tipo,
      filename      : this.f.filename ?? "",
      detalles      : this.f.detalles,
      nota_atencion : this.f.nota_atencion,
      nota_calidad  : this.f.nota_calidad,
      nota_precio   : this.f.nota_precio,
      nota_tiempos  : this.f.nota_tiempos,
    }

    return data
  }

  // * ///////////////////////////////////////////////////// static convertir data de API en new acuerdo
  static async convertirDataApiToCalificacion( dApi : any ) : Promise < ICalificacion >
  {
    dApi.id                 = +(dApi?.id               ?? 0)
    dApi.tipo               = +(dApi?.tipo             ?? 0)
    const tipo              =   dApi.tipo == 1 ? 1
                              : dApi.tipo == 2 ? 2
                              : 1
    dApi.acuerdo_id         = +(dApi?.acuerdo_id       ?? 0)

    const editor            = +(dApi?.editor           ?? 0)
    dApi.fecha_creacion     = getDateToStr( dApi.fecha_creacion )
    dApi.fecha_edicion      = getDateToStr( dApi.fecha_edicion  )    
    const cal               = Object.assign( new Calificacion( tipo ), dApi ) as ICalificacion
    cal.editor              = await getUsuarioDB( editor  )
    cal.f.nota_atencion     = +(dApi?.nota_atencion    ?? 0)
    cal.f.nota_calidad      = +(dApi?.nota_calidad     ?? 0)
    cal.f.nota_precio       = +(dApi?.nota_precio      ?? 0)
    cal.f.nota_tiempos      = +(dApi?.nota_tiempos     ?? 0)     
    cal.f.detalles          = dApi?.detalles ?? ""
    cal.f.filename          = dApi?.filename ?? ""

    return cal
  }
}