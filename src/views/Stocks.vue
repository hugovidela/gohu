<template>
  <v-layout align-start>
    <v-flex>
      <v-row>
        <v-col v-for="(cbt, idx) in comprobantes" v-bind:key="idx" cols="2">

          <v-card tile outlined @click="selectTipoDeComprobante(cbt.nombre)" max-width="170">
            <v-app-bar outlined
              :color="cbt.nombre==filtroComprobanteSel ? temas.cen_card_activo_bg : cbt.bg"
              :dark="cbt.nombre==filtroComprobanteSel ? temas.cen_card_activo_dark : cbt.dark">
              <v-toolbar-title class="panel-font">
                {{cbt.nombre}}
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-app-bar>

            <v-container>
              <v-row dense>
                <v-col cols="12" class="caption">
                  Cantidad {{ cbt.ctt }}
                </v-col>
              </v-row>

              <v-row dense>
                <v-col cols="3" class="pt-6 pb-0">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon small outlined
                        @click="nuevo(cbt.nombre)" v-on="on">
                        <v-icon>
                          mdi-18px mdi-plus
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>{{cbt.tooltip}}</span>
                  </v-tooltip>
                </v-col>

                <v-col cols="2" class="pt-6 pb-0" v-show="cbt.nombre=='Ajustes'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn class="ml-2"
                        icon small outlined
                        @click="plaXls" v-on="on">
                        <v-icon>
                          mdi-file-export
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Generar Excel para Conteo</span>
                  </v-tooltip>
                </v-col>

                <v-col cols="2" class="pt-6 pb-0 pl-6" v-show="cbt.nombre=='Ajustes'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn class="ml-2"
                        icon small outlined
                        @click="actPlaXls" v-on="on">
                        <v-icon>
                          mdi-file-import
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Actualizar conteo desde Excel</span>
                  </v-tooltip>
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
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
        dense
        class="elevation-3 panel-font"
        :footer-props="footerProps">
        <template v-slot:top>
          <v-toolbar flat :color="temas.forms_titulo_bg">
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
                <v-icon left>mdi-barcode</v-icon>
                <b class="panel-font">Stocks</b>
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

            <!-- INGRESO DE ITEMS -->
            <v-dialog v-model="dialogArt" max-width="1350px" persistent>
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-toolbar flat
                  :dark="temas.forms_titulo_dark==true"
                  :color="temas.forms_titulo_bg">
                  <v-btn
                    icon @click="cancelarArt"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="headdline">
                    {{empresa}} - {{filtroComprobante==131 ? 'NUEVO AJUSTE': 'NUEVA TRANSFERENCIA'}}
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn v-show="editarItems>0 && articulos.length>0"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text"
                    @click="guardarItems('normal')">GUARDAR
                  </v-btn>
                </v-toolbar>

                <!-- ITEMS DEL COMPROBANTE -->
                <v-card flat>
                  <v-card-text>
                    <v-container>

                      <v-row>
                        <v-col cols="4" sm="4" md="4" class="ma-0 pa-0 pl-3">
                          <v-select
                            v-model="deposito"
                            :items="depItems"
                            :disabled="depItems.length==1"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            item-value="id"
                            item-text="nombre"
                            label="Deposito..."
                            dense outlined return-object multiselects
                            class="pt-2">
                          </v-select>
                        </v-col>
                      </v-row>

                      <v-row v-show="editarItems>0" class="ma-0 pa-0 pl-0">
                        <v-col cols="12" sm="12" md="12" class="ma-0 pa-0 pl-0">
                          <v-row>
                            <v-col cols="2"><span class="x1">Código</span></v-col>
                            <v-col cols="5"><span class="x1">Nombre</span></v-col>
