<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            onMounted             } from "vue"

  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  

  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ILineaAcuerdo         } from 'src/areas/acuerdos/models/LineaAcuerdo';
  import {  IProductoHijo         } from 'src/areas/productos/models/ProductoHijo';
  import {  IColumna, Columna     } from "src/models/Tabla"
  import {  TCodigosSiigo,
            columnasSiigo         } from 'src/areas/productos/models/Siigo';

  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  style                 } from "src/composables/useEstilos"
  import {  useTools,
            ToolNum               } from "src/composables/useTools"
  import {  useControlProductos   } from "src/areas/productos/controllers/ControlProductosDolibarr"
  import {  servicesProductos     } from "src/areas/productos/services/servicesProductos"
  import {  useApiDolibarr        } from "src/composables/useApiDolibarr"  
  import {  generarCSVDesdeTabla  } from "src/composables/UtilFiles"
    
  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"  

  //* //////////////////////      /////////////////////////////////////////     
  const { acuerdo                 } = storeToRefs( useStoreAcuerdo() )
  const { codigoYaExiste,
          buscarCodigosSiigo,     } = useControlProductos()
  const { apiDolibarr             } = useApiDolibarr()

  const { marcarEnSiigo,
          buscarProductosHijos    } = servicesProductos()

  const { aviso                   } = useTools()
  const cargandoDatos               = ref<boolean>( true )
  const descargaOk                  = ref<boolean>( false )
  const tab                         = ref<string>( "productos" )  
  const lista                       = ref<TCodigosSiigo[]>([])
  const productosHijos              = ref<IProductoHijo[]>([])
  const columnas      : IColumna[]  = []
  const columnasKits  : IColumna[]  = [
                                        new Columna({ name : "padreLinea",  label : "LÍNEA TERMINADO" }),
                                        new Columna({ name : "padreGrupo",  label : "GRUPO TERMINADO" }),
                                        new Columna({ name : "padreCodigo", label : "PRODUCTO TERMINADO" }),
                                        new Columna({ name : "linea",       label : "LÍNEAS HIJO" }),
                                        new Columna({ name : "grupo",       label : "GRUPO HIJO" }),
                                        new Columna({ name : "codigo",      label : "PRODUCTO HIJO" }),
                                        new Columna({ name : "qty",         label : "CANTIDAD" }),
                                        new Columna({ name : "unidad",      label : "PESO" }),
                                      ]



  onMounted( async () => {
    columnasSiigo.forEach( c => columnas.push( new Columna( c ) ) )

    cargandoDatos.value             = true
    await procesarProductos()
    cargandoDatos.value             = false
  })

  async function procesarProductos()
  {
    for (const p of acuerdo.value.productos)
    {
      if(p.esTituloOsubTotal) continue

      await generarCodigosSiigo       ( p )
      await buscarLineaYGrupo         ( p )
            copiarLineaALista         ( p )
      await procesarProductoCompuestos( p )
    }
  }

  async function generarCodigosSiigo( p : ILineaAcuerdo )
  {
    if(!!p.siigo.codigo) return // No es necesario ya que el producto ya tiene codigo

    while(true)
    {
      p.siigo.codigo                = ToolNum.numberRandomRango( 100000, 999999 )
      const yaExiste                = await codigoYaExiste( p.siigo.codigo )

      if(!yaExiste)
      {
        const { ok }                = await apiDolibarr("editar", "producto", { customcode: p.siigo.codigo }, p.id )
        if(ok) break
      }
    }
  }

  async function buscarLineaYGrupo( p : ILineaAcuerdo )
  {
    p.siigo                         = await buscarCodigosSiigo( p.sigla, p.siigo.codigo, p.siigo.enSiigo )
  }

  function copiarLineaALista( p : ILineaAcuerdo )
  {
    if( lista.value.some( item => item.ref === p.ref ) ) return // Para que no haya items duplicados
    lista.value.push( { ...p.siigo,
                        idProducto  : p.id,
                        ref         : p.ref,
                        nombre      : p.nombre.toUpperCase().slice(0, 50)
                      } )
  } 

  async function procesarProductoCompuestos( p : ILineaAcuerdo )
  {
    if(!p.naturaleza.esCompuesto && !p.naturaleza.esKit ) return

    const productos                 = await buscarProductosHijos( p.id )
    copiarHijosAListas( productos, p )
  }

  function copiarHijosAListas( hijos : IProductoHijo[], padre : ILineaAcuerdo )
  {
    for (const hijo of hijos)
    {
      if( !productosHijos.value.some( h => h.codigoFull === hijo.codigoFull ) ){
        lista         .value.push( { ...hijo, idProducto : hijo.hijo_id } )
      }
      
      const newHijo                 = hijo
            newHijo.padreLinea      = padre.siigo.linea
            newHijo.padreGrupo      = padre.siigo.grupo
            newHijo.padreCodigo     = padre.siigo.codigo
      productosHijos.value.push( newHijo )
    }
  }  

  async function marcarCargado( on : boolean )
  {
    const idsMarcar = lista.value.map( i => i.idProducto ).join(",")
    const ok        = await marcarEnSiigo( idsMarcar, on )

    if(ok){
      acuerdo.value.productos .forEach( p => p.siigo.enSiigo  = on )
      productosHijos.value    .forEach( p => p.enSiigo        = on)
      lista.value             .forEach( p => p.enSiigo        = on)
    }
  }


  function descargar()
  {
    if(tab.value  === "productos")
    {
      let ok = generarCSVDesdeTabla(  `${ acuerdo.value.ref} Siigo productos`, columnas, lista.value.filter( i => !i.enSiigo ))

      if (ok){
        aviso("positive", "Archivo generado", "file")
        descargaOk.value = true
      }
      else
        aviso("negative", "Error al generar el archivo...", "file")
    }
    else
    {
      let ok = generarCSVDesdeTabla(  `${ acuerdo.value.ref} Siigo kits`, columnasKits, productosHijos.value )

      if (ok){
        aviso("positive", "Archivo generado", "file")
        descargaOk.value = true
      }
      else
        aviso("negative", "Error al generar el archivo...", "file")
    }    
  }
