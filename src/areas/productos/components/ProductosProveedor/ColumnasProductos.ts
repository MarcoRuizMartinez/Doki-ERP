import {  Col                     } from "components/utilidades/AgGrid/ColumnasAG"
import {  ColDef,
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
import { ColTypeDef } from "ag-grid-enterprise";
import { truncate } from "fs/promises";



export const reglasCSS = {
  'bg-grey-4 text-grey-1'     : ( params : any ) => { return !params.data?.activo     && !params.data?.esNuevo },
  'bg-indigo-3 text-indigo-1' : ( params : any ) => { return !params.data?.disponible && !!params.data?.activo && !params.data?.esNuevo },
  'bg-green-2'                : ( params : any ) => { return params.data?.esNuevo },  

}

export const autoSizeStrategy = {
  type                  : 'fitCellContents', // fitProvidedWidth fitGridWidth
  defaultMinWidth       : 200,
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
}

// * ////////////////////////////////////////////////////////////////////////////////////////////////// COLUMNAS
export const columnasProductos : (ColDef<IProductoProveedor>  | ColGroupDef)[] = [
  { // * //////////////////////////////////////////////////////////////////////////////// Imagen
    field               : "img",
    headerName          : "Imagen",
    width               : 80, 
    cellRenderer        : imagen,
    filter              : "agSetColumnFilter",
    valueFormatter      : ( p : any ) => p.value?.hayImagen ?? "",
    cellClassRules      : { 'bg-deep-orange-2': ( p : any ) => p.data.esNuevo && !p.data.sePuedeCrear }
  },
  { // * //////////////////////////////////////////////////////////////////////////////// REF y nombre proveedor     
    headerName          : "Datos de proveedor",                      
    marryChildren       : true,
    children            :
    [
      Col.Objeto(
      {
        field           : "proveedor",
        cellRenderer    : proveedor,
        opciones        : getProveedoresDB,
        key             : "alias",
        type            : "editarYCrear",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okProveedor }
      }),
      {
        field           : "ref",
        headerName      : "Ref proveedor",
        tooltipField    : "proveedor.label",
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okRef },
        valueParser     : p => ToolType.keyStringValido(p, "newValue").replaceAll(" ", "").trim()
      },
      {
        field           : "nombre",
        headerName      : "Nombre proveedor",
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okNombre },
        valueParser     : p => ToolType.keyStringValido(p, "newValue").trim()
      },
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// REF y nombre nuestros  
    headerName          : "Datos de nuestros",                      
    marryChildren       : true,
    children            :
    [
      {  field          : "refNuestra",   tooltipField: "proveedor.label" },
      {  field          : "nombreNuestro" },
    ]
  }, 
  { // * //////////////////////////////////////////////////////////////////////////////// Disponibilidad
    headerName          : "Disponibilidad de producto",                      
    marryChildren       : true,
    children            :
    [
      Col.Boolean({field: "activo",       headerClass:"bg-green-2", type :"editarYCrear" }),
      Col.Boolean({field: "disponible",   headerClass:"bg-green-2", type :"editarYCrear" }),
      Col.Boolean({field: "gestionStock", headerClass:"bg-green-2", type :"editarYCrear", hide : true, headerName: "Gestión de stock" }),
      {  field          : "stock",                                  type: "numero",       hide : true },
      {  field          : "fechaLlegada",                                                 hide : true },
      Col.Objeto(
      {
        field           : "diasDespacho",
        headerName      : "Días Despacho",
        opciones        : getDiasDespachoDB,
        key             : "label",
        type            : "editarYCrear"
      })
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// Categorización
    headerName          : "Categorización de producto",                      
    marryChildren       : true,
    children            :
    [
      Col.Objeto(
      {
        field           : "categoria",
        opciones        : getCategoriasDB,
        key             : "label",
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okCategoria }
      }),
      Col.Objeto(
      {
        field           : "tipo",
        opciones        : TiposProductosProveedor,
        key             : "label",
        type            : "creacion",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okTipo }
      }),
      {
        field           : "refPadre",
        hide            : false,
        type            : "editarYCrear",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okRefPadre }
        
      },
      { field           : "orden",             hide : true,   type: ["editable", "numero" ] },
      { field           : "familiaNuestra",    hide : true,   type: "editable", },
      { field           : "familiaProveedor",  hide : true,   type: "editable", },
      { field           : "documento",         hide : true,   type: "editable", },
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// Precios
    headerName          : "Precios proveedor",                      
    marryChildren       : true,
    children            :
    [
      {            field: "refComparacion",     hide: true,   headerName: "Ref Guía",   type: "editable"  },
      Col.Precio({ field: "precio",                           headerName: "✅Precio",   type: "creacion",   cellClassRules: { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okPrecio }}),
      Col.Precio({ field: "precioCredito",                    headerName: "✅Credito",  type: "creacion"  }),
      Col.Precio({ field: "precio_n",           hide: true,   headerName: "🔜Precio",   type: "editable"  }),
      Col.Precio({ field: "precioCredito_n",    hide: true,   headerName: "🔜Credito",  type: "editable"  }),
      Col.Precio({ field: "diferencia",         hide: true    }),
      {            field: "diferenciaX100",     hide: true,   headerName: "Variación %" },
      Col.Precio({ field: "precioPromocion",    hide: true,   headerName: "Precio Promoción"}),
      Col.Precio({ field: "costoExtra",         hide: true,                             type: "editable" }),
      {            field: "descuento",          hide: true,                             type: "editable" },
      {            field: "calcularDescuento",  hide: true,                             type: "editable" },
      {            field: "precioActualizado",  hide: true,                             type: "editable" },
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// Propiedades productos
    headerName          : "Características de producto",                      
    marryChildren       : true,
    children            :
    [
      Col.Objeto(
      { 
        field           : "hechoEn",
        headerName      : "Hecho en",
        opciones        : OriginesMadeIn,
        key             : "label",
        type            : "editarYCrear",
        cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okHechoEn }
      }),
      Col.Objeto(
      { 
        field           : "garantiaMeses",
        headerName      : "Garantía",
        opciones        : MesesGarantia,
        key             : "label",
        type            : "editarYCrear",
        //cellClassRules  : { 'bg-deep-orange-2': p => p.data.esNuevo && !p.data.okGarantiaMeses }
      }),
      { field           : "urlImagen",      hide: true,   headerName: "URL Imagen",     type: "editable"},
      { field           : "url",            hide: true,   headerName: "URL"             },
      { field           : "descripcion",    hide: true,   headerName: "Descripción"     },
    ]
  },
  { // * //////////////////////////////////////////////////////////////////////////////// Registro de cambios
    headerName          : "Registro de cambios",                      
    marryChildren       : true,
    children            :
    [
      { field           : "creador.label",  hide: true,   headerName: "Creador"         },
      { field           : "fechaCreacion",  hide: true,   headerName: "Fecha Creación"  },
      { field           : "edito.label",    hide: true,   headerName: "Edito"           },
      { field           : "fechaEdicion",   hide: true,   headerName: "Fecha Edición"   },
    ]
  }
]