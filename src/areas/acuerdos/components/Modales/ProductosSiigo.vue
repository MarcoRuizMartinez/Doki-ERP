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
      <!-- //* /////////////////////////////////////////////////////////////////////// Boton Toggle Productos Kits -->
      <q-btn-toggle               spread glossy dense unelevated no-caps 
        v-model                   ="tab"
        toggle-color              ="primary"
        style                     ="width: 250px;"
        :options                  ="tabs"
      />
      <!-- //* /////////////////////////////////////////////////////////////////////// Boton Descarga -->
      <q-btn
        v-bind                    ="style.btnBaseMd"
        label                     ="Descargar"
        icon                      ="mdi-microsoft-excel"
        color                     ="primary"
        @click                    ="descargar"
      />
      <!-- //* /////////////////////////////////////////////////////////////////////// Boton Cargardo en Siigo -->
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
      class                       ="fit"
      >
      <!-- //* /////////////////////////////////////////////////////////////////////// Tab Productos Siigo -->
      <q-tab-panel
        name                      ="productos"
        class                     ="q-pa-none"
        >
        <!-- //* ///////////////////////////////////////////////////////////////////// Tabla Productos Siigo -->
        <q-table                  bordered dense flat
          id                      ="tabla-productos"
          class                   ="tabla-maco tabla-siigo"
          row-key                 ="ref"
          :rows                   ="lista"
          :columns                ="columnas"
          :visible-columns        ="['enSiigo', 'idProducto', 'linea', 'grupo', 'codigo', 'nombre', 'ref' ]"      
          :hide-bottom            ="lista.length <= itemsXPagina "
          :rows-per-page-options  ="[itemsXPagina]"
          >
        </q-table>
      </q-tab-panel>
      <!-- //* /////////////////////////////////////////////////////////////////////// Tab Kits Siigo -->
      <q-tab-panel
        name                      ="kits"
        class                     ="q-pa-none"
        >
        <!-- //* //////////////////////////////////////////////////////////////////// Tabla Kits Siigo -->
        <q-table                  bordered dense flat
          id                      ="tabla-kits"
          class                   ="tabla-maco tabla-siigo"
          row-key                 ="ref"          
          :rows                   ="kitsSiigo"
          :columns                ="columnasKits"          
          :hide-bottom            ="productosHijos.length <= itemsXPagina "
          :rows-per-page-options  ="[itemsXPagina]"
          >
        </q-table>
      </q-tab-panel>
    </q-tab-panels>
  </ventana>
</template>

<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref, computed,
            onMounted             } from "vue"

  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  

  // * ///////////////////////////////////////////////////////////////////////////////// Modelos
  import {  ILineaAcuerdo         } from 'src/areas/acuerdos/models/LineaAcuerdo';
  import {  IProductoHijo         } from 'src/areas/productos/models/ProductoHijo';
  import {  IColumna, Columna     } from "src/models/Tabla"
  import {  TKitSiigo,
            TCodigosSiigo,
            columnasSiigo         } from 'src/areas/productos/models/Siigo';
  //import {  IUnidad               } from "src/models/Diccionarios/Unidad"
  //import {  INaturalezaProducto   } from "src/models/Diccionarios/NaturalezaProducto"

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

  const { buscarProductosHijosSiigo,
          marcarEnSiigo           } = servicesProductos()

  const { aviso                   } = useTools()
  const cargandoDatos               = ref<boolean>( true )
  const descargaOk                  = ref<boolean>( false )
  const tab                         = ref<string>( "" )  
  const lista                       = ref<TCodigosSiigo[]>([])
  const productosHijos              = ref<IProductoHijo[]>([])
  const productosHijosConHijos      = ref<IProductoHijo[]>([])
  const kitsSiigo                   = ref<TKitSiigo    []>([])
  const columnas      : IColumna[]  = []
  const columnasKits  : IColumna[]  = [
                                        new Columna({ name : "padreLinea",  label : "LÍNEA TERMINADO" }),
                                        new Columna({ name : "padreGrupo",  label : "GRUPO TERMINADO" }),
                                        new Columna({ name : "padreCodigo", label : "PRODUCTO TERMINADO" }),
                                        new Columna({ name : "linea",       label : "LÍNEAS HIJO" }),
                                        new Columna({ name : "grupo",       label : "GRUPO HIJO" }),
                                        new Columna({ name : "codigo",      label : "PRODUCTO HIJO" }),
                                        new Columna({ name : "qty",         label : "QTY" }),
                                        new Columna({ name : "unidadDian",  label : "PESO" }),
                                      ]
  const tabs                          = computed(()=> [
                                          { value: 'productos', label: `Productos (${lista.value.length})` },
                                          { value: 'kits',      label: `Kits (${productosHijos.value.length})` },
                                        ])                                                
  const itemsXPagina                  = 15

