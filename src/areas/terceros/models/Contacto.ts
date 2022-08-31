import {  IMunicipio,
          Municipio         } from "src/models/Municipio"
import {  getMunicipioDB    } from "src/services/useDexie"

export const enum TIPOS_CONTACTO_ID { // llx_c_type_contact
  NO_ASIGNADO             = 0,
  CTZ_BILLING             = 40,
  CTZ_CUSTOMER            = 41,
  CTZ_SHIPPING            = 42,
}

export const enum TIPOS_CONTACTO { // llx_c_type_contact
  NO_ASIGNADO             = "",
  CTZ_BILLING             = "BILLING",
  CTZ_CUSTOMER            = "CUSTOMER",
  CTZ_SHIPPING            = "SHIPPING",
}

export interface IContacto {
    id:                   number
    idRelacion:           number
    tipo:                 TIPOS_CONTACTO_ID
    nombres:              string
    apellidos:            string
    empresa:              string // para cotizaciones
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
    nota:                 string
    activo:               boolean
    nombreCompleto:       string
    empresaYnombre:       string
    municipio:            IMunicipio
    municipioId:          number
    getContactoToAPIDolibarr: () => object
}

export class Contacto implements IContacto
{
  id:                     number
  idRelacion:             number
  tipo:                   TIPOS_CONTACTO_ID
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
    this.tipo             = 0
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
    contacto.fechaCreado      = new Date( parseInt( contactoApi.date_creation     .toString() + "000" ) )
    contacto.fechaModificado  = new Date( parseInt( contactoApi.date_modification .toString() + "000" ) )
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

  static async getContactoFromAPIMaco( contactoApi : string ) : Promise<IContacto>
  {
    let contactoJSON          = JSON.parse( contactoApi )
    contactoJSON.id           = +contactoJSON.id
    contactoJSON.idRelacion   = +contactoJSON.idRelacion
    contactoJSON.municipioId  = +contactoJSON.municipioId

    let contacto              = Object.assign( new Contacto(), contactoJSON ) as IContacto
        contacto.activo       = true
        contacto.municipio    = await getMunicipioDB( contactoJSON.municipioId )
    
    return contacto
/*     
    contacto.nombres          = contactoApi.nombres 
    contacto.apellidos        = contactoApi.apellidos
    contacto.cargo            = contactoApi.cargo 
    contacto.correo           = contactoApi.correo
    contacto.telefono         = contactoApi.telefono
    contacto.telefono_2       = contactoApi.telefono_2
    contacto.extension        = contactoApi.extension
    contacto.nota             = contactoApi.nota
    contacto.empresa          = contactoApi.empresa
    contacto.direccion        = contactoApi.direccion 
*/
  }
}

/*
  address: "Cra 29A # 27 - 59 sur"
    // civility: "Se&ntilde;ora"
    // civility_code: "MME"
    // country: "Colombia"
    // country_code: "CO"
    // country_id: "70"
  date_creation: 1521584307
  date_modification: 1639101179
  email: "ines.diaz@eurointernacional.com"
    // entity: "1"
  firstname: "Ines"
    // gender: "woman"
  id: "109"
  lastname: "Diaz"
  mail: "ines.diaz@eurointernacional.com"
note_private: ""
note_public: ""
  phone_mobile: "3174424430"
  phone_pro: "2036442"
  poste: "Nuestra Comercial"
  ref: "109"
socid: "1"
socname: "EURO INTERNACIONAL E.U."
state: "Bogotá"
state_code: "BOG"
state_id: "1083"
zip: ""
statut: "1"

roles:
1:
code: "SERVICE"
element: "FACT_"
id: "62"
label: "Factura - Contact client prestation"
source: ""
[[Prototype]]: Object
2:
code: "SHIPPING"
element: "PRO_FACT__"
id: "72"
label: "Factura de proveedor - Contact fournisseur livraison"
source: ""
[[Prototype]]: Object
3:
code: "SHIPPING"
element: "PRO_PEDI_"
id: "145"
label: "Pedir a proveedor - Contact fournisseur livraison PEDI_"
source: ""
[[Prototype]]: Object
4:
code: "BILLING"
element: "PRO_PEDI_"
id: "142"
label: "Pedir a proveedor - Contact fournisseur facturation PEDI_"
source: ""




address: "Cra 29A # 27 - 59 sur"
array_options: []
barcode_type: null
barcode_type_code: null
barcode_type_coder: null
barcode_type_label: null
birthday: ""
canvas: null
civility: "Se&ntilde;ora"
civility_code: "MME"
civility_id: null
code: null
cond_reglement: null
cond_reglement_id: null
contact: null
contact_id: null
country: "Colombia"
country_code: "CO"
country_id: "70"
date_creation: 1521584307
date_modification: 1639101179
date_validation: null
default_lang: null
email: "ines.diaz@eurointernacional.com"
entity: "1"
facebook: null
fax: ""
firstname: "Ines"
fk_account: null
fk_incoterms: null
fk_project: null
gender: "woman"
id: "109"
import_key: null
jabberid: null
label_incoterms: null
last_main_doc: null
lastname: "Diaz"
linkedObjectsIds: null
linkedin: null
location_incoterms: null
mail: "ines.diaz@eurointernacional.com"
mode_reglement_id: null
modelpdf: null
name: null
no_email: null
note_private: ""
note_public: ""
origin: null
origin_id: null
phone_mobile: "3174424430"
phone_perso: ""
phone_pro: "2036442"
photo: ""
poste: "Nuestra Comercial"
priv: "0"
ref: "109"
ref_PEDI_: null
ref_contrat: null
ref_ext: ""
ref_facturation: null
ref_propal: null
roles: {1: {…}, 2: {…}, 3: {…}, 4: {…}}
shipping_method_id: null
skype: null
socialnetworks: []
socid: "1"
socname: "EURO INTERNACIONAL E.U."
state: "Bogotá"
state_code: "BOG"
state_id: "1083"
statut: "1"
town: ""
twitter: null
user: null
user_id: null
user_login: null
zip: ""


  */


