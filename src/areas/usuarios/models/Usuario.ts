import {  TIPO_USUARIO,
          AREA,
          GRUPO_USUARIO
                            } from "src/models/TiposVarios"
import {  IReglaComision,
          ReglaComision     } from "src/models/Diccionarios/ReglasComision"
import {  ToolType          } from "src/composables/useTools"

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
  urlFoto           : string          // get
  fotoPerfilMini    : string          // get
  fotoPerfilMedia   : string          // get
  fotoPerfilBig     : string          // get
  cel               : string
  correo            : string
  area              : AREA
  tipo              : TIPO_USUARIO
  estado            : string
  activo            : boolean         // get
  label             : string          // get
  value             : number          // get
  nombreApellido    : string          // get
  nombreCompleto    : string          // get
  permisos          : string // Permisos un array crudo con los permisos
  color             : string          // get
  gruposString      : string
  gruposIds         : string
  grupos            : string[]        // get
  esComercial       : boolean         // get
  esProduccion      : boolean         // get
  esProducto        : boolean         // get
  esGerencia        : boolean         // get
  esContable        : boolean         // get
  esDev             : boolean         // get
  areaEsEscom       : boolean         // get
  areaEsMublex      : boolean         // get
  areaEsGlobal      : boolean         // get
  reglaComisionId   : number
  comision          : IReglaComision
  wooKey            : string
  wooSecret         : string
  wooToken          : string          // get
  tercero_id        : number          // Si es un usuario externo, debe tener asociado un tercero
  externo           : boolean         // get
}

export class Usuario implements IUsuario
{
  id                : number          = -1
  terceroIdCtz      : number          = 0
  nombre            : string          = ""
  apellido          : string          = ""
  foto              : string          = ""
  puesto            : string          = ""
  usuario           : string          = ""
  cedula            : string          = ""
  cel               : string          = ""
  correo            : string          = ""
  estado            : string          = "0"
  area              : AREA            = AREA.NULO
  tipo              : TIPO_USUARIO    = TIPO_USUARIO.NULO
  permisos          : string          = ""
  _color            : string          = ""  
  //color              = "#FFF"
  gruposString      : string          = ""
  gruposIds         : string          = ""
  reglaComisionId   : number          = 0
  comision          : IReglaComision  = new ReglaComision()
  wooKey            : string          = ""
  wooSecret         : string          = ""
  tercero_id        : number          = 0

  get externo() : boolean   { return !!this.tercero_id }
  get grupos()  : string[]  { return !!this.gruposString ? this.gruposString.split(',') : [] }
  get activo()  : boolean   { return Boolean( +this.estado  ) }
  get urlFoto() : string    { return process.env.URL_DOLIBARR + "/documents/users/" + this.id }
  get color()   : string    { return this._color }
  get wooToken(): string    { return  !!this.wooKey && !!this.wooSecret
                                      ? 'Basic ' + btoa( this.wooKey + ":" + this.wooSecret )
                                      : ''
                            }

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
  get nombreApellido():string     {
    const nombres   = this.nombre.split(" ")
    const apellidos = this.apellido.split(" ")
    return nombres[0] + " " + apellidos[0]
  }

  get esComercial   ():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.COMERCIALES  ) : false }
  get esProduccion  ():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.PRODUCCION   ) : false }
  get esGerencia    ():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.GERENCIA     ) : false }
  get esContable    ():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.CONTABLE     ) : false }
  get esProducto    ():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.PRODUCTOS    ) : false }

  get esDev       ():boolean { return this.grupos.length > 0 ? this.grupos.some( g => g == GRUPO_USUARIO.DESARROLLO  ) : false }
  get areaEsEscom ():boolean { return this.area === AREA.ESCOM  }
  get areaEsMublex():boolean { return this.area === AREA.MUBLEX }
  get areaEsGlobal():boolean { return this.area === AREA.GLOBAL }


  static getUsuarioFromApi( userApi : any ) : IUsuario
  {
    const user            = Object.assign( new Usuario(), userApi ) as IUsuario

    user.id               = ToolType.keyNumberValido( userApi, "id")                
    user.terceroIdCtz     = ToolType.keyNumberValido( userApi, "terceroIdCtz")      
    user.reglaComisionId  = ToolType.keyNumberValido( userApi, "reglaComisionId")
    user.tercero_id       = ToolType.keyNumberValido( userApi, "tercero_id")
    //user.comision         =  new ReglaComision()

    return user
  }
}
