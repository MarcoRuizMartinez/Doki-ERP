//* ///////////////////////////////////////////////////////////// Tipos de documento
export enum TIPOS_DOCUMENTO {
  TARJETA_IDENTIDAD           = "12",
  CEDULA_CIUDADANIA           = "13",
  TARJETA_EXTRANJERIA         = "21",
  CEDULA_EXTRANJERIA          = "22",
  NIT                         = "31",
  PASAPORTE                   = "41",
  IDENTIFICACION_EXTRANJERA   = "42"
}

export interface ITipoDocumento {
  id:       number
  codigo:   TIPOS_DOCUMENTO | ""
  nombre:   string
  value:    TIPOS_DOCUMENTO | ""
  label:    string
}

export class TipoDocumento implements ITipoDocumento
{
  id:       number
  codigo:   TIPOS_DOCUMENTO | ""
  nombre:   string
  
  constructor()
  {
    this.id       = 0
    this.codigo   = ""
    this.nombre   = ""
  }

  get value() : TIPOS_DOCUMENTO | ""
  {
    return this.codigo
  }

  get label() : string
  {
    return this.nombre
  }
}

//export const  = Object.values(TIPOS_DOCUMENTO); //[ 'WHITE', 'BLACK', 'BLUE', 0, 1, 3 ]

/*
export const TiposDocumento : ITipoDocumento[]= [
  { value: TIPOS_DOCUMENTO.CEDULA_CIUDADANIA,         label: "Cédula de ciudadanía"       },
  { value: TIPOS_DOCUMENTO.NIT,                       label: "NIT"                        },
  { value: TIPOS_DOCUMENTO.TARJETA_EXTRANJERIA,       label: "Tarjeta de extranjería"     },
  { value: TIPOS_DOCUMENTO.CEDULA_EXTRANJERIA,        label: "Cédula de extranjería"      },
  { value: TIPOS_DOCUMENTO.TARJETA_IDENTIDAD,         label: "Tarjeta de identidad"       },
  { value: TIPOS_DOCUMENTO.PASAPORTE,                 label: "Pasaporte"                  },
  { value: TIPOS_DOCUMENTO.IDENTIFICACION_EXTRANJERA, label: "Identificación extranjera"  },
] 
*/