
import {  boot                } from 'quasar/wrappers'
import    Dexie                 from 'dexie';
//import {  TABLAS              } from "src/composables/useDexie"
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
import {  IProveedor,         Proveedor         } from "src/models/Diccionarios/Proveedor"
import {  ICuentaDinero,      CuentaDinero      } from "src/models/Diccionarios/CuentaDinero"
import {  IReglaComision,     ReglaComision     } from "src/models/Diccionarios/ReglasComision"
import {  ICategoriaProducto, CategoriaProducto } from "src/areas/productos/models/CategoriaProducto"
import {  ICategoriaGrupo,    CategoriaGrupo    } from "src/areas/productos/models/CategoriaGrupo"
import {  IBodega,            Bodega            } from "src/models/Diccionarios/Bodega"
import {  INaturalezaProducto,NaturalezaProducto} from "src/models/Diccionarios/NaturalezaProducto"

//* ///////////////////////////////////////////////////////////// 
export enum TABLAS
{
  MUNICIPIOS                  = "municipios",
  USUARIOS                    = "usuarios",
  TIPOS_DOCUMENTOS            = "tipoDocumento",
  CONDICION_PAGO              = "condicionPago",
  FORMA_PAGO                  = "formaPago",
  METODO_ENTREGA              = "metodoEntrega",
  ORIGEN_CONTACTO             = "origenContacto",
  UNIDAD                      = "unidad",
  TIEMPO_ENTREGA              = "tiempoEntrega",
  TIPO_CONTACTO               = "tipoContacto",
  CATEGORIA_PRODUCTO          = "productoCategoria",
  CATEGORIA_GRUPO             = "grupoCategoria",
  CONSTANTE                   = "constantes",
  PROVEEDORES                 = "proveedores",
  CUENTA_DINERO               = "cuentasDinero",
  REGLA_COMISION              = "reglasComision",
  BODEGA                      = "bodegas",
  NATURALEZA_PRODUCTO         = "naturaleza",
}

const cosa = TABLAS
export class DBSimpleOk extends Dexie
{
  [TABLAS.USUARIOS]             !: Dexie.Table< IUsuario,             number >
  [TABLAS.MUNICIPIOS]           !: Dexie.Table< IMunicipio,           number >
  [TABLAS.TIPOS_DOCUMENTOS]     !: Dexie.Table< ITipoDocumento,       number >
  [TABLAS.CONDICION_PAGO]       !: Dexie.Table< ICondicionPago,       number >
  [TABLAS.FORMA_PAGO]           !: Dexie.Table< IFormaPago,           number >
  [TABLAS.METODO_ENTREGA]       !: Dexie.Table< IMetodoEntrega,       number >
  [TABLAS.ORIGEN_CONTACTO]      !: Dexie.Table< IOrigenContacto,      number >
  [TABLAS.UNIDAD]               !: Dexie.Table< IUnidad,              number >
  [TABLAS.TIEMPO_ENTREGA]       !: Dexie.Table< ITiempoEntrega,       number >
  [TABLAS.TIPO_CONTACTO]        !: Dexie.Table< ITipoContacto,        number >
  [TABLAS.CATEGORIA_PRODUCTO]   !: Dexie.Table< ICategoriaProducto,   number >
  [TABLAS.CATEGORIA_GRUPO]      !: Dexie.Table< ICategoriaGrupo,      number >
  [TABLAS.CONSTANTE]            !: Dexie.Table< IConstante,           number >
  [TABLAS.PROVEEDORES]          !: Dexie.Table< IProveedor,           number >
  [TABLAS.CUENTA_DINERO]        !: Dexie.Table< ICuentaDinero,        number >
  [TABLAS.REGLA_COMISION]       !: Dexie.Table< IReglaComision,       number >
  [TABLAS.BODEGA]               !: Dexie.Table< IBodega,              number >
  [TABLAS.NATURALEZA_PRODUCTO]  !: Dexie.Table< INaturalezaProducto,  number >

