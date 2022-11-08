import {  defineStore         } from 'pinia';
import {  IUsuario, Usuario   } from 'src/areas/usuarios/models/Usuario'
import {  IPermisos,
          Permisos
                              } from "src/areas/usuarios/models/Permisos"

interface IUserState {
  fondo:      string,
  patron:     string,
  logueado:   boolean,
  token:      string,
  usuario:    IUsuario,
  permisos:   IPermisos
}
                              
export const  useStoreUser = defineStore('user', {
  state: () : IUserState => ({
    fondo:      "Dream.webp",
    patron:     "Abstracto.png",
    logueado:   false,
    token:      "",
    usuario:    new Usuario(),
    permisos:   new Permisos(),
  }),


  actions: {
    setFondo(fondo : string){
      this.fondo              = fondo
      
      const fondoCSS          = "url('images/fondos/" + this.fondo + "')"  
      document.body.style.backgroundImage = fondoCSS
    },    
    setPermisos( jsonPermisos : string ){
      let arrayPermisos

      try {
        arrayPermisos         = JSON.parse( jsonPermisos )
      } catch(e) {
        console.warn("Error en setPermisos:", e)
        this.permisos         = new Permisos()
        //console.log("this.permisos: ", this.permisos);
        return
      }      
      

      let objectoConPermisos  = {}
  
      for (const permiso of arrayPermisos) {
        Object.assign(objectoConPermisos, permiso);
      }
  
      this.permisos    = Object.assign( new Permisos(), objectoConPermisos )      
    },    
  }
});
