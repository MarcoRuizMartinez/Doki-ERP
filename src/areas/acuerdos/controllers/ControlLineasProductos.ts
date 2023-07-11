// * //////////////////////////////////////////////////////////////////////////////// Store
import {  storeToRefs           } from 'pinia'
import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
// * //////////////////////////////////////////////////////////////////////////////// Componibles
import {  useApiDolibarr        } from "src/composables/useApiDolibarr"
import {  servicesAcuerdos      } from "src/areas/acuerdos/controllers/servicesAcuerdos"
// * //////////////////////////////////////////////////////////////////////////////// Modelos
import {  IProductoDoli         } from "src/areas/productos/models/ProductoDolibarr"
import {  IGrupoLineas,
          GrupoLineas           } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"
import {  LineaAcuerdo,
          ILineaAcuerdo         } from "src/areas/acuerdos/models/LineaAcuerdo"
// * //////////////////////////////////////////////////////////////////////////////// Tools
import {  useTools,
          pausa                 } from "src/composables/useTools"

export function useControlProductos()
{
  const { aviso               } = useTools()
  const { ordenarLineas,
          setCostoLinea,
                              } = servicesAcuerdos()
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

  function mostrarBuscarProductos( grupo : IGrupoLineas ){
    grupoElegido.value              = grupo
    grupoElegido.value.seleccion    = []
    modales.value.añadirProductos   = true
  }

  function mostrarOrdenarProductos( grupo : IGrupoLineas ){
    grupoElegido.value              = grupo
    modales.value.ordenar           = true
  }

  async function deGruposAProductos()
  {    
    await borrarGruposSinProductos()
    acuerdo.value.productos         = GrupoLineas.getProductosDesdeGrupos( acuerdo.value.proGrupos )
    if(!acuerdo.value.esEstadoBoceto){
      ordenarLineasEnDolibarr()
    }

    if(!acuerdo.value.proGrupos.length)
      crearNuevoGrupo()
  }

  async function editarCostoLinea( costo : number, lineaId : number ) : Promise<boolean>
  {    
    const ok = await setCostoLinea( costo, lineaId, acuerdo.value.tipo )

    if(ok)
      aviso("positive", "Costo editado")

    return ok
  }


  async function ordenarLineasEnDolibarr()
  {
    if(acuerdo.value.productos.length < 2) return
    let ids = acuerdo.value.productos.map( p => p.lineaId ).join()
    if(!ids) return
    let ok  = await ordenarLineas(ids, acuerdo.value.id, acuerdo.value.tipo)
    if(!ok && acuerdo.value.productos.length >= 1)
      aviso("negative", "Error al ordenar")
  }


  async function agregarProductos( productosAdd : IProductoDoli[] = [],  cantidad : number = 1 ) : Promise<boolean>
  {
    loading.value.añadir      = true
    const productosAñadidos   : ILineaAcuerdo[] = []

    // * !productosAdd.length es porque es ejecutado desde, Cambiarle nombre al grupo.
    // * El unico grupo que no tiene titulo creado es el primero. Solo se crea cuando se edita el nombre...
    // * ... pero como por defecto, este titulo no se crea, de alguna forma toca saber cuando toca crearlo
    if(grupoElegido.value.hayQueCrearTitulo || !productosAdd.length)
      productosAñadidos.push( LineaAcuerdo.getTitulo( grupoElegido.value.titulo ) )

    if(!!productosAdd.length)
      productosAñadidos.push(...LineaAcuerdo.lineasDeProductos( productosAdd.filter(p => p.activo), cantidad, acuerdo.value.conIVA ))

    let mayorOrden            = Math.max( ...grupoElegido.value.productos.map( p => p.orden ) )
        mayorOrden            = mayorOrden === -Infinity ? 0 : mayorOrden

    for (const [i, linea] of productosAñadidos.entries())
    {
      linea.orden             = mayorOrden + i + 1 // Luego se vuelve a ordenar
      //linea.iva               = acuerdo.value.tercero.aplicaIVA ? +process.env.IVA : 0

      if(!acuerdo.value.esEstadoBoceto){
        linea.lineaId         = await crearLineaEnApi( linea )

        if(!linea.lineaId){
          console.warn("Error al crear linea")
          return false
        }
      }

      if(linea.esTitulo){
        grupoElegido.value.lineaIdTitulo  = linea.lineaId
        grupoElegido.value.tituloCreado   = true
      }
      else
      {
        linea.destacar( "guardar" )
        grupoElegido.value.productos.push(linea)
      }
    }

    loading.value.añadir      = false
    deGruposAProductos()
    return true
  }

  async function copiarProductos( lineasAdd : ILineaAcuerdo[] ) : Promise<boolean>
  {
    if(acuerdo.value.esEstadoBoceto || !lineasAdd.length) return false
    loading.value.carga       = true

    for (const linea of lineasAdd){
      linea.lineaId           = await crearLineaEnApi( linea )
      if(!linea.lineaId){ 
        aviso("negative", "Error al crear producto")
        return false
      }
    }
    aviso("positive", "Productos creados")
    loading.value.carga       = false
    return true
  }

  async function crearLineaEnApi( nuevaLinea : ILineaAcuerdo ) : Promise<number>
  {
    if(acuerdo.value.esEstadoBoceto) return 0

    const lineaAPI        = LineaAcuerdo.lineaToLineaApi( nuevaLinea )
    const { data, ok }    = await apiDolibarr("crear-linea", acuerdo.value.tipo, lineaAPI, acuerdo.value.id)
    if(ok){
      const newId : number= !!data ? +data : 0
      return newId
    }

    return 0
  }

  async function editarLinea( linea : ILineaAcuerdo ) : Promise<boolean>
  {
    loading.value.editarLinea   = true
    const lineaForAPI           = LineaAcuerdo.lineaToLineaApi( linea )
    let seguir                  = true
    if(!acuerdo.value.esEstadoBoceto){
      const {ok}                = await apiDolibarr("editar-linea", acuerdo.value.tipo, lineaForAPI, acuerdo.value.id )
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
    if(!acuerdo.value.id) return
    await pausa(200) // Para darle tiempo que el virtual DOM genere el nuevo espacio y calcule el nuevo alto del documento
    //console.log(Maco"window.scrollTo")
    window.scrollTo({ top: document.body.scrollHeight,  behavior: 'smooth'})
  }

  async function borrarGruposSinProductos()
  {
    if(acuerdo.value.esEstadoBoceto) return
    for( let i = acuerdo.value.proGrupos.length - 1; i >= 0 ; i--)
    {
      const grupo           = acuerdo.value.proGrupos[i]
      const sinProductos    = !grupo.productos.length

      if(sinProductos)
      {
        if( grupo.totalCreado )
          await borrarSubtotal( grupo )
        if( grupo.tituloCreado )
          await borrarTitulo( grupo )

        acuerdo.value.proGrupos.splice(grupo.index, 1)            // Borrar Grupo
        acuerdo.value.proGrupos.forEach( (g, i)  => g.index = i ) // Reasignar Index
      }
    }
  }





  async function borrarLinea( lineaBorrar : ILineaAcuerdo, enLote = false, retrasoBorrar = 1200 ) :Promise<boolean>
  {
    lineaBorrar.accion          = "borrar"
    if(!enLote)
      loading.value.borrarLinea = true

    let seguir                  = true
    let info  : any

    if(!acuerdo.value.esEstadoBoceto){
      let {ok, data}            = await apiDolibarr("borrar-lineas", acuerdo.value.tipo, lineaBorrar.lineaId, acuerdo.value.id )
      seguir                    = ok
      info                      = data

      if(!ok){
        console.error('Error al eliminar linea: ', info)
        modalYLoadingOff()
        return false
      }
    }

    if((seguir || acuerdo.value.esEstadoBoceto) && !enLote ){
      aviso("positive", "Producto borrado")
      modalYLoadingOff()
    }

    ocultarLineaBorrada()

    function ocultarLineaBorrada(){
      const i                    = grupoElegido.value.productos.findIndex( (p:any) => p.orden == lineaBorrar.orden )
      setTimeout( ( index = i )=>
      {
        grupoElegido.value.productos.splice(index, 1)
        if(!enLote){
          grupoElegido.value.seleccion = []
          deGruposAProductos()
        }        
      }, retrasoBorrar )
    }

    function modalYLoadingOff(){
      loading.value.borrarLinea = false
      modales.value.formulario  = false
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
      await pausa( retrasoEntreLineas )
    }
    loading.value.borrarLote      = false
    aviso("positive", grupoElegido.value.seleccion.length === 1 ? "Producto borrado" : "Productos borrados")
    grupoElegido.value.seleccion  = []
    deGruposAProductos()
  }

  async function editarCantidad( linea : ILineaAcuerdo ) {
    lineaElegida.value            = linea
    if(acuerdo.value.esEstadoBoceto) {
      edicionOk()
      return
    }

    const objecto               = { qty: lineaElegida.value.qty, id: lineaElegida.value.lineaId }
    let {ok}                    = await apiDolibarr("editar-linea", acuerdo.value.tipo, objecto, acuerdo.value.id )
    if  (ok) edicionOk()

    function edicionOk(){
      aviso("positive", "Cantidad cambiada")
      lineaElegida.value.destacar("guardar", "ocultar")
      deGruposAProductos()      
    }
  }

  async function editarDescuento( linea : ILineaAcuerdo ) {
    lineaElegida.value            = linea
    if(acuerdo.value.esEstadoBoceto) {
      edicionOk()
      return
    }

    const objecto               = { remise_percent: lineaElegida.value.descuentoX100, id: lineaElegida.value.lineaId }
    let {ok}                    = await apiDolibarr("editar-linea", acuerdo.value.tipo, objecto, acuerdo.value.id )
    if  (ok) edicionOk()

    function edicionOk(){
      aviso("positive", "Descuento cambiado")
      lineaElegida.value.destacar("guardar", "ocultar")
      deGruposAProductos()
    }
  }

  async function editarSubTotales( subTotalOn :boolean , grupo : IGrupoLineas )
  {
    grupo.conTotal              = subTotalOn
    if(acuerdo.value.esEstadoBoceto) {
      grupo.totalCreado         = subTotalOn
      return
    }

    loading.value.subtotal      = true    

    if(subTotalOn && !grupo.totalCreado){      
      const idLinea             = await crearLineaEnApi( LineaAcuerdo.getSubTotal() )
      if(!!idLinea){
        grupo.lineaIdSubtotal   = idLinea
      }
    }
    else
    if(!subTotalOn && grupo.totalCreado) // quiere decir que si hay una fila en DB y debe ser eliminada
    {
      await borrarSubtotal( grupo )
    }
    grupo.totalCreado           = subTotalOn
    loading.value.subtotal      = false
    deGruposAProductos()
  }

  async function borrarSubtotal( grupo : IGrupoLineas ) {
    let {ok}                    = await apiDolibarr("borrar-lineas", acuerdo.value.tipo, grupo.lineaIdSubtotal, acuerdo.value.id )
    if(ok){
      grupo.lineaIdSubtotal     = 0
      grupo.totalCreado         = false
      grupo.conTotal            = false
    }
    else
      aviso("negative", "Error al borrar subtotal")
  }

  async function borrarTitulo( grupo : IGrupoLineas ) {
    let {ok}                    = await apiDolibarr("borrar-lineas", acuerdo.value.tipo, grupo.lineaIdTitulo, acuerdo.value.id )
    if(ok){
      grupo.lineaIdTitulo       = 0
      grupo.tituloCreado        = false
    }
    else
      aviso("negative", "Error al borrar subtotal")
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
        let {ok, data}        = await apiDolibarr("editar-linea", acuerdo.value.tipo, lineaAPI, acuerdo.value.id )

        if(ok)
          linea.destacar( "guardar", "ocultar" )
      }
    }

    loading.value.editarLote    = false
    modales.value.editarEnLote  = false
    aviso("positive", grupoElegido.value.seleccion.length === 1 ? "Producto editado" : "Productos editados")
    deGruposAProductos()  }


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

  async function editarTituloGrupo( nuevoTitulo :string , grupo : IGrupoLineas )
  {
    grupo.titulo                = nuevoTitulo.trim() //mayusculasPrimeraLetra( nuevoTitulo ).trim()
    loading.value.editarGrupo   = true

    if(!grupo.tituloCreado){
      grupoElegido.value        = grupo
      await agregarProductos()
    }
    else
    {
      let lineaEdit             = { id: grupo.lineaIdTitulo, label: grupo.titulo }
      let {ok, data}            = await apiDolibarr("editar-linea", acuerdo.value.tipo, lineaEdit, acuerdo.value.id)
      if(!ok) aviso("negative", "Error al cambiar nombre de grupo")
    }

    aviso("positive", "Titulo editado")
    loading.value.editarGrupo = false
  }

  function moverGrupo( index: number, accion: "subir" | "bajar" )
  {
    let ope                     = accion == "subir" ? -1 : 1
    acuerdo.value.proGrupos[ index      ].index = index + ope
    acuerdo.value.proGrupos[ index + ope].index = index
    acuerdo.value.proGrupos  = acuerdo.value.proGrupos.sort ( ( a : IGrupoLineas, b : IGrupoLineas ) =>
                                  {
                                    if(a.index < b.index) return -1
                                    if(a.index > b.index) return 1
                                    return 0
                                  })
    deGruposAProductos()
  }

  function seleccionarLineas( grupo : IGrupoLineas )
  {
    acuerdo.value.proGrupos.forEach(( g )=>{
      if(g.index !== grupo.index)
        g.seleccion             = []
    })
  }

  //* /////////////////////////////////////////////////////////////// Return
  return {
    agregarProductos,
    crearNuevoGrupo,
    borrarLinea,
    borrarLineas,
    editarLinea,
    //editarCantidad,
    //editarDescuento,
    editarSubTotales,
    editarEnLoteQtyYDescu,
    mostrarFormularioLinea,
    mostrarBuscarProductos,
    mostrarOrdenarProductos,
    destacarLineaElegida,
    editarTituloGrupo,
    moverGrupo,
    seleccionarLineas,
    copiarProductos,
    deGruposAProductos,
    editarCostoLinea,
  }
}
