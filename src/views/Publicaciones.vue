<template>
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
            <v-btn
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true"
              icon @click="closeForm">
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
                    @click="nuevapublicacion" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Nueva Publicación</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_dark==true"
                    class="mr-2"
                    @click="activarpausartodas('P')" v-on="on">
                    <v-icon>mdi-earth</v-icon>
                  </v-btn>
                </template>
                <span>Activar todas las publicaciones</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_dark==true"
                    class="mr-2"
                    @click="activarpausartodas('U')" v-on="on">
                    <v-icon>mdi-earth-off</v-icon>
                  </v-btn>
                </template>
                <span>Pausar todas las publicaciones</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_dark==true"
                    class="mr-2"
                    @click="activarpausartodas('I')" v-on="on">
                    <v-icon>mdi-sunglasses</v-icon>
                  </v-btn>
                </template>
                <span>Ocultar todas las publicaciones</span>
              </v-tooltip>

            </template>

            <v-toolbar-title class="body-1 white--text">Publicación de Artículos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="900px">
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
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text" @click="publicar">
                    Publicar
                  </v-btn>
                </v-toolbar>

                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row v-if="editedIndex==-1">
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field
                            ref="buscarx"
                            label="código o descripción o código de barra"
                            :color="temas.forms_titulo_bg"
                            :autofocus="editedIndex==-1"
                            v-model="busArt"
                            @blur="buscarArt(false)">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row v-else>
                        <v-col cols="8" sm="8" md="8">
                          <v-text-field
                            label="Artículo"
                            disabled
                            v-model="editadoArt.nombre">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4">
                          <v-select
                            v-model="editadoPub.prioridad"
                            :items="prioridades"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            item-value="id"
                            item-text="nombre"
                            label="Prioridad">
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row  v-show="editedIndex==-1">
                        <v-col v-show="seleccionarArticulo==true"
                          cols="12" sm="12" md="12">
                          <v-data-table
                            :headers="headersSelArticulos"
                            :items="selArt" dense
                            class="elevation-3"
                            @click:row="selArtClick"
                            hide-default-footer>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <v-row  v-show="editedIndex==-1">
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled
                            class="caption"
                            label="codigo"
                            v-model="editadoArt.codigo">
                          </v-text-field>
                        </v-col>
                        <v-col cols="8" sm="8" md="8">
                          <v-text-field
                            disabled
                            class="caption"
                            label="Descripción"
                            v-model="editadoArt.nombre">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled
                            :focused="false"
                            class="caption"
                            label="Cod.Barrra"
                            v-model="editadoArt.codbar">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <v-row v-show="editedIndex==-1 && seleccionarArticulo==false">
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            label="Unidad"
                            disabled class="caption"
                            v-model="editadoArt.unidadNombre">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            label="Moneda"
                            disabled class="caption"
                            v-model="editadoArt.monedaNombre">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            label="IVA"
                            disabled class="caption"
                            v-model="editadoArt.ivaTasa">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            type="date"
                            v-model="editadoPub.vencimiento"
                            label="Fecha de Vencimiento"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row v-show="seleccionarArticulo == false">
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            ref='cantidad'
                            :autofocus="editedIndex>=0"
                            v-model="editadoPub.unidades"
                            class="text--left"
                            label="Cantidad a Publicar"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            v-model="editadoPub.preciooriginal"
                            disabled
                            label="Costo (Sin IVA)">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-model="editadoPub.tasadescuento"
                            label="%Descuento"
                            :color="temas.forms_titulo_bg"
                            @change="desporItem()">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-model="editadoPub.importedescuento"
                            label="Imp.Descuento"
                            :color="temas.forms_titulo_bg"
                            @change="desimpItem()">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            v-model="editadoPub.precio"
                            :color="temas.forms_titulo_bg"
                            label="Precio Publicación (S/IVA)"
                            @change="precioItem()">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <v-row v-show="seleccionarArticulo == false">
                        <v-col cols="12" sm="12" md="12">
                          <v-textarea
                            v-model="editadoPub.detalles"
                            :color="temas.forms_titulo_bg"
                            outlined
                            label="Detalles de la publicación">
                          </v-textarea>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-data-table
                            :headers="headersUsers"
                            :items="usuarios"
                            dense
                            class="elevation-3"
                            :footer-props="footerProps">
                          </v-data-table>
                        </v-col>
                      </v-row>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>

            <!--// FOTOS // -->
            <v-dialog v-model="dialogFotos" max-width="900px">

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
                  <span class="headdline">Fotos de
                    {{itemActual!=null ?
                      itemActual.nombre+' - ('+itemActual.codigo+')' : ''}}
                  </span>
                  <v-spacer></v-spacer>
                </v-toolbar>

                <v-form ref="form">
                  <v-card-text>
                    <v-row>
                      <v-col cols="11" sm="11" md="11">
                        <v-file-input
                          filled
                          dense
                          prepend-icon="mdi-camera"
                          v-model="nuevaFoto"
                          :color="temas.forms_titulo_bg">
                          <v-icon>mdi-plus</v-icon>
                        </v-file-input>
                      </v-col>
                      <v-col cols="1" sm="1" md="1">
                        <v-btn v-show="nuevaFoto!=null"
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
                      <v-row>
                        <v-col
                          v-for="(foto) in fotos" :key="foto.id">
                          <div class="contenedor-galeria">
                            <v-card class="mx-auto my-12" max-width="250">
                              <v-img height="250"
                                :src="`/images/${foto.foto}`"
                                class="galeria__img">
                              </v-img>
                              <v-divider class="mx-1"></v-divider>
                              <v-card-text >
                                <v-btn
                                  class="mr-2" fab x-small
                                  :color="temas.cen_btns_bg"
                                  :dark="temas.cen_btns_dark==true"
                                  @click="borrarFoto(itemActual, foto.id)">
                                  <v-icon>mdi-delete</v-icon>
                                </v-btn>
                              </v-card-text>
                            </v-card>
                          </div>
                        </v-col>
                      </v-row>
