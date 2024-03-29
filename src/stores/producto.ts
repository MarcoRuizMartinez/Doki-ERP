import {  defineStore           } from 'pinia';
import {  ILoading,
          LoadingDefault,
          IModales,
          ModalesDefault
                                } from "src/models/TiposVarios"
import {  ProductoDoli,
          IProductoDoli         } from "src/areas/productos/models/ProductoDolibarr"
import {  BusquedaProducto,
          IBusquedaProducto     } from "src/areas/productos/models/BusquedaProductos"

interface IProductoState {
  producto            : IProductoDoli,
  productos           : IProductoDoli[],
  productosFil        : IProductoDoli[],
  seleccion           : IProductoDoli[],  
  loading             : ILoading,  
  modales             : IModales,
  busqueda            : IBusquedaProducto,
}

export const useStoreProducto = defineStore('producto', {
  state: () : IProductoState => ({
    producto          : new ProductoDoli(),
    productos         : [],
    productosFil      : [],
    seleccion         : [],
    busqueda          : new BusquedaProducto(),
    loading           : LoadingDefault,
    modales           : ModalesDefault, 
  }),
});