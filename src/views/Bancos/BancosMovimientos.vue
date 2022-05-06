<template>
  <v-layout align-start>
    <v-flex>

      <v-row>
        <v-col v-for="(ban, idx) in banItems" v-bind:key="idx">
          <div class="contenedor-galeria">
            <v-hover v-slot="{ hover}">
              <v-card tile class="my-0 ml-2" max-width="200"
                @click="selectBanco(ban.nombre)"
                :elevation="hover ? 12 : 1"
                open-delay="200"
                :class="{ 'on-hover': hover }">
                <v-img height="90" width="215"
                  :src="`/images/${ban.imagen}`">
                </v-img>
                <template slot="progress"></template>
                <v-card-text class="pt-2 pb-0 pl-4 minifont">
                  <v-chip-group column multiple>
                    <v-chip v-for="(cue, i) in ban.cuentas" :key="i"
                      class="ml-3 mt-0 minifont" outlined multiple
                      @click="selectCuenta(cue)">
                      {{cue.abrev}} - {{ cue.cuenta }}
                      <v-avatar v-if="cue.sel">
                        <v-icon>mdi-checkbox-marked-circle</v-icon>
                      </v-avatar>
                    </v-chip>
                  </v-chip-group>
                </v-card-text>
                <v-card-actions>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab x-small outlined
                        :color="temas.forms_titulo_bg"
                        :dark="temas.forms_titulo_dark==true"
                        class="mr-1 ml-1 mt-0"
                        @click="nuevoMovimiento(cue)" v-on="on">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Nuevo Movimiento</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab x-small outlined
                        :color="temas.forms_titulo_bg"
                        :dark="temas.forms_titulo_dark==true"
                        class="mr-1 ml-1 mt-0"
                        @click="nuevoSaldoBancario(cue)" v-on="on">
                        <v-icon>mdi-bank</v-icon>
                      </v-btn>
                    </template>
                    <span>Nuevo Saldo Bancario</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab x-small outlined
                        :color="temas.forms_titulo_bg"
                        :dark="temas.forms_titulo_dark==true"
                        class="mr-1 ml-1 mt-0"
                        @click="print(cue)" v-on="on">
                        <v-icon>mdi-printer</v-icon>
                      </v-btn>
                    </template>
                    <span>Imprimir Movimientos</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab x-small outlined
                        :color="temas.forms_titulo_bg"
                        :dark="temas.forms_titulo_dark==true"
                        class="mr-1 ml-1 mt-0"
                        @click="exportexcel(cue)" v-on="on">
                        <v-icon>mdi-file-excel-box</v-icon>
                      </v-btn>
                    </template>
                    <span>Imprimir Movimientos</span>
                  </v-tooltip>
                </v-card-actions>
              </v-card>
            </v-hover>
          </div>
        </v-col>
        <v-col>
          <div>
            <v-card tile class="my-0 ml-2" max-width="230">
              <v-card-text class="pt-2 pb-0 pl-4 minifont2">
                <span>
                  <v-row>
                    <v-col cols="6" sm="6" md="6" class="pb-0">Banco</v-col>
                    <v-col cols="6" sm="6" md="6" class="pb-0">
                      <b>${{ formatoImporte(saldoResumen) }}</b>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6" sm="6" md="6" class="pt-0 pb-0">Empresa</v-col>
                    <v-col cols="6" sm="6" md="6" class="pt-0 pb-0">
                      <b>${{ formatoImporte(saldoEmpresa) }}</b>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6" sm="6" md="6" class="pt-0 pb-0">Chq.Ingr/hoy</v-col>
                    <v-col cols="6" sm="6" md="6" class="pt-0 pb-0">
                      <b>${{ formatoImporte(chqACubrirHoy) }}</b>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6" sm="6" md="6" class="pt-0 pb-0">A Cubrir</v-col>
                    <v-col cols="6" sm="6" md="6" class="pt-0 pb-0">
                      <b>${{ formatoImporte(aCubrir) }}</b>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6" sm="6" md="6" class="pt-0">A Dep/Hoy</v-col>
                    <v-col cols="6" sm="6" md="6" class="pt-0">
                      <b>${{ formatoImporte(valADepositarHoy) }}</b>
                    </v-col>
                  </v-row>
                </span>
              </v-card-text>
            </v-card>
          </div>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        class="elevation-3"
        show-expand
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

            <v-toolbar-title
              :color="temas.forms_titulo_bg"
              :dark="temas.forms_titulo_dark==true"
              class="body-2" v-model="sucursal">
              <v-chip class="ml-0" label
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark">
                <v-icon left>
                  mdi-bank
                </v-icon>
                <b class="panel-font">BANCOS</b>
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
                class="ml-1 panel-font"
                @click="setMes(mes)">
                {{ mes }}
              </v-chip>
              <v-progress-circular v-if="progress==true"
                class="ml-2"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-circular>
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->

            <!--NUEVO MOVIMIENTO -->
            <v-dialog v-model="dialogMovimiento" max-width="1200px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true"
                  icon @click="cerrarMovimiento">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  Nuevo Movimiento Bancario {{ bancoSel }} - {{ abrev }}
                </span>
                <v-spacer></v-spacer>
                <v-btn v-show="mov.total!=0"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="guardarMovimiento(item)">
                  Confirmar
                </v-btn>

              </v-toolbar>

              <v-card>
                <v-form ref="pend">
                  <v-card-text>
                    <v-container>

                      <!-- DATOS DE LA FACTURA POR RECHAZO -->
                      <v-row>
                        <v-col cols="9" sx="9" mx="9" class="pt-0">
                          <v-select
                            v-model="mov.bancodmov_id"
                            :items="bancodmovs"
                            outlined
                            autofocus
                            item-value="id" item-text="nombre"
                            :color="temas.forms_titulo_bg"
                            label="Código de Movimiento Bancario"
                            @change="setNewMovBan(item)">
                          </v-select>
                        </v-col>
                        <v-col cols="3" sx="3" mx="3" class="pt-0">
                          <v-switch v-show="mov.bancodmov_id<3"
                            label="Imputa en Caja"
                            v-model="mov.muevecaja"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2" sx="2" mx="2" class="pt-0">
                          <v-text-field
                            dense outlined
                            v-model="mov.numero"
                            label="Número Mov.">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sx="3" mx="3" class="pt-0">
                          <v-text-field
                            dense outlined
                            type="date"
                            v-model="mov.fecha"
                            label="Fecha">
                          </v-text-field>
                        </v-col>
                        <v-col cols="7" sx="7" mx="7" class="pt-0">
                          <v-text-field
                            dense outlined
                            v-model="mov.observaciones"
                            label="Observaciones">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="3" sm="3" md="3" class="pt-0">
                          <v-text-field v-show="mov.bancodmov_id==3"
                            dense outlined
                            v-model="mov.gravado"
                            label="Gravado"
                            @change="calculoMov(1)">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3" class="pt-0">
                          <v-select v-show="mov.bancodmov_id==3"
                            dense outlined
                            v-model="mov.iva_id"
                            label="% de IVA"
                            :color="temas.forms_titulo_bg"
                            :items="ivaTasas"
                            item-value="id" item-text="nombre"
                            @change="calculoMov(2)">
                          </v-select>
                        </v-col>
                        <v-col cols="3" sm="3" md="3" class="pt-0">
                          <v-text-field v-show="mov.bancodmov_id==3"
                            dense outlined
                            v-model="mov.iva"
                            label="Importe de IVA"
                            @change="calculoMov(3)">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3" class="pt-0">
                          <v-text-field
                            :disabled="mov.bancodmov_id==6"
                            dense outlined
                            v-model="mov.total"
                            label="Total"
                            @change="calculoMov(4)">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <!-- GRILLA DE CHEQUES PARA DEPOSITAR -->
                      <v-row>
                        <v-col cols="12" sm="12" md="12" class="pt-0">
                          <v-data-table v-show="mov.bancodmov_id==6"
                            v-model="selectedMovs"
                            :headers="headersDep"
                            :items="cartera"
                            dense
                            class="elevation-3"
                            item-key="id"
                            :footer-props="footerProps5">
                            <template v-slot:item.librador="{ item }">
                              <span>{{item.librador.substring(0,20)}}</span>
                            </template>
                            <template v-slot:item.banco="{ item }">
                              <span>{{item.banco.substring(0,20)}}</span>
                            </template>
                            <template v-slot:item.importe="{ item }">
                              <span>${{ formatoImporte(item.importe) }}</span>
                            </template>
                            <template v-slot:item.fechafinanciera="{ item }">
                              <span>{{ formatoFechaCorta(item.fechafinanciera) }}</span>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    :color=
                                    "item.seleccionado==0?
                                    temas.cen_btns_bg:
                                    temas.cen_card_activo_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="selectChe(item)" v-on="on">
                                    <v-icon>mdi-checkbox-marked-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span>Seleccionar</span>
                              </v-tooltip>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <!-- FIN GRILLA DE CHEQUES PARA DEPOSITAR -->
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DEL NUEVO MOVIMIENTO -->


            <!--NUEVO SALDO BANCARIO -->
            <v-dialog v-model="dialogSaldoBancario" max-width="400px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true"
                  icon @click="cerrarSaldoBancario">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  Nuevo Saldo Bancario
                </span>
                <v-spacer></v-spacer>
                <v-btn v-show="saldoBancario.saldo!=0"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="guardarSaldoBancario(item)">
                  Confirmar
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form ref="sald">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="2" sx="2" mx="2">
                        </v-col>
                        <v-col cols="8" sx="8" mx="8" class="pt-3">
                          <span class="pt-0 pb-4">
                            Cuenta <b>{{abrev}}</b>
                          </span>
                        </v-col>
                        <v-col cols="2" sx="2" mx="2">
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2" sx="2" mx="2">
                        </v-col>
                        <v-col cols="8" sx="8" mx="8" class="pt-3">
                          <v-text-field
                            dense outlined autofocus
                            type="date"
                            v-model="saldoBancario.fecha"
                            label="Fecha">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sx="2" mx="2">
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2" sx="2" mx="2">
                        </v-col>
                        <v-col cols="8" sm="8" md="8" class="pt-0 pb-0">
                          <v-text-field
                            dense outlined
                            v-model="saldoBancario.saldo"
                            label="Saldo">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sx="2" mx="2">
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DEL NUEVO SALDO -->
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
            <v-col cols="7" sm="7">
              <span v-for="(fe, idx) in filtrosEstados" v-bind:key="idx">
                <v-badge
                  class="pt-2 pl-0 pr-0" overlap :content="fe.ctt"
                  :color=
                  "fe.tip==filtroEstadoSel?temas.cen_card_activo_bg:temas.barra_principal_bg"
                  :dark=
                  "fe.tip==filtroEstadoSel?temas.cen_card_activo_dark:temas.barra_principal_dark"
                  rigth>
                  <v-chip
                    dense :value="fe" label
                    :color=
                    "fe.tip==filtroEstadoSel?temas.cen_card_activo_bg:temas.barra_principal_bg"
                    :dark=
                    "fe.tip==filtroEstadoSel?temas.cen_card_activo_dark:temas.barra_principal_dark"
                    class="ml-2 mini-font"
                    @click="setFiltroEstado(fe)">
                    {{ fe.tip }}
                  </v-chip>
                </v-badge>
              </span>
            </v-col>
          </v-row>
          <!-- FIN DE LA BARRA DE BUSQUEDA -->
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-data-table
              :headers="headersValores"
              :items="item.valores"
              dense
              hide-default-footer>
              <template v-slot:item.fecha="{ item }">
                <span>{{ formatoFechaCorta(item.fecha) }}</span>
              </template>
              <template v-slot:item.importe="{ item }">
                <span>${{ formatoImporte(item.importe) }}</span>
              </template>
            </v-data-table>
          </td>
        </template>
        <template v-slot:item.importe="{ item }">
          $ {{ formatoImporte(item.importe,2) }}
        </template>
        <template v-slot:item.fecha="{ item }">
          <span disable dark>{{ formatoFechaCorta(item.fecha) }}</span>
        </template>
        <template v-slot:item.fechaconciliacion="{ item }">
          <span disable dark>
            {{ item.fechaconciliacion==null ? '' : formatoFechaCorta(item.fechaconciliacion) }}
          </span>
        </template>
        <template v-slot:item.tercero="{ item }">
          <span>{{ item.tercero==null ? item.observaciones : item.tercero }}</span>
        </template>
        <template v-slot:item.estado="{ item }">
          <v-chip
            label
            class="mini-font"
            :color="getEstado(item.estado,'c')"
            :dark="getEstado(item.estado,'k')">
            {{ getEstado(item.estado,'e') }}
          </v-chip>
        </template>
        <template v-slot:item.valores[0].egresados.tercero.nombre="{ item }">
          <span>
            {{item.valores.length ?
            item.valores[0].egresados.tercero.nombre :
            'gasto'}}
            {{item.valores.length ? item.valores[0].egresados.tercero.nombre : 'aa'}}
          </span>
        </template>
        <template v-slot:item.terceroNombre="{ item }">
          <span>{{item.terceroNombre.substring(0,15)}}</span>
        </template>

        <!-- BOTONES DE LA GRID PRINCIPAL-->
        <template v-slot:item.accion="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-if="item.abrev=='CHP'|| item.abrev=='DPQ'|| item.abrev=='DPE'||
                          item.abrev=='TRE'|| item.abrev=='TRI'"
                class="mr-2" fab x-small
                :color="temas.forms_btn_activar_bg"
                :dark="temas.forms_btn_activar_dark==true"
                @click="conciliarMovimientoHTTP(item, item.estado==='P'?true:false)" v-on="on">
                <v-icon>
                  {{item.estado=='P'?'mdi-thumb-up-outline':'mdi-thumb-down-outline'}}
                </v-icon>
              </v-btn>
            </template>
            <span>{{item.estado=='P'?'Conciliar':'Quitar conciliación'}}</span>
          </v-tooltip>

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
    bancoSel: '',
    aCubrir: 0,
    chqACubrirHoy: 0,
    valADepositarHoy: 0,
    saldoEmpresa: 0,
    saldoResumen: 0,
    tituloResumen: '',
    progress: false,
    itemActual: null,
    acciones: [],
    selectedMovs:[],
    totMovSel: 0,
    cttMovSel: 0,
    totResumen: 0,
    totCheTerSel: 0,
    valores: [],
    cueItems: [],
    banItems: [],
    ivaTasas: [],
    descriptionLimit: 80,
    tercero_id: 0,
    cuenta: 0,
    abrev: '',
    saldocuenta: 0,
    saldoanterior: 0,
    saldoBancario: {
      fecha: null,
      saldo: null,
    },
    mov: {
      bancodmov_id: 3,
      fecha: null,
      observaciones: 'DEPOSITO EN EFECTIVO',
      numero: '',
      muevecaja: 0,
      gravado: 0,
      iva_id: 5,
      tasaiva: 0,
      iva: 0,
      total: 0
    },
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
    elMes: '',
    elAnio: '',
    anio: '',
    mes: '',
    anios: [],
    meses: [],
    periodos: [],
    losMeses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'],

    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    bancodmovs: [],
    headersRes: [
      { text: 'Fecha', value:'fecha', align: 'left', width: 120 },
      { text: 'Total', value:'total', align: 'right', width: 120 }
    ],
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    footerProps: {'items-per-page-options': [5, 12, 15, 100]},
    footerProps5: {'items-per-page-options': [5]},
    search: '', 
    dialog: false,
    dialogMovimiento: false, 
    dialogSaldoBancario: false,
    items: [],
    itemsAll: [],
    cartera: [],
    cuales: 'Conciliaciones',
    headers: [
      { text: 'Fecha', value: 'fecha', width: 89 },
      { text: 'T.Mov', value: 'abrev', width: 60, align: 'left' },
      { text: 'Descripcion', value: 'nombre', width: 140 },
      { text: 'Nro', value: 'numero', width: 70 },
      { text: 'Tercero', value: 'terceroNombre', width: 150 },
      { text: 'Importe', value: 'importe', align: 'right', width: 100 },
      { text: 'Estado', value: 'estado', align: 'left', width: 90 },
      { text: 'Sel', value: 'accion', sortable: false, width: 90 }
    ],
    headersValores: [
      { text: 'Id', value: 'id', width: 89 },
      { text: 'Fecha', value: 'fecha', width: 89 },
      { text: 'Tercero', value: 'terceroNombre', width: 89 },
      { text: 'Importe', value: 'importe', align: 'right', width: 170 },
    ],
    headersDep: [
      { text: 'Librador', value:'librador', width: 210},
      { text: 'Banco', value:'banco', width: 210},
      { text: 'Cuenta', value:'cuenta', width: 140},
      { text: 'Número', value:'nrovalor', width: 100},
      { text: 'Fec.Finan', value:'fechafinanciera', width: 105},
      { text: 'Importe', value:'importe', width: 100, align: 'end'},
   // { text: 'Selec.', value:'seleccionado', width: 80, align: 'end'},
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
    filtrosEstados: [],
    filtroEstadoSel: 'Todos',
  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState(['sucursal','sucursalFiscal','empresa', 'tema', 'temas','caja', 'logotipo']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo' : 'Editar';
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
      this.init_component();
    },
  },

  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    }

    return HTTP().get('/afipiva').then(({ data }) => {
      this.ivaTasas = []
      for (let i=0; i<=data.length-1; i++) {
        this.ivaTasas.push(data[i])
      }

      return HTTP().get('/bancoscodigosdemovimientos').then(({ data }) => {
        this.bancodmovs = []
        for (let i=0; i<=data.length-1; i++) {
          this.bancodmovs.push(data[i])
        }
        this.mov.bancodmov_id = this.bancodmovs[0].id

        return HTTP().get('/tercerocuentas/'+this.$store.state.tercero).then(({ data }) => {
          this.cueItems = []
          for (let i=0; i<=data[0].cuentas.length-1; i++) {
            this.cueItems.push(data[0].cuentas[i])
          }

          // CARGO LAS CUENTAS BANCARIAS DEL USUARIO, DESPUES DESMENUSO EN EL PAGO
          // TARJETAS, CHEQUERAS, ETC. SEGUN SELECCIONE
          for (let i=0; i<=this.cueItems.length-1; i++) {
            let pos = this.banItems.findIndex(x=>x.id==this.cueItems[i].banco.id)
            if (pos==-1) {
              this.banItems.push({
                id: this.cueItems[i].banco.id,
                nombre: this.cueItems[i].banco.nombre,
                imagen: this.cueItems[i].banco.imagen,
                cuentas: []
              })
              this.banItems[this.banItems.length-1].cuentas.push({
                id: this.cueItems[i].id,
                cuenta: this.cueItems[i].cuenta,
                abrev: this.cueItems[i].abrev,
                sel: false,
                saldo: 0,
              })
            } else {
              this.banItems[pos].cuentas.push({
                id: this.cueItems[i].id,
                cuenta: this.cueItems[i].cuenta,
                abrev: this.cueItems[i].abrev,
                sel: false,
                saldo: 0,
              })
            }
          }
          if (this.banItems.length) {
            this.bancoSel = this.banItems[0].nombre
            if (this.banItems[0].cuentas.length) {
              this.banItems[0].cuentas[0].sel = true
            }
            this.cuenta = this.cueItems[0].id
            this.abrev = this.cueItems[0].abrev+' - '+this.cueItems[0].cuenta
            this.salCuenta()
            this.cargoPeriodosDeLaCuenta()
          }
        })
      })
    })
  },

  created () {
    this.init_component()
  },

  methods: {
    closeForm(){
      router.push('/')
    },

    init_component() {
    },

    cargoPeriodosDeLaCuenta() {
      return HTTP().get('/bancosperiodos/'+this.cuenta).then(({ data }) => {
        this.anios = []
        this.meses = []
        this.periodos = []
        let pos = -1
        for (let i=0; i<=data.length-1; i++) {
          this.periodos.push(data[i].periodo)
          pos = this.anios.findIndex( x => x == data[i].periodo.substring(0,4))
          if (pos==-1) {
            this.anios.push(data[i].periodo.substring(0,4))
          }
        }

        for (let i=0; i<=this.periodos.length-1; i++) {
          if (this.periodos[i].substring(0,4)==this.anios[0]) {
            pos = Number(data[i].periodo.substring(5,7))-1
            this.meses.push(this.losMeses[pos])
          }
        }

        this.mes = moment().format('MM')
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
        this.listarHTTP(true)
      })
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
        } else if (this.msg.msgAccion=='conciliar movimiento') {
          this.conciliarMovimientoHTTP(true)
        } else if (this.msg.msgAccion=='movimiento bancario') {
          this.nuevoMovimientoBancarioHTTP()
        } else if (this.msg.msgAccion=='nuevo saldo bancario') {
          this.nuevoSaldoBancarioHTTP()
        }
      }
      this.msg.msgVisible = false;
    },

    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      this.acciones.push({nombre: 'Conciliar', icon: 'mdi-checkbox-marked-outline'})
    },

    nuevoSaldoBancario() {
      this.dialogSaldoBancario = true
      this.saldoBancario.fecha = moment().format('YYYY-MM-DD')
      this.saldoBancario.saldo = 0
    },

    async selAccion(item) {
      this.msg.msgTitle = 'Conciliar Movimiento' 
      this.msg.msgAccion = 'conciliar movimiento'
      this.msg.msgBody = 'Confirma la conciliación del movimiento seleccionado?'
      this.msg.msgVisible = true
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    cerrarMovimiento(item) {
      this.dialogMovimiento = false
    },

    cerrarSaldoBancario(item) {
      this.dialogSaldoBancario = false
    },

    setNewMovBan() {
      if (this.mov.bancodmov_id==1) {
        this.mov.observaciones = 'DEPOSITO EN EFECTIVO'
      } else if (this.mov.bancodmov_id==2) {
        this.mov.observaciones = 'EXTRACCION EN EFECTIVO'
      } else if (this.mov.bancodmov_id==3) {
        this.mov.observaciones = 'GASTO BANCARIO'
      } else if (this.mov.bancodmov_id==6) {
        this.mov.observaciones = 'DEPOSITO DE CHEQUES'
      } else if (this.mov.bancodmov_id==10) {
        this.mov.observaciones = 'AJUSTE DE SALDO'
      }
    },

    salCuenta() {
      if (this.anio!='') {
        let per = this.anio+'-'+this.mes
        return HTTP().post('/bancoscuentasaldo', { cuenta: this.cuenta, periodo: per }).then(({ data }) => {
          this.saldoCuenta = data.saldo == null ? 0 : data.saldo
        })
      }
    },

    selectBanco(cual) {
      this.bancoSel = cual
    },

    setMes(mes) {
      let pos = this.losMeses.indexOf(mes)+1
      this.mes = pos.toString().padStart(2,'0')
      this.elMes = mes
      this.filtroEstadoSel = 'Todos'
      this.listarHTTP(true)
    },

    cambioCuenta() {
      this.salCuenta()
      this.listarHTTP(true);
    },

    selectCuenta(cue) {
      for (let i=0; i<=this.banItems.length-1; i++) {
        for (let j=0; j<=this.banItems[i].cuentas.length-1; j++) {
          this.banItems[i].cuentas[j].sel = this.banItems[i].cuentas[j].cuenta==cue.cuenta
        }
      }
      this.cuenta = cue.id
      this.abrev = cue.abrev+' - '+cue.cuenta
      this.cargoPeriodosDeLaCuenta()
    },

    nuevoMovimiento() {
      this.cartera = []
      this.dialogMovimiento = true

      this.mov.bancodmov_id = 1
      this.mov.fecha = moment().format('YYYY-MM-DD')
      this.mov.numero = ''
      this.mov.muevecaja = 1
      this.mov.observaciones = 'DEPOSITO EN EFECTIVO'
      this.mov.gravado = 0
      this.mov.iva_id = 5
      this.mov.tasaiva = 0
      this.mov.iva = 0
      this.mov.total = 0

      return HTTP().post('/cheques', { sucursal: this.sucursal, cuales: 'Disponibles'}).then(({ data }) => {
        for (let i=0; i<=data.length-1; i++) {
          if (moment(data[i].fechafinanciera).format('YY-MM-DD') <= moment().format('YY-MM-DD') ) {
            this.cartera.push({
              id:              data[i].id,
              abrev:           data[i].abrev,
              banco:           data[i].banco,
              banco_id:        data[i].banco_id,
              caja_id:         data[i].caja_id,
              cpringreso_id:   data[i].cpringreso_id,
              cuenta:          data[i].cuenta,
              cuentaorigen_id: data[i].cuentaorigen_id,
              fechafinanciera: data[i].fechafinanciera,
              id:              data[i].id,
              importe:         data[i].importe,
              librador:        data[i].librador,
              nrovalor:        data[i].nrovalor,
              seleccionado:    0,
              user:            data[i].userid,
            })
          }
        }
      });
    },

    conciliarMovimientoHTTP:function(item, concilia) {
      return HTTP().post('/conciliarmovimientos', { movid: item.id, concilia: concilia }).then(({ data }) => {
        if (data=='error') {
          this.msg.msgTitle = 'Error' 
          this.msg.msgAccion = 'error conciliacion'
          this.msg.msgBody = 'Hubo un error en la actualización de los registros'
          this.msg.msgVisible = true
          this.msg.msgButtons = ['Aceptar']
        }
        this.listarHTTP(false)
      });
    },

    nuevoMovimientoBancarioHTTP() {
      let bc = []
      let pos = this.bancodmovs.findIndex(x => x.id == this.mov.bancodmov_id)
      return HTTP().post('/bancosnuevomovimiento', {
        caja:           this.caja,
        mov:            this.mov,
        cartera:        this.cartera,
        cuenta:         this.cuenta,
        ingreso:        this.bancodmovs[pos].ingreso
      }).then(({ data }) => {
        if (data) {
          this.msg.msgTitle = 'Conciliación de Movimientos' 
          this.msg.msgAccion = 'movimientoOk'
          this.msg.msgBody = '¡El movimiento bancario se ha registrado con exito!'
          this.msg.msgVisible = true
          this.msg.msgButtons = ['Aceptar']
          this.salCuenta()
        } else {
          this.msg.msgTitle = 'Conciliación de Movimientos' 
          this.msg.msgAccion = 'movimientoError'
          this.msg.msgBody = '¡El movimiento bancario NO se ha registrado!'
          this.msg.msgVisible = true
          this.msg.msgButtons = ['Aceptar']
        }
        this.dialogMovimiento = false
        this.listarHTTP(true);
      });
    },

    nuevoSaldoBancarioHTTP() {
      return HTTP().post('/bancosnuevosaldobancario', {
        cuenta: this.cuenta,
        fecha:  this.saldoBancario.fecha,
        saldo:  this.saldoBancario.saldo,
      }).then(({ data }) => {
        if (data) {
          this.msg.msgTitle = 'Nuevo Saldo Bancario' 
          this.msg.msgAccion = 'nuevoSaldoBancario'
          this.msg.msgBody = '¡El saldo bancario se ha registrado con exito!'
          this.msg.msgVisible = true
          this.msg.msgButtons = ['Aceptar']
          this.salCuenta()
          this.listarHTTP(true)
        } else {
          this.msg.msgTitle = 'Error'
          this.msg.msgAccion = 'saldoBancarioError'
          this.msg.msgBody = '¡El Saldo Bancario NO se ha registrado!'
          this.msg.msgVisible = true
          this.msg.msgButtons = ['Aceptar']
        }
        this.dialogSaldoBancario = false
      });
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
        total:               0,
        regstk:              0,
        estado:              'F',
        activo:              true,
        observaciones:       'VENTA DE CHEQUES',
        articulos:           [],
        valores:             [],
        pendientes:          [],
        notificacion:        0,
        notificaEnBaseAOtro: 0,
        notificaOriginal:    0,
        gasto:               0,
      }).then(({ data }) => {
        this.listarHTTP(true);
      });
    },
    
    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    selectChe(item) {
      let pos = this.cartera.indexOf(item)
      this.mov.total = 0
      if (pos>=0) {
        this.cartera[pos].seleccionado = this.cartera[pos].seleccionado == 1 ? 0 : 1
      }
      for (let i=0; i<=this.cartera.length-1; i++) {
        if (this.cartera[i].seleccionado==1) {
          this.mov.total += this.cartera[i].importe
        }
      }
      this.mov.total = this.roundTo(this.mov.total,2)
    },

    listarHTTP(asignoSel) {
      return HTTP().post('/bancosmovimientos',{cuenta: this.cuenta, periodo: this.elAnio+'-'+this.mes}).then(({data})=>{
        this.items = [];
        this.saldoEmpresa = 0;
        this.saldoResumen = 0;
        this.aCubrir = 0;
        this.chqACubrirHoy = 0;
        this.valADepositarHoy = 0;

        if (data.salBan.length) {
          this.saldoResumen = data.salBan[0].saldobanco;
        }
        this.items = []

        // ESTO ES UN SUPER PARCHE, TENGO QUE ANALIZAR BIEN COMO VIENE EL data.MovBan
        for (let i=0; i<=data.movBan.length-1; i++) {
          let terceroNombre = ''
          if (data.movBan[i].valores.length) {
            if (data.movBan[i].valores[0].egresados!=null) {
              terceroNombre = data.movBan[i].valores[0].egresados.tercero.nombre
            }
          }
          if (data.movBan[i].valor && terceroNombre=='') {  // PARCHEEEEEEEEE
            if (data.movBan[i].valor.ingresados!=null) {
              terceroNombre = data.movBan[i].valor.ingresados.tercero.nombre
            }
          }
          if (terceroNombre == '') {
           terceroNombre = data.movBan[i].observaciones
          }
          this.items.push({
            id: data.movBan[i].id,
            fecha: data.movBan[i].fecha,
            nombre: data.movBan[i].codigomovimiento.nombre,
            terceroNombre: terceroNombre,
            numero: data.movBan[i].numero,
            bancodmov_id: data.movBan[i].bancodmov_id,
            abrev: data.movBan[i].codigomovimiento.abrev,
            observaciones: data.movBan[i].observaciones,
            conciliacion_id: data.movBan[i].conciliacion_id,
            valores: data.movBan[i].valores,
            importe: data.movBan[i].importe,
            estado: data.movBan[i].estado,
            filtroEstado: '',
          })
        }

        debugger
        this.aCubrir = data.saldo[0].saldo||0

        for (let i=0; i<=data.movBan.length-1; i++) {
//        if (data.movBan[i].bancodmov_id==7 && data.movBan[i].fecha.substring(0,10)>=moment().format('YYYY-MM-DD')) {
          if (data.movBan[i].fechaconciliacion==null) {
//          this.aCubrir += Math.abs(data.movBan[i].importe)
            this.aCubrir += data.movBan[i].importe
          }
          if (data.movBan[i].bancodmov_id==7 && data.movBan[i].fecha.substring(0,10)==moment().format('YYYY-MM-DD')) {
            this.chqACubrirHoy += Math.abs(data.movBan[i].importe)
          }
        }
        if (this.aCubrir>0) {
          this.aCubrir = 0
        }

        if (this.chqACubrirHoy!=0 && this.chqACubrirHoy>this.saldoEmpresa) {
          this.valADepositarHoy = this.chqACubrirHoy - this.saldoEmpresa 
        }

        this.saldoEmpresa = data.saldo[0].saldo
        this.itemsAll = this.items;
        this.filtrosEstados = []

        for (let i=0; i<=this.items.length-1; i++) {
          let a = this.items[i].abrev
          let p = this.filtrosEstados.findIndex(x => x.tip === a);
          if (p==-1) {
            this.filtrosEstados.push({tip: a, ctt: 1})
          } else {
            this.filtrosEstados[p].ctt ++
          }
          this.items[i].filtroEstado = a
        }
        if (this.filtrosEstados.length>1) {
          this.filtrosEstados.unshift({tip: 'Todos', ctt: this.items.length})
        }
        if (asignoSel) {
          if (this.filtrosEstados.length>0) {
            this.filtroEstadoSel = this.filtrosEstados[0].tip
          }
        } else {
          let pos = this.filtrosEstados.findIndex(x => x.tip == this.filtroEstadoSel)
          this.setFiltroEstado(this.filtrosEstados[pos])
        }
        this.progress = false
      });
    },

    setFiltroEstado(fe) {
      if (fe.tip=='Todos') {
        this.items = this.itemsAll
      } else {
        this.items = this.itemsAll.filter(x=>x.filtroEstado==fe.tip)
      }
      this.filtroEstadoSel = fe.tip
    },

    guardarMovimiento(item) {
      this.msg.msgTitle = 'Movimiento Bancario' 
      this.msg.msgAccion = 'movimiento bancario'
      this.msg.msgBody = 'Confirma el movimiento bancario?'
      this.msg.msgVisible = true
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item
    },

    guardarSaldoBancario(item) {
      this.msg.msgTitle = 'Nuevo Saldo Bancario' 
      this.msg.msgAccion = 'nuevo saldo bancario'
      this.msg.msgBody = '¿Confirma el nuevo Saldo Bancario?'
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

    calculoMov(cual) {
      let pos = this.ivaTasas.findIndex(x => x.id === this.mov.iva_id);
      if (this.mov.bancodmov_id==3) {   // gasto bancario
        this.mov.gravado = Number(this.mov.gravado)
        this.mov.tasaiva = Number(this.ivaTasas[pos].tasa)
        this.mov.iva     = Number(this.mov.iva)
        this.mov.total   = Number(this.mov.total)
        if (cual==1 && this.mov.tasaiva!=0) {
          this.mov.iva = this.roundTo(this.mov.gravado*(this.mov.tasaiva/100),2)
          this.mov.total = this.roundTo(this.mov.gravado+this.mov.iva,2)
        } else if (cual == 2) {
          //this.mov.gravado = this.roundTo(this.mov.total/(1+(this.mov.tasaiva/100)),2)
          this.mov.iva = this.roundTo(this.mov.gravado*(this.mov.tasaiva/100),2)
          this.mov.total = this.roundTo(this.mov.gravado+this.mov.iva,2)
        } else if (cual == 3) {
          this.mov.tasaiva = this.roundTo((this.mov.iva/this.mov.gravado)*100,2)
          this.mov.total = this.roundTo(this.mov.gravado*(1+(this.mov.tasaiva/100)),2)
        } else if (cual == 4) {
          this.mov.gravado = this.roundTo(this.mov.total/(1+(this.mov.tasaiva/100)),2)
          this.mov.iva = this.roundTo(this.mov.total-this.mov.gravado,2)
        }
      }
    },

    getEstado (estado, accion) {
      let c = ''
      let e = ''
      if (accion=='k') {   //para el dark
        if (estado==='P') {
          return this.temas.cen_estado_pendiente_dark
        } else if (estado==='C') {
          return this.temas.cen_estado_finalizado_dark 
        }
      }
      if (estado==='P') {
        e = 'A Conciliar'
        c = this.temas.cen_estado_pendiente_bg 
      } else if (estado==='C') {
        e = 'Conciliado'
        c = this.temas.cen_estado_finalizado_bg 
      }
      if (accion==='c') {
        return c
      } else {
        return e
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
      let per = this.anio+'-'+this.mes
      return HTTP().post('/bancoscuentasaldo', { cuenta: this.cuenta, periodo: per })
        .then(({ data }) => {
          this.saldoCuenta = data.saldo[0].saldo == undefined ? 0 : data.saldo[0].saldo
          this.saldoAnterior = data.salant[0].salant == undefined ? 0 : data.salant[0].salant
          let orientacion = 'p'
          let informeTitulo = 'Movimientos Bancarios'
          let doc = new jsPDF(orientacion, 'pt')  // 'p' normal 'l' horizontal ( landscape )
          this.page = 1
          this.pages = Math.trunc(this.items.length/44)+1
          this.cabecera(informeTitulo, doc, orientacion)
          this.detalles(informeTitulo, doc, orientacion)
          doc.output ('dataurlnewwindow')
      })
    },

    cabecera(informeTitulo, doc, orientacion) {
      //const des = this.editado.fdesde.substr(8,2)+'/'+this.editado.fdesde.substr(5,2)+'/'+this.editado.fdesde.substr(0,4)
      //const has = this.editado.fhasta.substr(8,2)+'/'+this.editado.fhasta.substr(5,2)+'/'+this.editado.fhasta.substr(0,4)
      let topDown = orientacion == 'p' ? 810 : 580
      let topWidth = orientacion == 'p' ? 527 : 777
      let av    = '../images/'+this.logotipo
      var img = new Image()
      img.src = av
      doc.addImage(img, 'jpg', 40, 28, 122, 45)
      doc.setFontSize(8);
      doc.text ( 'Fecha: '+moment().format('L'), 40, 90 )
      doc.setFontSize(15);
      doc.text ( informeTitulo, 180, 45 )
      doc.setFontSize(9);
//    doc.text ( 'Desde:'+des, 180, 67 )
//    doc.text ( 'Hasta:'+has, 260, 67 )
      doc.text ( 'Página '+this.page.toString()+'/'+this.pages.toString(), topWidth, topDown)
      doc.text ( 'Fecha', 40, 115 )
      doc.text ( 'Tipo de Mov.', 95, 115 )
      doc.text ( 'Detalle', 170, 115 )
      doc.text ( 'Conc.', 370, 115 )
      doc.text ( 'Importe', 450, 115 )
      doc.text ( 'Saldo', 545, 115 )
      doc.line( 40, 121, 570, 121)
    },

    detalles(informeTitulo, doc, orientacion) {
      let f = 135
      let topDown = orientacion == 'p' ? 780 : 540
      let topWidth = orientacion == 'p' ? 570 : 800
      let it = []

      if (this.saldoAnterior != 0) {
        it.push({
          id:                null,
          conciliacion_id:   null,
//        cuenta:            null,
          fecha:             null,
          fechaconciliacion: null,
          nombre:            'Saldo Anterior',
          abrev:             'SAN',
          numero:            null,
          observaciones:     'Saldo Anterior',
          tercero:           '',
          estado:            'C',
          importe:           this.saldoAnterior,
          saldo:             this.saldoAnterior,
        })
      }

      let saldoAcumulado = this.saldoAnterior

      for (let i=0; i<=this.items.length-1; i++) {
        saldoAcumulado += this.items[i].importe
        it.push({
          id:                this.items[i].id,
          conciliacion_id:   this.items[i].conciliacion_id,
//        cuenta:            this.items[i].cuenta,
          fecha:             this.items[i].fecha,
          fechaconciliacion: this.items[i].fechaconciliacion,
          nombre:            this.items[i].nombre,
          abrev:             this.items[i].abrev,
          numero:            this.items[i].numero,
          observaciones:     this.items[i].observaciones,
          tercero:           this.items[i].terceroNombre,
          estado:            this.items[i].estado,
          importe:           this.items[i].importe,
          saldo:             saldoAcumulado
        })
      }

      for (let i=0; i<=it.length-1; i++) {
        if (it[i].fecha!=null) {
          doc.text ( moment(it[i].fecha.substring(0,10)).format('DD/MM/YYYY'), 40, f, 'left' )
        }
        let tmov = ''
        let desc = ''
        if (it[i].abrev=='SAN') {
          tmov = ''
          desc = 'Saldo Anterior'
        } else if (it[i].abrev=='DPE') {
          tmov = 'Dep/Efectivo'
          desc = 'Depósito de Efectivo'
        } else if (it[i].abrev=='EXF') {
          tmov = 'Extr/Efectivo'
          desc = 'Extracción de Efectivo'
        } else if (it[i].abrev=='GSB') {
          tmov = 'Gasto Banco'
          desc = it[i].observaciones
        } else if (it[i].abrev=='TRI') {
          tmov = 'Trasnf.Recib.'
          desc = 'Transferencia Recibida de '
        } else if (it[i].abrev=='TRE') {
          tmov = 'Trasnf.Emit.'
          desc = 'Transferencia Emitida a '
        } else if (it[i].abrev=='DPQ') {
          tmov = 'Dep/Cheques'
          desc = 'Depósito de Cheques/s'
        } else if (it[i].abrev=='CHP') {
          tmov = 'Che Emitido'
          desc = 'Cheque propio '+it[i].numero+'/'+it[i].tercero.substring(0,15)
        } else if (it[i].abrev=='TJV') {
          tmov = 'Ing.Tarjeta'
          desc = 'Ingreso por Tarjeta'
        } else if (it[i].abrev=='TJP') {
          tmov = 'Pag c/Tarjeta'
          desc = 'Pago con tarjeta'
        } else if (it[i].abrev=='AJS') {
          tmov = 'Ajuste Bancario'
          desc = 'Ajuste de Saldos'
        }
        doc.text ( tmov, 95, f )
        doc.text ( desc, 170, f, 'left' )

        if (it[i].abrev!='SAN') {
          if (it[i].conciliacion_id!=null) {
            doc.text ( 'sí', 370, f )
          } else {
            doc.text ( 'no', 370, f )
          }
        }
        
        doc.text ( this.formatoImporte(it[i].importe.toString()), 480, f, 'right' )
        doc.text ( this.formatoImporte(it[i].saldo.toString()), 570, f, 'right' )

        f+=15
        if (f>topDown && i<it.length-1) {
          doc.addPage()
          this.page ++
          this.cabecera(informeTitulo, doc, orientacion)
          f=135
        }
      }
    },

    formatoFechaCorta(value) {
      return moment(String(value)).format('DD-MM-YY')
    },
  },
};
</script>

