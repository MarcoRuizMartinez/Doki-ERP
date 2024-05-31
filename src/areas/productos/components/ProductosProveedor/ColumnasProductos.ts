import {  IColAg, ColAg           } from "components/utilidades/AgGrid/ColumnasAG"
import {  getProveedoresDB,
          getCategoriasDB,
          getDiasDespachoDB,
                                  } from "src/composables/useDexie"
import {  TiposProductosProveedor } from "src/areas/productos/models/TipoProductoProveedor"
import {  MesesGarantia           } from "src/models/Diccionarios/MesesGarantia"
import {  OriginesMadeIn          } from "src/models/Diccionarios/Madein"
import imagen                       from "components/utilidades/AgGrid/ImagenProductoAG.vue"
import proveedor                    from "components/utilidades/AgGrid/ProveedorBadge.vue"

export const columnasDefecto           = {
  filter                        : "agTextColumnFilter",
  enableCellChangeFlash         : true,  
  floatingFilter                : true,
  //enableRowGroup                : true,
  //enablePivot                   : true,
  //enableValue                   : true,    
}

export const reglasCSS = {
  'bg-grey-3 text-grey-5' : ( params : any ) => { return params.data?.activo  === false },
  'bg-green-2'            : ( params : any ) => { return params.data?.esNuevo },  
}

export const autoSizeStrategy          = {
type                          : 'fitCellContents', // fitProvidedWidth fitGridWidth
defaultMinWidth               : 200,
columnLimits                  : [
  {
    colId                     : 'ref',
    minWidth                  : 900
  }
]
}

