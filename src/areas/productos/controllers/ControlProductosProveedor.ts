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

import {  useTools, 
          ToolType,
          ToolNum               } from "src/composables/useTools"
import {  servicesProductosPro  } from "src/areas/productos/services/servicesProductosProveedor"
import {  IRowNode              } from "ag-grid-community"


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
          tablaAG,
          filtro,
          campo_1: modoEdicion} = storeToRefs( useStoreApp() )


  //* //////////////////////////////////////////////////////////////////////////////// 📋📋📋📋📋📋📋📋📋📋📋📋 Gestion datos y tabla
  function useGestionTabla()
  {
    function crearFilasNuevosProductos( filas : number )
    {
      const nuevosProductos :IProductoProveedor[] = []
  
      for (let i = 0; i < filas; i++){
        const newProducto           = new ProductoProveedor( "nuevo" )
        newProducto.id              = ( productosPro.value.length + i + 1 ) + 1_000_000
        nuevosProductos.push( newProducto )
        productosPro.value.unshift( newProducto )
      }
    }

    function crearNuevasFilas( nuevosProductos : IProductoProveedor[] )
    {
      tablaAG.value?.gridApi?.applyTransaction({
          add: nuevosProductos,
          addIndex: 0,
      })
    }
  
    function eliminarFila( id : number = 0 )
    {
      if(!id) return
      const index                 = productosPro.value.findIndex( p => p.id === id )
      if(index < 0 ) return 
      
      productosPro.value.splice( index, 1 )
    }


    function eliminarFilasPorId( ids : number[] )
    {
      const idsEliminar     = ids.map( n => { return { id: n }})
      tablaAG.value?.gridApi?.applyTransaction( { remove: idsEliminar } )
    }

  
    function copiarADatosTemporales()
    {
      productosPro.value.forEach( p => p.copiarDatos() )
      tablaAG.value?.refreshCells( false )
    }
  
    function setEdicionEnProductos(){
      const editar                = modoEdicion.value === TIPO_EDICION.RANGO || modoEdicion.value === TIPO_EDICION.CELDA
      productosPro.value.forEach( p => p.editable = editar )
      tablaAG.value?.refreshCells( true )
    }
  
    function limpiarFiltros(){
      filtro.value                = ""
      tablaAG.value?.limpiarFiltros()
    }

    function limpiarTabla()
    {
      limpiarFiltros()
      productosPro.value          = []

      const rowData : IRowNode<IProductoProveedor>[] = [];
      tablaAG.value?.gridApi?.forEachNode     ( node => rowData.push( node.data ) )
      tablaAG.value?.gridApi?.applyTransaction( { remove: rowData } )
    }

    function ordenarPorOrden(){
      tablaAG.value?.volverAOrdenar()
    }

    return {
      eliminarFila,
      limpiarTabla,
      limpiarFiltros,
      eliminarFilasPorId,
      crearNuevasFilas,
      crearFilasNuevosProductos,
      copiarADatosTemporales,
      ordenarPorOrden,
      setEdicionEnProductos,
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

      eliminarFilasPorId( productosCrear.map( p => p.id ) )

      productosCrear.forEach( p =>{
        p.id                      = productosCreados.find( pc => p.ref === pc.ref )?.id ?? 0
        p.esNuevo                 = false
      })

      crearNuevasFilas( productosCrear )
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
      timeoutId               = setTimeout( subirCambiosEnLote , 200);
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
        const muyCorto          = d.data.ref.length <= 2
        d.data.okRef            = !(!!producto.id || repetido || muyCorto )
      }
  
      if(d.campo                === "nombre"    || revisarCampos){
        const repetido          = productosPro.value.some( p => p.nombre === d.data.nombre && p.id != d.data.id ) 
        d.data.okNombre         = d.data.nombre.length >= 8 && !repetido
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
      tablaAG.value?.refreshCells( refrescarTodo )
    }
  
    // * //////////////////////////////////////////////////////////////////////////////////////////////////////// subir Cambios En Lote
    // * ////////////////////////////////////////////////////////////////////////////// Aca se suben las ediciones en lote que se hacen 
    async function subirCambiosEnLote()
    {
      if(!cambios.length) return
      const nuevosCambios : TDatosEvento[]= []
  
      const campo                 = cambios[0].campo
      if(campo.includes("_n")) {
        cambios.length            = 0
        return
      }
  
      loading.value.carga         = true
  
      for (const c of cambios)
      {
        if(typeof c.value         ==  "boolean")
          c.value = ToolType.anyToNum( c.value )
        else if(c.value           === null && typeof c.oldValue == "boolean") c.value  = 0
        else if(c.value           === null && typeof c.oldValue == "number")  c.value  = 0
        else if(c.value           === null && typeof c.oldValue == "string")  c.value  = ""
        else if(                  // Objetos
              campo               === "diasDespacho"
          ||  campo               === "categoria"
          ||  campo               === "garantiaMeses"
          ||  campo               === "hechoEn"
          ||  campo               === "tipo"
        )
        {
          c.value                 = ToolType.anyToNumOStr( c.value?.value )
        }

        if(campo                  === "stock" && c.data.gestionStock)
        {
          const hayStock          = !!c.value
          c.data.disponible       = hayStock
          nuevosCambios.push({
            campo     : "disponible",
            index     : c.index,
            data      : c.data,
            value     : hayStock,
            oldValue  : c.oldValue,
            source    : "",
          })
        }
        if(campo                  === "activo")
        {
          const activo            = !!c.value
          if(!activo)
          {
            c.data.disponible     = false
            nuevosCambios.push({
              campo     : "disponible",
              index     : c.index,
              data      : c.data,
              value     : false,
              oldValue  : c.oldValue,
              source    : "",
            })            
          }          
        }        
      }

      const ok                    = await EditarCampoEnLote( campo, cambios, usuario.value.id )    
      cambios.length              = 0
      loading.value.carga         = false

      if(campo                    === "orden")
        ordenarPorOrden()

      if(!!nuevosCambios.length)
      {
        cambios.push( ...nuevosCambios )
        tablaAG.value?.refreshCells( false )
        subirCambiosEnLote()
      }
    }
    
    return {
      cambios,
      crearProductos,
      procesarEdicionEnLote,
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
      tablaAG.value?.refreshCells( false )
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
          source    : "",
        })
      }
  
      await subirCambiosEnLote()
    }

    function cambiarPreciosPorIVA( accion : "subir" | "bajar" )
    {
      const IVA                     = parseInt( process.env.IVA ?? "0" )
      tablaAG.value?.gridApi?.forEachNode((fila : IRowNode<IProductoProveedor>) =>
      {
        if(!fila.data) return 
  
        const precioCon             = ToolType.keyNumberValido( fila.data, "precio" )
        const precioCre             = ToolType.keyNumberValido( fila.data, "precioCredito" )
  
        if(accion                   == "subir"){
          if(!!precioCon)   fila.data.precio_n          = ToolNum.roundInt( ToolNum.X100_Aumento( precioCon, IVA ), 0 )
          if(!!precioCre)   fila.data.precioCredito_n   = ToolNum.roundInt( ToolNum.X100_Aumento( precioCre, IVA ), 0 )
        }
        else{
          if(!!precioCon)   fila.data.precio_n          = ToolNum.roundInt( ToolNum.X100_Reduccion( precioCon, IVA ), 0 )
          if(!!precioCre)   fila.data.precioCredito_n   = ToolNum.roundInt( ToolNum.X100_Reduccion( precioCre, IVA ), 0 )
        }
  
        if(!!precioCon)     fila.setDataValue("precio_n",         fila.data.precio_n)
        if(!!precioCre)     fila.setDataValue("precioCredito_n",  fila.data.precioCredito_n)
      })
    }

    function marcarPreciosActualizados( actualizado : boolean )
    {
      tablaAG.value?.gridApi?.forEachNode((fila : IRowNode<IProductoProveedor>) => {
          fila.setDataValue("precioActualizado", actualizado)
        }
      )
    }

    return { 
      actualizarPrecios, 
      cambiarPreciosPorIVA,
      marcarPreciosActualizados
    }
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

      if(usuario.value.externo) buscar({})
    }
  
    function desmontar()
    {
      productosPro.value          = []
      b.value.desmontarBusqueda()
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
      corregirQueryUsuarioExterno( query )
      productosPro.value          = await BuscarProductos( query, editable )
      loading.value.carga         = false
    }

    function corregirQueryUsuarioExterno( query : IQuery )
    {
      if(!usuario.value.externo || !usuario.value.tercero_id ) return
  
      const hayLimite               = "limite" in query
      if( !hayLimite )query.limite  = 25
  
      const hayOffset               = "offset" in query
      if( !hayOffset )  query.offset= 0

      const hayActivo               = "activo" in query
      if( !hayActivo )  query.activo= "1"
  
      query.proveedorId             = usuario.value.tercero_id      
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

  const { crearFilasNuevosProductos,
          crearNuevasFilas,
          eliminarFila,
          eliminarFilasPorId,
          copiarADatosTemporales,
          setEdicionEnProductos,
          ordenarPorOrden,
          limpiarFiltros,
          limpiarTabla,
                                  } = useGestionTabla()
  const { cambios,
          crearProductos,
          procesarEdicionEnLote,          
          subirCambiosEnLote,      
                                  } = useCRUD()         
  const { actualizarPrecios,
          marcarPreciosActualizados,
          cambiarPreciosPorIVA    } = usePrecios()
  const { buscar, limpiarBusqueda } = useBuscar()
  const { iniciar, desmontar      } = useCicloDeVida()


  //* //////////////////////////////////////////////////////////////////////////////// ➡️ Return
  return {
    // * ///////////////////////////////// 🗃️ Estado
    modoEdicion,
    // * ///////////////////////////////// 🔎 Funciones de busqueda
    buscar,
    limpiarBusqueda,
    // * ///////////////////////////////// ☁️ Actualizar datos
    actualizarPrecios,
    cambiarPreciosPorIVA,
    marcarPreciosActualizados,
    procesarEdicionEnLote,
    // * ///////////////////////////////// 📋 Gestion de datos
    crearFilasNuevosProductos,
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