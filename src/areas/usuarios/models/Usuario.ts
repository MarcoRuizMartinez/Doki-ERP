import {  TIPO_USUARIO,
          AREA,
          GRUPO_USUARIO
                            } from "src/models/TiposVarios"

const fotoDefault = process.env.URL_DOLIBARR + "/_maco/img/user.png"

export interface IUsuario {
    id:                 number
    terceroIdCtz:       number
    nombre:             string
    apellido:           string
    foto:               string
    puesto:             string
    usuario:            string
    cedula:             string
    urlFoto:            string
    fotoPerfilMini:     string
    fotoPerfilMedia:    string
    fotoPerfilBig:      string
    cel:                string
    correo:             string
    area:               AREA
    tipo:               TIPO_USUARIO
    estado:             string
    activo:             boolean
    label:              string
    value:              number
    nombreCompleto:     string
    permisos:           string // Permisos un array crudo con los permisos
    gruposString:       string
    grupos:             string[]
    esComercial:        boolean
    esProduccion:       boolean
    esDev:              boolean
    areaEsEscom:        boolean
    areaEsMublex:       boolean
    areaEsGlobal:       boolean
}

export class Usuario implements IUsuario
{
  id:             number
  terceroIdCtz:   number
  nombre:         string
  apellido:       string
  foto:           string
  puesto:         string
  usuario:        string
  cedula:         string
  cel:            string
  correo:         string
  estado:         string
  area:           AREA
  tipo:           TIPO_USUARIO
  permisos:       string
  gruposString:   string

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
      this.gruposString       = ""
      this.cel                = ""
      this.correo             = ""

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
        this.gruposString     = usuario.gruposString
        this.cel              = usuario.cel
        this.correo           = usuario.correo
      }
  }
    get grupos() : string[] { return !!this.gruposString ? this.gruposString.split(',') : [] }
    get activo() : boolean { return Boolean( +this.estado  ) }

    get urlFoto() :string { return process.env.URL_DOLIBARR + "/documents/users/" + this.id }

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

    get esComercial ():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.COMERCIALES ) : false }
    get esProduccion():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.PRODUCCION  ) : false }
    get esDev       ():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.DESARROLLO  ) : false }
    get areaEsEscom ():boolean { return this.area === AREA.ESCOM  }
    get areaEsMublex():boolean { return this.area === AREA.MUBLEX }
    get areaEsGlobal():boolean { return this.area === AREA.GLOBAL }
}
