
export const enum TABLA_PERMISOS {
  //* ///////////////////////////////////////// Terceros
  terceros_ver	                                = '_121',
  terceros_ver_proveedor	                      = '_1181',
  terceros_crear	                              = '_122',
  terceros_borrar	                              = '_125',
  acceso_total 	                                = '_262',
  terceros_exportar	                            = '_126',
  //* ////////////////////////////////////////  / Contactos
  contactos_ver	                                = '_281',
  contactos_crear	                              = '_282',
  contactos_borrar	                            = '_283',
  contactos_exportar	                          = '_286',
  //* ////////////////////////////////////////  / Pedidos
  pedido_ver		                                = '_81',
  pedido_crear	                                = '_82',
  pedido_validar	                              = '_84',
  pedido_enviar	                                = '_86',
  pedido_cerrar	                                = '_87',
  pedido_cancelar	                              = '_88',
  pedido_eliminar	                              = '_89',

  prove_pedido_ver	                            = '_1182',
  prove_pedido_crear	                          = '_1183',
  prove_pedido_validar	                        = '_1184',
  prove_pedido_aprobar	                        = '_1185',
  prove_pedido_solicitar	                      = '_1186',
  prove_pedido_recibir	                        = '_1187',
  prove_pedido_eliminar	                        = '_1188',
  prove_pedido_marcar	                          = '_1189',

  margen_ver	                                  = '_59001',
  margen_definir	                              = '_59002',
  margen_ver_todo	                              = '_59003',
  producto_ver	                                = '_31',
  producto_borrar	                              = '_34',
  producto_crear	                              = '_32',
  producto_exportar	                            = '_38',
  producto_no_precio_min	                      = '_39',

  usuarios_ver_todo	                            = '_251',
  usuario_editar	                              = '_342',
  usuario_clave	                                = '_343',

  cotizar_ver	                                  = '_21',
  cotizar_crear	                                = '_22',
  cotizar_validar	                              = '_24',
  cotizar_enviar	                              = '_25',
  cotizar_cerrar	                              = '_26',
  cotizar_borrar	                              = '_27',
  cotiar_exportar	                              = '_28',
}


export interface IPermisos {
  [TABLA_PERMISOS.terceros_ver]                  : number
  [TABLA_PERMISOS.terceros_ver_proveedor]        : number
  [TABLA_PERMISOS.terceros_crear]                : number
  [TABLA_PERMISOS.terceros_borrar]               : number
  [TABLA_PERMISOS.acceso_total]                  : number
  [TABLA_PERMISOS.contactos_ver]                 : number
  [TABLA_PERMISOS.contactos_crear]               : number
  [TABLA_PERMISOS.contactos_borrar]              : number
  [TABLA_PERMISOS.terceros_exportar]             : number
  [TABLA_PERMISOS.contactos_exportar]            : number

  [TABLA_PERMISOS.pedido_ver]                    : number
  [TABLA_PERMISOS.pedido_crear]                  : number
  [TABLA_PERMISOS.pedido_validar]                : number
  [TABLA_PERMISOS.pedido_enviar]                 : number
  [TABLA_PERMISOS.pedido_cerrar]                 : number
  [TABLA_PERMISOS.pedido_cancelar]               : number
  [TABLA_PERMISOS.pedido_eliminar]               : number
  [TABLA_PERMISOS.prove_pedido_ver]              : number
  [TABLA_PERMISOS.prove_pedido_crear]            : number
  [TABLA_PERMISOS.prove_pedido_validar]          : number
  [TABLA_PERMISOS.prove_pedido_aprobar]          : number
  [TABLA_PERMISOS.prove_pedido_solicitar]        : number
  [TABLA_PERMISOS.prove_pedido_recibir]          : number
  [TABLA_PERMISOS.prove_pedido_eliminar]         : number
  [TABLA_PERMISOS.prove_pedido_marcar]           : number
  [TABLA_PERMISOS.margen_ver]                    : number
  [TABLA_PERMISOS.margen_definir]                : number
  [TABLA_PERMISOS.margen_ver_todo]               : number
  [TABLA_PERMISOS.producto_ver]                  : number
  [TABLA_PERMISOS.producto_crear]                : number
  [TABLA_PERMISOS.producto_borrar]               : number
  [TABLA_PERMISOS.producto_exportar]             : number
  [TABLA_PERMISOS.producto_no_precio_min]        : number
  [TABLA_PERMISOS.usuarios_ver_todo]             : number
  [TABLA_PERMISOS.usuario_editar]                : number
  [TABLA_PERMISOS.usuario_clave]                 : number

