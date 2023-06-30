//import {  date          } from "quasar"
import {  fechaCorta    } from "src/useSimpleOk/useTools"
import {  getMilisecShortForApiDolibarr } from "src/useSimpleOk/useTools"
import {  IUsuario, Usuario } from "src/areas/usuarios/models/Usuario"
import {  diferenciaFechas  } from "src/useSimpleOk/useTools"
import {  TIPO_ACUERDO      } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  getUsuarioDB      } from "src/services/useDexie"
import {  ILabelValue,
          labelValueNulo    } from "src/models/TiposVarios"

export const Prioridades = [
  { value: 0, label: "😉Normal"         },
  { value: 1, label: "😬Urgente"        },
  { value: 2, label: "🚨Vida o Muerte"  }
]

export const Cuando = [
  { value: 1, label: "📅Fecha"          },
  { value: 2, label: "📍Hoy"            },
  { value: 3, label: "▶️Mañana"         },
  { value: 4, label: "⏩Esta semana"    },
  { value: 5, label: "↗️Otra semana"    },
  { value: 6, label: "📆Otro mes"       },
  { value: 7, label: "✋🏼Algún momento"  },
  { value: 8, label: "❌Descartado"     },
]

export const Progresos = [
  { value: 0,   label: "0%"   },
  { value: 25,  label: "25%"  },
  { value: 50,  label: "50%"  },
  { value: 75,  label: "75%"  },
  { value: 100, label: "100%" }
  
]
export const TASK = "task"

export type  PropsAccion    = {
  elementoId                ?: number 
  tipo                      ?: string
  terceroId                 ?: number
  proyectoId                ?: number
}

type TipoAccion             = "sistema" | "manual"

export interface IAccion
{
  id                        : number  //
  codigo                    : string  // AC_OTH
  tipoAccion                : TipoAccion // 40 sistema 50 manual
  fechaInicio               : Date
  fechaFin                  : Date
  eventoDiaFull             : boolean

  usuarioNowId              : number

  creacion                  : Date
  creador                   : IUsuario

  modificado                : Date
  modifico                  : IUsuario
  
  asignado                  : IUsuario
  
  proyectoId                : number
  terceroId                 : number
  progreso                  : number
  progreso_1_4              : number
  cuando                    : ILabelValue
  prioridad                 : ILabelValue
  publico                   : boolean
  titulo                    : string
  comentario                : string
  elementoId                : number
  tipo                      : string // order
  accionToApiDolibarr       : any
  hace                      : string
  sePuedeEditar             : boolean
  editandoComentario        : boolean
  esTarea                   : boolean
  tareaCompletada           : boolean
  esNuevo                   : boolean
  esFecha                   : boolean
  usuarioEsCreador          : boolean
  usuarioEsAsignado         : boolean
  usuarioPermitido          : boolean
  urlDolibarrFiles          : string
  progresoLabel             : string  
  fechaInicioCorta          : string
  fechaCreacionCorta        : string
  fechaEdicionCorta         : string
  cuandoLabel               : string
  prioridadLabel            : string
  prioridadEmoji            : string
  publicoLabel              : string
  creadorLabel              : string
  modificoLabel             : string
  asignadoLabel             : string
  tipoLabel                 : string
  toTipo                    : string
  tieneTerceroYNoEsTercero  : boolean
}

export class Accion implements IAccion
{
  id                        : number        = 0
  codigo                    : string        = "AC_OTH"
  tipoAccion                : TipoAccion    = "manual"
  eventoDiaFull             : boolean       = true
  fechaInicio               : Date          = new Date()
  fechaFin                  : Date          = new Date()
  usuarioNowId              : number
  creacion                  : Date          = new Date()  
  modificado                : Date          = new Date()
  proyectoId                : number        = 0
  terceroId                 : number        = 0
  progreso                  : number        = -1
  cuando                    : ILabelValue   = labelValueNulo
  prioridad                 : ILabelValue   = labelValueNulo
  publico                   : boolean       = true
  titulo                    : string        = ""
  comentario                : string        = ""
  elementoId                : number        = 0
  tipo                      : string        = ""
  editandoComentario        : boolean       = false

