<template>
  <v-layout align-start>
    <v-flex>

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
        <span class="headdline">Administración de Grupos</span>
      </v-toolbar>

      <v-row justify="center">
        <v-col cols="2" sm="2" md="2"></v-col>
        <v-col cols="8" sm="8" md="8">
          <v-card
            :disabled="!panel1"
            style="height: 545px;"
            v-scroll.self="onScroll"
            class="overflow-y-auto">
            <v-sheet class="pa-4" :color="temas.forms_titulo_bg">
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-select
                    v-model="rubro"
                    :items="rubItems"
                    item-value="id"
                    item-text="nombre"
                    label="Rubro..."
                    :color="temas.forms_titulo_bg"
                    :dark="temas.forms_titulo_dark==true"
                    dense return-object
                    @change="fetchGrupos">
                  </v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="8" sm="8" md="8">
                  <v-text-field
                    v-model="search"
                    :color="temas.forms_titulo_bg"
                    :dark="temas.forms_titulo_dark==true"
                    label="Ingrese el grupo a buscar"
                    flat solo-inverted hide-details clearable
                    clear-icon="mdi-close-circle-outline">
                  </v-text-field>
                </v-col>
                <v-col class="pt-4 pl-10" cols="4" sm="4" md="4">
                  <v-btn
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="white--text"
                    @click="addFather">
                    Nuevo Grupo Principal
                  </v-btn>
                </v-col>
              </v-row>
            </v-sheet>
            <v-card-text>
              <v-treeview
                return-object
                item-key="id"
                hoverable activatable dense
                :color="temas.forms_titulo_bg"
                :item-color="temas.forms_titulo_bg"
                :items="items"
                :filter="filter"
                :search="search">
                <template slot="append" slot-scope="{ item }">

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        class="mr-2" fab
                        x-small
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="addChild(item)" v-on="on">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Nuevo Grupo</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-if="!edit"
                        class="mr-2" fab
                        x-small
                        :color="item.activo ? temas.cen_btns_bg : temas.forms_titulo_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="actDesactChild(item)" v-on="on">
                        <v-icon>{{item.activo ?
                          'mdi-eye-outline' :
                          'mdi-eye-off-outline' }}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>{{item.activo ? 'Desactivar' : 'Activar'}}</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn v-if="!edit"
                        class="mr-2" fab
                        x-small
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="delChild(item)" v-on="on">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Borrar</span>
                  </v-tooltip>
                </template>

                <template slot="label" slot-scope="{ item }">
                  <span @click="openDialog(item)"
                    color="red">
                    {{ item.id }} {{ item.name }} {{ '#'+ item.ctt }}
                  </span>

                </template>
              </v-treeview>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="2" sm="2" md="2"></v-col>
      </v-row>

      <v-dialog
        v-model="panel2"
        scrollable
        persistent :overlay="false"
        max-width="500px"
        transition="dialog-transition">
        <template v-slot:activator="{ on }"></template>
        <v-card v-show="panel2">

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

            <v-btn v-show="editado.nombre!=''"
              class="mr-2" fab x-small
              :color="temas.cen_btns_bg"
              :dark="temas.cen_btns_dark==true"
              @click="grabar" v-on="on">
              <v-icon>mdi-content-save</v-icon>
            </v-btn>

          </v-toolbar>
          <v-form ref="form">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12" md="12">
                    <v-text-field
                      v-model="editado.nombre"
                      :color="temas.forms_titulo_bg"
                      autofocus
                      label="Nombre"
                      dense
                      required
                      :counter="40"
                      :maxlength="40">
                    </v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="2" sx="6" mx="4">
                    <v-switch
                      label="Activo"
                      dense
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
  import HTTP from '../http';
  import { mapGetters, mapState, mapMutations } from 'vuex';
  import router from '../router';
  import moment from 'moment';
  import SBar from './Forms/snackbar.vue';
  import Confirmacion from "./Forms/confirmacion.vue"

  const pause = ms => new Promise(resolve => setTimeout(resolve, ms))

  export default {
    components: {
      SBar,
      Confirmacion,
    },
    data: () => ({
      nuevoRoot: false,
      itemActual: null,
      snackbar: false,      // para el mensaje del snackbar
      textSnack: 'texto',   // texto que se ve en el snackbar
      strIdGrupos: '',
      scrollInvoked: 0,
      panel1: true,
      panel2: false,
      edit: false,
      rubro: '',
      rubro_id: 0,
      rubItems: [],
      items: [],
      item: [],
      active: [],
      search: null,
      editado: {
        activo: '',
        id: '',
        nombre: '',
        padre: '',
      },
      msg: {
        msgAccion: null,
        msgVisible: false,
        msgTitle: '',
        msgBody: '',
        msgButtons: ['']
      },
    }),
    mounted() {
      moment.locale('es');
    },
    created () {
      this.rubro_id = 0
      const b = HTTP().get('/usersrubros')
      .then(({ data }) => {
        for (let i=0; i<=data.length-1; i++) {
          this.rubItems.push(data[i].rubro)
          if (this.rubro_id==0) {
            this.rubro_id = data[0].rubro.id
          }
        }
        debugger
        this.rubro = this.rubItems[0]
        this.rubro_id = this.rubItems[0].id
        this.fetchGrupos(this.rubro)
      })
    },



    computed: {
      ...mapGetters('authentication', ['isLoggedIn','userId']),      
      ...mapState(['temas']),
      filter () {
        return undefined 
      },
      formTitle () {
        return 'Grupo';
      },
    },



    methods: {
      ...mapMutations(['alert','closeAlert']),
      mensaje(mensaje, color, tiempo) {
        this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
        setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
      },



      onScroll () {
        this.scrollInvoked++
      },



      addFather(item) {
        debugger
        this.nuevoRoot = true
        this.openDialog(null)
      },



      addChild(item) {
        debugger
        this.nuevoRoot = false
        if (!item.children) {
          this.$set(item, "children", []);
        }
        const name = ''
//      const name = `${item.name} (${item.children.length})`;
        const id = this.nextId++;
        const activo = true
        const padre = item.padre
        item.children.push( { activo, id , name, padre } );
        HTTP().post("/grupos", 
          {
            nombre: name,
            rubro_id: this.rubro_id,
            grupo_id: item.id,
            activo: 1
          })
          .then((res) => {
            debugger
            this.$set(item.children[item.children.length-1], "activo", res.data.activo);
            this.$set(item.children[item.children.length-1], "id",     res.data.id);
            this.$set(item.children[item.children.length-1], "name",   res.data.nombre);
            this.$set(item.children[item.children.length-1], "padre",  res.data.grupo_id);
            this.$set(item.children[item.children.length-1], "ctt",    res.data.ctt ? res.data.ctt : 0);
            this.$set(item.children[item.children.length-1], "state", {disabled: false} );
            this.editado.activo = res.data.activo
            this.editado.id     = res.data.id
            this.editado.nombre = res.data.nombre
            this.editado.ctt    = res.data.ctt
            this.editado.padre  = res.data.grupo_id
            debugger
            let a = item.children[item.children.length-1]
            this.openDialog(item.children[item.children.length-1])
          })
          .catch((err) => {
            console.log(err);
        })
      },



      actDesactChild(item) {
        debugger
        this.itemActual = item
        let m = ''
        let armoObjeto = this.puedoDesactivar(item)
        let articulosAsignados = this.sumoArticulosAsignados(armoObjeto)
        this.strIdGrupos = this.strDeGrupos(armoObjeto)
        this.strIdGrupos = this.strIdGrupos.substring(0,this.strIdGrupos.length-1).split(',')
        if (item.activo) {
          if (articulosAsignados>0) {
            this.msg.msgTitle = '¡Error!'
            m += 'No se puede desactivar este grupo.<br>,'
            m += 'El o alguno de sus hijos tienen artículos asignados!'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'aceptar'
            this.msg.msgButtons = ['Aceptar']
            return
          } else {
            this.msg.msgTitle = '¡Desactivar Grupo!'
            m += '¿Confirma desactivar el grupo?<br>'
            m += 'Todos los subgrupos dependientes también serán desactivados!'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'desactivar grupo'
            this.msg.msgButtons = ['Aceptar','Cancelar']
          }
        } else {
          this.msg.msgTitle = 'Activar Grupo!'
          this.msg.msgBody = '¿Confirmar activar este grupo?'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'activar grupo'
          this.msg.msgButtons = ['Aceptar', 'Cancelar']
        }
      },





      delChild(item) {
        debugger
        this.itemActual = item
        let m = ''
        let armoObjeto = this.puedoDesactivar(item)
        let cttArtAsignados = this.sumoArticulosAsignados(armoObjeto)
        this.strIdGrupos = this.strDeGrupos(armoObjeto)
        this.strIdGrupos = this.strIdGrupos.substring(0,this.strIdGrupos.length-1).split(',')
        debugger
        if (cttArtAsignados>0) {
          this.msg.msgTitle = '¡Error!'
          m += 'No se puede borrar este grupo.<br>,'
          m += 'El o alguno de sus hijos tienen artículos asignados!'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'aceptar'
          this.msg.msgButtons = ['Aceptar']
          return
        } else {
          this.msg.msgTitle = '¡Borrar Grupo!'
          m += '¿Confirma borrar el grupo?<br>'
          m += 'Todos los subgrupos dependientes también serán borrados!'
          this.msg.msgBody = m
          this.msg.msgVisible = true
          this.msg.msgAccion = 'borrar grupo'
          this.msg.msgButtons = ['Aceptar','Cancelar']
        }
      },





      msgRespuesta(op) {
        debugger
        if (op=='Aceptar') {
          if (this.msg.msgAccion=='activar grupo' ||
              this.msg.msgAccion=='desactivar grupo' ||
              this.msg.msgAccion=='borrar grupo') {
            return HTTP().post("/gruposchanges", {
              ids: this.strIdGrupos,
              accion: (this.msg.msgAccion=='activar grupo' || this.msg.msgAccion=='desactivar grupo') ? 'activardesactivar' : 'borrar',
              activo: this.itemActual.activo
              })
              .then((res) => {
                this.fetchGrupos(this.rubro)
                this.msg.msgVisible = false;
                debugger
              })
          }
        }
        this.msg.msgVisible = false;
      },





      openDialog(item) {
        debugger
        if (item) {
          this.nuevoRoot = false
          this.editado.activo = item.activo
          this.editado.id = item.id
          this.editado.nombre = item.name
          this.editado.padre = item.padre
          this.editado.ctt = item.ctt
          this.item = item
        } else {
          this.nuevoRoot = true
          this.item.name = ''
          this.editado.activo = true
          this.editado.id = null
          this.editado.nombre = ''
          this.editado.padre = null
          this.editado.ctt = 0
        }
        this.panel1 = false;
        this.panel2 = true;
      },



      closeForm(){
        this.panel1 = false;
        this.panel2 = false;
        router.push('/')
      },



      grabar() {
        debugger
        this.panel1 = true;
        this.panel2 = false;
        this.edit = false;
        this.item.name = this.editado.nombre
        if (!this.nuevoRoot) {

          HTTP().patch(`grupos`, {
            id: this.editado.id,
            rub: this.rubro_id,
            nombre: this.editado.nombre,
            activo: this.editado.activo })
            .then ((res) => {
              debugger
              if (res=='error') {
                this.mensaje('¡Opps!, hubo un problema al actualizar el grupo!, consulte con la mesa de ayuda Gohu.', this.temas.cen_card_activo_bg, 3000) 
              } else {
                this.mensaje('El grupo se actualizó correctamente', this.temas.cen_card_activo_bg, 1500) 
                this.fetchGrupos(this.rubro)
              }
            }).catch((err)=>{
              console.log(err);
            })

        } else {

          debugger
          HTTP().post("/grupos", 
            { nombre: this.editado.nombre, rubro_id: this.rubro_id, grupo_id: null, activo: 1 })
            .then((res) => {

              debugger
              if (res=='error') {
                this.mensaje('¡Opps!, hubo un problema al actualizar el grupo!, consulte con la mesa de ayuda Gohu.', this.temas.cen_card_activo_bg, 3000) 
              } else {
                this.mensaje('¡El grupo se agrego correctamente!', this.temas.cen_card_activo_bg, 1500) 
                this.fetchGrupos(this.rubro)
              }

            })
            debugger

        }
        debugger
      },



      cancelar() {
        this.panel1 = true;
        this.panel2 = false;
        this.edit = false;
      },



      async fetchGrupos(item) {
        debugger
        this.rubro_id = item.id
//      return HTTP().get('/gruposrubros/'+this.grupo.id)
        return HTTP().get('/gruposrubros/'+item.id).then(response => {
          let aux = [];
          debugger
          for(var i in response.data[0]) {
            aux.push({
              id:     Number(response.data[0][i].id),
              name:   response.data[0][i].nombre,
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
          debugger
          this.items = getNestedChildren2(aux,0)
          return
        })
      },
      
      puedoDesactivar(item) {
        function buscoNodo(arr) {
          let ids = []
          ids.push({id: arr.id, ctt: arr.ctt})
          if (arr.children!=undefined) {
            for (let i=0; i<=arr.children.length-1; i++) {
              ids.push(buscoNodo(arr.children[i]))
            }
          }
          return ids
        }
        return buscoNodo(item)
      },

      sumoArticulosAsignados(item) {
        function buscoNodo(arr) {
          let ctt = 0
          for (let i=0; i<=arr.length-1; i++) {
            if (arr[i].length>0) {
              ctt += buscoNodo(arr[i])
            } else {
              ctt += arr[i].ctt
            }
          }
          return ctt
        }
        return buscoNodo(item)
      },

      strDeGrupos(item) {
        function buscoNodo(arr) {
          let str = ''
          for (let i=0; i<=arr.length-1; i++) {
            if (arr[i].length>0) {
              str += buscoNodo(arr[i])
            } else {
              str += arr[i].id+','
            }
          }
          return str
        }
        return buscoNodo(item)
      },

    }

  }
</script>
