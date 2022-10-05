
import {  boot                } from 'quasar/wrappers'
import    Dexie                 from 'dexie';
import {  TABLAS,ITabla       } from "src/services/useDexie"
import {  IMunicipio,         Municipio         } from "src/models/Municipio"
import {  IUsuario,           Usuario           } from "src/areas/usuarios/models/Usuario"
import {  ITipoDocumento,     TipoDocumento     } from "src/areas/terceros/models/TiposDocumento"
import {  ICondicionPago,     CondicionPago     } from "src/models/Diccionarios/CondicionPago"
import {  IFormaPago,         FormaPago         } from "src/models/Diccionarios/FormaPago"
import {  IMetodoEntrega,     MetodoEntrega     } from "src/models/Diccionarios/MetodoEntrega"
import {  IOrigenContacto,    OrigenContacto    } from "src/models/Diccionarios/OrigenContacto"
import {  IUnidad,            Unidad            } from "src/models/Diccionarios/Unidad"
import {  ITiempoEntrega,     TiempoEntrega     } from "src/models/Diccionarios/TiempoEntrega"
import {  ITipoContacto,      TipoContacto      } from "src/models/Diccionarios/TipoContacto"
import {  IConstante,         Constante         } from "src/models/Diccionarios/Constante"
import {  IProductoCategoria, ProductoCategoria } from "src/areas/productos/models/ProductoCategoria"

export class DBSimpleOk extends Dexie
{
  [TABLAS.MUNICIPIOS]!:       Dexie.Table< IMunicipio,        number >
  [TABLAS.USUARIOS]!:         Dexie.Table< IUsuario,          number >
  [TABLAS.TIPOS_DOCUMENTOS]!: Dexie.Table< ITipoDocumento,    number >
  [TABLAS.CONDICION_PAGO]!:   Dexie.Table< ICondicionPago,    number >
  [TABLAS.FORMA_PAGO]!:       Dexie.Table< IFormaPago,        number >
  [TABLAS.METODO_ENTREGA]!:   Dexie.Table< IMetodoEntrega,    number >
  [TABLAS.ORIGEN_CONTACTO]!:  Dexie.Table< IOrigenContacto,   number >
  [TABLAS.UNIDAD]!:           Dexie.Table< IUnidad,           number >
  [TABLAS.TIEMPO_ENTREGA]!:   Dexie.Table< ITiempoEntrega,    number >
  [TABLAS.TIPO_CONTACTO]!:    Dexie.Table< ITipoContacto,     number >
  [TABLAS.PRODUCTO_CATE]!:    Dexie.Table< IProductoCategoria,number >
  [TABLAS.CONSTANTE]!:        Dexie.Table< IConstante,        number >

  constructor()
  {  
    super(process.env.PREFIJO + "DBSimpleOk")

    this.version(1).stores(
    {
      [TABLAS.MUNICIPIOS]:        "++id, municipio, departamento, departamentoSigla, departamentoId, indicativo",
      [TABLAS.USUARIOS]:          "++id, nombre, apellido, puesto, foto, tipo, area, estado, gruposString, terceroIdCtz, cel, correo",
      [TABLAS.TIPOS_DOCUMENTOS]:  "++id, codigo, nombre",
      [TABLAS.CONDICION_PAGO]:    "++id, label, descripcion, dias",
      [TABLAS.FORMA_PAGO]:        "++id, label",
      [TABLAS.METODO_ENTREGA]:    "++id, label",
      [TABLAS.ORIGEN_CONTACTO]:   "++id, label",
      [TABLAS.UNIDAD]:            "++id, nombre, codigo, tipo, orden",
      [TABLAS.TIEMPO_ENTREGA]:    "++id, label, codigo",
      [TABLAS.TIPO_CONTACTO]:     "++id, codigo, tipo,  origen",
      [TABLAS.PRODUCTO_CATE]:     "++id, nombre, sigla, grupo",
      [TABLAS.CONSTANTE]:         "++id, label, value",
    })

    this[TABLAS.MUNICIPIOS]       = this.table( TABLAS.MUNICIPIOS )
    this[TABLAS.MUNICIPIOS]       .mapToClass( Municipio )

    this[TABLAS.USUARIOS]         = this.table( TABLAS.USUARIOS )
    this[TABLAS.USUARIOS]         .mapToClass( Usuario )

    this[TABLAS.TIPOS_DOCUMENTOS] = this.table( TABLAS.TIPOS_DOCUMENTOS )
    this[TABLAS.TIPOS_DOCUMENTOS] .mapToClass( TipoDocumento )

    this[TABLAS.CONDICION_PAGO]   = this.table( TABLAS.CONDICION_PAGO )
    this[TABLAS.CONDICION_PAGO]   .mapToClass( CondicionPago )
    
    this[TABLAS.FORMA_PAGO]       = this.table( TABLAS.FORMA_PAGO )
    this[TABLAS.FORMA_PAGO]       .mapToClass( FormaPago )
    
    this[TABLAS.METODO_ENTREGA]   = this.table( TABLAS.METODO_ENTREGA )
    this[TABLAS.METODO_ENTREGA]   .mapToClass( MetodoEntrega )
    
    this[TABLAS.ORIGEN_CONTACTO]  = this.table( TABLAS.ORIGEN_CONTACTO )
    this[TABLAS.ORIGEN_CONTACTO]  .mapToClass( OrigenContacto )
    
    this[TABLAS.UNIDAD]           = this.table( TABLAS.UNIDAD )
    this[TABLAS.UNIDAD]           .mapToClass( Unidad )

    this[TABLAS.TIEMPO_ENTREGA]   = this.table( TABLAS.TIEMPO_ENTREGA )
    this[TABLAS.TIEMPO_ENTREGA]   .mapToClass( TiempoEntrega )

    this[TABLAS.TIPO_CONTACTO]    = this.table( TABLAS.TIPO_CONTACTO )
    this[TABLAS.TIPO_CONTACTO]    .mapToClass( TipoContacto )

    this[TABLAS.PRODUCTO_CATE]    = this.table( TABLAS.PRODUCTO_CATE )
    this[TABLAS.PRODUCTO_CATE]    .mapToClass( ProductoCategoria )

    this[TABLAS.CONSTANTE]        = this.table( TABLAS.CONSTANTE )
    this[TABLAS.CONSTANTE]        .mapToClass( Constante )
  }
}

const db                          = new DBSimpleOk()

export default boot(async ({ app /*, router, store*/ }) => {
    app.config.globalProperties.$db = db
})

export { db }