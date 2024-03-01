import {
          ref,
          Ref,
          onMounted,
          onUnmounted
                            } from 'vue'
import {  db, TABLAS        } from "src/boot/dexie"
import {  useStoreApp       } from 'src/stores/app'
import {  ALMACEN_LOCAL     } from "src/models/TiposVarios"
import {  LocalStorage      } from 'quasar'
import {  Tool              } from "src/composables/useTools"

import {  IMunicipio,         Municipio         } from "src/models/Municipio"
import {  Usuario,            IUsuario          } from "src/areas/usuarios/models/Usuario"
import {  ITipoDocumento,     TipoDocumento     } from "src/areas/terceros/models/TiposDocumento"
import {  ICondicionPago,     CondicionPago     } from "src/models/Diccionarios/CondicionPago"
import {  IFormaPago,         FormaPago         } from "src/models/Diccionarios/FormaPago"
import {  IMetodoEntrega,     MetodoEntrega     } from "src/models/Diccionarios/MetodoEntrega"
import {  IOrigenContacto,    OrigenContacto    } from "src/models/Diccionarios/OrigenContacto"
import {  IUnidad,            Unidad            } from "src/models/Diccionarios/Unidad"
import {  ITiempoEntrega,     TiempoEntrega     } from "src/models/Diccionarios/TiempoEntrega"
import {  ITipoContacto,      TipoContacto      } from "src/models/Diccionarios/TipoContacto"
import {  ICategoriaProducto, CategoriaProducto } from "src/areas/productos/models/CategoriaProducto"
import {  ICategoriaGrupo,    CategoriaGrupo    } from "src/areas/productos/models/CategoriaGrupo"
import {  IConstante,         Constante         } from "src/models/Diccionarios/Constante"
import {  IProveedor,         Proveedor         } from "src/models/Diccionarios/Proveedor"
import {  ICuentaDinero,      CuentaDinero      } from "src/models/Diccionarios/CuentaDinero"
import {  IReglaComision,     ReglaComision     } from "src/models/Diccionarios/ReglasComision"
import {  IBodega,            Bodega            } from "src/models/Diccionarios/Bodega"
import {  INaturalezaProducto,NaturalezaProducto} from "src/models/Diccionarios/NaturalezaProducto"
import {  storeToRefs                           } from 'pinia'



export type ITabla            = IMunicipio      | IUsuario        | ITipoDocumento      | ICondicionPago | IReglaComision | IProveedor    |
                                IFormaPago      | IMetodoEntrega  | IOrigenContacto     | IUnidad        | ICuentaDinero  | IBodega       |
                                ITiempoEntrega  | ITipoContacto   | ICategoriaProducto  | ICategoriaGrupo| IConstante     | INaturalezaProducto

const pre                     = process.env.PREFIJO

//const db      =  new DBSimpleOk()

export function cargarListasIndex() {
  dexieUsuarios   ({ cargarSiempre : true})
  dexieConstantes ({ cargarSiempre : true})
  dexieProveedores({ cargarSiempre : true})

  const check                     = checkListasVencidas()
  if(check)
  {
    const param                   = { demora: 5_000, cargarSiempre : true }
    /* municipios                    = */ dexieMunicipios         (param)
    /* condicionesPago               = */ dexieCondicionesPago    (param)
    /* formasPago                    = */ dexieFormasPago         (param)
    /* metodosEntrega                = */ dexieMetodosEntrega     (param)
    /* tiemposEntrega                = */ dexieTiemposEntrega     (param)
    /* tiposContacto                 = */ dexieTiposContacto      (param)
    /* origenesContacto              = */ dexieOrigenesContacto   (param)
    /* tiposDocumentos               = */ dexieTiposDocumentos    (param)
    /* unidades                      = */ dexieUnidades           (param)
                                          dexieCuentasDinero      (param)
                                          dexieReglaComision      (param)
                                          dexieBodegas            (param)
                                          dexieNaturaleza         (param)
                                          dexieCategoriasProducto (param)
                                          dexieCategoriasGrupo    (param)
  }
}

