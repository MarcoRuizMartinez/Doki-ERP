export interface IBusquedaCotizacion {
  idTercero?:     number
  idComercial?:   string | number
  tercero?:       string
  contacto?:      string
  estado?:        number
  origen?:        number
  fechaDesde?:    string
  fechaHasta?:    string
  subtotalMin?:   number
  subtotalMax?:   number
  conIva?:        number
  conTotal?:      number
  limite?:        number
  offset?:        number
  //idEspecial?:  number
  area?:          string
  orden?:       "ASC" | "DESC"
  municipio?:     string
}

import {  useApiDolibarr    } from "src/composables/useApiDolibarr"
import {  getURL,
          getFormData       } from "src/composables/APIMaco"
import {  useFetch          } from "src/composables/useFetch"
import {  date              } from "quasar"
import {  ILineaApi         } from "src/areas/acuerdos/models/LineaAcuerdo"
import {  TIPOS_CONTACTO_ID } from "src/areas/terceros/models/Contacto"
import {  IQuery            } from "src/models/Busqueda"
import {  TTipoAcuerdo,
          TIPO_ACUERDO      } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  Acuerdo,
          IAcuerdo,         } from "src/areas/acuerdos/models/Acuerdo"
import {  Tool              } from "src/composables/useTools"

export function servicesAcuerdos()
{
  const { miFetch           } = useFetch()
  const { apiDolibarr       } = useApiDolibarr()


  async function postLinea( linea : ILineaApi ) : Promise< number >
  {
    return new Promise( async (resolver, rechazar) => {
      const { data, ok }      = await apiDolibarr( "crear-lineas", "cotización", linea )

      if(ok)
      {
        let newId : number    = 0
        if(typeof data        == "string")
          newId               = parseInt(data)
        else
        if(typeof data        == "number")
          newId               = data

        resolver(newId)
      }
      else
      {
        resolver(0)
      }
    })
  }

  async function getAcuerdo( tipo : TTipoAcuerdo, id : number ) : Promise< IAcuerdo >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      const { data, ok  }   = await miFetch( getURL("listas", "acuerdos"),
                                                    {
                                                      body:     getFormData(  "acuerdo",  { id: id, acuerdo: tipo } ),
                                                      method:   "POST"
                                                    },
                                                    {
                                                      mensaje:  "cargar cotización",
                                                      tiempoEspera: 10_000
                                                    }
                                                    )
      if(ok && typeof data == "object" )
      {
        const acuerdo    = await Acuerdo.convertirDataApiToAcuerdo( data, tipo )
        resolver( acuerdo )
      }
      else
      {
        resolver( new Acuerdo( tipo ) )
      }
    })
  }

  async function getAcuerdos( query : IQuery ) : Promise< IAcuerdo[] >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      const { data, ok  }           = await miFetch(  getURL("listas", "acuerdos"),
                                                    {
                                                      body:   getFormData( "busqueda", query ),
                                                      method: "POST"
                                                    },
                                                    {
                                                      mensaje:      "buscar " + query.acuerdo,
                                                      tiempoEspera: 15_000,
                                                      dataEsArray:  true
                                                    }
                                                  )
      const acuerdos : IAcuerdo[]   = []

      if(ok && Array.isArray( data ))
      {
        for (const item of data)
        {
          const quote : IAcuerdo    = await Acuerdo.convertirDataApiToAcuerdo( item, query?.acuerdo ?? TIPO_ACUERDO.NULO)
          acuerdos.push( quote )
        }
        resolver( acuerdos )
      }
      else {
        resolver( [] )
      }
    })
  }

  async function setFechaFinValidez( ctz_id : number, fecha : Date, acuerdo : TTipoAcuerdo ) : Promise< boolean > // Solo para coctizaciones
  {
    const fechaMas12H = date.addToDate  (fecha, { hours: 12 })
    const fechaToApi  = date.formatDate (fechaMas12H, 'YYYY-MM-DD HH:mm:ss')
    const obj         = { id: ctz_id, fecha:  fechaToApi, acuerdo:  acuerdo}

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok }    = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body:   getFormData(  "editarFechaValidez", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar fecha validez" }
                                                  )
      resolver( ok )
    })
  }

  async function setFechaEntrega( acu_id : number, fecha : Date, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    const fechaToApi  = date.formatDate (fecha, 'YYYY-MM-DD')
    const obj         = { id: acu_id, fecha:  fechaToApi, acuerdo: acuerdo  }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok }    = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData(  "editarFechaEntrega", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar fecha entrega" }
                                                  )
      resolver( ok )
    })
  }


  async function setFechaADespachar( acu_id : number, fecha : Date, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    const fechaToApi  = date.formatDate (fecha, 'YYYY-MM-DD')
    const obj         = { id: acu_id, fecha: fechaToApi, acuerdo: acuerdo  }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok }    = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData(  "editarFechaDespacho", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar fecha de despacho" }
                                                  )
      resolver( ok )
    })
  }  

  async function setCondicionPago( ctz_id : number, valor : number, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    const obj         = { id: ctz_id, valor: valor ?? "NULL", acuerdo: acuerdo }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok }    = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData(  "editarCondicionPago", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar condición de pago" }
                                                  )
      resolver( ok )
    })
  }

  async function setFormaPago( ctz_id : number, valor : number, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    const obj         = { id: ctz_id, valor: valor ?? "NULL", acuerdo: acuerdo }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok  }   = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData( "editarFormaPago", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar forma de pago" }
                                                  )
      resolver( ok )
    })
  }

  async function setTerceroId( ctz_id : number, id : number, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    const obj         = { id: ctz_id, valor: id, acuerdo: acuerdo }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok }    = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData( "editarTerceroId", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar tercero de cotización" }
                                                  )
      resolver( ok )
    })
  }

  async function setRefCliente( ctz_id : number, ref : string, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    const obj         = { id: ctz_id, ref: ref, acuerdo: acuerdo }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok  }   = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData( "editarRefCliente", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar referencia de cliente" }
                                                  )
      resolver( ok )
    })
  }

  async function setCostoLinea( costo : number, lineaId : number, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok  }   = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData( "editarCosto", { lineaId, costo, acuerdo } ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar costo linea" }
                                                  )
      resolver( ok )
    })
  }  

  async function setTitulo( ctz_id : number, titulo : string, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    const obj         = { id: ctz_id, titulo: titulo, acuerdo: acuerdo }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok }    = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData( "editarTitulo", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar titulo de cotización" }
                                                  )
      resolver( ok )
    })
  }

  async function setAiu( ctz_id : number, valor : number, tipo : "aiu" | "aiuAdmin" | "aiuImpre" | "aiuUtili", acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    const obj         = { id: ctz_id, valor: valor, acuerdo: acuerdo }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok }    = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData( tipo, obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar AIU" }
                                                  )
      resolver( ok )
    })
  }

  async function setTotal( ctz_id : number, on : boolean, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    const obj       = { id: ctz_id, valor: +on, acuerdo: acuerdo }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok }  = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData( "conTotal", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar total" }
                                                  )
      resolver( ok )
    })
  }

  async function setConIVA( ctz_id : number, on : boolean, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    const obj       = { id: ctz_id, valor: +on, acuerdo: acuerdo }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok }  = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData( "conIVA", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar IVA" }
                                                  )
      resolver( ok )
    })
  }

  async function setMetodoEntrega( ctz_id : number, valor : number, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    const obj         = { id: ctz_id, valor: valor ?? "NULL", acuerdo: acuerdo }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok }    = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData( "editarMetodoEntrega", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar método de entrega" }
                                                  )
      resolver( ok )
    })
  }


  async function ordenarLineas( ids : string, padreId : number, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    if(!ids) return true
    const obj         = { ids: ids, padreId: padreId, acuerdo: acuerdo }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok }    = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body:   getFormData( "ordenarLineas", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "ordenar líneas" }
                                                  )
      resolver( ok )
    })
  }


  async function setTiempoEntrega( ctz_id : number, valor : number, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    const obj           = { id: ctz_id, valor: valor ?? "NULL", acuerdo: acuerdo }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok }      = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body:   getFormData( "editarTiempoEntrega", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar tiempo de entrega" }
                                                  )
      resolver( ok )
    })
  }


  async function setOrigenContacto( ctz_id : number, valor : number, acuerdo : TTipoAcuerdo ) : Promise< boolean >
  {
    const obj         = { id: ctz_id, valor: valor, acuerdo: acuerdo }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok }    = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData( "editarOrigenContacto", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar origen contacto" }
                                                  )
      resolver( ok )
    })
  }

  async function setComercial(  ctz_id          : number,
                                comercial_id    : number,
                                acuerdo         : TTipoAcuerdo,
                                numeroComercial : string,
                              ) : Promise< boolean >
  {
    const obj           = { id: ctz_id, valor: comercial_id, acuerdo: acuerdo, numeroComercial }

    return new Promise( async (resolver, rechazar ) =>
    {
      const { ok  }     = await miFetch( getURL("servicios", "acuerdos"),
                                                    {
                                                      body: getFormData( "editarComercial", obj ),
                                                      method: "POST"
                                                    },
                                                    { mensaje: "editar comercial" }
                                                  )
      resolver( ok )
    })
  }

  async function getIdEnlaceContacto( idCotizacion : number, idContacto : number  ) : Promise< number >
  {
    const obj         = {
                          idElemento:   idCotizacion,
                          contactoTipo: TIPOS_CONTACTO_ID.CTZ_CUSTOMER,
                          contactoId:   idContacto,
                        }

    return new Promise( async (resolver, rechazar ) =>
    {
      const url           = getURL("listas", "varios")
      await Tool.pausa(400)

      const { ok, data  } = await miFetch(url,  { method: "POST", body: getFormData(  "idEnlaceCont", obj ) },
                                              { mensaje: "Buscar id de enlace de contacto"        }
                                        )
      const id          =   typeof data === "number" ? data
                          : typeof data === "string" ? parseInt( data )
                          : 0
      resolver( id )
    })
  }




  return {
    getAcuerdo,
    getAcuerdos,
    setFechaFinValidez,
    setFechaEntrega,
    setFechaADespachar,
    setCondicionPago,
    setFormaPago,
    setMetodoEntrega,
    setTiempoEntrega,
    setOrigenContacto,
    setRefCliente,
    setTerceroId,
    postLinea,
    ordenarLineas,
    setTitulo,
    setAiu,
    setTotal,
    setConIVA,
    getIdEnlaceContacto,
    setComercial,
    setCostoLinea,
  }
}
