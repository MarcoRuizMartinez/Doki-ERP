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
  id        : number
  codigo    : TIPOS_DOCUMENTO | ""
  nombre    : string
  value     : TIPOS_DOCUMENTO | ""
  label     : string
  esCedula  : boolean
  esNIT     : boolean
  esTI      : boolean
  sigla     : string
}

export class TipoDocumento implements ITipoDocumento
{
  id        : number                = 0
  codigo    : TIPOS_DOCUMENTO | ""  = ""
  nombre    : string                = ""
  
  get value() : TIPOS_DOCUMENTO | ""
  {
    return this.codigo
  }

  get label() : string {
    return this.nombre
  }

  get esCedula() : boolean {
    return this.codigo === TIPOS_DOCUMENTO.CEDULA_CIUDADANIA
  }  

  get esNIT() : boolean {
    return this.codigo === TIPOS_DOCUMENTO.NIT
  }  

  get esTI() : boolean {
    return this.codigo === TIPOS_DOCUMENTO.TARJETA_IDENTIDAD
  }  

  get sigla() : string {
    const partes      = this.nombre.split(" ")
    let sigla         = ""

    for (const parte of partes)
    {
      if(parte.length   <= 2 ) continue
      
      if(partes.length  === 1)
      { 
        sigla           = parte.toUpperCase()        
      }
      else
        sigla           += parte[0].toUpperCase()
    }

    return sigla
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