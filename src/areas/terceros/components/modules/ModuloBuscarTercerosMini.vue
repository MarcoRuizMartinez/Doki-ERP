<template>
  <ventana                      minimizar
    class-contenido             ="column items-center"
    titulo                      ="Buscar terceros"
    icono                       ="mdi-account-search"
    mensaje-sin-resultados      ="No se encontraron terceros" 
    :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
    :modo                       ="modo"
    >
    <template                   #menu>
      <input-buscar             autofocus clearable hundido
        v-model                 ="busqueda"
        label                   ="Buscar.."
        class                   ="col-12"
        @update:model-value     ="buscar"
      />
    </template>
    <q-table                    bordered dense flat
      class                     ="fit tabla-maco"
      row-key                   ="id"
      :rows                     ="terceros"
      :columns                  ="columnas"
      >
      <template #body="props">
        <q-tr :props="props">
          <q-td key="nombre"    :props="props"> 
            <link-tercero       :tercero="( props.row as Tercero ) "/>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </ventana>
</template>

<script setup lang="ts">
  import {  ref             } from "vue"
  import {  useStoreUser    } from 'src/stores/user'
  import {  servicesTerceros} from "src/areas/terceros/services/servicesTerceros"
  import {  ModosVentana    } from "src/models/TiposVarios"
  import {  IColumna,
            Columna         } from "src/models/Tabla"
  import    linkTercero       from "src/areas/terceros/components/LinkTercero.vue"
  import    ventana           from "components/utilidades/Ventana.vue"
  import    inputBuscar       from "components/utilidades/input/InputSimple.vue"
  import {  IQuery          } from "src/models/Busqueda"
  import {  ITercero,
            Tercero         } from "src/areas/terceros/models/Tercero"
  
  const storeUser             = useStoreUser()
  const { buscarTerceros }    = servicesTerceros()
  const busqueda              = ref< string   >("")
  const modo                  = ref< ModosVentana >("esperando-busqueda")
  const terceros              = ref< ITercero[] >([])
  const columnas: IColumna[]  = [ new Columna({ name: "nombre" }) ]

  async function buscar( busqueda : string )  
  {
    if(!busqueda)             modo.value = "esperando-busqueda"

    if(busqueda.length < 2 )  return

    modo.value                = "buscando"
    let query : IQuery        = { buscar: busqueda, limite: 10, offset: 0 }
    if( !storeUser.permisos.acceso_total )
        query.usuario         = storeUser.usuario.id
    terceros.value            = await buscarTerceros( query )
    modo.value                = !!terceros.value.length ? "normal" : "sin-resultados"    
  }
</script>