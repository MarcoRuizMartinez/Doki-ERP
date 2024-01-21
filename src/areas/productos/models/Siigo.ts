export type TCodigosSiigo = {
  codigo      : number
  linea       : number
  grupo       : number
  codigoFull  : string

  enSiigo     : boolean
  idProducto  : number
  nombre      : string
  ref         : string
  unidadDian  : string
}

export class CodigosSiigo implements TCodigosSiigo
{
  codigo      : number  = 0
  linea       : number  = 0
  grupo       : number  = 0
  enSiigo     : boolean = false
  idProducto  : number  = 0
  nombre      : string  = ""
  ref         : string  = ""
  unidadDian  : string  = ""

  get codigoFull() { return `${this.linea}${this.grupo}${this.codigo}`}
}


export type TKitSiigo = {
  padreLinea  : number
  padreGrupo  : number
  padreCodigo : number
  linea       : number
  grupo       : number
  codigo      : number
  qty         : number
  unidadDian  : string
}

export const columnasSiigo = [
  { name: "enSiigo",  label: "En Siigo",  CSVOculto: true,      format: ( value : any)=> !!value ? "✅" : "❌" },
  { name: "linea",                        clase: "fuente-mono"  },
  { name: "grupo",                        clase: "fuente-mono"  },
  { name: "codigo",                       clase: "fuente-mono"  },
  { name: "nombre"  },
  { name: "ref"     },
  { name: "CÓDIGO BARRAS"  },
  { name: "PRECIO 1", CSVvalor: "0" },
  { name: 'PRECIO 2', CSVvalor: '0' },
  { name: 'PRECIO 3', CSVvalor: '0' },
  { name: 'PRECIO 4', CSVvalor: '0' },
  { name: 'PRECIO 5', CSVvalor: '0' },
  { name: 'PRECIO 6', CSVvalor: '0' },
  { name: 'PRECIO 7', CSVvalor: '0' },
  { name: 'PRECIO 8', CSVvalor: '0' },
  { name: 'PRECIO 9', CSVvalor: '0' },
  { name: 'PRECIO 10', CSVvalor: '0' },
  { name: 'PRECIO 11', CSVvalor: '0' },
  { name: 'PRECIO 12', CSVvalor: '0' },
  { name: 'IVA INCLUIDO', CSVvalor: 'N' },
  { name: 'PORCENTAJE DE IVA', CSVvalor: '19' },
  { name: 'EXISTENCIA MÁXIMA', CSVvalor: '0' },
  { name: 'EXISTENCIA MÍNIMA', CSVvalor: '0' },
  { name: 'TIEMPO DE REPOSICIÓN', CSVvalor: '0' },
  { name: 'COSTO', CSVvalor: '0' },
  { name: 'UNIDAD', CSVvalor: 'UND' },
  { name: 'CÓDIGO EQUIVALENTE', CSVvalor: '0' },
  { name: 'DESCRIPCIÓN', CSVvalor: '' },
  { name: 'MARCA', CSVvalor: '' },
  { name: 'FACTOR', CSVvalor: 'N' },
  { name: 'FACTOR 1', CSVvalor: '' },
  { name: 'FACTOR 2', CSVvalor: '' },
  { name: 'FACTOR 3', CSVvalor: '' },
  { name: 'FACTOR 4', CSVvalor: '' },
  { name: 'FACTOR 5', CSVvalor: '' },
  { name: 'OPERANDO 1', CSVvalor: '' },
  { name: 'OPERANDO 2', CSVvalor: '' },
  { name: 'OPERANDO 3', CSVvalor: '' },
  { name: 'OPERANDO 4', CSVvalor: '' },
  { name: 'OPERANDO 5', CSVvalor: '' },
  { name: 'FACTOR 1', CSVvalor: '0' },
  { name: 'FACTOR 2', CSVvalor: '0' },
  { name: 'FACTOR 3', CSVvalor: '0' },
  { name: 'FACTOR 4', CSVvalor: '0' },
  { name: 'FACTOR 5', CSVvalor: '0' },
  { name: 'TARIFA', CSVvalor: '3' },
  { name: 'UBICACIÓN', CSVvalor: '' },
  { name: 'DISCRIMINAR IVA', CSVvalor: 'S' },
  { name: 'ACTIVO', CSVvalor: 'S' },
  { name: 'PESO', CSVvalor: '0' },
  { name: 'ENVIAR A ISIIGO', CSVvalor: '' },
  { name: 'NIT PROVEEDOR 1', CSVvalor: '0' },
  { name: 'NIT PROVEEDOR 2', CSVvalor: '0' },
  { name: 'NIT PROVEEDOR 3', CSVvalor: '0' },
  { name: 'NIT PROVEEDOR 4', CSVvalor: '0' },
  { name: 'SUCURSAL 1', CSVvalor: '0' },
  { name: 'SUCURSAL 2', CSVvalor: '0' },
  { name: 'SUCURSAL 3', CSVvalor: '0' },
  { name: 'SUCURSAL 4', CSVvalor: '0' },
  { name: 'AÑO COMPRA 1', CSVvalor: '0' },
  { name: 'MES COMPRA 1', CSVvalor: '0' },
  { name: 'DÍA COMPRA 1', CSVvalor: '0' },
  { name: 'AÑO COMPRA 2', CSVvalor: '0' },
  { name: 'MES COMPRA 2', CSVvalor: '0' },
  { name: 'DÍA COMPRA 2', CSVvalor: '0' },
  { name: 'AÑO COMPRA 3', CSVvalor: '0' },
  { name: 'MES COMPRA 3', CSVvalor: '0' },
  { name: 'DÍA COMPRA 3', CSVvalor: '0' },
  { name: 'AÑO COMPRA 4', CSVvalor: '0' },
  { name: 'MES COMPRA 4', CSVvalor: '0' },
  { name: 'DÍA COMPRA 4', CSVvalor: '0' },
  { name: 'VALOR COMPRA 1', CSVvalor: '0' },
  { name: 'VALOR COMPRA 2', CSVvalor: '0' },
  { name: 'VALOR COMPRA 3', CSVvalor: '0' },
  { name: 'VALOR COMPRA 4', CSVvalor: '0' },
  { name: 'DESCRIPCIÓN LARGA', CSVvalor: '' },
  { name: 'MANEJA PESO EN CAJERO', CSVvalor: 'N' },
  { name: 'MAX Y MIN', CSVvalor: 'N' },
  { name: 'COSTO UNI', CSVvalor: '0' },
  { name: 'MODELO', CSVvalor: '' },
  //{ name: 'UNIDAD FE', CSVvalor: '' },
  { name: 'CÓDIGO ARANCELARIO', CSVvalor: '' },
  { name: 'UNIDAD 1 FE', CSVvalor: '' },
  { name: 'UNIDAD 2 FE', CSVvalor: '' },
  { name: 'UNIDAD 3 FE', CSVvalor: '' },
  { name: 'UNIDAD 4 FE', CSVvalor: '' },
  { name: 'UNIDAD 5 FE', CSVvalor: '' },
  { name: 'IMPOCONSUMO', CSVvalor: 'N' }
]