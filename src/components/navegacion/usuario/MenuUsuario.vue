<template>
  <q-btn                  dense round
    color                 ="primary"
    >
    <q-avatar>
      <img                :src="usuario.fotoPerfilMini">
    </q-avatar>
    <q-menu
      class               ="panel-blur"
      transition-show     ="jump-down"
      transition-hide     ="jump-up"
      >
      <div                class="row no-wrap q-pa-md">
        <div              class="column min-w-max">
          <div            class="text-h6 q-mb-md">
            Ajustes
          </div>
          <q-btn
            v-bind        ="style.btnBaseMd"
            :href         ="urlPerfil"
            class         ="q-mb-sm"
            color         ="positive"
            icon          ="mdi-account-details"
            label         ="Perfil"
            size          ="sm"
            target        ="_blank"
          />
          <q-btn
            v-bind        ="style.btnBaseMd"
            class         ="q-mb-sm"
            color         ="accent"
            icon          ="mdi-palette"
            label         ="Apariencia"
            size          ="sm"
            @click        ="ventanaApariencia = true"
          />
          <q-btn          v-close-popup
            v-bind        ="style.btnBaseMd"
            color         ="secondary"
            label         ="Limpiar"
            size          ="sm"
            icon          ="mdi-eraser-variant"
            @click        ="limpiar"
          />
        </div>
        <q-separator      class="q-mx-lg" vertical inset />
        <div              class="column items-center">
          <q-avatar       size="72px">
            <img          :src="usuario.fotoPerfilMedia">
          </q-avatar>
          <div            class="text-subtitle1 q-mt-md q-mb-xs">
            {{usuario.nombre}}
          </div>
          <q-btn          v-close-popup
            v-bind        ="style.btnBaseMd"
            color         ="negative"
            label         ="Salir"
            size          ="sm"
            icon          ="mdi-door-open"
            @click        ="salir"
          />
        </div>
      </div>
    </q-menu>
  </q-btn>
  <q-dialog
    v-model               ="ventanaApariencia"
    v-bind                ="style.dialogo"
    >
    <apariencia />
  </q-dialog>
</template>


<script setup lang="ts">

  import {  ref,
            computed          } from "vue"
  import    apariencia          from "./Apariencia.vue"
  import {  useStoreUser      } from 'stores/user'
  import {  limpiarDB         } from "src/composables/useDexie"
  import {  style             } from "src/composables/useEstilos"
  import {  useRouter         } from 'vue-router'
  import {  Tool              } from "src/composables/useTools"
  import {  AlmacenesLimpiar  } from "src/models/TiposVarios"
  const router                    = useRouter()
  const ventanaApariencia         = ref(false)
  const storeUser                 = useStoreUser()
  const usuario                   = computed( () => storeUser.usuario)
  const urlPerfil                 = computed( () => process.env.URL_DOLIBARR + "/user/card.php?id=" + storeUser.usuario.id + "&action=edit")

  function salir()
  {
    //store.commit('usuario/setLogueado', false)
    storeUser.logueado = false
  }

  async function limpiar()
  {
    limpiarLocal()
    await limpiarDB()
    router.push("/")
    await Tool.pausa(500)
    location.reload()
  }

  function limpiarLocal(){
    AlmacenesLimpiar.forEach( a => localStorage.removeItem( process.env.PREFIJO + a ) )
  }
</script>