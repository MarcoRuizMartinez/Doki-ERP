import {  defineStore           } from 'pinia';
import {  ILoading,
          LoadingDefault,
          IModales,
          ModalesDefault
                                } from "src/models/TiposVarios"
  import {  IProductoCategoria,
            ProductoCategoria   } from "src/areas/productos/models/ProductoCategoria"
  import {  ProductoDoli,
            IProductoDoli       } from "src/areas/productos/models/ProductoDolibarr"

interface IProductoState {
  producto            : IProductoDoli,
  loading             : ILoading,  
  modales             : IModales,
  productos           : IProductoDoli[],
}

export const useStoreProducto = defineStore('producto', {
  state: () : IProductoState => ({
    producto          : new ProductoDoli(),
    loading           : LoadingDefault,
    modales           : ModalesDefault,
    productos         : [],
  }),
});