<!--                        <v-col cols="2"><span class="x1">Un.Med.</span></v-col> -->
                            <v-col cols="1"><span class="x1">Motivo</span></v-col>
                            <v-col cols="1"><span class="x1">Stock</span></v-col>
                            <v-col cols="1"><span class="x1">Ajuste</span></v-col>
                            <v-col cols="1"><span class="x1">Nuevo Stock</span></v-col>
                          </v-row>
                        </v-col>
                      </v-row>

                      <v-row v-show="editarItems>0">
                        <v-col cols="12" sm="12" md="12" class="mt-0 pt-0">
                          <v-row>
                            <v-col cols="2" class="mt-0 pt-0">
                              <v-text-field
                                class="x1 mt-0 pt-0" dense
                                :disabled="editedIndexArt>-1"
                                ref="buscar"
                                :color="temas.forms_titulo_bg"
                                autofocus
                                v-model="busArt"
                                @keyup.esc="cancelaLinea()"
                                @focus="$event.target.select()"
                                @blur="buscarArt(false)">
                              </v-text-field>
                            </v-col>
                            <v-col cols="5" class="x1 mt-0 pt-0">
                              <v-text-field
                                class="x1 mt-0 pt-0" dense disabled
                                v-model="editadoArt.nombre">
                              </v-text-field>
                            </v-col>
                            <v-col cols="1" class="x1 mt-0 pt-0">
                              <v-text-field
                                ref="texto"
                                class="x1 mt-0 pt-0" dense
                                v-model="editadoArt.texto">
                              </v-text-field>
                            </v-col>
                            <v-col cols="1" class="x1 mt-0 pt-0">
                              <v-text-field
                                class="x1 mt-0 pt-0" dense disabled
                                v-model="editadoArt.stock">
                              </v-text-field>
                            </v-col>
                            <v-col cols="1" class="x1 mt-0 pt-0">
                              <v-text-field
                                class="x1 mt-0 pt-0" dense
                                v-model="editadoArt.cantidad"
                                ref="cantidad"
                                @focus="$event.target.select()"
                                @change="guardarItem()"
                                @blur="guardarItem()"
                                @keyup.esc="cancelaLinea()">
                              </v-text-field>
                            </v-col>
                            <v-col cols="1" class="x1 mt-0 pt-0">
                              <v-text-field
                                class="x1 mt-0 pt-0" dense disabled
                                v-model="editadoArt.nuestock">
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>

                      <v-row class="pb-0">
                        <v-col v-show="seleccionarArticulo == true"
                          cols="12" sm="12" md="12">
                          <v-data-table
                            class="elevation-3 pt-0 pb-0"
                            :headers="headersSelArt"
                            :color="temas.forms_titulo_bg"
                            :items="selArt"
                            dense
                            single-select
                            @click:row="selArtClick"
                            :footer-props="footerProps">
                            <template v-slot:item.stock="{ item }">
                              <span disable
                                dark>{{ formatoImporte(item.stock) }}
                              </span>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <div class="pl-0 pr-0">
                            <v-data-table
                              :headers="headersArt"
                              :items="articulos"
                              dense
                              class="elevation-1 pr-0 ml-0">

                              <template v-slot:item.activo="{ item }">
                                <v-chip
                                  :color="getColor(item.activo)"
                                  dark>{{item.activo?'Sí':'No'}}
                                </v-chip>
                              </template>

                              <template #item.nombre="{ value }">
                                <div class="text-truncate" style="max-width: 245px">
                                  {{ value }}
                                </div>
                              </template>

                              <template v-slot:item.cantidad="{ item }">
                                <span disable dark>{{ item.cantidad }}</span>
                              </template>
                              <template v-slot:item.stock="{ item }">
                                <span disable dark>{{ item.stock }}</span>
                              </template>
                              <template v-slot:item.nuestock="{ item }">
                                <span disable dark>{{ item.nuestock }}</span>
                              </template>

                              <template v-slot:item.accion="{item}">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      fab x-small
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      class="mr-2"
                                      @click="editarArt(item)" v-on="on">
                                      <v-icon dark>mdi-pencil</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Editar</span>
                                </v-tooltip>
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      fab x-small
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      class="mr-2"
                                      @click="borrarItem(itemActualItem)" v-on="on">
                                      <v-icon dark>mdi-delete</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Borrar Linea</span>
                                </v-tooltip>
                              </template>

                            </v-data-table>
                          </div>
                        </v-col>
                      </v-row>

                    </v-container>
                  </v-card-text>
                </v-card>
                <!-- FIN ITEMS DE COMPROBANTE -->

              </v-card>

            </v-dialog>
            <!-- FIN INGRESO DE ITEMS -->

            <!--// GENERAR PLANILLA EXCEL PARA CONTEO // -->
            <v-dialog v-model="dialogPlaXls" max-width="1300px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat dark :color="temas.forms_titulo_bg">
                <v-btn icon @click="cerrarPlaXls"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - Generar planilla excel para Conteo
                </span>
                <v-spacer></v-spacer>
                <v-btn @click="genPlaXls" v-show="selected.length>0"
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  Generar Planilla
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="3" sm="3" class="pt-2 pb-0">
                          <v-select
                            v-model="rubro"
                            :items="rubItems"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            item-value="id"
                            item-text="nombre"
                            label="Rubro..."
                            dense outlined return-object multiselects
                            class="pt-2"
                            @change="modrubro">
                          </v-select>
                        </v-col>
                        <v-col cols="3" sm="3" class="pt-2 pb-0">
                          <v-select
                            v-model="prov"
                            :items="provItems"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            :disabled="tipo=='MD'"
                            item-value="id"
                            item-text="nombre"
                            label="Proveedor"
                            dense outlined
                            class="pt-2"
                            @change="modproveedor">
                          </v-select>
                        </v-col>
                        <v-col cols="3" sm="3" class="pt-2 pb-0">
                          <v-select
                            v-model="marca"
                            :items="marItems"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            item-value="id"
                            item-text="nombre"
                            label="Marca..."
                            dense outlined return-object
                            class="pt-2"
                            @change="modmarca">
                          </v-select>
                        </v-col>
                        <v-col cols="3" sm="3" class="pt-2 pb-0">
                          <v-select
                            v-model="grupo"
                            :items="gruItems"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            item-value="id"
                            item-text="nombre"
                            label="Grupo..."
                            dense outlined return-object
                            class="pt-2"
                            @change="modgrupo">
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="3" sm="3" class="pt-0 pb-0 pl-3">
                          <v-select
                            v-model="deposito"
                            :items="depItems"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            multiple
                            item-value="id"
                            item-text="nombre"
                            label="Depósito/s..."
                            dense outlined return-object multiselects
                            class="pt-0">
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-0 pb-0 pl-3">
                          <v-text-field
                            disabled outlined dense
                            class="caption"
                            v-model="selected.length"
                            label="Selecc">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" class="pt-0">

                          <v-data-table
                            v-model="selected"
                            :headers="headersGenXls"
                            :items="itemsXls"
                            @toggle-select-all="selectAll"
                            :single-select="false"
                            :search="search"
                            item-key="codigo"
                            show-select
                            dense
                            class="pl-1 pr-3 elevation-1 pt-0"
                            :footer-props="footerProps">
                            <template #item.nombre="{ value }">
                              <div class="text-truncate" style="max-width: 320px">
                                {{ value }}
                              </div>
                            </template>
                            <template v-slot:item.nommar="{ item }">
                              <span disable dark>
                                {{item.nommar.substring(0,7)}}
                              </span>
                            </template>
                            <template v-slot:item.nomgru="{ item }">
                              <span disable dark>
                                {{item.nomgru.substring(0,7)}}
                              </span>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN GENERAR PLANILLA EXCEL PARA CONTEO -->

            <!--// BAJAR PLANILLA DE EXCEL DE CONTEO // -->
            <v-dialog v-model="dialogActPlaXls" max-width="850px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat dark :color="temas.forms_titulo_bg">
                <v-btn icon @click="cerrarActPlaXls"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - Ajuste de Stock desde planilla Excel
                </span>
                <v-spacer></v-spacer>
                <v-btn @click="genAjusteDesdeXls" v-show="xlsCargado && hayAjustes!=0"
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  Generar Ajuste
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form>
                  <v-card-text>
                    <v-container>

                      <v-row>
                        <v-col cols="6" sx="6" mx="6" class="pt-0">
                          <v-file-input
                            v-model="excel"
                            label="Archivo Excel"
                            prepend-icon="mdi-file-excel-box"
                            :color="temas.forms_titulo_bg"
                            @change="cargarXls">
                            <template v-slot:selection="{ text }">
                              {{ excel.name ? excel.name : excel }}
                            </template>
                          </v-file-input>
                        </v-col>
                        <v-col cols="6" sm="6" md="6" class="ma-0 pa-0 pl-3">
                          <v-select
                            v-model="deposito"
                            :items="depItems"
                            :disabled="depItems.length==1"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            item-value="id"
                            item-text="nombre"
                            label="Deposito..."
                            dense outlined return-object multiselects
                            class="pt-2">
                          </v-select>
                        </v-col>

                      </v-row>

                      <v-row>
                        <v-col cols="12" sx="12" mx="12" class="pt-0">
                          <v-data-table
                            :headers="headersArtExcel"
                            :items="conteoExcel"
                            dense
                            class="elevation-1 pl-0"
                            @click:row="editarArt">
                            <template #item.nombre="{ value }">
                              <div class="text-truncate" style="max-width: 245px">
                                {{ value }}
                              </div>
                            </template>
                            <template v-slot:item.ajuste="{ item }">
                              <span disable dark>{{ formatoImporte(item.ajuste) }}</span>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN BAJAR PLANILLA DE EXCEL DE CONTEO -->

          </v-toolbar>
          <v-col cols="12" sm="12">  <!-- Barra de búsqueda  -->
            <v-text-field
              v-model="search"
              :color="temas.forms_titulo_bg"
              append-icon="search"
              label="Buscar"
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
              <template v-slot:item.articulo.nombre="{ item }">
                <span disable dark> {{
                  item.articulo.codigo=='1@1' ? item.texto : item.articulo.nombre
                }}</span>
              </template>
              <template v-slot:item.cantidad="{ item }">
                <span disable dark>{{ formatoImporte(item.cantidad) }}</span>
              </template>
            </v-data-table>
          </td>
        </template>

        <template v-slot:item.observaciones="{ item }">
          <span disable dark>
            {{item.observaciones}}
          </span>
        </template>

        <template v-slot:item.fecha="{ item }">
          <span disable dark>{{ formatoFechaCorta(item.fecha) }}</span>
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

        <!-- BOTONES DE LA GRID PRINCIPAL-->
        <template v-slot:item.accion="{ item }">
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :color="temas.cen_btns_bg"
                :dark="temas.cen_btns_dark==true"
                icon v-bind="attrs" v-on="on" @click="setAcciones(item)">
                <v-icon
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true">
                  mdi-dots-vertical
                </v-icon>
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
      <confirmacion v-model='msg.msgAccion'
        :title=this.msg.msgTitle
        :body=this.msg.msgBody
        :visible=this.msg.msgVisible
        :buttons=this.msg.msgButtons
        @click="msgRespuesta">
      </confirmacion>
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
import confirmacion from "./Forms/confirmacion.vue";
import impresiones from "./Forms/impresiones.vue";
import XLSX from 'xlsx';

