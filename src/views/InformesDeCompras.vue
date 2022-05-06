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
            <v-btn
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true"
              icon @click="closeForm">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <v-toolbar-title class="body-1 white--text">Informes de Compras</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="950px">
              <template v-slot:activator="{ on }"></template>
              <v-card>

                <v-toolbar flat
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
                          v-show="op==1 || op==3 || op==4 || op==5 || op==6 || op==7">
                          <v-text-field
                            autofocus
                            type="date"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.fdesde"
                            label="Fecha Desde">
                          </v-text-field>
                        </v-col>

                        <v-col cols="3" sm="3" md="3"
                          v-show="op==1 || op==3 || op==4 || op==5 || op==6 || op==7">
                          <v-text-field
                            type="date"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.fhasta"
                            label="Fecha Hasta">
                          </v-text-field>
                        </v-col>

                        <v-col cols="3" sm="3" md="3" v-show="op==2">
                          <v-text-field
                            type="month"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.perdesde"
                            label="Período Desde">
                          </v-text-field>
                        </v-col>

                        <v-col cols="3" sm="3" md="3" v-show="op==2">
                          <v-text-field
                            type="month"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.perhasta"
                            label="Período Hasta">
                          </v-text-field>
                        </v-col>

                        <v-col cols="6" sm="6">
                          <v-select
                            v-model="sucSel"
                            :color="temas.forms_titulo_bg"
                            :items="sucLis"
                            filled chips label="Sucursales" multiple
                            return-object>
                          </v-select>
                        </v-col>
                      </v-row>

                      <!--
                      <v-row>
                        <v-data-table v-show="sayInf"
                          :headers="headersRes"
                          :items="itemRes"
                          dense
                          class="elevation-1"
                          hide-default-footer
                          :items-per-page="-1">
                          <template v-slot:item.total="{ item }">
                            <span disable dark>${{ formatoImporte(item.total) }}</span>
                          </template>
                          <template slot="body.append">
                            <tr class="pink--text">
                              <th class="subtitle-1">Totales</th>
                              <th v-show="op==3 || op==4" class="subtitle-1"></th>
                              <th v-show="op==3 || op==4" class="subtitle-1"></th>
                              <th v-show="op==3 || op==4" class="subtitle-1"></th>
                              <th class="subtitle-1">${{ formatoImporte(sumField('total')) }}</th>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-row>
                      <v-row>
                        <v-data-table v-show="sayInf2"
                          :headers="headersRes"
                          :items="itemRes"
                          dense
                          class="elevation-1"
                          hide-default-footer
                          :items-per-page="-1"
                          group-by="cpr">
                          <template v-slot:item.precio="{ item }">
                            <span disable dark>${{ formatoImporte(item.precio) }}</span>
                          </template>
                          <template v-slot:item.totalitem="{ item }">
                            <span disable dark>${{ formatoImporte(item.totalitem) }}</span>
                          </template>
                          <template slot="body.append">
                            <tr class="pink--text">
                              <th class="subtitle-1">Totales</th>
                              <th v-show="op==3 || op==4" class="subtitle-1"></th>
                              <th v-show="op==3 || op==4" class="subtitle-1"></th>
                              <th v-show="op==3 || op==4" class="subtitle-1"></th>
                              <th class="subtitle-1">
                                ${{ formatoImporte(sumField('totalitem')) }}
                              </th>
                            </tr>
                          </template>
                        </v-data-table>
                      </v-row>
-->
<!--
                      <v-row>
                        <v-col cols="3" sm="3">
                          <v-select
                            v-model="grupo"
                            :items="gruItems"
                            item-value="id"
                            item-text="nombre"
                            label="Grupo..."
                            dense outlined return-object
                            @change="filtrar">
                          </v-select>
                        </v-col>
                      </v-row>
-->
<!--
                      <v-row>
                        <v-col cols="2" sx="6" mx="4">
                          <v-switch
                            label="Activo"
                            v-model="editado.activo">
                          </v-switch>
                        </v-col>
                    </v-row>
