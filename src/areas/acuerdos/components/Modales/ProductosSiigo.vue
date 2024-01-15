<script setup lang="ts">
  //* ///////////////////////////////////////////////////////////////////////////////// Core
  import {  ref,
            onMounted             } from "vue"
  // * ///////////////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs           } from 'pinia'                            
  import {  useStoreAcuerdo       } from 'src/stores/acuerdo'  

  // * ///////////////////////////////////////////////////////////////////////////////// Componibles
  import {  style                 } from "src/composables/useEstilos"
  import {  useTools,
            numberRandomRango     } from "src/composables/useTools"
  import {  useControlProductos   } from "src/areas/productos/controllers/ControlProductosDolibarr"
  import {  useApiDolibarr        } from "src/composables/useApiDolibarr"  
  import {  generarCSVDesdeTabla  } from "src/composables/UtilFiles"
  import {  TCodigosSiigo         } from "src/models/TiposVarios"
  import {  IColumna,
            Columna               } from "src/models/Tabla"
  // * ///////////////////////////////////////////////////////////////////////////////// Componentes
  import    ventana                 from "components/utilidades/Ventana.vue"

  //* //////////////////////      /////////////////////////////////////////     
  const { acuerdo                 } = storeToRefs( useStoreAcuerdo() )
  const { codigoYaExiste,
          buscarCodigosSiigo,     } = useControlProductos()
  const { apiDolibarr             } = useApiDolibarr()

  const { aviso                   } = useTools()
  const cargandoDatos               = ref<boolean>( true )
  const lista                       = ref<TCodigosSiigo[]>([])
  const columnas : IColumna[]     = [
                                     new Columna({ name: "linea",   clase: "fuente-mono"}),
                                     new Columna({ name: "grupo",   clase: "fuente-mono"}),
                                     new Columna({ name: "codigo",  clase: "fuente-mono"}),
                                     new Columna({ name: "ref"    }),
                                     new Columna({ name: "nombre" }),
                                   ]

  onMounted( async ()=>{
    cargandoDatos.value             = true
    console.log("generarCodigosSiigo: ");
    await generarCodigosSiigo()
    console.log("buscarLineaYGrupo: ");
    await buscarLineaYGrupo()
    console.log("generarLista: ");
          generarLista()
    cargandoDatos.value             = false
  })

  async function generarCodigosSiigo()
  {
    for (const p of acuerdo.value.productos)
    {
      if(!!p.siigo.codigo || p.esTituloOsubTotal) continue // No es necesario ya que el producto ya tiene codigo
      while(true)
      {
        p.siigo.codigo  = numberRandomRango( 100000, 999999 )
        const yaExiste  = await codigoYaExiste( p.siigo.codigo )
        if(!yaExiste)
        {
          const { ok }  = await apiDolibarr("editar", "producto", { customcode: p.siigo.codigo }, p.id )
          if(ok) break
        }
      }
    }
  }

  async function buscarLineaYGrupo()
  {
    for (const p of acuerdo.value.productos)
    {
      if(p.esTituloOsubTotal) continue
      p.siigo = await buscarCodigosSiigo( p.sigla, p.siigo.codigo )
    }
  }

  function generarLista()
  {
    for (const p of acuerdo.value.productos)
    {
      if(
          p.esTituloOsubTotal                             // Para que no agregue Titulos o subtotales
          ||
          lista.value.some( item => item.ref === p.ref )  // Para que no haya items duplicados 
      ) continue      

      lista.value.push( { ...p.siigo, ref : p.ref, nombre: p.nombre.toUpperCase().slice(0, 50) } )
    }
    console.log("lista.value: ", lista.value);


  }
  
  
  function descargarProductos()
  {
    let ok = generarCSVDesdeTabla(  `Codigos Siigo ${ acuerdo.value.ref}`, columnas, lista.value)

    if (ok) aviso("positive", "Archivo generado", "file")
    else    aviso("negative", "Error al generar el archivo...", "file")
  }


</script>

<!-- //* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- //* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- //* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->
<!-- //* ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// -->


<template>
  <ventana                    cerrar
    titulo                    ="Productos Siigo"
    icono                     ="mdi-file-table-box-multiple-outline"
    class-contenido           ="column items-center"    
    size-icon-carga           ="14em"
    padding-contenido         ="0"
    style                     ="max-width: 700px;"
    min-width                 ="700px"    
    :cargando                 ="cargandoDatos"
    >
    <template                 #menu>
      <q-btn
        v-bind                ="style.btnBaseMd"
        label                 ="Descargar productos"
        icon                  ="mdi-microsoft-excel"
        color                 ="primary"
        @click                ="descargarProductos"
      />
    </template>
    <q-table                  bordered dense flat hide-bottom
      class                   ="fit tabla-maco"
      row-key                 ="id"
      :rows                   ="lista"
      :columns                ="columnas"
      style                   ="min-height: 200px;"
      :rows-per-page-options  ="[100]"
      >
    </q-table>
  </ventana>
</template>