  creador                   : IUsuario      = new Usuario()
  modifico                  : IUsuario      = new Usuario()
  asignado                  : IUsuario      = new Usuario()

  constructor( usuarioNowId : number )
  {
    this.usuarioNowId       = usuarioNowId
  }

  get accionToApiDolibarr() : any {
    const data    = {
      type_code:    this.codigo,
      label:        this.titulo,
      note_private: this.comentario,      
      fulldayevent: +this.cuando.value > 0,
      percentage:   this.progreso,
      userownerid:  this.asignado.id,      
      status:       this.cuando.value,
      priority:     this.prioridad.value,
      transparency: +this.publico,
      datep:        getMilisecShortForApiDolibarr( this.fechaInicio ),
      datef:        getMilisecShortForApiDolibarr( this.fechaFin ),
      socid:        !!this.terceroId  ? this.terceroId  : null,
      fk_element:   !!this.elementoId ? this.elementoId : null,
      elementtype:  !!this.tipo       ? this.tipo       : null,
      fk_project:   !!this.proyectoId ? this.proyectoId : null,
    }

    return data
  }
  
  get progreso_1_4()              { return  this.progreso >= 25 ? this.progreso / 25 : 0 }
  set progreso_1_4( p : number )  { this.progreso = p * 25}

  get usuarioEsCreador()  : boolean { return this.usuarioNowId == this.creador.id   }
  get usuarioEsAsignado() : boolean { return this.usuarioNowId == this.asignado.id }
  get usuarioPermitido()  : boolean { return this.usuarioEsCreador || this.usuarioEsAsignado }
  get esNuevo()           : boolean { return !this.id }  
  get esFecha()           : boolean { return this.cuando.value === Cuando[0].value }
  get esTarea()           : boolean { return this.progreso > -1 && this.codigo == "AC_OTH" }  
  get tareaCompletada()   : boolean { return this.esTarea && this.progreso === 100 }
  get prioridadLabel()    : string  { return this.prioridad.label }
  get prioridadEmoji()    : string  { return this.prioridadLabel.slice(0,2 ) }
  get publicoLabel()      : string  { return this.publico ? "🗣️Publico" : "🔒Privado"}

  get creadorLabel()      : string  { return this.creador.nombre }
  get modificoLabel()     : string  { return this.modifico.nombre }
  get asignadoLabel()     : string  { return this.asignado.nombre }

  get fechaInicioCorta()  : string  { return this.esFecha ? fechaCorta(this.fechaInicio) : "" }
  get fechaCreacionCorta(): string  { return fechaCorta(this.creacion)  }
  get fechaEdicionCorta() : string  { return fechaCorta(this.modificado)  }
  get tieneTerceroYNoEsTercero() : boolean{
    return !!this.terceroId && !!this.tipo
  }
  get cuandoLabel()       : string  { return this.esFecha ? this.fechaInicioCorta : this.cuando.label }

  //get fechaCorta        (): string  { return  }

  get hace(): string  {
    const diferencia  = Date.now() - this.creacion.valueOf()
    const hace        =   diferencia <= 3_600_000   ? diferenciaFechas( this.creacion.valueOf(), Date.now() ) // 1 hora
                        : diferencia <= 28_800_000  ? `Hoy ${this.creacion.toLocaleString('es-CO', { hour: 'numeric', minute: "numeric", hour12: true })}` // 8 horas
                        : this.creacion.toLocaleString('es-CO', { year: "2-digit",month: "2-digit", day: "numeric", weekday: "short", hour: 'numeric', minute: "numeric", hour12: true })
    return hace
  }

  get sePuedeEditar() : boolean {
    const diferencia  = Date.now() - this.creacion.valueOf()
    return diferencia <= 600_000 // 600_000 son 10 minutos
  }


