<template>
  <q-select                 dense options-dense use-chips
                            hide-bottom-space borderless
    v-model                 ="modelo"
    :label                  ="!!modelo ? undefined : label "
    input-debounce          ="0"
    lazy-rules              ="ondemand"
    display-value           =""
    option-label            ="nombreCompleto"
    options-selected-class  ="text-weight-bold"
    class                   ="text-caption"
    popup-content-class     ="panel-blur"
    :class                  ="{ 'campo-hundido' : hundido }"
    :filled                 ="!hundido"
    :options                ="usuarios"
    :loading                ="usuariosDB.length == 0 || loading"
    :readonly               ="readonly"
    :use-input              ="useInput"
    :rules                  ="[ regla ]"
    @filter                 ="filterFn"
    @update:model-value     ="seleccionarUsuario"
    >
    <template
      #selected-item        ="scope">
      <q-chip               dense
        color               ="primary"
        text-color          ="white"
        :removable          ="!readonly && clearable"
        :tabindex           ="scope.tabindex"
        @remove             ="borrarUsuario(scope)"
        >
        <q-avatar text-color="white" >
          <img :src         ="scope.opt.fotoPerfilMini">
        </q-avatar>
        {{scope.opt.label}}
      </q-chip>
    </template>
    <template               #prepend>
      <q-icon
        name                ="mdi-account-supervisor-circle"
      />
    </template>
    <Tooltip
      v-if                  ="!!tooltip"
      :label                ="tooltip"
    />
  </q-select>
</template>

<script setup lang="ts">
//:color              ="!!modelo && !!modelo.id ? 'primary' : 'grey-6'"
//scope.removeAtIndex(scope.index)
  import {  ref,
            toRefs,
            PropType,
            watch
                              } from 'vue'
  import {  IUsuario, Usuario } from "src/areas/usuarios/models/Usuario"
  import {  dexieUsuarios     } from "src/services/useDexie"
  import {  useStoreUser      } from 'src/stores/user'
  import {  storeToRefs       } from 'pinia'
  import {  AREA              } from "src/models/TiposVarios"

  interface IScope {
    index:          number
    opt:            IUsuario
    selected:       boolean
    removeAtIndex:  (index: number) => void
    toggleOption:   (opt: any) => void
    tabindex:       number
  }

  const usuariosDB            = dexieUsuarios()
  const { usuario           } = storeToRefs( useStoreUser() )
  const usuarios              = ref< IUsuario [] > ( [] )
  const emit                  = defineEmits<{
    (e: 'update:modelValue',  value: IUsuario | undefined ): void
    (e: 'autoselect',         value: IUsuario             ): void
    (e: 'select',             value: IUsuario             ): void
    (e: 'clear',              value: void                 ): void
  }>()

  const props                 = defineProps(
  {
    label:        { default: "Responsable", String                                },
    modelValue:   { default: new Usuario(), type: Object as PropType< IUsuario >  },
    readonly:     { default: false,         type: Boolean                         },
    multiple:     { default: false,         type: Boolean                         },
    autoselect:   { default: false,         type: [Boolean, Number]               },
    useInput:     { default: false,         type: Boolean                         },
    hundido:      { default: false,         type: Boolean                         },
    inactivos:    { default: false,         type: Boolean                         },
    grupos:       { default: [],            type: Array as PropType<string[]>     },
    loading:      { default: false,         type: Boolean                         },
    //noInmediato:  { default: false,         type: Boolean                       },
    area:         { default: "",            type: String as PropType< AREA >      },
    clearable:    { default: false,         type: Boolean                         },
    idsNegativos: { default: [],            type: Array  as PropType < number[] > },
    tooltip:      { default: "",            type: String                          },
  })
  const { modelValue,
          readonly,
          autoselect,
          inactivos,
          grupos,
          //noInmediato,
          idsNegativos,
          area,
                            } = toRefs( props )

  let modelo                  = ref< IUsuario >()

  watch(idsNegativos, (idsNew)=>{
    copiarListaToUsuarios()
  })

  watch(usuariosDB, (dbUsuarios) =>
  {
    copiarListaToUsuarios()

    if(!modelo.value && !!autoselect.value)
        modelo.value        = new Usuario()

    if
    (
      !!autoselect.value
      &&
      !!modelo.value
      &&
      !!modelo.value.id
      &&
      !!grupos.value.length
      &&
      usuario.value.grupos.some( ( gu : string ) => grupos.value.some( ( g : string )=> g === gu ) )
    )
    {
      if(typeof autoselect.value === "boolean")
        modelo.value          = usuario.value
      else
        modelo.value          = usuarios.value.find( u => u.id === autoselect.value ) ?? new Usuario()

      emit("autoselect", modelo.value)
    }
  }
  //, { deep: true, immediate: true }
  )

  watch( modelo, ( newValue, oldValue ) => {
    //restriccion para que no me cambie algo de forma inmedita cuando recibe el contacto
    //if(noInmediato.value && !!newValue && !!oldValue && oldValue.id === -1 && !!newValue.id ) return
    //if(!!newValue && !!oldValue) // && newValue.id === oldValue.id)

    emit("update:modelValue", newValue )
  })    //,{ deep: true, immediate: true }


  watch( modelValue, ( newValue ) => {
      if(newValue.id >= 0)
        modelo.value                = newValue
      else
        modelo.value                = undefined
    },
    { immediate: true }
  )

  function borrarUsuario( item : IScope )
  {
    modelo.value = undefined
    emit("clear")
    emit("update:modelValue", undefined)
  }

  function seleccionarUsuario()
  {
    if(!!modelo.value && modelo.value.id > 0)
      emit("select", modelo.value)
  }

  function copiarListaToUsuarios()
  {
    usuarios.value    = usuariosDB.value.filter ( ( u : IUsuario ) =>
                                                    ( u.activo      || inactivos.value  )
                                                    &&
                                                    (
                                                      !grupos.value.length
                                                      ||
                                                      (
                                                        u.grupos.some( ( gu : string ) => grupos.value.some( ( g : string )=> g === gu ) )
                                                      )
                                                    )
                                                    &&
                                                    ( u.area  == area.value || area.value == AREA.GLOBAL ||  area.value == AREA.NULO )
                                                    &&
                                                    ( !idsNegativos.value.length || !idsNegativos.value.some( idI => idI === u.id  ) )
                                                )
                                        .sort   ( ( a : IUsuario, b : IUsuario ) =>
                                                  {
                                                    if(a.label < b.label) return -1
                                                    if(a.label > b.label) return 1
                                                    return 0;
                                                  }
                                                ) as IUsuario[]
  }




  const regla = ( user : IUsuario ) => user.id > 0 || (  "Por favor seleccione un responsable" )

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
