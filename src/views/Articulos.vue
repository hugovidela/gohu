<!--
:options.sync= "pagination"
:server-items-length="totalItems"
-->
<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        dense
        :loading="loading"
        :footer-props="{
          itemsPerPageOptions: [8], // -> Add this example
          showFirstLastPage: true,
        }"
        @click:row="clickRow"
        class="elevation-1">
        <template v-slot:top>
          <v-toolbar text
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
                  <v-btn v-show="!externo || (externo && $store.state.tipo!='MI')"
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="nuevoArticulo(false)" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Nuevo</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn v-show="!externo || (externo && $store.state.tipo!='MI')"
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="nuevoArticulo(true)" v-on="on">
                    <v-icon>mdi-vector-arrange-below</v-icon>
                  </v-btn>
                </template>
                <span>Nuevo Combo</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="exportarAXLS" v-on="on">
                    <v-icon>mdi-file-excel</v-icon>
                  </v-btn>
                </template>
                <span>Enviar a Excel</span>
              </v-tooltip>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_xls_bg"
                    :dark="temas.forms_btn_xls_dark==true"
                    class="mr-2"
                    @click="exportarAPDF" v-on="on">
                    <v-icon>mdi-file-outline</v-icon>
                  </v-btn>
                </template>
                <span>Enviar a PDF</span>
              </v-tooltip>
            </template>

            <v-toolbar-title class="body-1 white--text">
              Mis Artículos
              <span v-show="$store.state.vinculosHijos.length">
                <v-icon>mdi-share-variant</v-icon>
                con {{ $store.state.vinculosHijos.length }}
                {{$store.state.vinculosHijos.length>1?' usuarios':' usuario'}}
              </span>
            </v-toolbar-title>
            <v-spacer></v-spacer>

            <!--  Modal del diálogo para Alta y Edicion    -->
            <v-dialog v-model="dialog" :fullscreen="true" persistent>
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <!-- para el EDICION-->
                <v-toolbar text
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cancelar">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="headdline">{{ formTitle }}
                    <b v-if="$store.state.tipo=='MD'">
                      <v-icon>mdi-share-variant</v-icon>
                      con {{ $store.state.vinculosHijos.length }} usuario/s
                    </b>
                  </span>
                  <v-spacer></v-spacer>
                  <!--<div v-if="elArticuloEsMio || editedIndex===-1">-->
                  <div>
                    <v-btn v-if="!(!elArticuloEsMio && editado.escombo==1)"
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class="ma-2 white--text" @click="guardar(false)">
                      Guardar
                    </v-btn>
                  </div>
                </v-toolbar>
                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="2" xl="2" lg="2" md="3" sm="12" xs="12" class="pt-0 pb-0">
                          <v-text-field
                            ref="codigo"
                            :color="temas.forms_titulo_bg"
                            :disabled="!(editedIndex===-1)"
                            :autofocus="(editedIndex===-1)"
                            v-model="editado.codigo"
                            label="Codigo"
                            required
                            :rules="codigoRules"
                            :counter="15"
                            maxlength="15"
                            v-on:keydown.tab="buscoCodigo">
                          </v-text-field>
                        </v-col>
                        <v-col cols="7" xl="7" lg="7" md="9" sm="12" xs="12" class="pt-0 pb-0">
                          <v-text-field
                            ref="nombre"
                            :disabled="!elArticuloEsMio"
                            v-model="editado.nombre"
                            :autofocus="(editedIndex===0)"
                            label="Nombre"
                            required
                            :color="temas.forms_titulo_bg"
                            :rules="nombreRules"
                            :counter="80"
                            maxlength="80">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" xl="2" lg="2" md="6" sm="12" xs="12" class="pt-0 pb-0">
                          <v-text-field
                            disabled
                            class="caption"
                            v-model="editado.creador.username"
                            :color="temas.forms_titulo_bg"
                            label="Creador">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" xl="1" lg="1" md="6" sm="12" xs="12"
                          class="body-2 pt-0 pb-0">
                          <v-switch
                            label="Es Combo"
                            disabled
                            :color="temas.forms_titulo_bg"
                            v-model="editado.escombo">
                          </v-switch>
                        </v-col>
                      </v-row>

                      <v-tabs key="pri" :color="temas.forms_titulo_bg" class="pt-0">
                        <v-tab href="#general">
                          Datos Generales
                        </v-tab>
                        <v-tab-item value="general">

                          <v-row no-gutters>
                            <v-col cols="3">
                              <v-card class="pa-2 pt-0" outlined tile>
                                <v-row align="center">
                                  <v-col cols="12" sx="12" mx="12" class="body-2 pt-0 pb-0">
                                    <v-switch
                                      label="Activo"
                                      :color="temas.forms_titulo_bg"
                                      v-model="editado.activo">
                                    </v-switch>
                                  </v-col>
                                  <v-col cols="12" sm="12" class="pt-0 pb-0">
                                    <v-select
                                      v-model="editado.rubro_id"
                                      :items="rubItems"
                                      :color="temas.forms_titulo_bg"
                                      :item-color="temas.forms_titulo_bg"
                                      item-value="id"
                                      item-text="nombre"
                                      label="Rubro"
                                      @change="actualizoGrupos()">
                                    </v-select>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sx="12" mx="12" class="pt-0 pb-0">
                                    <v-card outlined>
                                      <span class="pl-2">Grupo</span>
                                      <v-chip
                                        class="ma-2"
                                        @click="clickEnGrupo">
                                        {{ nombreDelGrupo }}
                                      </v-chip>
                                    </v-card>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sx="12" mx="12" class="pt-0 pb-0">
                                    <v-autocomplete
                                      class="body-2"
                                      v-model="precio.marca_id"
                                      :color="temas.forms_titulo_bg"
                                      :items="itemsMarcas"
                                      :loading="isLoadingMarcas"
                                      :search-input.sync="searchMarcas"
                                      item-text="nombre"
                                      item-value="id"
                                      label="Marca"
                                      placeholder="Escriba para buscar"
                                      prepend-icon="mdi-database-search">
                                    </v-autocomplete>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12" class="pb-0">
                                    <v-combobox
                                      v-model="tagsValue"
                                      :items="tagsItems"
                                      outlined
                                      chips label="Tags" multiple
                                      @change="checkRegla()">
                                      <template v-slot:selection="{ attrs,item,select,selected}">
                                        <v-chip
                                          v-bind="attrs"
                                          :input-value="selected"
                                          close
                                          @click="select"
                                          @click:close="removeTag(item)">
                                          <strong>{{ item }}</strong>&nbsp;
                                        </v-chip>
                                      </template>
                                    </v-combobox>
                                  </v-col>
                                </v-row>
                                <v-row class="pt-0">
                                  <v-col cols="12" sm="12" md="12">
                                    <span><strong>Reglas en la que Impacta</strong></span>
                                  </v-col>
                                </v-row>
                                <v-row v-for="(regla) in reglasImpacta" :key="regla.codigo"
                                  class="pt-0">
                                  <v-col cols="12" sm="12" md="12">
                                    <span>{{regla.id}} - {{regla.nombre}}</span>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>
                            <v-col cols="3">
                              <v-card class="pa-2 pt-0" outlined tile>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                                    <barcode
                                      :tag="tag"
                                      :value="editado.codbar">
                                    </barcode>
                                    <v-text-field
                                      ref="nombre"
                                      v-model="editado.codbar"
                                      :disabled="!elArticuloEsMio"
                                      label="Código de Barra"
                                      :color="temas.forms_titulo_bg"
                                      required
                                      :counter="14"
                                      maxlength="14"
                                      class="pt-0 pb-0">
                                    </v-text-field>
                                    <v-btn
                                      :color="temas.forms_titulo_bg"
                                      :disabled="!elArticuloEsMio"
                                      class="pt-0 pb-0 ma-2 white--text"
                                      @click="cancelar">
                                      Crear código propio
                                    </v-btn>
                                    <v-switch
                                      label="Es un CodBar Original"
                                      :disabled="!elArticuloEsMio"
                                      :color="temas.forms_titulo_bg"
                                      v-model="editado.codbaroriginal"
                                      class="pt-0 pb-0">
                                    </v-switch>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>
                            <v-col cols="3">
                              <v-card class="pa-2 pt-0 pb-0" outlined tile>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-textarea
                                      v-model="editado.descripcion"
                                      :disabled="!elArticuloEsMio"
                                      class="caption"
                                      :color="temas.forms_titulo_bg"
                                      label="Descripcion">
                                    </v-textarea>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-autocomplete
                                      class="body-2 pt-0 pb-0"
                                      v-model="editado.moneda_id"
                                      :disabled="!elArticuloEsMio"
                                      :color="temas.forms_titulo_bg"
                                      :items="itemsMoneda"
                                      :loading="isLoadingMoneda"
                                      :search-input.sync="searchMoneda"
                                      item-text="nombre"
                                      item-value="id"
                                      label="Moneda"
                                      placeholder="Escriba para buscar"
                                      prepend-icon="mdi-database-search">
                                    </v-autocomplete>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>

                            <v-col cols="3">
                              <v-card class="pa-2 pt-0 pb-0" outlined tile>

                                <v-row v-if="elArticuloEsMio">
                                  <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                                    <v-switch
                                      v-model="ancladoAlDolar"
                                      label="Costo Anclado al Dolar"
                                      :disabled="!elArticuloEsMio || !$store.state.anclarCostos"
                                      :color="temas.forms_titulo_bg"
                                      @click="costoAncladoAlDolar">
                                    </v-switch>
                                  </v-col>
                                </v-row>

                                <v-row v-if="elArticuloEsMio">
                                  <v-col cols="6" sm="6" md="6">
                                    <v-text-field class="pt-0 pb-0"
                                      v-model="$store.state.dolar"
                                      :color="temas.forms_titulo_bg"
                                      disabled
                                      type="number"
                                      label="Ultima cotización">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="6" sm="6" md="6">
                                    <v-text-field class="pt-0 pb-0"
                                      v-model="precio.usd"
                                      :color="temas.forms_titulo_bg"
                                      disabled
                                      type="number"
                                      label="Precio en Dolares">
                                    </v-text-field>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="6" sm="6" md="6">
                                    <v-text-field v-if="!editado.escombo==1"
                                      class="pt-0 pb-0"
                                      :disabled="!elArticuloEsMio"
                                      :color="temas.forms_titulo_bg"
                                      type="number"
                                      v-model="precio.costo"
                                      label="Costo"
                                      @change="calpre()">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="6" sm="6" md="6">
                                    <v-text-field v-if="!editado.escombo==1&&elArticuloEsMio"
                                      class="pt-0 pb-0"
                                      disabled
                                      :color="temas.forms_titulo_bg"
                                      type="number"
                                      v-model="costoAnclado"
                                      label="Costo Anclado">
                                    </v-text-field>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="5" sm="5" md="5">
                                    <v-text-field class="pt-0 pb-0"
                                      :color="temas.forms_titulo_bg"
                                      type="number"
                                      v-model="precio.decimales"
                                      label="Decimales"
                                      :rules="decimalRule"
                                      @change="calpre()"
                                      @click="calpre()">
                                    </v-text-field>
                                  </v-col>
                                  <v-col v-if="elArticuloEsMio&&precio.usd!=0"
                                    cols="7" sm="7" md="7">
                                    <v-chip v-if=
                                      "roundTo(costoAnclado,4)>
                                      roundTo(precio.costo,precio.decimales)
                                      &&!desanclarAutomaticamente"
                                      class="pt-0 pb-0"
                                      color="green" dark>
                                      Aplica Ancla
                                    </v-chip>
                                    <v-chip v-else
                                      class="pt-0 pb-0"
                                      color="red" dark>
                                      No Aplica Ancla
                                    </v-chip>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="5" sm="5" md="5">
                                    <v-text-field v-if="!editado.escombo==1" class="pt-0 pb-0"
                                      v-model="precio.porrem"
                                      label="%Remarcación"
                                      @change="calpre()">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="7" sm="7" md="7">
                                    <v-text-field class="pt-0 pb-0"
                                      v-model="precio.precio"
                                      :disabled="editado.escombo==1"
                                      :color="temas.forms_titulo_bg"
                                      label="PRECIO NETO">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="5" sm="5" md="5">
                                    <v-autocomplete v-if="!editado.escombo==1"
                                      class="pt-0 pb-0 body-2"
                                      v-model="editado.iva_id"
                                      :disabled="!elArticuloEsMio"
                                      :items="itemsAfipIVA"
                                      :loading="isLoadingAfipIVA"
                                      :search-input.sync="searchAfipIVA"
                                      :color="temas.forms_titulo_bg"
                                      item-text="nombre"
                                      item-value="id"
                                      label="IVA"
                                      placeholder="Escriba para buscar"
                                      prepend-icon="mdi-database-search"
                                      @change="calpre()">
                                    </v-autocomplete>
                                  </v-col>
                                  <v-col cols="7" sm="7" md="7">
                                    <v-text-field
                                      class="pt-0 pb-0"
                                      v-model="precio.publico"
                                      :disabled="editado.escombo==1"
                                      :color="temas.forms_titulo_bg"
                                      label="PRECIO AL PUBLICO">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-tab-item>

                        <v-tab href="#comercializacion" v-if="!editado.escombo==1">
                          Compra / Venta / Stock
                        </v-tab>
                        <v-tab-item value="comercializacion" v-if="!editado.escombo==1">

                          <v-row class="pt-6">
                            <v-col cols="2" sx="2" mx="2" class="body-2">
                              <v-switch
                                label="Se compra"
                                :color="temas.forms_titulo_bg"
                                :disabled="!elArticuloEsMio"
                                v-model="editado.secompra">
                              </v-switch>
                            </v-col>
                            <v-col cols="3" sx="3" mx="3">
                              <v-autocomplete
                                class="body-2"
                                v-model="editado.unidad_id"
                                :disabled="!elArticuloEsMio"
                                :items="itemsUmCompras"
                                :loading="isLoadingUmCompras"
                                :search-input.sync="searchUmCompras"
                                :color="temas.forms_titulo_bg"
                                item-text="nombre"
                                item-value="id"
                                label="Como se compra"
                                placeholder="Escriba para buscar"
                                prepend-icon="mdi-database-search">
                              </v-autocomplete>
                            </v-col>
                            <!--
                            <v-col cols="2" sm="2" md="2">
                              <v-text-field
                                class="body-2"
                                type="number"
                                :color="temas.forms_titulo_bg"
                                v-model="editado.undstock"
                                :disabled="!elArticuloEsMio"
                                maxlength="15"
                                label="Unidades a Stock"
                                @click="cambioPrecioPorcion"
                                @change="cambioPrecioPorcion">
                              </v-text-field>
                            </v-col>
                            -->
                            <v-col cols="2" sm="2" md="2">
                              <v-text-field
                                class="body-2"
                                type="number"
                                :color="temas.forms_titulo_bg"
                                v-model="editado.undstock"
                                :disabled="!elArticuloEsMio"
                                maxlength="15"
                                label="Unidades a Stock"
                                @click="calpre()"
                                @change="calpre()">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row class="pt-0">
                            <v-col cols="2" sx="2" mx="2" class="body-2">
                              <v-switch
                                label="Viene en envase"
                                :color="temas.forms_titulo_bg"
                                :disabled="!elArticuloEsMio"
                                v-model="editado.esenvase">
                              </v-switch>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" class="pt-0">
                              <v-text-field
                                class="body-2 pt-6"
                                type="number"
                                :color="temas.forms_titulo_bg"
                                :disabled="!elArticuloEsMio"
                                v-model="editado.undenvase"
                                label="Unidades en el envase">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row class="pt-0">
                            <v-col cols="2" sx="2" mx="2" class="body-2">
                              <v-switch
                                label="Se vende"
                                :color="temas.forms_titulo_bg"
                                :disabled="!elArticuloEsMio"
                                v-model="editado.sevende">
                              </v-switch>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" class="pt-0" v-if="dialogPresentacion">
                              <v-text-field
                                class="body-2 pt-6"
                                :color="temas.forms_titulo_bg"
                                :disabled="!elArticuloEsMio"
                                v-model="editado.presentacion"
                                label="Nombre Presentación"
                                :counter="15"
                                maxlength="15">
                              </v-text-field>
                            </v-col>
                          </v-row>

                          <v-row>
                            <v-col cols="2" sx="2" mx="2" class="body-2">
                              <v-switch
                                label="Administra Stock"
                                :color="temas.forms_titulo_bg"
                                :disabled="!elArticuloEsMio"
                                v-model="precio.admstock">
                              </v-switch>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" class="pt-0">
                              <v-text-field
                                class="body-2 pt-6"
                                type="number"
                                :color="temas.forms_titulo_bg"
                                :disabled="!elArticuloEsMio"
                                v-model="precio.exmin"
                                label="Ex.Mínima">
                              </v-text-field>
                            </v-col>
                            <v-col cols="3" sm="3" md="3">
                              <v-select class="pt-3"
                                v-model="precio.sinstock"
                                :items="arrSinStock"
                                :color="temas.forms_titulo_bg"
                                :disabled="!elArticuloEsMio"
                                :item-color="temas.forms_titulo_bg"
                                label="Cuando no hay stock...">
                              </v-select>
                            </v-col>
                            <v-col cols="3" sx="3" mx="3" class="body-2">
                              <v-switch
                                label="Es perecedero"
                                :color="temas.forms_titulo_bg"
                                :disabled="!elArticuloEsMio"
                                v-model="editado.esperecedero">
                              </v-switch>
                            </v-col>
                          </v-row>

                          <!--
                          <v-row>
                            <v-col cols="2" sm="2" md="2">
                              <v-btn
                                class="ma-2 white--text"
                                :color="temas.forms_titulo_bg"
                                @click="verStock">Ver Stocks
                              </v-btn>
                            </v-col>
                            <v-col cols="5" sm="5" md="5">
                              <v-data-table v-if="dialogStk==true"
                                :headers="headersStk"
                                :items="stocks"
                                dense
                                class="elevation-3"
                                hide-default-footer>
                              </v-data-table>
                            </v-col>
                          </v-row>
                          -->

                        </v-tab-item>
