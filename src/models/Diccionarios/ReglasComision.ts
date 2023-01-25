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
}

export class ReglaComision implements IReglaComision
{
  id                        : number
	nombre                    : string
  descripcion               : string

	alfa                      : string
	a                         : string
	b                         : string
	c                         : string
	d                         : string
	e                         : string

  constructor()
  {
    this.id                 = 0
    this.nombre             = ""
    this.descripcion        = ""

    this.alfa               = "0"
    this.a                  = "0"
    this.b                  = "0"
    this.c                  = "0"
    this.d                  = "0"
    this.e                  = "0"
  }

  get label()     : string  { return this.nombre  }
  get value()     : number  { return this.id      }

  get X100_alfa() : number  { return +this.alfa   }
  get X100_a()    : number  { return +this.a      }
  get X100_b()    : number  { return +this.b      }
  get X100_c()    : number  { return +this.c      }
  get X100_d()    : number  { return +this.d      }
  get X100_e()    : number  { return +this.e      }

}
