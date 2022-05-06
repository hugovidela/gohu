<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table

        v-model="selected"
        :headers="headers"
        :items="items"
        @toggle-select-all="selectAll"
        :single-select="false"
        :search="search"
        item-key="tercero_id"
        show-select
        dense
        class="pl-1 pr-3 elevation-1 pt-2"
        :footer-props="footerProps">
        <template v-slot:top>

          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn icon @click="closeForm"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <template v-slot:extension>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="queTipoDeDeudaVer('A')" v-on="on">
                    <v-icon>mdi-emoticon</v-icon>
                  </v-btn>
                </template>
                <span>Todos</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="queTipoDeDeudaVer('T')" v-on="on">
                    <v-icon>mdi-emoticon-sad</v-icon>
                  </v-btn>
                </template>
                <span>Con deudas</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="queTipoDeDeudaVer('V')" v-on="on">
                    <v-icon>mdi-emoticon-devil</v-icon>
                  </v-btn>
                </template>
                <span>Con deudas vencidas</span>
              </v-tooltip>

              <v-spacer></v-spacer>

<!--
              <v-col cols="1" sx="1" mx="1" class="pr-0 pt-0 text-xs-right"
                v-if="selected.length">
                <span>Período</span>
              </v-col>
              <v-col cols="2" sx="2" mx="2" class="pt-6 pl-0" v-if="selected.length">
                <v-text-field
                  outlined
                  dense
                  type="date"
                  v-model="fechaDesde"
                  label="Fecha Desde">
                </v-text-field>
              </v-col>
              <v-col cols="2" sx="2" mx="2" class="pt-6" v-if="selected.length">
                <v-text-field
                  outlined
                  dense
                  type="date"
                  v-model="fechaHasta"
                  label="Fecha Hasta">
                </v-text-field>
              </v-col>
-->
              <v-tooltip bottom v-if="selected.length">
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="selectFechas(1)" v-on="on">
                    <v-icon>mdi-format-list-bulleted</v-icon>
                  </v-btn>
                </template>
                <span>Informe Resumido</span>
              </v-tooltip>

              <v-tooltip bottom v-if="selected.length">
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="selectFechas(2)" v-on="on">
                    <v-icon>mdi-format-line-weight</v-icon>
                  </v-btn>
                </template>
                <span>Informe c/Imputaciones</span>
              </v-tooltip>

              <v-tooltip bottom v-if="selected.length">
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="selectFechas(3)" v-on="on">
                    <v-icon>mdi-format-line-style</v-icon>
                  </v-btn>
                </template>
                <span>Informe c/Imputaciones y Valores</span>
              </v-tooltip>
            </template>

            <v-toolbar-title class="white--text">{{tituloResumen}}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <!-- DIALOGO DE FECHAS -->
            <v-dialog v-model="dialog" max-width="500px" persistent>
              <template v-slot:activator="{}"></template>
              <v-card>
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="dialog=false"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{formTitle}}
                  </span>
                  <v-spacer></v-spacer>
                  <span class="text--right">
                    <v-btn v-if="(fechaDesde<=fechaHasta || cualInforme===1)"
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class="ma-2 white--text" @click="print()">
                      Confirmar
                    </v-btn>
                  </span>
                </v-toolbar>
                <v-form>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6" sx="6" mx="6">
                          <v-text-field v-if="cualInforme!=1"
                            outlined autofocus type="date"
                            :color="temas.cen_btns_bg"
                            v-model="fechaDesde"
                            label="Fecha Desde">
                          </v-text-field>
                        </v-col>
                        <v-col cols="6" sx="6" mx="6">
                          <v-text-field
                            outlined type="date"
                            :color="temas.cen_btns_bg"
                            v-model="fechaHasta"
                            :label="cualInforme===1?'Vencidos al':'Fecha Hasta'">
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- ASIGNAR TERCEROS -->

          </v-toolbar>
          <v-col cols="12" sm="12">  <!-- Barra de búsqueda  -->
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              single-line hide-details>
            </v-text-field>
          </v-col>
        </template>
        <template v-slot:item.activo="{ item }">
          <v-chip :color="getColor(item.activo)" dark>{{ item.activo ? 'Sí' : 'No' }}</v-chip>
        </template>
        <template v-slot:item.saldo="{ item }">
          $ {{ formatoImporte(item.saldo,2) }}
        </template>
        <template v-slot:item.vencidos="{ item }">
          $ {{ formatoImporte(item.vencidos,2) }}
        </template>
      </v-data-table>
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
import Confirmacion from "./Forms/confirmacion.vue"
import XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    fechaDesde: moment().format('YYYY-MM-DD'),
    fechaHasta: moment().format('YYYY-MM-DD'),
    selected: [],
    modelo: '',
    cual: '',
    tituloResumen: '',
    itemActual: null,
    tipoDeDeuda: 'T',
    acciones: [],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    headersRes: [
      { text: 'Fecha', value:'fecha', align: 'left', width: 120 },
      { text: 'Total', value:'total', align: 'right', width: 120 }
    ],
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    items: [],
    headers: [
      { text: 'CLIENTE', value:'tercero_id', width: 110},
      { text: 'NOMBRE', value:'nombre', width: 500},
      { text: 'SUCURSAL', value:'sucnom', width: 200},
      { text: 'SALDO', value:'saldo', width: 160, align: 'end'},
      { text: 'VENCIDO', value:'vencidos', width: 160, align: 'end'},
    ],
    editedIndex: -1,
    editado: {
      id: '',
      nombre: '',
      activo: true,
    },
    defaultItem: {
      id: '',
      nombre: '',
      activo: true,
    },
    formTitle: '',
    cualInforme: 0,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState(['sucursal','empresa', 'tema', 'temas', 'logotipo']),
