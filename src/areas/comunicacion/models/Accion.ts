import {  getMilisecShortForApiDolibarr } from "src/useSimpleOk/useTools"
import {  IUsuario, Usuario } from "src/areas/usuarios/models/Usuario"
import {  diferenciaFechas  } from "src/useSimpleOk/useTools"
import {  TIPO_ACUERDO      } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  getUsuarioDB      } from "src/services/useDexie"


export interface IAccion
{
  id                        : number  // 
  codigo                    : string  // AC_OTH
  creacion                  : Date
  creador                   : IUsuario
  creadorId                 : number
  modificado                : Date
  modifico                  : IUsuario
  modificoId                : number
  asignado                  : IUsuario
  asignadoId                : number
  terceroId                 : number
  progreso                  : number  
  label                     : string
  value                     : string
  elementoId                : number 
  tipo                      : string // order
  commentToApi              : any
  hace                      : string
  sePuedeEditar             : boolean
  editandoComentario        : boolean
  esTarea                   : boolean
}

export class Accion implements IAccion
{
  id                        : number  = 0
  codigo                    : string  = "AC_OTH"
  creacion                  : Date    = new Date()
  creadorId                 : number  = 0
  modificado                : Date    = new Date()
  modificoId                : number  = 0
  asignadoId                : number  = 0
  terceroId                 : number  = 0
  progreso                  : number  = -1  
  label                     : string  = ""
  value                     : string  = ""
  elementoId                : number  = 0
  tipo                      : string  = ""
  editandoComentario        : boolean = false

  creador                   : IUsuario= new Usuario()  
  modifico                  : IUsuario= new Usuario()
  asignado                  : IUsuario= new Usuario()  

  constructor()
  {
  }

  get commentToApi() : any {
    return {
      type_code:    this.codigo,
      label:        this.label,
      note_private: this.value,
      socid:        this.terceroId,
      fk_element:   this.elementoId,
      elementtype:  this.tipo,
      fulldayevent: "0",
      percentage:   this.progreso, 
      userownerid:  this.asignadoId,
      datep:        getMilisecShortForApiDolibarr( new Date() )
    }
  }

  get esTarea(): boolean { return this.progreso > -1 }

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

  static async accionApiToAccion( cApi : any ) : Promise<IAccion>
  {
      const c       = Object.assign( new Accion(), cApi ) as IAccion
      c.creadorId   = +cApi?.creadorId  ?? 0
      c.asignadoId  = +cApi?.asignadoId ?? 0
      c.modificoId  = +cApi?.modificoId ?? 0
      c.elementoId  = +cApi?.elementoId ?? 0
      c.id          = +cApi?.id         ?? 0
      c.progreso    = +cApi?.progreso   ?? 0
      c.terceroId   = +cApi?.terceroId  ?? 0
      c.creacion    = !!cApi.creacion ? new Date( cApi.creacion ) : new Date()
      c.value       = c.value.replaceAll('\n', "<br/>")

      c.creador     = await getUsuarioDB( c.creadorId )
      c.asignado    = await getUsuarioDB( c.asignadoId )
      c.modifico    = await getUsuarioDB( c.modificoId )
  
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