<!--
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
-->
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE FOTOS -->

            <!--// CAMBIAR ESTADO // -->
            <v-dialog v-model="dialogEstado" max-width="350px">

              <template v-slot:activator="{ on }"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cerrarEstado">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="headdline">Cambiar Estado de la Publicación
                  </span>
                  <v-spacer></v-spacer>
                </v-toolbar>

                <v-form ref="form">
                  <v-card-text>
                    <v-container fluid>
                      <v-row>
                        <v-col>
                          <span>Estado de la publicación
                            <b>{{ estadoDeLaPublicacion }}</b>
                          </span>
                        </v-col>
                      </v-row>
                      <v-radio-group v-model="estadoPublicacion">
                        <v-radio
                          v-for="(p,i) in estPub" :key="i"
                          :disabled="!p.activa"
                          :label="p.nombre"
                          :value="p.id"
                        ></v-radio>
                      </v-radio-group>
                      <v-btn
                        class="mr-2"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="cambiarEstadoPublicacionHTTP()">
                        Cambiar
                      </v-btn>
                  </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN CAMBIO DE ESTADO -->

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
        <template v-slot:item.activo="{ item }">
          <v-chip :color="getColor(item.activo)" dark>{{ item.activo ? 'Sí' : 'No' }}</v-chip>
        </template>

        <template v-slot:item.preciooriginal="{ item }">
          <span disable dark>${{ formatoImporte(item.preciooriginal) }}</span>
        </template>

        <template v-slot:item.precio="{ item }">
          <span disable dark>${{ formatoImporte(item.precio) }}</span>
        </template>

        <template v-slot:item.tasadescuento="{ item }">
          <span disable dark>%{{ formatoImporte(item.tasadescuento) }}</span>
        </template>

        <template v-slot:item.vencimiento="{ item }">
          <span disable dark>{{ formatoFechaCorta(item.vencimiento) }}</span>
        </template>

        <template v-slot:item.estado="{ item }">
          <v-chip
            class="caption mr-2"
            label :color="getEstado(item.estado,'c')">
            {{ getEstado(item.estado,'e') }}
            <v-badge class="pr-5"
              :content="item.global ? 'g' : 'u'"
              :color="item.global ? temas.forms_btn_add_bg : temas.barra_lateral_bg"
              :dark="temas.forms_btn_add_bg==true" overlap>
            </v-badge>
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
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2" fab x-small
                :color="temas.forms_btn_editar_bg"
                :dark="temas.forms_btn_editar_dark==true"
                @click="verFotos(item)" v-on="on">
                <v-badge
                  :content="item.cttfotos"
                  :value="item.cttfotos"
                  :color="temas.forms_btn_add_bg"
                  :dark="temas.forms_btn_add_bg==true" overlap>
                  <v-icon>mdi-camera</v-icon>
                </v-badge>
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
    modelo: 'publicaciones',
    busArt: '',
    selArt: [],
    seleccionarArticulo: false,
    dialogFotos: false,
    itemActual: null,
    acciones: [],
    fotos: [],
    usuarios: [],
    nuevaFoto: null,
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
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogEstado: false,
    // definimos los headers de la datatables
    items: [],
    estadoPublicacion: '',
    comoEstaLaPublicacion: '',
    estPub: [
      {id: 'P', nombre: 'Publicar' , activa: false},
      {id: 'U', nombre: 'Pausar'   , activa: false},
      {id: 'I', nombre: 'Ocultar'  , activa: false},
    ],
    prioridades: [
      {id: 1, nombre: 'Por orden de publicación'},
      {id: 2, nombre: 'Si es el más vendido'},
      {id: 3, nombre: 'Forzar prioridad'},
    ],
    editadoArt: {
      articulo_id: '',
      codigo: '',
      codbar: '',
      nombre: '',
      unidad_id: '',
      unidadNombre: '',
      moneda_id: '',
      monedaNombre: '',
      iva_id: '',
      ivaTasa: '',
      stock: 0,
    },
    editadoPub: {
      articulo_id: '',
      unidades: '',
      preciooriginal: '',
      tasadescuento: '',
      importedescuento: '',
      precio: '',
      total: '',
      vencimiento: '',
      detalles: '',
      envio: '',
      estado: '',
      prioridad: 0,
    },
    editadoDefaultPub: {
      articulo_id: '',
      unidades: '',
      preciooriginal: '',
      tasadescuento: '',
      importedescuento: '',
      precio: '',
      total: '',
      vencimiento: '',
      detalles: '',
      envio: '',
      estado: '',
      prioridad: 0,
    },
    headers: [
      { text: 'Codigo',       value:'codigo', align: 'left', width: 120},
      { text: 'Nombre',       value:'nombre', align: 'left', width: 250},
      { text: 'Precio Lista', value:'preciooriginal', align: 'end', width: 120},
      { text: '%Desc',        value:'tasadescuento', align: 'end', width: 70},
      { text: 'Oferta s/IVA', value:'precio', align: 'end', width: 120},
      { text: 'Vencim.',      value:'vencimiento'},
      { text: 'Vendidos',     value:'vendidas', align: 'end', width: 70},
      { text: 'Quedan',       value:'unidades', align: 'end', width: 70},
      { text: 'Estado',       value:'estado'},
      { text: 'ACCIONES',     value:'accion', sortable: false },
    ],
    headersUsers: [
      { text: 'Usuario',      value:'user.username', align: 'left', width: 350 },
      { text: '%Desc',        value:'tasadescuento', align: 'left', width: 130 },
      { text: 'Un.Mínimas',   value:'unidadesminimas', align: 'left', width: 130 },
      { text: 'Estado',       value:'estado', align: 'left', width: 90 },
      { text: 'ACCIONES',     value:'accion', sortable: false },
    ],
    headersSelArticulos: [
//    { text: '1',      value:'id',     align: 'left', width: 50 } ,
      { text: 'CODIGO', value:'codigo', align: 'left', width: 120 } ,
      { text: 'NOMBRE', value:'nombre', align: 'left', width: 350 } ,
//    { text: 'STOCKS', value:'stock',  align: 'end',  width: 100 } ,
      { text: 'PRECIO', value:'precio', align: 'end',  width: 100 } ,
    ],
    editedIndex: -1,
    editado: {
      id: '',
      codigo: '',
      nombre: '',
      activo: true,
    },
    defaultItem: {
      id: '',
      codigo: '',
      nombre: '',
      activo: true,
    },
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState(['temas']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva Publicación' : 'Editar Publicación';
    },
    estadoDeLaPublicacion() {
      let estado = ''
      if (this.itemActual!=null) {
        if (this.itemActual.estado=='P') {
          estado = 'Publicada'
        } else if (this.itemActual.estado=='U') {
          estado = 'Pausada'
        } else if (this.itemActual.estado=='I') {
          estado = 'Oculta'
        }
        return estado
      } else {
        return ''
      }
    }
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
      return this.listarHTTP()
    }
  },
 methods: {
   ...mapMutations(['alert','closeAlert']),
   closeForm(){
     router.push('/')
    },





    activarDesactivar(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
      HTTP().patch(`${this.modelo}/${item.id}`,{activo: valor}).then ((res) => {
        console.log(res);
        }).catch((err)=>{
          console.log(err);
        })
    },





    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
          this.borrarHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS') {
          alert('exportando a XLS...')
        } else if (this.msg.msgAccion=='articulo ya publicado') {
          debugger
          this.busArt = ''
          this.seleccionarArticulo = false;
          this.$refs.buscarx.focus()
        }
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





    buscoCodigo (event) {
      // who caused it? "event.target.id"
    	const cod = event.target.value
      return HTTP().get(`/${this.modelo}/exists/${cod}`)
        .then(({ data }) => {
          if(data) {
            this.mensaje('¡El código ingresado ya existe.!', 'black', 1500) 
            this.$refs.codigo.focus()
          }
      });
    },





    listarHTTP:function() {
      debugger
      return HTTP().post('/'+this.modelo, { proveedor: this.userId, filtro: 9999999, adm: true }).then(({ data }) => {
        debugger
        this.items = data;
      });
    },





    altaHTTP:function() {

      debugger

      return HTTP().post('/generopublicacion', {
        articulo_id:    this.editadoPub.articulo_id,
        preciooriginal: this.editadoPub.preciooriginal,
        tasadescuento:  this.editadoPub.tasadescuento,
        precio:         this.roundTo(this.editadoPub.total,2),
        envio:          0,
        detalles:       this.editadoPub.detalles,
        unidades:       this.editadoPub.unidades,
        vencimiento: moment(this.editadoPub.vencimiento).format('YYYY-MM-DD'),
        estado:         'P',
        prioridad:      this.editadoPub.prioridad,
        }).then(({ data }) => {
          this.listarHTTP();
        });
    },





    editarHTTP:function(data) {
      debugger
      return HTTP().patch(`${this.modelo}/${this.itemActual.id}`, data)
        .then(({data}) => {
          debugger
          this.listarHTTP();
        });       
    },





    activarpausartodas(cual) {
      debugger
      return HTTP().post('activarpausartodas', { cual: cual } )
        .then(({data}) => {
          debugger
          this.listarHTTP();
        });       
    },






    borrarHTTP:function(data) {
      return HTTP().delete(`/${this.modelo}/${data.id}`)
        .then(() => {
          this.listarHTTP();
        });
    },





    cambiarEstadoPublicacionHTTP() {
      debugger
      return HTTP().patch(`/cambiarestadopublicacion`,{id: this.itemActual.id, estado: this.estadoPublicacion})
        .then(() => {
          debugger
          this.dialogEstado = false
          this.listarHTTP();
        })
        .catch((err)=>{
          console.log(err);
        })
    },





    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      this.acciones.push({nombre: 'Editar', icon: 'mdi-glasses'})
      this.acciones.push({nombre: 'Borrar', icon: 'mdi-delete'})
