<template>
  <!--<v-layout align-start>-->
  <v-layout class="pa-md-4 mx-lg-auto" row wrap justify-center>
    <v-flex>

      <v-tabs :color="temas.forms_titulo_bg">

        <v-tab href="#pedidos" v-if="!hayCarrito">
          Pedidos
        </v-tab>
        <v-tab-item value="pedidos">
          <v-container fluid>

            <v-data-table
              :headers="headers"
              :items="items"
              dense
              class="elevation-3"
              :single-expand="singleExpand"
              :expanded.sync="expanded"
              show-expand>
              <template v-slot:top>
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    fab
                    :color="temas.forms_titulo_bg"
                    :dark="temas.forms_titulo_dark==true"
                    x-small
                    @click="nuevoPed(false)">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>

                  <v-toolbar-title
                    :color="temas.forms_titulo_bg"
                    :dark="temas.forms_titulo_dark==true"
                    class="body-2" v-model="sucursal">
                    <v-chip class="ml-4"
                      :color="temas.barra_principal_bg"
                      :dark="temas.barra_principal_dark">
                      <b>PEDIDOS</b>
                    </v-chip>
                  </v-toolbar-title>

                  <!-- INGRESO DE ITEMS -->
                  <v-dialog v-model="dialog" max-width="1350px" persistent>
                    <template v-slot:activator="{ on }"></template>
                    <v-card>
                      <v-toolbar flat
                        :dark="temas.forms_titulo_dark==true"
                        :color="temas.forms_titulo_bg">
                        <v-btn
                          icon @click="cancelar"
                          :color="temas.forms_close_bg"
                          :dark="temas.forms_close_dark==true">
                          <v-icon>mdi-arrow-left-circle</v-icon>
                        </v-btn>
                        <span class="headdline">
                          {{ formTitlePed }} - Total de Artículos ingresados $
                          {{ formatoImporte(totalPedido) }}
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn v-show="editarPedido==true && articulos.length>0"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="ma-2 white--text"
                          @click="guardarPed">GUARDAR PEDIDO
                        </v-btn>
                      </v-toolbar>

                      <!-- ITEMS DEL COMPROBANTE -->
                      <!--<itemsCpr></itemsCpr>-->
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
                      <!-- FIN ITEMS DE COMPROBANTE -->

                    </v-card>
                  </v-dialog>
                  <!-- FIN INGRESO DE ITEMS -->

                  <!-- ERROR EN EL PEDIDO -->
                  <v-dialog v-model="dialogError" max-width="1200px" persistent>
                    <template v-slot:activator="{ on }"></template>
                    <v-card>
                      <v-toolbar flat
                        :dark="temas.forms_titulo_dark==true"
                        :color="temas.forms_titulo_bg">
                        <v-btn
                          icon @click="cancelarSelArtPedErr"
                          :color="temas.forms_close_bg"
                          :dark="temas.forms_close_dark==true">
                          <v-icon>mdi-arrow-left-circle</v-icon>
                        </v-btn>
                        <span class="headdline">
                          OPPPS! HAY PROBLEMAS CON ESTE PEDIDO
                        </span>
                        <v-spacer></v-spacer>
                        <v-btn
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="ma-2 white--text"
                          @click="arreglarPedido">ARREGLAR PEDIDO
                        </v-btn>
                      </v-toolbar>

                      <div>
                        <v-card class="pl-2 pt-2 pb-2 contenedor-galeria-fuente-aviso-pedido">
                          <br>Hay datos inconsistentes en este pedido!<br><br>
                          El proveedor puede haber cambiado precios o varios clientes pueden
                          estar comprando al mismo tiempo disminuyendo asi el stock disponible.<br>
                          En la columna <b>Error</b> se detalla el tipo de problema. Seleccione
                          <b>Arreglar Pedido</b> para que el sistema realice las modificaciones
                          necesarias por Ud.<br>
                          IMPORTANTE: Seran eliminadas las promociones que esten pausadas, o sin
                          unidades disponibles.
                          <br><br>
                          <br>
                          Detalles de los errores
                        </v-card>
                        <v-data-table
                          :headers="headersSelArtPedErr"
                          :items="selArtPedErr"
                          dense
                          class="elevation-3 pl-0">
                          <template #item.nombre="{ value }">
                            <div class="text-truncate" style="max-width: 245px">
                              {{ value }}
                            </div>
                          </template>

                          <template v-slot:item.preped="{ item }">
                            <span>${{ formatoImporte(item.preped) }}</span>
                          </template>
                          <template v-slot:item.preact="{ item }">
                            <span>${{ formatoImporte(item.preact) }}</span>
                          </template>
                          <template v-slot:item.unped="{ item }">
                            <span>{{ formatoImporte(item.unped) }}</span>
                          </template>
                          <template v-slot:item.stock="{ item }">
                            <span>{{ formatoImporte(item.stock) }}</span>
                          </template>
<!--
                          <template v-slot:item.accion="{item}">
                            <v-tooltip bottom>
                              <template v-slot:activator="{ on }">
                                <v-btn
                                  fab x-small
                                  :color="temas.cen_btns_bg"
                                  :dark="temas.cen_btns_dark==true"
                                  class="mr-2"
                                  @click="sumarRestar(item, -1)" v-on="on">
                                  <v-icon dark>mdi-auto-fix</v-icon>
                                </v-btn>
                              </template>
                              <span>Arreglar</span>
                            </v-tooltip>
                          </template>
-->
                        </v-data-table>
                      </div>
                      <!-- FIN ITEMS DE COMPROBANTE -->
                    </v-card>
                  </v-dialog>
                  <!-- FIN DEL ERROR EN EL PEDIDO -->

                </v-toolbar>

                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="search"
                    append-icon="search"
                    label="Buscar"
                    :color="temas.forms_titulo_bg"
                    class="pt-0"
                    single-line hide-details>
                  </v-text-field>
                </v-col>
              </template>

              <template v-slot:item.estado="{ item }">
                <v-rating v-if="item.rating>=1 && item.rating<=5"
                  dense
                  v-model="item.rating"
                  :background-color="temas.forms_titulo_bg"
                  :color="temas.cen_estado_finalizado_bg"
                  empty-icon="$ratingFull"
                  x-small readonly>
                </v-rating>
                <v-chip v-else
                  label
                  dark class="caption"
                  @mouseover="sayMessage(item, true)"
                  @mouseleave="sayMessage(item, false)"
                  :color="getEstado(item.estado,'c')">
                  {{ getEstado(item.estado,'e') }}
                </v-chip>
              </template>

              <template v-slot:item.fecha="{ item }">
                <span disable dark>{{ formatoFechaCorta(item.fecha) }}</span>
              </template>

              <template v-slot:item.total="{ item }">
                <span disable dark>${{ formatoImporte(item.total) }}</span>
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
              </template>

              <template v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <v-data-table
                    :headers="headersItems"
                    :items="item.items"
                    dense
                    hide-default-footer>
                    <template v-slot:item.cantidad="{ item }">
                      <span disable dark>{{ formatoImporte(item.cantidad) }}</span>
                    </template>
                    <template v-slot:item.precio="{ item }">
                      <v-badge v-if="item.texto=='Promocion'"
                        class="pt-2"
                        :content="'p'"
                        :color="temas.forms_btn_add_bg"
                        :dark="temas.forms_btn_add_bg==true" left>
                      </v-badge>
                      <span disable dark>${{ formatoImporte(item.precio) }}</span>
                    </template>
<!--
                    <template v-slot:item.precio="{ item }">
                      <span disable dark>${{ formatoImporte(item.precio) }}</span>
                    </template>
