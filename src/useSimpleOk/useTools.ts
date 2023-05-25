import {  exportFile,
          date,
          useQuasar,
          QNotifyAction,
                                  } from "quasar"
import {  IColumna                } from "src/models/Tabla"
import {  LocationQueryValue      } from "vue-router"
import {  ILabelValue,
          labelValueNulo,         } from "src/models/TiposVarios"

type Iconos = "" | "water" | "account" | "shield" | "clipboard" | "clock" | "cloud" | "sticker" | "comment" | "table" | "head" | "phone" | "timeline" | "bell" | "printer" | "email" | "lock" | "file" | "lock-open" | "map-marker"

export function useTools()
{
  const quasar                  = useQuasar()
  const { notify              } = quasar
  const esMobil                 = !!quasar.platform.is.mobile

  function aviso
  (
    tipo      : "positive" | "negative",
    mensaje   : string,
    icono     : Iconos          = "",
    duracion  : number          = 1600,
    acciones  : QNotifyAction[] = [],
    html      : boolean         = false
  )
  {
    let icon      = !!icono ? icono + "-" : ""

    notify({
      color:      tipo,
      textColor:  "white",
      icon:       "mdi-" + (tipo == "negative" ? icon + "alert" : icon + "check"),
      position:   "top",
      timeout:    duracion,
      message:    mensaje,
      actions:    acciones,
      html
    })
  }


  return {
    aviso,
    esMobil,
  }
}

//const { notify } = useQuasar()
export function mayusculasPrimeraLetra( texto : string ) : string
{
  texto           = texto.toLowerCase()
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}


export function mayusculasPrimeraLetraAll( texto : string ) : string
{
  texto           = texto.trim().replaceAll("  ", " ")
  const palabras  = texto.split(" ")
  for (const i in palabras) {
    palabras[i]   = mayusculasPrimeraLetra( palabras[i] )
  }
  const textMayusculas = palabras.join(" ")
  return textMayusculas
}

export function getDateToStr( fechaStr : string, tipo : "UTC" | "local" = "local" ) : Date
{
  const miliExtras    = tipo == "UTC" ? new Date().getTimezoneOffset() * 60 * 1000 : 0
  const milisegundos  = !!fechaStr ? Date.parse( fechaStr ) + miliExtras : 0
  return new Date ( milisegundos )
}

export function getDateToApiDolibarr( fechaDoli : any ) : Date
{
  // Dolibarr envia fecha con 3 ceros menos que toca agregar. Ejem:  1675442604 

  const raw = anyToNumOStr(fechaDoli)
  if( !valorValido( raw ) )
    return new Date()

  const numero = strOrNumToNum( raw, 0 )
  if(numero < 1_000_000_000 )
    return new Date()
    
  return new Date( +(numero.toString() + "000")  )
}

export function anyToNumOStr( v : any ) : number | string
{
  if(typeof v === "number" || typeof v === "string")
    return v 
  else 
    return ""
}

export function anyToNum( v : any ) : number
{
  if(typeof v === "number")
    return v
  else if(typeof v === "string")
    return strOrNumToNum( v, 0 )

  return 0
}

export function getMilisecShortForApiDolibarr( fecha : Date ) : number
{
  return parseInt( fecha.valueOf().toString().slice(0,8) + "00" )
}


export function getColorTextFromHexa( color : string ) : { color : string, promedio: number }
{
  if(color.length != 7)
    return { color: "", promedio: 0 }

  let hexa1       = color.slice(1, 3)
  let hexa2       = color.slice(3, 5)
  let hexa3       = color.slice(5, 7)
  let promedio    = ( parseInt( hexa1, 16) + parseInt( hexa2, 16) + parseInt( hexa3, 16) ) / 3
  let colorFinal  = promedio > 190 ? "#282828" : "#FFFFFF"
  return { color: colorFinal, promedio: promedio }
}

