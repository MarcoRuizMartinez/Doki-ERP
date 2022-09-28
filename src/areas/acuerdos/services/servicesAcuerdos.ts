
import {  useApiDolibarr    } from "src/services/useApiDolibarr"
import {  getURL,
          getFormData       } from "src/services/APIMaco"
import {  useFetch          } from "src/useSimpleOk/useFetch"
import {  date              } from "quasar"
import {  ILineaApi         } from "src/areas/acuerdos/models/LineaAcuerdo"
import {  TIPOS_CONTACTO_ID } from "src/areas/terceros/models/Contacto"
import {  IQueryAcuerdo     } from "src/areas/acuerdos/models/BusquedaAcuerdos"
import {  Acuerdo,
          IAcuerdo,       } from "src/areas/acuerdos/models/Acuerdo"
import {  pausa,
          valuesObjectArrayToNumber,
                            } from "src/useSimpleOk/useTools"

export function servicesAcuerdos()
{
  const { miFetch           } = useFetch()
  const { apiDolibarr       } = useApiDolibarr()

  async function getAcuerdos( query : IQueryAcuerdo ) : Promise< IAcuerdo[] >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      let { data, ok            } = await miFetch(  getURL("listas", "acuerdos"),
                                                    {
                                                      body:   getFormData( "", query ),
                                                      method: "POST"
                                                    },
                                                    {
                                                      mensaje:      "buscar " + query.acuerdo,
                                                      tiempoEspera: 10000,
                                                      dataEsArray:  true
                                                    }
                                                  )
      let acuerdos : IAcuerdo[]   = []

      if(ok && Array.isArray( data ))
      {
        for (const item of data){
          let quote : IAcuerdo = await Acuerdo.convertirDataApiToAcuerdo( item, query.acuerdo )
          acuerdos.push( quote )
        }
        resolver( acuerdos )
      }
      else {
        resolver( [] )
      }
    })
  }

/*   async function postLinea( linea : ILineaApi ) : Promise< number >
  {
    return new Promise( async (resolver, rechazar) => {
      let { data, ok }        = await apiDolibarr( "crear-lineas", "cotizacion", linea )

      if(ok){
        let newId : number    = 0
        if(typeof data        == "string")
          newId               = parseInt(data)
        else
        if(typeof data        == "number")
          newId               = data

        resolver(newId)
      }
      else{
        resolver(0)
      }
    })
  } */
/* 
  async function getCotizacion( id : number ) : Promise< IAcuerdo >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      let { data, ok            } = await miFetch( getURL("listas", "cotizaciones"),
                                                    {
                                                      body: getFormData(  "cotizacion",  { id: id } ),
                                                      method: "POST"
                                                    },
                                                    {
                                                      mensaje:      "cargar cotizacion",
                                                      tiempoEspera: 10000
                                                    }
                                                  )
      if(ok && typeof data == "object" )
      {
        let cotizacion    = await Acuerdo.convertirDataApiToAcuerdo( data )
        resolver( cotizacion )
      }
      else
      {
        resolver( new Acuerdo() )
      }
    })
  } */


  /* async function getCotizaciones( query : IBusquedaAcuerdo ) : Promise< IAcuerdo[] >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      let { data, ok            } = await miFetch(  getURL("listas", "cotizaciones"),
                                                    {
                                                      body:   getFormData(  "busqueda", query ),
                                                      method: "POST"
                                                    },
                                                    {
                                                      mensaje:      "buscar cotizaciones",
                                                      tiempoEspera: 10000,
                                                      dataEsArray:  true
                                                    }
                                                  )
      let quotes : IAcuerdo[]  = []

      if(ok && Array.isArray( data ))
      {
        for (const item of data)
        {
          let quote : IAcuerdo = await Acuerdo.convertirDataApiToAcuerdo( item )
          quotes.push( quote )
        }
        resolver( quotes )
      }
      else
      {
        resolver( [] )
      }
    })
  } */

  /* async function setFechaFinValidez( ctz_id : number, fecha : Date  ) : Promise< boolean >
  {
    let fechaMas12H   = date.addToDate  (fecha, { hours: 12 })
    let fechaToApi    = date.formatDate (fechaMas12H, 'YYYY-MM-DD HH:mm:ss')
    let obj           = { id: ctz_id, fecha:  fechaToApi }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body:   getFormData(  "editarFechaValidez", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar fecha validez" }
                                                  )
      resolver( ok )
    })
  } */

  /* async function setFechaEntrega( ctz_id : number, fecha : Date  ) : Promise< boolean >
  {
    let fechaToApi    = date.formatDate (fecha, 'YYYY-MM-DD')
    let obj           = { id: ctz_id, fecha:  fechaToApi }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body: getFormData(  "editarFechaEntrega", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar fecha entrega" }
                                                  )
      resolver( ok )
    })
  } */

