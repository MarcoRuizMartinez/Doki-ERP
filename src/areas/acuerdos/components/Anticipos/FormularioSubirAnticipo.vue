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
      :modulo-ref             ="pedidoRef"
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


  const { aviso             } = useTools()
  const { miFetch           } = useFetch()
  const cuentas               = dexieCuentasDinero()
  const anticipo              = ref<IAnticipo>(new Anticipo())
  const cargando              = ref< boolean >(false)
  const formulario            = ref< any >()
  const endPoint              = getURL("servicios", "pagos")
  const modelEditor           = ref< string     >("")
  let   copiaAnticipo         = ""

  //* ////////////////////////////////////////////////////////////////////////////////////// Props
  const props                 = defineProps(
  {
    modelValue:   { default:  new Anticipo(), type: Object as PropType< IAnticipo >   },
    pedidoRef:    { required: true,           type: String                            },
    tipo:         { required: true,           type: String as PropType< "cliente" | "interno"  > },
  })
  
  const emit                  = defineEmits<{
    (e: "update:modelValue",  value: IAnticipo ): void
    (e: "creado",             value: IAnticipo ): void
    (e: "borrado",            value: IAnticipo ): void
  }>()


  const { modelValue        } = toRefs( props )
  const esNuevo               = computed( ()=> !modelValue.value.id )
  const modificado            = computed( ()=>  copiaAnticipo !== JSON.stringify( anticipo.value ) ) 
  const btnDisable            = computed( ()=> !esNuevo.value && !modificado.value)
  const objetoToFetch         = computed( ()=> { return {
                                                    body: getFormData( esNuevo.value ? "nuevoAnticipo" : "editarAnticipo", anticipo.value.anticipoToApi ),
                                                    method: "POST"
                                                  }
                                                }
                                        )

  function archivoSubido( archivos : File[])
  {
    
  }
  
  watch(modelValue, (newAnticipo) =>
    {
      anticipo.value              = Object.assign( new Anticipo(), newAnticipo)

      if(!!newAnticipo.id)
      {
        copiaAnticipo             = JSON.stringify( anticipo.value )
        cargando.value            = false
      }
    },
    { immediate: true }
  ) 






  //* ////////////////////////////////////////////////////////////////////////////////////// Submit
  async function onSubmit()
  {
    cargando.value            = true
    const { data, ok  }       = await miFetch( endPoint, objetoToFetch.value, { mensaje: "guardar anticipo" } )
    console.log("data", data);

    if(ok)
    {
      aviso( "positive", "Anticipo guardaro exitosamente" )

      if(esNuevo.value){
        anticipo.value.id     = parseInt( data as string )
        emit("creado", anticipo.value)
      }
      else{
        emit("update:modelValue", anticipo.value)
      }
    }
    else
      aviso( "negative", "Error al guardar anticipo. Por favor vuelve a intentarlo" )

    cargando.value            = false
  }



</script>