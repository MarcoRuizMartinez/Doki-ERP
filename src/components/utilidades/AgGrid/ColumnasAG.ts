import {  ToolNum, ToolType   } from "src/composables/useTools" 
import {  ColDef              } from "ag-grid-community";


type TParam = ColDef & {
  opciones              ?: any
  key                   ?: string
} 

//const fnboolean = ( p : any ) => Boolean( p.value ) ? "✅ Si" : "❌ No"
export const Col =
{
  Boolean({
    field                 = undefined,
    headerName            = undefined,
    editable              = undefined,
    columnGroupShow       = undefined,
    hide                  = undefined,
    type                  = undefined,
    headerClass           = undefined,
    cellClassRules        = undefined,
  }                       : TParam
  )                       : ColDef
  {
    const col : ColDef    = { headerName, field, editable, columnGroupShow, hide, type, headerClass, cellClassRules, width : 120 }
    col.filter            = "agSetColumnFilter"
    col.enableRowGroup    = true
    col.filterParams      = { defaultToNothingSelected: true, 
      buttons             : ['reset'],
      valueFormatter      : ( p : any ) => Boolean( p.value ) ? "✅ Si" : "❌ No",
      comparator          : (a: string, b: string) => -a.localeCompare(b, 'es', { sensitivity: 'base' }),
    }
    //col.valueParser       = ( p : any ) => ToolType.keyBoolean(p, "newValue")
    /* col.valueGetter       = ( p : any ) => {
      return p.value
    } */

    /* col.valueFormatter    = ( p : any ) => { 
      //const hayKey    = ToolType.existeYEsValido( p.value,  key )                                
      return p.value
    } */

    
    /* col.filterValueGetter = ( p : any ) => 
      {
        const valor = Boolean( p.value ) ? "✅ Si3" : "❌ No3"
        return valor
      } */


    return col
  },

  Precio({
    field                 = undefined,
    headerName            = undefined,
    editable              = undefined,
    columnGroupShow       = undefined,
    hide                  = undefined,
    width                 = undefined,
    type                  = undefined,
    cellClassRules        = undefined,
    headerClass           = undefined,
  }                       : TParam
  , mostrar : boolean     = true
  )                       : ColDef
  {
    const col : ColDef    = { headerName, field, width, editable, columnGroupShow, hide, cellClassRules, headerClass }
    col.filter            = "agNumberColumnFilter"

    col.valueParser       = ( p : any ) => {
      let valorStr        = ToolType.keyStringValido( p, "newValue" ).replaceAll(" ", "").replaceAll("$", "") 
      const lugarComa     = valorStr.indexOf(",")
      const lugarPunto    = valorStr.indexOf(".")

      if(lugarComa > -1 && lugarPunto > -1)
      {
        valorStr          =   lugarPunto < lugarComa
                            ? valorStr.replaceAll(".", "")
                            : valorStr.replaceAll(",", "")
      }
      else if (lugarPunto > -1)
        valorStr          = valorStr.replace(".", "")
      else if (lugarComa  > -1)
        valorStr          = valorStr.replace(",", "")
      
      const valor         = ToolNum.roundInt( ToolType.anyToNum( valorStr ), 0)
      return valor
    }
    

    if(!!type && typeof type === "string")
      col.type            = ["moneda", type]
    else
      col.type            = "moneda"
    
    return mostrar ? col : col
  },
  
  Objeto({
    opciones,
    key                   = undefined ?? "",
    field                 = undefined ?? "",
    headerName            = undefined,
    editable              = undefined,
    hide                  = undefined,
    type                  = undefined,
    cellRenderer          = undefined,
    width                 = undefined,
    cellClassRules        = undefined,
    headerClass           = undefined,
  }                       : TParam
  )                       : ColDef
  {
    const renderAUsar     = getRender()
    const col : ColDef    = { 
      headerName,
      headerClass,
      editable,
      hide,
      type,
      width,
      cellClassRules,
      field               : field,
      filter              : 'agSetColumnFilter',
      cellRenderer        : renderAUsar,
      enableRowGroup      : true,
      cellEditor          : "agRichSelectCellEditor",
      valueParser         : ( p : any ) => p.newValue,
      filterValueGetter   : ( p : any ) => p.data[field][key],
      keyCreator          : ( p : any ) => p.value[key],
      cellEditorParams    : { 
                              values          : opciones,
                              allowTyping     : true,
                              filterList      : true,
                              highlightMatch  : true,     
                              cellRenderer    : renderAUsar,
                              formatValue     : ( value : any ) => value?.[key],
                              useFormatter    : true,
                            }

    }

    return col


    function getRender()
    {
      if(!!cellRenderer) return cellRenderer

      const fnRender    = ( p : any ) => {
        const hayValue  = ToolType.existeYEsValido( p,        "value" )
        //const hayKey    = ToolType.existeYEsValido( p.value,  key )
        return hayValue ? p.value[key] : ""
      }

      return fnRender
    }
  }
}