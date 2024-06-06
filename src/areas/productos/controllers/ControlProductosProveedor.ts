//* ///////////////////////////////////////////////////////////////////////////////// Core
import {  useRouter             } from 'vue-router'

//* ///////////////////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'  
import {  useStoreApp           } from 'stores/app'
import {  useStoreProducto      } from 'stores/producto'
import {  useStoreUser          } from 'stores/user'

//* ///////////////////////////////////////////////////////////////////////////////// Modelos
import {  IProductoProveedor,
          ProductoProveedor,
          THijoPadre            } from '../models/ProductoProveedor'
import {  IQuery                } from "src/models/Busqueda"
import {  TIPO_PRO_PROVEEDOR    } from '../models/TipoProductoProveedor'
import {  TIPO_EDICION,
          TDatosEvento
                                } from "components/utilidades/AgGrid/AGTools"

//* ///////////////////////////////////////////////////////////////////////////////// Componibles
//import {  useFetch              } from "src/composables/useFetch"
//import {  getURL, getFormData   } from "src/composables/APIMaco"
import {  useTools, ToolType    } from "src/composables/useTools"
import {  servicesProductosPro  } from "src/areas/productos/services/servicesProductosProveedor"
import    mitt                    from "mitt";


//* //////////////////////////////////////////////////////////////////////////////// 📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡📡 Eventos

type TEventos = {
  solicitarRefrescarTabla       : boolean
  solicitarLimpiarFiltros       : void
  solicitarCambiarNuevos        : void
  solicitarCrearFilas           : IProductoProveedor[]
  solicitarEliminarFilas        : void
}

const eventos                   = mitt<TEventos>()

