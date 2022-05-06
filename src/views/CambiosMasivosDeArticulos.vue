<template>
  <v-layout align-start>
    <v-flex>
      <v-dialog v-model="dialog" :fullscreen="true" persistent>
        <template v-slot:activator="{ on }"></template>

        <v-toolbar
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true"
            icon @click="closeForm">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="headdline">Cambios Masivos de Artículos / {{empresa}}</span>
        </v-toolbar>

        <v-card>
          <form method="POST" action="upload" enctype="multipart/form-data">
            <v-card-text>
              <v-container>

                <v-row class="pt-0">
                  <v-col cols="2" sm="2" class="pt-0 pb-0">
                    <v-select
                      v-model="rubro"
                      :items="rubItems"
                      :color="temas.forms_titulo_bg"
                      :item-color="temas.forms_titulo_bg"
                      item-value="id"
                      item-text="nombre"
                      label="Rubro..."
                      outlined
                      return-object
                      @change="filtrar()"
                      class="pt-2">
                    </v-select>
                  </v-col>
                  <v-col cols="3" sm="3" class="pt-0 pb-0">
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
                  </v-col>
                  <v-col cols="3" sm="3" md="3" class="pt-2 pb-0">

                    <v-card outlined class="pt-1 pb-1">
                      <span class="pl-2">Grupos</span>
                      <v-chip
                        class="ma-2"
                        @click="clickEnGrupo">
                        {{ nombreDelGrupo }}
                      </v-chip>
                    </v-card>
<!--
                    <v-autocomplete
                      class="pt-2 body-2"
                      v-model="grupo"
                      :color="temas.forms_titulo_bg"
                      :items="itemsGruposFil"
                      :loading="isLoadingGruposFil"
                      :search-input.sync="searchGruposFil"
                      item-text="nombre"
                      item-value="id"
                      label="Grupo"
                      outlined
                      clearable
                      @change="filtrar()"
                      placeholder="Escriba para buscar">
                    </v-autocomplete>
-->
                  </v-col>
                  <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                    <v-select
                      v-model="opcion"
                      :items="opciones"
                      :color="temas.forms_titulo_bg"
                      :item-color="temas.forms_titulo_bg"
                      item-value="id"
                      item-text="nombre"
                      label="Opciones..."
                      @change="setopcion"
                      outlined
                      class="pt-2">
                    </v-select>
                  </v-col>

                  <!--// SELECCION DEL GRUPO // -->
<!--
                  <v-col cols="1" sm="1" class="pt-0 pb-0">
                    <v-dialog v-model="dialogGru" max-width="350px">
                      <template v-slot:activator="{}"></template>
                      <v-toolbar flat
                        :color="temas.forms_titulo_bg"
                        :dark="temas.cen_forms_titulo_dark==true">
                        <v-btn icon
                          :color="temas.forms_close_bg"
                          :dark="temas.forms_close_dark==true"
                          @click="dialogGru=false">
                          <v-icon>mdi-arrow-left-circle</v-icon>
                        </v-btn>
                        <span class="text--right">
                          Grupos
                        </span>
                        <v-spacer></v-spacer>
                      </v-toolbar>

                      <v-card>
                        <v-form ref="art2">
                          <v-card-text>
                            <v-container>
                              <v-row>
                                <v-col cols="12" sx="12" mx="12">
                                  <v-treeview
                                    return-object
                                    item-key="id"
                                    hoverable activatable dense
                                    open-on-click
                                    :color="temas.forms_titulo_bg"
                                    :item-color="temas.forms_titulo_bg"
                                    :items="gruItems">
                                    <template slot="label" slot-scope="{ item }">
                                      <a @click="seleccionaGrupo(cualGrupo, item)">{{ item.name }}
                                        {{userId==1 ? '' : '#'+ item.ctt }}
                                      </a>
                                    </template>
                                  </v-treeview>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                        </v-form>
                      </v-card>
                    </v-dialog>
                  </v-col>
