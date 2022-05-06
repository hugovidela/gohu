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

          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">

            <v-btn icon
              @click="closeForm"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <!--
            <template v-slot:extension>
              <v-btn
                fab color="green accent-3"
                @click='exportarAXLS'>
                <v-icon>mdi-file-excel</v-icon>
              </v-btn>
              <v-btn
                fab color="white accent-3"
                @click='exportarAPDF'>
                <v-icon>mdi-file-pdf</v-icon>
              </v-btn>
            </template>
            -->
            <v-toolbar-title class="body-1 white--text">Informes de Stocks</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="950px">
              <template v-slot:activator="{ on }"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">

                  <v-btn icon
                    @click="cerrarDialog"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>

                  <span class="headdline">{{ informeTitulo }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="teal accent-4"
                    class="ma-2 white--text"
                    @click="generarInforme">
                    Generar Informe
                  </v-btn>
                </v-toolbar>

                <v-form ref="form">
                  <v-card-text>
                    <v-container>

                      <v-row>

                        <v-col cols="3" sm="3" md="3" v-show="op==1">
                          <v-text-field
                            autofocus
                            type="date"
                            v-model="editado.fdesde"
                            label="Fecha Desde">
                          </v-text-field>
                        </v-col>

                        <v-col cols="3" sm="3" md="3" v-show="op==1">
                          <v-text-field
                            type="date"
                            v-model="editado.fhasta"
                            label="Fecha Hasta">
                          </v-text-field>
                        </v-col>

                        <v-col cols="3" sm="3" md="3" v-show="op==2">
                          <v-text-field
                            type="month"
                            v-model="editado.perdesde"
                            label="Período Desde">
                          </v-text-field>
                        </v-col>

                        <v-col cols="3" sm="3" md="3" v-show="op==2">
                          <v-text-field
                            type="month"
                            v-model="editado.perhasta"
                            label="Período Hasta">
                          </v-text-field>
                        </v-col>

                        <v-col cols="6" sm="6">
                          <v-select
                            v-model="sucSel"
                            :items="sucLis"
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
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';
import Confirmacion from "./Forms/confirmacion.vue"
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
      'temas',
      'empresa'
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
      this.listarHTTP()
    }
  },
  created () {
    debugger
    this.items.push(
      {informe: 'MOVIMIENTOS DE ARTICULOS ENTRE FECHAS'},
      {informe: 'MOVIMIENTOS DE ARTICULOS POR MES'},
      {informe: 'VALORIZACION DE STOCK'},
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
      if (this.informeTitulo=='MOVIMIENTOS DE ARTICULOS ENTRE FECHAS') {
        this.op = 1
      } else if (this.informeTitulo=='MOVIMIENTOS DE ARTICULOS POR MES') {
        this.op = 2
      } else if (this.informeTitulo=='VALORIZACION DE STOCK') {
        this.op = 3
      }
    },
    cerrarDialog() {
      //this.sayInf = false
      //this.sayInf2 = false
      this.dialog = false
    },
    generarInforme(item, row) {

      //debugger
      if (this.informeTitulo=='MOVIMIENTOS DE ARTICULOS ENTRE FECHAS') {
      //this.sayInf = true
        this.headersRes = [
//        { title: 'Fecha',   dataKey:'fecha' },
          { title: 'Codigo',  dataKey:'codigo' },
          { title: 'Nombre',  dataKey:'nombre' },
          { title: 'Ventas',  dataKey:'ventas' },
          { title: 'Compras', dataKey:'compras' }
        ]
        return HTTP().post('/infart_totalespordiasucursal', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursal: this.sucursal
        })
        .then((data) => {
          this.rows = []
          debugger
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
//            fecha:   moment(data.data[i].fecha).format('DD-MM-YYYY'),
              codigo:  data.data[i].codigo,
              nombre:  data.data[i].nombre.substr(0,30),
              ventas:  this.formatoImporte(Math.abs(data.data[i].ventas)),
              compras: this.formatoImporte(data.data[i].compras),
            })
          }
          this.print(this.informeTitulo, this.headersRes, this.rows, 'p' )
        })

      } else if (this.informeTitulo=='MOVIMIENTOS DE ARTICULOS POR MES') {

        this.headersRes = [{ title: 'Período', dataKey:'periodo' },{ title: 'Total', dataKey:'total' }]
        this.editado.fdesde = this.editado.perdesde+'-01'
        this.editado.fhasta = moment(this.editado.perhasta+'-01').endOf('month').format('YYYY-MM-DD');
        return HTTP().post('/infart_totalespormessucursal', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          debugger
          this.rows = []
          let total = 0
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              periodo: moment(data.data[i].per).format('MM-YYYY'), 
              total: data.data[i].total,
            })
            total += data.data[i].total
          }
          this.rows.push({ periodo: 'TOTAL', total: '$'+this.formatoImporte(total), })
          this.print(this.informeTitulo, this.headersRes, this.rows, 'p' )
        })

      } else if (this.informeTitulo=='VALORIZACION DE STOCK') {

        this.headersRes = [
          { title: 'Codigo', dataKey:'codigo' },
          { title: 'Descripcion', dataKey: 'nombre' },
          { title: 'Stock', dataKey: 'stock' },
          { title: 'Costo', dataKey: 'costo' },
          { title: 'Precio', dataKey: 'precio' },
          { title: 'Total', dataKey: 'total' }
        ]

        return HTTP().post('/infart_valorizacion', {
          sucursales: this.sucLis
        })
        .then((data) => {
          this.rows = []
          let totalValorizacion = 0
          for (let i=0; i<=data.data.length-1; i++) {
            if (data.data[i].stock!=0) {
              this.rows.push({
                codigo: data.data[i].codigo, 
                nombre: data.data[i].nombre,
                stock: this.formatoImporte(data.data[i].stock),
                costo: '$'+this.formatoImporte(data.data[i].costo),
                precio: '$'+this.formatoImporte(data.data[i].precio),
                total: '$'+this.formatoImporte(data.data[i].total)
              })
            totalValorizacion += data.data[i].total
            }
          }
          debugger
          this.rows.push({codigo:'TOTAL',nombre:'',stock:'',costo:'',precio:'',total:'$'+this.formatoImporte(totalValorizacion)})
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
      var doc = new jsPDF(orientacion, 'pt');   // 'p' normal 'l' horizontal ( landscape )
      const totalPagesExp = '{total_pages_count_string}'

      debugger

      let possuc = 0
      for (let i=0; i<=this.sucursales.length-1; i++) {
        if (this.sucursales[i].id == this.sucursal) {
          possuc = i
          break
        }
      }

      let av = 'images/'+this.sucursales[possuc].logotipo
      var img = new Image()
      //img.src = av
      //doc.addImage(img, 'jpg', 10, 20, 52, 25)

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
          //doc.setFontSize(14);
          //doc.text ( emp, 40, 47 )           // COL, FIL
          img.src = av
          doc.addImage(img, 'jpg', 45, 35, 102, 35)

          doc.setFontSize(16);
          doc.text ( tit, 180, 47 )
          doc.setFontSize(8);
          doc.text ( 'gohu', orientacion == 'p' ? 565 : 785, 15 )
          doc.setFontSize(9);
          doc.text ( 'Desde:'+des, 180, 67 )
          doc.text ( 'Hasta:'+has, 260, 67 )

          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.text(str, data.settings.margin.left, pageHeight-10 );
        },
        margin: {top: 100, bottom: 25},
        headStyles: {
          fillColor: [23, 23, 23], fontSize: 8,
          compras: { halign: 'right' },                // NO FUNCIONA!!!!
          ventas: { halign: 'right' },                 // NO FUNCIONA!!!!
        },
        styles: {
          fillColor: [236, 233, 223], fontSize: 8,
        },
        showHeader: true,
        columnStyles: {
          cantidad: { halign: 'right', width: 160, },
          stock: { halign: 'right', width: 160, },
          ventas: { halign: 'right', width: 160, },
          compras: { halign: 'right', width: 160, },
          precio: { halign: 'right', width: 160, },
          totalitem: { halign: 'right', width: 160, },
          costo: { halign: 'right', width: 160, },
          valalcosto: { halign: 'right', width: 160, },
          valalneto: { halign: 'right', width: 160, },
          total: { halign: 'right', width: 160, },
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
