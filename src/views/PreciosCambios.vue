<template>
  <v-layout align-start>
    <v-flex>

      <v-dialog v-model="dialog" :fullscreen="true" persistent>
        <template v-slot:activator="{ on }"></template>

        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            icon @click="closeForm">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <v-row>
            <v-col cols="4">
              <span class="headdline">
                Actualización de Precios / {{empresa}}
              </span>
            </v-col>
            <v-col cols="8">
              <v-progress-linear v-if="progress==true"
                class="mt-2"
                height="10"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-linear>
            </v-col>
          </v-row>
        </v-toolbar>

        <v-card>
          <form method="POST" action="upload" enctype="multipart/form-data">
            <v-card-text class="pt-1 pb-0">
              <v-container class="pt-1 pb-0">

                <v-tabs background-color="white" :color="temas.forms_titulo_bg">

                  <v-tab href="#manual" @click="setTab('manual')">
                    Precios
                  </v-tab>
                  <v-tab-item value="manual">

                    <v-row>
                      <v-col cols="7" sm="7" class="pt-0 pb-0">
                        <v-radio-group
                          v-model="tipoDeCambio" row>
                          <v-radio
                            :color="temas.forms_titulo_bg"
                            label="Cambiar Precios"
                            value="campre">
                          </v-radio>
                          <v-radio
                            :color="temas.forms_titulo_bg"
                            label="Reasignar Porcentajes de Remarcación"
                            value="campor">
                          </v-radio>
                          <v-radio
                            :color="temas.forms_titulo_bg"
                            label="Anclajes"
                            value="anclajes">
                          </v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-0 pb-0"
                        v-show="tipoDeCambio!='anclajes'">
                        <v-text-field
                          type="number"
                          :label="tipoDeCambio=='campre' ?
                          '% a Aplicar' : '% Remarcación a Asignar'"
                          :color="temas.forms_titulo_bg"
                          outlined
                          v-model="porcentaje"
                          class="pt-2">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-0 pb-0"
                        v-show="tipoDeCambio=='campre'">
                        <v-switch
                          label="Aumentar"
                          v-model="aumentar"
                          :color="temas.forms_titulo_bg"
                          outlined>
                        </v-switch>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-0 pb-0"
                        v-show="tipoDeCambio=='anclajes'">
                        <v-switch
                          label="Anclar costos al Dolar"
                          v-model="anclar"
                          :color="temas.forms_titulo_bg"
                          outlined
                          @click="anclarDesanclar()">
                        </v-switch>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="2" sm="2" class="pt-2 pb-0">
                        <v-select
                          v-model="rubro"
                          :items="rubItems"
                          :color="temas.forms_titulo_bg"
                          :item-color="temas.forms_titulo_bg"
                          :disabled="tipoDeCambio=='campor'"
                          item-value="id"
                          item-text="nombre"
                          label="Rubro..."
                          outlined return-object multiselects
                          class="pt-2">
                        </v-select>
                      </v-col>
                      <v-col cols="2" sm="2" class="pt-2 pb-0">
                        <v-select
                          v-model="prov"
                          :items="provItems"
                          :color="temas.forms_titulo_bg"
                          :item-color="temas.forms_titulo_bg"
                          :disabled="tipoDeCambio=='campre'"
                          item-value="id"
                          item-text="nombre"
                          label="Proveedor"
                          outlined
                          class="pt-2">
                        </v-select>
                      </v-col>
                      <v-col cols="2" sm="2" class="pt-2 pb-0">
                        <v-autocomplete
                          class="pt-2 body-2"
                          v-model="marca"
                          :color="temas.forms_titulo_bg"
                          :items="itemsMarcasFil"
                          :loading="isLoadingMarcasFil"
                          :search-input.sync="searchMarcasFil"
                          item-text="nombre"
                          item-value="id"
                          label="Marca"
                          outlined
                          clearable
                          @change="filtrar()"
                          placeholder="Escriba para buscar">
                        </v-autocomplete>
<!--
                        <v-select
                          v-model="marca"
                          :items="marItems"
                          :color="temas.forms_titulo_bg"
                          :item-color="temas.forms_titulo_bg"
                          item-value="id"
                          item-text="nombre"
                          label="Marca..."
                          outlined return-object
                          class="pt-2">
                        </v-select>
-->
                      </v-col>
                      <v-col cols="1" sm="2" class="pt-4 pb-0">
                        <v-card outlined class="pt-1 pb-1">
                          <span class="pl-2">Grupos</span>
                          <v-chip
                            class="ma-2"
                            @click="clickEnGrupo">
                            {{ nombreDelGrupo }}
                          </v-chip>
                        </v-card>
<!--
                        <v-select
                          v-model="grupo"
                          :items="gruItems"
                          :color="temas.forms_titulo_bg"
                          :item-color="temas.forms_titulo_bg"
                          item-value="id"
                          item-text="nombre"
                          label="Grupo..."
                          dense outlined return-object
                          class="pt-2">
                        </v-select>
