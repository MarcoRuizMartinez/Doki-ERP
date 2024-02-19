<template>
  <ventana                      cerrar
    titulo                      ="Ordenar grupos y productos"
    icono                       ="mdi-sort-alphabetical-ascending"
    :cargando                   ="loading.ordenando"
    class-contenido             ="column gap-sm"
    min-width                   ="400px"
    >
    <div style                  ="height: 80vh; overflow-y: auto;" class="">
      <vue-draggable
        v-model                 ="acuerdo.proGrupos"
        :animation              ="300"
        handle                  =".handle"
        chosen-class            ="item-select"
        class                   ="row gap-sm no-wrap full-height justify-center"
        style                   ="width: 94vw;"
        @end                    ="ordenarProductos"
        >
        <!-- //* //////////////////////////////////////////////////////////////////// Iterable Contenedor de productos-->
        <div
          v-for                 ="grupo of acuerdo.proGrupos"
          :key                  ="grupo.index"
          class                 ="grupo row justify-between q-pa-sm"
          >
          <!-- //* ////////////////////////////////////////////////////////////////// Icono Drag -->
          <div class            ="col-shrink text-bold text-1_2em text-grey-9 q-mb-md">
            {{ grupo.titulo }}
          </div>
          <q-icon
            name                ="mdi-drag-variant"
            size                ="sm"
            class               ="col-shrink handle cursor-move op30 op100-hover"
          />
          <vue-draggable
            v-model             ="grupo.productos"
            :animation          ="200"              
            group               ="productos"
            class               ="col-12 column justify-start full-height gap-xs"
            chosen-class        ="item-select"            
            @end                ="finDragLinea"
            >
            <div
              v-for             ="linea of grupo.productos"
              :key              ="linea.ref"
              class             ="row fila q-px-sm degradado-gris width200 cursor-move "
              >
              <q-img
                :src            ="linea.img.img_100px" 
                class           ="imagen-woo-sm q-mr-sm"
                spinner-color   ="white"
              />
              <div class        ="col ellipsis-3-lines lh_1_2">
                <span class     ="text-bold">{{ linea.ref }}</span>
                {{ linea.nombre }}
              </div>
            </div>
          </vue-draggable>
        </div>
      </vue-draggable>
    </div>
  </ventana>
</template>
<script setup lang="ts">
/*
class             =""
            @update             ="onUpdate"
            @add                ="onAdd"
            @remove             ="remove"  
            @start              ="console.log('start')"      
            @sort               ="console.log('sort')"
            @change             ="console.log('change')"
            @clone              ="clone"
        
*/
  ////////////////////////////////////////////////////////////////////////// Core
  import {  ref, onMounted      } from "vue"
  import {  VueDraggable        } from 'vue-draggable-plus'
  
  ////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'            

  ////////////////////////////////////////////////////////////////////////// Modelos
  import {  LineaAcuerdo        } from "src/areas/acuerdos/models/LineaAcuerdo"
  import {  ImagenProducto      } from "src/areas/productos/models/ImagenProducto"
  import {  CategoriaProducto   } from "src/areas/productos/models/CategoriaProducto"
  import {  Unidad              } from "src/models/Diccionarios/Unidad"
  import {  NaturalezaProducto  } from "src/models/Diccionarios/NaturalezaProducto"
  import {  CodigosSiigo        } from "src/areas/productos/models/Siigo"
  import {  Bodega              } from "src/models/Diccionarios/Bodega"
  import {  ComisionLinea       } from "../../models/Comisiones/ComisionLinea"

  ////////////////////////////////////////////////////////////////////////// Controles
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"  

  ////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  

  const { deGruposAProductos  } = useControlProductos()

  const { acuerdo,  loading   } = storeToRefs( useStoreAcuerdo() )
  

  async function finDragLinea()
  {
    arreglarLineaClonada()
    ordenarProductos()    
  }  


  async function ordenarProductos()
  {
    loading.value.ordenando = true
    await deGruposAProductos()
    loading.value.ordenando = false
  }    


  function arreglarLineaClonada()
  {
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

          grupo.productos.splice( i, 1, lineaFix )
        }
        i++
      }      
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