<template>
  <ventana                      minimizar
    :titulo                     ="acuerdo.estado === ESTADO_CTZ.NO_GUARDADO ? 'Consultar productos - No se guardan en cotizacion... por ahora. enserio🙏😱😩🤯' : 'Productos'"
    icono                       ="mdi-package-variant-closed"
    padding-contenido           ="0"
    >
    <template                   #barra
      v-if                      ="acuerdo.estado <= 0" 
      >
      <!-- //* ///////////////////////////////////////////////////////////// Boton nuevo grupo   -->
      <q-btn
        v-bind                  ="btnBaseSm"
        label                   ="Nuevo grupo"
        color                   ="positive"
        icon                    ="mdi-tab-plus"
        @click                  ="crearNuevoGrupo"
      />
    </template>
    <q-list                   
      class                     ="fit"
      >
      <!-- //* ///////////////////////////////////////////////////////////////  For expansion item -->
      <q-expansion-item         expand-separator default-opened dense expand-icon-toggle dense-toggle
        v-for                   ="(grupo, index) of acuerdo.proGrupos"
        :index                  ="grupo.index"
        header-class            ="bg-gris-dark text-white"
        expand-icon-class       ="text-white q-pr-none"
        >
        <!-- //* ///////////////////////////////////////////////////////////// Slot cabezote expansion item-->
        <template               #header>
          <q-item-section       avatar class="hidden"></q-item-section>
          <q-item-section class ="q-my-sm">
            <editar-grupo
              :acuerdo          ="acuerdo"
              :grupo            ="grupo"
              @moverGrupo       ="cambioEnGrupos( 'moverGrupo' )"
              @borrar-todo      ="( ( grupo : any) => borrarGrupo(grupo, 'borrar'    ) )"
              @borrar-conservar ="( ( grupo : any) => borrarGrupo(grupo, 'conservar' ) )"
            />
          </q-item-section>
          <q-item-section       side
            v-if                ="acuerdo.estado <= 0" 
            >
            <div class          ="row items-center">
              <!-- //* /////////////////////////////////////////////////////// Boton agregar producto  -->
              <q-btn            
                v-bind          ="btnBaseSm"
                class           ="text-black"
                color           ="grey-1"
                label           ="Producto"
                icon            ="mdi-plus"
                @click          ="mostrarBuscarProductos(grupo)"
                >
                <Tooltip label  ="Agregar productos"/>
              </q-btn>            
            </div>
          </q-item-section>
        </template>
        <!-- //* ///////////////////////////////////////////////////////////// Tabla productos  -->
        <tabla-productos
          :grupo                ="grupo"
          :estado               ="acuerdo.estado"  
          @editar-sub-totales   ="cambioEnGrupos( 'editarSubTotales')"
          @update:grupo         ="cambioEnGrupos( 'tablaProductos')"
        />
      </q-expansion-item>
    </q-list>
    <q-dialog                   maximized
      v-model                   ="ventanaProductos"
      transition-show           ="slide-up"
      transition-hide           ="slide-down"
      >
      <buscar-productos
        v-model:grupo           ="grupoSelect"
        :cotizacion-id          ="acuerdo.id"
        :con-iva                ="acuerdo.tercero.aplicaIVA"
        @update:grupo           ="addProductosDeBusqueda"
        @eliminar-linea-id      ="eliminarLineaDesdeBusqueda"     
        @cerrar                 ="ventanaProductos = false; grupoSelect.noDestacarProductos()"
      />
    </q-dialog>
  </ventana>
