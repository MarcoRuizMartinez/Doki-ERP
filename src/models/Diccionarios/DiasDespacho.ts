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

  get value() : number  { return this.id }
  get label() : string  { return this.nombre }
}