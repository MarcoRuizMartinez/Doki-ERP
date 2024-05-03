<template>
  <!-- <q-input          filled dense hide-bottom-space clearable
    label           ="Dirección *"
    lazy-rules      ="ondemand"
    type            ="text"
    v-model         ="modelo"
    @blur           ="blur"
    :readonly       ="readonly"
    :rules          ="[ regla ]"
    >
    <template #prepend>
      <q-icon name    ="mdi-map-marker" />
    </template>
  </q-input> -->
  <input-text               clearable copy uppercase alerta
    v-model                 ="modelo"
    label                   ="Dirección"
    icon                    ="mdi-map-marker"
    :rules                  ="[ regla ]"
    :readonly               ="readonly"
    @blur                   ="blur"
    >
    <link-maps
      :municipio            ="municipio"
      :direccion            ="modelo"
    />    
  </input-text>
</template>

<script setup lang="ts">
  import    inputText         from "components/utilidades/input/InputFormText.vue"
  import    linkMaps          from "src/components/utilidades/LinkGoogleMaps.vue"
  import {  IMunicipio      } from "src/models/Municipio"  

  import {  computed,
            toRefs,
            PropType
                                  } from 'vue'  

            
  const props           = defineProps(
    {
      modelValue: { required: true ,  type: String              },
      municipio : { required: true,   type: Object as PropType< IMunicipio > },
      readonly  : { default:  false,  type: Boolean             },
    }
  )
  const emit            = defineEmits(["update:modelValue"])
  const modelo          = computed({
                            get: ()     => modelValue.value,
                            set: valor  =>
                            {
                              valor         = valor ?? ""
                              emit("update:modelValue", valor)
                            }
                          })

  const {
          modelValue,
          readonly
        }               = toRefs( props )


  function regla( texto : string )
  {
    return  (
              (
                !!texto
                &&
                texto.length >= 8
              )
            )
            ||
            "Dirección muy corta"
  }

  function blur()
    {
    let texto               = modelo.value
        texto               = texto .toUpperCase()
                                    .replace("CARRERA", "CR")
                                    .replace("CRR", "CR")
                                    .replace("CRA", "CR")
                                    .replace("KR", "CR")
                                    .replace("CAR ", "CR")
                                    .replace("CR", "CR ")
                                    .replace("CARREA ", "CR ")
                                    .replace("CARRETERA", "CARR")

                                    .replace("CALLE", "CL")
                                    .replace("CALEE", "CL")
                                    .replace("CAELLE", "CL")
                                    .replace("CALLLE", "CL")
                                    .replace("CLL", "CL")
                                    .replace("CL", "CL ")
                                    .replace("CALL ", "CL ")

                                    .replace("#", " ")
                                    .replace("/", " ")
                                    .replace("-", " ")
                                    .replace(".", " ")
                                    .replace(".", " ")
                                    .replace(",", " ")
                                    .replace("–", " ")
                                    .replace("_", " ")
                                    .replace("•", " ")
                                    .replace("+", " ")
                                    .replace(":", " ")
                                    .replace("·", " ")
                                    .replace("·", " ")

                                    .replace("N°", " ")
                                    .replace("Nº", " ")
                                    .replace("N°", " ")    
                                    .replace("N0", " ")
                                    .replace("NRO", " ")
                                    .replace("N°", " ")
                                    .replace("NO ", " ")
                              
                                    .replace("º", " ")
                                    .replace("°", " ")

                                    .replace("OFICINA", "OF")
                                    .replace("OFI", "OF")
                                    .replace("OFC", "OF")
                                    .replace("OFF", "OF")

                                    .replace("TRANSVERSAL", "TV")
                                    .replace("TRASVERSAL", "TV")
                                    .replace("TRANSV", "TV")
                                    .replace("TRANV", "TV")
                              
                                    .replace("TRANS", "TV")
                                    .replace("TRASV", "TV")
                                    .replace("TRAV", "TV")
                              
                                    .replace("TR ", "TV")
                                    .replace("TVS ", "TV")
                                    .replace("TVA ", "TV")
                                    .replace("TRV ", "TV")
                              
                                    .replace("PARQUE", "PAR")
                                    .replace("PARQ", "PAR")

                                    .replace("APARTAMENTO", "AP")
                                    .replace("APTO", "AP")
                                    .replace("APOT", "AP")
                                    .replace("APT", "AP")

                                    .replace("TORRE", "TO")
                                    .replace("TORR", "TO")
                                    .replace("TRR", "TO")

                                    .replace("LOCAL", "LC")

                                    .replace("BARRIO", "BRR")
                                    .replace("BLOQUE", "BL")
                                    .replace("BLQ", "BL")
                                    .replace("BLOC", "BL")
                                    .replace("AVENIDA", "AV")
                                    .replace("AVDA", "AV")

                                    .replace("BODEGA", "BG")
                                    .replace("INTERIOR", "IN")
                                    .replace("INT ", "IN ")
                                    .replace("EDIFICIO", "ED")
                                    .replace("EDIF", "ED")

                                    .replace("KILOMETRO", "KM")
                                    .replace("KL", "KM")
                                    .replace("KIM", "KM")
                                    .replace("SUPERMANZANA", "SM")
                                    .replace("MANZANA", "MZ")
                                    .replace("PISO", "P")
                                    .replace("AUTOPISTA", "AUT")
                                    .replace("AUTOP", "AUT")
                                    .replace("AUTO", "AUT")
                                    .replace("DIAGONAL", "DG")
                                    .replace("DIAGO", "DG")
                                    .replace("DIAG", "DG")
                                    .replace("CASA", "CA")
                              
                                    .replace("CENTRO COMERCIAL", "CC")
                                    .replace("CENTRO COMRCIAL", "CC")
                                    .replace("C COMERCIAL", "CC")
                                    .replace("CCO ", "CC ")
                                    .replace("C C ", "CC ")
                                    .replace("ADMINISTRACION", "AD")
                                    .replace("AGENCIA", "AG")
                                    .replace("AGRUPACION", "AGP")
                                    .replace("ALMACEN", "ALM")
                                    .replace("ALTILLO", "AL")
                                    .replace("APARTADO", "APTDO")
                                    .replace("BOULEVAR", "BLV")
                                    .replace("CAMINO", "CN")
                                    .replace("CELULA", "CEL")
                                    .replace("CIRCULAR", "CIR")
                                    .replace("CIRCUNVALAR", "CRV")
                                    .replace("CONJUNTO RESIDENCIAL", "CON")
                                    .replace("CONJUNTO", "CONJ")    
                                    .replace("CONSULTORIO", "CS")
                                    .replace("CORREGIMIENTO", "CORR")
                                    .replace("DEPARTAMENTO", "DPTO")
                                    .replace("DEPOSITO SOTANO", "DS")
                                    .replace("DEPOSITO", "DP")
                                    .replace("ENTRADA", "EN")
                                    .replace("ESQUINA", "ESQ")
                                    .replace("EXTERIOR", "EX")
                                    .replace("FINCA", "FCA")
                                    .replace("GARAJE SOTANO", "GS")
                                    .replace("GARAJE", "GJ")    
                                    .replace("HACIENDA", "HC")
                                    .replace("LOCAL MEZZANINE", "LM")
                                    .replace("LOTE", "LT")
                                    .replace("MEZZANINE", "MN")
                                    .replace("MODULO", "MD")
                                    .replace("MUNICIPIO", "MCP")
                                    .replace("OCCIDENTE", "OCC")
                                    .replace("ORIENTE", "O")
                                    .replace("PARCELA", "PA")    
                                    .replace("PARQUEADERO", "PQ")
                                    .replace("PASAJE", "PJ")
                                    .replace("PASEO", "PS")
                                    .replace("PENTHOUSE", "PH")
                                    .replace("PLANTA", "PL")
                                    .replace("PORTERIA", "POR")
                                    .replace("PREDIO", "PD")
                                    .replace("PUENTE", "PN")
                                    .replace("PUESTO", "PT")
                                    .replace("SALON COMUNAL", "SC")
                                    .replace("SALON", "SA")
                                    .replace("SECTOR", "SEC")
                                    .replace("SEMISOTANO", "SS")
                                    .replace("SOLAR", "SL")
                                    .replace("SOTANO", "ST")
                                    .replace("SUITE", "SU")    
                                    .replace("TERMINAL", "TER")
                                    .replace("TERRAZA", "TZ")
                                    .replace("UNIDAD RESIDENCIAL", "UR")
                                    .replace("UNIDAD", "UN")
                                    .replace("URBANIZACION", "URB")
                                    .replace("VARIANTE", "VTE")
                                    .replace("VEREDA", "VDA")
                                    .replace("ZONA FRANCA", "ZF")
                                    .replace("ZONA", "ZN")

                                    .replace("ª", "A")
                                    .replace("0A", "0 A")
                                    .replace("1A", "1 A")
                                    .replace("2A", "2 A")
                                    .replace("3A", "3 A")
                                    .replace("4A", "4 A")
                                    .replace("5A", "5 A")
                                    .replace("6A", "6 A")
                                    .replace("7A", "7 A")
                                    .replace("8A", "8 A")
                                    .replace("9A", "9 A")
                                    .replace("0B", "0 B")
                                    .replace("1B", "1 B")
                                    .replace("2B", "2 B")
                                    .replace("3B", "3 B")
                                    .replace("4B", "4 B")
                                    .replace("5B", "5 B")
                                    .replace("6B", "6 B")
                                    .replace("7B", "7 B")
                                    .replace("8B", "8 B")
                                    .replace("9B", "9 B")
                                    .replace("0C", "0 C")
                                    .replace("1C", "1 C")
                                    .replace("2C", "2 C")
                                    .replace("3C", "3 C")
                                    .replace("4C", "4 C")
                                    .replace("5C", "5 C")
                                    .replace("6C", "6 C")
                                    .replace("7C", "7 C")
                                    .replace("8C", "8 C")
                                    .replace("9C", "9 C")
                                    .replace("0D", "0 D")
                                    .replace("1D", "1 D")
                                    .replace("2D", "2 D")
                                    .replace("3D", "3 D")
                                    .replace("4D", "4 D")
                                    .replace("5D", "5 D")
                                    .replace("6D", "6 D")
                                    .replace("7D", "7 D")
                                    .replace("8D", "8 D")
                                    .replace("9D", "9 D")
                                    .replace("0E", "0 E")
                                    .replace("1E", "1 E")
                                    .replace("2E", "2 E")
                                    .replace("3E", "3 E")
                                    .replace("4E", "4 E")
                                    .replace("5E", "5 E")
                                    .replace("6E", "6 E")
                                    .replace("7E", "7 E")
                                    .replace("8E", "8 E")
                                    .replace("9E", "9 E")
                                    .replace("0F", "0 F")
                                    .replace("1F", "1 F")
                                    .replace("2F", "2 F")
                                    .replace("3F", "3 F")
                                    .replace("4F", "4 F")
                                    .replace("5F", "5 F")
                                    .replace("6F", "6 F")
                                    .replace("7F", "7 F")
                                    .replace("8F", "8 F")
                                    .replace("9F", "9 F")
                                    .replace("0G", "0 G")
                                    .replace("1G", "1 G")
                                    .replace("2G", "2 G")
                                    .replace("3G", "3 G")
                                    .replace("4G", "4 G")
                                    .replace("5G", "5 G")
                                    .replace("6G", "6 G")
                                    .replace("7G", "7 G")
                                    .replace("8G", "8 G")
                                    .replace("9G", "9 G")
                                    .replace("0H", "0 H")
                                    .replace("1H", "1 H")
                                    .replace("2H", "2 H")
                                    .replace("3H", "3 H")
                                    .replace("4H", "4 H")
                                    .replace("5H", "5 H")
                                    .replace("6H", "6 H")
                                    .replace("7H", "7 H")
                                    .replace("8H", "8 H")
                                    .replace("9H", "9 H")
                                    .replace("0I", "0 I")
                                    .replace("1I", "1 I")
                                    .replace("2I", "2 I")
                                    .replace("3I", "3 I")
                                    .replace("4I", "4 I")
                                    .replace("5I", "5 I")
                                    .replace("6I", "6 I")
                                    .replace("7I", "7 I")
                                    .replace("8I", "8 I")
                                    .replace("9I", "9 I")
                                    .replace("0J", "0 J")
                                    .replace("1J", "1 J")
                                    .replace("2J", "2 J")
                                    .replace("3J", "3 J")
                                    .replace("4J", "4 J")
                                    .replace("5J", "5 J")
                                    .replace("6J", "6 J")
                                    .replace("7J", "7 J")
                                    .replace("8J", "8 J")
                                    .replace("9J", "9 J")
                                    .replace("0K", "0 K")
                                    .replace("1K", "1 K")
                                    .replace("2K", "2 K")
                                    .replace("3K", "3 K")
                                    .replace("4K", "4 K")
                                    .replace("5K", "5 K")
                                    .replace("6K", "6 K")
                                    .replace("7K", "7 K")
                                    .replace("8K", "8 K")
                                    .replace("9K", "9 K")
                                    .replace("A0", "A 0")
                                    .replace("A1", "A 1")
                                    .replace("A2", "A 2")
                                    .replace("A3", "A 3")
                                    .replace("A4", "A 4")
                                    .replace("A5", "A 5")
                                    .replace("A6", "A 6")
                                    .replace("A7", "A 7")
                                    .replace("A8", "A 8")
                                    .replace("A9", "A 9")

                                    .replace("B0", "B 0")
                                    .replace("B1", "B 1")
                                    .replace("B2", "B 2")
                                    .replace("B3", "B 3")
                                    .replace("B4", "B 4")
                                    .replace("B5", "B 5")
                                    .replace("B6", "B 6")
                                    .replace("B7", "B 7")
                                    .replace("B8", "B 8")
                                    .replace("B9", "B 9")
                                    .replace("C0", "C 0")
                                    .replace("C1", "C 1")
                                    .replace("C2", "C 2")
                                    .replace("C3", "C 3")
                                    .replace("C4", "C 4")
                                    .replace("C5", "C 5")
                                    .replace("C6", "C 6")
                                    .replace("C7", "C 7")
                                    .replace("C8", "C 8")
                                    .replace("C9", "C 9")
                                    .replace("D0", "D 0")
                                    .replace("D1", "D 1")
                                    .replace("D2", "D 2")
                                    .replace("D3", "D 3")
                                    .replace("D4", "D 4")
                                    .replace("D5", "D 5")
                                    .replace("D6", "D 6")
                                    .replace("D7", "D 7")
                                    .replace("D8", "D 8")
                                    .replace("D9", "D 9")
                                    .replace(/[^A-Z /\-/0-9]+/g,"")
                                    .replace(/\s+/g,' ')
                              
                                    .replace("AV CR", "AK")
                                    .replace("AV CL", "AC")    

                                    .trim()

    modelo.value            = texto
  }
</script>