<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        class="elevation-3"
        :footer-props="footerPropsReglas"
        @click:row="clickRow">
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
            <template v-slot:extension>
              <v-btn
                fab
                :color="temas.forms_btn_add_bg"
                :dark="temas.forms_btn_add_dark==true"
                @click="nuevaRegla">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>

            <v-toolbar-title class="body-1 white--text">
              Reglas de Precios
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="1200px">
              <template v-slot:activator="{ on }"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cancelar">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="headdline">{{ formTitle }}</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="cargaOk()"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text" @click="confirmar">
                    Confirmar
                  </v-btn>
                </v-toolbar>

                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6" sm="6" md="6">
                          <v-text-field
                            autofocus
                            ref="descripcion"
                            v-model="editadoRegla.nombre"
                            class="text--left"
                            label="Nombre de la Regla"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" v-if="editedIndex==-1">
                          <v-text-field
                            v-model="editadoRegla.descuento"
                            class="text--left"
                            label="% de desc."
                            :color="temas.forms_titulo_bg"
                            @change="setUndDes('des')">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" v-if="editedIndex==-1">
                          <v-text-field
                            v-model="editadoRegla.cttminima"
                            class="text--left"
                            label="Ctt.Mínima"
                            :color="temas.forms_titulo_bg"
                            @change="setUndDes('ctt')">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            type="date"
                            v-model="editadoRegla.vencimiento"
                            label="Fecha de Vencimiento"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sx="2" mx="2"
                          class="body-2 pt-3 pb-0">
                          <v-switch
                            label="Activa"
                            :color="temas.forms_titulo_bg"
                            v-model="editadoRegla.activo">
                          </v-switch>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12" md="12" class="pb-0 pt-0">
                          <v-textarea
                            v-model="editadoRegla.descripcion"
                            :color="temas.forms_titulo_bg"
                            label="Descripción de la Regla"
                            auto-grow outlined rows="1" row-height="10">
                          </v-textarea>
                        </v-col>
<!--
                        <v-col cols="6" sm="6" md="6" class="pb-0 pt-0">
                          <span>Combina tags de Clientes y Artículos para armar tus reglas de
                            precios. No selecciones ningún tag de Artículos y/o Clientes si quieres
                            incluirlos a todos.<br>El sistema controla que
                            mas de una regla no aplique en la combinación para los mismos Clientes y
                            Artículos.
                          </span>
                        </v-col>
