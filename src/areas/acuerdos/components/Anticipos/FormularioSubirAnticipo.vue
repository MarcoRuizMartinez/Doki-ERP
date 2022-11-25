<template>
  <ventana                      cerrar
    class-contenido             ="row items-center"
    :titulo                     ="`Subir comprobante ${tipo}`"
    icono                       ="mdi-file-upload"
    width                       ="520px"
    >
    <template                 #menu>
      <div class              ="full-width text-center text-grey-8 text-1_2em">
        Seleccionar archivo o copiar y pegar imagen
      </div>    
    </template>

    <!-- //* ///////////////  Subir archivo  -->
    <subir-archivo            solo-uno
      modulo                  ="order"
      label                   ="Seleccionar o arrastrar archivo"
      class                   ="col-12"
      :modulo-ref             ="acuerdo.ref"
      @subida-ok              ="archivoSubido"
    />
    <div class                ="col-12 text-center text-grey-8 text-1_2em">O</div>        
    <q-editor        
      v-bind                  ="WYSIWYG_Imagen"
      v-model                 ="modelEditor"
      class                   ="col-12"
      placeholder             ="Copiar y pegar imagen"
      :disable                ="false"
    />

  </ventana>
</template>
<script setup lang="ts">
  // * ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            toRefs,
            computed,
            PropType,
            watch
                                } from "vue"
  //* /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs         } from 'pinia'                            
  import {  useStoreAcuerdo     } from 'stores/acuerdo'
  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  IAnticipo, Anticipo,
            TIPO_ANTICIPO_LABEL,
            ESTADO_ANTICIPO_LABEL
                                } from "src/areas/acuerdos/models/Anticipo"
  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  useApiDolibarr      } from "src/services/useApiDolibarr"
  import {  useTools            } from "src/useSimpleOk/useTools"  
  import {  useFetch            } from "src/useSimpleOk/useFetch"
  import {  btnBaseSm           } from "src/useSimpleOk/useEstilos"
  import {  dexieCuentasDinero  } from "src/services/useDexie"  
  import {  getURL, getFormData } from "src/services/APIMaco"  
  import {  WYSIWYG_Imagen      } from "src/useSimpleOk/useEstilos"
  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana               from "components/utilidades/Ventana.vue"
  import    subirArchivo          from "src/components/archivos/SubirArchivo.vue"

  const { anticipo, acuerdo } = storeToRefs( useStoreAcuerdo() )  
  const { aviso             } = useTools()
  const { miFetch           } = useFetch()
  const cuentas               = dexieCuentasDinero()
  const cargando              = ref< boolean >(false)
  const formulario            = ref< any >()
  const endPoint              = getURL("servicios", "pagos")
  const modelEditor           = ref< string     >("")
  let   copiaAnticipo         = ""

  //* ////////////////////////////////////////////////////////////////////////////////////// Props
  const props                 = defineProps(
  {
    tipo:         { required: true,   type: String as PropType< "cliente" | "interno"  > },
  })
  
  const emit                  = defineEmits<{
    (e: "update:modelValue",  value: IAnticipo ): void
    (e: "creado",             value: IAnticipo ): void
    (e: "borrado",            value: IAnticipo ): void
  }>()


  const { tipo }              = toRefs( props )
  const modificado            = computed( ()=>  copiaAnticipo !== JSON.stringify( anticipo.value ) ) 
  const btnDisable            = computed( ()=> !anticipo.value.esNuevo && !modificado.value)
  const objetoToFetch         = computed( ()=> { return {
                                                    body: getFormData( anticipo.value.esNuevo ? "nuevoAnticipo" : "editarAnticipo", anticipo.value.anticipoToApi ),
                                                    method: "POST"
                                                  }
                                                }
                                        )

  function archivoSubido( archivos : File[]){
    if(!archivos.length) return
    if(tipo.value === "cliente"){
      anticipo.value.filenameCliente  = archivos[0].name
    }
    else{
      anticipo.value.filenameInterno  = archivos[0].name
    }

    emit("update:modelValue", anticipo.value)
  }
</script>