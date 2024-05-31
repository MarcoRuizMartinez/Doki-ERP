import {  ToolNum, ToolType } from "src/composables/useTools" 


export interface IColAg {
  headerName          ?: string
  headerClass         ?: string
  headerTooltip       ?: string
  field               ?: string
  tooltipField        ?: string
  cellClass           ?: string
  cellStyle           ?: string
  cellRenderer        ?: any
  cellEditor          ?: string
  cellEditorParams    ?: any
  filter              ?: boolean | string
  filterParams        ?: any
  filterValueGetter   ?: any
  keyCreator          ?: any
  valueParser         ?: any
  type                ?: string | string[]
  editable            ?: boolean
  //visible             ?: boolean
  width               ?: number
  minWidth            ?: number
  flex                ?: number
  columnGroupShow     ?: string
  //vistas              ?: string[]
  api                 ?: any
  children            ?: IColAg[]
  marryChildren       ?: boolean
  enableRowGroup      ?: boolean
  suppressFillHandle  ?: boolean
  hide                ?: boolean
}


type param = {
  title               ?: string
  titleToolTip        ?: string
  field               ?: string
  valueFormatter      ?: any
  filterParams        ?: any
  tooltipField        ?: string
  clase               ?: string
  estilo              ?: string
  claseTitle          ?: string
  editor              ?: string
  editorParam         ?: any
  filter              ?: boolean | string
  filterValueGetter   ?: any
  keyCreator          ?: any
  valueGetter         ?: any
  valueParser         ?: any
  type                ?: string | string[]
  editar              ?: boolean
  //visible             ?: boolean
  width               ?: number
  minWidth            ?: number
  flex                ?: number
  render              ?: any
  //vistas              ?: string[]
  colGroupShow        ?: 'open' | 'closed'
  hijos               ?: IColAg[]
  colJuntas           ?: boolean
  esBoolean           ?: boolean
  agrupar             ?: boolean
  suppressFillHandle  ?: boolean
  hide                ?: boolean

  opciones            ?: any
  key                 ?: string
} 

export class ColAg implements IColAg
{
  headerName          ?: string
  headerClass         ?: string
  headerTooltip       ?: string
  field               ?: string
  valueFormatter      ?: any
  filterParams        ?: any
  tooltipField        ?: string
  cellClass           ?: string
  cellStyle           ?: string
  cellEditor          ?: string
  cellEditorParams    ?: any
  cellRenderer        ?: any
  filter              ?: boolean | string
  filterValueGetter   ?: any
  valueGetter         ?: any
  keyCreator          ?: any
  valueParser         ?: any
  type                ?: string | string[]
  editable            ?: boolean
  //visible             ?: boolean
  width               ?: number
  minWidth            ?: number
  flex                ?: number
  //vistas              ?: string[]
  columnGroupShow     ?: 'open' | 'closed'
  children            ?: IColAg[]
  marryChildren       ?: boolean
  enableRowGroup      ?: boolean
  suppressFillHandle  ?: boolean
  hide                ?: boolean

  constructor({
    title                   = undefined,
    titleToolTip            = undefined,
    field                   = undefined,
    valueFormatter          = undefined,
    filterParams            = { buttons: ['reset'], defaultToNothingSelected: true,},
    tooltipField            = undefined,
    clase                   = undefined,
    estilo                  = undefined,
    claseTitle              = undefined,
    editor                  = undefined,
    editorParam             = undefined,    
    filter                  = undefined,
    filterValueGetter       = undefined,
    keyCreator              = undefined,
    valueGetter             = undefined,
    valueParser             = undefined,
    type                    = undefined,
    editar                  = undefined,
    //visible                 = true,
    width                   = undefined,
    minWidth                = undefined,
    flex                    = undefined,
    render                  = undefined,
    //vistas                  = [],
    colGroupShow            = undefined,
    hijos                   = undefined,
    colJuntas               = undefined,
    esBoolean               = undefined,
    agrupar                 = undefined,
    suppressFillHandle      = undefined,
    hide                    = undefined,
  } : param                 = {} )
  {
    this.headerName         = title
    this.headerTooltip      = titleToolTip
    this.field              = field
    this.valueFormatter     = valueFormatter
    this.filterParams       = filterParams,
    this.tooltipField       = tooltipField,
    this.cellClass          = clase
    this.cellStyle          = estilo
    this.cellRenderer       = render
    this.cellEditor         = editor
    this.cellEditorParams   = editorParam
    this.filterValueGetter  = filterValueGetter
    this.headerClass        = claseTitle
    this.filter             = filter
    this.type               = type
    this.width              = width
    this.minWidth           = minWidth
    this.flex               = flex
    this.columnGroupShow    = colGroupShow
    this.children           = hijos
    //this.visible            = visible
    this.editable           = editar
    //this.vistas             = vistas
    this.marryChildren      = colJuntas
    this.enableRowGroup     = agrupar
    this.suppressFillHandle = suppressFillHandle
    this.hide               = hide
    this.valueParser        = valueParser
    this.keyCreator         = keyCreator
    this.valueGetter        = valueGetter

    if(!!esBoolean){
      this.filter           = "agSetColumnFilter"
      this.enableRowGroup   = true
      this.filterParams     = { valueFormatter: formatoBoolean, defaultToNothingSelected: true, buttons: ['reset'], comparator: (a: string, b: string) => -a.localeCompare(b, 'es', { sensitivity: 'base' }) }
    }
  }