  constructor()
  {
    super(process.env.PREFIJO + "DBSimpleOk")

    this.version(3.4).stores(
    {
      [TABLAS.MUNICIPIOS]         : "++id, municipio, departamento, departamentoSigla, departamentoId, indicativo, codigoDian",
      [TABLAS.USUARIOS]           : "++id, nombre, apellido, puesto, foto, tipo, area, estado, gruposString, gruposIds, terceroIdCtz, cel, correo, reglaComisionId, color",
      [TABLAS.TIPOS_DOCUMENTOS]   : "++id, codigo, nombre",
      [TABLAS.CONDICION_PAGO]     : "++id, label, descripcion, dias",
      [TABLAS.FORMA_PAGO]         : "++id, label",
      [TABLAS.METODO_ENTREGA]     : "++id, label",
      [TABLAS.ORIGEN_CONTACTO]    : "++id, label",
      [TABLAS.UNIDAD]             : "++id, nombre, codigo, sigla, tipo, orden",
      [TABLAS.TIEMPO_ENTREGA]     : "++id, label, codigo",
      [TABLAS.TIPO_CONTACTO]      : "++id, codigo, tipo,  origen",
      [TABLAS.CATEGORIA_PRODUCTO] : "++id, nombre, sigla, grupo, modificadorComision, codigoVenta, codigoCompra, grupoId",
      [TABLAS.CATEGORIA_GRUPO]    : "++id, nombre, codigo",
      [TABLAS.CONSTANTE]          : "++id, label, value",
      [TABLAS.PROVEEDORES]        : "++id, nombre, alias, codigo",
      [TABLAS.CUENTA_DINERO]      : "++id, ref, label, tipoId, logoUrl, virtual",
      [TABLAS.REGLA_COMISION]     : "++id, nombre, descripcion, alfa, a, b, c, d, e",
      [TABLAS.BODEGA]             : "++id, ref, nombre, estado, padre_id, proyecto_id, descripcion, direccion, area",
      [TABLAS.NATURALEZA_PRODUCTO]: "++id, nombre, codigo",
    })

    this[TABLAS.MUNICIPIOS]         = this.table( TABLAS.MUNICIPIOS )
    this[TABLAS.MUNICIPIOS]         .mapToClass( Municipio )

    this[TABLAS.USUARIOS]           = this.table( TABLAS.USUARIOS )
    this[TABLAS.USUARIOS]           .mapToClass( Usuario )

    this[TABLAS.TIPOS_DOCUMENTOS]   = this.table( TABLAS.TIPOS_DOCUMENTOS )
    this[TABLAS.TIPOS_DOCUMENTOS]   .mapToClass( TipoDocumento )

    this[TABLAS.CONDICION_PAGO]     = this.table( TABLAS.CONDICION_PAGO )
    this[TABLAS.CONDICION_PAGO]     .mapToClass( CondicionPago )

    this[TABLAS.FORMA_PAGO]         = this.table( TABLAS.FORMA_PAGO )
    this[TABLAS.FORMA_PAGO]         .mapToClass( FormaPago )

    this[TABLAS.METODO_ENTREGA]     = this.table( TABLAS.METODO_ENTREGA )
    this[TABLAS.METODO_ENTREGA]     .mapToClass( MetodoEntrega )

    this[TABLAS.ORIGEN_CONTACTO]    = this.table( TABLAS.ORIGEN_CONTACTO )
    this[TABLAS.ORIGEN_CONTACTO]    .mapToClass( OrigenContacto )

    this[TABLAS.UNIDAD]             = this.table( TABLAS.UNIDAD )
    this[TABLAS.UNIDAD]             .mapToClass( Unidad )
    
    this[TABLAS.TIEMPO_ENTREGA]     = this.table( TABLAS.TIEMPO_ENTREGA )
    this[TABLAS.TIEMPO_ENTREGA]     .mapToClass( TiempoEntrega )

    this[TABLAS.TIPO_CONTACTO]      = this.table( TABLAS.TIPO_CONTACTO )
    this[TABLAS.TIPO_CONTACTO]      .mapToClass( TipoContacto )

    this[TABLAS.CATEGORIA_PRODUCTO] = this.table( TABLAS.CATEGORIA_PRODUCTO )
    this[TABLAS.CATEGORIA_PRODUCTO] .mapToClass( CategoriaProducto )

    this[TABLAS.CATEGORIA_GRUPO]    = this.table( TABLAS.CATEGORIA_GRUPO )
    this[TABLAS.CATEGORIA_GRUPO]    .mapToClass( CategoriaGrupo )

    this[TABLAS.CONSTANTE]          = this.table( TABLAS.CONSTANTE )
    this[TABLAS.CONSTANTE]          .mapToClass( Constante )

    this[TABLAS.PROVEEDORES]        = this.table( TABLAS.PROVEEDORES )
    this[TABLAS.PROVEEDORES]        .mapToClass( Proveedor )

    this[TABLAS.CUENTA_DINERO]      = this.table( TABLAS.CUENTA_DINERO )
    this[TABLAS.CUENTA_DINERO]      .mapToClass( CuentaDinero )

    this[TABLAS.REGLA_COMISION]     = this.table( TABLAS.REGLA_COMISION )
    this[TABLAS.REGLA_COMISION]     .mapToClass( ReglaComision )

    this[TABLAS.BODEGA]             = this.table( TABLAS.BODEGA )
    this[TABLAS.BODEGA]             .mapToClass( Bodega )

    this[TABLAS.NATURALEZA_PRODUCTO]= this.table( TABLAS.NATURALEZA_PRODUCTO )
    this[TABLAS.NATURALEZA_PRODUCTO].mapToClass( NaturalezaProducto )    
  }
}

const db                          = new DBSimpleOk()

export default boot(async ({ app /*, router, store*/ }) => {
    app.config.globalProperties.$db = db
})

export { db }