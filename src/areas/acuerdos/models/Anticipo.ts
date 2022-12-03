import {  IUsuario, Usuario   } from "../../usuarios/models/Usuario"
import {  getUsuarioDB,
          getCuentasDineroDB  } from "src/services/useDexie"
import {  ICuentaDinero,
          CuentaDinero        } from "src/models/Diccionarios/CuentaDinero"          
import {  formatoPrecio       } from "src/useSimpleOk/useTools"  
import {  IArchivo, Archivo   } from "src/models/Archivo"
import {  ILabelValue,  labelValueNulo  } from "src/models/TiposVarios"
import {  fechaCorta          } from "src/useSimpleOk/useTools"

export enum ESTADO_ANTICIPO
{
  ANULADO                     = 0,
  PENDIENTE                   = 1,
  VERIFICADO                  = 2,
  CREDITO                     = 3,
}

export enum ESTADO_ANTICIPO_LABEL
{
  ANULADO                     = "❌Anulado",
  PENDIENTE                   = "✋🏼Pendiente",
  VERIFICADO                  = "✅Verificado",
  CREDITO                     = "📆Crédito",
}

export enum TIPO_ANTICIPO
{
  PAGO                        = 1,
  DEVOLUCION                  = 2,
}

export enum TIPO_ANTICIPO_LABEL
{
  PAGO                        = "💵Pago",
  DEVOLUCION                  = "💸Devolución",
}

export type TTipoFileAnticipo = "cliente" | "interno" 

export interface IAnticipo
{ 
  id                        : number
  fechaPago                 : string
  fechaPagoString           : string
  cuenta                    : ICuentaDinero
  cuentaId                  : number
  pedidoId                  : number  
  verificador               : IUsuario
  verificadorId             : number
  valor                     : number
  valorSumar                : number
  valorLabel                : string
  nota                      : string
  fechaEdicionNota          : string
  filenameInterno           : string
  fileInterno               : IArchivo
  filenameCliente           : string
  fileCliente               : IArchivo
  tipo                      : TIPO_ANTICIPO
  tipoSelect                : ILabelValue
  //tipoLabel                 : string
  estado                    : ESTADO_ANTICIPO
  estadoSelect              : ILabelValue
  //estadoLabel               : string
  estadoColor               : string
  estadoIcono               : string
  anticipoToApi             : any
  esNuevo                   : boolean
}

export class Anticipo implements IAnticipo
{
  id                        : number
  fechaPago                 : string
  cuenta                    : ICuentaDinero
  cuentaId                  : number
  pedidoId                  : number  
  verificador               : IUsuario
  verificadorId             : number
  valor                     : number  
  nota                      : string
  fechaEdicionNota          : string
  filenameInterno           : string
  fileInterno               : IArchivo
  filenameCliente           : string
  fileCliente               : IArchivo
  tipo                      : TIPO_ANTICIPO
  tipoSelect                : ILabelValue
  estado                    : ESTADO_ANTICIPO  
  estadoSelect              : ILabelValue

  constructor( idPedido : number = 0 )
  {
    this.id                 = 0
    this.fechaPago          = fechaCorta( new Date() )
    this.cuenta             = new CuentaDinero()
    this.cuentaId           = 0
    this.pedidoId           = idPedido
    this.verificador        = new Usuario()
    this.verificadorId      = 0
    this.valor              = 0
    this.nota               = ""
    this.fechaEdicionNota   = ""
    this.filenameInterno    = ""
    this.filenameCliente    = ""
    this.fileInterno        = new Archivo()    
    this.fileCliente        = new Archivo()    
    this.tipo               = TIPO_ANTICIPO.PAGO
    this.tipoSelect         = labelValueNulo
    this.estado             = ESTADO_ANTICIPO.PENDIENTE
    this.estadoSelect       = labelValueNulo
  }
 