export const formatoMilesInt  = new Intl.NumberFormat("es-CO",
{
  minimumFractionDigits: 0
}
)

export function nuevoJS()
{
  let cosa = 0
  cosa  ||= 1 // Si x es falsy, se le asigna y
  cosa  &&= 2 // Si x es truthy, se le asigna y
  cosa  ??= 3 // Si x es null o undefined, se le asigna y

// Equivale
  var importe : number = 1_283_792_189;
}

export function pausa( demora = 0 ) : Promise< any >
{
  return new Promise( async (resolver, rechazar) => {
    setTimeout(resolver, demora);
  })
}


import confetti from 'canvas-confetti';
export function confeti( total : number = 1 )
{
  const mili    = 500
  const preset  = { particleCount: 70, spread: 360, zIndex: 2001, startVelocity: 20, gravity: 0.4, ticks: 250 }
  const pos     = [ { y: 0.2, x: 0.5 }, { y: 0.3, x: 0.75 }, { y: 0.4, x: 0.3 } ]
  let index     = 0
  fuego()
  if(total      === 1) return

  const clock   = setInterval(()=>{
    fuego()
    if(index === pos.length ) index = 0
  }, mili )

  function fuego(){
    confetti({ origin: pos[index] , ...preset})
    index++
  }

  setTimeout(()=> clearInterval(clock), mili * ( total - 1 ) )
}

export const agregarZeroANumero1Digito = ( numero : number ) : string => numero >= 0 && numero <= 9 ? `0${numero}` : numero.toString()

export function ID_URL_Ok( id : string ) : number
{
  let idEvaluar             = parseInt( id )

  if
  (
    !id
    ||
    !idEvaluar
    ||
    idEvaluar               < 1 // es cero o negativo
    ||
    id.length               !== idEvaluar.toString().length // El ID de la URL tenia caracteres extraños
  )
    idEvaluar               = 0

  return idEvaluar
}

export function strOrNumToNum( numero : string | number, defectoSiNull : number  ) : number
{
    if(typeof numero      === "number")
      return valorValido(numero) ? numero : defectoSiNull
    else
      return !!numero ? parseFloat(numero) : defectoSiNull
}


export function valuesObjectArrayToNumber( array : any[] ) : any[]
{
  for (const item of array)
  {
    for (const key of Object.keys(item))
    {
      let valor :     number | string
      valor           = parseFloat( item[key] )

      if(isNaN(valor))
        valor         = !!item[key] && item[key].length > 0 ? item[key] : 0

      item[key]       = valor
    }
  }

  return array
}


let formato         = new Intl.NumberFormat("es-CO",
                    {   style:    'currency',
                        currency: 'COP',
                        minimumFractionDigits: process.env.CON_DECIMALES ? 2 : 0
                    }
                    );

let formatoDecimal  = new Intl.NumberFormat("es-CO",
                    {   style:    'currency',
                        currency: 'COP',
                        minimumFractionDigits: 2
                    }
                    );

export function formatoPrecio( valor : string | number, tipo : "decimales-si" | "decimales-no" = "decimales-si" ) : string
{
  let precioNum         = 0
  if(typeof valor       === "string")
  {
    precioNum           = parseFloat( valor )
    if( isNaN(precioNum) )
      return ""
  }
  else if(typeof valor  === "number")
    precioNum = valor
  else if(!valor)
    return ""

  if(isNaN(precioNum))
    precioNum           = 0

  let formatoFinal      = tipo == "decimales-si"
                          ? formatoDecimal  .format( precioNum )
                          : formato         .format( precioNum )
  return formatoFinal
}

/* export function setMetaTitle( titulo : string )
{
  useMeta(  { title: titulo, titleTemplate: ( title : string ) => title } )
} */

export function X100( base : number, valorX100 : number ) : number {
  return base / 100 * valorX100
}

export function X100_Aumento( base : number, valorX100 : number ) : number  {
  return base + X100( base, valorX100 )
}