-->
                    <template v-slot:item.tasadescuento="{ item }">
                      <span disable dark>{{ formatoImporte(item.tasadescuento) }}</span>
                    </template>
                    <template v-slot:item.importedescuento="{ item }">
                      <span disable dark>${{ formatoImporte(item.importedescuento) }}</span>
                    </template>
                    <template v-slot:item.total="{ item }">
                      <span disable dark>${{ formatoImporte(item.total) }}</span>
                    </template>
                  </v-data-table>
                </td>
              </template>
            </v-data-table>

          </v-container>

          <!--// RECEPCION DE PEDIDOS // -->
          <v-dialog v-model="dialogRecepcion" max-width="640px">
            <template v-slot:activator="{}"></template>
            <v-card>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="cerrarRecepcionPedido"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  Recepción del pedido
                  {{ itemActual != null ? itemActual.cpr : ''}}
                </span>
                <v-spacer></v-spacer>
                <v-btn
                  :color="temas.barra_principal_bg"
                  :dark="temas.barra_principal_dark"
                  class="ma-2 white--text" @click="confirmarRecepcionHTTP">
                  Confirmar Recepción
                </v-btn>
              </v-toolbar>

              <v-form ref="art3">
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="2" sm="4" md="2"></v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-text-field
                          type="date" outlined disabled
                          v-model="recepcion.fechaenvio"
                          :color="temas.forms_titulo_bg"
                          label="Fecha de envío">
                        </v-text-field>
                      </v-col>
                      <v-col cols="4" sm="4" md="4">
                        <v-text-field
                          autofocus
                          type="date" outlined
                          v-model="recepcion.fechallegada"
                          :color="temas.forms_titulo_bg"
                          label="Fecha de llegada">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sm="2" md="2"></v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-select
                          label='Como llego el pedido?' outlined
                          :color="temas.forms_titulo_bg"
                          v-model="recepcion.respuesta"
                          :items="recepcionRespuestas"
                          @change="setRespuestaRecepcion">
                        </v-select>
                      </v-col>
                    </v-row>
                    <v-row v-show="recepcion.respuesta=='Informar otro problema'">
                      <v-col cols="12" sm="12" md="12">
                        <v-textarea
                          v-model="recepcion.observaciones"
                          :color="temas.forms_titulo_bg"
                          label="Observaciones"
                          auto-grow
                          counter
                          clearable
                          outlined
                          rows="3"
                          row-height="25">
                        </v-textarea>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6" sm="6" md="6">
                        <span>Como califica la operación?</span>
                        <v-rating
                          v-model="recepcion.calificacion"
                          :color="temas.barra_principal_bg"
                          background-color="white"
                          empty-icon="$ratingFull"
                          half-increments
                          hover
                          label="¿Como califica la operacion?">
                        </v-rating>
                      </v-col>
                    </v-row>

                  </v-container>
                </v-card-text>
              </v-form>
            </v-card>
          </v-dialog>
          <!-- FIN DE RECEPCION DE PEDIDOS -->

        </v-tab-item>

        <v-tab href="#general" v-if="!hayCarrito">
          Precios
        </v-tab>
        <v-tab-item value="general">
          <v-row>
            <v-col cols="6" sm="6" md="6">
              <v-text-field
                :color="temas.forms_titulo_bg"
                label="Código o descripción o código de barra"
                autofocus
                v-model="busArt"
                @change="buscarArt">
              </v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
              cols="12" sm="12" md="12">
              <v-data-table
                :headers="headersArt"
                :items="selArt" dense
                class="elevation-3"
                :footer-props="footerProps">
                <template v-slot:item.precio="{ item }">
                  <span disable dark>${{ formatoImporte(item.precio) }}</span>
                </template>
                <template v-slot:item.fechaprecio="{ item }">
                  <span disable dark>{{ fechadelprecio(item.fechaprecio) }} </span>
                </template>
              </v-data-table>

            </v-col>
<!--
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              @input="handlePageChange">
            </v-pagination>
