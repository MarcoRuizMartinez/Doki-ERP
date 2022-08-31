import {    
          ref,
          computed,
          onMounted,
          onUnmounted
                            } from 'vue'
import {  db                } from "src/boot/dexie"
import {  useStoreApp       } from 'src/stores/app' 
import {  ALMACEN_LOCAL     } from "src/models/TiposVarios"  
import {  LocalStorage      } from 'quasar'  
import {  pausa             } from "src/useSimpleOk/useTools"

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
import {  IProductoCategoria, ProductoCategoria } from "src/areas/productos/models/ProductoCategoria"
import {  IConstante,         Constante         } from "src/models/Diccionarios/Constante"

//* ///////////////////////////////////////////////////////////// Tipos de documento

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
  PRODUCTO_CATE               = "productoCategoria",
  CONSTANTE                   = "constantes",
}

export type ITabla            = IMunicipio      | IUsuario        | ITipoDocumento      | ICondicionPago |
                                IFormaPago      | IMetodoEntrega  | IOrigenContacto     | IUnidad        |
                                ITiempoEntrega  | ITipoContacto   | IProductoCategoria  | IConstante


const pre                 = process.env.PREFIJO

interface parametros {
  cargarSiempre?:  boolean
  demora?:         number 
}

export function useDexie(
                          tabla : TABLAS,
                          {
                            cargarSiempre = false,
                            demora = 0
                          } : parametros = {
                                              cargarSiempre : false,
                                              demora : 0
                                            }
                        ) //
{
  const storeApp                  = useStoreApp()  
  const online                    = computed(() => storeApp.online)
  const lista                     = ref< Array < any > >( [] )
  
  //* ///////////////////////////////////////////////////////////////////////// On Mounted
  onMounted( motorTabla )

  onUnmounted( ()=> lista.value = [] )

  async function motorTabla()
  {
                                    await pausa( demora )
    let largoDBTabla              = await db[ tabla ].count()

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
    return db.transaction('r', db[ tabla ], async () =>
      {
        let arrayResultado        = await db[ tabla ].toArray() 
        return arrayResultado 
      }
    )
  }    

  async function DBLocalEsIgualADBHosting( largoLocal : number ) : Promise < boolean >
  {
    return new Promise( async (resolver, rechazar) =>
    {
      let totalEnCloud            = await countEnCloud( tabla )
      resolver( totalEnCloud      == largoLocal )
    })
  }

  async function pedirYguardarTabla()
  {
    let     miBody                = new FormData()
            miBody.append("tipo", tabla )
    const   url                   = process.env.URL_WEBSERVICES + "/listas/diccionarios.php"

    try
    {
        const resultado           = await fetch( url, { method: 'POST', body:   miBody })
        const resultadoJson       = await resultado.json()
        let   listaCarga  :any    = []

        if(!!resultadoJson)
        {
          for( let item of resultadoJson )
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
                  case TABLAS.PRODUCTO_CATE : 
                    await db[ TABLAS.PRODUCTO_CATE      ].bulkAdd( listaCarga )
                    break;            
                  case TABLAS.CONSTANTE : 
                    await db[ TABLAS.CONSTANTE          ].bulkAdd( listaCarga )
                    break;    
                  default:
                    break;
                }
                //let nuevoLargo    = await db[ tabla ].count()
              }
              catch(error){
                console.error(error)
                return -1
              } 
            } 
          )
        }
        else
        {
        }

    } catch(e) {
        console.error(e);
    }
  }

  async function countEnCloud( tipo : string ) : Promise < number >
  {
    return new Promise( async (resolve, reject) =>
    {
      let   miBody                = new FormData()
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
        console.error(e);
      }    
    })
  }

  return {
    lista,
  }
}

export async function getMunicipioDB( id : number ) : Promise < IMunicipio >
{
  return db.transaction('r', db[ TABLAS.MUNICIPIOS ], async () =>
    {
      let municipio         = await db[ TABLAS.MUNICIPIOS ].where("id").equals(id).toArray()
      if(municipio.length   == 1)
        return municipio[0]
      else
        return new Municipio()
    }
  )
}