interface IParametros         { cargarSiempre?:  boolean , demora?:         number }

const paramDefault : IParametros = { cargarSiempre : false, demora : 0 }

//* ///////////////////////////////////////////////////////////// Usuarios
export function dexieUsuarios         ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< IUsuario[] > {
  const { lista : usuarios  }  = useDexie( TABLAS.USUARIOS,        { cargarSiempre, demora } )
  return usuarios as Ref< IUsuario[] >
}

//* ///////////////////////////////////////////////////////////// Municipios
export function dexieMunicipios       ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< IMunicipio[] > {
  const { lista } = useDexie( TABLAS.MUNICIPIOS, { cargarSiempre, demora } )
  return lista as Ref< IMunicipio[] >
}

//* ///////////////////////////////////////////////////////////// Condicios de pago
export function dexieCondicionesPago  ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< ICondicionPago[] > {
  const { lista } = useDexie( TABLAS.CONDICION_PAGO, { cargarSiempre, demora } )
  return lista as Ref< ICondicionPago[] >
}

//* ///////////////////////////////////////////////////////////// Formas de pago
export function dexieFormasPago       ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< IFormaPago[] > {
  const { lista } = useDexie( TABLAS.FORMA_PAGO, { cargarSiempre, demora } )
  return lista as Ref< IFormaPago[] >
}

//* ///////////////////////////////////////////////////////////// Metodos de entrega
export function dexieMetodosEntrega   ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< IMetodoEntrega[] > {
  const { lista } = useDexie( TABLAS.METODO_ENTREGA, { cargarSiempre, demora } )
  return lista as Ref< IMetodoEntrega[] >
}

//* ///////////////////////////////////////////////////////////// Tiempos de entrega
export function dexieTiemposEntrega   ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< ITiempoEntrega[] > {
  const { lista } = useDexie( TABLAS.TIEMPO_ENTREGA, { cargarSiempre, demora } )
  return lista as Ref< ITiempoEntrega[] >
}

//* ///////////////////////////////////////////////////////////// Tipos de contacto
export function dexieTiposContacto    ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< ITipoContacto[] > {
  const { lista } = useDexie( TABLAS.TIPO_CONTACTO, { cargarSiempre, demora } )
  return lista as Ref< ITipoContacto[] >
}

//* ///////////////////////////////////////////////////////////// Origenes de contacto
export function dexieOrigenesContacto ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< IOrigenContacto[] > {
  const { lista } = useDexie( TABLAS.ORIGEN_CONTACTO, { cargarSiempre, demora } )
  return lista as Ref< IOrigenContacto[] >
}

//* ///////////////////////////////////////////////////////////// Tipos de documentos
export function dexieTiposDocumentos  ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< ITipoDocumento[] > {
  const { lista } = useDexie( TABLAS.TIPOS_DOCUMENTOS, { cargarSiempre, demora } )
  return lista as Ref< ITipoDocumento[] >
}

//* ///////////////////////////////////////////////////////////// Unidades
export function dexieUnidades         ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< IUnidad[] > {
  const { lista } = useDexie( TABLAS.UNIDAD, { cargarSiempre, demora } )
  return lista as Ref< IUnidad[] >
}

