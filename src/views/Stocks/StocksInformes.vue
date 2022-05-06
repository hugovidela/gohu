<template>
  <v-layout align-start>
    <v-flex>
      <v-dialog v-model="dialog" :fullscreen="true">
        <template v-slot:activator="{ on }"></template>
          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
          <v-btn
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            icon @click="closeForm">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>

          <span class="headdline">{{ empresa}} / Artículos / Informes</span>
        </v-toolbar>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="6" sm="6" md="6">
                <v-text-field
                  label="Código o descripción o código de barra"
                  autofocus
                  v-model="busArt"
                  @blur="buscarArt">
                </v-text-field>
              </v-col>
              <v-col cols="1" sm="1" md="1">
                <v-btn
                  fab small dark color="black">
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12" sm="12" md="12">
                <v-data-table
                  :headers="headersArt"
                  :items="selArt" dense
                  class="elevation-3"
                  :footer-props="footerProps">
                  <template v-slot:item.stock="{ item }">
                    <span disable dark>{{ formatoImporte(item.stock) }}</span>
                  </template>
                </v-data-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-flex>
  </v-layout>
</template>
<script>

/* eslint-disable */
import HTTP from '../../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../../router';
import XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import Confirmacion from "./../Forms/confirmacion.vue"

export default {
  components: {
    Confirmacion,
  },
  data: () => ({
    dialog: true,
    footerProps: {'items-per-page-options': [10]},
    selArt: [],
    busArt: '',
    // definimos los headers de la datatables
    headersArt: [
      { text: 'CODIGO', value:'codigo', align: 'left', width: 120},
      { text: 'DESCRIPCION', value:'nombre', align: 'left', width: 550},
      { text: 'UM', value:'unidad_id', align: 'end', width: 100},
      { text: 'GRUPO', value:'grupo_id', align: 'end', width: 100},
      { text: 'MARCA', value:'marca_id', align: 'end', width: 100},
      { text: 'STOCK', value:'stock', align: 'end', width: 150},
    ],

  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState([
      'vinculosPadres', 'vinculosHijos', 'empresa', 'temas'
    ]),
  },
  methods: {
    closeForm(){
      this.dialog = false;
      router.push('/')
    },
    buscarArt() {
      let b = this.busArt
      let v = this.$store.state.vinculosPadres
      return HTTP().post('/userarticulosfac', {search:b,vinculos:v,estricto:false,userex:null}).then(({data})=>{
        this.selArt = []
        debugger
        for (let i=0; i<=data.length-1; i++) {
          this.selArt.push({id: data[i].id, codigo: data[i].codigo, nombre: data[i].nombre, precio: data[i].precio, stock: data[i].stock})
        }
      })
    },
    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
  }
}
</script>
