export interface IRetenciones
{ 
  subTotal              : number
  pagado                : number
  totalIVA              : number
  
  total                 : number
  reteFuente            : number
  reteIVA               : number
  reteICA_11            : number
  reteICA_9             : number
  reteICA_6             : number
  aPagarReteFuente      : number
  saldoReteFuente       : number
  aPagarReteIVA         : number
  saldoReteIVA          : number
  aPagarReteICA_11_IVA  : number
  saldoReteICA_11_IVA   : number
  aPagarReteICA_9_IVA   : number
  saldoReteICA_9_IVA    : number
  aPagarReteICA_6_IVA   : number
  saldoReteICA_6_IVA    : number
  aPagarReteICA_11      : number
  saldoReteICA_11       : number
  aPagarReteICA_9       : number
  saldoReteICA_9        : number
  aPagarReteICA_6       : number
  saldoReteICA_6        : number
  saldo                 : number
}

export class Retenciones implements IRetenciones
{
  subTotal              : number
  pagado                : number
  totalIVA              : number

  constructor( subTotal : number, pagado : number, totalIva : number)
  {
    this.subTotal       = subTotal
    this.pagado         = pagado
    this.totalIVA       = totalIva
  }

  get total                 () : number { return this.subTotal + this.totalIVA }  
  get reteFuente            () : number { return this.subTotal * 0.025  }
  get reteIVA               () : number { return this.totalIVA * 0.15   }
  get reteICA_11            () : number { return this.subTotal * 11.04  / 1000 }
  get reteICA_9             () : number { return this.subTotal * 9.66   / 1000 }
  get reteICA_6             () : number { return this.subTotal * 6.9    / 1000 }
  get aPagarReteFuente      () : number { return this.total   - this.reteFuente }
  get saldoReteFuente       () : number { return this.pagado  - this.aPagarReteFuente }
  get aPagarReteIVA         () : number { return this.total   - this.reteFuente - this.reteIVA }
  get saldoReteIVA          () : number { return this.pagado  - this.aPagarReteIVA }
  get aPagarReteICA_11_IVA  () : number { return this.total   - this.reteFuente - this.reteIVA - this.reteICA_11 }
  get saldoReteICA_11_IVA   () : number { return this.pagado  - this.aPagarReteICA_11_IVA }
  get aPagarReteICA_9_IVA   () : number { return this.total   - this.reteFuente - this.reteIVA - this.reteICA_9 }
  get saldoReteICA_9_IVA    () : number { return this.pagado  - this.aPagarReteICA_9_IVA }
  get aPagarReteICA_6_IVA   () : number { return this.total   - this.reteFuente - this.reteIVA - this.reteICA_6 }
  get saldoReteICA_6_IVA    () : number { return this.pagado  - this.aPagarReteICA_6_IVA }
  get aPagarReteICA_11      () : number { return this.total   - this.reteFuente - this.reteICA_11 }
  get saldoReteICA_11       () : number { return this.pagado  - this.aPagarReteICA_11 }
  get aPagarReteICA_9       () : number { return this.total   - this.reteFuente - this.reteICA_9; }
  get saldoReteICA_9        () : number { return this.pagado  - this.aPagarReteICA_9; }
  get aPagarReteICA_6       () : number { return this.total   - this.reteFuente - this.reteICA_6 }
  get saldoReteICA_6        () : number { return this.pagado  - this.aPagarReteICA_6 }
  get saldo                 () : number { return this.total   - this.pagado }
}