//* ///////////////////////////////////////////////////////////// Categorias de productos
export function dexieCategoriasProducto( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< ICategoriaProducto[] > {
  const { lista } = useDexie( TABLAS.CATEGORIA_PRODUCTO, { cargarSiempre, demora } )
  return lista as Ref< ICategoriaProducto[] >
}

//* ///////////////////////////////////////////////////////////// Categorias de productos
export function dexieCategoriasGrupo( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< ICategoriaGrupo[] > {
  const { lista } = useDexie( TABLAS.CATEGORIA_GRUPO, { cargarSiempre, demora } )
  return lista as Ref< ICategoriaGrupo[] >
}

//* ///////////////////////////////////////////////////////////// Unidades
export function dexieConstantes         ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< IConstante[] > {
  const { lista } = useDexie( TABLAS.CONSTANTE, { cargarSiempre, demora } )
  return lista as Ref< IConstante[] >
}

//* ///////////////////////////////////////////////////////////// Proveedores
export function dexieProveedores        ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< IProveedor[] > {
  const { lista } = useDexie( TABLAS.PROVEEDORES, { cargarSiempre, demora } )
  return lista as Ref< IProveedor[] >
}

//* ///////////////////////////////////////////////////////////// Unidades
export function dexieCuentasDinero      ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< ICuentaDinero[] > {
  const { lista } = useDexie( TABLAS.CUENTA_DINERO, { cargarSiempre, demora } )
  return lista as Ref< ICuentaDinero[] >
}

//* ///////////////////////////////////////////////////////////// Reglas comision
export function dexieReglaComision ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< IReglaComision[] > {  
  const { lista } = useDexie( TABLAS.REGLA_COMISION, { cargarSiempre, demora } )
  return lista as Ref< IReglaComision[] >
}

//* ///////////////////////////////////////////////////////////// Bodegas
export function dexieBodegas ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< IBodega[] > {
  const { lista } = useDexie( TABLAS.BODEGA, { cargarSiempre, demora } )
  return lista as Ref< IBodega[] >
}

//* ///////////////////////////////////////////////////////////// Tipos productos
export function dexieNaturaleza ( { cargarSiempre = false, demora = 0 } = paramDefault ) :Ref< INaturalezaProducto[] > {
  const { lista } = useDexie( TABLAS.NATURALEZA_PRODUCTO, { cargarSiempre, demora } )
  return lista as Ref< INaturalezaProducto[] >
}

function useDexie( tabla : TABLAS, { cargarSiempre = false, demora = 0 } = paramDefault )
{
  const{ online }             = storeToRefs( useStoreApp() )
  const lista                     = ref< Array < any > >( [] )

  //* ///////////////////////////////////////////////////////////////////////// On Mounted
  onMounted( motorTabla )

  onUnmounted( ()=> lista.value = [] )

  async function motorTabla()
  {
    await Tool.pausa( demora )
    const largoDBTabla             = await db[ tabla ].count()

    if(largoDBTabla               == 0 && online.value )
    {
      await pedirYguardarTabla()
      await cargarTablaDBLocal()
    }
    else
    {
      await cargarTablaDBLocal()
      if(online.value)
      {
        let DBsIguales            = true

        if(!cargarSiempre){
          DBsIguales              = await DBLocalEsIgualADBHosting( largoDBTabla )
        }

        if( !DBsIguales || cargarSiempre )
        {
          await pedirYguardarTabla()
          await cargarTablaDBLocal()
        }
      }
    }
  }

  async function cargarTablaDBLocal()
  {
    lista.value                   = await getDatosDBToArray()
  }

  async function getDatosDBToArray() : Promise < ITabla[] >
  {
    return new Promise( async (resolve, reject) => {
      const arrayResultado      = await db[ tabla ].toArray()
      resolve( arrayResultado) 
      
    })

    /* return db.transaction('r', db[ tabla ], async () =>
      {
        const arrayResultado      = await db[ tabla ].toArray()
        return arrayResultado
      }
    ) */
  }

  async function DBLocalEsIgualADBHosting( largoLocal : number ) : Promise < boolean >
  {
    return new Promise( async (resolver, rechazar) =>
    {
      const totalEnCloud          = await countEnCloud( tabla )
      resolver( totalEnCloud      == largoLocal )
    })
  }

  async function pedirYguardarTabla()
  {
    const   miBody                = new FormData()
            miBody.append("tipo", tabla )
    const   url                   = process.env.URL_WEBSERVICES + "/listas/diccionarios.php"

    try
    {
        const resultado           = await fetch( url, { method: 'POST', body:   miBody })
        const resultadoJson       = await resultado.json()
        const listaCarga  :any    = []

        if(!!resultadoJson)
        {
          for( const item of resultadoJson )
          {
            if
            (
              !item
              ||
              !item.hasOwnProperty( "id" )
            ) continue


            item.id               = parseInt( item.id )

            listaCarga.push( item )
          }

          db.transaction('rw', db[ tabla ], async() =>
            {
              try
              {
                await db[ tabla ].clear()

                switch ( tabla )
                {
                  case TABLAS.MUNICIPIOS :
                    await db[ TABLAS.MUNICIPIOS         ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.USUARIOS :
                    await db[ TABLAS.USUARIOS           ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.TIPOS_DOCUMENTOS :
                    await db[ TABLAS.TIPOS_DOCUMENTOS   ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.CONDICION_PAGO :
                    await db[ TABLAS.CONDICION_PAGO     ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.FORMA_PAGO :
                    await db[ TABLAS.FORMA_PAGO         ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.METODO_ENTREGA :
                    await db[ TABLAS.METODO_ENTREGA     ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.ORIGEN_CONTACTO :
                    await db[ TABLAS.ORIGEN_CONTACTO    ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.UNIDAD :
                    await db[ TABLAS.UNIDAD             ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.TIEMPO_ENTREGA :
                    await db[ TABLAS.TIEMPO_ENTREGA     ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.TIPO_CONTACTO :
                    await db[ TABLAS.TIPO_CONTACTO      ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.CATEGORIA_PRODUCTO :
                    await db[ TABLAS.CATEGORIA_PRODUCTO ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.CATEGORIA_GRUPO :
                    await db[ TABLAS.CATEGORIA_GRUPO    ].bulkAdd( listaCarga )
                    break;                    
                  case TABLAS.CONSTANTE :
                    await db[ TABLAS.CONSTANTE          ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.PROVEEDORES :
                    await db[ TABLAS.PROVEEDORES        ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.CUENTA_DINERO :
                    await db[ TABLAS.CUENTA_DINERO      ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.REGLA_COMISION :
                    await db[ TABLAS.REGLA_COMISION     ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.BODEGA :
                    await db[ TABLAS.BODEGA             ].bulkAdd( listaCarga )
                    break;
                  case TABLAS.NATURALEZA_PRODUCTO :
                    await db[ TABLAS.NATURALEZA_PRODUCTO].bulkAdd( listaCarga )
                    break;
                  default:
                    break;
                }
                //let nuevoLargo    = await db[ tabla ].count()
              }
              catch(error){
                return -1
              }
            }
          )
        }
        else
        {
        }

    } catch(e) {
    }
  }

  async function countEnCloud( tipo : string ) : Promise < number >
  {
    return new Promise( async (resolve, reject) =>
    {
      const miBody                = new FormData()
            miBody.append("tipo", tipo)
      const url                   = process.env.URL_WEBSERVICES + "/listas/diccionarios-count.php"

      try{
        const resultado           = await fetch( url, { method: 'POST', body: miBody })
        const total               = await resultado.text()

        if(!!total)
        {
          resolve( parseInt ( total ) )
        }
      } catch(e) {
        resolve(0)
      }
    })
  }

  return {
    lista,
  }
}

export async function getMunicipioDB( id : number ) : Promise < IMunicipio >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.MUNICIPIOS ], async () =>
    {
      const municipio        = await db[ TABLAS.MUNICIPIOS ].where("id").equals( id ).toArray()
      if(municipio.length   == 1)
        return municipio[0]
      else
        return new Municipio()
    }
  )
}

export async function getCategoriaDB( sigla : string ) : Promise < ICategoriaProducto >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.CATEGORIA_PRODUCTO ], async () =>
    {
      const catego          = await db[ TABLAS.CATEGORIA_PRODUCTO ].where("sigla").equals( sigla ).toArray()
      if(catego.length      == 1)
      {
        // TODO
        catego[0].modificadorComision = +catego[0].modificadorComision
        catego[0].codigoCompra        = +catego[0].codigoCompra
        catego[0].codigoVenta         = +catego[0].codigoVenta
        catego[0].grupoId             = +catego[0].grupoId
        return catego[0]
      }
      else
        return new CategoriaProducto()
    }
  )
}

/* export async function getCategoriaGrupoDB( sigla : string ) : Promise < ICategoriaGrupo >
{
  return db.transaction('r', db[ TABLAS.CATEGORIA_GRUPO ], async () =>
    {
      const catego          = await db[ TABLAS.CATEGORIA_GRUPO ].where("sigla").equals( sigla ).toArray()
      if(catego.length      == 1)
      {
        // TODO
        catego[0].modificadorComision = +catego[0].modificadorComision
        catego[0].codigoCompra        = +catego[0].codigoCompra
        catego[0].codigoVenta         = +catego[0].codigoVenta
        return catego[0]
      }
      else
        return new CategoriaGrupo()
    }
  )
} */

export async function getTipoDocumentoDB( id : number ) : Promise < ITipoDocumento >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.TIPOS_DOCUMENTOS ], async () =>
    {
      const tipo            = await db[ TABLAS.TIPOS_DOCUMENTOS ].where("id").equals(id).toArray()
      if(tipo.length        == 1)
        return tipo[0]
      else
        return new TipoDocumento()
    }
  )
}

export async function getUsuariosDB( ids : number[] ) : Promise < IUsuario[] >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.USUARIOS ], async () =>
    {
      const usuarios        = await db[ TABLAS.USUARIOS ].where("id").anyOf( ...ids ).toArray()
      if(usuarios.length    > 0)
        return usuarios
      else
        return []
    }
  )
}

export async function getUsuariosByGrupoDB( grupo : string ) : Promise < IUsuario[] >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.USUARIOS ], async () =>
    {
      const usuarios        = await db[ TABLAS.USUARIOS ].filter((u)=>u.gruposString.includes( grupo )).toArray()
      if(usuarios.length    > 0)
        return usuarios
      else
        return []
    }
  )
}

export async function getUsuarioDB( id : number ) : Promise < IUsuario >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.USUARIOS ], async () =>
    {
      const usuario         = await db[ TABLAS.USUARIOS ].where("id").equals(id).toArray()
      if(usuario.length     == 1){
        usuario[0].terceroIdCtz     = +usuario[0].terceroIdCtz
        usuario[0].reglaComisionId  = +usuario[0].reglaComisionId
        return usuario[0]
      }
      else
        return new Usuario()
    }
  )
}