-->
                      </v-row>
                      <v-row>
                        <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                          <v-select
                            v-model="tagsTerValue"
                            :items="tagsTerItems"
                            outlined clearable
                            chips label="Tag Clientes"
                            :menu-props="{closeOnClick: true}"
                            @change="selectTagTer(false)">
                          </v-select>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                          <v-select
                            v-model="tagsArtValue"
                            :items="tagsArtItems"
                            outlined clearable
                            chips label="Tag Artículos"
                            :menu-props="{closeOnClick: true}"
                            @change="selectTagArt(false)">
                          </v-select>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                          <span>
                            Especifica un porcentaje de descuento para cada tope de unidades
                            que desees.
                          </span>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="4" sm="4" md="4" class="pt-0">
                          <v-data-table
                            :headers="headersTerceros"
                            :items="itemsTerceros"
                            dense
                            class="elevation-2"
                            :footer-props="footerProps">
                          </v-data-table>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" class="pt-0">
                          <v-data-table
                            :headers="headersArticulos"
                            :items="itemsArticulos"
                            dense
                            class="elevation-2"
                            :footer-props="footerProps">
                          </v-data-table>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                          <v-data-table
                            :headers="headersUnidades"
                            :items="itemsUnidades"
                            dense
                            class="elevation-2"
                            :footer-props="footerProps">
                            <template v-slot:item.unidades="{ item }">
                              <span>{{ formatoImporte(item.unidades) }}</span>
                            </template>
                            <template v-slot:item.descuento="{ item }">
                              <span>%{{ formatoImporte(item.descuento) }}</span>
                            </template>
                            <template v-slot:item.accion="{ item }">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    class="mr-1" fab x-small
                                    :color="temas.forms_btn_add_bg"
                                    :dark="temas.forms_btn_add_dark==true"
                                    @click="agregarUnidad(item)" v-on="on">
                                    <v-icon dark>mdi-plus</v-icon>
                                  </v-btn>
                                </template>
                                <span>Agregar rango de unidades</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    class="mr-1" fab x-small
                                    :color="temas.forms_btn_editar_bg"
                                    :dark="temas.forms_btn_editar_dark==true"
                                    @click="editarUnidad(item)" v-on="on">
                                    <v-icon dark>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                                <span>Editar Rango</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    class="mr-1" fab x-small
                                    :color="temas.forms_btn_borrar_bg"
                                    :dark="temas.forms_btn_borrar_dark==true"
                                    @click="borrarUnidad(item)" v-on="on">
                                    <v-icon dark>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Borrar Rango</span>
                              </v-tooltip>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>

            <!--// FOTOS // -->
            <v-dialog v-model="dialogFotos" max-width="1250px">
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cerrarFotos">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="headdline">Fotos</span>
                  <v-spacer></v-spacer>
                </v-toolbar>

                <v-form ref="form">
                  <v-card-text>

                    <v-row>
                      <v-col v-if="editedIndex===-1"
                        cols="1" sm="1" md="1">
                        <v-btn v-show="!verCargarFoto"
                          class="mr-2"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          fab
                          x-small
                          @click="cargarFotos(true)">
                          <v-icon>mdi-plus</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col cols="8" sm="8" md="8">
                        <v-file-input
                          v-show="verCargarFoto"
                          filled
                          dense
                          prepend-icon="mdi-camera"
                          v-model="nuevaFoto"
                          :color="temas.forms_titulo_bg">
                          <v-icon>mdi-plus</v-icon>
                        </v-file-input>
                      </v-col>
                      <v-col cols="3" sm="3" md="3">
                        <v-btn
                          v-show="verCargarFoto"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="ma-2 white--text"
                          x-small
                          fab
                          @click="cargarFotos(false)">
                          <v-icon dense dark>mdi-window-close</v-icon>
                        </v-btn>
                        <v-btn v-show="verCargarFoto && nuevaFoto"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="ma-2 white--text"
                          x-small
                          fab
                          @click="agregarFoto(item)">
                          <v-icon dense dark>mdi-content-save</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-container fluid>
                      <v-row justify="space-around">
                        <v-col cols="2" sm="2" md="2"
                          v-for="(foto) in fotos" :key="foto.id">
                          <img :src="'/images/' + foto.foto" alt="" width="150px" height="100px" />
                          <v-btn
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            icon @click="borrarFoto(foto.id)">
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE FOTOS -->

            <!--// UNIDADES // -->
            <v-dialog v-model="dialogUnidad" max-width="450px">
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true"
                    icon @click="dialogUnidad=false">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="headdline">Unidades y Descuentos</span>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="cargaUnidadesOk()"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text" @click="guardarUnidades">
                    Guardar
                  </v-btn>
                </v-toolbar>

                <v-form ref="form">
                  <v-card-text>
                    <v-row>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field
                          v-model="editadoUnidad.unidades"
                          class="text--left"
                          label="Unidades"
                          :color="temas.forms_titulo_bg">
                        </v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field
                          v-model="editadoUnidad.descuento"
                          class="text--left"
                          label="% de Desc."
                          :color="temas.forms_titulo_bg">
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE UNIDADES -->

          </v-toolbar>
          <v-col cols="12" sm="12">  <!-- Barra de búsqueda  -->
            <v-text-field
              v-model="search"
              append-icon="search"
              label="Buscar"
              :color="temas.forms_titulo_bg"
              single-line hide-details>
            </v-text-field>
          </v-col>
        </template>

        <template v-slot:item.vencimiento="{ item }">
          <span>{{ formatoFecha(item.vencimiento) }}</span>
        </template>
        <template v-slot:item.descuento="{ item }">
          <span>%{{ formatoImporte(item.descuento) }}</span>
        </template>
        <template v-slot:item.activo="{ item }">
          <v-chip :color="getColor(item.activo)">{{ item.activo ? 'Sí' : 'No' }}</v-chip>
        </template>
        <template v-slot:item.estado="{ item }">
          <v-chip
            class="caption" :color="getEstado(item.estado,'c')">
            {{ getEstado(item.estado,'e') }}
          </v-chip>
        </template>

        <template v-slot:item.accion="{ item }">

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2" fab x-small
                :color="temas.forms_btn_editar_bg"
                :dark="temas.forms_btn_editar_dark==true"
                @click="editar(item)" v-on="on">
                <v-icon dark>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Editar</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2" fab x-small
                :color="temas.forms_btn_borrar_bg"
                :dark="temas.forms_btn_borrar_dark==true"
                @click="preguntoBorrar(item)" v-on="on">
                <v-icon dark>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Borrar Regla</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2" fab x-small
                :color="temas.forms_btn_editar_bg"
                :dark="temas.forms_btn_editar_dark==true"
                @click="verFotos(item)" v-on="on">
                <v-icon dark>mdi-image</v-icon>
              </v-btn>
            </template>
            <span>Fotos</span>
          </v-tooltip>

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

/* https://medium.com/js-dojo/how-to-build-a-reusable-vuejs-modal-component-fc8d7f3b4735 */

