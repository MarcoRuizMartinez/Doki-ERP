import {  IMunicipio,
          Municipio         } from "src/models/Municipio"
import {  getMunicipioDB    } from "src/services/useDexie"

import {  TTipoAcuerdo, 
          TIPO_ACUERDO      } from "src/areas/acuerdos/models/ConstantesAcuerdos"
import {  getDateToApiDolibarr
                            } from "src/useSimpleOk/useTools"          

export const enum TIPOS_CONTACTO_ID { // llx_c_type_contact
  NO_ASIGNADO             = 0,
  
  CTZ_BILLING             = 40,
  CTZ_CUSTOMER            = 41,
  CTZ_SHIPPING            = 42,

  PED_BILLING             = 100, // Contacto factura cliente
  PED_CUSTOMER            = 101, // Cliente en seguimiento de orden	
  PED_SHIPPING            = 102, //	Contacto de envío del cliente
  
  FAC_BILLING             = 60, // Contactar facturación cliente
  FAC_SHIPPING            = 61, // Contacto con el cliente de entrega
  FAC_SERVICE             = 62, // Contactar con la prestación del cliente

  /* // Intervenciones 
    BILLING 130
    CUSTOMER 131  
  */
}

export const enum TIPOS_CONTACTO { // llx_c_type_contact
  NO_ASIGNADO             = "",
  CONTABLE                = "BILLING",  // Contacto factura cliente
  COMERCIAL               = "CUSTOMER", // Cliente en seguimiento de orden	
  ENTREGA                 = "SHIPPING", //	Contacto de envío del cliente
  SERVICE                 = "SERVICE"
}

export type TTipoContacto = TIPOS_CONTACTO.NO_ASIGNADO | TIPOS_CONTACTO.CONTABLE | TIPOS_CONTACTO.COMERCIAL | TIPOS_CONTACTO.ENTREGA

export interface IContacto {
    id:                   number
    idRelacion:           number
    tipo:                 TTipoContacto
    tipoId:               TIPOS_CONTACTO_ID
    tipoLabel:            string
    nombres:              string
    apellidos:            string
    empresa:              string // para cotizaciones - nota publica en Dolibarr
    cargo:                string
    correo:               string
    telefono:             string
    telefono_2:           string
    extension:            string
    direccion:            string
    fechaCreado:          Date 
    fechaModificado:      Date 
    fechaCreadoCorta:     string
    fechaModificadoCorta: string
    terceroId:            number
    nota:                 string  // nota privada en Dolibarr
    activo:               boolean
    nombreCompleto:       string
    empresaYnombre:       string
    municipio:            IMunicipio
    municipioId:          number
    esTipoComercial:      boolean
    esTipoContable:       boolean
    esTipoEntrega:        boolean
    getContactoToAPIDolibarr: () => object
}

export class Contacto implements IContacto
{
  id:                     number
  idRelacion:             number
  tipoId:                 TIPOS_CONTACTO_ID
  nombres:                string
  apellidos:              string
  empresa:                string
  cargo:                  string
  correo:                 string
  telefono:               string
  telefono_2:             string
  extension:              string  
  direccion:              string
  fechaCreado:            Date 
  fechaModificado:        Date
  terceroId:              number
  nota:                   string
  activo:                 boolean 
  municipio:              IMunicipio
  municipioId:            number

  constructor( terceroId : number = 0 )
  {
    this.id               = 0
    this.tipoId           = 0
    this.idRelacion       = 0
    this.nombres          = ""
    this.apellidos        = ""
    this.empresa          = ""
    this.cargo            = ""
    this.correo           = ""
    this.telefono         = ""
    this.telefono_2       = ""
    this.extension        = ""
    this.direccion        = ""
    this.fechaCreado      = new Date()
    this.fechaModificado  = new Date()
    this.terceroId        = terceroId
    this.nota             = ""
    this.activo           = true
    this.municipio        = new Municipio()
    this.municipioId      = 0
  }

  get nombreCompleto() :string {
    let nombre            = !!this.nombres ? this.nombres + " " : ""
        nombre            += this.apellidos
    return nombre
  }

  get empresaYnombre() : string {
    let nombre            = !!this.empresa ? "<b>" + this.empresa + "</b> - " : ""
        nombre            += this.nombreCompleto
    return nombre
  }

  get fechaCreadoCorta() : string {
    return this.fechaCreado.toLocaleDateString('sv-SE') 
  }

  get fechaModificadoCorta() : string {
    return this.fechaModificado.toLocaleDateString('sv-SE') 
  }

  get tipo() : TTipoContacto {
    return Contacto.getTipoStringFromTipoId( this.tipoId )
  }

  get esTipoComercial (): boolean { return  this.tipo === TIPOS_CONTACTO.COMERCIAL  }
  get esTipoContable  (): boolean { return  this.tipo === TIPOS_CONTACTO.CONTABLE   }
  get esTipoEntrega   (): boolean { return  this.tipo === TIPOS_CONTACTO.ENTREGA    }
  get tipoLabel       (): string {
    return    this.esTipoComercial  ? "comercial"
            : this.esTipoContable   ? "contable"
            : this.esTipoEntrega    ? "entrega"
            : ""
  }