export function X100_Descuento( base : number, valorX100 : number ) : number {
  return base - X100( base, valorX100 )
}

export function X100_Reduccion( base : number, valorX100 : number ) : number {
  let multiplicador = valorX100 / 100 + 1
  return base / multiplicador
}

export function X100_Calcular( base : number, aCalcular : number ) : number {
  if(aCalcular === 0) return 0
  return aCalcular * 100 / base
}

export function sortArray( arraySort : any[], key : string, orden : '<' | '>' = '<' ) : any[]
{
  arraySort = arraySort.sort ( ( a , b ) =>
                                {
                                  if(a[key] < b[key]) return orden == '<' ? -1  : 1
                                  if(a[key] > b[key]) return orden == '<' ? 1   : -1
                                  return 0
                                })
  return arraySort
}


export function roundInt(value : number, exp : number ) : number
{
  // Si el exp no está definido o es cero...
  if (typeof exp === 'undefined' || +exp === 0)
    return Math.round(value)

  value         = +value
  exp           = +exp

  // Si el valor no es un número o el exp no es un entero...
  if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0))
  {
      return NaN;
  }

  // Shift
  let valorArr = value.toString().split('e')
      value   = Math.round(+(valorArr[0] + 'e' + (valorArr[1] ? (+valorArr[1] - exp) : -exp)));
  // Shift back
      valorArr = value.toString().split('e');

  return +(valorArr[0] + 'e' + (valorArr[1] ? (+valorArr[1] + exp) : exp));
}

export function filterArrayMaxMin< T >
(
  arrayOriginal : any[],
  minValor      : number | undefined,
  maxValor      : number | undefined,
  key           : string
)               : T[]
{
  let min                   = minValor ?? 0
  let max                   = maxValor ?? 0
      min                   =   min > max && !!max  ? max
                              : min < 0             ? 0
                              : min
      max                   =   max < 0             ? 0 : max

  let arrayFiltrada :T[]    = []

  if(!!min  && !max)
    arrayFiltrada           = arrayOriginal.filter( p => p[key] >= min )
  else
  if(!min   && !!max)
    arrayFiltrada           = arrayOriginal.filter( p => p[key] <= max )
  else
  if(!!min  && !!max)
    arrayFiltrada           = arrayOriginal.filter( p => p[key] >= min && p[key] <= max )
  else
    arrayFiltrada           = arrayOriginal

  return arrayFiltrada
}

export function limpiarHTML (html : string ) : string
{
  let tmp                   = document.createElement("DIV")
      tmp.innerHTML         = html;

  return tmp.textContent || tmp.innerText;
}
export const fechaCorta = ( fecha : Date ) : string => {
  return !!fecha.valueOf() ? fecha.toLocaleDateString('sv-SE') : ""
}

export const fechaLarga = ( fecha : Date ) : string => fecha.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

export const valorValido  = ( valor : any ) : boolean => {
  let valido              = true
  if( valor               === undefined ||
      valor               === null      ||
      ( typeof valor      === "number" && isNaN( valor ) )
  )
    valido                = false

  return valido
}

export const siNo       = ( boleano : boolean, conIconos : boolean = true ) : string => {
  let retorno           = ""
  if(conIconos)
    retorno             = boleano ? "✅ Si" : "❌ No"
  else
    retorno             = boleano ? "Si" : "No"
  return retorno
}

