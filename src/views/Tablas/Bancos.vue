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

              <v-btn v-if="userId==1"
                fab
                :color="temas.forms_btn_add_bg"
                :dark="temas.forms_btn_add_dark==true"
                @click="dialog = !dialog">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
              <v-btn
                fab
                :color="temas.forms_btn_xls_bg"
                :dark="temas.forms_btn_xls_dark==true"
                @click='exportarAXLS'>
                <v-icon>mdi-file-excel</v-icon>
              </v-btn>
              <v-btn
                fab
                :color="temas.forms_btn_pdf_bg"
                :dark="temas.forms_btn_pdf_dark==true"
                @click='exportarAPDF'>
                <v-icon>mdi-file-pdf-box</v-icon>
              </v-btn>

            </template>
            <v-toolbar-title class="body-1 white--text">Bancos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="750px">
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

                  <v-btn
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text" @click="guardar">Guardar
                  </v-btn>

                </v-toolbar>
                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                          <v-text-field
                            :disabled="!(editedIndex===-1)"
                            :autofocus="(editedIndex===-1)"
                            ref="codigo"
                            v-model="editado.codigo"
                            :color="temas.forms_titulo_bg"
                            label="Codigo"
                            required
                            :rules="codigoRules"
                            :counter="5"
                            maxlength="5"
                            v-on:keydown.tab="buscoCodigo">
                          </v-text-field>
                        </v-col>
                        <v-col cols="6" sx="6" mx="6" class="pt-0 pb-0">
                        </v-col>
                        <v-col cols="2" sx="2" mx="2" class="pt-0 pb-0">
                          <v-switch
                            label="Activo"
                            v-model="editado.activo"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                          <v-text-field
                            v-model="editado.nombre"
                            :color="temas.forms_titulo_bg"
                            :autofocus="!(editedIndex===-1)"
                            label="Nombre"
                            required
                            :rules="nombreRules"
                            :counter="40"
                            :maxlength="40">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                          <v-file-input
                            v-model="logotipo"
                            label="Logotipo"
                            prepend-icon="mdi-camera"
                            :color="temas.forms_titulo_bg"
                            @change="avatarClick()">
                            <template v-slot:selection="{ text }">
                              {{ logotipo.name }}
                            </template>
                          </v-file-input>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col class="pl-9 pb-4" cols="12" sm="12" align="center">

                          <v-img
                            height="250"
                            width="250"
                            contain
                            :src="`/images/${logotipo.name}`"
                            class="galeria__img">
                          </v-img>

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
        <template v-slot:item.activo="{ item }">
          <v-chip :color="getColor(item.activo)" dark>{{ item.activo ? 'Sí' : 'No' }}</v-chip>
        </template>
        <template v-slot:item.accion="{ item }">
          <v-btn v-if="userId==1"
            class="mr-2" fab x-small
            :color="temas.forms_btn_editar_bg"
            :dark="temas.forms_btn_editar_dark==true"
            @click="editar(item)">
            <v-icon dark>mdi-pencil</v-icon>
          </v-btn>

          <v-btn v-if="userId==1"
            class="mr-2" fab x-small
            :color="temas.forms_btn_activar_bg"
            :dark="temas.forms_btn_activar_dark==true"
            @click="activarDesactivar(item)">
            <v-icon dark>mdi-checkbox-marked-outline</v-icon>
          </v-btn>

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
import HTTP from '../../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../../router';
import SBar from './../Forms/snackbar.vue';
import Confirmacion from "./../Forms/confirmacion.vue"

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    modelo: 'bancos',
    itemActual: null,
    logotipo: {name: ''},
    logotipo2: {name: ''},
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    codigoRules: [
      (v) => !!v || 'El código es requerido',
      (v) => v.length <= 5 || 'Ingrese hasta 5 caracteres'
    ],      
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 40 || 'Ingrese hasta 80 caracteres'
    ],
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: false, // para que la ventana de dialogo o modal no aparezca automáticamente      
    // definimos los headers de la datatables
    items: [],
    headers: [
      { text: 'ID', value: 'id', width: 60 },
      { text: 'CODIGO', value:'codigo', width: 100},
      { text: 'NOMBRE', value:'nombre', width: 300},
      { text: 'Logo', value:'imagen', width: 160},
      { text: 'ACTIVO', value:'activo', width: 60},
      { text: 'ACCIONES', value: 'accion', sortable: false , width: 60},
    ],
    editedIndex: -1,
    editado: { id: '', codigo: '', nombre: '', imagen: '', activo: true, },
    defaultItem: { id: '', codigo: '', nombre: '', imagen: '', activo: true, },
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState(['temas']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo Banco' : 'Editar Banco';
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
      if (this.userId!=1) {
        this.headers.pop()
      }
      this.listarHTTP()
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
          this.borrar(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS')
          alert('exportando a XLS...')
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
    
    
    buscoCodigo (event) {
      // who caused it? "event.target.id"
    	const cod = event.target.value
      return HTTP().get(`/${this.modelo}/exists/${cod}`)
        .then(({ data }) => {
          if(data) {
            this.mensaje('¡El código ingresado ya existe.!', this.temas.snack_ok_bg, 1500) 
            this.$refs.codigo.focus()
          }
      });
    },
    listarHTTP:function() {
      return HTTP().get('/'+this.modelo)
        .then(({ data }) => {
          this.items = data;
      });
    },
    altaHTTP:function() {
      return HTTP().post('/'+this.modelo, {
        codigo: this.editado.codigo,
        nombre: this.editado.nombre,
        imagen: this.editado.imagen,
        activo: true,
        }).then(({ data }) => {
          this.listarHTTP();
        });
    },
    editarHTTP:function(data) {
      debugger
      return HTTP().patch(`${this.modelo}/${data.id}`, data)
        .then((data) => {
          debugger

          if (data=='error') {
            this.msg.msgTitle = 'Error'
            this.msg.msgBody = '¡Error en actualizar el registro!'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'error'
            this.msg.msgButtons = ['Aceptar']
          }

          this.listarHTTP();
        });       
    },
    editar (item) {
      debugger
      this.editedIndex = this.items.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.editado = Object.assign({}, item);
      this.logotipo = Object.assign({}, this.logotipo2)
      this.logotipo.name = this.editado.imagen;
      this.dialog = true;
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
      this.dialog = false;
      this.editado = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },
    guardar() {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', this.temas.snack_error_bg, 1500) 
        return this.dialog = true;
      }
      debugger
      this.editado.imagen = this.logotipo.name;
      if (this.editedIndex > -1) { // esta modificando
        this.id = this.editado.id;
        this.editarHTTP(this.editado);
        this.mensaje('¡Actualización Exitosa!', this.temas.snack_ok_bg, 1500) 
      } else {
        this.altaHTTP();
        this.mensaje('¡Alta Exitosa!', this.temas.snack_ok_bg, 1500) 
      }
      this.cancelar();
    },
  },
  avatarClick() {
    this.logotipo.name = this.logotipo.name
  },

};
</script>