//    this.acciones.push({nombre: 'Pausar/Activar', icon: 'mdi-printer'})
//    this.acciones.push({nombre: 'Hacer Visible/Invisible', icon: 'mdi-printer'})
      this.acciones.push({nombre: 'Cambiar Estado', icon: 'mdi-check'})
    },





    async selAccion(item) {
      if (item.nombre=='Editar') {
        this.editar(this.itemActual)
      } else if (item.nombre=='Borrar') {
        this.preguntoBorrar(this.itemActual)
      } else if (item.nombre=='Pausar/Activar') {
        this.cambiarEstadoPublicacionHTTP(this.itemActual)
      } else if (item.nombre=='Cambiar Estado') {
        this.cambiarEstado(this.itemActual)
      }
    },





    preguntoBorrar (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+item.articulo.nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },






    verFotos (item) {
      this.itemActual = item
      this.dialogFotos = true
      this.fotos = []
      return HTTP().get('/publicacioncargarfotos/'+item.id)
        .then(({ data }) => {
          for (let i=0; i<=data[0].fotos.length-1; i++) {
            this.fotos.push( {id: data[0].fotos[i].id, foto: data[0].fotos[i].foto} )
          }
      });
    },





    cerrarFotos() {
      this.dialogFotos = false;
    },





    cambiarEstado(item) {
      debugger
      /*
      estPub: [
      {id: 'P', nombre: 'Pulicada', estado: false},
      {id: 'U', nombre: 'Pausada' , estado: false},
      {id: 'I', nombre: 'Oculta'  , estado: false},
      ],
      */
      this.estPub[0].activa = false
      this.estPub[1].activa = false
      this.estPub[2].activa = false

      if (item.estado=='I' || item.estado=='U') {
        this.estPub[0].activa = true
        this.estadoPublicacion     = 'P'
        this.comoEstaLaPublicacion = 'P'
      } else if (item.estado=='P') {
        this.estPub[1].activa = true
        this.estPub[2].activa = true
        this.estadoPublicacion     = 'U'
        this.comoEstaLaPublicacion = 'U'
      }
      this.dialogEstado = true;
    },





    cerrarEstado() {
      this.dialogEstado = false;
    },





    agregarFoto(item) {
      return HTTP().post('/publicacionagregarfoto', {
        publicacion_id: this.itemActual.id,
        foto: this.nuevaFoto.name,
        }).then(({ data }) => {
          this.fotos.push({id: data.id, foto: this.nuevaFoto.name})
          this.itemActual.cttfotos ++
          this.nuevaFoto = null
        });
    },





    borrarFoto(item, id) {
      return HTTP().delete(`/publicacionborrarfoto/${id}`)
        .then(() => {
          let pos = 0
          for (let i=0; i<=this.fotos.length-1; i++) {
            if (this.fotos[i].id == id) {
              pos = i
              break
            }
          }
          this.fotos.splice(pos, 1)
          item.cttfotos --
        });
    },





    nuevapublicacion() {
      debugger
      this.editedIndex = -1;
      this.dialog = true;
      this.editadoPub = Object.assign({}, this.editadoDefaultPub);
      this.seleccionarArticulo = false
    },





    editar (item) {
      debugger
      this.itemActual = item
      this.editadoArt.nombre = item.articulo.codigo+' - '+item.articulo.nombre
      this.editedIndex = this.items.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.editadoPub.articulo_id      = item.articulo.id
      this.editadoPub.unidades         = item.unidades
      this.editadoPub.preciooriginal   = item.preciooriginal
      this.editadoPub.tasadescuento    = item.tasadescuento
      this.editadoPub.importedescuento = this.roundTo(item.preciooriginal-item.precio,2)
      this.editadoPub.precio           = item.precio
      this.editadoPub.total            = this.roundTo(item.preciooriginal-item.importedescuento,2)

      // EL TOTAL DE LAS PUBLICACIONES VA SIN IVA
//    this.editadoPub.total = this.roundTo((item.preciooriginal-impdes)*(1+(item.articulo.iva.tasa/100)),2)
      this.editadoPub.vencimiento = item.vencimiento.substr(0,10)
      this.editadoPub.envio = item.envio
      this.editadoPub.detalles = item.detalles

      let pos = this.prioridades.findIndex(x => x.id == item.prioridad)

      this.editadoPub.prioridad = this.prioridades[pos].id
      this.editadoPub.estado = 'P'
      this.usuarios = item.usuarios

      this.desimpItem()
      this.seleccionarArticulo = false
      this.dialog = true;
    
    },





    cancelar() {
      this.dialog = false;
      this.editado = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },





    publicar() {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', 'red', 1500) 
        return this.dialog = true;
      }
      if (this.editedIndex > -1) { // esta modificando
        this.editarHTTP(this.editadoPub);
        this.mensaje('¡Actualización Exitosa!', 'black', 1500) 
      } else {
        this.altaHTTP();
        this.mensaje('¡Alta Exitosa!', 'blue', 1500) 
      }
      this.cancelar();
    },





    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },





    formatoFecha(value) {
      return moment(String(value)).format('L')
    },





    formatoFechaCorta(value) {
      return moment(String(value)).format('DD-MM-YY')
    },




    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },





    buscarArt(estricto) {
      this.seleccionarArticulo = false;
      let b = this.busArt
      let v = this.$store.state.vinculosPadres
      let elQueEncontro = null

      return HTTP().post('/userarticulosfac', {
        search: b,
        vinculos: v,
        estricto: estricto,
        userex: null
        })
        .then(({ data }) => {
          debugger
          elQueEncontro = data
          if (data.length==1) {
            return HTTP().post('/estapublicado', {
              articulo_id: data[0].id
            })
            .then(({data}) => {
              debugger
              if (!data.length) {
                this.editadoArt.codigo           = elQueEncontro[0].codigo;
                this.editadoArt.articulo_id      = elQueEncontro[0].id;
                this.editadoArt.nombre           = elQueEncontro[0].nombre;
                this.editadoArt.codbar           = elQueEncontro[0].codbar;
                this.editadoArt.unidad_id        = elQueEncontro[0].unimedid
                this.editadoArt.moneda_id        = elQueEncontro[0].monedaid
                this.editadoArt.iva_id           = elQueEncontro[0].ivaid
                this.editadoArt.monedaNombre     = elQueEncontro[0].simbolo
                this.editadoArt.unidadNombre     = elQueEncontro[0].unimed
                this.editadoArt.ivaTasa          = elQueEncontro[0].tasa
                this.editadoArt.costo            = elQueEncontro[0].costo
                this.editadoArt.preciooriginal   = elQueEncontro[0].precio
                this.editadoArt.precio           = elQueEncontro[0].precio
                this.editadoArt.total            = elQueEncontro[0].final
                this.editadoArt.padre_id         = elQueEncontro[0].padre_id
                this.editadoArt.coeficiente      = elQueEncontro[0].coeficiente
                this.$refs.cantidad.focus()
                this.seleccionarArticulo = false
    
                this.editadoPub.articulo_id = elQueEncontro[0].id
                this.editadoPub.unidades = 1
                this.editadoPub.preciooriginal = elQueEncontro[0].precio
                this.editadoPub.tasadescuento = 0
                this.editadoPub.importedescuento = 0
                this.editadoPub.precio = elQueEncontro[0].precio
                this.editadoPub.total = elQueEncontro[0].final
                this.editadoPub.vencimiento = moment().add(15, 'days').format('YYYY-MM-DD')
                this.editadoPub.prioridad = elQueEncontro[0].prioridad
              } else {
                debugger
                this.msg.msgTitle = 'Atención!'
                this.msg.msgBody = 'Este artículo ya esta publicado!.'
                this.msg.msgVisible = true
                this.msg.msgAccion = 'articulo ya publicado'
                this.msg.msgButtons = ['Aceptar']
                this.itemActual = item;
                return
              }
            }) 
          } else {
            this.selArt = []
            for (let i=0; i<=data.length-1; i++) {
              this.selArt.push({
                id:                data[i].id,
                codigo:            data[i].codigo,
                articulo_id:       data[i].id,
                nombre:            data[i].nombre,
                codbar:            data[i].codbar,
                unidad_id:         data[i].unimedid,
                moneda_id:         data[i].monedaid,
                iva_id:            data[i].ivaid,
                monedaNombre:      data[i].simbolo,
                unidadNombre:      data[i].unimed,
                ivaTasa:           data[i].tasa,
                costo:             data[i].costo,
                precio:            data[i].precio,
                tasadescuento:     0,
                importedescuento:  0,
                deposito_id:       null,
                stock:             data[i].stock == null ? 0 : data[i].stock                 
                })
            }
            this.seleccionarArticulo = true;
          }
        })
    },





    selArtClick (item, row) {      
      this.seleccionarArticulo = false;
      this.busArt = item.codigo
      this.buscarArt(true)
      this.$refs.cantidad.focus()
    },





    desporItem() {
      debugger
      let desc = this.roundTo(this.editadoPub.preciooriginal * (this.editadoPub.tasadescuento/100),2)
      this.editadoPub.precio = this.roundTo(this.editadoPub.preciooriginal-desc,2)
      this.editadoPub.importedescuento = desc
      this.editadoPub.tasadescuento = this.roundTo(this.editadoPub.tasadescuento,2)
      this.editadoPub.total = this.roundTo((Number(this.editadoPub.precio)+Number(this.editadoPub.envio)),2)
    },





    desimpItem() {
      debugger
    //this.editadoPub.tasadescuento = this.roundTo(((Number(this.editadoPub.importedescuento)*100)/this.editadoPub.precio),2)
      this.editadoPub.precio = this.roundTo(this.editadoPub.preciooriginal-this.editadoPub.importedescuento,2)
      this.editadoPub.total = this.roundTo((Number(this.editadoPub.precio)+Number(this.editadoPub.envio)),2)
    },





    precioItem() {
      debugger
      this.editadoPub.tasadescuento = (100-((Number(this.editadoPub.precio)*100)/Number(this.editadoPub.preciooriginal)))
      this.desporItem()
    },





    getEstado (estado, accion) {
      let c = ''
      let e = ''
      if (estado==='P') {
        e = 'Publicado'
        c = 'light-green accent-1'
      } else if (estado==='U') {
        e = 'Pausado'
        c = 'red lighten-3'
      } else if (estado==='A') {
        e = 'Pendiente'
        c = 'red lighten-3'
      } else if (estado==='I') {
        e = 'Oculto'
        c = 'gray lighten-5'
      }
      if (accion==='c') {
        return c
      } else {
        return e
      }
      // bossana, dinkeldein esq alonso tel. 4655814
    },





  },

};
</script>
