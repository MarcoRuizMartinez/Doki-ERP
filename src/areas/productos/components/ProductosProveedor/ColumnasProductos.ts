import {  Col                     } from "components/utilidades/AgGrid/ColumnasAG"
import {  ColDef,
          ColTypeDef,
          ColGroupDef             } from "ag-grid-community";
import {  getProveedoresDB,
          getCategoriasDB,
          getDiasDespachoDB,
                                  } from "src/composables/useDexie"
import {  TiposProductosProveedor } from "src/areas/productos/models/TipoProductoProveedor"
import {  MesesGarantia           } from "src/models/Diccionarios/MesesGarantia"
import {  OriginesMadeIn          } from "src/models/Diccionarios/MadeIn"
import {  ToolType, Format        } from "src/composables/useTools";
import {  IProductoProveedor      } from "../../models/ProductoProveedor";
import imagen                       from "./ImagenProductoAG.vue"
import proveedor                    from "components/utilidades/AgGrid/ProveedorBadge.vue"



export const reglasCSS = {
  'bg-grey-4 text-grey-1'     : ( params : any ) => { return !params.data?.activo     && !params.data?.esNuevo },
  'bg-indigo-3 text-indigo-1' : ( params : any ) => { return !params.data?.disponible && !!params.data?.activo && !params.data?.esNuevo },
  'bg-green-2'                : ( params : any ) => { return params.data?.esNuevo },
}

export const autoSizeStrategy = {
  type                  : 'fitCellContents', // fitProvidedWidth fitGridWidth
  defaultMinWidth       : 100,
  
  columnLimits          : [{ colId: 'ref', minWidth: 900}]
}

export const columnTypes : { [key: string]: ColTypeDef<IProductoProveedor>; } = {
  moneda:
  { 
    valueFormatter  : Format.precioAG,
    cellClass       : "text-right",
  },
  numero:
  {
    cellClass       : "text-right",
  },
  editable:
  {
    editable: p => {
      if(!p.data) return false

      const columna         = p.colDef?.field ?? "" 
      const campoEspecial   = esFieldDeEditarHijo( columna ) 
      const hijoNoEspecial  = p.data.tipo.esHijo && !campoEspecial
      if(hijoNoEspecial)
        return false

      return p.data.editable
    }
  },
  creacion:
  {
    editable: p => {
      if(!p.data) return false

      const columna         = p.colDef?.field ?? "" 
      const campoEspecial   = esFieldDeEditarHijo( columna ) 
      const hijoNoEspecial  = p.data.tipo.esHijo && !campoEspecial
      if(hijoNoEspecial)
        return false

      return p.data.esNuevo
    }
  },
  editarYCrear:
  {
    editable: p => {
      if(!p.data) 
        return false

      const columna         = p.colDef?.field ?? "" 
      const campoEspecial   = esFieldDeEditarHijo( columna ) 
      const hijoNoEspecial  = p.data.tipo.esHijo && !campoEspecial
      if(hijoNoEspecial)
        return false

      return  p.data.esNuevo  ||  p.data.editable
    }
  }     
}

function esFieldDeEditarHijo( field : string )
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
}

