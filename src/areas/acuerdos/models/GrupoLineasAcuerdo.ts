import {  ILineaAcuerdo,
          LineaAcuerdo        } from "src/areas/acuerdos/models/LineaAcuerdo"
import {  ToolNum             } from "src/composables/useTools"

export interface IGrupoLineas {
  productos:                ILineaAcuerdo[]
  seleccion:                ILineaAcuerdo[]
  conTitulo:                boolean
  titulo:                   string
  conTotal:                 boolean
  descuento:                number
  totalSinDescu:            number
  totalConDescu:            number
  totalLabel:               string
  totalCreado:              boolean
  tituloCreado:             boolean
  index:                    number
  lineaIdTitulo:            number
  lineaIdSubtotal:          number
  iva:                      number
  totalIva:                 number
  totalConIva:              number
  padreId:                  number
  noDestacarProductos:      ()=>void
  hayQueCrearTitulo:        boolean
}

export class GrupoLineas implements IGrupoLineas
{
  productos:                ILineaAcuerdo[]
  seleccion:                ILineaAcuerdo[]
  conTitulo:                boolean
  titulo:                   string
  conTotal:                 boolean
  totalCreado:              boolean
  tituloCreado:             boolean  
  totalLabel:               string
  index:                    number
  lineaIdTitulo:            number
  lineaIdSubtotal:          number    

  constructor( index : number = -1 )
  {
    this.productos          = []
    this.seleccion          = []
    this.titulo             = "Grupo " + (index + 1)
    this.conTitulo          = true
    this.conTotal           = false
    this.totalCreado        = false
    this.tituloCreado       = false
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
    return ToolNum.X100(this.totalConDescu, this.iva)
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

  get hayQueCrearTitulo() : boolean{
    return  !this.productos.length  // Grupo sin productos
            &&
            !this.tituloCreado      // Grupo sin titulo creado
            &&
            !!this.index            // No es el grupo 0
  }

  static getGruposDesdeProductos( productos : ILineaAcuerdo[] ) :IGrupoLineas[] 
  {
    let indiceGrupo                     = -1
    let gruposProductos :IGrupoLineas[] = []

    for (const producto of productos)
    {
      if
      (
        producto.tipoLinea  === "producto"   ||
        producto.tipoLinea  === "servicio"   ||
        producto.tipoLinea  === "descripcion"
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
          gruposProductos[indiceGrupo].titulo       = titulo
        }
        else
        {
          gruposProductos[indiceGrupo].conTitulo    = true
          gruposProductos[indiceGrupo].titulo       = producto.nombre
        }
        gruposProductos[indiceGrupo].tituloCreado   = true
      }
      else
      if(producto.tipoLinea  == "subtotal")
      {
        gruposProductos[indiceGrupo].totalCreado    = true
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

  // Tambien reorganiza los productos de los grupos
  static getProductosDesdeGrupos( grupos :IGrupoLineas[] ) : ILineaAcuerdo[]
  {
    const productos : ILineaAcuerdo[] = []
    let cuentaGrupos      = 0
    let orden             = 0

    for(let grupo of grupos)
    {
      cuentaGrupos++
      const sinProductos  = !grupo.productos.length

      if(grupo.tituloCreado)
      {
        orden++
        const titulo        = grupo.conTitulo && !!grupo.titulo ? grupo.titulo : "Grupo " + cuentaGrupos
        const lineaTitulo   = LineaAcuerdo.getLineaEspecial( "titulo", grupo.lineaIdTitulo, orden, titulo)
        //lineaTitulo.borrar  = sinProductos || grupos.length == 1
        productos.push( lineaTitulo )
      }
      
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

      if( grupo.conTotal && grupo.totalCreado && grupos.length > 1 )
      {
        orden++
        let lineaTotal        = LineaAcuerdo.getLineaEspecial( "subtotal", grupo.lineaIdSubtotal, orden  )
        //lineaTotal.borrar     = sinProductos
        productos.push( lineaTotal )
      }

    }

    return productos
  }
}