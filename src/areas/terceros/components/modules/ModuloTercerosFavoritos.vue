<template>
  <ventana                      minimizar
    class-contenido             ="column items-center"
    titulo                      ="Mis terceros favoritos"
    icono                       ="mdi-account-star"
    mensaje-sin-resultados      ="No tienes terceros favoritos"
    :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
    :modo                       ="modo"
    >
    <q-table                    bordered dense flat
      class                     ="fit tabla-maco"
      row-key                   ="id"
      :rows                     ="terceros"
      :columns                  ="columnas"
      :rows-per-page-options    ="[7, 14]"
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
  import {  ref, onMounted  } from "vue"
  import {  useStoreUser    } from 'stores/user'
  import {  servicesTerceros} from "src/areas/terceros/services/servicesTerceros"
  import {  TModosVentana    } from "src/models/TiposVarios"
  import {  IColumna,
            Columna         } from "src/models/Tabla"
  import    linkTercero       from "src/areas/terceros/components/LinkTercero.vue"
  import    ventana           from "components/utilidades/Ventana.vue"
  import {  ITercero,
            Tercero         } from "src/areas/terceros/models/Tercero"

  const storeUser             = useStoreUser()
  const { buscarTerceros    } = servicesTerceros()
  const busqueda              = ref< string   >("")
  const modo                  = ref< TModosVentana >("esperando-busqueda")
  const terceros              = ref< ITercero[] >([])
  const columnas: IColumna[]  = [ new Columna({ name: "nombre" }) ]

  onMounted( buscar )

  async function buscar()  
  {
    modo.value      = "buscando"
    terceros.value  = await buscarTerceros( { idUsuarios: storeUser.usuario.id, favorito: 1 } )
    modo.value      = !!terceros.value.length ? "normal" : "sin-resultados"    
  }

</script>