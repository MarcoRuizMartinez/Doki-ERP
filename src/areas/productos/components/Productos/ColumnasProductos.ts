import {  Col                     } from "components/utilidades/AgGrid/ColumnasAG"
import {  ColDef,
          ColTypeDef,
          ColGroupDef             } from "ag-grid-community"
import {  getCategoriasDB,
          getNaturalezasDB,
          getUnidadesDB,
                                  } from "src/composables/useDexie"
import {  TiposProductos          } from "src/areas/productos/models/TipoProducto"
//import {  MesesGarantia           } from "src/models/Diccionarios/MesesGarantia"
//import {  OriginesMadeIn          } from "src/models/Diccionarios/MadeIn"
import {  Format,
          ToolType
                                  } from "src/composables/useTools"
import {  IProductoDoli           } from "../../models/ProductoDolibarr"
import imagen                       from "./../ImagenProductoAG.vue"
//import proveedor                    from "components/utilidades/AgGrid/ProveedorBadge.vue"

export const reglasCSS = {
/*   'bg-grey-10 text-grey-2 text-bold'  : ( params : any ) =>  !params.data,
  'bg-grey-3 text-grey-7'             : ( params : any ) =>  !!params.data && !params.data?.activo     && !params.data?.esNuevo,
  'text-deep-purple-3'                : ( params : any ) => { return !params.data?.disponible && !!params.data?.activo && !params.data?.esNuevo },
  'bg-green-2'                        : ( params : any ) => { return params.data?.esNuevo },
  'bg-amber-1'                        : ( params : any ) => { return params.data?.tipo?.esCompuesto || params.data?.tipo?.esHijo }, */
}

export const autoSizeStrategy = {
  type                  : 'fitCellContents', // fitProvidedWidth fitGridWidth
  defaultMinWidth       : 100,  
  columnLimits          : [{ colId: 'ref', minWidth: 900}]
}

export const columnTypes : { [key: string]: ColTypeDef< IProductoDoli > } = {
  moneda:
  { 
    valueFormatter  : Format.precioAG,
    cellClass       : "text-right fuente-mono",
  },
  porcentaje:
  { 
    valueFormatter  : p => p.value + "%",
    cellClass       : "text-right fuente-mono",
  },  
  numero:
  {
    cellClass       : "text-right",
  },
  editable:
  {
    /* editable: p => {
      if(!p.data) return false

      const columna         = p.colDef?.field ?? "" 
      const campoEspecial   = esFieldDeEditarHijo( columna ) 
      const hijoNoEspecial  = p.data.tipo.esHijo && !campoEspecial
      if(hijoNoEspecial)
        return false

      return p.data.editable
    } */
  },
  creacion:
  {
    /* editable: p => {
      if(!p.data) return false

      const columna         = p.colDef?.field ?? "" 
      const campoEspecial   = esFieldDeEditarHijo( columna ) 
      const hijoNoEspecial  = p.data.tipo.esHijo && !campoEspecial
      if(hijoNoEspecial)
        return false

      return ( p.data?.esNuevo ?? false )
    } */
  },
  editarYCrear:
  {
    editable: p => {
      if(!p.data) 
        return false

      const columna         = p.colDef?.field ?? "" 
      /* const campoEspecial   = esFieldDeEditarHijo( columna ) 
      const hijoNoEspecial  = p.data.tipo.esHijo && !campoEspecial
      if(hijoNoEspecial)
        return false */

      return  ( p.data?.esNuevo ?? false )  ||  p.data.editable
    }
  }     
}

/* function esFieldDeEditarHijo( field : string )
{
  return      field == "ref"
          ||  field == "nombre"
          ||  field == "urlImagen"
          ||  field == "activo"
          ||  field == "disponible"
          ||  field == "stock"
          ||  field == "fechaLlegada"
          ||  field == "refPadre"
          ||  field == "descripcion"
          ||  field == "orden"
          ||  field == "tipo"
          ||  field == "categoria"
          ||  field == "familia"
          ||  field == "costoExtra"
          ||  field == "garantiaMeses"
          ||  field == "stockGestionado"
} */

