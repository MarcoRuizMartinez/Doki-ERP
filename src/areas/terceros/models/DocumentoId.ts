import {  TIPOS_DOCUMENTO,
          ITipoDocumento,
          TipoDocumento
                          } from "./TiposDocumento"

//* ///////////////////////////////////////////////////////////// Documento
export interface IDocumento
{
  numero          : string                    // siren
  tipo            : ITipoDocumento            // fk_typent -> Tabla llx_c_typent
  digito          : string                    // siret
  esNumero        : boolean
  label           : string
}

export class Documento implements IDocumento
{
  numero          : string          = ""   
  digito          : string          = ""
  tipo            : ITipoDocumento  = new TipoDocumento()

  get label() : string {
    let numero  : string  = this.numero
    if(this.tipo.esCedula || this.tipo.esNIT || this.tipo.esTI){      
      numero              = this.numero.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

    return this.tipo.label + " " + numero
  }

  
  get esNumero() : boolean
  {
    let esNumero_ = false
    if
    (
      this.tipo.value   == TIPOS_DOCUMENTO.TARJETA_IDENTIDAD
      ||
      this.tipo.value   == TIPOS_DOCUMENTO.CEDULA_CIUDADANIA
      ||
      this.tipo.value   == TIPOS_DOCUMENTO.NIT
    )
      esNumero_   = true

    return esNumero_
  }
}