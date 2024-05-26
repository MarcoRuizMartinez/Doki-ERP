import { IColAg, ColAg  } from "components/utilidades/AgGrid/ColumnasAG"

export const columnasBase : IColAg[]   = [
    //new ColAg({ h: "Imagen",            f: "img",             render: imagen, w: 80                 }).api,
    new ColAg     ({  title       : "Ref proveedor",
                      field       : "ref",
                      claseTitle  : "bg-blue-2",    
                      editar      : true,
                      clase       : "clase-test",
                  }),
    new ColAg     ({  title       : "Ref Nuestra",
                      field       : "refNuestra",
                      minWidth    : 100
                  }),
    new ColAg     ({  title       : "Nombre proveedor",
                      field       : "nombre",
                      flex        : 1,
                  }),
    new ColAg     ({  title       : "Proveedor", 
                      field       : "proveedor.label",
                      editar      : true, 
                      editor      : "agSelectCellEditor"
                  }),
    new ColAg     ({  title       : "Activo",
                      field       : "activo"
                  }),
    new ColAg     ({  title       : "Disponible",
                      field       : "disponible",
                      visible     : false, 
                   }),
    new ColAg     ({  title       : "Precios proveedor",                      
                      colJuntas   : true,
                      hijos       : [
                        ColAg.Precio({ field: "precio" }),
                        ColAg.Precio({ title: "Credito", field: "precioCredito", colGroupShow: "open" }),
                        ColAg.Precio({ title: "Extra", field: "costoExtra", colGroupShow: "open"  })
                        
                      ]
                    }),
    new ColAg     ({  field       : "id" }),
    new ColAg     ({  field       : "idNuestro" }),
    new ColAg     ({  field       : "tipo.label", title: "Tipo" }),
    new ColAg     ({  field       : "categoria.label", title: "Categoria" }),
    new ColAg     ({  field       : "hechoEn" }),
    new ColAg     ({  field       : "garantia" }),      
  ]
  /*
  id                  : number  
  idNuestro           : number
  ref                 : string
  refNuestra          : string
  nombre              : string
  nombreNuestro       : string
  estado              : string  //  published, draft, deleted
  tipo                : ITipoProductoProveedor
  orden               : number
  proveedor           : IProveedor
  categoria           : ICategoriaProducto
  img                 : IImagenProducto

  activo              : boolean
  disponible          : boolean    
  gestionStock        : boolean
  stock               : number    

  descripcion         : string  
  url                 : string  
  familiaNuestra      : string
  familiaProveedor    : string  
  hechoEn             : string
  garantia            : string
  garantiaMeses       : number
  diasDespacho        : IDiasDespacho

  precio              : number  
  precioCredito       : number
  precioDolar         : number
  precioPromocion     : number  
  costoExtra          : number
  descuento           : number
  calcularDescuento   : boolean
  precioActualizado   : boolean

  creador             : IUsuario
  edito               : IUsuario
  fechaCreacion       : Date
  fechaCreacionCorta  : string
  fechaEdicion        : Date
  fechaEdicionCorta   : string
  fechaLlegada        : Date
  fechaLlegadaCorta   : string
  */