<!--
                        <v-tab href="#caracteristicas">
                          Caracteristicas
                        </v-tab>
                        <v-tab-item value="caracteristicas">
                          <p>Caracteristicas</p>
                        </v-tab-item>
-->
<!--
                        <v-tab href="#tags" v-if="!editado.escombo==1">
                          Tags
                        </v-tab>
                        <v-tab-item value="tags" v-if="!editado.escombo==1">
                          <v-row align="center">
                            <v-col cols="12" sm="12" md="12">
                              <v-select
                                v-model="tagsValue"
                                :items="tagsItems"
                                :color="temas.forms_titulo_bg"
                                :item-color="temas.forms_titulo_bg"
                                chips
                                label="Tags"
                                multiple
                                outlined>
                              </v-select>
                            </v-col>
                          </v-row>
                        </v-tab-item>
-->
                        <v-tab href="#presentaciones" v-if="!editado.escombo==1">
                          Presentaciones
                        </v-tab>
                        <v-tab-item value="presentaciones" v-if="!editado.escombo==1">
                          <v-row align="center">
                            <v-col cols="12" sm="12" md="12">
                              <v-data-table
                                :headers="headersPresentaciones"
                                :items="presentaciones"
                                dense
                                class="elevation-3"
                                hide-default-footer>
                                <template v-slot:item.p*recios[0].costo="{ item }">
                                  <span dark>$
                                    {{ formatoImporte(item.precios[0].costo) }}
                                  </span>
                                </template>
                                <template v-slot:item.precios[0].precio="{ item }">
                                  <span dark>$
                                    {{ formatoImporte(sucursalDemo?
                                    item.precios[0].costo:
                                    item.precios[0].precio)}}
                                  </span>
                                </template>
                              </v-data-table>

                            </v-col>
                          </v-row>
                        </v-tab-item>

                        <!-- COMBOS/COMPONENTES -->
                        <v-tab href="#combo" v-if="editado.escombo==1">
                          Combo
                        </v-tab>
                        <v-tab-item value="combo" v-if="editado.escombo==1">

                          <v-card>
                            <v-card-text>
                              <v-container>
                                <v-row class="ma-0 pa-0">
                                  <v-col cols="5" sm="5" md="5" class="ma-0 pa-0">
                                    <v-row>
                                      <v-col cols="3">
                                        <span class="x1">Código</span>
                                      </v-col>
                                      <v-col cols="7">
                                        <span class="x1">Nombre</span>
                                      </v-col>
                                      <v-col cols="2">
                                        <span class="x1">Ctt.</span>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                  <v-col cols="7" sm="7" md="7" class="ma-0 pa-0">
                                    <v-row>
                                      <v-col cols="3">
                                        <span class="x1">Pr.s/IVA</span>
                                      </v-col>
                                      <v-col cols="2">
                                        <span class="x1">% Descuento</span>
                                      </v-col>
                                      <v-col cols="3">
                                        <span class="x1">Importe Descuento</span>
                                      </v-col>
                                      <v-col cols="4">
                                        <span class="x1">Total</span>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <v-col cols="5" sm="5" md="5" class="mt-0 pt-0">
                                    <v-row>
                                      <v-col cols="3" class="mt-0 pt-0">
                                        <v-text-field
                                          class="x1 mt-0 pt-0" dense
                                          :disabled="editedIndexComp>-1 || !elArticuloEsMio"
                                          ref="buscar"
                                          :color="temas.forms_titulo_bg"
                                          autofocus
                                          v-model="busArt"
                                          @keyup.esc="cancelaLinea()"
                                          @focus="$event.target.select()"
                                          @blur="buscarArt(false)">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="7" class="x1 mt-0 pt-0">
                                        <v-text-field
                                          class="x1 mt-0 pt-0"
                                          dense disabled
                                          v-model="edComp.componente.nombre">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="2" class="x1 mt-0 pt-0">
                                        <v-text-field
                                          class="x1 mt-0 pt-0" dense
                                          :disabled="!elArticuloEsMio"
                                          v-model="edComp.cantidad"
                                          ref="cantidad"
                                          @change="cantidadItem()"
                                          @keyup.esc="cancelaLinea()">
                                        </v-text-field>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                  <v-col cols="7" sm="7" md="7" class="x1 mt-0 pt-0">
                                    <v-row>
                                      <v-col cols="3" class="x1 mt-0 pt-0">
                                        <v-text-field
                                          class="x1 mt-0 pt-0" dense disabled
                                          v-model="edComp.precio">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="2" class="x1 mt-0 pt-0">
                                        <v-text-field
                                          class="x1 mt-0 pt-0" dense
                                          :disabled="!elArticuloEsMio"
                                          v-model="edComp.tasadescuento"
                                          @focus="$event.target.select()"
                                          @change="cantidadItem()"
                                          @blur="guardarItem()"
                                          @keyup.esc="cancelaLinea()">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="3" class="x1 mt-0 pt-0">
                                        <v-text-field
                                          class="x1 mt-0 pt-0" dense disabled
                                          v-model="edComp.importedescuento">
                                        </v-text-field>
                                      </v-col>
                                      <v-col cols="4" class="x1 mt-0 pt-0">
                                        <v-text-field
                                          class="x1 mt-0 pt-0" dense disabled
                                          v-model="edComp.total">
                                        </v-text-field>
                                      </v-col>
                                    </v-row>
                                  </v-col>
                                </v-row>

                                <v-row class="pb-0">
                                  <v-col v-show="seleccionarArticulo == true"
                                    cols="12" sm="12" md="12">
                                    <v-data-table
                                      class="elevation-3 pt-0 pb-0"
                                      :headers="headersSelArt"
                                      :color="temas.forms_titulo_bg"
                                      :items="selArt"
                                      dense
                                      single-select
                                      @click:row="selArtClick"
                                      :footer-props="footerProps10">
                                      <template v-slot:item.costo="{ item }">
                                        <span disable
                                          dark>${{ formatoImporte(item.costo) }}
                                        </span>
                                      </template>
                                    </v-data-table>
                                  </v-col>
                                </v-row>

                                <v-row>
                                  <div class="pl-0 pr-0">
                                    <v-data-table
                                      :headers="headersArt"
                                      :items="editado.componentes"
                                      dense
                                      class="elevation-1 pr-0 ml-0"
                                      @click:row="editarComponente">

                                      <template #item.componente.nombre="{ value }">
                                        <div
                                          class="text-truncate"
                                          style="max-width: 245px">
                                          {{ value }}
                                        </div>
                                      </template>

                                      <template v-slot:item.cantidad="{ item }">
                                        <span disable dark>
                                          {{ formatoImporte(item.cantidad) }}
                                        </span>
                                      </template>

                                      <template v-slot:item.precio="{ item }">
                                        <span disable dark>
                                          $ {{ formatoImporte(item.precio) }}
                                        </span>
                                      </template>

                                      <template v-slot:item.total="{ item }">
                                        <span disable dark>
                                          ${{ formatoImporte(item.total) }}
                                        </span>
                                      </template>

                                      <template v-slot:item.tasadescuento="{ item }">
                                        <span disable dark>
                                          %{{ formatoImporte(item.tasadescuento) }}
                                        </span>
                                      </template>

                                      <template v-slot:item.importedescuento="{ item }">
                                        <span disable dark>
                                          ${{ formatoImporte(item.importedescuento) }}
                                        </span>
                                      </template>

                                      <template v-slot:item.accion="{item}">

                                        <v-tooltip bottom>
                                          <template v-slot:activator="{ on }">
                                            <v-btn
                                              fab x-small
                                              :color="temas.cen_btns_bg"
                                              :dark="temas.cen_btns_dark==true"
                                              class="mr-2"
                                              @click="editarComponente(itemActualItem)"
                                              v-on="on">
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
                                              @click=
                                              "borrarItem(itemActualItem)" v-on="on">
                                              <v-icon dark>mdi-delete</v-icon>
                                            </v-btn>
                                          </template>
                                          <span>Borrar</span>
                                        </v-tooltip>

                                      </template>
                                    </v-data-table>
                                  </div>
                                </v-row>

                                <v-row>
                                  <v-col cols="9">
                                  </v-col>
                                  <v-col cols="3">
                                    <span>
                                      Total Items
                                      <b>${{ formatoImporte(totalItems) }}</b>
                                    </span>
                                  </v-col>
                                </v-row>

                              </v-container>
                            </v-card-text>
                          </v-card>

                        </v-tab-item>
                      </v-tabs>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>

            <!-- EDICION DE PRESENTACIONES-->
            <v-dialog v-model="dialogPresentacion" :fullscreen="true">
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-toolbar text
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cancelarPresentacion">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="headdline">
                    ARTICULO PRESENTACION ->
                    {{ itemActual != undefined ? itemActual.codigo : '' }} -
                    {{ itemActual != undefined ? itemActual.nombre : '' }}
                  </span>
                  <v-spacer></v-spacer>
                  <div>
                    <v-btn
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class="ma-2 white--text" @click="guardar(true)">
                      Guardar
                    </v-btn>
                  </div>
                </v-toolbar>
                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled
                            v-model="editado.codigo"
                            label="Codigo"
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                        <v-col cols="7" sm="7" md="7">
                          <v-text-field
                            ref="nombre"
                            v-model="editado.nombre"
                            :autofocus="(editedIndex===0)"
                            label="Nombre"
                            required
                            :color="temas.forms_titulo_bg"
                            :rules="nombreRules"
                            :counter="80"
                            maxlength="80">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            disabled
                            class="caption"
                            v-model="editado.creador.username"
                            label="Creador">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sx="1" mx="1" class="body-2">
                          <v-switch
                            label="Activo"
                            :color="temas.forms_titulo_bg"
                            v-model="precio.activo">
                          </v-switch>
                        </v-col>
                      </v-row>

                      <v-tabs background-color="white" :color="temas.forms_titulo_bg">
                        <v-tab href="#general">
                          Datos Generales
                        </v-tab>
                        <v-tab-item value="general">
                          <v-row no-gutters>
                            <v-col cols="3">
                              <v-card class="pa-2" outlined tile>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <barcode
                                      :tag="tag"
                                      :value="editado.codbar">
                                    </barcode>
                                    <v-text-field
                                      ref="nombre"
                                      v-model="editado.codbar"
                                      label="Código de Barra"
                                      :color="temas.forms_titulo_bg"
                                      required
                                      :counter="14"
                                      maxlength="14">
                                    </v-text-field>
                                    <v-btn
                                      class="ma-2 white--text"
                                      :color="temas.forms_titulo_bg"
                                      @click="cancelar">
                                      Crear código propio
                                    </v-btn>
                                    <v-switch
                                      label="Es un CodBar Original"
                                      :color="temas.forms_titulo_bg"
                                      v-model="editado.codbaroriginal">
                                    </v-switch>
                                  </v-col>
                                </v-row>
                                <v-row>
                                <v-col cols="12" sm="12" md="12">
                                  <v-combobox
                                    v-model="tagsValue"
                                    :items="tagsItems"
                                    outlined
                                    chips label="Tags" multiple>
                                    <template v-slot:selection="{ attrs,item,select,selected}">
                                      <v-chip
                                        v-bind="attrs"
                                        :input-value="selected"
                                        close
                                        @click="select"
                                        @click:close="removeTag(item)">
                                        <strong>{{ item }}</strong>&nbsp;
                                      </v-chip>
                                    </template>
                                  </v-combobox>
                                </v-col>
                              </v-row>

                              </v-card>
                            </v-col>
                            <v-col cols="3">
                              <v-card class="pa-2" outlined tile>
                                <v-row>
                                  <v-col cols="6" sm="6" md="6">
                                    <v-text-field
                                      class="body-2"
                                      type="number"
                                      disabled
                                      v-model="unidadesPadre"
                                      label="Unds.Padre"
                                      :color="temas.forms_titulo_bg"
                                      @mouseover="help(1)">
                                    </v-text-field>
                                  </v-col>
                                  <v-col cols="6" sm="6" md="6">
                                    <v-text-field
                                      class="body-2"
                                      type="number"
                                      disabled
                                      v-model="costoPadre"
                                      label="Costo Padre"
                                      :color="temas.forms_titulo_bg"
                                      @mouseover="help(1)">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="8" sx="8" mx="8">
                                    <v-autocomplete
                                      class="body-2"
                                      v-model="editado.unidad_id"
                                      :items="itemsUmCompras"
                                      :loading="isLoadingUmCompras"
                                      :search-input.sync="searchUmCompras"
                                      :color="temas.forms_titulo_bg"
                                      disabled
                                      item-text="nombre"
                                      item-value="id"
                                      label="UM Presentación"
                                      placeholder="Escriba para buscar"
                                      prepend-icon="mdi-database-search"
                                      @mouseover="help(1)">
                                    </v-autocomplete>
                                  </v-col>
                                  <v-col cols="4" sm="4" md="4">
                                    <v-text-field
                                      class="body-2"
                                      type="number"
                                      :disabled="!elArticuloEsMio"
                                      v-model="editado.undenvase"
                                      label="Unds.Pres."
                                      :color="temas.forms_titulo_bg"
                                      @click="calpre()"
                                      @change="calpre()"
                                      @mouseover="help(1)">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="6" sm="6" md="6">
                                    <v-text-field
                                      class="body-2"
                                      disabled
                                      v-model="coeficiente"
                                      label="Coeficiente"
                                      :color="temas.forms_titulo_bg">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>
                            <v-col cols="3">
                              <v-card class="pa-2" outlined tile>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-text-field
                                      disabled
                                      v-model="precio.costo"
                                      label="Costo">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="4" sm="4" md="4">
                                    <v-text-field
                                      :disabled="!elArticuloEsMio"
                                      type="number"
                                      class="caption"
                                      label="%Remarcación"
                                      v-model="precio.porrem"
                                      @change="calpre()">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-text-field
                                      disabled
                                      v-model="precio.precio"
                                      label="PRECIO NETO">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-text-field
                                      disabled
                                      v-model="precio.publico"
                                      label="PRECIO AL PUBLICO">
                                    </v-text-field>
                                  </v-col>
                                </v-row>
                              </v-card>
                            </v-col>
                          </v-row>
                        </v-tab-item>
                      </v-tabs>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>

            <!-- EDICION CODIGO PROPIO -->
            <v-dialog v-model="dialogCodigoPropio" max-width="800px" max-height="300px">
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-toolbar text
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    :color="temas.forms_close"
                    :dark="temas.forms_close_dark==true"
                    icon @click="cancelarCodigoPropio">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="headdline">
                    Código
                    {{ itemActual != undefined ? itemActual.codigo : '' }} -
                    {{ itemActual != undefined ? itemActual.nombre : '' }}
                  </span>
                  <v-spacer></v-spacer>
                  <div>
                    <v-btn
                      :color="temas.cen_btns_bg"
                      :dark="temas.cen_btns_dark==true"
                      class="ma-2 white--text" @click="guardarCodigoPropioHTTP(true)">
                      Guardar
                    </v-btn>
                  </div>
                </v-toolbar>
                <v-form ref="form">
                  <v-card-text>
                    <v-container>

                      <v-row>
                        <v-col cols="6" sm="6" md="6">
                          <v-text-field
                            v-model="editado.codigo"
                            label="Mi Código"
                            required
                            autofocus
                            :color="temas.forms_titulo_bg"
                            v-on:keydown.tab="buscoCodigo">
                          </v-text-field>
                        </v-col>
                        <v-col cols="6" sm="6" md="6">
                          <v-text-field
                            v-model="editado.codigoprov"
                            label="Código Proveedor"
                            disabled
                            :color="temas.forms_titulo_bg">
                          </v-text-field>
                        </v-col>
                      </v-row>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FINALIZA LA EDICION DE PRESENTACIONES-->

          </v-toolbar>

          <!-- Barra de búsqueda  -->
          <v-container>
            <v-row>
              <v-col v-if="$store.state.tipo=='MI'" cols="4" sm="4">
                <v-select
                  label="Dónde Buscar..."
                  v-model="userArticulosId"
                  :items="articulosPorUser"
                  :color="temas.forms_titulo_bg"
                  :item-color="temas.forms_titulo_bg"
                  item-value="id"
                  item-text="nombre"
                  @change="seleccionoCreador()"
                  class="pt-0">
                </v-select>
              </v-col>
              <v-col cols="6" sm="6">
                <v-text-field
                  v-model="search"
                  :color="temas.forms_titulo_bg"
                  append-icon="search"
                  label="Buscar"
                  required clearable counter
                  single-line hide-details
                  class="pt-0">
                </v-text-field>
              </v-col>
              <v-col cols="2" sm="2">
                <v-btn
                  :color="temas.forms_titulo_bg"
                  class="caption" dark
                  @click="buscarArticulos">
                  Buscar
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </template>

        <template v-slot:item.codigo="{ item }">
          <span>{{ item.codigo }}
          </span>
          <v-badge v-if="item.codigo.substring(0, item.codigo.indexOf('@'))!=item.codigoprov"
            class="pt-3"
            :content="'m'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
        </template>

        <template v-slot:item.final="{ item }">
          <span>${{ formatoImporte(calculoPrecio(item)) }}</span>
          <v-badge v-if="item.pbe!=null"
            class="pt-3"
            :content="'p'"
            :color="item.pbe=='P' ? temas.forms_btn_add_bg : 'black'"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
        </template>

        <template v-slot:item.nombre="{ item }">
          <span disable dark>{{ item.nombre }}</span>
          <v-badge v-if="item.componentes.length>0"
            class="pt-3"
            :content="'combo'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
          <v-badge v-else-if="item.padre_id!=null"
            class="pt-3"
            :content="'pres'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
          <v-badge v-else-if="item.cttpres!=null"
            class="pt-3"
            :content="item.cttpres+' pres'"
            :value="item.cttpres"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
        </template>

        <template v-slot:item.fechaprecio="{ item }">
          <span v-if="item.usd==0">
            {{ fechadelprecio(item.fechaprecio) }}
          </span>
          <span v-else-if="item.usd!=0 && elAnclaEsMenor(item)">
            {{ fechadelprecio(item.fechaprecio)+'(ap)' }}
          </span>
          <span v-else>anclado(na)
          </span>
