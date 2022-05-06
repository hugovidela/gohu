<template>
  <v-layout align-start>
    <v-flex>
      <v-dialog v-model="dialog" :fullscreen="true" persistent>
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
          <span
            class="headdline">Consulta de Precios / {{empresa}} Dolar: {{$store.state.dolar}}
          </span>
        </v-toolbar>
        <v-card>
          <v-card-text>
            <v-row>
              <v-col cols="6" sm="6" md="6">
                <v-text-field
                  label="Código o descripción o código de barra"
                  :color="temas.forms_titulo_bg"
                  autofocus
                  v-model="busArt"
                  @input="buscarArt">
                </v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12" sm="12" md="12">
                <v-data-table
                  :headers="headersArt"
                  :items="selArt" dense
                  class="elevation-3"
                  :footer-props="{itemsPerPageOptions: [14],showFirstLastPage: true}">
                  <template v-slot:item.precio="{ item }">
                    <span disable dark>$
                      {{ formatoImporte(
                        item.usd ? $store.state.dolar*item.usd : item.precio
                      ) }}
                    </span>
                    <v-badge v-if=
                      "item.ancla"
                      class="pt-1"
                      :content="'ancla'"
                      :color="temas.forms_btn_add_bg"
                      :dark="temas.forms_btn_add_bg==true">
                    </v-badge>
                  </template>
                  <template v-slot:item.fechaprecio="{ item }">
                    <span>{{ fechadelprecio(item.fechaprecio) }} </span>
                  </template>
                  <template v-slot:item.stock="{ item }">
                    <span>{{ formatoImporte(item.stock) }}</span>
                  </template>
                  <template v-slot:item.costo="{ item }">
                    <span>{{ formatoImporte(item.costo) }}</span>
                  </template>
                  <template v-slot:item.descuento="{ item }">
                    <span v-if="item.descuento>0">%{{ formatoImporte(item.descuento) }}</span>
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
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';
import XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import Confirmacion from "./Forms/confirmacion.vue"

export default {
  components: {
    Confirmacion,
  },
  data: () => ({
    dialog: true,
    footerProps: {'items-per-page-options': [15]},
    selArt: [],
    busArt: '',
    // definimos los headers de la datatables
    headersArt: [
      { text: 'Código', value:'codigo', align: 'left', width: 120},
      { text: 'PROVEEDOR', value:'username', align: 'left', width: 110},
      { text: 'DESCRIPCION', value:'nombre', align: 'left', width: 400},
      { text: 'Fecha del Precio', value:'fechaprecio', sortable: false, align: 'left', width: 110},
      { text: 'DESC.', value:'descuento', align: 'end', width: 90},
      { text: 'PUBLICO', value:'precio', align: 'end', width: 150},
      { text: 'Stock', value:'stock', align: 'end', width: 150},
    ],

  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState([
      'vinculosPadres', 'vinculosHijos', 'empresa', 'tipo', 'temas', 'dolar'
    ]),
  },
  methods: {
    closeForm(){
      this.dialog = false;
      if (this.tipo=='UE') {
        router.push('/ue')
      } else {
        router.push('/')
      }
    },
    buscarArt() {
      debugger
      let b = this.busArt
      let v = this.$store.state.vinculosPadres
      return HTTP().post('/userarticulosfac', {
        search: b,
        vinculos: v,
        estricto: false,
        userex: null,
        dolar: this.$store.state.dolar
         })
        .then(({ data }) => {
          this.selArt = []
          debugger
          for (let i=0; i<=data.length-1; i++) {
            this.selArt.push({
              id: data[i].id, codigo: data[i].codigo, nombre: data[i].nombre, precio: data[i].final,
              username: data[i].username, fechaprecio: data[i].fechaprecio,
              stock: data[i].stock, usd: data[i].usd, ancla: data[i].ancla, descuento: data[i].descuento
            })
          }
        })
    },
    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    fechadelprecio (fecha) {
      return moment(fecha).fromNow(true);
    },


  }
}
</script>