  get api() : any {
    const a :any = {}
    if(!!this.headerName          ) a.headerName          = this.headerName
    if(!!this.headerTooltip       ) a.headerTooltip       = this.headerTooltip
    if(!!this.headerClass         ) a.headerClass         = this.headerClass    
    if(!!this.field               ) a.field               = this.field
    if(!!this.filterParams        ) a.filterParams        = this.filterParams
    if(!!this.filterValueGetter   ) a.filterValueGetter   = this.filterValueGetter
    if(!!this.keyCreator          ) a.keyCreator          = this.keyCreator
    if(!!this.tooltipField        ) a.tooltipField        = this.tooltipField
    if(!!this.cellClass           ) a.cellClass           = this.cellClass
    if(!!this.cellStyle           ) a.cellStyle           = this.cellStyle
    if(!!this.cellRenderer        ) a.cellRenderer        = this.cellRenderer
    if(!!this.cellEditor          ) a.cellEditor          = this.cellEditor
    if(!!this.cellEditorParams    ) a.cellEditorParams    = this.cellEditorParams
    if(!!this.filter              ) a.filter              = this.filter
    if(!!this.type                ) a.type                = this.type
    if(!!this.width               ) a.width               = this.width
    if(!!this.minWidth            ) a.minWidth            = this.minWidth
    if(!!this.flex                ) a.flex                = this.flex
    if(!!this.columnGroupShow     ) a.columnGroupShow     = this.columnGroupShow
    if(!!this.children            ) a.children            = this.children
    if(!!this.valueFormatter      ) a.valueFormatter      = this.valueFormatter
    if(!!this.valueParser         ) a.valueParser         = this.valueParser
    if(!!this.keyCreator          ) a.keyCreator          = this.keyCreator
    if(!!this.valueGetter         ) a.valueGetter         = this.valueGetter
     

    if(typeof this.marryChildren      == "boolean" )  a.marryChildren       = this.marryChildren  
    if(typeof this.enableRowGroup     == "boolean" )  a.enableRowGroup      = this.enableRowGroup
    if(typeof this.suppressFillHandle == "boolean" )  a.suppressFillHandle  = this.suppressFillHandle
    if(typeof this.hide               == "boolean" )  a.hide                = this.hide
    if(typeof this.editable           == "boolean" )  a.editable            = this.editable

    return a
  }

  static Precio(
  {
    field         = undefined,
    title         = undefined,
    editar        = undefined,
    colGroupShow  = undefined,
    hide          = undefined,
    type          = undefined
  }  : param      ) : IColAg
  {
    const col             = new ColAg({ title, field, editar, colGroupShow, hide })
    col.filter            = "agNumberColumnFilter"
    col.valueParser       = ( params : any ) => ToolNum.roundInt( ToolType.anyToNum( params.newValue ), 0)

    if(!!type && typeof type === "string")
      col.type            = ["moneda", type]
    else
      col.type            = "moneda"
    
    return col
  }
//, { title = undefined, field = undefined, editar = false, colGroupShow = undefined } : param

  static Objeto({
                  opciones,
                  key           = undefined ?? "",
                  field         = undefined ?? "",
                  title         = undefined,
                  editar        = undefined,
                  hide          = undefined,
                  type          = undefined,
                  render        = undefined
                }               : param
  )                             : IColAg
  {
    const renderAUsar     = getRender()
    const col             = new ColAg     ({ 
                              field             : field,
                              filter            : 'agSetColumnFilter',
                              title,
                              editar,
                              hide,
                              type,
                              render            : renderAUsar,
                              agrupar           : true,
                              editor            : "agRichSelectCellEditor",
                              valueParser       : ( p : any ) => p.newValue
                              /*{
                                const valor = p.newValue
                                return valor
                              }*/,
                              filterValueGetter : ( p : any ) => p.data[field][key]
                                /*{
                                const valor = p.data[field][key]
                                return valor
                              }*/,
                              //keyCreator        : ( params : any ) => params.value[key],
                              keyCreator        : ( p : any ) => p.value[key]
                                /*{
                                //console.log("keyCreator: ", params);
                                const valor = p.value[key]
                                return valor
                              }*/,
                              editorParam       : { 
                                                    values          : opciones,
                                                    allowTyping     : true,
                                                    filterList      : true,
                                                    highlightMatch  : true,     
                                                    cellRenderer    : renderAUsar,
                                                    formatValue     : ( value : any ) => value?.[key],
                                                    useFormatter    : true,
                                                  },
                              /* valueGetter       : ( p : any ) => {
                                console.log("valueGetter: ", p);
                                return p  
                              }, */
                              /* valueFormatter    : ( p : any ) => { 
                                const hayValue  = ToolType.existeYEsValido( p,        "value" )
                                //const hayKey    = ToolType.existeYEsValido( p.value,  key )                                
                                return hayValue ? p.value[key] : ""
                              }, */
                              /* valueFormatter    : ( p : any ) =>{
                                if (!p.value) {
                                  return "";
                                }
                                return `[${p.value.alias}]`;
                              } */
                                //p?.value[key] ?? "",
                          })    

    return col


    function getRender()
    {
      if(!!render) return render

      const fnRender    = ( p : any ) => {
        const hayValue  = ToolType.existeYEsValido( p,        "value" )
        //const hayKey    = ToolType.existeYEsValido( p.value,  key )
        return hayValue ? p.value[key] : ""
      }

      return fnRender
    }
  }
}

const formatoBoolean = ( params : any ) => {
  const verdadero = Boolean( params.value )
  return verdadero ? "✅ Si" : "❌ No"
};