d<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        class="elevation-3"
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
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_dark==true"
                    class="mr-2"
                    @click="cualesver(1)" v-on="on">
                    <v-icon>mdi-arrow-down-bold</v-icon>
                  </v-btn>
                </template>
                <span>Disponibles</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_dark==true"
                    class="mr-2"
                    @click="cualesver(2)" v-on="on">
                    <v-icon>mdi-arrow-up-bold</v-icon>
                  </v-btn>
                </template>
                <span>Entregados</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_dark==true"
                    class="mr-2"
                    @click="cualesver(3)" v-on="on">
                    <v-icon>mdi-emoticon-devil</v-icon>
                  </v-btn>
                </template>
                <span>Rechazados</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_pdf_bg"
                    :dark="temas.forms_btn_pdf_dark==true"
                    class="mr-2"
                    @click="print" v-on="on">
                    <v-icon>mdi-printer</v-icon>
                  </v-btn>
                </template>
                <span>Imprimir</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="exportExcel" v-on="on">
                    <v-icon>mdi-file-excel</v-icon>
                  </v-btn>
                </template>
                <span>Enviar a Excel</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="cambiarValores" v-on="on">
                    <v-icon>mdi-drawing</v-icon>
                  </v-btn>
                </template>
                <span>Cambiar Valores</span>
              </v-tooltip>
            </template>

            <v-toolbar-title class="white--text">
              {{'Cheques '+cuales+': $'+formatoImporte(total,2)}}
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->

            <!--CAMBIO DE CHEQUES -->
            <v-dialog v-model="dialogCambio" max-width="1300px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true"
                  icon @click="cerrarCambio">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  Cambio de Cheques
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-card>
                <v-form ref="pend">
                  <v-card-text>
                    <v-container>

                      <!-- GRILLA DE CHEQUES DE TERCERO -->
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-data-table
                            v-model="selectedCheque"
                            :headers="headersSel"
                            :items="cartera"
                            dense
                            class="elevation-3"
                            item-key="id"
                            :footer-props="footerProps5">
                            <template v-slot:item.importe="{ item }">
                              <span
                                disable dark>${{ formatoImporte(item.importe) }}
                              </span>
                            </template>

                            <template v-slot:item.seleccionado="{ item }">
                              <v-chip
                                :color="getColor(item.seleccionado)"
                                dark>{{item.seleccionado?'Sí':'No'}}
                              </v-chip>
                            </template>

                            <template v-slot:item.accion="{item}">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="selectCartera(item)" v-on="on">
                                    <v-icon>mdi-checkbox-marked-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span>Seleccionar</span>
                              </v-tooltip>
                            </template>

                          </v-data-table>
                        </v-col>
                      </v-row>
                      <!-- PIDO PROVEEDOR -->
                      <v-row>
                        <v-col cols="7" sx="7" mx="7" class="pt-0">
                          <v-autocomplete
                            v-model="tercero_id"
                            :items="itemsTerceros"
                            :loading="isLoadingTerceros"
                            :search-input.sync="searchTerceros"
                            :color="temas.forms_titulo_bg"
                            item-text="nombre"
                            item-value="id"
                            autofocus
                            label="Comprador"
                            placeholder="Escriba para buscar"
                            prepend-icon="mdi-database-search">
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled dense outlined
                            v-model="totCheTerSel"
                            label="Cheques seleccionados">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            dense outlined
                            v-model="porcentaje"
                            label="% Comisión"
                            @change="calculos(1)">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            dense outlined
                            v-model="totEfeRecibido"
                            label="Efectivo a Recibir"
                            @change="calculos(2)">
                          </v-text-field>
                        </v-col>

                      </v-row>
                      <!-- GRILLA DE CHEQUES DE TERCERO -->

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn v-show="totCheTerSel!=0 && totEfeRecibido!=0 && tercero_id!=0"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          text
                          @click="guardarCambio(item)">
                          Confirmar
                        </v-btn>
                      </v-card-actions>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DEL CAMBIO DE CHEQUES -->

            <!--RECHAZO DE CHEQUES -->
            <v-dialog v-model="dialogRechazo" max-width="600px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true"
                  icon @click="cerrarDevolucion">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  Rechazar Cheque
                </span>
                <v-spacer></v-spacer>
                <v-btn
                  :color="temas.barra_principal_bg"
                  :dark="temas.barra_principal_dark"
                  @click="guardarRechazo(item)">
                  Confirmar
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form ref="pend">
                  <v-card-text>
                    <v-container>

                      <!-- DATOS DE LA FACTURA POR RECHAZO -->
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <v-text-field
                            disabled dense outlined
                            v-model="gasto.librador"
                            label="Entrego">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12" class="pt-0">
                          <v-select
                            v-model="gasto.motivo"
                            :items="motivos"
                            outlined
                            dense
                            autofocus
                            item-value="id" item-text="nombre"
                            :color="temas.forms_titulo_bg"
                            label="Motivo"
                            return-object>
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12">
                          <span>Se emitirá una Débito Interno por el total del cheque:
                            $ {{formatoImporte(itemActual!=null ? itemActual.importe : 0)}}
                            y una Factura por los gastos que indique abajo a
                            <b>{{itemActual!=null ? itemActual.librador : ''}}</b><br>
                          </span>
                          <span>
                            Y se restaurará a
                            <b>{{itemActual!=null ? itemActual.entrego : ''}}</b>
                            la deuda cancelada por el cheque.
                          </span><br><br>
                          <span><b>Gastos del Cheque</b></span>
                          <br>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="3" sx="3" mx="3" class="pt-0">
                          <v-text-field
                            disabled dense outlined
                            v-model="gasto.articulo_id"
                            label="Codigo">
                          </v-text-field>
                        </v-col>
                        <v-col cols="9" sx="9" mx="9" class="pt-0">
                          <v-text-field
                            disabled dense outlined
                            v-model="gasto.nombre"
                            label="Nombre">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <v-text-field
                            dense outlined
                            v-model="gasto.gravado"
                            label="Gravado"
                            @change="calculoGasto(1)">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                        </v-col>
                        <v-col cols="4" sm="4" md="4" class="pt-0">
                          <v-text-field
                            dense outlined
                            v-model="gasto.tasaiva"
                            label="%IVA"
                            @change="calculoGasto(2)">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <v-text-field
                            dense outlined
                            v-model="gasto.iva"
                            label="Importe de IVA"
                            @change="calculoGasto(3)">
                          </v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <v-text-field
                            dense outlined
                            v-model="gasto.total"
                            label="Total"
                            @change="calculoGasto(4)">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <!-- GRILLA DE CHEQUES DE TERCERO -->

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DEVOLUCION DE CHEQUES -->

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
<!--
        <template #item.banco="{ value }">
          <div class="text-truncate" style="max-width: 170px">
            {{ value }}
          </div>
        </template>
