<template>
  <q-page padding   class   ="row items-stretch content-start justify-start q-col-gutter-md">
    <vista-acuerdo  v-bind  ="props" />
  </q-page>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  watch,
            toRefs,
            PropType,
            onMounted,
                                  } from "vue"
  //* ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'
  //* ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useControlAcuerdo     } from "src/areas/acuerdos/controllers/ControlAcuerdos"
  import {  useControlProductos   } from "src/areas/acuerdos/controllers/ControlLineasProductos"
  import {  TTipoAcuerdo          } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  import {  dexieReglaComision,
            dexieCategoriasProducto,
                                  } from "src/composables/useDexie"
  //* ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    vistaAcuerdo            from "./views/VistaAcuerdoVer.vue"

  const { buscarAcuerdo     } = useControlAcuerdo()
  const { copiarProductos,
          deGruposAProductos }= useControlProductos()
  const { acuerdo           } = storeToRefs( useStoreAcuerdo() )
  
  const storeAcuerdo          = useStoreAcuerdo()

  dexieCategoriasProducto() 
  dexieReglaComision()

  const props                 = defineProps({
    id:   { required: true, type: String },
    tipo: { required: true, type: String as PropType< TTipoAcuerdo > },
  })

  const { id, tipo }          = toRefs( props )
  onMounted   ( iniciar )

  watch ( [id, tipo],
          ()=> {
            if(!!id.value && !!tipo.value)
              iniciar()
          }
        )

  async function iniciar()
  {
    storeAcuerdo.cargarNivelesComision()
    const gruposBoceto              = Object.assign( acuerdo.value.proGrupos, {} )
    const idCopiaAcuerdo            = acuerdo.value.id
    const tipoCopiaAcuerdo          = acuerdo.value.tipo
    await buscarAcuerdo( tipo.value, id.value )
    copiarProductosDeBoceto()

    async function copiarProductosDeBoceto()
    {
      if(
          !acuerdo.value.productos.length
          &&
          !!gruposBoceto.length
          &&
          idCopiaAcuerdo              === acuerdo.value.id
          &&
          tipoCopiaAcuerdo            === acuerdo.value.tipo
      )
      {
        acuerdo.value.proGrupos       = gruposBoceto
        await deGruposAProductos()
        const ok                      = await copiarProductos( acuerdo.value.productos )
        if(ok)
          await buscarAcuerdo( tipo.value, id.value )
      }
    }
  }
  </script>
