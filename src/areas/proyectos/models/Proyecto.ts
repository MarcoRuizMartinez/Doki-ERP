import {  TModulosDolibarr                  } from "src/composables/UtilFiles"
import {  ITercero,         Tercero         } from "src/areas/terceros/models/Tercero"
import {  IUsuario,         Usuario         } from "src/areas/usuarios/models/Usuario"
import {  ToolDate                          } from "src/composables/useTools"

export enum ESTADO_PROYECTO
{
  NO_GUARDADO                 = -1,
  BORRADOR                    = 0,
  ACTIVO                      = 1,
  CERRADO                     = 2,
}

export interface IProyecto
{
  id                          : number
  value                       : number
  ref                         : string
  titulo                      : string
  label                       : string
  ruta                        : string  
  modulo                      : TModulosDolibarr
  esNuevo                     : boolean  
  refCorta                    : string
  urlDolibarr                 : string    
  terceroId                   : number
  tercero                     : ITercero
  fechaCreacion               : Date
  fechaCreacionCorta          : string
  fechaValidacion             : Date
  fechaValidacionCorta        : string
  fechaCierre                 : Date
  fechaCierreCorta            : string
  fechaEntrega                : Date
  fechaEntregaCorta           : string

  comercialId                 : number
  comercial                   : IUsuario
  creadorId                   : number
  creador                     : IUsuario

  estado                      : number
  estadoIcono                 : string
  estadoColor                 : string
  estadoLabel                 : string

  notaPrivada                 : string
  notaPublica                 : string
}

export class Proyecto implements IProyecto
{
  id                          : number
  ref                         : string
  titulo                      : string  
  ruta                        : string  
  modulo                      : TModulosDolibarr
  esNuevo                     : boolean  
  refCorta                    : string
  terceroId                   : number
  tercero                     : ITercero

  fechaCreacion               : Date
  fechaValidacion             : Date
  fechaCierre                 : Date
  fechaEntrega                : Date

  comercialId                 : number
  comercial                   : IUsuario
  creadorId                   : number
  creador                     : IUsuario

  estado                      : number
  estadoIcono                 : string
  estadoColor                 : string
  estadoLabel                 : string

  notaPrivada                 : string
  notaPublica                 : string
  descripcion                 : string
  
  constructor( terceroId : number = 0 )
  {
    this.id                   = 0
    this.ref                  = ""
    this.titulo               = ""
    this.ruta                 = ""
    this.modulo               = "project"
    this.esNuevo              = true  
    this.refCorta             = ""
    this.terceroId            = terceroId
    this.tercero              = new Tercero()
    this.fechaCreacion        = new Date()
    this.fechaValidacion      = new Date()
    this.fechaCierre          = new Date(0)
    this.fechaEntrega         = new Date(0)

    this.comercialId          = 0
    this.comercial            = new Usuario()
    this.creadorId            = 0
    this.creador              = new Usuario()

    this.estado               = ESTADO_PROYECTO.NO_GUARDADO
    this.estadoIcono          = ""
    this.estadoColor          = ""
    this.estadoLabel          = ""

    this.notaPrivada          = ""
    this.notaPublica          = ""
    this.descripcion          = ""

  }
  string: any

  get value()                 : number { return this.id }
  get label()                 : string { return this.titulo }
  get fechaCreacionCorta()    : string { return ToolDate.fechaCorta( this.fechaCreacion    ) }
  get fechaValidacionCorta()  : string { return ToolDate.fechaCorta( this.fechaValidacion  ) }
  get fechaCierreCorta()      : string { return ToolDate.fechaCorta( this.fechaCierre      ) }
  get fechaEntregaCorta()     : string { return ToolDate.fechaCorta( this.fechaEntrega     ) }
  get urlDolibarr()           : string { return `${process.env.URL_DOLIBARR}/projet/card.php?id=${this.id}` }

  // * ///////////////////////////////////////////////////// static convertir data de API en new Cotizacion
  static convertirDataApiToProyecto( proApi : any ) : IProyecto
  {
    proApi.id                   = +proApi.id

    proApi.socid                = +proApi.socid
    proApi.terceroId            = proApi.socid

    proApi.statut               = +proApi.statut
    proApi.estado               = proApi.statut

    proApi.user_author_id       = +proApi.user_author_id
    proApi.creadorId            = proApi.user_author_id
    
    proApi.titulo               = proApi.title        ?? ""
    proApi.descripcion          = proApi.description  ?? ""

    proApi.note_public          = proApi.note_public  ?? ""
    proApi.note_private         = proApi.note_private ?? ""
    proApi.notaPrivada          = proApi.note_public
    proApi.notaPublica          = proApi.note_private

    const proy                  = Object.assign( new Proyecto(), proApi ) as IProyecto
    return proy
  }
}

/*


[
  {
    "description": "",
    "title": "Archivo Rodante KUEHNE",
    "date_start": 1664859600,
    "datee": null,
    "socid": "5989",
    "user_author_id": "23",
    "public": "0",
    "usage_opportunity": 1,
    "usage_task": 1,
    "statut": "1",
    "date_c": 1664914670,
    "date_m": 1664914684,
    "id": "58",    
    "ref": "PJ2210-0003",
    "status": "1", 
  }
]

[
  {
    "table_element_date": null,
    "description": "",
    "title": "Archivo Rodante KUEHNE",
    "dateo": null,
    "date_start": 1664859600,
    "datee": null,
    "date_end": "",
    "date_close": "",
    "socid": "5989",
    "thirdparty_name": null,
    "user_author_id": "23",
    "fk_user_close": null,
    "user_close_id": null,
    "public": "0",
    "budget_amount": null,
    "usage_opportunity": 1,
    "usage_task": 1,
    "usage_bill_time": 0,
    "usage_organize_event": 0,
    "accept_conference_suggestions": 0,
    "accept_booth_suggestions": 0,
    "price_registration": null,
    "price_booth": null,
    "max_attendees": null,
    "statut": "1",
    "opp_status": null,
    "fk_opp_status": null,
    "opp_percent": null,
    "email_msgid": null,
    "weekWorkLoadPerTask": null,
    "date_c": 1664914670,
    "date_m": 1664914684,
    "lines": null,
    "id": "58",
    "entity": "1",
    "validateFieldsErrors": [],
    "import_key": null,
    "array_options": [],
    "array_languages": null,
    "contacts_ids": null,
    "linked_objects": null,
    "linkedObjectsIds": null,
    "linkedObjectsFullLoaded": [],
    "canvas": null,
    "fk_project": null,
    "fk_projet": null,
    "contact_id": null,
    "user": null,
    "origin": null,
    "origin_id": null,
    "ref": "PJ2210-0003",
    "ref_ext": null,
    "status": "1",
    "state_id": null,
    "region_id": null,
    "demand_reason_id": null,
    "transport_mode_id": null,
    "model_pdf": null,
    "last_main_doc": null,
    "fk_bank": null,
    "note_public": null,
    "note_private": null,
    "date_creation": null,
    "date_validation": null,
    "date_modification": null,
    "date_cloture": null,
    "user_author": null,
    "user_creation": null,
    "user_creation_id": null,
    "user_valid": null,
    "user_validation": null,
    "user_validation_id": null,
    "user_closing_id": null,
    "user_modification": null,
    "user_modification_id": null,
    "specimen": 0,
    "opp_amount": null
  }
]
*/