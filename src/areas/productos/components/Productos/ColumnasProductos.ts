import {  Col                     } from "components/utilidades/AgGrid/ColumnasAG"
import {  ColDef,
          ColTypeDef,
          ColGroupDef             } from "ag-grid-community"
import {  getCategoriasDB,
          //getProveedoresDB,
          //getDiasDespachoDB,
                                  } from "src/composables/useDexie"
//import {  TiposProductosProveedor } from "src/areas/productos/models/TipoProductoProveedor"
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
    /* editable: p => {
      if(!p.data) 
        return false

      const columna         = p.colDef?.field ?? "" 
      const campoEspecial   = esFieldDeEditarHijo( columna ) 
      const hijoNoEspecial  = p.data.tipo.esHijo && !campoEspecial
      if(hijoNoEspecial)
        return false

      return  ( p.data?.esNuevo ?? false )  ||  p.data.editable
    } */
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
          ||  field == "familiaProveedor"
          ||  field == "costoExtra"
          ||  field == "garantiaMeses"
          ||  field == "gestionStock"
} */

//const limpiarRef   = ( p : any ) => ToolType.keyStringValido(p, "newValue").replaceAll(" ", "").trim()


const claseColFn            = ( color : string, nivel : number ) => `bg-${color}-${nivel} text-white`
const claseCol              = ( color : string ) => { return { col: claseColFn( color, 6 ),  header: claseColFn( color, 10 )} }
const claseHDatos           = claseCol("light-blue")
const claseHDispo           = claseCol("purple")
const claseHRequi           = claseCol("brown")
const claseHPrecios         = claseCol("deep-orange")
const claseHAumentos        = claseCol("deep-purple")
const claseHCostos          = claseCol("indigo")
const claseHExtras          = claseCol("blue-grey")

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
        { headerName        : "🏠Ref",
          field             : "ref",
          headerClass       : claseHDatos.col,
          hide: false,
        },
        { headerName        : "🏠Nombre",
          field             : "nombre",
          headerClass       : claseHDatos.col,
          minWidth          : 340,
          hide: false,
        },
        Col.Objeto(
          {
            headerName      : "🆎Categoría",
            field           : "categoria",
            headerClass     : claseHDatos.col,
            opciones        : getCategoriasDB,
            key             : "label",
            type            : "editarYCrear",
            cellClassRules  : { 'bg-deep-orange-2': p => ( p.data?.esNuevo ?? false ) && !p.data.okCategoria },
          }
        ),
        { headerName        : "🔢Tipo",
          field             : "tipoProducto",
          headerClass       : claseHDatos.col,
          cellClass         : "text-capitalize",
          hide: false,
          editable          : false,          
        },
        Col.Objeto(
          {
            headerName      : "🌱Naturaleza",
            field           : "naturaleza",
            headerClass     : claseHDatos.col,
            key             : "nombre",
            hide: false,
            editable        : false,
            minWidth        : 160,
          }
        ),
        Col.Objeto(
          {
            headerName      : "📐Unidad",
            field           : "unidad",
            headerClass     : claseHDatos.col,
            key             : "label",
            hide: false,
            editable        : false,
          }
        ),
        { headerName        : "📄Descripción",
          field             : "descripcion",
          headerClass       : claseHDatos.col,
          minWidth          : 340,
          hide: false,
          editable          : true,
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
          hide: false,
        }),
        Col.Boolean({
          headerName        : "✅En compra",
          field             : "activoEnCompra",
          headerClass       : claseHDispo.col,
          type              : "editarYCrear",
          minWidth          : 140,
          hide: false,
        }),
        Col.Boolean({
          headerName        : "🏪Con proveedor",
          field             : "con_proveedor",
          headerClass       : claseHDispo.col,          
          minWidth          : 170,
          hide: false,
          editable          : false,
        }),    
        Col.Boolean({
          headerName        : "📦Stock proveedor",
          field             : "stockProveedor",
          headerClass       : claseHDispo.col,          
          minWidth          : 180,
          hide: false,
          editable          : false,          
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
          hide: false,
        }),
        Col.Boolean({
          headerName        : "✅Medida",
          field             : "requiereMedida",
          headerClass       : claseHRequi.col,
          type              : "editarYCrear",
          minWidth          : 130,
          hide: false,
        }),
        Col.Boolean({
          headerName        : "✅Entrega",
          field             : "requiereEntregado",
          headerClass       : claseHRequi.col,
          type              : "editarYCrear",
          minWidth          : 130,
          hide: false,
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
          field             : "precio",
          headerClass       : claseHPrecios.col,
        }),
        Col.Precio({
          headerName        : "💲Normal",
          field             : "precio_publico",
          headerClass       : claseHPrecios.col,
          hide: false,
        }),
        Col.Precio({
          headerName        : "💲Descuento",
          field             : "precio_promocion",
          headerClass       : claseHPrecios.col,
          hide: false,
        }),
        { headerName        : "🏦IVA",
          field             : "iva",
          headerClass       : claseHPrecios.col,
          type              : "porcentaje",
          width             : 90,
        },                
      ]
    },
  )

  // * //////////////////////////////////////////////////////////////////////////////// Aumentos
  columnas.push(
    {
      headerName            : "📟 Precios calculados",                      
      headerClass           : claseHAumentos.header,
      marryChildren         : false,
      children              :
      [
        { headerName        : "↗️Base",
          field             : "aumento",
          headerClass       : claseHAumentos.col,
          type              : "porcentaje",
          width             : 100,          
          hide: false,
        },        
        Col.Precio({
          headerName        : "💲Base",
          field             : "precio_aumento",
          headerClass       : claseHAumentos.col,
          minWidth          : 100,
          hide: false,
        }),
        { headerName        : "↗️Descuento",
          field             : "aumento_descuento",
          headerClass       : claseHAumentos.col,
          type              : "porcentaje",
          width             : 140,          
          hide: false,
        },        
        Col.Precio({
          headerName        : "💲Descuento",
          field             : "precio_aumento_descuento",
          headerClass       : claseHAumentos.col,
          minWidth          : 140,
          hide: false,
        }),
        { headerName        : "↗️Escom",
          field             : "aumento_escom",
          headerClass       : claseHAumentos.col,
          type              : "porcentaje",
          width             : 110,
          hide: false,
        },        
        Col.Precio({
          headerName        : "💲Escom",
          field             : "precio_aumento_escom",
          headerClass       : claseHAumentos.col,
          minWidth          : 110,
          hide: false,
        }),
        { headerName        : "↗️Black Friday",
          field             : "aumento_loco",
          headerClass       : claseHAumentos.col,
          type              : "porcentaje",
          width             : 150,          
          hide: false,
        },        
        Col.Precio({
          headerName        : "💲Black Friday",
          field             : "precio_aumento_loco",
          headerClass       : claseHAumentos.col,
          width             : 150,
          hide: false,
        }),           
      ]
    }
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
          width             : 150,
          hide: false,
        }),
        Col.Precio({
          headerName        : "💲Costo extra",
          field             : "costo_adicional",
          headerClass       : claseHCostos.col,
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
      headerName            : "📂 Otros datos",                      
      headerClass           : claseHExtras.header,
      marryChildren         : false,
      children              :      
      [
        { headerName        : "👤Creador",
          field             : "creador.label",  
          hide: false,          
          headerClass       : claseHExtras.col,
        },        
        { headerName        : "📅Fecha Creación",
          field             : "fecha_creacion",  
          hide: false,            
          headerClass       : claseHExtras.col,
        },
        { headerName        : "Codigo Siigo",
          field             : "siigo.codigo",
          hide: false, 
          headerClass       : claseHExtras.col,
          width             : 130,
          cellClass         : "fuente-mono text-right"
        },                   
      ]
    }
  )

  return columnas
}