<!--
          <v-badge v-if="item.usd!=0"
            class="pt-3"
            content="a"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
-->
        </template>
        <template v-slot:item.activo="{ item }">
          <v-chip
            :color="getColor(item.activo)"
            dark>{{item.activo?'Sí':'No'}}
          </v-chip>
        </template>

        <!-- BOTONES DE LA GRID PRINCIPAL-->
        <template v-slot:item.accion="{ item }">
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" v-on="on" @click="setAcciones(item)">
                <v-icon>mdi-dots-vertical</v-icon>
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
              <v-badge
                :content="item.cttfotos"
                :value="item.cttfotos"
                :color="temas.forms_btn_add_bg"
                :dark="temas.forms_btn_add_bg==true" overlap>
                <span slot="badge">{{item.cttfotos}}</span>
                <v-avatar size="30">
                  <v-btn
                    class="mr-2" fab icon small
                    :color="temas.forms_btn_editar_bg"
                    :dark="temas.forms_btn_editar_dark==true"
                    @click="editarFotos(item)" v-on="on">
                    <v-icon>mdi-camera</v-icon>
                  </v-btn>
                </v-avatar>
              </v-badge>
            </template>
            <span>Fotos</span>
          </v-tooltip>

          <!-- BADGE CON ANCHO LARGO
          <v-badge overlap top color="red">
            <span slot="badge">63233</span>
            <v-avatar size="40" color="teal">
              <v-btn flat dark fab icon>
                <v-icon>notifications</v-icon>
              </v-btn>
            </v-avatar>
          </v-badge>
          -->

        </template>
      </v-data-table>

      <!-- EDICION DE FOTOS-->
      <v-dialog v-model="dialogFotos" max-width="1000px" max-height="600px">
        <template v-slot:activator="{ on }"></template>
        <v-card>
          <!-- para el EDICION-->
          <v-toolbar text
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close"
              :dark="temas.forms_close_dark==true"
              icon @click="cancelarEditarFotos">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="headdline">
              FOTOS DE:
              {{ itemActual != undefined ? itemActual.nombre + ' - ('+itemActual.codigo+')' : '' }}
            </span>
          </v-toolbar>
          <v-form ref="form">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="11" sm="11" md="11" v-if="itemActual.userid==userId">
                    <v-file-input
                      filled dense
                      :color="temas.forms_titulo_bg"
                      prepend-icon="mdi-camera"
                      v-model="nuevaFoto">
                      <v-icon>mdi-plus</v-icon>
                    </v-file-input>
                  </v-col>
                  <v-col cols="1" sm="1" md="1" v-if="itemActual.userid==userId">
                    <v-btn v-show="nuevaFoto!=''"
                      class="ma-2 white--text"
                      x-small fab
                      :color="temas.cen_btns_bg"
                      @click="agregarFotoHTTP(itemActual)">
                      <v-icon dense dark>mdi-content-save</v-icon>
                    </v-btn>
                  </v-col>
                </v-row>

                <v-container fluid>
                  <v-row v-if="itemActual!=null">
                    <v-col
                      v-for="(foto, i) in fotos" :key="i">
                      <div class="contenedor-galeria">
                        <v-card class="mx-auto my-12" max-width="250">
                          <v-img height="250"
                            :src="getImg(foto)"
                            class="galeria__img">
                          </v-img>
                          <v-divider class="mx-1"></v-divider>
                          <v-card-text >
                            <v-btn v-if="itemActual.userid==userId"
                              class="mr-2" fab x-small
                              :color="temas.cen_btns_bg"
                              :dark="temas.cen_btns_dark==true"
                              @click="borrarFotoHTTP(itemActual, foto)">
                              <v-icon>mdi-delete</v-icon>
                            </v-btn>
                          </v-card-text>
                        </v-card>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>

              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN EDICION DE FOTOS -->

      <!-- EDICION DE GRUPOS-->
      <v-dialog v-model="dialogGrupos" max-width="600px" max-height="600px">
        <template v-slot:activator="{ on }"></template>
        <v-card>
          <!-- para el EDICION-->
          <v-toolbar text
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close"
              :dark="temas.forms_close_dark==true"
              icon @click="cancelarDialogGrupos">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="headdline">
              GRUPO DE
              {{ itemActual != undefined ? itemActual.nombre + ' - ('+itemActual.codigo+')' : '' }}
            </span>
          </v-toolbar>
          <v-form ref="form">
            <v-card-text>
              <v-container>

                <v-card max-width="600"
                  style="height: 545px;"
                  v-scroll.self="onScroll"
                  class="overflow-y-auto"
                  max-height="600">
                  <v-sheet class="pa-4" :color="temas.forms_titulo_bg">
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="search"
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true"
                          label="Ingrese el grupo a buscar"
                          flat solo-inverted hide-details clearable
                          clear-icon="mdi-close-circle-outline">
                        </v-text-field>
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
                      :items="itemsTreeGrupos"
                      :search="search"
                      open-all>
                      <template slot="label" slot-scope="{ item }">
                        <span @click="seleccionoGrupo(item)"
                          color="red">
                          {{ item.id }} {{ item.name }} {{ '#'+ item.ctt }}
                        </span>
                      </template>
                    </v-treeview>
                  </v-card-text>
                </v-card>

              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- FIN EDICION DE GRUPOS -->

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
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import VueBarcode from 'vue-barcode';
import moment from 'moment';
import SBar from './Forms/snackbar.vue';
import Confirmacion from './Forms/confirmacion.vue';

