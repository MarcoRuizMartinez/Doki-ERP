<template>
  <ventana                        cerrar
    titulo                        ="Ordenar grupos y productos"
    icono                         ="mdi-sort-alphabetical-ascending"
    :cargando                     ="loading.ordenando"
    class-contenido               ="column gap-sm"
    min-width                     ="400px"
    >
    <template                     #barra>
      <!-- //* ///////////////////////////////////////////////////////////// Boton nuevo grupo   -->
      <q-btn
        v-bind                    ="style.btnBaseSm"
        label                     ="Nuevo grupo"
        color                     ="positive"
        icon                      ="mdi-tab-plus"
        :disable                  ="!acuerdo.puedeCrearNuevoGrupo"
        @click                    ="crearNuevoGrupo"
      />
    </template>    
    <q-scroll-area
      class                       ="full-width column"
      style                       ="height: 80vh;" 
      >
      <vue-draggable
        v-model                   ="acuerdo.proGrupos"
        :animation                ="300"
        handle                    =".handle"
        chosen-class              ="item-select"
        class                     ="row gap-sm no-wrap justify-center items-stretch"        
        @end                      ="ordenarProductos"
        >
        <!-- //* //////////////////////////////////////////////////////////////////// Iterable Contenedor de productos-->
        
        <div
          v-for                   ="grupo of acuerdo.proGrupos"
          :key                    ="grupo.index"
          class                   ="grupo row justify-between content-start q-pa-sm"
          >
          <!-- //* ////////////////////////////////////////////////////////////////// Icono Drag -->
          <div class              ="col-shrink text-bold text-1_2em text-grey-9 q-mb-md">
            <!-- //* ///////////////////////////////////////////////////// Nombre Grupo -->
            <span>
              {{ grupo.titulo }}
              <Tooltip :label     ="!!grupo.lineaIdTitulo ? 'Editar nombre de grupo' : 'Para editar nombre, mover primero un producto'"
              />
            </span>
            <q-popup-edit         auto-save fit
              v-if                ="!!grupo.lineaIdTitulo"
              v-model             ="grupo.titulo"
              v-slot              ="scope"
              class               ="row panel-blur-70 q-col-gutter-xs"
              max-width           ="400px"
              anchor              ="center left"
              :persistent         ="loading.editarGrupo"
              @update:model-value ="( titulo : string )=> editarTituloGrupo(titulo, grupo)"
              >
              <q-input            dense filled
                v-model           ="scope.value"
                label             ="Nombre de grupo"
                class             ="width300"
                :disable          ="!grupo.conTitulo"
                @keyup.enter      ="scope.set"
              />
            </q-popup-edit>            
          </div>
          <q-icon
            name                  ="mdi-drag-variant"
            size                  ="sm"
            class                 ="col-shrink handle cursor-move op30 op100-hover"
          />
          <vue-draggable
            v-model               ="grupo.productos"
            :animation            ="200"              
            group                 ="productos"
            class                 ="col-12 column justify-start full-height gap-xs no-wrap"
            chosen-class          ="item-select"            
            @end                  ="finDragLinea"
            @unchoose             ="seleccionarGrupoElegido"
            >
            <div
              v-for               ="linea of grupo.productos"
              :key                ="linea.lineaId"
              class               ="row fila q-px-sm degradado-gris width200 cursor-move"
              >
              <q-img
                :src              ="!!linea.urlImagen ? linea.urlImagen : linea.img.img_100px" 
                class             ="imagen-woo-sm q-mr-sm"
                spinner-color     ="white"
              />
              <div class          ="col ellipsis-3-lines lh_1_2">
                <span class       ="text-bold">{{ linea.ref }}</span>
                {{ linea.nombre }}
              </div>
            </div>
          </vue-draggable>
        </div>      
      </vue-draggable>
    </q-scroll-area>
  </ventana>
