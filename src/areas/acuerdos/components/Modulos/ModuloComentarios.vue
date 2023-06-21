<template>
  <q-page-sticky
    position              ="bottom-right" 
    :offset               ="[18, 18]"
    >
    <q-fab 
      v-model             ="isOpen"
      direction           ="left"    
      icon                ="mdi-comment-multiple"      
      padding             ="sm"
      :color              ="isOpen ? 'red' : 'positive'"
      >
      <div class          ="chat panel-blur-70 shadow-6 radius-10 column justify-between">
        <q-scroll-area    class="col q-pa-md">          
          <q-chat-message 
            v-for         ="(item, index) of comentarios"
            :key          ="index"
            sent
            :text         ="[item.value]"
          />      
        </q-scroll-area>
        <div
          class           =""
          >
          <!-- //* ///////////////////////////////////////////////////////////// Campo buscar -->
          <input-buscar
            v-model       ="textoComentario"
            label         ="Nuevo comentario..."
            class         ="col-md-2 col-6"
            debounce      ="150"
            :icon         ="editarComentario ? 'mdi-loading' : 'mdi-chat'"
            :loading      ="editarComentario"
            :dense        ="false"
            @enter        ="crearComentario"
            >
            <q-btn
              v-if        ="!!textoComentario"
              v-bind      ="style.btnRedondoFlat"
              icon        ="mdi-send"
              @click      ="crearComentario"
              >
              <Tooltip>Enviar</Tooltip>
            </q-btn>            
            <q-btn
              v-bind      ="style.btnRedondoFlat"
              icon        ="mdi-reload"
              >
              <Tooltip>Cargar comentarios</Tooltip>
            </q-btn>
          </input-buscar>
        </div>
      </div>
      <template           #tooltip v-if ="!isOpen && !!comentarios.length">
        <q-badge          floating
          color           ="red"
          :label          ="comentarios.length"
        />
      </template>      
    </q-fab>
  </q-page-sticky>
</template>
<script setup lang="ts">
  import {  ref, onMounted        } from 'vue'
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  
  import {  useStoreUser          } from 'src/stores/user'
  import {  useTools              } from "src/useSimpleOk/useTools"
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  style                 } from "src/useSimpleOk/useEstilos"
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    inputNumber             from "components/utilidades/input/InputFormNumber.vue"
  import {  useApiDolibarr        } from "src/services/useApiDolibarr"  
  import    retenciones             from "src/areas/acuerdos/components/Anticipos/Retenciones.vue"
  import    inputBuscar             from "components/utilidades/input/InputSimple.vue"
  import {  Comentario,
            IComentario           } from "src/models/Comentario"
            
  const isOpen                  = ref<boolean>(false)
  const cargarComentarios       = ref<boolean>(false)
  const editarComentario        = ref<boolean>(false)
  const textoComentario         = ref<string>("")    
  const comentario              = ref<IComentario>( new Comentario() )
  const comentarios             = ref<IComentario[]>( [] )
  const { apiDolibarr         } = useApiDolibarr()
  const { aviso               } = useTools()
  const { acuerdo, loading    } = storeToRefs( useStoreAcuerdo() )
  const { usuario             } = storeToRefs( useStoreUser() )
  const { editarConAIU,
          editarValorAIU,
          editarConTotal,
          editarConIVA,
                              } = useControlAcuerdo()

  onMounted(()=>{
    asignarValoresAComentario()
  })

  async function crearComentario()
  {
    if(!textoComentario.value) return

    asignarValoresAComentario()
    const obj                   = comentario.value.commentToApi
    editarComentario.value      = true
    const { ok, data }          = await apiDolibarr("crear", "comentario", obj)
    editarComentario.value      = false
    if(ok && !!data && typeof data == "number"){
      comentario.value.id       = data
      comentarios.value.push( comentario.value )
      textoComentario.value     = ""
      comentario.value          = new Comentario()
    }
    else
    {
      aviso("negative", "Error al publicar comentario")
    }
  }

  function asignarValoresAComentario()
  {
    comentario.value.value      = textoComentario.value
    comentario.value.elementoId = acuerdo.value.id
    comentario.value.tipo       = acuerdo.value.esPedido ? "order" : ""
    comentario.value.terceroId  = acuerdo.value.tercero.id
    comentario.value.asignadoId = usuario.value.id
    comentario.value.creadorId  = usuario.value.id
    comentario.value.label      = `Comentario de ${usuario.value.nombre}`
  }
</script>
<style>
.chat{
  height: 380px;
  width: 360px;
  margin-top: -330px;
  
}

</style>