/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';
import SBar from './Forms/snackbar.vue';
import Confirmacion from './Forms/confirmacion.vue';

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    modelo: 'reglas',
    reglasArmadas: [],
    dialogFotos: false,
    itemActual: null,
    fotos: [],
    nuevaFoto: '',
    verCargarFoto: false,
    tagsTerValue: [],
    tagsTerItems: [],
    tagsTerObj: [],
    tagsArtValue: [],
    tagsArtItems: [],
    tagsArtObj: [],
    itemsArticulos: [],
    itemsTerceros: [],
    itemsUnidades: [],
    origArticulos: [],
    origTerceros: [],
    tagTer: '',
    tagArt: '',
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    codigoRules: [
      (v) => !!v || 'El código es requerido',
      (v) => v.length <= 3 || 'Ingrese hasta 3 caracteres'
    ],      
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 80 || 'Ingrese hasta 80 caracteres'
    ],
    footerProps: {'items-per-page-options': [4]},
    footerPropsReglas: {'items-per-page-options': [10]},
    search: '',
    dialog: false,
    dialogUnidad: false,
    items: [],
    editadoRegla: {
      nombre: '',
      descripcion: '',
      descuento: '',
      cttminima: '',
      vencimiento: '',
      tagsart: '',
      tagster: '',
      activo: '',
    },
    editadoDefaultRegla: {
      nombre: '',
      descripcion: '',
      descuento: '',
      cttminima: '',
      vencimiento: '',
      tagsart: '',
      tagster: '',
      activo: '',
    },
    editadoUnidad: {id:'',unidades:'',descuento:''},
    editadoDefaultUnidad: {id:'',unidades:'',descuento:''},
    headers: [
      { text: 'Id', value:'id', width: 70, align: 'right'},
      { text: 'Nombre', value:'nombre', width: 450, align: 'left'},
//    { text: 'Descuento', value:'descuento', width: 30, align: 'right'},
//    { text: 'Ctt.Mínima', value:'cttminima', width: 30, align: 'right'},
      { text: 'Vencimiento', value:'vencimiento', width: 90, align: 'left'},
      { text: 'Activo', value:'activo', width: 60},
      { text: 'ACCIONES', value:'accion', width: 150, sortable: false },
    ],
    headersTerceros: [
      { text: 'Código', value:'codigo', width: 100, align: 'right'},
      { text: 'Nombre', value:'nombre', width: 250, align: 'left'},
    ],
    headersArticulos: [
      { text: 'Código', value:'codigo', width: 100, align: 'left'},
      { text: 'Nombre', value:'nombre', width: 260, align: 'left'},
    ],
    headersUnidades: [
      { text: 'Un.Mínimas', value:'unidades', width: 55, align: 'right'},
      { text: '%Desc.', value:'descuento', width: 55, align: 'right'},
      { text: 'ACCIONES', value:'accion', width: 120, sortable: false },
    ],
    editedIndex: -1,
    editedIndexUnidad: -1,
    conflictos: [],
    conflicto: true,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState(['temas']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva Regla' : 'Editar Regla';
    },
  },
  watch: {
    dialog (val) {
      val || this.cancelar();
    },
  },
  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      this.tagsTerValue = []
      this.tagsTerItems = []
      this.tagsTerObj = []
      this.tagsArtValue = []
      this.tagsArtItems = []
      this.tagsArtObj = []
      return HTTP().get('/tagsterceros').then(({ data }) => {
        data.forEach(el => { this.tagsTerItems.push(el.nombre) });
        data.forEach(el => { this.tagsTerObj.push(el)});
        return HTTP().get('/preciostags').then(({ data }) => {
          data.forEach(el => {
            this.tagsArtItems.push(el.nombre)
            this.tagsArtObj.push(el)
          })
          return this.listarHTTP()
        })
      })
    }
  },

  
  methods: {
   ...mapMutations(['alert','closeAlert']),
   closeForm(){
     router.push('/')
    },


    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
          this.borrarHTTP(this.itemActual)
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


    listarHTTP:function() {
      return HTTP().get('/'+this.modelo+'/'+this.userId+'/0').then(({ data }) => {
        this.items = data.reglas;
        this.reglasArmadas = data.reglasArmadas;
      });
    },


    editar (item) {
      this.itemActual = item
      this.editedIndex = this.items.indexOf(item);
      this.editadoRegla.nombre = item.nombre;
      this.editadoRegla.descripcion = item.descripcion;
      this.editadoRegla.descuento = this.roundTo(item.descuento,2);
      this.editadoRegla.cttminima = item.cttminima;
      this.editadoRegla.vencimiento = item.vencimiento.substr(0,10);
      this.editadoRegla.activo = item.activo;
      this.editadoRegla.tagsart = item.tagspre;
      this.editadoRegla.tagster = item.tagster;

      this.dialog = true;
      this.itemsTerceros = []
      this.itemsArticulos = []
      this.tagsTerValue = []
      this.tagsArtValue = []
      this.itemsUnidades = item.unidades;

      let tmpArt = item.tagspre.split('|');
      let tmpTer = item.tagster.split('|');

      for (let i=0; i<=tmpArt.length-1; i++) {
        if (tmpArt[i]!='') {
          let pos = this.tagsArtObj.findIndex(x => x.id == tmpArt[i])
          if (pos!=-1) {
            this.tagsArtValue = this.tagsArtObj[pos].nombre
          }
        }
      }
      for (let i=0; i<=tmpTer.length-1; i++) {
        if (tmpTer[i]!='') {
          let pos = this.tagsTerObj.findIndex(x => x.id == tmpTer[i])
          if (pos!=-1) {
            this.tagsTerValue = this.tagsTerObj[pos].nombre
          }
        }
      }

      let pos = this.reglasArmadas.findIndex(x=>x.regla==this.itemActual.id)
      this.itemsArticulos = this.reglasArmadas[pos].pre
      this.origArticulos = this.reglasArmadas[pos].pre
      this.itemsTerceros = this.reglasArmadas[pos].ter
      this.origTerceros = this.reglasArmadas[pos].ter

      this.conflicto = false
      
//    this.selectTagTer(true)
//    this.selectTagArt(true)

      /*
      this.itemsArticulos = []
      let xxx = this.items
      let tmp = []
      for (let i=0; i<=this.reglasArmadas[pos].pre.length-1; i++) {
        let pox = tmp.findIndex(x=>x.codigo == this.reglasArmadas[pos].pre[i].codigo)
        if (pox==-1) {
          tmp.push({
            codigo: this.reglasArmadas[pos].pre[i].codigo,
            nombre: this.reglasArmadas[pos].pre[i].nombre,
            tags: []
          })
          tmp[tmp.length-1].tags.push(this.reglasArmadas[pos].pre[i].tag_id)
        } else {
          tmp[pox].tags.push(this.reglasArmadas[pos].pre[i].tag_id)
        }
      }
      for (let i=0; i<=tmp.length-1; i++) {
        let encontrados = 0
        for (let j=0; j<=tmpArt.length-1; j++) {
          for (let k=0; k<=tmp[i].tags.length-1; k++) {
            if (tmpArt[j]==tmp[i].tags[k]) { encontrados ++ }
          }
        }
        if (encontrados == tmpArt.length) { // estan todos
          this.itemsArticulos.push({
            codigo: tmp[i].codigo,
            nombre: tmp[i].nombre,
          })
        }
      }
      */


      /*
      let res = []
      for (let i=0; i<=this.itemsArticulos.length-1; i++) {

        let pos = res.findIndex(x=>x.codigo == this.itemsArticulos[i].codigo)
        if (pos==-1) {
          res.push({
            codigo: this.itemsArticulos[i].codigo,
            nombre: this.itemsArticulos[i].nombre,
            articulo_id: this.itemsArticulos[i].articulo_id,
            tags: this.itemsArticulos[i].tags
          })
        } else {
          for (let j=0; j<=this.itemsArticulos[i].tags.length-1; j++) {
            let pox = res[pos].tags.findIndex(x=>x==this.itemsArticulos[i].tags[j])
            if (pox==-1) {
              res[pos].tags.push(this.itemsArticulos[i].tags[j])
            }
          }
        }
      }
      this.itemsArticulos = []
      for (let i=0; i<=res.length-1; i++) {
          this.itemsArticulos.push({
            codigo: res[i].codigo,
            nombre: res[i].nombre,
          })
      }
      this.origArticulos = this.itemsArticulos
      */

      /*
      return HTTP().post('/tercerostags', { tags: tmpTer }).then(({ data }) => {
        for (let i=0; i<=data.length-1; i++) {
          this.itemsTerceros.push({
            codigo: data[i].usertercero.id,
            nombre: data[i].usertercero.tercero.nombre,
            user_id: data[i].usertercero.tercero.user!=null ? data[i].usertercero.tercero.user.id: null,
          })
        }
        
        return HTTP().post('/preciostags', { tags: tmpArt }).then(({ data }) => {
          for (let i=0; i<=data.length-1; i++) {
            this.itemsArticulos.push({
              codigo: data[i].precio.articulo.codigo,
              nombre: data[i].precio.articulo.nombre,
              articulo_id: data[i].precio.articulo_id,
              tags: [ data[i].tag_id.toString() ]
            })
          }


          // aca tengo que buscar los que los tags definidos en la regla esten
          // tambien asignados en cada articulo, LOS MISMOS TAGS, ES DECIR, ES AND NO OR.
          let p1 = null
          let p2 = null
          let res = []
          if (data.length) {
            for (let i=0; i<=data.length-1; i++) {
              p1 = data[i].precio_id
              if (p1!=p2 || p2==null) {
                res.push({
                  codigo: data[i].precio.articulo.codigo,
                  nombre: data[i].precio.articulo.nombre,
                  articulo_id: data[i].precio.articulo_id,
                  tags: [ data[i].tag_id.toString() ]
                })
              } else {
                res[res.length-1].tags.push( data[i].tag_id.toString() )
              }
              p2 = data[i].precio_id
            }
          }
          for (let i=0; i<=res.length-1; i++) {
            let iguales = JSON.stringify(res[i].tags) === JSON.stringify(tmpArt);
            if (iguales) {
              this.itemsArticulos.push({
                codigo: res[i].codigo,
                nombre: res[i].nombre,
                articulo_id: res[i].articulo_id
              })
            }
          }
        });
      });
      */
    },

    nuevaRegla() {
      this.editedIndex = -1;
      this.dialog = true;
      this.editadoRegla = Object.assign({}, this.editadoDefaultRegla);
      this.tagsTerValue = []
      this.tagsArtValue = []
      this.itemsArticulos = []
      this.itemsTerceros = []
      this.itemsUnidades = [{
        id: 0,
        unidades: 1,
        descuento: 0,
      }]
      this.conflicto = false
      this.checkRegla(false)
    },

    altaHTTP:function() {
      return HTTP().post('/'+this.modelo, {
        nombre:      this.editadoRegla.nombre,
        descripcion: this.editadoRegla.descripcion,
        descuento:   this.editadoRegla.descuento,
        cttminima:   this.editadoRegla.cttminima,
        vencimiento: moment(this.editadoRegla.vencimiento).format('YYYY-MM-DD'),
        tagsart:     this.editadoRegla.tagsart,
        tagster:     this.editadoRegla.tagster,
        unidades:    this.itemsUnidades,
        activo:      false,
        }).then(({ data }) => {
          if (data=='error') {
            this.mensaje('¡Se ha producido un error al crear la regla!', 'black', 1500) 
          } else {
            this.mensaje('¡La regla se ha creado con éxito!', 'black', 1500) 
          }
          this.listarHTTP();
        });
    },

    editarHTTP:function(data) {
      data.unidades = this.itemsUnidades;
      return HTTP().patch(`${this.modelo}/${this.itemActual.id}`, data).then((data) => {
        if (data=='error') {
          this.mensaje('¡Se ha producido un error al actualizar la regla!', 'black', 1500) 
        } else {
          this.mensaje('¡Actualización Exitosa!', 'black', 1500) 
        }
        this.listarHTTP();
      });       
    },

    borrarHTTP:function(data) {
      return HTTP().delete(`/${this.modelo}/${data.id}`).then(() => {
        this.listarHTTP();
      });
    },

    preguntoBorrar (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+item.nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },

    agregarUnidad() {
      this.editedIndexUnidad = -1;
      this.dialogUnidad = true;
      this.editadoUnidad = Object.assign({}, this.editadoDefaultUnidad);
    },

    editarUnidad(item) {
      this.editedIndexUnidad = this.itemsUnidades.indexOf(item);
      this.dialogUnidad = true;
      this.editadoUnidad.unidades = this.itemsUnidades[this.editedIndexUnidad].unidades
      this.editadoUnidad.descuento = this.itemsUnidades[this.editedIndexUnidad].descuento
    },

    guardarUnidades() {
      if (this.editedIndexUnidad == -1) {
        this.itemsUnidades.push({
          id: null,
          unidades: this.editadoUnidad.unidades,
          descuento: this.editadoUnidad.descuento,
        })
      } else {
        this.itemsUnidades[this.editedIndexUnidad].unidades = this.editadoUnidad.unidades
        this.itemsUnidades[this.editedIndexUnidad].descuento = this.editadoUnidad.descuento
      }
      this.dialogUnidad = false
    },

    borrarUnidad(item) {
      this.editedIndexUnidad = this.itemsUnidades.indexOf(item);
      this.itemsUnidades = this.itemsUnidades.filter(x=>x.id!=this.itemsUnidades[this.editedIndexUnidad].id)
    },

    verFotos (item) {
      this.itemActual = item
      this.dialogFotos = true
      this.fotos = []
      return HTTP().get('/reglacargarfotos/'+item.id)
        .then(({ data }) => {
          for (let i=0; i<=data[0].fotos.length-1; i++) {
            this.fotos.push( {id: data[0].fotos[i].id, foto: data[0].fotos[i].foto} )
          }
      });
    },

    cargarFotos(sino) {
      this.verCargarFoto = sino;
    },

    cerrarFotos() {
      this.dialogFotos = false;
    },

    agregarFoto() {
      return HTTP().post('/reglaagregarfoto', { regla_id: this.itemActual.id, foto: this.nuevaFoto.name }).then(({ data }) => {
        this.fotos.push({regla_id: this.editadoRegla.id, foto: this.nuevaFoto.name})
        this.listarHTTP();
        this.verCargarFoto = false
      });
    },

    borrarFoto(id) {
      return HTTP().delete(`/reglaborrarfoto/${id}`).then(() => {
        let pos = 0
        for (let i=0; i<=this.fotos.length-1; i++) {
          if (this.fotos[i].id == id) {
            pos = i
            break
          }
        }
        this.fotos.splice(pos, 1)
        this.verCargarFoto = false
      });
    },

    confirmar() {

      let tmpTer = ''
      let pos = this.tagsTerObj.findIndex(x => x.nombre == this.tagsTerValue)
      if (pos!=-1) {
        tmpTer += this.tagsTerObj[pos].id
      }
      this.editadoRegla.tagster = tmpTer

      let tmpArt = ''
      pos = this.tagsArtObj.findIndex(x => x.nombre == this.tagsArtValue)
      if (pos!=-1) {
        tmpArt += this.tagsArtObj[pos].id
      }
      this.editadoRegla.tagsart = tmpArt

      // NO SE PUEDE CREAR UNA REGLA GLOBAL SI HAY OTRAS ACTIVAS
      let activas = 0
      for (let i=0; i<=this.items.length-1; i++) {
        if (this.items[i].activo) {
          activas ++
        }
      }
      if (tmpTer==''&&tmpArt==''&&activas>0) {
        this.msg.msgTitle = 'Error'
        let txt = 'No se puede generar una regla global si hay otras reglas activas.<br>'
        txt += 'Esto generará conflictos al momento de buscar descuentos.<br>'
        txt += 'Deberá desactivar el resto de las reglas si quiere aplicar una regla global.<br>'
        this.msg.msgBody = txt
        this.msg.msgVisible = true
        this.msg.msgAccion = 'regla global'
        this.msg.msgButtons = ['Aceptar']
      } else {
        if (!this.$refs.form.validate()) {
          this.mensaje('¡Debe completar todos los datos!', 'red', 1500) 
          return this.dialog = true;
        }
        if (this.editedIndex > -1) { // esta modificando
          this.editarHTTP(this.editadoRegla);
        } else {
          this.altaHTTP();
          this.mensaje('¡Alta Exitosa!', 'blue', 1500) 
        }
        this.cancelar();
      }

    },

    borrar (item) {
      const index = this.items.indexOf(item);
      var r = confirm('¿Está seguro de borrar el registro?');
      if (r === true) {
        this.borrarHttp(this.items[index].id);
        this.snackbar = true;
        this.textSnack = 'Se eliminó el registro.';
      } else {
        this.snackbar = true;
        this.textSnack = 'Operación cancelada.';
      }
    },

    cancelar() {
      this.dialog = false;
      this.editadoRegla = Object.assign({}, this.editadoDefaultRegla);
      this.editedIndex = -1;
    },


    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },

    formatoFecha(value) {
      return moment(String(value)).format('L')
    },

    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },

    getEstado (estado, accion) {
      let c = ''
      let e = ''
      if (estado==='A') {
        e = 'Activa'
        c = 'light-green accent-1'
      } else if (estado==='P') {
        e = 'Inactiva'
        c = 'red lighten-3'
      }
      if (accion==='c') {
        return c
      } else {
        return e
      }
    },

    selectTagTer(cargaOriginales) {
      let pos = this.tagsTerObj.findIndex(x => x.nombre == this.tagsTerValue)
      this.tagTer = this.tagsTerObj[pos].id
      this.itemsTerceros = []
      return HTTP().post('/tercerostags', { tag: this.tagTer }).then(({ data }) => {
        if (data.length==0) {
          this.msg.msgTitle = 'Error'
          this.msg.msgBody = '¡Este tag no referencia a ningun cliente!'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'ningun cliente'
          this.msg.msgButtons = ['Aceptar']
        } else {
          for (let i=0; i<=data.length-1; i++) {
            this.itemsTerceros.push({
              codigo: data[i].usertercero.id,
              nombre: data[i].usertercero.tercero.nombre,
              tags: [ data[i].tag_id.toString() ]
            })
          }
          if (cargaOriginales) {
            this.origTerceros = this.itemsTerceros
          }
          this.checkRegla(true)
        }
      })
    },

    selectTagArt(cargaOriginales) {
      let pos = this.tagsArtObj.findIndex(x => x.nombre == this.tagsArtValue)
      this.tagArt = this.tagsArtObj[pos].id
      this.itemsArticulos = []
      return HTTP().post('/preciostags', { tag: this.tagArt }).then(({ data }) => {
        if (data.length==0) {
          this.msg.msgTitle = 'Error'
          this.msg.msgBody = '¡Este tag no referencia a ningun artículo!'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'ningun cliente'
          this.msg.msgButtons = ['Aceptar']
        } else {
          for (let i=0; i<=data.length-1; i++) {
            this.itemsArticulos.push({
              codigo: data[i].precio.articulo.codigo,
              nombre: data[i].precio.articulo.nombre,
              articulo_id: data[i].precio.articulo_id,
              tags: [ data[i].tag_id.toString() ]
            })
          }
          if (cargaOriginales) {
            this.origArticulos = this.itemsArticulos
          }
          this.checkRegla(true)
        }
      })

/*      
        } else {            // ESTA MODIFICANDO UNA REGLA EXISTENTE, LEVANTO ARTICULOS DE LOS TAGS DE LA REGLA
          
          for (let i=0; i<=data.reglasArmadas[0].pre.length-1; i++) {
            tmp.push({
              codigo: data.reglasArmadas[0].pre[i].codigo,
              nombre: data.reglasArmadas[0].pre[i].nombre,
              tags: data.reglasArmadas[0].pre[i].tags
            })
          }
          for (let i=0; i<=tmp.length-1; i++) {
            let encontrados = 0
            for (let j=0; j<=tmpArt.length-1; j++) {
              for (let k=0; k<=tmp[i].tags.length-1; k++) {
                if (tmpArt[j]==tmp[i].tags[k]) { encontrados ++ }
              }
            }
            if (encontrados == tmpArt.length) { // estan todos
              this.itemsArticulos.push({
                codigo: tmp[i].codigo,
                nombre: tmp[i].nombre,
              })
            }
          }
        }

        if (cargaOriginales) {
          this.origArticulos = this.itemsArticulos
        }
        this.checkRegla('pre')
*/
    },

    checkRegla(mensaje) {
      // no se tienen que repetir el mismo cliente para el mismo articulo y
      // tampoco el mismo articulo para el mismo cliente.
      // Los taghs en blanco incluyen a todos los clientes y/o todos los articulos

      // NUEVO TAG/S PARA ARTICULOS
      // 1) Veo que articulos se incluyen con el o los nuevos tags
      // 2) Tomo una foto de los clientes que estan en la regla
      // 3) Busco si los nuevos articulos estan en las otras reglas para al menos un mismo cliente.
      // 4) Si esto da verdadero HAY CONFLICTO!
      // PARA LOS CLIENTES ES IGUAL

//      let diff = [];


      debugger
      let a = this.tagTer
      let b = this.tagArt
      let c = this.items

      this.conflicto = false
      let preInc = []
      let terInc = [];
      this.conflictos = []
      let reglasTer = []
      let reglasPre = []
//      let estaEnTer = false
//      let estaEnPre = false
//      let errorEnTer = false
//      let errorEnPre = false

      // primero leo en que reglas esta en tag PRE
      // cargo en terInc los articulos involucrados
      this.itemsArticulos.forEach( i => {
        let existe= false;
        this.origArticulos.forEach(j => {
          if (i.codigo==j.codigo) { existe = true }
        })
        if (existe) preInc.push(i);
      });
      // cargo en preInc los clientes involucrados
      this.itemsTerceros.forEach( i => {
        let existe= false;
        this.origTerceros.forEach(j => {
          if (i.codigo==j.codigo) { existe = true }
        })
        if (existe) terInc.push(i);
      });

      // Ahora leo en que reglas esta el tag TER
      // Si en alguno de los dos estan las mismas reglas hay conflico.
      for (let i=0; i<=this.reglasArmadas.length-1; i++) {

        // LEO LA REGLA. no la actual, si this.itemActual.id es null las leo a todas
        if (this.itemActual==null || this.reglasArmadas[i].regla!=this.itemActual.id) {  

          // busco en reglasArmadas.pre
          if (this.itemsArticulos.length==0) {
            reglasPre.push(this.reglasArmadas[i].regla)
          } else {
            for (let j=0; j<=this.itemsArticulos.length-1; j++) {
              let pos = this.reglasArmadas[i].pre.findIndex(x=>x.codigo==this.itemsArticulos[j].codigo)
              if (pos!=-1 || this.reglasArmadas[i].pre.length==0) {
                reglasPre.push(this.reglasArmadas[i].regla)
              }
            }
          }

          // busco en reglasArmadas.ter
          if (this.itemsTerceros.length==0) {
            reglasTer.push(this.reglasArmadas[i].regla)
          } else {
            for (let j=0; j<=this.itemsTerceros.length-1; j++) {
              let pos = this.reglasArmadas[i].ter.findIndex(x=>x.codigo==this.itemsTerceros[j].codigo)
              if (pos!=-1 || this.reglasArmadas[i].ter.length==0) {
                reglasTer.push(this.reglasArmadas[i].regla)
              }
            }
          }
        }
      }

      // Ahora reviso si en reglasTer y reglasPre estan las mismas reglas, si es asi, hay conflicto!
      if (reglasTer.length==0 && reglasPre.length==0) return  // esta ok
      // filtro
      let coi = reglasTer.filter( function (ter) {
        return reglasPre.includes(ter)
      });

      if (coi.length==0) { return }

      this.conflicto = true

      if (mensaje) {
        this.msg.msgTitle = 'Hay conflictos con otras Reglas'
        let txt = ''
        for (let i=0; i<=coi.length-1; i++) {
          txt += 'Regla '+coi[i]+' ,'
        }
        txt.substring(0, txt.length - 1)
        this.msg.msgBody = txt
        this.msg.msgVisible = true
        this.msg.msgAccion = 'conflicto'
        this.msg.msgButtons = ['Aceptar']
      }  
      /*
      
      if (cualCambio=='pre') {    // cambio el panel de articulos
        //fotoTerceros = this.itemsTerceros   // tengo que busarlos en las otras reglas a ver si estan
        this.itemsArticulos.forEach( i => {
          let existe= false;
          this.origArticulos.forEach(j => {
            if (i.codigo==j.codigo) { existe = true }
          })
          if (!existe) diff.push(i);
        });

        // Recorro LAS OTRAS reglas para ver si hay conflictos
        for (let i=0; i<=this.reglasArmadas.length-1; i++) {

          let pasa = this.itemActual==null || this.reglasArmadas[i].regla!=this.itemActual.id
          estaEnPre = false
          if (pasa) {  // no leo la regla actual, si es null es ALTA
            for (let j=0; j<=diff.length-1; j++) {
              let pos = this.reglasArmadas[i].pre.findIndex(x=>x.codigo==diff[j].codigo)
              if (pos!=-1) {
                estaEnPre = true
                this.conflictos.push('El artículo <b>'+diff[j].codigo+' '+diff[j].nombre+' </b>se repite en las siguientes reglas:')
                break
              }
            }
            if (estaEnPre) { // esta en Pre, ahora busco si tambien esta en Ter
              // reviso que onda con los terceros
              // si la regla actual es para todos y hay conflicto en articulos HAY CONFLICTO
              if (this.itemsTerceros.length==0) { // si la regla actual es para todos HAY CONFLICO GENERAL
                this.conflictos.push('La regla para artículos '+this.reglasArmadas[i].id+' </b> es global, hay conflicto')
                estaEnTer = true
                break
              } else {
                for (let j=0; j<=this.reglasArmadas.length-1; j++) {

                  pasa = this.itemActual==null || this.reglasArmadas[i].regla!=this.itemActual.id
                  if (pasa) {  // no leo la regla actual
                    if (this.reglasArmadas[j].ter.length==0) {            // otra regla es para todos los terceros
                      estaEnTer = true
                      break
                    } else {
                      for (let k=0; k<=this.reglasArmadas[j].ter.length-1; k++) {
                        let pos = this.itemsTerceros.findIndex(x=>x.codigo==this.reglasArmadas[j].ter[k].codigo)
                        if (pos!=-1) {
                          this.conflictos.push('Regla '+this.reglasArmadas[i].regla+ ' - Cliente '+this.itemsTerceros[pos].nombre)
                          estaEnTer = true
                          break
                        }
                      }
                      if (conflictoTer) {
                        break
                      }
                    }
                  }
                }
              }
            }
          }
        }

      } else {    // cambio el panel de clientes

        //fotoTerceros = this.itemsTerceros   // tengo que busarlos en las otras reglas a ver si estan
        this.itemsTerceros.forEach( i => {
          let existe= false;
          this.origTerceros.forEach(j => {
            if (i.codigo==j.codigo) { existe = true }
          })
          if (!existe) diff.push(i);
        });

        if (diff.length) {        // hay diferencias entre los tags de terceros

          // Recorro LAS OTRAS reglas para ver si hay conflictos
          for (let i=0; i<=this.reglasArmadas.length-1; i++) {
            let itemActual = this.itemActual!=null ? this.itemActual.id : null
            if (this.reglasArmadas[i].regla!=itemActual) {  // no leo la regla actual
              for (let j=0; j<=diff.length-1; j++) {
                let pos = this.reglasArmadas[i].ter.findIndex(x=>x.codigo==diff[j].codigo)
                if (pos!=-1) {
                  conflictoTer = true
                  this.conflictos.push('Regla '+ this.reglasArmadas[i].regla+' - Artículo '+this.items[i].nombre)
//                break
                }
              }
              if (conflictoTer) { // hay conflicoTer, ahora busco si tambien hay conflicoPre
                // reviso que onda con los articulos
                // si la regla actual es para todos y hay conflicto en terceros HAY CONFLICTO
                if (this.itemsArticulos.length==0) { // si la regla actual es para todos HAY CONFLICO GENERAL
                  conflictoPre = true
                  break
                } else {
                  for (let j=0; j<=this.reglasArmadas.length-1; j++) {
                    if (this.reglasArmadas[j].regla!=this.itemActual.id) {  // no leo la regla actual
                      if (this.reglasArmadas[j].pre.length==0) {            // otra regla es para todos los terceros
                        conflictoPre = true
                        break
                      } else {
                        for (let k=0; k<=this.reglasArmadas[j].pre.length-1; k++) {
                          let pos = this.itemsArticulos.findIndex(x=>x.codigo==this.reglasArmadas[j].pre[k].codigo)
                          if (pos!=-1) {
                            this.conflictos.push('Regla '+this.reglasArmadas[i].regla+ ' - Artículo '+this.itemsArticulos[pos].nombre)
                            conflictoPre = true
                            break
                          }
                        }
                        if (conflictoPre) {
                          break
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (conflictoPre && conflictoTer) {
        this.msg.msgTitle = 'Pueden haber conflictos con otras Reglas'
        let txt = ''
        for (let i=0; i<=this.conflictos.length-1; i++) {
          txt += this.conflictos[i]+'<br>'
        }
        this.msg.msgBody = txt
        this.msg.msgVisible = true
        this.msg.msgAccion = 'conflicto'
        this.msg.msgButtons = ['Aceptar']
      }
      */
    },


    setUndDes(cual) {
      if (this.editedIndex==-1) {
        if (cual=='ctt') {
          this.itemsUnidades[0].unidades = this.editadoRegla.cttminima
        } else if (cual=='des') {
          this.itemsUnidades[0].descuento = this.editadoRegla.descuento
        }
      }
    },

    cargaOk() {
      let ok = true
      if (this.editadoRegla.nombre=='' || this.editadoRegla.descuento=='' || this.editadoRegla.cttminima=='' ||
        this.editadoRegla.vencimiento=='' || this.conflicto) {
        ok = false
      }
      return ok
    },

    cargaUnidadesOk() {
      let ok = true
      if (this.editadoUnidad.unidades=='' || this.editadoUnidad.descuento=='') {
        ok = false
      }
      return ok
    },

    clickRow(value) {
      if (!this.msg.msgVisible && !this.dialogFotos) {
        this.itemActual = value
        this.editar(this.itemActual)
      }
    },

    removeTagTer(item) {
      this.tagsTerValue.splice(this.tagsTerValue.indexOf(item), 1);
      this.tagsTerValue = [...this.tagsTerValue];
      this.selectTagTer()
    },

    removeTagArt(item) {
      this.tagsArtValue.splice(this.tagsArtValue.indexOf(item), 1);
      this.tagsArtValue = [...this.tagsArtValue];
      this.selectTagArt()
    },

  },

};
</script>