-->
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
      'avatar',
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
      return this.listarHTTP()
    }
  },
  created () {
    debugger
    this.items.push(
      {informe: 'VENTAS TOTALES POR DIA Y SUCURSAL'},
      {informe: 'VENTAS TOTALES POR MES Y SUCURSAL'},
      {informe: 'VENTAS TOTALES POR COMPROBANTE'},
      {informe: 'VENTAS DETALLADAS POR COMPROBANTES'},
      {informe: 'VENTAS TOTALES POR ARTICULOS'},
      {informe: 'VENTAS TOTALES POR CLIENTES'},
      {informe: 'RENTABILIDAD BRUTA'},
      {informe: 'TOTALES POR ZONAS'},
      {informe: 'TOTALES POR DIA DE SEMANA'},
      {informe: 'TOTALES POR VENDEDOR ( RESUMIDO )'},
      {informe: 'TOTALES POR VENDEDOR ( DETALLADO )'},
      {informe: 'SEGUIMIENTO DE VENTAS POR CLIENTE'},
//    {informe: 'ESTADISTICAS DE IMPORTES POR MES Y VENDEDORES'},
//    {informe: 'CANTIDAD DE CODIGOS DE ARTICULOS POR CLIENTE'},
//    {informe: 'REMITOS PENDIENTES DE FACTURAR'},
//    {informe: 'INFORME DE COMISIONES PAGAS'},
//    {informe: 'INFORME DE COMISIONES A PAGAR'},
//    {informe: 'LIQUIDACIONES DE PAGOS DE COMISIONES EMITIDAS'},
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
//    this.sucLis = this.sucursales
//    this.sucsel = this.sucursal
//    this.listarHTTP();
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
      if (this.informeTitulo=='VENTAS TOTALES POR DIA Y SUCURSAL') { this.op = 1 }
      else if (this.informeTitulo=='VENTAS TOTALES POR MES Y SUCURSAL') { this.op = 2 }
      else if (this.informeTitulo=='VENTAS TOTALES POR COMPROBANTE') { this.op = 3 }
      else if (this.informeTitulo=='VENTAS DETALLADAS POR COMPROBANTES') { this.op = 4 }
      else if (this.informeTitulo=='VENTAS TOTALES POR ARTICULOS') { this.op = 5 }
      else if (this.informeTitulo=='VENTAS TOTALES POR CLIENTES') { this.op = 6 }
      else if (this.informeTitulo=='RENTABILIDAD BRUTA') { this.op = 7 }
    },
    cerrarDialog() {
      //this.sayInf = false
      //this.sayInf2 = false
      this.dialog = false
    },
    generarInforme(item, row) {
      
      if (this.informeTitulo=='VENTAS TOTALES POR DIA Y SUCURSAL') {
        //this.sayInf = true
        this.headersRes = [{ title: 'Fecha', dataKey:'fecha' },{ title: 'Total', dataKey:'total' }]
        return HTTP().post('/infven_totalespordiasucursal', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          this.rows = []
          let total = 0
          debugger
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              fecha: moment(data.data[i].fecha).format('DD-MM-YYYY'), 
              total: '$'+this.formatoImporte(data.data[i].total),
            })
            total += data.data[i].total
          }
          this.rows.push({fecha: 'TOTAL', total: '$'+this.formatoImporte(total) })
          this.print(this.informeTitulo, this.headersRes, this.rows, 'p' )
        })

      } else if (this.informeTitulo=='VENTAS TOTALES POR MES Y SUCURSAL') {

        this.headersRes = [{ title: 'Período', dataKey:'periodo' },{ title: 'Total', dataKey:'total' }]
        this.editado.fdesde = this.editado.perdesde+'-01'
        this.editado.fhasta = moment(this.editado.perhasta+'-01').endOf('month').format('YYYY-MM-DD');
        return HTTP().post('/infven_totalespormessucursal', {
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

      } else if (this.informeTitulo=='VENTAS TOTALES POR COMPROBANTE') {

        this.headersRes = [
          { title: 'fecha', dataKey:'fecha' },
          { title: 'Comprobante', dataKey: 'cpr' },
          { title: 'Cliente', dataKey: 'tercero_id' },
          { title: 'Nombre', dataKey: 'nombre' },
          { title: 'Total', dataKey: 'total' }]

        return HTTP().post('/infven_totalesporcomprobantes', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          this.rows = []
          let total = 0
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              fecha: moment(data.data[i].fecha).format('DD-MM-YYYY'), 
              cpr: data.data[i].cpr,
              tercero_id: data.data[i].tercero_id,
              nombre: data.data[i].nombre,
              total: '$'+this.formatoImporte(data.data[i].total)
            })
            total += data.data[i].total
          }
          this.rows.push({fecha:'TOTAL', cpr:'', tercero_id:'', nombre:'', total:'$'+this.formatoImporte(total)})
          this.print(this.informeTitulo, this.headersRes, this.rows, 'p' )
        })

      } else if (this.informeTitulo=='VENTAS DETALLADAS POR COMPROBANTES') {

        this.headersRes = [
          { title: 'comprobante', dataKey:'cpr'},
          { title: 'codigo', dataKey:'codigo'},
          { title: 'descripcion', dataKey: 'descripcion'},
          { title: 'cantidad', dataKey: 'cantidad'},
          { title: 'precio', dataKey: 'precio'},
          { title: 'Total Item', dataKey: 'totalitem'}]

        return HTTP().post('/infven_totalesporcomprobantesdetallado', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          debugger
          this.rows = []
          let total = 0
          let cpr = ''
          let elCpr = ''
          for (let i=0; i<=data.data.length-1; i++) {
            if (cpr!='') {
              if (data.data[i].cpr == cpr) {
                elCpr = ''
              } else {
                elCpr = data.data[i].cpr
              }
            } else {
              elCpr = data.data[i].cpr
            }
            this.rows.push({
              cpr: elCpr,
              codigo: data.data[i].codigo,
              descripcion: data.data[i].descripcion,
              cantidad: data.data[i].cantidad,
              precio:  '$'+this.formatoImporte(data.data[i].precio),
              totalitem:  '$'+this.formatoImporte(data.data[i].totitem)
            })
            cpr = data.data[i].cpr
            total += data.data[i].totitem
          }
          this.rows.push({fecha:'TOTAL', cpr:'', codigo:'', descripcion:'', cantidad: '', precio: '', total:'$'+this.formatoImporte(total)})
          this.print(this.informeTitulo, this.headersRes, this.rows, 'l' )
        })

      } else if (this.informeTitulo=='VENTAS TOTALES POR ARTICULOS') {

        debugger
        this.headersRes = [
          { title: 'Código', dataKey:'codigo' },
          { title: 'Nombre', dataKey: 'nombre' },
          { title: 'Cantidad', dataKey: 'cantidad' }]

        return HTTP().post('/infven_totalesporarticulos', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          debugger
          this.rows = []
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              codigo: data.data[i].codigo, 
              nombre: data.data[i].nombre,
              cantidad: this.formatoImporte(data.data[i].cantidad)
            })
          }
          this.print(this.informeTitulo, this.headersRes, this.rows, 'p' )
        })

      } else if (this.informeTitulo=='VENTAS TOTALES POR CLIENTES') {

        debugger
        this.headersRes = [
          { title: 'Código', dataKey: 'codigo' },
          { title: 'Nombre', dataKey: 'nombre' },
          { title: 'Total', dataKey: 'total' }]

        let total = 0
        return HTTP().post('/infven_totalesporclientes', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          debugger
          this.rows = []
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              codigo: data.data[i].id,
              nombre: data.data[i].nombre,
              total: '$'+this.formatoImporte(data.data[i].total)
            })
            total += data.data[i].total
          }
          this.rows.push({codigo:'TOTAL', nombre:'', total:'$'+this.formatoImporte(total)})
          this.print(this.informeTitulo, this.headersRes, this.rows, 'p' )
        })

      } else if (this.informeTitulo=='RENTABILIDAD BRUTA') {

        debugger
        this.headersRes = [
          { title: 'Fecha', dataKey: 'fecha' },
          { title: 'Rentabilidad', dataKey: 'rentabilidad' }]

        let total = 0
        return HTTP().post('/infven_rentabilidadbrutapordia', {
          fechadesde: this.editado.fdesde, fechahasta: this.editado.fhasta, sucursales: this.sucLis
        })
        .then((data) => {
          debugger
          this.rows = []
          for (let i=0; i<=data.data.length-1; i++) {
            this.rows.push({
              fecha: moment(data.data[i].fecha).format('DD-MM-YYYY'),
              rentabilidad: '$'+this.formatoImporte(data.data[i].rentabilidad)
            })
            total += data.data[i].rentabilidad
          }
          this.rows.push({fecha:'TOTAL', rentabilidad:'$'+this.formatoImporte(total)})
          this.print(this.informeTitulo, this.headersRes, this.rows, 'p' )
        })

      } else if (this.informeTitulo=='TOTALES POR ZONAS') {
      } else if (this.informeTitulo=='TOTALES POR DIA DE SEMANA') {
      } else if (this.informeTitulo=='TOTALES POR VENDEDOR ( RESUMIDO )') {
      } else if (this.informeTitulo=='TOTALES POR VENDEDOR ( DETALLADO )') {
      } else if (this.informeTitulo=='SEGUIMIENTO DE VENTAS POR CLIENTE') {
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
      let possuc = 0
      for (let i=0; i<=this.sucursales.length-1; i++) {
        if (this.sucursales[i].id == this.sucursal) {
          possuc = i
          break
        }
      }
      let av    = 'images/'+this.sucursales[possuc].logotipo
      // ESTE ANDA PERO NO MUESTRA LA PAGINA
      doc.autoTable(headersRes, itemRes, {
        didDrawPage: function (data) {
          // Footer

          var img = new Image()
        //img.src = 'images/lacatolica.jpg'
          img.src = av
          doc.addImage(img, 'jpg', 40, 28, 122, 45)

          var str = "Página " + doc.internal.getNumberOfPages()
          if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
          }
          doc.setFontSize(14);
          //doc.text ( emp, 40, 47 )           // COL, FIL
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
          cantidad: { halign: 'right', width: 160, },
          precio: { halign: 'right', width: 160, },
          totalitem: { halign: 'right', width: 160, },
          rentabilidad: { halign: 'right', width: 160, },
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
