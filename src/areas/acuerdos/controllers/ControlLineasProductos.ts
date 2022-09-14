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
  const storeAcuerdo            = useStoreAcuerdo()
  const { apiDolibarr         } = useApiDolibarr()
  const { acuerdo,
          grupoElegido,
          lineaElegida,
          loading,
          modales             } = storeToRefs(storeAcuerdo)  

  async function agregarProductos( productoAdd : IProductoDoli[],  cantidad : number, descuento : number )
  {
    if(!productoAdd.length) return
    loading.value.añadir      = true
    const productosAñadidos   = LineaAcuerdo.lineasDeProductos( productoAdd.filter(p => p.activo), cantidad, descuento )

    if(!!acuerdo.value.id)
    {    
      for (const linea of productosAñadidos)
      {
        const mayorOrden      = Math.max( ...grupoElegido.value.productos.map( p => p.orden ) ) 
        //console.log("mayorOrden: ", !!mayorOrden, mayorOrden, grupoElegido.value);
        linea.orden           = mayorOrden === -Infinity ? 1 : mayorOrden + 1
        linea.iva             = acuerdo.value.tercero.aplicaIVA ? +process.env.IVA : 0
        let lineaAPI          = LineaAcuerdo.lineaToLineaApi( linea )
        let { data, ok }      = await apiDolibarr("crear-linea", "cotizacion", lineaAPI, acuerdo.value.id)
        if(ok)
        {
          let newId : number  = !!data ? +data : 0 
          linea.lineaId       = newId
          linea.destacar( "guardar" )          
          grupoElegido.value.productos.push(linea)
        }
      }
    }

    loading.value.añadir      = false
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
    window.scrollTo({ top: document.body.scrollHeight,  behavior: 'smooth'})
  }


  async function borrarLinea( lineaBorrar : ILineaAcuerdo ) :Promise<boolean>
  {
    lineaElegida.value.accion = "borrar"
    loading.value.borrarLinea = true    

    const estadoBoceto        = acuerdo.value.estado === ESTADO_CTZ.NO_GUARDADO
    let seguir                = true
    let info  : any
    if(!estadoBoceto){
      let {ok, data}          = await apiDolibarr("borrar-lineas", "cotizacion", lineaElegida.value.lineaId, acuerdo.value.id /* lineaElegida.value.padreId */ )
      seguir                  = ok
      info                    = data

      if(!ok) return false
    }
      
    if(seguir || estadoBoceto)
    {
      aviso("positive", "Producto borrado")
    }
    else
    {
      console.error('Error al eliminar linea: ', info);
    }

    loading.value.borrarLinea   = false
    modales.value.formulario    = false

    let i                       = grupoElegido.value.productos.findIndex( p => p.orden == lineaElegida.value.orden )
    setTimeout( ()=>
      {
        grupoElegido.value.productos.splice(i, 1)
        //emitir()
        grupoElegido.value.seleccion = []
      }, 1200 ) 
    
    return true
  }


  async function borrarLineas()
  {
    loading.value.borrarLote    = true
    for (const linea of grupoElegido.value.seleccion)
    {
      let { ok, data }= await apiDolibarr("borrar-lineas", "cotizacion", linea.lineaId, linea.padreId )
      linea.destacar( "borrar", "ocultar" )
      await pausa(1000)
    }
    loading.value.borrarLote    = false
    aviso("positive", grupoElegido.value.seleccion.length === 1 ? "Producto borrado" : "Productos borrados")

  }

  async function editarCantidad( linea : ILineaAcuerdo ) {
    if(acuerdo.value.estado     === ESTADO_CTZ.NO_GUARDADO) return    
    const objecto               = { qty: linea.qty, id: linea.lineaId }
    let {ok}                    = await apiDolibarr("editar-linea", "cotizacion", objecto, acuerdo.value.id )
    if(ok){
      aviso("positive", "Cantidad cambiada")
      linea.destacar("guardar", "ocultar")
    }
  }

  async function editarDescuento( linea : ILineaAcuerdo ) {
    if(acuerdo.value.estado     === ESTADO_CTZ.NO_GUARDADO) return
    const objecto               = { remise_percent: linea.descuentoX100, id: linea.lineaId }
    let {ok}                    = await apiDolibarr("editar-linea", "cotizacion", objecto, acuerdo.value.id )
    if(ok){ 
      aviso("positive", "Descuento cambiado")
      linea.destacar("guardar", "ocultar")
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
        
      if(descuento !== undefined || !!cantidad)
      {
        let lineaAPI          = LineaAcuerdo.lineaToLineaApi( linea )
        let {ok, data}        = await apiDolibarr("editar-linea", "cotizacion", lineaAPI, acuerdo.value.id )

        if(ok)
        {
          console.log("Tabla productos ok antes destacar ")
          linea.destacar( "guardar", "ocultar" )
        }
      }
    }

    loading.value.editarLote    = false
    modales.value.editarEnLote  = false
    aviso("positive", grupoElegido.value.seleccion.length === 1 ? "Producto editado" : "Productos editados")
  }  
  //* /////////////////////////////////////////////////////////////// Return
  return {
    agregarProductos,
    crearNuevoGrupo,
    borrarLinea,
    borrarLineas,
    editarCantidad,
    editarDescuento,
    editarSubTotales,
    editarEnLoteQtyYDescu
  }
}