export default {
  components: {
    SBar,
    Confirmacion,
    'barcode': VueBarcode,
  },
  data: () => ({
    modelo: 'articulos',
    tasaiva: 0,
    costo: 0,
    costoAnclado: 0,
    elArticuloEsMio: false,
    seleccionarArticulo: false,
    rubItems: [],
    itemsTreeGrupos: [],
    nombreDelGrupo: '',
    marItems: [],
    //rubValue: [],
    //rubObj: [],
    tagsItems: [],
    tagsValue: [],
    tabObj: [],
    stocks: [],
    acciones: [],
    itemActual: {
      user_id: null}
    ,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    articulosPorUser: [],
    userArticulosId: null,
    codigoRules: [
      (v) => !!v || 'El código es requerido',
    ],      
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
    ],
    decimalRule: [
      (v) => (v >= 0 && v <= 4) || 'El valor debe estar entre 0 y 4'
    ],
    tag: 'svg',
    busArt: '',
    optBarcode: {
      lineColor: '#ff7069',
      fontSize: 20,
      font: 'Courier',
      width: 2,
      height: 30,
      marginBottom: 30,
      format: 'MSI',
      background: '#ccffff'
    },
    arrSinStock: [ 'Avisar y Bloquear', 'Avisar y Continuar', 'Ignorar' ],
    fotos: [],
    presentaciones: [],
    nuevaFoto: '',
    verCargarFoto: false,
    searchUmCompras: '',       // para el cuadro de busqueda de datatables
    searchAfipIVA: '',         // para el cuadro de busqueda de datatables
    searchMarcas: '',          // para el cuadro de busqueda de datatables
    searchMoneda: '',          // para el cuadro de busqueda de datatables
    snackbar: false,           // para el mensaje del snackbar
    textSnack: 'texto',        // texto que se ve en el snackbar
    dialog: false,
    dialogStk: false,
    dialogPresentacion: false,
    dialogFotos: false,
    dialogCodigoPropio: false,
    dialogGrupos: false,
    
    ////////////////////////////////////
    // PARA EL DATATABLE ///////////////
    ////////////////////////////////////
    items: [],
    componentes: [],
    totalItems: 0,
    //precioPorcion: 0,
    loading: false,
    pagination: { page: 1 },
    footerProps: {'items-per-page-options': [8]},
    footerProps10: {'items-per-page-options': [10]},
    search: '', 
    headers: [
      { text: 'CODIGO', value:'codigo', sortable: false, width: 160},
      { text: 'NOMBRE', value:'nombre', sortable: false, width: 550},
      { text: 'CREADOR', value:'creador', sortable: false, width: 90},
//    { text: 'GRUPO', value:'nomgru', sortable: false, width: 100},
//    { text: 'MARCA', value:'nommar', sortable: false, width: 100},
      { text: 'PR.PUBLICO', value:'final', sortable: false, align: 'end', width: 120},
      { text: 'Modificado hace...', value:'fechaprecio', sortable: false, align: 'left', width: 110},
      { text: 'ACTIVO', value:'activo', sortable: false, align: 'end', width: 60},
//    { text: 'PUBLICADO', value:'cttpub', sortable: false},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersStk: [
      { text: 'SUCUSRAL', value:'sucursal'},
      { text: 'DEPOSITO', value:'deposito'},
      { text: 'EXISTENCIA', value:'existencia'},
    ],
    headersPresentaciones: [
      { text: 'Código', value:'codigo'},
      { text: 'Nombre', value:'nombre'},
      { text: 'Und.A Stock', value:'undstock', sortable: false, align: 'end', width: 120},
      { text: 'Costo', value:'precios[0].costo', sortable: false, align: 'end', width: 120},
      { text: '%Rem', value:'precios[0].porrem', sortable: false, align: 'end', width: 120},
      { text: 'Precio', value:'precios[0].precio', sortable: false, align: 'end', width: 120},
    ],
    /*
    headersComponentes: [
      { text: 'Código',   value:'componente.codigo', align: 'left', width: 150},
      { text: 'Nombre',   value:'componente.nombre', align: 'left', width: 300},
      { text: 'Cantidad', value:'cantidad', sortable: false, align: 'end', width: 120},
      { text: 'Pr.S/IVA', value:'precio', sortable: false, align: 'end', width: 120},
      { text: '%Dto.',    value:'tasadescuento', sortable: false, align: 'end', width: 120},
      { text: 'Imp.Dto.', value:'importedescuento', sortable: false, align: 'end', width: 120},
      { text: 'Total',    value:'total', sortable: false, align: 'end', width: 120},
    ],
    */
    headersArt: [
      { text: 'Código',   value:'componente.codigo', align: 'left', width: 130},
      { text: 'Nombre',   value:'componente.nombre', align: 'left', width: 333},
      { text: 'Cantidad', value:'cantidad', align: 'end', width: 100},
      { text: 'Pr.S/IVA', value:'precio', align: 'end', width: 110},
      { text: '%Dto.',    value:'tasadescuento', align: 'end', width: 70},
      { text: 'Imp.Dto.', value:'importedescuento', align: 'end', width: 100},
      { text: 'Total',    value:'total', align: 'end', width: 150},
      { text: 'Acciones', value:'accion', sortable: false },
    ],
    headersSelArt: [
      { text: 'ID', value:'id'},
      { text: 'CODIGO', value:'codigo'},
      { text: 'NOMBRE', value:'nombre'},
      { text: 'STOCK', value:'stock'},
      { text: 'PRECIO', value:'costo', align: 'end', width: 100},
    ],
    selArt: [],
    editedIndex: -1,
    editedIndexComp: -1,
    editado: {
      id: null,
      codigo: null,
      codigoprov: null,
      codbar: null,
      nombre: null,
      rubro_id: null,
      creador_id: null,
      padre_id: null,
      unidad_id: null,
      moneda_id: null,
      iva_id: null,
      secompra: null,
      sevende: null,
      undstock: null,
      esenvase: null,
      undenvase: null,
      presentacion: null,
      esperecedero: null,
      escombo: null,
      descripcion: null,
      codbaroriginal: null,
      creador: '',
      componentes: [],
      fotos: [],
    },
    defaultItem: {
      id: null,
      codigo: null,
      codigoprov: null,
      codbar: null,
      nombre: null,
      rubro_id: null,
      creador_id: null,
      padre_id: null,
      unidad_id: 1,
      moneda_id: 51,
      iva_id: 5,
      secompra: 1,
      sevende: 1,
      undstock: 1,
      esenvase: 0,
      undenvase: 1,
      presentacion: '',
      esperecedero: 0,
      escombo: 0,
      descripcion: '',
      codbaroriginal: 0,
      creador: '',
      componentes: [],
      fotos: [],
    },
    edComp: {
      id: null,
      componente_id: null,
      componente: {
        codigo: null,
        nombre: null,
      },
      cantidad: null,
      tasaIVA: null,
      stock: null,
      undstock: null, 
      precio: null,
      tasadescuento: null,
      importedescuento: null,
      total: null,
    },
    edCompDefault: {
      id: null,
      componente_id: null,
      componente: {
        codigo: null,
        nombre: null,
      },
      cantidad: null,
      tasaIVA: null,
      stock: null,
      undstock: null, 
      precio: null,
      tasadescuento: null,
      importedescuento: null,
      total: null,
    },
    coeficiente: null,
    unidadesPadre: null,
    costoPadre: null,
    precio: {
      decimales: 0,
      decimalesViejo: 0,
      costo: 0,
      costoViejo: 0,
      porrem: 0,
      porremViejo: 0,
      precio: 0,
      publico: 0,
      usd: 0,
      grupo_id: 0,
      marca_id: 0,
      admstock: 0,
      exmin: 0,
      sinstock: '',
    },
    descriptionLimit: 60,
    //entriesRubros: [],
    entriesGrupos: [],
    entriesUmCompras: [],
    entriesUmStock: [],
    entriesAfipIVA: [],
    entriesMarcas: [],
    entriesMoneda: [],
    //isLoadingRubros: false,
    isLoadingMarcas: false,
    isLoadingGrupos: false,
    isLoadingUmCompras: false,
    isLoadingAfipIVA: false,
    isLoadingMoneda: false,
    ancladoAlDolar: false,
    reglas: [],
    reglasImpacta: [],
    itemsArticulos: [],
    origArticulos: [],
    scrollInvoked: 0,

  }),
  /*
  components: {
    'barcode': VueBarcode
  },
  */
  computed: {
    // Dependiendo si es Alta o Edición cambia el título del modal
    ...mapGetters('authentication', ['isLoggedIn','userId']),
    ...mapMutations(['alert','closeAlert','setTerceros']),
    ...mapState([
      'vinculosPadres', 'vinculosHijos', 'temas', 'sucursalDemo', 'externo', 'tipo',
      'dolar', 'anclarCostos', 'desanclarAutomaticamente'
    ]),





    formTitle () {
      if (this.editado.escombo==1) {
        return this.editedIndex === -1 ? 'Nuevo Combo' : 'Editar Combo';
      } else {
        return this.editedIndex === -1 ? 'Nuevo Artículo' : 'Editar Artículo';
      }
    },





    formTitleComponentes () {
      return this.editedIndex === -1 ? 'Nuevo Componente' : 'Editar Componente';
    },





    itemsUmCompras () {
      return this.entriesUmCompras.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },





    itemsAfipIVA () {
      return this.entriesAfipIVA.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },





    itemsMarcas () {
      return this.entriesMarcas.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },





    itemsMoneda () {
      return this.entriesMoneda.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },
  },
  
  
  
  
  
  watch: {
    searchUmCompras (val) {
      if (this.isLoadingUmCompras) return
      this.isLoadingUmCompras = true
      return HTTP().get('/unidades').then(({ data }) => {
        this.entriesUmCompras = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingUmCompras = false))
    },





    searchAfipIVA (val) {
      if (this.isLoadingAfipIVA) return
      this.isLoadingAfipIVA = true
      return HTTP().get('/afipiva').then(({ data }) => {
        this.entriesAfipIVA = data
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingAfipIVA = false))
    },





    searchMarcas (val) {
      if (this.isLoadingMarcas) return
      this.isLoadingMarcas = true
      return HTTP().get('/marcasbus').then(({ data }) => {
        this.entriesMarcas = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingMarcas = false))
    },





    searchMoneda (val) {
      if (this.isLoadingMoneda) return
      this.isLoadingMoneda = true
      return HTTP().get('/afipmonedas').then(({ data }) => {
        this.entriesMoneda = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingMoneda = false))
    },
  },





  mounted () {
    //console.log(this.$vuetify.breakpoint.name)
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      return HTTP().get('/preciostags').then(({ data }) => {
        this.tagsItems = [];
        this.tagsObj = [];
        data.forEach(element => {
          this.tagsItems.push(element.nombre)
          this.tagsObj.push(element)
        })
        return HTTP().get('/usersrubros').then(({ data }) => {
          this.rubItems = []
          data.forEach(e => {
            this.rubItems.push({id: e.rubro.id, nombre: e.rubro.nombre})
          })
          let v = this.$store.state.vinculosPadres
          let tengoArticulos = false
          return HTTP().post('/articulosporusers', {vinculospadres: this.vinculosPadres }).then(({ data })=>{
            let totart = 0
            this.articulosPorUser = []
            for(let i=0; i<=data.length-1; i++) {
              totart += data[i].articulos
              if (data[i].creador_id == this.userId) {
                this.articulosPorUser.push({
                  id: data[i].creador_id, 
                  nombre: 'Mis Artículos ('+data[i].articulos+')',
                  articulos: data[i].articulos 
                })
                tengoArticulos = true
              }
            }
            if (data.length>1) {
              this.articulosPorUser.push({
                id: 0, 
                nombre: 'TODOS ('+totart+')',
                articulos: totart
              })
            }
            for (let i=0; i<=data.length-1; i++) {
              this.articulosPorUser.push({
                id: data[i].creador_id,
                nombre: data[i].username+' ('+data[i].articulos+')',
                articulos: data[i].articulos
              })
            }
            if (this.articulosPorUser.length>0) {
              if (this.articulosPorUser[0].nombre.substring(0,14)=='Mis Artículos') {
                this.userArticulosId = this.userId
              } else {
                this.userArticulosId = 0
              }
            } else {
              this.userArticulosId = this.userId
            }
            this.listarHTTP()
          })
        })
      })
    }
  },


  
  
  
  methods: {
    closeForm(){
      router.push('/')
    },





    elAnclaEsMenor(item) {
      let ret = (this.roundTo(this.dolar*item.usd,4) < item.costo)
      ret
    },





    fechadelprecio (fecha) {
      return moment(fecha).fromNow(true);
    },





    getImg(item) {
      //return item.foto
      return 'images/'+item.foto
    },




    buscarArticulos() {
      this.listarHTTP()
//        .then(data => {
//          this.items = data.items
//          this.totalItems = data.total
//      })
    },





    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      this.acciones.push({nombre: 'Editar', icon: 'mdi-pencil'})
      if (this.habDel(item)) {
        this.acciones.push({nombre: 'Borrar', icon: 'mdi-delete'})
      }
//    if (item.pbe=='P') {
//      this.acciones.push({nombre: 'Pausar Publicación', icon: 'mdi-clock'})  
//      this.acciones.push({nombre: 'Borrar Publicación', icon: 'mdi-delete'})  
//    } else if (item.pbe=='U') {
//      this.acciones.push({nombre: 'Activar Publicación', icon: 'mdi-clock'})
//    } else if (item.pbe==null) {
      if (item.pbe==null) {
        this.acciones.push({nombre: 'Enviar a Publicaciones', icon: 'mdi-earth'})
      }
      //this.acciones.push({nombre: 'Duplicar', icon: 'mdi-content-duplicate'})
      this.acciones.push({nombre: item.activo ?'Desactivar':'Activar', icon: 'mdi-checkbox-marked-outline'})
      if (item.padre_id==null) {
        this.acciones.push({nombre: 'Crear Presentación', icon: 'mdi-dice-multiple'})
      }
      this.acciones.push({nombre: 'Stock', icon: 'mdi-table-column'})
      if (item.userid==this.userId) {
        this.acciones.push({nombre: 'Asignar/Editar código Propio', icon: 'mdi-vector-difference-ba'})
      }
    },





    clickRow(value) {
      if (this.dialogFotos==false) {
        this.itemActual = value
        this.editar(this.itemActual)
      }
    },





    selAccion(item) {
      if (item.nombre=='Editar' || item.nombre=='Ver') {
        this.editar(this.itemActual)
      } else if (item.nombre=='Borrar') {
        this.preguntoBorrar(this.itemActual)
      } else if (item.nombre=='Activar'||item.nombre=='Desactivar') {
        this.activarDesactivar(this.itemActual)
      } else if (item.nombre=='Enviar a Publicaciones') {
        this.generarPublicacion(this.itemActual)
      } else if (item.nombre=='Crear Presentación') {
        this.presentacion(this.itemActual)
      } else if (item.nombre=='Stock') {
        this.verStock(this.itemActual)
      } else if (item.nombre=='Asignar/Editar código Propio') {
        this.editarCodigoPropio()
      }
    },





    habDel(item) {
      if (item.userid == this.userId) {
        return true
      } else {
        return false
      }
    },





    sayEditOrView(item) {
      if (item.userid == this.userId) {
        return 'mdi-pencil' 
      } else {
        return 'mdi-glasses'
      }
     },
    
    
    
    
    
    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },
    
    
    
    
    
    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },





    formatoImporteMoneda(value, moneda) {
      let val = (value/1).toFixed(2).replace('.', ',')
      let x = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      let m = (moneda==51) ? '$ ' : 'us$ '
      return m + x
    },
    
    
    
    
    verStock(item) {
      this.dialogStk = true;
      return HTTP().get('/depositos')
        .then(({ data }) => {
          this.stocks = [];
          for (let i=0; i<=data[0].sucursales.length-1; i++) {
            for (let j=0; j<=data[0].sucursales[i].depositos.length-1; j++) {
              this.stocks.push({
                sucursal: data[0].sucursales[i].nombre,
                deposito: data[0].sucursales[i].depositos[j].nombre,
                deposito_id: data[0].sucursales[i].depositos[j].id,
                existencia: 0
              })
            }
          }
          let id = this.editado.id
          let stockTotal = 0
          if (item) {
            id = item.id
          }
          return HTTP().get('/stocks/'+id)
            .then(({ data }) => {
              for (let i=0; i<=data.length-1; i++) {
                for (let j=0; j<=this.stocks.length-1; j++) {
                  if (this.stocks[j].deposito_id===data[i].deposito_id) {
                    this.stocks[j].existencia = data[i].stock
                    stockTotal += data[i].stock
                  }
                }
              }

              if (item) {
                this.msg.msgTitle = 'Stock'
                let msg = 'Artículo: '+item.codigo+'<br>'
                msg += 'Nombre: '+ item.nombre+'<br>'
                msg += 'Stock: '+ stockTotal+'<br>'
                this.msg.msgBody = msg
                this.msg.msgVisible = true
                this.msg.msgAccion = 'Stock'
                this.msg.msgButtons = ['Aceptar']
              }

          })
        }).catch((err)=>{
          console.log(err);
        })
    },




    costoAncladoAlDolar() {
      if (this.ancladoAlDolar) {
        this.precio.usd = this.roundTo(this.precio.costo / this.dolar,4)
//      let dec = (this.precio.costo+"").split(".")[1];
//      this.costoAnclado = this.precio.usd==0 ? 0 : this.roundTo(this.precio.usd * this.dolar,dec.length)
        this.costoAnclado = this.roundTo(this.precio.costo,this.precio.decimales)
      } else {
        this.precio.usd = 0
        this.costoAnclado = 0
      }
    },





    calpre() {
      if (this.editado.escombo==1) { return }
      if (this.itemsAfipIVA.length>0) { // es porque entro desde ALTA DE UN NUEVO ARTICULO
        let pos = this.itemsAfipIVA.map(function(e) { return e.id; }).indexOf(this.editado.iva_id);
        this.tasaiva = this.itemsAfipIVA[pos].tasa
      }
      this.precio.decimales = Number(this.precio.decimales)
      this.coeficiente = this.roundTo(Number(this.editado.undenvase)/Number(this.unidadesPadre),6)

      if (this.dialogPresentacion) {
        this.precio.costo   = this.roundTo((this.costoPadre/this.unidadesPadre)*this.editado.undenvase,this.precio.decimales)
      }

      this.precio.precio  = this.roundTo(this.precio.costo*(1+(this.precio.porrem/100)),this.precio.decimales)
      this.precio.publico = this.roundTo(this.precio.precio*(1+(this.tasaiva/100)),this.precio.decimales)
    },





    seleccionoCreador() {
      this.listarHTTP()
    },
    
    
    
    
    
    nuevoArticulo(escombo) {
      this.editedIndex = -1;
      this.dialog = true;
      this.editado = Object.assign({}, this.defaultItem);
      this.editado.activo = true
      //this.editado.rubros = this.rubItems;

      //ASIGNO AL ART LOS RUBROS AL QUE PERTENECE EL USUARIO
      //this.rubValue = this.rubItems;
      this.editado.fotos = [];
      this.editado.escombo = escombo;
      this.stocks = [];
      this.dialogStk = false;
      this.costo = 0;
      this.elArticuloEsMio = true;
      this.unidadesPadre = 1;
      this.coeficiente = 1;
      this.costoPadre = 0;
      this.editado.componentes =  [];
      this.cargoPrecios();
    },





    cantidadItem() {
      this.edComp.stock = Number(this.edComp.cantidad)
      this.edComp.undstock = Number(this.edComp.cantidad)*Number(this.edComp.undstock)
      let desc = 0
      desc = (Number(this.edComp.cantidad)*Number(this.edComp.precio))
      desc = desc * (Number(this.edComp.tasadescuento)/100)
      this.edComp.importedescuento = this.roundTo(desc,2)
      this.edComp.total = this.roundTo((Number(this.edComp.cantidad)*Number(this.edComp.precio))-desc,2)
      return this.edComp.total
    },





    presentacion( item ) {
      return HTTP().get('/articulo/'+item.id).then(({ data }) => {
        this.editedIndex = this.items.indexOf(item);
        this.elArticuloEsMio = true //item.userid == this.userId
        this.editado = Object.assign({}, data[0]);
        this.editado.codigo = this.editado.codigo.substring(0, this.editado.codigo.indexOf('@'))
        this.dialog = false;
        this.dialogPresentacion = true;
        this.editado.undstock = this.editado.undenvase
        this.coeficiente = 1
        this.unidadesPadre = this.editado.undenvase
        this.costoPadre = data[0].precios[0].costo

        // CARGO EL PRECIO
        this.cargoPrecios( data )

        // CARGO RUBROS, TAGS Y PRECIOS DEL ARTICULO
        //this.rubValue = []
        this.tagsValue = []
        this.stocks = []
        this.dialogStk = false;

        //this.editado.rubros.forEach(element => {
        //  this.rubValue.push(element.nombre)
        //})
        this.editado.tags.forEach(el => {
          this.tagsValue.push(el.nombre)
        })
        this.fotos = this.editado.fotos;

      })
    },
    
    



    cargarFotos(sino) {
      this.verCargarFoto = sino;
    },
    
    
    
    
    
    agregarFoto() {
      this.fotos.push({articulo_id: this.editado.id, foto: this.nuevaFoto.name})
      this.verCargarFoto = false
    },





    async agregarFotoHTTP(item) {
      let formData = new FormData();
      formData.append('file', this.nuevaFoto );
      formData.append('articulo_id', this.itemActual.id );
      await HTTP().post('/agregarfoto', 
        formData)
        .then(({ data }) => { 
          this.progress = false
          if (data=='error') {
            this.msg.msgTitle = 'Error'
            let m = 'Se ha producido un error.<br>Revise si el archivo que intenta subir cumple con las reglas'
            m += 'preestablecidas y vuelva a intentar.'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'aceptar'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.fotos.push({articulo_id: this.itemActual.id, foto: this.nuevaFoto.name})      
            this.nuevaFoto = ''
            item.cttfotos ++
          }
        })
    },





    borrarFotoHTTP(itemActual, foto) {
      return HTTP().post('/borrarfoto',  { articulofoto_id: foto.id, file: foto.foto })
        .then(({ data }) => { 
          this.progress = false
          if (data=='error') {
            this.msg.msgTitle = 'Error'
            let m = 'No se ha podido borrar la foto.<br>'
            m += 'Reintente, y si el error persiste consulte con gohu.'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'aceptar'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.fotos.splice(this.fotos.indexOf(foto), 1);
            itemActual.cttfotos --
          }
        })
      /*
      return HTTP().post('/borrarfoto', 
        { articulofoto_id: foto.id } )
        .then(({ data }) => {
          this.fotos.splice(this.fotos.indexOf(foto), 1);
          itemActual.cttfotos --
        })
      */
    },
    
    
    


    activarDesactivar(item) {
      return HTTP().post('articuloactivardesactivar/',{item: item}).then ((res) => {
        item.activo = res.data ? 1 : 0
      }).catch((err)=>{
        console.log(err);
      })
    },





    generarPublicacion(item) {
      return HTTP().post('/generopublicacion', {
        articulo_id: item.id,
        preciooriginal: item.precio,
        tasadescuento: 0,
        precio: item.precio,
        envio: 0,
        detalles: '',
        unidades: 1,
        vencimiento: moment().format('YYYY-MM-DD'),
        estado: 'I',
        prioridad: 1,       
        }).then(({ data }) => {
          this.mensaje('¡Se ha generado una publicación para este artículo.!', this.temas.forms_titulo_bg, 1500) 
          this.listarHTTP();
        });
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
    
    
    
    
    
    // PROCEDIMIENTOS para el CRUD
    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },





    getColorPub (pubs) {
      return (pubs != null) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },
    
    
    


    buscoCodigo (event) {
      // who caused it? "event.target.id"
      const cod = event.target.value
      return HTTP().get(`/${this.modelo}/exists/${cod+'@'+this.userId}`)
        .then(({ data }) => {
          if(data) {
            this.mensaje('¡El código ingresado ya existe.!', this.temas.forms_titulo_bg, 1500) 
            this.$refs.codigo.focus()
          }
      });
    },    





    buscarArt(estricto) {
      if (this.busArt == '') return
      let t = null
      let b = this.busArt
      let v  = []
      estricto = this.busArt.indexOf('@')!=-1 ? true : false
      v = this.$store.state.vinculosPadres
      return HTTP().post('/userarticulosfac', {search:b,vinculos:v,estricto:estricto,userex:null}).then(({data})=>{
        if (data.length==1) {
          this.edComp.id                = data[0].id;
          this.edComp.componente.codigo = data[0].codigo;
          this.edComp.componente.nombre = data[0].nombre;
          this.edComp.tasaIVA           = data[0].tasa;
          this.edComp.cantidad          = 1;
          this.edComp.precio            = data[0].precio;
          this.edComp.tasadesuento      = 0;
          this.edComp.importedescuento  = 0;
          this.edComp.total             = this.roundTo(this.edComp.precio*this.edComp.cantidad,this.precio.decimales);
          this.$nextTick(() => {
            const f = this.$refs.cantidad;
            f.focus();
          });
          this.seleccionarArticulo = false
        } else if (data.length>1) {
          this.selArt = []
          //this.busArtSave = this.busArt
          for (let i=0; i<=data.length-1; i++) {
            this.selArt.push({
              id:                data[i].id,
              codigo:            data[i].codigo,
              componente_id:     data[i].id,
              nombre:            data[i].nombre,
              precio:            data[i].precio,
              tasaIVA:           data[i].tasa,
              tasadesuento:      0,
              importedescuento:  0,
              total:             0,
            })
          }
          this.seleccionarArticulo = true;
        } else {
          this.mensaje('¡Codigo inexistente!', this.temas.forms_titulo_bg, 1000)
          this.$nextTick(() => {
            const f = this.$refs.buscar;
            f.focus();
          });
          return
        }
      })
    },





    cancelaLinea() {
      this.nuevoArt()
      this.busArt = ''
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },
    




    nuevoArt() {
      this.editedIndexComp = -1;
      this.busArt = ''
      this.edComp = Object.assign({}, this.edCompDefault);
      this.formTitleArt = 'Nuevo Item'
      this.seleccionarArticulo = false;
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },





    guardarItem(item) {

      if (this.edComp.cantidad == 0) {
        this.$nextTick(() => {
          const f = this.$refs.cant;
          f.focus();
        });
        return 
      } else if (this.edComp.codigo == '') {
        this.$nextTick(() => {
          const f = this.$refs.buscar;
          f.focus();
        });
        return 
      }

      let pos = this.editado.componentes.findIndex( x => x.componente_id==this.edComp.componente_id )
      
      // OJO, SI ES PEDIDO HAGO CONTROL DE PROMOCIONES, SI ES FACTURA DE COMPRA CARGO NORMAL.
      this.actualizoItem(pos)
      this.calculos()
      this.nuevoArt()
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });

    },





    calculos() {
      this.totalItems = 0
      this.precio.costo = 0
      this.precio.precio = 0
      this.precio.publico = 0
      for (let i=0; i<=this.editado.componentes.length-1; i++) {
        this.precio.costo   += this.roundTo(this.editado.componentes[i].total,this.precio.decimales)
        this.precio.precio  += this.roundTo(this.editado.componentes[i].total,this.precio.decimales)
        this.precio.publico += this.roundTo(this.editado.componentes[i].total*(1+(this.editado.componentes[i].tasaIVA/100)),this.precio.decimales)
        this.totalItems += this.roundTo(this.editado.componentes[i].total,this.precio.decimales)
      }
    },





    actualizoItem(pos) {
      if (pos==-1) {
        this.editado.componentes.push({
          id:               0,
          articulo_id:      this.editado.id,
          componente_id:    this.edComp.id,
          cantidad:         this.edComp.cantidad,
          precio:           this.edComp.precio,
          tasadescuento:    this.edComp.tasadescuento,
          importedescuento: this.edComp.importedescuento,
          total:            this.edComp.total,
          tasaIVA:          this.edComp.tasaIVA,
          estado:           'new',
          componente: {
            codigo: this.edComp.componente.codigo,
            nombre: this.edComp.componente.nombre,
          },
        })
      } else {
        this.editado.componentes[pos].cantidad = this.edComp.cantidad
        this.editado.componentes[pos].tasadescuento = this.edComp.tasadescuento
        this.editado.componentes[pos].importedescuento = this.edComp.importedescuento
        this.editado.componentes[pos].total = this.edComp.total
      }
    },





    selArtClick (item, row) {
      this.seleccionarArticulo = false;
      this.busArt = item.codigo
      this.buscarArt(true)
      this.$refs.cantidad.focus()
    },





    editarComponente(item) {
      this.formTitleArt = 'Editar Item'
      this.seleccionarArticulo = false;
      this.editedIndexComp = this.editado.componentes.indexOf(item)
      this.busArt = this.editado.componentes[this.editedIndexComp].componente.codigo
//    this.busArt = this.editado.componentes[this.editado.componentes.indexOf(item)].codigo
      this.edComp = Object.assign({}, this.editado.componentes[this.editedIndexComp] );
      this.$nextTick(() => {
        const f = this.$refs.cantidad;
        f.focus();
      });
//    this.buscarArt(true)
    },





    borrarItem(item) {
      this.busArt = ''
      let pos = this.editado.componentes.indexOf(item)
      this.editado.componentes.splice(pos,1);
    },





    listarHTTP:function() {
      let s = this.search.length>0 ? this.search : 'all'
      let v = []
      if (this.userArticulosId == null || this.userArticulosId == this.userId) {
        v.push(this.userId)
      } else if (this.userArticulosId==0) {
        v = this.$store.state.vinculosPadres
      } else {
        v.push(this.userArticulosId)
      }
      debugger
      return HTTP().post('/indexarticulos', {buscar:s,vinculos:v }).then(({ data })=>{
        debugger
        if (data.length>0) {
          this.itemActual = data[0]
          this.items = data;
        } else {
          this.items = []
        }
      })
    },

