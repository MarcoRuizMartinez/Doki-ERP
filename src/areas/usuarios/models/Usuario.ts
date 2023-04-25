import {  TIPO_USUARIO,
          AREA,
          GRUPO_USUARIO
                            } from "src/models/TiposVarios"
import {  IReglaComision,
          ReglaComision    } from "src/models/Diccionarios/ReglasComision"

const fotoDefault = process.env.URL_DOLIBARR + "/_maco/img/user.png"

export interface IUsuario {
  id                : number
  terceroIdCtz      : number
  nombre            : string
  apellido          : string
  foto              : string
  puesto            : string
  usuario           : string
  cedula            : string
  urlFoto           : string
  fotoPerfilMini    : string
  fotoPerfilMedia   : string
  fotoPerfilBig     : string
  cel               : string
  correo            : string
  area              : AREA
  tipo              : TIPO_USUARIO
  estado            : string
  activo            : boolean
  label             : string
  value             : number
  nombreCompleto    : string
  permisos          : string // Permisos un array crudo con los permisos
  color             : string
  gruposString      : string
  grupos            : string[]
  esComercial       : boolean
  esProduccion      : boolean
  esGerencia        : boolean
  esContable        : boolean
  esDev             : boolean
  areaEsEscom       : boolean
  areaEsMublex      : boolean
  areaEsGlobal      : boolean
  reglaComisionId   : number
  comision          : IReglaComision
}

export class Usuario implements IUsuario
{
  id                : number
  terceroIdCtz      : number
  nombre            : string
  apellido          : string
  foto              : string
  puesto            : string
  usuario           : string
  cedula            : string
  cel               : string
  correo            : string
  estado            : string
  area              : AREA
  tipo              : TIPO_USUARIO
  permisos          : string
  _color            : string  
  gruposString      : string
  reglaComisionId   : number
  comision          : IReglaComision

  constructor( usuario? : IUsuario )
  {
      this.id                 = -1
      this.terceroIdCtz       = 0
      this.usuario            = ""
      this.nombre             = ""
      this.apellido           = ""
      this.puesto             = ""
      this.foto               = ""
      this.area               = AREA.NULO
      this.tipo               = TIPO_USUARIO.NULO
      this.cedula             = ""
      this.estado             = "0"
      this.permisos           = ""
      this._color             = ""
      //this.color              = "#FFF"
      this.gruposString       = ""
      this.cel                = ""
      this.correo             = ""
      this.reglaComisionId    = 0
      this.comision           = new ReglaComision()

      if(!!usuario)
      {
        this.id               = +usuario.id
        this.terceroIdCtz     = +usuario.terceroIdCtz
        this.usuario          = usuario.usuario
        this.nombre           = usuario.nombre
        this.apellido         = usuario.apellido
        this.puesto           = usuario.puesto
        this.foto             = usuario.foto ?? ""
        this.area             = usuario.area
        this.tipo             = usuario.tipo
        this.cedula           = usuario.cedula
        this.estado           = usuario.estado
        this.permisos         = usuario.permisos
        //this.color            = usuario.color
        this.gruposString     = usuario.gruposString
        this.cel              = usuario.cel
        this.correo           = usuario.correo
      }
  }
    get grupos()  : string[]  { return !!this.gruposString ? this.gruposString.split(',') : [] }
    get activo()  : boolean   { return Boolean( +this.estado  ) }
    get urlFoto() : string    { return process.env.URL_DOLIBARR + "/documents/users/" + this.id }
    get color()   : string    { return this._color }

    set color( valor : string )
    {
      if(!!valor && valor[0] === "#" && valor.length >= 4 && valor.length <= 7) // "#FF5477" o "#FF5"
        this._color = valor
      else
      if(!!valor && valor[0] != "#" && valor.length >= 3 && valor.length <= 6) // "FF5477" o "FF5"        
        this._color = "#" + valor
      else
        this._color = "#FFF"
    }

    get fotoPerfilMini() :string
    {
      let foto        = fotoDefault

      if(!!this.foto)
      {
        let extencion = this.foto.slice(this.foto.lastIndexOf('.') )
        foto          = this.urlFoto + "/photos/thumbs/" + this.foto.replace(extencion, '_mini' + extencion)
      }

      return  foto
    }

    get fotoPerfilMedia() :string
    {
      let foto        = fotoDefault
      if(!!this.foto)
      {
        let extencion = this.foto.slice(this.foto.lastIndexOf('.') )
        foto          = this.urlFoto + "/photos/thumbs/" + this.foto.replace(extencion, '_small' + extencion)
      }

      return foto
    }

    get fotoPerfilBig() :string
    {
        return  !!this.foto
                ? this.urlFoto + "/" + this.foto
                : fotoDefault
    }

    get label():string { return this.nombre }
    get value():number { return this.id }

    set label( valor : string ) { this.nombre = valor  }
    set value( valor : number ) { this.id = valor }


    get nombreCompleto():string     { return this.nombre + " " + this.apellido }

    get esComercial   ():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.COMERCIALES  ) : false }
    get esProduccion  ():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.PRODUCCION   ) : false }
    get esGerencia    ():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.GERENCIA     ) : false }
    get esContable    ():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.CONTABLE     ) : false }

    get esDev       ():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.DESARROLLO  ) : false }
    get areaEsEscom ():boolean { return this.area === AREA.ESCOM  }
    get areaEsMublex():boolean { return this.area === AREA.MUBLEX }
    get areaEsGlobal():boolean { return this.area === AREA.GLOBAL }
}
