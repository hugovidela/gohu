<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
        sort-by="id"
        dense
        class="elevation-3"
        :footer-props="footerProps">
        <template v-slot:top>
          <v-toolbar
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
                @click="dialog = !dialog">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-toolbar-title class="body-1 white--text">Tags para Clientes</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="400px">
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-toolbar
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
                  <v-btn v-if="datosOk"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text" @click="guardar">Guardar
                  </v-btn>
                </v-toolbar>
                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-text-field
                            ref="nombre"
                            v-model="editado.nombre"
                            :color="temas.forms_titulo_bg"
                            label="Nombre"
                            required
                            :rules="nombreRules"
                            :counter="20"
                            :maxlength="20"
                            :autofocus="(editedIndex===-1)"
                            v-on:keydown.tab="buscoNombre">
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
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
        <template v-slot:item.accion="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2" fab x-small outlined
                :color="temas.forms_btn_editar_bg"
                :dark="temas.forms_btn_editar_dark==true"
                @click="editar(item)" v-on="on">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
            </template>
            <span>Editar</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2" fab x-small outlined
                :color="temas.forms_btn_activo_bg"
                :dark="temas.forms_btn_activo_dark==true"
                @click="verReglas(item)" v-on="on">
                <v-icon dark>mdi-square-root</v-icon>
              </v-btn>
            </template>
            <span>Reglas en la que esta incluido</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mr-2" fab x-small outlined
                :color="temas.forms_btn_borrar_bg"
                :dark="temas.forms_btn_borrar_dark==true"
                @click="preguntoBorrar(item)" v-on="on">
                <v-icon dark>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Borrar</span>
          </v-tooltip>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-data-table
              :headers="headersClientes"
              :items="item.tagsterceros"
              dense
              :footer-props="footerProps">
              <template v-slot:item.accion="{item}">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="mr-2" fab x-small outlined
                      :color="temas.forms_btn_editar_bg"
                      :dark="temas.forms_btn_editar_dark==true"
                      @click="editar(item)" v-on="on">
                      <v-icon dark>mdi-sync-off</v-icon>
                    </v-btn>
                  </template>
                  <span>Desvincular</span>
                </v-tooltip>
              </template>
            </v-data-table>
          </td>
        </template>
        <template v-slot:item.nombre="{ item }">
          <span>{{ item.nombre }}
          </span>
          <v-badge
            class="pt-3"
            :content="item.tagsterceros.length ? item.tagsterceros.length : '0'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
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
import SBar from '../Forms/snackbar.vue';
import Confirmacion from "../Forms/confirmacion.vue"

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    modelo: 'clientetags',
    itemActual: null,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 30 || 'Ingrese hasta 30 caracteres'
    ],
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    items: [],
    headers: [
      { text: 'ID', value: 'id', align: 'left', width: 90, sortable: false, },
      { text: 'NOMBRE', value:'nombre', align: 'left', width: 200},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersClientes: [
      { text: 'ID', value: 'usertercero.id', align: 'left', width: 90, sortable: false, },
      { text: 'NOMBRE', value:'usertercero.tercero.nombre', align: 'left', width: 300},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    editedIndex: -1,
    editado: {
      id: '',
      nombre: '',
    },
    defaultItem: {
      id: '',
      nombre: '',
    },
    datosOk: false,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn']),
    ...mapState(['temas']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo Tag' : 'Editar Tag';
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
      return this.listarHTTP()
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
          this.borrar(this.itemActual)
        }
      }
      this.msg.msgVisible = false;
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    buscoNombre (event) {
      debugger
      return HTTP().post('/clientetagexiste', {nombre: this.editado.nombre,id: this.editado.id}).then(({ data }) => {
        if(data) {
          debugger
          this.datosOk = false
          this.$store.commit("alert", {
            color:'black',
            text:'¡El nombre ingresado ya existe.!',
            timeout:1500}
          );
          this.$refs.nombre.focus()
        } else {
          this.datosOk = true
        }
      });
    },

    listarHTTP() {
      return HTTP().get('/'+this.modelo).then(({ data }) => {
        debugger
        this.items = data;
      });
    },
    
    altaHTTP() {
      return HTTP().post('/'+this.modelo, {nombre: this.nombre,activo: true}).then(({ data }) => {
        this.listarHTTP();
      });
    },

    editarHTTP(data) {
      return HTTP().patch(`${this.modelo}/${data.id}`, data).then(() => {
        this.listarHTTP();
      });       
    },

    borrarHTTP(id) {
      return HTTP().delete(`/${this.modelo}/${id}`).then(() => {
        this.listarHTTP();
      });
    },

    editar (item) {
      this.datosOk = true
      this.editedIndex = this.items.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.editado = Object.assign({}, item);
      this.dialog = true;
    },

    verReglas(item) {
      return HTTP().post('/puedoborrartagclientes', {id: item.id}).then(({ data }) => {
        debugger
        let m = ''
        this.msg.msgTitle = 'Tag '+item.nombre
        if (data.res.length==0) {
          m = 'Este Tag no está incluido en niguna regla.'
        } else {
          for (let i=0; i<=data.res.length-1; i++) {
            m += 'Regla '+data.res[i].id+' - '+data.res[i].nombre+'<br>'
          }
        }
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'reglas'
        this.msg.msgButtons = ['Aceptar']
        this.itemActual = item;
      })
    },

    preguntoBorrar (item) {
      return HTTP().post('/puedoborrartagclientes', {id: item.id}).then(({ data }) => {
        debugger
        if (data.res.length==0) {
          this.msg.msgTitle = 'Borrar'
          let m = ''
          if (data.tagsTerceroUser.length>0) {
            m = 'Este tag esta vinculado a '
            if (data.tagsTerceroUser.length>1) {
              m += data.tagsTerceroUser.length+' clientes.<br>'
              m += 'Si lo elimina se desvincuará en forma automática de ellos.<br>'
            } else {
              m += data.tagsTerceroUser.length+' cliente.<br>'
              m += 'Si lo elimina se desvincuará en forma automática.<br>'
            }
          }
          m += '¿Confirmar borrar este Tag?'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'borrar item'
          this.msg.msgButtons = ['Aceptar','Cancelar']
          this.itemActual = item;
        } else {
          this.msg.msgTitle = 'Conflicto'
          let m = ''
          if (data.res.length>1) {
            m = 'El Tag a eliminar existe en las siguientes reglas definidas:<br>'
          } else {
            m = 'El Tag a eliminar existe en la siguiente regla definida:<br>'
          }
          for (let i=0; i<=data.res.length-1; i++) {
            m += '<b>Regla '+data.res[i].id+' - '+data.res[i].nombre+'</b><br>'
          }
          if (data.res.length>1) {
            m += 'Primero debe desactivar el Tag en estas reglas '
          } else {
            m += 'Primero debe desactivar el Tag en esta regla '
          }
          m += 'para luego poder eliminarlo.'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'error borrar item'
          this.msg.msgButtons = ['Aceptar']
          this.itemActual = item;
        }
      })
    },

    borrar (item) {
      const index = this.items.indexOf(item);
      this.borrarHTTP(this.items[index].id);
      this.mensaje('¡Se eliminó el registro.!', 'black', 1500) 
    },

    cancelar() {
      this.dialog = false;
      this.editado = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },

    guardar() {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', 'red', 1500) 
        return this.dialog = true;
      }
      this.nombre = this.editado.nombre;
      this.activo = this.editado.activo;
      if (this.editedIndex > -1) { // esta modificando
        this.id = this.editado.id;
        this.mensaje('¡Actualización Exitosa!', 'black', 1500) 
        this.editarHTTP(this.editado);
      } else {
        this.mensaje('¡Alta Exitosa!', 'blue', 1500) 
        this.altaHTTP();
      }
      this.cancelar();
    },
  },
};
</script>
