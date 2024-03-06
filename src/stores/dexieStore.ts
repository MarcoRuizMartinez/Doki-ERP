import {  defineStore       } from 'pinia';
import {  TABLAS            } from "src/boot/dexie"

import {  IMunicipio          } from "src/models/Municipio"
import {  Usuario             } from "src/areas/usuarios/models/Usuario"
import {  ITipoDocumento      } from "src/areas/terceros/models/TiposDocumento"
import {  ICondicionPago      } from "src/models/Diccionarios/CondicionPago"
import {  IFormaPago          } from "src/models/Diccionarios/FormaPago"
import {  IMetodoEntrega      } from "src/models/Diccionarios/MetodoEntrega"
import {  IOrigenContacto     } from "src/models/Diccionarios/OrigenContacto"
import {  IUnidad             } from "src/models/Diccionarios/Unidad"
import {  ITiempoEntrega      } from "src/models/Diccionarios/TiempoEntrega"
import {  ITipoContacto       } from "src/models/Diccionarios/TipoContacto"
import {  ICategoriaProducto  } from "src/areas/productos/models/CategoriaProducto"
import {  ICategoriaGrupo     } from "src/areas/productos/models/CategoriaGrupo"
import {  IConstante          } from "src/models/Diccionarios/Constante"
import {  IProveedor          } from "src/models/Diccionarios/Proveedor"
import {  ICuentaDinero       } from "src/models/Diccionarios/CuentaDinero"
import {  IReglaComision      } from "src/models/Diccionarios/ReglasComision"
import {  IBodega             } from "src/models/Diccionarios/Bodega"
import {  INaturalezaProducto } from "src/models/Diccionarios/NaturalezaProducto"
import {  ITransportadora     } from "src/models/Diccionarios/Transportadoras"

export interface IDexieStore {
  municipios              : IMunicipio[]
  usuarios                : Usuario[]
  tiposDocumento          : ITipoDocumento[]
  condicionesPago         : ICondicionPago[]
  formasPago              : IFormaPago[]
  metodosEntrega          : IMetodoEntrega[]
  origenesContacto        : IOrigenContacto[]
  unidades                : IUnidad[]
  tiemposEntrega          : ITiempoEntrega[]
  tiposContacto           : ITipoContacto[]
  categoriasProductos     : ICategoriaProducto[]
  gruposCategoria         : ICategoriaGrupo[]
  constantes              : IConstante[]
  proveedores             : IProveedor[]
  cuentasDinero           : ICuentaDinero[]
  reglasComision          : IReglaComision[]
  bodegas                 : IBodega[]
  naturalezaProductos     : INaturalezaProducto[]
  transportadoras         : ITransportadora[]

  municipiosC             : number // C es igual cuenta o count para saber el numero de cargas que se han hecho  
  usuariosC               : number
  tiposDocumentoC         : number
  condicionesPagoC        : number
  formasPagoC             : number
  metodosEntregaC         : number
  origenesContactoC       : number
  unidadesC               : number
  tiemposEntregaC         : number
  tiposContactoC          : number
  categoriasProductosC    : number
  gruposCategoriaC        : number
  constantesC             : number
  proveedoresC            : number
  cuentasDineroC          : number
  reglasComisionC         : number
  bodegasC                : number
  naturalezaProductosC    : number
  transportadorasC        : number
}



export const useStoreDexie = defineStore('dexie', {
  state: () :IDexieStore  => ({
    municipios            : [],
    usuarios              : [],
    tiposDocumento        : [],
    condicionesPago       : [],
    formasPago            : [],
    metodosEntrega        : [],
    origenesContacto      : [],
    unidades              : [],
    tiemposEntrega        : [],
    tiposContacto         : [],
    categoriasProductos   : [],
    gruposCategoria       : [],
    constantes            : [],
    proveedores           : [],
    cuentasDinero         : [],
    reglasComision        : [],
    bodegas               : [],
    naturalezaProductos   : [],
    transportadoras       : [],

    municipiosC           : 0,  // C es igual cuenta o count para saber el numero de cargas que se han hecho
    usuariosC             : 0,
    tiposDocumentoC       : 0,
    condicionesPagoC      : 0,
    formasPagoC           : 0,
    metodosEntregaC       : 0,
    origenesContactoC     : 0,
    unidadesC             : 0,
    tiemposEntregaC       : 0,
    tiposContactoC        : 0,
    categoriasProductosC  : 0,
    gruposCategoriaC      : 0,
    constantesC           : 0,
    proveedoresC          : 0,
    cuentasDineroC        : 0,
    reglasComisionC       : 0,
    bodegasC              : 0,
    naturalezaProductosC  : 0,
    transportadorasC      : 0,
    
  })
});

