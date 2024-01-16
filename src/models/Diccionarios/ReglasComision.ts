import {  TNivelesComision,
          NIVELES_COMISION  } from "src/areas/acuerdos/models/Comisiones/NivelesComision"


export interface IReglaComision
{
  id                        : number
	nombre                    : string
  descripcion               : string

  label                     : string
  value                     : number

  // *                      // Para guardar en Dexie estos valores
	alfa                      : string
	a                         : string
	b                         : string
	c                         : string
	d                         : string
	e                         : string

  X100_alfa                 : number
  X100_a                    : number
  X100_b                    : number
  X100_c                    : number
  X100_d                    : number
  X100_e                    : number
  getX100Comision           : ( nivel : TNivelesComision )=> number
}

export class ReglaComision implements IReglaComision
{
  id                        : number  = 0
	nombre                    : string  = ""
  descripcion               : string  = ""

	alfa                      : string  = "0"
	a                         : string  = "0"
	b                         : string  = "0"
	c                         : string  = "0"
	d                         : string  = "0"
	e                         : string  = "0"

  get label()     : string  { return this.nombre  }
  get value()     : number  { return this.id      }

  get X100_alfa() : number  { return +this.alfa   }
  get X100_a()    : number  { return +this.a      }
  get X100_b()    : number  { return +this.b      }
  get X100_c()    : number  { return +this.c      }
  get X100_d()    : number  { return +this.d      }
  get X100_e()    : number  { return +this.e      }

  getX100Comision( nivel : TNivelesComision ) : number 
  {
    const comision  =   nivel === NIVELES_COMISION.ALFA ? this.X100_alfa
                      : nivel === NIVELES_COMISION.A    ? this.X100_a
                      : nivel === NIVELES_COMISION.B    ? this.X100_b
                      : nivel === NIVELES_COMISION.C    ? this.X100_c
                      : nivel === NIVELES_COMISION.D    ? this.X100_d
                      : nivel === NIVELES_COMISION.E    ? this.X100_e
                      :                                   0
    return comision
  }  
}