export function useControlProductosProveedor() 
{
  
  const { aviso               } = useTools() 
  // const { apiDolibarr         } = useApiDolibarr()
  // const { miFetch             } = useFetch()
  //* //////////////////////////////////////////////////////////////////////////////// 🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️ Servicios
  const { CrearProductos,
          BuscarProductos,
          BuscarProductoByRef,
          EditarCampoEnLote,
          RelacionarHijosYPadres,
                              } = servicesProductosPro()

  //* //////////////////////////////////////////////////////////////////////////////// 🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍 Pinia
  const { usuario             } = storeToRefs( useStoreUser() )  

  const { busquedaPro : b,
          productosPro,
          loading             } = storeToRefs( useStoreProducto() )

  const { tabs,
          campo_1: modoEdicion} = storeToRefs( useStoreApp() )


  //* //////////////////////////////////////////////////////////////////////////////// 📋📋📋📋📋📋📋📋📋📋📋📋 Gestion datos y tabla
  function useGestionTabla()
  {
    function crearNuevasFilas( filas : number )
    {
      const nuevosProductos :IProductoProveedor[] = []
  
      for (let i = 0; i < filas; i++){
        const newProducto           = new ProductoProveedor( "nuevo" )
        newProducto.id              = ( productosPro.value.length + i + 1 ) + 1_000_000
        nuevosProductos.push( newProducto )
        productosPro.value.unshift( newProducto )
      }
  
  
      eventos.emit("solicitarCrearFilas", nuevosProductos)
     /*  const largo                 = productosPro.value.length
      for (let i = 0; i < filas; i++)
      {
        const newProducto         = new ProductoProveedor( "nuevo" )
        newProducto.id            = ( largo + i + 1 ) + 1_000_000
        productosPro.value.push( newProducto  )
        //productosPro.value        = [newProducto].concat(productosPro.value );
        //productosPro.value        = [ newProducto, ...productosPro.value ]
        //productosPro.value.unshift( newProducto  )
        //productosPro.value.splice( 0, 0, newProducto)
  
      } */
    }
  
    function eliminarFila( id : number = 0 )
    {
      if(!id) return
      const index                 = productosPro.value.findIndex( p => p.id === id )
      if(index < 0 ) return 
      
      productosPro.value.splice( index, 1 )
    }
  
    function copiarADatosTemporales()
    {
      productosPro.value.forEach( p => p.copiarDatos() )
      eventos.emit("solicitarRefrescarTabla", false)
    }
  
    function setEdicionEnProductos(){
      const editar                = modoEdicion.value === TIPO_EDICION.RANGO || modoEdicion.value === TIPO_EDICION.CELDA
      productosPro.value.forEach( p => p.editable = editar )
      eventos.emit("solicitarRefrescarTabla", true)
    }
  
    function limpiarFiltros(){
      eventos.emit("solicitarLimpiarFiltros")
    }

    function limpiarTabla()
    {
      productosPro.value          = []
      eventos.emit("solicitarEliminarFilas")
    }

    return {
      crearNuevasFilas,
      eliminarFila,
      copiarADatosTemporales,
      setEdicionEnProductos,
      limpiarFiltros,
      limpiarTabla,
    }
  }


  //* //////////////////////////////////////////////////////////////////////////////// 👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻 Crear productos
  function useCRUD()
  {
    async function crearProductos()
    {
      const productosCrear        = productosPro.value.filter( p => p.sePuedeCrear )
      if(!productosCrear.length){
        aviso("negative", "No hay productos listos para crear", "table")
        return
      }
      const datosCrear            = productosCrear.map( p => p.datosCrearApi )
      loading.value.crear         = true
      const ok                    = await CrearProductos( datosCrear, usuario.value.id )
      loading.value.crear         = false
      if(!ok) return
  
      const query                 = { refs: productosCrear.map( p => p.ref).join(",") }
      loading.value.carga         = true
      const productosCreados      = await BuscarProductos( query )
      loading.value.carga         = false
      if(!productosCreados.length) return
  
      productosCrear.forEach( p =>{
        p.id                      = productosCreados.find( pc => p.ref === pc.ref )?.id ?? 0       
      })
  
      eventos.emit("solicitarCambiarNuevos")
  
      const relaciones            = productosCrear.filter( p => !!p.idPadre ).map( p => p.productoPadreApi )
  
      relacionarHijosConPadres( relaciones )
    }
  
    async function relacionarHijosConPadres( relaciones : THijoPadre[] )
    {
      if(!relaciones.length) return
  
      loading.value.crear         = true
      const ok                    = await RelacionarHijosYPadres( relaciones )
      loading.value.crear         = false
    }
  
    //* //////////////////////////////////////////////////////////////////////////////// ☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️ Actualizar datos
    const cambios : TDatosEvento[]= []
  
    // * ////////////////////////////////////////////////////////////////////////////////////////////////////// Procesar Edicion En Lote
    // * ///////////////////////////////////////////////////////////////////// Aca se reciben todos los cambios que se hacen en la tabla
    // * // Como recibe cabios por cada celda, y en una misma edicion, se pueden editar cientos de celdas, se hace el timeout 
    // * // ....para espererar que lleguen todas las ediciones de las cientos de celdas
    let   timeoutId : ReturnType<typeof setTimeout> | null = null;
    function procesarEdicionEnLote( d : TDatosEvento )
    {
      if(!!d.data.esNuevo || d.campo === "esNuevo") {
        gestionarCambiosEnNuevo(d)
        return
      }
  
      cambios.push( d )
  
      if (timeoutId)  clearTimeout(timeoutId)    
      timeoutId               = setTimeout(subirCambiosEnLote, 200);
    }
    
    // * ///////////////////////////////////////////////////////////////////////////////////////////////// gestionar Cambios En Nuevo
    // * ////////////////////////////////////////////////////////////////////////////// Aca se reciben los de filas nuevas en la tabla
    async function gestionarCambiosEnNuevo( d : TDatosEvento )
    {
      let revisarCampos         = false
      if(d.campo === "refPadre" || d.campo === "tipo")
      {
        if(d.data.tipo.value    === TIPO_PRO_PROVEEDOR.HIJO && d.data.refPadre.length > 3)
        {
          const producto        = await BuscarProductoByRef( d.data.refPadre )
          if(!!producto.id)
          {
            d.data              = ProductoProveedor.getCopiaProducto( producto, d.data ) 
            d.data.idPadre      = producto.id
            revisarCampos       = true
          }
  
          d.data.okRefPadre     = !!producto.id
        }
      }
  
      if(d.campo                === "ref"       || revisarCampos){
        const producto          = await BuscarProductoByRef( d.data.ref )
        const repetido          = productosPro.value.some( p => p.ref === d.data.ref && p.id != d.data.id ) 
        const muyCorto          = d.data.ref.length <= 4
        d.data.okRef            = !(!!producto.id || repetido || muyCorto )
      }
  
      if(d.campo                === "nombre"    || revisarCampos){
        const repetido          = productosPro.value.some( p => p.nombre === d.data.nombre && p.id != d.data.id ) 
        d.data.okNombre         = d.data.nombre.length > 10 && !repetido
      }
      
      if(d.campo                === "tipo"      || revisarCampos)
        d.data.okTipo           = !!d.data.tipo.value
  
      if(d.campo                === "proveedor" || revisarCampos)
        d.data.okProveedor      = !!d.data.proveedor.id
  
      if(d.campo                === "categoria" || revisarCampos)
        d.data.okCategoria      = !!d.data.categoria.id
  
      if(d.campo                === "hechoEn"   || revisarCampos)
        d.data.okHechoEn        = !!d.data.hechoEn.value
      
      if(d.campo                === "precio"    || revisarCampos)
        d.data.okPrecio         = ToolType.anyToNum( d.data.precio ) != 0
  
      const refrescarTodo       = !!d.data.sePuedeCrear
      eventos.emit("solicitarRefrescarTabla", refrescarTodo)
    }
  
    // * //////////////////////////////////////////////////////////////////////////////////////////////////////// subir Cambios En Lote
    // * ////////////////////////////////////////////////////////////////////////////// Aca se suben las ediciones en lote que se hacen 
    async function subirCambiosEnLote()
    {
      if(!cambios.length) return
  
      const campo                 = cambios[0].campo
      if(campo.includes("_n")) return
  
      loading.value.carga         = true
  
      for (const c of cambios)
      {
        if(typeof c.value         ==  "boolean")
          c.value = ToolType.anyToNum( c.value )
        else if(c.value           === null && typeof c.oldValue == "boolean")
          c.value                 = 0
        else if(c.value           === null && typeof c.oldValue == "string")
          c.value                 = ""
        else if(                  // Objetos
              campo               === "diasDespacho"
          ||  campo               === "categoria"
          ||  campo               === "garantiaMeses"
          ||  campo               === "hechoEn"
        )
        {
          c.value                 = ToolType.anyToNumOStr( c.value?.value )
        }
      }
      
      const ok                    = await EditarCampoEnLote( campo, cambios, usuario.value.id )    
      cambios.length              = 0
      loading.value.carga         = false
    }
    
    return {
      cambios,
      crearProductos,
      procesarEdicionEnLote,
      //gestionarCambiosEnNuevo,

      subirCambiosEnLote,

    }
  }

  //* //////////////////////////////////////////////////////////////////////////////// 🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙🪙 Gestion precios
  function usePrecios()
  {
    async function actualizarPrecios()
    {
      await copiarYSubirPreciosDeTemporales( "precio" )
      await copiarYSubirPreciosDeTemporales( "precioCredito" )
      eventos.emit("solicitarRefrescarTabla", false)
    }
  
    async function copiarYSubirPreciosDeTemporales( key : "precio" | "precioCredito" )
    {
      cambios.length = 0
      for (const p of productosPro.value)
      {
        if(key === "precio"         && p.precio         === p.precio_n)         continue
        if(key === "precioCredito"  && p.precioCredito  === p.precioCredito_n)  continue
  
        p.copiarPrecios( key )
  
        const valor   = key === "precio" ? p.precio : p.precioCredito
        if(!valor) continue
        
        cambios.push({
          campo     : key,
          data      : p,
          value     : valor,
          index     : 0,
          oldValue  : 0,
        })
      }
  
      await subirCambiosEnLote()
    }

    return { actualizarPrecios }
  }

  //* //////////////////////////////////////////////////////////////////////////////// 🏁🏁🏁🏁🏁🏁🏁 Funciones de Page: iniciar y desmontar
  function useCicloDeVida()
  {
    const router                  = useRouter()

    async function iniciar()
    {
      productosPro.value          = []    
      tabs.value.activa           = "tab_1"
      modoEdicion.value           = TIPO_EDICION.BLOQUEDA
      await b.value.montarBusqueda( usuario.value.id, router, false, true, 50 )
    }
  
    function desmontar()
    {
      productosPro.value          = []
      b.value.desmontarBusqueda()
      apagarEventos()
    }
  
    function apagarEventos()
    {
      eventos.off("solicitarRefrescarTabla")
      eventos.off("solicitarLimpiarFiltros")
      eventos.off("solicitarCambiarNuevos")
      eventos.off("solicitarCrearFilas")
      eventos.off("solicitarEliminarFilas")
    }

    return {
      iniciar,
      desmontar
    }
  }

  //* //////////////////////////////////////////////////////////////////////////////// 🔎🔎🔎🔎🔎🔎🔎🔎🔎🔎🔎🔎🔎 Funciones de busqueda
  function useBuscar()
  {
    async function buscar( query : IQuery )
    {
      loading.value.carga         = true
      const editable              = modoEdicion.value === TIPO_EDICION.RANGO || modoEdicion.value === TIPO_EDICION.CELDA
      limpiarTabla()
      productosPro.value          = await BuscarProductos( query, editable )
      loading.value.carga         = false
    } 

    async function limpiarBusqueda(){
      const urlYQueryLimpia       = await b.value.limpiarQueryDeRouter()
      if(urlYQueryLimpia){
        limpiarTabla()
      }
    }

    return {
      buscar,
      limpiarBusqueda
    }
  }

  const { crearNuevasFilas,
          eliminarFila,
          copiarADatosTemporales,
          setEdicionEnProductos,
          limpiarFiltros,
          limpiarTabla,
                                  } = useGestionTabla()
  const { cambios,
          crearProductos,
          procesarEdicionEnLote,          
          subirCambiosEnLote,      
                                  } = useCRUD()         
  const { actualizarPrecios       } = usePrecios()
  const { buscar, limpiarBusqueda } = useBuscar()
  const { iniciar, desmontar      } = useCicloDeVida()


  //* //////////////////////////////////////////////////////////////////////////////// ➡️ Return
  return {
    // * ///////////////////////////////// 🗃️ Estado
    modoEdicion,
    // * ///////////////////////////////// 📡 Eventos
    eventos,
    // * ///////////////////////////////// 🔎 Funciones de busqueda
    buscar,
    limpiarBusqueda,
    // * ///////////////////////////////// ☁️ Actualizar datos
    actualizarPrecios,
    procesarEdicionEnLote,
    // * ///////////////////////////////// 📋 Gestion de datos
    crearNuevasFilas,
    eliminarFila,
    copiarADatosTemporales,
    setEdicionEnProductos,
    limpiarFiltros,
    crearProductos,
    // * ///////////////////////////////// 🏁 Funciones de Page 
    iniciar,
    desmontar,
  }
}