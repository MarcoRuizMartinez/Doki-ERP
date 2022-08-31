import {  boot    } from 'quasar/wrappers'
import    Tooltip   from "components/utilidades/Tooltip.vue"

export default boot(async ({ app }) => {
    app.component("Tooltip", Tooltip)
})