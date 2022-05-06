<template>
  <div>
    <v-card flat>
      <v-card-text>
        <v-container>
          <v-row v-show="editarPedido==true" class="pt-0 pb-0">
            <v-col cols="2" sm="2" md="2">
              <v-text-field
                class="pt-0"
                :disabled="editedIndexArt>-1"
                ref="buscar"
                label="código o descripción o código de barra"
                :color="temas.forms_titulo_bg"
                autofocus
                v-model="busArtPed"
                @blur="buscarArtPed(false)">
              </v-text-field>
            </v-col>
            <v-col cols="4" sm="4" md="4">
              <v-text-field
                disabled
                class="pt-0 caption"
                label="Descripción"
                v-model="editadoArt.nombre">
              </v-text-field>
            </v-col>
            <v-col cols="1" sm="1" md="1">
              <v-text-field
                v-model="editadoArt.cantidad"
                ref="cant"
                class="pt-0 text--left"
                label="Cantidad"
                @change="guardarArt()">
              </v-text-field>
            </v-col>
            <v-col cols="1" sm="1" md="1">
              <v-text-field
                v-model="editadoArt.tasadescuento"
                disabled
                class="pt-0 text--left"
                label="Des%">
              </v-text-field>
            </v-col>
            <v-col cols="2" sm="2" md="2">
              <v-text-field
                disabled
                class="pt-0 text--left"
                v-model="editadoArt.precio"
                label="Precio">
              </v-text-field>
            </v-col>
            <v-col cols="2" sm="2" md="2">
              <v-text-field
                disabled
                class="pt-0 text--left"
                v-model="editadoArt.total"
                label="TOTAL">
              </v-text-field>
            </v-col>
          </v-row>

          <v-row class="pb-0">
            <v-col v-show="seleccionarArticulo == true"
              cols="12" sm="12" md="12">
              <v-data-table
                class="elevation-3 pt-0 pb-0"
                :headers="headersSelArt"
                :color="temas.forms_titulo_bg"
                :items="selArtPed"
                dense
                single-select
                @click:row="selArtClick"
                :footer-props="footerProps10">
                <template v-slot:item.precio="{ item }">
                  <span
                    disable
                    dark>${{ formatoImporte(item.precio) }}
                  </span>
                </template>
              </v-data-table>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>

    <div class="pl-4 pr-4">
      <v-data-table
        :headers="headersPed"
        :items="articulos"
        dense
        class="elevation-3 pl-0">

        <template v-slot:item.activo="{ item }">
          <v-chip
            :color="getColor(item.activo)"
            dark>{{item.activo?'Sí':'No'}}
          </v-chip>
        </template>

        <template #item.nombre="{ value }">
          <div class="text-truncate" style="max-width: 245px">
            {{ value }}
          </div>
        </template>
        <template v-slot:item.precio="{ item }">
          <v-badge v-if="item.texto=='Promocion'"
            class="pt-2"
            :content="item.pubunidades>0 ? item.pubunidades : '0'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true" left>
          </v-badge>
          <span disable dark>${{ formatoImporte(item.precio) }}</span>
        </template>

        <template v-slot:item.cantidad="{ item }">
          <span disable dark>{{ formatoImporte(item.cantidad) }}</span>
        </template>

        <template v-slot:item.total="{ item }">
          <span disable dark>${{ formatoImporte(item.total) }}</span>
        </template>

        <template v-slot:item.tasadescuento="{ item }">
          <span disable dark>{{ formatoImporte(item.tasadescuento) }}</span>
        </template>

        <template v-slot:item.importedescuento="{ item }">
          <span disable dark>${{ formatoImporte(item.importedescuento) }}</span>
        </template>

        <template v-slot:item.accion="{item}">

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab x-small
                :color="temas.cen_btns_bg"
                :dark="temas.cen_btns_dark==true"
                class="mr-2"
                @click="sumarRestar(item, 1)" v-on="on">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </template>
            <span>Sumar</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab x-small
                :color="temas.cen_btns_bg"
                :dark="temas.cen_btns_dark==true"
                class="mr-2"
                @click="sumarRestar(item, -1)" v-on="on">
                <v-icon dark>mdi-minus</v-icon>
              </v-btn>
            </template>
            <span>Restar</span>
          </v-tooltip>

          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on"
                @click="setAccionesArtPed(item)">
                <v-icon>mdi-18px mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list dense>
              <v-list-item-group :color="temas.forms_titulo_bg">
                <v-list-item
                  v-for="(item, i) in accionesArtPed" :key="i">
                  <v-list-item-icon>
                    <v-icon
                      class="font-size: 24px"
                      @click="selAccionArtPed(item)" v-text="item.icon">
                    </v-icon>
                  </v-list-item-icon>
                  <v-list-item-content>
                    <v-list-item-title
                      class="caption"
                      @click="selAccionArtPed(item)">{{ item.nombre }}
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </template>
      </v-data-table>
    </div>
    <SBar></SBar>
  </div>
