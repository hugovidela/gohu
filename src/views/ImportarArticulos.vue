  <template>
  <v-layout align-start>
    <v-flex>
      <v-dialog v-model="dialog" :fullscreen="true" persistent>

        <v-toolbar flat
          :color="temas.forms_titulo_bg"
          :dark="temas.forms_titulo_dark==true">
          <v-btn
            icon @click="closeForm"
            :color="temas.forms_close_bg"
            :dark="temas.forms_close_dark==true">
            <v-icon>mdi-arrow-left-circle</v-icon>
          </v-btn>
          <span class="text--rigth">Importación de Artículos / {{empresa}}</span>
          <v-spacer></v-spacer>
          <span class="text--right">
            <v-btn
              :color="temas.cen_btns_bg"
              :dark="temas.cen_btns_dark==true"
              class="ma-2 white--text text-capitalize" @click="comoPrepararElArchivoDeExcel">
              Como preparar el artchivo de Excel
            </v-btn>
          </span>
          <v-progress-circular v-if="progress==true"
            class="ml-2"
            small
            indeterminate
            :color="temas.barra_principal_bg">
          </v-progress-circular>
        </v-toolbar>

        <v-card>
          <v-form ref="form">
            <v-card-text class="pt-1 pb-1">
              <v-container>
                <v-row>
                  <v-col cols="4" sm="4" md="4">
                    <v-file-input
                      dense outlined
                      prepend-icon="mdi-file-excel"
                      v-model="nuevoXls"
                      :color="temas.forms_titulo_bg"
                      @change="cargarXls">
                      <v-icon>mdi-plus</v-icon>
                    </v-file-input>
                  </v-col>
                  <v-col cols="3" sm="3">
                    <v-select
                      v-model="rubro"
                      :items="rubItems"
                      :color="temas.forms_titulo_bg"
                      :item-color="temas.forms_titulo_bg"
                      item-value="id"
                      item-text="nombre"
                      label="Rubro..."
                      dense outlined return-object multiselect>
                    </v-select>
                  </v-col>
                  <v-col cols="1" sm="1" md="1" class="pt-1">
                    <v-text-field
                      disabled
                      v-show="xlsCargado"
                      :color="temas.forms_titulo_bg"
                      class="caption"
                      v-model="registrosXls"
                      label="Registros">
                    </v-text-field>
                  </v-col>
                  <v-col cols="1" sm="1" md="1" class="pt-1">
                    <v-text-field
                      disabled
                      v-show="xlsCargado"
                      class="caption"
                      v-model="encontradosXls"
                      label="Encontrados">
                    </v-text-field>
                  </v-col>
                  <v-col cols="1" sm="1" md="1" class="pt-1">
                    <v-text-field
                      disabled
                      v-show="xlsCargado"
                      class="caption"
                      v-model="aImportar"
                      label="A Importar">
                    </v-text-field>
                  </v-col>
                  <v-col cols="2" sm="2" md="2">
                    <v-btn
                      v-show="xlsCargado && aImportar>0"
                      class="mr-2"
                      :color="temas.cen_forms_btns_bg"
                      :dark="temas.cen_forms_btns_dark==true"
                      @click="importarArt">
                      Importar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-form>

          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            :single-select="false"
            :search="search"
            item-key="codigo"
            :show-select="showModificarDatos"
            dense
            class="elevation-3 pt-0"
            :footer-props="footerProps">
            <template v-slot:item.precio="{ item }">
              $ {{ formatoImporte(item.precio) }}
            </template>
            <template v-slot:item.estado="{ item }">
              {{ item.estado=='M' ? 'No se Importa' : 'Se Importa' }}
            </template>
            <template v-slot:top>
              <v-col cols="4" sm="4">  <!-- Barra de búsqueda  -->
                <v-text-field
                  v-model="search"
                  :color="temas.forms_titulo_bg"
                  append-icon="search"
                  label="Buscar"
                  single-line hide-details>
                </v-text-field>
              </v-col>
            </template>
          </v-data-table>

          <v-form ref="form">
            <v-card-text class="pt-0 pb-0">
              <v-container>
                <v-row>
                  <v-col cols="2" sm="2" md="2">
                    <v-switch
                      v-show="xlsCargado && aImportar>0"
                      class="body-2 pt-0"
                      label="Modificar datos de la Grilla"
                      v-model="showModificarDatos"
                      :color="temas.forms_titulo_bg">
                    </v-switch>
                  </v-col>
                  <v-col cols="3" sm="3" md="3">
                    <v-autocomplete v-show="showModificarDatos"
                      class="pt-2"
                      v-model="marcaSel_id"
                      :color="temas.forms_titulo_bg"
                      :items="itemsMarcas"
                      :loading="isLoadingMarcas"
                      :search-input.sync="searchMarcas"
                      item-text="nombre"
                      item-value="id"
                      label="Marca a Asignar"
                      outlined dense
                      placeholder="Escriba para buscar">
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="3" sm="3" md="3">
                    <v-autocomplete v-show="showModificarDatos"
                      class="pt-2"
                      v-model="grupoSel_id"
                      :color="temas.forms_titulo_bg"
                      :items="itemsGrupos"
                      :loading="isLoadingGrupos"
                      :search-input.sync="searchGrupos"
                      item-text="nombre"
                      item-value="id"
                      label="Grupo a Asignar"
                      outlined dense
                      placeholder="Escriba para buscar">
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="2" sm="2" md="2">
                    <v-select v-show="showModificarDatos"
                      class="pt-2"
                      v-model="moneda"
                      :items="monItems"
                      :color="temas.forms_titulo_bg"
                      :item-color="temas.forms_titulo_bg"
                      item-value="id"
                      item-text="simbolo"
                      label="Moneda..."
                      outlined dense
                      return-object multiselect>
                    </v-select>
                  </v-col>
                  <v-col cols="1" sm="1" md="1" class="pt-1">
                    <v-text-field
                      class="caption pt-5"
                      v-show="showModificarDatos"
                      disabled
                      v-model="selected.length"
                      label="Art.Sel.">
                    </v-text-field>
                  </v-col>
                  <v-col cols="1" sm="1" md="1" class="pt-5">
                    <v-btn
                      v-show="showModificarDatos && selected.length>0"
                      :color="temas.cen_forms_btns_bg"
                      :dark="temas.cen_forms_btns_dark==true"
                      @click="aplicar">
                      Aplicar
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-form>

          <div class="container">
            <div class="large-12 medium-12 small-12 cell">
              <label>File
                <input type="file" id="file" ref="file" v-on:change="handleFileUpload()"/>
              </label>
              <br>
                <progress max="100" :value.prop="uploadPercentage"></progress>
              <br>
              <v-btn v-on:click="submitFile()">Submit</v-btn>
            </div>
          </div>

        </v-card>
      </v-dialog>

      <!--COMO PREPARAR EL ARCHIVO DE EXCEL -->
      <v-dialog v-model="dialogComoPrepararElArchivoDeExcel" max-width="600px">
        <template v-slot:activator="{}"></template>
        <v-card>
          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              icon @click="cerrarComoPrepararElArchivoDeExcel"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="text--right">
              Como preparar el archivo de Excel
            </span>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-form ref="art">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12" class="pt-0">
                    <p>El archivo a importar deben cumplir las siguientes reglas</p>
                    <p><b>a)</b> No contener lineas vacias, ni al comienzo ni intercaladas<br>
                        <b>b)</b> La hoja del libro se debe llamar <b>hoja1</b><br>
                        <b>c)</b> Definir las primeas seis columnas con los siguientes datos:<br>
                        <br>
                        <b>Columna A</b> Codigo del Artículo (No debe contener el caracter <b>@</b>)
                        <br>
                        <b>Columna B</b> Nombre del Artículo (No debe contener el caracter <b>%</b>)
                        <br>
                        <b>Columna C</b> Precio del Artículo ( Sin impuestos )<br>
                        <b>Columna D</b> Tasa de IVA ( 21% sino se informa )<br>
                        <b>Columna E</b> Código de la Marca del Artículo (*)<br>
                        <b>Columna F</b> Código del Grupo del Artículo (*)<br>
                        <b>Columna G</b> Código de Moneda, PES/DOL/etc (*)<br><br>
                        * Columnas que pueden ir vacías, si es así se asignaran valores<br>
                        por defecto.<br>
                        Puede consultar los códigos ya definidos en los archivos de referencia<br>
                        o asignarlos en este formulario mediante la opción
                        <b>Modificar Grupos y/o Marcas</b><br>
                        Otra alternativa es asignar el valor 1 (uno) en las columnas E y F, y PES
                        en la columna G.
                        Para el caso de <i>Marca</i> se asignará 'Genérica' y para <i>Grupo</i>
                        se asignará 'General'<br><br>
                        NOTAS: <b>gohu</b> analiza repeticiónes de códigos de artículos, pero no
                        de nombres o descripciones de los mismos.<br>
                        El caracter <b>@</b> se asignará al final de cada codigo agregando tambien
                        su número de usuario. Ej: 304 sera 304@51, si 51 es su número de usuario.
                        </p>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN DE COMO PREPARAR EL ARCHIVO DE EXCEL -->


    </v-flex>
    <Confirmacion v-model='msg.msgAccion'
      :title=this.msg.msgTitle
      :body=this.msg.msgBody
      :visible=this.msg.msgVisible
      :buttons=this.msg.msgButtons
      @click="msgRespuesta">
    </Confirmacion>
  </v-layout>
