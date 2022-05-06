<template>
  <v-layout align-start class="ma-0">
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
        class="elevation-3"
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
                <b>POSICIONES DE IVA</b>
              </v-chip>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-chip v-for="anio in anios"
                :key="anio.id" dense :value="anio.id" label
                :color="anio==elAnio ? temas.cen_card_activo_bg : temas.barra_principal_bg"
                :dark="anio==elAnio ? temas.cen_card_activo_dark : temas.barra_principal_dark"
                class="ml-1 meses"
                @click="setAnio(anio)">
                {{ anio.substr(2,2) }}
              </v-chip>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-chip v-for="mes in meses"
                :key="mes.id" dense :value="mes.id" label
                :color="mes==elMes ? temas.cen_card_activo_bg : temas.barra_principal_bg"
                :dark="mes==elMes ? temas.cen_card_activo_dark : temas.barra_principal_dark"
                class="ml-1 meses"
                @click="setMes(mes)">
                {{ mes }}
              </v-chip>

              <v-progress-circular v-if="progress==true"
                class="ml-2"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-circular>
            </v-toolbar-title>

          </v-toolbar>
          <v-col cols="12" sm="12">  <!-- Barra de búsqueda  -->
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              :color="temas.forms_titulo_bg"
              class="pt-0"
              single-line hide-details>
            </v-text-field>
          </v-col>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-data-table
              :headers="headersItems"
              :items="item.items"
              dense
              hide-default-footer>
              <template v-slot:item.nombre="{ item }">
                <span disable dark> {{
                  item.codigo=='1@1' ? item.texto : item.nombre
                }}</span>
              </template>
              <template v-slot:item.precio="{ item }">
                <span disable dark>${{ formatoImporte(item.precio) }}</span>
              </template>
              <template v-slot:item.total="{ item }">
                <span disable dark>${{ formatoImporte(item.total) }}</span>
              </template>
            </v-data-table>
          </td>
        </template>

        <template #item.nombre="{ value }">
          <div class="text-truncate" style="max-width: 170px">
            {{ value }}
          </div>
        </template>
        <template v-slot:item.fecha="{ item }">
          <span disable dark>{{ formatoFechaCorta(item.fecha) }}</span>
        </template>
        <template v-slot:item.gravado="{ item }">
          <span disable dark>$ {{ formatoImporte(item.gravado) }}</span>
        </template>
        <template v-slot:item.exento="{ item }">
          <span disable dark>$ {{ formatoImporte(item.exento) }}</span>
        </template>
        <template v-slot:item.iva="{ item }">
          <span disable dark>$ {{ formatoImporte(item.iva) }}</span>
        </template>
        <template v-slot:item.total="{ item }">
          <span disable dark>$ {{ formatoImporte(item.total) }}</span>
        </template>
      </v-data-table>

      <v-row>
        <v-col v-for="(cbt, idx) in comprasventas" v-bind:key="idx">
          <v-card tile outlined @click="selectCompraVenta(cbt.nombre)"
            max-width="300" class="mx-auto">
            <v-app-bar
              :color="cbt.nombre==filtroComprasVentasSel ? temas.cen_card_activo_bg : cbt.bg"
              :dark="cbt.nombre==filtroComprasVentasSel ? temas.cen_card_activo_dark : cbt.dark">
              <v-toolbar-title class="noti-font">{{ cbt.nombre }}</v-toolbar-title>

              <v-spacer></v-spacer>
              <v-btn fab outlined x-small v-show="cbt.nombre!='POSICION'"
                class="mt-1"
                :color="temas.forms_close_bg"
                :dark="temas.forms_close_dark==true"
                @click="masInformacion(cbt)">
                <v-icon>mdi-information-outline</v-icon>
              </v-btn>

              <v-spacer></v-spacer>
              <v-chip class="ml-0" label v-if="cbt.cerrado"
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark"
                @click="generarCITI(cbt)">
                <b>{{ accion(cbt, 'citi') }}</b><br>
                <!--<progress max="100" :value.prop="uploadPercentage"></progress>-->
              <br>
              </v-chip>
              <v-spacer></v-spacer>
              <v-chip class="ml-0" label v-show="cbt.nombre!='POSICION'"
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark"
                @click="abrirCerrar(cbt)">
                <b>{{ accion(cbt,'iva') }}</b>
              </v-chip>
            </v-app-bar>
            <v-container>
              <v-simple-table dense>
                <template v-slot:default>
                  <tbody>
                    <tr v-for="(d, idz) in cbt.det" v-bind:key="idz">
                      <td>{{d.nombre}}</td>
                      <td class="det-font-bold">$ {{ formatoImporte(d.total) }}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-container>
          </v-card>
        </v-col>

        <v-col>
          <v-card tile outlined
            max-width="300" class="mx-auto">
            <v-app-bar>
              <v-toolbar-title class="noti-font">AFIP</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-chip class="ml-0" label
                v-if="comprasventas.comciti && comprasventas.venciti"
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark"
                @click="generarPresentacion(cbt)">
                <b>Presentar</b><br>
                <br>
              </v-chip>
              <v-spacer></v-spacer>
            </v-app-bar>
            <v-container>
              <v-simple-table dense>
                <template v-slot:default>
                  <tbody>
                    <tr>
                      <td>Presentado</td>
                      <td>{{presentacion.presentado ? 'Sí' : 'No'}}</td>
                    </tr>
                    <tr>
                      <td>Fecha</td>
                      <td>{{formatoFechaCorta(presentacion.fecha)}}</td>
                    </tr>
                    <tr>
                      <td>Importe</td>
                      <td class="det-font-bold">$ {{ formatoImporte(presentacion.importe) }}</td>
                    </tr>
                    <tr>
                      <td>Cpr</td>
                      <td>{{presentacion.comprobante_id}}</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <!-- ERROR EN EL PEDIDO -->
      <v-dialog v-model="dialogMasInfo" max-width="450px" persistent>
        <template v-slot:activator="{ on }"></template>
        <v-card>
          <v-toolbar flat
            :dark="temas.forms_titulo_dark==true"
            :color="temas.forms_titulo_bg">
            <v-btn
              icon @click="dialogMasInfo=false"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="headdline">
              MAS DATOS SOBRE EL PERIODO
            </span>
          </v-toolbar>

          <div>
            <v-data-table
              :headers="headersMasInfo"
              :items="masInfo"
              dense
              class="elevation-3 pl-0"
              :hide-default-footer="true"
              :items-per-page='[25]'>
              <template v-slot:item.importe="{ item }">
                <span>${{ formatoImporte(item.importe) }}</span>
              </template>
            </v-data-table>
          </div>
        </v-card>
      </v-dialog>
      <!-- FIN DEL ERROR EN EL PEDIDO -->

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

