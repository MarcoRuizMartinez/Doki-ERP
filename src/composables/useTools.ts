import {  date,
          useQuasar,
          QNotifyAction,
                                  } from "quasar"
import {  LocationQueryValue      } from "vue-router"
import {  ILabelValue,
          labelValueNulo,         } from "src/models/TiposVarios"
/* import    mitt                      from "mitt";

//* ///////////////////////////////////////////////////////////////////// Eventos

type TEventos = {
  limpiarFiltros        : void
  copiarDatos           : void
  actualizarPrecios     : void
}

export const Eventos = mitt<TEventos>()
 */
//* ///////////////////////////////////////////////////////////////////// useTools

export function useTools()
{
  const quasar                  = useQuasar()
  const { notify              } = quasar
  const esMobil                 = !!quasar.platform.is.mobile

  function aviso
  (
    tipo      : "positive" | "negative",
    mensaje   : string,
    icono     : TIconos         = "",
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

export class ToolType
{
  static valorValido  = ( valor : any ) : boolean => {
    let valido              = true
    if(     valor           === undefined
        ||  valor           === null
        || ( typeof valor   === "number" && isNaN( valor ) )
        || ( typeof valor   === "string" && !valor)
    )
      valido                = false
  
    return valido
  }

  static existeYEsValido( objeto : any, key : string ) : boolean {
    return      ToolType.valorValido(objeto)
            &&  objeto.hasOwnProperty(key)
            //&&  key in objeto
            &&  ( typeof objeto[key] === "boolean" || !!objeto[key] ) 
  }

  static anyToNumOStr( v : any ) : number | string
  {
    if(typeof v === "number" || typeof v === "string")
      return v
    else
      return ""
  }

  static anyToStr( v : any ) : string
  {
    if( typeof v === "string")  return v
    if( typeof v === "number")  return v.toString()
    else
      return ""
  }


  static anyToNum( v : any ) : number
  {
    if(typeof v === "undefined" || v === null) return 0

    if(typeof v === "number" && !isNaN(v) )
      return v
    else if(typeof v === "string")
      return ToolType.strOrNumToNum( v, 0 )
    else if(typeof v === "boolean")
      return +v

    if(isNaN(v)) return 0
    
    return v
  }
  
  static strOrNumToNum( numero : string | number, defectoSiNull : number  ) : number
  {
    if(typeof numero      === "number")
      return ToolType.valorValido(numero) ? numero : defectoSiNull
    else
      return !!numero ? parseFloat(numero) : defectoSiNull
  }

  static keyNumberValido ( objeto : any, key : string, defecto : number = 0 ) : number
  {
    let  numero : number = defecto
    if(!!objeto && (key in objeto) && ToolType.valorValido( objeto[key] ))
    {
      if( typeof objeto[key] === "number" )
        numero = objeto[key]
      else
      if( typeof objeto[key] === "string" )
        numero = +objeto[key]
    }
    return numero
  }
  

  static keyBoolean( objeto : any, key : string ) : boolean
  {
    let boleano = false
    if(!!objeto && (key in objeto) && ToolType.valorValido( objeto[key] ))
    {
      boleano   = Boolean( ToolType.keyNumberValido( objeto, key, 0 ) )
    }

    return boleano
  }
  


  static keyStringValido( objeto : any, key : string, defecto : string = "" ) : string
  {
    let str = defecto
    if(!!objeto && (key in objeto) && ToolType.valorValido( objeto[key] ))
    {
      if( typeof objeto[key] === "number" )
        str = objeto[key].toString()
      else
      if( typeof objeto[key] === "string" )
        str = objeto[key]

      if(str.length === 0)
        str = defecto
    }

    return str
  }

  static convertirTuplaAObjeto = ([key, value]: [string, string]) => ({ [key]: value });


  static esURLValida = ( url : string ) => {
    try {
      return Boolean(new URL(url));
    }
    catch(e){
      return false;
    }
  }

}


export class ToolStr
{
  static mayusculasPrimeraLetra( texto : string ) : string
  {
    texto           = texto.toLowerCase()
    return texto.charAt(0).toUpperCase() + texto.slice(1)
  }

  static mayusculasPrimeraLetraAll( texto : string ) : string
  {
    texto           = texto.trim().replaceAll("  ", " ")
    const palabras  = texto.split(" ")
    for (const i in palabras) {
      palabras[i]   = ToolStr.mayusculasPrimeraLetra( palabras[i] )
    }
    const textMayusculas = palabras.join(" ")
    return textMayusculas
  } 

  static limpiarHTML (html : string ) : string
  {
    let tmp                   = document.createElement("DIV")
        tmp.innerHTML         = html;
  
    return tmp.textContent || tmp.innerText;
  }  
}



export class ToolDate
{
  static getDateToStr( fechaStr : string, tipo : "UTC" | "local" = "local" ) : Date
  {
    if( !fechaStr || ( typeof fechaStr === "string" && fechaStr.length < 4 ) ){
      return new Date(0)
    }

    const miliExtras    = tipo == "UTC" ? new Date().getTimezoneOffset() * 60 * 1000 : 0
    const miliRaw       = !!fechaStr ? Date.parse( fechaStr ) + miliExtras : 0
    const milisegundos  = ToolType.anyToNum( miliRaw ) 
    const fecha         = new Date ( milisegundos )
    return fecha
  }

  static getDateToApiDolibarr( fechaDoli : any ) : Date
  {
    // Dolibarr envia fecha con 3 ceros menos que toca agregar. Ejem:  1675442604
  
    const raw = ToolType.anyToNumOStr(fechaDoli)
    if( !ToolType.valorValido( raw ) )
      return new Date()
  
    const numero = ToolType.strOrNumToNum( raw, 0 )
    if(numero < 1_000_000_000 )
      return new Date()
  
    return new Date( +(numero.toString() + "000")  )
  }  

  static getMilisecShortForApiDolibarr( fecha : Date ) : number  {
    return parseInt( fecha.valueOf().toString().slice(0,8) + "00" )
  }
  
  static diferenciaFechas( fechaOld : number, fechaNew : number ) : string
  {
    const minDife               = ( fechaNew - fechaOld )  / 1000 / 60
    type QType                  = "hours" | "minutes" | "days" | "months" | "years"
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

  static diasEntreFechas( fechaReciente : Date, fechaAntigua : Date ) : number
  {
    if( !ToolDate.fechaValida( fechaReciente ) || !ToolDate.fechaValida( fechaAntigua ) )
      return 0
    
    const diferenciaEnMilisegundos  = fechaReciente.getTime() - fechaAntigua.getTime();
    const dias                      = Math.ceil(diferenciaEnMilisegundos / 86400000 ) // (1000 * 60 * 60 * 24)
    return dias
  }

  static fechaCorta = ( fecha : Date ) : string => {
    return !!fecha.valueOf() ? fecha.toLocaleDateString('sv-SE') : ""
  }
  
  static horaAmPm = ( fecha : Date ) : string => {
    let horas     = fecha.getHours()
    let minutos   = fecha.getMinutes()
    let periodo   = horas >= 12 ? 'PM' : 'AM';
        horas     = horas % 12;
        horas     = horas ? horas : 12; // Si son las 0 horas, ajustar a 12 en lugar de 0
  
  
    let horaFormateada = (horas < 10 ? '0' : '') + horas + ':' + (minutos < 10 ? '0' : '') + minutos + ' ' + periodo;
    return horaFormateada
  }

  static fechaValidaStrODate( fecha : string | Date ) : boolean
  {
    if( typeof fecha      === "string")
      return !!fecha
    else if( fecha instanceof Date)
      return fecha.toString() !== "Invalid Date"
    else
      return false
  }

  static fechaValida( fecha : Date ) : boolean
  {
    let valida = true
    if(
          !(fecha instanceof Date)
      ||  !ToolDate.fechaValidaStrODate( fecha )
      ||  !fecha.getTime()
    )
      valida    = false 

    return valida 
  }


  
  static fechaLarga = ( fecha : Date ) : string => fecha.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  static fechaYHora = ( fecha : Date ) : string => ToolDate.fechaLarga(fecha) + " " + fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
  static fechaMasMedioDia( fechaStr : string ) : Date | "" { return !!fechaStr ? new Date( new Date( fechaStr ).valueOf() + 43200000  ) : "" }
}


export class ToolNum
{
  static numberRandom       = ( base : number )                     : number => Math.floor( Math.random() * base )
  static numberRandomRango  = ( inicio : number, maximo : number )  : number => Math.floor( Math.random() * ( maximo - inicio )) + inicio

  static agregarZeroANumero1Digito( numero : number ) : string {
    return  numero >= 0 && numero <= 9
            ? `0${numero}`
            : numero.toString()
  }

  static roundInt(value : number, exp : number ) : number
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

  static X100( base : number, valorX100 : number ) : number {
    return base / 100 * valorX100
  }
  
  static X100_Aumento( base : number, valorX100 : number ) : number  {
    return base + ToolNum.X100( base, valorX100 )
  }
  
  static X100_Descuento( base : number, valorX100 : number ) : number {
    return base - ToolNum.X100( base, valorX100 )
  }
  
  static X100_Reduccion( base : number, valorX100 : number ) : number {
    let multiplicador = valorX100 / 100 + 1
    return base / multiplicador
  }
  
  static X100_Calcular( base : number, aCalcular : number ) : number {
    if(aCalcular === 0) return 0
    return aCalcular * 100 / base
  }

  static ID_URL_Ok( id : string ) : number
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
}


export class ToolArray
{
  static ordenar( arraySort : any[], key : string, orden : '<' | '>' = '<' ) : any[]
  {
    arraySort = arraySort.sort ( ( a , b ) =>
                                  {
                                    if(a[key] < b[key]) return orden == '<' ? -1  : 1
                                    if(a[key] > b[key]) return orden == '<' ? 1   : -1
                                    return 0
                                  })
    return arraySort
  }  

  static sumar( array : any[], key : string ) : number
  {
    if(!array.length) return 0

    const arraySumar = array.map( ( i : any ) => i[key] )  
          arraySumar.forEach( i => i = ToolType.anyToNum( i ) )
    
    return arraySumar.reduce ( ( v1:number, v2:number) : number  => v1 + v2 )
  }
    

  static valuesObjectArrayToNumber( array : any[] ) : any[]
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

  static filterArrayMaxMin< T >
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

  static getArrayInObject( o : any, key : string ) : any[]
  {
    return typeof o == "object" && key in o && Array.isArray( o[key] ) && !!o[key].length ? o[key] : []
  }
  
  static getArrayFromAny( a : any ) : any[]
  {
    return Array.isArray( a ) && a.length ? a : []
  }


  static getArrayNumDeStr ( texto : string ) : number[]
  {
    const listaRaw        = ToolType.anyToStr( texto )
    if(!listaRaw)         return []
    const arrayRaw        = listaRaw.split(",")
    if(!arrayRaw.length)  return []
    const arrayFinal      = arrayRaw.map( i => ToolType.anyToNum(i) )
    return arrayFinal
  }  
}






export class Tool
{
  static pausa( demora = 0 ) : Promise< any >
  {
    return new Promise( async (resolver, rechazar) => {
      setTimeout(resolver, demora);
    })
  }  

  static esCorreoFamoso( correo : string ) : boolean {
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
}







export class ToolColor
{
  static colorRandom( modo : "lista" | "random" ) : string
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
      const i = ToolNum.numberRandom( listaColores.length )
      color   = listaColores[ i ]
    }
  
    return color
  }

  static getColorTextFromHexa( color : string ) : { color : string, promedio: number }
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
}


import confetti from 'canvas-confetti';
import { onUnmounted } from "vue";
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

export function confetiXY( x : number, y : number, particulas = 50)
{
  const preset  = { particleCount: particulas, spread: 360, zIndex: 2001, startVelocity: 20, gravity: 0.4, ticks: 250 }
  confetti({ origin: { x, y } , ...preset})
}

export function confetiClick( e : Event, particulas = 50 )
{
  const mouseX = ToolType.keyNumberValido( e, "screenX" )
  const mouseY = ToolType.keyNumberValido( e, "screenY" )
  const x = mouseX / screen.width * 1
  const y = mouseY / screen.height * 1
  confetiXY( x, y, particulas )
}



export type TFormatosNumero = "normal" | "precio" | "porcentaje"
export class Format
{
  static milesInt         = new Intl.NumberFormat("es-CO", { minimumFractionDigits: 0 } )

  static formato          = new Intl.NumberFormat("es-CO",
                              {   style:    'currency',
                                  currency: 'COP',
                                  minimumFractionDigits: process.env.CON_DECIMALES ? 2 : 0
                              }
                            );

  static formatoDecimal   = new Intl.NumberFormat("es-CO",
                              {   style:    'currency',
                                  currency: 'COP',
                                  minimumFractionDigits: 2
                              }
                            );

  static precio( valor : string | number, tipo : "decimales-si" | "decimales-no" = "decimales-si" ) : string
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
                            ? Format.formatoDecimal  .format( precioNum )
                            : Format.formato         .format( precioNum )
    return formatoFinal
  }

  static precioAG( param : any ) : string
  {
    const valor = ToolType.keyStringValido( param, "value" )
    return Format.precio( valor, "decimales-no" )
  }

  static siNo( boleano : boolean, modo : "texto" | "iconos" | "textoConIconos" = "textoConIconos" ) : string {
    let retorno           = ""

          if(modo         === "textoConIconos")
      retorno             = boleano ? "✅ Si" : "❌ No"
    else  if(modo         === "iconos")
      retorno             = boleano ? "✅"    : "❌"    
    else
      retorno             = boleano ? "Si"    : "No"

    return retorno
  }  

  static siNoLargo( verdaderoFalso : boolean ) : string {
    if(verdaderoFalso === true)
      return "Si"
    else
      return "No"
  }  

  static formatoNumeroCorto( valor : string | number, formato : TFormatosNumero = "normal" ) : string
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

  static formatoDia( d : number ) : string
  {
    if(d > 10_000 || d < -10_000) // para que no coloque fechas desde 1970
      return ""

    let formato       = d + " día"
    
    if(d != 1) formato += "s"
      return formato
  }    

  static formatoDiaMensaje( d : number, enBlanco : boolean = false ) : string
  {
    const msj     =   enBlanco                  ? ""
                    : d  >=  3                  ? `en ${d} días`
                    : d ===  2                  ? "pasado mañana"
                    : d ===  1                  ? "mañana"
                    : d ===  0                  ? "hoy"
                    : d === -1                  ? "ayer"
                    : d  <= -2   && d >= -1000  ? `hace ${-d} días`
                    :                           "sin definir"
    return msj
  }
}




export class ToolQuery
{
  static getQueryRouterLabelValue
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

  static getQueryRouterLabelValueArray
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


  static getQueryRouterString(paramQuery  : LocationQueryValue  | LocationQueryValue[]) : string
  {
    if(Array.isArray(paramQuery) || paramQuery === undefined )  return ""
    else                                                        return paramQuery as string
  }
  
  static getQueryRouterNumber(paramQuery  : LocationQueryValue  | LocationQueryValue[]) : number | undefined
  {
    if(paramQuery === undefined || Array.isArray(paramQuery) )
      return undefined
  
    const valorRaw  = parseInt( paramQuery as string )
  
    if(ToolType.valorValido(valorRaw))
      return valorRaw
    else
      return undefined
  }
  
  static getQueryRouterBoolean(paramQuery  : LocationQueryValue  | LocationQueryValue[]) : boolean
  {
    if(paramQuery === undefined || Array.isArray(paramQuery) )
      return false
  
    return Boolean( parseInt( paramQuery as string ) )
  }
  
  static getQueryRouterDate(paramQuery  : LocationQueryValue  | LocationQueryValue[]) : Date | ""
  {
    if(Array.isArray(paramQuery) || paramQuery === undefined )
      return ""
  
    return ToolDate.fechaMasMedioDia( paramQuery as string ?? "" )
  }  
}

function nuevoJS()
{
  let y     = 20
  let cosa  = 0
  cosa      ||= y // Se asigna y si cosa es false, 0, "", null o undefined, se le asigna y
  cosa      &&= y // Se asigna y si cosa es true
  cosa      ??= y // Se asigna y si cosa es null o undefined
  cosa      = 0 || 2 // Si es falsy entonces asigna el de la derecha
  // structuredClone // Clona profundamente
}



type TIconos = "" | "water" | "account" | "shield" | "clipboard" | "clock" | "cloud" | "sticker" | "comment" | "table" | "head" | "phone" | "timeline" | "bell" | "printer" | "email" | "lock" | "file" | "lock-open" | "map-marker"