export async function getCondicionDePagoDB( id : number ) : Promise < ICondicionPago >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.CONDICION_PAGO ], async () =>
    {
      const listaDB         = await db[ TABLAS.CONDICION_PAGO ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new CondicionPago()
    }
  )
}


export async function getCondicionesPagoDB() : Promise < ICondicionPago[] >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.CONDICION_PAGO ], async () => await db[ TABLAS.CONDICION_PAGO ].toArray()
  )
}

export async function getFormaDePagoDB( id : number ) : Promise < IFormaPago >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.FORMA_PAGO ], async () =>
    {
      const listaDB         = await db[ TABLAS.FORMA_PAGO ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new FormaPago()
    }
  )
}

export async function getFormasPagoDB() : Promise < IFormaPago[] >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.FORMA_PAGO ], async () => await db[ TABLAS.FORMA_PAGO ].toArray() )
}


export async function getMetodoDeEntregaDB( id : number ) : Promise < IMetodoEntrega >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.METODO_ENTREGA ], async () =>
    {
      const listaDB          = await db[ TABLAS.METODO_ENTREGA ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new MetodoEntrega()
    }
  )
}



export async function getMetodosEntregaDB() : Promise < IMetodoEntrega[] >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.METODO_ENTREGA ], async () => await db[ TABLAS.METODO_ENTREGA ].toArray())
}