-->
                      </v-col>
                      <v-col cols="1" sm="1" md="1" class="pt-2 pb-0 pl-0">
                        <v-btn
                          :color="temas.forms_titulo_bg"
                          class="ma-2 white--text"
                          @click="filtrar()">
                          Filtrar
                        </v-btn>
                      </v-col>
                      <v-col cols="1" sm="1" md="1" class="pt-4 pb-0 pl-6">
                        <v-text-field
                          disabled outlined
                          class="caption"
                          v-model="selected.length"
                          label="Selecc">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2" class="pt-2 pb-0">
                        <v-btn v-show="(selected.length>0 && (porcentaje!=0||
                          tipoDeCambio=='anclajes'))"
                          :color="temas.forms_titulo_bg"
                          class="ma-2 white--text"
                          @click="aplicarCamPre(false)">
                          Aplicar
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-tab-item>

                  <v-tab href="#importacion" @click="setTab('importacion')">
                    Desde Excel
                  </v-tab>
                  <v-tab-item value="importacion">
                    <v-row>
                      <v-col cols="3" sm="3" md="3">
                        <v-file-input
                          filled dense
                          :color="temas.forms_titulo_bg"
                          prepend-icon="mdi-file-excel"
                          v-model="nuevoXls"
                          @change="cargarXls">
                          <v-icon>mdi-plus</v-icon>
                        </v-file-input>
                      </v-col>
                      <v-col cols="1" sm="1" md="1">
                        <v-text-field
                          disabled
                          v-show="xlsCargado"
                          class="caption"
                          v-model="registrosXls"
                          label="Registros">
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" sm="1" md="1">
                        <v-text-field
                          disabled
                          v-show="xlsCargado"
                          class="caption"
                          v-model="encontradosXls"
                          label="Encontrados">
                        </v-text-field>
                      </v-col>
                      <v-col cols="1" sm="1" md="1">
                        <v-text-field
                          disabled
                          v-show="xlsCargado"
                          class="caption"
                          v-model="selected.length"
                          label="A Modificar">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2">
                        <v-btn v-show="selected.length>0"
                          :color="temas.forms_titulo_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="ma-2 white--text"
                          @click="cpAplicar()">
                          Actualizar Precios
                        </v-btn>
                      </v-col>

                    </v-row>
                  </v-tab-item>

                  <v-tab href="#cambios" @click="setTab('cambios')">
                    Precios Modificados por Compras
                  </v-tab>

                  <v-tab-item value="cambios">
                    <v-row>
                      <v-col cols="3" sm="3" md="3">
                        <v-btn v-show="selected.length>0"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="ma-2 white--text" @click="cpBorrar">
                          Borrar Seleccionados
                        </v-btn>
                      </v-col>
                      <v-col cols="3" sm="3" md="3">
                        <v-btn v-show="selected.length>0"
                          :color="temas.forms_titulo_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="ma-2 white--text" @click="cpAplicar()">
                          Aplicar Cambios
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-tab-item>
                </v-tabs>
              </v-container>
            </v-card-text>
          </form>

          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            @toggle-select-all="selectAll"
            :single-select="false"
            :search="search"
            item-key="codigo"
            show-select
            dense
            class="pl-1 pr-3 elevation-1 pt-2">
            <template v-slot:top>
              <v-row>
                <v-col cols="4" sm="4" class="pt-0 pb-0">  <!-- Barra de búsqueda  -->
                  <v-text-field
                    v-model="search"
                    :color="temas.forms_titulo_bg"
                    append-icon="search"
                    label="Buscar"
                    single-line hide-details>
                  </v-text-field>
                </v-col>
              </v-row>
            </template>
            <template #item.nombre="{ value }">
              <div class="text-truncate" style="max-width: 320px">
                {{ value }}
              </div>
            </template>
<!--
            <template v-slot:item.precio="{ item }">
              <span disable dark>$ {{ formatoImporte(item.precio) }}</span>
            </template>