  [TABLA_PERMISOS.cotizar_ver]                   : number
  [TABLA_PERMISOS.cotizar_crear]                 : number
  [TABLA_PERMISOS.cotizar_validar]               : number
  [TABLA_PERMISOS.cotizar_enviar]                : number
  [TABLA_PERMISOS.cotizar_cerrar]                : number
  [TABLA_PERMISOS.cotizar_borrar]                : number
  [TABLA_PERMISOS.cotiar_exportar]               : number
  


  terceros_ver                                  : boolean
  terceros_ver_proveedor                        : boolean
  terceros_crear                                : boolean
  terceros_borrar                               : boolean
  acceso_total                                  : boolean
  contactos_ver                                 : boolean
  contactos_crear                               : boolean
  contactos_borrar                              : boolean
  terceros_exportar                             : boolean
  contactos_exportar                            : boolean

  pedido_ver                                    : boolean
  pedido_crear                                  : boolean
  pedido_validar                                : boolean
  pedido_enviar                                 : boolean
  pedido_cerrar                                 : boolean
  pedido_cancelar                               : boolean
  pedido_eliminar                               : boolean
  prove_pedido_ver                              : boolean
  prove_pedido_crear                            : boolean
  prove_pedido_validar                          : boolean
  prove_pedido_aprobar                          : boolean
  prove_pedido_solicitar                        : boolean
  prove_pedido_recibir                          : boolean
  prove_pedido_eliminar                         : boolean
  prove_pedido_marcar                           : boolean
  margen_ver                                    : boolean
  margen_definir                                : boolean
  margen_ver_todo                               : boolean
  producto_ver                                  : boolean
  producto_crear                                : boolean
  producto_borrar                               : boolean
  producto_exportar                             : boolean
  producto_no_precio_min                        : boolean
  usuarios_ver_todo                             : boolean
  usuario_editar                                : boolean
  usuario_clave                                 : boolean
  cotizar_ver                                   : boolean
  cotizar_crear                                 : boolean
  cotizar_validar                               : boolean
  cotizar_enviar                                : boolean
  cotizar_cerrar                                : boolean
  cotizar_borrar                                : boolean
  cotiar_exportar                               : boolean
  
  terceros_crear_proveedor                      : boolean
  
  
}

export class Permisos implements IPermisos
{
  [TABLA_PERMISOS.terceros_ver]!                 : number
  [TABLA_PERMISOS.terceros_ver_proveedor]!       : number
  [TABLA_PERMISOS.terceros_crear]!               : number
  [TABLA_PERMISOS.terceros_borrar]!              : number
  [TABLA_PERMISOS.acceso_total]!                 : number
  [TABLA_PERMISOS.contactos_ver]!                : number
  [TABLA_PERMISOS.contactos_crear]!              : number
  [TABLA_PERMISOS.contactos_borrar]!             : number
  [TABLA_PERMISOS.terceros_exportar]!            : number
  [TABLA_PERMISOS.contactos_exportar]!           : number
  [TABLA_PERMISOS.pedido_ver]!                   : number
  [TABLA_PERMISOS.pedido_crear]!                 : number
  [TABLA_PERMISOS.pedido_validar]!               : number
  [TABLA_PERMISOS.pedido_enviar]!                : number
  [TABLA_PERMISOS.pedido_cerrar]!                : number
  [TABLA_PERMISOS.pedido_cancelar]!              : number
  [TABLA_PERMISOS.pedido_eliminar]!              : number
  [TABLA_PERMISOS.prove_pedido_ver]!             : number
  [TABLA_PERMISOS.prove_pedido_crear]!           : number
  [TABLA_PERMISOS.prove_pedido_validar]!         : number
  [TABLA_PERMISOS.prove_pedido_aprobar]!         : number
  [TABLA_PERMISOS.prove_pedido_solicitar]!       : number
  [TABLA_PERMISOS.prove_pedido_recibir]!         : number
  [TABLA_PERMISOS.prove_pedido_eliminar]!        : number
  [TABLA_PERMISOS.prove_pedido_marcar]!          : number
  [TABLA_PERMISOS.margen_ver]!                   : number
  [TABLA_PERMISOS.margen_definir]!               : number
  [TABLA_PERMISOS.margen_ver_todo]!              : number
  [TABLA_PERMISOS.producto_ver]!                 : number
  [TABLA_PERMISOS.producto_crear]!               : number
  [TABLA_PERMISOS.producto_borrar]!              : number
  [TABLA_PERMISOS.producto_exportar]!            : number
  [TABLA_PERMISOS.producto_no_precio_min]!       : number
  [TABLA_PERMISOS.usuarios_ver_todo]!            : number
  [TABLA_PERMISOS.usuario_editar]!               : number
  [TABLA_PERMISOS.usuario_clave]!                : number
  [TABLA_PERMISOS.cotizar_ver]!                  : number
  [TABLA_PERMISOS.cotizar_crear]!                : number
  [TABLA_PERMISOS.cotizar_validar]!              : number
  [TABLA_PERMISOS.cotizar_enviar]!               : number
  [TABLA_PERMISOS.cotizar_cerrar]!               : number
  [TABLA_PERMISOS.cotizar_borrar]!               : number
  [TABLA_PERMISOS.cotiar_exportar]!              : number  