export type FormatosNumero = "normal" | "precio" | "porcentaje"
export const formatoNumeroCorto = ( valor : string | number, formato : FormatosNumero = "normal" ) : string =>
{
  if(!valor) return "0"

  let numero            = 0

  if(typeof valor       === "string"){
    numero              = parseInt(valor)
    if(isNaN(numero)    || !numero)
      numero            = 0
  }
  else
    numero              = valor

  const numeroStr       = numero.toFixed(0)
  const largo           = numeroStr.length
  let label             = ""
  switch (largo) {
    case 5:   label     = numeroStr.slice(0,2)  + " K"; break; // 10.000
    case 6:   label     = numeroStr.slice(0,3)  + " K"; break; // 100.000
    case 7:   label     = numeroStr.slice(0,1)  + " M"; break; // 1.000.000
    case 8:   label     = numeroStr.slice(0,2)  + " M"; break; // 10.000.000
    case 9:   label     = numeroStr.slice(0,3)  + " M"; break; // 100.000.000
    case 10:  label     = numeroStr.slice(0,1) + "." + numeroStr.slice(1,4) + " M"; break; // 1.000.000.000
    case 11:  label     = numeroStr.slice(0,2) + "." + numeroStr.slice(2,5) + " M"; break; // 10.000.000.000
    default:  label     = numeroStr;                    break;
  }

  label                 =   formato === "precio"      ? `$${label}`
                          : formato === "porcentaje" && largo <= 3 ? `${label}%`
                          : label

  return label
}

function siNoLargo( verdaderoFalso : boolean ) : string {
  if(verdaderoFalso === true)
    return "Si"
  else
    return "No"
}




export function getQueryRouterLabelValue
(
    paramQuery  : LocationQueryValue  | LocationQueryValue[],
    lista       : any[],
    tipoKey     : "string"            | "number"              = "number"
)               : ILabelValue
{


  if( Array.isArray(paramQuery) || paramQuery === undefined )
    return labelValueNulo

  const valorRaw      = paramQuery as string
  const valor         = tipoKey === "number" ? parseInt(valorRaw) : valorRaw
  const itemTem       = lista.find( i => i.value == valor || i.id == valor )
  const estadoFinal   = itemTem !== undefined ? itemTem : labelValueNulo
  return estadoFinal
}


export function getQueryRouterLabelValueArray
(
    paramQuery  : LocationQueryValue  | LocationQueryValue[],
    lista       : ILabelValue[],
    separador   : string                                      = "_",
    tipoKey     : "string"            | "number"              = "number"
)               : ILabelValue[]
{


  if( Array.isArray(paramQuery) || paramQuery === undefined )
    return []

  const valorRaw      = paramQuery as string
  const arrayRaw      = valorRaw.split(separador)
  const arrayFinal    = lista.filter( item => arrayRaw.some( valor => valor == item.value )  )

  //const valor         = tipoKey === "number" ? arrayRaw.forEach( i => i = +i ) : valorRaw
  //const itemTem       = lista.find( i => i.value == valor || i.id == valor )
  //const estadoFinal   = itemTem !== undefined ? itemTem : labelValueNulo
  return arrayFinal
}

export function fechaValida( fecha : string | Date ) : boolean {
  if( typeof fecha === "string")
    return !!fecha
  else
    return fecha.toString() !== "Invalid Date"
}

export function getArrayInObject( o : any, key : string ) : any[]
{
  return typeof o == "object" && key in o && Array.isArray( o[key] ) && !!o[key].length ? o[key] : []
}

export function getArrayFromAny( a : any ) : any[] 
{
  return Array.isArray( a ) && a.length ? a : []
}



export function getQueryRouterString(paramQuery  : LocationQueryValue  | LocationQueryValue[]) : string
{
  if(Array.isArray(paramQuery) || paramQuery === undefined )  return ""
  else                                                        return paramQuery as string
}

export function getQueryRouterNumber(paramQuery  : LocationQueryValue  | LocationQueryValue[]) : number | undefined
{
  if(paramQuery === undefined || Array.isArray(paramQuery) )
    return undefined

  const valorRaw  = parseInt( paramQuery as string )

  if(valorValido(valorRaw))
    return valorRaw
  else
    return undefined
}

