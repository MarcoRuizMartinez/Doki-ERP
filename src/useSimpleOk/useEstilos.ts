import { QMenuProps } from "quasar"

export const style  = {
  btnBaseSm         : {
    push            : true,
    noCaps          : true,
    glossy          : true,
    dense           : true,
    size            : "0.8em",
    padding         : "2px 8px"
  },  
  btnBaseMd         : {
    push            : true,
    noCaps          : true,
    glossy          : true,
    dense           : false,
    size            : "md",
    padding         : "2px 8px"
  },  
  btnFlatSm         : {
    noCaps          : true,
    flat            : true,
    dense           : true,
    size            : "0.8em",
    padding         : "2px 8px"
  },  
  btnFlatMd         : {
    noCaps          : true,
    flat            : true,
    dense           : true,  
    padding         : "2px 8px"
  },  
  btnRedondo        : {
    dense           : true,
    push            : true,
    round           : true,
    glossy          : true,  
    unelevated      : true,
    size            : "0.8em",
    padding         : "2px"
  },  
  btnRedondoFlat    : {
    dense           : true,
    flat            : true,
    round           : true,
    size            : "md",
    padding         : "none",
    class           : "op60 op100-hover q-ml-sm"
  },
  btnRedondoFlatSple: {
    dense           : true,
    flat            : true,
    round           : true,    
    padding         : "none",    
  },  
  btnSimple         : {
    flat            : true,
    dense           : true,
    noCaps          : true,
    padding         : "4px 14px"
  },  
  btnElegante       : {
    dense           : true,
    unelevated      : true,
    rounded         : true,
    noCaps          : true,
    color           :"grey-4",
    textColor       :"grey-10",
    class           : "op60 op100-hover"
  },  
  toggleGris        : {
    dense           : true,
    push            : true,
    glossy          : true, 
    unelevated      : true, 
    padding         : "4px",  
    toggleColor     : "grey-4",
    textColor       : "grey-6",
    toggleTextColor : "grey-10",
  },  
  dialogo     : {
    transitionShow  : "slide-up",
    transitionHide  : "slide-down",
  }
}

export const menuDefault : QMenuProps = { 
  fit             : true,
  transitionShow  : "jump-down",
  transitionHide  : "jump-up" ,
  anchor          : "bottom middle",
  self            : "top middle",
}

export const WYSIWYG_Limpio  = {
  dense:      true,
  minHeight: "5rem",
  toolbar:    [
                ['bold', 'underline', 'unordered',
                  {
                    label: "Fuente",
                    fixedLabel: true,
                    fixedIcon: true,
                    list: 'no-icons',
                    options: [
                      'size-1',
                      'size-2',
                      'size-3',
                      'size-4',
                      'size-5',
                    ]
                  },
                  'removeFormat', 'viewsource', 'save'
                ],                
              ]
}

export const WYSIWYG_Imagen  = {
  dense:      true,
  minHeight: "5rem",
  toolbar:    [
                [
                  'save'
                ],                
              ]
}



export function btnNumeroPaso(  tipo    : "arriba"  | "abajo",
                                colores : "gris"    | "verde-rojo" | "gris-flat"  = "verde-rojo",
                                iconos  : "flecha"  | "suma"                      = "suma",
                                modo    : "right"   | "left" | "center"           = "right",
                                curva   : number                                  = 6,

                              ) : Object
{
  let color         = ""
  let icon          = ""
  let style         = ""
  let clase         =   colores == "verde-rojo" ? "text-white"
                      : colores == "gris"       ? "text-black"
                      : colores == "gris-flat"  ? "bg-grey-5 text-white"
                      : ""

  if(tipo           == "arriba"){
    color           =   colores == "verde-rojo" ? "positive"
                      : colores == "gris"       ? "grey-4"
                      : ""
    style           =   modo == "right"         ? "border-radius: 0 " + curva + "px 0 0;"
                      : modo == "left"          ? "border-radius: " + curva + "px 0 0 0;"
                      : modo == "center"        ? "border-radius: 0 " + curva + "px " + curva + "px 0;"
                      : ""
    icon            = iconos == "flecha"        ? "mdi-menu-up"   : "mdi-plus"                      
  } 
  else {
    color           =   colores == "verde-rojo" ? "negative"
                      : colores == "gris"       ? "grey-4"
                      : ""
    style           =   modo == "right"         ? "border-radius: 0 0 " + curva + "px 0;"
                      : modo == "left"          ? "border-radius: 0 0 0 " + curva + "px;"
                      : modo == "center"        ? "border-radius: " + curva + "px 0 0 " + curva + "px;"
                      : ""
    icon            = iconos == "flecha"        ? "mdi-menu-down" : "mdi-minus"
  } 

  let vBind         = {
    push:           colores != "gris-flat",
    glossy:         colores != "gris-flat",
    flat:           colores == "gris-flat",
    dense:          true,
    unelevated:     true,
    size:           "0.8em",
    padding:        modo == "center" ? "0.8em 0.6em" : "0 0.6em",
    color:          color,
    icon:           icon,
    style:          style,
    class:          clase
  }
  return vBind
}