  constructor( )  
  {
    this[TABLA_PERMISOS.terceros_ver]            = 0
    this[TABLA_PERMISOS.terceros_crear]          = 0
    this[TABLA_PERMISOS.terceros_borrar]         = 0
    this[TABLA_PERMISOS.acceso_total]            = 0
    this[TABLA_PERMISOS.contactos_ver]           = 0
    this[TABLA_PERMISOS.contactos_crear]         = 0
    this[TABLA_PERMISOS.contactos_borrar]        = 0
    this[TABLA_PERMISOS.pedido_ver]              = 0
    this[TABLA_PERMISOS.pedido_crear]            = 0
    this[TABLA_PERMISOS.pedido_validar]          = 0
    this[TABLA_PERMISOS.pedido_enviar]           = 0
    this[TABLA_PERMISOS.pedido_cerrar]           = 0
    this[TABLA_PERMISOS.pedido_cancelar]         = 0
    this[TABLA_PERMISOS.pedido_eliminar]         = 0
    this[TABLA_PERMISOS.terceros_ver_proveedor]  = 0
    this[TABLA_PERMISOS.prove_pedido_ver]        = 0
    this[TABLA_PERMISOS.prove_pedido_crear]      = 0
    this[TABLA_PERMISOS.prove_pedido_validar]    = 0
    this[TABLA_PERMISOS.prove_pedido_aprobar]    = 0
    this[TABLA_PERMISOS.prove_pedido_solicitar]  = 0
    this[TABLA_PERMISOS.prove_pedido_recibir]    = 0
    this[TABLA_PERMISOS.prove_pedido_eliminar]   = 0
    this[TABLA_PERMISOS.prove_pedido_marcar]     = 0
    this[TABLA_PERMISOS.margen_ver]              = 0
    this[TABLA_PERMISOS.margen_definir]          = 0
    this[TABLA_PERMISOS.margen_ver_todo]         = 0
    this[TABLA_PERMISOS.producto_ver]            = 0
    this[TABLA_PERMISOS.producto_crear]          = 0
    this[TABLA_PERMISOS.producto_borrar]         = 0
    this[TABLA_PERMISOS.producto_exportar]       = 0
    this[TABLA_PERMISOS.producto_no_precio_min]  = 0
    this[TABLA_PERMISOS.usuarios_ver_todo]       = 0
    this[TABLA_PERMISOS.usuario_editar]          = 0
    this[TABLA_PERMISOS.usuario_clave]           = 0
    this[TABLA_PERMISOS.cotizar_ver]             = 0
    this[TABLA_PERMISOS.cotizar_crear]           = 0
    this[TABLA_PERMISOS.cotizar_validar]         = 0
    this[TABLA_PERMISOS.cotizar_enviar]          = 0
    this[TABLA_PERMISOS.cotizar_cerrar]          = 0
    this[TABLA_PERMISOS.cotizar_borrar]          = 0
    this[TABLA_PERMISOS.cotiar_exportar]         = 0
  }

