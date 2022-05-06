<template>
  <v-layout align-start class="ma-0">
    <v-flex>
      <v-row>
        <v-col v-for="(cbt, idx) in comprobantes" v-bind:key="idx">
          <v-card tile outlined @click="selectTipoDeComprobante(cbt.nombre)"
            :disabled="!rol(idx,'ver')" max-width="180">
            <v-app-bar outlined
              :color="cbt.nombre==filtroComprobanteSel ? temas.cen_card_activo_bg : cbt.bg"
              :dark="cbt.nombre==filtroComprobanteSel ? temas.cen_card_activo_dark : cbt.dark">
              <v-toolbar-title class="panel-font">
                {{ cbt!=null ? cbt.nombre : '' }}
              </v-toolbar-title>
              <v-badge
                v-if="cbt.nombre=='Pedidos' && $store.state.hayPedidos>0 && !$store.state.externo"
                content="nuevos"
                :dark="true"
                icon="mdi-gift"
                :color="temas.cen_card_activo_bg">
              </v-badge>
              <v-spacer></v-spacer>
            </v-app-bar>

            <v-container>
              <v-row dense>
                <v-col cols="12" class="mini-font">
                  $ {{ formatMoney(cbt.total) }} ({{ cbt.ctt }})
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="3" class="pt-6 pb-0">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        v-show="(cbt.nombre!='Pedidos' || operarioVendedor )
                        && cbt.nombre!='Créditos'
                        && cbt.nombre!='Débitos'"
                        icon small outlined
                        @click="nuevo(cbt.nombre)" v-on="on">
                        <v-icon>
                          mdi-18px mdi-plus
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Nuevo</span>
                  </v-tooltip>
                </v-col>
<!--
                <v-col cols="3"  class="pt-6 pb-0" v-show="cbt.nombre=='Facturas'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon small outlined
                        @click="nuevo('Manual')" v-on="on">
                        <v-icon>
                          mdi-18px mdi-emoticon-dead
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Manual</span>
                  </v-tooltip>
                </v-col>
