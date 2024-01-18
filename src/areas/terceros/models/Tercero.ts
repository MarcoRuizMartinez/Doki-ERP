import {  IContacto         } from "./Contacto"
import {  IDocumento,
          Documento,
                            } from "./DocumentoId"
import {  IMunicipio,
          Municipio
                            } from "src/models/Municipio"
import {  IUsuario          } from "src/areas/usuarios/models/Usuario"
import {  Format            } from "src/composables/useTools"
import {  TIPOS_DOCUMENTO   } from "./TiposDocumento"
import {  AREA              } from "src/models/TiposVarios"
import {  IAccion           } from "src/areas/comunicacion/models/Accion"
import {  getMunicipioDB,
          getTipoDocumentoDB,
          getUsuariosDB
                            } from "src/composables/useDexie"

export interface ITercero
{
  id:                       number                  // rowid
  nombre:                   string                  // nom
  contactos:                IContacto[]             // Tabla llx_socpeople
  area:                     AREA
  areaNombre:               string
  alias:                    string                  // name_alias
  documento:                IDocumento,
  numeroDocumento:          string
  direccion:                string                  // address
  correo:                   string                  // email
  telefono:                 string                  // phone
  url:                      string                  // url
  logo:                     string                  // logo
  ulrFoto:                  string
  activo:                   boolean                 // status
  esCliente:                boolean                 // client
  esProveedor:              boolean                 // fournisseur
  aplicaIVA:                boolean                 // tva_assuj
  codigoProveedor:          string                  // code_fournisseur
  municipio:                IMunicipio
  ciudad:                   string
  pais:                     string                  // fk_pays
  responsables:             IUsuario[]
  responsablesLista:        string
  color:                    string
  favorito:                 boolean
  //getFormDataAPIDolibarr:   FormData
  responsablesIDS:          string
  fechaCreado:              string
  fechaCreadoCorta:         string
  idTipoDocumento:          number
  municipioId:              number
  esEmpresa:                boolean
  tiposTerceros:            string
  notaPublica:              string                  // note_public
  notaPrivada:              string                  // note_private
  esTerceroCtz:             boolean
  esFamoso:                 boolean
  comentarios:              IAccion[]
  getTerceroToAPIDolibarr: () => any
}

export class Tercero implements ITercero
{
  id:                       number      
  nombre:                   string                  
  contactos:                IContacto[]
  area:                     AREA  
  alias:                    string
  documento:                IDocumento
  direccion:                string
  correo:                   string                  
  telefono:                 string      
  url:                      string
  logo:                     string                  
  activo:                   boolean                 
  esCliente:                boolean                 
  esProveedor:              boolean                 
  aplicaIVA:                boolean                 
  codigoProveedor:          string                  
  municipio:                IMunicipio
  pais:                     string
  responsables:             IUsuario[]
  color:                    string
  favorito:                 boolean
  fechaCreado:              string
  idTipoDocumento:          number
  municipioId:              number
  notaPublica:              string
  notaPrivada:              string
  esFamoso:                 boolean
  comentarios               : IAccion[]   = []

  constructor()
  {
    this.id                 = 0
    this.nombre             = ""
    this.contactos          = []
    this.area               = AREA.NULO
    this.alias              = ""
    this.documento          = new Documento()
    this.direccion          = ""
    this.correo             = ""
    this.telefono           = ""       
    this.url                = ""
    this.logo               = ""       
    this.activo             = true
    this.esCliente          = false
    this.esProveedor        = false
    this.aplicaIVA          = true
    this.codigoProveedor    = ""
    this.municipio          = new Municipio()
    this.pais               = "70" // Colombia // llx_c_regions 7001 // llx_c_departements.fk_region 
    this.responsables       = []
    this.color              = "#FFF"
    this.favorito           = false
    this.fechaCreado        = ""
    this.idTipoDocumento    = 0
    this.municipioId        = 0
    this.notaPublica        = ""
    this.notaPrivada        = ""
    this.esFamoso           = false
  }
  

  get esEmpresa():boolean  {
    return this.documento.tipo.value === TIPOS_DOCUMENTO.NIT
  }

  get responsablesIDS() : string {
    return this.responsables.map(u => u.id).join(",").toString()
  }

  get areaNombre() : string {
    let nombre    = ""
          if(this.area == AREA.MUBLEX) nombre  = "Mublex"
    else  if(this.area == AREA.ESCOM)  nombre  = "Escom"
    else  if(this.area == AREA.GLOBAL) nombre  = "Global"
    
    return nombre
  }

  get fechaCreadoCorta():string {
    return !!this.fechaCreado ? this.fechaCreado.slice(0,10) : ""
  }

  get responsablesLista():string {
    return this.responsables.map( r => r.nombre ).join(", ")
  }

  get ciudad():string {
    return this.municipio.label
  }

  get numeroDocumento():string {

    let documento     = this.documento.numero

    if(!!this.documento.numero)
    {
      if(this.documento.esNumero)
        documento     = Format.milesInt.format( parseInt( this.documento.numero ) )

      if(this.esEmpresa && !!this.documento.digito)
        documento     += "-" + this.documento.digito
    }

    return documento
  }