/*
1,    4,  3, 9,
    10,   11, 2, '%%',
    '%%', 50
*/

/*
    listarHTTP2 () {
      let localThis = this
      this.loading = true
      return new Promise((resolve, reject) => {
          const { sortBy, descending, page, rowsPerPage } = this.pagination
          let items = this.getJsonData().then(
            function(response){
              items = response.data;
              const total = response.total
              setTimeout(() => {
                localThis.loading = false;
                resolve({
                  items,
                  total
                })
              }, 0)
          })
      })    
    },
    
    
    
    
    
    getJsonData2 () {
      let s = this.search.length>0 ? this.search : 'all'
      let v = []

      if (this.userArticulosId == null || this.userArticulosId == this.userId) {
        v.push(this.userId)
      } else if (this.userArticulosId==0) {
        v = this.$store.state.vinculosPadres
      } else {
        v.push(this.userArticulosId)
      }

      return HTTP().get(`userarticulos/${this.pagination.page}/8/${s}/${v}`)
        .then(function(response){
          var result  = response.data;
          return result;
        }).catch(function (error) {
          console.log(error);
      })
    },
*/





    editarFotos(item) {
      this.itemActual = item
      this.dialogFotos = true
      return HTTP().get('/articulo/'+item.id).then(({ data }) => {
        this.editedIndex = this.items.indexOf(item);
        this.elArticuloEsMio = item.userid == this.userId
        this.fotos = data[0].fotos
        //this.editado = Object.assign({}, data[0]);
        //this.fotos = this.editado.fotos;
        //this.itemActual = this.editado
      })
    },





    cancelarEditarFotos() {
      this.dialogFotos = false
    },





    cancelarDialogGrupos() {
      this.dialogGrupos = false
    },





    // Procedimiento GRABAR LO EDITADO.
    editarHTTP:function(data) {
      data.vinculosHijos = this.vinculosHijos
      return HTTP().patch(`${this.modelo}/${data.id}`, data).then(({data}) => {
        debugger
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.forms_titulo_bg, 1500)
        } else {
          this.mensaje('¡Actualización Exitosa!', this.temas.forms_titulo_bg, 1500)
        }
        debugger
        return HTTP().get('/preciostags').then(({ data }) => {
          debugger
          this.tagsItems = [];
          this.tagsObj = [];
          data.forEach(element => {
            this.tagsItems.push(element.nombre)
            this.tagsObj.push(element)
          })
          this.listarHTTP()
        });
      
      });
    },





    // Procedimiento BORRAR.
    borrarHTTP:function(id) {
      return HTTP().delete(`/${this.modelo}/${id}`)
        .then((data) => {
          if (data=='error') {
            this.mensaje('¡Opps, no se ha podido eliminar este artículo!', this.temas.forms_titulo_bg, 1500)
          } else {
            this.mensaje('¡Artículo eliminado con éxito!', this.temas.forms_titulo_bg, 1500)
          }
          this.listarHTTP();
        });
    },
    
    
    
    
    
    preguntoBorrar (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      return HTTP().get('/puedoborrararticulo/'+item.id)
        .then(({ data }) => {
          if (data) {
            this.msg.msgTitle = 'Borrar'
            this.msg.msgBody = 'Confirma borrar '+item.nombre
            this.msg.msgVisible = true
            this.msg.msgAccion = 'borrar item'
            this.msg.msgButtons = ['Aceptar','Cancelar']
            this.itemActual = item;
          } else {
            this.msg.msgTitle = 'No se puede Borrar'
            this.msg.msgBody = 'Este artículo no se puede borrar, posee movimientos!'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'no se puede borrar'
            this.msg.msgButtons = ['Aceptar']
            this.itemActual = item;
          }
        });

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
    
    
    
    
    
    editar (item) {
      return HTTP().get('/reglas/'+this.userId+'/0').then(({ data }) => {
        this.reglas = data.reglas;
        return HTTP().get('/articulo/'+item.id).then(({ data }) => {
          this.editedIndex = this.items.indexOf(item);
          this.elArticuloEsMio = item.userid == this.userId

          this.editado = Object.assign({}, data[0]);
          this.coeficiente = this.roundTo(Number(this.editado.undstock)/this.editado.undenvase,6)
          this.nombreDelGrupo = ''
          
          // CARGO EL PRECIO
          this.cargoPrecios( data )
          this.ancladoAlDolar = this.precio.usd==0 ? false : true
          this.costoAnclado = this.precio.usd==0 ? 0 : this.roundTo(this.precio.usd * this.dolar,this.precio.decimales)

          this.editado.undstock = 1
          this.unidadesPadre = 1
          this.coeficiente = 1
          this.costoPadre = 0
          this.tasaiva = data[0].padre!=null ? data[0].padre.iva.tasa : data[0].iva.tasa
          
          //if (this.editado.padre_id!=null) {
          //}
          //this.editado.codigo = this.editado.codigo.substring(0, this.editado.codigo.indexOf('@'))
          if (this.editado.padre_id!=null){
            this.dialogPresentacion = true;
            //this.editado.undstock = this.editado.undstock*this.editado.undenvase
            this.coeficiente = this.editado.undstock // /this.editado.undenvase
            this.unidadesPadre = data[0].padre.undenvase
            this.costoPadre = data[0].padre.precios[0].costo
  //        this.cambioPrecioPorcion()
            this.calpre()
          } else {
            this.dialog = true;
          }

          // CARGO RUBROS, TAGS Y PRECIOS DEL ARTICULO
          //this.rubValue = []
          this.tagsValue = []
          this.stocks = []
          this.dialogStk = false;

          this.editado.precios[0].tags.forEach(el => {
            this.tagsValue.push(el.nombre)
          })

          // Veo en que reglas aplictan los tags del articulo
          this.reglasImpacta = []
          for (let i=0; i<=this.reglas.length-1; i++) {
            let tmpArt = this.reglas[i].tagspre.split('|');
            for (let j=0; j<=tmpArt.length-1; j++) {
              tmpArt[j] = Number(tmpArt[j])
            }
            let contador = 0
            for (let j=0; j<=tmpArt.length-1; j++) {
              let pos = this.editado.precios[0].tags.findIndex(x=>x.id==tmpArt[j])
              if (pos!=-1) {
                contador ++
              }
            }
            if (contador==tmpArt.length && contador>0) {
              this.reglasImpacta.push({
                id: this.reglas[i].id,
                nombre: this.reglas[i].nombre
              })

            }
          }

          this.fotos = this.editado.fotos;
          this.presentaciones = this.editado.presentaciones

          if (this.precio.sinstock=='B') {
            this.precio.sinstock = 'Avisar y Bloquear'
          } else if (this.precio.sinstock=='C') {
            this.precio.sinstock = 'Avisar y Continuar'
          } else if (this.precio.sinstock=='I') {
            this.precio.sinstock = 'Ignorar'
          }

          return HTTP().get('/gruposrubros/'+this.rubItems[0].id).then(({ data }) => {
            let aux = [];
            for(let i in data[0]) {
              aux.push({
                id:     Number(data[0][i].id),
                name:   data[0][i].nombre,
                activo: data[0][i].activo,
                ctt:    data[0][i].ctt,
                padre:  Number(data[0][i].grupo_id),
                state:  { disabled: data[0][i].activo===1 ? false : true }
              })
            }
            this.itemsTreeGrupos = getNestedChildren2(aux,0)

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
          })
        })
      })
    },





    borrar (item) {
      const index = this.items.indexOf(item);
      this.borrarHTTP(this.items[index].id);
      this.snackbar = true;
      this.textSnack = 'Se eliminó el registro.';
    },





    cancelar() {
      this.dialog = false;
      this.dialogPresentacion = false;
      this.editado = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },





    cancelarPresentacion() {
      this.dialogPresentacion = false;
      this.editado = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },





    cancelarComponente() {
      this.edComp = Object.assign({}, this.edCompDefault);
      this.editedIndexComp = -1;
    },





    cancelarCodigoPropio() {
      this.dialogCodigoPropio = false;
    },


    
    
    
    guardar(presentacion) {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', this.temas.forms_titulo_bg, 1500) 
        return this.dialog = true;
      }
      this.editado.precios = this.precio
      let aux = [];
      for(let i=0; i<=this.tagsValue.length-1; i++ ) {
        let nuevo = true
        for(let j=0; j<=this.tagsObj.length-1; j++) {
          if(this.tagsValue[i]===this.tagsObj[j].nombre) {
            nuevo = false
            aux.push(this.tagsObj[j])
            break
          }
        }
        if (nuevo) {
          aux.push({
            id: null,
            nombre: this.tagsValue[i],
            user_id: this.userId,
            created_at: moment().format('YYYY-MM-DD'),
            updated_at: moment().format('YYYY-MM-DD'),
          })
        }
      }

      this.editado.tags = aux;
      this.fotos = this.editado.fotos;

      if (this.precio.sinstock=='Avisar y Bloquear') {
        this.precio.sinstock = 'B'
      } else if (this.precio.sinstock=='Avisar y Continuar') {
        this.precio.sinstock = 'C'
      } else if (this.precio.sinstock=='Ignorar') {
        this.precio.sinstock = 'I'
      }

      // CALCULO LAS UNDADES DE STOCK ( CUANDO PADRE_ID==NULL VA LA QUE INGRESO,
      // SINO EL ENVASE DIVIDIDO LAS UND DE LA PRESENTACION )
      if (this.editado.padre_id!=null) {
        this.editado.undstock = this.coeficiente
      }
      this.editado.dolar = this.$store.state.dolar

      if (this.editedIndex > -1) { // esta modificando
        this.id = this.editado.id;
        this.editarHTTP(this.editado);
      } else {
        if (presentacion) {
          this.precio.costo=this.roundTo(this.precio.costo*this.coeficiente,this.precio.decimales)
          this.precio.precio=this.roundTo(this.precio.precio*this.coeficiente,this.precio.decimales)
          this.precio.publico=this.roundTo(this.precio.publico*this.coeficiente,this.precio.decimales)
          this.precio.costoviejo=this.precio.costo
        }
        this.altaHTTP(presentacion);
      }
      this.cancelar();
    },
    //Procedimiento Alta de Articulos.





    guardarCodigoPropioHTTP() {
      this.dialogCodigoPropio = false
      return HTTP().patch('asignarcodigopropio', {
        id: this.editado.id,
        codigo: this.editado.codigo,
        codigoprov: this.editado.codigoprov
        }).then(({data}) => {
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error!', this.temas.forms_titulo_bg, 1500) 
          } else {
            this.mensaje('¡Actualización Exitosa!', this.temas.forms_titulo_bg, 1500) 
          }
          this.listarHTTP()
        });
    },


    
    
    
    altaHTTP:function(presentacion) {
      let padre = presentacion ? this.itemActual.id : null
      this.editado.codigo = this.editado.codigo+'@'+this.userId
      return HTTP().post('/articulos', {
        codigo: this.editado.codigo,
        codbar: this.editado.codbar=='' ? null : this.editado.codbar,
        nombre: this.editado.nombre,
        rubro_id: this.editado.rubro_id,
        creador_id: this.userId,
        padre_id: padre,
        unidad_id: this.editado.unidad_id,
        moneda_id: this.editado.moneda_id,
        iva_id: this.editado.iva_id,
        secompra: this.editado.secompra ? 1 : 0,
        sevende: this.editado.sevende ? 1 : 0,
        undstock: Number(this.editado.undstock),
        esenvase: this.editado.esenvase ? 1 : 0,
        undenvase: Number(this.editado.undenvase),
        presentacion: this.editado.presentacion,
        esperecedero: this.editado.esperecedero ? 1 : 0,
        escombo: this.editado.escombo ? 1 : 0,
        descripcion: this.editado.descripcion,
        codbaroriginal: this.editado.codbaroriginal,
        activo: this.editado.activo,
        tags: this.editado.tags,
        fotos: this.editado.fotos,
        precios: this.editado.precios,
        vinculosHijos: this.vinculosHijos,
        componentes: this.editado.componentes,
        }).then(({ data }) => {

          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error en la grabacion del nuevo artículo!', this.temas.forms_titulo_bg, 2000)
          } else {

            return HTTP().get('/preciostags')
              .then(({ data }) => {
                this.tagsItems = [];
                this.tagsObj = [];
                data.forEach(element => {
                  this.tagsItems.push(element.nombre)
                  this.tagsObj.push(element)
                })
                this.mensaje('¡Artículo creado con éxito!', this.temas.forms_titulo_bg, 1500) 
                this.listarHTTP()
              });

          }
      });
    },
    




    editarCodigoPropio(){
      this.dialogCodigoPropio = true
      let pos = this.itemActual.codigo.indexOf('@')
      this.editado.id = this.itemActual.id
      this.editado.codigo = this.itemActual.codigo.substring(0, pos)    // mi codigo
      if (!this.itemActual.codigoprov) {
        this.editado.codigoprov = this.editado.codigo
      } else {
        this.editado.codigoprov = this.itemActual.codigoprov
      }
    },
    




    calculoPrecio (item) {
      let ret = 0
      if (item.usd>0) {
        if (this.roundTo(this.dolar*item.usd,4) > item.costo) {
          if (this.sucursalDemo) {
            ret = (this.roundTo(this.dolar*item.usd,item.decimales))*(1+((item.porrem/100)))
          } else {
            let a = this.dolar*item.usd
            let b = this.roundTo(a, item.decimales)
            let c = this.roundTo(b * (1+(item.porrem/100)),item.decimales)
            let d = this.roundTo(c * (1+(item.tasa/100)),item.decimales)
            ret = d
          }
        } else {
          ret = this.sucursalDemo?item.precio:item.final
        }
      } else {
        ret = this.sucursalDemo?item.precio:item.final
      }
      return ret
    },





    cargoPrecios(data){

      this.precio.decimales = data != null ? Number(data[0].precios[0].decimales) || 0 : 0
      this.precio.decimalesViejo = data != null ? Number(data[0].precios[0].decimales) || 0 : 0

      this.precio.costo = data[0].precios[0].costo
      if (data[0].precios[0].usd>0) {
        if (this.roundTo(this.dolar*data[0].precios[0].usd,4) > data[0].precios[0].costo) {
          this.precio.costo = this.roundTo(this.dolar*data[0].precios[0].usd,data[0].precios[0].decimales)
        }
      }

      this.precio.porrem = data != null ? data[0].precios[0].porrem || 0 : 0
      this.precio.costoViejo = this.precio.costo
      this.precio.porremViejo = this.precio.porrem
      this.precio.precio = this.roundTo(this.precio.costo * (1+(this.precio.porrem/100)),this.precio.decimales)
      this.precio.publico = 0
      if (this.editado.iva != undefined ) {
        this.precio.publico = this.roundTo(this.precio.precio * (1+(this.editado.iva.tasa/100)),this.precio.decimales)
      }
      this.precio.usd = data[0].precios[0].usd

      this.precio.grupo_id = data[0].precios[0].grupo_id
      this.precio.marca_id = data[0].precios[0].marca_id
      this.precio.exmin = data[0].precios[0].exmin
      this.precio.sinstock = data[0].precios[0].sinstock

      if (data[0].precios[0].grupo) {
        this.nombreDelGrupo = data[0].precios[0].grupo.nombre
      }

    },





    clickEnGrupo() {
      this.dialogGrupos = true;
    },





    actualizoGrupos() {

      if (this.editedIndex = -1) {

        return HTTP().get('/gruposrubros/'+this.rubItems[0].id).then(({ data }) => {
          let aux = [];
          for(let i in data[0]) {
            aux.push({
              id:     Number(data[0][i].id),
              name:   data[0][i].nombre,
              activo: data[0][i].activo,
              ctt:    data[0][i].ctt,
              padre:  Number(data[0][i].grupo_id),
              state:  { disabled: data[0][i].activo===1 ? false : true }
            })
          }
          this.itemsTreeGrupos = getNestedChildren2(aux,0)
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
        })

      } else {
        return HTTP().get('/gruposrubros/'+this.editado.rubro_id).then(({ data }) => {
          this.entriesGrupos = data[0];
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingGrupos = false))
      }

    },





    seleccionoGrupo(item) {
      if (item) {
        this.precio.grupo_id = item.id
        this.nombreDelGrupo = item.name
        this.dialogGrupos = false
      }
    },





    removeTag(item) {
      this.tagsValue.splice(this.tagsValue.indexOf(item), 1);
      this.tagsValue = [...this.tagsValue];
    },




    checkRegla() {
      // no se tienen que repetir el mismo tag en distintas reglas para los mismos clientes

      // NUEVO TAG/S PARA ARTICULOS
      // 1) Veo que articulos se incluyen con el o los nuevos tags
      // 2) Tomo una foto de los clientes que estan en la regla
      // 3) Busco si los nuevos articulos estan en las otras reglas para al menos un mismo cliente.
      // 4) Si esto da verdadero HAY CONFLICTO!
      // PARA LOS CLIENTES ES IGUAL

      let tagsArt = []
      for (let i=0; i<=this.tagsValue.length-1; i++) {
        let pos = this.tagsObj.findIndex(x=>x.nombre==this.tagsValue[i])
        tagsArt.push(this.tagsObj[pos].id)
      }

      let incluidas = [];
      let mensajeDeError = [];
      for (let i=0; i<=this.reglas.length-1; i++) {
        let tmpArt = this.reglas[i].tagspre.split('|');
        for (let j=0; j<=tmpArt.length-1; j++) {
          tmpArt[j] = Number(tmpArt[j])
        }
        if (tmpArt.length>0) {
          tmpArt.forEach( j => {
            let existe= false;
            tagsArt.forEach( k => {
              if (j == k) existe = true
            })
            if (existe) {
              incluidas.push({
                id: this.reglas[i].id,
                nombre: this.reglas[i].nombre,
              });
            }
          });
        } else {
          incluidas.push({
            id: this.reglas[i].id,
            nombre: this.reglas[i].nombre
          })
        }
      }

      // hasta aca tengo a todas las reglas que intervienen con los tags del articulo
      // debo revisar si cada una de ellas no incluyen a los mismos tags de clientes
      // Nota: si hay mas de una regla y al menos una tiene tagster vacio, que son todos los clientes,
      // ya hay conflicto!
      let res = []
      for (let i=0; i<=incluidas.length-1; i++) {

        // busco en reglas la regla acual.
        let pos = this.reglas.findIndex(x=>x.id == incluidas[i].id)
        if (this.reglas[pos].tagster=='' && this.reglas.length>1) {
          let txt = 'Regla '+incluidas[i].id+' '+incluidas[i].nombre+'<br>'
          pos = mensajeDeError.findIndex(x=>x==txt)
          if (pos==-1) {
            mensajeDeError.push(txt)
          }
        } else {
          let tmpTer = this.reglas[pos].tagster.split('|');
          for (let j=0; j<=tmpTer.length-1; j++) {
            tmpTer[j] = Number(tmpTer[j])
          }
          for (let j=0; j<=tmpTer.length-1; j++) {
            pos = -1
            if ( res.length!=0) {
              pos = res.findIndex(x=>x.id==tmpTer[j])
            }
            if (pos==-1) {
              res.push({
                regla: incluidas[i].id,
                nombre: incluidas[i].nombre,
                mensaje: 'Regla '+incluidas[i].id+' '+incluidas[i].nombre+'<br>',
                id: tmpTer[j],
                ctt: 1
              })
            } else {
              res[pos].ctt ++
              res[pos].mensaje += 'Regla '+incluidas[i].id+' '+incluidas[i].nombre+'<br>'
            }
          }
        }
      }

      // Reviso si hay conflictos
      for (let i=0; i<=res.length-1; i++) {
        if (res[i].ctt>1) {
          let pos = mensajeDeError.findIndex(x=>x==res[i].mensaje)
          if (pos==-1) {
            mensajeDeError.push(res[i].mensaje)
          }
        }
      }

      if (mensajeDeError.length>0) {
        this.msg.msgTitle = '¡Este tag genera conflico!'
        let txt = '<b>'+this.tagsValue[this.tagsValue.length-1]+'</b> '
        txt += 'entra en conflicto en las siguientes reglas definidas!<br><br>'
        this.tagsValue.pop()
        for (let i=0; i<=mensajeDeError.length-1; i++) {
          txt += mensajeDeError[i]
        }
        txt += '<br>IMPORTANTE: Un artículo no podrá pertenecer a más de una regla '
        txt += 'en las cuales los clientes sean los mismos.'
        txt += '<br>Ya que al momento de referenciar al código '+this.editado.codigo+', el sistema no sabrá cual '
        txt += 'regla aplicar.'
        this.msg.msgBody = txt
        this.msg.msgVisible = true
        this.msg.msgAccion = 'conflicto'
        this.msg.msgButtons = ['Aceptar']
      }
    },




    help(cual) {
      if (cual==1) {
        this.mensaje('Unidades del envase del artículo padre', this.temas.forms_titulo_bg, 2000)
      } else if (cual==2) {
        this.mensaje('Costo del artículo padre', this.temas.forms_titulo_bg, 2000)
      } else if (cual==3) {

      }
    },





    onScroll () {
      this.scrollInvoked++
    },





    formatoFecha(value) {
      return moment(String(value)).format('L')
    },
  },
}; 
</script>

<style scoped>
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
  .galeria__img:hover {
    filter: brightness(95%);
  }
  .x1 {
    font-size: 95%;
  }

</style>  
/*3706*/