  get terceros_ver                  () : boolean { return Boolean( this[TABLA_PERMISOS.terceros_ver ] ) }
  get terceros_ver_proveedor        () : boolean { return Boolean( this[TABLA_PERMISOS.terceros_ver_proveedor ] ) }
  get terceros_crear                () : boolean { return Boolean( this[TABLA_PERMISOS.terceros_crear ] ) }
  get terceros_borrar               () : boolean { return Boolean( this[TABLA_PERMISOS.terceros_borrar ] ) }
  get acceso_total                  () : boolean { return Boolean( this[TABLA_PERMISOS.acceso_total ] ) }
  get contactos_ver                 () : boolean { return Boolean( this[TABLA_PERMISOS.contactos_ver ] ) }
  get contactos_crear               () : boolean { return Boolean( this[TABLA_PERMISOS.contactos_crear ] ) }
  get contactos_borrar              () : boolean { return Boolean( this[TABLA_PERMISOS.contactos_borrar ] ) }  
  get terceros_exportar             () : boolean { return Boolean( this[TABLA_PERMISOS.terceros_exportar ] ) }
  get contactos_exportar            () : boolean { return Boolean( this[TABLA_PERMISOS.contactos_exportar ] ) }
  get pedido_ver                    () : boolean { return Boolean( this[TABLA_PERMISOS.pedido_ver ] ) }
  get pedido_crear                  () : boolean { return Boolean( this[TABLA_PERMISOS.pedido_crear ] ) }
  get pedido_validar                () : boolean { return Boolean( this[TABLA_PERMISOS.pedido_validar ] ) }
  get pedido_enviar                 () : boolean { return Boolean( this[TABLA_PERMISOS.pedido_enviar ] ) }
  get pedido_cerrar                 () : boolean { return Boolean( this[TABLA_PERMISOS.pedido_cerrar ] ) }
  get pedido_cancelar               () : boolean { return Boolean( this[TABLA_PERMISOS.pedido_cancelar ] ) }
  get pedido_eliminar               () : boolean { return Boolean( this[TABLA_PERMISOS.pedido_eliminar ] ) }
  get prove_pedido_ver              () : boolean { return Boolean( this[TABLA_PERMISOS.prove_pedido_ver ] ) }
  get prove_pedido_crear            () : boolean { return Boolean( this[TABLA_PERMISOS.prove_pedido_crear ] ) }
  get prove_pedido_validar          () : boolean { return Boolean( this[TABLA_PERMISOS.prove_pedido_validar ] ) }
  get prove_pedido_aprobar          () : boolean { return Boolean( this[TABLA_PERMISOS.prove_pedido_aprobar ] ) }
  get prove_pedido_solicitar        () : boolean { return Boolean( this[TABLA_PERMISOS.prove_pedido_solicitar ] ) }
  get prove_pedido_recibir          () : boolean { return Boolean( this[TABLA_PERMISOS.prove_pedido_recibir ] ) }
  get prove_pedido_eliminar         () : boolean { return Boolean( this[TABLA_PERMISOS.prove_pedido_eliminar ] ) }
  get prove_pedido_marcar           () : boolean { return Boolean( this[TABLA_PERMISOS.prove_pedido_marcar ] ) }
  get margen_ver                    () : boolean { return Boolean( this[TABLA_PERMISOS.margen_ver ] ) }
  get margen_definir                () : boolean { return Boolean( this[TABLA_PERMISOS.margen_definir ] ) }
  get margen_ver_todo               () : boolean { return Boolean( this[TABLA_PERMISOS.margen_ver_todo ] ) }
  get producto_ver                  () : boolean { return Boolean( this[TABLA_PERMISOS.producto_ver ] ) }
  get producto_crear                () : boolean { return Boolean( this[TABLA_PERMISOS.producto_crear ] ) }
  get producto_borrar               () : boolean { return Boolean( this[TABLA_PERMISOS.producto_borrar ] ) }
  get producto_exportar             () : boolean { return Boolean( this[TABLA_PERMISOS.producto_exportar ] ) }
  get producto_no_precio_min        () : boolean { return Boolean( this[TABLA_PERMISOS.producto_no_precio_min ] ) }
  get usuarios_ver_todo             () : boolean { return Boolean( this[TABLA_PERMISOS.usuarios_ver_todo ] ) }
  get usuario_editar                () : boolean { return Boolean( this[TABLA_PERMISOS.usuario_editar ] ) }
  get usuario_clave                 () : boolean { return Boolean( this[TABLA_PERMISOS.usuario_clave ] ) }
  get cotizar_ver                   () : boolean { return Boolean( this[TABLA_PERMISOS.cotizar_ver ] ) }
  get cotizar_crear                 () : boolean { return Boolean( this[TABLA_PERMISOS.cotizar_crear ] ) }
  get cotizar_validar               () : boolean { return Boolean( this[TABLA_PERMISOS.cotizar_validar ] ) }
  get cotizar_enviar                () : boolean { return Boolean( this[TABLA_PERMISOS.cotizar_enviar ] ) }
  get cotizar_cerrar                () : boolean { return Boolean( this[TABLA_PERMISOS.cotizar_cerrar ] ) }
  get cotizar_borrar                () : boolean { return Boolean( this[TABLA_PERMISOS.cotizar_borrar ] ) }
  get cotiar_exportar               () : boolean { return Boolean( this[TABLA_PERMISOS.cotiar_exportar ] ) }

  get terceros_crear_proveedor      () : boolean { return this.terceros_ver_proveedor && this.prove_pedido_aprobar  }
}