export async function getOrigenContactoDB( id : number ) : Promise < IOrigenContacto >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.ORIGEN_CONTACTO ], async () =>
    {
      const listaDB          = await db[ TABLAS.ORIGEN_CONTACTO ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new OrigenContacto()
    }
  )
}

export async function getOrigenesContactoDB() : Promise < IOrigenContacto[] >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.ORIGEN_CONTACTO ], async () => await db[ TABLAS.ORIGEN_CONTACTO ].toArray() )
}


export async function getUnidadDB( id : number ) : Promise < IUnidad >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.UNIDAD ], async () =>
    {
      const listaDB          = await db[ TABLAS.UNIDAD ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new Unidad()
    }
  )
}

export async function getTiempoEntregaDB( id : number ) : Promise < ITiempoEntrega >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.TIEMPO_ENTREGA ], async () =>
    {
      const listaDB          = await db[ TABLAS.TIEMPO_ENTREGA ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new TiempoEntrega()
    }
  )
}

export async function getConstanteDB( label : string ) : Promise < IConstante >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.CONSTANTE ], async () =>
    {
      const listaDB          = await db[ TABLAS.CONSTANTE ].where("label").equals(label).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new Constante()
    }
  )
}

export async function getProveedorDB( id : number ) : Promise < IProveedor >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.PROVEEDORES ], async () =>
    {
      const listaDB          = await db[ TABLAS.PROVEEDORES ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new Proveedor()
    }
  )
}

