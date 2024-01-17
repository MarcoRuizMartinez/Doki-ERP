import {  QTableProps             } from "quasar"
import {  mayusculasPrimeraLetra  } from "../composables/useTools"
import {  siNo,
          formatoPrecio,
          fechaCorta              } from "src/composables/useTools"


export interface IColumna {
  name            :  string
  label           :  string
  field           :  string  | (( row: any ) => any)
  required        ?: boolean | undefined
  align           ?: "left" | "right" | "center" | undefined
  sortable        ?: boolean | undefined
  iterable        ?: boolean
  value           :  any
  visible         ?: boolean
  format          ?: (val: any, row: QTableProps) => any
  sort            ?: ( a: any, b: any, rowA: QTableProps,  rowB: QTableProps ) => number
  style           ?: string
  classes         ?: string
  headerStyle     ?: string
  headerClasses   ?: string
  CSVvalor        ?: string
  CSVOculto       ?: boolean
}

export class Columna implements IColumna
{
  name            :  string
  label           :  string
  field           :  string  | (( row: any ) => any)
  required        ?: boolean | undefined
  align           ?: "left" | "right" | "center" | undefined
  sortable        ?: boolean | undefined
  iterable        ?: boolean
  value           :  any
  visible         ?: boolean
  format          ?: (val: any, row: QTableProps) => any
  sort            ?: ( a: any, b: any, rowA: QTableProps,  rowB: QTableProps ) => number
  style           ?: string
  classes         ?: string
  headerStyle     ?: string
  headerClasses   ?: string
  CSVvalor        ?: string
  CSVOculto       ?: boolean

  constructor({
                name          = "",
                label         = "",
                iterable      = true,
                visible       = true,
                sortable      = true,
                align         = "left",
                clase         = "",
                style         = "",
                required      = false,
                format        = ( val : any ) => val,
                CSVvalor      = "",
                CSVOculto     = false
              } = {} )
  {
    this.name             = name
    this.label            = mayusculasPrimeraLetra( !!label ? label : name )
    this.field            = name
    this.required         = required
    this.align            =   align == "left"   ? "left"
                            : align == "right"  ? "right"
                            : align == "center" ? "center"
                            : undefined
    this.sortable         = sortable
    this.iterable         = iterable
    this.value            = align
    this.visible          = visible
    this.format           = format
    this.style            = style
    this.classes          = clase
    this.headerStyle      = ""
    this.headerClasses    = ""
    this.CSVvalor         = CSVvalor
    this.CSVOculto        = CSVOculto
  }

  static ColumnaPrecio({ name = "", label = "",  sortable = true, clase = "", visible = true }) : IColumna
  {
    let col               = new Columna({ name: name, label: label, sortable: sortable, clase: clase })
        col.format        = val => formatoPrecio( val, "decimales-no" )// + "\r\n" + formatoPrecio( val *1.19, "decimales-no" )
        col.align         = "right"
        col.classes       = clase + " fuente-mono"
        col.visible       = visible

    return col
  }

  static ColumnaFecha({ name = "", label = "",  sortable = true, clase = "", visible = true }) : IColumna
  {
    let col               = new Columna({ name: name, label: label, sortable: sortable, clase: clase })
        col.format        = val => {

                                      const fecha = !!val && val instanceof Date ? val : new Date()
                                      return fechaCorta( fecha)
                                    }
        col.align         = "right"
        col.classes       = clase + " fuente-mono"
        col.visible       = visible

    return col
  }

  static ColumnaX100({ name = "", label = "",  sortable = true, clase = "", decimales = 2 }) : IColumna
  {
    let col               = new Columna({ name : name, label : label, sortable : sortable, clase: clase })
        col.format        = val => {
                                      const x100 : string =  parseFloat( val ).toFixed( decimales )
                                      return x100 + "%"
                                    }
        col.align         = "right"
        col.classes       = clase + " fuente-mono"

    return col
  }

  static ColumnaSiNo({ name = "", label = "",  sortable = true, clase = "" }) : IColumna
  {
    let col               = new Columna({ name : name, label : label, sortable : sortable, clase: clase })
        col.format        = ( val : boolean ) => siNo(val)
        col.align         = "center"
        col.classes       = clase + " fuente-mono"

    return col
  }

  static eliminarCol( name : string, columnas : IColumna[] )
  {
    const index = columnas.findIndex( c => c.name === name )
    columnas.splice( index, 1 )
  }

  static ocultarCol( name : string, cols : IColumna[] )
  {
    const index = cols.findIndex( c => c.name === name )
    if(index === -1 ) return
    cols[index].visible = false
  }

  static eliminarColums( cols : string[], columnas : IColumna[] ){
    for (const col of cols) Columna.eliminarCol( col, columnas )
  }

  static ocultarColums( cols : string[], columnas : IColumna[]  ){
    for (const col of cols) Columna.ocultarCol( col, columnas )
  }
}
