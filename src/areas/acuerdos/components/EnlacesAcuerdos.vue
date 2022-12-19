<template>
  <ventana
    class-contenido             ="column items-center"
    titulo                      ="Enlaces"
    icono                       ="mdi-link-variant"
    size-icon-carga             ="10em"
    mensaje-sin-resultados      ="Sin enlaces"
    icono-sin-resultados        ="mdi-link-variant-off"
    :padding-contenido          ="modo == 'normal' ? '0' : '12px' "
    :modo                       ="modo"
    >
    <!-- //* /////////////////  Botones barra -->
    <template                   #barra>
      <q-btn                    round dense flat
        icon                    ="mdi-refresh"
        class                   ="op60 op100-hover"
        @click                  ="buscar"
        >
        <Tooltip label          ="Recargar enlaces"/>
      </q-btn>   
    </template>
    <q-table                    borbordered dense flat hide-bottom
      class                     ="fit tabla-maco"
      row-key                   ="id"
      :rows                     ="acuerdos"
      :columns                  ="columnas"
      style                     ="min-height: 208px;"
      >
      <!-- //* ///////////////  Columna Ref  -->
      <template #body-cell-ref  ="props">
        <q-td   :props          ="props">
          <ref-acuerdo          ref-larga
            :acuerdo            ="props.row"
            @click-acuerdo      ="( a : IAcuerdo )=> acuerdo = a "
          />
        </q-td>
      </template>
      <!-- //* ///////////////  Columna Estado  -->
      <template #body-cell-estado="props">
        <q-td   :props          ="props">
          <estado :acuerdo      ="props.row"/>
        </q-td>
      </template>
    </q-table>
  </ventana>
</template>

<script setup lang="ts">
  //* /////////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            watch,
                                  } from "vue"
  // * /////////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'      
  //* /////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ModosVentana          } from "src/models/TiposVarios"
  import {  IColumna,
            Columna               } from "src/models/Tabla"
  import {  IAcuerdo              } from "src/areas/acuerdos/models/Acuerdo"  
  //* ///////////////////////////////////////////////////////////////////////////////////// Modelos
  import {  TTipoAcuerdo, 
            TIPO_ACUERDO          } from "src/areas/acuerdos/models/ConstantesAcuerdos"
  import {  EnlaceAnticipo, 
            IEnlaceAnticipo       } from "src/areas/acuerdos/models/EnlaceAnticipo"
  //* /////////////////////////////////////////////////////////////////////////////////// Componibles
  import {  servicesAcuerdos      } from "src/areas/acuerdos/services/servicesAcuerdos"
  import {  useFetch              } from "src/useSimpleOk/useFetch"
  import {  getURL,
            getFormData           } from "src/services/APIMaco"
  import {  pausa                 } from "src/useSimpleOk/useTools"            
  //* /////////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"
  import    refAcuerdo              from "src/areas/acuerdos/components/Busqueda/Columnas/RefAcuerdo.vue"
  import    estado                  from "src/areas/acuerdos/components/Busqueda/Columnas/Estado.vue"
  
  const { getAcuerdos       }       = servicesAcuerdos()
  const { acuerdo           }       = storeToRefs( useStoreAcuerdo() )
  const { miFetch           }       = useFetch()
  const modo                        = ref< ModosVentana >("esperando-busqueda")
  const endPoint                    = getURL("listas", "varios")
  const enlaces : IEnlaceAnticipo[] = []
  
  const columnas: IColumna[]  = [
    new Columna({ name: "ref"       }),
    new Columna({ name: "estado"    }),
    //Columna.ColumnaPrecio ({ name: "totalConDescu", label: "Subtotal",    clase: "text-bold"    }),
  ]
  const acuerdos              = ref< IAcuerdo[] >([])

  watch( ()=>acuerdo.value.ref, async ( ref )=> {
    if(!ref) return
    await pausa(800)
    buscar()
  })
  
  defineExpose({  buscar })  

  async function buscar()
  {
    modo.value                = "buscando"
    await buscarEnlaces()
    await buscarAcuerdo()
    modo.value                = !!acuerdos.value.length ? "normal" : "sin-resultados"
  }

  async function buscarEnlaces()
  {
    const objeto          = { ref: acuerdo.value.ref, id: acuerdo.value.id }
    const { ok, data }    = await miFetch(  endPoint,
                                                { method: "POST", body: getFormData( "buscarEnlacesAcuerdo", objeto ) },
                                                { dataEsArray: true, mensaje: "buscar enlaces" }
                                              )
    if(ok && Array.isArray( data ) && !!data.length)
    {
      enlaces.length      = 0
      for (const item of data)      
        enlaces.push( EnlaceAnticipo.enlaceApiToEnlace( item ) )      
    }
  }  

  async function buscarAcuerdo()
  {
    const pedi            = getIds(   TIPO_ACUERDO.PEDIDO_CLI       )
    const coti            = getIds(   TIPO_ACUERDO.COTIZACION_CLI   )
    const oc_p            = getIds(   TIPO_ACUERDO.PEDIDO_PRO )
    const paquete         = [ { ids:  pedi, tipo: TIPO_ACUERDO.PEDIDO_CLI       },
                              { ids:  coti, tipo: TIPO_ACUERDO.COTIZACION_CLI   },
                              { ids:  oc_p, tipo: TIPO_ACUERDO.PEDIDO_PRO }
                            ]
    acuerdos.value        = []                            

    for (const item of paquete )
    {
      if( !item.ids ) continue
      const query               = {
                                    acuerdo:    item.tipo,
                                    tipo:       "busqueda",
                                    ids:        item.ids,
                                    limite:     50,
                                    offset:     0
                                  }
      const acuerdosI           = await getAcuerdos( query )
      acuerdos.value.push( ...acuerdosI )
    }

    function getIds( tipo : TTipoAcuerdo ) :string
    {
      const enla                = enlaces.filter( e => e.tipo === tipo )
      return  !!enla.length
              ? enla.flatMap( ( enla )=> enla.id_objeto ).join(",")
              : ""
    }
  }
</script>
<style>
.fecha{
  width: 80px;
  display: inline-block;
}
</style>
