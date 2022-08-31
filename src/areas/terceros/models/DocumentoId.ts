import {  TIPOS_DOCUMENTO,
          ITipoDocumento,
          TipoDocumento
                          } from "./TiposDocumento"

//* ///////////////////////////////////////////////////////////// Documento
export interface IDocumento {
  numero:   string                    // siren
  tipo:     ITipoDocumento            // fk_typent -> Tabla llx_c_typent
  digito:   string                    // siret
  esNumero: boolean
}

export class Documento implements IDocumento
{
  numero:   string   
  tipo:     ITipoDocumento
  digito:   string

  constructor()
  {
    this.numero   = ""
    this.tipo     = new TipoDocumento()
    this.digito   = ""
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