</template>
<script setup lang="ts">
  //style                     ="width: 94vw;"
  ////////////////////////////////////////////////////////////////////////// Core
  import {  VueDraggable        } from 'vue-draggable-plus'
  
  ////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'stores/acuerdo'            

  ////////////////////////////////////////////////////////////////////////// Modelos
  import {  LineaAcuerdo        } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  ImagenProducto      } from "src/areas/productos/models/ImagenProducto"
  import {  CategoriaProducto   } from "src/areas/productos/models/CategoriaProducto"
  import {  Unidad              } from "src/models/Diccionarios/Unidad"
  import {  NaturalezaProducto  } from "src/models/Diccionarios/NaturalezaProducto"
  import {  CodigosSiigo        } from "src/areas/productos/models/Siigo"
  import {  Bodega              } from "src/models/Diccionarios/Bodega"
  import {  ComisionLinea       } from "../../models/Comisiones/ComisionLinea"
  import {  GrupoLineas         } from "src/areas/acuerdos/models/GrupoLineasAcuerdo"  

  ////////////////////////////////////////////////////////////////////////// Controles
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"  
  ////////////////////////////////////////////////////////////////////////// Componibles
  import {  style               } from "src/composables/useEstilos"  
  ////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"

  const { crearLineaEnApi,
          crearNuevoGrupo,
          editarTituloGrupo,
          deGruposAProductos  } = useControlProductos()

  const { acuerdo,
          loading,
          grupoElegido        } = storeToRefs( useStoreAcuerdo() )
  
  let hayQueCrearGrupo          = false

  async function finDragLinea()
  {
    const ordenLineaMovida      = arreglarLineaClonada()
    if( hayQueCrearGrupo )
      await crearTituloGrupo( ordenLineaMovida )   

    ordenarProductos()    
  }

  async function seleccionarGrupoElegido()
  {
    loading.value.ordenando     = true
    grupoElegido.value          = new GrupoLineas()
    hayQueCrearGrupo            = false

    for (const grupo of acuerdo.value.proGrupos)
    {      
      if(!grupo.productos.length) // Si el grupo no tiene productos, es por que es recien creado y toca crearlo en la API
      {
        hayQueCrearGrupo        = true
        grupoElegido.value      = grupo
      }
    }    
  }

  async function ordenarProductos()
  {
    loading.value.ordenando     = true
    await deGruposAProductos()
    loading.value.ordenando     = false
  }    


  function arreglarLineaClonada() : number
  {
    let ordenLineaMovida            = 0
    for (const grupo of acuerdo.value.proGrupos)
    {
      let i = 0;
      for (let producto of grupo.productos)
      {
        if(!(producto instanceof LineaAcuerdo))
        {
          const lineaFix            = Object.assign( new LineaAcuerdo(),                producto ) 
                lineaFix.img        = Object.assign( new ImagenProducto(),              lineaFix.img )
                lineaFix.categoria  = Object.assign( new CategoriaProducto(),           lineaFix.categoria )
                lineaFix.unidad     = Object.assign( new Unidad(),                      lineaFix.unidad )
                lineaFix.naturaleza = Object.assign( new NaturalezaProducto(),          lineaFix.naturaleza )
                lineaFix.siigo      = Object.assign( new CodigosSiigo(),                lineaFix.siigo )
                lineaFix.bodega     = Object.assign( new Bodega(),                      lineaFix.bodega )
                lineaFix.comision_c1= Object.assign( new ComisionLinea("comercial 1"),  lineaFix.comision_c1 )
                lineaFix.comision_c2= Object.assign( new ComisionLinea("comercial 2"),  lineaFix.comision_c2 )

          ordenLineaMovida          = lineaFix.orden
          grupo.productos.splice( i, 1, lineaFix )
        }
        i++
      }      
    }

    return ordenLineaMovida
  }  


  async function crearTituloGrupo( orden : number )
  {
    const lineaTitulo           = LineaAcuerdo.getTitulo( grupoElegido.value.titulo ) 
    lineaTitulo.orden           = orden - 1
    lineaTitulo.lineaId         = await crearLineaEnApi( lineaTitulo )  

    if(lineaTitulo.esTitulo)
    {
      grupoElegido.value.lineaIdTitulo  = lineaTitulo.lineaId
      grupoElegido.value.tituloCreado   = true
    }
  }
</script>
<style scoped>

.grupo{
  background: #f6f6f6;
  border: 1px solid #d3d3d3;  
  min-width: 350px;
  min-height: 100%;
  border-radius: 8px;  
}
.item-select{
  background: linear-gradient(to bottom,#ffffff,#cbdbec);
  box-shadow: 0 2px 4px -1px #0003, 0 4px 5px #00000024, 0 1px 10px #0000001f;
  opacity: 0.7;
}
</style>