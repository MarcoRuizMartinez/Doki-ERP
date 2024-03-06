<template>
  <q-select                 dense options-dense use-chips 
                            hide-bottom-space borderless multiple
    v-model                 ="modelo"
    label                   ="Responsables"
    input-debounce          ="0"
    lazy-rules              ="ondemand"
    display-value           =""
    option-label            ="nombreCompleto"
    options-selected-class  ="text-weight-bold"
    class                   ="text-caption"
    :class                  ="{ 'campo-hundido' : hundido }"
    :filled                 ="!hundido"
    :options                ="usuarios"
    :loading                ="usuariosDB.length == 0"
    :readonly               ="readonly"
    :use-input              ="useInput"
    :rules                  ="[ regla ]"
    @update:model-value     ="cambiarUsuario"
    @remove                 ="eliminar" 
    @add                    ="agregar"
    @filter                 ="filterFn"    
    >
    <template
      #selected-item  ="scope">
      <q-chip               dense
        color               ="primary"
        text-color          ="white"
        :removable          ="!readonly"
        :tabindex           ="scope.tabindex"
        @remove             ="scope.removeAtIndex(scope.index)"
        >
        <q-avatar text-color="white" >
          <img :src         ="scope.opt.fotoPerfilMini">
        </q-avatar>
        {{scope.opt.label}}
      </q-chip>
    </template>
    <template #prepend>
      <q-icon name          ="mdi-account-supervisor-circle" />
    </template>
  </q-select>
</template>

<script setup lang="ts">
//stack-label
  import {  computed,
            ref,
            toRefs,
            PropType,
            watch
                              } from 'vue'
  import {  IUsuario          } from "src/areas/usuarios/models/Usuario"
  import {  dexieUsuarios     } from "src/composables/useDexie"
  import {  storeToRefs       } from 'pinia'
  import {  useStoreUser      } from 'stores/user'
  import {  AREA              } from "src/models/TiposVarios"
  import {  useStoreDexie     } from 'stores/dexieStore'    

  dexieUsuarios()
  const { usuarios : usuariosDB }= storeToRefs( useStoreDexie() )
  const storeUser             = useStoreUser()
  const usuarios              = ref< IUsuario [] > ( [] )
  const usuario               = computed( () => storeUser.usuario )
  const emit                  = defineEmits(["update:modelValue", "clear"])
  const props                 = defineProps(
  {
    modelValue:   { required: true,   type: Array as PropType< IUsuario[] >  },
    readonly:     { default: false,   type: Boolean                         },
    multiple:     { default: false,   type: Boolean                         },
    autoselect:   { default: false,   type: Boolean                         },
    useInput:     { default: false,   type: Boolean                         },
    hundido:      { default: false,   type: Boolean                         },
    inactivos:    { default: false,   type: Boolean                         },
    todos:        { default: false,   type: Boolean                         },
    area:         { default: "",      type: String as PropType< AREA >      },
  })
  const { modelValue,
          readonly,
          autoselect,
          inactivos,
          todos,
          area              } = toRefs( props )
  
  let modelo                  = ref< IUsuario[] >([])

  watch(
    usuariosDB, () =>
    {
      copiarListaToUsuarios()

      if(!modelo.value && autoselect.value)
          modelo.value  = [] 

      if
      (
        autoselect.value
        &&
        !!modelo.value
        //&&
        //!readonly.value
        &&
        modelo.value.length   == 0
        &&
        usuario.value.esComercial
      )
      {
        modelo.value.push( usuario.value )
        emit("update:modelValue", modelo.value)
      }
    }
    //, { deep: true, immediate: true }
  )
  
/*   watch(
    usuarios,
    ( newValue, oldValue ) =>
    {
    }
    //, { deep: true, immediate: true }
  ) */

  watch( modelo, ( newValue, oldValue ) => {
      emit("update:modelValue", newValue)
    }    //,{ deep: true, immediate: true }
  )

  watch(
    modelValue,
    ( newValue, oldValue ) =>
    {
      modelo.value                = newValue
    },
    { immediate: true}
  )

  function copiarListaToUsuarios()
  {
    usuarios.value = usuariosDB.value  .filter ( ( u : IUsuario ) =>
                                              ( u.activo      || inactivos.value  )
                                              &&
                                              ( u.esComercial || todos.value      )
                                              &&
                                              ( u.area  == area.value || area.value == AREA.GLOBAL ||  area.value == AREA.NULO )
                                            )
                                            .sort   ( ( a : IUsuario, b : IUsuario ) =>
                                              {
                                                if(a.label < b.label) return -1
                                                if(a.label > b.label) return 1
                                                return 0;
                                              }) as IUsuario[]
  }

  function cambiarUsuario( usuario : IUsuario )
  {
    //console.log('%c⧭', 'color: #e57373', "cambiarUsuario", usuario)
    //emit("update:modelValue", municipio_)
  }

  function agregar( e : any )
  {
    //console.log('%c⧭', 'color: #ffa280', "agregar", e)
    //this.$emit('agregar', e.value)
  }

  function  eliminar( e : any )
  {
    if(modelo.value.length == 1) emit('clear')
  }

  function regla( users : any[] )
  {
    return  !!users.length
            ||
            (  "Por favor seleccione un responsable" )
  }

  function filterFn ( busqueda : any, update : Function, abort : Function  )
  {    
    if (busqueda              === "")
    {
      update(() => {
        copiarListaToUsuarios()
      })
      return
    }
    else
    if (busqueda.length       < 3)
    {
      abort()
      return
    }
    update(() => {
      const nombreMin         = busqueda.toLowerCase()
      usuarios.value          = usuariosDB.value.filter( v => v.label.toLowerCase().indexOf( nombreMin ) > -1)
    })
  }
</script>