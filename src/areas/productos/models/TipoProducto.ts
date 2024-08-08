export enum TIPO_PRO_PROVEEDOR 
{
  NULO                = 0,
  SIMPLE              = 1,
  PARTE               = 2,
  COMPUESTO           = 3,
  KIT                 = 4,
  HIJO                = 5,
  MARKETPLACE         = 6,
}

export interface ITipoProductoProveedor
{
  label               : string 
  value               : TIPO_PRO_PROVEEDOR
  //icono               : string
  //color               : string  
  esSimple            : boolean
  esParte             : boolean
  esCompuesto         : boolean
  esKit               : boolean
  esHijo              : boolean
  esMarketPlace       : boolean
}


export class TipoProductoProveedor implements ITipoProductoProveedor
{
  value               : TIPO_PRO_PROVEEDOR
  
  constructor( value  : TIPO_PRO_PROVEEDOR  = 0 )
  {
    this.value        = value
  }

  get label() : string {
    const label       =   this.esSimple       ? "Simple" 
                        : this.esParte        ? "Parte" 
                        : this.esCompuesto    ? "Compuesto"
                        : this.esKit          ? "Kit"
                        : this.esHijo         ? "Hijo"
                        : this.esMarketPlace  ? "Marketplace"
                        : ""
    return label
  }
/* 
  get icono() : string {
    const icono       =   this.value == 0 ? "" 
                        : this.value == 1 ? "Simple" 
                        : this.value == 2 ? "Parte" 
                        : this.value == 3 ? "Compuesto"
                        : this.value == 4 ? "Kit"
                        : ""
    return icono
  }
  get color() : string {
    const color       =   this.value == 0 ? "" 
                        : this.value == 1 ? "Simple" 
                        : this.value == 2 ? "Parte" 
                        : this.value == 3 ? "Compuesto"
                        : this.value == 4 ? "Kit"
                        : ""
    return color
  } */

  get esNulo()        : boolean { return this.value === TIPO_PRO_PROVEEDOR.NULO        } 
  get esSimple()      : boolean { return this.value === TIPO_PRO_PROVEEDOR.SIMPLE      }
  get esParte()       : boolean { return this.value === TIPO_PRO_PROVEEDOR.PARTE       }
  get esCompuesto()   : boolean { return this.value === TIPO_PRO_PROVEEDOR.COMPUESTO   }
  get esKit()         : boolean { return this.value === TIPO_PRO_PROVEEDOR.KIT         }
  get esHijo()        : boolean { return this.value === TIPO_PRO_PROVEEDOR.HIJO        }
  get esMarketPlace() : boolean { return this.value === TIPO_PRO_PROVEEDOR.MARKETPLACE }
}

export const TiposProductosProveedor       = [
  new TipoProductoProveedor ( TIPO_PRO_PROVEEDOR.SIMPLE      ),
  new TipoProductoProveedor ( TIPO_PRO_PROVEEDOR.HIJO        ),
  new TipoProductoProveedor ( TIPO_PRO_PROVEEDOR.PARTE       ),
  new TipoProductoProveedor ( TIPO_PRO_PROVEEDOR.COMPUESTO   ),
  new TipoProductoProveedor ( TIPO_PRO_PROVEEDOR.KIT         ),
  new TipoProductoProveedor ( TIPO_PRO_PROVEEDOR.MARKETPLACE ),
]

export enum TIPO_PRODUCTO
{
  NULO                = -1,
  PRODUCTO            = 0,
  SERVICIO            = 1,
  SUBTOTAL_TITULO     = 9,      // Subtotal o titulo
}

export interface ITipoProducto
{
  label               : string 
  value               : TIPO_PRODUCTO
  esProducto          : boolean
  esServicio          : boolean
  esEspecial          : boolean  // Subtotal o titulo
}


export class TipoProducto implements ITipoProducto
{
  value               : TIPO_PRODUCTO
  
  constructor( value  : TIPO_PRODUCTO = TIPO_PRODUCTO.PRODUCTO )
  {
    this.value        = value
  }

  get label() : string {
    const label       =   this.esProducto     ? "Producto" 
                        : this.esServicio     ? "Servicio" 
                        : this.esEspecial     ? "Especial"
                        : this.esNull         ? "Nulo"
                        :                       "Desconocido"
    return label
  }

  get esNull()          : boolean { return this.value === TIPO_PRODUCTO.NULO            } 
  get esProducto()      : boolean { return this.value === TIPO_PRODUCTO.PRODUCTO        } 
  get esServicio()      : boolean { return this.value === TIPO_PRODUCTO.SERVICIO        }
  get esEspecial()      : boolean { return this.value === TIPO_PRODUCTO.SUBTOTAL_TITULO }  
}

export const TiposProductos       = [
  new TipoProducto ( TIPO_PRODUCTO.PRODUCTO ),
  new TipoProducto ( TIPO_PRODUCTO.SERVICIO ),
]