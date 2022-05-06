<template>
  <v-row justify="center" >
    <!--<v-dialog v-model="visible" persistent max-height="900" max-width="900">-->
    <v-dialog v-model="visible" max-height="900" max-width="900">
      <v-card>
        <v-card-title
          class="headline">BUSCAR ARTICULOS {{ inicial }}
        </v-card-title>
        <v-text-field
          label="código o descripción o código de barra"
          autofocus
          item-key="id"
          v-model="inicial"
          @change="buscarArticulo">
        </v-text-field>
        <v-data-table
          @click:row="rowClick"
          :headers="headers"
          :items="items"
          hide-default-footer
          dense>
        </v-data-table>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

/* eslint-disable */
import HTTP from '../../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../../router';

export default {
  props: {
    inicial: String,
    visible: Boolean,
  },
  data: () => ({
    items: [],
    busArt: '',
    //selectedId: false,
    //visible: true,
    headers: [
      { text:'NID', value: 'id' },
      { text:'CODIGO', value:'codigo'},
      { text:'NOMBRE', value:'nombre'},
      { text:'PRECIO', value:'precio'},
    ],
  }),
  beforecreate() {
    debugger
    console.log('beforecreate')
  },
  create() {
    debugger
    console.log('create')
  },
  beforemounted() {
    debugger
    console.log('beforemounted')
  },
  mounted() {
    debugger
    console.log('mounted')
  },
  mounted () {
    debugger
    this.busArt = this.inicial
    if (this.busArt.length>0) {
      this.buscarArticulo()  
    }
  },
  methods: {
//    handleClick(op) {
//      this.$emit('click', op);
//    },
    rowClick: function (item, row) {      
      debugger
      row.select(true);
      //this.selectedId = item.id
      this.$emit('click', item.codigo);
    },
    buscarArticulo() {
      debugger
      let b = this.inicial
      let v = this.$store.state.vinculosPadres
      this.items = []
      return HTTP().post('/userarticulosfac', {
        search: this.inicial,
        vinculos: v,
        estricto: false,
        userex: null
        })
        .then(({ data }) => {
          debugger
          for (let i=0; i<=data.length-1; i++) {
            this.items.push({id: data[i].id, codigo: data[i].codigo, nombre: data[i].nombre, precio: data[i].precio})
          }
        })
    },
  },
};
</script>
