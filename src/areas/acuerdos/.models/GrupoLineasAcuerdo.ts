import { ILineaAcuerdo, LineaAcuerdo  } from "../../../areas/acuerdos/.models/LineaAcuerdo"
import {  X100                        } from "../../../useSimpleOk/useTools"

export interface IGrupoLineas {
  productos:                ILineaAcuerdo[]
  conTitulo:                boolean
  titulo:                   string
  conTotal:                 boolean
  descuento:                number
  totalSinDescu:            number
  totalConDescu:            number
  totalLabel:               string
  tieneTituloOTotal:        boolean
  index:                    number
  lineaIdTitulo:            number
  lineaIdSubtotal:          number
  iva:                      number
  totalIva:                 number
  totalConIva:              number
  padreId:                  number
  noDestacarProductos:      ()=>void
}

export class GrupoLineas implements IGrupoLineas
{
  productos:                ILineaAcuerdo[]
  conTitulo:                boolean
  titulo:                   string
  conTotal:                 boolean
  totalLabel:               string
  index:                    number
  lineaIdTitulo:            number
  lineaIdSubtotal:          number  

  constructor( index : number = -1 )
  {
    this.productos          = []
    this.titulo             = "Grupo " + (index + 1)
    this.conTitulo          = true
    this.conTotal           = false
    this.totalLabel         = "Subtotal"
    this.index              = index
    this.lineaIdTitulo      = 0
    this.lineaIdSubtotal    = 0
  }

  noDestacarProductos()  {
    this.productos.forEach(p=>p.destacar('no-destacar'))
  }

  get tieneTituloOTotal() : boolean {
    return this.conTitulo || this.conTotal
  }
  
  get totalSinDescu() : number
  {
    let sumaProductos       = 0
    if(this.productos.length>0)
    {
      sumaProductos         = this.productos.map    ( ( p:ILineaAcuerdo )     : number => p.totalSinDescu )
                                            .reduce ( ( v1:number, v2:number) : number => v1 + v2 )
    }                                            
    return sumaProductos
  }

  get totalConDescu() : number {
    let sumaProductos       = 0
    if(this.productos.length>0)
    {
      sumaProductos         = this.productos.map    ( ( p:ILineaAcuerdo )     : number => p.totalConDescu )
                                            .reduce ( ( v1:number, v2:number) : number => v1 + v2 )
    }                                            
    return sumaProductos
  }

  get descuento() : number {                                      
    return this.totalSinDescu - this.totalConDescu
  }

  get iva() : number {
    const lineaConIVA   = this.productos.find( p => p.iva > 0 )
    let   ivaEncontrado = 0
    if(!!lineaConIVA)
      ivaEncontrado     = lineaConIVA.iva

    return ivaEncontrado 
  }

  get totalIva() : number {
    return X100(this.totalConDescu, this.iva)
  }

  get totalConIva() : number {
    return this.totalConDescu + this.totalIva
  }

  get padreId() : number {
    let id              = 0
    if(!!this.productos.length)
      id                = this.productos[0].padreId

    return id
  }

  static productosAgrupoDeProductos( productos : ILineaAcuerdo[] ) :IGrupoLineas[] 
  {
    let indiceGrupo                     = -1
    let gruposProductos :IGrupoLineas[] = []

    for (const producto of productos)
    {
      if
      (
        producto.tipoLinea  == "producto"   ||
        producto.tipoLinea  == "servicio"   ||
        producto.tipoLinea  == "descripcion"
      )
      {
        if(!gruposProductos.length)
          addNuevoGrupo()

        gruposProductos[indiceGrupo].productos.push( producto )
      }
      else
      if(producto.tipoLinea  == "titulo")
      {
        if
        ( !gruposProductos.length
          ||
          gruposProductos[indiceGrupo].conTitulo
        )
        {
          addNuevoGrupo( producto.lineaId, "titulo")
          let titulo = !!producto.nombre ? producto.nombre : "Grupo " + (indiceGrupo + 1)
          gruposProductos[indiceGrupo].titulo     = titulo
        }
        else
        {
          gruposProductos[indiceGrupo].conTitulo  = true
          gruposProductos[indiceGrupo].titulo     = producto.nombre
        }
      }
      else
      if(producto.tipoLinea  == "subtotal")
      {
        gruposProductos[indiceGrupo].conTotal       = true
        gruposProductos[indiceGrupo].lineaIdSubtotal= producto.lineaId
        //addNuevoGrupo( producto.lineaId, "subtotal" )
        //gruposProductos[indiceGrupo].total        = 1
        //gruposProductos[indiceGrupo].totalLabel   = producto.nombre
      }      
    }
    
    function addNuevoGrupo( lineaId : number = 0, tipoLinea :  "titulo" | "subtotal" | "" = "" )
    {
      let index                 = gruposProductos.length
      let grupo                 = new GrupoLineas( index )
      if(tipoLinea              == "titulo")
        grupo.lineaIdTitulo     = lineaId
      //else
      //if(tipoLinea              == "subtotal")
      //  grupo.lineaIdSubtotal   = lineaId

      gruposProductos.push( grupo )
      indiceGrupo++
    }

    return gruposProductos
  }

  static deGruposAProductos( grupos :IGrupoLineas[] ) : ILineaAcuerdo[]
  {
    let productos : ILineaAcuerdo[] = []
    let count = 0
    let orden = 0

    for(let grupo of grupos)
    {
      count++
      let sinProductos    = !grupo.productos.length

      if(grupos.length    > 1)  orden++
      let titulo          = grupo.conTitulo && !! grupo.titulo ? grupo.titulo : "Grupo " + count
      let lineaTitulo     = LineaAcuerdo.getLineaEspecial( "titulo", grupo.lineaIdTitulo, orden, titulo)
      lineaTitulo.borrar  = sinProductos || grupos.length == 1
      productos.push( lineaTitulo )
      
      for(const producto of grupo.productos)
      {
        if( producto.tipoLinea  == "producto" ||
            producto.tipoLinea  == "servicio"
        )
        {
          orden++
          producto.orden    = orden
          productos.push( producto )
        }
        //else if( producto.tipoLinea == "subtotal" )
      }

      if( grupo.conTotal      && grupos.length > 1 )
      {
        orden++
        let lineaTotal        = LineaAcuerdo.getLineaEspecial( "subtotal", grupo.lineaIdSubtotal, orden  )
        lineaTotal.borrar     = sinProductos
        productos.push( lineaTotal )
      }

    }

    return productos
  }
}