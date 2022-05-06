<template>
  <v-layout align-start class="ma-0">
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        class="elevation-3 panel-font"
        :footer-props="footerProps">
        <template v-slot:top>

          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true"
              icon @click="closeForm">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>

            <v-toolbar-title
              :color="temas.forms_titulo_bg"
              :dark="temas.forms_titulo_dark==true"
              class="body-2" v-model="sucursal">
              <v-chip class="ml-0" label
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark">
                <v-icon left>
                  mdi-chart-bar
                </v-icon>
                <b class="panel-font">ESTADISTICAS</b>
              </v-chip>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-progress-circular v-if="progress==true"
                class="ml-2"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-circular>
            </v-toolbar-title>
          </v-toolbar>

          <!-- BARRA DE BUSQUEDA -->
          <v-row class="pl-3">
            <v-col cols="5" sm="5">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Buscar"
                :color="temas.forms_titulo_bg"
                class="pt-0"
                single-line hide-details>
              </v-text-field>
            </v-col>
          </v-row>
        </template>
        <template #item.username.razon_social="{ value }">
          <div class="text-truncate" style="max-width: 150px">
            {{ value }}
          </div>
        </template>
        <template v-slot:item.id="{ item }">
          <span disable dark class="mini-font">{{ item.id }}</span>
        </template>
        <template v-slot:item.username="{ item }">
          <span disable dark class="mini-font">{{ item.username }}</span>
        </template>
        <template v-slot:item.tipo="{ item }">
          <span disable dark class="mini-font">{{ item.tipo }}</span>
        </template>
        <template v-slot:item.externo="{ item }">
          <span disable dark class="mini-font">
            {{ item.externo ? 'Sí' : 'No'  }}
          </span>
        </template>
        <template v-slot:item.ingresoEl="{ item }">
          <span disable dark class="mini-font">
            {{ item.ingresoEl.substring(0,10) }}
          </span>
        </template>
        <template v-slot:item.cbtes="{ item }">
          <span disable dark class="mini-font">{{ item.cbtes }}</span>
        </template>
        <template v-slot:item.arts="{ item }">
          <span disable dark class="mini-font">{{ item.arts }}</span>
        </template>
        <template v-slot:item.vinhij="{ item }">
          <span disable dark class="mini-font">{{ item.vinhij }}</span>
        </template>
        <template v-slot:item.vinpad="{ item }">
          <span disable dark class="mini-font">{{ item.vinpad }}</span>
        </template>
        <template v-slot:item.saldo="{ item }">
          <span disable dark class="mini-font">
            $ {{ formatoImporte(roundTo(item.saldo,0)) }}
          </span>
        </template>
        <template v-slot:item.estado="{ item }">
          <span disable dark class="mini-font">{{ item.estado }}</span>
        </template>
        <template v-slot:item.estado="{ item }">
          <v-chip
            label
            class="mini-font"
            @mouseover="sayMessage(item, true)"
            @mouseleave="sayMessage(item, false)"
            :color="getEstado(item.estado,'c')"
            :dark="getEstado(item.estado,'k')">
            {{ getEstado(item.estado,'e') }}
          </v-chip>
        </template>
        <template v-slot:item.accion="{ item }">
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on"
                @click="setAcciones(item)">
                <v-icon>mdi-18px mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item-group :color="temas.forms_titulo_bg">
                <v-list-item
                  v-for="(item, i) in acciones" :key="i">
                  <v-list-item-icon>
                    <v-icon
                      class="font-size: 24px"
                      @click="selAccion(item)" v-text="item.icon">
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      class="caption" @click="selAccion(item)">{{ item.nombre }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>

      <impresiones ref="impresion"></impresiones>
      <SBar></SBar>
      <Confirmacion v-model='msg.msgAccion'
        :title=this.msg.msgTitle
        :body=this.msg.msgBody
        :visible=this.msg.msgVisible
        :buttons=this.msg.msgButtons
        @click="msgRespuesta">
      </Confirmacion>

    </v-flex>
  </v-layout>
</template>

<script>

/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';
import SBar from './Forms/snackbar.vue';
import Confirmacion from "./Forms/confirmacion.vue";
import impresiones from "./Forms/impresiones.vue";

export default {
  components: {
    SBar,
    Confirmacion,
    impresiones,
  },
  data: () => ({
    items: [],
    progress: false,

    // filtro
    tl: "text-lowercase",
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    //footerProps: {'items-per-page-options': [5, 5, 15, 100]},
    footerProps: {'items-per-page-options': [12] },
    search: '',               // para el cuadro de búsqueda de datatables
    dialog: false,            // para que la ventana de dialogo o modal no aparezca automáticamente

    // definimos los headers de la datatables
    headers: [
      { text: 'Id',       value:'id',       align: 'right',  width: 30 },
      { text: 'Usuario',  value:'username', align: 'left',  width: 100 },
      { text: 'Tipo',     value:'tipo',     align: 'left',  width: 40 },
      { text: 'Externo',  value:'externo',  align: 'left',  width: 60 },
      { text: 'Ingreso',  value:'ingresoEl',align: 'left',  width: 90 },
      { text: 'Cbtes',    value:'cbtes',    align: 'end',   width: 20 },
      { text: 'Arts',     value:'arts',     align: 'end',   width: 20 },
      { text: 'VinHij',   value:'vinhij',   align: 'end',   width: 20 },
      { text: 'VinPad',   value:'vinpad',   align: 'end',   width: 20 },
      { text: 'Saldo',    value:'saldo',    align: 'end',   width: 90 },
      { text: 'ACCIONES', value: 'accion',  sortable: false, width: 90 },
    ],
    editedIndex: -1,
  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState([
      'dolar', 'sucursal', 'sucursales', 'sucursalDemo', 'sucursalFiscal', 'tema', 'temas', 'centrales',
      'notificaciones', 'caja', 'vinculosPadres', 'vinculosHijos', 'empresa', 'datosEmpresa', 'responsable',
      'cuit', 'level',
    ]),
  },

  search(val) {
    this.listarHTTP(false)
  },

  mounted () {
    this.$store.commit('closeAlert')
    moment.locale('es');
    this.listarHTTP()
  },

  methods: {
    ...mapMutations([
      'alert', 'closeAlert', 'setSucursal', 'setSucursales', 'setCentrales', 'setTema', 'setTemas',
      'setSucursalFiscal', 'setNotificaciones', 'setCaja', 'setVinculasPadres', 'setVinculasHijos', 'setEmpresa',
    ]),

    /////////////////////////
    // METODOS DE CABECERA //
    /////////////////////////
    closeForm(){
      router.push('/')
    },

    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      if (item.total>0) {
        this.acciones.push({nombre: 'Facturar', icon: 'mdi-file'})
      } else if (item.total<0) {
        this.acciones.push({nombre: 'Pagar', icon: 'mdi-file'})
      }
    },

    async selAccion(item) {
      debugger
      if (item.nombre=='Facturar') {
        this.facturar(this.itemActual)
      } else if (item.nombre=='Pagar') {
        this.pagar(this.itemActual)
      }
    },

    getEstado (estado, accion) {
      let c = ''
      let e = ''
      let d = 0
      let f = false
      if (accion=='k') {   //para el dark
        if (estado==='P') {
          return this.temas.cen_estado_pendiente_dark
        } else if (estado==='T') {
          return this.temas.cen_estado_facturado_dark 
        } else if (estado==='F') {
          return this.temas.cen_estado_finalizado_dark
        }
      } else {
        if (estado==='P') {
          e = 'p/Facturar'
          c = this.temas.cen_estado_pendiente_bg 
        } else if (estado==='T') {
          e = 'Facturado'
          c = this.temas.cen_estado_facturado_bg 
        } else if (estado==='F') {
          e = 'Finalizado'
          c = this.temas.cen_estado_finalizado_bg
        }
      }
      return accion==='c' ? c : e
    },

    listarHTTP(refrescoMeses){
      this.progress = true
      let s = this.search.length>0 ? this.search : 'all'
      return HTTP().post('/estadisticas', { search: s }).then(({ data }) => {
        this.items = data
        this.progress = false
      }).catch(function (error) {
        console.log(error);
      })
    },

    //////////////////////////////
    // METODOS FUNCIONES VARIAS //
    //////////////////////////////
    roundTo(value, places){
      var power = Math.pow(10, places);
      return Math.round(value * power) / power;
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
      }
      this.msg.msgVisible = false;
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
  },
};
</script>


<style scoped lang="scss">
  .v-select__selections input { 
    display: none;
  }
  .select {
    min-width: 95px;
    max-width: 95px;
  }
  .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
    box-shadow: none;
  }
  .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
    box-shadow: none;
  }
  .panel-font {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .noti-font {
    font-family: Verdana, Arial, Helvetica, sans-serif;
    font-size: 90%;
  }
  .mini-font {
    font-size: 84%;
  }
  .text-green {
    color: rgba(169, 169, 169, 0.33);
  }
  .lafuente {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  }

  // 10299
</style>