/*
  type TProducto = {
    id          : number
    ref         : string
    sigla      ?: string
    nombre      : string
    siigo       : TCodigosSiigo
    unidad      : IUnidad
    naturaleza  : INaturalezaProducto
  }
*/


  onMounted( async () => {    
    columnasSiigo.forEach( c => columnas.push( new Columna( c ) ) )
    columnas.splice(80, 0,  new Columna({ name: 'unidadDian', label: 'UNIDAD FE', visible: false }))

    cargandoDatos.value             = true
    await procesarProductos()
    cargandoDatos.value             = false
    tab.value                       = "productos"
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
    await procesarHijosConHijos()
    generarKits()
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
    if( p.siigo.esServicio ) return // Para que no me agregue lineas 524 y 523 que son servicios

    lista.value.push( { ...p.siigo,
                        idProducto  : p.id,
                        ref         : p.ref,
                        nombre      : p.nombre.toUpperCase().slice(0, 50),
                        unidadDian  : p.unidad.codigo,
                      } )
  }

  async function procesarProductoCompuestos( p : ILineaAcuerdo )
  {
    if(!p.naturaleza.esCompuesto && !p.naturaleza.esKit ) return

    const productos                 = await buscarProductosHijosSiigo( p.id )
    copiarHijosAListas( productos, p.siigo )
  }

  function copiarHijosAListas( hijos : IProductoHijo[], siigoPadre : TCodigosSiigo )
  {
    for (const hijo of hijos)
    {
      if( hijo.siigo.esServicio ) continue

      const yaExiste          = productosHijos.value.some( h => h.siigo.codigoFull === hijo.siigo.codigoFull )

      if( !yaExiste)
      {
        hijo.siigo.idProducto = hijo.hijo_id
        hijo.siigo.nombre     = hijo.nombre
        hijo.siigo.ref        = hijo.ref
        lista.value.push( hijo.siigo )
      }
      
      const newHijo                   = hijo
            newHijo.siigoPadre        = siigoPadre
      productosHijos.value.push( newHijo )

      if( hijo.naturaleza.esCompuesto_o_Kit)
        productosHijosConHijos.value.push( hijo )
    }
  }

  async function procesarHijosConHijos()
  {
    for (const hch of productosHijosConHijos.value)
    {
      const productos                 = await buscarProductosHijosSiigo( hch.hijo_id )
      copiarHijosAListas( productos, hch.siigo )
    } 
  }

  function generarKits()
  {
    for (const hijo of productosHijos.value)
    {
      const kit : TKitSiigo = {
        padreLinea  : hijo.siigoPadre.linea,
        padreGrupo  : hijo.siigoPadre.grupo,
        padreCodigo : hijo.siigoPadre.codigo,
        linea       : hijo.siigo.linea,
        grupo       : hijo.siigo.grupo,
        codigo      : hijo.siigo.codigo,
        qty         : hijo.qty,
        unidadDian  : hijo.siigo.unidadDian,
      }      

      kitsSiigo.value.push( kit )
    }
  }


  async function marcarCargado( on : boolean )
  {
    const idsMarcar = lista.value.map( i => i.idProducto ).join(",")
    const ok        = await marcarEnSiigo( idsMarcar, on )

    if(ok){
      acuerdo.value.productos .forEach( p => p.siigo.enSiigo  = on )
      productosHijos.value    .forEach( p => p.siigo.enSiigo  = on)
      lista.value             .forEach( p => p.enSiigo        = on)
    }
  }


  function descargar()
  {
    let ok            = false
    descargaOk.value  = false

    if(tab.value      === "productos")
      ok              = generarCSVDesdeTabla(  `${ acuerdo.value.ref} Siigo productos`, columnas,     lista.value.filter( i => !i.enSiigo ))
    else
      ok              = generarCSVDesdeTabla(  `${ acuerdo.value.ref} Siigo kits`,      columnasKits, kitsSiigo.value )

    if(ok){
      aviso("positive", "Archivo generado", "file")
      descargaOk.value = true
    }
    else
      aviso("negative", "Error al generar el archivo...", "file")    
  }
</script>


<style>
  #tabla-productos > div.q-table__bottom, #tabla-kits > div.q-table__bottom{
    flex-direction: row-reverse !important;
  }
</style>

<style scoped>
  .tabla-siigo{    
    min-width: 700px;
  }
</style>