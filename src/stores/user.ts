import { defineStore          } from 'pinia';
import {  IUsuario, Usuario   } from 'src/areas/usuarios/models/Usuario'
import {  IPermisos,
          Permisos
                              } from "src/areas/usuarios/models/Permisos"


export interface iUserState {
  fondo:      string,
  patron:     string,
  logueado:   boolean,
  token:      string,
  usuario:    IUsuario,
  permisos:   IPermisos
}
                              
export const  useStoreUser = defineStore('user', {
  state: () : iUserState => ({
    fondo:      "Dream.webp",
    patron:     "Abstracto.png",
    logueado:   false,
    token:      "",
    usuario:    new Usuario(),
    permisos:   new Permisos(),
  }),


  actions: {
    setFondo(fondo : string){
      this.fondo        = fondo
      
      const fondoCSS    = "url('images/fondos/" + this.fondo + "')"  
      document.body.style.backgroundImage = fondoCSS
    },    
    setPermisos( jsonPermisos : string ){
      let arrayPermisos       = JSON.parse( jsonPermisos )
      let objectoConPermisos  = {}
  
      for (const permiso of arrayPermisos) {
        Object.assign(objectoConPermisos, permiso);
      }
  
      this.permisos    = Object.assign( new Permisos(), objectoConPermisos )
    },    
  }
});
