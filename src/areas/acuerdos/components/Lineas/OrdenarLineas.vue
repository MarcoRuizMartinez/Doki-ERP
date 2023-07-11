<template>
  <ventana                  cerrar
    titulo                  ="Ordenar productos"
    icono                   ="mdi-sort-alphabetical-ascending"
    :cargando               ="loading.ordenando"
    class-contenido         ="column gap-sm"
    min-width               ="400px"
    >
    <div style              ="height: 80vh; overflow-y: auto;" class="fit">
      <Container 
        lock-axis           ="y"
        drag-class          ="opacity-ghost"
        drop-class          ="opacity-ghost-drop"
        :get-ghost-parent   ="getGhostParent"
        @drop               ="ordenarLineas"
        @drop-ready         ="onDropReady"
        >
        <Draggable
          v-for             ="linea in lineas"
          :key              ="linea.id"
          >
          <div  class       ="item row">
            <q-img
              :src          ="linea.imagen" 
              class         ="imagen-woo-sm q-mr-sm"
              spinner-color ="white"
            />
            <div class      ="col-auto">
              <span class="text-bold">{{ linea.ref }}</span>
              {{ linea.nombre }}
            </div>
          </div>
        </Draggable>
      </Container>
    </div>
  </ventana>
</template>
<script setup>
/*
:get-child-payload="getChildPayload"
*/
  ////////////////////////////////////////////////////////////////////////// Core
  import { ref, onMounted       } from "vue"
  import { Container, Draggable } from "vue-dndrop";
  ////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'
  import {  useStoreAcuerdo     } from 'src/stores/acuerdo'            
  ////////////////////////////////////////////////////////////////////////// Controles
  import {  useControlProductos } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  sortArray           } from "src/composables/useTools"  

  ////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"

  const { deGruposAProductos  } = useControlProductos()

  const { grupoElegido,          
          loading             } = storeToRefs( useStoreAcuerdo() )
  const lineas                  = ref([])
  const getGhostParent          = ()=> document.body

  onMounted(()=>{
    lineas.value                = grupoElegido.value.productos.map( p => { return {
        id:     p.lineaId,
        ref:    p.ref,
        nombre: p.nombre,
        imagen: p.imagen100px,
        orden:  p.orden,
      }
    })    
  })

  function onDropReady(){    
    let ultimoNodo = document.body.lastChild;
    if(!!ultimoNodo){
      ultimoNodo.style.zIndex  = "10000";
    }
  }  

  function ordenarLineas( dropResult )
  {
    lineas.value                = applyDrag( lineas.value, dropResult )

    for (const p of grupoElegido.value.productos)
      p.orden = lineas.value.findIndex( ( l )=> p.lineaId === l.id ) + 1    

    sortArray( grupoElegido.value.productos, "orden" )
    deGruposAProductos()
  }
  
  function applyDrag(arr, dragResult)
  {
    const { payload,
            addedIndex,
            removedIndex    } = dragResult;

    if(removedIndex === null && addedIndex === null)
      return arr;

    const result              = [...arr]
    let itemToAdd             = payload
    if(removedIndex           !== null)
      itemToAdd               = result.splice(removedIndex, 1)[0]
    if(addedIndex             !== null)
      result.splice(addedIndex, 0, itemToAdd)

    return result
  }
</script>
<style scoped>
.item{
  background: linear-gradient(to bottom,#ffffff,#e5e5e5);
  border: 1px solid #d3d3d3;
  padding: 4px;
  min-width: 100%;
  border-radius: 8px;
}
.draggable-item{
  color: #dc3545;
  background-color: aqua;
}
.dndrop-container.vertical {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 4px;
  cursor: pointer;
}

.opacity-ghost{
  opacity: 0.6;
}
/* .opacity-ghost-drop{
} */
</style>