  get tiposTerceros():string {
    let tipos             = ""

    if(this.esProveedor   && !this.esCliente)
      tipos               = "Proveedor"
    else
    if(!this.esProveedor  && this.esCliente)
      tipos               = "Cliente"
    else
    if(this.esProveedor   && this.esCliente)
      tipos               = "Proveedor y Cliente"

    return tipos
  }

  get ulrFoto():string {
    return !this.logo ? "" : process.env.URL_DOLIBARR + "/documents/societe/" + this.id + "/logos/" + this.logo
  }

  get esTerceroCtz() : boolean{
    return this.responsables.some( r => +r.terceroIdCtz === this.id ) 
  }

  getTerceroToAPIDolibarr( ) : any
  {
    let tercero   = {
                      name:                   this.nombre,
                      name_alias:             this.alias,
                      address:                this.direccion,
                      phone:                  this.telefono,
                      email:                  this.correo,
                      idprof1:                this.documento.numero,
                      idprof2:                this.documento.digito,
                      client:                 this.esCliente    ? 1 : 0,
                      fournisseur:            this.esProveedor  ? 1 : 0,
                      tva_assuj:              this.aplicaIVA    ? 1 : 0,
                      code_fournisseur:       this.codigoProveedor,
                      //code_compta_fournisseur:this.codigoProveedor,
                      typent_id:              this.documento.tipo.id,
                      typent_code:            parseInt( this.documento.tipo.codigo ),
                      town:                   this.municipio.municipio,
                      state_id:               this.municipio.departamentoId,
                      state_code:             this.municipio.departamentoSigla,
                      state:                  this.municipio.departamento,
                      country:                "Colombia",
                      country_id:             this.pais,
                      country_code:           "CO",               
                      array_options:
                      {
                        "options_depart":       this.area.toString(),
                        "options_favorito":     (this.favorito ? 1 : 0).toString(),
                        "options_es_famoso":    (this.esFamoso ? 1 : 0).toString(),
                        "options_color":        this.color,
                        "options_provmin":      "0",
                        "options_datosok":      "1",
                        "options_municipio_id": this.municipio.id,
                      },
                      entity:                 "1",
                      status:                 "1",//this.activo ? 1 : 0,                      
                  }

    return tercero
  }


  static async convertirDataApiATercero( terceroApi : any ) : Promise< ITercero >
  {
    if(typeof terceroApi      === "string")
    {
      terceroApi              = JSON.parse( terceroApi )
    }

    terceroApi.id             = +terceroApi.id
    terceroApi.pais           = +terceroApi.pais
    terceroApi.idTipoDocumento= +terceroApi.idTipoDocumento
    terceroApi.municipioId    = +terceroApi.municipioId
    terceroApi.activo         = Boolean( +terceroApi.activo )
    terceroApi.esCliente      = Boolean( +terceroApi.esCliente )
    terceroApi.esProveedor    = Boolean( +terceroApi.esProveedor )
    terceroApi.aplicaIVA      = Boolean( +terceroApi.aplicaIVA )
    terceroApi.favorito       = Boolean( +terceroApi.favorito )
    terceroApi.esFamoso       = Boolean( +terceroApi.esFamoso )
    terceroApi.color          = terceroApi.color.includes("#FFF") ? "" : terceroApi.color
    
    if(terceroApi.municipioId > 0)
      terceroApi.municipio    = await getMunicipioDB( terceroApi.municipioId )
  
    if(!!terceroApi.documento)
    {
      let doc                 = Object.assign( new Documento(), JSON.parse( terceroApi.documento ) ) as IDocumento
          doc.tipo            = await getTipoDocumentoDB( terceroApi.idTipoDocumento )
      terceroApi.documento    = doc
    }
  
    if( !!terceroApi.responsables && !terceroApi.responsables.includes("null") )
    {
      let ids                 = JSON.parse( terceroApi.responsables ).map( ( u:any ) => u.id )
      if(Array.isArray(ids) && !!ids[0])
        terceroApi.responsables = await getUsuariosDB( ids )
    }
    else
      terceroApi.responsables   = []  
  
    let tercero : ITercero    = Object.assign( new Tercero(), terceroApi )    
    return tercero
  }
}

/* 

new Vue({
  el: '#app',
  delimiters: ['${', '}'], // Avoid Twig conflicts
  data: {
    filelist: [] // Store our uploaded files
  },
  methods: {
    onChange() {
      this.filelist = [...this.$refs.file.files];
    },
    remove(i) {
      this.filelist.splice(i, 1);
    },
    dragover(event) {
      event.preventDefault();
      // Add some visual fluff to show the user can drop its files
      if (!event.currentTarget.classList.contains('bg-green-300')) {
        event.currentTarget.classList.remove('bg-gray-100');
        event.currentTarget.classList.add('bg-green-300');
      }
    },
    dragleave(event) {
      // Clean up
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    drop(event) {
      event.preventDefault();
      this.$refs.file.files = event.dataTransfer.files;
      this.onChange(); // Trigger the onChange event manually
      // Clean up
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    }
  }
}); */