-->
          </v-row>
        </v-tab-item>

        <v-tab href="#carrito">
          Promociones
        </v-tab>
        <v-tab-item value="carrito">

          <!-- INICIA PUBLICACIONES -->
          <v-row>
            <v-col cols="4" sm="4" md="4">
              <div class="text-center" v-if="grupos.length>0"
                :dark="$store.state.temas.forms_titulo_dark"
                :color="$store.state.temas.forms_titulo_bg">
                <v-chip v-for="(gru, i) in grupos" :key="i"
                  class="ma-2" label
                  :color="gru.sel ? $store.state.temas.forms_btn_add_bg :
                  $store.state.temas.barra_principal_bg"
                  :dark="$store.state.temas.forms_titulo_dark"
                  @click="filtrarPorGrupo(gru)">
                  {{ gru.nombre }}
                </v-chip>
              </div>
            </v-col>

            <v-col cols="8" sm="8" md="8" class="pt-6">
              <v-card v-if="carro.length>0"
                :dark="$store.state.temas.barra_principal_dark"
                :color="$store.state.temas.barra_principal_bg"
                class="pt-0">
                  <v-card-text>
                    <v-row class="pb-0">
                      <v-col cols="2" class="pb-1">Código</v-col>
                      <v-col cols="5" class="pb-1">Nombre</v-col>
                      <v-col cols="1" class="pb-2">Cant.</v-col>
                      <v-col cols="2" class="pb-2">Precio</v-col>
                      <v-col cols="2" class="pb-2">Total</v-col>
                    </v-row>
                    <v-divider class="mx-1"></v-divider>
                    <v-row v-for="(car, i) in carro" :key="i">
                      <v-col cols="2" class="caption pt-1 pb-1">
                        {{car.articulo.codigo}}
                      </v-col>
                      <v-col cols="5" class="caption pt-1 pb-1">
                        {{car.articulo.nombre}}
                      </v-col>
                      <v-col cols="1" class="caption pt-1 pb-1">
                        {{car.ctt}}
                      </v-col>
                      <v-col cols="2" class="caption pt-1 pb-1">
                        $ {{car.precio}}
                      </v-col>
                      <v-col cols="2" class="caption pt-1 pb-1">
                        $ {{formatoImporte(car.precio*car.ctt)}}
                      </v-col>
                    </v-row>
                    <v-divider class="mx-1"></v-divider>
                    <v-row>
                      <v-col cols="8">
                      </v-col>
                      <v-col cols="2" class="caption">
                        Total Carrito:
                      </v-col>
                      <v-col cols="2" class="caption">
                        $ {{ formatoImporte(totalCarro) }}
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6"></v-col>
                      <v-col cols="6" class="text-center" v-if="carro.length>0">
                        <v-btn class="mt-0 ml-0"
                          :color="$store.state.temas.forms_btn_add_bg"
                          :dark="$store.state.temas.forms_btn_add_bg==true"
                          small
                          @click="generarPedidoOfertas">
                          Generar Pedido
                        </v-btn>
                        <v-btn class="mt-0 ml-2"
                          :color="$store.state.temas.forms_btn_add_bg"
                          :dark="$store.state.temas.forms_btn_add_bg==true"
                          small
                          @click="vaciarCarrito">
                          Vaciar Carrito
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <v-card v-show="$store.state.publicaciones" flat>
                <v-container fluid class="pt-0">
                  <v-row justify="start">
                    <v-col
                      v-for="(item,i) in $store.state.publicaciones" :key="i" :src="item.src">
                      <div class="contenedor-galeria">
                        <v-card class="mx-auto my-12" max-width="210">
                          <template slot="progress"></template>
                          <v-btn class="mt-2 ml-2" v-if="item.detalles!=null"
                            fab x-small icon
                            @click="verDetallesDeLaPublicacion(item)">
                            <v-icon>mdi-format-align-justify</v-icon>
                          </v-btn>
                          <v-img v-if="item.fotos.length>0" height="100"
                            :src="`/images/${item.fotos[0].foto}`"
                            class="galeria__img mt-4 mb-4"
                            @click="verFotos(item)">
                          </v-img>
                          <v-img v-else height="100"
                            :src="`/images/Sin Imagen.jpg`">
                          </v-img>
                          <v-divider class="mx-1"></v-divider>
                          <v-card-text class="pt-2 pb-2">
                            <div class="contenedor-galeria-fuente-importe">
                              ${{elPrecio(item,'original')}} -
                              <span class="contenedor-galeria-fuente-descuento">
                                %{{item.tasadescuento}} Off.
                              </span>
                              <span class="contenedor-galeria-fuente-ivasiniva">
                                {{ $store.state.proveedor.preciosconiva ? 'c/IVA' : 's/IVA' }}
                              </span>
                            </div>
                            <div class="contenedor-galeria-fuente-final mb-2">
                              <div>
                                ${{ elPrecio(item,'precio') }}
                                <v-badge v-if="item.unidades>0" class="pt-1"
                                  :content="item.unidades"
                                  :value="item.unidades"
                                  :color="$store.state.temas.forms_btn_add_bg"
                                  :dark="$store.state.temas.forms_btn_add_bg==true">
                                </v-badge>
                                <v-badge v-else class="pt-1"
                                  content="Sin Stock"
                                  :color="$store.state.temas.forms_btn_add_bg"
                                  :dark="$store.state.temas.forms_btn_add_bg==true">
                                </v-badge>
                              </div>
                            </div>
                            <div class="caption red--text font-weight-bold">
                              {{item.estado=='P' ? '' : 'Pausada'}}
                            </div>
                            <div>
                              <div class="contenedor-galeria-fuente-articulo">
                                {{item.articulo.nombre}} ( {{item.articulo.codigo}} )
                              </div>
                            </div>
                          </v-card-text>
                          <v-divider class="mx-4"></v-divider>

                          <v-card-text>
                            <v-row>

                              <v-col cols="4" sm="4" md="4" class="pt-4">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn v-if="item.unidades>0" class="ml-0"
                                      :disabled="item.estado!='P'"
                                      fab x-small color="white"
                                      @click="loQuiero(item)" v-on="on">
                                      <v-icon dark>
                                        {{ item.loquiero==true ?
                                        'mdi-heart-broken' : 'mdi-heart' }}
                                      </v-icon>
                                    </v-btn>
                                  </template>
                                  <span>
                                    {{ !item.loquiero ? 'Lo quiero' : 'Ya no lo quiero' }}
                                  </span>
                                </v-tooltip>
                              </v-col>

                              <v-col cols="4" sm="4" md="4" align="center" class="pt-0"
                                v-if="item.loquiero">
                                <v-text-field
                                  :disabled="!item.loquiero"
                                  class="caption" x-small v-model="ctt"
                                  :color="$store.state.temas.forms_titulo_bg"
                                  type="number" label="Unid" min="0"
                                  :max="item.unidades">
                                </v-text-field>
                              </v-col>
                              <v-col cols="4" sm="4" md="4" align="center" class="pt-4"
                                v-if="item.loquiero">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn class="ml-0"
                                      :disabled="item.estado!='P'"
                                      fab x-small color="white"
                                      @click="agregarAlCarrito(item)">
                                      <v-icon dark>mdi-cart</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Enviar a pedidos</span>
                                </v-tooltip>
                              </v-col>
                            </v-row>

                          </v-card-text>
                        </v-card>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>

          <!-- DIALOGO DETALLES DE LA PUBLICACION -->
          <v-dialog v-model="dialogDetalles" max-width="700px" persistent
            v-show="$store.state.tipo=='UG'">
            <template v-slot:activator="{}"></template>
            <v-toolbar flat dark
              :color="$store.state.temas.forms_titulo_bg">
              <v-btn icon
                @click="cerrarDetallesPublicacion"
                :color="$store.state.temas.forms_close_bg"
                :dark="$store.state.temas.forms_close_dark==true">
                <v-icon>mdi-arrow-left-circle</v-icon>
              </v-btn>
              <span class="text--right">
                Detalles de la Publicación
              </span>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sx="12" mx="12">
                      <v-textarea
                        v-model="detPub"
                        :color="$store.state.temas.forms_titulo_bg"
                        readonly
                        rows="15">
                      </v-textarea>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
          <!-- FIN DIALOGO DETALLES DE LA PUBLICACION -->

          <!-- DIALOGO FOTOS DE LA PUBLICACION -->
          <v-dialog v-model="dialogVerFotos" max-width="700px"
            v-show="$store.state.tipo=='UG'">
            <template v-slot:activator="{}"></template>
            <v-toolbar flat dark
              :color="$store.state.temas.forms_titulo_bg">
              <v-btn icon
                @click="cerrarFotosDeLaPublicacion"
                :color="$store.state.temas.forms_close_bg"
                :dark="$store.state.temas.forms_close_dark==true">
                <v-icon>mdi-arrow-left-circle</v-icon>
              </v-btn>
              <span class="text--right"></span>
                Fotos de la Publicación
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card>
              <v-carousel
                cycle height="550"
                :interval="2000"
                :show-arrows="true"
                :hide-delimiters="false">
                <v-carousel-item
                  v-for="(item,i) in fotos" :key="i"
                  :src="`/images/${item.foto}`" contain
                  :ripple="true"
                  reverse-transition="fade-transition"
                  transition="fade-transition">
                </v-carousel-item>
              </v-carousel>
            </v-card>
          </v-dialog>
          <!-- FIN DIALOGO FOTOS DE LA PUBLICACION -->
        </v-tab-item>

        <v-tab href="#gohu" v-if="!hayCarrito">
          Gohu
        </v-tab>
        <v-tab-item value="gohu">
          <v-container fluid>
            <v-row justify="space-around">
              <v-col cols="12" sm="12" md="12">
                <div class="caption">
                  Todavía no te uniste a gohu?, los beneficios son demasiados!<br>
                  <br>

                  Que es GOHU?, GOHU es muchas cosas, es un sistema tipo ERP, es un carrito de
                  compras y es una plataforma para que los usuarios, que no usen GOHU, puedan
                  realizar consultas, generar pedidos e importar precios.
                  <br>
                  Toda solución nace de un problema, bueno,
                  hemos encontrado por ejemplo muchos problemas a la hora de buscar un precio,
                  catalogos impresos, paginas web, listas en excel, en pdf, o la ultima compra
                  que aún no fue cargada y varios tormentos mas. Los comercios y negocios se
                  las arreglan como pueden, y no pocas veces se realizan ventas sin estar
                  totalmente seguros del precio al que se esta vendiendo.
                  <br>
                  La cuestion es que en un mostrador de ventas cuando un cliente pregunta
                  un precio, la simple pregunta se puede convertir en todo un problema, sobretodo
                  en negocios con miles de articulos en la nómina y ni hablar si el negocio esta
                  repleto de clientes.
                  <br>
                  Entonces porque no pensar un sistema en el cual clientes
                  y proveedores compartan artículos, precios, comprobantes, operaciones, etc.?.
                  Se imaginan nunca mas consultar un precio?, porque el precio esta ahí
                  y es administrado por la empresa que lo provee. Simplemente es buscar el artículo
                  y listo, el precio estará actualizado al momento y en todo momento.<br>
                  Por ejemplo si realizas una venta de un determiando producto, y tu proveedor
                  al minuto varía el precio, a la proxima venta el precio sera el que cambio tu
                  proveedor.<br>
                  Podras interactuar con tu proveedor, realizarle pedidos,
                  pagos, etc. El te podra enviar sus facturas, basadas en tus pedidos, el se
                  ahorara tener que confeccionar la factura y vos la compra, ya que una vez
                  que te facture tu proveedor y te envie el comprobante, tu solo tendras que
                  importarlo y luego pagarlo.<br>
                  En fin, Clientes y Proveedores todos en un mismo lugar compartiendo todo.
                  Suena a magia verdad? Pero no lo es, es simplemente aprovechar los recursos
                  tecnologicos disponibles y pensarlos para intentar que todo sea mas facil.
                  <br>
                  Bueno, esto hace GOHU y nos centramos en hacerlo simple y confiable.
                  <br>
                  <br>

                  <b>Realiza comprobantes electrónicos</b> y cumple así con los
                  requerimientos de AFIP. También podrás emitir comprobantes manuales para
                  cuando el servicio de AFIP no este disponible.
                  <br>
                  <br>
                  <b>Comparte datos de clientes y proveedores entre los otros usuarios Gohu</b>
                  <br>
                  Si el cliente o proveedor aún no esta cargado, podrás importarlo desde los
                  servidores de AFIP, si algún otro usuario de GOHU ya lo cargo, lo importas
                  y listo. Se compartiran los datos básicos, no asi los datos referentes
                  a cada usuario<br>
                  <br>
                  <b>Podrás vincularte con tus proveedores</b> obteniendo asi sus artículos
                  y precios.
                  Cada operación que realice tu proveedor, tanto con artículos y precios,
                  se reflejarán automaticamente en tus artículos, es decir, nunca más
                  tendrás que importar listas ni consultar precios, todo sera en tiempo real.<br>
                  <br>
                  <b>También podrás vincular tus operaciones con tus proveedores:</b>
                  Pedidos, facturas, Notas de Crédito, Notas de Débito, Remitos, Recibos, etc<br>
                  Veamos un ejemplo: Realizas un pedido, se lo envias a tu proveedor, este
                  lo recibe, lo procesa, lo factura y te lo vuelve a enviar pero como una factura.
                  La recibes y se actualizarán tus compras, tus stock's y tu cuenta corriente.
                  Luego realizas el pago, lo envías, tu proveedor lo acepta, emite el recibo del
                  pago y todos los valores y ambas cuentas corrientes seran actualizadas.<br>
                  Esta infraestructura de operaciones permite ahorrar mucho tiempo, minimizar
                  las cargas de datos y por ende evitar errores, por otro lado clarifica
                  enormemente el circuito de las operaciones y como se fueron realizando
                  permitiendo rastrearlas facilmente en caso de ser necesario<br>
                  <br>
                  <b>Podrás habilitar este tablero a tus clientes</b> para que puedan
                  realizar pedidos, consultar tus precios, e importar tus listas.
                  <br>