//    formTitle () {
//      return this.editedIndex === -1 ? 'Nuevo' : 'Editar';
//    },
  },
  watch: {
    '$route.path': function(val, oldVal){
      this.init_component();
    },
    '$store.state.sucursal' () {
      this.init_component()
    },
  },


  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    }
  },
  created () {
    this.init_component()
  },
  methods: {
    closeForm(){
      router.push('/')
    },





    init_component() {
      let a = this.$store.state.route.fullPath.substring(1,this.$store.state.route.fullPath.length)
      if (a=='resumenesclientes') {
        this.cual = 'C'
        this.tituloResumen = 'Resúmen de Cuentas Clientes'
        this.headers[0].text = 'Cliente'
      } else {
        this.cual = 'P'
        this.tituloResumen = 'Resúmen de Cuentas Proveedores'
        this.headers[0].text = 'Proveedor'
      }
      this.modelo = a;
      this.listarHTTP();
    },





    queTipoDeDeudaVer(cual) {
      this.tipoDeDeuda = cual
      this.listarHTTP();
    },





    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.items)
      const workbook = XLSX.utils.book_new()
      const filename = this.modelo
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },





    selectFechas(cual) {

      if (cual===1) {
        this.formTitle = 'Informe de Vencimientos'
      } else if (cual===2) {
        this.formTitle = 'Informe de Imputaciones'
      } else if (cual===3) {
        this.formTitle = 'Informe de Imputaciones y Valores'
      }

      this.cualInforme = cual
      this.dialog = true
    },





    print() {

      debugger
      let rangoDeFechas = [{fecha: this.fechaDesde}, {fecha: this.fechaHasta}]
      let tipo = this.cual == 'P' ? ["'CO'","'PG'","'GS'"] : ["'VE'","'RE'"]
      return HTTP().post('/infven_cuentascorrientes', {
        tipinf: this.cualInforme, tipo: tipo, terceros: this.selected, sucursal: this.sucursal, fec: rangoDeFechas
      })
      .then((data) => {
        if (data.data.length) {
          let orientacion = 'p'
          let informeTitulo = 'Movimientos de Cuenta Corriente'
          let doc = new jsPDF(orientacion, 'pt')  // 'p' normal 'l' horizontal ( landscape )
          this.page = 1
          this.pages = Math.trunc(this.items.length/44)+1
          this.cabecera(this.cualInforme, informeTitulo, doc, orientacion)
          this.detalles(this.cualInforme, informeTitulo, doc, orientacion, data.data)
          doc.output ('dataurlnewwindow')
        } else {
          this.mensaje('¡No hay movimientos en el período especificado!', this.temas.forms_titulo_bg, 2500)
        }
      })
    },





    cabecera(tipInf, informeTitulo, doc, orientacion) {
      let topDown = orientacion == 'p' ? 810 : 580
      let topWidth = orientacion == 'p' ? 527 : 777
      let av    = '../images/'+this.logotipo
      var img = new Image()

      img.src = av
      doc.addImage(img, 'jpg', 40, 28, 122, 45)

      doc.setFontSize(8);
      doc.text ( 'gohu', 550, 14 )

      doc.setFontSize(8);
      doc.text ( 'Fecha: '+moment().format('L'), 40, 90 )
      doc.setFontSize(15);
      doc.text ( informeTitulo, 180, 45 )
      doc.setFontSize(9);
      doc.text ( 'Desde:'+moment(this.fechaDesde).format('DD/MM/YYYY'), 180, 67 )
      doc.text ( 'Hasta:'+moment(this.fechaHasta).format('DD/MM/YYYY'), 260, 67 )
      doc.text ( 'Página '+this.page.toString()+'/'+this.pages.toString(), topWidth, topDown )

      if (tipInf===1) {
        doc.text ( 'Cuenta', 40, 115 )
        doc.text ( 'Vencimiento', 80, 115 )
        doc.text ( 'Comprobante', 145, 115 )
        doc.text ( 'Pendiente', 440, 115 )
        doc.text ( 'Saldo', 545, 115 )
      } else if (tipInf===2) {
        doc.text ( 'Codigo', 40, 115 )
        doc.text ( 'Nombre', 40, 115 )
        doc.text ( 'Comprobante', 95, 115 )
        doc.text ( 'Vencimiento', 170, 115 )
        doc.text ( 'Pendiente', 440, 115 )
        doc.text ( 'Saldo', 545, 115 )
      } else if (tipInf===3) {
        doc.text ( 'Codigo', 40, 115 )
        doc.text ( 'Nombre', 40, 115 )
        doc.text ( 'Comprobante', 95, 115 )
        doc.text ( 'Vencimiento', 170, 115 )
        doc.text ( 'Debe', 370, 115 )
        doc.text ( 'Haber', 450, 115 )
        doc.text ( 'Saldo', 545, 115 )
      }
      doc.line( 40, 121, 570, 121)
    },





    detalles(tipInf, informeTitulo, doc, orientacion, data) {

      debugger
      let f = 135
      let topDown = orientacion == 'p' ? 780 : 540
      let topWidth = orientacion == 'p' ? 570 : 800
      let it = []

      let ter1 = data[0].terid
      let ter2 = 0
      let saldo = 0
      let total = 0

      for (let i=0; i<=data.length-1; i++) {
        let pos = it.findIndex(x => x.id === data[i].terid)
        if (pos==-1) {
          it.push({
            id: data[i].terid,
            pendiente: data[i].pendiente
          })
        } else {
          it[pos].pendiente += data[i].pendiente
        }
      }

      debugger
      let saldAnt = false
      for (let i=0; i<=data.length-1; i++) {

        ter1 = data[i].terid
        if ((ter1!=ter2 || ter2===0) && this.tieneMovs(ter2==''?ter1:ter1, it)) {

          if (ter2!=0) {
            f += 15
          }
          doc.setFontSize(9);
          doc.setFontStyle("bold");
          doc.text ( data[i].terid.toString(), 70, f, 'right' )
          doc.text ( data[i].ternom, 80, f, 'left' )
          //doc.line( 80, f+3, 250, f+3, 'DF');
          doc.setFontSize(9);
          doc.setFontStyle("normal");
          f += 5
          saldo = 0
          saldAnt = false
        }

        ter2 = data[i].terid
        if (data[i].pendiente!=0) {
          if (moment(data[i].vencimiento.substring(0,10)).format('YYYY-MM-DD')<=moment(this.fechaHasta).format('YYYY-MM-DD')) {
            f+=10
            doc.text ( moment(data[i].vencimiento.substring(0,10)).format('DD/MM/YYYY'), 80, f, 'left' )
            doc.text ( data[i].cpr, 145, f )
            doc.text ( this.formatoImporte(data[i].pendiente.toString()), 480, f, 'right' )
            saldo += data[i].pendiente
            total += data[i].pendiente
            doc.text ( this.formatoImporte(saldo.toString()), 570, f, 'right' )
            f+=4
          }
        }
        if (f>topDown && i<data.length-1) {
          doc.addPage()
          this.page ++
          this.cabecera(tipInf, informeTitulo, doc, orientacion)
          f=135
        }
      }

      f += 5
      doc.line( 40, f, 570, f)
      f += 15
      doc.text ( 'TOTAL', 452, f )
      doc.text ( this.formatoImporte(total.toString()), 570, f, 'right' )
    },





    tieneMovs(ter1, it) {
      debugger
      let pos = it.findIndex(x => x.id == ter1)
      if (pos==-1) {
        return false
      } else {
        return it[pos].pendiente!=0 ? true : false
      }
    },





    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS')
          this.exportExcel()
      }
      this.msg.msgVisible = false;
    },
    
    
    
    
    
    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },





    getColor (activo) {
      return (activo === 1) ? 'green' : 'orange'
    },





    listarHTTP:function() {
      debugger
      let fecdes = '1990-01-01'
      let fechas = ''
      this.selected = []

      if (this.tipoDeDeuda=='T' || this.tipoDeDeuda=='A') {
        fechas = '2190-12-31'
      } else {
        fechas  = moment().subtract(1, 'days').format('YYYY-MM-DD')
      }
      let rangoDeFechas = [{fecha: fecdes}, {fecha: fechas}]
      return HTTP().post('/'+this.modelo, 
        {
          cual: this.cual,
          sucursal: this.sucursal,
          fec: rangoDeFechas,
          tipo: this.tipoDeDeuda,
        })
        .then(({ data }) => {
          debugger
          this.items = data;
          let saldo = 0
          for (let i=0; i<=data.length-1; i++) {
            saldo += data[i].saldo
          }
          let a = this.$store.state.route.fullPath.substring(1,this.$store.state.route.fullPath.length)
          if (a=='resumenesclientes') {
            this.tituloResumen = 'Resúmen de Cuentas Clientes - Saldo total:  $'+this.formatoImporte(saldo,2)
          } else {
            this.tituloResumen = 'Resúmen de Cuentas Proveedores - Saldo Total:  $'+this.formatoImporte(saldo,2)
          }
      });
    },





    exportarAPDF () {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Exportar a PDF'
      this.msg.msgBody = 'Desea exportar los datos a PDF'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a PDF'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },





    exportarAXLS () {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Exportar a XLS'
      this.msg.msgBody = 'Desea exportar los datos a XLS'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a XLS'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },





    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },





    selectAll(event) {
      if (event.value) {
        this.selected = this.items
      } else {
        this.selected = []
      }
    },


  },
};
</script>