-->
                <v-col cols="3"  class="pt-6 pb-0" v-show="cbt.nombre=='Facturas'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon small outlined
                        @click="nuevo('not')" v-on="on">
                        <v-icon
                          :color="getEstadoAnotador($store.state.datosPanel.anotador)">
                          {{ $store.state.datosPanel.anotador==0
                            ? 'mdi-18px mdi-view-headline'
                            : 'mdi-18px mdi-message-text-outline'
                          }}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Anotaciones de VVentas</span>
                  </v-tooltip>
                </v-col>

                <v-col cols="3" class="pt-6 pb-0" v-show="cbt.nombre=='Pedidos'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon small outlined
                        @click="embalajes(0)" v-on="on">
                        <v-icon>
                          {{'mdi-18px mdi-stocking'}}
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Embalajes</span>
                  </v-tooltip>
                </v-col>

              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
        class="elevation-3 panel-font"
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

            <v-toolbar-title
              :color="temas.forms_titulo_bg"
              :dark="temas.forms_titulo_dark==true"
              class="body-2" v-model="sucursal">
              <v-chip class="ml-0" label
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark">
                <v-icon left>
                  mdi-airplane-takeoff
                </v-icon>
                <b class="panel-font">VENTAS</b>
              </v-chip>
              <!--
              <v-chip class="ml-1" label
                :background-color="temas.barra_principal_bg"
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark"
                autowidth>
                <v-flex shrink class="select">
                  <v-select
                    :background-color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    v-model="anio"
                    :items="anios"
                    flat solo autowidth
                    class="mt-7 panel-font"
                    @change="setAnio()">
                  </v-select>
                </v-flex>
              </v-chip>
              -->
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-chip v-for="anio in anios"
                :key="anio.id" dense :value="anio.id" label
                :color="anio==elAnio ? temas.cen_card_activo_bg : temas.barra_principal_bg"
                :dark="anio==elAnio ? temas.cen_card_activo_dark : temas.barra_principal_dark"
                class="ml-1 meses"
                @click="setAnio(anio)">
                {{ anio.substr(2,2) }}
              </v-chip>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-chip v-for="mes in meses"
                :key="mes.id" dense :value="mes.id" label
                :color="mes==elMes ? temas.cen_card_activo_bg : temas.barra_principal_bg"
                :dark="mes==elMes ? temas.cen_card_activo_dark : temas.barra_principal_dark"
                class="ml-1 panel-font"
                @click="setMes(mes)">
                {{ mes }}
              </v-chip>
              <v-progress-circular v-if="progress==true"
                class="ml-2"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-circular>
            </v-toolbar-title>

            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="550px" :fullscreen="true" persistent>
              <template v-slot:activator="{ on }"></template>
              <v-card>

                <v-toolbar flat
                  :dark="temas.forms_titulo_dark==true"
                  :color="temas.forms_titulo_bg">
                  <v-btn
                    icon
                    @click="cancelar"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="headdline">
                    {{ formTitle }}
                  </span>
                  <v-spacer></v-spacer>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="cprBalanceado() && editado.tercero_id"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text"
                    @click="confirmarComprobante">
                    {{ confirmarComprobanteMensaje }}
                  </v-btn>
                </v-toolbar>

                <!-- CABECERA DEL COMRPOBANTE -->
                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-container fluid class="pt-0">
                            <v-switch class="pt-0"
                              :color="temas.forms_titulo_bg"
                              :disabled=
                              "editado.cpr=='REM' || editado.cpr=='PRE' || editado.cpr=='PED'"
                              v-model="esManual"
                              label="Manual">
                            </v-switch>
                          </v-container>
                        </v-col>
                        <v-col v-show="basadoEnCpr==false" cols="6" sm="6" md="6" class="pt-0">
                          <v-autocomplete
                            ref="cliente"
                            v-model="editado.tercero_id"
                            :items="itemsTerceros"
                            :loading="isLoadingTerceros"
                            :search-input.sync="searchTerceros"
                            item-text="razon_social"
                            item-value="id"
                            autofocus
                            label="Cliente"
                            :color="temas.forms_titulo_bg"
                            placeholder="Escriba para buscar"
                            prepend-icon="mdi-database-search"
                            v-on:keydown.tab="buscoSiElTerceroEstaVinculado">
                          </v-autocomplete>
                        </v-col>
                        <v-col v-show="basadoEnCpr==true" cols="6" sm="6" md="6" class="pt-0">
                          <v-text-field
                            disabled
                            v-model="editado.nombre"
                            label="Cliente">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" class="pt-0">
                          <v-text-field
                            disabled
                            class="subtitle-1"
                            v-model="editado.letra"
                            label="Letra">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" class="pt-0">
                          <v-text-field
                            disabled
                            class="caption"
                            v-model="editado.responsableAbrev"
                            label="Cond.Fiscal">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" class="pt-0">
                          <v-text-field
                            disabled
                            class="caption"
                            v-model="editado.documento"
                            label="Documento">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" class="pt-0">
                          <v-text-field
                            disabled
                            class="caption"
                            v-model="editado.documentoNumero"
                            label="Numero">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <v-select
                            label='Direccion'
                            :color="temas.forms_titulo_bg"
                            v-model="editado.direccion_id"
                            :items="dirItems"
                            item-value="id"
                            :item-text="dirItems=>
                              `
                              ${dirItems.direccion} (
                              ${dirItems.postal.nombre} ) -
                              ${dirItems.postal.provincia.nombre} -
                              ${dirItems.postal.provincia.pais.nombre}
                              `">
                          </v-select>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" class="pt-0">
                          <v-select
                            label="Moneda" v-model="editado.moneda_id"
                            :color="temas.forms_titulo_bg"
                            :items="monItems" item-value="id" item-text="simbolo" return-object>
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-text-field
                            disabled
                            class="caption"
                            v-model="editado.vendedor.nombre"
                            label="Vendedor">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" class="pt-0">
                          <v-select
                            :color="temas.forms_titulo_bg"
                            :disabled=
                            "editado.cpr=='REM' || (editado.cpr=='PRE' && !sucursalDemo)"
                            class="body-2" label="Depósito" v-model="editado.deposito_id"
                            :items="depItems" item-value="id" item-text="id" return-object>
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-text-field
                            disabled
                            label="TRN"
                            :color="temas.forms_titulo_bg"
                            v-model="rentabilidad">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <!-- BOTON SELECCION DE FACTURAS SOLO PARA REMTOS -->
                      <v-row>
                        <v-col cols="3" sx="3" mx="3" class="pt-0">
                          <v-btn
                            v-if="editado.cpr=='REM' && editado.tercero_id!=''"
                            small
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            class="mt-0 mr-2 text-capitalize"
                            @click="buscarFacturasParaRemito" v-on="on">
                            Seleccionar Facturas
                          </v-btn>

                        </v-col>
                        <v-col cols="1" sx="1" mx="1" class="pt-0">
                          <v-text-field v-if="esManual"
                            v-model="sucManual"
                            @change="setSucManual()"
                            label="Sucursal">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sx="2" mx="2" class="pt-0">
                          <v-text-field v-if="esManual"
                            v-model="nroManual"
                            @change="setNroManual()"
                            @blur="busManual()"
                            label="Número">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sx="2" mx="2" class="pt-0">
                          <v-text-field v-if="esManual"
                            type="date"
                            v-model="editado.fecha"
                            label="Fecha">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <!-- FIN DE SELECCION DE FACTURAS SOLO PARA REMTOS -->

                      <!-- ITEMS DEL COMPROBANTE -->
                      <v-row>
                        <v-col cols="12" sx="12" mx="12" class="pt-0">
                          <span dense class="headline">Items</span>
                          <v-data-table
                            :headers="headersArt"
                            :items="articulos"
                            dense
                            class="elevation-3"
                            :footer-props="footerProps">
                            <template v-slot:top>

                              <!-- ARTICULO -->
                              <v-dialog v-model="dialogArt" max-width="1000px">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn v-show="editado.cpr!='REM'"
                                    fab
                                    :color="temas.forms_titulo_bg"
                                    :dark="temas.forms_titulo_dark==true"
                                    x-small
                                    @click="nuevoArt(false)">
                                    <v-icon>mdi-barcode</v-icon>
                                  </v-btn>
                                  <v-btn
                                    fab
                                    :color="temas.forms_titulo_bg"
                                    :dark="temas.forms_titulo_dark==true"
                                    x-small
                                    @click="nuevoArt(true)">
                                    <v-icon>mdi-comment-text-outline</v-icon>
                                  </v-btn>
                                </template>

                                <v-card>
                                  <v-toolbar flat
                                    :color="temas.forms_titulo_bg"
                                    :dark="temas.forms_titulo_dark==true">
                                    <v-btn
                                      icon @click="cancelarArt"
                                      :color="temas.forms_close_bg"
                                      :dark="temas.forms_close_dark==true">
                                      <v-icon>mdi-arrow-left-circle</v-icon>
                                    </v-btn>
                                    <span class="headdline">{{ formTitleArt }}</span>
                                    <v-spacer></v-spacer>
                                  </v-toolbar>

                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="12" sm="12" md="12" v-show="!esTexto">
                                          <v-text-field
                                            :disabled="editedIndexArt>-1"
                                            ref="buscar"
                                            label="código o descripción o código de barra"
                                            :color="temas.forms_titulo_bg"
                                            autofocus
                                            v-model="busArt"
                                            @blur="buscarArt(false)">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col v-show="seleccionarArticulo == true"
                                          cols="12" sm="12" md="12">
                                          <v-data-table
                                            :headers="headersSelArt"
                                            :color="temas.forms_titulo_bg"
                                            :items="selArt"
                                            dense
                                            class="elevation-3"
                                            single-select
                                            @click:row="selArtClick"
                                            :footer-props="footerProps10">
                                            <template v-slot:item.precio="{ item }">
                                              <span
                                                disable dark>${{ formatoImporte(item.precio) }}
                                              </span>
                                            </template>
                                          </v-data-table>
                                        </v-col>
                                      </v-row>
                                      <v-row v-show="seleccionarArticulo == false && !esTexto">
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
                                            class="caption"
                                            label="Cod.Barrra"
                                            v-model="editadoArt.codbar">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>

                                      <v-row v-show="seleccionarArticulo == false && !esTexto">
                                        <v-col cols="4" sm="4" md="4">
                                          <v-select
                                            disabled
                                            label='Deposito' v-model='editadoArt.deposito_id'
                                            :items='depItems' item-value='id' item-text='nombre'
                                            return-object>
                                          </v-select>
                                        </v-col>
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
                                            v-model="editadoArt.ivaNombre">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row v-show="seleccionarArticulo == false && !esTexto">
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            v-model="editadoArt.cantidad"
                                            ref="cant"
                                            class="text--left"
                                            label="Cantidad"
                                            @change="cantidadItem()">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-text-field
                                            disabled
                                            v-model="editadoArt.precio"
                                            label="Precio s/IVA"
                                            @change="precioItem()">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="1" sm="1" md="1">
                                          <v-text-field
                                            v-model="editadoArt.tasadescuento"
                                            label="% Bonif"
                                            @change="tasaDescuento()">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            v-model="editadoArt.importedescuento"
                                            label="$ Descuento"
                                            @change="importeDescuento()">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-text-field
                                            fill="$"
                                            disabled
                                            v-model="editadoArt.total"
                                            label="TOTAL">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row v-show="esTexto">
                                        <v-col cols="12" sm="12" md="12">
                                          <v-textarea
                                            v-model="editadoArt.texto"
                                            :color="temas.forms_titulo_bg"
                                            autofocus
                                            label="Texto"
                                            auto-grow
                                            outlined
                                            rows="4"
                                            row-height="25"
                                            shaped>
                                          </v-textarea>
                                        </v-col>
                                      </v-row>
                                      <v-row v-show="esTexto">
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            v-model="editadoArt.total"
                                            label="Total Item">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="4" sm="4" md="4">
                                          <v-select
                                            label="Moneda"
                                            v-model="editadoArt.moneda_id"
                                            :color="temas.forms_titulo_bg"
                                            :items="monItems" item-value="id"
                                            item-text="nombre" return-object>
                                          </v-select>
                                        </v-col>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-select
                                            label="% de IVA"
                                            v-model="editadoArt.iva_id"
                                            :color="temas.forms_titulo_bg"
                                            :items="ivaTasas" item-value="id"
                                            item-text="nombre" return-object>
                                          </v-select>
                                        </v-col>
                                      </v-row>

                                    </v-container>
                                  </v-card-text>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      @click="guardarArt(editadoArt)">
                                      Guardar
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                              <!-- FIN DEL ARTICULO -->

                            </template>
                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                dark>{{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>

                            <template v-slot:item.codigo="{ item }">
                              <span disable dark class="mini-font">{{ item.codigo }}</span>
                            </template>

                            <template v-slot:item.nombre="{ item }">
                              <span disable dark class="mini-font">{{ item.nombre }}</span>
                            </template>

                            <template v-slot:item.cantidad="{ item }">
                              <span
                                disable dark class="mini-font">{{ formatoImporte(item.cantidad) }}
                              </span>
                            </template>

                            <template v-slot:item.precio="{ item }">
                              <span
                                disable dark class="mini-font">${{ formatoImporte(item.precio) }}
                              </span>
                            </template>

                            <template v-slot:item.tasadescuento="{ item }">
                              <span disabled dark class="mini-font">
                                %{{ formatoImporte(item.tasadescuento) }}
                              </span>
                            </template>

                            <template v-slot:item.importedescuento="{ item }">
                              <span disabled dark class="mini-font">
                                ${{ formatoImporte(item.importedescuento) }}
                              </span>
                            </template>

                            <template v-slot:item.total="{ item }">
                              <span disable dark>${{ formatoImporte(item.total) }}</span>
                            </template>

                            <template v-slot:item.accion="{item}">

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-if="editado.cpr!='REM'"
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="sumarRestar(item, 1, false, 'articulos')" v-on="on">
                                    <v-icon dark>mdi-plus</v-icon>
                                  </v-btn>
                                </template>
                                <span>Sumar</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-if="editado.cpr!='REM'"
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="sumarRestar(item, -1, false, 'articulos')" v-on="on">
                                    <v-icon dark>mdi-minus</v-icon>
                                  </v-btn>
                                </template>
                                <span>Restar</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-if="editado.cpr!='REM'"
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="editarArt(item)" v-on="on">
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                                <span>Editar</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="borrarArt(item)" v-on="on">
                                    <v-icon>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Borrar</span>
                              </v-tooltip>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <!-- FIN ITEMS DE COMPROBANTE -->

                      <!-- TOTALES DEL COMPROBANTE -->
                      <v-row>
                        <v-col cols="1" sm="1" md="1" class="pt-2">
                          <v-text-field class="caption" v-if="editado.cpr!='REM'"
                            dense outlined prefix="$"
                            v-model="recargo"
                            :color="temas.forms_titulo_bg"
                            @change="calculos()"
                            label="$Recargo">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" class="pt-2">
                          <v-text-field class="caption" v-if="editado.cpr!='REM'"
                            dense outlined prefix="%"
                            v-model="editado.tasadescuento"
                            :color="temas.forms_titulo_bg"
                            @change="calculos()"
                            label="%Bonificación">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-2">
                          <v-text-field class="caption" v-if="editado.cpr!='REM'"
                            dense outlined prefix="$"
                            v-model="editado.importedescuento"
                            @change="calculos()"
                            label="$Bonificación">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-2">
                          <v-text-field class="caption" v-if="editado.cpr!='REM'"
                            disabled dense outlined prefix="$"
                            v-model="editado.gravado"
                            label="Gravado">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-2">
                          <v-text-field class="caption" v-if="editado.cpr!='REM'"
                            disabled dense outlined prefix="$"
                            v-model="editado.exento"
                            label="Exento">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-2">
                          <v-text-field class="caption" v-if="editado.cpr!='REM'"
                            disabled dense outlined prefix="$"
                            v-model="editado.iva"
                            label="IVA">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-2">
                          <v-text-field
                            disabled outlined prefix="$"
                            v-model="editado.total"
                            label="TOTAL">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <!-- FIN TOTALES DEL COMPROBANTE -->

                      <!-- TEXTO DEL COMPROBANTE -->
<!--
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-textarea
                            v-model="editado.texto"
                            :color="temas.forms_titulo_bg"
                            label="Texto del Comprobante"
                            auto-grow outlined rows="4"
                            row-height="25"
                            shaped>
                          </v-textarea>
                        </v-col>
                      </v-row>
-->
                      <!-- FIN DEL TEXTO DEL COMPROBANTE -->

                      <!-- BONIFICACION Y CREDITO MAXIMO -->
                      <v-row v-if="editado.cpr.substr(0,3)=='FAC'">
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-text-field class="caption"
                            disabled dense outlined
                            v-model="bonificacionmaxima"
                            label="% Max.Bonif.">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-text-field class="caption"
                            disabled dense outlined
                            v-model="creditomaximo"
                            label="Crédito Máximo">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-text-field class="caption"
                            disabled dense outlined
                            v-model="saldoctacte"
                            label="Saldo Cta.Cte">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-text-field class="caption"
                            disabled dense outlined
                            v-model="valorespendientes"
                            label="Valores pendientes">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-text-field class="caption"
                            disabled dense outlined
                            v-model="disponible"
                            label="Saldo Disponible">
                          </v-text-field>
                        </v-col>

                        <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-img v-if="electronica"
                            height="40" width="40" :src="`/images/afip.png`"
                            @click="chequearAfip">
                          </v-img>
                        </v-col>
                      </v-row>
                      <!-- BONIFICACION Y CREDITO MAXIMO -->

                      <!-- PAGO DEL COMPROBANTE -->
                      <v-row
                        v-if="(editado.cpr!='PRE' || $store.state.sucursalDemo) &&
                        editado.cpr!='REM' && editado.cpr.substr(0,3)!='PED' && tienesaldo==true">
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-btn
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            @click="setComoPaga(2)">
                            Detallar Pago
                          </v-btn>
                        </v-col>

                        <v-col cols="10" sm="10" md="10" class="pt-0">

                          <v-chip class="ma-1 caption" label
                            v-show="medpag[0].activo"
                            :color=
                            "medpag[0].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            Eftvo. <b>{{ formatoImporte(medpag[0].total) }}</b>
                          </v-chip>
                          <v-chip class="ma-1 caption" label
                            v-show="medpag[1].activo"
                            :color=
                            "medpag[1].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            T.Créd. $<b>{{ formatoImporte(medpag[1].total)}}</b>
                          </v-chip>
                          <v-chip class="ma-1 caption" label
                            v-show="medpag[2].activo"
                            :color=
                            "medpag[2].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            T.Déb. $<b>{{ formatoImporte(medpag[2].total)}}</b>
                          </v-chip>
                          <v-chip v-if="disponible>0" class="ma-1 caption" label
                            v-show="medpag[3].activo"
                            :color=
                            "medpag[3].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            C.Cte. $<b>{{ formatoImporte(medpag[3].total) }}</b>
                          </v-chip>
                          <v-chip class="ma-1 caption" label
                            v-show="medpag[4].activo"
                            :color=
                            "medpag[4].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            Transf. $<b>{{ formatoImporte(medpag[4].total) }}</b>
                          </v-chip>
                          <v-chip class="ma-1 caption" label
                            v-show="medpag[5].activo"
                            :color=
                            "medpag[5].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            Cheque $<b>{{ formatoImporte(medpag[5].total) }}</b>
                          </v-chip>
                          <v-chip class="ma-1 caption" label
                            v-show="medpag[6].activo"
                            :color=
                            "medpag[6].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            M.Pago $<b>{{ formatoImporte(medpag[6].total) }}</b>
                          </v-chip>
                          <v-chip class="ma-1 caption" label
                            v-show="medpag[7].activo"
                            :color=
                            "medpag[7].total==0 ? temas.forms_titulo_bg : temas.cen_btns_bg"
                            :dark="temas.forms_titulo_dark==true">
                            T.Pago $<b>{{ formatoImporte(medpag[7].total) }}</b>
                          </v-chip>
                        </v-col>
                      </v-row>
                      <!-- FIN TOTALES DEL COMPROBANTE -->

                    </v-container>
                  </v-card-text>
                </v-form>
                <!-- FIN DE LA CABECERA DEL COMPROBANTE -->

              </v-card>
            </v-dialog>

            <!--// PROCESAMIENTO DE PEDIDOS // -->
            <v-dialog v-model="dialogPed" max-width="550px" :fullscreen="true">
              <template v-slot:activator="{}"></template>
              <v-card>
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cancelarPed"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{ empresa }} -
                    PROCESAR PEDIDO
                    {{itemActual.cpr}} - {{itemActual.tercero.nombre}}
                  </span>
                  <v-spacer></v-spacer>
                  <span class="text--right">
                    <v-btn v-show="pedProcesable"
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class="ma-2 white--text" @click="guardarPed">Guardar
                    </v-btn>
                  </span>
                </v-toolbar>

                <v-form ref="art">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="4" sx="4" mx="4">
                          <v-btn v-show="pedProcesable"
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            @click="setComoPaga(2)">
                            Ajustar todos a Stock
                          </v-btn>
                        </v-col>
                        <v-col cols="4" sx="4" mx="4">
                          <v-btn v-show="pedProcesable"
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            @click="setComoPaga(2)">
                            Seleccionar Todos
                          </v-btn>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <span dense class="headline">Items del Pedido</span>
                          <v-data-table
                            :headers="headersPed"
                            :items="artPed"
                            dense
                            class="elevation-3"
                            hide-default-footer>
                            <template v-slot:item.estado="{ item }">
                              <v-chip
                                class="caption"
                                dark
                                :color="getEstadoPed(item.estado,'c')">
                                {{ getEstadoPed(item.estado,'e') }}
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="item.stock>0"
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="sumarRestar(item, 1, false, 'pedidos')" v-on="on">
                                    <v-icon dark>mdi-plus</v-icon>
                                  </v-btn>
                                </template>
                                <span>Sumar</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="item.stock>0"
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="sumarRestar(item, -1, false, 'pedidos')" v-on="on">
                                    <v-icon dark>mdi-minus</v-icon>
                                  </v-btn>
                                </template>
                                <span>{{}}Restar</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="item.stock>0"
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="sumarRestar(item, -1, false, 'pedidos')" v-on="on">
                                    <v-icon dark>mdi-format-horizontal-align-left</v-icon>
                                  </v-btn>
                                </template>
                                <span>Ajustar a Stock</span>
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
            <!--// FIN DEL PROCESAMIENTO DE PEDIDOS // -->

            <!--TRANSFERENCIA DE PEDIDO A OTRA SUCURSAL -->
            <v-dialog v-model="dialogTransferirPedido" max-width="1030px">
              <template v-slot:activator="{}"></template>
              <v-card>
                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cancelarTransfPed"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    Transferir Pedido:
                    {{itemActual.cpr}} - {{itemActual.tercero.nombre}}
                  </span>
                  <v-spacer></v-spacer>
                  <span class="text--right">
                    <v-btn v-show="artTransfPedCtt>0"
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class="ma-2 white--text" @click="guardarTransfPed">Confirmar Transferencia
                    </v-btn>
                  </span>
                </v-toolbar>

                <v-form ref="art">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <v-select
                            :color="temas.forms_titulo_bg"
                            class="body-2" label="Sucursal destino"
                            v-model="artTransfPedId"
                            :items="artTransfPedSucDes"
                            item-value="id" item-text="nombre"
                            return-object>
                          </v-select>
                        </v-col>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <p>
                            La transferencias se pueden realizar solo una vez y no se pueden
                            reversar. Seleccione con cuidado los artículos y las cantidades.
                          </p>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <span dense class="headline">Items del Pedido</span>
                          <v-data-table
                            :headers="headersTransfPed"
                            :items="artTransfPed"
                            dense
                            class="elevation-3"
                            hide-default-footer>
                            <template v-slot:item.accion="{item}">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="sumarRestar(item, 1, false, 'transfPed')" v-on="on">
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
                                    @click="sumarRestar(item, -1, false, 'transfPed')" v-on="on">
                                    <v-icon dark>mdi-minus</v-icon>
                                  </v-btn>
                                </template>
                                <span>Restar</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="editarTransferirAOtraSucursal(item)" v-on="on">
                                    <v-icon dark>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                                <span>Editar</span>
                              </v-tooltip>
                            </template>

                            <template v-slot:top>
                              <v-dialog v-model="dialogTransferirItem" max-width="250px">
                                <v-card>
                                  <v-card-title>
                                    <span class="headline">A Transferir</span>
                                  </v-card-title>
                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                          <v-text-field
                                            autofocus
                                            :color="temas.forms_titulo_bg"
                                            v-model="editadoTransfItem.cttATransferir"
                                            label="A Transferir"
                                            @focus="$event.target.select()">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                    </v-container>
                                  </v-card-text>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      :disabled=
                                      "editadoTransfItem.cttATransferir>
                                      editadoTransfItem.cttOriginal"
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      @click="guardarTransferirItem(item)">
                                      Guardar
                                    </v-btn>
                                    <v-btn
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      text
                                      @click="cancelarTransferirItem">
                                      Cancelar
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE TRANSFERENCIA DE PEDIDO -->

            <!--// SEGUIMIENTO/RASTREO DE COMPROBANTES // -->
            <v-dialog v-model="dialogRas" max-width="1260px">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="cerrarRas"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - Seguimiento del Comprobante: {{editado.cpr}}
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card>
                <v-form ref="art2">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <v-data-table
                            :headers="headersRas"
                            :items="rastreo"
                            dense
                            class="elevation-3">
                          </v-data-table>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DEL RASTREO -->

            <!--// TIMELINE // -->
            <v-dialog v-model="dialogTimeLine" max-width="500px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="cerrarTimeLine"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - Timeline {{editado.cpr}}
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-card class="mx-auto" max-width="500">
                <v-card-text class="py-0">
                  <v-timeline align-top dense>
                    <v-timeline-item
                      v-for="(tm, idx) in timeLine" v-bind:key="idx"
                      :color="temas.barra_principal_bg" small>

                        <v-card :color="temas.forms_titulo_bg" dark>
                          <v-card-title class="pt-1 pb-1 subtitle-2">
                            {{tm.novedad}}
                          </v-card-title>
                          <v-card-text class="pt-2 pb-0 caption white text--primary">
                            <p>
                              {{ fechaTimeLine(tm.created_at) }}
                              <br>
                              {{ tm.detalles }}
                            </p>
                          </v-card-text>
                        </v-card>
                    </v-timeline-item>
                  </v-timeline>
                </v-card-text>
              </v-card>

            </v-dialog>
            <!-- FIN DEL TIMELINE -->

            <!--// ANOTACIONES DE VENTAS // -->
            <v-dialog v-model="dialogNot" max-width="1250px">
              <!--<template v-slot:activator="{}"></template>-->
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cerrarArtNot"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{empresa}} - Anotaciones de Ventas
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn v-show="articulos.length>0"
                    color="teal accent-4" class="ma-2 white--text" @click="facturarAnotaciones">
                    Facturar Anotaciones
                  </v-btn>
                </v-toolbar>

                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <v-data-table
                            :headers="headersNot"
                            :items="articulos"
                            dense
                            class="elevation-3">
                            <template v-slot:top>
                              <v-dialog v-model="dialogArtNot" max-width="900px">

                                <template v-slot:activator="{}">
                                  <v-btn
                                    fab
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    x-small
                                    @click="nuevoArtNot">
                                    <v-icon>mdi-plus</v-icon>
                                  </v-btn>
                                </template>

                                <v-card>
                                  <v-toolbar flat
                                    :color="temas.forms_titulo_bg"
                                    :dark="temas.forms_titulo_dark==true">
                                    <v-btn
                                      icon @click="cancelarArtNot"
                                      :color="temas.forms_close_bg"
                                      :dark="temas.forms_close_dark==true">
                                      <v-icon>mdi-arrow-left-circle</v-icon>
                                    </v-btn>
                                    <span class="headdline">{{ formTitleArt }}</span>
                                    <v-spacer></v-spacer>
                                  </v-toolbar>

                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                          <v-text-field
                                            ref="buscar"
                                            label="código o descripción o código de barra"
                                            :color="temas.forms_titulo_bg"
                                            autofocus
                                            v-model="busArt"
                                            @blur="buscarArt(false)">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col v-show="seleccionarArticulo == true"
                                          cols="12" sm="12" md="12">
                                          <v-data-table
                                            :headers="headersSelArt"
                                            :items="selArt" dense
                                            class="elevation-3"
                                            @click:row="selArtClick"
                                            :footer-props="footerProps10">
                                            <template v-slot:item.precio="{ item }">
                                              <span
                                                disable dark>${{ formatoImporte(item.precio) }}
                                              </span>
                                            </template>
                                          </v-data-table>
                                        </v-col>
                                      </v-row>
                                      <v-row>
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
                                            class="caption"
                                            label="Cod.Barrra"
                                            v-model="editadoArt.codbar">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="4" sm="4" md="4">
                                          <v-select
                                            disabled
                                            label='Deposito' v-model='editadoArt.deposito_id'
                                            :items='depItems' item-value='id' item-text='nombre'
                                            return-object>
                                          </v-select>
                                        </v-col>
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
                                            v-model="editadoArt.ivaNombre">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            v-model="editadoArt.cantidad"
                                            :color="temas.forms_titulo_bg"
                                            class="text--left"
                                            label="Cantidad"
                                            @change="cantidadItem()">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-text-field
                                            disabled
                                            v-model="editadoArt.precio"
                                            label="Precio"
                                            @change="precioItem()">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="1" sm="1" md="1">
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3">
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-text-field
                                            disabled
                                            v-model="editadoArt.total"
                                            label="TOTAL">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                    </v-container>
                                  </v-card-text>

                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      @click="guardarArt(editadoArt)">
                                      Guardar
                                    </v-btn>
                                  </v-card-actions>

                                </v-card>
                              </v-dialog>
                            </template>

                            <template v-slot:item.total="{ item }">
                              <span disable dark>${{ formatoImporte(item.total) }}</span>
                            </template>

                            <template v-slot:item.accion="{ item }">

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="sumarRestar(item, 1, true, 'articulos')" v-on="on">
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
                                    @click="sumarRestar(item, -1, true, 'articulos')" v-on="on">
                                    <v-icon dark>mdi-minus</v-icon>
                                  </v-btn>
                                </template>
                                <span>Restar</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="borrarArt(item)" v-on="on">
                                    <v-icon dark>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Borrar</span>
                              </v-tooltip>

                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>

                      <!-- TOTALES DEL ANOTADOR -->
                      <v-row>
                        <v-col cols="6" sm="6" md="6">
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled dense outlined
                            v-model="rentabilidad"
                            label="TRN">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled dense outlined
                            v-model="anotadorTotal"
                            label="TOTAL">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <!-- FIN DE LOS TOTALES DEL COMPROBANTE -->

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE ANOTACIONES DE VENTAS -->

            <!--// EMBALAJES // -->
            <v-dialog v-model="dialogEmbalajes" max-width="1250px">
              <template v-slot:activator="{}"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cerrarEmbalajes"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{empresa}} - Embalajes
                  </span>
                  <v-spacer></v-spacer>
                  <v-select v-show="aEmbalar.length>0"
                    class="mt-6" label='Agrupar por...'
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    outlined dense autofocus
                    v-model='grpEmbalaje'
                    :items='grupoEmbalajes'
                    @change="embalajes()">
                  </v-select>
                  <v-spacer></v-spacer>

                  <v-btn v-show="embalajesSel>0"
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    class="ma-2 white--text" @click="confirmarEmbalados">
                    Confirmar Embalajes
                    <v-badge
                      :content="embalajesSel"
                      :value="embalajesSel"
                      color="green"
                      overlap class="ml-2 mb-4 ml-4">
                    </v-badge>
                  </v-btn>

                  <v-btn v-show="aEmbalar.length>0"
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    class="ma-2 white--text" @click="printEmbalajes">
                    Imprimir Embalajes
                  </v-btn>
                </v-toolbar>

                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <v-data-table
                            :headers="headersEmbalajes"
                            :items="aEmbalar"
                            dense
                            class="elevation-3">

                            <template v-slot:item.cpr="{ item }">
                              <span disable dark class="mini-font">{{ item.cpr }}</span>
                            </template>

                            <template v-slot:item.nomcli="{ item }">
                              <span disable dark class="mini-font">{{ item.nomcli }}</span>
                            </template>

                            <template v-slot:item.codigo="{ item }">
                              <span disable dark class="mini-font">{{ item.codigo }}</span>
                            </template>

                            <template v-slot:item.nomart="{ item }">
                              <span disable dark class="mini-font">{{ item.nomart }}</span>
                            </template>

                            <template v-slot:item.cantidad="{ item }">
                              <span
                                disable dark class="mini-font">{{ formatoImporte(item.cantidad) }}
                              </span>
                            </template>

                            <template v-slot:item.zona="{ item }">
                              <span disable dark class="mini-font">{{ item.zona }}</span>
                            </template>

                            <template v-slot:item.accion="{ item }">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="item.cpr!=null"
                                    fab x-small
                                    :color="item.seleccionado==true ?
                                    temas.cen_card_activo_bg :
                                    temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    v-model="item.seleccionado"
                                    @click="seleccionarEmbalaje(item)" v-on="on">
                                    <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span>Seleccionar</span>
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
            <!-- FIN DE EmbalajeS -->

            <!--// ENVIOS // -->
            <v-dialog v-model="dialogEnvios" max-width="700px">
              <template v-slot:activator="{}"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cerrarEnvio"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{empresa}} - Envíos
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    class="ma-2 white--text" @click="confirmarEnvioRetiro('E')">
                    Confirmar Envío
                  </v-btn>
                </v-toolbar>

                <v-form ref="art3">
                  <v-card-text>
                    <v-container>

                      <v-row>
                        <v-col cols="8" sm="8" md="8">
                          <v-text-field
                            outlined
                            v-model="envio.quienretira"
                            label="Quien Retira?"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            outlined
                            v-model="envio.documento"
                            label="Documento"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-radio-group v-model="envio.tipodeenvio" row class="pt-0">
                            <v-radio
                              :color="temas.forms_titulo_bg"
                              label="Envío Propio"
                              value="P">
                            </v-radio>
                            <v-radio
                              :color="temas.forms_titulo_bg"
                              label="Envío por Terceros"
                              value="T">
                            </v-radio>
                          </v-radio-group>
                        </v-col>
                      </v-row>

                      <v-row v-show="envio.tipodeenvio=='P'">
                        <v-col cols="12" sm="12" md="12">
                          <v-select
                            label='Direccion de Envío' outlined
                            :color="temas.forms_titulo_bg"
                            v-model="envio.direccion_id"
                            :items="dirItems"
                            item-value="id"
                            :item-text="dirItems=>
                              `
                              ${dirItems.direccion} - (
                              ${dirItems.postal.nombre} ) -
                              ${dirItems.postal.provincia.nombre} -
                              ${dirItems.postal.provincia.pais.nombre}
                              `">
                          </v-select>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-col v-show="envio.tipodeenvio=='T'">
                          <v-autocomplete
                            class="pt-0"
                            label="Transportista"
                            v-model="envio.transporte_id"
                            :items="itemsTercerosTrans"
                            :loading="isLoadingTercerosTrans"
                            :search-input.sync="searchTercerosTrans"
                            item-text="nombre"
                            item-value="id"
                            outlined
                            :color="temas.forms_titulo_bg"
                            placeholder="Escriba para buscar">
                          </v-autocomplete>
                        </v-col>
                      </v-row>

                      <v-row v-show="envio.tipodeenvio=='T'" class="pt-0">
                        <v-col cols="12" sm="12" md="12">
                          <v-radio-group v-model="envio.adomicilio" row class="pt-0">
                            <v-radio
                              :color="temas.forms_titulo_bg"
                              label="Envía a Domicilio"
                              value="S">
                            </v-radio>
                            <v-radio
                              :color="temas.forms_titulo_bg"
                              label="A otra dirección"
                              value="N">
                            </v-radio>
                          </v-radio-group>
                        </v-col>
                      </v-row>

                      <v-row v-show="envio.tipodeenvio=='T' && envio.adomicilio=='S'">
                        <v-col cols="12" sm="12" md="12">
                          <v-select
                            label='Direccion de Envío' outlined
                            :color="temas.forms_titulo_bg"
                            v-model="envio.direccion_id"
                            :items="dirItems"
                            item-value="id"
                            :item-text="dirItems=>
                              `
                              ${dirItems.direcion} - (
                              ${dirItems.postal.nombre} ) -
                              ${dirItems.postal.provincia.nombre} -
                              ${dirItems.postal.provincia.pais.nombre}
                              `">
                          </v-select>
                        </v-col>
                      </v-row>

                      <v-row v-show="envio.tipodeenvio=='T' && envio.adomicilio=='N'">
                        <v-col cols="12" sm="12" md="12">
                          <v-autocomplete
                            class="pt-0"
                            label="Punto de Retiro"
                            v-model="envio.puntoderetiro_id"
                            :items="itemsTercerosPdr"
                            :loading="isLoadingTercerosPdr"
                            :search-input.sync="searchTercerosPdr"
                            item-text="nombre"
                            item-value="id"
                            outlined
                            :color="temas.forms_titulo_bg"
                            placeholder="Escriba para buscar"
                            @change="leerDirPdr()">
                          </v-autocomplete>
                        </v-col>
                      </v-row>
                      <v-row v-show="envio.tipodeenvio=='T' && envio.adomicilio=='N'">
                        <v-col cols="12" sm="12" md="12">
                          <v-select
                            label='Direccion del Punto de Retiro' outlined
                            :color="temas.forms_titulo_bg"
                            v-model="envio.puntoderetirodireccion_id"
                            :items="dirItemsPdrDir"
                            item-value="id"
                            :item-text="dirItemsPdrDir=>
                              `
                              ${dirItemsPdrDir.direccion} (
                              ${dirItemsPdrDir.postal.nombre} ) -
                              ${dirItemsPdrDir.postal.provincia.nombre} -
                              ${dirItemsPdrDir.postal.provincia.pais.nombre}
                              `">
                          </v-select>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            type="date" outlined
                            v-model="envio.llegada"
                            :color="temas.forms_titulo_bg"
                            label="Fecha de llegada">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" sx="4" mx="4">
                          <v-switch
                            :disabled="envio.remitogenerado==true"
                            :label="envio.remito_msg"
                            v-model="envio.generaremito"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" v-show="envio.remitogenerado==true">
                          <v-text-field
                            disabled outlined
                            v-model="envio.remito_numero"
                            :color="temas.forms_titulo_bg"
                            label="Número de Remito">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            outlined
                            v-model="envio.importeflete"
                            label="Total del Flete"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            outlined
                            v-model="envio.bultos"
                            label="Bultos"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6" md="6">
                          <v-text-field
                            outlined disabled
                            v-model="envio.traking"
                            label="Código de Seguimiento"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                      </v-row>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE ENVIOS -->

            <!--// RETIROS // -->
            <v-dialog v-model="dialogRetiro" max-width="700px">
              <template v-slot:activator="{}"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cerrarRetiro"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    {{empresa}} - Retiro de Pedido
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    class="ma-2 white--text" @click="confirmarEnvioRetiro('R')">
                    Confirmar Retiro
                  </v-btn>
                </v-toolbar>

                <v-form ref="art3">
                  <v-card-text>
                    <v-container>

                      <v-row>
                        <v-col cols="4" sx="4" mx="4">
                          <v-switch
                            :disabled="retiro.remitogenerado==true"
                            :label="retiro.remito_msg"
                            v-model="retiro.generaremito"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            disabled outlined
                            v-model="retiro.remito_numero"
                            :color="temas.forms_titulo_bg"
                            label="Número de Remito">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            outlined
                            v-model="retiro.bultos"
                            label="Bultos"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="8" sm="8" md="8">
                          <v-text-field
                            outlined
                            v-model="retiro.quienretira"
                            label="Quien Retira?"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4">
                          <v-text-field
                            outlined
                            v-model="retiro.documento"
                            label="Documento"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                      </v-row>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE RETIROS -->

            <!--// ANULAR PEDIDO // -->
            <v-dialog v-model="dialogAnularPedido" max-width="700px">
              <template v-slot:activator="{}"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cerrarAnularPedido"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="text--right">
                    Anular Pedido de {{itemActual.tercero.nombre}}
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn
                    :color="temas.barra_principal_bg"
                    :dark="temas.barra_principal_dark"
                    class="ma-2 white--text" @click="anularPedidoHTTP()">
                    Confirmar
                  </v-btn>
                </v-toolbar>
                <v-form ref="anuped">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sm="12" md="12" class="pt-0">
                          <span><b> Pedido {{itemActual.cpr}}</b></span>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-textarea
                            v-model="motivoAnularPedido"
                            :color="temas.forms_titulo_bg"
                            autofocus label="Motivo de la Anulación" auto-grow
                            outlined rows="4" row-height="25" shaped>
                          </v-textarea>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN ANULAR PEDIDO -->

            <!--REMITO DE UNA FACTURA -->
            <v-dialog v-model="dialogRem" max-width="800px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="cerrarRem"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - Remito de una Factura: {{editado.cpr}}
                </span>
                <v-spacer></v-spacer>
                <v-btn
                  :color="temas.barra_principal_bg"
                  :dark="temas.barra_principal_dark"
                  class="ma-2 white--text"
                  @click="guardarRem()">
                  Confirmar
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>

                      <v-row>
                        <v-col cols="4" sx="4" mx="4" class="body-2">
                          <v-switch
                            autofocus
                            :color="temas.forms_titulo_bg"
                            label="Remito Valorizado"
                            v-model="remitoValorizado">
                          </v-switch>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            label="TOTAL DEL COMRPOBANTE"
                            disabled
                            v-model="editado.total">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            label="CTT DEL ARTICULOS"
                            disabled
                            v-model="remitoItems">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <v-col cols="12" sm="12" md="12">
                        <v-textarea
                          v-model="remitoTexto"
                          :color="temas.forms_titulo_bg"
                          autofocus
                          label="Texto del Remito"
                          auto-grow outlined rows="4"
                          row-height="25"
                          shaped>
                        </v-textarea>
                      </v-col>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE REMITO DE UNA FACTURA -->

            <!-- DIALOG DE REMITO PARA VARIAS FACTURAS  -->
            <v-dialog v-model="dialogSelFacturas" max-width="700px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="cerrarFacturasParaRemito"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - FACTURAS A INCLUIR EN EL REMITO
                </span>
                <v-spacer></v-spacer>
                <v-btn v-show="selected.length>0"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="confirmarFacturasSeleccionadas">
                  Confirmar
                </v-btn>

              </v-toolbar>

              <v-card>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                       <v-row>
                        <v-col cols="12" sm="12" md="12">
                          <v-form ref="art">
                            <v-data-table
                              v-model="selected"
                              :headers="headersSelFacturas"
                              :items="facturas"
                              @toggle-select-all="selectAll"
                              :single-select="false"
                              item-key="cpr"
                              show-select  dense
                              class="pl-1 pr-3 elevation-1 pt-2"
                              :footer-props="footerProps">
                              <template v-slot:item.total="{ item }">
                                <span disable dark>$ {{ formatoImporte(item.total) }}</span>
                              </template>
                              <template v-slot:item.fecha="{ item }">
                                <span disable dark>{{ formatoFecha(item.fecha) }}</span>
                              </template>
                            </v-data-table>

                          </v-form>
                        </v-col>
                      </v-row>
                     </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DIALOG DE REMITO PARA VARIAS FACTURAS  -->

            <!--NDC DE UNA FACTURA -->
            <v-dialog v-model="dialogNdcFac" max-width="1200px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="cerrarNdc"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - NDC s/ {{editado.cpr}} - ({{editado.nombre}})
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-card>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="4" sm="4" md="4">
                          <v-select
                            label='Motivo'
                            v-model='ndcMotivoSel'
                            autofocus
                            :color="temas.forms_titulo_bg"
                            :items='ndcMotivos' item-value='id' item-text='nombre'
                            @change="selMotivoNdc">
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-show="ndcMotivoSel==1"
                            :color="temas.forms_titulo_bg"
                            v-model="ndcTasaDescuento"
                            @change="calculosNdc(1)"
                            label="%Desc.">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            v-show="ndcMotivoSel==1 || ndcMotivoSel==2"
                            :color="temas.forms_titulo_bg"
                            v-model="ndcTotal"
                            @change="calculosNdc(2)"
                            label="Total NDC">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            label="TOTAL DEL COMRPOBANTE"
                            disabled
                            v-model="editado.total">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <!--// PROCESAMIENTO DE DEVOLUCION DE ARTICULOS EN NDC // -->
                      <v-row v-show="dialogNdcxDev==true">
                        <v-col cols="12" sm="12" md="12">
                          <v-form ref="art">
                            <span dense class="headline">Items a Devolver</span>
                            <v-data-table
                              :headers="headersNdcxDev"
                              :items="articulos"
                              dense
                              class="elevation-3"
                              hide-default-footer>

                              <template v-slot:item.accion="{ item }">
                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      fab x-small
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      class="mr-2"
                                      @click="sumarRestarNdcDev(item, 1)" v-on="on">
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
                                      @click="sumarRestarNdcDev(item, -1)" v-on="on">
                                      <v-icon dark>mdi-minus</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Restar</span>
                                </v-tooltip>

                                <v-tooltip bottom>
                                  <template v-slot:activator="{ on }">
                                    <v-btn
                                      fab x-small
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      class="mr-2"
                                      @click="sumarRestarNdcDev(item, 999999)" v-on="on">
                                      <v-icon dark>mdi-checkbox-blank-circle</v-icon>
                                    </v-btn>
                                  </template>
                                  <span>Devolver todo</span>
                                </v-tooltip>
                              </template>

                            </v-data-table>
                          </v-form>
                        </v-col>
                      </v-row>
                      <!--// FIN DEL PROCESAMIENTO DE DEVOLUCION DE ARTICULOS EN NDC // -->

                      <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                          v-show="ndcTotal>0"
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          @click="guardarNdc()">
                          Confirmar
                        </v-btn>
                      </v-card-actions>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE NDC DE UNA FACTURA -->

            <!--NDD DE UNA FACTURA -->
            <v-dialog v-model="dialogNddFac" max-width="1200px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="cerrarNdd"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - NDD s/ {{editado.cpr}} - ({{editado.nombre}})
                </span>
                <v-spacer></v-spacer>
                <v-btn
                  v-show="nddTotal>0 || selected.length>0"
                  :color="temas.barra_principal_bg"
                  :dark="temas.barra_principal_dark"
                  class="ma-2 white--text"
                  @click="guardarNdd()">
                  Confirmar
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form ref="art3">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="4" sm="4" md="4">
                          <v-select
                            label='Motivo'
                            v-model='nddMotivoSel'
                            autofocus
                            :color="temas.forms_titulo_bg"
                            :items='nddMotivos' item-value='id' item-text='nombre'
                            @change="selMotivoNdd">
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-show="nddMotivoSel==2"
                            :color="temas.forms_titulo_bg"
                            v-model="nddTasaDescuento"
                            @change="calculosNdd(1)"
                            label="% del Total">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            v-show="ndcMotivoSel==1 || ndcMotivoSel==2"
                            :color="temas.forms_titulo_bg"
                            v-model="nddTotal"
                            @change="calculosNdd(2)"
                            label="Total NDD">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            label="TOTAL DEL COMPROBANTE"
                            disabled
                            v-model="editado.total">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <!--// PROCESAMIENTO DE DEVOLUCION DE CHEQUES EN NDD // -->
                      <v-row v-show="dialogNddxDev==true">
                        <v-col cols="12" sm="12" md="12">
                          <v-form ref="art">
                            <span class="font-weight-medium">
                              Cheques a Devolver
                            </span>
                            <v-data-table
                              v-model="selected"
                              :headers="headersNddxDev"
                              :items="cheques"
                              @toggle-select-all="selectAllChq"
                              :single-select="false"
                              item-key="cpr"
                              show-select dense
                              class="pl-1 pr-3 elevation-1 pt-2"
                              :footer-props="footerProps"
                              @item-selected="clickRow">
                              <template v-slot:item.importe="{ item }">
                                <span
                                  disable dark>${{ formatoImporte(item.importe) }}
                                </span>
                              </template>
                              <template v-slot:item.fechafinanciera="{ item }">
                                <span
                                  disable dark>
                                  {{ formatoFechaCorta(item.fechafinanciera) }}
                                </span>
                              </template>
                              <template v-slot:item.seleccionado="{ item }">
                                <v-chip fab
                                  :color="getColor(item.seleccionado)"
                                  dark>{{item.seleccionado?'Sí':'No'}}
                                </v-chip>
                              </template>
                            </v-data-table>

                          </v-form>
                        </v-col>
                      </v-row>
                      <!--// FIN DEL PROCESAMIENTO DE DEVOLUCION DE ARTICULOS EN NDC // -->

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE NDD DE UNA FACTURA -->

            <!--RECIBO -->
            <v-dialog v-model="dialogRec" max-width="1300px" persistent>
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="cerrarRec"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{ formTitle }}
                </span>
                <v-spacer></v-spacer>
                <v-btn v-if="cprBalanceado()"
                  :color="temas.barra_principal_bg"
                  :dark="temas.barra_principal_dark"
                  @click="confirmarValores()">
                  Confirmar
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form ref="pend">
                  <v-card-text>
                    <v-container>

                      <!-- PIDO CLIENTE -->
                      <v-row v-show="reciboDeUnSoloComprobante==false">
                        <v-col cols="6" sx="6" mx="6">
                          <v-autocomplete
                            ref="clienterecibo"
                            v-model="editado.tercero_id"
                            :items="itemsTerceros"
                            :loading="isLoadingTercerosRec"
                            :search-input.sync="searchTercerosRec"
                            :color="temas.forms_titulo_bg"
                            item-text="nombre"
                            item-value="id"
                            autofocus
                            label="Cliente"
                            placeholder="Escriba para buscar"
                            prepend-icon="mdi-database-search"
                            v-on:keydown.tab="buscoSiElTerceroEstaVinculado">
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-model="editado.total"
                            :color="temas.forms_titulo_bg"
                            label="Total Recibo">
                          </v-text-field>
                        </v-col>
                        <v-col>
                          <v-btn v-show="pend.length>0"
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            text
                            @click="automaticoPend()">
                            Selección Automática
                          </v-btn>
                        </v-col>
                      </v-row>
                      <!-- FIN PIDO CLIENTE -->

                      <!-- PENDIENTES PARA CANCELAR -->
                      <v-row v-show="esUnPagoDeUnaFactura==false">
                        <v-col cols="12" sx="12" mx="12">
                          <v-data-table
                            :headers="headersPend"
                            :items="pend"
                            dense
                            class="elevation-3"
                            hide-default-footer>
                            <template v-slot:top>
                              <v-dialog v-model="dialogPend" max-width="250px">
                                <template v-slot:activator="{}">
                                    <v-btn small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true">
                                    Pendientes
                                  </v-btn>
                                </template>
                                <v-card>
                                  <v-card-title>
                                    <span
                                      class="headline">A Cancelar
                                    </span>
                                  </v-card-title>
                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                          <v-text-field
                                            autofocus
                                            :color="temas.forms_titulo_bg"
                                            v-model="editadoPend.acancelar"
                                            label="A Cancelar">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                    </v-container>
                                  </v-card-text>
                                  <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      text
                                      @click="cancelarPend">
                                      Cancelar
                                    </v-btn>
                                    <v-btn
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      @click="guardarPend(editadoPend)">
                                      Guardar
                                    </v-btn>
                                  </v-card-actions>
                                </v-card>
                              </v-dialog>
                            </template>

                            <template v-slot:item.importe="{ item }">
                              <span disable dark>${{ formatoImporte(item.importe) }}</span>
                            </template>
                            <template v-slot:item.pendiente="{ item }">
                              <span disable dark>${{ formatoImporte(item.pendiente) }}</span>
                            </template>
                            <template v-slot:item.acancelar="{ item }">
                              <span disable dark>${{ formatoImporte(item.acancelar) }}</span>
                            </template>

                            <template v-slot:item.accion="{item}">

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small class="mr-2"
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="editarPend(item)" v-on="on">
                                    <v-icon dark>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                                <span>Editar</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn v-show="reciboDeUnSoloComprobante==false"
                                    fab x-small class="mr-2"
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="selectPend(item)" v-on="on">
                                    <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span>Seleccionar</span>
                              </v-tooltip>

                            </template>

                          </v-data-table>
                        </v-col>
                      </v-row>
                      <!-- FIN DE PENDIENTES A CANCELAR -->

                      <!-- MUESTRO TOTAL A COBRAR, SOLO FAC/NDD/NDC -->
                      <v-row v-if="comoPaga=='2'">
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled
                            :color="temas.forms_titulo_bg"
                            :dark="temas.forms_titulo_dark==true"
                            v-model="editado.total"
                            label="TOTAL A COBRAR">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <!-- FIN DE MEDIOS DE PAGO SELECCION -->

                      <!-- MEDIOS DE PAGO SELECCION -->
                      <v-row>
                        <v-radio-group v-model="medioDePagoId" row>
                          <v-radio v-for="item in medpag"
                            :key="item.id" dense :value="item.id"
                            :label="item.nombre"
                            v-show="item.activo==true"
                            :color="temas.forms_titulo_bg"
                            @click="setFP(item.id)">
                          </v-radio>
                        </v-radio-group>
                      </v-row>
                      <!-- FIN DE MEDIOS DE PAGO SELECCION -->

                      <!--// DIALOGO INGRESO DE VALORES QUE ENTRAN EN EL RECIBO// -->
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <v-data-table
                            :headers="headersMed"
                            :items="valores"
                            dense
                            class="elevation-3"
                            hide-default-footer>
                            <template v-slot:top>

                              <v-dialog v-model="dialogMed" :max-width="medpagwidth"> <!--1100">-->
                                <v-card>
                                  <v-toolbar flat
                                    :color="temas.forms_titulo_bg"
                                    :dark="temas.forms_titulo_dark==true">
                                    <v-btn
                                      icon @click="cancelarMed"
                                      :color="temas.forms_close_bg"
                                      :dark="temas.forms_close_dark==true">
                                      <v-icon>mdi-arrow-left-circle</v-icon>
                                    </v-btn>
                                    <span class="headdline">{{ medioDePagoNombre }}</span>
                                    <v-spacer></v-spacer>
                                     <v-btn v-if="medioDePagoOk"
                                      @click="guardarMed(editadoMed)"
                                      :color="temas.barra_principal_bg"
                                      :dark="temas.barra_principal_dark">
                                      Guardar
                                    </v-btn>
                                  </v-toolbar>

                                  <v-card-text>
                                    <v-container>

                                      <!-- GRILLA DE CHEQUES DE TERCERO -->
                                      <v-row v-show="habinhab('cheque de tercero')">
                                        <v-col cols="3" sm="3" md="3">
                                          <v-switch
                                            label="Propio del Cliente"
                                            v-model="editado.propiodelcliente"
                                            :color="temas.forms_titulo_bg"
                                            @change="propiodelcliente">
                                          </v-switch>
                                        </v-col>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            ref="cuit"
                                            v-model="editadoMed.cuit"
                                            label="CUIT del Cheque"
                                            autofocus
                                            required
                                            :color="temas.forms_titulo_bg"
                                            :rules="cuitRules"
                                            :counter="11"
                                            :maxlength="11"
                                            @change="buscoCuentasDelCuit"
                                            @blur="elValorEstaOk()">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-combobox
                                            ref="cuenta"
                                            v-model="editadoMed.cuenta"
                                            :items="cueItems"
                                            hint="Cuenta del Cheque"
                                            label="Cuenta"
                                            :color="temas.forms_titulo_bg"
                                            @change="buscoCuentaBanco"
                                            v-on:keydown.tab="buscoCuentaBanco"
                                            @blur="elValorEstaOk()">
                                          </v-combobox>
                                        </v-col>
                                        <v-col cols="4" sm="4" md="4">
                                          <v-autocomplete
                                            v-model="editadoMed.banco_id"
                                            :items="itemsBancos"
                                            :loading="isLoadingBancos"
                                            :search-input.sync="searchBancos"
                                            :color="temas.forms_titulo_bg"
                                            item-text="nombre"
                                            item-value="id"
                                            label="Banco"
                                            placeholder="Escriba para buscar"
                                            prepend-icon="mdi-database-search"
                                            v-on:keydown.tab="buscoSiElTerceroEstaVinculado"
                                            @blur="elValorEstaOk()">
                                          </v-autocomplete>
                                        </v-col>
                                      </v-row>

                                      <v-row v-show="habinhab('cheque de tercero')">
                                        <v-col cols="7" sm="7" md="7">
                                          <v-text-field
                                            v-model="editadoMed.nombre"
                                            label="Nombre del Titular"
                                            :color="temas.forms_titulo_bg"
                                            disabled
                                            required
                                            :counter="30"
                                            :maxlength="30"
                                            @blur="elValorEstaOk()">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            ref="numerodecheque"
                                            v-model="editadoMed.nrovalor"
                                            label="Número de Cheque"
                                            :color="temas.forms_titulo_bg"
                                            required
                                            :counter="15"
                                            :maxlength="15"
                                            v-on:keydown.tab="buscoCheque"
                                            @blur="elValorEstaOk()">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-text-field
                                            type="date"
                                            v-model="editadoMed.fechafinanciera"
                                            :color="temas.forms_titulo_bg"
                                            label="Fecha del Cheque"
                                            @blur="elValorEstaOk()">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>

                                      <!-- TARJETA -->
                                      <v-row v-show="habinhab('tarjeta')">
                                        <v-col cols="12" sm="12" md="12">
                                          <v-select
                                            label='Medio de Cobro'
                                            :color="temas.forms_titulo_bg"
                                            v-model="editadoMed.id"
                                            :items="mediosFiltrado"
                                            item-value="id"
                                            :item-text="medios=> sayTarjeta(medios)"
                                            @change="calculoMedioCobro"
                                            @blur="elValorEstaOk()">
                                          </v-select>
                                        </v-col>
                                      </v-row>
                                      <v-row v-show="habinhab('tarjeta')">
                                        <v-col cols="1" sm="1" md="1">
                                          <v-text-field
                                            v-model="editadoMed.nrovalor"
                                            :color="temas.forms_titulo_bg"
                                            label="Cupón"
                                            @blur="elValorEstaOk()">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="1" sm="1" md="1">
                                          <v-text-field
                                            v-model="editadoMed.cuotas"
                                            :color="temas.forms_titulo_bg"
                                            disabled
                                            label="Cuotas">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="1" sm="1" md="1">
                                          <v-text-field
                                            v-model="editadoMed.interes"
                                            :color="temas.forms_titulo_bg"
                                            disabled
                                            label="%Interes">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            v-model="editadoMed.importecuotas"
                                            :color="temas.forms_titulo_bg"
                                            disabled
                                            label="Importe Cuota">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            v-model="editadoMed.importe"
                                            :color="temas.forms_titulo_bg"
                                            disabled
                                            label="Importe Total">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="5" sm="5" md="5">
                                          <v-text-field
                                            v-model="editadoMed.nombrecuenta"
                                            :color="temas.forms_titulo_bg"
                                            disabled
                                            label="Cuenta">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <!-- TRANSFERENCIA -->
                                      <v-row v-show="habinhab('transferencia')">
                                        <v-col cols="12" sm="12" md="12">
                                          <v-select
                                            label='Cuenta Destino'
                                            :color="temas.forms_titulo_bg"
                                            v-model="editadoMed.cuentadestino_id"
                                            :items="cueMiasItems"
                                            item-value="id"
                                            :item-text="cueMiasItems=>
                                              `
                                              ${cueMiasItems.banco} -Cuenta:
                                              ${cueMiasItems.cuenta} -
                                              ${cueMiasItems.nombre}
                                              `"
                                            @blur="elValorEstaOk()">
                                          </v-select>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="5" sm="5" md="5">
                                          <v-text-field
                                            v-model="editadoMed.importe"
                                            :color="temas.forms_titulo_bg"
                                            label="Importe"
                                            @blur="elValorEstaOk()">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <!-- FIN DE LA TRANSFERENCIA -->

                                    </v-container>
                                  </v-card-text>
                                </v-card>
                              </v-dialog>
                            </template>

                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                dark>{{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>

                            <template v-slot:item.accion="{item}">

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="agregarMismoMed(item)" v-on="on">
                                    <v-icon dark>mdi-plus</v-icon>
                                  </v-btn>
                                </template>
                                <span>Agregar mismo valor</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="editarMed(item)" v-on="on">
                                    <v-icon dark>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                                <span>Editar</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="borrarMed(item)" v-on="on">
                                    <v-icon dark>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Borrar</span>
                              </v-tooltip>

                            </template>

                            <template v-slot:item.importe="{ item }">
                              <span
                                disable dark>${{ formatoImporte(item.importe) }}
                              </span>
                            </template>

                          </v-data-table>
                        </v-col>
                      </v-row>
                      <!-- FIN DIALOGO INGRESO DE VALORES -->

                      <!-- PIE CON TOTALES -->
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <v-row>
                            <v-col cols="6" sm="6" md="6">
                            </v-col>
                            <v-col cols="2" sm="2" md="2">
                              <v-text-field v-show="editado.cpr=='REC'"
                                disabled dense outlined
                                v-model="totCancelado"
                                label="Cancelado">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2">
                              <v-text-field
                                disabled dense outlined
                                v-model="totValores"
                                label="Valores">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2">
                              <v-text-field
                                disabled dense outlined
                                v-model="valDiferencia"
                                label="Diferencia">
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                      <!-- PIE CON TOTALES -->
<!--
                      <v-card-actions>
                        <v-spacer></v-spacer>
                      </v-card-actions>
-->
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DEL RECIBO -->

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
                  </v-data-table>
                </div>
              </v-card>
            </v-dialog>
            <!-- FIN DEL ERROR EN EL PEDIDO -->
          </v-toolbar>

          <!-- BARRA DE BUSQUEDA -->
          <v-row class="pl-3">
            <v-col cols="5" sm="5">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Buscar"
                :color="temas.forms_titulo_bg"
                class="pt-0"
                single-line hide-details>
              </v-text-field>
            </v-col>
            <v-col cols="7" sm="7">
              <span v-for="(fe, idx) in filtrosEstados" v-bind:key="idx">
                <v-chip
                  dense :value="fe" label
                  :color=
                  "fe.tip==filtroEstadoSel ?
                  temas.cen_card_activo_bg : temas.barra_principal_bg"
                  :dark=
                  "fe.tip==filtroEstadoSel ?
                  temas.cen_card_activo_dark : temas.barra_principal_dark"
                  class="ml-2 mini-font"
                  @click="setFiltroEstado(fe)">
                  {{ fe.tip }}
                  <v-badge
                    class="pt-4 pl-2 pr-2"
                    overlap
                    :content="fe.ctt"
                    :color=
                    "fe.tip==filtroEstadoSel ?
                    temas.cen_card_activo_bg : temas.barra_principal_bg"
                    :dark=
                    "fe.tip==filtroEstadoSel ?
                    temas.cen_card_activo_dark : temas.barra_principal_dark"
                    rigth>
                  </v-badge>
                </v-chip>
              </span>
            </v-col>
          </v-row>
          <!-- FIN DE LA BARRA DE BUSQUEDA -->
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-data-table v-if="filtroComprobanteSel!='Recibos'"
              :headers="headersItems"
              :items="item.items"
              dense
              hide-default-footer>
              <template v-slot:item.nombre="{ item }">
                <span> {{item.codigo=='1@1' ? item.texto : item.nombre}}</span>
              </template>
              <template v-slot:item.cantidad="{ item }">
                <span>{{ formatoImporte(item.cantidad) }}</span>
              </template>
              <template v-slot:item.precio="{ item }">
                <span>${{ formatoImporte(item.precio) }}</span>
              </template>
              <template v-slot:item.tasadescuento="{ item }">
                <span>{{ formatoImporte(item.tasadescuento) }}</span>
              </template>
              <template v-slot:item.importedescuento="{ item }">
                <span>${{ formatoImporte(item.importedescuento) }}</span>
              </template>

              <template v-slot:item.total="{ item }">
                <span disable dark>${{ formatoImporte(item.total) }}</span>
              </template>

            </v-data-table>
            <v-data-table v-else
              :headers="headersCancelaciones"
              :items="item.cancelaciones"
              dense
              hide-default-footer>
              <template v-slot:item.nombre="{ item }">
                <span disable dark> {{
                  item.codigo=='1@1' ? item.texto : item.nombre
                }}</span>
              </template>
              <template v-slot:item.cancelado.comprobante.fecha="{ item }">
                <span>{{ formatoFechaCorta(item.cancelado.comprobante.fecha) }}</span>
              </template>
              <template v-slot:item.importe="{ item }">
                <span>${{ formatoImporte(item.importe) }}</span>
              </template>
              <template v-slot:item.cancelado.pendiente="{ item }">
                <span>${{ formatoImporte(item.cancelado.pendiente) }}</span>
              </template>
            </v-data-table>

          </td>
        </template>
<!--
        <template #item.tercero.razon_social="{ value }">
          <div class="text-truncate" style="max-width: 170px">
            {{ value }}
          </div>
        </template>
-->
        <template v-slot:item.tercero.razon_social="{ item }">
          <span>{{ item.tercero.razon_social.substring(0,23)}}</span>
          <v-badge v-if="item.tercero.user!=null"
            class="pt-1 pl-2"
            :content="item.tercero.user.externo ? 'x' : 'g'"
            :color="item.tercero.user.externo ? 'black' : temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
        </template>
        <template v-slot:item.fecha="{ item }">
          <span>{{ formatoFechaCorta(item.fecha) }}</span>
        </template>
        <template v-slot:item.cpr="{ item }">
          <span>{{ item.cpr }}</span>
        </template>
        <template v-slot:item.rentabilidad="{ item }">
          <span disable dark class="mini-font">$ {{ formatoImporte(item.rentabilidad) }}</span>
        </template>
        <template v-slot:item.importedescuento="{ item }">
          <span disable dark class="mini-font">$ {{ formatoImporte(item.importedescuento) }}</span>
        </template>
        <template v-slot:item.total="{ item }">

          <v-tooltip v-if="sayMessage(item, true)" bottom color="blue">
            <template v-slot:activator="{ on, attrs }">
              <v-chip label :color="getColorTotal(item)" v-on="on">
                $ {{ formatoImporte(item.total) }}
              </v-chip>
            </template>
            <span>{{sayMessage(item, true)}}</span>
          </v-tooltip>
          <v-chip v-else label :color="getColorTotal(item)">
            $ {{ formatoImporte(item.total) }}
          </v-chip>
<!--
          <div data-app>
            <v-card :color="variant">
              <v-card-actions>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" @click="openConsole" icon>
                      <v-icon>computer</v-icon>
                    </v-btn>
                  </template>
                  <span>Console</span>
                </v-tooltip>
                <v-btn icon v-if="failed">
                  <v-icon>bug_report</v-icon>
                </v-btn>
                <v-btn icon @click="show = !show">
                  <v-icon>{{ show ? 'expand_less' : 'expand_more' }}</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
-->
          <v-badge v-if="tieneRemito(item)"
            class="pt-2"
            :content="'r'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true" rigth>
          </v-badge>
          <v-badge v-if="item.cae"
            class="pt-2"
            :content="'e'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true" rigth>
          </v-badge>
        </template>
        <template v-slot:item.pendientes[0].pendiente="{ item }">
          <span disabled dark class="mini-font">
            $ {{ formatoImporte(item.pendientes[0] ? item.pendientes[0].pendiente : 0) }}
          </span>
        </template>
        <template v-slot:item.observaciones="{ item }">
          <span disabled dark>
            {{ item.observaciones=='PEDIDO DEL CLIENTE' ? 'Cliente' : 'Vendedor' }}
          </span>
        </template>
        <template v-slot:item.estado="{ item }">
          <v-rating v-if="item.rating>=1 && item.rating<=5"
            dense
            v-model="item.rating"
            :color="temas.cen_estado_finalizado_bg"
            background-color="white"
            empty-icon="$ratingFull"
            x-small readonly>
          </v-rating>
          <v-chip v-else
            label
            class="mini-font"
            @mouseover="sayMessage(item, true)"
            @mouseleave="sayMessage(item, false)"
            :color="getEstado(item.estado,'c',item.pendientes[0],item.carga, item)"
            :dark="getEstado(item.estado,'k',item.pendientes[0],item.carga, item)">
            {{ getEstado(item.estado,'e',item.pendientes[0], item.carga, item) }}
          </v-chip>
          <v-badge v-if="tieneRemito(item)"
            class="pt-2"
            :content="'r'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true" rigth>
          </v-badge>
        </template>
        <!-- BOTONES DE LA GRID PRINCIPAL-->
        <template v-slot:item.accion="{ item }">
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on"
                @click="setAcciones(item)">
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
      </v-data-table>

      <impresiones ref="impresion"></impresiones>
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
import impresiones from "./Forms/impresiones.vue";
import Mail from "./Forms/mail.vue";
import XLSX from 'xlsx'
import jsPDF from 'jspdf'

export default {
  components: {
    SBar,
    Confirmacion,
    Mail,
    impresiones,
  },
  data: () => ({
    page: 1,
    mientras: false,
    electronica: false,
    ivas: [],
    asociado: [],
    selected: [],
    confirmarComprobanteMensaje: 'CONFIRMAR COMPROBANTE',
    progress: false,
    elMes: '',
    elAnio: '',
    anio: '',
    anios: [],
    meses: [],
    periodos: [],
    losMeses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'],
    esManual: false,
    sucManual: '0000',
    nroManual: '00000000',
    expanded: [],
    facturas: [],
    singleExpand: false,
    loading: true,

    cpr: '',                 // Pedido 
    pedProcesable: false,    // Si el pedido es procesable o no ( alguno de los items tiene stock )
    basadoEnCpr: false,      // si el comprobante actual esta basado en otro comprobante. ( fac/ped, rem/fac, etc)
    notificaEnBaseAOtro: [], // arreglo para realizar la notificacion de comprobantes.
    notificaOriginal: [],    // cuando es notificaEnBaseAOtro, debo marcar el comprobante padre.
    basadoEnOtroCpr: [],     // arreglo para grabar la en que comprobante esta basado el actual
    motivoAnularPedido: '¡Nos quedamos sin stock!',
    cfUser: '',
    anotadorId: 0,
    anotadorTotal: 0,
    elCuitEstaba: false,
    laCuentaEstaba: false,
    userDelTercero: 0,
    userDelTerceroDatos: null,
    dondeEstoy: 'F',         // desde donde controlo si el cliente esta vinculado, <F>act o <R>ecibo
    cual: '',                // forma de pago seleccionada
    recargo: 0,              // % de recargo para cuando se selecciona un cobro con recargo, no aplica a cobranzas
    
    // remito
    remitoValorizado: false,
    remitoTexto: '',
    remitoItems: 0,

    // Embalajes
    aEmbalar: [],
    grpEmbalaje: 'Sin agrupar',
    grupoEmbalajes: [ 'Sin agrupar', 'Artículos', 'Artículos y Zonas' ],
    embalajesSel: 0,

    calificacion: 0,
    puntosDeRetiros: [],
    radios: null,
    envio: {
      tipodeenvio: 'P',
      adomicilio: 'S',
      transporte_id: '',
      puntoderetiro_id: '',
      puntoderetirodireccion_id: '',
      llegada: '',
      generaremito: false,
      remitogenerado: false,
      remito_id : '',
      remito_numero: '',
      remito_msg: '',
      importeflete: '',
      bultos: '',
      traking: '',
      quienretira: '',
      documento: '',
      direccion_id: '',
    },
    retiro: {
      quienretira: '',
      documento: '',
      generaremito: false,
      remitogenerado: false,
      remito_id : '',
      remito_numero: '',
      remito_msg: '',
      bultos: '',
    },

    // recibo
    reciboDeUnSoloComprobante: false,
    esUnPagoDeUnaFactura: false,
    medioDePagoId: 1,
    medioDePagoOk: false,
    comoPaga: "1",          // 1-> Todo Efectivo, 2-> Otros
    medioDePagoNombre: '',
    anchoDelDialogDeValores: 450,
    totCancelado: 0,
    totValores: 0,
    valDiferencia: 0,
    totCheTerSel: 0,
    rentabilidad: 0,
    medpagwidth: 0,
    medpag: [
      {id:1, nombre: 'Efectivo',         activo: true,  tipo:'CAJ', total: 0},
      {id:2, nombre: 'Tarj.de Crédito',  activo: true,  tipo:'TDC', total: 0},
      {id:3, nombre: 'Tarj.de Débito',   activo: true,  tipo:'TDD', total: 0},
      {id:4, nombre: 'Cuenta Corriente', activo: false, tipo:'CTE', total: 0},
      {id:5, nombre: 'Transferencia',    activo: true,  tipo:'TRA', total: 0},
      {id:6, nombre: 'Cheque',           activo: true,  tipo:'CHE', total: 0},
      {id:7, nombre: 'Mercado Pago',     activo: true,  tipo:'MEP', total: 0},
      {id:8, nombre: 'Todo Pago',        activo: true,  tipo:'TPA', total: 0},
      {id:9, nombre: 'Canje',            activo: false, tipo:'CJE', total: 0},
    ],

    // ndc
    ndcMotivos: [{id:1, nombre: 'BONIFICACION'}, {id: 2, nombre: 'DEVOLUCION'}, {id: 3, nombre: 'ANULACION'}],
    ndcMotivoSel: 1,
    ndcTasaDescuento: 0,
    ndcTotal: 0,
    ndcItemsDevueltos: [],

    nddMotivos: [{id:1, nombre: 'CHEQUES RECHAZADOS'}, {id: 2, nombre: 'MORA'}, {id: 3, nombre: 'CAMBIO DE PRECIO'}],
    nddMotivoSel: 1,
    nddTasaDescuento: 0,
    nddTotal: 0,
    nddChequesDevueltos: [],

    cen_activo_bg: '',
    cen_activo_color: '',
    cen_activo_dark: '',

    comprobantes: [
      { nombre: 'Facturas', total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Débitos',  total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Créditos', total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Presup.',  total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Remitos',  total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Pedidos',  total: 0, ctt: 0, bg: '', dark: '', activo: true },
      { nombre: 'Recibos',  total: 0, ctt: 0, bg: '', dark: '', activo: true }
    ],

    // filtro
    filtroComprobante: [1,6,14],
    filtroComprobanteSel: 'Facturas',
    coef: 1,  // para signar los comprobantes + o -
    modelo: 'ventas',
    ctacte: false,
    diasvenc: 0,
    bonificacionmaxima: 0,
    creditomaximo: 0,
    saldoctacte: 0,
    valorespendientes: 0,
    tienesaldo: 0,
    disponible: 0,
    formTitle: '',
    formTitleArt: '',
    formTitleMed: '',
    itemActual: {cpr:'', tercero: {nombre: ''}},
    itemActualPend: null,
    itemActualTransfItem: null,
    tl: "text-lowercase",
    banItems: [],
    cueItems: [],
    cueNewItems: [],
    cueMiasItems: [],
    medios: [],
    lisItems: [],
    depItems: [],
    uniItems: [],
    monItems: [],
    ivaTasas: [],
    dirItems: [],
    dirItemsPdrDir: [],
    lisValue: [],
    dirValue: [],
    medValue: [],
    lisObj: [],
    items: [],
    itemsAll: [],
    articulos: [],
    cheques: [],
    artPed: [],
    artTransfPed: [],
    artTransfPedId: 0,
    artTransfPedCtt: 0,
    artTransfPedSucDes: [],
    valores: [],
    pendientes: [],
    pend: [],
    rastreo: [],
    acciones: [],
    timeLine: [],
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
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    cuitRules: [
      v => !!v || 'El cuit es requerido',
      v => (v && v.length <= 11) || 'Ingrese hasta 11 caracteres',
    ],
    //footerProps: {'items-per-page-options': [5, 5, 15, 100]},
    footerProps: {'items-per-page-options': [6]},
    footerProps10: {'items-per-page-options': [10]},
    busArt: '',
    busArtSave: '',
    search: '',               // para el cuadro de búsqueda de datatables
    searchTerceros: '',       // para el cuadro de búsqueda de datatables
    searchBancos: '',         // para el cuadro de búsqueda de datatables
    searchTercerosRec: '',    // para el cuadro de búsqueda de datatables
    searchTercerosTrans: '',  // para el cuadro de búsqueda de datatables
    searchTercerosPdr: '',    // para el cuadro de búsqueda de datatables
    searchTercerosPrdDir: '', // para el cuadro de búsqueda de datatables
    esTexto: false,           // para que la ventana de dialogo o modal no aparezca automáticamente
    dialog: false,            // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogArt: false,         // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogNdcxDev: false,     // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogNddxDev: false,     // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogMed: false,         // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogPed: false,         // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogRas: false,         // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogNot: false,
    dialogArtNot: false,
    dialogRem: false,
    dialogNdcFac: false,
    dialogNddFac: false,
    dialogRec: false,
    dialogVal: true,
    dialogPend: false,
    dialogTransferirPedido: false,
    dialogEmbalajes: false,
    dialogTimeLine: false,
    dialogEnvios: false,
    dialogRetiro: false,
    dialogError: false,
    dialogTransferirItem: false,
    dialogAnularPedido: false,
    dialogSelFacturas: false,
    editadoNombre: '',
    editadoCpr: '',

    // definimos los headers de la datatables
    headers: [
      { text: 'COMPROBANTE', value:'cpr', align: 'left', width: 175 },
      { text: 'FECHA', value:'fecha', align: 'left', width: 89 },
      { text: 'CLIENTE', value: 'tercero.razon_social', align: 'left', width: 210 },
      { text: 'DESC', value:'importedescuento', align: 'end', width: 110 },
      { text: 'TRN', value:'rentabilidad', align: 'end', width: 110 },
      { text: 'PENDIENTE', value:'pendientes[0].pendiente', align: 'end', width: 120 },
      { text: 'TOTAL', value:'total', align: 'end', width: 150 },
      { text: 'ESTADO', value:'estado', align: 'left', width: 110 },
      { text: 'ACCIONES', value: 'accion', sortable: false, width: 90 },
    ],
    headersItems: [
      { text: 'Código', value:'articulo.codigo', class: 'grey lighten-3'},
      { text: 'Descripción', value:'articulo.nombre', class: "grey lighten-3"},
      { text: 'Ctt', value:'cantidad', align: 'end', class: "grey lighten-3"},
      { text: 'Precio', value:'precio', align: 'end', width: 120, class: "grey lighten-3"},
      { text: '%Des', value:'tasadescuento', align: 'end', class: "grey lighten-3"},
      { text: 'Des', value:'importedescuento', align: 'end', class: "grey lighten-3"},
      { text: 'Total', value:'total', align: 'end', width: 120, class: "grey lighten-3"},
    ],
    headersCancelaciones: [
      { text: 'Cpr', value:'cancelado.comprobante.cpr', align: 'left', width: 150},
      { text: 'Observaciones', value:'concepto', align: 'left', width: 200},
      { text: 'Fecha', value:'cancelado.comprobante.fecha', align: 'end', width: 90},
      { text: 'Cancelado', value:'importe', align: 'end', width: 120},
      { text: 'Pendiente', value:'cancelado.pendiente', align: 'end', width: 120},
    ],
    headersArt: [
      { text: 'CODIGO', value:'codigo', align: 'left', width: 80},
      { text: 'DESCRIPCION', value:'nombre', align: 'left', width: 430},
      { text: 'CTT', value:'cantidad', align: 'end', width: 80},
      { text: 'PRECIO', value:'precio', align: 'end', width: 90},
      { text: '%DES', value:'tasadescuento', align: 'end', width: 50},
      { text: 'DES', value:'importedescuento', align: 'end', width: 90},
      { text: 'TOTAL', value:'total', align: 'end', width: 120},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersNot: [
      { text: 'CODIGO', value:'codigo'},
      { text: 'DESCRIPCION', value:'nombre'},
      { text: 'CTT', value:'cantidad'},
    //{ text: 'PRECIO', value:'precio', align: 'end', width: 120},
      { text: 'TOTAL', value:'total', align: 'end', width: 120},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersEmbalajes: [
      { text: 'PEDIDO', value:'cpr', align: 'left', width: 155},
      { text: 'CLIENTE', value:'nomcli', align: 'left', width: 210},
      { text: 'CODIGO', value:'codigo', align: 'left', width: 90},
      { text: 'DESCRIPCION', value:'nomart', align: 'left', width: 360},
      { text: 'CTT', value:'cantidad', align: 'end', width: 90},
      { text: 'ZONA', value:'zona', align: 'left', width: 160},
      { text: 'SEL.', value: 'accion', align: 'left', width: 50, sortable: false },
    ],
    headersSelArt: [
      { text: 'NID', value:'id', align: 'left', width: 50},
      { text: 'CODIGO', value:'codigo', align: 'left', width: 120},
      { text: 'NOMBRE', value:'nombre', align: 'left', width: 350},
      { text: 'STOCK', value:'stock', align: 'end', width: 100},
      { text: 'PRECIO', value:'precio', align: 'end', width: 100},
    ],
    headersRas: [
      { text: 'PADRE',     value:'padre_id'}, 
      { text: 'ORIGEN',    value:'cpr1'},
      { text: 'TERCERO 1', value:'nombre1'},
      { text: 'HIJO',      value:'hijo_id'},
      { text: 'DESTINO',   value:'cpr2'},
      { text: 'TERCERO 2', value:'nombre2'}
    ],
    headersPed: [
      { text: 'CODIGO', value:'codigo', align: 'left', width: 120},
      { text: 'DESCRIPCION', value:'nombre', align: 'left', width: 400},
      { text: 'Stock', value:'stock', align: 'end', width: 80},
      { text: 'Ctt.Ped.', value:'cttori', align: 'end', width: 80},
      { text: 'Ctt.Sel.', value:'cttped', align: 'end', width: 80},
//    { text: 'Ctt.Fac.', value:'cttfac', align: 'end', width: 80},
//    { text: 'Nue Stock', value:'nuevostock', align: 'end', width: 80},
      { text: 'Estado', value:'estado', align: 'center'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
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
    headersTransfPed: [
      { text: 'CODIGO', value:'codigo', align: 'left', width: 120},
      { text: 'DESCRIPCION', value:'nombre', align: 'left', width: 450},
      { text: 'Ctt.Ori.', value:'cttori', align: 'end', width: 80},
      { text: 'Ctt.Fac.', value:'cttfac', align: 'end', width: 80},
      { text: 'Ctt.Transf.', value:'ctttransf', align: 'end', width: 80},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersNdcxDev: [
      { text: 'CODIGO', value:'codigo', align: 'left', width: 120},
      { text: 'DESCRIPCION', value:'nombre', align: 'left', width: 400},
      { text: 'Facturado', value:'cantidad', align: 'end', width: 90},
      { text: 'A Devolver.', value:'adevolver', align: 'end', width: 90},
      { text: 'ACCIONES', value: 'accion', sortable: false, align: 'end', width: 140 },
    ],
    headersNddxDev: [
      { text: 'BANCO',      value: 'nomban',           align: 'left', width: 140},
      { text: 'CUIT',       value: 'cuitlib',          align: 'left', width: 90},
      { text: 'LIBRADOR',   value: 'nomlib',           align: 'left', width: 150},
      { text: 'NROVALOR',   value: 'nrovalor',         align: 'end',  width: 120},
      { text: 'FEC.FIN.',   value: 'fechafinanciera',  align: 'left', width: 90},
      { text: 'DIAS',       value: 'dias',             align: 'end',  width: 90},
      { text: 'IMPORTE',    value: 'importe',          align: 'end',  width: 120},
    ],
    headersMed: [
      { text: 'MEDIO', value:'medioNombre',    align: 'left', width: 170},
      { text: 'OBSERVACIONES', value:'observ', align: 'left', width: 700},
      { text: 'TOTAL', value:'importe',        align: 'end',  width: 120},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersPend: [
      { text: 'CPR',         value:'cpr'}, 
      { text: 'VENCIMIENTO', value:'vencimiento'},
      { text: 'IMPORTE',     value:'importe'},
      { text: 'PENDIENTE',   value:'pendiente'},
      { text: 'A CANCELAR',  value:'acancelar'},
      { text: 'ACCIONES',    value:'accion', sortable: false },
    ],
    headersSelFacturas: [
      { text: 'Factura', value:'cpr', align: 'left', width: 190},
      { text: 'Fecha', value:'fecha', align: 'left', width: 90},
      { text: 'Total', value:'total', align: 'end', width: 90},
    ],
    editedIndex: -1,
    editedIndexArt: -1,
    editedIndexMed: -1,
    editedIndexNot: -1,
    editado: {
      id: '',
      cpr: '',
      fecha: '',
      tercero_id: '',
      nombre: '',
      comprobante_id: '',
      documento_id: '',
      documentoCodigo: '',
      mediodepago_id: '',
      lista_id: '',
      deposito_id: '',
      vendedor: {id: null, nombre: 'MOSTRADOR'},
      moneda_id: 51,
      direccion_id: '',
      documento: '',
      documentoNumero: '',
      responsableAbrev: '',
      letra: '',
      activo: true,
      tasadescuento: 0,
      importedescuento: 0,
      gravado: 0,
      exento: 0,
      iva: 0,
      total: 0,
      rentabilidad: 0,
      texto: '',
      estado: '',
      observaciones: '',
    },
    defaultItem: {
      id: '',
      cpr: '',
      fecha: '',
      tercero_id: '',
      nombre: '',
      comprobante_id: '',
      documento_id: '',
      documentoCodigo: '',
      mediodepago_id: '',
      lista_id: '',
      deposito_id: '',
      vendedor: {id: null, nombre: 'MOSTRADOR'},
      moneda_id: 51,
      direccion_id: '',
      documento: '',
      documentoNumero: '',
      responsableAbrev: '',
      letra: '',
      activo: true,
      tasadescuento: 0,
      importedescuento: 0,
      gravado: 0,
      exento: 0,
      iva: 0,
      total: 0,
      rentabilidad: 0,
      texto: '',
      estado: '',
      observaciones: '',
    },
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
      iva: [],
      ivaNombre: '',
      cantidad: 1,
      stock: 0,
      costo: 0,
      precio: 0,
      preciooriginal: 0,
      tasadescuento: 0,
      importedescuento: 0,
      total: 0,
      texto: '',
      vencimiento: '',
      pubprecio: 0,
      pubtasdes: 0,
      pubenvio: 0,
      pubunidades: 0,
      pubestado: '',
      padre_id: null,
      undenvase: 1,
      escombo: false,
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
      iva: [],
      ivaNombre: '',
      cantidad: 1,
      stock: 0,
      costo: 0,
      precio: 0,
      preciooriginal: 0,
      tasadescuento: 0,
      importedescuento: 0,
      total: 0,
      texto: '',
      vencimiento: '',
      pubprecio: 0,
      pubtasdes: 0,
      pubenvio: 0,
      pubunidades: 0,
      pubestado: '',
      padre_id: null,
      undenvase: 1,
      escombo: false,
    },
    editadoPend: {
      acancelar: '',
    },
    editadoTransfItem: {
      cttOriginal: 0,
      cttATransferir: 0,
    },
    editadoMed: {
      id: null,
      caja_id: null,
      medio_id: null,
      cuentaorigen_id: null,
      cuentadestino_id: null,
      cuentacheque_id: null,
      cuentatarjeta_id: null,
      banco_id: null,
      tarjeta_id: null,
      cpringreso_id: null,
      cpregreso_id: null,
      librador_id: null,
      librador_medio_id: null,
      chequera_id: null,
      cheque_id: null,
      fechafinanciera: null,
      fechasalida: null,
      importe: null,
      nrovalor: null,
      tipo: null,
      observ: null,
      importe: 0,
      cuenta: null,
      cuit: null,
      nombre: null,
      cuotas: null,
      importecuotas: null,
      interes: null,
      recargo: null,
      nombrecuenta: null,
      propiodelcliente: null,
    },
    defaultItemMed: {
      id: null,
      caja_id: null,
      medio_id: null,
      cuentaorigen_id: null,
      cuentadestino_id: null,
      cuentacheque_id: null,
      cuentatarjeta_id: null,
      banco_id: null,
      tarjeta_id: null,
      cpringreso_id: null,
      cpregreso_id: null,
      librador_id: null,
      librador_medio_id: null,
      chequera_id: null,                        // ?? VA ??
      cheque_id: null,
      fechafinanciera: null,
      fechasalida: null,
      importe: null,
      nrovalor: null,
      tipo: null,
      observ: null,
      importe: 0,
      cuenta: null,
      cuit: null,
      nombre: null,
      cuotas: null,
      importecuotas: null,
      interes: null,
      recargo: null,
      nombrecuenta: null,
      propiodelcliente: null,
    },

    selArt: [],
    seleccionarArticulo: false,
    descriptionLimit: 80,
    entriesBancos: [],
    entriesTerceros: [],
    entriesArticulos: [],
    entriesTercerosTrans: [],
    entriesTercerosPdr: [],
    entriesTercerosPdrDir: [],
    
    tercerosUserId: [],
    isLoadingTerceros: false,
    isLoadingBancos: false,
    isLoadingTercerosRec: false,
    isLoadingTercerosTrans: false,
    isLoadingTercerosPdr: false,
    isLoadingTercerosPdrDir: false,
    isLoadingArticulos: false,
    selArtPedErr: [],

    filtrosEstados: [],
    filtroEstadoSel: 'Todos',

  }),





  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState([
      'sucursal',
      'sucursales',
      'sucursalDemo',
      'sucursalFiscal',
      'sucursalManual',
      'tema',
      'temas',
      'centrales',
      'notificaciones',
      'caja',
      'vinculosPadres', 
      'vinculosHijos',
      'empresa',
      'datosEmpresa',
      'responsable',
      'cuit',
      'operario',
      'operarioId',
      'operarioVendedor',
      'operarioTerceroId',
      'level',
      'roles',
      'hayPedidos',
      'externo',
    ]),






    mediosFiltrado() {
      if (this.cual==2) {           // TARJETAS DE CREDITO
        return this.medios.filter(item => item.debito === 0 )
      } else if (this.cual==3) {    // TARJETAS DE DEBITO
        return this.medios.filter(item => item.debito === 1 )
      }
    },





    itemsTerceros () {
      return this.entriesTerceros.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },





    itemsTercerosTrans () {
      return this.entriesTercerosTrans.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },





    itemsTercerosPdr () {
      return this.entriesTercerosPdr.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },





    itemsBancos () {
      return this.entriesBancos.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },

  },





  watch: {
    /*
    dialog (val) {
      val || this.cancelar();
    },
    */
    '$store.state.sucursal' () {

      this.comprobantes[0].bg    = this.$store.state.temas.cen_facturas_bg
      this.comprobantes[0].dark  = this.$store.state.temas.cen_facturas_dark
      this.comprobantes[1].bg    = this.$store.state.temas.cen_creditos_bg
      this.comprobantes[1].dark  = this.$store.state.temas.cen_creditos_dark
      this.comprobantes[2].bg    = this.$store.state.temas.cen_debitos_bg
      this.comprobantes[2].dark  = this.$store.state.temas.cen_debitos_dark
      this.comprobantes[3].bg    = this.$store.state.temas.cen_presupuestos_bg
      this.comprobantes[3].dark  = this.$store.state.temas.cen_presupuestos_dark
      this.comprobantes[4].bg    = this.$store.state.temas.cen_remitos_bg
      this.comprobantes[4].dark  = this.$store.state.temas.cen_remitos_dark
      this.comprobantes[5].bg    = this.$store.state.temas.cen_pedidos_bg
      this.comprobantes[5].dark  = this.$store.state.temas.cen_pedidos_dark
      this.comprobantes[6].bg    = this.$store.state.temas.cen_recibos_bg
      this.comprobantes[6].dark  = this.$store.state.temas.cen_recibos_dark

      this.comprobantes[0].activo = !this.sucursalDemo
      this.comprobantes[1].activo = !this.sucursalDemo
      this.comprobantes[2].activo = !this.sucursalDemo

      if (this.sucursalDemo) {
        if (this.centrales.ventas_panel == 'Facturas' ||
            this.centrales.ventas_panel == 'Créditos' ||
            this.centrales.ventas_panel == 'Débitos') {
          this.selectTipoDeComprobante('Presup.')
        } else {
          this.selectTipoDeComprobante(this.centrales.ventas_panel)
        }
      } else {
        this.selectTipoDeComprobante(this.centrales.ventas_panel)
      }

    },





    search(val) {
      this.$store.commit("setCentrales", {ventas_buscar: val}, { root: true });
      this.listarHTTP(false)
    },





    searchTerceros (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      // Lazily load input items
      this.userDelTercero = 0
      this.userDelterceroDatos = null
      this.dondeEstoy = 'F'
      this.dialogSelFacturas = false  //para remitos

      return HTTP().get('/usersclientes/false/1/'+this.operarioVendedor+'/'+this.operarioTerceroId+'/'+this.operarioId)
        .then(({ data }) => {

          this.entriesTerceros = []
          this.tercerosUserId = []
          for (let i=0; i<= data.length-1; i++) {
            this.entriesTerceros.push(data[i].tercero)
            this.tercerosUserId.push(data[i].tercero_id)
          }

          if (val !== null && val !== '') {

            let ipos = this.entriesTerceros.findIndex(i => i.id === this.editado.tercero_id);
            let valor = this.tercerosUserId[ipos]
            this.userDelTercero = data[ipos].tercero.user!=null ? data[ipos].tercero.user.id : 0

            return HTTP().get('/tercero/'+valor)
              .then(({ data }) => {

                this.userDelTerceroDatos = data           // para cuando es un pedido de un vendedor
                this.lisObj = [];
                let rid = data[0].tercero.responsable.id
                if (!(this.editado.comprobante_id >= 124 && this.editado.comprobante_id <= 126)) {     // AGREGADO 4/8/21
                  if (this.responsable===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO ( VIENE DEL STORE )
                    if(rid===1 || rid===2 || rid===9 || rid===11) {
                      this.editado.letra = 'A'
                    } else {
                      this.editado.letra = 'B'
                    }
                  } else if (this.responsable===6) { //EL USUARIO ES MONOTRIBUTISTA ( VIENE DEL STORE )
                      this.editado.letra = 'C'
                  }
                }

                this.editado.documento        = data[0].tercero.documento.nombre;
                this.editado.documento_id     = data[0].tercero.documento.id;
                this.editado.documentoCodigo  = data[0].tercero.documento.codigo;
                this.editado.documentoNumero  = data[0].tercero.cuit;
                this.editado.responsableAbrev = data[0].tercero.responsable.abrev;

                if (data[0].vendedor!=undefined) {
                  this.editado.vendedor         = data[0].vendedor
                }

                this.dirItems = []
                for (let i=0; i<= data[0].tercero.direcciones.length-1; i++) {
                  this.dirItems.push(data[0].tercero.direcciones[i])
                }
                this.editado.direccion_id = this.dirItems[0].id
                this.ctacte = data[0].ctacte
                this.diasvenc = data[0].diasvenc
                this.bonificacionmaxima = data[0].bonificacionmaxima
                this.creditomaximo = data[0].creditomaximo

                this.medpag[3].activo = false
                this.medpag[2].activo = false
                if (this.editado.cpr=='REM') {
                } else if (this.editado.cpr!='REC') {
                  this.medpag[3].activo = this.ctacte
                }
                this.editado.mediodepago_id = this.ctacte ? 4 : 1
                this.editado.deposito_id = this.depItems[0].id
                this.cargoSaldosYValoresPendientes(this.editado.tercero_id)

                // PEDIDOS: EL CLIENTE DEL VENDEDOR DEBE ESTAR REGISTRADO EN GOHU
                if (this.editado.cpr.substr(0,3)=='PED' &&
                    this.editado.vendedor.id!=null &&
                    this.userDelTerceroDatos[0].tercero.user==null) {
                  this.msg.msgTitle = '¡Cliente no registrado!'
                  let m = 'El cliente debe estar registrado en el sistema.<br>'
                  m += 'Es una condición necesaria para que el vendedor pueda ingresar sus pedidos.<br>'
                  m += 'Invite por favor a '+data[0].tercero.razon_social+' a registrarse.'
                  this.msg.msgBody = m
                  this.msg.msgVisible = true
                  this.msg.msgAccion = 'cliente no registrado'
                  this.msg.msgButtons = ['Aceptar']
                  this.seleccionarArticulo = false;
                  this.$refs.cliente.focus()
                }

            })
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingTerceros = false))
    },





    searchTercerosRec (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested

      if (this.isLoadingTercerosRec || this.editado.cpr!='REC') return
      this.isLoadingTercerosRec = true
      this.dondeEstoy = 'R'
      // Lazily load input items

      return HTTP().get('/usersclientes/false/1/'+this.operarioVendedor+'/'+this.operarioTerceroId+'/'+this.operarioId)
        .then(({ data }) => {

          this.entriesTerceros = []
          this.tercerosUserId = []
          for (let i=0; i<= data.length-1; i++) {
            this.entriesTerceros.push(data[i].tercero)
            this.tercerosUserId.push(data[i].tercero_id)
          }

          if (val !== null && val !== '') {
            
            debugger
            let ipos = this.entriesTerceros.findIndex(i => i.id === this.editado.tercero_id);

//            let ipos = 0
//            for (let i=0; i<=this.entriesTerceros.length-1; i++) {
//              if (this.editado.tercero_id === this.entriesTerceros[i].id) {
//                ipos = i
//                break
//              }
//            }

            if (ipos!=-1) {

              let valor = this.tercerosUserId[ipos]
              this.userDelTercero = data[ipos].tercero.user!=null ? data[ipos].tercero.user.id : 0
              //let entro = false;
              return HTTP().get('/tercero/'+valor)
                .then(({ data }) => {
  
                  debugger
                  let rid = data[0].tercero.responsable.id
                  if (this.responsable===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO ( VIENE DEL STORE )
                    if(rid===1 || rid===2 || rid===9 || rid===11) {
                      this.editado.letra = 'A'
                      this.editado.comprobante_id = 4
                    } else {
                      this.editado.letra = 'B'
                      this.editado.comprobante_id = 9
                    }
                  } else if (this.responsable===6) { //EL USUARIO ES MONOTRIBUTISTA ( VIENE DEL STORE )
                      this.editado.letra = 'C'
                      this.editado.comprobante_id = 17
                  }
  
                  this.editado.documento = data[0].tercero.documento.nombre;
                  this.editado.documento_id = data[0].tercero.documento.id;
                  this.editado.documentoCodigo  = data[0].tercero.documento.codigo;
                  this.editado.documentoNumero  = data[0].tercero.cuit;
                  this.editado.responsableAbrev = data[0].tercero.responsable.abrev;
  
                  this.dirItems = []
                  for (let i=0; i<= data[0].tercero.direcciones.length-1; i++) {
                    this.dirItems.push(data[0].tercero.direcciones[i])
                  }
                  this.editado.direccion_id = this.dirItems[0].id
  
                  debugger
                  return HTTP().get('/pendientes/'+data[0].tercero.id+'/'+this.sucursal)
                    .then(( { data }) => {
  
                      debugger
                      this.pend = []
                      let totPend = 0
                      for ( let i=0; i<= data.length-1; i++) {
                        this.pend.push({
                          id:          data[i].id,
                          cpr:         data[i].cpr,
                          importe:     data[i].importe,
                          vencimiento: moment(data[i].vencimiento).format('YYYY-MM-DD'),
                          pendiente:   data[i].pendiente,
                          acancelar:   0,
                          acciones:    ''
                        })
                        totPend += data[i].pendiente
                      }
                      this.editado.total = this.roundTo(totPend,2)
                      this.totCancelado  = 0
                      this.totValores    = 0
                      this.valDiferencia = totPend*-1
  
                      debugger
  
                      if (this.pend.length==0) {
                        this.msg.msgTitle = 'Sin deuda'
                        this.msg.msgBody = 'El cliente no posee deuda!'
                        this.msg.msgVisible = true
                        this.msg.msgAccion = 'cliente sin deuda'
                        this.msg.msgButtons = ['Aceptar']
                      }
  
                    })
  
                })
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingTercerosRec = false))
    },





    searchTercerosTrans (val) {
      if (this.isLoadingTercerosTrans) return
      this.isLoadingTercerosTrans = true
      return HTTP().get('/userstransportistas/false/4')
        .then(({ data }) => {
          this.entriesTercerosTrans = []
          this.tercerosUserId = []
          for (let i=0; i<= data.length-1; i++) {
            this.entriesTercerosTrans.push(data[i].tercero)
            this.tercerosUserId.push(data[i].id)
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingTercerosTrans = false))
    },





    searchTercerosPdr (val) {
      if (this.isLoadingTercerosPdr) return
      this.isLoadingTercerosPdr = true
      return HTTP().get('/userspuntosderetiros/false/5')
        .then(({ data }) => {
          this.entriesTercerosPdr = []
          this.tercerosUserId = []
          for (let i=0; i<= data.length-1; i++) {
            this.entriesTercerosPdr.push(data[i].tercero)
            this.tercerosUserId.push(data[i].id)
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingTercerosPdr = false))
    },





    searchTercerosPdrDir (val) {
      if (this.isLoadingTercerosPdrDir) return
      this.isLoadingTercerosPdrDir = true
      return HTTP().get('/userspuntosderetiros/'+this.envio.direccion_id+'/'+this.envio.puntoderetiro_id)
        .then(({ data }) => {
          this.entriesTercerosPdrDir = []
          for (let i=0; i<= data.length-1; i++) {
            this.entriesTercerosPdrDir.push(data[i].tercero)
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingTercerosPdr = false))
    },





    searchBancos (val) {
      if (this.isLoadingBancos) return
      this.isLoadingBancos = true
      return HTTP().get('/bancos')
        .then(({ data }) => {
          this.entriesBancos = []
          data.forEach(e => {
            this.entriesBancos.push(e)
          })
          let ipos = 0
          for (let i=0; i<=this.entriesBancos.length-1; i++) {
            if (this.editadoMed.banco_id === this.entriesBancos[i].id) {
              ipos = i
              break
            }
          }
          if (ipos!=0) {
            this.editadoMed.banco_id = this.entriesBancos[ipos].id;
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingBancos = false))
    },
  },





  mounted () {
    //this.$events.listen('testEvent', eventData => console.log(eventData));

    if (this.sucursalDemo) {
      this.comprobantes[0].activo = false
      this.comprobantes[1].activo = false
      this.comprobantes[2].activo = false
    } else {
      this.comprobantes[0].activo = this.rol(0, 'ver')
      this.comprobantes[1].activo = this.rol(1, 'ver')
      this.comprobantes[2].activo = this.rol(2, 'ver')
    }
    this.comprobantes[3].activo = this.rol(3, 'ver')
    this.comprobantes[4].activo = this.rol(4, 'ver')
    this.comprobantes[5].activo = this.rol(5, 'ver')
    this.comprobantes[6].activo = this.rol(6, 'ver')
    //this.comprobantes[7].activo = this.roles[11].acceder

    this.$store.commit('closeAlert')
    moment.locale('es');
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      this.anio = moment().format('YYYY')
      this.leoAnios()
        .then(data => {
          if (this.externo) {
            this.centrales.ventas_panel = 'Pedidos'
            this.$store.commit("setCentrales", { ventas_panel: 'Pedidos' }, { root: true });
            this.filtroComprobanteSel = 'Pedidos'
            this.selectTipoDeComprobante(this.centrales.ventas_panel)
          } else {
            if (this.centrales.ventas_panel=='') {
              this.centrales.ventas_panel = this.sucursalDemo ? 'Presup.' : 'Facturas'
            }
            if (this.sucursalDemo) {
              this.centrales.ventas_panel = 'Presup.'
              this.$store.commit("setCentrales", { ventas_panel: 'Presup.' }, { root: true });
            } else {
              let pos = this.comprobantes.findIndex(i => i.nombre === this.centrales.ventas_panel);
              if (this.comprobantes[pos].activo) {
                this.selectTipoDeComprobante(this.centrales.ventas_panel)
              } else {
                for ( let i=0; i<= this.comprobantes.length-1; i++) {
                  if (this.comprobantes[i].activo) {
                    this.selectTipoDeComprobante(this.comprobantes[i].nombre)
                    break
                  }
                }
              }
            }
          }
          //if (this.centrales.ventas_filtro!='') {
            //this.filtro = this.centrales.ventas_filtro
          //}
          if (this.centrales.ventas_buscar!='') {
            this.search = this.centrales.ventas_buscar
          }
          this.setGrillaPrincipal()

        })
    }
  },





  created () {

    this.cen_activo_bg         = this.$store.state.temas.cen_card_activo_bg
    this.cen_activo_dark       = this.$store.state.temas.cen_card_activo_dark

    this.comprobantes[0].bg    = this.$store.state.temas.cen_facturas_bg
    this.comprobantes[0].dark  = this.$store.state.temas.cen_facturas_dark
    this.comprobantes[1].bg    = this.$store.state.temas.cen_creditos_bg
    this.comprobantes[1].dark  = this.$store.state.temas.cen_creditos_dark
    this.comprobantes[2].bg    = this.$store.state.temas.cen_debitos_bg
    this.comprobantes[2].dark  = this.$store.state.temas.cen_debitos_dark
    this.comprobantes[3].bg    = this.$store.state.temas.cen_presupuestos_bg
    this.comprobantes[3].dark  = this.$store.state.temas.cen_presupuestos_dark
    this.comprobantes[4].bg    = this.$store.state.temas.cen_remitos_bg
    this.comprobantes[4].dark  = this.$store.state.temas.cen_remitos_dark
    this.comprobantes[5].bg    = this.$store.state.temas.cen_pedidos_bg
    this.comprobantes[5].dark  = this.$store.state.temas.cen_pedidos_dark
    this.comprobantes[6].bg    = this.$store.state.temas.cen_recibos_bg
    this.comprobantes[6].dark  = this.$store.state.temas.cen_recibos_dark

    return HTTP().get('/tarjetascobros').then(({ data }) => {
      this.medios = []
      for (let i=0; i<=data.length-1; i++) {
        this.medios.push(data[i])
      }
      return HTTP().get('/bancos').then(({ data }) => {
        this.banItems = []
        for (let i=0; i<=data.length-1; i++) {
          this.banItems.push(data[i])
        }
        return HTTP().get('/afipiva').then(({ data }) => {
          this.ivaTasas = []
          for (let i=0; i<=data.length-1; i++) {
            this.ivaTasas.push(data[i])
          }
          return HTTP().get('/afipmonedas').then(({ data }) => {
            this.monItems = data

            // BUSCO LOS DEPOSITOS HABILITADOS EN LA SUCURSAL
            return HTTP().get('/user/'+this.userId).then(({ data }) => {
              let psuc = data[0].sucursales.map(function(e) { return e.id; }).indexOf(this.sucursal);
              for (let i=0; i<= data[0].sucursales[psuc].depositos.length-1; i++) {
                this.depItems.push(data[0].sucursales[psuc].depositos[i])
              }
              // BUSCA A LOS MOROSOS PARA NOTIFICAR
              return HTTP().get('/morosos/'+this.userId)
                .then(({ data }) => {
              })
            })
          })
        })
      })
    })
  },





  methods: {
    ...mapMutations([
      'alert',
      'closeAlert',
      'setSucursal',
      'setSucursales',
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
      'setHayPedidos',
    ]),





    /////////////////////////
    // METODOS DE CABECERA //
    /////////////////////////
    closeForm(){
      router.push('/')
    },





    sayTarjeta(inf) {
      let say = ''
      if (inf.tarjetanombre!=null) {
        say = inf.tarjetanombre
      }
      if (inf.banconombre!=null) {
        say += ' ' + inf.banconombre
      }
      if (inf.debito) {
        say += ' con un recargo del ' + this.roundTo(inf.recargo,2) + '%'
      } else {
        say += ' en ' + inf.cuotas + ' cuota/s'
        say += ' y un interés del ' + this.roundTo(inf.interes,2)+'%'
      }
      return say
    },





    buscoSiElTerceroEstaVinculado() {
      let estaVinculado = false
      if (this.editado.tercero_id!=null && (this.editado.cpr=='FAC' || this.editado.cpr=='REC')) {
        for (let i=0; i<=this.vinculosHijos.length-1; i++) {
          if (this.vinculosHijos[i]==this.userDelTercero) {
            this.msg.msgTitle = 'Cliente Vinculado'
            let msg = 'El cliente esta vinculado, debe pedirle que le realice un '
            msg += this.editado.cpr=='FAC' ? 'pedido.' : 'pago.'
            this.msg.msgBody = msg
            this.msg.msgVisible = true
            this.msg.msgAccion = 'cliente vinculado'
            this.msg.msgButtons = ['Aceptar']
            estaVinculado = true
          } 
        }
        return estaVinculado
      }
    },





    arreglarPedido() {
      this.msg.msgTitle = 'Arreglar Pedido'
      this.msg.msgBody = 'Confirma arreglar el pedido?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'arreglar pedido'
      this.msg.msgButtons = ['Aceptar', 'Cancelar']
    },





    arreglarPedidoHTTP(){
      return HTTP().post('/arreglarpedido', { proveedor: this.itemActual.tercero.user.id, errores: this.selArtPedErr })
        .then(({ data }) => {
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
          this.listarHTTP(false)
        })
    },





    finalizarPedido(item) {
/*
      return HTTP().get('/puedeenviarpedido/'+item.id)
        .then(({data})=>{

          let err = []
          for (let i=0; i<=data.length-1; i++) {
            if (data[i].stock<0) {
              err.push({codigo: data[i].codigo, nombre: data[i].nombre, stock:data[i].stock})
            }
          }
          if (err.length>0) {
            this.msg.msgTitle = 'Stock insuficiente en publicaciones'
            let txt = '<br>'
            if (err.length==1) {
              txt += 'No hay stock suficiente en el siguiente articulo:<br><br>'
            } else {
              txt += 'No hay stock suficiente en los siguientes articulos:<br><br>'
            }
            for (let i=0; i<=err.length-1; i++) {
              txt += err[i].codigo+'&nbsp &nbsp'+err[i].nombre+'&nbsp &nbsp'+this.formatoImporte(data[0].stock)+'<br>'
            }
            txt += '<br>Deberá reacomodar su pedido para poder continuar.<br><br>'
            this.msg.msgButtons = ['Aceptar']
            this.msg.msgBody = txt
            this.msg.msgVisible = true
            this.msg.msgAccion = 'no hay stock en publicaciones'

          } else {

            HTTP().get('/comprasitems/'+item.id)
              .then(({ data }) => {
                this.msg.msgTitle = 'Finalizar y Enviar Pedido'
                this.msg.msgVisible = true
                this.msg.msgAccion = 'Finalizar y Enviar'
                let txt = ''
                if (data.length==0) {
                  this.msg.msgBody = 'Este pedido no posee items. Agrege items para poder enviar el pedido.'
                  this.msg.msgButtons = ['Cerrar']
                } else {
                  txt = '¿Confirma enviar el pedido a Administración?<br>'
                  txt += 'El pedido posee '+(data.length)+' item/s.<br><br>'
                  txt += 'Una vez confirmado no podra ser modificado.'
                  this.msg.msgBody = txt
                  this.msg.msgButtons = ['Aceptar','Cancelar']
                }
                this.itemActual = item;
            })
          }
        })
*/

      return HTTP().get('/puedeenviarpedido/'+item.id)
        .then(({data})=>{
          let err = []
          let sinstockpbub = false
          let difprecios = false
          this.selArtPedErr = []
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
        })
    },





    preguntoEnvio (item) {  //hev
      this.msg.msgTitle = 'Enviar Pedido'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'finalizar y enviar pedido al proveedor'
      let txt = ''
      if (item.items.length==0) {
        this.msg.msgBody = 'Este pedido no posee items. Agrege items para poder enviar el pedido.'
        this.msg.msgButtons = ['Cerrar']
      } else {
        if (item.tercero.user) {
          txt = '¿Confirma enviar el pedido a '+item.tercero.user.username +'?<br> El pedido posee '+(item.items.length)+' item/s. '
          txt = txt + 'y será enviado por sistema.<br><br>'+item.tercero.user.username+' lo recibirá '
          txt = txt + 'y podrá comenzar su procesamiento.'
        } else {
          txt = '¿Confirma enviar el pedido a '+item.tercero.nombre+'?<br> El pedido posee '+(item.items.length)+' item/s.'
          txt = txt + 'El pedido será enviado por correo electrónico en formato Excel.'
        }
        this.msg.msgBody = txt
        this.msg.msgButtons = ['Aceptar','Cancelar']
      }
      this.itemActual = item;
    },





    cargoSaldosYValoresPendientes(tercero) {
      this.saldoctacte = 0
      this.valorespendientes = 0
      this.disponible = 0
      return HTTP().get('/saldo/'+tercero)
        .then(({ data }) => { 
          if (data[0]) {
            if (data[0].pendientes!=null) {
              this.saldoctacte = data[0].pendientes
            }
          }
          return HTTP().get('/valorespendientes/'+tercero)
            .then(({ data }) => { 
              if (data[0]) {
                if (data[0].valorespendientes!=null) {
                  this.valorespendientes = data[0].valorespendientes
                }
              }
              if (this.creditomaximo == null) {
                this.creditomaximo = 999999999999
              }
              this.disponible        = this.roundTo(this.creditomaximo-(this.saldoctacte+this.valorespendientes),2)
              this.creditomaximo     = this.formatoImporte(this.roundTo(this.creditomaximo,2))
              this.saldoctacte       = this.formatoImporte(this.roundTo(this.saldoctacte,2))
              this.valorespendientes = this.formatoImporte(this.roundTo(this.valorespendientes,2))
              this.calculos()
              this.tienesaldo = true
              if (this.editado.texto == 'FACPED' && this.disponible < this.editado.total) {
                this.msg.msgTitle = 'Saldo Insuficiente'
                let msg = 'El cliente no posee saldo suficiente para poder realizar esta operación.<br><br>'
                msg += 'El crédito asignado es: $'+this.creditomaximo+'<br>'
                msg += 'El saldo disponible es: $'+this.formatoImporte(this.disponible)+' * <br>'
                msg += 'Y el total del pedido es: $'+this.formatoImporte(this.editado.total)+'<br>'
                msg += 'Faltan $'+this.formatoImporte(this.editado.total-this.disponible)+' para poder seguir.<br><br>'
                msg += '* La deuda se compone de las facturas con saldos pendientes mas los valores aún no acreeditados en pagos realizados.<br><br>'
                msg += 'Las alternativas son dos:<br>'
                msg += '1) Incrementar el crédito máximo asignado a este cliente.<br>'
                msg += '2) Pedirle al cliente que cancele deuda por el monto indicado para poder continuar.<br>'
                this.msg.msgBody = msg
                this.msg.msgVisible = true
                this.msg.msgAccion = 'saldo insuficiente'
                this.msg.msgButtons = ['Aceptar']
                this.tienesaldo = false
              }
            })
        })
    },





    leerDirPdr() {
      return HTTP().get('/userspuntosderetirosdir/'+this.envio.puntoderetiro_id)
        .then(({ data }) => {
          this.dirItemsPdrDir = []
          for (let i=0; i<= data[0].direcciones.length-1; i++) {
            this.dirItemsPdrDir.push(data[0].direcciones[i])
          }
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingTercerosPdr = false))
    },





    sayMessage2(item, open) {
    },





    sayMessage(item, open) {
      if (item.estado == 'E') {
//      if (item.filtroEstado=='Enviados') {
//        if (open) {
//          this.mensaje('Llega el '+ this.fechaTimeLine(item.enviollegada), this.temas.forms_titulo_bg, 13000, false)
//        } else {
//          this.$store.commit('closeAlert')
//        }
//        return false
      } else if (item.estado == 'F' && 
        (item.cpr.substring(0,3)=='FAC' || item.cpr.substring(0,3)=='NDD' || item.cpr.substring(0,3)=='NDC')) {
        if (item.pendientes.length) {
          if (item.pendientes[0].cancelaciones.length) {
            return item.pendientes[0].cancelaciones[0].cancelador.cpr+' $'+this.formatoImporte(item.pendientes[0].cancelaciones[0].importe)
          }
        }
      }
    },





    rol (i, accion) {
      if (this.externo && accion=='acceder') {
        return (i==5) ? true : false
      }
      if (this.sucursalDemo && i < 3) { return false }
      if (this.$store.state.level<=2) { return true }
      const op = this.$store.state.roles.map(el => el.opcion_id);
      const po = op.indexOf(i+5);
      if (po==-1 && accion=='ver') {
        return false
      } else {
        if (accion=='ver' && this.roles[po].acceder) {
          return true
        } else  if (accion=='agregar' && this.roles[po].agregar) {
          return true
        } else if (accion=='editar' && this.roles[po].editar) {
          return true
        } else if (accion=='desactivar' && this.roles[po].desactivar) {
          return true
        }
        return false
      }
    },





    selectTipoDeComprobante(cual) {
      this.filtroComprobanteSel = cual
      this.$store.commit("setCentrales", { ventas_panel: cual }, { root: true });
      if (cual=='Facturas') {
        this.filtroComprobante = [1,6,14,128]
      } else if (cual=='Créditos') {
        this.filtroComprobante = [3,8,16]
      } else if (cual=='Débitos') {
        this.filtroComprobante = [2,7,15]
      } else if (cual=='Remitos') {
        this.filtroComprobante = [125]
      } else if (cual=='Pedidos') {
        this.filtroComprobante = [126]   // 129/130
      } else if (cual=='Presup.') {
        this.filtroComprobante = [124]
      } else if (cual=='Recibos') {
        this.filtroComprobante = [4,9,17]
      }
      this.setGrillaPrincipal()
      this.listarHTTP(false)
    },





    setAcciones(item) {

      debugger
      this.itemActual = item
      this.acciones = []
      this.acciones.push({nombre: 'Detalles', icon: 'mdi-glasses'})
      this.acciones.push({nombre: 'WhatsApp', icon: 'mdi-whatsapp'})
      this.acciones.push({nombre: 'Imprimir', icon: 'mdi-printer'})

      if (this.externo) return   // SI ES EXTERNO PUEDE HACER SOLO LO DE ARRIBA

      this.acciones.push({nombre: 'Rastrear', icon: 'mdi-move-resize-variant'})

      if (item.cpr.substr(0,3)=='PED') {
        if (item.observaciones=='PEDIDO DEL VENDEDOR' && this.operarioVendedor) {
          if (item.estado=='P' && item.vendedor_id!=null) {
            this.acciones.push({nombre: 'Modificar', icon: 'mdi-pencil'})
            this.acciones.push({nombre: 'Finalizar y Enviar', icon: 'mdi-file-document'})
            if (item.estado!='T' && item.estado!='P') {
              this.acciones.push({nombre: 'Anular', icon: 'mdi-backup-restore'})
            }
          }
        } else if (item.observaciones=='PEDIDO DEL CLIENTE' && !this.operarioVendedor) {
          if (item.estado!='T' && item.estado!='P') {
            this.acciones.push({nombre: 'Anular', icon: 'mdi-backup-restore'})
          }
        }
        if (item.estado=='L' || item.estado=='R' || item.estado=='P') {    // estaba tambien el P
          this.acciones.push({nombre: 'Procesar Pedido', icon: 'mdi-playlist-check'})
          if (this.sucursales.length>1 && item.observaciones!='PARTICIONADO') {
            this.acciones.push({nombre: 'Transferir a otra Sucursal', icon: 'mdi-file-document'})
          }
          if (this.sucursalDemo) {
            this.acciones.push({nombre: 'Presupuestar', icon: 'mdi-file-document'})
          } else {
            this.acciones.push({nombre: 'Facturar', icon: 'mdi-file-document'})
          }
        } else if (item.estado=='T' && !this.operarioVendedor) {
          this.acciones.push({nombre: 'A Embalaje', icon: 'mdi-playlist-check'})
        } else if (item.estado=='B') {
          this.acciones.push({nombre: 'Enviar', icon: 'mdi-truck'})
          this.acciones.push({nombre: 'Retira', icon: 'mdi-account-check'})
        }
        this.acciones.push({nombre: 'Timeline', icon: 'mdi-filmstrip'})
      }
      if (item.cae) {
        this.acciones.push({nombre: 'Ver en AFIP', icon: 'mdi-bank'})
      }
      if ((!this.sucursalDemo && item.cpr.substr(0,3)=='FAC') ||
         (this.sucursalDemo && item.cpr.substr(0,3)=='PRE')) {
        if (this.cobrar(item)) {
          this.acciones.push({nombre: 'Cobrar', icon: 'mdi-sticker-emoji'})
          this.acciones.push({nombre: 'Solicitar Pago', icon: 'mdi-email-outline'})
        }
      }
      if (item.cpr.substring(0,3)=='FAC' && item.estado=='F' && !this.tieneRemito(item)) {
        this.acciones.push({nombre: 'Generar Remito', icon: 'mdi-truck'})
      }
      if (item.cpr.substring(0,3)=='FAC' && item.estado=='F') {
        if (this.roles.length>0) {
          if (this.roles[6].acceder) {
            this.acciones.push({nombre: 'Generar NDC', icon: 'mdi-file-percent'})
          }
          if (this.roles[5].acceder) {
            this.acciones.push({nombre: 'Generar NDD', icon: 'mdi-file-plus'})
          }
        } else {
          this.acciones.push({nombre: 'Generar NDC', icon: 'mdi-file-percent'})
          this.acciones.push({nombre: 'Generar NDD', icon: 'mdi-file-plus'})
        }
      }
      if (item.cpr.substring(0,3)=='NDC' && item.estado=='F') {
        this.acciones.push({nombre: 'Generar FAC', icon: 'mdi-file-document'})
      }
      if (item.cpr.substring(0,3)=='PRE' && (item.estado=='P' && !this.sucursalDemo)) {
        this.acciones.push({nombre: 'Facturar', icon: 'mdi-file-document'})
      }
      if (item.cpr.substring(0,3)=='PRE' && (item.estado=='F' && this.sucursalDemo)) {
        this.acciones.push({nombre: 'Anular', icon: 'mdi-autorenew'})
      }
      if (item.cpr.substring(0,3)=='REC' && item.estado=='F') {
        this.acciones.push({nombre: 'Anular', icon: 'mdi-backup-restore'})
        let hayCheques = false
        for (let i=0; i<=item.valoresIngresos.length-1; i++) {
          if (item.valoresIngresos[i].medio_id==6) {
            hayCheques = true
          }
        }
        if (hayCheques) {
          this.acciones.push({nombre: 'Generar NDD', icon: 'mdi-file-plus'})
        }
      }
      this.acciones.push({nombre: 'Adjuntar y Enviar Archivo', icon: 'mdi-file'})
    },





    async selAccion(item) {
      if (item.nombre=='Detalles') {
        this.printDetalles(this.itemActual)
      } else if (item.nombre=='WhatApp') {
        this.whatsapp(this.itemActual)
      } else if (item.nombre=='Imprimir') {
        this.print(this.itemActual)
      } else if (item.nombre=='Solicitar Pago') {
        this.enviarMail(this.itemActual)
      } else if (item.nombre=='Rastrear') {
        this.rastrear(this.itemActual)
      } else if (item.nombre=='Procesar Pedido') {
        this.chequearArtPed(this.itemActual)
      } else if (item.nombre=='Transferir a otra Sucursal') {
        this.chequearTransfPed(this.itemActual)
      } else if (item.nombre=='A Embalaje') {
        this.msg.msgTitle = 'PEDIDO A EMBALAJE'
        this.msg.msgBody = '¿Confirma enviar este pedido a Embalaje?'
        this.msg.msgVisible = true
        this.msg.msgAccion = 'pedido a embalaje'
        this.msg.msgButtons = ['Aceptar','Cancelar']
      } else if (item.nombre=='Modificar') {
        this.modificarPedido(this.itemActual)
      } else if (item.nombre=='Finalizar y Enviar') {
        this.finalizarPedido(this.itemActual)
      } else if (item.nombre=='Enviar') {
        this.prepararEnvioRetiro(this.itemActual, 'E')
      } else if (item.nombre=='Retira') {
        this.prepararEnvioRetiro(this.itemActual, 'R')
      } else if (item.nombre=='Facturar') {
        if (!this.sucursalDemo) {
          if (this.itemActual.cpr.substr(0,3)=='PRE') {
            this.nuevo('facpre', this.itemActual)
          } else {
            // OJO ACA, BUSCO LOS DIAS DE VENCIMIENTO EL CLIENTE, VIENE del modelo TerceroUser, el tema
            // es que esa relacion me trae todos los usuarios que estan relacionados a este tercero.
            // por eso el for. La otra seria hacer un get() directamente a TerceroUser
            if (this.itemActual.tercero.users!=null) {
              let pos = this.itemActual.tercero.users.findIndex(x=>x.user_id == this.userId )
              if (pos!=-1) {
                this.diasvenc = this.itemActual.tercero.users[pos].diasvenc
              }
            }
            this.nuevo(this.itemActual)
          }
        }
      } else if (item.nombre=='Presupuestar') {
        if (this.itemActual.cpr.substr(0,3)=='PED') {
          this.nuevo(this.itemActual)
        }
      } else if (item.nombre=='Cobrar') {
        this.nuevo('REC',this.itemActual)
      } else if (item.nombre=='Generar Remito') {
        this.nuevo('remfac', this.itemActual)
      } else if (item.nombre=='Anular') {
        if (this.itemActual.cpr.substr(0,3)=='REC') {
          this.anularRecibo(this.itemActual)
        } else if (this.itemActual.cpr.substr(0,3)=='PRE') {
          this.anularPresupuesto(this.itemActual)
        } else if (this.itemActual.cpr.substr(0,3)=='PED') {
          this.anularPedido(this.itemActual)
        }
      } else if (item.nombre=='Generar NDC') {
        this.ndcMotivoSel  = 1
        this.dialogNdcxDev = false
        let b = await this.controlNdc(this.itemActual)
        if (!b) {
          this.msg.msgTitle = 'ERROR'
          this.msg.msgBody = 'Esta factura no posee saldo ni items para devolver. No podra realizar Notas de Crédito.'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'Saldo insuficiente'
          this.msg.msgButtons = ['Aceptar']
          this.dialogNdcFac = false
          return
        }
        this.nuevo('ndcfac', this.itemActual)
      } else if (item.nombre=='Generar NDD') {
        this.dialogNddxDev = false
        if (this.itemActual.cpr.substr(0,3)=='FAC') {
          this.nddMotivos = [
            {id: 2, nombre: 'MORA'}, {id: 3, nombre: 'CAMBIO DE PRECIO'}
          ]
        } else if (this.itemActual.cpr.substr(0,3)=='REC') {
          this.nddMotivos = [
            {id:1, nombre: 'CHEQUES RECHAZADOS'}
          ]

          HTTP().get('/chequesarechazar/'+this.itemActual.id)
            .then(({ data }) =>{

              this.selected = []
              this.cheques = []
              for (let i=0; i<=data.length-1; i++) {

                let d = 0
                let hoy = moment()
                d = hoy.diff(data[i].fechafinanciera, 'days')

                this.cheques.push({
                  id:               data[i].id,
                  codban:           data[i].codigo,
                  nomban:           data[i].nomban==null ? '' : data[i].nomban.substr(0,12),
                  cuitlib:          data[i].cuitlib,
                  nomlib:           data[i].nomlib==null ? '' : data[i].nomlib.substr(0,12),
                  cuenta:           data[i].cuenta,
                  nrovalor:         data[i].nrovalor,
                  fechafinanciera:  data[i].fechafinanciera,
                  dias:             d,
                  importe:          data[i].importe,
                  cuentaorigen_id:  data[i].cuentaorigen_id,
                  cuentadestino_id: data[i].cuentadestino_id,
                  banco_id:         data[i].banco_id,
                  cheque_id:        data[i].cheque_id,
                  observ:           data[i].observ,
                  seleccionado:     0,
                })
              }
              this.dialogNddxDev = true
            })

        }
        this.nuevo('nddfac', this.itemActual)
      } else if (item.nombre=='Solicitar Pago') {
        this.solicitarPago(this.itemActual)
      } else if (item.nombre==='Timeline') {
        this.leerTimeLine(this.itemActual)
      } else if (item.nombre==='Ver en AFIP') {
        this.verCprEnAFIPHTTP(this.itemActual)
      }
    },





    solicitarPago() {
      /*
      La solicitud de pago tiene que venir aca, si el usuario esta vinculado se le envia una notificacion
      Caso contrario se le envia un mail. hev021
      */
      let email = ''
      for (let i=0; i<=this.itemActual.tercero.contactos.length-1; i++) {
        if (this.itemActual.tercero.contactos[i].contacto_tipo_id==1) {     // es un mail
          email = this.itemActual.tercero.contactos[i].observaciones
          break
        }
      }
      if (email=='') {
        this.msg.msgTitle = 'Falta eMail'
        this.msg.msgVisible = true
        this.msg.msgBody = 'Este cliente no tienen correo electrónico definido. Es necesario definir al menos uno.'
        this.msg.msgAccion = 'no hay email'
        this.msg.msgButtons = ['Aceptar']
      } else {
        this.msg.msgTitle = 'Enviar eMail'
        this.msg.msgVisible = true
        this.msg.msgBody = 'Se enviara un correo electrónico por falta de pago.'
        this.msg.msgAccion = 'Confirma enviar correo?'
        this.msg.msgButtons = ['Aceptar','Cancelar']
      }
    },





    enviarMail() {
      /*
      Email.send({
        token: "20b444a2-b3af-4eb8-bae7-911f6097521c",
        Host: "smtp.gmail.com",
        Username: "gohuapp",
        Password: "gmail021201",
        To: 'hev021@gmail.com',
        From: "gohuapp@gmail.com",
        Subject: "This is the subject",
        Body: "And this is the body"
      }).then(
        message => alert(message)
      );
      */

      let body = ''

      this.mail.token = "4a720391-3103-4352-ac74-d48f13f1a13b"
      this.mail.Host = "smtp.gmail.com"
      this.mail.username = "gohuapp"
      this.mail.password = "gmail021201"
      this.mail.to = 'hev021@gmail.com'
      this.mail.from = "gohuapp@gmail.com"
      this.mail.subject = "Solicitud de Pago del comprobante: "+this.itemActual.cpr
      this.mail.title = 'Envío de mail para Solicitud de Pago'
      this.mail.visible = true

      let f1 = moment().format('YYYY-MM-DD')
      let f2 = moment(this.itemActual.pendientes[0].vencimiento).format('YYYY-MM-DD')
      let hoy = moment(f1)
      let ven = moment(f2)
      let d = hoy.diff(ven, 'days')
      let dd = Math.abs(d)
      let dias = Math.abs(d)+' días'
      if (Math.abs(d)<2) {
        dias = Math.abs(d)+' día'
      }

      body  = '\nEstimados Sres:'+this.itemActual.tercero.nombre+'\n\n'
      body += 'Enviamos este correo para informales que la factura: '+this.itemActual.cpr+' '
      body += 'por un total de $ '+this.formatoImporte(this.itemActual.total)+'\n'
      body += 'esta '+dias+' vencida ('+moment(this.itemActual.pendientes[0].vencimiento).format('DD/MM/YYYY')+')\n'
      body += 'Lo invitamos a realizar la cancelación de la misma para evitar costos por mora.\n\n'
      body += 'Sin otro particular, aprovechamos para saludarlos muy atte.\n\n'
      body += this.datosEmpresa.razon_social
      body += '\n'
      this.mail.body = body
      this.mail.accion = 'Confirma enviar correo?'
      this.mail.buttons = ['Enviar','Cancelar']
    },





    getEstado (estado, accion, pend, carga, item) {
      let c = ''
      let e = ''
      let d = 0
      let f = false
      for (let i=0; i<=item.items.length-1; i++) {
        if (item.items[i].faltante>0) {
          f = true
          break
        }
      }
      if (accion=='k') {   //para el dark
        if (estado==='P') {
          return this.temas.cen_estado_pendiente_dark
        } else if (estado==='T') {
          return this.temas.cen_estado_facturado_dark 
        } else if (estado==='H') {
          return this.temas.cen_estado_enembalaje_dark
        } else if (estado==='B') {
          return this.temas.cen_estado_embalado_dark
        } else if (estado==='E' && item.cpr.substr(0,3)=='PED') {
          return this.temas.cen_estado_enviado_dark
        } else if (estado==='I') {
          return this.temas.cen_estado_enviado_dark
        } else if (estado==='F' || estado==='R') {
          return this.temas.cen_estado_finalizado_dark
        } else if (estado==='A') {
          return this.temas.cen_estado_anulado_dark
        } else if (estado==='L') {
          return this.temas.cen_estado_pendiente_dark
        } else {
          return this.temas.cen_estado_pendiente_dark
        }
      }
      if (pend!==undefined) {       // ctacte
        let f1 =  moment().format('YYYY-MM-DD')
        let f2 =  moment(pend.vencimiento).format('YYYY-MM-DD')
        let hoy = moment(f1)
        let ven = moment(f2)
        d = hoy.diff(ven, 'days')
        if (pend.pendiente==0) {
          e = 'Finalizado'
          c = this.temas.cen_estado_finalizado_bg
        } else if (d>0) {
          e = 'Vencido('+d+')'
          c = this.temas.cen_estado_vencido_bg
        } else if (d==0) {
          e = 'Vence Hoy'
          c = this.temas.cen_estado_vencehoy_bg
        } else {
          e = 'A Vencer('+d+')'
          c = this.temas.cen_estado_avencer_bg
        }
      } else if (estado==='A') {
        e = 'Anulado'
        c = this.temas.cen_estado_anulado_bg
      } else if (estado==='F' && item.cpr.substr(0,3)!='PED') {
        if (item.cpr.substr(0,3)=='PED') {
          e = f ? 'Fin.c/Flte' : 'Facturado'
        } else {
          e = f ? 'Fin.c/Flte' : 'Finalizado'
        }
        c = this.temas.cen_estado_finalizado_bg
      } else {
        if (estado==='P') {
          e = 'Parcial'   //
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
        } else if (estado==='E') {                                /// ????? no es 'V' ?
          if (item.cpr.substr(0,3)=='PED') {
            e = 'Enviado'
            } else {
            e = 'Envío'
          }
          c = this.temas.cen_estado_enviado_bg 
        } else if (estado==='I') {
          e = 'Retirado'
          c = this.temas.cen_estado_enviado_bg
        } else if (estado==='F') {
          e = 'Finalizado'
          c = this.temas.cen_estado_finalizado_bg
        } else if (estado==='D') {                  // solo para vendedores
          e = 'Pendiente'
          c = this.temas.cen_estado_finalizado_bg   
        } else if (estado==='R') {                  // pedido listo para facturar
          e = 'p/Procesar'
          c = this.temas.cen_estado_finalizado_bg
        } else if (estado==='A') {
          e = 'Anulado'
          c = this.temas.cen_estado_anulado_bg
        } else if (estado==='L') {
          e = 'Parcial'
          c = this.temas.cen_estado_pendiente_bg
        }
      }
      if (accion==='c') {
        return c
      } else {
        return e
      }
    },





    anularRecibo(item) {
      return HTTP().get('/controlanularrecibo/'+item.id )
        .then(({ data }) => {
          let sePuedeAnular = true
          for (let i=0; i<=data.length-1; i++) {
            if (data[i].medio_id!=1 && data[i].fechasalida!=null) {
              sePuedeAnular = false
            }
          }
          if (!sePuedeAnular) {
            this.mensaje('¡Este recibo no se puede Anular, posee valores que ya fueron entregados o extraidos del banco electronicamente!', this.temas.forms_titulo_bg, 1500)
            return
          } else {

            // que pasa cuando necesito anular un recibo
            // 1) si el cliente no esta vinculado es una anulacion normal
            // 2) si el cliente esta vinculado debo generar la anulacion en ambos lados
            let pos = this.vinculosHijos.findIndex(x => x = this.itemActual.tercero.user.id)
            this.msg.msgTitle = 'Anular Recibo'
            if (pos!=-1) {

              return HTTP().get('/comprobantesrastrear/'+item.id+'/up')
                .then(({ data }) => {

                  let ras = []
                  ras.push(data[0])
                  for (let i=1; i<=data.length-1; i++) {
                    for (let j=0; j<=data[i].length-1; j++) {
                      if (this.isArray(data[i][j])==false) {
                        ras.push(data[i][j])
                      } else {
                        for (let k=0; k<=data[i][j].length-1; k++) {
                          if (this.isArray(data[i][j][k])==false) {
                            ras.push(data[i][j][k])
                        } else {
                          for (let l=0; l<=data[i][j][k].length-1; l++) {
                            ras.push(data[i][j][k][l])
                          }
                        }
                      }
                    }
                  }
                }
                let r = []
                let lDone = false
                for (let i=0; i<=ras.length-1; i++) {
                  lDone = false
                  for (let j=0; j<=r.length-1; j++) {
                    if (r[j].id == ras[i].id) {
                      lDone = true
                    }
                  } 
                  if (!lDone) {
                    r.push(ras[i])
                  }
                }
                this.rastreo = r

                let t = 'Operación con Cliente Vinculado.<br><br>'
                t += 'Para conservar el balance de ambas cuentas corrientes<br>'
                t += 'se anulará el recibo <b>'+this.rastreo[0].cpr1+'</b><br>'
                t += 'y el pago <b>'+this.rastreo[0].cpr2+'</b> emitido por '+this.itemActual.tercero.nombre+'<br><br>'
                t += '¿Confirma?'

                this.msg.msgBody = t
                this.msg.msgVisible = true
                this.msg.msgAccion = 'anular recibo'
                this.msg.msgButtons = ['Aceptar','Cancelar']

              })
            
            } else {
              
              this.msg.msgBody = '¿Confirma anular el Recibo?'+this.itemActual.cpr+' ?'
              this.msg.msgVisible = true
              this.msg.msgAccion = 'anular recibo'
              this.msg.msgButtons = ['Aceptar','Cancelar']
            
            }

          }
      })
    },





    anularPresupuesto(item) {
      return HTTP().get('/controlanularpresupuesto/'+item.id )
        .then(({ data }) => {
          if (data=='ok') {
            this.msg.msgTitle = 'Anular Presupuesto'
            this.msg.msgBody = 'Confirma anular el Presupuesto '+item.cpr+' ?'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'anular presupuesto'
            this.msg.msgButtons = ['Aceptar','Cancelar']
          } else {
            this.msg.msgTitle = 'Anular Presupuesto'
            this.msg.msgBody = data
            this.msg.msgVisible = true
            this.msg.msgAccion = 'error anular presupuesto'
            this.msg.msgButtons = ['Aceptar']
            return
          }
      })
    },





    anularPedido(item) {
      this.dialogAnularPedido = true
    },





    anularReciboHTTP(item) {
      // que pasa cuando necesito anular un recibo
      // 1) si el cliente no esta vinculado es una anulacion normal
      // 2) si el cliente esta vinculado debo generar la anulacion en ambos lados
      return HTTP().post('/anularpresupuesto', { id: this.itemActual.id })
        .then(({ data }) => {
          this.mensaje('¡El presupuesto ha sido anulado con exito!', this.temas.forms_titulo_bg, 1500)
          this.listarHTTP(false)
        });
    },





    anularPresupuestoHTTP() {
      return HTTP().post('/anularpresupuesto', { id: this.itemActual.id })
        .then(({ data }) => {
          this.mensaje('¡El presupuesto ha sido anulado con exito!', this.temas.forms_titulo_bg, 1500)
          this.listarHTTP(false)
        });

    },





    anularPedidoHTTP() {
      return HTTP().post('/anularpedido', {
        itemActual: this.itemActual,
        motivo: this.motivoAnularPedido })
        .then(({ data }) => {
          if (data) {
            this.mensaje('¡Pedido anulado correctamente!', this.temas.forms_titulo_bg, 1500)
          } else {
            this.mensaje('¡Opps, se ha producido un error al anular el pedido!', this.temas.forms_titulo_bg, 1500)
          }
          this.dialogAnularPedido = false
          this.listarHTTP(false)
        });

    },





    aEmbalajeHTTP(item) {
      let novedad = {
        cpr_id: item.id,
        novedad: 'Pedido a embalaje',
        rel_id: null,
        estado: 'N'
      }
      return HTTP().post('/pedidoaembalaje', 
        { pedido: item, novedad: novedad })
        .then(({ data }) => {
          this.dialogEmbalajes = false
          if (data) {
            this.listarHTTP(false)
          }
        })
    },





    aPedidosEmbaladosHTTP() {
      return HTTP().post('/pedidosembalados', 
        { embalados: this.aEmbalar })
        .then(({ data }) => {
          if (data) {
            this.dialogEmbalajes = false
            this.embalajesSel = 0
            this.listarHTTP(false)
          }
        })
    },





    aEnviarHTTP() {
      let a = this.itemActual
      return HTTP().post('/enviarpedido', 
        {
          envio: this.envio,
          part: 'ENV-X '+this.sucursalFiscal+'%',
          sucursal_id: this.sucursal,
          itemactual: this.itemActual,
        })
        .then(({ data }) => {
          if (data) {
            this.dialogEnvios = false
            this.listarHTTP(false)
          }
        })
    },





    aRetirarHTTP() {
      let a = this.itemActual
      return HTTP().post('/retirarpedido', 
        {
          envio: this.envio,
          part: 'RET-X '+this.sucursalFiscal+'%',
          sucursal_id: this.sucursal,
          itemactual: this.itemActual,
        })
        .then(({ data }) => {
          if (data) {
            this.dialogRetiro = false
            this.listarHTTP(false)
          }
        })
    },





    enviarPedidoDelVendedor(item) {

      this.editedIndex = this.items.indexOf(item)
      if (this.items[this.editedIndex].tercero.user) { // esta modificando
        // TIENE QUE ENVIAR EL PEDIDO POR SISTEMA
        let novedad = {
          cpr_id: this.items[this.editedIndex].id,
          novedad: 'Envio del Pedido',
          rel_id: null,
          estado: 'N'
        }

        return HTTP().patch('/enviarpedido', {
          id: this.items[this.editedIndex].id,
          novedad: novedad,
          vendedor: true })
          .then(({ data }) => {

            if (data = 'ok') {
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
              this.mensaje('¡Pedido enviado correctamente!', this.temas.forms_titulo_bg, 1500)
            } else {
              this.mensaje('¡Ha ocurrido un problema con el envío del pedido!', this.temas.forms_titulo_bg, 1500)
            }
            this.listarHTTP(false);
          })

      } else  {
        // TIENE QUE ENVIAR EL PEDIDO POR MAIL
      }
    },






    modificarPedido(item) {

      this.editedIndex = this.items.indexOf(item)
      this.cpr = item.cpr
      this.dialog = true
      this.articulos = []
      this.confirmarComprobanteMensaje = 'GUARDAR PEDIDO'

      this.formTitle = 'Modificar el Pedido '+item.cpr+' - ('+item.tercero.nombre+')'

      this.searchTerceros           = ''
      this.isLoadingTerceros        = true // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
      this.basadoEnCpr              = true;   // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
      this.editado.tercero_id       = item.tercero_id;
      this.editado.nombre           = item.tercero.nombre;
      this.editado.responsableAbrev = item.tercero.responsable.abrev
      this.editado.documento        = item.tercero.documento.nombre
      this.editado.documento_id     = item.documento_id
      this.editado.documentoCodigo  = item.tercero.documento.codigo
      this.editado.mediodepago_id   = item.mediodepago_id

      this.editado.documentoNumero  = item.tercero.cuit
      this.editado.moneda_id        = item.moneda_id
      
      //this.cfUser = Number(item.tercero.responsable.codigo)
      this.cfUser                   = this.responsable

      this.ctacte = false
      if (item.tercero.usersterceros.length>0) {
        this.ctacte = item.tercero.usersterceros[0].ctacte
        this.diasvenc = item.tercero.usersterceros[0].diasvenc
        this.bonificacionmaxima = item.tercero.usersterceros[0].bonificacionmaxima
        this.creditomaximo = item.tercero.usersterceros[0].creditomaximo
      }

      this.editado.letra = 'P'
      this.dirItems.push(item.tercero.direcciones[0])
      this.editado.direccion_id = this.dirItems[0].id
      this.editado.deposito_id = this.depItems[0].id
      this.editado.texto = this.sucursalDemo ? 'PREPED' : 'FACPED'
      this.editado.comprobante_id = 126
      this.editado.vendedor_id = item.vendedor_id
      this.editado.observaciones = 'PEDIDO DEL VENDEDOR'
        
      //Cargo los articulos del pepdido, pero primero tengo que ver si ya fueron cargados anteriormente
      //y quedo saldo (estado = 'L')
      //En ese caso tengo que buscar en vinuculados para sacar la diferencia

      // busco comprobantes que imputaron a este pedido.
      this.articulos = [];
      for (let i=0; i<=item.items.length-1; i++) {
        this.articulos.push({ 
          id:               item.items[i].id,
          articulo_id:      item.items[i].articulo_id,
          codigo:           item.items[i].articulo.codigo,
          nombre:           item.items[i].articulo.nombre,
          deposito_id:      this.editado.deposito_id,
          unidad_id:        item.items[i].articulo.unidad_id,
          moneda_id:        item.items[i].articulo.moneda_id,
          iva_id:           item.items[i].articulo.iva_id,
          cantidad:         Number(item.items[i].cantidad),
          cantidadoriginal: Number(item.items[i].cantidad),
          stock:            Number(item.items[i].cantidad),
          undstock:         Number(item.items[i].cantidad),
          costo:            item.items[i].costo,
          precio:           item.items[i].precio,
          preciooriginal:   item.items[i].precio,
          tasadescuento:    item.items[i].tasadescuento,
          importedescuento: item.items[i].importedescuento,
          total:            item.items[i].total,
          texto:            item.items[i].texto,
          vencimiento:      item.items[i].vencimiento,
          adevolver:        0,
          padre_id:         null,
          undenvase:        item.items[i].articulo.undenvase,
          escombo:          item.items[i].articulo.escombo,
        })
      }
    },





    enviarPedidoHTTP(item) {
      let novedad = {
        cpr_id: item.id,
        novedad: 'Envío de Pedido',
        rel_id: null,
        estado: 'N'
      }
      return HTTP().post('/pedidoenvio', 
        { pedido: item, novedad: novedad })
        .then(({ data }) => {
          this.dialogEnvios = false
          if (data) {
            this.listarHTTP(false)
          }
        })
    },





    confirmarEmbalados(item) {
      if (this.embalajesSel==1) {
        this.msg.msgTitle = 'PEDIDO EMBALADO'
        this.msg.msgBody = '¿Confirma el embalado del pedido seleccioando?'
      } else {
        this.msg.msgTitle = 'PEDIDOS EMBALADOS'
        this.msg.msgBody = '¿Confirma el embalado de los pedidos seleccioandos?'
      }
      this.msg.msgVisible = true
      this.msg.msgAccion = 'pedidos embalados'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },





    confirmarEnvioRetiro(como) {
      this.msg.msgTitle   = como == 'E' ? 'ENVIAR PEDIDO' : 'RETIRO DEL PEDIDO'
      this.msg.msgBody    = como == 'E' ? '¿Confirma el envío del pedido?' : '¿Confirma el retiro del pedido?'
      this.msg.msgVisible = true
      this.msg.msgAccion  = como == 'E' ? 'enviar pedido al cliente' : 'retirar pedido'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },





    nuevo(que, item) {

      debugger
      this.confirmarComprobanteMensaje = 'CONFIRMAR COMPROBANTE'
      this.recargo = 0
      this.electronica = false
      this.cueMiasItems = []
      this.rentabilidad = 0
      debugger
      for (let i=0; i<=this.datosEmpresa.cuentas.length-1; i++) {
        this.cueMiasItems.push({
          id:          this.datosEmpresa.cuentas[i].id,
          banco:       this.datosEmpresa.cuentas[i].banco.nombre,
          cuenta:      this.datosEmpresa.cuentas[i].cuenta,
          nombre:      this.datosEmpresa.cuentas[i].nombre,
        })
      }

      // SI "que" VIENE CON DATOS, ES PORQUE ESTOY HACIENDO UN COMPROBANTE BASADO EN OTRO
      this.dialog = true;
      this.basadoEnCpr = false;         // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
      this.notificaEnBaseAOtro = [];    // LIMPIO NOTIFICACIONES PARA NO TENER PROBLEMAS
      this.notificaOriginal = [];
      this.basadoEnOtroCpr = []

      this.searchTerceros = '';
      this.searchTercerosRec = '';
      this.searchTercerosTrans = '',
      this.isLoadingBancos = false;
      this.isLoadingTerceros = false;
      this.isLoadingTercerosRec = false;
      this.sucManual = this.sucursalManual

      // LIMPIO MEDIOS DE PAGO
      for (let i=0; i<=this.medpag.length-1; i++) {
        this.medpag[i].total = 0
        this.medpag[i].recargo = 0
      }

      this.medpag[1].activo = this.sucursalDemo ? false : true
      this.medpag[2].activo = this.sucursalDemo ? false : true
      this.medpag[4].activo = this.sucursalDemo ? false : true
      this.medpag[6].activo = this.sucursalDemo ? false : true
      this.medpag[7].activo = this.sucursalDemo ? false : true
      this.medpag[8].activo = this.sucursalDemo ? false : true

      this.valDiferencia = 0;
      this.comoPaga = "1";
      this.formTitleArt = 'Nuevo Item'
      this.formTitleMed = 'Nuevo Valor'
      this.editadoArt = Object.assign({}, this.defaultItemArt)
      this.editado = Object.assign({}, this.defaultItem)
      this.articulos = []
      this.pendientes = []
      this.valores = []
      this.esManual = false
      this.editado.fecha = moment().format('YYYY-MM-DD')

      if (que === 'Facturas') {

        if (que=='Facturas') {
          this.formTitle = 'Nueva Factura - Sucursal ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
        } else {
          this.formTitle = 'Nueva Factura MANUAL - Sucursal ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
          this.esManual = true
        }
        this.editado.cpr = 'FAC'
        this.coef = 1
        this.medpag[1].activo = true
        this.electronica = !this.sucursalDemo
      
      } else if (que === 'Créditos') {
        
        this.formTitle = 'Nueva Nota de Crédito Sucursal - ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
        this.editado.cpr = 'NDC'
        this.coef = -1
        this.electronica = !this.sucursalDemo
      
      } else if (que === 'Débitos') {
        
        this.formTitle = 'Nueva Nota de Débito - Sucursal ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
        this.editado.cpr = 'NDD'
        this.coef = 1
        this.electronica = !this.sucursalDemo
      
      } else if (que === 'Presup.') {
        
        this.formTitle = 'Nuevo Presupuesto - Sucursal ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
        this.editado.cpr = 'PRE'
        this.editado.comprobante_id = 124
        this.editado.letra = 'P'
        this.editado.observaciones = 'PRESUPUESTO'
        this.coef = 1
      
      } else if (que === 'Remitos') {
        
        this.formTitle = 'Nuevo Remito - Sucursal ('+this.sucursal+')'+ ' - Caja ('+this.caja+')';
        this.editado.cpr = 'REM'
        this.editado.comprobante_id = 125
        this.editado.letra = 'R'
        this.editado.observaciones = 'REMITO'
        this.coef = 1
      
      } else if (que === 'Pedidos') {
        
        // cuando es un pedido es desde un vendedor
        // tengo que simular como que lo esta haciendo el cliente
        this.editedIndex = -1
        this.confirmarComprobanteMensaje = 'GUARDAR PEDIDO'
        this.formTitle = 'Nuevo Pedido'
        this.editado.cpr = 'PED'
        this.coef = 1
        
        this.editado.letra = 'P'
        this.editado.observaciones = 'PEDIDO DEL VENDEDOR'
        this.editado.comprobante_id = 126
        this.editado.vendedor_id = this.operarioTerceroId
     
      } else if (que === 'facpre') {

        this.formTitle = 'Generar Factura sobre el Presupuesto '+item.cpr+' - ('+item.tercero.nombre+')'

        this.searchTerceros           = ''
        this.isLoadingTerceros        = true   // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
        this.basadoEnCpr              = true   // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
        this.editado.tercero_id       = item.tercero_id
        this.editado.nombre           = item.tercero.nombre
        this.editado.responsableAbrev = item.tercero.responsable.abrev
        this.editado.documento        = item.tercero.documento.nombre
        this.editado.documento_id     = item.documento_id
        this.editado.documentoCodigo  = item.tercero.documento.codigo
        this.editado.mediodepago_id   = item.mediodepago_id

        this.editado.tasadescuento    = item.tasadescuento
        this.editado.importedescuento = item.importedescuento
        this.editado.documentoNumero  = item.tercero.cuit
        this.editado.moneda_id        = item.moneda_id
        let rid                       = item.tercero.responsable.id

        this.cfUser                   = this.responsable

        this.editado.cpr = 'FAC';
        if (this.cfUser===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO
          if(rid===1 || rid===2 || rid===9 || rid===11) {
            this.editado.letra = 'A'
          } else {
            this.editado.letra = 'B'
          }
        } else if (this.cfUser===6) { //EL USUARIO ES MONOTRIBUTISTA
            this.editado.letra = 'C'
        }
        this.dirItems.push(item.tercero.direcciones[0])
        this.editado.direccion_id = this.dirItems[0].id
        this.editado.deposito_id = this.depItems[0].id
        this.electronica = !this.sucursalDemo

        //Cargo los articulos del pepdido
        this.articulos = [];
        for (let i=0; i<=item.items.length-1; i++) {
          this.articulos.push({ 
            articulo_id:      item.items[i].articulo_id,
            codigo:           item.items[i].articulo.codigo,
            nombre:           item.items[i].articulo.nombre,
            deposito_id:      this.editado.deposito_id,
            unidad_id:        item.items[i].articulo.unidad_id,
            moneda_id:        item.items[i].articulo.moneda_id,
            iva_id:           item.items[i].articulo.iva_id,
            cantidad:         Number(item.items[i].cantidad),
            cantidadoriginal: Number(item.items[i].cantidad),
            stock:            Number(item.items[i].cantidad),
            undstock:         Number(item.items[i].cantidad),
            costo:            item.items[i].costo,
            precio:           item.items[i].precio,
            preciooriginal:   item.items[i].precio,
            tasadescuento:    item.items[i].tasadescuento,
            importedescuento: item.items[i].importedescuento,
            total:            item.items[i].total,
            texto:            item.items[i].texto,
            vencimiento:      item.items[i].vencimiento,
            adevolver:        0,
            padre_id:         null,
            undenvase:        item.items[i].articulo.undenvase,
            escombo:          item.items[i].articulo.escombo,
          })
        }

        this.notificaOriginal = [{
          comprobante_id: item.id,
          estado: 'F'
        }]

        this.calculos()

      } else if (que === 'remfac') {

        this.formTitle = 'Generar Remito sobre la Factura '+item.cpr+' - ('+item.tercero.nombre+')'
        this.coef = 1

        this.searchTerceros = ''
        this.dialog = false
        this.dialogRem = true
        this.dialogNdcFac = false
        this.isLoadingTerceros = true // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
        this.basadoEnCpr = true;      // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
        this.basadoEnOtroCpr.push(item.id)

        this.editado.tercero_id = item.tercero_id
        this.editado.nombre = item.tercero.nombre
        this.editado.responsableAbrev = item.tercero.responsable.abrev
        this.editado.documento = item.tercero.documento.nombre
        this.editado.documento_id = item.documento_id
        this.editado.documentoCodigo  = item.tercero.documento.codigo
        this.editado.deposito_id = item.deposito_id
        this.remitoItems = item.items.length
        this.articulos = item.items
        this.editado.direccion_id = item.direccion_id

        this.editado.cpr = item.cpr
        this.editado.total = item.total
        this.editado.rentabilidad = 0
        this.editado.documentoNumero = item.tercero.cuit
        this.editado.moneda_id = item.moneda_id
        this.editado.observaciones = 'REMITO'
        this.editado.mediodepago_id = null
        let rid = item.tercero.responsable.id

        this.cfUser                   = this.responsable
//      this.cfUser = Number(item.tercero.responsable.codigo)

      } else if (que === 'facrem') {
      
        this.formTitle = 'Facturar un Remito'
      
      } else if (que === 'pre') {
        
        this.formTitle = 'Nuevo Presupuesto'

      } else if (que === 'facped') {
        
        this.formTitle = 'Facturar un Pedido'
      
      } else if (que === 'not') {
        
        this.formTitle = 'ANOTADOR DE VENTAS'
        this.dialogNot = true
        this.dialog = false
        this.listarAnotaciones()
      
      } else if (que === 'facnot') {
        
        this.formTitle = 'Facturar Anotaciones de Ventas'
        this.electronica = !this.sucursalDemo

      } else if (que === 'Recibos' ) {

        //this.medpag[6].activo          = false
        this.formTitle                 = 'Nuevo Recibo'
        this.reciboDeUnSoloComprobante = false
        this.esUnPagoDeUnaFactura      = false
        this.searchTercerosRec         = ''
        this.dialog                    = false
        this.dialogRem                 = false
        this.dialogRec                 = true
        this.dialogNdcFac              = false
        this.esFiscal                  = false
        this.coef                      = 1
        this.pend                      = []
        this.valores                   = []
        this.totCancelado              = 0
        this.totValores                = 0
        this.valDiferencia             = 0
        this.editado.cpr               = 'REC'
        this.medpag[1].activo          = false

      } else if (que === 'REC' ) {      //RECIBO DE UN SOLO COMPROBANTE

        //this.medpag[6].activo         = false
        this.formTitle                 = 'Cobro del Comprobante '+item.cpr+' - ('+item.tercero.nombre+')'
        this.reciboDeUnSoloComprobante = true
        this.searchTerceros            = ''
        this.dialog                    = false
        this.dialogRem                 = false
        this.dialogRec                 = true
        this.dialogNdcFac              = false
        this.esFiscal                  = false;
        this.coef                      = 1;
        this.esUnPagoDeUnaFactura      = false

        this.afipSuc                   = this.sucursalFiscal;
        this.isLoadingTercerosRec      = true   // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
        this.basadoEnCpr               = true;  // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
        this.basadoEnOtroCpr.push(item.id)

        this.editadoCpr                = this.editado.cpr
        this.editadoNombre             = item.tercero.nombre
        this.editado.id                = ''
        this.editado.fecha             = moment().format('YYYY-MM-DD')
        this.editado.perfiscal         = moment().format('YYYY-MM');
        this.editado.cpr               = 'REC-R '+this.sucursalFiscal+'-00000000'
        this.editado.tipo              = 'RC'
        this.editado.user_id           = this.userId
        this.editado.sucursal_id       = this.sucursal
        this.editado.tercero_id        = item.tercero_id                           // ver
        this.editado.comprobante_id    = 127
        this.editado.documento_id      = item.documento_id
        this.editado.documentoCodigo   = item.tercero.documento.codigo
        this.editado.nombre            = item.tercero.nombre
        this.editado.documentoNumero   = item.tercero.cuit
        this.editado.mediodepago_id    = null
        this.editado.lista_id          = null
        this.editado.deposito_id       = null
        this.editado.vendedor_id       = item.vendedor_id
        this.editado.moneda_id         = item.moneda_id
        this.editado.direccion_id      = item.direccion_id
        this.editado.tasadescuento     = 0
        this.editado.importedescuento  = 0
        this.editado.retiva            = 0
        this.editado.retgan            = 0
        this.editado.retib             = 0
        this.editado.gravado           = 0
        this.editado.exento            = 0
        this.editado.iva               = 0
        this.editado.total             = item.pendientes[0].pendiente
        this.editado.rentabilidad      = 0
        this.editado.regstk            = 0
        this.editado.estado            = 'F'
        this.editado.carga             = 'M'
        this.editado.cae               = null
        this.editado.cae_vencimiento   = null
        this.editado.cae_codbar        = null
        this.editado.observaciones     = 'COBRO'
        this.editado.activo            = true
        this.editado.items             = []
        this.medpag[1].activo          = false

        // TOTALES DEL PAGO
        this.totCancelado  = item.pendientes[0].pendiente
        this.totValores    = item.pendientes[0].pendiente
        this.valDiferencia = 0

        this.pend     = []
        this.valores  = []
        this.cueItems = []
        this.cueNewIems = []

        this.pend.push({
          id:          item.pendientes[0].id,
          cpr:         item.cpr,
          vencimiento: moment(item.pendientes[0].vencimiento).format('YYYY-MM-DD'),
          importe:     item.pendientes[0].importe,
          pendiente:   item.pendientes[0].pendiente,
          acancelar:   item.pendientes[0].pendiente,
          acciones:    ''
        })

        this.cargoValorInicialEnValores(this.caja, item.id, item.pendientes[0].pendiente, 1)
        this.medpag[0].total = item.pendientes[0].pendiente

        this.notificaEnBaseAOtro = [{
          user_id_desde: this.userId,
          user_id_hasta: item.tercero_id,
          cpr: item.cpr,     // Esto es para que en la API busque el PEDIDO original del cliente y lo marque como finalizado
          comprobante_id: 0, // En la API debe grabar el venta.id del nuevo comprobante 
          tipo: 'F',
          detalles: 'Pago de Factura',
          estado: 'P'
        }]
        // Como es EnBaseAOtro, debo marcar el comprobnate padre indicando que ya esta procesado
        this.notificaOriginal = [{
          comprobante_id: item.id,
          estado: 'F'
        }]

        // AL SER UN COBRO NO NECESITO CARGAR CUENTA ALGUNA
        // NI CHEQUES DE TERCEROS, EN TODO CASO SE INGRESAN
        // LO QUE SI, SE CARGARAN CHEQUES, Y EN ESE MOMENTO
        // TAMBIEN LOS LIBRADORES DE LOS MISMOS.

      } else if (que === 'ndcfac') {

        this.formTitle = 'Aplicar Nota de Crédito a Factura'+item.cpr+' - ('+item.tercero.nombre+')'
        this.dialogNdcxDev = false
        this.articulos = []
        this.searchTerceros = ''
        this.dialog = false
        this.dialogRem = false
        this.dialogNddFac = false
        this.dialogNdcFac = true
        this.isLoadingTerceros = true // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
        this.basadoEnCpr = true;      // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
        this.basadoEnOtroCpr.push(item.id)

        this.editado.tercero_id = item.tercero_id
        this.editado.nombre = item.tercero.nombre
        this.editado.responsableAbrev = item.tercero.responsable.abrev
        this.editado.documento = item.tercero.documento.nombre
        this.editado.documento_id = item.documento_id
        this.editado.documentoCodigo  = item.tercero.documento.codigo
        this.editado.deposito_id = item.deposito_id
        this.remitoItems = item.items.length
        this.articulos = item.items
        
        let posiva = 0
        for (let i=0; i<=this.articulos.length-1; i++) {
          this.articulos[i].adevolver = this.articulos[i].cantidad
        }

        this.editado.direccion_id = item.direccion_id
        this.editado.cpr = item.cpr
        this.editado.total = item.total
        this.editado.rentabilidad = this.rentabilidad
        this.editado.documentoNumero = item.tercero.cuit
        this.editado.moneda_id = item.moneda_id
        this.editado.observaciones = 'NDC'
        let rid = item.tercero.responsable.id

        this.cfUser = this.responsable
        //this.cfUser = Number(item.tercero.responsable.codigo)

        this.ndcTasaDescuento = 0
        this.ndcTotal = 0
        this.electronica = !this.sucursalDemo

      } else if (que === 'nddfac') {

        this.formTitle = 'Aplicar Nota de Debito a Factura'+item.cpr+' - ('+item.tercero.nombre+')'
        //this.dialogNddxDev = false
        this.articulos = []
        this.searchTerceros = ''
        this.dialog = false
        this.dialogRem = false
        this.dialogNdcFac = false
        this.dialogNddFac = true
        this.isLoadingTerceros = true // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
        this.basadoEnCpr = true;      // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
        this.basadoEnOtroCpr.push(item.id)

        this.editado.tercero_id = item.tercero_id
        this.editado.nombre = item.tercero.nombre
        this.editado.responsableAbrev = item.tercero.responsable.abrev
        this.editado.documento = item.tercero.documento.nombre
        this.editado.documento_id = item.documento_id
        this.editado.documentoCodigo  = item.tercero.documento.codigo
        this.editado.deposito_id = item.deposito_id
        this.remitoItems = item.items.length
        this.articulos = []

        this.editado.direccion_id = item.direccion_id
        this.editado.cpr = item.cpr
        this.editado.total = item.total
        this.editado.rentabilidad = this.rentabilidad
        this.editado.documentoNumero = item.tercero.cuit
        this.editado.moneda_id = item.moneda_id
        this.editado.observaciones = 'NDD'
        let rid = item.tercero.responsable.id

        this.cfUser = this.responsable
        //this.cfUser = Number(item.tercero.responsable.codigo)

        this.nddTasaDescuento = 0
        this.nddTotal = 0
        this.electronica = !this.sucursalDemo

      } else if (que === 'facndc') {

        this.formTitle = 'Aplicar Factura a Nota de Crédito'   // ????
        this.electronica = !this.sucursalDemo

      } else if (que.cpr.substring(0,3)=='PED') {

        return HTTP().get(`/estaenusertercero/${que.tercero_id}`)
          .then(({ data }) =>{

            debugger
            if (!data) {
              this.msg.msgTitle = 'Cuenta sin asignar!'
              let msg = 'Esta cuenta existe pero aún no la tiene asignada!<br>'
              msg += 'Puede realizar esta asignacion desde el modulo clientes<br>'
              msg += 'en la opción INCLUSION DE CLIENTES<br>'
              this.msg.msgBody = msg
              this.msg.msgVisible = true
              this.msg.msgAccion = 'Cuenta aun no incorporada'
              this.msg.msgButtons = ['Aceptar']
              this.cuentaYaAsignada = true
              this.dialog = false
              return

            } else {

              debugger
              return HTTP().get('/tercero/'+que.tercero_id)
                .then(({data}) => {

                  debugger
                  if (data[0].vendedor!=undefined) {
                    this.editado.vendedor = data[0].vendedor
                  }
                  // TENGO QE VER SI EL CLIENTE TIENE O NO CUENTA CORRIENTE
                  // SI TIENE, LA SUGUIERO COMO PRIORIDAD
                  this.electronica = !this.sucursalDemo
                  this.formTitle = this.sucursalDemo ? 'Presupuestar' : 'Facturar'
                  this.formTitle += ' el Pedido '+que.cpr+' - ('+que.tercero.nombre+')'
                  this.searchTerceros = ''
                  this.isLoadingTerceros = true // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
                  this.basadoEnCpr = true;   // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
                  this.editado.tercero_id = que.tercero_id;
                  this.editado.nombre = que.tercero.nombre;
                  this.editado.responsableAbrev = que.tercero.responsable.abrev
                  this.editado.documento = que.tercero.documento.nombre
                  this.editado.documento_id = que.documento_id
                  this.editado.documentoCodigo  = que.tercero.documento.codigo
                  this.editado.mediodepago_id = que.mediodepago_id
                  this.editado.documentoNumero = que.tercero.cuit
                  this.editado.moneda_id = que.moneda_id
                  let rid = que.tercero.responsable.id
                  //this.cfUser = Number(que.tercero.responsable.codigo)
                  this.cfUser = this.responsable
                  this.ctacte = false
                  if (que.tercero.usersterceros.length>0) {
                    this.ctacte = que.tercero.usersterceros[0].ctacte
                    this.diasvenc = que.tercero.usersterceros[0].diasvenc
                    this.bonificacionmaxima = que.tercero.usersterceros[0].bonificacionmaxima
                    this.creditomaximo = que.tercero.usersterceros[0].creditomaximo
                  }
                  this.editado.cpr = this.sucursalDemo ? 'PRE' : 'FAC';
                  if (this.cfUser===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO
                    if(rid===1 || rid===2 || rid===9 || rid===11) {
                      this.editado.letra = 'A'
                    } else {
                      this.editado.letra = 'B'
                    }
                  } else if (this.cfUser===6) { //EL USUARIO ES MONOTRIBUTISTA
                      this.editado.letra = 'C'
                  }
                  this.dirItems.push(que.tercero.direcciones[0])
                  this.editado.direccion_id = this.dirItems[0].id
                  this.editado.deposito_id = this.depItems[0].id
                  this.editado.texto = this.sucursalDemo ? 'PREPED' : 'FACPED'
                  this.editado.comprobante_id = 126
                  this.editado.vendedor_id = que.vendedor_id
                  this.editado.observaciones = que.observaciones
                  //Cargo los articulos en un array y los mando a la API para que se actualicen los costos.
                  //El pedido viene con el costo del quien lo hizo.
                  let arts = []
                  for (let i=0; i<=que.items.length-1; i++) {
                    arts.push(que.items[i].articulo_id)
                  }

                  debugger
                  return HTTP().post('/actualizocostosdelpedidoparafacturar', { arts: arts })
                    .then(({ data }) => {

                      //Cargo los articulos del pepdido, pero primero tengo que ver si ya fueron cargados anteriormente y quedo saldo (estado = 'L')
                      //En ese caso tengo que buscar en vinuculados para sacar la diferencia
                      // busco comprobantes que imputaron a este pedido.

                      debugger
                      this.articulos = [];
                      for (let i=0; i<=que.items.length-1; i++) {
                        if (que.items[i].cantidad!=0) {
                          let pos = data.findIndex(x => x.articulo_id === que.items[i].articulo_id)
                          if (pos!=-1) {
                            que.items[i].costo = data[pos].costo
                          }
                          this.articulos.push({ 
                            articulo_id:      que.items[i].articulo_id,
                            codigo:           que.items[i].articulo.codigo,
                            nombre:           que.items[i].articulo.nombre,
                            deposito_id:      this.editado.deposito_id,
                            unidad_id:        que.items[i].articulo.unidad_id,
                            moneda_id:        que.items[i].articulo.moneda_id,
                            iva_id:           que.items[i].articulo.iva_id,
                            cantidad:         Number(que.items[i].cantidad),
                            cantidadoriginal: Number(que.items[i].cantidad),
                            stock:            Number(que.items[i].cantidad),
                            undstock:         Number(que.items[i].cantidad),
                            costo:            que.items[i].costo,
                            precio:           que.items[i].precio,
                            preciooriginal:   que.items[i].precio,
                            tasadescuento:    que.items[i].tasadescuento,
                            importedescuento: que.items[i].importedescuento,
                            total:            que.items[i].total,
                            texto:            que.items[i].texto,
                            vencimiento:      que.items[i].vencimiento,
                            adevolver:        0,
                            padre_id:         null,
                            undenvase:        que.items[i].articulo.undenvase,
                            escombo:          que.items[i].articulo.escombo,
                          })
                        }
                      }

                      debugger
                      return HTTP().get('/buscocomprobantesvinculados/'+que.id ) 
                        .then(({ data }) => {

                          debugger
                          let disp = []
                          if (data.length>0) {
                            for (let i=0; i<=data.length-1; i++) {
                              for (let j=0; j<=this.articulos.length-1; j++) {
                                if (data[i].articulo_id===this.articulos[j].articulo_id) {
                                  this.articulos[j].cantidad+=data[i].stock
                                  this.articulos[j].cantidadoriginal+=data[i].stock
                                  this.articulos[j].total = this.articulos[j].precio*this.articulos[j].cantidad
                                }
                              }
                            }
                            for (let j=0; j<=this.articulos.length-1; j++) {
                              if (this.articulos[j].cantidad == 0) {
                                this.articulos.splice(j, 1)
                                break
                              }
                            }
                          }
                          // Como es EnBaseAOtro, dejo listo el array para luego notificarlo
                          debugger
                          this.notificaEnBaseAOtro = [{
                            user_id_desde: this.userId,
                            user_id_hasta: que.tercero_id,
                            cpr: que.cpr,       // Esto es para que en la API busque el PEDIDO original del cliente y lo marque como finalizado 
                            comprobante_id: 0,  // En la API debe grabar el venta.id del nuevo comprobante 
                            tipo: 'F',
                            detalles: 'Pedido Facturado',
                            estado: 'P'
                          }]
                          // Como es EnBaseAOtro, debo marcar el comprobnate padre indicando que ya esta procesado
                          this.notificaOriginal = [{
                            comprobante_id: que.id,
                            estado: 'F'
                          }]
                          this.cargoSaldosYValoresPendientes(que.tercero_id)
                          if (this.ctacte) {
                            this.medpag[3].activo = true
                            this.medpag[3].total = this.editado.total
                          }
                      })
                  })
              })
            }
        })
      }
    },





    seleccionarEmbalaje(item) {
      item.seleccionado = !item.seleccionado
      this.embalajesSel = 0
      for (let i=0; i<=this.aEmbalar.length-1; i++) {
        if (this.aEmbalar[i].seleccionado) {
          this.embalajesSel ++
        }
      }
    },





    embalajes() {
      if (this.grpEmbalaje=='Sin agrupar') {
        this.headersEmbalajes = [
          { text: 'PEDIDO', value:'cpr', align: 'left', width: 155},
          { text: 'CLIENTE', value:'nomcli', align: 'left', width: 210},
          { text: 'CODIGO', value:'codigo', align: 'left', width: 90},
          { text: 'DESCRIPCION', value:'nomart', align: 'left', width: 360},
          { text: 'CTT', value:'cantidad', align: 'end', width: 90},
          { text: 'ZONA', value:'zona', align: 'left', width: 160},
          { text: 'SEL.', value: 'accion', align: 'left', width: 50, sortable: false },
        ]
      } else if (this.grpEmbalaje=='Artículos') {
        this.headersEmbalajes = [
          { text: 'CODIGO', value:'codigo'},
          { text: 'DESCRIPCION', value:'nomart'},
          { text: 'CTT', value:'cantidad', align: 'end'}
        ]
      } else if (this.grpEmbalaje=='Artículos y Zonas') {
        this.headersEmbalajes = [
          { text: 'CODIGO', value:'codigo'},
          { text: 'DESCRIPCION', value:'nomart'},
          { text: 'ZONA', value:'zona'},
          { text: 'CTT', value:'cantidad', align: 'end'}
        ]
      }
      this.dialogEmbalajes = true
      this.aEmbalar = []
      return HTTP().post('/leerembalajes', 
        { suc: this.sucursal,
          grp: this.grpEmbalaje,
        })
        .then(({ data }) => {
          if (data.length>0) {
            if (this.grpEmbalaje=='Sin agrupar') {
              let cpr1 = ''
              let cpr2 = ''
              for (let i=0; i<= data.length-1; i++) {
                cpr1 = data[i].cpr+data[i].nombre
                if (cpr1!=cpr2) {
                  this.aEmbalar.push({
                    cpr_id: data[i].cprid,
                    cpr: data[i].cpr,
                    cliente_id: data[i].tercero_id,
                    nomcli: data[i].nombre,
                    articulo_id: data[i].artid,
                    codigo: data[i].codigo,
                    nomart: data[i].descripcion,
                    cantidad: data[i].cantidad,
                    zona: data[i].Znombre,
                    seleccionado: false
                  })
                } else {
                  this.aEmbalar.push({
                    cpr_id: null,
                    cpr: null,
                    cliente_id: null,
                    nomcli: null,
                    articulo_id: data[i].artid,
                    codigo: data[i].codigo,
                    nomart: data[i].descripcion,
                    cantidad: data[i].cantidad,
                    zona: data[i].Znombre,
                    seleccionado: false
                  })
                }
                cpr2 = data[i].cpr+data[i].nombre
              }
            } else if (this.grpEmbalaje=='Artículos') {
              for (let i=0; i<= data.length-1; i++) {
                this.aEmbalar.push({
                  articulo_id: data[i].artid,
                  codigo: data[i].codigo,
                  nomart: data[i].descripcion,
                  cantidad: data[i].cantidad
                })
              }
            } else if (this.grpEmbalaje=='Artículos y Zonas') {
              for (let i=0; i<= data.length-1; i++) {
                this.aEmbalar.push({
                  articulo_id: data[i].artid,
                  codigo: data[i].codigo,
                  zona: data[i].Znombre,
                  nomart: data[i].descripcion,
                  cantidad: data[i].cantidad
                })
              }
            }
          }
        }).catch(function (error) {
          console.log(error);
        })
    },





    prepararEnvioRetiro(item, cual) {
      this.dialogEnvios = false
      this.dialogRetiro = false
      if (cual=='E') {
        this.dialogEnvios = true
      } else {
        this.dialogRetiro = true
      }
      return HTTP().get('/tercero/'+item.tercero.id)
        .then(({ data }) => {
        this.dirItems = []
        for (let i=0; i<= data[0].tercero.direcciones.length-1; i++) {
          this.dirItems.push(data[0].tercero.direcciones[i])
        }
        if (this.dirItems.length>0) {
          this.envio.direccion_id = this.dirItems[0].id
        }
        return HTTP().get('/comprobantesrastrear/'+item.id+'/updown')
          .then(({ data }) => {
            let ras = []
            ras.push(data[0])
            for (let i=1; i<=data.length-1; i++) {
              for (let j=0; j<=data[i].length-1; j++) {
                if (this.isArray(data[i][j])==false) {
                  ras.push(data[i][j])
                } else {
                  for (let k=0; k<=data[i][j].length-1; k++) {
                    if (this.isArray(data[i][j][k])==false) {
                      ras.push(data[i][j][k])
                    } else {
                      for (let l=0; l<=data[i][j][k].length-1; l++) {
                        ras.push(data[i][j][k][l])
                      }
                    }
                  }
                }
              }
            }
            if (cual=='E') {
              this.envio.tipodeenvio = 'P'
              this.envio.transporte_id = null
              this.envio.puntoderetiro_id = null
              this.envio.puntoderetirodireccion_id = null
              this.envio.llegada = moment().format('YYYY-MM-DD')
              this.envio.generaremito = false
              this.envio.remitogenerado = false
              this.envio.remito_id = null
              this.envio.remito_numero = null
              this.envio.remito_msg = 'Genera Remito'
              this.envio.importeflete = 0
              this.envio.bultos = this.itemActual.items.length
              this.envio.traking = null
              this.envio.quienretira = this.itemActual.tercero.nombre
              this.envio.documento = this.itemActual.tercero.cuit
              for (let i=0; i<=ras.length-1; i++) {
                if (ras[i].cpr2.substr(0,3)=='REM') {
                  this.envio.remito_id = ras[i].id
                  this.envio.remitogenerado = true
                  this.envio.remito_msg = 'Remito ya generado'
                  this.envio.remito_numero = ras[i].cpr2
                  break
                }
              }
              if (this.envio.remito_id!=null) {
                this.envio.generaremito = true
              }
          } else if (cual=='R') {
            this.retiro.tipodeenvio = 'R'
            this.retiro.quienretira = this.itemActual.tercero.nombre
            this.retiro.documento = this.itemActual.tercero.cuit
            this.retiro.generaremito = false
            this.retiro.remitogenerado = false
            this.retiro.remito_id = ''
            this.retiro.remito_numero = ''
            this.retiro.remito_msg = 'Genera Remito'
            this.retiro.bultos = this.itemActual.items.length
            for (let i=0; i<=ras.length-1; i++) {
              if (ras[i].cpr2.substr(0,3)=='REM') {
                this.retiro.remito_id = ras[i].id
                this.retiro.remitogenerado = true
                this.retiro.remito_msg = 'Remito ya generado'
                this.retiro.remito_numero = ras[i].cpr2
                break
              }
            }
            if (this.retiro.remito_id!=null) {
              this.retiro.generaremito = true
            }
          }
        })
      })
    },





    controlNdc(item) {
      return new Promise(function(fullfill, reject) {
        return HTTP().get('/buscondcvinculadas/'+item.id )
          .then(({ data }) => {
            let disp = []
            if (data.length>0) {
              for (let i=0; i<=data.length-1; i++) {
                disp.push({ articulo_id: data[i].articulo_id, cantidad: data[i].cantidad, total: data[i].total })
              }
            }
            for (let i=0; i<=item.items.length-1; i++) {
              for (let j=0; j<=disp.length-1; j++) {
                if (disp[j].articulo_id == item.items[i].articulo_id) {
                  disp[j].cantidad += item.items[i].cantidad
                }
              }
            }
            // ahora si algun item de disp.cantidad es > 0 puedo hacer ndc.
            let lDone = false
            if (disp.length>0) {
              for (let i=0; i<=disp.length-1; i++) {
                if (disp[i].cantidad > 0) {
                  lDone = true
                }
              }
            } else {
              lDone = true
            }
            fullfill( lDone )
          })
      })
    },





    setComoPaga(cual) {
      let totpag = 0
      for (let i=0; i<= this.medpag.length-1; i++) {
        if (i!=cual) {
          totpag += this.medpag[i].total
        }
      }

      if (this.editado.cpr.substr(0,3)=='FAC' 
        && this.editado.total > Number(this.disponible)
        && this.ctacte
        && this.medpag[3].total==0)
        { this.medpag[0].total = this.editado.total }
      
        this.dialogRec                 = true
        this.reciboDeUnSoloComprobante = true
        this.esUnPagoDeUnaFactura      = true
        this.cargoValorInicialEnValores(this.caja, null, this.editado.total, 1)
        this.cprBalanceado()
    },





    cargoValorInicialEnValores(caja, cpregreso, total, medio) {

      if (this.valores.length==0) {
        let observ   = medio==1 ? 'COBRO EN EFECTIVO' : 'A CUENTA CORRIENTE'
        let medioNom = medio==1 ? 'Efectivo'          : 'Cuenta Corriente'
        this.valores.push({
          caja_id:           caja,
          medio_id:          medio,
          cuentaorigen_id:   null,
          cuentadestino_id:  null,
          cuentacheque_id:   null,
          cuentatarjeta_id:  null,
          banco_id:          null,
          tarjeta_id:        null,
          cpringreso_id:     null,
          cpregreso_id:      cpregreso,
          librador_id:       null,
          librador_medio_id: null,
          cheque_id:         null,
          fechafinanciera:   null,
          fechasalida:       null,
          importe:           total,
          nrovalor:          null,
          tipo:              'I',
          observ:            observ,
          medioNombre:       medioNom,
          cuenta:            null,
          cuit:              null,
          nombre:            null,
        })
      }
    },





    facturarAnotaciones() {
      this.msg.msgTitle   = 'Facturar Anotaciones de Ventas'
      this.msg.msgBody    = 'Confirma la Factura?'
      this.msg.msgVisible = true
      this.msg.msgAccion  = 'facturar anotaciones de ventas'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },





    listarHTTP(refrescoMeses){

      if (refrescoMeses) {
        let aa = moment().format('YYYY')
        let mm = moment().format('MMM')
        let pos1 = this.anios.findIndex(x => x === aa);
        let pos2 = this.meses.findIndex(x => x === mm);
        if (pos1==-1 || pos2==-1) {
          this.leoAnios()
        }
      }

      let perfiscal = ''
      let p = this.losMeses.indexOf(this.elMes)
      p ++
      p = p.toString().padStart(2,'0').substring(-2)
      perfiscal = this.anio+p
      if (this.elMes==undefined || this.elMes=='') return

      this.progress = true
      let s = this.search.length>0 ? this.search : 'all'

      return HTTP().post('/'+this.modelo, {
        suc: this.sucursal,
        cpr: this.filtroComprobante,
        ope: this.operarioTerceroId,
        perfiscal: perfiscal,
        search: s })
        .then(({ data }) => {

          for (let i=0; i<=this.comprobantes.length-1; i++) {
            this.comprobantes[i].total = 0
            this.comprobantes[i].ctt = 0
          }

          this.filtrosEstados = []
//        this.filtrosEstados = [{tip:'Todos', ctt: data.venta.length}]
          for (let i=0; i<=data.venta.length-1; i++) {
            let a = this.getEstado(data.venta[i].estado,'e',data.venta[i].pendientes[0],data.venta[i].carga, data.venta[i])
            let b = ''
            if (a=='Finalizado') {
              b = 'Finalizados'
            } else if (a.substring(0,7)=='Vencido') {
              b = 'Vencidos'
            } else if (a.substring(0,8)=='A Vencer') {
              b = 'A Vencer'
            } else if (a=='Vence Hoy') {
              b = 'Vencen Hoy'
            } else if (a=='Facturado') {
              b = 'Facturados'
            } else if (a=='Anulado') {
              b = 'Anulados'
            } else if (a=='p/Procesar') {
              b = 'p/Procesar'
            } else if (a=='En Embalaje') {
              b = 'En Embalaje'
            } else if (a=='Embalado') {
              b = 'Enbalados'
            } else if (a=='Enviado') {
              b = 'Enviados'
            } else if (a=='Retirado') {
              b = 'Retirados'
            } else if ('Pendiente') {
              b = 'Parciales'
            }
            let p = this.filtrosEstados.findIndex(x => x.tip === b);
            if (p==-1) {
              this.filtrosEstados.push({tip: b, ctt: 1})
            } else {
              this.filtrosEstados[p].ctt ++
            }
            data.venta[i].filtroEstado = b
          }
          if (this.filtrosEstados.length>1) {
            this.filtrosEstados.unshift({tip: 'Todos', ctt: data.venta.length})
          }
          if (this.filtrosEstados.length>0)
            this.filtroEstadoSel = this.filtrosEstados[0].tip

          this.itemsAll = data.venta
          this.items = data.venta

          for (let i=0; i<=data.sqlret.length-1; i++) {

            if (data.sqlret[i].id==1 || data.sqlret[i].id==6 || data.sqlret[i].id == 14) {
              this.comprobantes[0].total += data.sqlret[i].total
              this.comprobantes[0].ctt   += data.sqlret[i].ctt
            } else if (data.sqlret[i].id==2 || data.sqlret[i].id==7 || data.sqlret[i].id == 15) {
              this.comprobantes[1].total += data.sqlret[i].total
              this.comprobantes[1].ctt   += data.sqlret[i].ctt
            } else if (data.sqlret[i].id==3 || data.sqlret[i].id==8 || data.sqlret[i].id == 16) {
              this.comprobantes[2].total += data.sqlret[i].total
              this.comprobantes[2].ctt   += data.sqlret[i].ctt
            } else if (data.sqlret[i].id==4 || data.sqlret[i].id==9 || data.sqlret[i].id == 17) {
              this.comprobantes[6].total += data.sqlret[i].total
              this.comprobantes[6].ctt   += data.sqlret[i].ctt
            } else if (data.sqlret[i].id==124) {
              this.comprobantes[3].total += data.sqlret[i].total
              this.comprobantes[3].ctt   += data.sqlret[i].ctt
            } else if (data.sqlret[i].id==125) {
              this.comprobantes[4].total += data.sqlret[i].total
              this.comprobantes[4].ctt   += data.sqlret[i].ctt
            } else if (data.sqlret[i].id==126) {
              this.comprobantes[5].total += data.sqlret[i].total
              this.comprobantes[5].ctt   += data.sqlret[i].ctt
            }
          }

          this.progress = false

        }).catch(function (error) {
          console.log(error);
          //this.progress = false
        })
    },





    setAnio(anio) {
      if (anio) {
        this.anio = anio
      } else {
        this.anio = moment().format('YYYY')
      }
      this.meses = []
      for (let i=0; i<=this.periodos.length-1; i++) {
        if (this.periodos[i].substring(0,4)==this.anio) {
          let pos = Number(this.periodos[i].substring(4))-1
          this.meses.push(this.losMeses[pos])
        }
      }
      this.elMes = this.meses[0]
      this.elAnio = this.anio
      this.filtroEstadoSel = 'Todos'
      this.listarHTTP(false)
    },





    setMes(mes) {
      this.elMes = mes
      this.listarHTTP(false)
      this.filtroEstadoSel = 'Todos'
    },





    setFiltroEstado(fe) {
      debugger
      if (fe.tip=='Todos') {
        this.items = this.itemsAll
      } else {
        this.items = this.itemsAll.filter(x=>x.filtroEstado==fe.tip)
      }

      let pos = this.comprobantes.findIndex(x => x.nombre == this.filtroComprobanteSel)
      this.comprobantes[pos].total = 0
      this.comprobantes[pos].ctt = 0

      pos = 0
      for (let i=0; i<=this.items.length-1; i++) {
        let c = this.items[i].comprobante_id
        if (c==1 || c==6 || c == 14) { pos = 0 }
        else if (c==2 || c==7 || c == 15) { pos = 1 }
        else if (c==3 || c==8 || c == 16) { pos = 2 }
        else if (c==4 || c==9 || c == 17) { pos = 6 }
        else if (c==124) { pos = 3 }
        else if (c==125) { pos = 4 }
        else if (c==126) { pos = 5 }
        this.comprobantes[pos].total += this.items[i].total
        this.comprobantes[pos].ctt ++
      }

      this.filtroEstadoSel = fe.tip
    },





    leoAnios() {

      return HTTP().post('anios/', {tipo: 'V'})
        .then(({ data }) => {

          this.anios = []
          this.meses = []
          this.periodos = []
          let pos = -1

          // UN CASO ESPECIAL: SI ES VENDEDOR PUEDE ESTAR HACIENDO PEDIDOS POR CUENTA DE SUS CLIENTES
          // PERO SI CAMBIO EL MES Y EL CLIENTE NO HIZO MOVIMIENTOS AUN, NO TENDRA ACTUALIZADO EL PERIDODO
          // POR LO TANTO LO TENGO QUE AGREGAR A MANO.
          if (this.operarioVendedor) {
            // PRIMERO CALCULO EL AÑO Y MES ACUAL
            let aniomes = moment().format('YYYYMM')
            if (data[0][0].perfiscal != aniomes) {
              this.anios.push(aniomes.substr(0,4))
              pos = Number(aniomes.substr(5,2))-1
              this.meses.push(this.losMeses[pos])
            }
          }
          for (let i=0; i<=data[0].length-1; i++) {
            this.periodos.push(data[0][i].perfiscal)
            pos = this.anios.findIndex( x => x == data[0][i].perfiscal.substring(0,4))
            if (pos==-1) {
              this.anios.push(data[0][i].perfiscal.substring(0,4))
            }
          }
          for (let i=0; i<=this.periodos.length-1; i++) {
            if (this.periodos[i].substring(0,4)==this.anios[0]) {
              pos = Number(data[0][i].perfiscal.substring(4))-1
              this.meses.push(this.losMeses[pos])
            }
          }

          this.anio = this.anios[0]
          this.elAnio = this.anio
          let mesActual = moment().format('MMM').substring(0,3)
          pos = this.meses.findIndex(x => x.toUpperCase() === mesActual.toUpperCase())
          if (pos==-1) {
            // porque aun no hay movimientos en el mes actual, busco en el anterior
            if (this.meses.length>0) {
              this.elMes = this.meses[this.meses.length-1]
            } else {
              this.elMes = ''
            }
          } else {
            this.elMes = this.meses[pos]
          }
        })

    },





    listarAnotaciones() {
      return HTTP().get('/anotadordeventas/'+this.sucursal)
        .then(({ data }) => {
          this.anotadorId = data
          return HTTP().get('/ventasitems/'+this.anotadorId)
            .then(({data})=> {
              this.articulos = []
              this.anotadorTotal = 0
              this.rentabilidad = 0
              let posiva = 0
              for (let i=0; i<=data.length-1; i++) {
                this.articulos.push({ 
                  articulo_id:      data[i].articulo_id,
                  codigo:           data[i].articulo.codigo,
                  nombre:           data[i].articulo.nombre,
                  deposito_id:      data[i].deposito_id,
                  unidad_id:        data[i].articulo.unidad_id,
                  moneda_id:        data[i].articulo.moneda_id,
                  iva_id:           data[i].articulo.iva_id,
                  cantidad:         Number(data[i].cantidad),
                  cantidadoriginal: Number(data[i].cantidad),
                  stock:            Number(data[i].cantidad),
                  undstock:         Number(data[i].cantidad),
                  costo:            data[i].costo,
                  precio:           data[i].precio,
                  preciooriginal:   data[i].preciooriginal,
                  tasadescuento:    0,
                  importedescuento: 0,
                  total:            data[i].total,
                  texto:            data[i].texto,
                  vencimiento:      data[i].vencimiento,
                  adevolver:        0,
                  padre_id:         null,
                  undenvase:        data[i].articulo.undenvase,
                  escombo:          data[i].articulo.escombo,
                })
              this.anotadorTotal += data[i].total
              this.rentabilidad += (data[i].preciooriginal-data[i].costo)*data[i].cantidad
              }
              this.anotadorTotal = this.roundTo(this.anotadorTotal,2)
              this.rentabilidad = this.roundTo(this.rentabilidad,2)
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          console.log(err)
        })
    },





    confirmarComprobante() {

      // esta modificando
      if (this.editedIndex!=-1) {

        return HTTP().patch('/updateitems/'+this.items[this.editedIndex].id, { articulos: this.articulos })
          .then(({ data }) => {
            if (data==true) {
              this.mensaje('¡Pedio actualizado!', this.temas.forms_titulo_bg, 1500)
            } else {
              this.mensaje('¡Opps, hubo en error en la modificación del pedido!', this.temas.forms_titulo_bg, 2500)
            }
            this.dialog = false
            this.listarHTTP(false);
        })

      } else {

        if (!this.$refs.form.validate()) {
          this.mensaje('¡Debe completar todos los datos!', this.temas.forms_titulo_bg, 1500) 
          return this.dialog = true;
        }
        for (let i=0; i<=this.articulos.length-1; i++) {
          this.articulos[i].stock = ( this.articulos[i].cantidad*(this.coef*-1) )
        }
        // si hay items en cero los elimino
        for (let j=0; j<=this.articulos.length-1; j++) {
          if (this.articulos.cantidad == 0) {
            this.articulos.splice(i, 1)
            break
          }
        }
        if (this.editado.cpr!=='PRE' || this.sucursalDemo) {
          this.valores = this.valores.filter(function(valor) {
            return valor.medio_id != 4
          })
          if (this.medpag[0].total !== 0 && this.valores.length==0) {  // hay efectivo, puede ser todo
            this.valores = []
            this.valores.push({ 
              caja_id:           this.caja,
              medio_id:          1,
              cuentaorigen_id:   null,
              cuentadestino_id:  null,
              cuentacheque_id:   null,
              cuentatarjeta_id:  null,
              banco_id:          null,
              tarjeta_id:        null,
              cpringreso_id:     null,
              cpregreso_id:      null, //item.id,
              librador_id:       null,
              librador_medio_id: null,
              cheque_id:         null,
              fechafinanciera:   null,
              fechasalida:       null,
              importe:           this.medpag[0].total*this.coef,
              nrovalor:          null,
              tipo:              'I',
              observ:            'COBRO EN EFECTIVO',
              medioNombre:       'Efectivo'
            })
          }
          if (this.medpag[3].total !== 0 && (this.editado.cpr!=='PRE' || this.sucursalDemo) && (this.editado.cpr!='REM')) {
            // Si es ctacte agrego en 'pendientes' para que grabe la cuenta corriente
            this.pendientes.push({ 
              comprobante_id: null,
              vencimiento: moment(new Date).add(this.diasvenc, 'd').format('YYYY-MM-DD'),
              importe: this.medpag[3].total*this.coef,
              pendiente: this.medpag[3].total*this.coef,
              concepto: 'EN CUENTA CORRIENTE'
            })
          }
        }
        this.altaHTTP();
        this.cancelar();
        this.listarHTTP(true)
      }
    },





    altaHTTP (que) {

      this.ivas = []
      this.asociado = []
      let espejo = []
      let novedad = null
      let pf = moment().format('YYYYMM');
      this.coef = 1
      let s = this.sucursalFiscal

      debugger
      this.editado.estado = 'F'
      if (que=='remfac') {

        this.editado.comprobante_id = 125  
        this.editado.cpr = 'REM'
        this.editado.letra = 'R'
        this.editado.observaciones = 'REMITO'

      } else if (this.editado.cpr.substr(0,3)=='PED') {

        this.editado.vendedor_id = this.operarioTerceroId
        this.editado.estado = 'P'

      } else if (this.editado.cpr.substr(0,3)=='REM') {

        this.basadoEnOtroCpr = []
        for (let i=0; i<=this.selected.length-1; i++) {
          this.basadoEnOtroCpr.push(this.selected[i].id)
        }

        // Los remitos no mueven stock
        for (let i=0; i<=this.articulos.length-1; i++) {
          this.articulos[i].stock = 0
        }

      } else if (this.editado.cpr=='PRE') {

        this.editado.comprobante_id = 124
        this.editado.cpr = 'PRE'
        this.editado.estado = this.sucursalDemo ? 'F' : 'P'
        this.editado.observaciones = 'PRESUPUESTO'
        if (!this.sucursalDemo) {
          for (let i=0; i<=this.articulos.length-1; i++) {
            this.articulos[i].stock = 0
          }
        }
        if (this.editado.texto == 'PREPED') {
          this.notificaOriginal[0].estado = 'T'
          for (let i=0; i<=this.articulos.length-1; i++) {
            if (this.articulos[i].cantidad < this.articulos[i].cantidadoriginal) {
              if (this.notificaOriginal.length>0) {
                this.notificaOriginal[0].estado = 'P'
              }
            }
          }
        }

      } else if (this.editado.cpr=='FAC') {

        this.cargoIvas()
        if (this.editado.letra=='A') { this.editado.comprobante_id = 1} 
        else if (this.editado.letra=='B') { this.editado.comprobante_id = 6 } 
        else if (this.editado.letra=='C') { this.editado.comprobante_id = 6 }

        if (this.editado.texto == 'FACPED') {
          novedad = {
            cpr_id: this.itemActual.id,
            novedad: 'Pedido Facturado',
            rel_id: null,
            estado: 'N',
            accion: 'AGREGA',
          }

          let parcial = false
          if (this.notificaOriginal.length>0) {
            for (let i=0; i<=this.articulos.length-1; i++) {
              if (this.articulos[i].cantidad < this.articulos[i].cantidadoriginal) {
                parcial = true
              }
            }
          }
          this.notificaOriginal[0].estado = parcial ? 'P' : 'T'
    
        }
       
      } else if (que=='ndcfac') {

        this.coef = -1
        if (this.itemActual.comprobante_id==1) { this.editado.comprobante_id = 3 } 
        else if (this.itemActual.comprobante_id==6) { this.editado.comprobante_id = 8 } 
        else if (this.itemActual.comprobante_id==14) { this.editado.comprobante_id = 8 }

        //NDC, puede ser por 1-bonif, 2-devol, o 3-anulacion. En todos los casos debe imputar 
        //la cuenta corriente como si fuera un recibo.
        //Tambien se puede dar el caso de una NDC por adelanto de dinero. ( A CUENTA. no imputa )
        //let pend = this.itemActual.pendientes

        this.asociado = [{
          Tipo: this.itemActual.comprobante_id,
          PtoVta: 10,   // VER DE DONDE LO SACAMOS
          Nro: parseInt(this.itemActual.cpr.substr(12,8),10),
          Cuit: parseInt(this.itemActual.tercero.cuit,10)
        }]

        this.editado.cpr = 'NDC'
        this.editado.letra = this.itemActual.cpr.substr(4,1)
        this.editado.observaciones = 'FAC'
        this.editado.sucursal_id = this.itemActual.sucursal_id
        this.editado.direccion_id = this.itemActual.direccion_id
        this.editado.documento_id = this.itemActual.documento_id
        this.editado.documentoCodigo  = this.itemActual.tercero.documento.codigo
        this.editado.mediodepago_id = this.itemActual.mediodepago_id
        this.editado.lista_id = this.itemActual.lista_id
        this.editado.deposito_id = this.itemActual.deposito_id
        this.editado.tercero_id = this.itemActual.tercero_id
        this.editado.moneda_id = this.itemActual.moneda_id

        this.editado.gravado = this.roundTo(this.ndcTotal/1.21,2)
        this.editado.iva = this.roundTo(this.ndcTotal-this.editado.gravado,2)
        this.editado.rentabilidad = this.roundTo(this.ndcTotal*(this.ndcTotal/this.editado.total),2)*-1
        this.editado.total = this.roundTo(this.ndcTotal,2)
        this.rentabilidad = this.editado.rentabilidad
        
        let articulo_id = 0
        let codigo = ''
        let nombre = ''
        if (this.ndcMotivoSel==1) {           // SE GENERA UN CODIGO DE ARTICULO PREDETERMINADO

          articulo_id = 2
          codigo = '2@1'
          nombre = 'NDC POR BONIFICACION'

          this.articulos = []
          this.articulos.push({
            articulo_id:      articulo_id,
            codigo:           codigo,
            nombre:           nombre,
            deposito_id:      null,
            unidad_id:        null,
            moneda_id:        null,
            iva_id:           5,
            cantidad:         1,
            cantidadoriginal: 1,
            stock:            0,
            undstock:         0,
            costo:            this.roundTo(this.ndcTotal/1.21,2),
            precio:           this.roundTo(this.ndcTotal/1.21,2),
            preciooriginal:   this.roundTo(this.ndcTotal/1.21,2),
            tasadescuento:    0,
            importedescuento: 0,
            total:            this.roundTo(this.ndcTotal/1.21,2),
            texto:            '',
            vencimiento:      null,
            adevolver:        0,
            padre_id:         null,
            undenvase:        1,
            escombo:          false,
          })

        } else if (this.ndcMotivoSel==2) {    // VIENE articulos[] YA CARGADO

          articulo_id = 3
          codigo = '3@1'
          nombre = 'NDC POR DEVOLUCION'

        } else if (this.ndcMotivoSel==3) {    // VIENE articulos[] YA CARGADO

          articulo_id = 4
          codigo = '4@1'
          nombre = 'NDC POR ANULACION'

        }

        if (this.itemActual.pendientes.length>0) {
          this.pendientes.push({
            comprobante_id: null,
            vencimiento: this.itemActual.pendientes[0].vencimiento.substr(0,10),
            importe: this.ndcTotal,
            pendiente: 0,
            concepto: 'X '+this.ndcMotivos[this.ndcMotivoSel-1].nombre+'@'+this.itemActual.pendientes[0].id
          })
        }

        // EL ESPEJO SOLO VA CUANDO EL CLIENTE TAMBIEN PERTENECE A GOHU
        if (this.itemActual.tercero.user) {
          espejo.push({
            comprobante_id: this.itemActual.id,
            tercero_id: this.itemActual.tercero_id,
            articulo_id: articulo_id,
            codigo: codigo,
            tipo: 'ndcfac'
          })
        }

        this.dialogNdcFac = false
        this.cargoIvas()

      } else if (que=='nddfac') {

        this.coef = 1
        if (this.itemActual.comprobante_id==1) { this.editado.comprobante_id = 2 } 
        else if (this.itemActual.comprobante_id==6) { this.editado.comprobante_id = 7 } 
        else if (this.itemActual.comprobante_id==14) { this.editado.comprobante_id = 15 }

        //NDD, puede ser por 1-cheque rechazado, 2-mora, o 3-cambio de precio. En todos los casos debe imputar 
        //la cuenta corriente como si fuera una factura.
        
        this.editado.cpr = 'NDD'
        this.editado.letra = this.itemActual.cpr.substr(4,1)
        this.editado.observaciones = 'FAC'
        this.editado.sucursal_id = this.itemActual.sucursal_id
        this.editado.direccion_id = this.itemActual.direccion_id
        this.editado.documento_id = this.itemActual.documento_id
        this.editado.documentoCodigo  = this.itemActual.tercero.documento.codigo
        this.editado.mediodepago_id = this.itemActual.mediodepago_id
        this.editado.lista_id = this.itemActual.lista_id
        this.editado.deposito_id = this.itemActual.deposito_id
        this.editado.tercero_id = this.itemActual.tercero_id
        this.editado.moneda_id = this.itemActual.moneda_id

        this.editado.gravado = this.roundTo(this.nddTotal/1.21,2)
        this.editado.iva = this.roundTo(this.nddTotal-this.editado.gravado,2)
        this.editado.total = this.roundTo(this.nddTotal,2)
        this.editado.rentabilidad = 0

        this.asociado = [{
          Tipo: this.itemActual.comprobante_id,
          PtoVta: 10,   // VER DE DONDE LO SACAMOS
          Nro: parseInt(this.itemActual.cpr.substr(12,8),10),
          Cuit: parseInt(this.itemActual.tercero.cuit,10)
        }]
        
        let articulo_id = 0
        let codigo = ''
        let nombre = ''
        if (this.nddMotivoSel==1) {           // SE GENERA UN CODIGO DE ARTICULO PREDETERMINADO
          articulo_id = 7
          codigo = '6@1'
          nombre = 'NDD POR CHEQUE RECHAZADO'

          this.articulos = []
          this.articulos.push({
            articulo_id:      articulo_id,
            codigo:           codigo,
            nombre:           nombre,
            deposito_id:      null,
            unidad_id:        null,
            moneda_id:        null,
            iva_id:           3,
            cantidad:         1,
            cantidadoriginal: 1,
            stock:            0,
            undstock:         0,
            costo:            this.roundTo(this.nddTotal,2),
            precio:           this.roundTo(this.nddTotal,2),
            preciooriginal:   this.roundTo(this.nddTotal,2),
            tasadescuento:    0,
            importedescuento: 0,
            total:            this.roundTo(this.nddTotal,2),
            texto:            '',
            vencimiento:      null,
            adevolver:        0,
            padre_id:         null,
            undenvase:        1,
            escombo:          false,
          })

        } else if (this.nddMotivoSel==2) {    // VIENE articulos[] YA CARGADO
          articulo_id = 6
          codigo = '12@1'
          nombre = 'NDD POR MORA'
        } else if (this.nddMotivoSel==3) {    // VIENE articulos[] YA CARGADO
          articulo_id = 5
          codigo = '5@1'
          nombre = 'NDD POR CAMBIO DE PRECIO'
        }

        if (this.itemActual.cpr.substring(0,3)=='REC') {  // NDD EN RECIBO
          if (this.itemActual.cancelaciones.length>0) {
            this.pendientes.push({
              comprobante_id: null,
              vencimiento: this.itemActual.cancelaciones[0].cancelado.vencimiento.substr(0,10),
              importe: this.nddTotal,
              pendiente: this.nddTotal,
              concepto: 'X '+this.nddMotivos[this.nddMotivoSel-1].nombre+'@'+this.itemActual.cancelaciones[0].id
            })
          }

          this.editado.gravado = 0
          this.editado.exento = this.editado.total
          this.editado.iva = 0

        } else {
          if (this.itemActual.pendientes.length>0) {  // NDD EN FACTURA
            this.pendientes.push({
              comprobante_id: null,
              vencimiento: this.itemActual.pendientes[0].vencimiento.substr(0,10),
              importe: this.nddTotal,
              pendiente: this.nddTotal,
              concepto: 'X '+this.nddMotivos[this.nddMotivoSel-1].nombre+'@'+this.itemActual.pendientes[0].id
            })
          }
        }

        // EL ESPEJO SOLO VA CUANDO EL CLIENTE TAMBIEN PERTENECE A GOHU
        if (this.itemActual.tercero.user) {
          espejo.push({
            comprobante_id: this.itemActual.id,
            tercero_id: this.itemActual.tercero_id,
            articulo_id: articulo_id,
            codigo: codigo,
            tipo: 'nddfac'
          })
        }

        this.dialogNddFac = false
        this.cargoIvas()

      } else if (que=='anotaciones') {

        if (this.$store.state.datosEmpresa.responsable_id==1) {
          this.editado.comprobante_id = 6                 
        } else if (this.$store.state.datosEmpresa.responsable_id==6) {
          this.editado.comprobante_id = 14
        }
        this.editado.sucursal_id = this.sucursal
        this.editado.cpr = 'FAC'
        this.editado.letra = 'B'
        this.editado.tercero_id = 2
        this.editado.documento_id = 25
        this.editado.documentoCodigo  = 80
        this.editado.deposito_id = this.depItems[0].id              // HEV
        this.editado.moneda_id = 51
        this.editado.observaciones = 'ANOTADOR REMITO'
        this.editado.regstk = 1
        this.editado.mediodepago_id = 1
        this.editado.direccion_id = null

        this.notificaEnBaseAOtro = []
        this.notificaOriginal = []
        this.basadoEnOtroCpr = []
        this.valores = []
        this.valores.push({ 
          caja_id:           this.caja,
          medio_id:          1,
          cuentaorigen_id:   null,
          cuentadestino_id:  null,
          cuentacheque_id:   null,
          cuentatarjeta_id:  null,
          banco_id:          null,
          tarjeta_id:        null,
          cpringreso_id:     null,
          cpregreso_id:      null, //item.id,
          librador_id:       null,
          librador_medio_id: null,
          cheque_id:         null,
          fechafinanciera:   null,
          fechasalida:       null,
          importe:           this.editado.total*this.coef,
          nrovalor:          null,
          tipo:              'I',
          observ:            'COBRO EN EFECTIVO',
          medioNombre:       'Efectivo'
        })
        this.pendientes = []
        this.anotadorId =  this.anotadorId

        //Los precios en articulos[] vien finales, tengo que pasarlo a 'sin iva'
        //por compatibilidad
        for (let i=0; i<=this.articulos.length-1; i++) {
          this.articulos[i].precio = this.articulos[i].preciooriginal
          this.articulos[i].total  = this.articulos[i].cantidad*this.articulos[i].precio
        }
        this.calculos()
      
      } else if (que=='recibo') {

        debugger

        this.coef = -1

//      if (this.itemActual!=undefined) {
        if (this.itemActual.cpr!='') {

          if (!this.sucursalDemo) {
            if (this.itemActual.comprobante_id==1) { this.editado.comprobante_id = 4 } 
            else if (this.itemActual.comprobante_id==6) { this.editado.comprobante_id = 9 } 
            else if (this.itemActual.comprobante_id==14) { this.editado.comprobante_id = 17 }
          } else {
            if (this.itemActual.cpr.substr(0,5)=='PRE-A') { this.editado.comprobante_id = 4 } 
            else if (this.itemActual.cpr.substr(0,5)=='PRE-B') { this.editado.comprobante_id = 9 } 
            else if (this.itemActual.cpr.substr(0,5)=='PRE-C') { this.editado.comprobante_id = 17 }
          }

          this.editado.letra           = this.itemActual.cpr.substr(4,1)
          this.editado.direccion_id    = this.itemActual.direccion_id
          this.editado.documento_id    = this.itemActual.documento_id
          this.editado.documentoCodigo = this.itemActual.tercero.documento.codigo
          this.editado.tercero_id      = this.itemActual.tercero_id
          this.editado.moneda_id       = this.itemActual.moneda_id

        } else {
          
          this.editado.comprobante_id  = this.editado.comprobante_id
          this.editado.letra           = this.editado.letra
          this.editado.direccion_id    = this.editado.direccion_id
          this.editado.documento_id    = this.editado.documento_id
//        this.editado.documentoCodigo = this.itemActual.tercero.documento.codigo
          this.editado.documentoCodigo = this.editado.documentoCodigo
          this.editado.tercero_id      = this.editado.tercero_id
          this.editado.moneda_id       = this.editado.moneda_id
          
        }

        this.editado.fecha          = moment().format('YYYY-MM-DD')
        this.editado.perfiscal      = moment().format('YYYY-MM')
        this.editado.mediodepago_id = null
        this.editado.sucursal_id    = this.sucursal
        this.editado.sucursalFiscal = this.sucursalFiscal
        this.editado.cpr            = 'REC'
        this.editado.observaciones  = 'REC'
        this.editado.lista_id       = null
        this.editado.deposito_id    = null
        this.dialogRec              = false
        this.editado.gravado        = 0
        this.editado.iva            = 0
        this.editado.total          = this.roundTo(this.totCancelado,2)
        this.editado.rentabilidad   = 0
        this.editado.pendientes     = this.pend
        this.editado.valores        = this.valores
        let editado                 = this.editado

        return HTTP().post('/recibo', { editado })
          .then(({ data }) => {
            if (data=='error') {
              this.mensaje('¡Opss, se ha producido un error. Reintente, si el error persiste consulte con gohu!', this.temas.forms_titulo_bg, 5000) 
            } else {
              this.mensaje('¡El recibo se ha registrado correctamente!', this.temas.forms_titulo_bg, 1500)
            }
            this.listarHTTP(true)
          });
      }

      // sumo al descuento global todos los descuentos que puedan tener los items.
      for (let i=0; i<=this.articulos.length-1; i++) {
        this.editado.importedescuento += this.articulos[i].importedescuento
      }

      // Si es un pedido y tiene un vendedor, genero como si fuera una compra del cliente, pero con el vendedor
      if (this.editado.cpr.substr(0,3)=='PED' && this.editado.vendedor.id!=null) {

        // busco la sucursal del cliente ( puede tener varias )
        // Puede que el clente no use el sistema, en ese caso no tiene sucursal.
        let laSuc = 0
        let sucFis = ''
        if (this.userDelTerceroDatos[0].tercero.user) {
          for (let i=0; i<= this.userDelTerceroDatos[0].tercero.user.sucursales.length-1; i++) {
            if (this.userDelTerceroDatos[0].tercero.user.sucursales[i].sucursaldemo==0) {
              laSuc = this.userDelTerceroDatos[0].tercero.user.sucursales[i].id
              sucFis = this.userDelTerceroDatos[0].tercero.user.sucursales[i].fiscal
            }
          }
        } else {
          laSuc = this.sucursal
          sucFis = this.sucursalFiscal
        }

        return HTTP().post('/compranueva', {
          fecha:               moment().format('YYYY-MM-DD'),
          perfiscal:           moment().format('YYYY-MM'),
          tipo:                'CO',
          cpr:                 this.editado.cpr+'-'+this.editado.letra+' '+sucFis+'-00000000',
          user_id:             this.userDelTerceroDatos[0].tercero.user.id,
          sucursal_id:         laSuc,
          tercero_id:          this.datosEmpresa.id,
          comprobante_id:      126,
          direccion_id:        this.userDelTerceroDatos[0].tercero.direcciones[0].id,
          documento_id:        this.editado.documento_id,
          mediodepago_id:      this.editado.medio_id,
          deposito_id:         this.editado.deposito_id,
          vendedor_id:         this.editado.vendedor.id,
          moneda_id:           this.editado.moneda_id,
          tasadescuento:       this.editado.tasadescuento,
          importedescuento:    this.editado.importedescuento*this.coef,
          retiva:              this.editado.retiva*this.coef,
          retgan:              this.editado.retgan*this.coef,
          retib:               this.editado.retib*this.coef,
          gravado:             this.editado.gravado*this.coef,
          exento:              this.editado.exento*this.coef,
          iva:                 this.editado.iva*this.coef,
          total:               this.editado.total*this.coef,
          regstk:              this.editado.regstk,
          estado:              this.editado.estado,
          activo:              true,
          observaciones:       'PEDIDO DEL VENDEDOR',
          articulos:           this.articulos,
          valores:             [],
          pendientes:          [],
          notificacion:        0,
          notificaEnBaseAOtro: 0,
          notificaOriginal:    0,
          gasto:               null,
          tasasIVA:            [],
        }).then(({ data }) => {
          this.listarHTTP(true)
        });

      } else {

        let cpr = ''
        if (this.esManual) {
          cpr = this.editado.cpr+'-'+this.editado.letra+' '+this.sucManual+'-'+this.nroManual 
          this.electronica = false
        } else {
          cpr = this.editado.cpr+'-'+this.editado.letra+' '+this.sucursalFiscal+'-'+'00000001'
        }

        return HTTP().post('/nuevaventa', {
          fecha:               moment().format('YYYY-MM-DD'),
          perfiscal:           pf,
          cpr:                 cpr,
          user_id:             this.userId,
          sucursal_id:         this.sucursal,
          tercero_id:          this.editado.tercero_id,
          comprobante_id:      this.editado.comprobante_id,
          direccion_id:        this.editado.direccion_id,
          documento_id:        this.editado.documento_id,
          documentonumero:     this.editado.documentoNumero,
          documentocodigo:     this.editado.documentoCodigo,
          mediodepago_id:      this.editado.mediodepago_id,
          lista_id:            null,
          deposito_id:         this.editado.deposito_id,
          vendedor:            this.editado.vendedor,
          moneda_id:           this.editado.moneda_id,
          tasadescuento:       this.editado.tasadescuento,
          importedescuento:    this.editado.importedescuento*this.coef,
          recargo:             this.recargo*this.coef,
          gravado:             this.editado.gravado*this.coef,
          exento:              this.editado.exento*this.coef,
          iva:                 this.editado.iva*this.coef,
          total:               this.editado.total*this.coef,
          rentabilidad:        this.rentabilidad,
          observaciones:       this.editado.observaciones,
          regstk:              true,
          estado:              this.editado.estado,
          activo:              true,
          articulos:           this.articulos,
          valores:             this.valores,
          pendientes:          this.pendientes,
          notificacion:        0,
          notificaEnBaseAOtro: this.notificaEnBaseAOtro,
          notificaOriginal:    this.notificaOriginal,
          basadoEnOtroCpr:     this.basadoEnOtroCpr,
          anotadorId:          this.anotadorId,
          espejo:              espejo,
          novedad:             novedad,
          electronica:         this.electronica,
          produccion:          this.datosEmpresa.faeproduccion,
          ivas:                this.ivas,
          asociado:            this.asociado,
          facturasEnRemito:    this.facturas }, { timeout: 15000 })
          .then(({ data }) => {

            debugger

            if (!data) {
              this.mensaje('¡Opps!, hubo un problema en la grabación!, consulte con la mesa de ayuda Gohu.', this.temas.cen_card_activo_bg, 3000) 
            } else {
              if ( this.electronica) {
                if (!data) {
                  this.msg.msgTitle = 'Error en el Comprobante Electrónico'
                  let msg = ''
                  msg  = 'No se puedo realizar el comprobante electrónico.<br>'
                  msg += 'Los servidores de AFIP no responden.<br>'
                  msg += 'Debera esperar y reintentar.<br>'
                  this.msg.msgBody = msg
                  this.msg.msgAccion  = 'Comprobante Electronico Error'
                  this.msg.msgButtons = ['Esperar','Cancelar']
                } else {
                  this.msg.msgTitle = 'Comprobante Electrónico'
                  let msg = '<br>Se ha generado correctamente un nuevo comprobante electrónico.<br><br>'
                  msg += 'Comprobante: '+data.cpr+'<br>'
                  msg += 'CAE: '+data.cae+'<br>'
                  this.msg.msgBody    = msg
                  this.msg.msgAccion  = 'Comprobante Electronico'
                  this.msg.msgButtons = ['Aceptar']
                }
                this.msg.msgVisible = true
              } else {
                this.mensaje('¡El comprobante se ha registrado con éxito!', this.temas.forms_titulo_bg, 3000) 
              }
            }
            this.listarHTTP(true)
          })
        }
    },





    cargoIvas() {
      let pordes = Number(this.editado.tasadescuento)
      let totcpr = 0
      let impdes = 0
      let pos    = 0
      let posiva = 0
      this.ivas  = []
      for (let i=0; i<=this.articulos.length-1; i++) {
        posiva = this.ivaTasas.map(function(e) { return e.id; }).indexOf(this.articulos[i].iva_id);
        pos    = this.ivas.map(function(e) { return e.Id; }).indexOf(this.articulos[i].iva_id);
        totcpr = this.articulos[i].total
        impdes = 0
        if (pordes!=0) {
          impdes = totcpr * (pordes/100)
          totcpr -= impdes
        }
        if (pos>=0) {
          this.ivas[pos].BaseImp += totcpr
          this.ivas[pos].BaseImp = this.roundTo(this.ivas[pos].BaseImp,2)
          this.ivas[pos].Importe += totcpr*(this.ivaTasas[posiva].tasa/100)
          this.ivas[pos].Importe = this.roundTo(this.ivas[pos].Importe,2)
        } else {
          this.ivas.push({
            Id: this.articulos[i].iva_id,
            BaseImp: this.roundTo(totcpr,2),
            Importe: this.roundTo(totcpr*(this.ivaTasas[posiva].tasa/100),2)
          })
        }
      }
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





    nuevoMed() {
      this.editedIndexMed = -1;
      this.dialogMed = true;
      this.cueItems = []
    },





    rastrear(item) {
      return HTTP().get('/comprobantesrastrear/'+item.id+'/updown')
        .then(({ data }) => {
          let ras = []
          ras.push(data[0])
          for (let i=1; i<=data.length-1; i++) {
            for (let j=0; j<=data[i].length-1; j++) {
              if (this.isArray(data[i][j])==false) {
                ras.push(data[i][j])
              } else {
                for (let k=0; k<=data[i][j].length-1; k++) {
                  if (this.isArray(data[i][j][k])==false) {
                    ras.push(data[i][j][k])
                  } else {
                    for (let l=0; l<=data[i][j][k].length-1; l++) {
                      ras.push(data[i][j][k][l])
                    }
                  }
                }
              }
            }
          }
          let r = []
          let lDone = false
          for (let i=0; i<=ras.length-1; i++) {
            lDone = false
            for (let j=0; j<=r.length-1; j++) {
              if (r[j].id == ras[i].id) {
                lDone = true
              }
            } 
            if (!lDone) {
              r.push(ras[i])
            }
          }
          this.rastreo = r
          this.dialogRas = true

      });

      /* esta prueba recursiva funciona, el tema es implementarlo en la API */
      /*
      let rastros = [
        {id:  1,padre:  8, hijo:  9},
        {id:  2,padre:  9, hijo: 10},
        {id:  3,padre: 10, hijo: 11},
        {id:  4,padre: 10, hijo: 12},
        {id:  5,padre: 11, hijo: 13},
        {id:  6,padre: 10, hijo: 14},
        {id:  7,padre: 11, hijo: 15},
        {id:  8,padre: 10, hijo: 16},
        {id:  9,padre: 11, hijo: 17},
        {id: 10,padre: 21, hijo: 22},
        {id: 11,padre: 22, hijo: 23},
        {id: 12,padre: 23, hijo: 24},
        {id: 13,padre: 26, hijo: 27},
        {id: 14,padre: 27, hijo: 28},
        {id: 15,padre: 28, hijo: 29},
        {id: 16,padre: 51, hijo: 52},
        {id: 17,padre: 67, hijo: 68},
        {id: 18,padre: 67, hijo: 69}]

      function nestedDown(arr, buscar, j) {
        var out = []
        for (let i=j; i<=arr.length-1; i++)  {
          if (arr[i].padre == buscar) {
            out.push(arr[i]);
            var children = nestedDown(arr, arr[i].hijo, i);
            if(children.length) {
              out.push(children); 
            }
          }
        }
        return out
      }

      function nestedUp(arr, buscar, j) {
        var out = []
        let lDone = true
        let i = j
        while (lDone==true) {
          if (arr[i].hijo == buscar) {
            out.push(arr[i]);
            var children = nestedUp(arr, arr[i].padre, i);
            if(children.length) {
              out.push(children); 
            }
          }
          i --
          if (i<0) {
            lDone = false
          }
        }
        return out
      }

      let res = nestedDown(rastros , 10, 0 )
      let ii = 0
      for (let i=0; i<=rastros.length-1; i++) {
        if (rastros[i].id == res[0].id) {
          ii = i
          break
        }
      }
      let resx = nestedUp(rastros , 10, ii )
      console.log(resx)
      */

    },





    leerTimeLine(item) {
      this.timeLine = []
      return HTTP().get('/timeline/'+item.id)
        .then(({ data }) => {
          for (let i=0; i<=data.length-1; i++) {
            this.timeLine.push(data[i])
          }
          this.dialogTimeLine = true
      });

    },





    cerrarRas(item) {
      this.dialogRas = false
    },





    cerrarRem(item) {
      this.dialogRem = false
    },





    cerrarRec(item) {
      this.dialogRec = false
    },





    cerrarNdc(item) {
      for (let i=0; i<=this.itemActual.items.length-1; i++) {
        this.itemActual.items[i].cantidad = this.itemActual.items[i].cantidadoriginal
      }
      this.dialogNdcFac = false
    },





    cerrarNdd(item) {
      this.dialogNddFac = false
    },





    cerrarTimeLine() {
      this.dialogTimeLine = false
    },





    setFP(cual) {
      // EN BASE A cual, SETEO LA FORMA DE PAGO: EFEC, CHE.CARTERA, BANCO, RETENCION.

      /* En base a 'cual' seteo la forma de pago.
         1 -> Efectivo
         2 -> Tarj. de Credito
         3 -> Tarj. de Debito
         4 -> Cta.Cte.
         5 -> Transferencia
         6 -> Cheque
         7 -> Mercado Pago
         8 -> Todo Pago
      */

      this.editedIndexMed = -1
      this.dialogMed = true
      this.medioDePagoId = cual

      if (cual==1) {
        this.medpagwidth = 400
      } else if (cual==2) {
        this.medpagwidth = 700
      } else if (cual==3) {
        this.medpagwidth = 700
      } else if (cual==5) {
        this.medpagwidth = 600
      } else if (cual==6) {
        this.medpagwidth = 1110
      } else if (cual==7) {
        this.medpagwidth = 500
      } else if (cual==8) {
        this.medpagwidth = 500
      } else if (cual==9) {
        this.medpagwidth = 500
      }

      this.cual = cual
      this.calculosMed()

      this.editadoMed = Object.assign({}, this.defaultItemMed)
      this.cueItems = []

      this.editadoMed.importe = this.editado.total-this.totValores
      this.medioDePagoNombre = this.medpag[cual-1].nombre
    },





    cprBalanceado() {
      let valores = 0
      for (let i=0; i<=this.medpag.length-1; i++) {
        valores += this.roundTo(this.medpag[i].total,2)
      }
     if (this.editado.total==this.roundTo(valores,2) && this.editado.total!=0) {
        return true
      } else {
        return false
      }
    },





    automaticoPend(item) {
      let tot = this.editado.total
      for (let i=0; i<=this.pend.length-1; i++) {
        this.pend[i].acancelar = 0
      }
      for (let i=0; i<=this.pend.length-1; i++) {
        if (tot >= this.pend[i].pendiente) {
          this.pend[i].acancelar = this.pend[i].pendiente
          tot -= this.pend[i].pendiente
        } else if ( tot > 0 ) {
          this.pend[i].acancelar = tot
          tot = 0
        }
      }
    },





    editarPend(item) {
      this.itemActualPend = item
      this.editadoPend.acancelar = item.pendiente
      this.dialogPend = true
    },





    guardarPend(item) {
      this.itemActualPend.acancelar = item.acancelar
      this.editado.total = item.acancelar
      this.calculosMed()
      this.dialogPend = false
    },





    cancelarPend() {
      this.dialogPend = false;
    },





    selectPend(item) {
      if (item.acancelar==0) {
        item.acancelar = item.pendiente
      } else {
        item.acancelar = 0
      }
      this.calculosMed()
    },




    habinhab(obj) {
      let retval = false
      let mp = this.medioDePagoId
      if (mp==1) {            //EFECTIVO
        this.anchoDelDialogDeValores = 500
      } else if (mp==2) {     //TARJETA DE CREDITO
        if (obj=='cuenta' || obj=='tarjeta') {
          this.anchoDelDialogDeValores = 850
          retval = true
        }
      } else if (mp==3) {     //TARJETA DE DEBITO
        if (obj=='cuenta' || obj=='tarjeta') {
          this.anchoDelDialogDeValores = 850
          retval = true
        }
      } else if (mp==5) {     //TRANSFERENCIA
        if (obj=='cuenta' || obj=='transferencia') {
          this.anchoDelDialogDeValores = 850
          retval = true
        }
      } else if (mp==6) {     //CHEQUE
        if (obj=='cuenta' || obj=='chequera') {
          this.anchoDelDialogDeValores = 850
          retval = true
        } else if (obj=='cheque de tercero') {
          this.anchoDelDialogDeValores = 1200
          retval = true
        }
      } else if (mp==7) {     //MERCADO PAGO
        this.anchoDelDialogDeValores = 850
      } else if (mp==8) {     //TODO PAGO
        this.anchoDelDialogDeValores = 850
      }
      return retval
    },





    guardarRem() {
      this.dialogRem = false
      this.altaHTTP('remfac')
    },






    confirmarValores(item) {
      if (this.editado.cpr.substr(0,3)=='REC') {
        this.msg.msgTitle = 'Confirmar el Recibo'
        this.msg.msgBody = 'Confirma el Cobro del Comprobante?'
        this.msg.msgVisible = true
        this.msg.msgAccion = 'cobrar comprobante'
        this.msg.msgButtons = ['Aceptar','Cancelar']
      } else {
        this.dialogRec = false
      }
    },





    guardarNdc() {
      this.dialogRem = false
      let a = null
      if (this.ndcMotivoSel>1) {

        let artTemp = this.articulos
        this.articulos = []
        for ( let i=0; i<= artTemp.length-1; i++) {

          if ( artTemp[i].adevolver != 0 ) {
            artTemp[i].cantidad = artTemp[i].adevolver*-1
            this.articulos.push({
              articulo_id:      artTemp[i].articulo_id,
              codigo:           artTemp[i].codigo,
              nombre:           artTemp[i].nombre,
              deposito_id:      artTemp[i].deposito_id,
              unidad_id:        artTemp[i].unidad_id,
              moneda_id:        artTemp[i].moneda_id,
              iva_id:           artTemp[i].iva_id,
              cantidad:         Math.abs(artTemp[i].adevolver)*-1,
              cantidadoriginal: Math.abs(artTemp[i].adevolver)*-1,
              stock:            Math.abs(artTemp[i].adevolver),
              undstock:         Math.abs(artTemp[i].adevolver)*-1,
              costo:            artTemp[i].costo,
              precio:           artTemp[i].precio,
              preciooriginal:   artTemp[i].precio,
              tasadescuento:    artTemp[i].tasadescuento,
              importedescuento: artTemp[i].importedescuento,
              total:            artTemp[i].total,
              texto:            artTemp[i].texto,
              vencimiento:      artTemp[i].vencimiento,
              adevolver:        0,
              padre_id:         this.itemActual.items[i].articulo.padre_id,
              undenvase:        artTemp[i].undenvase,
              escombo:          artTemp[i].escombo
            })
          }
        }
      }
      this.altaHTTP('ndcfac')
    },





    guardarNdd() {
      //this.dialogRem = false
      this.dialognddxDev = false
      let a = null
      if (this.nddMotivoSel<=2) {
        this.altaHTTP('nddfac')
      } else {
      }
    },





    editarMed(item) {
    },





    agregarMismoMed(item) {
      this.editedIndexMed = -1
      this.dialogMed = true

      this.calculosMed()
      this.editadoMed = Object.assign({}, this.defaultItemMed)
      this.editadoMed.id                = null
      this.editadoMed.caja_id           = item.caja_id
      this.editadoMed.medio_id          = item.medio_id
      this.editadoMed.cuentaorigen_id   = item.cuentaorigen_id
      this.editadoMed.cuentadestino_id  = item.cuentadestino_id
      this.editadoMed.cuentacheque_id   = item.cuentacheque_id
      this.editadoMed.cuentatarjeta_id  = item.cuentatarjeta_id
      this.editadoMed.banco_id          = item.banco_id
      this.editadoMed.tarjeta_id        = item.tarjeta_id
      this.editadoMed.cpringreso_id     = item.cpringreso_id
      this.editadoMed.cpregreso_id      = item.cpregreso_id
      this.editadoMed.librador_id       = item.librador_id
      this.editadoMed.librador_medio_id = item.librador_medio_id
      this.editadoMed.chequera_id       = item.chequera_id
      this.editadoMed.cheque_id         = item.cheque_id
      this.editadoMed.fechafinanciera   = item.fechafinanciera
      this.editadoMed.fechasalida       = item.fechasalida
      this.editadoMed.importe           = item.importe
      this.editadoMed.nrovalor          = Number(item.nrovalor)+1
      this.editadoMed.tipo              = item.tipo
      this.editadoMed.observ            = item.observ
      this.editadoMed.importe           = this.editado.total-this.totValores
      this.editadoMed.cuenta            = item.cuenta
      this.editadoMed.cuit              = item.cuit
      this.editadoMed.nombre            = item.nombre
      this.cueItems = []
      this.medioDePagoNombre = this.medpag[cual-1].nombre
    },





    borrarMed(item) {
      let pos = this.valores.indexOf(item)
      this.medpag[item.medio_id-1].total -= item.importe
      this.valores.splice(pos,1);
      this.calculosMed()
    },





    calculosMed() {
      let totPen = 0
      let totVal = 0
      for (let i=0; i<=this.pend.length-1; i++) {
        totPen += Number(this.pend[i].acancelar)
      }
      for (let i=0; i<=this.valores.length-1; i++) {
        totVal += Number(this.valores[i].importe)
      }
      this.totCancelado = this.editado.cpr == 'REC' ? this.roundTo(totPen,2) : this.roundTo(this.editado.total,2)
      this.totValores = this.roundTo(totVal,2)
      if (this.editado.cpr=='REC') {
        this.valDiferencia = this.roundTo((this.editado.total)-(totPen-totVal),2) 
      } else {
        this.valDiferencia = this.roundTo((this.editado.total+this.recargo)-totVal,2) 
      }
    },





    calculoMedioCobro() {
      if (this.editadoMed.id!=null) {
        let ipos = -1
        for (let i=0; i<=this.medios.length-1; i++) {
          if (this.editadoMed.id == this.medios[i].id) {
            ipos = i
            break
          }
        }
        if (ipos!=-1) {
          this.editadoMed.cuentaorigen_id = this.medios[ipos].cuenta_id
          this.editadoMed.cuotas = this.medios[ipos].cuotas
          this.editadoMed.interes = this.medios[ipos].interes
          if (this.editado.cpr.substr(0,3)=='FAC') {
            this.editadoMed.recargo = this.medios[ipos].recargo
            this.editadoMed.importe = this.editadoMed.importe*(1+(this.editadoMed.recargo/100))
            this.editadoMed.importe = this.roundTo(this.editadoMed.importe*(1+(this.medios[ipos].interes/100)),2)
          } else {
            this.editadoMed.recargo = 0
          }
          this.editadoMed.importecuotas = this.roundTo(this.editadoMed.importe/this.editadoMed.cuotas,2)
          this.editadoMed.nombrecuenta = this.medios[ipos].cuenta + ' - ' + this.medios[ipos].nombrebanco
        }
      }
    },





    propiodelcliente() {
      this.editadoMed.cuit = this.editado.documentoNumero
      this.editadoMed.nombre = this.editado.nombre
      this.buscoCuentasDelCuit()
    },





    buscoCuentasDelCuit () {
      this.elCuitEstaba = false

      return HTTP().get('/tercerocuitcuentas/'+this.editadoMed.cuit )
        .then(({ data }) => {

          this.cueItems = []
          if (data=='') {

            this.mensaje('¡Este CUIT no existe en AFIP!', this.temas.forms_titulo_bg, 1500)
            this.$refs.cuit.focus()
            return

          } else if (data.datosGenerales) {

            this.elCuitEstaba = false
            this.editadoMed.nombre = data.datosGenerales.razonSocial

          } else if (data.length>0) {

            this.elCuitEstaba = true
            this.editadoMed.nombre = data[0].nombre
            for (let i=0; i<= data[0].cuentas.length-1; i++) {
              this.cueItems.push(data[0].cuentas[i].cuenta)
            }
            for (let i=0; i<=this.cueNewItems.length-1; i++) {
              this.cueItems.push(this.cueNewItems[i])
            }
            if (this.cueItems.length) {
              this.editadoMed.cuenta = this.cueItems[0]
            }
            this.buscoCuentaBanco()
          
          }
        
        })
    },





    buscoCuentaBanco() {

      debugger
      this.laCuentaEstaba = false

      //if (this.editadoMed.cuenta==undefined||this.editadoMed.cuenta==null) { return }

      return HTTP().post('/buscocuentabanco', {cuenta: this.editadoMed.cuenta} )
        .then(({ data }) => {

          debugger
          if (data.length>0) {

            if (data[0].tercero.cuit!=this.editadoMed.cuit) {
              this.mensaje('¡Esta cuenta corresponde a otro CUIT!', this.temas.forms_titulo_bg, 1500) 
              this.$refs.cuenta.focus()
              return
            }

            this.editadoMed.cuentaorigen_id = data[0].id
            this.editadoMed.banco_id        = data[0].banco.id
            this.laCuentaEstaba             = true

          } else {

            let pos = -1
            for (let i=0; i<=this.cueNewItems.length-1; i++) {
              if (this.editadoMed.cuenta==this.cueNewItems[i].cuenta) {
                pos = i
                break
              }
            }

            if (pos==-1) {
//              this.cueItems.push(this.editadoMed.cuenta)
//              this.cueNewItems.push({cuenta: this.editadoMed.cuenta, banco_id: null})
//              this.editadoMed.cuentaorigen_id = null
            } else {
              this.editadoMed.banco_id = data[0].banco.id
            }

          }
        })
    },





    buscoCheque() {
      let pos = -1
      for (let i=0; i<=this.valores.length-1; i++) {
        if (this.valores[i].cuentaorigen_id == this.editadoMed.cuentaorigen_id && this.valores[i].nrovalor==this.editadoMed.nrovalor) {
          pos = i
          break
        }
      }
      if (pos !=-1) {
        this.mensaje('¡Este numero de cheque ya existe para esta cuenta!', this.temas.forms_titulo_bg, 1500)
        this.$refs.numerodecheque.focus()
        return
      }
      return HTTP().get('/buscocheque/'+this.editadoMed.cuentaorigen_id+'/'+this.editadoMed.nrovalor )
        .then(({ data }) => {
          if (data.length>0) {
            this.mensaje('¡Este numero de cheque ya existe para esta cuenta!', this.temas.forms_titulo_bg, 1500)
            this.$refs.numerodecheque.focus()
            return
          }
        })
    },





    seleccionoBanco() {
      for (let i=0; i<=this.cueNewItems.length-1; i++) {
        if (this.editadoMed.cuenta==this.cueNewItems[i].cuenta) {
          this.cueNewItems[i].banco_id=this.editadoMed.banco_id
        }
      }
    },





    calculosNdc(cual) {
      if (cual==1) {  //CAMBIO EL %
        this.ndcTotal = this.roundTo(this.editado.total * (this.ndcTasaDescuento/100),2)
      } else {
        this.ndcTasaDescuento = this.roundTo(((this.ndcTotal * 100) / this.editado.total),2)
      }
    },





    calculosNdd(cual) {
      if (cual==1) {          //CAMBIO EL %
        this.nddTotal = this.roundTo(this.editado.total * (this.nddTasaDescuento/100),2)
      } else if (cual==2) {   //CAMBIO EL TOTAL, CALCULO EL %
        this.nddTasaDescuento = this.roundTo(((this.nddTotal/this.editado.total)*100),2)
      }
    },





    selMotivoNdc() {
      this.dialogNdcxDev = false

      if (this.ndcMotivoSel==1) {
        this.ndcTotal = 0
        this.ndcTasaDescuento = 0
        return 
      }

      // Si ya realizo devolucion o anulacion, debo buscar en el/los NDC vinculadas para descontar
      // las cantidades ya devueltas.
      let aRestar = []
      this.articulos = []
      let ndcImputadas = 0
      this.ndcTotal = 0

      const a = HTTP().get('/buscondcvinculadas/'+this.itemActual.id )
        .then(({ data }) => {
          if (data.length>0) {
            for (let i=0; i<=data.length-1; i++) {
              aRestar.push({
                articulo_id: data[i].articulo_id,
                cantidad: data[i].cantidad,
                total: data[i].total
              })
            ndcImputadas += data[i].total
            }
          }

          let posiva = 0
          for (let i=0; i<=this.itemActual.items.length-1; i++) {

            for (let j=0; j<=aRestar.length-1; j++) {
              if (aRestar[j].articulo_id == this.itemActual.items[i].articulo_id) {
                this.itemActual.items[i].cantidad -= Math.abs(aRestar[j].cantidad)
              }
            }

            if (this.itemActual.items[i].cantidad != 0) {

              this.articulos.push({
                id:               this.itemActual.items[i].id,
                articulo_id:      this.itemActual.items[i].articulo_id,
                codigo:           this.itemActual.items[i].articulo.codigo,
                nombre:           this.itemActual.items[i].articulo.nombre,
                deposito_id:      this.itemActual.items[i].deposito_id,
                unidad_id:        this.itemActual.items[i].unidad_id,
                moneda_id:        this.itemActual.items[i].moneda_id,
                iva_id:           this.itemActual.items[i].iva_id,
                cantidad:         Number(this.itemActual.items[i].cantidad),
                cantidadoriginal: Number(this.itemActual.items[i].cantidad),
                stock:            this.itemActual.items[i].stock,
                undstock:         Number(this.itemActual.items[i].cantidad),
                costo:            this.itemActual.items[i].costo,
                precio:           this.itemActual.items[i].precio,
                preciooriginal:   this.itemActual.items[i].preciooriginal,
                tasadescuento:    this.itemActual.items[i].tasadescuento,
                importedescuento: this.itemActual.items[i].importedescuento,
                total:            this.itemActual.items[i].total,
                texto:            '',
                vencimiento:      '',
                adevolver:        0,
                padre_id:         this.itemActual.items[i].articulo.padre_id,
                undenvase:        this.itemActual.items[i].articulo.undenvase,
                escombo:          false,
              })
            }

          }
          this.ndcTotal = this.roundTo(this.itemActual.total - Math.abs(this.roundTo(ndcImputadas,2)),2)
          if (this.ndcTotal === 0) {
            // MOSTRAR MENSAJE Y NO INGRESAR
          }
          if (this.ndcMotivoSel==2) {
            this.dialogNdcxDev = true
          }
        })

    },





    selMotivoNdd() {
      this.dialogNddxDev = false
      if (this.itemActual.cpr.substr(0,3)=='FAC') {

      } else if (this.itemActual.cpr.substr(0,3)=='FAC') {

      }
      if (this.nddMotivoSel==1) {
        this.nddTotal = 0
        this.nddTasaDescuento = 0
        return 
      }

    },





    ////////////////////////
    // METODOS DE RECIBOS //
    ////////////////////////
    cobrar(item) {
      let puedeCobrar = true
      debugger
      if (item.tercero.user) {
        if (item.tercero.user.externo) {
          if (item.pendientes[0].pendiente!=0) {
            return true
          } else {
            return false
          }
        } else {
          let user = item.tercero.user.id
          for (let i=0; i<=this.vinculosHijos.length-1; i++) {
            if (user == this.vinculosHijos[i]) {
              puedeCobrar = false
              break
            }
          }
        }
      }
      if (!item.pendientes[0] || !puedeCobrar || (this.userId==1 && !item.tercero.externo)) return false
      if (item.pendientes[0].pendiente>0) {
        return true
      } else {
        return false
      }
    },





    tieneRemito(item) {
      if (item.cpr.substr(0,3)=='REM') { return false }
      if (item.observaciones!=null) {
        return item.observaciones.indexOf('REMITO')==-1 ? false : true
      } else {
        return false
      }
    },





    //////////////////////
    // METODOS DE ITEMS //
    //////////////////////
    buscarArt(estricto) {

      if (this.busArt=='') { // NO HAY NADA QUE BUSCAR
        this.seleccionarArticulo = false;
        return 
      }

      // Si en el codigo esta el caracter '@' busco estricto
      let estrixto = this.busArt.indexOf('@') != -1 ? true : false

      this.seleccionarArticulo = false;
      let b = this.busArt
      let v = this.$store.state.vinculosPadres

      return HTTP().post('/userarticulosfac', {
        search: b,
        vinculos: v,
        estricto: estrixto,
        userex: null
        })
        .then(({ data }) => {

          debugger
          if (data.length==1) {
            this.editadoArt.codigo           = data[0].codigo;
            this.editadoArt.articulo_id      = data[0].id;
            this.editadoArt.nombre           = data[0].nombre;
            this.editadoArt.codbar           = data[0].codbar;
            this.editadoArt.unidad_id        = data[0].unimedid
            this.editadoArt.moneda_id        = data[0].monedaid
            this.editadoArt.iva_id           = data[0].ivaid
            this.editadoArt.monedaNombre     = data[0].simbolo
            this.editadoArt.unidadNombre     = data[0].unimed
            this.editadoArt.ivaNombre        = data[0].tasa               /////// ????????????????????
            this.editadoArt.costo            = data[0].costo
            this.editadoArt.preciooriginal   = data[0].precio
            if ((this.dialogArtNot)) {
              this.editadoArt.precio         = data[0].final
              this.editadoArt.total          = data[0].final
            } else {
              this.editadoArt.precio         = data[0].precio
              this.editadoArt.total          = data[0].precio
            }
            this.editadoArt.tasadesuento     = 0
            this.editadoArt.importedescuento = 0
            this.editadoArt.deposito_id      = this.depItems[0].id
            this.editadoArt.padre_id         = data[0].padre_id
            this.editadoArt.undenvase        = data[0].undenvase
            this.$refs.cant.focus()
            this.seleccionarArticulo = false
           
          } else {

            this.selArt = []
            this.busArtSave = this.busArt
            for (let i=0; i<=data.length-1; i++) {
              let pre = 0
              if (this.dialogArtNot) {
                pre = data[i].final
              } else {
                pre = data[i].precio
              }
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
                ivaNombre:         data[i].tasa,
                costo:             data[i].costo,
                precio:            pre,
                tasadesuento:      0,
                importedescuento:  0,
                deposito_id:       this.depItems[0].id,
                stock:             data[i].stock == null ? 0 : data[i].stock,
                undenvase:         data[i].undenvase,
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
      //this.$refs.cant.focus()
    },





    cantidadItem() {
      this.editadoArt.stock = this.editadoArt.cantidad
      this.editadoArt.total = this.roundTo((Number(this.editadoArt.cantidad)*Number(this.editadoArt.precio)),2)
      return this.editadoArt.total
    },





    precioItem() {
      this.editadoArt.stock = Number(this.editadoArt.cantidad)
      this.editadoArt.total = this.roundTo((Number(this.editadoArt.cantidad)*Number(this.editadoArt.costo)),2)
      return this.editadoArt.total
    },





    tasaDescuento() {
      let ctt = Number(this.editadoArt.cantidad)
      let pre = Number(this.editadoArt.precio)
      let tde = Number(this.editadoArt.tasadescuento)
      let ide = this.roundTo((ctt*pre),2)*(tde/100)
      this.editadoArt.importedescuento = ide
      this.editadoArt.total = this.roundTo(((ctt*pre)-ide),2)
      return this.editadoArt.total
    },





    tasaDescuentoGlobal() {
      let ctt = Number(this.editadoArt.cantidad)
      let pre = Number(this.editadoArt.precio)
      let tde = Number(this.editado.tasadescuento)
      let ide = this.roundTo((ctt*pre),2)*(tde/100)
      this.editadoArt.importedescuento = ide
      this.editadoArt.total = this.roundTo(((ctt*pre)-ide),2)
      return this.editadoArt.total
    },





    importeDescuento() {
      let tde = this.roundTo((Number(this.editadoArt.importedescuento)/Number(this.editadoArt.total))*100,2)
      let tot = this.roundTo(Number(this.editadoArt.total)-Number(this.editadoArt.importedescuento),2)
      this.editadoArt.tasadescuento = tde
      this.editadoArt.total = tot
      return this.editadoArt.total
    },





    chequearArtPed(item) {
      this.itemActual = item; // para luego laburar con el cuando seleccione articlos en pedidos
      this.artPed = []
      this.pedProcesable = false
      // Cargo en artPed cada unos de los items que me piden
      for (let i=0; i<=item.items.length-1; i++) {
        this.artPed.push({
          id: item.items[i].id,
          articulo_id: item.items[i].articulo.id,
          codigo: item.items[i].articulo.codigo,
          nombre: item.items[i].articulo.nombre,
          cttped: item.items[i].cantidad,
          cttori: item.items[i].cantidadoriginal,
          stock: 0,
          cttfac: 0,
          nuevostock: 0,
          estado: 'K'
        })
      }
      // Veo los stocks, no se como hacer con el tema sucursales, puede ser general o por cada una
      // Por ahi lo que conviene hacer es mostrar los stocks solo de los depositos de la sucursal
      // actual y trabajar con ellos, que el pedido salga igual si no hay
      // Si maneja demo y tiene stock ahi que luego hagan transferencias y listo.
      let art = []
      let iDep = this.depItems[0].id
      for (let i=0; i<=this.artPed.length-1; i++) {
        art.push(this.artPed[i].articulo_id)
      }
      const k = HTTP().post('/stock2', {
        arts: art,
        dep: iDep
        }).then(({data}) => {
          let sArts = this.artPed.map(el => el.articulo_id)
          let pos = 0
          for (let i=0; i<=this.artPed.length-1; i++) {
            pos = data.length > 0 ? sArts.indexOf(data[i].articulo_id) : -1
            if (pos>=0) {
              this.artPed[pos].stock = data[i].stock
              if (this.artPed[pos].stock >= this.artPed[i].cttori) {
                this.artPed[pos].cttfac = this.artPed[i].cttori
                this.artPed[pos].estado = 'T'
                this.pedProcesable = true
              } else if (this.artPed[i].stock<this.artPed[i].cttori && this.artPed[i].stock>0) {
                this.artPed[pos].cttped = this.artPed[i].stock
                this.artPed[pos].cttfac = data
                this.artPed[pos].estado = 'P'
                this.pedProcesable = true
              } else {
                this.artPed[pos].cttfac = data
                this.artPed[i].cttped = 0
                this.artPed[pos].estado = 'N'
              }
              this.artPed[pos].nuevostock = this.artPed[pos].stock - this.artPed[pos].cttfac
            } else {
              this.artPed[i].stock = 0
              this.artPed[i].cttped = 0
              this.artPed[i].estado = 'N'
            }
          }
        })
      this.dialogPed = true;
    },





    chequearTransfPed(item) {
      // primero releo el pedido para actualizarlo

      return HTTP().post('/releercomprobante', 
        { id: item.id })
        .then(({ data }) => {

          this.itemActual = data[0]
          this.artTransfPed = []
          // Cargo en artPed cada unos de los items que me piden
          for (let i=0; i<=this.itemActual.items.length-1; i++) {
            this.artTransfPed.push({
              id: this.itemActual.items[i].id,
              articulo_id: this.itemActual.items[i].articulo.id,
              codigo: this.itemActual.items[i].articulo.codigo,
              nombre: this.itemActual.items[i].articulo.nombre,
              precio: this.itemActual.items[i].precio,
              cttori: this.itemActual.items[i].cantidadoriginal,
              cttfac: 0,
              ctttransf: 0,
              estado: 'K'
            })
          }

          return HTTP().get('/buscocomprobantesvinculados/'+item.id ) 
            .then(({ data }) => {
              let disp = []
              if (data.length>0) {
                for (let i=0; i<=data.length-1; i++) {
                  for (let j=0; j<=this.artTransfPed.length-1; j++) {
                    if (data[i].articulo_id===this.artTransfPed[j].articulo_id) {
                      this.artTransfPed[j].cttfac+=data[i].cantidad
                    }
                  }
                }
                for (let j=0; j<=this.artTransfPed.length-1; j++) {
                  if (this.artTransfPed[j].cttori == this.artTransfPed[j].cttfac) {
                    this.artTransfPed.splice(j, 1)
                    break
                  } else {
                    this.artTransfPed[j].ctttransf = this.artTransfPed[j].cttori-this.artTransfPed[j].cttfac
                  }
                }
              }
              this.artTransfPedSucDes = []
              for (let i=0; i<=this.sucursales.length-1; i++) {
                if (this.sucursal != this.sucursales[i].id) {
                  this.artTransfPedSucDes.push(this.sucursales[i])
                }
              }
              this.artTransfPedId = this.artTransfPedSucDes[0].id
              this.dialogTransferirPedido = true
            })

      })
    },





    nuevoArt(texto) {
      if (this.buscoSiElTerceroEstaVinculado()) { 
        return 
      } else {
        this.busArt = this.busArtSave!='' ? this.busArtSave : ''
        this.editedIndexArt = -1;
        this.dialogArt = true;
        this.esTexto = texto;
        this.dialogArtNot = false;
        this.uniItems = [];
        this.editadoArt = Object.assign({}, this.defaultItemArt);
        if (texto) {
          this.editadoArt.iva_id = 5
          this.editadoArt.moneda_id = 51
        }
        this.seleccionarArticulo = false;
      }
    },





    nuevoArtNot() {
      this.busArt = ''
      this.editedIndexArt = -1;
      this.dialogArt = false;
      this.dialogArtNot = true;
      this.uniItems = [];
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.seleccionarArticulo = false;
    },





    editarArt(item) {
      this.formTitleArt = 'Editar Item'
      this.seleccionarArticulo = false;
      this.editedIndexArt = this.articulos.indexOf(item)
      this.dialogArt = true
      this.busArt = this.articulos[this.articulos.indexOf(item)].codigo
      this.editadoArt = this.articulos[this.articulos.indexOf(item)]
      this.buscarArt(true)
    },





    sumarRestar(item, cuanto, api, array) {
      let k = 0
      if (array=='articulos') {
        k = this.articulos.indexOf(item)
        if (cuanto==-1 && this.articulos[k].cantidad==0) {
          return
        }
      } else if (array=='pedidos') {
        k = this.artPed.indexOf(item)
        if (cuanto==-1 && this.artPed[k].cttped==0) {
          return
        }
      } else if (array=='transfPed') {
        k = this.artTransfPed.indexOf(item)
        if (cuanto==-1 && this.artTransfPed[k].ctttransf==0) {
          return
        }
      }
      if (api) {
        return HTTP().post('/sumarrestaranotador', {
          cprid: this.anotadorId, 
          artid: this.articulos[k].articulo_id, 
          cant: cuanto
        })
        .then(({ data }) => {
          this.articulos[k].cantidad += cuanto
          this.articulos[k].total = this.articulos[k].precio*this.articulos[k].cantidad
          this.anotadorTotal = 0
          this.rentabilidad = 0
          for (let i=0; i<=this.articulos.length-1; i++) {
            this.anotadorTotal += this.articulos[i].total
            this.rentabilidad += (this.articulos[i].precio-this.articulos[i].costo)*this.articulos[i].cantidad
          }
          this.anotadorTotal = this.roundTo(this.anotadorTotal,2)
          this.rentabilidad = this.roundTo(this.rentabilidad,2)
        })
      } else {
        if (array=='articulos') {
          this.articulos[k].cantidad += cuanto
          this.articulos[k].total = this.articulos[k].precio*this.articulos[k].cantidad
          this.calculos()
        } else if (array=='pedidos') {
          this.artPed[k].cttped += cuanto
          if (this.artPed[k].stock >= this.artPed[i].cttped) {
            this.artPed[k].cttfac = this.artPed[i].cttped
            this.artPed[k].estado = 'T'
          } else if (this.artPed[i].stock>0) {
            this.artPed[k].cttped = this.artPed[i].cttped-this.artPed[i].stock
            this.artPed[k].cttfac = data
            this.artPed[k].estado = 'P'
          } else {
            this.artPed[k].cttfac = data
            this.artPed[k].cttped = 0
            this.artPed[k].estado = 'N'
          }
        } else if (array=='transfPed') {
          if (cuanto==1) {
            if (this.artTransfPed[k].cttori>(this.artTransfPed[k].cttfac)+this.artTransfPed[k].ctttransf) {
              this.artTransfPed[k].ctttransf += cuanto
              this.artTransfPedCtt ++
            }
          } else {
            if (this.artTransfPed[k].ctttransf>0) {
              this.artTransfPed[k].ctttransf += cuanto
              this.artTransfPedCtt --
            }
          }
        }
      }
    },





    editarTransferirAOtraSucursal(item) {
      this.itemActualTransfItem = item
      this.editadoTransfItem.cttOriginal = Number(item.cttori)
      this.editadoTransfItem.cttATransferir = item.ctttransf == 0 ? Number(item.cttori) : Number(item.ctttransf)
      this.dialogTransferirItem = true
    },





    cancelarTransferirItem() {
      this.dialogTransferirItem = false
    },





    guardarTransferirItem(item) {
      this.itemActualTransfItem.ctttransf = Number(this.editadoTransfItem.cttATransferir)
      this.artTransfPedCtt += this.editadoTransfItem.cttATransferir
      this.dialogTransferirItem = false
    },





    sumarRestarNdcDev(item, cuanto) {
      this.editedIndexNot = this.articulos.indexOf(item)
      if ((cuanto==-1 && this.articulos[this.editedIndexNot].adevolver==0) ||
       (cuanto==1 && this.articulos[this.editedIndexNot].adevolver>=this.articulos[this.editedIndexNot].cantidad)) 
       { return }
      if (cuanto==999999) {
        this.articulos[this.editedIndexNot].adevolver = this.articulos[this.editedIndexNot].cantidad
      } else {
        this.articulos[this.editedIndexNot].adevolver += cuanto
      }
      this.ndcTotal = 0
      let tasa = 0
      let total = 0
      let posiva = 0
      for (let i=0; i<=this.articulos.length-1; i++) {
        posiva = this.ivaTasas.map(function(e) { return e.id; }).indexOf(this.articulos[i].iva_id);
        tasa   = this.ivaTasas[posiva].tasa
        total  = this.articulos[i].precio*(1+(tasa/100))
        this.ndcTotal += this.articulos[i].adevolver*total
      }
      this.ndcTotal = this.roundTo(this.ndcTotal,2)
    },





    guardarArt(item) {

      if (this.esTexto) {
        if (this.editedIndexArt > -1) { // esta modificando  
          this.articulos[this.editedIndexArt].articulo_id = 1
          this.articulos[this.editedIndexArt].codigo = '1@1'
        } else {
          this.articulos.push({ 
            id:               0,
            articulo_id:      1,
            codigo:           '1@1',
            nombre:           this.editadoArt.texto,
            deposito_id:      null,
            unidad_id:        null,
            moneda_id:        this.editadoArt.moneda_id,
            iva_id:           this.editadoArt.iva_id,
            iva:              this.editadoArt.iva,
            cantidad:         1,
            cantidadoriginal: 1,
            stock:            0,
            undstock:         0,
            costo:            Number(this.editadoArt.total),
            precio:           Number(this.editadoArt.total),
            preciooriginal:   Number(this.editadoArt.total),
            tasadescuento:    0,
            importedescuento: 0,
            total:            Number(this.editadoArt.total),
            texto:            this.editadoArt.texto,
            vencimiento:      '',
            adevolver:        0,
            padre_id:         null,
            undenvase:        1,
            escombo:          false,
          })
        }
        this.dialogArt = false;
        this.calculos()
        return
      }
      let recno = 0
      if (this.editedIndexArt > -1) { // esta modificando
        recno = this.editedIndexArt
        this.articulos[this.editedIndexArt].articulo_id      = this.editadoArt.articulo_id
        this.articulos[this.editedIndexArt].codigo           = this.editadoArt.codigo
        this.articulos[this.editedIndexArt].nombre           = this.editadoArt.nombre
        this.articulos[this.editedIndexArt].deposito_id      = this.editadoArt.deposito_id
        this.articulos[this.editedIndexArt].unidad_id        = this.editadoArt.unidad_id
        this.articulos[this.editedIndexArt].moneda_id        = this.editadoArt.moneda_id
        this.articulos[this.editedIndexArt].iva_id           = this.editadoArt.iva_id
        this.articulos[this.editedIndexArt].iva              = this.editadoArt.iva
        this.articulos[this.editedIndexArt].cantidad         = Number(this.editadoArt.cantidad)
        this.articulos[this.editedIndexArt].stock            = Number(this.editadoArt.cantidad)
        this.articulos[this.editedIndexArt].undstock         = Number(this.editadoArt.cantidad)
        this.articulos[this.editedIndexArt].costo            = Number(this.editadoArt.costo)
        this.articulos[this.editedIndexArt].precio           = Number(this.editadoArt.precio)
        this.articulos[this.editedIndexArt].preciooriginal   = 0
        this.articulos[this.editedIndexArt].tasadescuento    = Number(this.editadoArt.tasadescuento)
        this.articulos[this.editedIndexArt].importedescuento = Number(this.editadoArt.importedescuento)
        this.articulos[this.editedIndexArt].total            = Number(this.editadoArt.total)
        this.articulos[this.editedIndexArt].texto            = ''
        this.articulos[this.editedIndexArt].vencimiento      = ''
        this.articulos[this.editedIndexArt].padre_id         = this.editadoArt.padre_id
        this.articulos[this.editedIndexArt].escombo          = this.editadoArt.escombo
      } else {
        let estaba = false
        for (let i=0; i<=this.articulos.length-1; i++) {
          if (this.articulos[i].articulo_id==this.editadoArt.articulo_id) {
            this.articulos[i].cantidad += this.editadoArt.cantidad
            this.articulos[i].total = this.articulos[i].cantidad*this.articulos[i].precio
            recno = i
            estaba = true
            break
          }
        }
        if (!estaba) {
          this.articulos.push({ 
            id:               0,
            articulo_id:      this.editadoArt.articulo_id,
            codigo:           this.editadoArt.codigo,
            nombre:           this.editadoArt.nombre,
            deposito_id:      this.editadoArt.deposito_id,
            unidad_id:        this.editadoArt.unidad_id,
            moneda_id:        this.editadoArt.moneda_id,
            iva_id:           this.editadoArt.iva_id,
            cantidad:         Number(this.editadoArt.cantidad),
            cantidadoriginal: Number(this.editadoArt.cantidad),
            stock:            this.editadoArt.stock,
            undstock:         Number(this.editadoArt.cantidad),
            costo:            this.editadoArt.costo,
            precio:           this.editadoArt.precio,
            preciooriginal:   this.editadoArt.preciooriginal,
            tasadescuento:    this.editadoArt.tasadescuento,
            importedescuento: this.editadoArt.importedescuento,
            total:            this.editadoArt.total,
            texto:            '',
            vencimiento:      '',
            adevolver:        0,
            padre_id:         this.editadoArt.padre_id,
            undenvase:        this.editadoArt.undenvase,
            escombo:          this.editadoArt.escombo,
          })
          recno = this.articulos.length-1
        }
      }
      if (!this.dialogArtNot) {
        this.calculos()
      } else {
        const a = HTTP().post('/anotadordeventasitems/'+this.anotadorId, {articulos: this.articulos[recno]})
          .then(({ data }) => {
            this.calculos()
            return data
        })
      }
      this.$refs.buscar.focus()
      if (this.editedIndexArt == -1) {
        if (this.dialogArtNot) {
          this.nuevoArtNot()
        } else {
          this.nuevoArt()
        }
      } else {
        this.dialogArt = false;
      }
    },





    borrarArt(item) {
      this.itemActual = item
      if (this.dialogNot) {
        this.editedIndexNot = this.articulos.indexOf(item)
        this.msg.msgTitle = 'Borrar Item del Anotador'
        this.msg.msgBody = 'Desea borrar este Item del Anotador de Ventas?'
      } else {
        this.msg.msgTitle = 'Borrar Item'
        this.msg.msgBody = 'Desea borrar este Item?'
      }
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },





    borrarLineaComprobante(item) {
      let pos = this.articulos.indexOf(item)
      this.articulos.splice(pos,1);
      this.calculos()
    },





    calculos() {
      let gra = 0
      let exe = 0
      let iva = 0
      let tas = 0
      let des = 0
      let posiva = 0
      let val = this.medpag[1].total+this.medpag[2].total+this.medpag[4].total+this.medpag[5].total+this.medpag[6].total+this.medpag[7].total
      if (this.articulos.length>0) {
        this.editado.importedescuento = 0
        this.editado.gravado = 0
        this.editado.exento = 0
        this.editado.iva = 0
        this.editado.total = 0
        this.rentabilidad = 0
        let graRecargo = 0
        let base = 0
        debugger
        for(let i=0; i<=this.articulos.length-1; i++) {
          if (i==0) {
            graRecargo = this.recargo/1.21
          } else {
            graRecargo = 0
          }
          base = this.articulos[i].total+graRecargo
          if (this.editado.tasadescuento>0) {
            des = this.roundTo(base*(Number(this.editado.tasadescuento)/100),2)
            base = this.roundTo(base - des,2)
          }
          if (this.articulos[i].iva_id==2) {
            exe = base
          } else {
            gra = base
            tas = 0
            let posiva = this.ivaTasas.map(function(e) { return e.id; }).indexOf(this.articulos[i].iva_id);
            tas = this.ivaTasas[posiva].tasa
            if (this.articulos[i].iva_id != '') {
              tas = this.ivaTasas[posiva].tasa
            }
            if (this.sucursalDemo) {
              iva = 0
            } else {
              iva = (base*(1+(tas/100)))-base
            }
          }
          this.rentabilidad += 
            this.roundTo((((this.articulos[i].precio-this.articulos[i].costo)*this.articulos[i].cantidad)-this.articulos[i].importedescuento),2)
          this.editado.importedescuento += des
          this.editado.gravado += gra
          this.editado.exento += exe
          this.editado.iva += iva
          this.editado.total += exe+gra+iva
        }
        if (this.recargo>0) {
          let xgra = 0
          let xiva = 0
        }
        this.rentabilidad -= this.editado.importedescuento
        this.rentabilidad = this.roundTo(this.rentabilidad,2)
        this.editado.importedescuento = this.roundTo(this.editado.importedescuento,2)
        this.editado.gravado = this.roundTo(this.editado.gravado,2)
        this.editado.exento = this.roundTo(this.editado.exento,2)
        this.editado.iva = this.roundTo(this.editado.iva,2)
        this.editado.total = this.roundTo(this.editado.total,2)
      }
      if (this.ctacte && this.disponible>0) {
        this.valores = this.valores.filter(function(valor) {
          return valor.medio_id != 4
        })
        if (this.disponible>this.editado.total) {
          this.medpag[3].total = (this.editado.total-(this.medpag[0].total+val))
          this.cargoValorInicialEnValores(this.caja, null, this.medpag[3].total, 4)
        } else {
          this.medpag[3].total = this.disponible
          this.cargoValorInicialEnValores(this.caja, null, this.disponible, 4)
        }
      } else {
        this.medpag[0].total = (this.editado.total-(this.medpag[3].total+val))  
      }
    },





    elValorEstaOk() {
      this.medioDePagoOk = true
/*
         1 -> Efectivo
         2 -> Tarj. de Credito
         3 -> Tarj. de Debito
         4 -> Cta.Cte.
         5 -> Transferencia
         6 -> Cheque
         7 -> Mercado Pago
         8 -> Todo Pago
*/
      if (this.medioDePagoId==1) {          // EFECTIVO
        if (this.editadoMed.importe==0) {
          this.medioDePagoOk = false
        }
      } else if (this.medioDePagoId==2||this.medioDePagoId==3) {   // TARJETA DE DEBITO/CREDITO
      } else if (this.medioDePagoId==5) {   // TRANSFERENCIA
      } else if (this.medioDePagoId==6) {   // CHEQUE
        if (!this.editadoMed.cuit||
            !this.editadoMed.cuenta||
            !this.editadoMed.banco_id||
            !this.editadoMed.nrovalor||
            !this.editadoMed.fechafinanciera) {
              this.medioDePagoOk = false
            }
      } else if (this.medioDePagoId==7) {   // MERCADO PAGO
      } else if (this.medioDePagoId==8) {   // TODO PAGO
      }
    },





    guardarMed() {
      debugger
      let txt  = ''
      let xtar = 0
      let xban = 0
      let xcue = 0
      if (this.medioDePagoId==6) {     // CHEQUE DE TERCERO
        for (let i=0; i<=this.banItems.length-1; i++) {
          if (this.banItems[i].id==this.editadoMed.banco_id) {
            xban = i
            break
          }
        }
      } else if (this.medioDePagoId==3) {
        for (let i=0; i<=this.medios.length-1; i++) {
          if (this.medios[i].id==this.editadoMed.id) {
            xtar = i
            break
          }
        }
      } else if (this.medioDePagoId==5) {
        for (let i=0; i<=this.cueMiasItems.length-1; i++) {
          if (this.cueMiasItems[i].id==this.editadoMed.cuentadestino_id) {
            xcue = i
            break
          }
        }
      }
      if (this.medioDePagoId==1) {                            // efectivo
        txt = 'COBRO EN EFECTIVO'
      } else if (this.medioDePagoId==3) {                     // tarjeta
        txt = this.medios[xtar].tarjetanombre+' - '
        txt += this.medios[xtar].nombrebanco
      } else if (this.medioDePagoId==4) {                     // cuenta corriente
        txt = 'CUENTA CORRIENTE'
      } else if (this.medioDePagoId==6) {                     // cheque
        txt = this.banItems[xban].nombre+' - '
        txt += 'CUENTA: ' + this.editadoMed.cuenta+' - '
        txt += 'NRO: '+this.editadoMed.nrovalor+' - '
        txt += 'FECHA: '+this.editadoMed.fechafinanciera
      } else if (this.medioDePagoId==5) {                     // bnaco
        txt = this.cueMiasItems[xcue].nombre+' - '
        txt += 'CUENTA: ' + this.cueMiasItems[xcue].cuenta
      }
      if (this.editedIndexMed == -1) {
        let fecfin = null
        if (this.editadoMed.fechafinanciera!=null) {
          fecfin = moment(this.editadoMed.fechafinanciera).format('YYYY-MM-DD')
        }
        this.valores.push({ 
          caja_id:           this.caja,
          medio_id:          this.medioDePagoId,
          cuentaorigen_id:   this.editadoMed.cuentaorigen_id,
          cuentadestino_id:  null,
          cuentacheque_id:   null,
          cuentatarjeta_id:  this.editadoMed.cuentatarjeta_id,
          banco_id:          this.banItems[xban].id,
          tarjeta_id:        this.editadoMed.tarjeta_id==null ? null : this.editadoMed.tarjeta_id,
          cpregreso_id:      null,
          cpringreso_id:     null,
          librador_id:       null,
          librador_medio_id: null,
          cheque_id:         null,
          fechafinanciera:   fecfin,
          fechasalida:       null,
          importe:           Number(this.editadoMed.importe),
          nrovalor:          this.editadoMed.nrovalor,
          tipo:              'I',
          observ:            txt,
          medioNombre:       this.medioDePagoNombre,
          cuenta:            this.editadoMed.cuenta,
          cuit:              this.editadoMed.cuit,
          nombre:            this.editadoMed.nombre,
          recargo:           this.editadoMed.recargo,
        })
      } else {
      }
      for (let i=0; i<=this.medpag.length-1; i++) {
        this.medpag[i].total = 0
      }
      // RECORRO TODOS LOS VALORES Y LOS AGREGO EN medpag
      let med = 0
      let tot = 0
      for (let i=0; i<=this.valores.length-1; i++) {
        tot += (this.valores[i].importe)
      }
      // ESTE ES EL % POR EL CUAL TENGO QUE RECALCULAR LOS PRECIOS
      this.recargo = 0
      if (tot>this.editado.total && this.editado.cpr.substr(0,3)=='FAC') {
        this.recargo = this.roundTo(tot-this.editado.total,2)
      }
      for (let i=0; i<=this.valores.length-1; i++) {
        med = this.valores[i].medio_id
        this.medpag[med-1].total += Number(this.valores[i].importe)
      }
      this.calculosMed()
      if (this.recargo>0) {
        this.calculos()
      }
      this.dialogMed = false
    },





    guardarPed(item) {
      const a = HTTP().post('/actualizopedidoitems/'+this.itemActual.id, { articulos: this.artPed })
        .then(({ data }) => {
          this.dialogPed = false
          this.listarHTTP(true)
        })
    },





    guardarTransfPed(item) {
      return HTTP().post('/transfieropedido/'+this.itemActual.id, 
        { sucursales: this.sucursales,
          sucursal: this.artTransfPedId,
          itemactual: this.itemActual,
          articulos: this.artTransfPed,
        })
        .then(({ data }) => {
          this.dialogTransferirPedido = false
          this.listarHTTP(false)
        })
    },





    cancelarArt() {
      this.dialogArt = false;
    },





    cancelarArtNot() {
      this.dialogArtNot = false;
    },





    cerrarArtNot() {
      this.dialogNot = false;
    },





    cerrarEmbalajes() {
      this.dialogEmbalajes = false;
    },





    cerrarEnvio() {
      this.dialogEnvios = false;
    },





    cerrarRetiro() {
      this.dialogRetiro = false;
    },





    cerrarAnularPedido() {
      this.dialogAnularPedido = false;
    },





    cancelarPed() {
      this.dialogPed = false;
    },





    cancelarTransfPed() {
      this.dialogTransferirPedido = false;
    },





    cancelarNdcxDev() {
      this.dialogNdcxDev = false;
    },




    cancelarMed() {
      this.dialogMed = false;
    },





    //////////////////////////////
    // METODOS FUNCIONES VARIAS //
    //////////////////////////////
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





    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
          if (this.dialogNot) {
            return HTTP().delete('/borraritemanotador/'+this.anotadorId+'/'+this.articulos[this.editedIndexNot].articulo_id)
              .then((data) => {
                this.msg.msgVisible = false;
                this.listarAnotaciones()
              });
          } else {
            this.borrarLineaComprobante(this.itemActual)
          }
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS') {
          this.exportExcel()
        } else if (this.msg.msgAccion=='facturar anotaciones de ventas') {
          this.altaHTTP('anotaciones')
          this.articulos = []
        } else if (this.msg.msgAccion=='cobrar comprobante') {
          this.altaHTTP('recibo')
        } else if (this.msg.msgAccion=='anular recibo') {
          this.anularReciboHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='anular presupuesto') {
          this.anularPresupuestoHTTP('recibo')
        } else if (this.msg.msgAccion=='anular pedido') {
          this.anularPedidoHTTP()
        } else if (this.msg.msgAccion=='cliente vinculado') {
          if (this.dondeEstoy=='F') {
            this.$refs.cliente.focus()
          } else if (this.dondeEstoy=='R') {
            this.$refs.clienterecibo.focus()
          }
        } else if (this.msg.msgAccion=='saldo insuficiente') {
          this.dialog = false
        } else if (this.msg.msgAccion=='pedido a embalaje') {
          this.aEmbalajeHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='pedidos embalados') {
          this.aPedidosEmbaladosHTTP()
        } else if (this.msg.msgAccion=='enviar pedido al cliente') {
          this.aEnviarHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='finalizar y enviar pedido al proveedor') {
          this.enviarPedidoDelVendedor(this.itemActual)
        } else if (this.msg.msgAccion=='retirar pedido') {
          this.aRetirarHTTP(this.itemActual)
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





    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },





    getColorTotal (item) {
      let tieneNdc = false
      if (item.pendientes!=null) {
        for (let i=0; i<= item.pendientes.length-1; i++) {
          if (item.pendientes[i].cancelaciones!=null) {
            for (let j=0; j<=item.pendientes[i].cancelaciones.length-1; j++) {
              if (item.pendientes[i].cancelaciones[j].cancelador.cpr.substr(0,3)=='NDC') {
                tieneNdc = true
                break
              }
            }
          }
        }
      }
      return (tieneNdc) ? this.temas.forms_btn_inactivo_bg : this.temas.barra_lateral_bg
    },





    getEstadoPed (estado, accion) {
      let c = ''
      let e = ''
      if (estado==='T') {
        e = 'total'
        c = 'green'
      } else if (estado==='P') {
        e = 'Parcial'
        c = 'blue'
      } else if (estado==='N') {
        e = 'Sin Stock'
        c = 'black'
      }
      if (accion==='c') {
        return c
      } else {
        return e
      }
    },





    getEstadoAnotador ( importe ) {
      return importe==0 ? 'black' : this.temas.barra_principal_botonapp_bg
    },





    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },





    formatoFecha(value) {
      return moment(String(value)).format('L')
    },





    formatoFechaCorta(value) {
      //return moment(string(value)).format('d')
      let a = moment(String(value)).format('dd')
      let b = moment(String(value)).format('DD') 
      return a+' '+b
      //return moment(String(value)).format('dddd, MM')
    },





    fechaTimeLine(value) {
      return moment(String(value)).format('D MMM-YY h:mm a')
    },





    exportExcel: function () {
      let data = XLSX.utils.json_to_sheet(this.items)
      const workbook = XLSX.utils.book_new()
      const filename = this.modelo
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)
    },





    exportarAPDF () {
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





    chequearAfip () {
      return HTTP().post('chequearafip', {
        cuit: this.datosEmpresa.cuit,
        produccion: this.datosEmpresa.faeproduccion,
      })
      .then((res) => {
        this.msg.msgTitle = 'Servicio de AFIP'
        let msg = ''
        if (res.data=='error') {
          msg = 'El servicio de AFIP esta INACTIVO' 
          msg += '<br>Deberá esperar a que se reestablezca o en su defecto realizar '
          msg += 'comprobantes manuales.'
        } else {
          msg += '<br>Los servidores de AFIP estan ACTIVOS y respondieron correctamente.<br><br>'
          msg += 'Si aún así presenta problemas en la emisión o consulta de comprobantes electronicos '
          msg += 'espere y vuelva a intentar<br>'
        }
        this.msg.msgBody    = msg
        this.msg.msgVisible = true
        this.msg.msgAccion  = 'Servicio de AFIP'
        this.msg.msgButtons = ['Aceptar']
      })
    },





    setGrillaPrincipal() {
      this.headers = [
        { text: 'COMPROBANTE', value:'cpr', align: 'left', width: 175 },
        { text: 'FECHA', value:'fecha', align: 'left', width: 90 },
        { text: 'CLIENTE', value: 'tercero.razon_social', align: 'left', width: 230 },
        { text: 'DESC', value:'importedescuento', align: 'end', width: 110 },
        { text: 'TRN', value:'rentabilidad', align: 'end', width: 110 },
        { text: 'PENDIENTE', value:'pendientes[0].pendiente', align: 'end', width: 120 },
        { text: 'TOTAL', value:'total', align: 'end', width: 150 },
        { text: 'ESTADO', value:'estado', align: 'left', width: 110 },
        { text: 'OPC', value: 'accion', sortable: false, width: 50 },
      ]
      if (this.filtroComprobanteSel=='Pedidos') {
        if (this.operarioVendedor) {
          this.headers[2].value = 'user.tercero.razon_social'
          this.headers[5].text = 'PEDIDO POR'
          this.headers[5].value = 'observaciones'
        } else {
          this.headers[2].value = 'tercero.razon_social'
          this.headers[5].text = 'PEDIDO POR'
          this.headers[5].value = 'observaciones'
        }
      }
    },





    buscarFacturasParaRemito() {
      return HTTP().post('facturaspararemito', { tercero_id: this.editado.tercero_id })
      .then((data) => {
        this.facturas = []
        if (data.data[0].length>0) {
          this.facturas = data.data[0].filter(item => item.remito === 0 )
          if (this.facturas.length>0) {
            this.dialogSelFacturas = true
          }
        }
      })
    },





    cerrarFacturasParaRemito() {
      this.dialogSelFacturas = false
    },





    selectAll(event) {
      if (event.value) {
        this.selected = this.facturas
      } else {
        this.selected = []
      }
    },





    selectAllChq(event) {
      this.nddTotal = 0
      if (event.value) {
        this.selected = this.cheques
        for (let i=0; i<=this.cheques.length-1; i++) {
          this.nddTotal += this.cheques[i].importe
        }
      } else {
        this.selected = []
      }
    },





    confirmarFacturasSeleccionadas() {
      this.articulos = []
      this.dialogSelFacturas = false
      let idFacSel = []
      for (let i=0; i<=this.selected.length-1; i++) {
        idFacSel.push(this.selected[i].id)
      }
      return HTTP().post('cargofacturaspararemito', { idFacSel: idFacSel })
      .then((item) => {
        for (let i=0; i<=item.data.length-1; i++) {
          let pos = this.articulos.findIndex(x => x.articulo_id === item.data[i].articulo_id);
          if (pos==-1) {
            this.articulos.push({ 
              id:               item.data[i].id,
              articulo_id:      item.data[i].articulo_id,
              codigo:           item.data[i].articulo.codigo,
              nombre:           item.data[i].articulo.nombre,
              deposito_id:      this.editado.deposito_id,
              unidad_id:        item.data[i].articulo.unidad_id,
              moneda_id:        item.data[i].articulo.moneda_id,
              iva_id:           item.data[i].articulo.iva_id,
              cantidad:         Number(item.data[i].cantidad),
              cantidadoriginal: Number(item.data[i].cantidad),
              stock:            0,
              undstock:         Number(item.data[i].cantidad),
              costo:            item.data[i].costo,
              precio:           item.data[i].precio,
              preciooriginal:   item.data[i].precio,
              tasadescuento:    item.data[i].tasadescuento,
              importedescuento: item.data[i].importedescuento,
              total:            item.data[i].total,
              texto:            item.data[i].texto,
              vencimiento:      item.data[i].vencimiento,
              adevolver:        0,
              padre_id:         null,
              undenvase:        item.data[i].articulo.undenvase,
              escombo:          item.data[i].articulo.escombo,
            })
          } else {
            this.articulos[pos].cantidad += Number(item.data[i].cantidad)
            this.articulos[pos].cantidadoriginal += Number(item.data[i].cantidad)
            this.articulos[pos].stock += Number(item.data[i].cantidad)
            this.articulos[pos].undstock += Number(item.data[i].cantidad)
            this.articulos[pos].total += Number(item.data[i].total)
          }
        }
        this.calculos()
      })
    },





    verCprEnAFIPHTTP() {
      return HTTP().post('vercprenafip', {
        comprobante_id: this.itemActual.comprobante_id,
        sucursal: parseInt(this.itemActual.cpr.substr(7,4)),
        numero: parseInt(this.itemActual.cpr.substr(12,8)),
        cuit: this.datosEmpresa.cuit,
        produccion: this.datosEmpresa.faeproduccion,
      })
      .then((res) => {
        this.msg.msgTitle = 'Informe de Comprobante en AFIP'
        let msg = ''
        if (res.data=='error') {
          msg = 'El servicio de AFIP esta INACTIVO' 
          msg += '<br>Deberá esperar a que se reestablezca o en su defecto realizar '
          msg += 'comprobantes manuales.'
        } else {
          msg += '<br>Cbte:<b>'+res.data.CbteDesde+'</b><br>'
          msg += 'CAE:<b>'+res.data.CodAutorizacion+'</b><br>'
          if (res.data.Concepto==1) {
            msg += 'Tipo: <b>Comercializacion de Mercaderias</b><br><br>'
          } else if (data.Concepto==2) {
            msg += 'Tipo: <b>Servicio Prestado</b><br><br>'
          } else {
            msg += 'Tipo: <b>Comercializacion de Mercaderías y Servicio Prestado</b><br><br>'
          }
          msg += 'Importes<br>'
          msg += 'NETO: <b>$'+this.formatoImporte(res.data.ImpNeto)+'</b><br>'
          msg += 'EXENTO: <b>$'+this.formatoImporte(res.data.ImpOpEx)+'</b><br>'
          msg += 'OTROS: <b>$'+this.formatoImporte(res.data.ImpTotConc)+'</b><br>'
          msg += 'IVA: <b>$'+this.formatoImporte(res.data.ImpIVA)+'</b><br>'
          msg += 'TOTAL: <b>$'+this.formatoImporte(res.data.ImpTotal)+'</b><br><br>'
          msg += 'Cantidad de Alicuotas: <b>'+res.data.Iva.AlicIva.length+'</b><br>'
          for (let i=0; i<=res.data.Iva.AlicIva.length-1; i++) {
            msg += 'BaseImp: <b>$'+this.formatoImporte(res.data.Iva.AlicIva[i].BaseImp)+'</b> '
            msg += 'IVA: <b>$'+this.formatoImporte(res.data.Iva.AlicIva[i].Importe)+'</b> '
            msg += 'Codigo: <b>'+res.data.Iva.AlicIva[i].Id+'</b><br>'
          }
          if (res.data.CbtesAsoc!=undefined) {
            msg += '<br>Comprobante Asociado<br>'
            msg += 'Número: <b>'+res.data.CbtesAsoc.CbteAsoc[0].Nro+'</b><br>'
          }
        }
        this.msg.msgBody    = msg
        this.msg.msgVisible = true
        this.msg.msgAccion  = 'Servicio de AFIP'
        this.msg.msgButtons = ['Aceptar']
      })
    },





    isArray(array) {
      if (toString.call(array) === "[object Array]") {
        return true;
      } else if ( typeof array.length === "number" ) {
        return true;
      }
      return false;
    },





    whatsapp(item) {
      let code = '54'
      let phone = '3584363612'
      let msg = 'Desde el programa!!!'
      /* this is the magic */
      window.open(`https://api.whatsapp.com/send?phone=${code}${phone}&text=${msg}`,"_blank");
    },





    setSucManual() {
      this.sucManual = this.sucManual.padStart(4,'0')
    },





    setNroManual() {
      this.nroManual = this.nroManual.padStart(8,'0')
    },





    busManual() {
      let cpr = this.editado.cpr+'-'+this.editado.letra+' '+this.sucManual+'-'+this.nroManual
      return HTTP().post('existeelcpr', { cpr: cpr })
      .then((data) => {
        if (data.data[0].length>0) {
          this.msg.msgTitle = 'Error'
          this.msg.msgBody = '¡El comprobante '+cpr+' ya existe!.<br>VERIFICA</br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'El comprobante ya existe'
          this.msg.msgButtons = ['Aceptar']
        }
      })

    },





    print(item) {
      this.$refs.impresion.ventasPrint(item, 'yo');
    },





    printDetalles(item) {
      this.$refs.impresion.ventasPrintDetalles(item);
    },





    clickRow(value) {
      if (value.value) {
        this.nddTotal += value.item.importe
      } else {
        this.nddTotal -= value.item.importe
      }
    },





    printEmbalajes(itemRes) {
      let orientacion ='p'
      let headersRes = []
      if (this.grpEmbalaje=='Sin agrupar') {
        orientacion = 'l'
        headersRes = [
          { title: 'Cliente', dataKey:'nomcli' },
          { title: 'Comprobante', dataKey: 'cpr'},
          { title: 'Código', dataKey: 'codigo'},
          { title: 'Descripción', dataKey: 'nomart'},
          { title: 'Cantidad', dataKey: 'cantidad'},
          { title: 'Zona', dataKey:'zona' }]
      } else if (this.grpEmbalaje=='Artículos') {
        headersRes = [
          { title: 'Codigo', dataKey:'codigo' },
          { title: 'Descripción', dataKey: 'nomart'},
          { title: 'Cantidad', dataKey: 'cantidad'}]
      } else if (this.grpEmbalaje=='Artículos y Zonas') {
        headersRes = [
          { title: 'Codigo', dataKey:'codigo' },
          { title: 'Descripción', dataKey: 'nomart'},
          { title: 'Zona', dataKey: 'zona'},
          { title: 'Cantidad', dataKey: 'cantidad'}]
      }
      var doc = new jsPDF('l', 'pt')  // 'p' normal 'l' horizontal ( landscape )
      const totalPagesExp = '{total_pages_count_string}'
      const emp = this.empresa
      const tit = this.grpEmbalaje
      let possuc = 0
      for (let i=0; i<=this.sucursales.length-1; i++) {
        if (this.sucursales[i].id == this.sucursal) {
          possuc = i
          break
        }
      }
      let av    = 'images/'+this.sucursales[possuc].logotipo
      doc.autoTable(headersRes, this.aEmbalar, {
        didDrawPage: function (data) {
          var img = new Image()
          img.src = av
          doc.addImage(img, 'jpg', 40, 28, 122, 45)
          var str = "Página " + doc.internal.getNumberOfPages()
          if (typeof doc.putTotalPages === 'function') {
            str = str + " de " + totalPagesExp;
          }
          doc.setFontSize(14);
          doc.setFontSize(16);
          doc.text ( tit, 180, 47 )
          doc.setFontSize(8);
          doc.text ( 'gohu', orientacion == 'p' ? 565 : 785, 15 )
          doc.setFontSize(9);
          var pageSize = doc.internal.pageSize;
          var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight();
          doc.text(str, data.settings.margin.left, pageHeight - 10);
        },
        margin: {top: 100, bottom: 15},
        headStyles: {
          fillColor: [23, 23, 23], fontSize: 8,
        },
        styles: {
          fillColor: [236, 233, 223], fontSize: 8,
        },
        showHeader: true,
        columnStyles: {
          cantidad: { halign: 'left', width: 160, },
          styles: {fillColor: [100, 255, 255], fontSize: 8 },
          columnStyles: { id: {fillColor: 125} },
        },
      });
      if (typeof doc.putTotalPages === 'function') {
        doc.putTotalPages(totalPagesExp);
      }
      doc.output ('dataurlnewwindow')
    },
  },
};
</script>





<style scoped lang="scss">
  .v-select__selections input { 
    display: none;
  }
  .select {
    min-width: 95px;
    max-width: 95px;
  }
  .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
    box-shadow: none;
  }
  .v-data-table > .v-data-table__wrapper tbody tr.v-data-table__expanded__content {
    box-shadow: none;
  }
  .panel-font {
    /*font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;*/
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    /*font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;*/
    font-size: 100%;
  }
  .noti-font {
    font-family: Verdana, Arial, Helvetica, sans-serif;
/*    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;*/
    font-size: 90%;
  }
  .mini-font {
    /*font-family: Verdana, Arial, Helvetica, sans-serif;*/
/*    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;*/
    font-size: 84%;
  }
  .text-green {
    color: rgba(169, 169, 169, 0.33);
  }
  .lafuente {
    font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
  }

  // 10003
</style>