/* 
import {  ICategoriaProducto    } from "src/areas/productos/models/CategoriaProducto"
import {  IUnidad               } from "src/models/Diccionarios/Unidad"
import {  ILabelValue           } from "src/models/TiposVarios"
import {  INaturalezaProducto   } from "src/models/Diccionarios/NaturalezaProducto"
import {  IImagenProducto       } from "src/areas/productos/models/ImagenProducto"
import {  IProductoProveedor    } from "src/areas/productos/models/ProductoProveedor"
import {  IAccion               } from "src/areas/comunicacion/models/Accion"
import {  TCodigosSiigo         } from "src/areas/productos/models/Siigo"         
import {  IProductoHijo         } from "src/areas/productos/models/ProductoHijo"
*/

export interface IProductoTrabajo
{
  // * //////////////////// Basicos
  //img                       : IImagenProducto
  //ref                       : string
  //nombre                    : string
  //categoria                 : ICategoriaProducto
  //tipoProducto              : string
  //naturaleza                : INaturalezaProducto
  //unidad                    : IUnidad
  //descripcion               : string
  
  // * //////////////////// Disponibilidad
  //activoEnCompra            : boolean
  //activoEnVenta             : boolean
  //sin_proveedor             : boolean
  //stockGestionado           : boolean
  //stockProveedor            : number

