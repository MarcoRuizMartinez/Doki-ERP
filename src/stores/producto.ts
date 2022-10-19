import {  defineStore           } from 'pinia';
import {  ILoading,
          LoadingDefault,
          IModales,
          ModalesDefault
                                } from "src/models/TiposVarios"
import {  IProductoCategoria,
          ProductoCategoria     } from "src/areas/productos/models/ProductoCategoria"
import {  ProductoDoli,
          IProductoDoli         } from "src/areas/productos/models/ProductoDolibarr"
import {  BusquedaProducto,
          IBusquedaProducto     } from "src/areas/productos/models/BusquedaProductos"
import {  FiltroProductos,
          IFiltroProductos      } from "src/areas/productos/models/FiltrosProductos"

interface IProductoState {
  producto            : IProductoDoli,
  productos           : IProductoDoli[],
  productosFil        : IProductoDoli[],
  seleccion           : IProductoDoli[],  
  loading             : ILoading,  
  modales             : IModales,
  busqueda            : IBusquedaProducto,
  filtro              : IFiltroProductos,
  tipoVista           : "grilla" | "lista"
}

export const useStoreProducto = defineStore('producto', {
  state: () : IProductoState => ({
    producto          : new ProductoDoli(),
    productos         : [],
    productosFil      : [],
    seleccion         : [],
    busqueda          : new BusquedaProducto(),
    filtro            : new FiltroProductos(),
    loading           : LoadingDefault,
    modales           : ModalesDefault, 
    tipoVista         : "lista"
  }),
});