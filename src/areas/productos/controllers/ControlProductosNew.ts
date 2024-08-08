//* ///////////////////////////////////////////////////////////////////////////////// Core
import {  useRouter             } from 'vue-router'

//* ///////////////////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'  
import {  useStoreApp           } from 'stores/app'
import {  useStoreProducto      } from 'stores/producto'
import {  useStoreUser          } from 'stores/user'

//* ///////////////////////////////////////////////////////////////////////////////// Modelos
import {  IProductoDoli,
          ProductoDoli          } from '../models/ProductoDolibarr'
import {  IQuery                } from "src/models/Busqueda"
import {  TIPO_EDICION,
          TDatosEvento
                                } from "components/utilidades/AgGrid/AGTools"

//* ///////////////////////////////////////////////////////////////////////////////// Componibles
import {  useTools, 
          ToolType,
          ToolNum               } from "src/composables/useTools"
import {  servicesProductosPro  } from "src/areas/productos/services/servicesProductosNew"
import {  IRowNode              } from "ag-grid-community"

export function useControlProductosDolibarr() 
{
  const { aviso               } = useTools() 

  //* //////////////////////////////////////////////////////////////////////////////// 🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️🤵🏻‍♂️ Servicios
  const { //CrearProductos,
          BuscarProductos,
          //BuscarProductoByRef,
          EditarCampoEnLote,
                              } = servicesProductosPro()

  //* //////////////////////////////////////////////////////////////////////////////// 🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍🍍 Pinia
  const { usuario             } = storeToRefs( useStoreUser() )  

  const { busquedaPro : b,
          productos,
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
      const nuevosProductos :IProductoDoli[] = []
  
      for (let i = 0; i < filas; i++)
      {
        /* const newProducto           = new ProductoDoli( "nuevo" )
        newProducto.id              = ( productos.value.length + i + 1 ) + 1_000_000
        nuevosProductos.push( newProducto )
        productos.value.unshift( newProducto ) */
      }
    }

    function crearNuevasFilas( nuevosProductos : IProductoDoli[] )
    {
      tablaAG.value?.gridApi?.applyTransaction({
          add: nuevosProductos,
          addIndex: 0,
      })
    }
  
    function eliminarFila( id : number = 0 )
    {
      if(!id) return
      const index                 = productos.value.findIndex( p => p.id === id )
      if(index < 0 ) return 
      
      productos.value.splice( index, 1 )
    }


    function eliminarFilasPorId( ids : number[] )
    {
      const idsEliminar     = ids.map( n => { return { id: n }})
      tablaAG.value?.gridApi?.applyTransaction( { remove: idsEliminar } )
    }

  
    function copiarADatosTemporales()
    {
      //productos.value.forEach( p => p.copiarDatos() )
      tablaAG.value?.refreshCells( false )
    }
  
    function setEdicionEnProductos(){
      const editar                = modoEdicion.value === TIPO_EDICION.RANGO || modoEdicion.value === TIPO_EDICION.CELDA
      //productos.value.forEach( p => p.editable = editar )
      tablaAG.value?.refreshCells( true )
    }
  
    function limpiarFiltros(){
      filtro.value                = ""
      tablaAG.value?.limpiarFiltros()
    }

    function limpiarTabla()
    {
      limpiarFiltros()
      productos.value             = []

      const rowData : IRowNode<IProductoDoli>[] = [];
      tablaAG.value?.gridApi?.forEachNode     ( node => rowData.push( node.data ) )
      tablaAG.value?.gridApi?.applyTransaction( { remove: rowData } )
    }

    /* function ordenarPorOrden(){
      tablaAG.value?.volverAOrdenar()
    } */

    return {
      eliminarFila,
      limpiarTabla,
      limpiarFiltros,
      eliminarFilasPorId,
      crearNuevasFilas,
      crearFilasNuevosProductos,
      copiarADatosTemporales,
      //ordenarPorOrden,
      setEdicionEnProductos,
    }
  }

  //* //////////////////////////////////////////////////////////////////////////////// 👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻👼🏻 Crear productos
  function useCRUD()
  {
    async function crearProductos()
    {
      /* const productosCrear        = productos.value.filter( p => p.sePuedeCrear )
      
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
      const relaciones            = productosCrear.filter( p => !!p.idPadre ).map( p => p.productoPadreApi ) */
    }

  
    //* //////////////////////////////////////////////////////////////////////////////// ☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️☁️ Actualizar datos
    const cambios : TDatosEvento<IProductoDoli>[]= []
  
    // * ////////////////////////////////////////////////////////////////////////////////////////////////////// Procesar Edicion En Lote
    // * ///////////////////////////////////////////////////////////////////// Aca se reciben todos los cambios que se hacen en la tabla
    // * // Como recibe cabios por cada celda, y en una misma edicion, se pueden editar cientos de celdas, se hace el timeout 
    // * // ....para espererar que lleguen todas las ediciones de las cientos de celdas
    let   timeoutId : ReturnType<typeof setTimeout> | null = null;
    function procesarEdicionEnLote( d : TDatosEvento<IProductoDoli> )
    {
      if(!!d.data.esNuevo || d.campo === "esNuevo")
      {
        gestionarCambiosEnNuevo(d)
        return
      }
  
      cambios.push( d )
  
      if (timeoutId)  clearTimeout(timeoutId)    
      timeoutId               = setTimeout( subirCambiosEnLote , 200);
    }
    
    // * ///////////////////////////////////////////////////////////////////////////////////////////////// gestionar Cambios En Nuevo
    // * ////////////////////////////////////////////////////////////////////////////// Aca se reciben los de filas nuevas en la tabla
    async function gestionarCambiosEnNuevo( d : TDatosEvento<IProductoDoli> )
    {
      let revisarCampos         = false
      /* if(d.campo === "refPadre" || d.campo === "tipo")
      {
        if(d.data.tipo.value    === TIPO_PRO_PROVEEDOR.HIJO && d.data.refPadre.length > 3)
        {
          const producto        = await BuscarProductoByRef( d.data.refPadre )
          if(!!producto.id)
          {
            d.data              = ProductoDoli.getCopiaProducto( producto, d.data ) 
            d.data.idPadre      = producto.id
            revisarCampos       = true
          }
  
          d.data.okRefPadre     = !!producto.id
        }
      } */
  
      /*
      if(d.campo                === "ref"       || revisarCampos){
        const producto          = await BuscarProductoByRef( d.data.ref )
        const repetido          = productos.value.some( p => p.ref === d.data.ref && p.id != d.data.id ) 
        const muyCorto          = d.data.ref.length <= 2
        d.data.okRef            = !(!!producto.id || repetido || muyCorto )
      }*/
  
      if(d.campo                === "nombre"    || revisarCampos){
        const repetido          = productos.value.some( p => p.nombre === d.data.nombre && p.id != d.data.id ) 
        d.data.okNombre         = d.data.nombre.length >= 8 && !repetido
      }
      
      if(d.campo                === "tipo"      || revisarCampos)
        d.data.okTipo           = !!d.data.tipo.value
  
      /* if(d.campo                === "proveedor" || revisarCampos)
        d.data.okProveedor      = !!d.data.proveedor.id */
  
      if(d.campo                === "categoria" || revisarCampos)
        d.data.okCategoria      = !!d.data.categoria.id
  
      /* if(d.campo                === "hechoEn"   || revisarCampos)
        d.data.okHechoEn        = !!d.data.hechoEn.value
       */
      if(d.campo                === "precio"    || revisarCampos)
        d.data.okPrecio         = ToolType.anyToNum( d.data.precio ) != 0
  
      //const refrescarTodo       = !!d.data.sePuedeCrear
      //tablaAG.value?.refreshCells( refrescarTodo )
    }
  
    // * //////////////////////////////////////////////////////////////////////////////////////////////////////// subir Cambios En Lote
    // * ////////////////////////////////////////////////////////////////////////////// Aca se suben las ediciones en lote que se hacen 
    async function subirCambiosEnLote()
    {
      if(!cambios.length) return
      const nuevosCambios : TDatosEvento<IProductoDoli>[]= []
  
      const campo                 = cambios[0].campo
      if(campo.includes("_n")) {
        cambios.length            = 0
        return
      }
  
      loading.value.carga         = true
  
      for (const c of cambios)
      {
        console.group("subirCambiosEnLote");
        console.log("c: ", c);
        console.log("campo", campo);
        console.groupEnd();
        if(typeof c.value         ==  "boolean")
          c.value = ToolType.anyToNum( c.value )
        else if(c.value           === null && typeof c.oldValue == "boolean") c.value  = 0
        else if(c.value           === null && typeof c.oldValue == "number")  c.value  = 0
        else if(c.value           === null && typeof c.oldValue == "string")  c.value  = ""
        else if(                  // Objetos
              campo               === "categoria"
          ||  campo               === "tipo"
          ||  campo               === "naturaleza"
          ||  campo               === "unidad"
          ||  campo               === "garantiaMeses"
          ||  campo               === "hechoEn"
        )
        {
          c.value                 = ToolType.anyToNumOStr( c.value?.value )
        }

        c.value
        


        if( c.data.costo > 0
            &&
            (
                  campo  === "aumento"
              ||  campo  === "aumento_descuento"
              ||  campo  === "costo"
              ||  campo  === "costoExtra"
            )
        )
        {
          /* IFNULL(px.precio_publico,       0)          AS precio_publico,
          IFNULL(px.precio_promocion,     0)          AS precio_promocion,

          const campoEditar = 
          nuevosCambios.push({
            campo     : "disponible",
            index     : c.index,
            data      : c.data,
            value     : hayStock,
            oldValue  : c.oldValue,
            source    : "",
          }) */
        }
        /* if(campo                  === "activo")
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
        } */
      }
      
      const ok                    = await EditarCampoEnLote( campo, cambios, usuario.value.id )    
      cambios.length              = 0
      loading.value.carga         = false

      /* if(campo                    === "orden")
        ordenarPorOrden() */

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
  }

  //* //////////////////////////////////////////////////////////////////////////////// 🏁🏁🏁🏁🏁🏁🏁 Funciones de Page: iniciar y desmontar
  function useCicloDeVida()
  {
    const router                  = useRouter()

    async function iniciar()
    {
      productos.value             = []    
      tabs.value.activa           = "tab_1"
      modoEdicion.value           = TIPO_EDICION.BLOQUEDA
      await b.value.montarBusqueda( usuario.value.id, router, false, true, 50 )
    }
  
    function desmontar()
    {
      productos.value             = []
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
      productos.value             = await BuscarProductos( query, editable )
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

  const { crearFilasNuevosProductos,
          crearNuevasFilas,
          eliminarFila,
          eliminarFilasPorId,
          copiarADatosTemporales,
          setEdicionEnProductos,
          //ordenarPorOrden,
          limpiarFiltros,
          limpiarTabla,
                                  } = useGestionTabla()
  const { cambios,
          crearProductos,
          procesarEdicionEnLote,
                                  } = useCRUD()         
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