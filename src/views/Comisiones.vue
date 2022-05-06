<template>
  <v-layout align-start class="ma-0">
    <v-flex>
      <v-row>
        <v-col v-for="(cbt, idx) in vendedores" v-bind:key="idx">
          <v-card @click="selectVendedor(cbt.tercero_id)"
            tile outlined
            max-width="170" class="mx-auto">
            <v-app-bar
              :color="cbt.tercero_id==filtroVendedor ? temas.cen_card_activo_bg : cbt.bg"
              :dark="cbt.tercero_id==filtroVendedor ? temas.cen_card_activo_dark : cbt.dark">
              <v-toolbar-title
                class="panel-font">{{ cbt!=null ? cbt.nombre : '' }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-list-item-avatar color="grey">
                <v-img height="40" width="40" :src="`/images/${cbt.avatar}`"></v-img>
              </v-list-item-avatar>
              <v-spacer></v-spacer>
            </v-app-bar>
            <v-container>
              <v-row dense>
                <v-col cols="12" class="caption">
                  $ {{ formatoImporte(cbt.total) }}
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

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
                <v-icon left>
                  mdi-tie
                </v-icon>
                <b>COMISIONES</b>
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
                class="ml-1"
                @click="setMes(mes)">
                {{ mes }}
              </v-chip>
              <v-progress-circular v-if="progress"
                class="ml-2"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-circular>
            </v-toolbar-title>

            <!-- Modal del diálogo para Alta y Edicion -->
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
            <v-data-table v-if="filtroComprobanteSel!='RECIBOS'"
              :headers="headersItems"
              :items="item.items"
              dense
              hide-default-footer>
              <template v-slot:item.nombre="{ item }">
                <span disable dark> {{
                  item.codigo=='1@1' ? item.texto : item.nombre
                }}</span>
              </template>
              <template v-slot:item.cantidad="{ item }">
                <span disable dark>{{ formatoImporte(item.cantidad) }}</span>
              </template>
              <template v-slot:item.precio="{ item }">
                <span disable dark>${{ formatoImporte(item.precio) }}</span>
              </template>
              <template v-slot:item.tasadescuento="{ item }">
                <span disable dark>{{ formatoImporte(item.tasadescuento) }}</span>
              </template>
              <template v-slot:item.importedescuento="{ item }">
                <span disable dark>${{ formatoImporte(item.importedescuento) }}</span>
              </template>
              <template v-slot:item.total="{ item }">
                <span disable dark>${{ formatoImporte(item.total) }}</span>
              </template>
            </v-data-table>
            <v-data-table v-else
              :headers="headersCancelaciones"
              :items="item.cancelaciones"
              dense
              hide-default-footer>
              <template v-slot:item.nombre="{ item }">
                <span disable dark> {{
                  item.codigo=='1@1' ? item.texto : item.nombre
                }}</span>
              </template>
              <template v-slot:item.cancelado.comprobante.fecha="{ item }">
                <span
                  disable dark>{{ formatoFechaCorta(item.cancelado.comprobante.fecha) }}
                </span>
              </template>
              <template v-slot:item.cancelado.importe="{ item }">
                <span
                  disable dark>${{ formatoImporte(item.cancelado.importe) }}
                </span>
              </template>
              <template v-slot:item.cancelado.pendiente="{ item }">
                <span
                  disable dark>${{ formatoImporte(item.cancelado.pendiente) }}
                </span>
              </template>
            </v-data-table>

          </td>
        </template>

        <template #item.tercero.razon_social="{ value }">
          <div class="text-truncate" style="max-width: 170px">
            {{ value }}
          </div>
        </template>
        <template v-slot:item.fecha="{ item }">
          <span disable dark>{{ formatoFechaCorta(item.fecha) }}</span>
        </template>
        <template v-slot:item.rentabilidad="{ item }">
          <span disable dark>$ {{ formatoImporte(item.rentabilidad) }}</span>
        </template>
        <template v-slot:item.importedescuento="{ item }">
          <span disable dark>$ {{ formatoImporte(item.importedescuento) }}</span>
        </template>
        <template v-slot:item.total="{ item }">
          <v-chip label
            :color="getColorTotal(item)">
            $ {{ formatoImporte(item.total) }}
          </v-chip>
          <v-badge v-if="item.observaciones=='REMITO'"
            class="pt-2"
            :content="'r'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true" rigth>
          </v-badge>
          <v-badge v-if="item.cae"
            class="pt-2"
            :content="'e'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true" rigth>
          </v-badge>
        </template>

        <template v-slot:item.pendientes[0].pendiente="{ item }">
          <span disabled dark>
            $ {{ formatoImporte(item.pendientes[0] ? item.pendientes[0].pendiente : 0) }}
          </span>
        </template>
        <template v-slot:item.estado="{ item }">
          <v-rating v-if="item.rating>=1 && item.rating<=5"
            dense
            v-model="item.rating"
            :color="temas.cen_estado_finalizado_bg"
            background-color="white"
            empty-icon="$ratingFull"
            x-small readonly>
          </v-rating>
          <v-chip v-else
            label
            class="caption"
            @mouseover="sayMessage(item, true)"
            @mouseleave="sayMessage(item, false)"
            :color="getEstado(item.estado,'c',item.pendientes[0],item.carga, item)"
            :dark="getEstado(item.estado,'k',item.pendientes[0],item.carga, item)">
            {{ getEstado(item.estado,'e',item.pendientes[0], item.carga, item) }}
          </v-chip>
        </template>
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
import Mail from "./Forms/mail.vue";
import XLSX from 'xlsx'
import jsPDF from 'jspdf'

export default {
  components: {
    SBar,
    Confirmacion,
    Mail,
    impresiones,
  },
  data: () => ({
    progress: false,
    elMes: '',
    elAnio: '',
    anio: '',
    anios: [],
    meses: [],
    acciones: [],
    losMeses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'],
    expanded: [],
    singleExpand: false,
    loading: true,
    vendedores: [],
    filtroComprobante: [1,6,14],
    filtroVendedor: 0,
    modelo: 'ventas',
    formTitle: '',
    itemActual: null,
    tl: "text-lowercase",
    items: [],
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
    dialog: false,            // para que la ventana de dialogo o modal no aparezca automáticamente

    // definimos los headers de la datatables
    headers: [
      { text: 'COMPROBANTE', value:'cpr', align: 'left', width: 175 },
      { text: 'FECHA', value:'fecha', align: 'left', width: 89 },
      { text: 'CLIENTE', value:'tercero.razon_social', align: 'left', width: 210 },
      { text: 'DESC', value:'importedescuento', align: 'end', width: 110 },
      { text: 'TRN', value:'rentabilidad', align: 'end', width: 110 },
      { text: 'PENDIENTE', value:'pendientes[0].pendiente', align: 'end', width: 120 },
      { text: 'TOTAL', value:'total', align: 'end', width: 150 },
      { text: 'ESTADO', value:'estado', align: 'left', width: 110 },
      { text: 'ACCIONES', value: 'accion', sortable: false, width: 90 },
    ],
    headersItems: [
      { text: 'Código', value:'articulo.codigo', class: 'grey lighten-3'},
      { text: 'Descripción', value:'articulo.nombre', class: "grey lighten-3"},
      { text: 'Ctt', value:'cantidad', align: 'end', class: "grey lighten-3"},
      { text: 'Precio', value:'precio', align: 'end', width: 120, class: "grey lighten-3"},
      { text: '%Des', value:'tasadescuento', align: 'end', class: "grey lighten-3"},
      { text: 'Des', value:'importedescuento', align: 'end', class: "grey lighten-3"},
      { text: 'Total', value:'total', align: 'end', width: 120, class: "grey lighten-3"},
    ],
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
      'notificaciones',
      'caja',
      'vinculosPadres', 
      'vinculosHijos',
      'empresa',
      'datosEmpresa',
      'responsable',
      'cuit',
      'operario',
      'operarioId',
      'operarioVendedor',
      'operarioTerceroId',
      'level',
    ]),
    mediosFiltrado() {},
    itemsTerceros () {},
    itemsTercerosTrans () {},
    itemsTercerosPdr () {},
    itemsBancos () {},

  },





  watch: {
    /*
    dialog (val) {
      val || this.cancelar();
    },
    */
    '$store.state.sucursal' () {
      //alert('listarHTTP en watch')
      this.listarHTTP()
    },

  },





  mounted () {
    this.$store.commit('closeAlert')
    moment.locale('es');
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
//      this.leoAnios()
//        .then(data => {
//        })
    }
  },





  created () {

    this.cen_activo_bg   = this.$store.state.temas.cen_card_activo_bg
    this.cen_activo_dark = this.$store.state.temas.cen_card_activo_dark

    //alert('en create')

    return HTTP().get('usersequipo/false/3/'+this.operarioVendedor+'/'+this.operarioTerceroId+'/'+this.operarioId)
      .then(({ data }) => {

        //alert('en create paso el http')

        for (let i=0; i<=data.length-1; i++) {
          if (data[i].area=='V') {
            this.vendedores.push({
              id:         data[i].tercero.user.id,
              nombre:     data[i].tercero.nombre.substr(0,7),
              avatar:     data[i].tercero.user.avatar,
              tercero_id: data[i].tercero.id,
              total: 0
            })
          }
        }

      this.leoAnios()
        .then(data => {
//          alert('vendedores length '+this.vendedores.length)
          this.filtroVendedor = this.vendedores.length>0 ? this.vendedores[0].tercero_id : null
//          alert('filtroVendedor '+this.filtroVendedor)
//          alert('listarHTTP en leoAnios')
          this.listarHTTP()
        })

    })
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





    setAnio() {
      this.anio = this.anio == null ? moment().format('YYYY') : this.anio
      this.meses = []
      for (let i=0; i<=this.periodos.length-1; i++) {
        if (this.periodos[i].substring(0,4)==this.anio) {
          let pos = Number(this.periodos[i].substring(4))-1
          this.meses.push(this.losMeses[pos])
        }
      }
      this.elMes = this.meses[0]
      //alert('listarHTTP en setAnio')
      this.listarHTTP(false)
    },






    selectVendedor(cual) {
      this.filtroVendedor = cual
      if (this.sucursalDemo) {
        this.filtroComprobante = [125]
      } else {
        this.filtroComprobante = [1,6,14,128,3,8,16,2,7,15]
      }
      //alert('listarHTTP en selectVendedor')
      this.listarHTTP()
    },





    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      this.acciones.push({nombre: 'Detalles', icon: 'mdi-glasses'})
      this.acciones.push({nombre: 'Imprimir', icon: 'mdi-printer'})
      this.acciones.push({nombre: 'Rastrear', icon: 'mdi-move-resize-variant'})
    },





    async selAccion(item) {
      if (item.nombre=='Detalles') {
      } else if (item.nombre=='WhatApp') {
      } else if (item.nombre=='Imprimir') {
      } else if (item.nombre=='Anular') {
      } else if (item.nombre=='Imputar NDC') {
      }

    },

    
    


    getEstado (estado, accion, pend, carga, item) {
      let c = ''
      let e = ''
      let d = 0
      let f = false
      for (let i=0; i<=item.items.length-1; i++) {
        if (item.items[i].faltante>0) {
          f = true
          break
        }
      }
      if (accion=='k') {
        if (estado==='P') {
          return this.temas.cen_estado_pendiente_dark
        } else if (estado==='T') {
          return this.temas.cen_estado_facturado_dark 
        } else if (estado==='H') {
          return this.temas.cen_estado_enembalaje_dark
        } else if (estado==='B') {
          return this.temas.cen_estado_embalado_dark
        } else if (estado==='E' && item.cpr.substr(0,3)=='PED') {
          return this.temas.cen_estado_enviado_dark
        } else if (estado==='F') {
          return this.temas.cen_estado_finalizado_dark
        } else if (estado==='A') {
          return this.temas.cen_estado_anulado_dark
        } else if (estado==='L') {
          return this.temas.cen_estado_pendiente_dark
        } else {
          return this.temas.cen_estado_pendiente_dark
        }
      }
      if (pend!==undefined) {
        let f1 =  moment().format('YYYY-MM-DD')
        let f2 =  moment(pend.vencimiento).format('YYYY-MM-DD')
        let hoy = moment(f1)
        let ven = moment(f2)
        d = hoy.diff(ven, 'days')
        if (pend.pendiente==0) {
          e = 'Finalizado'
          c = this.temas.cen_estado_finalizado_bg
        } else if (d>0) {
          e = 'Vencido('+d+')'
          c = this.temas.cen_estado_vencido_bg
        } else if (d==0) {
          e = 'Vence Hoy'
          c = this.temas.cen_estado_vencehoy_bg
        } else {
          e = 'A Vencer('+d+')'
          c = this.temas.cen_estado_avencer_bg
        }
      } else if (estado==='A') {
        e = 'Anulado'
        c = this.temas.cen_estado_anulado_bg
      } else if (estado==='F' && item.cpr.substr(0,3)!='PED') {
        if (item.cpr.substr(0,3)=='PED') {
          e = f ? 'Fin.c/Flte' : 'Facturado'
        } else {
          e = f ? 'Fin.c/Flte' : 'Finalizado'
        }
        c = this.temas.cen_estado_finalizado_bg
      } else {
        if (estado==='P') {
          e = 'Pendiente'
          c = this.temas.cen_estado_pendiente_bg 
        } else if (estado==='T') {
          e = 'Facturado'
          c = this.temas.cen_estado_facturado_bg 
        } else if (estado==='H') {
          e = 'En Embalaje'
          c = this.temas.cen_estado_enembalaje_bg 
        } else if (estado==='B') {
          e = 'Embalado'
          c = this.temas.cen_estado_embalado_bg 
        } else if (estado==='E') {
          if (item.cpr.substr(0,3)=='PED') {
            e = 'Enviado'
            } else {
            e = 'Envío'
          }
          c = this.temas.cen_estado_enviado_bg 
        } else if (estado==='F') {
          e = 'Finalizado'
          c = this.temas.cen_estado_finalizado_bg
        } else if (estado==='D') {                  // solo para vendedores
          e = 'Pendiente'
          c = this.temas.cen_estado_finalizado_bg   
        } else if (estado==='R') {                  // pedido listo para facturar
          e = 'P/Procesar'
          c = this.temas.cen_estado_finalizado_bg
        } else if (estado==='A') {
          e = 'Anulado'
          c = this.temas.cen_estado_anulado_bg
        } else if (estado==='L') {
          e = 'Parcial'
          c = this.temas.cen_estado_pendiente_bg
        }
      }
      if (accion==='c') {
        return c
      } else {
        return e
      }
    },





    listarHTTP(){

      debugger
      let perfiscal = ''
      if (this.elMes==undefined || this.elMes=='') return
      let m = this.queMesEs(this.elMes)
      perfiscal = this.anio+m
      let s = this.search.length>0 ? this.search : 'all'
      this.progress = true

      //alert('filtro vendedor en listarHTTP '+this.filtroVendedor)

      return HTTP().post('/'+this.modelo, {
        suc: this.sucursal,
        cpr: this.filtroComprobante,
        ope: this.filtroVendedor,
        perfiscal: perfiscal,
        search: s })
        .then(({ data }) => {

          this.progress = false
          this.items = data.venta

          return HTTP().post('/ventasvendedores', {
            suc: this.sucursal,
            per: perfiscal,
            ope: null })
            .then(({ data }) => {

              for (let i=0; i<=this.vendedores.length-1; i++) {
                this.vendedores[i].total = 0
              }
              for (let i=0; i<=this.vendedores.length-1; i++) {
                for (let j=0; j<=data.length-1; j++) {
                  if (data[j].vendedor_id==this.vendedores[i].tercero_id) {
                    this.vendedores[i].total = data[j].total
                  }
                }
              }
            })
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
      this.progress = false
      return p
    },





    setMes(mes) {
      this.elMes = mes
      //alert('listarHTTP en setMes')
      this.listarHTTP()
    },





    setAnio(anio) {
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
      //alert('listarHTTP en setAnio')
      this.listarHTTP()
    },





    async leoAnios() {

      //alert('en leoAnios')
      return HTTP().post('anios/', {tipo: 'V'})
        .then(({ data }) => {

          debugger
          //alert('en leoAnios paso el http')
          this.anios = []
          this.meses = []
          this.periodos = []
          let pos = -1

          // UN CASO ESPECIAL: SI ES VENDEDOR PUEDE ESTAR HACIENDO PEDIDOS POR CUENTA DE SUS CLIENTES
          // PERO SI CAMBIO EL MES Y EL CLIENTE NO HIZO MOVIMIENTOS AUN, NO TENDRA ACTUALIZADO EL PERIDODO
          // POR LO TANTO LO TENGO QUE AGREGAR A MANO.
          if (this.operarioVendedor) {
            // PRIMERO CALCULO EL AÑO Y MES ACUAL
            let aniomes = moment().format('YYYYMM')
            if (data[0][0].perfiscal != aniomes) {
              this.anios.push(aniomes.substr(0,4))
              pos = Number(aniomes.substr(5,2))-1
              this.meses.push(this.losMeses[pos])
            }
          }
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
        if (this.msg.msgAccion=='exportar a PDF') {
        } else if (this.msg.msgAccion=='exportar a XLS') {
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





    getColorTotal (item) {
      let tieneNdc = false
      if (item.pendientes!=null) {
        for (let i=0; i<= item.pendientes.length-1; i++) {
          if (item.pendientes[i].cancelaciones!=null) {
            for (let j=0; j<=item.pendientes[i].cancelaciones.length-1; j++) {
              if (item.pendientes[i].cancelaciones[j].cancelador.cpr.substr(0,3)=='NDC') {
                tieneNdc = true
                break
              }
            }
          }
        }
      }
      return (tieneNdc) ? this.temas.forms_btn_inactivo_bg : this.temas.barra_lateral_bg
    },





    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },





    formatoFechaCorta(value) {
      return moment(String(value)).format('DD-MM-YY')
    },



  },

};//2166

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
    /*font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;*/
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    /*font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;*/
    font-size: 100%;
  }
  .noti-font {
    font-family: Verdana, Arial, Helvetica, sans-serif;
/*    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;*/
    font-size: 90%;
  }
  .minifont {
    /*font-family: Verdana, Arial, Helvetica, sans-serif;*/
/*    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;*/
    font-size: 84%;
  }

</style>