export function getQueryRouterBoolean(paramQuery  : LocationQueryValue  | LocationQueryValue[]) : boolean
{
  if(paramQuery === undefined || Array.isArray(paramQuery) )
    return false

  return Boolean( parseInt( paramQuery as string ) )
}

export function getQueryRouterDate(paramQuery  : LocationQueryValue  | LocationQueryValue[]) : Date | ""
{
  if(Array.isArray(paramQuery) || paramQuery === undefined )
    return ""

  return fechaMasMedioDia( paramQuery as string ?? "" )
}

export function fechaMasMedioDia( fechaStr : string ) : Date | "" { return !!fechaStr ? new Date( new Date( fechaStr ).valueOf() + 43200000  ) : "" }


export function esCorreoFamoso( correo : string ) : boolean {
  let esFamoso        = false
  const emailFamosos  = ["@gmail","@gmx","@hotmail","@icloud","@live","@me", "@outlook","@protonmail","@yahoo","@sena","@unal.edu.co", "@fac.mil.co", "@policia.gov.co"]
  for (const dominio of emailFamosos) {
    if(correo.includes(dominio)) {
      esFamoso        = true
      break
    }
  }
  return esFamoso
}

export function existeYEsValido( objeto : any, key : string ) : boolean {
  return key in objeto && !!objeto[key]
}

export function getNumberValido( objeto : any, key : string ) : number {
  let  numero : number = 0
  if(key in objeto && valorValido( objeto[key] ))
  {
    if( typeof objeto[key] === "number" )
      numero = objeto[key]
    else
    if( typeof objeto[key] === "string" )
      numero = +objeto[key]
  }
  return numero
}

export function getStringValido( objeto : any, key : string ) : string {
  const texto : string  = key in objeto && valorValido( objeto[key] ) && typeof objeto[key] === "string"
                          ? objeto[key] : ""
  return texto
}

type QType = "hours" | "minutes" | "days" | "months" | "years"
export function diferenciaFechas( fechaOld : number, fechaNew : number ) : string
{
    const minDife               = ( fechaNew - fechaOld )  / 1000 / 60
    let unit : QType           

    if      (minDife < 60)        unit    = "minutes"
    else  if(minDife < 1440)      unit    = "hours"
    else  if(minDife < 44640)     unit    = "days"
    else  if(minDife < 525600)    unit    = "months"
    else                          unit    = "years"    

    const diferencia            = date.getDateDiff(fechaNew, fechaOld, unit)
    let unidad                  = ""

    if(diferencia               > 1)
    {
        if      (unit == "minutes")   unidad  = "minutos"
        else if (unit == "hours")     unidad  = "horas"
        else if (unit == "days")      unidad  = "días" 
        else if (unit == "months")    unidad  = "meses" 
        else if (unit == "years")     unidad  = "años"
    }
    else
    {
        if      (unit == "minutes")   unidad  = "minuto"
        else if (unit == "hours")     unidad  = "hora"
        else if (unit == "days")      unidad  = "día" 
        else if (unit == "months")    unidad  = "mes" 
        else if (unit == "years")     unidad  = "año"
    }

    return diferencia + " " + unidad
}

export function numberRandom( base : number ) : number 
{
  return Math.floor( Math.random() * base )
}

export function colorRandom( modo : "lista" | "random" ) : string 
{
  let color             = ""
  if(modo               === "random"){
    const randomColor   = Math.floor(Math.random()*16777215).toString(16)
    color               = "#" + randomColor
  }
  else
  {
    const listaColores = [
      "#00509d",
      "#8ac926",
      "#FF8000",
      "#8d0801",
      "#095921",
      "#C19706",
      "#373094",
      "#0d1b2a",
      "#2b9348",
      "#fdc500",
      "#ef476f",
      "#5f0f40",
      "#9E70C5",
      "#2a9d8f",
      "#8D00C4",
      "#E763AB",
    ]
    const i = numberRandom( listaColores.length )
    color   = listaColores[ i ]
  }
  
  return color
}
