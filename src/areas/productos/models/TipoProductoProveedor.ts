export enum TIPO_PRO_PROVIDEDOR
{
  NULO                = 0,
  SIMPLE              = 1,
  PARTE               = 2,
  COMPUESTO           = 3,
  KIT                 = 4,
}

export interface ITipoProductoProveedor
{
  label               : string 
  value               : TIPO_PRO_PROVIDEDOR
  icono               : string
  color               : string  
  esSimple            : boolean
  esParte             : boolean
  esCompuesto         : boolean
  esKit               : boolean
}


export class TipoProductoProveedor implements ITipoProductoProveedor
{
  value               : TIPO_PRO_PROVIDEDOR
  
  constructor( value  : TIPO_PRO_PROVIDEDOR  = 0 )
  {
    this.value        = value
  }

  get label() : string {
    const label       =   this.value == 0 ? "" 
                        : this.value == 1 ? "Simple" 
                        : this.value == 2 ? "Parte" 
                        : this.value == 3 ? "Compuesto"
                        : this.value == 4 ? "Kit"
                        : ""
    return label
  }

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
  
  }

  get esNulo()      : boolean { return this.value === TIPO_PRO_PROVIDEDOR.NULO      } 
  get esSimple()    : boolean { return this.value === TIPO_PRO_PROVIDEDOR.SIMPLE    }
  get esParte()     : boolean { return this.value === TIPO_PRO_PROVIDEDOR.PARTE     }
  get esCompuesto() : boolean { return this.value === TIPO_PRO_PROVIDEDOR.COMPUESTO }
  get esKit()       : boolean { return this.value === TIPO_PRO_PROVIDEDOR.KIT       }
}

export const TiposProductosProveedor       = [
  { value: TIPO_PRO_PROVIDEDOR.SIMPLE,    label: "Simple"   },
  { value: TIPO_PRO_PROVIDEDOR.PARTE,     label: "Parte"    },
  { value: TIPO_PRO_PROVIDEDOR.COMPUESTO, label: "Compuesto"},
  { value: TIPO_PRO_PROVIDEDOR.KIT  ,     label: "Kit"      },
]