-->
            <template v-slot:item.precio="{ item }">
              <span disable dark>${{ formatoImporte(item.precio) }}</span>
            </template>
            <template v-slot:item.miprecio="{ item }">
              <span disable dark>$ {{ formatoImporte(item.miprecio) }}</span>
            </template>
            <template v-slot:item.variacion="{ item }">
              <span disable dark>% {{ formatoImporte(item.variacion) }}</span>
            </template>
            <template v-slot:item.tasiva="{ item }">
              <span disable dark>%{{ formatoImporte(item.tasiva) }}</span>
            </template>
            <template v-slot:item.porrem="{ item }">
              <span disable dark>%{{ formatoImporte(item.porrem) }}</span>
            </template>
            <template v-slot:item.final="{ item }">
              <span disable dark>$ {{ formatoImporte(item.final) }}</span>
              <v-badge v-if="item.pbe!=null"
                class="pt-2"
                :content="'p'"
                :color="item.pbe=='P' ? temas.forms_btn_add_bg : black"
                :dark="temas.forms_btn_add_bg==true">
              </v-badge>
            </template>
            <template v-slot:item.costo_anterior="{ item }">
              <span disable dark>$ {{ formatoImporte(item.costo_anterior) }}</span>
            </template>
            <template v-slot:item.costo_nuevo="{ item }">
              <span disable dark>$ {{ formatoImporte(item.costo_nuevo) }}</span>
            </template>
            <template v-slot:item.seleccionado="{ item }">
              <v-chip
                :color="getColor(item.seleccionado)"
                dark>{{item.seleccionado?'Sí':'No'}}
              </v-chip>
            </template>

            <template v-slot:item.accion="{ item }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab x-small class="mr-2"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    @click="editarPrecio(item)" v-on="on">
                    <v-icon dark>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <span>Editar</span>
              </v-tooltip>
            </template>
          </v-data-table>
        </v-card>
      </v-dialog>

      <!-- EDITAR PRECIO -->
      <v-dialog v-model="dialogEditarPrecio" max-width="400px">
        <template v-slot:activator="{ on }"></template>
        <v-card>
          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn icon
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true"
              @click="cancelarEditarPrecio">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="headdline">Editar Precio</span>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-form ref="form">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                    <div class="pb-4">
                      <span v-if="edPre.pbe=='U'">
                        <b>El artículo esta publicado pero en pausa</b>
                      </span>
                      <span v-else-if="edPre.pbe=='P'">
                        <b>El artículo Publicado y Activo</b>
                      </span>
                      <span v-else-if="edPre.pbe=='I'">
                        <b>El artículo esta publicado pero invisible</b>
                      </span>
                      <span v-else>
                        <b>El artículo no esta publicado</b>
                      </span>
                    </div>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="8" sm="8" md="8" class="pt-0 pb-0">
                    <v-text-field
                      autofocus
                      v-model="edPre.costo"
                      :color="temas.forms_titulo_bg"
                      label="Costo"
                      @change="calculoPrecio(1)">
                    </v-text-field>
                  </v-col>
                  <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                    <v-text-field
                      v-model="edPre.porrem"
                      :color="temas.forms_titulo_bg"
                      label="% Remarcación"
                      @change="calculoPrecio(2)">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="8" sm="8" md="8" class="pt-0 pb-0">
                    <v-text-field
                      v-model="edPre.neto"
                      :color="temas.forms_titulo_bg"
                      label="Precio"
                      @change="calculoPrecio(3)">
                    </v-text-field>
                  </v-col>
                  <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                    <v-text-field
                      v-model="edPre.tasaiva"
                      disabled
                      :color="temas.forms_titulo_bg"
                      label="%IVA">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                  </v-col>
                  <v-col cols="8" sm="8" md="8" class="pt-0 pb-0">
                    <v-text-field
                      v-model="edPre.precio"
                      :color="temas.forms_titulo_bg"
                      label="Precio Final"
                      @change="calculoPrecio(4)">
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                :color="temas.cen_btns_bg"
                :dark="temas.cen_btns_dark==true"
                class="pb-0 pt-0 ma-2 white--text"
                @click="guardarPrecio">
                Guardar
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- SELECCION DE GRUPOS-->
      <v-dialog v-model="dialogGrupos" max-width="600px" max-height="600px">
        <template v-slot:activator="{ on }"></template>
        <v-card>
          <v-toolbar text
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close"
              :dark="temas.forms_close_dark==true"
              icon @click="cancelarDialogGrupos">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span>Seleccione los Grupos</span>
            <v-spacer></v-spacer>
            <v-btn
              @click="aceptarGrupos"
              :color="temas.cen_btns_bg"
              :dark="temas.cen_btns_dark==true"
              class="ma-2 white--text">
              Aceptar
            </v-btn>
          </v-toolbar>
          <v-form ref="form">
            <v-card-text>
              <v-container>

                <v-card max-width="600"
                  style="height: 545px;"
                  v-scroll.self="onScroll"
                  class="overflow-y-auto"
                  max-height="600">
                  <v-card-text>
                    <v-treeview
                      v-model="selection"
                      return-object
                      selectable
                      open-all
                      item-key="id"
                      hoverable activatable dense
                      :color="temas.forms_titulo_bg"
                      :item-color="temas.forms_titulo_bg"
                      :items="itemsTreeGrupos">
<!--
                      <template slot="label" slot-scope="{ item }">
                        <span @click="seleccionoGrupo(item)"
                          color="red">
                          {{ item.id }} {{ item.name }} {{ '#'+ item.ctt }}
                        </span>
                      </template>
-->
                    </v-treeview>
                  </v-card-text>
                </v-card>

              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN SELECCION DE GRUPOS -->

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
import XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import Confirmacion from "./Forms/confirmacion.vue"
import SBar from './Forms/snackbar.vue';