-->
        <template v-slot:item.banco="{ item }">
          {{ item.banco.substring(0,15) }}
        </template>

        <template v-slot:item.entrego="{ item }">
          {{ item.entrego.substring(0,15) }}
          <v-badge
            :content="item.propio?'Prop':'3ro'"
            :dark="true"
            icon="mdi-gift"
            color="grey">
          </v-badge>
<!--
          <v-badge v-if="!item.propio"
            content="3ro"
            :dark="true"
            icon="mdi-gift"
            :color="temas.cen_card_activo_bg">
          </v-badge>
-->
        </template>

        <template v-slot:item.importe="{ item }">
          $ {{ formatoImporte(item.importe,2) }}
        </template>

        <!-- BOTONES DE LA GRID PRINCIPAL-->
        <template v-slot:item.accion="{ item }">
          <v-menu bottom left v-if="cual=2">
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="setAcciones(item)">
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
import 'jspdf-autotable'

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    cual: 1,
    total: 0,
    tituloResumen: '',
    itemActual: null,
    acciones: [],
    selectedCheque:[],
    totCheTerSel: 0,
    porcentaje: 0,
    totEfeRecibido: 0,
    valores: [],
    cartera: [],
    descriptionLimit: 80,
    tercero_id: 0,
    gasto: {
      articulo_id: 8,
      librador: '',
      nombre: 'GASTOS POR CHEQUE RECHAZADO',
      motivo: 1,
      gravado: 0,
      tasaiva: 21,
      iva: 0,
      total: 0
    },
    cfUser: '',
    entriesTerceros: [],
    tercerosUserId: [],
    isLoadingTerceros: false,
    searchTerceros: '',    // para el cuadro de búsqueda de datatables

    editado: {
      id: '',
      cpr: '',
      fecha: moment().format('YYYY-MM-DD'),
      vencimiento: moment().format('YYYY-MM-DD'),
      perfiscal: '',
      tercero_id: '',
      comprobante_id: '',
      lista_id: '',
      deposito_id: '',
      regstk: 0,
      medio_id: '',
      moneda_id: 51,
      direccion_id: '',
      documento_id: '',
      documento: '',
      documentoNumero: '',
      responsableAbrev: '',
      letra: '',
      activo: true,
      tasadescuento: 0,
      importedescuento: 0,
      gravado: 0,
      exento: 0,
      iva: 0,
      retib: 0,
      retgan: 0,
      retiva: 0,
      total: 0,
    },
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    motivos: [
      {id: 1, nombre: 'SIN FONDOS'},
      {id: 2, nombre: 'MALA CONFECCION'},
      {id: 3, nombre: 'FUERA DE FECHA'},
    ],
    headersRes: [
      { text: 'Fecha', value:'fecha', align: 'left', width: 120 },
      { text: 'Total', value:'total', align: 'right', width: 120 }
    ],
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    footerProps5: {'items-per-page-options': [5]},
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogCambio: false, 
    dialogRechazo: false, 
    // definimos los headers de la datatables
    items: [],
    cuales: 'Disponibles',
    headers: [
      { text: 'Librador', value:'librador', width: 250},
      { text: 'Banco', value:'banco', width: 250},
      { text: 'Comprobante', value:'cpr', width: 176},
//    { text: 'Cuenta', value:'cuenta', width: 150},
      { text: 'Número', value:'nrovalor', width: 100},
      { text: 'Fec.Finan', value:'fechafinanciera', width: 110},
      { text: 'Dias', value:'dias', width: 80},
      { text: 'Importe', value:'importe', width: 130, align: 'end'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],

    headersSel: [
      { text: 'Librador', value:'librador', width: 210},
      { text: 'Banco', value:'banco', width: 210},
      { text: 'Cuenta', value:'cuenta', width: 140},
      { text: 'Número', value:'nrovalor', width: 100},
      { text: 'Fec.Finan', value:'fechafinanciera', width: 105},
      { text: 'Importe', value:'importe', width: 100, align: 'end'},
      { text: 'Selec.', value:'seleccionado', width: 80, align: 'end'},
      { text: 'Sel', value: 'accion', sortable: false, width: 70 }
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
  }),





  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState(['sucursal','sucursalFiscal','sucursalDemo','empresa', 'tema', 'temas','caja']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo' : 'Editar';
    },

    itemsTerceros () {
      return this.entriesTerceros.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

  },
  
  
  
  
  
  watch: {
    dialog (val) {
      val || this.cancelar();
    },
    '$route.path': function(val, oldVal){
      this.init_component();
    },
   '$store.state.sucursal' () {
      this.init_component()
    },


    searchTerceros (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      // Lazily load input items
      return HTTP().get('/usersproveedores/false/2')
        .then(({ data }) => {

          this.entriesTerceros = []
          this.tercerosUserId = []
          for (let i=0; i<= data.length-1; i++) {
            this.entriesTerceros.push(data[i].tercero)
//          this.tercerosUserId.push(data[i].id)
            this.tercerosUserId.push(data[i].tercero_id)
          }
          if (val !== null && val !== '') {
            let ipos = 0
            for (let i=0; i<=this.entriesTerceros.length-1; i++) {
              if (this.tercero_id === this.entriesTerceros[i].id) {
                ipos = i
                break
              }
            }
            let valor = this.tercerosUserId[ipos]
            return HTTP().get('/tercero/'+valor)
              .then(({ data }) => {

                this.itemActual = data
                this.lisObj = [];
                this.editado.comprobante_id = 128

                this.editado.documento        = data[0].tercero.documento.nombre;
                this.editado.documento_id     = data[0].tercero.documento.id;
                this.editado.documentoNumero  = data[0].tercero.cuit;
                this.editado.responsableAbrev = data[0].tercero.responsable.abrev;
                this.dirItems                 = []
                for (let i=0; i<= data[0].tercero.direcciones.length-1; i++) {
                  this.dirItems.push(data[0].tercero.direcciones[i])
                }

                this.editado.direccion_id = this.dirItems[0].id
                this.editado.medio_id     = 1
                this.editado.sucursal_id = this.sucursal

            })
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingTerceros = false))
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
      this.tituloResumen = 'Cheques '+this.cuales+': $'+this.formatoImporte(this.total,2)
      this.cualesver(1)
    //this.listarHTTP(1);
    },





    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.items)
      const workbook = XLSX.utils.book_new()
      const filename = 'cheques'
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },





    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS') {
          this.exportExcel()
        } else if (this.msg.msgAccion=='cambiar cheques') {
          this.altaHTTP()
        } else if (this.msg.msgAccion=='rechazar cheque') {
          this.rechazarHTTP()
        }
      }
      this.msg.msgVisible = false;
    },





    cualesver(cual) {
      this.cual = cual  // 1 disponibles, 2 entregados
      this.headers = []
      if (cual==1) {
        this.headers.push({ text: 'Entrego', value:'entrego', width: 250})
        this.headers.push({ text: 'Banco', value:'banco', width: 250})
      } else if (cual==2 || cual==3) {
        this.headers.push({ text: 'Entrego', value:'librador', width: 175})
        this.headers.push({ text: 'Entregado a', value:'entrego', width: 175})
        this.headers.push({ text: 'Banco', value:'banco', width: 150})
      }
      this.headers.push({ text: 'Comprobante', value:'cpr', width: 176})
      this.headers.push({ text: 'Número', value:'nrovalor', width: 100})
      this.headers.push({ text: 'Fec.Finan', value:'fechafinanciera', width: 110})
      this.headers.push({ text: 'Dias', value:'dias', width: 80})
      this.headers.push({ text: 'Importe', value:'importe', width: 130, align: 'end'})
      if (cual==2 || cual==3) {
        this.headers.push({ text: 'E', value:'tipo', width: 60, align: 'end'})
      }
      if (cual==2) {
        this.headers.push({ text: 'ACC', value: 'accion', sortable: false })
      }
      this.listarHTTP(cual)
    },





    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      if (item.tipo!="Z") {
        this.acciones.push({nombre: 'Rechazar', icon: 'mdi-subdirectory-arrow-left'})
      }
    },





    async selAccion(item) {
      if (item.nombre=='Rechazar') {
        if (this.itemActual.userid!=null) {
          this.msg.msgTitle = 'No se puede rechazar este cheque!' 
          this.msg.msgAccion = 'rechazar cheque'
          let msg = 'Este cheque ingreso por una operación vinculada.<br><br>'
          msg += 'Debera informar a '+this.itemActual.entrego+' que realice el rechazo '
          msg += 'o esperar a que ellos lo hagan.<br>'
          msg += 'Cuando el mismo sea realizado le llegara una factura con los gastos correspondientes mas '
          msg += 'el importe del cheque'
          this.msg.msgBody = msg
          this.msg.msgVisible = true
          this.msg.msgButtons = ['Cerrar']
        } else {
          this.rechazar(this.itemActual)
        }
      }
    },





    cerrarCambio(item) {
      this.dialogCambio = false
    },





    cerrarDevolucion(item) {
      this.dialogRechazo = false
    },





    rechazar(item) {
      this.gasto.articulo_id = 8
      this.gasto.librador = item.librador
      this.gasto.nombre = 'GASTOS POR CHEQUE RECHAZADO'
      this.gasto.motivo = 1
      this.gasto.gravado = 0
      this.gasto.tasaiva = 21
      this.gasto.iva = 0
      this.gasto.total = 0 
      this.dialogRechazo = true
    },





    guardarRechazo(item) {
      this.msg.msgTitle = 'Confimar Rechazo de Cheque' 
      this.msg.msgAccion = 'rechazar cheque'
      let m = ''
      debugger
      if (this.gasto.total!=0) {
        m = 'Se emitirá un Comprobante Interno por el total del cheque '
        m += 'y una Factura a '+this.itemActual.librador+' por los gastos indicados.<br>'
      } else {
        m = 'Se emitirá un Comprobante Interno a '+this.itemActual.librador +' por el total del cheque<br>'
      }
      m += 'Y se restaurarán los movimientos cancelados por el cheque.'
      this.msg.msgBody = m
      this.msg.msgVisible = true
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },





    altaHTTP:function() {
      /* 
        Aca el registro es parecido a un pago salvo que no va en cta.cte.. 
        Solo se transfieren cheques y se recibe efectivo.
        Si el tercero esta vinculado tengo que realizar la notificacion correspondiente. 
      */
      return HTTP().post('/ventadecheques', {
        caja:                this.caja,
        fecha:               moment().format('YYYY-MM-DD'),
        perfiscal:           moment().format('YYYY-MM'),
        tipo:                'VE',
        cpr:                 'CIN-X '+this.sucursalFiscal+'-00000000',
        user_id:             this.userId,
        sucursal_id:         this.sucursal,
        tercero_id:          this.tercero_id,
        comprobante_id:      128,
        direccion_id:        this.editado.direccion_id,
        documento_id:        this.editado.documento_id,
        mediodepago_id:      1,
      //lista_id:            null,
        deposito_id:         null,
        vendedor_id:         null,
        moneda_id:           51,
        tasadescuento:       0,
        importedescuento:    0,
        retiva:              0,
        retgan:              0,
        retib:               0,
        gravado:             0,
        exento:              0,
        iva:                 0,
        total:               this.totEfeRecibido,
        regstk:              0,
        estado:              'F',
        activo:              true,
        observaciones:       'VENTA DE CHEQUES',
        articulos:           [],
        valores:             this.cartera,
        pendientes:          [],
        notificacion:        0,
        notificaEnBaseAOtro: 0,
        notificaOriginal:    0,
        gasto:               0,
      }).then(({ data }) => {
        this.dialogCambio = false
        this.listarHTTP(this.cual);
      });
    },





    rechazarHTTP:function() {
      /* 
        Aca el registro es parecido a un pago salvo que no va en cta.cte.. 
        Solo se transfieren cheques y se recibe efectivo.
        Si el tercero esta vinculado tengo que realizar la notificacion correspondiente. 
      */
      debugger
      let electronica = !this.sucursalDemo
      return HTTP().post('/rechazarcheque', {
        valor_id: this.itemActual.id,
        gasto: this.gasto,
        electronica: electronica,
        sucursalDemo: this.sucursalDemo,
        })
        .then(({ data }) => {
          debugger
          this.dialogRechazo = false
          this.listarHTTP(this.cual);
        });
    },



    
    
    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },





    selectCartera(item) {
      let pos = this.cartera.indexOf(item)
      this.totCheTerSel = 0
      if (pos>=0) {
        this.cartera[pos].seleccionado = this.cartera[pos].seleccionado == 1 ? 0 : 1
      }
      for (let i=0; i<=this.cartera.length-1; i++) {
        if (this.cartera[i].seleccionado==1) {
          this.totCheTerSel += this.roundTo(this.cartera[i].importe,2)
        }
      }
    },





    listarHTTP(cual) {
      this.cuales = 'Disponibles'
      if (cual==2) {
        this.cuales = 'Entregados'
      } else if (cual==3) {
        this.cuales = 'Rechazados'
      }
      debugger
      return HTTP().post('/cheques', { sucursal: this.sucursal, cuales: this.cuales})
        .then(({ data }) => {
          debugger
          let d = 0
          let hoy = moment()
          this.items = data;
          this.cartera = [];
          this.total = 0
          for (let i=0; i<=this.items.length-1; i++) {
            d = hoy.diff(this.items[i].fechafinanciera, 'days')
            this.items[i].fechafinanciera = moment(this.items[i].fechafinanciera).format('DD/MM/YY')
            this.items[i].dias =  d
            this.total += this.items[i].importe
            this.cartera.push({
              id:              this.items[i].id,
              abrev:           this.items[i].abrev,
              banco:           this.items[i].banco,
              banco_id:        this.items[i].banco_id,
              caja_id:         this.items[i].caja_id,
              cpringreso_id:   this.items[i].cpringreso_id,
              cuenta:          this.items[i].cuenta,
              cuentaorigen_id: this.items[i].cuentaorigen_id,
              fechafinanciera: this.items[i].fechafinanciera,
              id:              this.items[i].id,
              importe:         this.items[i].importe,
              librador:        this.items[i].librador,
              nrovalor:        this.items[i].nrovalor,
              seleccionado:    0,
              user:            this.items[i].userid,
              propio:          this.items[i].propio,
            })
            this.searchTerceros = '';
            this.isLoadingTerceros = false;
          }
      });
    },





    guardarCambio(item) {
      this.msg.msgTitle = 'Cambio de Cheques' 
      this.msg.msgAccion = 'cambiar cheques'
      this.msg.msgBody = 'Confirma el Cambio de Cheques?'
      this.msg.msgVisible = true
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item
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
    




    cambiarValores() {
      this.dialogCambio = true
    },
    




    cancelar() {
      this.dialogCambio = false;
    },
    




    calculos(cual) {
      if (cual==1) {
        this.totEfeRecibido = this.roundTo(this.totCheTerSel-(this.totCheTerSel*(this.porcentaje/100)),2)
      } else if (cual == 2) {
        this.porcentaje = this.roundTo(100-((this.totEfeRecibido*100)/this.totCheTerSel),2)
      }
    },





    calculoGasto(cual) {
      this.gasto.gravado = Number(this.gasto.gravado)
      this.gasto.tasaiva = Number(this.gasto.tasaiva)
      this.gasto.iva     = Number(this.gasto.iva)
      this.gasto.total   = Number(this.gasto.total)
      if (cual==1 && this.gasto.tasaiva!=0) {
        this.gasto.iva = this.roundTo(this.gasto.gravado*(this.gasto.tasaiva/100),2)
        this.gasto.total = this.roundTo(this.gasto.gravado+this.gasto.iva,2)
      } else if (cual == 2) {
        //this.gasto.gravado = this.roundTo(this.gasto.total/(1+(this.gasto.tasaiva/100)),2)
        this.gasto.iva = this.roundTo(this.gasto.gravado*(this.gasto.tasaiva/100),2)
        this.gasto.total = this.roundTo(this.gasto.gravado+this.gasto.iva,2)
      } else if (cual == 3) {
        this.gasto.tasaiva = this.roundTo((this.gasto.iva/this.gasto.gravado)*100,2)
        this.gasto.total = this.roundTo(this.gasto.gravado*(1+(this.gasto.tasaiva/100)),2)
      } else if (cual == 4) {
        this.gasto.gravado = this.roundTo(this.gasto.total/(1+(this.gasto.tasaiva/100)),2)
        this.gasto.iva = this.roundTo(this.gasto.total-this.gasto.gravado,2)
      }
    },
    
    



    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },





    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },





    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },





    print() {
      this.headersRes = [
        { title: 'Librador',   dataKey: 'librador',        halign: 'left',  width: 120 },
        { title: 'Banco',      dataKey: 'banco',           halign: 'left',  width: 120 },
        { title: 'Cuenta',     dataKey: 'cuenta',          halign: 'left',  width: 120 },
        { title: 'Número',     dataKey: 'nrovalor',        halign: 'rigth', width: 120 },
        { title: 'Fec.Finan',  dataKey: 'fechafinanciera', halign: 'left',  width: 120 },
        { title: 'Dias',       dataKey: 'dias',            halign: 'right', width: 120 },
        { title: 'Importe',    dataKey: 'importe2',        halign: 'right', width: 120 },
        ]
      for (let i=0; i<=this.items.length-1; i++) {
        //this.items[i].importe2 = this.formatImporte(this.items[i].importe,2)
      }
      this.imprimir('CHEQUES DISPONIBLES', this.headersRes, this.items, 'l' )
    },




    imprimir(informeTitulo, headersRes, itemRes, orientacion ) {
      var doc = new jsPDF(orientacion, 'pt');   // 'p' normal 'l' horizontal ( landscape )
      const totalPagesExp = '{total_pages_count_string}'
      const emp = this.empresa
      const tit = informeTitulo
//    const des = this.editado.fdesde.substr(8,2)+'/'+this.editado.fdesde.substr(5,2)+'/'+this.editado.fdesde.substr(0,4)
//    const has = this.editado.fhasta.substr(8,2)+'/'+this.editado.fhasta.substr(5,2)+'/'+this.editado.fhasta.substr(0,4)
//    ESTE ANDA PERO NO MUESTRA LA PAGINA
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
//        doc.setFontSize(12);
//        doc.text ( informeTitulo, 180, 67 )
          doc.setFontSize(8);
          doc.text ( 'gohu', orientacion == 'p' ? 565 : 785, 15 )
          doc.setFontSize(9);

          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.text(str, data.settings.margin.left, pageHeight-10 );
        },

        margin: {top: 100, bottom: 25},
        headStyles: {
          fillColor: [25, 21, 23], fontSize: 8,
        },
        styles: {
          fillColor: [236, 233, 223], fontSize: 8,
        },
        showHeader: true,
        headerStyles: {
          librador: { halign: "left",},
          dias: { halign: "right",},
//        importe: { halign: "right",}
        },
        columnStyles: {
          nrovalor: { halign: 'right', width: 50, },
          importe:  { halign: 'right', width: 90, },
          styles:   { fillColor: [100, 255, 255], fontSize: 8 },
        },
      });
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      doc.output ('dataurlnewwindow')
    },





  },
};
</script>