export async function getProveedoresDB() : Promise < IProveedor[] >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.PROVEEDORES ], async () => await db[ TABLAS.PROVEEDORES ].toArray() )
}

export async function getCuentasDineroDB( id : number ) : Promise < ICuentaDinero >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.CUENTA_DINERO ], async () =>
    {
      const listaDB          = await db[ TABLAS.CUENTA_DINERO ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new CuentaDinero()
    }
  )
}
// TODO
export async function getReglaComisionDB( id : number ) : Promise < IReglaComision >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.REGLA_COMISION ], async () =>
    {
      const listaDB         = await db[ TABLAS.REGLA_COMISION ].where("id").equals( id ).toArray()
      if(listaDB.length     == 1)
      {
        //listaDB[0].id       = +listaDB[0].id
        const regla         = Object.assign( listaDB[0], {} )
        // TODO
        regla.id            = +regla.id
        return listaDB[0]
      }
      else
        return new ReglaComision()
    }
  )
}

export async function getBodegaDB( id : number ) : Promise < IBodega >
{
  // const{ db }               = storeToRefs( useStoreApp() )
  return db.transaction('r', db[ TABLAS.BODEGA ], async () =>
    {
      const listaDB         = await db[ TABLAS.BODEGA ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
      {
        listaDB[0].id           = +listaDB[0].id
        listaDB[0].activo       = Boolean( +listaDB[0].activo )
        listaDB[0].padre_id     = +listaDB[0].padre_id
        listaDB[0].proyecto_id  = +listaDB[0].proyecto_id

        return listaDB[0]
      }
      else
        return new Bodega()
    }
  )
}

export async function getNaturalezaDB( codigo : string ) : Promise < INaturalezaProducto >
{
  return db.transaction('r', db[ TABLAS.NATURALEZA_PRODUCTO ], async () =>
    {
      const listaDB         = await db[ TABLAS.NATURALEZA_PRODUCTO ].where("codigo").equals(codigo).toArray()
      if(listaDB.length     == 1)
      {
        listaDB[0].id           = +listaDB[0].id
        listaDB[0].codigo       = +listaDB[0].codigo

        return listaDB[0]
      }
      else
        return new NaturalezaProducto()
    }
  )
}


function checkListasVencidas() : boolean
{
  const TIEMPO_EXPIRAR  = 86_400_000 * 2 // ( 24 * 120)

  let fechaVencida      = false
  const lastFecha       = LocalStorage.getItem( pre + ALMACEN_LOCAL.FECHA_LISTAS ) as number

  if( !lastFecha )
    fechaVencida        = true
  else
  {
    const intervalo     = Date.now() - lastFecha
    if( intervalo       > TIEMPO_EXPIRAR )
      fechaVencida      = true
  }

  if(fechaVencida)
    LocalStorage.set( pre + ALMACEN_LOCAL.FECHA_LISTAS, Date.now() )

  return fechaVencida
}

function resolver(arg0: boolean) {
  throw new Error('Function not implemented.')
}


function largoDBTabla(largoDBTabla: any): boolean|PromiseLike<boolean> {
  throw new Error('Function not implemented.')
}

export async function limpiarDB() : Promise<void>
{
  // const{ db }               = storeToRefs( useStoreApp() )
  await db.delete()
}