-->
                  <!-- FIN DE SELECCION DEL GRUPO -->
                </v-row>
                <v-row>
                  <v-col cols="4" sm="4" class="pt-0 pb-0">
                    <v-text-field
                      v-model="search"
                      clearable
                      outlined
                      :color="temas.forms_titulo_bg"
                      append-icon="search"
                      label="Texto a Buscar"
                      single-line hide-details
                      class="pt-0">
                    </v-text-field>
                  </v-col>
                  <v-col cols="2" sm="2" class="pt-0 pb-0">
                    <v-btn
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class="pt-0 white--text"
                      @click="buscarArticulos">
                      Buscar
                    </v-btn>
                  </v-col>
                  <v-col cols="1" sm="1" md="1" class="pt-0 pb-0 pl-0">
                    <v-text-field
                      disabled
                      outlined
                      v-model="selected.length"
                      label="Art.Sel."
                      class="pt-0">
                    </v-text-field>
                  </v-col>
                  <v-col cols="1" sm="1" md="1" class="pt-0 pb-0">
                  </v-col>
                  <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                    <v-autocomplete v-show="opcion==4"
                      class="body-2 pt-0"
                      v-model="marcaSel_id"
                      :color="temas.forms_titulo_bg"
                      :items="itemsMarcas"
                      :loading="isLoadingMarcas"
                      :search-input.sync="searchMarcas"
                      item-text="nombre"
                      item-value="id"
                      label="Marca a Asignar"
                      outlined
                      placeholder="Escriba para buscar">
                    </v-autocomplete>
                    <v-autocomplete v-show="opcion==5"
                      class="body-2 pt-0"
                      v-model="grupoSel_id"
                      :color="temas.forms_titulo_bg"
                      :items="itemsGrupos"
                      :loading="isLoadingGrupos"
                      :search-input.sync="searchGrupos"
                      item-text="nombre"
                      item-value="id"
                      label="Grupo a Asignar"
                      outlined
                      placeholder="Escriba para buscar">
                    </v-autocomplete>
                    <v-text-field v-show="opcion==7"
                      outlined
                      v-model="decimales"
                      label="Decimales"
                      class="pt-0">
                    </v-text-field>
                    <v-autocomplete v-show="opcion==18"
                      class="body-2 pt-0"
                      v-model="tagSel_id"
                      :color="temas.forms_titulo_bg"
                      :items="itemsTags"
                      :loading="isLoadingTags"
                      :search-input.sync="searchTags"
                      item-text="nombre"
                      item-value="id"
                      label="Tag a Asignar"
                      outlined
                      placeholder="Escriba para buscar">
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="2" sm="2" md="2">
                    <v-btn
                      v-show="selected.length>0"
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class=""
                      @click="aplicarCambios">
                      Aplicar Cambios
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </form>

          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            @toggle-select-all="selectAll"
            :single-select="false"
            item-key="codigo"
            show-select
            dense
            class="pl-1 pr-3 elevation-3"
            :footer-props="footerProps">

            <template v-slot:item.tags="{ item }">
              <v-chip v-for="(t, idx) in item.tags" v-bind:key="idx"
                small>
                <span> {{t.nombre}} </span>
              </v-chip>
            </template>

            <template v-slot:item.codigo="{ item }">
              <span class="mini-font">{{ item.codigo }}</span>
            </template>
            <template v-slot:item.nombre="{ item }">
              <span class="mini-font">{{ item.nombre }}</span>
            </template>
            <template v-slot:item.nomgru="{ item }">
              <span class="mini-font">{{ item.nomgru }}</span>
            </template>
            <template v-slot:item.nommar="{ item }">
              <span class="mini-font">{{ item.nommar }}</span>
            </template>

            <!--
            <template v-slot:headers="props">
              <tr>
                <th>
                  <v-checkbox
                    :input-value="props.all"
                    :indeterminate="props.indeterminate"
                    primary
                    hide-details
                    @click.stop="toggleAll">
                  </v-checkbox>
                </th>
                <th
                  v-for="header in props.headers"
                  :key="header.text"
                  :class="['column sortable',
                    pagination.descending ? 'desc' : 'asc',
                    header.value === pagination.sortBy ? 'active' : '']"
                  @click="changeSort(header.value)">
                  <v-icon small>arrow_upward</v-icon>
                  {{ header.text }}
                </th>
              </tr>
            </template>
            <template v-slot:items="props">
              <tr :active="props.selected" @click="props.selected = !props.selected">
                <td>
                  <v-checkbox
                    :input-value="props.selected"
                    primary
                    hide-details
                  ></v-checkbox>
                </td>
                <td>{{ props.item.name }}</td>
                <td class="text-xs-right">{{ props.item.id }}</td>
                <td class="text-xs-right">{{ props.item.codigo }}</td>
                <td class="text-xs-right">{{ props.item.nombre }}</td>
                <td class="text-xs-right">{{ props.item.nommar }}</td>
                <td class="text-xs-right">{{ props.item.nomgru }}</td>
              </tr>
            </template>
            -->
          </v-data-table>
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