export default {
  components: {
    Confirmacion,
    SBar,
  },
  data: () => ({
    scrollInvoked: 0,
    tipoDeCambio: 'campre',
    progress: false,
    cfgExcel: [],
    cpSel: 0,
    desdeExcel: false,
    dialog: true,
    dialogEditarPrecio: false,
    isLoadingMarcasFil: false,
    //filtroListo: false,
    rubro: '',
    marca: '',
    grupo: '',
    prov: 0,
    rubro_id: 0,
    //queVer: 0,
    nuevoXls: '',
    xlsCargado: false,
    camPreCargado: false,
    registrosXls: 0,
    registrosCamPre: 0,
    encontradosXls: 0,
    aModificarXls: 0,
    soloCambios: 0,
    selected: [],
    rubItems: [],
    provItems: [],
    marItems: [],
    gruItems: [],
    verItems: [],
    items: [],
    mios: [],
    itemActual: null,
    footerProps: {'items-per-page-options': [8]},
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente
    // definimos los headers de la datatables
    items: [],
    headers: [],
    aumentar: true,
    anclar: true,
    porcentaje: 0,
    edPre: {
      costo: 0,
      porrem: 0,
      neto: 0,
      tasaiva: 0,
      precio: 0,
    },
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },

    entriesMarcasFil: [],
    searchMarcasFil: '',

    selection: [],
    nombreDelGrupo: 'Sel.grupos',
    itemsTreeGrupos: [],
    dialogGrupos: false,
    enCualTabEstoy: '',

  }),
  
  
  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState([
      'vinculosPadres', 'vinculosHijos', 'empresa', 'temas', 'dolar'
    ]),

    itemsMarcasFil () {
      return this.entriesMarcasFil.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

  },
  
  
  watch: {

    searchMarcasFil (val) {
      debugger
      if (this.isLoadingMarcasFil) return
      return HTTP().get('/marcasbus').then(({ data }) => {
        this.entriesMarcasFil = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingMarcasFil = false))
    },

    search () {
      this.filtrar()
    }

  },


  mounted () {
    this.dialog = true;
    this.rubItems = []
    this.provItems = []
    this.marItems = [{id: 0, nombre: 'Todas'}]
    this.gruItems = [{id: 0, nombre: 'Todos'}]
    this.verItems = ['Solo cambios', 'Todos']
    const a = HTTP().get('/usersrubros')
      .then(({ data }) => {

        for (let i=0; i<=data.length-1; i++) {
          this.rubItems.push(data[i].rubro)
        }
        this.rubro = this.rubItems[0]
        this.rubro_id = this.rubro.id                    // ver, puede tener mas rubros

      const b = HTTP().get('/marcasbus')
        .then(({ data }) => {

          for (let i=0; i<=data.length-1; i++) {
            this.marItems.push(data[i])
          }
          debugger
          this.marca = this.marItems[0].id

        const c = HTTP().get('/grupos').then(({ data }) => {
          for (let i=0; i<=data.length-1; i++) {
            this.gruItems.push(data[i])
          }
          this.grupo = this.gruItems[0]
          this.provItems = this.$store.state.proveedores
          this.setTab('manual')

          debugger
          return HTTP().get('/gruposrubros/'+this.rubItems[0].id).then(({ data }) => {
            debugger
            let aux = [];
            for(let i in data[0]) {
              aux.push({
                id:     Number(data[0][i].id),
                name:   data[0][i].nombre,
                activo: data[0][i].activo,
                ctt:    data[0][i].ctt,
                padre:  Number(data[0][i].grupo_id),
                state:  { disabled: data[0][i].activo===1 ? false : true }
              })
            }
            this.itemsTreeGrupos = getNestedChildren2(aux,0)
            function getNestedChildren2(arr, padre) {
              var out = []
              for(var i in arr) {
                if(arr[i].padre === padre) {
                  var children = getNestedChildren2(arr, arr[i].id);
                  if(children.length) {
                    arr[i].children = children;
                  }
                  out.push(arr[i]);
                }
              }
              return out
            }
            this.filtrar();
          })
        });
      });
    });
  },





  methods: {

    selectAll(event) {
      if (event.value) {
        this.selected = this.items
      } else {
        this.selected = []
      }
    },





    closeForm(){
      this.dialog = false;
      router.push('/')
    },
    




    guardarPrecio(cual) {
      debugger
      this.itemActual.costo = this.edPre.costo
      this.itemActual.porrem = this.edPre.porrem
      this.itemActual.precio = this.edPre.neto
      this.itemActual.final = this.edPre.precio
      this.selected.push(this.itemActual)
      this.dialogEditarPrecio = false
      this.msg.msgAccion = 'Aplicar Cambio de Precios'
      this.tipoDeCambio = 'camone'
      this.msgRespuesta('Aceptar')
     },





    msgRespuesta(op) {

      debugger
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='Aplicar Cambio de Precios') {
          let s = this.search ? this.search : 'all'

          let v = []
          if (this.tipoDeCambio=='campre'||
              this.tipoDeCambio=='camone'||
              this.tipoDeCambio=='campor'||
              this.tipoDeCambio=='anclajes') {
            v = this.$store.state.vinculosHijos
          } else {
            v.push(this.userId)
          }

          debugger
          this.progress = true
          return HTTP().post('/userarticuloscambiosdeprecios/', {
            rub: this.rubro.id,
            vin: v,
            sel: this.selected,
            pje: this.porcentaje,
            aum: this.aumentar,
            tip: this.tipoDeCambio,
            xls: this.desdeExcel,
            one: this.edPre,
            usd: this.dolar,
            anc: this.anclar}, { timeout: 20000, limit: 50 })
            .then(({ data }) => {

              debugger
              this.selected = []
              this.items = []
              this.progress = false
              if (this.tipoDeCambio=='campre') {
                this.msg.msgTitle = 'El cambio de precios fue realizado!'
              } else if (this.tipoDeCambio=='camone'||this.tipoDeCambio=='campor') {
                this.msg.msgTitle = 'El cambio de remarcación fue realizado!'
              } else {
                this.msg.msgTitle = 'El cambio de anclas fue realizado!'
              }
              let msg = ''
              if (data>0) {
                msg = data+' precios fueron modificados.<br><br>'
                if (this.$store.state.vinculosHijos.length>0) {
                  msg += 'Tambien fueron modificados los precios de '+this.$store.state.vinculosHijos.length+' '
                  msg += 'clientes vinculados.'
                }
              } else {
                this.msg.msgBody = 'No se han modificado precios!.'
              }

              this.msg.msgBody = msg
              this.msg.msgVisible = true
              this.msg.msgAccion = 'Precios Modificados'
              this.msg.msgButtons = ['Aceptar']
            })
            .catch(err => {
              this.progress = false
              this.msg.msgTitle = '¡Opps, se ha producido un error!'
              this.msg.msgBody = err
              this.msg.msgVisible = true
              this.msg.msgAccion = 'Error'
              this.msg.msgButtons = ['Aceptar']
            })

        
        } else if (this.msg.msgAccion=='Precios Modificados') {
          
          this.msg.msgVisible = false
          this.filtrar()
        
        } else if (this.msg.msgAccion=='Borrar Cambios de Precios') {
          
          this.cpBorrarHTTP()
        
        } else if (this.msg.msgAccion=='eliminacion de cambios de precios') {
          
          this.msg.msgVisible = false
          this.cpSel = 0
        
        } else if (this.msg.msgAccion=='No hay precios seleccionados') {
          
          this.msg.msgVisible = false
          this.cpSel = 0
        
        } else if (this.msg.msgAccion=='Aplicar precio seleccionado' || this.msg.msgAccion=='Aplicar precios seleccionados') {
          
          this.cpAplicarCambiosHTTP()
        
        } else if (this.msg.msgAccion=='cambios de precios aplicados') {
          
          this.msg.msgVisible = false
          this.cpSel = 0
          this.filtrar()

        } else if (this.msg.msgAccion=='Error') {

          this.msg.msgVisible = false

        }
      
      } else if (op==='Cancelar') {
        
        this.msg.msgVisible = false;
      
      }
    },





    anclarDesanclar() {
      this.selected = []
      this.filtrar()
    },





    filtrar() {
      debugger

      this.items = []
      if (this.enCualTabEstoy=='cambios') {

        return HTTP().get('/precioscambios').then(({data})=>{
          if (data) {
            for (let i=0; i<=data.length-1; i++) {
              this.items.push({ 
                id: data[i].id,
                articulo_id: data[i].aid,
                codigo: data[i].codigo,
                nombre: data[i].nombre,
                cpr: data[i].cpr,
                costo_anterior: data[i].costo_anterior,
                costo_nuevo: data[i].costo_nuevo,
                procesado: data[i].procesado,
                seleccionado: false,
              })
            }
          }
        })

      } else {

        let grusel = []
        for (let i=0; i<=this.selection.length-1; i++) {
          grusel.push(this.selection[i].id)
        }
        let s = this.search ? this.search : 'all'
        let v = [] // Solo articulos del usuario actual
        if (this.tipoDeCambio=='campre' || this.tipoDeCambio=='anclajes') {
          v.push(this.userId) // Solo articulos del usuario actual
        } else {
          if (this.vinculosPadres.length) {
            v = this.vinculosPadres
          } else {
            v = this.userId
          }
        }
        if (this.marca==undefined) {
          this.marca = 0
        }
        this.progress = true
        return HTTP().post('/userarticulosprecios', {
          rub: this.rubro.id,
          mar: this.marca,
          gru: grusel,
          vin: v,
          sea: s,
          tip: this.tipoDeCambio,
          pro: this.prov,
          anc: this.anclar,
          usd: this.$store.state.dolar }).then(({ data }) => {
          
          debugger
          if (data.ar.length>0) {
            for (let i=0; i<=data.ar.length-1; i++) {
              this.items.push({
                id:      data.ar[i].id,
                aid:     data.ar[i].meta.aid,
                codigo:  data.ar[i].codigo,
                nombre:  data.ar[i].nombre,
                nomgru:  data.ar[i].meta.nomgru,
                nommar:  data.ar[i].meta.nommar,
                costo:   data.ar[i].meta.costo,
                porrem:  data.ar[i].meta.porrem,
                precio:  data.ar[i].meta.precio,
                tasiva:  data.ar[i].meta.tasiva,
                final:   data.ar[i].meta.final,
                creador: data.ar[i].meta.creador,
                estado:  '',
                seleccionado: false,
                pbe:     data.ar[i].meta.pbe
              })
            }
            this.progress = false
          } else{
            this.progress = false
            this.mensaje('No se encontraron precios para actualizar.',this.temas.forms_titulo_bg, 1500)
          }
        })
        .catch(err => {
          console.log(err)
        })
      }
    },





    cargarXls() {
      if (this.nuevoXls.name != undefined) {
        try {

          let a = HTTP().get('/configarticulosexcel')   // ver esto!!!
            .then(({ data }) => {
              this.cfgExcel = data
              if (data) {
                this.xlsCargado = true;
                let file = this.nuevoXls;
                let reader = new FileReader();
                reader.onload = async function (e) {
                  let data = new Uint8Array(e.target.result);
                  let workbook = XLSX.read(data, { type: "array" });
                  let worksheet = workbook.Sheets[workbook.SheetNames[0]];
                  let sheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                  let dataset = await this.parseFileContent(sheet);
                }.bind(this);
                reader.readAsArrayBuffer(file);
                this.chequearArt()
              }
            })

        } catch (exception) {
        }
      } else {
        this.xlsCargado = false;
      }
    },





    parseFileContent(sheet) {
      debugger
      this.items = []
      let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

      debugger
      for (let i=0; i<=this.cfgExcel.length-1; i++) {

        // paso a variables el json
        let pcod=this.cfgExcel[i].codigo
        let pnom=this.cfgExcel[i].nombre
        let pgru=this.cfgExcel[i].grupo
        let pmar=this.cfgExcel[i].marca
        let pprecio=this.cfgExcel[i].precio
        let pconiva=this.cfgExcel[i].coniva
        let ptasiva=this.cfgExcel[i].tasaiva
        let pmoneda=this.cfgExcel[i].moneda

        // paso a variables las posiciones de las columnas, 1='A', 2='B', etc.
        let ccod = abc.indexOf(pcod)
        let cnom = abc.indexOf(pnom)
        let cgru = abc.indexOf(pgru)
        let cmar = abc.indexOf(pmar)
        let cpre = abc.indexOf(pprecio)
        let civa = abc.indexOf(ptasiva)
        let cmon = abc.indexOf(pmoneda)

        for (let j=Number(this.cfgExcel[i].comienza)-1; j<=sheet.length-1; j++) {

          let r = sheet[j]

          let codigo = ''
          let nombre = ''
          let precio = 0
          let tasiva = 0
          let moneda = 'PES'

          if (r[ccod]!=undefined && r[cnom]!=undefined && r[cpre]!=undefined && !isNaN(r[cpre])) {

            precio = r[cpre]
            if (pconiva=='S') {
              if (ptasiva!='') {
                precio = precio / (1+(ptasiva/100))
              } else {
                precio = precio / (1.21)
              }
            }

            this.items.push({
              codigo: r[ccod]+'@'+this.userId,
              nombre: r[cnom],
              miprecio: 0,
              precio: precio,
              variacion: 0,
              estado: 'N',
            })
          }

        }
//      this.items.push({ codigo: r[0]+'@'+this.userId, nombre: r[1], miprecio: 0, precio: r[2], variacion: 0, estado: 'N' })
      }
      this.registrosXls = sheet.length;

      debugger
//      for (let i=0; i<=this.items.length-1; i++) {
//        console.log(this.items[i])
//      }

    },





    chequearArt() {

      debugger
      this.mios = [];
      this.encontradosXls = 0;
      let tmp = []
      let preciosIguales = 0;
      // ver de poner el rubro, por ahora van todos.
      return HTTP().get('/userarticulosmisprecios')   // ver esto!!!
        .then(({ data }) => {

          debugger
          if (data) {
            for (let i=0; i<=data.length-1; i++) {
              this.mios.push({ codigo: data[i].codigo, precio: data[i].costo })
            }

            // ORDENO items POR CODIGO
            this.items.sort(function (a, b) {
              if (a.codigo > b.codigo) { return 1 }
              if (a.codigo < b.codigo) { return -1 }
            return 0 })

            let resultado = this.items.filter(
              (item) => {
                let ok = false;
                for (let i = 0; i < this.mios.length && !ok; i++) { // Corta cuando no hay mas following o cuando ya se encontró uno
                  let mio = this.mios[i];
                  if (mio.codigo == item.codigo) {
                    if (mio.precio != item.precio) {
                      item.variacion = this.roundTo(((item.precio/mio.precio)-1)*100,2)
                      item.miprecio = mio.precio
                      ok = true;
                    }
                  }
                }
                return ok;
            })
            debugger
            this.encontradosXls = resultado.length
            this.aModificarXls = resultado.length
            this.items = resultado
          }
          if (this.encontradosXls == 0) {
            this.mensaje('No se encontraron precios para actualizar.',this.temas.forms_titulo_bg, 1500)
          }
        })
        .catch(err => {
          console.log(err)
        })

    },





    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },





    aplicarCamPre(val) {

      debugger
      this.desdeExcel = val
      let msg = ''
      //este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      if (this.tipoDeCambio=='campre') {
        this.msg.msgTitle = 'Cambios de Precios'
        if (this.selected.length==1) {
          msg = 'Se va a modificar un precio. ¿Confirma la operación?'
        } else {
          if (this.$store.state.vinculosHijos.length) {
            if (this.selected.length==1) {
              msg =  '<br>Se modificará el precio de <b>'+this.selected.length + '</b> artículo propio'
            } else {
              msg =  '<br>Se modificarán los precios de <b>'+this.selected.length + '</b> artículos propios'
            }
            if (this.$store.state.vinculosHijos.length==1) {
              msg += ' y <b>'+((this.selected.length)*(this.$store.state.vinculosHijos.length))+'</b> correspondientes al '
              msg += ' 1 usuario vinculado</b>'
            } else {
              msg += ' y <b>'+((this.selected.length)*(this.$store.state.vinculosHijos.length))+'</b> correspondientes a los '
              msg += ' <b>'+this.$store.state.vinculosHijos.length+'</b> usuarios vinculados</b>'
            }
          } else {
            if (this.selected.length==1) {
              msg =  '<br>Se modificará el precio de <b>'+this.selected.length + '</b> artículo.'
            } else {
              msg =  '<br>Se modificarán los precios de <b>'+this.selected.length + '</b> artículos.'
            }
          }
          msg += '<br><br>¿Confirma la operación?'
        }
      } else if (this.tipoDeCambio=='anclajes') {

        if (this.anclar) {
          this.msg.msgTitle = 'Anclar'
          if (this.selected.length==1) {
            msg = 'Un artículo sera anclado. ¿Confirma la operación?'
          } else {
            msg =  '<br>Se anclarán '+this.selected.length + ' artículos.<br><br>'
            msg += 'Este proceso puede demorar. Dependerá de la cantidad de registros incluidos '
            msg += 'y de la cantidad de clientes vinculados.<br><br>'
            msg += '¿Confirma la operación?'
          }
        } else {
          this.msg.msgTitle = 'Desanclar'
          if (this.selected.length==1) {
            msg = 'Un artículo sera desanclado. ¿Confirma la operación?'
          } else {
            msg =  '<br>Se desanclarán '+this.selected.length + ' artículos.<br><br>'
            msg += 'Este proceso puede demorar. Dependerá de la cantidad de registros incluidos '
            msg += 'y de la cantidad de clientes vinculados.<br><br>'
            msg += '¿Confirma la operación?'
          }
        }

      } else {
        this.msg.msgTitle = 'Cambios en Porcentajes de Remarcación'
        if (this.selected.length==1) {
          msg = 'Un porcentaje sera modificado. ¿Confirma la operación?'
        } else {
          msg =  '<br>Se modificará el porcentaje de remarcacion en '+this.selected.length + ' artículos.<br><br>'
          msg += 'Este proceso puede demorar. Dependerá de la cantidad de registros incluidos '
          msg += 'y de la cantidad de clientes vinculados.<br><br>'
          msg += '¿Confirma la operación?'
        }
      }
      this.msg.msgBody = msg
      this.msg.msgVisible = true
      this.msg.msgAccion = 'Aplicar Cambio de Precios'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },





    editarPrecio(item) {
      this.itemActual = item
      this.dialogEditarPrecio = true;
      this.edPre.costo   = item.costo
      this.edPre.porrem  = item.porrem
      this.edPre.neto    = item.precio
      this.edPre.tasaiva = item.tasiva
      this.edPre.precio  = item.final
      this.edPre.pbe     = item.pbe
    },





    calculoPrecio(cual) {
      if (cual==1) {        // costo
        this.edPre.neto   = this.roundTo(this.edPre.costo*(1+(this.edPre.porrem/100)),2)
        this.edPre.precio = this.roundTo(this.edPre.neto*(1+(this.edPre.tasaiva/100)),2)
      } else if (cual==2) { // porrem
        this.edPre.neto = this.roundTo(this.edPre.costo*(1+(this.edPre.porrem/100)),2)
        this.edPre.precio = this.roundTo(this.edPre.neto*(1+(this.edPre.tasaiva/100)),2)
      } else if (cual==3) { // neto
        this.edPre.porrem = this.roundTo(((this.edPre.neto/this.edPre.costo)-1)*100,2)
        this.edPre.precio = this.roundTo(this.edPre.neto*(1+(this.edPre.tasaiva/100)),2)
      } else {              // precio
        this.edPre.neto   = this.roundTo((this.edPre.precio/(1+(this.edPre.tasaiva/100))),2)
        this.edPre.porrem = this.roundTo(((this.edPre.neto/this.edPre.costo)-1)*100,2)
      }
    },





    cancelarEditarPrecio() {
      this.dialogEditarPrecio = false;
    },





    setTab(cual) {
      this.enCualTabEstoy = cual
      this.items = []
      if (cual=='manual') {
        this.headers = [
          //{ text: 'ID', value: 'id', width: 100, align: 'left' },
          { text: 'CODIGO',   value: 'codigo', width: 100, align: 'left' },
          { text: 'NOMBRE',   value: 'nombre', width: 320, align: 'left' },
          { text: 'MARCA',    value: 'nommar', width: 90,  align: 'left'},
          { text: 'GRUPO',    value: 'nomgru', width: 90,  align: 'left' },
          { text: 'COSTO',    value: 'costo',  width: 100, align: 'end'},
          { text: '%REM',     value: 'porrem', width: 40,  align: 'end'},
          { text: 'PRECIO',   value: 'precio', width: 100, align: 'end'},
          { text: '%IVA',     value: 'tasiva', width: 40,  align: 'right'},
          { text: 'FINAL',    value: 'final',  width: 120, align: 'end'},
          { text: 'ACCION',   value: 'accion', width: 50,  align: 'right'},
        ]
        this.filtrar()
      } else if (cual=='importacion') {
        this.headers = [
          { text: 'CODIGO', value: 'codigo', width: 110 },
          { text: 'NOMBRE', value:'nombre', width: 650 },
          { text: 'MI PRECIO', value:'miprecio', width: 150, align: 'right'},
          { text: 'PRECIO', value:'precio', width: 150, align: 'right'},
          { text: 'VARIACION', value:'variacion', width: 50, align: 'right'},
          { text: 'ESTADO', value:'estado', width: 50, align: 'right'},
        ]
      } else if (cual=='cambios') {
        this.headers = [
          { text: 'CODIGO', value: 'codigo', width: 110 },
          { text: 'NOMBRE', value:'nombre', width: 350 },
          { text: 'COMPROBANTE', value:'cpr', width: 130 },
          { text: 'COSTO ANTERIOR', value:'costo_anterior', width: 150, align: 'right'},
          { text: 'NUEVO COSTO', value:'costo_nuevo', width: 150, align: 'right'},
//        { text: 'Sel', value:'seleccionado', width: 90, align: 'right'},
//        { text: 'ACCION', value:'accion', width: 50, align: 'right'},
        ]
        this.filtrar()
      }
    },





    cpBorrar() {
      this.msg.msgTitle = 'Eliminar Cambios de Precios'
      this.msg.msgBody = 'Se eliminarán los cambios de precios seleccionados?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'Borrar Cambios de Precios'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },





    cpBorrarHTTP() {
      let s = []
      for (let i=0; i<=this.items.length-1; i++) {
        if (this.items[i].seleccionado) {
          s.push(this.items[i].id)
        }
      }
      return HTTP().post('/borrarpreciosseleccionados/', { s } )
        .then(({ data }) => {
          this.items = []
          this.msg.msgVisible = false
          if (data) {
            this.msg.msgTitle = 'Cambios de Precios Borrados'
            this.msg.msgBody = 'Los precios seleccionados fueron borrados!'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'eliminacion de cambios de precios'
            this.msg.msgButtons = ['Aceptar']
          }
        })
    },





    cpAplicar() {
      this.msg.msgTitle = 'Aplicar Cambios'
      if (this.selected.length==0) {
        this.msg.msgBody    = 'No se han seleccionado precios para modificar!'
        this.msg.msgAccion  = 'No hay precios seleccionados'
        this.msg.msgButtons = ['Aceptar']
      } else if (this.selected.length==1) {
        this.msg.msgBody    = 'Confirma aplicar el nuevo precio seleccionado?'
        this.msg.msgAccion  = 'Aplicar precio seleccionado'
        this.msg.msgButtons = ['Aceptar','Cancelar']
      } else if (this.selected.length>1) {
        this.msg.msgBody    = 'Confirma aplicar los nuevos precios seleccionados?'
        this.msg.msgAccion  = 'Aplicar precios seleccionados'
        this.msg.msgButtons = ['Aceptar','Cancelar']
      }
      this.msg.msgVisible = true
    },





    cpAplicarCambiosHTTP() {
      
      debugger
      let s = []
      for (let i=0; i<=this.selected.length-1; i++) {
        s.push( {id: this.selected[i].id, articulo_id: this.selected[i].articulo_id, precio: this.selected[i].costo_nuevo})
      }
      return HTTP().post('/aplicarcambiosdepreciosseleccionados/', { s } ).then(({data})=>{

        debugger
        this.selected = []
        this.msg.msgVisible = false
        let m = ''
        if (data) {
          this.msg.msgTitle = 'Cambios de Precios Aplicados'
          m =  (data.rows==1) ? 'Un precio fue modificado<br>' : data.rows + ' precios furon modificados.<br>'
          if (data.rowsTotal>0) {
            m += (data.rowsTotal==1)
            ? 'Y también fue modificado el precio de un usuario vinculado.'
            : 'Y también fueron modificados '+data.rowsTotal+' precios de usuarios vinculados.'
          }
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'cambios de precios aplicados'
          this.msg.msgButtons = ['Aceptar']
        }
      })
    },





    getColor (activo) {
      return (activo) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },





    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },





    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },





    clickEnGrupo() {
      this.dialogGrupos = true;
    },





    cancelarDialogGrupos() {
      this.dialogGrupos = false
    },


    onScroll () {
      this.scrollInvoked++
    },



    aceptarGrupos() {
      this.dialogGrupos = false
      this.filtrar()
    },





  }
}
</script>