const columnas : IColAg[] = [
  // * //////////////////////////////////////////////////////////////////////////////// Imagen
  new ColAg     ({  title           : "Imagen",
                    field           : "img",                    
                    width           : 80,
                    render          : imagen,
                    //claseTitle      :"bg-grey-7 text-white",
                    filter          : "agSetColumnFilter",
                    valueFormatter  : ( p : any ) => p.value?.hayImagen ?? "",
                }),
  // * //////////////////////////////////////////////////////////////////////////////// REF y nombre proveedor         
  new ColAg     ({  title           : "Datos de proveedor",                      
                    colJuntas       : true,
                    //claseTitle      :"bg-grey-7 text-white",
                    hijos           : [
                      ColAg.Objeto  ({  field: "proveedor", render: proveedor, opciones: getProveedoresDB, key: "alias",  type: "editable" }),
                      new ColAg     ({  title : "Ref proveedor",    field : "ref",    tooltipField : "proveedor.label",   type: "creacion" }),
                      new ColAg     ({  title : "Nombre proveedor", field : "nombre", type: "creacion" }),
                    ]
                }),
  // * //////////////////////////////////////////////////////////////////////////////// REF y nombre nuestros         
  new ColAg     ({  title           : "Datos de nuestros",                      
                    colJuntas       : true,
                    //claseTitle      :"bg-grey-3",
                    hijos           : [
                      new ColAg     ({  field : "refNuestra",   tooltipField    : "proveedor.label" }),
                      new ColAg     ({  field : "nombreNuestro" }),
                    ]
                }),
  // * //////////////////////////////////////////////////////////////////////////////// Disponibilidad
  new ColAg     ({  title           : "Disponibilidad de producto",                      
                    colJuntas       : true,
                    // claseTitle      :"bg-grey-3",
                    hijos           : [
                    new ColAg     ({  field           : "activo",
                                      esBoolean       : true,
                                      claseTitle      :"bg-green-2",
                                      type            :"editarYCrear",
                                  }),
                    new ColAg     ({  field           : "disponible",
                                      claseTitle      :"bg-green-2",
                                      esBoolean       : true,
                                      type            :"editarYCrear",
                                  }),
                    new ColAg     ({  title           : "Gestión de stock",
                                      field           : "gestionStock",
                                      esBoolean       : true,
                                      hide            : true,
                                  }),
                    new ColAg     ({  field           : "stock",        hide : true,  type: "numero" }),
                    new ColAg     ({  field           : "fechaLlegada", hide : true }),
                    ColAg.Objeto({ field: "diasDespacho", title: "Días Despacho", opciones: getDiasDespachoDB, key: "label", type: "editarYCrear"}),
                    ]
                }),
  // * //////////////////////////////////////////////////////////////////////////////// Categorización
  new ColAg     ({  title           : "Categorización de producto",                      
                    colJuntas       : true,
                    hijos           : [
                      ColAg.Objeto({ field: "categoria",          opciones: getCategoriasDB,          key: "label", type: "creacion" }),
                      ColAg.Objeto({ field: "tipo",               opciones: TiposProductosProveedor,  key: "label", type: "creacion" }),
                      new ColAg   ({ field : "orden",             hide : true, type: [ "numero", "editable" ] }),
                      new ColAg   ({ field : "familiaNuestra",    type: "editable", hide : true }),
                      new ColAg   ({ field : "familiaProveedor",  type: "editable", hide : true }),
                      new ColAg   ({ field : "documento",         type: "editable", hide : true }),
                    ]
                }),
  // * //////////////////////////////////////////////////////////////////////////////// Precios
  new ColAg     ({  title           : "Precios proveedor",                      
                    colJuntas       : true,
                    hijos           : [
                      ColAg.Precio({ field: "precio",           title: "✅Precio",  type: "creacion" }),
                      ColAg.Precio({ field: "precioCredito",    title: "✅Credito", type: "creacion" }),
                      ColAg.Precio({ field: "precio_n",         type: "editable",   hide: true, title: "🔜Precio"}),
                      ColAg.Precio({ field: "precioCredito_n",  type: "editable",   hide: true, title: "🔜Credito"}),
                      ColAg.Precio({ field: "diferencia",       hide: true }),
                      new ColAg   ({ field: "diferenciaX100",   hide: true,         title: "Variación %" }),
                      ColAg.Precio({ field: "precioPromocion",  hide: true, title: "Precio Promoción"}),
                      ColAg.Precio({ field: "costoExtra",       hide: true, type: "editable"  }),
                      new ColAg   ({ field: "descuento",        hide: true, type: "editable" }),
                      new ColAg   ({ field: "calcularDescuento",hide: true, type: "editable" }),
                      new ColAg   ({ field: "precioActualizado", type: "editable",  hide: true, }),
                    ]
                }),
  // * //////////////////////////////////////////////////////////////////////////////// Registro de cambios
  new ColAg     ({  title           : "Características de producto",                      
                    colJuntas       : true,
                    hijos           : [
                      ColAg.Objeto({ field : "hechoEn",       title: "Hecho en",          opciones: OriginesMadeIn, key: "label", type: "editable"}),
                      ColAg.Objeto({ field : "garantiaMeses", title: "Garantía",          opciones: MesesGarantia,  key: "label", type: "editable"}),
                      new ColAg   ({ field : "url",           title: "URL",               hide : true }),
                      new ColAg   ({ field : "descripcion",   title: "Descripción",       hide : true }),
                    ]
                }),                       
  // * //////////////////////////////////////////////////////////////////////////////// Registro de cambios
  new ColAg     ({  title           : "Registro de cambios",                      
                    colJuntas       : true,
                    hijos           : [
                      new ColAg   ({ field : "creador.label", title: "Creador",        hide : true }),
                      new ColAg   ({ field : "fechaCreacion", title: "Fecha Creación", hide : true }),
                      new ColAg   ({ field : "edito.label",   title: "Edito",          hide : true }),
                      new ColAg   ({ field : "fechaEdicion",  title: "Fecha Edición",  hide : true }),
                    ]
                }),                
]

export const ColumnasProductos = columnas.map( c => c.api )
