import {  getMilisecShortForApiDolibarr } from "src/useSimpleOk/useTools"
export interface IComentario
{
  id                        : number  // 
  codigo                    : string  // AC_OTH
  creacion                  : Date
  creadorId                 : number
  modificado                : Date
  modificoId                : number
  asignadoId                : number
  terceroId                 : number
  progreso                  : number  
  label                     : string
  value                     : string
  elementoId                : number 
  tipo                      : string // order
  commentToApi              : any
}

export class Comentario implements IComentario
{
  id                        : number  = 0
  codigo                    : string  = "AC_OTH"
  creacion                  : Date    = new Date()
  creadorId                 : number  = 0
  modificado                : Date    = new Date()
  modificoId                : number  = 0
  asignadoId                : number  = 0
  terceroId                 : number  = 0
  progreso                  : number  = -1  
  label                     : string  = ""
  value                     : string  = ""
  elementoId                : number  = 0
  tipo                      : string  = ""

  constructor()
  {
  }

  get commentToApi() : any {
    return {
      type_code:    this.codigo,
      label:        this.label,
      note_private: this.value,
      socid:        this.terceroId,
      fk_element:   this.elementoId,
      elementtype:  this.tipo,
      fulldayevent: "0",
      percentage:   this.progreso, 
      userownerid:  this.asignadoId,
      datep:        getMilisecShortForApiDolibarr( new Date() )
    }
  }

/*
  1687302240
  1687374800
*/  
}