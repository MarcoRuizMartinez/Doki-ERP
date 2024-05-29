import {  ClientSideRowModelModule,
          ModuleRegistry,
                                    } from "ag-grid-community";
import {  LicenseManager,
          MenuModule,
          SetFilterModule,
          RowGroupingModule,
          ColumnsToolPanelModule,
          FiltersToolPanelModule, 
                                    } from 'ag-grid-enterprise'


export function IniciarAG()
{
  LicenseManager.setLicenseKey( "Using_this_{AG_Grid}_Enterprise_key_{AG-060671}_in_excess_of_the_licence_granted_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_changing_this_key_please_contact_info@ag-grid.com___{GRUPO_ESCOM_SAS_-_NIT_900.419.912_7}_is_granted_a_{Single_Application}_Developer_License_for_the_application_{Doki}_only_for_{1}_Front-End_JavaScript_developer___All_Front-End_JavaScript_developers_working_on_{Doki}_need_to_be_licensed___{Doki}_has_not_been_granted_a_Deployment_License_Add-on___This_key_works_with_{AG_Grid}_Enterprise_versions_released_before_{24_May_2025}____[v3]_[01]_MTc0ODA0MTIwMDAwMA==81714141f6391012f810023875da8989" )
  ModuleRegistry.registerModules  (
  [
    MenuModule,
    SetFilterModule,
    RowGroupingModule,
    ColumnsToolPanelModule,
    FiltersToolPanelModule,
    ClientSideRowModelModule,
  ])
}

export enum TIPO_EDICION
{
  BLOQUEDA,
  CELDA,
  RANGO,
}

export const TiposDeEdicion  = [
  { label: 'Edición bloqueada',   value: TIPO_EDICION.BLOQUEDA, icon: "mdi-lock"              },
  { label: 'Edición por celda',   value: TIPO_EDICION.CELDA,    icon: "mdi-form-textbox"      },
  { label: 'Edición por rango',   value: TIPO_EDICION.RANGO,    icon: "mdi-table-arrow-down"  },
]


export type TDatosEvento = {
  campo     : string
  index     : number
  data      : any
  value     : any
  oldValue  : any
}


export const Spanish = {
    page                        : 'Pagina',
    more                        : 'Mas',
    to                          : 'a',
    of                          : 'de',
    next                        : 'Siguente',
    last                        : 'Último',
    first                       : 'Primero',
    previous                    : 'Anteror',
    loadingOoo                  : 'Cargando...',
    selectAll                   : 'Seleccionar Todo',
    searchOoo                   : 'Buscar...',
    blanks                      : 'En blanco',
    filterOoo                   : 'Filtrar',
    equals                      : 'Igual',
    notEqual                    : 'No Igual',
    lessThan                    : 'Menos que',
    greaterThan                 : 'Mayor que',
    lessThanOrEqual             : 'Menos o igual que',
    greaterThanOrEqual          : 'Mayor o igual que',
    inRange                     : 'En rango de',    
    contains                    : 'Contiene',
    notContains                 : 'No contiene',
    startsWith                  : 'Empieza con',
    endsWith                    : 'Termina con',
    andCondition                : 'Y',
    orCondition                 : 'O',
    group                       : 'Grupo',
    columns                     : 'Columnas',
    filters                     : 'Filtros',
    valueColumns                : 'Valos de las Columnas',
    pivotMode                   : 'Modo Pivote',
    groups                      : 'Grupos',
    values                      : 'Valores',
    pivots                      : 'Pivotes',
    toolPanelButton             : 'Boton Del Panel De Herramientas',
    noRowsToShow                : 'No hay resultados para esta busqueda',
    pinColumn                   : 'Fijar columna',
    valueAggregation            : 'Agregar valor',
    autosizeThiscolumn          : 'Ajusta ancho',
    autosizeAllColumns          : 'Ajusta ancho de todo',
    groupBy                     : 'Agrupar por',
    ungroupBy                   : 'Desagrupar',
    resetColumns                : 'Reiniciar Columnas',
    expandAll                   : 'Expandir todo',
    collapseAll                 : 'Colapsar todo',
    toolPanel                   : 'Panel de Herramientas',
    export                      : 'Exportar',
    csvExport                   : 'Exportar a CSV',
    excelExport                 : 'Exportar a Excel',
    excelXmlExport              : 'Exportar a Excel (.xml)',
    pinLeft                     : 'Fijar a la izquierda',
    pinRight                    : 'Fijar a la derecha',
    noPin                       : 'No fijar',
    sum                         : 'Suman',
    min                         : 'Minimo',
    max                         : 'Maximo',
    none                        : 'nada',
    count                       : 'contar',
    average                     : 'promedio',
    copy                        : 'Copiar',
    copyWithHeaders             : 'Copiar con cabeceras',
    paste                       : 'Pegar',
    applyFilter                 : 'Aplicar',
    resetFilter                 : 'Limpiar',
    clearFilter                 : 'clear',
    cancelFilter                : 'Cancelar',
    rowGroupColumnsEmptyMessage : 'Arrastre aquí hacer grupos',
    valueColumnsEmptyMessage    : 'Arrastre aquí para agregar',  
    pivotColumnsEmptyMessage    : 'Arrastre aquí para establecer etiquetas de columnas',  
} 