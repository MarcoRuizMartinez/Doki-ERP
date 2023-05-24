<template>
  <q-page                         padding
    class                         ="row pagina-login justify-center items-center"
    :style                        ="fondoApp"
    >
    <q-card
      class                       ="card-login shadow-5 col-md-5 col-sm-7 col-xs-12"
      >
      <q-card-section             horizontal
        class                     ="row items-center justify-center"
        style                     ="min-height: 280px;"
        >
        <div
          class                   ="col-4 gt-xs fondo-imagen"
          :style                  ="imagenFondo"
          style                   ="min-height: inherit;"
          >
        </div>
        <q-card-actions
          class                   ="justify-around col-sm-8 col-xs-12"
          >
          <q-form                 autofocus
            class                 ="fit column justify-center items-center q-mx-md"
            @submit.prevent       ="submit"
            > 
            <q-input              filled 
              lazy-rules          ="ondemand"
              debounce            ="300"
              v-model             ="usuario" 
              label               ="Usuario"
              class               ="q-mb-xs full-width"
              :disable            ="cargando"
              :rules              ="[ reglaNombre ]"
              @update:model-value ="buscarUsuario"
              >
              <!-- @blur               ="buscarUsuario" -->
              <template #prepend><q-icon name="mdi-account" /></template>
            </q-input>
            <q-input              filled
              lazy-rules          ="ondemand"
              v-model             ="clave" 
              label               ="Clave"
              class               ="full-width"
              type                ="password"
              :disable            ="cargando"
              :rules              ="[ reglaClave ]"
              >
              <template #prepend><q-icon name="mdi-onepassword" /></template>
            </q-input>
            <div class            ="row justify-center q-mt-none">
              <TransitionGroup
                appear
                enter-active-class="animated fadeInUp"
                leave-active-class="animated fadeOutDown"
                >
                <q-icon
                  v-if            ="!online"
                  name            ="mdi-wifi-off"
                  color           ="grey-10"
                  size            ="2rem"
                  class           ="q-mr-md">
                  <Tooltip label  ="Sin conexión"/>
                </q-icon>                  
              </TransitionGroup>   
              <q-btn
                v-bind            ="style.btnBaseMd"
                label             ="Entrar"
                type              ="submit"
                color             ="positive"
                icon              ="mdi-door-closed"
                :loading          ="cargando"
                :disable          ="!online"
              />
              <efecto efecto="UpDown">
                <q-btn
                  v-bind          ="style.btnBaseMd"
                  v-if            ="cargando"
                  class           ="q-ml-md"
                  label           ="Cancelar"
                  type            ="submit"
                  color           ="warning"
                  icon            ="mdi-close"
                  @click          ="abortar"
                />
              </efecto>
            </div>
          </q-form>
        </q-card-actions>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
  // * /////////////////////////////////////////////////////////////////////// Core
  import {  
            ref,
            watch,
            computed               
                              } from 'vue'
  import {  useRouter         } from "vue-router"
  // * /////////////////////////////////////////////////////////////////////// Store
  import {  storeToRefs       } from 'pinia'
  import {  useStoreUser      } from 'src/stores/user'
  import {  useStoreApp       } from 'src/stores/app'  
  // * /////////////////////////////////////////////////////////////////////// Componibles
  import {  useLogin          } from "src/services/useLogin"
  import {  style             } from "src/useSimpleOk/useEstilos"
  // * /////////////////////////////////////////////////////////////////////// Modelos
  import {  ORIGEN, 
            ALMACEN_LOCAL     } from "src/models/TiposVarios"
  // * /////////////////////////////////////////////////////////////////////// Componentes
  import    efecto              from "components/utilidades/Efecto.vue"

  const { logueado, fondo }       = storeToRefs( useStoreUser() )
  const storeApp                  = useStoreApp()
  const router                    = useRouter()
  
  const { iniciarSesionDolibarr,
          abortarIntentoLogin,
          buscarUsuarioDolibarr } = useLogin( ORIGEN.LOGIN )

  const usuario                   = ref < string  >("")
  const clave                     = ref < string  >("")
  const cargando                  = ref < boolean >(false) 
  let   pathOrigen                = ""
  
  watch(()=>router.currentRoute,
    ( ruta ) => pathOrigen        = ruta.value?.redirectedFrom?.fullPath ?? "",
    { immediate: true }
  )
  
  const online                    = computed(() => storeApp.online)
  
  const fondoApp                  = computed(() => "background-image: url('images/fondos/" + fondo.value + "');" )
  const imagenFondo               = computed(() => "background-image: url('" + imgFormulario.value + "');")

  const reglaNombre               = computed(() =>  ( val :any ) => val && val.length > 0 || 'Por favor escribe tu contraseña' )
  const reglaClave                = computed(() =>  ( val :any ) => val && val.length > 0 || 'Por favor escribe tu usuario'    )
  const imgFormulario             = computed(() =>
  {
    let aleatorio                 = parseInt( (Math.random() * 30).toString() )
    return  process.env.URL_DOLIBARR + "/_maco/img/fondos/" + aleatorio + ".jpg"   
  })

  async function submit()
  {
    cargando.value                = true      
    const loginOK                 = await iniciarSesionDolibarr({ usuario: usuario.value, clave: clave.value})
    cargando.value                = false
    if(loginOK){
      if(pathOrigen.length > 2)
        router.push(pathOrigen)
      else
        router.push("/")
    }
  }

  function abortar()
  {
    cargando.value                = false
    abortarIntentoLogin()
  }

  function buscarUsuario()
  {
    if(!usuario.value || usuario.value.length < 3) return
    
    buscarUsuarioDolibarr({ usuario: usuario.value, clave: clave.value})
  }
</script>

<style>
.card-login {
  background-color: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(7px);
}
.pagina-login {
  background-size: cover;
  background-position: center center;
  background-attachment: fixed;
  background-repeat: no-repeat;
}
</style>