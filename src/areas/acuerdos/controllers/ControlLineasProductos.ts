// * //////////////////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'
import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
// * //////////////////////////////////////////////////////////////////////////////// Servicios
import {  useApiDolibarr        } from "src/services/useApiDolibarr"
// * //////////////////////////////////////////////////////////////////////////////// Modelos
import {  IProductoDoli         } from "src/areas/productos/models/ProductoDolibarr"
import {  IGrupoLineas,
          GrupoLineas           } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"
import {  LineaAcuerdo,
          ILineaAcuerdo         } from "src/areas/acuerdos/models/LineaAcuerdo"
// * //////////////////////////////////////////////////////////////////////////////// Tools
import {  ESTADO_CTZ            } from "../models/Acuerdo"
import {  useTools, pausa       } from "src/useSimpleOk/useTools"


export function useControlProductos()
{
  const { aviso               } = useTools()
  const { apiDolibarr         } = useApiDolibarr()
  const { acuerdo,
          grupoElegido,
          lineaElegida,
          loading,
          modales             } = storeToRefs( useStoreAcuerdo() )


  // * ////////////////////////////////////////////////// Mostrar formulario 
  function mostrarFormularioLinea( linea : ILineaAcuerdo, grupo : IGrupoLineas ){
    grupoElegido.value              = grupo
    grupoElegido.value.seleccion    = []
    lineaElegida.value              = linea
    modales.value.formulario        = true
  }


  function mostrarBuscarProductos( grupo : IGrupoLineas )
  {
    grupoElegido.value              = grupo
    grupoElegido.value.seleccion    = []
    modales.value.añadirProductos   = true
  }

  async function agregarProductos( productoAdd : IProductoDoli[],  cantidad : number, descuento : number )
  {
    if(!productoAdd.length) return

    loading.value.añadir      = true
    const productosAñadidos   = LineaAcuerdo.lineasDeProductos( productoAdd.filter(p => p.activo), cantidad, descuento )
    
    // let   hayQueCrearSubtotal = false
    // if(!grupoElegido.value.productos.length) // Quiere decir que no hay productos en ese grupo
    //   hayQueCrearSubtotal     = true

    for (const linea of productosAñadidos)
    {
      
      const mayorOrden        = Math.max( ...grupoElegido.value.productos.map( p => p.orden ) )
      linea.orden             = mayorOrden === -Infinity ? 1 : mayorOrden + 1
      linea.iva               = acuerdo.value.tercero.aplicaIVA ? +process.env.IVA : 0
      if(!acuerdo.value.esEstadoBoceto ) {
        let lineaAPI          = LineaAcuerdo.lineaToLineaApi( linea )
        let { data, ok }      = await apiDolibarr("crear-linea", "cotizacion", lineaAPI, acuerdo.value.id)        
        if(ok){
          let newId : number  = !!data ? +data : 0
          linea.lineaId       = newId        
        }
      }
      
      linea.destacar( "guardar" )
      grupoElegido.value.productos.push(linea)      
    }

    loading.value.añadir      = false
  }

  async function editarLinea( linea : ILineaAcuerdo ) : Promise<boolean>
  {
    loading.value.editarLinea   = true
    let lineaForAPI             = LineaAcuerdo.lineaToLineaApi( linea )
    let seguir                  = true
    if(!acuerdo.value.esEstadoBoceto){
      let {ok, data}            = await apiDolibarr("editar-linea", "cotizacion", lineaForAPI, acuerdo.value.id )
      seguir                    = ok
      if(!ok){      
        modalYLoadingOff()               
        return false
      }
    }
    
    if(seguir || acuerdo.value.esEstadoBoceto)
    {
      lineaElegida.value        = Object.assign( lineaElegida.value, linea ) // Object.assign es para que no pierda la identidad o referencia
      lineaElegida.value.destacar( "guardar", "ocultar" )
      aviso("positive", "Producto editado")
      modalYLoadingOff()
    }

    function modalYLoadingOff(){
      loading.value.editarLinea   = false
      modales.value.formulario    = false
    }
    
    return true
  }


  //* /////////////////////////////////////////////////////////////// Crear nuevo grupo vacio
  async function crearNuevoGrupo()
  {
    let index                   = acuerdo.value.proGrupos.length
    let nuevoGrupo              = new GrupoLineas( index )
    acuerdo.value.proGrupos.push( nuevoGrupo )

    if(!!index)
      aviso("positive", "Nuevo grupo creado")
    await pausa(200) // Para darle tiempo que el virtual DOM genere el nuevo espacio y calcule el nuevo alto del documento
    //console.log(Maco"window.scrollTo")
    window.scrollTo({ top: document.body.scrollHeight,  behavior: 'smooth'})
  }


  async function borrarLinea( lineaBorrar : ILineaAcuerdo, enLote = false, retrasoBorrar = 1200 ) :Promise<boolean>
  {
    lineaBorrar.accion        = "borrar"
    loading.value.borrarLinea = true

    let seguir                = true
    let info  : any

    if(!acuerdo.value.esEstadoBoceto){
      let {ok, data}          = await apiDolibarr("borrar-lineas", "cotizacion", lineaBorrar.lineaId, acuerdo.value.id /* lineaElegida.value.padreId */ )
      seguir                  = ok
      info                    = data

      if(!ok){ 
        console.error('Error al eliminar linea: ', info)        
        modalYLoadingOff()
        return false
      }
    }

    if((seguir || acuerdo.value.esEstadoBoceto) && !enLote ){
      aviso("positive", "Producto borrado")
    }

    ocultarLineaBorrada()
    modalYLoadingOff()

    function ocultarLineaBorrada(){
      let i                       = grupoElegido.value.productos.findIndex( (p:any) => p.orden == lineaBorrar.orden )
      setTimeout( ( index = i )=>
      {
          grupoElegido.value.productos.splice(index, 1)
          if(!enLote)
            grupoElegido.value.seleccion = []
        }, retrasoBorrar )
    }

    function modalYLoadingOff(){
      loading.value.borrarLinea   = false
      modales.value.formulario    = false
    }      


    return true
  }


  async function borrarLineas( retrasoEntreLineas = 1200 )
  {
    loading.value.borrarLote      = true
    for (const linea of grupoElegido.value.seleccion)
    {
      await borrarLinea( linea, true, retrasoEntreLineas )
      linea.destacar( "borrar", "ocultar")
      await pausa(retrasoEntreLineas)
    }
    loading.value.borrarLote      = false
    aviso("positive", grupoElegido.value.seleccion.length === 1 ? "Producto borrado" : "Productos borrados")
    grupoElegido.value.seleccion  = []
  }

  async function editarCantidad( linea : ILineaAcuerdo ) {
    
    if(acuerdo.value.esEstadoBoceto){
      linea.destacar("guardar", "ocultar")
      return
    }

    const objecto               = { qty: linea.qty, id: linea.lineaId }
    let {ok}                    = await apiDolibarr("editar-linea", "cotizacion", objecto, acuerdo.value.id )
    if(ok){
      aviso("positive", "Cantidad cambiada")
      linea.destacar("guardar", "ocultar")
    }
  }

  async function editarDescuento( linea : ILineaAcuerdo ) {
    if(acuerdo.value.esEstadoBoceto) {
      linea.destacar("guardar", "ocultar")
      return
    }    
    const objecto               = { remise_percent: linea.descuentoX100, id: linea.lineaId }
    let {ok}                    = await apiDolibarr("editar-linea", "cotizacion", objecto, acuerdo.value.id )
    if(ok){
      aviso("positive", "Descuento cambiado")      
    }
  }

  async function editarSubTotales( conSubTotal :boolean , grupo : IGrupoLineas )
  {
    grupo.conTotal              = conSubTotal
    if(conSubTotal)
    {
    }
    else if(!!grupo.lineaIdSubtotal) // quiere decir que si hay una fila en DB y debe ser eliminada
    {
      let {ok, data}            = await apiDolibarr("borrar-lineas", "cotizacion", grupo.lineaIdSubtotal, grupo.padreId )
      if(ok)
      {
        grupo.lineaIdSubtotal   = 0
      }
    }
  }

  async function editarEnLoteQtyYDescu( cantidad : number | undefined, descuento : number | undefined, addDescuento : boolean)
  {
    loading.value.editarLote  = true
    for (const linea of grupoElegido.value.seleccion)
    {
 

      if(!!cantidad)
        linea.qty             = cantidad

      if(!!descuento || descuento === 0)
      {
        if(addDescuento && descuento > 0)
          linea.descuentoX100 += descuento
        else
          linea.descuentoX100 = descuento
      }

      if(acuerdo.value.esEstadoBoceto) {
        linea.destacar("guardar", "ocultar")
        continue
      }   
      else      
      if(descuento !== undefined || !!cantidad)
      {
        let lineaAPI          = LineaAcuerdo.lineaToLineaApi( linea )
        let {ok, data}        = await apiDolibarr("editar-linea", "cotizacion", lineaAPI, acuerdo.value.id )

        if(ok)
          linea.destacar( "guardar", "ocultar" )
      }
    }

    loading.value.editarLote    = false
    modales.value.editarEnLote  = false
    aviso("positive", grupoElegido.value.seleccion.length === 1 ? "Producto editado" : "Productos editados")
  }


  function destacarLineaElegida( mostrarForm : boolean )
  {
    if(mostrarForm)
      lineaElegida.value.destacar( "seleccionar" )
    else
    {
      if(lineaElegida.value.accion === "borrar")
        lineaElegida.value.destacar( "borrar", "ocultar")
      else {
        lineaElegida.value.destacar( "no-destacar" )
        lineaElegida.value          = new LineaAcuerdo()
      }
    }
  }




  //* /////////////////////////////////////////////////////////////// Return
  return {
    agregarProductos,
    crearNuevoGrupo,
    borrarLinea,
    borrarLineas,
    editarLinea,
    editarCantidad,
    editarDescuento,
    editarSubTotales,
    editarEnLoteQtyYDescu,
    mostrarFormularioLinea,
    mostrarBuscarProductos,
    destacarLineaElegida
  }
}