  get esNuevo   () : boolean  { return !this.id }
  get valorSumar() : number   { return this.tipo === TIPO_ANTICIPO.PAGO ? this.valor : -this.valor }
  get valorLabel() : string   { 
    return  ( this.tipoSelect.value === TIPO_ANTICIPO.DEVOLUCION ? '-' : '' ) + formatoPrecio( this.valor, "decimales-no" ) 
  }
/*   get estadoLabel(){
    return    this.estado === ESTADO_ANTICIPO.PENDIENTE   ? "Pendiente"
            : this.estado === ESTADO_ANTICIPO.VERIFICADO  ? "Verificado"
            : this.estado === ESTADO_ANTICIPO.ANULADO     ? "Anulado"
            : ""
  } */
  get estadoColor(){
    return    this.estado === ESTADO_ANTICIPO.PENDIENTE   ? "orange"
            : this.estado === ESTADO_ANTICIPO.VERIFICADO  ? "green-14"
            : this.estado === ESTADO_ANTICIPO.ANULADO     ? "red-14"
            : this.estado === ESTADO_ANTICIPO.CREDITO     ? "blue-9"
            : ""
  }
  get estadoIcono(){
    return    this.estado === ESTADO_ANTICIPO.PENDIENTE   ? "mdi-hand-right"
            : this.estado === ESTADO_ANTICIPO.VERIFICADO  ? "mdi-check-bold"
            : this.estado === ESTADO_ANTICIPO.ANULADO     ? "mdi-close-circle"
            : this.estado === ESTADO_ANTICIPO.CREDITO     ? "mdi-calendar-month"
            : ""
  }

/*   get tipoLabel(){
    return    this.tipo   === TIPO_ANTICIPO.PAGO          ? "Pago"
            : this.tipo   === TIPO_ANTICIPO.DEVOLUCION    ? "Devolución"
            : "" 
  }
*/

  get anticipoToApi() : any {
    const anti = {
      id                : this.id,
      fecha_pago        : this.fechaPagoString,
      cuenta_id         : this.cuenta.id,
      pedido_id         : this.pedidoId,
      valor             : this.valor,
      nota              : this.nota,
      tipo_pago         : this.tipoSelect.value,
      estado            : this.estadoSelect.value,
      filename_interno  : this.fileInterno.name   ?? "",
      filename_cliente  : this.fileCliente.name   ?? "",
    }
    return anti
  }
  
  get fechaPagoString() {
    return typeof this.fechaPago === "string" ? this.fechaPago : fechaCorta( new Date( this.fechaPago ) )
  } 

  static async anticipoApiToAnticipo( antApi : any  ) : Promise<IAnticipo>
  {
    antApi.id                 = +antApi.id
    antApi.cuentaId           = +antApi.cuentaId
    antApi.pedidoId           = +antApi.pedidoId
    antApi.valor              = +antApi.valor
    antApi.verificadorId      = +antApi.verificadorId
    antApi.tipo               = +antApi.tipo
    antApi.estado             = +antApi.estado
    
    const anti                = Object.assign( new Anticipo(), antApi ) as IAnticipo
    anti.cuenta               = await getCuentasDineroDB( antApi.cuentaId )
    if(!!antApi.verificadorId)
      anti.verificador        = await getUsuarioDB( antApi.verificadorId )

    anti.tipoSelect           = Anticipo.tipos  .find( ( t ) => t.value === anti.tipo )
    anti.estadoSelect         = Anticipo.estados.find( ( e ) => e.value === anti.estado )    
    return anti
  }

  static estados = [
    {label: ESTADO_ANTICIPO_LABEL.PENDIENTE,  value: ESTADO_ANTICIPO.PENDIENTE },
    {label: ESTADO_ANTICIPO_LABEL.VERIFICADO, value: ESTADO_ANTICIPO.VERIFICADO },
    {label: ESTADO_ANTICIPO_LABEL.CREDITO,    value: ESTADO_ANTICIPO.CREDITO },
    {label: ESTADO_ANTICIPO_LABEL.ANULADO,    value: ESTADO_ANTICIPO.ANULADO },
  ]
  
  static tipos = [
    {label: TIPO_ANTICIPO_LABEL.PAGO,         value: TIPO_ANTICIPO.PAGO },
    {label: TIPO_ANTICIPO_LABEL.DEVOLUCION,   value: TIPO_ANTICIPO.DEVOLUCION },
  ]
}