  get urlDolibarrFiles() : string {
    return process.env.URL_DOLIBARR + "/comm/action/document.php?id=" + this.id
  }  

  get progresoLabel() : string
  {
    const label =   this.progreso === 0   ? "🕑 Pendiente"
                  : this.progreso === 100 ? "✅ Completada"
                  :                         "🏃🏼 Progreso"
                  

    return label
  }

  get tipoLabel() : string
  {
    const label =   this.tipo === "order"           ? "🛒 Pedido"
                  : this.tipo === "propal"          ? "📜 Cotizacion"
                  : this.tipo === "order_supplier"  ? "🚛 Pedido proveedor"
                  : this.tipo === "product"         ? "📦 Producto"
                  : this.tipo === "shipping"        ? "🚛 Entrega"
                  : this.tipo === TASK              ? "✔️ Tarea"
                  :                                   "🏪 Tercero"
                  
    return label
  }

  get toTipo() : string
  {
    const to =      this.tipo === "order"           ? "/pedidos/cliente/" + this.elementoId
                  : this.tipo === "propal"          ? "/cotizaciones/cliente/" + this.elementoId
                  : this.tipo === "order_supplier"  ? "/pedidos/proveedor/" + this.elementoId
                  : this.tipo === "product"         ? "/productos/" + this.elementoId
                  : this.tipo === "shipping"        ? "/entregas/cliente/" + this.elementoId
                  :                                   ""
                  
    return to
  }

  static async accionApiToAccion( cApi : any, usuarioNowId : number ) : Promise<IAccion>
  {
    const c         = Object.assign( new Accion( usuarioNowId ), cApi ) as IAccion
    c.id            = +cApi?.id           ?? 0
    c.tipoAccion    = +(cApi?.tipoAccion  ?? 40) === 40 ? "sistema" : "manual"
    const creadorId = +cApi?.creadorId    ?? 0
    const asignadoId= +cApi?.asignadoId   ?? 0
    const modificoId= +cApi?.modificoId   ?? 0
    c.elementoId    = +cApi?.elementoId   ?? 0
    c.progreso      = +cApi?.progreso     ?? 0
    c.terceroId     = +cApi?.terceroId    ?? 0
    c.proyectoId    = +cApi?.proyectoId   ?? 0
    c.publico       = Boolean( +cApi?.publico       ?? 0)
    c.eventoDiaFull = Boolean( +cApi?.eventoDiaFull ?? 0)
    c.comentario    = c.comentario.replaceAll('\n', "<br/>")
    c.fechaInicio   = !!cApi.fechaInicio  ? new Date( cApi.fechaInicio  ) : new Date()
    c.fechaFin      = !!cApi.fechaFin     ? new Date( cApi.fechaFin     ) : new Date()
    c.creacion      = !!cApi.creacion     ? new Date( cApi.creacion     ) : new Date()
    c.modificado    = !!cApi.modificado   ? new Date( cApi.modificado   ) : new Date()
    
    const cuando    = +cApi?.cuando       ?? 0
    const priori    = +cApi?.prioridad    ?? 0
    c.cuando        = Cuando      .find( c => c.value === cuando ) ?? labelValueNulo
    c.prioridad     = Prioridades .find( c => c.value === priori ) ?? labelValueNulo

    c.creador       = await getUsuarioDB( creadorId   )
    c.asignado      = await getUsuarioDB( asignadoId  )
    c.modifico      = await getUsuarioDB( modificoId  )

    return c
  }

  static getTipo( tipo : TIPO_ACUERDO ) : string {
    return    tipo === TIPO_ACUERDO.PEDIDO_CLI      ? "order"
            : tipo === TIPO_ACUERDO.COTIZACION_CLI  ? "propal"
            : tipo === TIPO_ACUERDO.ENTREGA_CLI     ? "shipping"
            : tipo === TIPO_ACUERDO.FACTURA_CLI     ? "invoice"
            : tipo === TIPO_ACUERDO.FACTURA_PRO     ? "invoice_supplier"
            : "xxx"
            //product
  }
}