export async function getTipoDocumentoDB( id : number ) : Promise < ITipoDocumento >
{ 
  return db.transaction('r', db[ TABLAS.TIPOS_DOCUMENTOS ], async () =>
    {
      let tipo              = await db[ TABLAS.TIPOS_DOCUMENTOS ].where("id").equals(id).toArray()
      if(tipo.length        == 1)
        return tipo[0]
      else
        return new TipoDocumento()
    }
  )
}

export async function getUsuariosDB( ids : number[] ) : Promise < IUsuario[] >
{ 
  return db.transaction('r', db[ TABLAS.USUARIOS ], async () =>
    {
      let usuarios          = await db[ TABLAS.USUARIOS ].where("id").anyOf( ...ids ).toArray()
      if(usuarios.length    > 0)
        return usuarios
      else
        return []
    }
  )
}

export async function getUsuarioDB( id : number ) : Promise < IUsuario >
{ 
  return db.transaction('r', db[ TABLAS.USUARIOS ], async () =>
    {
      let usuario           = await db[ TABLAS.USUARIOS ].where("id").equals(id).toArray()
      if(usuario.length     == 1){
        usuario[0].terceroIdCtz = +usuario[0].terceroIdCtz
        return usuario[0]
      }
      else
        return new Usuario()
    }
  )
}

export async function getCondicionesPagoDB( id : number ) : Promise < ICondicionPago >
{ 
  return db.transaction('r', db[ TABLAS.CONDICION_PAGO ], async () =>
    {
      let listaDB           = await db[ TABLAS.CONDICION_PAGO ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new CondicionPago()
    }
  )
}

export async function getFormasPagoDB( id : number ) : Promise < IFormaPago >
{ 
  return db.transaction('r', db[ TABLAS.FORMA_PAGO ], async () =>
    {
      let listaDB           = await db[ TABLAS.FORMA_PAGO ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new FormaPago()
    }
  )
}

export async function getMetodosEntregaDB( id : number ) : Promise < IMetodoEntrega >
{ 
  return db.transaction('r', db[ TABLAS.METODO_ENTREGA ], async () =>
    {
      let listaDB           = await db[ TABLAS.METODO_ENTREGA ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new MetodoEntrega()
    }
  )
}

export async function getOrigenContactoDB( id : number ) : Promise < IOrigenContacto >
{ 
  return db.transaction('r', db[ TABLAS.ORIGEN_CONTACTO ], async () =>
    {
      let listaDB           = await db[ TABLAS.ORIGEN_CONTACTO ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new OrigenContacto()
    }
  )
}

export async function getUnidadDB( id : number ) : Promise < IUnidad >
{ 
  return db.transaction('r', db[ TABLAS.UNIDAD ], async () =>
    {
      let listaDB           = await db[ TABLAS.UNIDAD ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new Unidad()
    }
  )
}

export async function getTiempoEntregaDB( id : number ) : Promise < ITiempoEntrega >
{ 
  return db.transaction('r', db[ TABLAS.TIEMPO_ENTREGA ], async () =>
    {
      let listaDB           = await db[ TABLAS.TIEMPO_ENTREGA ].where("id").equals(id).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new TiempoEntrega()
    }
  )
}


export async function getConstante( label : string ) : Promise < IConstante >
{ 
  return db.transaction('r', db[ TABLAS.CONSTANTE ], async () =>
    {
      let listaDB           = await db[ TABLAS.CONSTANTE ].where("label").equals(label).toArray()
      if(listaDB.length     == 1)
        return listaDB[0]
      else
        return new Constante()
    }
  )
}

export function checkListasVencidas() : boolean
{
  const TIEMPO_EXPIRAR  = 86_400_000 * 2 // ( 24 * 120)

  let fechaVencida      = false
  let lastFecha         = LocalStorage.getItem( pre + ALMACEN_LOCAL.FECHA_LISTAS ) as number
  
  if( !lastFecha )
    fechaVencida        = true
  else
  {
    let intervalo       = Date.now() - lastFecha
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

export async function limpiarDB() 
{
  await db.delete()
}