  // * //////////////////// Requisitos
  //requiereAcabado           : boolean
  //requiereMedida            : boolean
  //requiereEntregado         : boolean

  // * //////////////////// Precios
  //precio                    : number        // Precio guardado en llx_product en columna price. Precio final, el menor entre publico y promocion  
  //precio_publico            : number        // Precio guardado en extrafields
  //precio_promocion          : number        // Precio guardado en extrafields
  //iva                       : number

  // * //////////////////// Aumentos
  //aumento                   : number
  //precio_aumento            : number        // get

  //aumento_escom             : number
  //precio_aumento_escom      : number        // get

  //aumento_descuento         : number
  //precio_aumento_descuento  : number        // get

  //aumento_loco              : number
  //precio_aumento_loco       : number        // get

  // * //////////////////// Costo
  //costo                     : number        // precio que viene de la tabla llx_product > cost_price
  //costo_adicional           : number
  //costoTotal                : number
  
  // * //////////////////// Otros datos
  
  //fecha_creacion            : string  
  //siigo                     : TCodigosSiigo  // Codigo siigo que se utiliza en los productos
  //creador_id                : number

  // * //////////////////// Datos contables

  // * //////////////////// Botones
  /*   
  urlDolibarr               : string
  urlTienda                 : string
  */
  // * //////////////////// Proveedor
  /*
  refProv                   : string  
  productosProveedor        : IProductoProveedor[]
  activo_proveedor          : boolean       // Activo proveedor
  disponible                : boolean       // Disponible proveedor
  fecha_llegada             : string        // Fecha llegada proveedor
  id_producto_pro           : number        // ID producto proveedor
  id_proveedor              : number
  */
  // * //////////////////// No esta listo
  /*   
  garantia                  : string        // "1_year"
  hecho_en                  : string        // "colombia"  
  competencia               : number
  
  */
  // * //////////////////// No
  /*   
  id                        : number
  sigla                     : string
  activo                    : boolean
  unidadId                  : number  
  tipo                      : 0 | 1 | 9     // 0 producto 1 servicio 9 subtotal
  id_extra                  : number        // ID extra field
  elegido                   : boolean       // Se utiliza para indicar que el producto a sido agregado a lista
  comentarios               : IAccion[]
  esRefEspecial             : boolean
  productoForApi            : any
  productoForApiPrecios     : any  
  getComoProductoHijo       : IProductoHijo
  tipoLabelValue            : ILabelValue
  esProducto                : boolean
  esServicio                : boolean
  precioPublicoConIVA       : number        // get
  precioPromocionConIVA     : number        // get
  descuentoCalculado        : number
  precio_escom              : number        // get
  precio_publico_final      : number        // get
 */
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