</template>

<script>
/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
//import helpers from '../helpers';
import axios from 'axios';
import XLSX from 'xlsx';
import Confirmacion from "./Forms/confirmacion.vue"
//const Helpers = use('Helpers')

export default {
  components: {
    Confirmacion,
  },  
  data: () => ({

    file: '',
    uploadPercentage: 0,

    progress: false,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    items: [],
    itemsExcel: [],
    mios: [],
    rubItems: [],
    rubValue: [],
    monItems: [],
    rubro_id: '',
    rubro: '',
    moneda: '',
    nuevoXls: '',
    xls: '',
    dataXls: '',
    xlsCargado: false,
    registrosXls: 0,
    encontradosXls: 0,
    importado: 0,
    aImportar: 0,
    lisItems: [],
    selected: [],
    showSelect: false,
    showModificarDatos: false,

    marcaSel_id: 0,
    grupoSel_id: 0,
    isLoadingMarcas: false,
    isLoadingGrupos: false,
    searchMarcas: '', // para el cuadro de busqueda de datatables
    searchGrupos: '', // para el cuadro de busqueda de datatables
    entriesMarcas: [],
    entriesGrupos: [],

    footerProps: {'items-per-page-options': [8, 12, 15, 100]},
    search: '', // para el cuadro de búsqueda de datatables  
    dialog: true, // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogComoPrepararElArchivoDeExcel: false,
    // definimos los headers de la datatables
    items: [],
    headers: [
      { text: 'CODIGO', value: 'codigo',      align: 'left', width: 100 , sortable: true},
      { text: 'NOMBRE', value:'nombre',       align: 'left', width: 300 , sortable: true},
      { text: 'MARCA',  value:'marca.nombre', align: 'left', width: 100 , sortable: true},
      { text: 'GRUPO',  value:'grupo.nombre', align: 'left', width: 100 , sortable: true},
      { text: 'MONEDA', value:'moneda',       align: 'left', width: 50  , sortable: true},
      { text: 'TASIVA', value:'tasiva',       align: 'left', width: 80  , sortable: true},
      { text: 'PRECIO', value:'precio',       align: 'end',  width: 120 , sortable: true},
      { text: 'ESTADO', value:'estado',       align: 'left', width: 50  , sortable: true},
    ],
    ip: [],
    md: [],
    mi: [],
    editedIndex: -1,

  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert']),
    ...mapState([
      'vinculosPadres', 'vinculosHijos', 'empresa','temas', 'datosEmpresa'
    ]),

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


  },
  watch: {

    searchMarcas (val) {
      if (this.isLoadingMarcas) return
      this.isLoadingMarcas = true
      return HTTP().get('/marcasbus')
        .then(({ data }) => {
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
      return HTTP().get('/grupos')
        .then(({ data }) => {
          this.entriesGrupos = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingGrupos = false))
    },


  },
  mounted () {
    return HTTP().get('/user/'+this.userId)
      .then(({ data }) => {
        this.lisItems = data[0].listas;
        return HTTP().get('/usersrubros')
          .then(({ data }) => {
            for (let i=0; i<=data.length-1; i++) {
              this.rubItems.push(data[i].rubro)
            }
            this.rubro = this.rubItems[0]
            this.rubro_id = this.rubro.id                    // ver, puede tener mas rubros
            return HTTP().get('/afipmonedas')
              .then(({ data }) => {
                this.monItems = data;
              })
          })
      })

    /*
    var data = [];
    for(var i = 3; i < 10; i++) {
      data.push({ id:i, preg:[] });
      data[data.length-1].preg.push( {pid: i, preg: "Aqui pregunta" });
    }
    console.log(data);
    */

    /*
    this.nodes = []
    this.nodes.push({user: 2, porrem: 0, tipo: 'IP'})
    this.nodes.push({user: 3, porrem: 0, tipo: 'MD'})
    this.nodes.push({user: 5, porrem: 0, tipo: 'MD'})
    this.nodes.push({user: 7, porrem: 0, tipo: 'MD'})
    this.nodes.push({user: 4, porrem: 0, tipo: 'MI'})
    this.nodes.push({user: 6, porrem: 0, tipo: 'MI'})
    this.nodes.push({user: 8, porrem: 0, tipo: 'MI'})

    const data = [
      { id: 2, tipo: 'PI', parentId: null },
      { id: 3, tipo: 'MD', parentId: 2},
      { id: 4, tipo: 'MD', parentId: 2},
      { id: 5, tipo: 'MI', parentId: 4},
      { id: 6, tipo: 'MI', parentId: 4},
      { id: 7, tipo: 'MD', parentId: 2},
      { id: 8, tipo: 'MD', parentId: 2},
      { id: 9, tipo: 'MI', parentId: 8},
    ];

    const idMapping = data.reduce((acc, el, i) => {
      acc[el.id] = i;
      return acc;
    }, {});

    let root;
    data.forEach(el => {
      if (el.parentId === null) {
        root = el;
        return;
      }
      const parentEl = data[idMapping[el.parentId]];
      parentEl.children = [...(parentEl.children || []), el];
    });

    console.log(root);
    */

  },
  methods: {
    closeForm(){
      this.dialog = false;
      router.push('/')
    },





    handleFileUpload(){
      this.file = this.$refs.file.files[0];
    },





    comoPrepararElArchivoDeExcel() {
      this.dialogComoPrepararElArchivoDeExcel = true
    },





    cerrarComoPrepararElArchivoDeExcel() {
      this.dialogComoPrepararElArchivoDeExcel = false
    },





    async submitFile(){
      //const Helpers = use('Helpers')
      //console.log(Helpers)

/*
      let formData = new FormData();
      formData.append('file', this.nuevoXls );
      formData.append('user', this.userId );
      formData.append('rubro', this.rubro.id );
      formData.append('vinculosHijos', this.$store.state.vinculosHijos);
      await HTTP().post('/importararticulos', formData)
        .then(({ response }) => { 
          this.mensaje = 'Los articulos han sido importados'
        })
*/

      let formData = new FormData();
      formData.append('file', this.file );
      formData.append('pathDocs', this.$store.state.datosEmpresa.pathDocs );

      await HTTP().post('/file-progress',
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: function( progressEvent ) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded/progressEvent.total))*100);
          }.bind(this)
        }
      ).then(function(){
        console.log('SUCCESS!!');
      })
      .catch(function(e){
        console.log(e, 'FAILURE!!');
      });

      /*
      axios.post( 'file-progress',
        formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: function( progressEvent ) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded/progressEvent.total))*100);
          }.bind(this)
        }
      ).then(function(){
        console.log('SUCCESS!!');
      })
      .catch(function(e){
        console.log(e, 'FAILURE!!');
      });
      */
    },





    aplicar() {
      let a = this.itemsMarcas.map(function(e) { return e.id; }).indexOf(this.marcaSel_id);
      let b = this.itemsGrupos.map(function(e) { return e.id; }).indexOf(this.grupoSel_id);
      for (let i=0; i<=this.selected.length-1; i++) {
        if (a!=-1) {
          this.selected[i].marca.id     = this.itemsMarcas[a].id
          this.selected[i].marca.nombre = this.itemsMarcas[a].nombre
        }
        if (b!=-1) {
          this.selected[i].grupo.id     = this.itemsGrupos[b].id
          this.selected[i].grupo.nombre = this.itemsGrupos[b].nombre
        }
        if (this.moneda.codigo!=undefined) {
          this.selected[i].moneda       = this.moneda.codigo
        }
      }
    },





    async importarArt() {
      /*
      let formData = new FormData();
      formData.append('file', this.nuevoXls );
      formData.append('user', this.userId );
      formData.append('rubro', this.rubro.id );
      formData.append('vinculosHijos', this.$store.state.vinculosHijos);
      this.progress = true
      await HTTP().post('/importararticulos', formData)
        .then(({ data }) => { 
          this.progress = false
          this.mensaje = data+' articulos han sido importados.'
        })
      */

      let formData = new FormData();
      formData.append('file', this.nuevoXls );
      formData.append('user', this.userId );
      formData.append('rubro', this.rubro.id );
      formData.append('vinculosHijos', this.$store.state.vinculosHijos);
      this.progress = true
      await HTTP().post('/importararticulos', 
        formData, {
          onUploadProgress: function( progressEvent ) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded/progressEvent.total))*100);
          }.bind(this)
        })
        .then(({ data }) => { 

          this.progress = false
          if (data=='No existe la hoja1') {
            this.msg.msgTitle = 'No existe la hoja1 en el archivo Excel'
            let m = '¡Debe nombrar como <b>hoja1</b> la hoja donde se encuentran los artículos.<br>'
            m += 'Modifique el archivo y vuelva a intentar.'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'aceptar'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.mensaje('Ha agregado '+data+' nuevos artículos.',this.temas.forms_titulo_bg,1500)
          }

        })

    },





    cargarXls() {
      if (this.nuevoXls.name != undefined) {
        try {

          this.progress = true
          this.xlsCargado = true;
          let file = this.nuevoXls;
          let reader = new FileReader();
          
          debugger
          reader.onload = async function (e) {
            let data = new Uint8Array(e.target.result);
            let workbook = XLSX.read(data, { type: "array" });
            let worksheet = workbook.Sheets[workbook.SheetNames[0]];
            let sheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            let dataset = await this.parseFileContent(sheet);
          }.bind(this);
          reader.readAsArrayBuffer(file);
          this.mios = [];
          this.aImportar = 0;
          this.encontradosXls = 0;
          // ver de poner el rubro, por ahora van todos.

          debugger
          let a = HTTP().post('/userarticulosimp')
            .then(({ data }) => {

              debugger
              if (data) {
                for (let i=0; i<=data.length-1; i++) {
                  this.mios.push({ 
                    codigo: data[i].codigo,
                  })
                }

                debugger
                for (let i=0; i<=this.itemsExcel.length-1; i++) {
                  let encontro = false
                  for (let j=0; j<=this.mios.length-1; j++) {
                    if (this.itemsExcel[i].codigo==this.mios[j].codigo) {
                      this.itemsExcel[i].estado = 'M'
                      this.encontradosXls ++
                      encontro = true
                      break
                    }
                  }

                  debugger
                  if (!encontro) {
                    this.itemsExcel[i].grupo = {id:1, nombre: 'General'}
                    this.itemsExcel[i].marca = {id:1, nombre: 'Generico'}
                    this.aImportar ++
                  }
                }

                this.items = this.itemsExcel.filter(function(it) {
                  return it.estado == 'N'
                })

                this.progress = false

                if (this.aImportar==0) {
                  this.msg.msgTitle = 'No hay artículos nuevos'
                  let m = '¡Todos los artículos especificados en el archivo de Excel seleccionado<br>'
                  m += 'ya existen en la base de datos. No se pueden volver a Importar.'
                  this.msg.msgBody = m
                  this.msg.msgVisible = true
                  this.msg.msgAccion = 'aceptar'
                  this.msg.msgButtons = ['Aceptar']
                } else {
                  let m = ''
                  if (this.aImportar==1) {
                    this.msg.msgTitle = '¡Hay un artículo nuevo!'
                    m = '¡Se ha encontrado un articulo nuevo para ser importado.<br>'
                  } else {
                    this.msg.msgTitle = '¡Hay artículos nuevos!'
                    m = '¡Se han encontrado '+this.aImportar+' artículos nuevos para ser importados.<br>'
                  }
                  m += 'Es un buen momento para que asigne tanto el Grupo como la Marca a cada uno de los nuevos articulos.<br>'
                  m += 'Active <b>Modificar Grupos y/o Marcas</b> en e pie del formulario para realizar estas asignaciones.'
                  this.msg.msgBody = m
                  this.msg.msgVisible = true
                  this.msg.msgAccion = 'aceptar'
                  this.msg.msgButtons = ['Aceptar']
                }
              }
            })
            .catch(err => {
              console.log(err)
            })

        } catch (exception) {
        }
      } else {
        this.xlsCargado = false;
      }
    },





    parseFileContent(sheet) {
      this.itemsExcel = []

      alert('1')
//    alert(sheet)

      debugger
      for (let i=0; i<=sheet.length-1; i++) {
        let r = sheet[i]
        if (r[0]!=undefined) {
          this.itemsExcel.push({
            codigo: r[0]+'@'+this.userId,
            nombre: r[1],
            marca:  r[3],
            grupo:  r[4],
            precio: r[2],
            tasiva: r[5] == null ? 21 : r[5],
            moneda: r[6] == null ? 'PES' : r[6],
            estado: 'N',
            seleccionado: false
          })
        }
      }
      this.registrosXls = sheet.length;
    },





    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },





    msgRespuesta(op) {
      this.msg.msgVisible = false;
    },





    formatoImporte(valor) {
      let val = (valor/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },





  }
};

</script>
