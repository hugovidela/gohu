<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :options.sync= "pagination"
        :server-items-length="totalItems"
        dense
        :loading="loading"
        :footer-props="footerProps"
        class="elevation-1">
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
            <v-toolbar-title class="body-1 white--text">Marcas de Artículos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>
            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="550px">
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
                            :counter="50"
                            :maxlength="50"
                            :autofocus="(editedIndex===0)"
                            v-on:keydown.tab="buscoNombre">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2" sx="6" mx="4">
                          <v-switch
                            label="Activo"
                            v-model="editado.activo"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
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

          <v-btn
            class="mr-2" fab x-small
            :color="temas.forms_btn_editar_bg"
            :dark="temas.forms_btn_editar_dark==true"
            @click="editar(item)">
            <v-icon dark>mdi-pencil</v-icon>
          </v-btn>

          <v-btn
            class="mr-2" fab x-small
            :color="temas.forms_btn_borrar_bg"
            :dark="temas.forms_btn_borrar_dark==true"
            @click="preguntoBorrar(item)">
            <v-icon dark>mdi-delete</v-icon>
          </v-btn>

          <v-btn
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

/* eslint-disable */
import HTTP from '../../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../../router';
import SBar from './../Forms/snackbar.vue';
import Confirmacion from "./../Forms/confirmacion.vue"
import XLSX from 'xlsx'

export default {
  components: {
    SBar,
    Confirmacion,
  },
  data: () => ({
    modelo: 'marcas',
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
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    ////////////////////////////////////
    // PARA EL DATATABLE ///////////////
    ////////////////////////////////////
    items: [],
    totalItems: 0,
    loading: false,
    pagination: {
      page: 1,
    },
    footerProps: {'items-per-page-options': [11]},
    search: '', 
    headers: [
      { text: 'NID',      value: 'id',     width: "40", align: 'end' },
      { text: 'NOMBRE',   value: 'nombre', width: "250" },
      { text: 'ACTIVO',   value: 'activo', width: "120" },
      { text: 'ACCIONES', value: 'accion', width: "120" },
    ],
    // FIN DEL DATATABLE ///////////////

    dialog: false,
    editedIndex: -1,
    editado: {
      id: 0,
      nombre: '',
      activo: true,
    },
    defaultItem: {
      id: 0,
      nombre: '',
      activo: true,
    },
    datosOk: false,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn']),
    ...mapState(['temas']),
    formTitle () {
      return this.editedIndex === -1 ? 'Nueva Marca' : 'Editar Marca';
    },
  },
  watch: {
    dialog (val) {
      val || this.cancelar();
    },
    pagination: {
      handler () {
        this.listarHTTP()
        .then(data => {
          this.items = data.items
          debugger
          this.totalItems = data.total
        })
      },
      deep: true
    },
    search() {
      this.listarHTTP()
      .then(data => {
        this.items = data.items
        debugger
        this.totalItems = data.total
      })
    }    
  },
  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      return this.listarHTTP()
    }
  },
  created () {
    // this.listarHTTP();
  },
  
  methods: {
    ...mapMutations(['alert','closeAlert']),
    closeForm(){
      router.push('/')
    },
    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.items)
      const workbook = XLSX.utils.book_new()
      const filename = this.modelo
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
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
          this.exportExcel()
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
    buscoNombre (event) {
      return HTTP().post('/marcaexiste', {nombre: this.editado.nombre,id: this.editado.id}).then(({ data }) => {
        if(data) {
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
    /*
    listarHTTP:function() {
      return HTTP().get('/'+this.modelo)
        .then(({ data }) => {
          this.items = data;
      });
    },
    */
    listarHTTP () {
      let localThis = this
      this.loading = true
      return new Promise((resolve, reject) => {
          const { sortBy, descending, page, rowsPerPage } = this.pagination
          let items = this.getJsonData().then(
            function(response){
              items = response.data;
              const total = response.meta.total
              setTimeout(() => {
                localThis.loading = false;
                resolve({items,total})
              }, 0)
          })
      })
    },
    async getJsonData () {
      let s = this.search.length>0 ? this.search : 'all'
      return await HTTP().get(`${this.modelo}/${this.pagination.page}/${this.pagination.itemsPerPage}/${s}`)
        .then(function(response){
          return response.data;
        }).catch(function (error) {
          console.log(error);
      })
    },

    altaHTTP:function() {
      return HTTP().post('/'+this.modelo, {
        nombre: this.nombre,
        activo: true,
        }).then(({ data }) => {
          this.listarHTTP()
            .then(data => {
              this.items = data.items
              debugger
              this.totalItems = data.total
          })
        });
    },
    editarHTTP:function(data) {
      return HTTP().patch(`${this.modelo}/${data.id}`, data)
        .then((data) => {
          this.listarHTTP()
            .then(data => {
              this.items = data.items
              debugger
              this.totalItems = data.total
          })

        });       
    },
    borrarHTTP:function(id) {
      return HTTP().delete(`/${this.modelo}/${id}`)
        .then(() => {
          this.listarHTTP()
            .then(data => {
              this.items = data.items
              debugger
              this.totalItems = data.total
          })
        });
    },
    editar (item) {
      this.datosOk = true
      this.editedIndex = this.items.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.editado = Object.assign({}, item);
      this.dialog = true;
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