<style scoped>
  .contenedor-galeria2{
    display: flex;
    width: 100%;
    justify-content: space-around;
    flex-wrap: wrap;
    max-width: 1000px;
    margin: auto;
  }
  .galeria__img {
    width: 300px;
    height: 200px;
    margin-bottom: 30px;
    object-fit: cover;
    filter: brightness(100%);
    animation: escalar 1.5s infinite alternate;
  }
  @keyframes escalar {
    to {
      transform: scale(1)
    }
    from {
      transform: scale(1.01)
    }
    
  }
  .galeria__img:hover {
    filter: brightness(95%);
  }
  .titulo-proveedor {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 150%;
  }
  .titulo-notificacion {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
  }
  .contenedor-galeria-fuente-importe {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
  }
  .contenedor-galeria-fuente-descuento {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    color: red;
  }
  .contenedor-galeria-fuente-final {
    /*font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;*/
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 150%;
    color: black;
    font-weight: 200%;
  }
  .contenedor-galeria-fuente-proveedor {
    /*font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;*/
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 80%;
    color: black;
    font-weight: 80%;
  }
  .minifont {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 84%;
  }
  .minifont2 {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 74%;
  }
  .cpr {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-display: green;
    font-size: 85%;
  }
  .bigfont {
    font-family: Graphik,sans-serif;
    font-size: 1.375rem;
    line-height: 2.1rem;
    color: gray;
  }
  .v-btn::before {
    background-color: transparent;
  }
  .v-btn i:hover{
    transform: scale(1.25);
  }

</style>