</script>

<!-- //* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- //* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- //* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- //* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->

<template>
  <ventana                        cerrar
    titulo                        ="Productos Siigo"
    icono                         ="mdi-file-table-box-multiple-outline"
    class-contenido               ="column items-center"    
    size-icon-carga               ="14em"
    padding-contenido             ="0"
    style                         ="max-width: 800px;"
    min-width                     ="800px"
    height-card-min               ="320px"
    :cargando                     ="cargandoDatos"
    >
    <template                     #menu>
      <q-btn-toggle               spread glossy dense unelevated no-caps 
        v-model                   ="tab"
        toggle-color              ="primary"
        style                     ="width: 200px;"
        :options                  ="[
                                      { label: 'Productos', value: 'productos'},
                                      { label: 'Kits',      value: 'kits'},
                                    ]"
      />
      <q-btn
        v-bind                    ="style.btnBaseMd"
        label                     ="Descargar"
        icon                      ="mdi-microsoft-excel"
        color                     ="primary"
        @click                    ="descargar"
      />
      <q-btn
        v-if                      ="tab === 'productos'"
        v-bind                    ="style.btnBaseMd"
        label                     ="Marcar"
        icon                      ="mdi-check-box-outline"
        color                     ="primary"
        >
        <q-menu
          transition-show         ="jump-down"
          transition-hide         ="jump-up"
          >
          <q-list>
            <q-item               clickable
              :disable            ="!descargaOk"
              @click              ="marcarCargado(true)"
              >
              <q-item-section>Marcar como ya cargado</q-item-section>
              <Tooltip label      ="Marca productos como, ya cargados en Siigo. Solo después de descargar. "/>
            </q-item>
            <q-item               clickable
              @click              ="marcarCargado(false)">
              <q-item-section>Marcar como no cargado</q-item-section>
              <Tooltip label      ="Marca productos como, no cargados en Siigo"/>
            </q-item>
          </q-list>
        </q-menu>
      </q-btn>
    </template>
    <q-tab-panels                 animated
      v-model                     ="tab"      
      >
      <!-- //* /////////////////////////////////////////////////////////////////////// Tab Productos Siigo -->
      <q-tab-panel
        name                      ="productos"
        class                     ="q-pa-none"
        >
        <!-- //* ///////////////////////////////////////////////////////////////////// Tabla Productos Siigo -->
        <q-table                  bordered dense flat hide-selected-banner hide-no-data
          id                      ="tabla-productos"
          class                   ="fit tabla-maco"
          row-key                 ="ref"
          :rows                   ="lista"
          :columns                ="columnas"
          :visible-columns        ="['enSiigo', 'idProducto', 'linea', 'grupo', 'codigo', 'nombre', 'ref' ]"      
          style                   ="min-height: 200px;"
          :rows-per-page-options  ="[15]"
          >
        </q-table>
      </q-tab-panel>
      <!-- //* /////////////////////////////////////////////////////////////////////// Tab Kits Siigo -->
      <q-tab-panel
        name                      ="kits"
        class                     ="q-pa-none"
        >
        <!-- //* //////////////////////////////////////////////////////////////////// Tabla Kits Siigo -->
        <q-table                  bordered dense flat hide-selected-banner hide-no-data
          id                      ="tabla-kits"
          class                   ="fit tabla-maco"
          row-key                 ="ref"
          :rows                   ="productosHijos"
          :columns                ="columnasKits"          
          style                   ="min-height: 200px;"
          :rows-per-page-options  ="[15]"
          >
        </q-table>
      </q-tab-panel>
    </q-tab-panels>    
  </ventana>
</template>
<style>

#tabla-productos > div.q-table__bottom, #tabla-kits > div.q-table__bottom{
  flex-direction: row-reverse !important;
}

</style>