  getContactoToAPIDolibarr() : any
  {
    let contacto   = {
                      socid:        this.terceroId,
                      firstname:    this.nombres,
                      lastname:     this.apellidos,
                      poste:        this.cargo,
                      email:        this.correo,
                      phone_mobile: this.telefono,
                      phone_pro:    this.telefono_2,
                      phone_perso:  this.extension,
                      address:      this.direccion,
                      note_private: this.nota,
                      note_public:  this.empresa,
                      statut:       this.activo ? "1" : "0",
                      country:      "Colombia",
                      country_id:   "70",
                      country_code: "CO",
                      entity:       "1",
                      roles:        {},
                      array_options:
                      {
                        "options_municipio_id": this.municipio.id
                      },
                  }
    return contacto
  }

  static async getContactoFromAPIDolibarr( contactoApi : any ) : Promise<IContacto>
  {
    let contacto              = new Contacto()

    contacto.id               = parseInt( contactoApi.id )
    contacto.terceroId        = parseInt( contactoApi.socid )
    contacto.nombres          = contactoApi.firstname
    contacto.apellidos        = contactoApi.lastname
    contacto.empresa          = contactoApi.note_public
    contacto.cargo            = contactoApi.poste
    contacto.correo           = contactoApi.email
    contacto.telefono         = contactoApi.phone_mobile
    contacto.telefono_2       = contactoApi.phone_pro
    contacto.extension        = contactoApi.phone_perso
    contacto.direccion        = contactoApi.address
    contacto.nota             = contactoApi.note_private
    contacto.fechaCreado      = getDateToApiDolibarr( contactoApi?.date_creation      ?? "" )
    contacto.fechaModificado  = getDateToApiDolibarr( contactoApi?.date_modification  ?? "" )
    contacto.activo           = Boolean(  parseInt( contactoApi.statut            ) )

    if( contactoApi.hasOwnProperty("array_options") )
    {
      if( !( Array.isArray( contactoApi.array_options ) && !contactoApi.array_options.length ) )
      {
        if(contactoApi.array_options.hasOwnProperty("options_municipio_id") && !!contactoApi.array_options.options_municipio_id )
        {
          contacto.municipio  = await getMunicipioDB( parseInt( contactoApi.array_options.options_municipio_id ) )
        }
      }
    }
    
    return contacto
  }

  static async getContactoFromAPIMaco( contactoApi : any ) : Promise<IContacto>
  {
    contactoApi.id            = +contactoApi.id
    contactoApi.tipoId        = +contactoApi.tipoId
    contactoApi.idRelacion    = +contactoApi.idRelacion
    contactoApi.municipioId   = +contactoApi.municipioId

    let contacto              = Object.assign( new Contacto(), contactoApi ) as IContacto
        contacto.activo       = true
        contacto.municipio    = await getMunicipioDB( contactoApi.municipioId )
    
    return contacto
  }

  static getTipoStringFromTipoId( id : number ) : TTipoContacto
  {
    let tipo    = TIPOS_CONTACTO.NO_ASIGNADO
    if( id    === TIPOS_CONTACTO_ID.CTZ_BILLING   ||
        id    === TIPOS_CONTACTO_ID.PED_BILLING   ||
        id    === TIPOS_CONTACTO_ID.FAC_BILLING
      )
      tipo      = TIPOS_CONTACTO.CONTABLE
    else
    if( id    === TIPOS_CONTACTO_ID.CTZ_CUSTOMER  ||
        id    === TIPOS_CONTACTO_ID.PED_CUSTOMER  ||
        id    === TIPOS_CONTACTO_ID.FAC_SERVICE
      )
      tipo      = TIPOS_CONTACTO.COMERCIAL
    else
    if( id    === TIPOS_CONTACTO_ID.CTZ_SHIPPING  ||
        id    === TIPOS_CONTACTO_ID.PED_SHIPPING  ||
        id    === TIPOS_CONTACTO_ID.FAC_SHIPPING
      )
      tipo      = TIPOS_CONTACTO.ENTREGA

      return tipo
  }

  static getTipoIdFromTipoString( tipo : string, tipoAcuerdo : TTipoAcuerdo  ) : number
  {
    let id          = 0
    if( tipoAcuerdo === TIPO_ACUERDO.COTIZACION_CLI)
    {
      id            =   tipo === TIPOS_CONTACTO.CONTABLE  ? TIPOS_CONTACTO_ID.CTZ_BILLING
                      : tipo === TIPOS_CONTACTO.COMERCIAL ? TIPOS_CONTACTO_ID.CTZ_CUSTOMER
                      : tipo === TIPOS_CONTACTO.ENTREGA   ? TIPOS_CONTACTO_ID.CTZ_SHIPPING
                      : id
    }
    else
    if( tipoAcuerdo === TIPO_ACUERDO.PEDIDO_CLI)
    {
      id            =   tipo === TIPOS_CONTACTO.CONTABLE  ? TIPOS_CONTACTO_ID.PED_BILLING
                      : tipo === TIPOS_CONTACTO.COMERCIAL ? TIPOS_CONTACTO_ID.PED_CUSTOMER
                      : tipo === TIPOS_CONTACTO.ENTREGA   ? TIPOS_CONTACTO_ID.PED_SHIPPING
                      : id
    }
    else
    if( tipoAcuerdo === TIPO_ACUERDO.FACTURA_CLI)
    {
      id            =   tipo === TIPOS_CONTACTO.CONTABLE  ? TIPOS_CONTACTO_ID.FAC_BILLING
                      : tipo === TIPOS_CONTACTO.COMERCIAL ? TIPOS_CONTACTO_ID.FAC_SERVICE
                      : tipo === TIPOS_CONTACTO.ENTREGA   ? TIPOS_CONTACTO_ID.FAC_SHIPPING
                      : id
    }
    return id
  }
}