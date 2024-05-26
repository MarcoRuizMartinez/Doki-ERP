export interface IColAg {
  headerName      ?: string
  headerClass     ?: string
  field           ?: string
  cellClass       ?: string
  cellEditor      ?: string
  filter          ?: string
  type            ?: string
  editable        ?: boolean
  visible         ?: boolean
  width           ?: number
  minWidth        ?: number
  flex            ?: number
  columnGroupShow ?: string
  //vistas          ?: string[]
  cellRenderer    ?: any
  api             ?: any
  children        ?: IColAg[]
  marryChildren   ?: boolean
}


type param = {
  title           ?: string
  field           ?: string
  clase           ?: string
  claseTitle      ?: string
  editor          ?: string
  filtro          ?: string
  type            ?: string
  editar          ?: boolean
  visible         ?: boolean
  width           ?: number
  minWidth        ?: number
  flex            ?: number
  render          ?: any
  //vistas          ?: string[]
  colGroupShow    ?: 'open' | 'closed'
  hijos           ?: IColAg[]
  colJuntas       ?: boolean
} 

export class ColAg implements IColAg
{
  headerName      ?: string
  headerClass     ?: string
  field           ?: string
  cellClass       ?: string
  cellEditor      ?: string
  filter          ?: string
  type            ?: string
  editable        ?: boolean
  visible         ?: boolean
  width           ?: number
  minWidth        ?: number
  flex            ?: number
  //vistas          ?: string[]
  columnGroupShow ?: 'open' | 'closed'
  cellRenderer    ?: any
  children        ?: IColAg[]
  marryChildren   ?: boolean

  constructor({
    title                 = undefined,
    field                 = undefined,
    clase                 = undefined,
    claseTitle            = undefined,
    editor                = undefined,
    filtro                = undefined,
    type                  = undefined,
    editar                = undefined,
    visible               = true,
    width                 = undefined,
    minWidth              = undefined,
    flex                  = undefined,
    render                = undefined,
    //vistas                = [],
    colGroupShow          = undefined,
    hijos                 = undefined,
    colJuntas             = undefined,
  } : param               = {} )
  {
    this.headerName       = title
    this.field            = field
    this.cellClass        = clase
    this.headerClass      = claseTitle
    this.cellEditor       = editor
    this.filter           = filtro
    this.type             = type
    this.width            = width
    this.minWidth         = minWidth
    this.flex             = flex
    this.cellRenderer     = render
    this.columnGroupShow  = colGroupShow
    this.children         = hijos
    this.visible          = visible
    this.editable         = editar
    //this.vistas           = vistas
    this.marryChildren    = colJuntas
  }

  get api() : any {
    const a :any = {}
    if(!!this.headerName      ) a.headerName      = this.headerName
    if(!!this.headerClass     ) a.headerClass     = this.headerClass    
    if(!!this.field           ) a.field           = this.field
    if(!!this.editable        ) a.editable        = this.editable
    if(!!this.cellClass       ) a.cellClass       = this.cellClass
    if(!!this.cellEditor      ) a.cellEditor      = this.cellEditor
    if(!!this.filter          ) a.filter          = this.filter
    if(!!this.type            ) a.type            = this.type
    if(!!this.width           ) a.width           = this.width
    if(!!this.minWidth        ) a.minWidth        = this.minWidth
    if(!!this.flex            ) a.flex            = this.flex
    if(!!this.cellRenderer    ) a.cellRenderer    = this.cellRenderer
    if(!!this.columnGroupShow ) a.columnGroupShow = this.columnGroupShow
    if(!!this.children        ) a.children        = this.children
    if(!!this.marryChildren   ) a.marryChildren   = this.marryChildren  

    //a.suppressSpanHeaderHeight = true

    return a
  }

  static Precio({ title = undefined, field = undefined, editar = false, colGroupShow = undefined } : param) : IColAg
  {
    const col             = new ColAg({ title, field, editar, colGroupShow })
    col.filter            = "agNumberColumnFilter"
    col.type              = 'currency'        

    return col
  }
}