export default {
  components: {
    SBar,
    confirmacion,
    impresiones,
  },
  data: () => ({
    progress: false,
    singleExpand: false,
    modelo: 'stocks',
    hayAjustes: 0,
    formTitle: '',
    itemActual: null,
    itemActualItem: null,
    excel: [],
    xlsCargado: false,
    conteoExcel: [{id:null, codigo:null, nombre:null, ajuste:null, unidad_id:null }],
    codigos: [],
    comprobantes: [
      {nombre:'Ajustes',tooltip: 'Nuevo Ajuste',ctt: 0,cprId: 132,cpr: 'AJU',bg: '',dark: '',activo: true,pos: 30},
      {nombre:'Transferencias',tooltip:'Nueva Transferencia',ctt:0,cprId:133,cpr:'TRA',bg:'',dark:'',activo:true,pos:30}
    ],

    // filtro
    filtro: '',
    filtroComprobante: 131,
    filtroComprobanteSel: 'Ajustes',

    cpr: '',
    tl: "text-lowercase",
    cprItems: [],
    depItems: [],
    depositos: [],
    uniItems: [],
    expanded: [],
    rubItems: [],
    marItems: [],
    gruItems: [],
    provItems: [],
    items: [],
    itemsXlsAll: [],
    itemsXls: [],
    articulos: [],
    selected: [],
    acciones: [],
    prov: '',
    rubro: '',
    marca: '',
    grupo: '',
    deposito: '',
    prov: 0,
    rubro_id: 0,
    marca_id: 0,
    grupo_id: 0,
    deposito_id: 0,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    footerProps: {'items-per-page-options': [5, 5, 15, 100]},
    busArt: '',
    search: '',             // para el cuadro de búsqueda de datatables
    dialogArt: false,       // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogEditArt: false,   // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogPlaXls: false,
    dialogActPlaXls: false,

    // definimos los headers de la datatables
    headers: [
      //{ text: 'ID', value:'id', align: 'left', width: 70},
      { text: 'COMPROBANTE', value:'cpr', align: 'left', width: 180},
      { text: 'FECHA', value:'fecha', align: 'left', width: 89},
      { text: 'DEPOSITO', value:'deposito.nombre', align: 'left', width: 150},
      { text: 'ESTADO', value:'estado', align: 'left', width: 130},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersGenXls: [
      { text: 'CODIGO',    value: 'codigo', width: 130, align: 'left'},
      { text: 'NOMBRE',    value: 'nombre', width: 360, align: 'left'},
      { text: 'RUBRO',     value: 'nomrub', width: 90,  align: 'left'},
      { text: 'PROVEEDOR', value: 'nompro', width: 90,  align: 'left'},
      { text: 'MARCA',     value: 'nommar', width: 90,  align: 'left'},
      { text: 'GRUPO',     value: 'nomgru', width: 90,  align: 'left'},
      { text: 'STOCK',     value: 'stock',  width: 90,  align: 'end'},
    ],
    headersItems: [
      { text: 'Código', value:'articulo.codigo', class: 'grey lighten-3'},
      { text: 'Nombre', value:'articulo.nombre', class: "grey lighten-3"},
      { text: 'Motivo', value:'texto', class: "grey lighten-3"},
      { text: 'Ajuste', value:'cantidad', align: 'end', class: "grey lighten-3"},
    ],
    headersArt: [
      { text: 'Código',     value:'codigo',       align: 'left', width: 130},
      { text: 'Nombre',     value:'nombre',       align: 'left', width: 363},
//    { text: 'U.Medida',   value:'unidadNombre', align: 'left', width: 120},
      { text: 'Motivo',     value:'texto',        align: 'end',  width: 120},
      { text: 'Stock',      value:'stock',        align: 'end',  width: 120},
      { text: 'Ajuste',     value:'cantidad',     align: 'end',  width: 120},
      { text: 'Nuevo Stock',value:'nuestock',     align: 'end',  width: 120},
      { text: 'Acciones',   value:'accion',       sortable: false },
    ],
    headersArtExcel: [
      { text: 'Id',        value:'id',     align: 'left', width: 50},
      { text: 'Código',    value:'codigo', align: 'left', width: 110},
      { text: 'Nombre',    value:'nombre', align: 'left', width: 300},
      { text: 'A Ajustar', value:'ajuste', align: 'end',  width: 100},
    ],
    headersSelArt: [
      { text: 'CODIGO', value:'codigo'},
      { text: 'NOMBRE', value:'nombre'},
      { text: 'STOCK', value:'stock'},
    ],
    editedIndex: -1,
    editedIndexArt: -1,
    afipSuc: '',
    afipNro: '',
    editado: {
      id: '',
      fecha: moment().format('YYYY-MM-DD'),
      perfiscal: '',
      cpr: '',
      letra: '',
      tipo: '',
      sucursal_id: '',
      deposito_id: '',
      tercero_id: '',
      comprobante_id: '',
      documento_id: '',
      direccion_id: '',
      regstk: 0,
      observaciones: '',
    },
    defaultItem: {
      id: '',
      fecha: moment().format('YYYY-MM-DD'),
      perfiscal: '',
      cpr: '',
      letra: '',
      tipo: '',
      sucursal_id: '',
      deposito_id: '',
      tercero_id: '',
      comprobante_id: '',
      documento_id: '',
      direccion_id: '',
      regstk: 0,
      observaciones: '',
    },
    editadoArt: {
      cpritem_id: '',
      id: '',
      codigo: '',
      nombre: '',
      unidad_id: '',
      unidadNombre: '',
      stock: 1,
      cantidad: 1,
      nuestock: 0,
      estado: '',
      texto: 'Roturas',
    },
    defaultItemArt: {
      cpritem_id: '',
      id: '',
      codigo: '',
      nombre: '',
      unidad_id: '',
      unidadNombre: '',
      stock: 0,
      cantidad: 1,
      nuestock: 0,
      estado: '',
      texto: 'Roturas',
    },
    selArt: [],
    seleccionarArticulo: false,
    descriptionLimit: 80,
    entriesArticulos: [],
    isLoadingArticulos: false,
    search: null,
    editarItems: 0,
  }),





  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    //...mapMutations(['alert','closeAlert']),
    ...mapState([
      'sucursal',
      'sucursales',
      'sucursalDemo',
      'sucursalFiscal',
      'proveedor',
      'proveedores',
      'tipo',
      'tema',
      'temas',
      'centrales',
      'notificaciones',
      'caja',
      'vinculosPadres', 
      'vinculosHijos',
      'empresa',
      'datosEmpresa',
      'tercero',
      'responsable',
      'cuit',
      'operario',
      'operarioVendedor',
      'operarioTerceroId',
      'operarioId',
      'level',
      'externo',
      'publicaciones'
    ]),

  },



  watch: {
    '$store.state.sucursal' () {
      this.comprobantes[0].bg    = this.$store.state.temas.cen_facturas_bg
      this.comprobantes[0].dark  = this.$store.state.temas.cen_facturas_dark
      this.comprobantes[1].bg    = this.$store.state.temas.cen_creditos_bg
      this.comprobantes[1].dark  = this.$store.state.temas.cen_creditos_dark
//      this.comprobantes[2].bg    = this.$store.state.temas.cen_debitos_bg
//      this.comprobantes[2].dark  = this.$store.state.temas.cen_debitos_dark
      this.comprobantes[0].activo = !this.sucursalDemo
      this.comprobantes[1].activo = !this.sucursalDemo
//      this.comprobantes[2].activo = !this.sucursalDemo
      this.selectTipoDeComprobante('Ajustes')
    },





    search(val) {
      this.$store.commit("setCentrales", {
        compras_buscar: val,
      }, { root: true });
    }
  },





  mounted () {
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      this.$store.commit('closeAlert')
      moment.locale('es');
      this.rubItems = [];
      this.marItems = [{id: 0, nombre: 'Todas'}]
      this.gruItems = [{id: 0, nombre: 'Todos'}]
      if (this.centrales.compras_panel=='') {
        this.selectTipoDeComprobante(this.filtroComprobanteSel)
      } else {
        this.selectTipoDeComprobante(this.centrales.compras_panel)
      }
      if (this.centrales.compras_buscar!='') {
        this.search = this.centrales.compras_buscar
      }
      return HTTP().get('/afipcomprobantes')
        .then(({ data }) => {
          for (let i=0; i<=data.length-1; i++) {
            if (data[i].id >= 131 && data[i].id <= 133) {
              this.cprItems.push(data[i])
            }
          }
          return HTTP().get('/usersrubros')
            .then(({ data }) => {
              for (let i=0; i<=data.length-1; i++) {
                this.rubItems.push(data[i].rubro)
              }
              this.rubro = this.rubItems[0]
              this.rubro_id = this.rubro.id                    // ver, puede tener mas rubros
              return HTTP().get('/marcasbus')
                .then(({ data }) => {
                  for (let i=0; i<=data.length-1; i++) {
                    this.marItems.push(data[i])
                  }
                  this.marca = this.marItems[0]
                  this.marca_id = this.marca.id
                  return HTTP().get('/grupos')
                    .then(({ data }) => {
                      for (let i=0; i<=data.length-1; i++) {
                        this.gruItems.push(data[i])
                      }
                      this.grupo = this.gruItems[0]
                      this.grupo_id = this.grupo.id
                      this.provItems = this.$store.state.proveedores

                    });
                });
            });
          return this.listarHTTP()
        })
    }
  },



  created () {
    this.cen_activo_bg         = this.$store.state.temas.cen_card_activo_bg
    this.cen_activo_dark       = this.$store.state.temas.cen_card_activo_dark
    this.comprobantes[0].bg    = this.$store.state.temas.cen_facturas_bg
    this.comprobantes[0].dark  = this.$store.state.temas.cen_facturas_dark
    this.comprobantes[1].bg    = this.$store.state.temas.cen_creditos_bg
    this.comprobantes[1].dark  = this.$store.state.temas.cen_creditos_dark
    return HTTP().get('/user/'+this.userId).then(({ data }) => {

      this.depItems = []
      let psuc = data[0].sucursales.findIndex( x => x.id == this.sucursal)
      for (let i=0; i<= data[0].sucursales[psuc].depositos.length-1; i++) {
        this.depItems.push(data[0].sucursales[psuc].depositos[i])
      }
      this.editado.deposito_id = this.depItems[0].id

      for (let i=0; i<= data[0].sucursales.length-1; i++) {
        for (let j=0; j<= data[0].sucursales[i].depositos.length-1; j++) {
          this.depositos.push({
            sucid:  data[0].sucursales[i].id,
            sucnom: data[0].sucursales[i].abreviado,
            demo:   data[0].sucursales[i].sucursaldemo,
            depid:  data[0].sucursales[i].depositos[j].id,
            depnom: data[0].sucursales[i].depositos[j].nombre
          })
        }
      }

      //claro 08001230611- nro.serv.9012713

 
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





    selectAll(event) {
      if (event.value) {
        this.selected = this.itemsXls
      } else {
        this.selected = []
      }
    },





    selectTipoDeComprobante(cual) {
      this.filtroComprobanteSel = cual
      this.$store.commit("setCentrales", { compras_panel: cual }, { root: true });
      if (cual=='Ajustes') {
        this.filtroComprobante = 131
      } else if (cual=='Transferencias') {
        this.filtroComprobante = 132
      }
      this.listarHTTP()
    },





    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      this.acciones.push({nombre: 'Detalles',  icon: 'mdi-glasses'})
      this.acciones.push({nombre: 'Imprimir',  icon: 'mdi-printer'})
      if (item.estado!='F') {
        this.acciones.push({nombre: 'Artículos', icon: 'mdi-barcode'})
        this.acciones.push({nombre: 'Finalizar', icon: 'mdi-check-circle'})
      }
      this.acciones.push({nombre: 'Borrar',    icon: 'mdi-delete'})
      this.acciones.push({nombre: 'Anular',    icon: 'mdi-backup-restore'})
    },





    selAccion(item) {
      if (item.nombre=='Detalles') {
        this.printDetalles(this.itemActual)
      } else if (item.nombre=='Imprimir') {
        this.print(this.itemActual)
      } else if (item.nombre=='Artículos') {
        this.cargarArt(this.itemActual)
      } else if (item.nombre=='Finalizar') {
        this.preguntoFinalizar(this.itemActual)
      } else if (item.nombre=='Borrar') {
        this.preguntoAnularBorrar(this.itemActual, 'B')
      } else if (item.nombre=='Anular') {1
        this.preguntoAnularBorrar(this.itemActual, 'A') 
      }
    },





    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='Finalizar Ajuste') {
          this.finalizarHTTP(this.itemActual) 
        } else if (this.msg.msgAccion=='Comprobante Finalizado') {
          this.listarHTTP()
        } else if (this.msg.msgAccion=='Borrar ajuste' || this.msg.msgAccion=='Borrar transferencia') {
          this.anularBorrarHTTP(this.itemActual, 'B')
        } else if (this.msg.msgAccion=='Anular ajuste' || this.msg.msgAccion=='Anular transferencia') {
          this.anularBorrarHTTP(this.itemActual, 'A')
        }
      }
      this.msg.msgVisible = false;
    },





    nuevo(que) {

      debugger

      this.dialogArt = true;
      this.dialogEditArt = true;
      this.editedIndex = -1;
      this.articulos = [];

      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editado = Object.assign({}, this.defaultItem);
      let pos = this.comprobantes.map(function(e) { return e.nombre; }).indexOf(que);
      this.formTitle = this.comprobantes[pos].tooltip
      this.afipSuc = this.sucursalFiscal
      this.afipNro = ''
      this.editado.id = 0
      this.editado.fecha = moment().format('YYYY-MM-DD')
      this.editado.perfiscal = moment().format('YYYYMM')
      this.editado.cpr = this.comprobantes[pos].cpr+'-X '+this.sucursalFiscal+'-00000000'
      this.editado.tipo = 'SK'
      this.editado.sucursal_id = ''
      this.editado.tercero_id = this.datosEmpresa.id
      this.editado.comprobante_id = this.comprobantes[pos].cprId
      this.editado.documento_id = this.datosEmpresa.documento_id
      this.editado.deposito_id = this.depItems[0].id
      this.deposito = this.depItems[0].id
      this.editado.direccion_id = this.datosEmpresa.direccion_id
      this.editado.regstk = 1
      this.editado.observaciones = this.comprobantes[pos].nombre
      this.editarItems = pos+1 // si editarItems=0 no edita, 1=edita inventarios, 2=ajustes, 3=transf.
    },





    listarHTTP:function(suc) {
      return HTTP().post('/stockindex', {
        suc: this.sucursal, 
        cpr: this.filtroComprobante })
        .then(({ data }) => {

          debugger

          this.items = data.movstocks.length>0 ? data.movstocks : [];
          for (let i=0; i<=this.comprobantes.length-1; i++) {
            this.comprobantes[i].ctt = 0
          }
          for (let i=0; i<=data.sqlret.length-1; i++) {
            if (data.movstocks[i].id==131) {
              this.comprobantes[0].ctt += data.movstocks[i].ctt
            } else if (data.movstocks[i].id==132) {
              this.comprobantes[1].ctt += data.movstocks[i].ctt
            }
          }
        })
    },





    preguntoFinalizar() {
      this.msg.msgTitle   = 'Finalizar Ajuste'
      this.msg.msgBody    = '¿Finaliza el Ajuste?<br>Los ajustes ingresados serán reflejados en los stocks.'
      this.msg.msgVisible = true
      this.msg.msgAccion  = 'Finalizar Ajuste'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },





    preguntoAnularBorrar(item, accion) {
      let acc = accion == 'B' ? 'Borrar' : 'Anular'
      this.msg.msgTitle = item.tipo == 'AJ' ? acc + ' Ajuste' : acc+' Transferencia'
      this.msg.msgBody = item.tipo == 'AJ' ? '¿Confirma '+acc+' el Ajuste?' : '¿Confirma '+acc+' la Transferencia?'
      this.msg.msgVisible = true
      this.msg.msgAccion = item.tipo == 'AJ' ? acc+' ajuste' : acc+' transferencia'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item
    },





    anularBorrarHTTP:function(itemActual, acc) {
      return HTTP().post('/stockanularborrar', { itemActual: itemActual, accion: acc })
        .then(({data}) => {
          debugger
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error!', this.temas.forms_titulo_bg, 1500) 
          } else {
            let msg = '¡El movimieto ha sido '
            msg += acc=='A'?'anulado':'borrado'
            msg += ' con éxito!'
            this.mensaje(msg, this.temas.forms_titulo_bg, 1500) 
          }
          this.listarHTTP()
        });
    },





    finalizarHTTP(item) {
      return HTTP().post('/stockfinalizar',{itemActual: item})
        .then(({ data }) => {
          debugger
          if (data=='ok') {
            this.msg.msgTitle   = 'Ajuste Finalizado'
            this.msg.msgBody    = 'AJSUTE DE STOCK FINALIZADO'
            this.msg.msgVisible = true
            this.msg.msgAccion  = 'ajuste finalizado'
            this.msg.msgButtons = ['Aceptar']
            this.itemActual.estado = 'F'
          } else {
            this.msg.msgTitle   = 'Error'
            this.msg.msgBody    = 'SE HA PRODUCIDO UN ERROR EN FINALIZAR EL AJUSTE'
            this.msg.msgVisible = true
            this.msg.msgAccion  = 'error en finalizar el ajuste'
            this.msg.msgButtons = ['Aceptar']
          }
        })
    },





    //////////////////////
    // METODOS DE ITEMS //
    //////////////////////
    editarArt(item) {
      debugger
      this.seleccionarArticulo = false;
      this.editedIndexArt = this.articulos.indexOf(item)
      let pos = this.articulos.indexOf(item)
      this.dialogEditArt = true
      this.busArt = this.articulos[pos].codigo
      this.editadoArt = Object.assign({}, this.articulos[this.editedIndexArt] );
      this.$nextTick(() => {
        const f = this.$refs.texto;
        f.focus();
      });

    },





    guardarItems(cual) { // CONFIRMA EL GUARDADO EN LA BASE DE DATOS
      debugger
      this.dialogArt = false;
      let id = this.editedIndex==-1 ? 0 : this.editado.id

      return HTTP().patch('/stocknewupdate/', {
        id: id,
        cpr: this.editado.cpr,
        tipo: 'AJ',
        sucursal_id: this.sucursal,
        tercero_id: this.datosEmpresa.id,
        comprobante_id: this.filtroComprobante,
        direccion_id: this.datosEmpresa.direccion_id,
        documento_id: this.datosEmpresa.documento_id,
        deposito_id: this.depItems[0].id,
        cual: cual,                           // si cual es 'conteo' finalizo el ajsute
        articulos: this.articulos
        })
        .then(({ data }) => {
          debugger
          if (!data) {
            this.mensaje('¡Se ha producido un error en la grabación de los items!', this.temas.forms_titulo_bg, 1500)
          } else {
            this.mensaje('¡Items acutalizados correctamente!', this.temas.forms_titulo_bg, 1500)
          }
          this.listarHTTP();
      });
    },





    cancelarArt() {
      this.dialogArt = false;
      this.articulos = []
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editedIndexArt = -1;
    },





    cancelarEditArt() {
      this.dialogEditArt = false;
      this.editedIndexArt = -1;
    },





    cargarArt(item) {
      debugger
      this.editedIndex = this.items.indexOf(item)
      this.editado = this.items[this.items.indexOf(item)]
      this.cpr = item.cpr
      this.dialogArt = true;
      this.articulos = [];
      this.editarItems = 1
      return HTTP().post('/stockcargoitems', { id: this.editado.id, })
        .then(({ data }) => {
          debugger
          if (data.length>0) {
            for (let i=0; i<=data.length-1; i++) {
              let ctt = Number(data[i].cantidad)
              let stock = data[i].stock == null ? 0 : Number(data[i].stock)
              let nuestock = stock == 0 ? ctt : stock - ctt 
              this.articulos.push({ 
                cpritem_id:       data[i].id,
                id:               data[i].articulo_id,
                codigo:           data[i].codigo,
                nombre:           data[i].nombre,
                deposito_id:      data[i].deposito_id,
                unidad_id:        data[i].unidad_id,
                unidadNombre:     data[i].unidadNombre,
                stock:            stock,
                cantidad:         ctt,
                nuestock:         nuestock,
                estado:           'edit',
                texto:            data[i].texto
              })
            }
          }
        })
    },





    buscarArt(estricto) {
      if (this.busArt == '') return
      estricto = this.busArt.indexOf('@')!=-1 ? true : false
      let b = this.busArt
      let v = this.$store.state.vinculosPadres
      debugger
      return HTTP().post('/userarticulosfac', {
        search: b,
        vinculos: v,
        estricto: estricto,
        userex: null,
        }).then(({ data }) => {
          if (data.length==1) {
            this.editadoArt.cpritems     = null
            this.editadoArt.id           = data[0].id
            this.editadoArt.codigo       = data[0].codigo
            this.editadoArt.nombre       = data[0].nombre
            this.editadoArt.unidad_id    = data[0].unimedid
            this.editadoArt.unidadNombre = data[0].unimed
            this.editadoArt.stock        = Number(data[0].stock)
            this.editadoArt.cantidad     = Number(data[0].stock)
            this.editadoArt.nuestock     = 0
            this.editadoArt.estado       = 'edit'
            this.editadoArt.texto        = 'Roturas'
            this.seleccionarArticulo = false
          } else if (data.length>1) {
            this.selArt = []
            for (let i=0; i<=data.length-1; i++) {
              this.selArt.push({
                id:                data[i].id,
                codigo:            data[i].codigo,
                nombre:            data[i].nombre,
                codbar:            data[i].codbar,
                unidad_id:         data[i].unimedid,
                unidadNombre:      data[i].unimed,
                stock:             data[i].stock == null ? 0 : data[i].stock,
              })
            }
            this.seleccionarArticulo = true;
          } else {
            this.mensaje('¡Codigo inexistente!', this.temas.forms_titulo_bg, 1000)
            this.$nextTick(() => {
              const f = this.$refs.buscar;
              f.focus();
            });
            return
          }
        })
    },





    selArtClick (item, row) {
      debugger
      this.seleccionarArticulo = false;
      this.busArt = item.codigo
      this.buscarArt(true)
      this.$refs.cantidad.focus()
    },





    guardarItem(item) {
      debugger
      if (this.editadoArt.cantidad==this.editadoArt.stock) {
        this.$nextTick(() => {
          const f = this.$refs.cant;
          f.focus();
        });
        return 
      }
      if (this.editadoArt.cantidad == 0) {
        this.$nextTick(() => {
          const f = this.$refs.cant;
          f.focus();
        });
        return 
      } else if (this.editadoArt.codigo == '') {
        this.$nextTick(() => {
          const f = this.$refs.buscar;
          f.focus();
        });
        return 
      }

      let pos = this.articulos.findIndex( x => x.id==this.editadoArt.id )
      this.actualizoItem(this.editadoArt.stock, this.editadoArt.cantidad, pos)
      this.nuevoArt()
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },





    nuevoArt() {
      this.editedIndexArt = -1;
      this.dialogEditArt = true;
      this.uniItems = [];
      this.busArt = ''
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.seleccionarArticulo = false;
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },





    actualizoItem(stock, ctt, pos) {
      debugger
      ctt = Number(ctt)
      stock = Number(stock)
      let nuestock = this.editadoArt.stock==0 ? ctt : stock-ctt
      if (pos==-1) {
        this.articulos.push({
          cpritem_id:       this.editadoArt.cpritem_id,
          id:               this.editadoArt.id,
          codigo:           this.editadoArt.codigo,
          nombre:           this.editadoArt.nombre,
          unidad_id:        this.editadoArt.unidad_id,
          unidadNombre:     this.editadoArt.unidadNombre,
          cantidad:         ctt,
          stock:            stock,
          nuestock:         nuestock,
          estado:           'new',
          texto:            this.editadoArt.texto,
        })
      } else {
        this.articulos[pos].cantidad = ctt;
        this.articulos[pos].nuestock = nuestock;
      }
    },





    borrarItem(item) {
      this.busArt = ''
      let pos = this.articulos.indexOf(item)
      this.articulos.splice(pos,1);
    },





    genAjusteDesdeXls() {
      debugger

      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editado = Object.assign({}, this.defaultItem);
      let pos = this.comprobantes.map(function(e) { return e.nombre; }).indexOf('Ajustes');
      this.formTitle = this.comprobantes[pos].tooltip
      this.afipSuc = this.sucursalFiscal
      this.afipNro = ''
      this.editado.id = 0
      this.editado.fecha = moment().format('YYYY-MM-DD')
      this.editado.perfiscal = moment().format('YYYYMM')
      this.editado.cpr = this.comprobantes[pos].cpr+'-X '+this.sucursalFiscal+'-00000000'
      this.editado.tipo = 'SK'
      this.editado.sucursal_id = ''
      this.editado.tercero_id = this.datosEmpresa.id
      this.editado.comprobante_id = this.comprobantes[pos].cprId
      this.editado.documento_id = this.datosEmpresa.documento_id
      this.editado.deposito_id = this.depItems[0].id
      this.editado.direccion_id = this.datosEmpresa.direccion_id
      this.editado.regstk = 1
      this.editado.observaciones = this.comprobantes[pos].nombre
      this.editarItems = pos+1 // si editarItems=0 no edita, 1=edita inventarios, 2=ajustes, 3=transf.

      this.articulos = []
      for (let i=0; i<=this.conteoExcel.length-1; i++) {
        this.articulos.push({ 
          cpritem_id:       0,
          id:               this.conteoExcel[i].id,
          codigo:           this.conteoExcel[i].codigo,
          nombre:           this.conteoExcel[i].nombre,
          deposito_id:      this.deposito,
          unidad_id:        this.conteoExcel[i].unidad_id,
          unidadNombre:     null,
          stock:            this.conteoExcel[i].ajuste,
          cantidad:         this.conteoExcel[i].ajuste,
          nuestock:         this.conteoExcel[i].ajuste,
          estado:           'new',
          texto:            'Conteo'
        })
      }

      this.guardarItems('conteo');
      this.dialogActPlaXls = false;

    },





    plaXls() {
      this.dialogPlaXls = true

      let v = [] // Solo articulos del usuario actual
      v = this.vinculosPadres
      this.progress = true
      debugger
      return HTTP().post('/stockcargoarticulos', {
        rub: this.rubro.id, mar: this.marca.id, gru: this.grupo.id, vin: v, pro: this.prov})
        .then(({ data }) => {
          debugger
          this.itemsXlsAll = []
          if (data.length>0) {
            for (let i=0; i<=data.length-1; i++) {
              this.itemsXlsAll.push({
                id:        data[i].meta.aid,
                codigo:    data[i].codigo,
                nombre:    data[i].nombre,
                nomrub:    data[i].meta.nomrub,
                nomgru:    data[i].meta.nomgru,
                nommar:    data[i].meta.nommar,
                nompro:    data[i].meta.proveedor,
                unidad_id: data[i].unidad_id,
                stock:     data[i].meta.stock,
              })
            }
            this.progress = false
            this.itemsXls = this.itemsXlsAll
          } else{
            this.progress = false
            this.mensaje('No se encontraron artículos para generar la planilla.',this.temas.forms_titulo_bg, 1500)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },





    genPlaXls() {
      debugger
      this.dialogPlaXls = false
      let conteo = []
      for (let i=0; i<=this.selected.length-1; i++) {
        conteo.push({
          id:      this.selected[i].id,
          codigo:  this.selected[i].codigo,
          nombre:  this.selected[i].nombre,
          nomrub:  this.selected[i].nomrub,
          nomgru:  this.selected[i].nomgru,
          nommar:  this.selected[i].nommar,
          nompro:  this.selected[i].nompro,
          unidad:  this.selected[i].unidad_id,
          stock:   this.selected[i].stock,
          contado: this.selected[i].stock,
        })
      }
      let d = XLSX.utils.json_to_sheet(conteo)
      const workbook = XLSX.utils.book_new()
      const filename = 'conteo'
      XLSX.utils.book_append_sheet(workbook, d, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },





    modrubro(rub) {
      debugger
      this.itemsXls = this.itemsXlsAll.filter(x => x.nomrub == this.rubro.nombre)
    },





    modproveedor(rub) {
      debugger
      this.itemsXls = this.itemsXlsAll.filter(x => x.nompro == this.proveedor.nombre)
    },





    modmarca(rub) {
      debugger
      this.itemsXls = this.itemsXlsAll.filter(x => x.nommar == this.marca.nombre)
    },





    modgrupo(rub) {
      debugger
      this.itemsXls = this.itemsXlsAll.filter(x => x.nomgru == this.grupo.nombre)
    },





    actPlaXls() {
      this.dialogActPlaXls = true
      this.deposito = this.depItems[0].id
    },





    cerrarPlaXls() {
      this.dialogPlaXls = false
    },





    cerrarActPlaXls() {
      this.dialogActPlaXls = false
    },





    cargarXls() {
      debugger
      if (this.excel.name != undefined) {
        try {
          this.progress = true
          this.xlsCargado = true;
          let file = this.excel;
          let reader = new FileReader();
          this.codigos = []
          this.conteoExcel = []
          reader.onload = async function (e) {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, { type: "array" });
            let worksheet = workbook.Sheets[workbook.SheetNames[0]];
            let sheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            let dataset = await this.parseFileContent(sheet);
          }.bind(this);
          debugger
          reader.readAsArrayBuffer(file);
          this.progress = false
        } catch (exception) {
        }
      } else {
        this.xlsCargado = false;
      }
    },





    async parseFileContent(sheet) {
      let stock = 0
      let contado = 0
      let aAjustar = 0
      this.hayAjustes = 0
      for (let i=1; i<=sheet.length-1; i++) {
        if (sheet[i][9]!=undefined) {
          stock = sheet[i][8]
          contado = sheet[i][9]
          aAjustar = sheet[i][8]==null ? contado : contado-stock
          this.conteoExcel.push({
            id: sheet[i][0],
            codigo: sheet[i][1],
            nombre: sheet[i][2],
            ajuste: aAjustar,
            unidad_id: sheet[i][7]
          })
          this.hayAjustes += aAjustar
        }
      }
    },





    //////////////////////////////
    // METODOS FUNCIONES VARIAS //
    //////////////////////////////
    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },





    getEstado (estado, accion) {
      let e=''
      let c=''
      if (estado==='P') {
        e = 'Pendiente'
        c = this.temas.cen_estado_pendiente_bg
      } else if (estado==='A') {
        e = 'Anulado'
        c = this.temas.cen_estado_anulado_bg
      } else if (estado==='F') {
        e = 'Finalizado'
        c = this.temas.cen_estado_facturado_bg
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





    formatoFechaCorta(value) {
      return moment(String(value)).format('DD-MM-YY')
    },





    cancelaLinea() {
      this.nuevoArt()
      this.busArt = ''
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },





    mensaje(mensaje, color, tiempo, button) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },





    print(item) {
      this.$refs.impresion.comprasPrint(item);
    },





    printDetalles(item) {
      this.$refs.impresion.comprasPrintDetalles(item);
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
  .panel-font {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 110%;
  }
  .mini-font {
    font-size: 84%;
  }
  .x1 {
    font-size: 95%;
  }
  .iva-font {
    font-size: 74%;
  }

</style>
// 7712