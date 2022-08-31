export interface iItemMenu {
    label:      string
    to:         string 
    icon:       string 
    count:      number 
    separator:  boolean 
    click:      () => void
    submenu:    Array < iItemMenu >
    visible:    boolean
    dense:      boolean
}

export class ItemMenu implements iItemMenu
{
    label:      string
    to:         string 
    icon:       string 
    count:      number 
    separator:  boolean
    click:      () => void
    submenu:    []
    visible:    boolean
    dense:      boolean

    constructor({
                    label       = "",
                    to          = "",
                    icon        = "mdi-menu-right",
                    count       = -1,
                    separator   = false,
                    click       = ()=>{},
                    visible     = false,
                })
    {
        this.label      = label
        this.to         = to
        this.icon       = icon
        this.count      = count
        this.separator  = separator
        this.click      = click
        this.submenu    = []
        this.visible    = visible
        this.dense      = false
    }
}