export default {
  components: {
    Confirmacion,
  },
  data: () => ({
    scrollInvoked: 0,
    dialog: true,
    //dialogGru: false,
    isLoadingMarcas: false,
    isLoadingMarcasFil: false,
    isLoadingGrupos: false,
    isLoadingGruposFil: false,
    isLoadingTags: false,
    searchMarcas: '',
    searchMarcasFil: '',
    searchGrupos: '',
    searchGruposFil: '',
    searchTags: '',
    entriesMarcas: [],
    entriesMarcasFil: [],
    entriesGrupos: [],
    entriesTags: [],
    entriesGruposFil: [],
    mensaje: '',
    rubro: '',
    marca: 0,
    grupo: '',
    tag: '',
    rubro_id: 0,
    tag_id: 0,
    marcaSel_id: 0,
    grupoSel_id: 0,
    tagSel_id: 0,
    decimales: 0,
    grupo1Seleccionado: 'Todos',
    grupo2Seleccionado: 'Todos',
    cualGrupo: 0,
    pagination: { sortBy: 'codigo' },
    nuevoXls: '',
    xlsCargado: false,
    registrosXls: 0,
    registrosCamPre: 0,
    encontradosXls: 0,
    aModificarXls: 0,
    soloCambios: 0,
    rubItems: [],
    marItems: [],
    gruItems: [],
    tagItems: [],
    tagItemsSel: [],
    items: [],
    selected: [],
    opciones: [
      {id: 1, nombre: 'Pasar el nombre del artículo a mayúsculas'},
      {id: 2, nombre: 'Pasar el nombre del artículo a minúsculas'},
      {id: 3, nombre: 'Dejar un solo espacio en blanco entre palabra y palabra'},
      {id: 4, nombre: 'Asignar nueva marca a artículos'},
      {id: 5, nombre: 'Asignar nuevo grupo a artículos'},
      {id: 6, nombre: 'Asignar nuevo código de IVA'},
      {id: 7, nombre: 'Asignar decimales en precios'},
      {id: 8, nombre: 'Asignar nueva unidad de medida para ventas'},
      {id: 9, nombre: 'Asignar nueva unidad para ventas'},
      {id:10, nombre: 'Asignar nueva unidad de medida para compras'},
      {id:11, nombre: 'Asignar nueva unidad para compras'},
      {id:12, nombre: 'Asignar nueva condición <Se Compra>'},
      {id:13, nombre: 'Asignar nueva condición <Se Vende>'},
      {id:14, nombre: 'Asignar nueva condición <Controla Stock>'},
      {id:15, nombre: 'Asignar nueva condición <Activar/Desactivar>'},
      {id:16, nombre: 'Asignar nueva Moneda'},
      {id:17, nombre: 'Limpiar tags'},
      {id:18, nombre: 'Asignar Tag'},
//    {id:5, nombre: 'Cambiar Tasa de IVA'},
//    {id:6, nombre: 'Cambiar Moneda'},
    ],
    opcion: 1,
    mios: [],
    footerProps: {'items-per-page-options': [8]},
    search: '',
    dialog: false,
    items: [],
    headers: [],
    aumentar: true,
    porcentaje: 0,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    selection: [],
    nombreDelGrupo: 'Seleccione grupos',
    itemsTreeGrupos: [],
    dialogGrupos: false,
  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState([
      'vinculosPadres', 'vinculosHijos', 'empresa', 'temas', 'externo'
    ]),

    itemsMarcasFil () {
      return this.entriesMarcasFil.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

    itemsGruposFil () {
      return this.entriesGruposFil.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

    itemsMarcas () {
      return this.entriesMarcas.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },
    
    itemsGrupos () {
      return this.entriesGrupos.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

    itemsTags () {
      return this.entriesTags.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },
  },

  
  
  

  watch: {

    searchMarcas (val) {
      if (this.isLoadingMarcas) return
      this.isLoadingMarcas = true
      return HTTP().get('/marcasbus').then(({ data }) => {
        this.entriesMarcas = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingMarcas = false))
    },

    searchGrupos (val) {
      if (this.isLoadingGrupos) return
      this.isLoadingGrupos = true
      return HTTP().get('/grupos').then(({ data }) => {
        this.entriesGrupos = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingGrupos = false))
    },

    searchTags (val) {
      if (this.isLoadingTags) return
      this.isLoadingTags = true
      return HTTP().get('/preciostags').then(({ data }) => {
        this.entriesTags = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTags = false))
    },

    searchMarcasFil (val) {
      if (this.isLoadingMarcasFil) return
      return HTTP().get('/marcasbus').then(({ data }) => {
        this.entriesMarcasFil = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingMarcasFil = false))
    },

    searchGruposFil (val) {
      if (this.isLoadingGruposFil) return
      return HTTP().get('/grupos').then(({ data }) => {
        this.entriesGruposFil = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingGruposFil = false))
    },

    search () {
      this.filtrar()
    }
  },

  mounted () {
    this.dialog = true;
    this.rubItems    = []
    this.marItems    = [{id: 0, nombre: 'Todas'}]
    this.gruItems    = [{id: 0, nombre: 'Todos'}]

    debugger
    return HTTP().get('/preciostags').then(({ data }) => {
      debugger
      for (let i=0; i<=data.length-1; i++) {
        this.tagItems.push(data[i].nombre)
      }
      this.tag = data[0]
      this.tag_id = this.tag ? this.tag.id : null             // ver, puede tener mas rubros
      return HTTP().get('/usersrubros').then(({ data }) => {
        for (let i=0; i<=data.length-1; i++) {
          this.rubItems.push(data[i].rubro)
        }
        this.rubro = this.rubItems[0]
        this.rubro_id = this.rubro ? this.rubro.id : null   // ver, puede tener mas rubros
        return HTTP().get('/marcasbus').then(({ data }) => {
          this.marItems = []
          for (let i=0; i<=data.length-1; i++) {
            this.marItems.push(data[i])
          }
          debugger
          //this.marca = this.marItems[0].id
          return HTTP().get('/gruposrubros/'+this.rubItems[0].id).then(({ data }) => {
            debugger
            let aux = [];
            for(let i in data[0]) {
              aux.push({
                id: Number(data[0][i].id),
                name: data[0][i].nombre,
                activo: data[0][i].activo,
                ctt: data[0][i].ctt,
                padre:  Number(data[0][i].grupo_id),
                state: { disabled: data[0][i].activo===1 ? false : true }
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
            this.filtrar()
          })
        });
      });
    });
  },





  methods: {
  
    closeForm(){
      this.dialog = false;
      router.push('/')
    },




    selectAll(event) {
      if (event.value) {
        this.selected = this.items
      } else {
        this.selected = []
      }
    },



/*
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.desserts.slice()
    },
*/  
    
    
    
/*
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
*/



/*
    seleccionaGrupo(cual, item) {
      this.dialogGru = false
      this.grupoSel_id = item.id
      if (this.cualGrupo==1) {
        this.grupo1Seleccionado = item.name
        this.filtrar()
      } else {
        this.grupo2Seleccionado = item.name
      }
    },
*/

/*
    cargoGrupos(cual) {
      this.cualGrupo = cual
      this.dialogGru = true;
      this.fetchGrupos(this.rubro_id)
    },
*/


    msgRespuesta(op) {

      debugger
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='Aplicar Cambios masivos') {
          let s = this.search ? this.search : 'all'
          let v = this.$store.state.vinculosHijos

          return HTTP().post(`/userarticuloscambiosmasivos`, {
            op: this.opcion,
            rub: this.rubro.id,
            mar: this.marca,
            gru: this.grupo,
            tag: this.tag,
            sel: this.selected,
            newmar: this.marcaSel_id,
            newgru: this.grupoSel_id,
            newtag: this.tagSel_id,
            decimales: this.decimales,
          })
            .then(({ data }) => {
              this.msg.msgTitle = 'Los artículos seleccionados fueron modificados!'
              if (data>0) {
                this.msg.msgBody = data+' registros fueron modificados.'
                if (!this.externo) {
                  this.msg.msgBody += 'Incluyendo los de sus clientes vinculados.'
                }
              } else {
                this.msg.msgBody = 'No se han modificado artículos!.'
              }
              this.msg.msgVisible = true
              this.msg.msgAccion = 'Precios Modificados'
              this.msg.msgButtons = ['Aceptar']
              this.selected = []
            })
        } else if (this.msg.msgAccion=='Precios Modificados') {
          this.msg.msgVisible = false
          this.filtrar()
        }
      } else if (op==='Cancelar') {
      }
      this.msg.msgVisible = false;
    },





    buscarArticulos() {
      this.filtrar()
    },





    setopcion() {
      this.opcion = this.opcion
    },





    filtrar() {

      let grusel = []
      for (let i=0; i<=this.selection.length-1; i++) {
        grusel.push(this.selection[i].id)
      }

      this.selected = []
      this.headers = [
        { text: 'CODIGO', value: 'codigo', width: 110, align: 'left' },
        { text: 'NOMBRE', value: 'nombre', width: 300, align: 'left' },
        { text: 'MARCA',  value: 'nommar', width: 120, align: 'left' },
        { text: 'GRUPO',  value: 'nomgru', width: 120, align: 'left' },
        { text: 'TAGS',   value: 'tags',   width: 230, align: 'left' },
      ]
      let s = this.search ? this.search : 'all'
      let v = this.userId // Solo articulos del usuario actual
      let t = 'campre'

      if (this.marca==undefined) {    // cuando deselecciono las marcas se pone undefined ???
        this.marca = 0
      }

      debugger
      return HTTP().post('/userarticulosprecios', {
        rub: this.rubro.id, mar: this.marca, gru: grusel, vin: v, sea: s, tip: t, pro: 0 }).then(({ data }) => {
        debugger
        this.items = []
        if (data.ar) {
          for (let i=0; i<=data.ar.length-1; i++) {
            this.items.push({ 
              id:     data.ar[i].meta.aid,
              preid:  data.ar[i].id,
              codigo: data.ar[i].codigo,
              nombre: data.ar[i].nombre,
              nomgru: data.ar[i].meta.nomgru,
              nommar: data.ar[i].meta.nommar,
              tags: []
            })
          }
          debugger
          for (let i=0; i<=data.tags.length-1; i++) {
            let pos = this.items.findIndex(x => x.preid === data.tags[i].precio_id)
            if (pos!=-1) {
              this.items[pos].tags.push({ 
                id: data.tags[i].id,
                nombre: data.tags[i].nombre
              })
            }
          }
        }
      })
      .catch(err => {
        console.log(err)
      })
    },
    




    aplicarCambios() {
      this.msg.msgTitle = 'Cambio masivo de datos'
      let msg = ''

      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      if (this.selected.length==1) {
        msg += 'Un artículo sera modificado. ¿Confirma la operación?'
      } else {
        msg += 'Se modificarán '+this.selected.length + ' artículos. ¿Confirma la operación?'
      }
      
      this.msg.msgBody = msg
      this.msg.msgVisible = true
      this.msg.msgAccion = 'Aplicar Cambios masivos'
      this.msg.msgButtons = ['Aceptar','Cancelar']
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




/*
    seleccionoGrupo(item) {
      debugger
      if (item) {
        this.dialogGrupos = false
      }
    },
*/



/*
    fetchGrupos(item) {
      return HTTP().get('/gruposrubros/'+item)
      .then(response => {
        let aux = [];
        for(var i in response.data[0]) {
          aux.push({
            id:     Number(response.data[0][i].id),
            name:   response.data[0][i].nombre,
            porrem: response.data[0][i].porrem == null ? 0 : response.data[0][i].porrem,
            activo: response.data[0][i].activo,
            ctt:    response.data[0][i].ctt,
            padre:  Number(response.data[0][i].grupo_id),
            state:  { disabled: response.data[0][i].activo===1 ? false : true }
          })
        }
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
        this.gruItems = getNestedChildren2(aux,0)
        return
      })
    }
*/
  }
}
/* 606 */
</script>

<style scoped lang="scss">
  .mini-font {
    font-size: 84%;
  }
</style>
