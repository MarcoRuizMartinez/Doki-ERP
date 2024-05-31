export interface IDiasDespacho
{
  id              : number  
  nombre          : string
  label           : string
  value           : number  
  slug	          : string
  diasMin	        : number
  diasMax	        : number    
  diasHabiles	    : boolean
  orden           : number
  tipoDia         : string
}

export class DiasDespacho implements IDiasDespacho
{
  id              : number  = 0 
  nombre          : string  = ""    
  slug	          : string  = ""
  diasMin	        : number  = 0
  diasMax	        : number  = 0
  diasHabiles	    : boolean = true
  orden           : number  = 0

  get tipoDia()   : string  { return this.diasHabiles ? "hábiles" : "calendario" }
  get value()     : number  { return this.id }
  get label()     : string  { 
    if(!this.id) return ""
    return `De ${this.diasMin} a ${this.diasMax} días ${this.diasMax} ${this.tipoDia}`
  }
}