<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        sort-by="id"
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
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="nuevo" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Nuevo Saldo Inicial</span>
              </v-tooltip>

            </template>

            <v-toolbar-title class="white--text">{{tituloResumen}}</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <!--DIALOGO DE DATOS -->
            <v-dialog v-model="dialog" max-width="900px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="cerrar"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{ formTitle }}
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-card>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="8" sm="8" md="8">
                          <v-autocomplete
                            ref="tercero"
                            v-model="tercero_id"
                            :items="itemsTerceros"
                            :loading="isLoadingTerceros"
                            :search-input.sync="searchTerceros"
                            :color="temas.forms_titulo_bg"
                            item-text="nombre"
                            item-value="id"
                            autofocus
                            label="Cliente"
                            placeholder="Escriba para buscar"
                            prepend-icon="mdi-database-search"
                            v-on:keydown.tab="buscoSiElTerceroTieneSaldoInicial(item)">
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            label="SALDO INICIAL"
                            v-model="total">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          v-show="inicializable && total>0"
                          :color="temas.cen_btns_bg"
                          text
                          @click="guardar">
                          Confirmar
                        </v-btn>
                      </v-card-actions>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN -->


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
        <template v-slot:item.total="{ item }">
          $ {{ formatoImporte(item.total,2) }}
        </template>
        <!--
        <template v-slot:item.accion="{ item }">
          <v-btn
            class="mr-2" fab x-small
            :color="temas.forms_btn_print_bg"
            :dark="temas.forms_btn_print_dark==true"
            @click="print(item)">
            <v-icon dark>mdi-printer</v-icon>
          </v-btn>
        </template>
        -->

        <!-- BOTONES DE LA GRID PRINCIPAL-->
        <template v-slot:item.accion="{ item }">
          <v-menu bottom left>
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
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';
import SBar from './Forms/snackbar.vue';
import Confirmacion from "./Forms/confirmacion.vue"
import XLSX from 'xlsx'

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    modelo: '',
    tabla: '',
    cual: '',
    searchTerceros: '',      // para el cuadro de búsqueda de datatables
    tituloResumen: '',
    descriptionLimit: 80,
    itemActual: null,
    tercero_id: '',
    total: null,
    acciones: [],
    isLoadingTerceros: false,
    entriesTerceros: [],
    inicializable: false,
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
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    items: [],
    headers: [
      { text: 'CLIENTE', value:'tercero_id'},
      { text: 'NOMBRE', value:'nombre'},
      { text: 'SUCURSAL', value:'sucnom'},
      { text: 'SALDO INICIAL', value:'total'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
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
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState(['sucursal','sucursalFiscal','empresa', 'tema', 'temas']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo Saldo Inicial' : 'Editar Saldo Inicial';
    },

    itemsTerceros () {
      return this.entriesTerceros.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...' : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },


  },
  watch: {
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
      debugger
      return HTTP().get('/'+this.tabla+'/false')
        .then(({ data }) => {
          this.entriesTerceros = []
          for (let i=0; i<= data.length-1; i++) {
            this.entriesTerceros.push(data[i].tercero)
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingTerceros = false))
    },

    '$route.path': function(val, oldVal){
      this.init_component();
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
      debugger
      router.push('/')
    },





    cerrar() {
      this.dialog = false;
    },





    init_component() {
      debugger
      let a = this.$store.state.route.fullPath.substring(1,this.$store.state.route.fullPath.length)
      if (a=='saldosinicialesproveedores') {
        this.cual = 'P'
        this.tituloResumen = 'Saldos Iniciales Proveedores'
        this.headers[0].text = 'Proveedor'
        this.tabla = 'usersproveedores'
      } else {
        this.cual = 'C'
        this.tituloResumen = 'Saldos Iniciales Clientes'
        this.headers[0].text = 'Cliente'
        this.tabla = 'usersclientes'
      }
      this.modelo = 'saldosiniciales';
      this.listarHTTP();
    },





    nuevo(cual) {
      this.dialog = true
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
      return HTTP().post('/'+this.modelo, { cual: this.cual,sucursal: this.sucursal })
        .then(({ data }) => {
          this.items = data;
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
    
    
    
    
    
    cancelar() {
      this.dialog = false
    },
    
    
    
    
    
    guardar() {

      debugger
      let pendientes = []
      let cpr = 'CIN-X'+' '+this.sucursalFiscal+'-'+'00000000'
      let cpr_id = 128
            
      pendientes.push({ 
        comprobante_id: null,
        vencimiento:    moment().format('YYYY-MM-DD'),
        importe:        this.total,
        pendiente:      this.total,
        concepto:       'SALDO INICIAL CUENTA CORRIENTE'
      })
       
      //debugger
      return HTTP().post('/creosaldoinicial', {
        fecha:               moment().format('YYYY-MM-DD'),
        perfiscal:           moment().format('YYYYMM'),
        tipo:                'VE',
        cpr:                 cpr,
        user_id:             this.userId,
        sucursal_id:         this.sucursal,
        tercero_id:          this.tercero_id,
        comprobante_id:      cpr_id,
        direccion_id:        null,
        documento_id:        null,
        mediodepago_id:      null,
        lista_id:            null,
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
        total:               this.total,
        regstk:              0,
        estado:              'F',
        activo:              true,
        observaciones:       'SALDO INICIAL CUENTA CORRINTE',
        carga:               'S',
        pendientes:          pendientes,
      }).then(({ data }) => {
        this.dialog = false
        this.listarHTTP();
      });

    },





    buscoSiElTerceroTieneSaldoInicial() {
      this.inicializable = true
      return HTTP().post('/tienesaldoinicial', { tercero: this.tercero_id, cual: this.cual, sucursal: this.sucursal })
        .then(({ data }) => {
          //debugger
          if (data==true) {
            this.msg.msgTitle = 'Saldo inicial existente'
            this.msg.msgBody = 'Esta cuenta ya tiene saldo inicial ingresado.'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'saldo inicial exstente'
            this.msg.msgButtons = ['Aceptar']
            this.inicializable = false
          } else {
            return HTTP().post('/tienemovimientos', { tercero: this.tercero_id, sucursal: this.sucursal })
              .then(({ data }) => {
                debugger
                if (data[0].ctt!=0) {
                  this.msg.msgTitle = 'Cuenta con Movimientos'
                  this.msg.msgBody = 'Esta cuenta ya posee movimientos, no se puede ingresar el saldo inicial.'
                  this.msg.msgVisible = true
                  this.msg.msgAccion = 'cuenta con movimientos'
                  this.msg.msgButtons = ['Aceptar']
                  this.inicializable = false
                }
            })
          }
      });
    },





    setAcciones(item) {
      debugger
      this.itemActual = item
      this.acciones = []
      this.acciones.push({nombre: 'Inf Resumido', icon: 'mdi-format-list-bulleted'})
      this.acciones.push({nombre: 'Con Imputaciones', icon: 'mdi-format-line-weight'})
      this.acciones.push({nombre: 'Con Imputacioens y Valores', icon: 'mdi-format-line-style'})
    },





    selAccion(item) {
      //debugger
      if (item.nombre=='Inf Resumido') {
        this.print(this.itemActual, item.nombre)
      } else if (item.nombre=='Imputaciones') {
        this.print(this.itemActual, item.nombre)
      } else if (item.nombre=='Impuaciones y Valores') {
        this.print(this.itemActual, item.nombre)
      }
    },





    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },



  },
};
</script>