<!--
                <br>
                <b>gohu</b> es un ERP fácil de utilizar y donde todo esta integrado.<br><br>
                El objetivo de <b>gohu</b> es intentar facilitar y optimizar las operaciones
                de las empresas. ¿Como? Uniendo y compartiendo esfuerzos<br><br>

                Para lograr este objetivo <b>gohu</b> implemento un sistema de
                <i><b>vinculaciones</b></i> que permitiran agilizar enormemente sus operatoria
                comercial.<br>
                Estas vinculaciones se basan en dos grandes aspectos:
                <i>Su tipo de comercializacion</i> y <i>los rubros que comercializa.</i>
                <br><br>
                En cuanto al <i>tipo de comercialización</i> <b>gohu</b> se baso en la
                actual <i>Cadena de Comercialización</i> que todos conocemos encontrando
                tres grandes grupos: <br><br>
                <b>IP</b> Importadores o Productores. Aquellas empresas que importen o
                fabriquen productos<br>
                <b>MD</b> Mayoristas o Distribuidores. Aquellas empresas que distrubuyen,
                Mayoristas.<br>
                <b>MI</b> Minoristas. Aquellas empresas que venden sus productos al por menor o
                brindan servicios.
                <br><br>
                Luego debera definir a que <i>rubro o rubros</i> pertenece su empresa.
                <br>
                <b>gohu</b> tiene definido un gran número de rubros y podrá seleccionar
                los que necesite.<br><br>

                Basado en estos dos criterios, <b>gohu</b> permite <b><i>vincular</i></b>
                usuarios utilizando el siguiente criterio:<br>
                Usuario <b>IP</b> con usuarios <b>MD</b> y estos con usuarios <b>MI</b> y que
                <b>compartan rubro o rubros.</b><br>
                Pero con la siguiente restricción: Nunca un usuario <b>IP</b> se podrá vincular a
                un usuario <b>MI</b> y viceversa.
                <br><br>

                Veamos un ejemplo:<br>
                Se registra un nuevo usuario <b>MD</b> en el rubro
                <b>Computación</b>. En ese instante el sistema enviará una notificación de
                <i>Vínculo Comercial</i> a todos los usuarios <b>IP</b> y <b>MI</b> que
                tengan definidos el mismo rubro.<br><br>

                <b>
                Una vez aceptada la vinculación, el nuevo usuario tendra disponible los artículos y
                precios de todos los usuarios vinculados inmediatos superiores (Sus Proveedores) y
                por otro lado brindará también todos sus artículos y precios a los usuarios en
                escala inmediata inferior (Sus Clientes).</b><br><br>

                Esto implica una gran ventaja al momento de adminisrar precios y artículos.
                Nunca mas va a tener que consultar precios a sus proveedores ni responder
                consulta de sus clientes, al menos, en cuanto a precios.<br><br>

                Además, al ser un sistema web y al estar diseñado para compartir,
                tambien podra utilizar Clientes, Proveedores, Transportistas, y una gran
                cantidad de datos mas que otros usuarios ya hayan cargado, como tambien otros
                usuarios podrán utlizar datos cargados por Ud.<br>

                Tambien las operaciones serán mas fáciles cuando los usuarios esten vinculados,
                todas las operaciones iran por dentro del sistema, facturas de ventas, compras,
                recibos, pagos, remitos, etc.<br>
                Esto evita errores y agiliza enormemente la operatoria.<br>
                Y si el usuario no esta vinculado, la operatoria sera normal.<br>

                El costo de la licencia para utilizar <b>gohu</b> es muy accesible, no dude en
                consultarnos
                <br>
                Para saber si <b>gohu</b> puede ser de su utilidad, revise la documentación
                <b>aquí</b>. Ahí exlicamos mucho mas en detalle que es lo que hace <b>Gohu</b>
                y si puede ser de su utilidad.
                <br>
-->
                </div>
              </v-col>
            </v-row>
          </v-container>
        </v-tab-item>

      </v-tabs>
      <SBar></SBar>
      <Confirmacion v-model='msg.msgAccion'
        :title=this.msg.msgTitle
        :body=this.msg.msgBody
        :visible=this.msg.msgVisible
        :buttons=this.msg.msgButtons
        @click="msgRespuesta">
      </Confirmacion>

      <Mail v-model='mail.accion'
        :token=this.mail.token
        :host=this.mail.host
        :username=this.mail.username
        :password=this.mail.password
        :to=this.mail.to
        :from=this.mail.from
        :subject=this.mail.subject
        :body=this.mail.body
        :title=this.mail.title
        :visible=this.mail.visible
        :buttons=this.mail.buttons
        @click="mailRespuesta">
      </Mail>

    </v-flex>
  </v-layout>
</template>

<script>
/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';
import SBar from './Forms/snackbar.vue';
import Confirmacion from "./Forms/confirmacion.vue";
import itemsCpr from "./Forms/itemsCpr.vue";
import Mail from "./Forms/mail.vue";
import XLSX from 'xlsx';
import jsPDF from 'jspdf';