// * ////////////////////////////////////////////////////////////////////////////////////////////////// COLUMNAS
export const columnasProductos : (ColDef<IProductoProveedor>  | ColGroupDef)[] = [
  { // * //////////////////////////////////////////////////////////////////////////////// Imagen
    headerName          : "🖼️",
    field               : "img",
    width               : 80, 
    cellRenderer        : imagen,
    filter              : "agSetColumnFilter",
    valueFormatter      : ( p : any ) => p.value?.hayImagen ?? "",
    cellClassRules      : { 'bg-deep-orange-2': ( p : any ) => p.data.esNuevo && !p.data.sePuedeCrear }
  },
  { // * //////////////////////////////////////////////////////////////////////////////// REF y nombre proveedor     
    headerName          : "🏪Datos de proveedor",                      
    marryChildren       : false,
    children            :
    [
      Col.Objeto(
      {
        headerName      : "🏪Proveedor",
        field           : "proveedor",
        width           : 140,
        cellRenderer    : proveedor,
        opciones        : getProveedoresDB,
        key             : "alias",
        type            : "editarYCrear",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okProveedor }
      }),
      {
        headerName      : "🏪Ref proveedor",
        field           : "ref",
        tooltipField    : "proveedor.label",
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okRef },
        valueParser     : p => ToolType.keyStringValido(p, "newValue").replaceAll(" ", "").trim()
      },
      {
        headerName      : "🏪Nombre proveedor",
        field           : "nombre",
        minWidth        : 340,
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okNombre },
        valueParser     : p => ToolType.keyStringValido(p, "newValue").trim()
      },
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// REF y nombre nuestros  
    headerName          : "🏠Datos de nuestros",                      
    marryChildren       : false,
    children            :
    [
      { headerName      : "🏠Ref nuestra", field          : "refNuestra",   tooltipField: "proveedor.label" },
      { headerName      : "🏠Nombre nuestro", field          : "nombreNuestro",minWidth        : 340, },
    ]
  }, 
  { // * //////////////////////////////////////////////////////////////////////////////// Disponibilidad
    headerName          : "📦Disponibilidad de producto",                      
    marryChildren       : false,
    children            :
    [
      Col.Boolean({
        headerName      : "🚨Activo",
        field           : "activo",
        headerClass     : "bg-green-2",
        type            : "editarYCrear"
      }),
      Col.Boolean({
        headerName      : "💁🏻‍♂️Disponible",
        field           : "disponible",
        headerClass     : "bg-green-2",
        type            : "editarYCrear"
      }),
      Col.Boolean({
        headerName      : "📦Gestión de stock",
        field           : "gestionStock",
        headerClass     : "bg-green-2",
        type            : "editarYCrear",
        hide            : true,
      }),
      {
        headerName      : "🧮Stock",
        field           : "stock",
        type            : ["editarYCrear", "numero"],
        hide            : true
      },
      {
        headerName      : "📅Fecha llegada",
        field           : "fechaLlegada",
        hide            : true
      },
      Col.Objeto(
      {
        headerName      : "⏱️Días Despacho",
        field           : "diasDespacho",
        opciones        : getDiasDespachoDB,
        key             : "label",
        type            : "editarYCrear"
      })
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// Categorización
    headerName          : "🗃️Categorización de producto",                      
    marryChildren       : false,
    children            :
    [
      Col.Objeto(
      {
        headerName      : "🆎Categoría",
        field           : "categoria",
        opciones        : getCategoriasDB,
        key             : "label",
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okCategoria }
      }),
      Col.Objeto(
      {
        headerName      : "🔢Tipo",
        field           : "tipo",
        opciones        : TiposProductosProveedor,
        key             : "label",
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okTipo }
      }),
      {
        headerName      : "👩‍👧‍👦Padre",
        field           : "refPadre",
        hide            : false,
        type            : "editarYCrear",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okRefPadre }
        
      },
      {
        headerName      : "⬇️Orden",
        field           : "orden",
        type            : ["editable", "numero" ],
        width           : 110
      },
      {
        headerName      : "👨‍👩‍👧‍👦🏠Familia nuestra", 
        field           : "familiaNuestra", 
        hide            : true,
        type            : "editable"
      },
      {
        headerName      : "👨‍👩‍👧‍👦🏪Familia proveedor", 
        field           : "familiaProveedor",
        hide            : true,
        type            : "editable"
      },
      {
        headerName      : "📑Documento", 
        field           : "documento",
        hide            : true,
        type            : "editable"
      },
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// Precios
    headerName          : "🪙Precios proveedor",                      
    marryChildren       : false,
    children            :
    [
      {
        headerName      : "🔎Ref Guía",
        field           : "refComparacion",
        hide            : true,
        type            : "editable"
      },
      Col.Precio({
        headerName      : "🪙Precio",
        field           : "precio",
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okPrecio }
      }),
      Col.Precio({
        headerName      : "🪙Credito",
        field           : "precioCredito",
        type            : "creacion"
      }),
      Col.Precio({
        headerName      : "🔜Precio",
        field           : "precio_n",
        hide            : true,
        type            : "editable"
      }),
      Col.Precio({
        headerName      : "🔜Credito",
        field           : "precioCredito_n",    
        hide            : true,
        type            : "editable"
      }),
      Col.Precio({
        headerName      : "📊Diferencia",
        field           : "diferencia",
        hide            : true
      }),
      {
        headerName      : "📊Variación %",
        field           : "diferenciaX100",
        hide            : true,
      },
      Col.Precio({
        headerName      : "🏷️Precio Promoción", 
        field           : "precioPromocion",
        hide            : true,
      }),
      Col.Precio({
        headerName      : "💰Costo extra", 
        field           : "costoExtra",
        hide            : true,
        type            : "editable"
      }),
      {
        headerName      : "🔖Descuento", 
        field           : "descuento",
        hide            : true,
        type            : "editable"
      },
      {
        headerName      : "🔖Calcular descuento", 
        field           : "calcularDescuento",
        hide            : true,
        type            : "editable"
      },
      { 
        headerName      : "🤝Precio vigente", 
        field           : "precioActualizado",
        hide            : true,
        type            : "editable"
      },
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// Propiedades productos
    headerName          : "✨Características de producto",                      
    marryChildren       : false,
    children            :
    [
      Col.Objeto(
      { 
        headerName      : "🌏Hecho en",
        field           : "hechoEn",
        opciones        : OriginesMadeIn,
        key             : "label",
        type            : "editarYCrear",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okHechoEn }
      }),
      Col.Objeto(
      { 
        headerName      : "🛟Garantía",
        field           : "garantiaMeses",
        opciones        : MesesGarantia,
        key             : "label",
        type            : "editarYCrear",
        //cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okGarantiaMeses }
      }),
      { 
        headerName      : "🖼️URL Imagen",
        field           : "urlImagen",      
        hide            : true,   
        type            : "editable"
      },
      { 
        headerName      : "🔗URL",
        field           : "url",
        hide            : true,   
      },
      {
        headerName      : "📝Descripción",
        field           : "descripcion",
        hide            : true,   
        type            : "editarYCrear"
      },
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// Registro de cambios
    headerName          : "📋Registro de cambios",                      
    marryChildren       : false,
    children            :
    [
      { field           : "creador.label",  hide: true,   headerName: "Creador"         },
      { field           : "fechaCreacion",  hide: true,   headerName: "Fecha Creación"  },
      { field           : "edito.label",    hide: true,   headerName: "Edito"           },
      { field           : "fechaEdicion",   hide: true,   headerName: "Fecha Edición"   },
      { field           : "esNuevo",        hide: true                                  },
    ]
  }
]