/*   async function setCondicionPago( ctz_id : number, valor : number  ) : Promise< boolean >
  {
    let obj           = { id: ctz_id, valor: valor }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body: getFormData(  "editarCondicionPago", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar condición de pago" }
                                                  )
      resolver( ok )
    })
  }
 */
  /* async function setFormaPago( ctz_id : number, valor : number  ) : Promise< boolean >
  {
    let obj           = { id: ctz_id, valor: valor }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body: getFormData( "editarFormaPago", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar forma de pago" }
                                                  )
      resolver( ok )
    })
  } */

/*   async function setTerceroId( ctz_id : number, id : number  ) : Promise< boolean >
  {
    let obj           = { id: ctz_id, valor: id }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body: getFormData( "editarTerceroId", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar tercero de cotizacion" }
                                                  )
      resolver( ok )
    })
  }
 */
/*   async function setRefCliente( ctz_id : number, ref : string  ) : Promise< boolean >
  {
    let obj           = { id: ctz_id, ref: ref }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body: getFormData( "editarRefCliente", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar referencia de cliente" }
                                                  )
      resolver( ok )
    })
  } */

/*   async function setTitulo( ctz_id : number, titulo : string  ) : Promise< boolean >
  {
    let obj           = { id: ctz_id, titulo: titulo }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body: getFormData( "editarTitulo", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar titulo de cotizacion" }
                                                  )
      resolver( ok )
    })
  } */

/*   async function setAiu( ctz_id : number, valor : number, tipo : "aiu" | "aiuAdmin" | "aiuImpre" | "aiuUtili" ) : Promise< boolean >
  {
    let obj           = { id: ctz_id, valor: valor }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body: getFormData( tipo, obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar AIU" }
                                                  )
      resolver( ok )
    })
  } */

/*   async function setTotal( ctz_id : number, on : boolean) : Promise< boolean >
  {
    let obj           = { id: ctz_id, valor: +on }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body: getFormData( "conTotal", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar total" }
                                                  )
      resolver( ok )
    })
  } */

/*   async function setConIVA( ctz_id : number, on : boolean) : Promise< boolean >
  {
    let obj           = { id: ctz_id, valor: +on }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body: getFormData( "conIVA", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar IVA" }
                                                  )
      resolver( ok )
    })
  } */

/*   async function setMetodoEntrega( ctz_id : number, valor : number  ) : Promise< boolean >
  {
    let obj           = { id: ctz_id, valor: valor }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body: getFormData( "editarMetodoEntrega", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar método de entrega" }
                                                  )
      resolver( ok )
    })
  } */


/*   async function ordenarLineas( ids : string, padreId : number  ) : Promise< boolean >
  {
    if(!ids) return true
    let obj           = { ids: ids, padreId: padreId }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body:   getFormData( "ordenarLineas", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "ordenar líneas" }
                                                  )
      resolver( ok )
    })
  } */


/*   async function setTiempoEntrega( ctz_id : number, valor : number  ) : Promise< boolean >
  {
        let obj           = { id: ctz_id, valor: valor }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body:   getFormData( "editarTiempoEntrega", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar tiempo de entrega" }
                                                  )
      resolver( ok )
    })
  } */


/*   async function setOrigenContacto( ctz_id : number, valor : number  ) : Promise< boolean >
  {
        let obj           = { id: ctz_id, valor: valor }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body: getFormData( "editarOrigenContacto", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar origen contacto" }
                                                  )
      resolver( ok )
    })
  } */

/*   async function setComercial( ctz_id : number, comercial_id : number  ) : Promise< boolean >
  {
    let obj           = { id: ctz_id, valor: comercial_id }

    return new Promise( async (resolver, rechazar ) =>
    {
      let { ok      } = await miFetch( getURL("servicios", "cotizaciones"),
                                                    {
                                                      body: getFormData( "editarComercial", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar comercial" }
                                                  )
      resolver( ok )
    })
  } */

/*   async function getIdEnlaceContacto( idCotizacion : number, idContacto : number  ) : Promise< number >
  {
    let obj           = {
                          idElemento:   idCotizacion,
                          contactoTipo: TIPOS_CONTACTO_ID.CTZ_CUSTOMER,
                          contactoId:   idContacto,
                        }

    return new Promise( async (resolver, rechazar ) =>
    {
      const url         = getURL("listas", "varios")
      await pausa(400)

      let { ok, data  } = await miFetch(url,  { method: "POST", body: getFormData(  "idEnlaceCont", obj ) },
                                              { mensaje: "Buscar id de enlace de contacto"        }
                                        )
      const id          =   typeof data === "number" ? data
                          : typeof data === "string" ? parseInt( data )
                          : 0
      resolver( id )
    })
  } */


  return {
    //getCotizacion,
    getAcuerdos,
    //getCotizaciones,
    //setFechaFinValidez,
    //setFechaEntrega,
    //setCondicionPago,
    //setFormaPago,
    //setMetodoEntrega,
    //setTiempoEntrega,
    //setOrigenContacto,
    //setRefCliente,
    //setTerceroId,
    //postLinea,
    //ordenarLineas,
    //setTitulo,
    //setAiu,
    //setTotal,
    //setConIVA,
    //getIdEnlaceContacto,
    //setComercial,
  }
}