import HTTP from '../../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../../router';
import moment from 'moment';
import SBar from './../Forms/snackbar.vue';
import Confirmacion from "./../Forms/confirmacion.vue"
import XLSX from 'xlsx'
import jsPDF from 'jspdf'
import impresiones from "./../Forms/impresiones.vue";

export default {
  components: {
    SBar,
    Confirmacion,
    impresiones,
  },
  data: () => ({
    elMes: '',
    elAnio: '',
    anio: '',
    anios: [],
    meses: [],
    items: [],
    losMeses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'],
    expanded: [],
    singleExpand: false,
    progress: false,
    cen_activo_bg: '',
    cen_activo_color: '',
    cen_activo_dark: '',
    periodos: [],
    comprasventas: [
      { nombre: 'VENTAS', 
        det: [{ nombre: 'Gravado', total: 0 }, 
              { nombre: 'Exento',  total: 0 },
              { nombre: 'IVA',     total: 0 },
              { nombre: 'Total',   total: 0 }],
        masDet: [{ nombre: 'No Gravado', total: 0 },
                 { nombre: 'Ret.IVA', total: 0},
                 { nombre: 'Ret.Gan', total: 0},
                 { nombre: 'Ret.IIBB', total: 0},
                 { nombre: 'Imp.Interno', total: 0}],
        alicuotas: [{}],
        bg: '', dark: '', activo: true, cerrado: false, citi: false },
      { nombre: 'COMPRAS',
        det: [{ nombre: 'Gravado', total: 0 }, 
              { nombre: 'Exento',  total: 0 },
              { nombre: 'IVA',     total: 0 },
              { nombre: 'Total',   total: 0 }],
        masDet: [{ nombre: 'No Gravado', total: 0 },
                 { nombre: 'Ret.IVA', total: 0},
                 { nombre: 'Ret.Gan', total: 0},
                 { nombre: 'Ret.IIBB', total: 0},
                 { nombre: 'Imp.Interno', total: 0}],
        alicuotas: [{}],
        bg: '', dark: '', activo: true, cerrado: false, citi: false },
      { nombre: 'POSICION',
        det: [{ nombre: 'Gravado', total: 0 }, 
              { nombre: 'Exento',  total: 0 },
              { nombre: 'IVA',     total: 0 },
              { nombre: 'Total',   total: 0 }],
        masDet: [{ nombre: 'No Gravado', total: 0 },
                 { nombre: 'Ret.IVA', total: 0},
                 { nombre: 'Ret.Gan', total: 0},
                 { nombre: 'Ret.IIBB', total: 0},
                 { nombre: 'Imp.Interno', total: 0}],
        alicuotas: [{}],
        bg: '', dark: '', activo: true, cerrado: false },
    ],
    presentacion: {
      presentado: false,
      fecha: moment().format('L'),
      importe: 0,
      comprobante_id: ''
    },
    filtroComprasVentasSel: 'VENTAS',
    formTitle: '',
    formTitleArt: '',
    formTitleMed: '',
    itemActual: null,
    tl: "text-lowercase",
    articulos: [],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    footerProps: {'items-per-page-options': [6]},
    search: '',               // para el cuadro de búsqueda de datatables
    dialogMasInfo: false,     // para que la ventana de dialogo o modal no aparezca automáticamente
    masInfo: [],

    perEstado: '',
    perAccion: '',
    perModulo: '',
    perFiscal: '',

    file: '',
    uploadPercentage: 0,

    // definimos los headers de la datatables
    headers: [
      { text: 'COMPROBANTE', value:'cpr', align: 'left', width: 175 },
      { text: 'FECHA', value:'fecha', align: 'left', width: 89 },
      { text: 'NOMBRE', value:'tercero.nombre', align: 'left', width: 300 },
      { text: 'GRAVADO', value:'gravado', align: 'end', width: 120 },
      { text: 'EXENTO', value:'exento', align: 'end', width: 120 },
      { text: 'IVA', value:'iva', align: 'end', width: 120 },
      { text: 'TOTAL', value:'total', align: 'end', width: 120 },
    ],
    headersItems: [
      { text: 'Código', value:'articulo.codigo', class: 'grey lighten-3'},
      { text: 'Descripción', value:'articulo.nombre', class: "grey lighten-3"},
      { text: 'Ctt', value:'cantidad', align: 'end', class: "grey lighten-3"},
      { text: 'Precio', value:'precio', align: 'end', width: 120, class: "grey lighten-3"},
      { text: 'IVA', value:'iva.nombre', align: 'end', width: 120, class: "grey lighten-3"},
      { text: 'Total', value:'total', align: 'end', width: 120, class: "grey lighten-3"},
    ],
    headersMasInfo: [
      { text: 'Item', value:'item', class: 'grey lighten-3'},
      { text: 'importe', value:'importe', class: "grey lighten-3"},
    ],
   
    editedIndex: -1,
  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState([
      'sucursal',
      'sucursales',
      'sucursalDemo',
      'sucursalFiscal',
      'tema',
      'temas',
      'centrales',
      'empresa',
      'datosEmpresa',
      'responsable',
      'cuit',
    ]),
  },

  watch: {
    '$store.state.sucursal' () {
      this.comprasventas[0].bg    = this.$store.state.temas.cen_facturas_bg
      this.comprasventas[0].dark  = this.$store.state.temas.cen_facturas_dark
      this.comprasventas[1].bg    = this.$store.state.temas.cen_creditos_bg
      this.comprasventas[1].dark  = this.$store.state.temas.cen_creditos_dark
      this.comprasventas[2].bg    = this.$store.state.temas.cen_debitos_bg
      this.comprasventas[2].dark  = this.$store.state.temas.cen_debitos_dark
      this.comprasventas[3].bg    = this.$store.state.temas.cen_presupuestos_bg
      this.comprasventas[3].dark  = this.$store.state.temas.cen_presupuestos_dark

      this.comprasventas[0].activo = !this.sucursalDemo
      this.comprasventas[1].activo = !this.sucursalDemo
      this.comprasventas[2].activo = !this.sucursalDemo

    },

    search(val) {
      this.$store.commit("setCentrales", {ventas_buscar: val}, { root: true });
      this.listarHTTP()
    },

  },

  mounted () {
    //this.$events.listen('testEvent', eventData => console.log(eventData));
    if (this.sucursalDemo) {
      this.comprasventas[0].activo = false
      this.comprasventas[1].activo = false
      this.comprasventas[2].activo = false
    } else {
      this.comprasventas[0].activo = true
      this.comprasventas[1].activo = true
      this.comprasventas[2].activo = true
    }
    this.$store.commit('closeAlert')
    moment.locale('es');
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      this.leoAnios().then(data => {
        this.listarHTTP()
      })
    }
  },

  created () {
    this.cen_activo_bg          = this.$store.state.temas.cen_card_activo_bg
    this.cen_activo_dark        = this.$store.state.temas.cen_card_activo_dark
    this.comprasventas[0].bg    = this.$store.state.temas.cen_facturas_bg
    this.comprasventas[0].dark  = this.$store.state.temas.cen_facturas_dark
    this.comprasventas[1].bg    = this.$store.state.temas.cen_creditos_bg
    this.comprasventas[1].dark  = this.$store.state.temas.cen_creditos_dark
    this.comprasventas[2].bg    = this.$store.state.temas.cen_debitos_bg
    this.comprasventas[2].dark  = this.$store.state.temas.cen_debitos_dark
  },

  methods: {
    ...mapMutations([
      'alert',
      'closeAlert',
      'setSucursal',
      'setSucursales',
      'setCentrales',
      'setTema',
      'setTemas',
      'setSucursalFiscal',
      'setNotificaciones',
      'setCaja',
      'setVinculasPadres',
      'setVinculasHijos',
      'setEmpresa',
      'setOperario',
      'setLevel',
    ]),

    /////////////////////////
    // METODOS DE CABECERA //
    /////////////////////////
    closeForm(){
      router.push('/')
    },

    selectCompraVenta(cual) {
      if (cual=='POSICION') return
      this.filtroComprasVentasSel = cual
      if (cual=='COMPRAS') {
        this.filtroComprasVentas = ['CO','GS']
      } else if (cual=='VENTAS') {
        this.filtroComprasVentas = ['VE']
      }
      this.listarHTTP()
    },

    listarHTTP() {
      this.perFiscal = ''
      if (this.elMes==undefined || this.elMes=='') return
      let m = this.queMesEs(this.elMes)
      this.perFiscal = this.anio+m
      this.progress = true

      debugger
      return HTTP().post('/posicionfiscal', {suc:this.sucursal,fil:this.filtroComprasVentasSel,per:this.perFiscal}).then(({data})=>{
        debugger
        this.items = []
        this.progress = false
        for (let i=0; i<=this.comprasventas.length-1; i++) {
          for (let j=0; j<=this.comprasventas[i].det.length-1; j++) {
            this.comprasventas[i].det[j].total = 0
          }
          for (let j=0; j<=this.comprasventas[i].masDet.length-1; j++) {
            this.comprasventas[i].masDet[j].total = 0
          }
          this.comprasventas[i].alicuotas = []
        }
        for (let i=0; i<=data.length-1; i++) {
          if (this.filtroComprasVentasSel=='VENTAS' && data[i].tipo=='VE') {
            this.items.push(data[i])
          } else if (this.filtroComprasVentasSel=='COMPRAS' && (data[i].tipo=='CO' || data[i].tipo=='GS')) {
            this.items.push(data[i])
          }
          if (data[i].tipo=='VE') {

            this.comprasventas[0].det[0].total += data[i].gravado
            this.comprasventas[0].det[1].total += data[i].exento
            this.comprasventas[0].det[2].total += data[i].iva
            this.comprasventas[0].det[3].total += data[i].total

            this.comprasventas[0].masDet[0].total += data[i].nogravado
            this.comprasventas[0].masDet[1].total += data[i].retiva
            this.comprasventas[0].masDet[2].total += data[i].retgan
            this.comprasventas[0].masDet[3].total += data[i].retib
            this.comprasventas[0].masDet[4].total += data[i].impint

            this.comprasventas[2].det[0].total += data[i].gravado
            this.comprasventas[2].det[1].total += data[i].exento
            this.comprasventas[2].det[2].total += data[i].iva
            this.comprasventas[2].det[3].total += data[i].total

            debugger
            for (let y=0; y<=data[i].afipiva.length-1; y++) {
              let pos = this.comprasventas[0].alicuotas.findIndex(x => x.tasa === data[i].afipiva[y].afipiva.tasa)
              if (pos==-1) {
                this.comprasventas[0].alicuotas.push({
                  tasa: data[i].afipiva[y].afipiva.tasa,
                  gravado: data[i].afipiva[y].base,
                  iva: data[i].afipiva[y].iva
                })
              } else {
                this.comprasventas[0].alicuotas[pos].gravado += data[i].afipiva[y].base;
                this.comprasventas[0].alicuotas[pos].iva += data[i].afipiva[y].iva;
              }
            }

          } else {

            this.comprasventas[1].det[0].total += data[i].gravado
            this.comprasventas[1].det[1].total += data[i].exento
            this.comprasventas[1].det[2].total += data[i].iva
            this.comprasventas[1].det[3].total += data[i].total

            this.comprasventas[1].masDet[0].total += data[i].nogravado
            this.comprasventas[1].masDet[1].total += data[i].retiva
            this.comprasventas[1].masDet[2].total += data[i].retgan
            this.comprasventas[1].masDet[3].total += data[i].retib
            this.comprasventas[1].masDet[4].total += data[i].impint

            this.comprasventas[2].det[0].total -= data[i].gravado
            this.comprasventas[2].det[1].total -= data[i].exento
            this.comprasventas[2].det[2].total -= data[i].iva
            this.comprasventas[2].det[3].total -= data[i].total

            for (let y=0; y<=data[i].afipiva.length-1; y++) {
              let pos = this.comprasventas[1].alicuotas.findIndex(x => x.tasa === data[i].afipiva[y].afipiva.tasa)
              if (pos==-1) {
                this.comprasventas[1].alicuotas.push({
                  tasa: data[i].afipiva[y].afipiva.tasa,
                  gravado: data[i].afipiva[y].base,
                  iva: data[i].afipiva[y].iva
                })
              } else {
                this.comprasventas[1].alicuotas[pos].gravado += data[i].afipiva[y].base;
                this.comprasventas[1].alicuotas[pos].iva += data[i].afipiva[y].iva;
              }
            }

          }
        }
        let pos = this.periodos.find(p => p.perfiscal == this.perFiscal)
        if (pos) {
          
          this.comprasventas[0].cerrado = pos.vencerrado
          this.comprasventas[1].cerrado = pos.comcerrado
          
          this.comprasventas[0].citi = pos.venciti
          this.comprasventas[1].citi = pos.comciti
        
        } else {
          
          this.comprasventas[0].cerrado = false
          this.comprasventas[1].cerrado = false
          
          this.comprasventas[0].citi = false
          this.comprasventas[1].citi = false
        
        }

        this.presentacion.presentado     = data[0].presentado
        this.presentacion.fecha          = data[0].fecha
        this.presentacion.importe        = data[0].importe
        this.presentacion.comprobante_id = data[0].comprobante_id

        }).catch(function (error) {
        console.log(error);
        this.progress = false
      })
    },

    queMesEs(mes) {
      this.elMes = mes
      let p = this.losMeses.indexOf(mes)
      p ++
      p = '0'+p
      p = p.substr(-2)
      return p
    },

    leoAnios() {
      return HTTP().post('anios/', {tipo: 'A'}).then(({ data }) => {
        this.anios = []
        this.meses = []
        this.periodos = []
        let pos = -1

        for (let i=0; i<=data[0].length-1; i++) {
          this.periodos.push(data[0][i].perfiscal)
          pos = this.anios.findIndex( x => x == data[0][i].perfiscal.substring(0,4))
          if (pos==-1) {
            this.anios.push(data[0][i].perfiscal.substring(0,4))
          }
        }
        for (let i=0; i<=this.periodos.length-1; i++) {
          if (this.periodos[i].substring(0,4)==this.anios[0]) {
            pos = Number(data[0][i].perfiscal.substring(4))-1
            this.meses.push(this.losMeses[pos])
          }
        }
        this.anio = this.anios[0]
        this.elAnio = this.anio
        let mesActual = moment().format('MMM').substring(0,3)
        pos = this.meses.findIndex(x => x.toUpperCase() === mesActual.toUpperCase())
        if (pos==-1) {
          // porque aun no hay movimientos en el mes actual, busco en el anterior
          if (this.meses.length>0) {
            this.elMes = this.meses[this.meses.length-1]
          } else {
            this.elMes = ''
          }
        } else {
          this.elMes = this.meses[pos]
        }
        return HTTP().post('/periodos/').then(({ data }) => {
          if (data) {
            this.presentacion.presentado     = data[0].presentado
            this.presentacion.fecha          = data[0].fecha
            this.presentacion.importe        = data[0].importe
            this.presentacion.comprobante_id = data[0].comprobante_id
            this.anio = this.anios[0]
            this.elAnio = this.anio
            this.elMes = this.meses[0]
          }
        })
      })
    },

    setAnio(anio) {
      debugger
      if (anio) {
        this.anio = anio
      } else {
        this.anio = moment().format('YYYY')
      }
      this.meses = []
      for (let i=0; i<=this.periodos.length-1; i++) {
        if (this.periodos[i].substring(0,4)==this.anio) {
          let pos = Number(this.periodos[i].substring(4))-1
          this.meses.push(this.losMeses[pos])
        }
      }
      this.elMes = this.meses[0]
      this.elAnio = this.anio
      this.listarHTTP(false)
    },

    setMes(mes) {
      this.elMes = mes
      this.listarHTTP()
    },

    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },

    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
        }
      }
      this.msg.msgVisible = false;
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatoFechaCorta(value) {
      return moment(String(value)).format('DD-MM-YY')
    },

    print(item) {
      this.$refs.impresion.ventasPrint(item, 'yo');
    },

    accion(cbt, cual) {
      let ret = ''
      if (cbt!=null) {
        if (cbt.nombre=='POSICION') {
          return
        } else if (cbt.nombre=='VENTAS') {
          if (cual=='iva') {
            if (cbt.cerrado) {
              ret = 'Abrir'
            } else {
              ret = 'Cerrar'
            }
          } else if (cual=='citi') {
            if (cbt.citi) {
              ret = 'Ver CITI'
            } else {
              ret = 'Generar CITI'
            }
          }
        } else if (cbt.nombre=='COMPRAS') {
          if (cual=='iva') {
            if (cbt.cerrado) {
              ret = 'Abrir'
            } else {
              ret = 'Cerrar'
            }
          } else if (cual=='citi') {
            if (cbt.citi) {
              ret = 'Ver CITI'
            } else {
              ret = 'Generar CITI'
            }
          }
        }
        return ret
      }
    },

    abrirCerrar(cbt) {
      this.perEstado = cbt.cerrado ? 'cerrado' : 'abierto'
      this.perAccion = cbt.cerrado ? 'abrir'   : 'cerrar'
      this.perModulo = cbt.nombre
      let m = ''
      this.msg.msgTitle = 'Cambiar estado del Período'
      m  = '<br>El período esta <b>' + this.perEstado + '</b> para el módulo <b>' + this.perModulo + '</b>.<br><br>'
      m += 'IMPORTANTE: Cuando el módulo este cerrado ninguna operación podra ser ingresada '
      m += 'para el período especificado.<br>'
      m += 'No obstante puede abrir o cerrar el módulo cuando lo crea necesario.<br><br>'
      m += 'Confirma ' + this.perAccion + ' el módulo seleccionado?<br><br>'
      this.msg.msgBody = m
      this.msg.msgVisible = true
      this.msg.msgAccion = 'cambiar estado'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item
    },

    generarCITI(cbt) {
      if (this.perEstado=='Abierto') {
        this.msg.msgTitle = 'El periodo esta Abierto'
        this.msg.msgBody = 'El período debe estar cerrado para poder generar el CITI'
        this.msg.msgVisible = true
        this.msg.msgAccion = 'periodo abierto'
        this.msg.msgButtons = ['Aceptar','Cancelar']
        this.itemActual = item
      } else {
        this.file = this.userId+'_'+this.perFiscal+'_CITI'+cbt.nombre
        this.perModulo = cbt.nombre
        let m = ''
        this.msg.msgTitle = 'Generar archivo CITI'
        m  = '<br>Confirma generar el CITI </b>' + cbt.nombre + ' para el período '+this.perFiscal+'</b>.<br>'
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'generar citi'
        this.msg.msgButtons = ['Aceptar','Cancelar']
        this.itemActual = cbt
      }
    },

    generarPresentacion(cbt) {
      if (this.perEstado=='Abierto') {
        this.msg.msgTitle = 'El periodo esta Abierto'
        this.msg.msgBody = 'El período debe estar cerrado para poder generar el CITI'
        this.msg.msgVisible = true
        this.msg.msgAccion = 'periodo abierto'
        this.msg.msgButtons = ['Aceptar','Cancelar']
        this.itemActual = item
      }
    },

    async msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='cambiar estado') {
          this.comprasventas[0].det[0].total = this.roundTo(this.comprasventas[0].det[0].total,2)
          this.comprasventas[0].det[1].total = this.roundTo(this.comprasventas[0].det[1].total,2)
          this.comprasventas[0].det[2].total = this.roundTo(this.comprasventas[0].det[2].total,2)
          this.comprasventas[0].det[3].total = this.roundTo(this.comprasventas[0].det[3].total,2)

          this.comprasventas[1].det[0].total = this.roundTo(this.comprasventas[1].det[0].total,2)
          this.comprasventas[1].det[1].total = this.roundTo(this.comprasventas[1].det[1].total,2)
          this.comprasventas[1].det[2].total = this.roundTo(this.comprasventas[1].det[2].total,2)
          this.comprasventas[1].det[3].total = this.roundTo(this.comprasventas[1].det[3].total,2)

          this.comprasventas[2].det[0].total = this.roundTo(this.comprasventas[2].det[0].total,2)
          this.comprasventas[2].det[1].total = this.roundTo(this.comprasventas[2].det[1].total,2)
          this.comprasventas[2].det[2].total = this.roundTo(this.comprasventas[2].det[2].total,2)
          this.comprasventas[2].det[3].total = this.roundTo(this.comprasventas[2].det[3].total,2)

          return HTTP().post('/posicionfiscalcambiarestado/', {
            periodo: this.perFiscal,
            estado: this.perEstado,
            accion: this.perAccion,
            modulo: this.perModulo,
            datos: this.comprasventas,
          }).then(({ data }) => {

            this.comprasventas[0].cerrado = data.vencerrado
            this.comprasventas[1].cerrado = data.comcerrado
            this.msg.msgVisible = false;

            return HTTP().post('/periodos/').then(({ data }) => {
              if (data) {
                this.periodos = data

                this.presentacion.presentado     = data[0].presentado
                this.presentacion.fecha          = data[0].fecha
                this.presentacion.importe        = data[0].importe
                this.presentacion.comprobante_id = data[0].comprobante_id

              }
            })

          })

        } else if (this.msg.msgAccion=='generar citi') {

          let cab = ''
          let det = ''
          let tmp = ''
          let ali = []
          for (let i=0; i<=this.items.length-1; i++) {

            if (this.perModulo == 'VENTAS') {

              cab += moment(this.items[i].fecha).format('YYYYMMDD')
              cab += this.items[i].comprobante.codigo
              cab += '0'+this.items[i].cpr.substr(6,4)
              cab += '000000000000'+this.items[i].cpr.substr(11,8)
              cab += '000000000000'+this.items[i].cpr.substr(11,8)
              cab += this.items[i].documento.codigo
              
              tmp = '00000000000000000000'+this.items[i].tercero.cuit.trim()
              tmp = tmp.substring(tmp.length-20,tmp.length)
              cab += tmp
  
              tmp = this.items[i].tercero.nombre.trim()
              tmp += '                              '
              tmp = tmp.substring(0,30)                       // nommbre
              cab += tmp
              cab += this.importe(this.items[i].total,15)     // total
              cab += '000000000000000'                        // conceptos que no integran el precio neto gravado
              cab += '000000000000000'                        // percepcion a no categorizados
              cab += this.importe(this.items[i].exento,15)    // exento
              cab += '000000000000000'                        // percepciones o pagos a cuenta de impuestos nacionales
              cab += '000000000000000'                        // percepciones de ingresos brutos
              cab += '000000000000000'                        // percepciones de impuestos municipales
              cab += '000000000000000'                        // impuestos internos
              cab += this.items[i].moneda.codigo
              cab += '0001000000'                             // tipo de cambio, va fijo
  
              ali = []
              for (let j=0; j<=this.items[i].items.length-1; j++) {
                if (ali.indexOf(this.items[i].items[j].iva_id)==-1) {
                  ali.push(this.items[i].items[j].iva_id)
                }
                det += this.items[i].comprobante.codigo
                det += '0'+this.items[i].cpr.substr(6,4)
                det += '000000000000'+this.items[i].cpr.substr(11,8)
                det += this.importe(this.items[i].items[j].total,15)   // total
                det += this.importe(this.items[i].items[j].iva.tasa,4) // alicuota de iva
                det += this.importe(this.items[i].items[j].total*(1+(this.items[i].items[j].iva.tasa/100)),15) // impuesto liquidado
                det += "\n"
              }
  
              cab +=  ali.length                              // cantidad de alicuotas de iva
              if (this.items[i].exento!=0) {
                cab += 'E'
              } else {
                cab += '1'
              }
  
              cab += '000000000000000'                        // Otros tributos
              cab += moment(this.items[i].fecha).format('YYYYMMDD')
              cab += "\n"

            } else {    // COMPRAS

              cab += moment(this.items[i].fecha).format('YYYYMMDD')
              cab += this.items[i].comprobante.codigo
              cab += '0'+this.items[i].cpr.substr(6,4)
              cab += '000000000000'+this.items[i].cpr.substr(11,8)
              cab += '                '
              cab += this.items[i].documento.codigo
              tmp = '00000000000000000000'+this.items[i].tercero.cuit.trim()
              tmp = tmp.substring(tmp.length-20,tmp.length)
              cab += tmp
  
              tmp = this.items[i].tercero.nombre.trim()
              tmp += '                              '
              tmp = tmp.substring(0,30)                       // nommbre
              cab += tmp
              cab += this.importe(this.items[i].total,15)     // total
              cab += '000000000000000'                        // conceptos que no integran el precio neto gravado
              cab += this.importe(this.items[i].exento,15)    // exento
              cab += '000000000000000'                        // percepciones o pagos a cuenta del IVA
              cab += '000000000000000'                        // percepciones o pagos a cuenta de impuestos nacionales
              cab += '000000000000000'                        // percepciones de ingresos brutos
              cab += '000000000000000'                        // percepciones de impuestos municipales
              cab += '000000000000000'                        // impuestos internos
  
              cab += this.items[i].moneda.codigo              // codigo de moneda
              cab += '0001000000'                             // tipo de cambio, va fijo
  
              ali = []
              for (let j=0; j<=this.items[i].items.length-1; j++) {
                if (ali.indexOf(this.items[i].items[j].iva_id)==-1) {
                  ali.push(this.items[i].items[j].iva_id)
                }

                det += this.items[i].comprobante.codigo
                det += '0'+this.items[i].cpr.substr(6,4)
                det += '000000000000'+this.items[i].cpr.substr(11,8)
                det += this.items[i].documento.codigo

                tmp = '00000000000000000000'+this.items[i].tercero.cuit.trim()
                tmp = tmp.substring(tmp.length-20,tmp.length)
                det += tmp

                det += this.importe(this.items[i].items[j].total,15)   // total
                det += this.importe(this.items[i].items[j].iva.tasa,4) // alicuota de iva
                det += this.importe(this.items[i].items[j].total*((this.items[i].items[j].iva.tasa/100)),15) // impuesto liquidado
                det += "\n"

              }
  
              cab +=  ali.length                              // cantidad de alicuotas de iva
              if (this.items[i].exento!=0) {
                cab += 'E'
              } else {
                cab += '1'
              }
              cab += '000000000000000'                        // credito fiscal computable
              cab += '000000000000000'                        // Otros tributos
              cab += '00000000000'                            // cuit emisor
              cab += '                              '         // nombre del emisor
              cab += '000000000000000'                        // iva comision
              cab += "\n"
            }
          }

          await HTTP().post('/generarciti', { 
            file: this.file,
            cab: cab,
            det: det,
            periodo: this.perFiscal,
            modulo: this.perModulo,
            })
            .then((data)=> {
              if (data) {
                this.msg.msgTitle = 'Atención'
                this.msg.msgBody = '¡Archivo CITI generado correctamente!'
                this.msg.msgVisible = true
                this.msg.msgAccion = 'CITI ok'
                this.msg.msgButtons = ['Aceptar']
                this.itemActual = item
              } else if (data=='error') {
                this.msg.msgTitle = 'Error'
                this.msg.msgBody = '¡Se ha producido un error al generar el archivo CITI!'
                this.msg.msgVisible = true
                this.msg.msgAccion = 'CITI Error'
                this.msg.msgButtons = ['Aceptar']
                this.itemActual = item
              }
              this.listarHTTP()
            })
        }
      }
      this.msg.msgVisible = false;
    },

    importe(i,l) {
      let imp = ''
      let tmp = ''
      imp = this.roundTo(i,2)
      imp = this.roundTo(Math.abs(imp)*100,2)
      if (l==15) {
        tmp = '000000000000000'+imp
      } else {
        tmp = '0000'+imp
      }
      //tmp = tmp.substring(tmp.length-l)
      tmp = tmp.substring(tmp.length-l,tmp.length)
      return tmp
    },

    masInformacion(cbt) {
      this.msg.msgTitle = 'Mas información: '+cbt.nombre+' - '+this.elMes+'/'+this.elAnio
      let p = cbt.nombre == 'VENTAS' ? 0 : 1
      this.masInfo = []
      this.masInfo.push({item: 'No Gravado',       importe: this.comprasventas[p].masDet[0].total})
      this.masInfo.push({item: 'Ret.IVA',          importe: this.comprasventas[p].masDet[1].total})
      this.masInfo.push({item: 'Ret.de Ganancias', importe: this.comprasventas[p].masDet[2].total})
      this.masInfo.push({item: 'Ret.de IIBB',      importe: this.comprasventas[p].masDet[3].total})
      this.masInfo.push({item: 'Imp.Internos',     importe: this.comprasventas[p].masDet[4].total})
      this.masInfo.push({item: 'Gravado',          importe: this.comprasventas[p].det[0].total})
      for (let i=0; i<=this.comprasventas[p].alicuotas.length-1; i++) {
        this.masInfo.push({
          item: '...al '+this.comprasventas[p].alicuotas[i].tasa+'%',
          importe: this.comprasventas[p].alicuotas[i].gravado},
        )
      }
      this.masInfo.push({item: 'Exento',           importe: this.comprasventas[p].det[1].total})
      this.masInfo.push({item: 'IVA',              importe: this.comprasventas[p].det[2].total})
      for (let i=0; i<=this.comprasventas[p].alicuotas.length-1; i++) {
        this.masInfo.push({
          item: '...al '+this.comprasventas[p].alicuotas[i].tasa+'%',
          importe: this.comprasventas[p].alicuotas[i].iva},
        )
      }
      this.masInfo.push({item: 'TOTAL',            importe: this.comprasventas[p].det[3].total})
      this.dialogMasInfo = true
    },
  },
};

</script>
<style scoped>
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
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 85%;
  }
  .noti-font {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
  }
  .det-font {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
  }
  .det-font-bold {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
    font-weight: 600;
  }

</style>