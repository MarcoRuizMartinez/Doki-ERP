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
    headerClass         : "bg-grey-10 text-white",
    width               : 80, 
    cellRenderer        : imagen,
    filter              : "agSetColumnFilter",
    valueFormatter      : ( p : any ) => p.value?.hayImagen ?? "",
    cellClassRules      : { 'bg-deep-orange-2': ( p : any ) => p.data.esNuevo && !p.data.sePuedeCrear }
  },
  { // * //////////////////////////////////////////////////////////////////////////////// REF y nombre proveedor     
    headerName          : "🏪Datos de proveedor",
    headerClass         : "bg-teal-9 text-white",
    marryChildren       : false,
    children            :
    [
      Col.Objeto(
      {
        headerName      : "🏪Proveedor",
        field           : "proveedor",
        headerClass     : "bg-teal-6 text-white",
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
        headerClass     : "bg-teal-6 text-white",
        tooltipField    : "proveedor.label",
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okRef },
        valueParser     : p => ToolType.keyStringValido(p, "newValue").replaceAll(" ", "").trim()
      },
      {
        headerName      : "🏪Nombre proveedor",
        field           : "nombre",
        headerClass     : "bg-teal-6 text-white",
        minWidth        : 340,
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okNombre },
        valueParser     : p => ToolType.keyStringValido(p, "newValue").trim()
      },
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// REF y nombre nuestros  
    headerName          : "🏠Datos de nuestros",                      
    headerClass         : "bg-light-blue-10 text-white",
    marryChildren       : false,
    children            :
    [
      { headerName      : "🏠Ref nuestra",
        field           : "refNuestra",
        headerClass     : "bg-light-blue-6 text-white",
        tooltipField    : "proveedor.label"
      },
      { headerName      : "🏠Nombre nuestro",
        field           : "nombreNuestro",
        headerClass     : "bg-light-blue-6 text-white",
        minWidth        : 340
      },
    ]
  }, 
  { // * //////////////////////////////////////////////////////////////////////////////// Disponibilidad
    headerName          : "📦Disponibilidad de producto",                      
    headerClass         : "bg-purple-10 text-white",
    marryChildren       : false,
    children            :
    [
      Col.Boolean({
        headerName      : "🚨Activo",
        field           : "activo",
        headerClass     : "bg-purple-6 text-white",
        type            : "editarYCrear"
      }),
      Col.Boolean({
        headerName      : "💁🏻‍♂️Disponible",
        field           : "disponible",
        headerClass     : "bg-purple-6 text-white",
        type            : "editarYCrear"
      }),
      Col.Boolean({
        headerName      : "📦Gestión de stock",
        field           : "gestionStock",
        headerClass     : "bg-purple-6 text-white",
        type            : "editarYCrear",
        hide            : true,
      }),
      {
        headerName      : "🧮Stock",
        field           : "stock",
        headerClass     : "bg-purple-6 text-white",
        type            : ["editarYCrear", "numero"],
        hide            : true
      },
      {
        headerName      : "📅Fecha llegada",
        field           : "fechaLlegada",
        headerClass     : "bg-purple-6 text-white",
        hide            : true
      },
      Col.Objeto(
      {
        headerName      : "⏱️Días Despacho",
        field           : "diasDespacho",
        headerClass     : "bg-purple-6 text-white",
        opciones        : getDiasDespachoDB,
        key             : "label",
        type            : "editarYCrear"
      })
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// Categorización
    headerName          : "🗃️Categorización de producto",                      
    headerClass         : "bg-deep-purple-10 text-white",
    marryChildren       : false,
    children            :
    [
      Col.Objeto(
      {
        headerName      : "🆎Categoría",
        field           : "categoria",
        headerClass     : "bg-deep-purple-6 text-white",
        opciones        : getCategoriasDB,
        key             : "label",
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okCategoria }
      }),
      Col.Objeto(
      {
        headerName      : "🔢Tipo",
        field           : "tipo",
        headerClass     : "bg-deep-purple-6 text-white",
        opciones        : TiposProductosProveedor,
        key             : "label",
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okTipo }
      }),
      {
        headerName      : "👩‍👧‍👦Padre",
        field           : "refPadre",
        headerClass     : "bg-deep-purple-6 text-white",
        hide            : false,
        type            : "editarYCrear",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okRefPadre }
        
      },
      {
        headerName      : "⬇️Orden",
        field           : "orden",
        headerClass     : "bg-deep-purple-6 text-white",
        type            : ["editarYCrear", "numero" ],
        width           : 110
      },
      {
        headerName      : "👨‍👩‍👧‍👦🏠Familia nuestra", 
        field           : "familiaNuestra", 
        headerClass     : "bg-deep-purple-6 text-white",
        hide            : true,
        type            : "editable"
      },
      {
        headerName      : "👨‍👩‍👧‍👦🏪Familia proveedor", 
        field           : "familiaProveedor",
        headerClass     : "bg-deep-purple-6 text-white",
        hide            : true,
        type            : "editable"
      },
      {
        headerName      : "📑Documento", 
        headerClass     : "bg-deep-purple-6 text-white",
        field           : "documento",
        hide            : true,
        type            : "editable"
      },
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// Precios
    headerName          : "🪙Precios proveedor",                      
    headerClass         : "bg-deep-orange-14 text-white",
    marryChildren       : false,
    children            :
    [
      {
        headerName      : "🔎Ref Guía",
        field           : "refComparacion",
        headerClass     : "bg-deep-orange-6 text-white",
        hide            : true,
        type            : "editable"
      },
      Col.Precio({
        headerName      : "🪙Precio",
        field           : "precio",
        headerClass     : "bg-deep-orange-6 text-white",
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okPrecio }
      }),
      Col.Precio({
        headerName      : "🪙Credito",
        headerClass     : "bg-deep-orange-6 text-white",
        field           : "precioCredito",
        type            : "creacion"
      }),
      Col.Precio({
        headerName      : "🔜Precio",
        headerClass     : "bg-deep-orange-6 text-white",
        field           : "precio_n",
        hide            : true,
        type            : "editable"
      }),
      Col.Precio({
        headerName      : "🔜Credito",
        headerClass     : "bg-deep-orange-6 text-white",
        field           : "precioCredito_n",
        hide            : true,
        type            : "editable"
      }),
      Col.Precio({
        headerName      : "📊Diferencia",
        headerClass     : "bg-deep-orange-6 text-white",
        field           : "diferencia",
        hide            : true
      }),
      {
        headerName      : "📊Variación %",
        headerClass     : "bg-deep-orange-6 text-white",
        field           : "diferenciaX100",
        hide            : true,
      },
      Col.Precio({
        headerName      : "🏷️Precio Promoción",
        headerClass     : "bg-deep-orange-6 text-white",
        field           : "precioPromocion",
        hide            : true,
      }),
      Col.Precio({
        headerName      : "💰Costo extra", 
        headerClass     : "bg-deep-orange-6 text-white",
        field           : "costoExtra",
        hide            : true,
        type            : "editable"
      }),
      {
        headerName      : "🔖Descuento", 
        headerClass     : "bg-deep-orange-6 text-white",
        field           : "descuento",
        hide            : true,
        type            : "editable"
      },
      {
        headerName      : "🔖Calcular descuento", 
        headerClass     : "bg-deep-orange-6 text-white",
        field           : "calcularDescuento",
        hide            : true,
        type            : "editable"
      },
      { 
        headerName      : "🤝Precio vigente", 
        headerClass     : "bg-deep-orange-6 text-white",
        field           : "precioActualizado",
        hide            : true,
        type            : "editable"
      },
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// Propiedades productos
    headerName          : "✨Características de producto",                      
    headerClass         : "bg-cyan-10 text-white",
    marryChildren       : false,
    children            :
    [
      Col.Objeto(
      { 
        headerName      : "🌏Hecho en",
        field           : "hechoEn",
        headerClass     : "bg-cyan-6 text-white",
        opciones        : OriginesMadeIn,
        key             : "label",
        type            : "editarYCrear",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okHechoEn }
      }),
      Col.Objeto(
      { 
        headerName      : "🛟Garantía",
        field           : "garantiaMeses",
        headerClass     : "bg-cyan-6 text-white",
        opciones        : MesesGarantia,
        key             : "label",
        type            : "editarYCrear",
        //cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okGarantiaMeses }
      }),
      { 
        headerName      : "🖼️URL Imagen",
        field           : "urlImagen",      
        headerClass     : "bg-cyan-6 text-white",
        hide            : true,   
        type            : "editable"
      },
      { 
        headerName      : "🔗URL",
        field           : "url",
        headerClass     : "bg-cyan-6 text-white",
        hide            : true,   
      },
      {
        headerName      : "📝Descripción",
        field           : "descripcion",
        headerClass     : "bg-cyan-6 text-white",
        hide            : true,
        type            : "editarYCrear"
      },
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// Registro de cambios
    headerName          : "📋Registro de cambios",
    headerClass         : "bg-pink-10 text-white",
    marryChildren       : false,
    children            :
    [
      { field           : "creador.label",  
        hide            : true,
        headerName      : "Creador",
        headerClass     : "bg-pink-6 text-white",
      },
      { field           : "fechaCreacion",  
        hide            : true,
        headerName      : "Fecha Creación",
        headerClass     : "bg-pink-6 text-white",
      },
      { field           : "edito.label",    
        hide            : true,
        headerName      : "Edito",
        headerClass     : "bg-pink-6 text-white",   
      },
      { field           : "fechaEdicion",   
        hide            : true,   
        headerName      : "Fecha Edición",
        headerClass     : "bg-pink-6 text-white",
      },
      { field           : "esNuevo",        
        hide            : true,
        headerName      : "A crear",
        headerClass     : "bg-pink-6 text-white",
      },
    ]
  }
]