/*                    address: "Cra 29A # 27 - 59 sur",
                      birthday: "",
                      civility: "Se&ntilde;ora",
                      civility_code: "MME",
                      country: "Colombia",
                      country_code: "CO",
                      country_id: "70",
                      email: "ines.diaz@eurointernacional.com",
                      entity: "1",
                      fax: "",
                      firstname: "Ines",
                      gender: "woman",
                      id: "109",
                      lastname: "Diaz",
                      mail: "ines.diaz@eurointernacional.com",
                      note_private: "",
                      note_public: "",
                      phone_mobile: "3174424430",
                      phone_perso: "",
                      phone_pro: "6012036442",
                      photo: "",
                      poste: "Nuestra Comercial",
                      priv: "0",
                      ref: "109",
                      ref_ext: "",
                      socid: "1",
                      socname: "EURO INTERNACIONAL E.U.",
                      state: "Bogotá",
                      state_code: "BOG",
                      state_id: "1083",
                      statut: "1",

                      barcode_type: null,
                      barcode_type_code: null,
                      barcode_type_coder: null,
                      barcode_type_label: null,
                      canvas: null,
                      civility_id: null,
                      code: null,
                      cond_reglement: null,
                      cond_reglement_id: null,
                      contact: null,
                      contact_id: null,
                      date_validation: null,
                      default_lang: null,
                      facebook: null,
                      fk_account: null,
                      fk_incoterms: null,
                      fk_project: null,
                      import_key: null,
                      jabberid: null,
                      label_incoterms: null,
                      last_main_doc: null,
                      linkedObjectsIds: null,
                      linkedin: null,
                      location_incoterms: null,
                      mode_reglement_id: null,
                      modelpdf: null,
                      name: null,
                      no_email: null,
                      origin: null,
                      origin_id: null,
                      ref_PEDI_: null,
                      ref_contrat: null,
                      ref_facturation: null,
                      ref_propal: null,
                      shipping_method_id: null,
                      skype: null,
                      twitter: null,
                      user: null,
                      user_id: null,
                      user_login: null,
                      array_options:          [],
                      socialnetworks: [],
                      */



/*

export const enum TIPOS_CONTACTO_ID { // llx_c_type_contact
  NO_ASIGNADO             = 0,
  CTZ_BILLING             = 40,
  CTZ_CUSTOMER            = 41,
  CTZ_SHIPPING            = 42,
	FACT_SALESREPFOLL       = 50,
	FACT_BILLING            = 60,
	FACT_SHIPPING           = 61,
	FACT_SERVICE            = 62,
	PRO_FACT_SALESREPFOLL   = 70,
	PRO_FACT_BILLING        = 71,
	PRO_FACT_SHIPPING       = 72,
	PRO_FACT_SERVICE        = 73,
	AGE_ACTOR_INTER         = 80,
	AGE_GUEST_INTER         = 81,
	AGE_ACTOR_EXTER         = 85,
	AGE_GUEST_EXTER         = 86,
	PEDI_SALESREPFOLL       = 91,
	PEDI_BILLING            = 100,
	PEDI_CUSTOMER           = 101,
	PEDI_SHIPPING           = 102,
	PRO_PEDI_SALESREPFOLL   = 140,
	PRO_PEDI_SHIPPING_INTER = 141,
	PRO_PEDI_BILLING        = 142,
	PRO_PEDI_CUSTOMER       = 143,
	PRO_PEDI_SHIPPING_EXTER = 145,
}

export const enum TIPOS_CONTACTO { // llx_c_type_contact
  NO_ASIGNADO             = "",
  CTZ_BILLING             = "BILLING",
  CTZ_CUSTOMER            = "CUSTOMER",
  CTZ_SHIPPING            = "SHIPPING",
	FACT_SALESREPFOLL       = "SALESREPFOLL",
	FACT_BILLING            = "BILLING",
	FACT_SHIPPING           = "SHIPPING",
	FACT_SERVICE            = "SERVICE",
	PRO_FACT_SALESREPFOLL   = "SALESREPFOLL",
	PRO_FACT_BILLING        = "BILLING",
	PRO_FACT_SHIPPING       = "SHIPPING",
	PRO_FACT_SERVICE        = "SERVICE",
	AGE_ACTOR_INTER         = "ACTOR",
	AGE_GUEST_INTER         = "GUEST",
	AGE_ACTOR_EXTER         = "ACTOR",
	AGE_GUEST_EXTER         = "GUEST",
	PEDI_SALESREPFOLL       = "SALESREPFOLL",
	PEDI_BILLING            = "BILLING",
	PEDI_CUSTOMER           = "CUSTOMER",
	PEDI_SHIPPING           = "SHIPPING",
	PRO_PEDI_SALESREPFOLL   = "SALESREPFOLL",
	PRO_PEDI_SHIPPING_INTER = "SHIPPING",
	PRO_PEDI_BILLING        = "BILLING",
	PRO_PEDI_CUSTOMER       = "CUSTOMER",
	PRO_PEDI_SHIPPING_EXTER = "SHIPPING",
}
*/                      