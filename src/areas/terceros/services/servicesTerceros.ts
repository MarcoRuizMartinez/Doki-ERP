/* export interface IBusquedaTercero {
  like?:        string
  limite?:      number
  idUsuarios?:  string | number
  favorito?:    number
  esFamoso?:    number
  esCliente?:   number
  esProveedor?: number
  municipio?:   string
  area?:        string
  //idEspecial?:  number
  orden?:       "ASC" | "DESC"
} */

import {  getURL,
          getFormData     } from "src/composables/APIMaco"
import {  useFetch        } from "src/composables/useFetch"
//import {  useUsuario      } from "src/composables/useUsuario"
import {  ITercero,
          Tercero,
                          } from "src/areas/terceros/models/Tercero"
import {  useRouter       } from 'vue-router'
import {  useQuasar       } from 'quasar'
import {  IQuery          } from "src/models/Busqueda"

export function servicesTerceros() 
{
  const { miFetch } = useFetch()
  const { notify  } = useQuasar()
  const router      = useRouter()  
  //const { usuario           } = useUsuario()


  async function buscarTercero( id : number, conLoadingBar = true ) : Promise< ITercero >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      let { data, ok            } = await miFetch( getURL("listas", "tercerosNew"),
                                                    {
                                                      body: getFormData(  "tercero",  { id: id } ),
                                                      method: "POST" 
                                                    },
                                                    {
                                                      mensaje:      "cargar terceros",
                                                      tiempoEspera: 25_000,
                                                      conLoadingBar,
                                                    }
                                                  )
      if(ok && typeof data        == "object" )
      {   
        let tercero : ITercero    = await Tercero.convertirDataApiATercero( data )
        resolver( tercero )
      }
      else
      {
        resolver( new Tercero() )
      }
    })
  }

  
  async function buscarTerceros( query : IQuery ) : Promise< ITercero[] >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      let { data, ok            } = await miFetch( getURL("listas", "tercerosNew"),
                                                    {
                                                      body: getFormData(  "busqueda", query ),
                                                      method: "POST" 
                                                    },
                                                    {
                                                      mensaje:      "buscar terceros",
                                                      tiempoEspera: 10000,
                                                      dataEsArray:  true
                                                    }
                                                  )
      let terceros : ITercero[]   = []

      if(ok && Array.isArray( data ))
      {        
        for (const item of data)
        {
          let tercero : ITercero = await Tercero.convertirDataApiATercero( item ) 
          terceros.push( tercero )          
        }
        resolver( terceros )
      }
      else
      {
        resolver( [] )
      }
    })
  }

  async function vericarDocumentoEnDolibarr( numero : string, notificar : boolean = true ) : Promise< number >
  {
    let idTercero = await ejecutarBusqueda( "documentoExiste" )

    if( !!idTercero ) return idTercero
      idTercero   = await ejecutarBusqueda( "documentoExisteContactos" )

    return idTercero

    async function ejecutarBusqueda( endpoint : string ) : Promise< number >
    {
      let id                      = 0
      const { ok : existe, data}  = await miFetch(  getURL( "listas", "varios"),
                                                    {
                                                      method: "POST",
                                                      body:   getFormData( endpoint, { numero } )
                                                    },
                                                    { mensaje: "buscar si existe numero de documento" }
                                                  )
      const resultado : any       = data

      if(existe && !!resultado && resultado.hasOwnProperty("vendedor") && !Array.isArray(resultado))
      {
        const vendedor            = JSON.parse(resultado.vendedor)[0].name
        id                        = parseInt( resultado?.id ?? "0" )
        
        if(notificar)
        {
          notify({
            color:                "negative",
            textColor:            "white",
            icon:                 "mdi-account-alert",
            position:             "top",
            timeout:              5000,
            message:              "Este tercero ya ha sido creado por " + vendedor,
            actions: [
              { label: 'Ir a tercero', color: 'white', handler: () => { router.push("/tercero/" + id ) } }
            ]
          })
        }
      }

      return id
    }
  }  

  async function getNota( idTercero : string) : Promise< string >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      let { data, ok            } = await miFetch( getURL("listas", "varios"),
                                                    {
                                                      body: getFormData(  "notaTercero", { idTercero: idTercero } ),
                                                      method: "POST" 
                                                    },
                                                    {
                                                      mensaje:      "buscar nota de tercero",
                                                      tiempoEspera: 10000
                                                    }
                                                  )

      if(ok && typeof data == "string")
        resolver( data )
      else
        resolver( "" )
    })
  }

  async function setNota( idTercero : number, nota : string) : Promise< boolean >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      let { data, ok            } = await miFetch( getURL("servicios", "terceros"),
                                                    {
                                                      body: getFormData(  "notaTercero", { idTercero: idTercero, nota: nota } ),
                                                      method: "POST" 
                                                    },
                                                    {
                                                      mensaje:      "editar nota de tercero",
                                                      tiempoEspera: 10000
                                                    }
                                                  )

      resolver( ok )
    })
  }

  async function moverContactoAOtroTercero( idContacto : number , idTercero : number ) : Promise< boolean >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      let { data, ok            } = await miFetch( getURL("servicios", "terceros"),
                                                    {
                                                      body: getFormData(  "moverContactoAOtroTercero", { idContacto, idTercero } ),
                                                      method: "POST" 
                                                    },
                                                    {
                                                      mensaje:      "cambiar contacto a otro tercero",
                                                      tiempoEspera: 10000
                                                    }
                                                  )

      resolver( ok )
    })
  }

  return {
    buscarTercero,
    buscarTerceros,
    getNota,
    setNota,
    moverContactoAOtroTercero,
    vericarDocumentoEnDolibarr,
  }
}


      /*   idEsValido.value          = ok

        if(ok){
          tercero.value           = await convertirDataApiATercero( data )
          copiaResponsables       = JSON.stringify( tercero.value.responsables ) // Para luego ver si cambiaron

          verificarPermisosLectura()
        }
        else
          codigoError.value       = codigo

          })
      */