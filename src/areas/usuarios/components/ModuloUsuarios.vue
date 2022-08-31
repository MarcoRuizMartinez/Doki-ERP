<template>
  <ventana                      minimizar
    class-contenido             ="column items-center"
    titulo                      ="Usuarios"
    icono                       ="mdi-account-group"
    mensaje-sin-resultados      ="Problema desconocido"
    size-icon-carga             ="14em"
    :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
    :modo                       ="modo"
    >
    <template                   #menu>
      <input-buscar             autofocus clearable hundido
        v-model                 ="filtro"
        label                   ="Filtrar.."
        class                   ="full-width"        
      />
    </template>    
    <q-table                    borbordered dense flat
      class                     ="fit tabla-maco"
      row-key                   ="id"
      :rows                     ="usuarios"
      :columns                  ="columnas"
      :filter                   ="filtro"
      >
    </q-table>
  </ventana>
</template>

<script setup lang="ts">
  import {  computed,
            ref,
            toRefs,
            PropType,
                            } from "vue"
  import {  IColumna,
            Columna         } from "src/models/Tabla"
  import {  IUsuario        } from "src/areas/usuarios/models/Usuario"
  import    ventana           from "components/utilidades/Ventana.vue"
  import    inputBuscar       from "src/components/utilidades/input/InputSimple.vue"

  const filtro                = ref< string >("")  
  const props                 = defineProps({
    usuarios: { required: true, type: Array as PropType < IUsuario[] > }
  })

  const { usuarios }          = toRefs( props )
  const modo                  = computed( ()=> {
                                  let total = usuarios.value.length
                                  return !!total ? "normal" : "buscando"
                                })
  const columnas: IColumna[]  = [
                                  new Columna({ name: "id"}),
                                  new Columna({ name: "nombreCompleto",   label: "Usuario" }),
                                  new Columna({ name: "area"}),
                                  new Columna({ name: "estado"}),                                  
                                  new Columna({ name: "gruposString",     label: "Grupos"}),
                                  new Columna({ name: "terceroIdCtz",     label: "tercero"}),
                                ]
</script>