export default {
  components: {
    SBar,
    Confirmacion,
    Mail,
    //itemsCpr,
  },
  data: () => ({
    ctt: 1,
    fotos: [],
    carro: [],
    grupos: [],
    totalCarro: 0,
    detPub: '',
    singleExpand: false,
    dialogDetalles: false,
    dialogError: false,
    dialogVerFotos: false,
    dialogRecepcion: false,
    currentPage: 1,
    expanded: [],
    editarPedido: false,
    totalPedido: 0,
    pedido_id: null, // SI ESTOY AGREGANDO O MODIFICACION UN PEDIDO
    seleccionarArticulo: false,
    editedIndex: -1,
    editedIndexArt: -1,
    formTitle: '',
    formTitlePed: '',
    formTitleArt: '',
    itemActual: null,
    dialog: false,
    dialogArt: false,
    acciones: [],
    accionesArtPed: [],
    articulos: [],
    selArt: [],
    selArtPed: [],
    selArtPedErr: [],
    busArt: '',
    busArtPed: '',
    items: [],
    loading: false,
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
//    comprobante_id: '',
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
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    mail: {
      token: "4a720391-3103-4352-ac74-d48f13f1a13b",
      host: "smtp.gmail.com",
      username: "gohuapp",
      password: "gmail021201",
      to: '',
      from: "gohuapp@gmail.com",
      subject: "",
      body: "",
      accion: null,
      visible: false,
      title: '',
      buttons: ['']
    },
    recepcion: {
      respuesta: 'El pedido llego bien!',
      fechaenvio: '',
      fechallegada: '',
      observaciones: 'El pedido llego bien!',
      calificacion: 5,
    },
    recepcionRespuestas: [
      'El pedido llego bien!',
      'El pedido llego bien pero con demora',
      'Llegaron los productos rotos o mal embalados',
      'No son los productos que compre',
      'Informar otro problema'
    ],
    search: '', // para el cuadro de búsqueda de datatables
    headers: [
      { text: 'Fecha', value:'fecha', align: 'left', width: 89 },
      { text: 'Comprobante', value:'cpr', align: 'left', width: 175 },
      { text: 'Estado', value:'estado', align: 'left', width: 110 },
      { text: 'TOTAL', value:'total', align: 'end', width: 100},
      { text: 'Acciones', value: 'accion', sortable: false, width: 90 },
    ],
    headersItems: [
      { text: 'Código', value:'articulo.codigo', class: 'grey lighten-3'},
      { text: 'Descripción', value:'articulo.nombre', class: "grey lighten-3"},
      { text: 'Ctts', value:'cantidad', align: 'end', class: "grey lighten-3"},
      { text: 'Precio', value:'precio', align: 'end', width: 120, class: "grey lighten-3"},
      { text: '%Des', value:'tasadescuento', align: 'end', class: "grey lighten-3"},
      { text: 'Des', value:'importedescuento', align: 'end', class: "grey lighten-3"},
      { text: 'Total', value:'total', align: 'end', width: 120, class: "grey lighten-3"},
    ],
    headersArt: [
      { text: 'CODIGO', value:'codigo', align: 'left'},
      { text: 'DESCRIPCION', value:'nombre', align: 'left', width: 550},
      { text: 'UM', value:'unimed', align: 'left', width: 100},
      { text: 'GRUPO', value:'nomgru', align: 'left', width: 100},
      { text: 'MARCA', value:'nommar', align: 'left', width: 100},
      { text: 'PUBLICO', value:'precio', align: 'end', width: 150},
      { text: 'Fecha del Precio', value:'fechaprecio', align: 'end', width: 150},
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
    headersSelArt: [
      { text: 'NID', value:'id', align: 'left', width: 50},
      { text: 'CODIGO', value:'codigo', align: 'left', width: 120},
      { text: 'NOMBRE', value:'nombre', align: 'left', width: 350},
      { text: 'STOCK', value:'stock', align: 'end', width: 100},
      { text: 'PRECIO', value:'precio', align: 'end', width: 100},
    ],
    headersSelArtPedErr: [
      { text: 'CODIGO', value:'codigo',       align: 'left', width: 120},
      { text: 'NOMBRE', value:'nombre',       align: 'left', width: 350},
      { text: 'ERROR',  value:'err',          align: 'left', width: 250},
      { text: 'UN.PED', value:'unped',        align: 'end',  width: 100},
      { text: 'STOCK',  value:'stock',        align: 'end',  width: 100},
      { text: 'PREPED', value:'preped',       align: 'end',  width: 100},
      { text: 'PREACT', value:'preact',       align: 'end',  width: 100},
    ],
    footerProps: {'items-per-page-options': [12]},
    footerProps10: {'items-per-page-options': [10]},
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapState([
      'sucursal',
      'sucursales',
      'sucursalDemo',
      'sucursalFiscal',
      'proveedor',
      'proveedores',
      'tercero',
      'tipo',
      'tema',
      'temas',
      'centrales',
      'notificaciones',
      'caja',
      'vinculosPadres',
      'vinculosHijos',
      'empresa',
      'empresaId',
      'datosEmpresa',
      'responsable',
      'cuit',
      'operario',
      'level',
      'publicaciones',
      'actPublicacion',
      'hayCarrito',
      'publicarpreciosconiva',
    ]),
  },





  watch: {
    '$store.state.proveedor' () {
      this.busArt = ''
      this.listarPedidosHTTP()
      this.selArt = []
      //this.buscarArt()
      this.gruposArt()
    }
  },





  mounted () {
    this.$store.commit('closeAlert')
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      return this.listarPedidosHTTP()
    }
  },





  methods: {
    ...mapMutations([
      'alert',
      'closeAlert',
      'setSucursal',
      'setSucursales',
      'setProveedor',
      'setProveedores',
      'setCentrales',
      'setTema',
      'setTemas',
      'setSucursalFiscal',
      'setNotificaciones',
      'setCaja',
      'setVinculasPadres',
      'setVinculasHijos',
      'setEmpresa',
      'setOperario',
      'setLevel',
      'setContadorBloqueado',
      'actDetallesPublicacion',
      'setPublicacionLoQuieroOn',
      'setPublicacionLoQuieroOff',
      'setHayCarrito',
      'setPublicaciones',
      'setCttPublicacion',
      'setVaciarCarro',
    ]),





    handlePageChange(value) {
      this.currentPage = value;
    },





    listarPedidosHTTP:function() {
      debugger
      return HTTP().get('/listarpedidos/'+this.userId+'/'+this.proveedor.id)
        .then(({ data }) => {
          debugger
          this.items = data
      })
    },





    buscarArt() {
      let b = this.busArt
      //let v = this.$store.state.vinculosPadres
      let v = []
      v.push(this.proveedor.id)
      this.selArt = []
      debugger
      return HTTP().post('/userarticulosfac', { 
        search: b,
        vinculos: v,
        estricto: false,
        userex: this.$store.state.proveedor
        })
        .then(({ data }) => {
          debugger
          this.selArt = []
          for (let i=0; i<=data.length-1; i++) {
            this.selArt.push({
              id:           data[i].id,
              codigo:       data[i].codigo,
              nombre:       data[i].nombre,
              unimed:       data[i].unimed,
              nomgru:       data[i].nomgru,
              nommar:       data[i].nommar,
              precio:       data[i].final,
              fechaprecio:  data[i].fechaprecio,
              pubprecio:    data[i].pubprecio ? data[i].pubprecio : 0,
              pubtasdes:    data[i].pubprecio ? data[i].pubtasdes : 0,
              pubenvio:     data[i].pubprecio ? data[i].pubenvio : 0,
              pubunidades:  data[i].pubprecio ? data[i].pubunidades : 0,
              pubestado:    data[i].pubprecio ? data[i].pubestado : '',
            })
          }
        }).catch(({ err }) => {
          this.selArt = []
        })
    },





    gruposArt() {
      debugger
      this.grupos = []
      return HTTP().post('/gruposart', { proveedor: this.proveedor.id })
        .then(({ data }) => {
          debugger
          if (data.length>1) {
            this.grupos = [{id: 9999999, nombre: 'Todos', sel: true}]
            for (let i=0; i<=data.length-1; i++) {
              this.grupos.push({ id: data[i].id, nombre: data[i].nombre, sel: false, })
            }
          }
        }).catch(({ err }) => {
          this.grupos = []
        })
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





    guardarArt(item) {

      debugger
      if (this.editadoArt.cantidad == 0) {
        this.$refs.cant.focus()
        return 
      } else if (this.editadoArt.codigo == '') {
        this.$refs.buscar.focus()
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





    selArtClick (item) {
      this.seleccionarArticulo = false;
      this.busArtPed = item.codigo
      this.buscarArtPed(true)
    //this.$refs.cant.focus()
    },





    nuevoPed(texto) {
      debugger
      return HTTP().get('/haypedidoabierto/'+this.$store.state.proveedor.tercero_id)
        .then(({ data }) => {
          debugger
          if (data.length) {
            this.msg.msgTitle = 'Hay un pedido abierto!'
            let m = 'El pedido '+data[0].cpr +' esta abierto.<br>'
            m += 'Utilicelo para agregar items.'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'sin stock'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.formTitlePed = 'NUEVO PEDIDO'
            this.dialog = true
            this.busArtPed = ''
            this.pedido_id = null
            this.editarPedido = true
          }
        })
    },





    editarPed(item, editar) {
      this.dialog = true
      this.articulos = []
      this.formTitlePed = editar ? 'Editar Pedido' : 'Ver Pedido'
      this.editedIndex = -1
      this.editarPedido = editar
      return HTTP().post('/cargarpedido', { pedido: item } )
        .then(({ data }) => {
          this.pedido_id = data[0].comprobante_id
          for (let i=0; i<=data.length-1; i++) {
            let max = 0
            for (let j=0; j<=this.$store.state.publicaciones.length-1; j++) {
              if (data[i].articulo_id==this.$store.state.publicaciones[j].articulo_id) {
                max = this.$store.state.publicaciones[j].unidades
                break
              }
            }
            this.articulos.push({ 
              id:               i,
              comprobante_id:   data[i].comprobante_id,
              articulo_id:      data[i].articulo_id,
              codigo:           data[i].codigo,
              nombre:           data[i].nombre,
              deposito_id:      data[i].deposito_id,
              unidad_id:        data[i].unidad_id,
              moneda_id:        data[i].moneda_id,
              iva_id:           data[i].iva_id,
              cantidad:         Number(data[i].cantidad),
              stock:            data[i].stock,
              costo:            data[i].costo,
              precio:           data[i].precio,
              preciooriginal:   data[i].preciooriginal,
              tasadescuento:    data[i].tasadescuento,
              importedescuento: data[i].importedescuento,
              total:            data[i].total,
              texto:            data[i].texto,
              vencimiento: '',
              padre_id:         data[i].padre_id,
              coeficiente:      data[i].coeficiente,
              esPromocion:      data[i].texto=='Promocion' ? true : false,
              cantidadMaxima:   max,
              cantidadCarrito:  max,
              estado:           'edit'
            })
          }
          this.calculos()
        })
    },





    anularPedidoHTTP(item) {

      this.listarPedidosHTTP()
      debugger
      return HTTP().post('/anularpedido', { pedido: item, proveedor: this.proveedor.id } )
        .then(({ data }) => {
          if (data==1) {
            /*
            for (let i=0; i<=item.items.length-1; i++) {
              for (let j=0; j<=this.$store.state.publicaciones.length-1; j++) {
                if (item.items[i].articulo_id==this.$store.state.publicaciones[j].articulo_id) {
                  this.$store.commit('setActPublicacion', 
                    [{ articulo_id: item.items[i].articulo_id, ctt: item.items[i].cantidad }], 
                  { root: true })
                  break
                }
              }
            }
            */
            this.listarPedidosHTTP()
          }
        })
    },




    puedoEnviarPedido(item) {

      debugger
      return HTTP().get('/puedeenviarpedido/'+item.id)
        .then(({data})=>{

          debugger
          let err = []
          let sinstockpbub = false
          let difprecios = false
          this.selArtPedErr = []

          debugger
          for (let i=0; i<=data.length-1; i++) {

            let msg = ''
            if (data[i].stock<0) {
              msg = 'Stock '
            }
            if (data[i].preciopedido!=data[i].precioactual) {
              msg += 'Precios '
            }
            if (data[i].pubestado!='P') {
              msg += 'Pub/pausada'
            }
            if (msg!='') {
              this.selArtPedErr.push({
                art_id:     data[i].art_id,
                cpritem_id: data[i].cpritem_id,
                codigo:     data[i].codigo,
                nombre:     data[i].nombre,
                unped:      data[i].unped,
                stock:      data[i].unped+data[i].stock,
                preped:     data[i].preciopedido,
                preact:     data[i].precioactual,
                texto:      data[i].texto,
                err:        msg
              })
            }
          }

          if (this.selArtPedErr.length>0) {
            this.dialogError = true
          } else {
            this.preguntoEnvio(item) 
          }


          /*
          if (err.length>0) {
            
            this.msg.msgTitle = 'El pedido no se puede enviar'
            let txt = '<br>'
            for (let i=0; i<=err.length-1; i++) {
              
              if (err[i].err=='Falta Stock') {
                txt += err[i].codigo+'&nbsp &nbsp'+err[i].nombre+'&nbsp &nbsp'+this.formatoImporte(data[0].stock)
                txt += ' '+err[i].err+'<br>'
              } else {
                txt += err[i].codigo+'&nbsp &nbsp'+err[i].nombre+'&nbsp &nbsp'
                txt += ' '+err[i].err+' '
                txt += '$'+this.formatoImporte(data[0].preciopedido)+' / $'+this.formatoImporte(data[0].precioactual)+'<br>'
              }
            }
            txt += '<br>Deberá reacomodar su pedido para poder continuar.<br><br>'
            this.msg.msgButtons = ['Aceptar']
            this.msg.msgBody = txt
            this.msg.msgVisible = true
            this.msg.msgAccion = 'no hay stock en publicaciones'
          
          } else {

            this.preguntoEnvio(item) 
          
          }
          */

        })
    },





    arreglarPedido(){
      this.msg.msgTitle = 'Arreglar Pedido'
      this.msg.msgBody = 'Confirma arreglar el pedido?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'arreglar pedido'
      this.msg.msgButtons = ['Aceptar', 'Cancelar']
    },





    arreglarPedidoHTTP(){
      
      debugger  // 021201

      return HTTP().post('/arreglarpedido', { proveedor: this.proveedor.id, errores: this.selArtPedErr })
        .then(({ data }) => {
          debugger
          if (data=='ok') {
            this.msg.msgTitle = 'Pedido arreglado'
            this.msg.msgBody = 'El pedido ha sido arreglado!<br>Puede enviarlo al Proveedor.<br>'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'pedido arreglado'
            this.msg.msgButtons = ['Aceptar']
          } else if (data=='error') {
            this.msg.msgTitle = 'El Pedido no se pudo arreglar'
            this.msg.msgBody = 'El pedido no se ha podido arreglar<br>Reintente, si el problema persiste consulte con sistemas<br>'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'pedido no se pudo arreglar'
            this.msg.msgButtons = ['Aceptar']
          }
          this.dialogError = false
          this.listarPedidosHTTP()
        })
    },





    enviarAlProveedorHTTP(item) {
//    return HTTP().post('/ueenviarpedido', { pedido: item } )
      // TIENE QUE ENVIAR EL PEDIDO POR SISTEMA
      debugger
      let novedad = {
        cpr_id: item.id,
        novedad: 'Envio del Pedido',
        rel_id: null,
        estado: 'N'
      }
      debugger
      return HTTP().patch('/enviarpedido', {
        id: item.id,
        novedad: novedad,
        vendedor: false })
        .then(({ data }) => {
          debugger
          if (data=='ok') {
            for (let i=0; i<=item.items.length-1; i++) {
              for (let j=0; j<=this.$store.state.publicaciones.length-1; j++) {
                if (item.items[i].articulo_id==this.$store.state.publicaciones[j].articulo_id) {
                  this.$store.commit('setActPublicacion', 
                    [{ articulo_id: item.items[i].articulo_id, ctt: item.items[i].cantidad*-1 }], 
                  { root: true })
                  break
                }
              }
            }
            this.listarPedidosHTTP()
          }
        })
    },





    nuevoArt() {
      this.busArtPed = ''
      this.dialogArt = true;
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.formTitleArt = 'Ingreso de Artículos en el Pedido'
      this.editedIndexArt = -1;
      this.seleccionarArticulo = false;
    },





    guardarPed() {
      // SI LA CANTIDAD ESTA EN CERO BORRO LA LINEA
      for (let j=0; j<=this.articulos.length-1; j++) {
        if (this.articulos[j].cantidad == 0) {
          this.articulos.splice(j, 1)
          break
        }
      }

      // Reviso Stocks Promociones
      // ESTO NO VA MAS, DEBE PODER PEDIR LO QUE QUIRA
      // SI NO HAY MAS STOCK EN PROMOCIONES QUE TOME DEL PRECIO NORMAL.
      //return HTTP().post('/uerevisostockspromociones', {
        //proveedor_id:  this.proveedor.id, //this.empresaId,
        //articulos:     this.articulos,
        //}).then(({ data }) => {
          //if (data.length==0) {


            let tot = 0
            for (let i=0; i<=this.articulos.length-1; i++) {
              tot += this.articulos[i].total
            }
            let xarticulos = this.articulos
            return HTTP().post('/actualizopedido', {
              user_id:       this.userId,
              proveedor_id:  this.proveedor.id, //this.empresaId,
              tercero_id:    this.tercero,
              total:         tot,
              articulos:     this.articulos,
              pedido_id:     this.pedido_id,
              }).then(({ data }) => {
                /*
                for (let i=0; i<=xarticulos.length-1; i++) {
                  for (let j=0; j<=this.$store.state.publicaciones.length-1; j++) {
                    if (xarticulos[i].articulo_id==this.$store.state.publicaciones[j].articulo_id) {
                      let carritoex = (xarticulos[i].cantidadMaxima-xarticulos[i].cantidadCarrito)
                      this.$store.commit('setActPublicacion', 
                        [{ articulo_id: xarticulos[i].articulo_id, ctt: carritoex }], 
                      { root: true })
                      break
                    }
                  }
                }
                */
                if (this.pedido_id==null) {
                  this.mensaje('¡Nuevo pedido agregado!', this.temas.forms_titulo_bg, 1500) 
                } else {
                  this.mensaje('¡El pedido ha sido modificado!', this.temas.forms_titulo_bg, 1500) 
                }
                this.cancelar()
                this.listarPedidosHTTP();
              })

          //} else {

            /*
            this.msg.msgTitle = 'Unidades en promocion insuficientes!'
            let m = 'Quedan '+data[0].cantidadMaxima+' unidades del articulo '+data[0].codigo+'<br>'
            m += '( '+data[0].nombre+' )<br><br>'
            m += 'Reduzca las unidades de este item para poder continuar.'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'sin stock'
            this.msg.msgButtons = ['Aceptar']
            */

          //}
        //})
    },





    actualizoPedidoHTTP (que) {
      let tot = 0
      for (let i=0; i<=this.articulos.length-1; i++) {
        tot += this.articulos[i].total
      }
      let xarticulos = this.articulos
      return HTTP().post('/actualizopedido', {
        user_id:       this.userId,
        proveedor_id:  this.proveedor.id, //this.empresaId,
        tercero_id:    this.tercero,
        total:         tot,
        articulos:     this.articulos,
        pedido_id:     this.pedido_id,
      }).then(({ data }) => {
        /*
        for (let i=0; i<=xarticulos.length-1; i++) {
          for (let j=0; j<=this.$store.state.publicaciones.length-1; j++) {
            if (xarticulos[i].articulo_id==this.$store.state.publicaciones[j].articulo_id) {
              let carritoex = (xarticulos[i].cantidadMaxima-xarticulos[i].cantidadCarrito)
              this.$store.commit('setActPublicacion', 
                [{ articulo_id: xarticulos[i].articulo_id, ctt: carritoex }], 
              { root: true })
              break
            }
          }
        }
        */
        this.cancelar()
        this.listarPedidosHTTP();
      });
    },





    duplicarPedidoHTTP (item) {
      debugger
      return HTTP().post('/duplicarpedido', { pedido: item, empresa: this.$store.state.proveedor.id })
      .then(({ data }) => {
        if (data=='error') {
          this.mensaje('¡Opss, se ha producido un error. Reintente, si el error persiste consulte con gohu!', this.temas.forms_titulo_bg, 5000) 
        } else {
          this.mensaje('¡Se ha generado un nuevo pedido en base al seleccionado!', this.temas.forms_titulo_bg, 1500) 
        }
        this.listarPedidosHTTP();
      });
    },





    editarArt(item) {
      this.formTitleArt = 'Editar Item'
      this.seleccionarArticulo = false;
      this.editedIndexArt = this.articulos.indexOf(item)
      this.dialogArt = true
      this.busArtPed = this.articulos[this.articulos.indexOf(item)].codigo
      this.buscarArtPed(true)
    },





    sumarRestar(item, cuanto) {
      let k = 0
      k = this.estaElArticulo(item.articulo_id, item.esPromocion)
      this.articulos[k].cantidad = Number(this.articulos[k].cantidad)
      if (this.articulos[k].texto == 'Promocion' && cuanto==1) {
        if (k != -1) {
          if (cuanto==1 && this.articulos[k].cantidadMaxima<=0) {
            return    
          }
        }
      }
      if (cuanto==-1 && this.articulos[k].cantidad==0) {
        return
      }
      this.articulos[k].cantidad += cuanto
      this.articulos[k].cantidadMaxima -= cuanto
      this.articulos[k].total = this.articulos[k].precio*this.articulos[k].cantidad
      this.calculos()
    },





    calculos(item) {
      this.totalPedido = 0
      for (let i=0; i<=this.articulos.length-1; i++) {
        this.totalPedido += this.articulos[i].total
      }
    },





    preguntoBorrarArt(item) {
      this.itemActual = item
      this.msg.msgTitle = 'Borrar Item'
      this.msg.msgBody = 'Desea borrar este Item?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },





    preguntoEnvio(item) {
      this.itemActual = item
      this.msg.msgTitle = 'Enviar Pedido'
      this.msg.msgBody = 'Confirma enviar el pedido al Proveedor?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'enviar al proveedor'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },





    preguntoAnularPedido() {
      this.msg.msgTitle = 'Anular Pedido'
      this.msg.msgBody = 'Confirma Anular el Pedido?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'anular pedido'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item
    },





    preguntoDuplicarPedido() {
      this.msg.msgTitle = 'Duplicar Pedido'
      this.msg.msgBody = 'Confirma generar un nuevo pedido basado en este?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'duplicar pedido'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item
    },




    borrarLineaComprobante(item) {
      let pos = this.articulos.indexOf(item)
      this.articulos.splice(pos,1);
      this.calculos()
    },





    cancelar() {
      this.dialog = false;
      this.articulos = []
      this.editado = Object.assign({}, this.defaultItem);
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editedIndex = -1;
    },





    cancelarSelArtPedErr() {
      this.dialogError = false
    },





    cancelarArt() {
      this.dialog = false;
    },





    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      if (item.estado=='P') {
        this.acciones.push({nombre: 'Editar', icon: 'mdi-barcode'})
      }
      if (item.estado=='P' && item.cpr.substring(0,3)=='PED') {
        this.acciones.push({nombre: 'Anular', icon: 'mdi-backup-restore'})
        this.acciones.push({nombre: 'Enviar al Proveedor', icon: 'mdi-file-send'})
      }
      if (item.estado=='E' && item.cpr.substring(0,3)=='PED') {
        this.acciones.push({nombre: 'Recepción', icon: 'mdi-star'})
      }
      this.acciones.push({nombre: 'Imprimir', icon: 'mdi-printer'})
      this.acciones.push({nombre: 'Nuevo basado en este', icon: 'mdi-content-copy'})
    },





    setAccionesArtPed(item) {
      this.itemActual = item
      this.accionesArtPed = []
      this.accionesArtPed.push({nombre: 'Editar', icon: 'mdi-pencil'})
      this.accionesArtPed.push({nombre: 'Borrar', icon: 'mdi-delete'})
    },





    async selAccion(item) {
      if (item.nombre=='Detalles') {
        this.printDetalles(this.itemActual)
      } else if (item.nombre=='Imprimir') {
        alert('tooooo falta esto che!!!')
        //this.print(this.itemActual)
      } else if (item.nombre=='Editar') {
        this.editarPed(this.itemActual, true)
      } else if (item.nombre=='Enviar al Proveedor') {
        this.puedoEnviarPedido(this.itemActual) 
      } else if (item.nombre=='Anular') {
        this.preguntoAnularPedido(this.itemActual) 
      } else if (item.nombre=='Nuevo basado en este') {
        this.preguntoDuplicarPedido(this.itemActual) 
      } else if (item.nombre==='Recepción') {
        this.recepcionPedido(this.itemActual)
      }
    },





    recepcionPedido (item) {
      this.itemActual = item;
      this.recepcion.respuesta = 'El pedido llego bien!'
      this.recepcion.observaciones = 'El pedido llego bien!'
      this.recepcion.fechaenvio = moment(item.enviollegada).format('YYYY-MM-DD')
      this.recepcion.fechallegada = moment().format('YYYY-MM-DD')
      this.recepcion.calificacion = 5
      this.dialogRecepcion = true
    },





    setRespuestaRecepcion() {
      if (this.recepcion.respuesta=='El pedido llego bien!') {
        this.recepcion.observaciones='El pedido llego bien!'
        this.recepcion.calificacion = 5

      } else if (this.recepcion.respuesta=='El pedido llego bien pero con demora') {
        this.recepcion.observaciones='El pedido llego bien pero con demora'
        this.recepcion.calificacion = 4

      } else if (this.recepcion.respuesta=='Llegaron los productos rotos o mal embalados') {
        this.recepcion.observaciones='Llegaron los productos rotos o mal embalados!'
        this.recepcion.calificacion = 3

      } else if (this.recepcion.respuesta=='No son los productos que compre') {
        this.recepcion.observaciones='No son los productos que compre'
        this.recepcion.calificacion = 2

      } else if (this.recepcion.respuesta=='Informar otro problema') {
        this.recepcion.observaciones='Informar otro problema!'
        this.recepcion.calificacion = 1
      }
    },





    cerrarRecepcionPedido() {
      this.dialogRecepcion = false
    },





    confirmarRecepcionHTTP() {
      
      let novedad = {
        cpr_id: this.itemActual.id,
        novedad: 'Recepción de Pedido '+this.fechaTimeLine(this.recepcion.fechallegada),
        detalles: this.recepcion.observaciones,
        calificacion: this.recepcion.calificacion,
        rel_id: null,
        estado: 'N'
      }
      debugger
      return HTTP().post('/pedidorecepcion', 
        { pedido: this.itemActual, novedad: novedad })
        .then(({ data }) => {
          debugger
          this.dialogRecepcion = false
          if (data=='error') {
            this.mensaje('¡Opps!, hubo un problema en la grabación!, consulte con la mesa de ayuda Gohu.', this.temas.cen_card_activo_bg, 5000) 
          } else {
            this.mensaje('¡Operacion registrada correctamente!', this.temas.forms_titulo_bg, 3000)
            this.listarPedidosHTTP()
          }
        })
    },





    async selAccionArtPed(item) {
      if (item.nombre=='Editar' && item.texto!='Promocion') {
        this.editarArt(this.itemActual)
      } else if (item.nombre=='Borrar') {
        this.preguntoBorrarArt(this.itemActual) 
      }
    },





    filtrarPorGrupo(grp) {
      for (let i=0; i<=this.grupos.length-1; i++) {
        this.grupos[i].sel = this.grupos[i].id == grp.id ? true : false
      }
      return HTTP().post('/publicaciones/', 
        {proveedor: this.$store.state.proveedor.id, filtro: grp.id})
        .then(({ data }) => {
          let pub = []
          for (let i=0; i<=data.length-1; i++) {
            pub.push({
              articulo: data[i].articulo,
              articulo_id: data[i].articulo_id,
              created_at: data[i].created_at,
              envio: data[i].envio,
              estado: data[i].estado,
              fotos: data[i].fotos,
              id: data[i].id,
              precio: data[i].precio,
              preciooriginal: data[i].preciooriginal,
              tasadescuento: data[i].tasadescuento,
              unidades: data[i].unidades,
              updated_at: data[i].updated_at,
              user_id: data[i].user_id,
              vencimiento: data[i].vencimiento,
              detalles: data[i].detalles,
              vendidas: data[i].vendidas,
              loquiero: false,
              ctt: 0,
            })
          }
          this.$store.commit('setPublicaciones', pub, { root: true });
          this.$store.commit('setGrupoCarrito', grp.id, { root: true });

//        this.$store.commit('setPublicaciones', data, { root: true })
      })

    },





    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
          this.borrarLineaComprobante(this.itemActual)
        } else if (this.msg.msgAccion=='anular pedido') {
          this.anularPedidoHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='enviar al proveedor') {
          this.enviarAlProveedorHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='duplicar pedido') {
          this.duplicarPedidoHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a XLS') {
          this.exportExcel()
        } else if (this.msg.msgAccion=='arreglar pedido') {
          this.arreglarPedidoHTTP()
        }

      }
      this.msg.msgVisible = false;
    },





    mailRespuesta(op) {
      this.mail.visible = false
      if (op==='Enviar') { 
        this.msg.msgTitle = 'Envío de correo electrónico'
        this.msg.msgBody = 'El mail ha sido enviado con exito'
        this.msg.msgVisible = true
        this.msg.msgAccion = 'mail enviado'
        this.msg.msgButtons = ['Aceptar']
      }
    },





    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },





    sayMessage(item, open) {
      if (item.estado == 'E') {
        if (open) {
          this.mensaje('Llega el '+ this.fechaTimeLine(item.enviollegada), this.temas.forms_titulo_bg, 13000, false)
        } else {
          this.$store.commit('closeAlert')
        }
      }
    },





    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },





    getEstado (estado, accion, item) {
      let c = ''
      let e = ''
      if (estado==='P') {
        e = 'Pendiente'
        c = this.temas.cen_estado_pendiente_bg
      } else if (estado==='T') {
        e = 'Facturado'
        c = this.temas.cen_estado_facturado_bg
      } else if (estado==='H') {
        e = 'En Embalaje'
        c = this.temas.cen_estado_enembalaje_bg
      } else if (estado==='B') {
        e = 'Embalado'
        c = this.temas.cen_estado_embalado_bg
      } else if (estado==='E') {
        e = 'En camino'
        c = this.temas.cen_estado_enviado_bg
      } else if (estado==='R') {
        e = 'Finalizado'
        c = this.temas.cen_estado_finalizado_bg
      } else if (estado==='F') {
        e = 'Enviado'
        c = this.temas.cen_estado_finalizado_bg
      } else if (estado==='A') {
        e = 'Anulado'
        c = this.temas.cen_estado_anulado_bg
      }

      if (accion==='c') {
        return c
      } else {
        return e
      }
    },





    getTipo (estado, accion) {
      let c = ''
      let e = ''
      if (estado==='M') {
        e = 'Normal'
        c = this.temas.cen_estado_enviado_bg
      } else if (estado==='P') {
        e = 'Promocion'
        c = this.temas.cen_estado_promocion_bg
      }
      if (accion==='c') {
        return c
      } else {
        return e
      }
    },





    formatoFecha(value) {
      return moment(String(value)).format('L')
    },





    formatoFechaCorta(value) {
      return moment(String(value)).format('DD-MM-YY')
    },





    fechaTimeLine(value) {
//    format("MMM Do YY")
      return moment(String(value)).format('D MMM-YY h:mm a')
    },





    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },





    formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
      try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
        const negativeSign = amount < 0 ? "-" : "";
        let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
        return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
      } catch (e) {
        console.log(e)
      }
    },





    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },





    loQuiero(item) {
      // PRIMERO BUSCO LA POSICION DE LA PUBLICACION
      let pos = -1
      for (let i=0; i<=this.$store.state.publicaciones.length-1; i++) {
        if (this.$store.state.publicaciones[i].id==item.id) {
          pos = i
          break
        }
      }
      // FINALMENTE PONGO EN ON EL 'LOQUIERO' SELECCIONADO
      if (item.loquiero) {
        this.$store.commit('setPublicacionLoQuieroOff', pos, { root: true })
        this.$store.commit('setContadorBloqueado', false, { root: true })
      } else {
        // AHORA ANULO TODOS LOS 'LOQUIERO'
        this.ctt = 1
        for (let i=0; i<=this.$store.state.publicaciones.length-1; i++) {
          this.$store.commit('setPublicacionLoQuieroOff', i, { root: true })
        }
        this.$store.commit('setPublicacionLoQuieroOn', pos, { root: true })
        this.$store.commit('setContadorBloqueado', true, { root: true })
      }
    },





    agregarAlCarrito(item) {
      let pos = -1
      for (let i=0; i<=this.carro.length-1; i++) {
        if (this.carro[i].articulo_id==item.articulo_id) {
          pos = i
          break
        }
      }
      if (pos == -1) {
        this.carro.push(item)
      }
      this.$store.commit('setCttPublicacion', [{ articulo_id: item.articulo_id, ctt: Number(this.ctt) }], { root: true })
      this.ctt = 0
      this.totalcarro = 0
      for (let i=0; i<=this.carro.length-1; i++) {
        this.totalcarro += this.carro[i].precio * this.carro[i].ctt
      }
      this.loQuiero(item)
      this.$store.commit('setHayCarrito', true, { root: true })
    },





    vaciarCarrito() {
      this.carro = []
      this.$store.commit('setVaciarCarro', false, { root: true })
      this.$store.commit('setHayCarrito', false, { root: true })
    },





    generarPedidoOfertas(){
      let art = []
      for (let i=0; i<=this.carro.length-1; i++) {
        art.push({
          articulo_id: this.carro[i].articulo_id,
          codigo: this.carro[i].articulo.codigo,
          nombre: this.carro[i].articulo.nombre,
          cantidad: Number(this.carro[i].ctt),
          cantidadMaxima: Number(this.carro[i].ctt),
          stock: 0,
          estado: 'new',
        })
      }

      return HTTP().post('/revisostockspromociones', {
        proveedor_id:  this.proveedor.id, //this.empresaId,
        articulos: art,
        }).then(({ data }) => {
          debugger
          if (data.length==0) {

            debugger
            return HTTP().post('generarpedidocarrito', {
              proveedor: this.$store.state.proveedor.id,
              sucursales: this.$store.state.sucursales,
              sucursal: this.$store.state.sucursal=='' ? null : this.$store.state.sucursal,
              cart: this.carro,
              vendedor: null,
              }).then(({ data }) => {
                debugger
                this.mensaje(data, this.$store.state.temas.card_ventas_bg, 2000)
                this.$store.commit('setHayCarrito', false, { root: true })
                this.ctt = 0
                this.carro = []
                this.listarPedidosHTTP()
              })
              .catch((e) => {
                this.mensaje(e, this.$store.state.temas.card_ventas_bg, 1500) 
            });

          } else {

            this.msg.msgTitle = 'Unidades en promocion insuficientes!'
            let m = ''
            if (data[0].stock==1) {
              m = 'Queda solo una unidad del articulo '+data[0].codigo+'<br>'
            } else {
              m = 'Quedan '+data[0].stock+' unidades del articulo '+data[0].codigo+'<br>'
            }
            m += '( '+data[0].nombre+' )<br><br>'
            m += 'Las disponibilidades de las promociones son dinámicas '
            m += 'ya que varios usuarios pueden estar comprando en forma simultánea.<br><br>'
            m += 'Refresque para que el sistema actualice las unidades disponibles.<br>'
            m += 'Una vez que envíe su pedido, éstas ya quedarán reservadas para Ud.'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'sin stock'
            this.msg.msgButtons = ['Aceptar']

          }
        })
    },





    cerrarDetallesPublicacion() {
      this.dialogDetalles = false
    },





    cerrarFotosDeLaPublicacion() {
      this.dialogVerFotos = false
    },





    verDetallesDeLaPublicacion(item) {
      this.detPub = item.detalles
      this.dialogDetalles = true
    },





    verFotos(item) {
      this.fotos = item.fotos
      this.dialogVerFotos = true
    },





    fechadelprecio (fecha) {
      if (moment(fecha).format('YYYY-MM-DD') == moment().format('YYYY-MM-DD')) {
        return 'Hoy'
      } else {
        return moment(fecha).format('DD-MM-YYYY')
      }
    },





    elPrecio(item, cual) {
      let pre = item.precio
      if (cual=='original') {
        pre = item.preciooriginal
      }
      let p = this.formatMoney(pre)
      if (this.$store.state.proveedor.preciosconiva) {
        p = this.formatMoney(pre*(1+(item.articulo.iva.tasa/100)))
      }
      return p
    },





  },
};
</script>

<style scoped>
  .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
    box-shadow: none;
  }
  .contenedor-galeria{
    display: flex;
    width: 100%;
    justify-content: space-around;
    flex-wrap: wrap;
    max-width: 1000px;
    margin: auto;
  }
  .galeria__img {
    width: 300px;
    height: 200px;
    margin-bottom: 30px;
    object-fit: cover;
    filter: brightness(100%);
    animation: escalar 1.5s infinite alternate;
  }
  @keyframes escalar {
    to {
      transform: scale(1)
    }
    from {
      transform: scale(1.01)
    }
    
  }
  .galeria__img:hover {
    filter: brightness(95%);
  }
  .contenedor-galeria-fuente-articulo {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    /*font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;*/
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    /*font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 70%;
  }
  .contenedor-galeria-fuente-importe {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 80%;
  }
  .contenedor-galeria-fuente-descuento {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    color: red;
  }
  .contenedor-galeria-fuente-ivasiniva {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 70%;
    color: gray;
  }
  .contenedor-galeria-fuente-final {
    /*font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;*/
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 120%;
    color: black;
    font-weight: 200%;
  }
  .contenedor-galeria-fuente-aviso-pedido {
    /*font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;*/
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
    color: black;
    font-weight: 90%;
  }

</style>