//const limpiarRef   = ( p : any ) => ToolType.keyStringValido(p, "newValue").replaceAll(" ", "").trim()


const claseColFn            = ( color : string, nivel : number ) => `bg-${color}-${nivel} text-white`
const claseCol              = ( color : string ) => { return { col: claseColFn( color, 6 ),  header: claseColFn( color, 10 )} }
const claseHDatos           = claseCol("light-blue")
const claseHDispo           = claseCol("purple")
const claseHRequi           = claseCol("brown")
const claseHPrecios         = claseCol("deep-orange")
const claseHCostos          = claseCol("indigo")
const claseHExtras          = claseCol("blue-grey")
const claseHRegistro        = claseCol("pink")

// * ////////////////////////////////////////////////////////////////////////////////////////////////// COLUMNAS
export function columnasProductos( conPrecios : boolean ) : ( ColDef< IProductoDoli >  | ColGroupDef )[] 
{
  // * //////////////////////////////////////////////////////////////////////////////// Imagen
  const columnas : (ColDef< IProductoDoli >  | ColGroupDef)[] = [
    {
      headerName            : "🖼️",
      field                 : "img",
      headerClass           : claseColFn( "grey", 10 ),
      width                 : 80, 
      cellRenderer          : imagen,
      filter                : "agSetColumnFilter",
      valueFormatter        : ( p : any ) => p.value?.hayImagen ?? "",
      //cellClassRules        : { 'bg-deep-orange-2': ( p : any ) => ( p.data?.esNuevo ?? false ) && !p.data.sePuedeCrear }
    },
    // * //////////////////////////////////////////////////////////////////////////////// Datos basicos
    {
      headerName            : "🗃️ Datos de producto",
      headerClass           : claseHDatos.header,
      marryChildren         : false,
      children              :
      [
        { headerName        : "🆔Ref",
          field             : "ref",
          headerClass       : claseHDatos.col,
          hide: false,
        },
        { headerName        : "👤Nombre",
          field             : "nombre",
          headerClass       : claseHDatos.col,
          type              : "editarYCrear",
          minWidth          : 340,
          hide: true,
        },
        { headerName        : "📝Nota",
          field             : "nota",
          headerClass       : claseHDatos.col,          
          hide: true,
          type              : "editarYCrear",
        },
        { headerName        : "📙Documento",
          field             : "documento",
          headerClass       : claseHDatos.col,          
          hide: true,
          type              : "editarYCrear",
        },
        { headerName        : "👨‍👩‍👧‍👦Familia",
          field             : "familia",
          headerClass       : claseHDatos.col,          
          type              : "editarYCrear",
          hide: true,
          enableRowGroup    : true,
          valueParser       : p => ToolType.keyStringValido(p, "newValue").trim()          
        },                
        Col.Objeto(
          {
            headerName      : "🆎Categoría",
            field           : "categoria",
            headerClass     : claseHDatos.col,
            opciones        : getCategoriasDB,
            key             : "label",
            type            : "creacion",
            hide: true,
            cellClassRules  : { 'bg-deep-orange-2': p => ( p.data?.esNuevo ?? false ) && !p.data.okCategoria },
            noNulo          : true,
          }
        ),
        Col.Objeto(
          {
            headerName      : "🔢Tipo",
            field           : "tipo",
            headerClass     : claseHDatos.col,
            opciones        : TiposProductos,
            key             : "label",
            type            : "editarYCrear",
            noNulo          : true,
            hide: false,
          } 
        ),
        Col.Objeto(
          {
            headerName      : "🌱Naturaleza",
            field           : "naturaleza",
            headerClass     : claseHDatos.col,
            opciones        : getNaturalezasDB,
            key             : "label",
            type            : "editarYCrear",
            minWidth        : 160,
            noNulo          : true,
            hide: true,
          }
        ),
        Col.Objeto(
          {
            headerName      : "📐Unidad",
            field           : "unidad",
            headerClass     : claseHDatos.col,
            opciones        : getUnidadesDB,
            key             : "label",
            type            : "editarYCrear",
            noNulo          : true,
            hide: true,
          }
        ),
        { headerName        : "📄Descripción",
          field             : "descripcion",
          headerClass       : claseHDatos.col,
          minWidth          : 340,
          type              : "editarYCrear",
          hide: true,
        },
      ]
    },
  ]

  // * //////////////////////////////////////////////////////////////////////////////// Disponibilidad  
  columnas.push(
    {
      headerName            : "📦 Disponibilidad de producto",                      
      headerClass           : claseHDispo.header,
      marryChildren         : false,      
      children              :
      [
        Col.Boolean({
          headerName        : "✅En venta",
          field             : "activoEnVenta",
          headerClass       : claseHDispo.col,
          type              : "editarYCrear",
          minWidth          : 140,
          hide: true,
        }),
        Col.Boolean({
          headerName        : "✅En compra",
          field             : "activoEnCompra",
          headerClass       : claseHDispo.col,
          type              : "editarYCrear",
          minWidth          : 140,
          hide: true,
        }),
        Col.Boolean({
          headerName        : "⛔Sin proveedor",
          field             : "sin_proveedor",
          headerClass       : claseHDispo.col,
          type              : "editarYCrear",
          minWidth          : 170,
          editable          : false,
          hide: true,
        }),
        Col.Boolean({
          headerName        : "📦Stock gestionado",
          field             : "stockGestionado",
          headerClass       : claseHDispo.col,
          minWidth          : 180,
          editable          : false,
          hide: true,
        }),        
        Col.Boolean({
          headerName        : "📦Stock proveedor",
          field             : "stockProveedor",
          headerClass       : claseHDispo.col,
          type              : "editarYCrear",
          minWidth          : 180,
          editable          : false,
          hide: true,
        }),
      ]
    },
  )

  // * //////////////////////////////////////////////////////////////////////////////// Requerimientos
  columnas.push(
    {
      headerName            : "✔️ Requerimientos",                      
      headerClass           : claseHRequi.header,
      marryChildren         : false,
      children              :
      [
        Col.Boolean({
          headerName        : "✅Acabado",
          field             : "requiereAcabado",
          headerClass       : claseHRequi.col,
          type              : "editarYCrear",
          minWidth          : 130,
          hide: true,
        }),
        Col.Boolean({
          headerName        : "✅Medida",
          field             : "requiereMedida",
          headerClass       : claseHRequi.col,
          type              : "editarYCrear",
          minWidth          : 130,
          hide: true,
        }),
        Col.Boolean({
          headerName        : "✅Entrega",
          field             : "requiereEntregado",
          headerClass       : claseHRequi.col,
          type              : "editarYCrear",
          minWidth          : 130,
          hide: true,
        }),
      ]
    },
  )
  

  // * //////////////////////////////////////////////////////////////////////////////// Precios
  columnas.push(
    {
      headerName            : "🪙 Precios",                      
      headerClass           : claseHPrecios.header,
      marryChildren         : false,
      children              :
      [
        Col.Precio({
          headerName        : "🪙Precio final",
          field             : "precio_final",
          headerClass       : claseHPrecios.col,
          hide: false,
        }),
        { headerName        : "🏦IVA",
          field             : "iva",
          headerClass       : claseHPrecios.col,
          type              : "porcentaje",
          width             : 90,
          hide: true,
        },
        { headerName        : "↗️Base",
          field             : "aumento",
          headerClass       : claseHPrecios.col,
          type              : ["porcentaje", "editarYCrear"],
          width             : 100,
          hide: false,
          valueParser       : reglaAumento
        },        
        Col.Precio({
          headerName        : "💲Base",
          field             : "precio_aumento",
          headerClass       : claseHPrecios.col,
          minWidth          : 100,
          hide: false,
        }),
        { headerName        : "↗️Descuento",
          field             : "aumento_descuento",
          headerClass       : claseHPrecios.col,
          type              : ["porcentaje", "editarYCrear"],
          width             : 140,
          hide: false,
          valueParser       : reglaAumento,
        },
        Col.Precio({
          headerName        : "💲Descuento",
          field             : "precio_aumento_descuento",
          headerClass       : claseHPrecios.col,
          minWidth          : 140,
          hide: false,
        }),
        { headerName        : "↗️Escom",
          field             : "aumento_escom",
          headerClass       : claseHPrecios.col,
          type              : ["porcentaje", "editarYCrear"],
          width             : 110,
          hide: false,
          valueParser       : reglaAumento
        },
        Col.Precio({
          headerName        : "💲Escom",
          field             : "precio_aumento_escom",
          headerClass       : claseHPrecios.col,
          minWidth          : 110,
          hide: true,
        }),
        /*
        { headerName        : "↗️Black Friday",
          field             : "aumento_loco",
          headerClass       : claseHAumentos.col,
          type              : ["porcentaje", "editarYCrear"],
          width             : 150,          
          hide: true,
        }, */
        /* Col.Precio({
          headerName        : "💲Black Friday",
          field             : "precio_aumento_loco",
          headerClass       : claseHAumentos.col,
          width             : 150,
          hide: true,
        }),
        */            
      ]
    },
  )


  // * //////////////////////////////////////////////////////////////////////////////// Costos
  columnas.push(
    {
      headerName            : "🫰🏻 Costos",                      
      headerClass           : claseHCostos.header,
      marryChildren         : false,
      children              :
      [
        Col.Precio({
          headerName        : "💲Compra",
          field             : "costo",
          headerClass       : claseHCostos.col,
          type              : "editarYCrear",
          width             : 150,
          hide: false,
        }),
        Col.Precio({
          headerName        : "💲Costo extra",
          field             : "costoExtra",
          headerClass       : claseHCostos.col,
          type              : "editarYCrear",
          width             : 150,
          hide: false,
        }),
        Col.Precio({
          headerName        : "💲Costo total",
          field             : "costoTotal",
          headerClass       : claseHCostos.col,
          width             : 150,
          hide: false,
        }),        
      ]
    }
  )

  // * //////////////////////////////////////////////////////////////////////////////// Otros valores
  columnas.push(
    {
      headerName            : "📋Registro de cambios",
      headerClass           : claseHRegistro.header,
      marryChildren         : false,
      children              :
      [
        { headerName        : "👤Creador",
          field             : "creador.label",  
          headerClass       : claseHRegistro.col,
          hide: true,
        },
        { headerName        : "📅Fecha Creación",
          field             : "fechaCreacion",  
          minWidth          : 170,
          headerClass       : claseHRegistro.col,
          hide: true,
        },
        { headerName        : "👤Edito",
          field             : "edito.label",  
          headerClass       : claseHRegistro.col,
          hide: true,
        },
        { headerName        : "📅Fecha Edición",
          field             : "fechaEdicion",  
          minWidth          : 170,
          headerClass       : claseHRegistro.col,
          hide: true,
        }
      ]
    }
  )

  // * //////////////////////////////////////////////////////////////////////////////// Otros valores
  columnas.push(
    {
      headerName            : "📂 Otros datos",                      
      headerClass           : claseHExtras.header,
      marryChildren         : false,
      children              :      
      [
        { headerName        : "Codigo Siigo",
          field             : "siigo.codigo",
          headerClass       : claseHExtras.col,
          width             : 130,
          cellClass         : "fuente-mono text e-right",
          hide: true, 
        },
      ]
    }
  )

  return columnas
}


/* 
function parserNumber( p : any )
{
  if( ToolType.keyStringValido(p, "newValue" ) === "" )
    return ToolType.keyNumberValido(p, "oldValue")
  else
    return ToolType.keyNumberValido(p, "newValue")
}
 */
function reglaAumento( p : any )
{
  let   aumento       = 0  
  const campo         = ToolType.keyStringValido( p.column, "colId" )

  if( ToolType.keyStringValido(p, "newValue" ) === "" )
    aumento           = ToolType.keyNumberValido(p, "oldValue")
  else
    aumento           = ToolType.keyNumberValido(p, "newValue")  

  if(campo            === "aumento_descuento")
  {
    const aumento2    = ToolType.keyNumberValido(p.data, "aumento")
    if( aumento       >= aumento2)
      aumento         = aumento2 - 1
  }
  else
  {
    const aumento2    = ToolType.keyNumberValido(p.data, "aumento_descuento")
    if( aumento       <= aumento2)
      aumento         = aumento2 + 1
  }

  return aumento
}