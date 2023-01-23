import {  ILineaAcuerdo,
          LineaAcuerdo    } from "src/areas/acuerdos/models/LineaAcuerdo"

export interface IReglasComision
{
  id                        : number
	nombre                    : string
  descripcion               : string
	comision_alfa             : number
	comision_a                : number
	comision_b                : number
	comision_c                : number
	comision_d                : number
	comision_e                : number
	nivel_alfa                : number
	nivel_a                   : number
	nivel_b                   : number
	nivel_c                   : number
	nivel_d                   : number
	nivel_e                   : number

  label                     : string
  value                     : number

  lineas                    : ILineaAcuerdo[]
}

export class ReglasComision implements IReglasComision
{
  id                        : number
	nombre                    : string
  descripcion               : string
	comision_alfa             : number
	comision_a                : number
	comision_b                : number
	comision_c                : number
	comision_d                : number
	comision_e                : number
	nivel_alfa                : number
	nivel_a                   : number
	nivel_b                   : number
	nivel_c                   : number
	nivel_d                   : number
	nivel_e                   : number
  lineas                    : ILineaAcuerdo[]

  constructor()
  {
    this.id                 = 0
    this.nombre             = ""
    this.descripcion        = ""
    this.comision_alfa      = 0
    this.comision_a         = 0
    this.comision_b         = 0
    this.comision_c         = 0
    this.comision_d         = 0
    this.comision_e         = 0
    this.nivel_alfa         = 0
    this.nivel_a            = 0
    this.nivel_b            = 0
    this.nivel_c            = 0
    this.nivel_d            = 0
    this.nivel_e            = 0
    this.lineas             = []
  }

  get label()       : string  { return this.nombre }
  get value()       : number  { return this.id }
}
