<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        dense
        @click:row="selInforme"
        hide-default-footer
        class="elevation-1">
        <template v-slot:top>
          <v-toolbar
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true"
              icon @click="closeForm">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <template v-slot:extension>
              <v-btn
                fab
                :color="temas.forms_btn_xls_bg"
                :dark="temas.forms_btn_xls_dark==true"
                @click='exportarAXLS'>
                <v-icon>mdi-file-excel</v-icon>
              </v-btn>
              <v-btn
                fab
                :color="temas.forms_btn_pdf_bg"
                :dark="temas.forms_btn_pdf_dark==true"
                @click='exportarAPDF'>
                <v-icon>mdi-file-pdf</v-icon>
              </v-btn>
            </template>
            <v-toolbar-title class="body-1 white--text">Informes de Tesoreria</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="950px">
              <template v-slot:activator="{ on }"></template>
              <v-card>

                <v-toolbar
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cerrarDialog">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>

                  <span class="headdline">{{ informeTitulo }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    @click="generarInforme">
                    Generar Informe
                  </v-btn>

                </v-toolbar>

                <v-form ref="form">
                  <v-card-text>
                    <v-container>

                      <v-row>

                        <v-col cols="3" sm="3" md="3"
                          v-show="op==3 || op==4 || op==5 || op==6 || op==7">
                          <v-text-field
                            autofocus
                            type="date"
                            v-model="editado.fdesde"
                            :color="temas.forms_btn_editar_bg"
                            label="Fecha Desde">
                          </v-text-field>
                        </v-col>

                        <v-col cols="3" sm="3" md="3"
                          v-show="op==3 || op==4 || op==5 || op==6 || op==7">
                          <v-text-field
                            type="date"
                            v-model="editado.fhasta"
                            :color="temas.forms_btn_editar_bg"
                            label="Fecha Hasta">
                          </v-text-field>
                        </v-col>

                        <v-col cols="3" sm="3" md="3" v-show="op==2">
                          <v-text-field
                            type="month"
                            v-model="editado.perdesde"
                            :color="temas.forms_btn_editar_bg"
                            label="Período Desde">
                          </v-text-field>
                        </v-col>

                        <v-col cols="3" sm="3" md="3" v-show="op==2">
                          <v-text-field
                            type="month"
                            v-model="editado.perhasta"
                            :color="temas.forms_btn_editar_bg"
                            label="Período Hasta">
                          </v-text-field>
                        </v-col>

                        <v-col cols="6" sm="6">
                          <v-select
                            v-model="sucSel"
                            :items="sucLis"
                            :color="temas.forms_btn_editar_bg"
                            :item-color="temas.forms_btn_editar_bg"
                            filled chips label="Sucursales" multiple
                            return-object>
                          </v-select>
                        </v-col>
                      </v-row>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
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
import HTTP from '../../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../../router';
import moment from 'moment';
import Confirmacion from "./../Forms/confirmacion.vue"
import XLSX from 'xlsx'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  components: {
    Confirmacion,
  },
  data: () => ({
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    editado: {
      fdesde: moment().format('YYYY-MM-DD'),
      fhasta: moment().format('YYYY-MM-DD'),
    },
    items: [],
    itemRes: [],
    sucLis: [],
    sucSel: [],
    rows: [],
    op: 0,
    sayInf: false,    
    sayInf2: false,
    footerProps: {'items-per-page-options': [19]},
    headers: [
      { text: 'INFORME', value:'informe' },
    ],

    headersRes: [
      { text: 'Fecha', value:'fecha', align: 'left', width: 120 },
      { text: 'Total', value:'total', align: 'right', width: 120 }
    ],

    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    editedIndex: -1,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn']),
    ...mapState([
      'sucursal',
      'sucursales',      
      'empresa',
      'temas',
    ]),
//    formTitle () { 
//      return this.editedIndex === -1 ? 'Nueva Marca' : 'Editar Marca';
//    },
  },
  watch: {
    //dialog (val) {
    //  val || this.cancelar();
    //},
  },
  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      return this.listarHTTP()
    }
  },
  created () {
    this.items.push(
      {informe: 'Cheques en Cartera'},
      {informe: 'Cheques Entregados'},
      )
      debugger
      this.sucLis = []
      this.sucSel = []
      this.sucursales.forEach(element => {
        this.sucLis.push(element.nombre)
        if (element.id == this.sucursal) {
          this.sucSel.push(element.nombre)
        }
      })
  },
  methods: {
    ...mapMutations(['alert','closeAlert']),
    closeForm(){
      router.push('/')
    },
    selInforme(item, row) {
      debugger
      this.informeTitulo = item.informe
      this.dialog = true
      if (this.informeTitulo=='Cheques en Cartera') { this.op = 1 }
      else if (this.informeTitulo=='Cheques Egresados') { this.op = 2 }
    },
    cerrarDialog() {
      //this.sayInf = false
      //this.sayInf2 = false
      this.dialog = false
    },
    generarInforme(item, row) {
      
      if (this.informeTitulo=='Cheques en Cartera') {
        //this.sayInf = true
        this.headersRes = [
          { title: 'Fecha',    dataKey:'fecha' },
          { title: 'Dias',     dataKey:'dias' },
          { title: 'CodBan',   dataKey:'codigo' },
          { title: 'Banco',    dataKey:'bannom' },
          { title: 'NroValor', dataKey:'nrovalor' },
          { title: 'Cuenta',   dataKey:'cuenta' },
          { title: 'Librador', dataKey:'ternom' },
          { title: 'Importe',  dataKey:'importe' },
          ]
        return HTTP().post('/inftes_chequesencartera', {
          sucursal: this.sucLis
        })
        .then((data) => {
          this.rows = []
          let total = 0

          let hoy = moment()
          debugger
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              fecha: moment(data.data[i].fechafinanciera).format('DD-MM-YYYY'),
              dias: hoy.diff(data.data[i].fechafinanciera, 'days'),
              nrovalor: data.data[i].nrovalor,
              codigo: data.data[i].codigo,
              bannom: data.data[i].bannom,
              cuenta: data.data[i].cuenta,
              ternom: data.data[i].ternom,
              importe: '$'+this.formatoImporte(data.data[i].importe),
            })
            total += data.data[i].importe
          }
          this.rows.push({fecha: 'TOTAL', importe: '$'+this.formatoImporte(total) })
          this.print(this.informeTitulo, this.headersRes, this.rows, 'l' )
        })

      } else if (this.informeTitulo=='Cheques Entregados') {

        //this.sayInf = true
        this.headersRes = [
          { title: 'Salida',      dataKey:'fechasalida' },
          { title: 'CodBan',      dataKey:'codigo' },
          { title: 'Banco',       dataKey:'bannom' },
          { title: 'NroValor',    dataKey:'nrovalor' },
          { title: 'Cuenta',      dataKey:'cuenta' },
          { title: 'Entrego',     dataKey:'terceroorigen' },
          { title: 'Entregado A', dataKey:'tercerodestino' },
          { title: 'Importe',     dataKey:'importe' },
          ]
        return HTTP().post('/inftes_chequesentregados', {
          sucursal: this.sucLis
        })
        .then((data) => {
          this.rows = []
          let total = 0

          let hoy = moment()
          debugger
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              fechasalida: moment(data.data[i].fechafinanciera).format('DD-MM-YYYY'),
              dias: hoy.diff(data.data[i].fechafinanciera, 'days'),
              nrovalor: data.data[i].nrovalor,
              codigo: data.data[i].codigo,
              bannom: data.data[i].bannom,
              cuenta: data.data[i].cuenta,
              terceroorigen: data.data[i].terceroorigen,
              tercerodestino: data.data[i].tercerodestino,
              importe: '$'+this.formatoImporte(data.data[i].importe),
            })
            total += data.data[i].importe
          }
          this.rows.push({fecha: 'TOTAL', importe: '$'+this.formatoImporte(total) })
          this.print(this.informeTitulo, this.headersRes, this.rows, 'l' )
        })

      }
    },
    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.items)
      const workbook = XLSX.utils.book_new()
      const filename = this.modelo
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },
    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
          this.borrar(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS')
          this.exportExcel()
      }
      this.msg.msgVisible = false;
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
    sumField(key) {
      // sum data in give key (property)
      return this.itemRes.reduce((a, b) => a + (b[key] || 0), 0)
    },

    print(informeTitulo, headersRes, itemRes, orientacion ) {

      debugger
      var doc = new jsPDF(orientacion, 'pt')  // 'p' normal 'l' horizontal ( landscape )
      const totalPagesExp = '{total_pages_count_string}'
      const emp = this.empresa
      const tit = informeTitulo
      const des = this.editado.fdesde.substr(8,2)+'/'+this.editado.fdesde.substr(5,2)+'/'+this.editado.fdesde.substr(0,4)
      const has = this.editado.fhasta.substr(8,2)+'/'+this.editado.fhasta.substr(5,2)+'/'+this.editado.fhasta.substr(0,4)
      // ESTE ANDA PERO NO MUESTRA LA PAGINA
      doc.autoTable(headersRes, itemRes, {
        didDrawPage: function (data) {
          // Footer
          var str = "Página " + doc.internal.getNumberOfPages()
          if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
          }
          doc.setFontSize(14);
          doc.text ( emp, 40, 47 )           // COL, FIL
          doc.setFontSize(16);
          doc.text ( tit, 180, 47 )
          doc.setFontSize(8);
          doc.text ( 'gohu', orientacion == 'p' ? 565 : 785, 15 )
          doc.setFontSize(9);
          doc.text ( 'Desde:'+des, 180, 67 )
          doc.text ( 'Hasta:'+has, 260, 67 )

          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.text(str, data.settings.margin.left, pageHeight - 10);
        },
        margin: {top: 100, bottom: 15},
        headStyles: {
          fillColor: [23, 23, 23], fontSize: 8,
        },
        styles: {
          fillColor: [236, 233, 223], fontSize: 8,
        },
        showHeader: true,
        columnStyles: {
          bannom: { cellWidth: 130 },
          cantidad: { halign: 'right', width: 160, },
          precio: { halign: 'right', width: 160, },
          totalitem: { halign: 'right', width: 160, },
          rentabilidad: { halign: 'right', width: 160, },
          total: { halign: 'right', width: 160, },
          importe: { halign: 'right', width: 160, },
          styles: {fillColor: [100, 255, 255], fontSize: 8 },
          columnStyles: { id: {fillColor: 125} },
        },
      });
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      doc.output ('dataurlnewwindow')
    }
  },
};
</script>