</template>

<script>
/* eslint-disable */
import HTTP from '../../http';
import SBar from './../Forms/snackbar.vue';
import { mapState, mapMutations } from 'vuex';
export default {
  components: {
    SBar,
  },
  props: {
  },
  data: () => ({
    articulos: [],
    editarPedido: true,
    editadoArt: [],
    editedIndexArt: -1,
    seleccionarArticulo: false,
    busArtPed: '',
    selArtPed: [],
    footerProps10: {'items-per-page-options': [10]},
    headersSelArt: [
      { text: 'NID', value:'id', align: 'left', width: 50},
      { text: 'CODIGO', value:'codigo', align: 'left', width: 120},
      { text: 'NOMBRE', value:'nombre', align: 'left', width: 350},
      { text: 'STOCK', value:'stock', align: 'end', width: 100},
      { text: 'PRECIO', value:'precio', align: 'end', width: 100},
    ],
    headersPed: [
      { text: 'Código', value:'codigo', align: 'left', width: 130},
      { text: 'Descripción', value:'nombre', align: 'left', width: 320},
      { text: 'Ctt', value:'cantidad', align: 'end', width: 100},
      { text: '%Desc.', value:'tasadescuento', align: 'end', width: 90},
      { text: 'Descuento', value:'importedescuento', align: 'end', width: 120},
      { text: 'Precio', value:'precio', align: 'end', width: 120},
      { text: 'TOTAL', value:'total', align: 'end', width: 150},
      { text: 'Acciones', value: 'accion', sortable: false },
    ],
    editadoArt: {
      id: '',
      articulo_id: '',
      codigo: '',
      codbar: '',
      nombre: '',
      deposito_id: '',
      unidad_id: '',
      unidadNombre: '',
      moneda_id: 51,
      monedaNombre: '',
      iva_id: '',
      ivaNombre: '',
      cantidad: 0,
      stock: 0,
      costo: 0,
      precio: 0,
      preciooriginal: 0,
      tasadescuento: 0,
      importedescuento: 0,
      total: 0,
      texto: '',
      vencimiento: '',
      padre_id: null,
      coeficiente: 1,
      esPromocion: false,
      pubprecio: 0,
      pubtasdes: 0,
      pubenvio: 0,
      pubunidades: 0,
      pubestado: ''
    },
    defaultItemArt: {
      id: '',
      articulo_id: '',
      codigo: '',
      codbar: '',
      nombre: '',
      deposito_id: '',
      unidad_id: '',
      unidadNombre: '',
      moneda_id: '',
      monedaNombre: '',
      iva_id: '',
      ivaNombre: '',
      cantidad: 0,
      stock: 0,
      costo: 0,
      precio: 0,
      preciooriginal: 0,
      tasadescuento: 0,
      importedescuento: 0,
      total: 0,
      texto: '',
      vencimiento: '',
      padre_id: null,
      coeficiente: 1,
      esPromocion: false,
      pubprecio: 0,
      pubtasdes: 0,
      pubenvio: 0,
      pubunidades: 0,
      pubestado: ''
    },
  
  }),

  computed: {
    ...mapState([
      'sucursal',
      'sucursales',
      'temas',
    ]),
  },

  methods: {
    ...mapMutations([
      'alert',
      'closeAlert',
    ]),

    handleClick(op) {
      this.$emit('click', op);
    },
    
    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },
    
    selArtClick (item) {
      this.seleccionarArticulo = false;
      this.busArtPed = item.codigo
      this.buscarArtPed(true)
    },
    
    guardarArt(item) {
      debugger
      if (this.editadoArt.cantidad == 0) {
        this.$refs.cant.focus()
        return 
      } else if (this.editadoArt.codigo == '') {
        //this.$refs.buscar.focus()
        return 
      }
      let pos    = this.estaElArticulo(this.editadoArt.articulo_id, this.editadoArt.esPromocion)
      if (pos!=-1) {
        // si el articulo esta lo borro antes de agregarlo ( ojo, puede haber 2 items: 1ro con promo 2no normal)
        let cod = this.articulos[pos].codigo
        this.articulos = this.articulos.filter(function(arts) {
          return arts.codigo != cod
        })
        pos = -1
      }
      let ctt    = Number(this.editadoArt.cantidad)
      let prePro = this.editadoArt.pubprecio
      let pre    = this.editadoArt.precio

      if (this.editadoArt.pubprecio) {
        if (ctt > this.editadoArt.pubunidades) {
          this.actualizoArtPed(this.editadoArt.pubunidades, prePro, pos, true)
          this.actualizoArtPed(ctt-this.editadoArt.pubunidades, pre, -1, false)
        } else {
          this.actualizoArtPed(ctt, prePro, pos, true)
        }
      } else {
        this.actualizoArtPed(ctt, pre, pos, false)
      }
      this.calculos()
      this.nuevoArt()
      this.$refs.buscar.focus()
    },

    estaElArticulo(articulo, esPromocion) {
      let pos = -1
      for (let i=0; i<=this.articulos.length-1; i++) {
        if ((this.articulos[i].articulo_id==articulo && this.articulos[i].esPromocion==esPromocion))  {
          pos = i
          break
        }
      }
      return pos
    },

    actualizoArtPed(ctt, pre, pos, promo) {
      debugger
      if (pos==-1) {
        this.articulos.push({
          id:               this.articulos.length+1,
          comprobante_id:   null,
          articulo_id:      this.editadoArt.articulo_id,
          codigo:           this.editadoArt.codigo,
          nombre:           this.editadoArt.nombre,
          deposito_id:      this.editadoArt.deposito_id,
          unidad_id:        this.editadoArt.unidad_id,
          moneda_id:        this.editadoArt.moneda_id,
          iva_id:           this.editadoArt.iva_id,
          cantidad:         Number(ctt),
          stock:            Number(ctt),
          costo:            this.editadoArt.costo,
          precio:           pre,
          preciooriginal:   this.editadoArt.preciooriginal,
          tasadescuento:    promo ? this.editadoArt.tasadescuento : 0,
          importedescuento: promo ? this.editadoArt.importedescuento*Number(ctt) : 0,
          total:            Number(ctt)*pre,
          texto:            promo==true ? 'Promocion' : '',
          vencimiento:      '',
          padre_id:         this.editadoArt.padre_id,
          coeficiente:      this.editadoArt.coeficiente,
          esPromocion:      promo,
          estado:           'new'
        })
      } else {
        if (this.editedIndexArt!=-1) {  // Estoy modificando, reemplazo la cantidad ingresada
          this.articulos[pos].cantidad = ctt
        } else {                        // Estoy agregando, sumo
          this.articulos[pos].cantidad += ctt
        }
        this.articulos[pos].total = ctt*pre
      }
    },

    buscarArtPed(estricto) {

      if (this.busArtPed=='') { // NO HAY NADA QUE BUSCAR
        this.seleccionarArticulo = false
        return
      }

      this.seleccionarArticulo = false
      let b = this.busArtPed
    //let v = this.$store.state.vinculosPadres
      let v = []
      v.push(this.$store.state.proveedor.id)

      return HTTP().post('/userarticulosfac', {

        search: b,
        vinculos: v,
        estricto: estricto,
        userex: this.$store.state.proveedor

      }).then(({ data }) => {
          
          debugger
          if (data.length==0) {

            this.mensaje('¡No existe el artículo!', this.temas.forms_titulo_bg, 1500)
            this.$refs.buscar.focus()

          }

          else if (data.length==1) {

            let des = 0
            let pordes = 0

            this.editedIndexArt = -1
            for (let i=0; i<=this.articulos.length-1; i++) {
              if (data[0].id==this.articulos[i].articulo_id) {
                this.editedIndexArt = i
                break
              }
            }

            if (this.editedIndexArt==-1) {  // es nuevo en la lista
              this.editadoArt.cantidad = 1
              this.editadoArt.pubprecio    = 0
              this.editadoArt.pubtasdes    = 0
              this.editadoArt.pubenvio     = 0
              this.editadoArt.pubunidades  = 0
              this.editadoArt.pubestado    = ''
            } else {                        // ya estaba en la lista
              this.editadoArt.cantidad = this.articulos[this.editedIndexArt].cantidad
            }

            // ESTA EN PROMOCION
            this.editadoArt.precio          = data[0].precio
            this.editadoArt.preciooriginal  = data[0].precio
            this.editadoArt.total           = this.editadoArt.precio*this.editadoArt.cantidad

            if (data[0].pubunidades>0 && data[0].pubestado=='P') {

              if (data[0].pubunidades==1) {
                this.mensaje('¡Este artículo esta en promoción!, última unidad disponible!', this.temas.forms_titulo_bg, 4000)
              } else {
                this.mensaje('¡Este artículo esta en promoción!, hay '+ data[0].pubunidades +' unidades disponibles!', this.temas.forms_titulo_bg, 4000) 
              }

              des = (data[0].precio-data[0].pubprecio) * this.editadoArt.cantidad
              pordes = data[0].pubtasdes
              this.editadoArt.esPromocion     = true
              this.editadoArt.texto           = 'Promocion'

              this.editadoArt.pubprecio       = data[0].pubprecio
              this.editadoArt.pubtasdes       = data[0].pubtasdes
              this.editadoArt.pubenvio        = data[0].pubenvio
              this.editadoArt.pubunidades     = data[0].pubunidades
              this.editadoArt.pubestado       = data[0].pubestado

              this.editadoArt.total           = this.editadoArt.pubprecio*this.editadoArt.cantidad

            } else {

              this.editadoArt.esPromocion     = false
              this.editadoArt.texto           = ''

            }

            this.editadoArt.codigo           = data[0].codigo
            this.editadoArt.articulo_id      = data[0].id
            this.editadoArt.nombre           = data[0].nombre
            this.editadoArt.codbar           = data[0].codbar
            this.editadoArt.unidad_id        = data[0].unimedid
            this.editadoArt.moneda_id        = data[0].monedaid
            this.editadoArt.iva_id           = data[0].ivaid
            this.editadoArt.monedaNombre     = data[0].simbolo
            this.editadoArt.unidadNombre     = data[0].unimed
            this.editadoArt.ivaNombre        = data[0].tasa               /////// ????????????????????
            this.editadoArt.costo            = data[0].costo
            this.editadoArt.tasadescuento    = pordes
            this.editadoArt.importedescuento = des
            this.editadoArt.deposito_id      = null //this.depItems[0].id
            this.editadoArt.padre_id         = data[0].padre_id
            this.editadoArt.coeficiente      = data[0].coeficiente

            this.$refs.cant.focus()
            this.seleccionarArticulo = false

          } else {

            this.selArtPed = []
            for (let i=0; i<=data.length-1; i++) {
              let pre = data[i].precio
              this.selArtPed.push({
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
                ivaNombre:         data[i].tasa,
                costo:             data[i].costo,
                precio:            pre,
                tasadescuento:     0,
                importedescuento:  0,
                deposito_id:       null,
                stock:             data[i].stock == null ? 0 : data[i].stock,
                pubprecio:         data[i].pubprecio,
                pubtasdes:         data[i].pubtasadescuento,
                pubenvio:          data[i].pubenvio,
                pubunidades:       data[i].pubunidades,
                pubestado:         data[i].pubestado
              })
            }
            
            this.seleccionarArticulo = true;
          
          }
        })
    },

    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },

    nuevoArt() {
      this.busArtPed = ''
      this.dialogArt = true;
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.formTitleArt = 'Ingreso de Artículos en el Pedido'
      this.editedIndexArt = -1;
      this.seleccionarArticulo = false;
    },

    calculos(item) {
      this.totalPedido = 0
      for (let i=0; i<=this.articulos.length-1; i++) {
        this.totalPedido += this.articulos[i].total
      }
    },

    async selAccionArtPed(item) {
      if (item.nombre=='Editar' && item.texto!='Promocion') {
        this.editarArt(this.itemActual)
      } else if (item.nombre=='Borrar') {
        this.preguntoBorrarArt(this.itemActual) 
      }
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

  },
};
</script>