</template>
<script setup lang="ts">
  import    ventana             from "components/utilidades/Ventana.vue"
  import    tablaProductos      from "src/areas/acuerdos/components/TablaProductos.vue"
  import    buscarProductos     from "src/areas/acuerdos/components/Modals/BuscarAgregarProductos.vue"

  import {  ref,
            toRefs,
            computed,
            watch,
            onMounted
                              } from "vue"
  import {  ICotizacion,
            ESTADO_CTZ        } from "src/areas/acuerdos/cotizaciones/models/Cotizacion"
  import {  IAcuerdo          } from "src/areas/acuerdos/models/Acuerdo"                        
  import {  ITercero          } from "src/areas/terceros/models/Tercero"
  import {  IGrupoLineas,
            GrupoLineas       } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"            
  import {  servicesCotizaciones   } from "src/areas/acuerdos/cotizaciones/services/servicesCotizaciones"
  import {  useTools, pausa   } from "src/useSimpleOk/useTools"
  import {  btnBaseSm         } from "src/useSimpleOk/useEstilos"
  import {  ILineaAcuerdo,
            LineaAcuerdo      } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  useApiDolibarr    } from "src/services/useApiDolibarr"
  import    editarGrupo         from "src/areas/acuerdos/components/Grupos/EditarGrupo2.vue"
  import {  storeToRefs       } from 'pinia'                            
  import {  useStoreAcuerdo   } from 'src/stores/acuerdo'  

  const { acuerdo           } = storeToRefs( useStoreAcuerdo() )  

  type SourcesEdit              = "tablaProductos" | "otrosOrigenes" | "buscarProductos" | "borrarGrupo" | "editarSubTotales" | "moverGrupo" | "borrarLineaFromBusqueda"
  const terceros                = ref< ITercero[] > ([])
  const { aviso               } = useTools()
  const { ordenarLineas       } = servicesCotizaciones()
  const { apiDolibarr         } = useApiDolibarr()
  const emit                    = defineEmits(["update:cotizacion"])
  const ventanaProductos        = ref< boolean >( false )
  
  const totalTem                = computed( ()=> 
    !!acuerdo.value.proGrupos.length ? acuerdo.value.proGrupos[0].totalConDescu : 0
  )
  const largo                   = computed( ()=> acuerdo.value.proGrupos.length )
  const grupoSelect             = ref< IGrupoLineas >( new GrupoLineas() ) 

  //const gruposProductos         = ref<IGrupoLineas[]>([])
  
  let esVirgen                  = true

  onMounted(()=>{
   // if(acuerdo.value.estado  === ESTADO_CTZ.NO_GUARDADO)
   //   crearNuevoGrupo()
  })

  watch( () => acuerdo.value.productos, (newProductos, oldProductos) => {
    if(acuerdo.value.estado  !== ESTADO_CTZ.NO_GUARDADO && !newProductos.length) // Crea un grupo si no hay productos
      crearNuevoGrupo()
    
    if(newProductos.length > 0 && oldProductos.length === 0 )
    {
      esVirgen                    = false
      actualizarArrayGrupos( newProductos )      
      borrarGruposSinProductos()
    }
  })

  function actualizarArrayGrupos( lineas : ILineaAcuerdo[] )
  {
    if(lineas.length > 0)
      acuerdo.value.proGrupos  = GrupoLineas.productosAgrupoDeProductos( lineas )
    else 
      crearNuevoGrupo()
  }

  function mostrarBuscarProductos( grupo : IGrupoLineas )
  {
    grupoSelect.value           = grupo
    ventanaProductos.value      = true
  }


  async function eliminarLineaDesdeBusqueda( idProducto : number )
  {
    //* ///////////// Horribleeeeee
    const index = grupoSelect.value.productos.findIndex((p )=> p.id === idProducto )
    grupoSelect.value.productos[index].borrar = true
    await cambioEnGrupos('borrarLineaFromBusqueda')
    grupoSelect.value.productos.splice(index, 1)
    let indexGrupo = acuerdo.value.proGrupos.findIndex( g => g.index === grupoSelect.value.index ) 
    acuerdo.value.proGrupos[indexGrupo] = grupoSelect.value
  }



  async function cambioEnGrupos( origen : SourcesEdit = "otrosOrigenes" )
  {
    acuerdo.value.productos      = GrupoLineas.deGruposAProductos( acuerdo.value.proGrupos )

    if(!!acuerdo.value.id)
    {
      for (const linea of acuerdo.value.productos)
      {
        // Crear lineas nuevas como titulo y subtotal
        if
        ( linea.lineaId             == 0
          &&
          linea.tipo                == 9
          &&
          ( origen                  == "editarSubTotales"
            ||
            origen                  == "buscarProductos" 
          )
        )
        {
          let lineaApi              = LineaAcuerdo.lineaToLineaApi( linea )
          let { data, ok }          = await apiDolibarr("crear-lineas", "cotizacion", lineaApi, acuerdo.value.id)

          if(ok)
          {
            let newId               = !!data ? +data : 0 
            linea.lineaId           = newId

            const grupo             = acuerdo.value.proGrupos.at(-1)
            
            if(linea.tipoLinea      === "titulo"  && !!grupo)
              grupo.lineaIdTitulo   = linea.lineaId
            else
            if(linea.tipoLinea      === "subtotal" && !!grupo)
              grupo.lineaIdSubtotal = linea.lineaId
            
          }
          else
            aviso("negative", "Error al crear una línea de cotizacion. Info: " + data)
        }
        
        // Borrar lineas
        if(linea.borrar)
        {
          let {ok, data}        = await apiDolibarr("borrar-lineas", "cotizacion", linea.lineaId, acuerdo.value.id)
          //if(!ok)  aviso("negative", "Error al borrar una línea de cotizacion")
        }
      }

      ordenarLineasEnDolibarr()
    }
    
    borrarGruposSinProductos()
    actualizarArrayGrupos( acuerdo.value.productos )
  
    //emit("update:cotizacion", acuerdo.value)
  }


  async function ordenarLineasEnDolibarr( )
  {
    let ids = acuerdo.value.productos.map( p => p.lineaId ).join()
    let ok  = await ordenarLineas(ids, acuerdo.value.id )
    if(!ok && acuerdo.value.productos.length >= 1)
      aviso("negative", "Error al ordenar")
  }

  function borrarGruposSinProductos()
  {
    if(acuerdo.value.proGrupos.length === 1 ) return 

    for (const grupo of acuerdo.value.proGrupos)
    {
      if(!grupo.productos.length){
        borrarGrupo( grupo, "borrar"  ) 
      }
    }
  }

  function addProductosDeBusqueda( grupo : IGrupoLineas )
  {
    let indexGrupo = acuerdo.value.proGrupos.findIndex( g => g.index === grupo.index ) 
    acuerdo.value.proGrupos[indexGrupo] = grupo
    cambioEnGrupos('buscarProductos') 
  }

  async function crearNuevoGrupo()
  {
    let index                   = acuerdo.value.proGrupos.length
    let nuevoGrupo              = new GrupoLineas( index )
    acuerdo.value.proGrupos.push( nuevoGrupo )
    
    if(!!index)
      aviso("positive", "Nuevo grupo creado")    
    // let lineaTituloApi          = LineaAcuerdo.getLineaApiEspecial( "titulo", nuevoGrupo.titulo )
    // let lineaSubtotalApi        = LineaAcuerdo.getLineaApiEspecial( "subtotal" )
    // let { data:dTit, ok:okTitu }= await apiDolibarr("crear", "lineaCotizacion", lineaTituloApi,  acuerdo.value.id)
    // let { data:dSub, ok:okSub  }= await apiDolibarr("crear", "lineaCotizacion", lineaSubtotalApi, acuerdo.value.id)
    await pausa(200) // Para darle tiempo que el virtual DOM genere el nuevo espacio y calcule el nuevo alto del documento
    //console.log(Maco"crear grupo 2 window.scrollTo")
    window.scrollTo({ top: document.body.scrollHeight,  behavior: 'smooth'})
    // if(!!okTitu && !!okSub )
    {
    }
  }




  function borrarGrupo( grupo : IGrupoLineas, accion : "conservar" | "borrar" )
  {
    if(accion                   == 'conservar')
    {
      let indexGrupoMover       = grupo.index == 0 ? grupo.index + 1 : grupo.index - 1
      acuerdo.value.proGrupos[ indexGrupoMover ].productos.push( ...grupo.productos )      
    }
      
    acuerdo.value.proGrupos.splice(grupo.index, 1)            // Borrar Grupo
    acuerdo.value.proGrupos.forEach( (g, i)  => g.index = i ) // Reasignar Index

    cambioEnGrupos( "borrarGrupo" )
  }
</script>