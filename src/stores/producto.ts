import {  defineStore           } from 'pinia';
import {  ILoading,
          LoadingDefault,
          IModales,
          ModalesDefault        } from "src/models/TiposVarios"
import {  ProductoDoli,
          IProductoDoli         } from "src/areas/productos/models/ProductoDolibarr"
import {  BusquedaProducto,
          IBusquedaProducto     } from "src/areas/productos/models/BusquedaProductos"
import {  IProductoProveedor,
          ProductoProveedor     } from "src/areas/productos/models/ProductoProveedor"
import {  Busqueda,
          IBusqueda             } from "src/models/Busqueda"          


interface IProductoState {
  producto            : IProductoDoli,
  productos           : IProductoDoli[],
  seleccion           : IProductoDoli[],  
  productosFil        : IProductoDoli[],      // Productos filtrados
  productoPro         : IProductoProveedor,
  productosPro        : IProductoProveedor[], // Productos proveedor
  loading             : ILoading,  
  modales             : IModales,
  busqueda            : IBusquedaProducto,
  busquedaPro         : IBusqueda,
}

export const useStoreProducto = defineStore('producto', {
  state: () : IProductoState => ({
    producto          : new ProductoDoli(),
    productoPro       : new ProductoProveedor(),
    productos         : [],
    productosPro      : [],
    productosFil      : [],
    seleccion         : [],
    busqueda          : new BusquedaProducto(),
    loading           : LoadingDefault,
    modales           : ModalesDefault, 
    busquedaPro       : new Busqueda(),
  }),
});