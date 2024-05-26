import {  IUsuario,
          Usuario         } from "src/areas/usuarios/models/Usuario"

import {  ToolDate,
          ToolType,       } from "src/composables/useTools"  
import {  getUsuarioDB    } from "src/composables/useDexie"

export type TAccion        = "crear" | "editar" | "restaurar" | ""
export interface IVistaAG   
{ 
  id                : number
  accion            : TAccion
  value             : number
  orden             : number
  creador           : IUsuario
  fechaCreacion     : Date
  editor            : IUsuario
  fechaEdicion      : Date
  vista             : any
  ref               : string
  icon              : string
  label             : string
  vistaApi          : any
}

export class VistaAG implements IVistaAG
{
  id                : number    = 0
  accion            : TAccion
  vista             : any       = ""
  label             : string    = ""
  ref               : string    = ""
  icon              : string    = ""
  orden             : number    = 0
  creador           : IUsuario  = new Usuario()
  fechaCreacion     : Date      = new Date(0)
  editor            : IUsuario  = new Usuario()
  fechaEdicion      : Date      = new Date(0)
  get value()       : number { return this.id }
  get vistaApi()    : any 
  {
    const data = {
      id            : this.id,
      creador       : this.creador.id,
      vista         : JSON.stringify( this.vista ),
      label         : this.label,
      ref           : this.ref,
      icon          : this.icon,
    }
    
    return data
  }

  constructor( accion : TAccion = ""){
    this.accion                 = accion
  }



 // * ////////////////////////////////////////////////////////////////////////// Get new LineaAcuerdo data de API
 static async getVistasFromAPI( dataAPI : any[] ) : Promise< IVistaAG[] >
 {
    const vistas : IVistaAG[]   = []

    if( !Array.isArray( dataAPI ) ) return []
    
    for (const pp of dataAPI)
    {
      const pro                 = await VistaAG.getVistaFromAPI( pp )
      vistas.push( pro )
    }
    return vistas
 }

 // * ////////////////////////////////////////////////////////////////////////// Get new LineaAcuerdo data de API
 static async getVistaFromAPI( vistaApi : any ) : Promise< IVistaAG >
 {
    if(!vistaApi) return new VistaAG()

    const vApi                  = vistaApi
    vApi.id                     = ToolType.keyNumberValido  ( vApi, "id"    )
    vApi.orden                  = ToolType.keyNumberValido  ( vApi, "sort"  )
    vApi.vista                  = ToolType.keyStringValido  ( vApi, "vista" )

    vApi.fechaCreacion          = ToolDate.getDateToStr( ToolType.keyStringValido( vApi, "created_on"  ) )  
    vApi.fechaEdicion           = ToolDate.getDateToStr( ToolType.keyStringValido( vApi, "modified_on"   ) )     

    const vista                 = Object.assign( new VistaAG(), vApi ) as IVistaAG
    vista.vista                 = JSON.parse( vApi.vista )
    vista.creador               = await getUsuarioDB( ToolType.keyNumberValido( vApi, "owner" ) )
    vista.editor                = await getUsuarioDB( ToolType.keyNumberValido( vApi, "modified_by" ) )
    
    return vista
 }
}


export enum VISTAS_AG
{
  PRODUCTOS_PROVEEDORES         = "AGProProvee"
}
