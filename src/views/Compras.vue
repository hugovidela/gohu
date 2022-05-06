<template>
  <v-layout align-start>
    <v-flex>
      <v-row>
        <v-col v-for="(cbt, idx) in comprobantes" v-bind:key="idx" v-show="rol(cbt.pos,'ver')">
          <v-card tile outlined @click="selectTipoDeComprobante(cbt.nombre)"
            :disabled="!rol(idx,'acceder')" max-width="170">
            <v-app-bar outlined
              :color="cbt.nombre==filtroComprobanteSel ? temas.cen_card_activo_bg : cbt.bg"
              :dark="cbt.nombre==filtroComprobanteSel ? temas.cen_card_activo_dark : cbt.dark">
              <v-toolbar-title class="panel-font">
                {{cbt.nombre}}
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-app-bar>
            <v-container>
              <v-row dense>
                <v-col cols="12" class="mini-font">
                  ${{ formatoImporte(cbt.total) }} ({{ cbt.ctt }})
                </v-col>
              </v-row>
              <v-row dense>
                <v-col cols="3" class="pt-6 pb-0">
                  <v-tooltip bottom v-if="!(cbt.nombre=='Pedidos' && $store.state.tipo=='MD')">
                    <template v-slot:activator="{ on }">
                      <v-btn
                        icon small outlined
                        @click="nuevo(cbt.nombre)" v-on="on">
                        <v-icon>
                          mdi-18px mdi-plus
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>{{cbt.nombre=='Facturas' ? 'Factura c/Stock' : 'Nuevo'}}</span>
                  </v-tooltip>
                </v-col>

                <v-col cols="2" class="pt-6 pb-0" v-show="cbt.nombre=='Facturas'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn class="ml-2"
                        icon small outlined
                        @click="importarDesde('Excel')" v-on="on">
                        <v-icon>
                          mdi-18px mdi-file-excel-box
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Importar comprobante desde Excel</span>
                  </v-tooltip>
                </v-col>

                <v-col cols="2" class="pt-6 pb-0 pl-5" v-show="cbt.nombre=='Facturas'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn class="ml-2"
                        icon small outlined
                        @click="importarDesde('PDF')" v-on="on">
                        <v-icon>
                          mdi-18px mdi-file-pdf-box
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Importar comprobante PDF</span>
                  </v-tooltip>
                </v-col>

                <v-col cols="2" class="pt-6 pb-0" v-show="cbt.nombre=='Pedidos'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn class="ml-2"
                        icon small outlined
                        @click="verFaltantes(true)" v-on="on">
                        <v-icon>
                          mdi-18px mdi-notebook
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Ver Pedidos Faltantes</span>
                  </v-tooltip>
                </v-col>

                <v-col cols="2" class="pt-6 pb-0" v-show="cbt.nombre=='Gastos'">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn class="ml-2"
                        icon small outlined
                        @click="verGastos()" v-on="on">
                        <v-icon>
                          mdi-18px mdi-calendar
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Gastos Programados</span>
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
        :single-expand="singleExpand"
        :expanded.sync="expanded"
        show-expand
        dense
        class="elevation-1 panel-font"
        :footer-props="footerProps">
        <template v-slot:top>
          <v-toolbar flat :color="temas.forms_titulo_bg">
            <v-btn icon @click="closeForm"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>

            <v-toolbar-title
              :color="temas.forms_titulo_bg"
              :dark="temas.forms_titulo_dark==true"
              class="body-2" v-model="sucursal">
              <v-chip class="ml-0" label
                :color="temas.barra_principal_bg"
                :dark="temas.barra_principal_dark">
                <v-icon left>mdi-airplane-landing</v-icon>
                <b class="panel-font">COMPRAS</b>
              </v-chip>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-chip v-for="anio in anios"
                :key="anio.id" dense :value="anio.id" label
                :color="anio==elAnio ? temas.cen_card_activo_bg : temas.barra_principal_bg"
                :dark="anio==elAnio ? temas.cen_card_activo_dark : temas.barra_principal_dark"
                class="ml-1"
                @click="setAnio(anio)">
                {{ anio.substr(2,2) }}
              </v-chip>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-chip v-for="mes in meses"
                :key="mes.id" dense :value="mes.id" label
                :color="mes==elMes ? temas.cen_card_activo_bg : temas.barra_principal_bg"
                :dark="mes==elMes ? temas.cen_card_activo_dark : temas.barra_principal_dark"
                class="ml-1"
                @click="setMes(mes)">
                {{ mes }}
              </v-chip>
              <v-progress-circular v-if="progress==true"
                class="ml-2"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-circular>

            </v-toolbar-title>

<!--            <v-divider class="mx-4" inset vertical></v-divider> -->
<!--            <v-spacer></v-spacer>-->
            <!-- Modal del diálogo para Alta y Edicion -->

            <!-- DIALOGO DE LA CABECERA -->
            <v-dialog v-model="dialogCab" max-width="550px" :fullscreen="true">
              <template v-slot:activator="{}"></template>
              <v-card>

                <v-toolbar flat
                  :color="temas.forms_titulo_bg"
                  :dark="temas.forms_titulo_dark==true">
                  <v-btn
                    icon @click="cancelar"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="headdline">{{ formTitle }}</span>
                  <v-spacer></v-spacer>
                  <v-btn v-show="compraOk"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text"
                    @click="guardar">Guardar
                  </v-btn>
                </v-toolbar>

                <!--// CABECERA DE LA COMPRA // -->
                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="5" sm="5" md="5" class="pt-0">
                          <v-autocomplete class="pt-0"
                            ref="proveedor"
                            v-model="editado.tercero_id"
                            :items="itemsTerceros"
                            :loading="isLoadingTerceros"
                            :search-input.sync="searchTerceros"
                            :color="temas.forms_titulo_bg"
                            item-text="nombre"
                            item-value="id"
                            :disabled="editedIndex!=-1"
                            autofocus
                            label="Proveedor"
                            placeholder="Escriba para buscar"
                            prepend-icon="mdi-database-search">
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-select class="pt-0"
                            label="Comprobante" v-model="editado.comprobante_id"
                            :color="temas.forms_titulo_bg"
                            :disabled="editedIndex!=-1 || editado.cpr.substr(0,3)=='PED'"
                            :items="cprItems" item-value="id" item-text="abrev"
                            autocomplete>
                          </v-select>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" class="pt-0">
                          <v-text-field class="pt-0"
                            :disabled="editedIndex!=-1 || editado.cpr.substr(0,3)=='PED'"
                            v-model="afipSuc"
                            @change="afipsuc()"
                            label="Suc">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" class="pt-0">
                          <v-text-field class="pt-0"
                            ref="afipNro"
                            :disabled="editado.cpr.substr(0,3)=='PED'"
                            :color="temas.forms_titulo_bg"
                            v-model="afipNro"
                            label="Numero"
                            @change="afipnro()"
                            @blur="buscarCpr()">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-text-field class="pt-0"
                            type="date"
                            :disabled="editado.cpr.substr(0,3)=='PED'"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.fecha"
                            label="Fecha">
                          </v-text-field>
                        </v-col>
                        <v-spacer></v-spacer>
                        <v-col cols="1" sm="1" md="1" class="pt-0">
                          <v-text-field class="pt-0"
                            :disabled="editado.cpr.substr(0,3)=='PED'"
                            v-model="editado.perfiscal"
                            :color="temas.forms_titulo_bg"
                            label="Per.Fiscal">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="1" sm="1" md="1" class="pt-0">
                          <v-text-field class="caption pt-0"
                            disabled
                            v-model="editado.responsableAbrev"
                            label="Cond.Fiscal">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" class="pt-0">
                          <v-text-field class="caption pt-0"
                            disabled
                            v-model="editado.documento"
                            label="Documento">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" class="pt-0">
                          <v-text-field class="caption pt-0"
                            disabled
                            v-model="editado.documentoNumero"
                            label="Numero">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4" class="pt-0">
                          <v-select  class="pt-0"
                            label='Direccion'
                            v-model="editado.direccion_id"
                            :items="dirItems"
                            :color="temas.forms_titulo_bg"
                            item-value="id"
                            :item-text="dirItems=>
                              `
                              ${dirItems.direccion} - (
                              ${dirItems.postal.codigo} )
                              ${dirItems.postal.nombre} -
                              ${dirItems.postal.provincia.nombre} -
                              ${dirItems.postal.provincia.pais.nombre}
                              `">
                          </v-select>

                        </v-col>
                        <v-col cols="2" sm="2" md="2"
                          v-show="esCIN==false && esFiscal==true"
                          class="pt-0">
                          <v-select class="pt-0"
                            label="Depósito" v-model="editado.deposito_id"
                            :disabled="!editado.regstk"
                            :items="depItems" item-value="id" item-text="nombre"
                            :color="temas.forms_titulo_bg"
                            autocomplete return-object>
                          </v-select>
                        </v-col>
                        <v-col cols="1" sm="1" md="1" class="pt-0">
                          <v-select v-show="esFiscal == true" class="pt-0"
                            label="Moneda" v-model="editado.moneda_id"
                            :color="temas.forms_titulo_bg"
                            :items="monItems" item-value="id" item-text="simbolo" return-object>
                          </v-select>
                        </v-col>
                         <v-col cols="2" sm="2" md="2" class="pt-0">
                          <v-text-field v-show="esCIN==false && esFiscal==true" class="pt-0"
                            type="date"
                            :disabled="!ctacte"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.vencimiento"
                            label="Vencimiento de Cta.Cte.">
                          </v-text-field>
                         </v-col>
                      </v-row>

                      <!--// DETALLES DEL IVA // -->
                      <v-row v-show="esFiscal == true || esCIN == true">
                        <v-col v-for="(item, i) in tasasIVA" :key="i" cols="2" sm="2" md="2">
                          <v-card outlined tile class="mt-0 mp-0">
                            <v-card-title class="mt-0 mp-0">
                              <span class="iva-font">{{'IVA '+item.nombre}}</span>
                            </v-card-title>
                            <v-card-text>
                              <v-text-field class="pt-0 pb-0"
                                :disabled="i==2"
                                v-model="item.base"
                                :color="temas.forms_titulo_bg"
                                label="Neto"
                                prefix="$"
                                @change="calculoIVA('g',i)">
                              </v-text-field>
                              <v-text-field class="pt-0 pb-0"
                                :disabled="i==2"
                                v-model="item.iva"
                                :color="temas.forms_titulo_bg"
                                label="IVA"
                                prefix="$"
                                @change="calculoIVA('i',i)">
                              </v-text-field>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>

                      <!--// TOTALES DEL COMPROBANTE // -->
                      <v-row v-show="esFiscal == true || esCIN == true">
                        <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                          <v-row>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-1 pt-0">
                              <v-text-field class="pt-0 totales-font"
                                v-model="editado.exento" outlined dense
                                :color="temas.forms_titulo_bg"
                                label="Exento"
                                prefix="$"
                                @change="calculoIVA('exento')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-1 pb-0">
                              <v-text-field class="pt-0 totales-font"
                                v-model="editado.nogravado" outlined dense
                                :color="temas.forms_titulo_bg"
                                label="No Gravado"
                                prefix="$"
                                @change="calculoIVA('nogravado')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-1 pb-0">
                              <v-text-field class="pt-0 totales-font"
                                v-model="editado.retib" outlined dense
                                :color="temas.forms_titulo_bg"
                                label="Ret.Ing.Brutos"
                                prefix="$"
                                @change="calculoIVA('retib')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-1 pb-0">
                              <v-text-field class="pt-0 totales-font"
                                v-model="editado.retgan" outlined dense
                                :color="temas.forms_titulo_bg"
                                label="Ret.Ganancias"
                                prefix="$"
                                @change="calculoIVA('retgan')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-1 pb-0">
                              <v-text-field class="pt-0 totales-font"
                                v-model="editado.retiva" outlined dense
                                :color="temas.forms_titulo_bg"
                                label="Ret.IVA"
                                prefix="$"
                                @change="calculoIVA('retiva')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-1 pb-0">
                              <v-text-field class="pt-0 totales-font"
                                v-model="editado.impint" outlined dense
                                :color="temas.forms_titulo_bg"
                                label="Imp.Internos"
                                prefix="$"
                                @change="calculoIVA('impint')">
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>

                      <!--// PIE DEL FORMULARIO CABECERA // -->
                      <v-row v-show="esFiscal == true || esCIN == true">
                        <v-col cols="12" sx="12" mx="12">
                          <v-row v-if="(editado.cpr!='PRE' || sucursalDemo) && editado.cpr!='REM'">
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false && editado.regstk"
                              class="pt-0 pb-0">
                              <v-text-field class="pt-0 pb-0 totales-font"
                                v-model="itemsCargadosGravadoComputer" disabled outlined dense
                                :color="temas.forms_titulo_bg"
                                label="Gravado Items Cargados">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false && editado.regstk"
                              class="pt-0 pb-0">
                              <v-text-field class="pt-0 pb-0 totales-font"
                                v-model="itemsCargadosIVAComputer" disabled outlined dense
                                :color="temas.forms_titulo_bg"
                                label="IVA Items Cargados">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false && editado.regstk"
                              class="pt-0 pb-0">
                              <v-text-field class="pt-0 pb-0 totales-font"
                                v-model="editado.tasadescuento" outlined dense
                                :color="temas.forms_titulo_bg"
                                label="% de Descuento"
                                @change="calculoIVA('tasadescuento')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false && editado.regstk"
                              class="pt-0 pb-0">
                              <v-text-field class="pt-0 pb-0 totales-font"
                                v-model="editado.importedescuento" outlined dense
                                :color="temas.forms_titulo_bg"
                                label="Importe de Descuento"
                                @change="calculoIVA('importedescuento')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false && editado.regstk"
                              class="pt-0 pb-0">
                              <v-text-field class="pt-0 pb-0 totales-font"
                                v-model="editado.flete" outlined dense
                                :color="temas.forms_titulo_bg"
                                label="Flete"
                                prefix="$"
                                @change="calculoIVA('flete')">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false && editado.regstk"
                              class="pt-0 pb-0">
                              <v-text-field class="pt-0 pb-0 totales-font"
                                v-model="editado.poradcosto" disabled outlined dense
                                :color="temas.forms_titulo_bg"
                                prefix="%"
                                label="% a Adicionar en Costos">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row v-if="(editado.cpr!='PRE' || sucursalDemo) && editado.cpr!='REM'">
                            <v-col cols="2" sm="2" md="2"
                              v-show="esCIN==false && editado.tipo!='GS'" class="pt-0 pb-0">
                              <v-text-field outlined class="pt-0 pb-0 totales-font"
                                v-model="gravadoDiffComputer"
                                disabled
                                :color="temas.forms_titulo_bg"
                                label="Gravado Diferencia">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2"
                              v-show="esCIN==false && editado.tipo!='GS'" class="pt-0 pb-0">
                              <v-text-field outlined class="pt-0 pb-0 totales-font"
                                v-model="ivaDiffComputer"
                                disabled
                                :color="temas.forms_titulo_bg"
                                label="IVA Diferencia">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-0 pb-0">
                            </v-col>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-0 pb-0">
                              <v-text-field outlined class="pt-0 pb-0 totales-font"
                                v-model="editadoGravado" disabled
                                :color="temas.forms_titulo_bg"
                                label="Gravado">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" v-show="esCIN==false" class="pt-0 pb-0">
                              <v-text-field outlined class="pt-0 pb-0 totales-font"
                                v-model="editadoIva" disabled
                                :color="temas.forms_titulo_bg"
                                label="IVA">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sm="2" md="2" class="pt-0 pb-0">
                              <v-text-field outlined class="pt-0 pb-0 totales-font"
                                v-model="editadoTotal" disabled
                                :color="temas.forms_titulo_bg"
                                label="Total del Comprobante">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <!-- FIN TOTALES DEL COMPROBANTE -->
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!--// FIN DE LA CABECERA DE LA COMPRA // -->

            <!-- INGRESO DE ITEMS -->
            <v-dialog v-model="dialogArt" max-width="1350px" persistent>
              <template v-slot:activator="{ on }"></template>
              <v-card>
                <v-toolbar flat
                  :dark="temas.forms_titulo_dark==true"
                  :color="temas.forms_titulo_bg">
                  <v-btn
                    icon @click="cancelarArt"
                    :color="temas.forms_close_bg"
                    :dark="temas.forms_close_dark==true">
                    <v-icon>mdi-arrow-left-circle</v-icon>
                  </v-btn>
                  <span class="headdline">
                    {{empresa}} - Artículos del Comprobante: {{cpr}}
                    - Total de Artículos ingresados $
                    {{ formatoImporte(totalItems) }}
                  </span>
                  <v-spacer></v-spacer>
                  <v-btn v-show="editarItems==true && articulos.length>0"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text"
                    @click="guardarArt">GUARDAR
                  </v-btn>
                </v-toolbar>

                <!-- ITEMS DEL COMPROBANTE -->
                <v-card flat>
                  <v-card-text>
                    <v-container>
                      <v-row v-if="$store.state.tipo!='MD'">
                        <v-col cols="10" v-show="editadoArt.unidadesRegla.length>0">
                          <v-chip outlined>
                            <strong>{{reglasComputer}}</strong>
                          </v-chip>
                        </v-col>
                        <v-col cols="2" v-show="editadoArt.pubunidades>0">
                          <v-chip outlined>
                            <strong>{{promosComputer}}</strong>
                          </v-chip>
                        </v-col>
                      </v-row>
                      <v-row v-show="editarItems==true">
                        <v-col cols="1" class="mt-0 pt-0 pl-1 pr-0">
                          <v-text-field
                            filled dense label="Código"
                            class="mt-0 pt-0"
                            :disabled="editedIndexArt>-1"
                            :color="temas.forms_titulo_bg"
                            ref="buscar"
                            autofocus
                            v-model="busArt"
                            @keyup.esc="cancelaLinea()"
                            @focus="$event.target.select()"
                            @blur="buscarArt(false)">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" class="x1 mt-0 pt-0 pl-1 pr-0">
                          <v-text-field
                            filled dense label="Descripción"
                            disabled
                            class="mt-0 pt-0"
                            v-model="editadoArt.nombre">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" class="x1 mt-0 pt-0 pl-1 pr-0">
                          <v-text-field v-if="editado.cpr.substr(0,3)=='PED'"
                            filled dense label="Cantidad"
                            class="mt-0 pt-0"
                            v-model="editadoArt.cantidad"
                            type="number"
                            ref="cantidad"
                            @focus="$event.target.select()"
                            @change="guardarItem()"
                            @blur="guardarItem()"
                            @keyup.esc="cancelaLinea()">
                          </v-text-field>
                          <v-text-field v-else
                            filled dense label="Cantidad"
                            class="mt-0 pt-0"
                            v-model.number="editadoArt.cantidad"
                            type="number"
                            ref="cantidad"
                            @change="cantidadItem()"
                            @keyup.esc="cancelaLinea()">
                          </v-text-field>
                        </v-col>
<!--
                        <v-col cols="1" class="x1 mt-0 pt-0">
                          <v-text-field
                            class="x1 mt-0 pt-0" dense
                            :disabled="editado.cpr.substr(0,3)=='PED'"
                            v-model="editadoArt.deposito_id">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" class="x1 mt-0 pt-0">
                          <v-text-field
                            class="x1 mt-0 pt-0" dense
                            :disabled="editado.cpr.substr(0,3)=='PED'"
                            v-model="editadoArt.unidadNombre">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" class="x1 mt-0 pt-0">
                          <v-text-field
                            class="x1 mt-0 pt-0" dense
                            :disabled="editado.cpr.substr(0,3)=='PED'"
                            v-model="editadoArt.monedaNombre">
                          </v-text-field>
                        </v-col>
-->
                        <v-col cols="1" class="x1 mt-0 pt-0 pl-1 pr-0">
                          <v-text-field
                            filled dense label="IVA"
                            class="mt-0 pt-0"
                            :disabled="editado.cpr.substr(0,3)=='PED'"
                            v-model="editadoArt.ivaNombre">
                          </v-text-field>
                        </v-col>
                        <v-col v-if="editado.cpr.substr(0,3)=='PED'"
                          cols="2" class="x1 mt-0 pt-0 pl-1 pr-0">
                          <v-text-field
                            filled dense label="Precio"
                            class="mt-0 pt-0"
                            disabled
                            type="number"
                            v-model="editadoArt.precio"
                            @change="precioItem('precio')">
                          </v-text-field>
                        </v-col>
                        <v-col v-else
                          cols="2" class="x1 mt-0 pt-0 pl-1 pr-0">
                          <v-text-field
                            filled dense label="Precio"
                            class="mt-0 pt-0"
                            type="number"
                            v-model="editadoArt.costo"
                            @change="precioItem('costo')">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" class="x1 mt-0 pt-0 pl-1 pr-0">
                          <v-text-field
                            filled dense label="% Desc."
                            class="mt-0 pt-0"
                            :disabled="editado.cpr.substr(0,3)=='PED'"
                            type="number"
                            v-model="editadoArt.tasadescuento">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" class="x1 mt-0 pt-0 pl-1 pr-0">
                          <v-text-field
                            filled dense label="Desc."
                            class="mt-0 pt-0"
                            :disabled="editado.cpr.substr(0,3)=='PED'"
                            type="number"
                            @blur="guardarItem()"
                            v-model="editadoArt.importedescuento">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" class="x1 mt-0 pt-0 pl-1 pr-0">
                          <v-text-field
                            filled dense label="TOTAL"
                            class="mt-0 pt-0" disabled
                            type="number"
                            v-model="editadoArt.total">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <v-row class="pb-0">
                        <v-col v-show="seleccionarArticulo == true"
                          cols="12" sm="12" md="12">
                          <v-data-table
                            class="elevation-1 pt-0 pb-0"
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
                            :items="articulos"
                            dense
                            class="elevation-1 pr-0 ml-0"
                            @click:row="editarArt">
                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                dark>{{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.codigo="{ item }">
                              <span>{{ item.codigo }}</span>
                              <v-badge
                                inline
                                :content="item.ivatasa"
                                :color="temas.forms_btn_add_bg"
                                :dark="temas.forms_btn_add_bg==true" left>
                              </v-badge>
                            </template>
<!--
                            <template #item.nombre="{ value }">
                              <div class="text-truncate" style="max-width: 245px">{{value}}</div>
                              <v-badge
                                inline
                                :content="item.ivatasa"
                                :color="temas.forms_btn_add_bg"
                                :dark="temas.forms_btn_add_bg==true" left>
                              </v-badge>
                            </template>
-->
                            <template v-slot:item.precio="{ item }">
                              <span>${{ formatoImporte(item.precio) }}</span>
                            </template>

                            <template v-slot:item.costo="{ item }">
                              <span>{{ formatoImporte(item.costo) }}</span>
                            </template>

                            <template v-slot:item.cantidad="{ item }">
                              <span disable dark>{{ formatoImporte(item.cantidad) }}</span>
                            </template>

                            <template v-slot:item.total="{ item }">
                              <span disable dark>${{ formatoImporte(item.total) }}</span>
                            </template>

                            <template v-slot:item.tasadescuento="{ item }">
                              <v-badge v-if="item.texto=='Promocion'"
                                class="pt-3 pl-0 pr-0"
                                content="pub"
                                :color="temas.forms_btn_add_bg"
                                :dark="temas.forms_btn_add_bg==true" left>
                              </v-badge>
                              <v-badge v-else-if="item.texto=='Regla'"
                                class="pt-3 pl-0 pr-0"
                                content="reg"
                                :color="temas.forms_btn_add_bg"
                                :dark="temas.forms_btn_add_bg==true" left>
                              </v-badge>
                              <span>{{ formatoImporte(item.tasadescuento) }}</span>
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
                                    @click="editarArt(itemActualItem)" v-on="on">
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
                                    @click="borrarItem(itemActualItem)" v-on="on">
                                    <v-icon dark>mdi-delete</v-icon>
                                  </v-btn>
                                </template>
                                <span>Borrar Linea</span>
                              </v-tooltip>

                            </template>
                          </v-data-table>
                        </div>
                      </v-row>
                      <v-row v-show="editarItems==true" class="mt-0 pb-0">
                        <v-col cols="9" class="x1 mt-0 pt-0">
                        </v-col>
                        <v-col cols="1" class="x1 mt-0 pt-0">
                          <span>Total Items</span>
                        </v-col>
                        <v-col cols="2" class="x1 mt-0 pt-0">
                          <span><b>${{ formatoImporte(totalItems) }}</b>
                          </span>
                        </v-col>
                      </v-row>

                    </v-container>
                  </v-card-text>
                </v-card>
              </v-card>

            </v-dialog>
            <!-- FIN INGRESO DE ITEMS -->

            <!--// IMPORTAR COMPROBANTE DESDE // -->
            <v-dialog v-model="dialogImportarDesde" :fullscreen="true">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat dark :color="temas.forms_titulo_bg">
                <v-btn icon @click="cerrarImortarDesde"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - Importar Factura de Compra desde {{importarDesdeFormato}}
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-card>
                <v-form>
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="6" sm="6" md="6" class="pt-0">
                          <v-autocomplete
                            ref="proveedor"
                            v-model="editado.tercero_id"
                            :items="itemsTerceros"
                            :loading="isLoadingTerceros"
                            :search-input.sync="searchTerceros"
                            :color="temas.forms_titulo_bg"
                            item-text="nombre"
                            item-value="id"
                            :disabled="editedIndex!=-1"
                            autofocus
                            label="Proveedor"
                            placeholder="Escriba para buscar"
                            prepend-icon="mdi-database-search">
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="6" sx="6" mx="6" class="pt-0">
                          <v-file-input
                            v-model="excel"
                            :label=
                              "importarDesdeFormato=='Archivo Excel'
                              ?'Archivo Excel'
                              :'Archivo PDF'"
                            :prepend-icon=
                              "importarDesdeFormato=='Excel'
                              ?'mdi-file-excel-box'
                              :'mdi-file-pdf-box'"
                            :color="temas.forms_titulo_bg"
                            @change="cargarXls">
                            <template v-slot:selection="{ text }">
                              {{ excel.name ? excel.name : excel }}
                            </template>
                          </v-file-input>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-model="compraExcel.cuit"
                            :color="temas.forms_titulo_bg"
                            label="CUIT">
                          </v-text-field>
                        </v-col>
                        <v-col cols="3" sm="3" md="3">
                          <v-text-field
                            type="date"
                            v-model="compraExcel.fecha"
                            :color="temas.forms_titulo_bg"
                            label="Fecha">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-model="compraExcel.perfiscal"
                            :color="temas.forms_titulo_bg"
                            label="Per.Fiscal">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            v-model="compraExcel.tipcpr"
                            :color="temas.forms_titulo_bg"
                            label="Cpr">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            v-model="compraExcel.succpr"
                            :color="temas.forms_titulo_bg"
                            label="Suc">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-model="compraExcel.nrocpr"
                            :color="temas.forms_titulo_bg"
                            label="Número">
                          </v-text-field>
                        </v-col>
                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            v-model="compraExcel.moneda"
                            :color="temas.forms_titulo_bg"
                            label="Moneda">
                          </v-text-field>
                        </v-col>
                      </v-row>

                      <v-row>
                        <v-data-table
                          :headers="headersArtExcel"
                          :items="compraExcel.items"
                          dense
                          class="elevation-3 pl-0"
                          @click:row="editarArt">

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
                            <span disable dark>${{ formatoImporte(item.precio) }}</span>
                          </template>

                          <template v-slot:item.costo="{ item }">
                            <span disable dark>{{ formatoImporte(item.costo) }}</span>
                          </template>

                          <template v-slot:item.cantidad="{ item }">
                            <span disable dark>{{ formatoImporte(item.cantidad) }}</span>
                          </template>

                          <template v-slot:item.total="{ item }">
                            <span disable dark>${{ formatoImporte(item.total) }}</span>
                          </template>

                          <template v-slot:item.tasdes="{ item }">
                            <span disable dark>%{{ formatoImporte(item.tasdes) }}</span>
                          </template>

                          <template v-slot:item.impdes="{ item }">
                            <span disable dark>${{ formatoImporte(item.impdes) }}</span>
                          </template>

                          <template v-slot:item.accion="{item}">
                            <v-menu bottom left>
                              <template v-slot:activator="{ on, attrs }">
                                <v-btn icon v-bind="attrs" v-on="on"
                                  @click="setAccionesItems(item)">
                                  <v-icon>mdi-18px mdi-dots-vertical</v-icon>
                                </v-btn>
                              </template>
                              <v-list dense>
                                <v-list-item-group :color="temas.forms_titulo_bg">
                                  <v-list-item
                                    v-for="(item, i) in accionesItems" :key="i">
                                    <v-list-item-icon>
                                      <v-icon
                                        class="font-size: 24px"
                                        @click="selAccionItem(item)" v-text="item.icon">
                                      </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                      <v-list-item-title
                                        class="caption"
                                        @click="selAccionItem(item)">{{ item.nombre }}
                                      </v-list-item-title>
                                    </v-list-item-content>
                                  </v-list-item>
                                </v-list-item-group>
                              </v-list>
                            </v-menu>
                          </template>
                        </v-data-table>
                      </v-row>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN IMPORTAR COMPROBANTE DESDE EXCEL -->

            <!--// SEGUIMIENTO/RASTREO DE COMPROBANTES // -->
            <v-dialog v-model="dialogRas" max-width="1260px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat dark :color="temas.forms_titulo_bg">
                <v-btn icon @click="cerrarRas"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - Seguimiento del Comprobante:
                  {{ itemActual != null ? itemActual.cpr : '' }}
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

            <!-- ANULACION DE PAGOS // -->
            <v-dialog v-model="dialogPagAnula" max-width="510px">
              <template v-slot:activator="{}"></template>

              <v-toolbar flat dark :color="temas.forms_titulo_bg">
                <v-btn icon @click="dialogPagAnula=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{empresa}} - Anular Pago:
                  {{ itemActual != null ? itemActual.cpr : '' }}
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-card>
                <v-form ref="anupag">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="12" sx="12" mx="12" v-if="cttChePropEnPago>0">
                          <span class="panel-font" v-if="pagoVinculado">
                            <b>PAGO VINCULADO</b><br>
                            También se anulará el Recibo emitido por el Proveedor<br><br>
                            <b>
                              gohu</b> enviará una notificación a <b>{{itemActual.tercero.nombre}}
                            </b><br> para avisar de la anulación de este Pago.<br><br>
                          </span>
                          <span class="panel-font">
                            Este Pago posee <b>{{cttChePropEnPago}}</b>
                          </span>
                          <span class="panel-font" v-if="cttChePropEnPago==1">
                            cheque propio y ya fue marcado en la chequera como utilizado.<br>
                            Si quiere volver a utilizarlo maque en la casilla mas abajo.
                          </span>
                          <span class="panel-font" v-else>
                            cheques propios utilizados que fueron marcados en la chequera como
                            utilizados.<br>
                            Si quiere volver a utilizarlos marque en la casilla mas abajo.
                          </span><br>
                          <v-checkbox class="panel-font"
                            v-model="chePropEnPagoMantener"
                            :label="cttChePropEnPago==1?
                            'Volver a utilizar este cheque':'Volver a utilizar estos cheques'">
                          </v-checkbox>
                        </v-col>
                      </v-row>
                      <v-row>
                        <v-col cols="3"></v-col>
                        <v-col cols="5">
                          <v-btn class="text--center"
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            @click="anularPagoHTTP()">
                            Confirmar Anulación
                          </v-btn>
                        </v-col>
                        <v-col cols="3"></v-col>
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
                  Seguimiento del comprobante
                  {{ itemActual != null ? itemActual.cpr : '' }}
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-card class="mx-auto" max-width="500">
                <v-card-text class="py-0">
                  <v-timeline align-top dense>
                    <v-timeline-item
                      v-for="(tm, idx) in timeLine" v-bind:key="idx"
                      :color="temas.barra_principal_bg" small>
                        <v-card class="caption" :color="temas.forms_titulo_bg" dark>
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

            <!--// CAMBIAR PERIODO FISCAL // -->
            <v-dialog v-model="dialogCambiarPeriodoFiscal" max-width="430px">
              <template v-slot:activator="{}"></template>
              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  icon @click="dialogCambiarPeriodoFiscal=false"
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  Cambiar Período Fiscal:
                  {{ itemActual != null ? itemActual.cpr : '' }}
                </span>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card class="mx-auto" max-width="500">
                <v-card-text class="py-0">
                  <v-row>
                    <v-col cols="3" sm="3" md="3" class="pt-6 pb-6">
                    </v-col>
                    <v-col cols="6" sm="6" md="6" class="pt-6 pb-6">
                      <v-text-field
                        type="month"
                        :color="temas.forms_titulo_bg"
                        v-model="editado.perfiscal"
                        label="Período Fiscal">
                      </v-text-field>
                    </v-col>
                    <v-col cols="3" sm="3" md="3" class="pt-6 pb-6">
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="3" sm="3" md="3" class="pt-6 pb-6">
                    </v-col>
                    <v-col cols="6" sm="6" md="6" class="pt-6 pb-6">
                      <v-btn v-show="valDiferencia==0" class="text--center"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="confirmarCambioDePeriodo">
                        Confirmar
                      </v-btn>
                    </v-col>
                    <v-col cols="3" sm="3" md="3" class="pt-6 pb-6">
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
            </v-dialog>
            <!-- FIN DEL CAMNBIO PERIODO FISCAL -->

            <!--PAGO -->
            <v-dialog v-model="dialogPag" max-width="1300px" persistent>
              <template v-slot:activator="{}"></template>

              <v-toolbar flat
                :color="temas.forms_titulo_bg"
                :dark="temas.forms_titulo_dark==true">
                <v-btn
                  :color="temas.forms_close_bg"
                  :dark="temas.forms_close_dark==true"
                  icon @click="cerrarPag">
                  <v-icon>mdi-arrow-left-circle</v-icon>
                </v-btn>
                <span class="text--right">
                  {{ formTitle }}
                </span>
                <v-spacer></v-spacer>
                <v-btn v-show="valDiferencia==0"
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true"
                  @click="guardarPag(item)">
                  Confirmar Pago
                </v-btn>
              </v-toolbar>

              <v-card>
                <v-form ref="pend">
                  <v-card-text>
                    <v-container>

                      <!-- PIDO PROVEEDOR -->
                      <v-row v-show="pagoDeUnSoloComprobante==false">
                        <v-col cols="5" sx="5" mx="5">
                          <v-autocomplete
                            v-model="editado.tercero_id"
                            :items="itemsTerceros"
                            :loading="isLoadingTercerosPag"
                            :search-input.sync="searchTercerosPag"
                            :color="temas.forms_titulo_bg"
                            item-text="nombre"
                            item-value="id"
                            autofocus
                            label="Proveedor"
                            placeholder="Escriba para buscar"
                            prepend-icon="mdi-database-search">
                          </v-autocomplete>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            v-model="editado.total"
                            :color="temas.forms_titulo_bg"
                            label="Total Pago"
                            @change="totalPago()">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-6">
                          <v-btn v-show="pend.length>0"
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            text
                            @click="automaticoPend()">
                            Sel. Automática
                          </v-btn>
                        </v-col>
                        <v-col cols="2" sm="2" md="2" class="pt-6">
                          <v-btn v-show="pend.length>0"
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            text
                            @click="limpiarSelPend()">
                            Limpiar
                          </v-btn>
                        </v-col>
                      </v-row>
                      <!-- FIN PIDO PROVEEDOR -->

                      <!-- PENDIENTES PARA CANCELAR -->
                      <v-row v-show="esUnPagoDeUnaFactura==false">
                        <v-col cols="12" sx="12" mx="12">
                          <v-data-table
                            :headers="headersPend"
                            :items="pend"
                            dense
                            class="elevation-3">
                            <template v-slot:top>
                              <v-dialog v-model="dialogPend" max-width="300px">
                                <template v-slot:activator="{}">
                                  <v-btn small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true">
                                    Pendientes
                                  </v-btn>
                                </template>
                                <v-card>
                                  <v-toolbar flat
                                    :color="temas.forms_titulo_bg"
                                    :dark="temas.forms_titulo_dark==true">
                                    <v-btn
                                      icon @click="cancelarPend"
                                      :color="temas.forms_close_bg"
                                      :dark="temas.forms_close_dark==true">
                                      <v-icon>mdi-arrow-left-circle</v-icon>
                                    </v-btn>
                                    <span class="headdline">A Cancelar</span>
                                    <v-spacer></v-spacer>
                                    <v-btn v-show="editadoPend.acancelar>0"
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      @click="guardarPend(editadoPend)">
                                      Guardar
                                    </v-btn>
                                  </v-toolbar>
                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                          <v-text-field
                                            v-model="editadoPend.acancelar"
                                            autofocus
                                            @focus="$event.target.select()"
                                            :color="temas.forms_titulo_bg"
                                            label="A Cancelar">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                    </v-container>
                                  </v-card-text>
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
                                    fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="editarPend(item)" v-on="on">
                                    <v-icon dark>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                                <span>Editar</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    :color="item.acancelar!=0 ?
                                    temas.cen_card_activo_bg :
                                    temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    class="mr-2"
                                    @click="selectPend(item)" v-on="on">
                                    <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                                  </v-btn>
                                </template>
                                <span>Editar</span>
                              </v-tooltip>
                            </template>
                          </v-data-table>
                        </v-col>
                      </v-row>
                      <!-- FIN DE PENDIENTES A CANCELAR -->

                      <!-- MEDIOS DE PAGO SELECCION -->
                      <v-row>
                        <v-radio-group v-model="medioDePagoId" row>
                          <v-radio v-for="item in medpag"
                            :key="item.id" dense :value="item.id" :label="item.nombre"
                            v-show="item.activo==true"
                            :color="temas.forms_titulo_bg"
                            @click="setFP(item.id)">
                          </v-radio>
                        </v-radio-group>
                      </v-row>
                      <!-- FIN DE MEDIOS DE PAGO SELECCION -->

                      <!--// DIALOGO INGRESO DE VALORES QUE SALEN EN EL PAGO// -->
                      <v-row>
                        <v-col cols="12" sx="12" mx="12">
                          <v-data-table
                            :headers="headersMed"
                            :items="valores"
                            dense
                            class="elevation-3"
                            :footer-props="footerProps">
                            <template v-slot:top>
                              <v-dialog v-model="dialogMed" :max-width="medpagwidth">

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
                                    <span class="headdline"
                                      v-if="medioDePagoNombre=='Cheque de Tercero'">
                                      {{ medioDePagoNombre }}
                                      - Cheques de no más de {{maxDiasChq}} días.
                                    </span>
                                    <span v-else class="headdline">
                                      {{ medioDePagoNombre }}
                                    </span>
                                    <v-spacer></v-spacer>
                                    <v-btn v-show="elMedioEstaOk"
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      @click="guardarMed(editadoMed)">
                                      Guardar
                                    </v-btn>
                                  </v-toolbar>

                                  <v-card-text>
                                    <!-- MEDIOS DE PAGO -->
                                    <v-container>
                                      <!-- GRILLA DE CHEQUES DE TERCERO -->
                                      <v-row v-show="habinhab('cheque de tercero')">
                                        <v-col cols="12" sm="12" md="12">
                                          <v-data-table
                                            v-model="selectedCheque"
                                            :headers="headersCartera"
                                            :items="cartera"
                                            dense
                                            class="elevation-3"
                                            item-key="id"
                                            :footer-props="footerProps8">
                                            <template v-slot:item.importe="{ item }">
                                              <span
                                                disable dark>${{ formatoImporte(item.importe) }}
                                              </span>
                                            </template>
                                            <template v-slot:item.fechafinanciera="{ item }">
                                              <span>
                                                {{ formatoFechaCorta(item.fechafinanciera) }}
                                              </span>
                                            </template>
                                            <template v-slot:item.accion="{item}">
                                              <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                  <v-btn
                                                    fab x-small
                                                    :color=
                                                    "item.seleccionado==0?
                                                    temas.cen_btns_bg:
                                                    temas.cen_card_activo_bg"
                                                    :dark="temas.cen_btns_dark==true"
                                                    class="mr-2"
                                                    @click="selectCartera(item)" v-on="on">
                                                    <v-icon>mdi-checkbox-marked-outline</v-icon>
                                                  </v-btn>
                                                </template>
                                                <span>Seleccionar</span>
                                              </v-tooltip>
                                            </template>
                                          </v-data-table>
                                        </v-col>
                                      </v-row>
                                      <v-row v-show="habinhab('cheque de tercero')">
                                        <v-col cols="3" sm="3" md="3">
                                          <v-btn
                                            :color="temas.cen_btns_bg"
                                            :dark="temas.cen_btns_dark==true"
                                            @click="seleccionAutomatica">
                                            Selección Automática
                                          </v-btn>
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3">
                                          <v-btn
                                            :color="temas.cen_btns_bg"
                                            :dark="temas.cen_btns_dark==true"
                                            @click="limpiarSeleccion">
                                            Limpiar Selección
                                          </v-btn>
                                        </v-col>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            disabled dense outlined
                                            v-model="importeTotalDelPago"
                                            label="A seleccionar">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            disabled dense outlined
                                            v-model="totCheTerSelecc"
                                            label="Total cheques seleccionados">
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="2" sm="2" md="2">
                                          <v-text-field
                                            disabled dense outlined
                                            v-model="totCheTerDiff"
                                            label="Falta">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <!-- GRILLA DE CHEQUES DE TERCERO -->

                                      <!-- TARJETA -->
                                      <v-row v-show="habinhab('tarjeta')">
                                        <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                                          <v-select
                                            label='Tarjeta'
                                            v-model="editadoMed.tarjeta_id"
                                            :color="temas.forms_titulo_bg"
                                            :items="tarItems"
                                            item-value="id"
                                            @change="elMedioEsOk()"
                                            :item-text="tarItems=>
                                              `
                                              ${tarItems.nombre} -
                                              ${tarItems.debito ? ' Débito ' : ' Crédito '} -
                                              Nro: ${tarItems.numero} -
                                              Ven: ${tarItems.vencimiento}
                                              `">
                                          </v-select>
                                        </v-col>
                                      </v-row>

                                      <!-- CHEQUE PROPIO -->
                                      <v-row v-show="habinhab('cuenta origen')">
                                        <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                                          <v-select
                                            label='Cuenta Origen'
                                            v-model="editadoMed.cuentaorigen_id"
                                            :color="temas.forms_titulo_bg"
                                            :items="cueItems"
                                            item-value="id"
                                            :item-text="cueItems=>
                                              `
                                              ${cueItems.banco.nombre} -Cuenta:
                                              ${cueItems.cuenta} -
                                              ${cueItems.nombre}
                                              `"
                                              @change="selCuenta() || elMedioEsOk()">
                                          </v-select>
                                        </v-col>
                                      </v-row>

                                      <v-row v-show="habinhab('cheque propio')">
                                        <v-col cols="5" sm="5" md="5" class="pt-0 pb-0">
                                          <v-select
                                            label="Chequera"
                                            v-model="editadoMed.chequera_id"
                                            :color="temas.forms_titulo_bg"
                                            :items="chraItems"
                                            item-value="id"
                                            item-text="nombre"
                                            autocomplete
                                            @change="selChequera()"
                                            @keyup="elMedioEsOk()"
                                            return-object>
                                          </v-select>
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3" class="pt-0 pb-0">
                                          <v-select
                                            label="Cheque"
                                            v-model="editadoMed.cheque_id"
                                            :color="temas.forms_titulo_bg"
                                            :items="cheItems"
                                            item-value="id"
                                            item-text="numero"
                                            autocomplete
                                            @change="selCheque()"
                                            @keyup="elMedioEsOk()"
                                            return-object>
                                          </v-select>
                                        </v-col>
                                        <v-col cols="3" sm="3" md="3" class="pt-0 pb-0">
                                          <v-text-field
                                            type="date"
                                            v-model="editadoMed.fechafinanciera"
                                            :color="temas.forms_titulo_bg"
                                            label="Fecha del Cheque"
                                            @keyup="elMedioEsOk()"
                                            @change="verificoFechaDelCheque(item)">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>

                                      <!-- TRANSFERENCIAS -->
                                      <v-row v-show=
                                        "habinhab('transferencia') || habinhab('tarjeta')">
                                        <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                                          <v-select
                                            label='Cuenta Destino'
                                            v-model="editadoMed.cuentadestino_id"
                                            :color="temas.forms_titulo_bg"
                                            :items="cueProvItems"
                                            item-value="id"
                                            @change="elMedioEsOk()"
                                            :item-text="cueProvItems=>
                                              `
                                              ${cueProvItems.banco.nombre} -Cuenta:
                                              ${cueProvItems.cuenta} -
                                              ${cueProvItems.nombre}
                                              `">
                                          </v-select>
                                        </v-col>
                                      </v-row>

                                      <!-- FOTO -->
                                      <v-row v-show="habinhab('transferencia')">
                                        <v-col cols="6" sm="6" align="center" class="pt-0 pb-0">
                                          <v-file-input
                                            v-model="foto"
                                            label="Foto del valor"
                                            prepend-icon="mdi-camera"
                                            :color="temas.forms_titulo_bg"
                                            @change="fotoClick">
                                            <template v-slot:selection="{ text }">
                                              {{ foto.name ?
                                                 foto.name :
                                                 foto }}
                                            </template>
                                          </v-file-input>
                                        </v-col>
                                        <v-col cols="6" sm="6" align="center" class="pt-0 pb-0">
                                          <v-img
                                            :src="`/images/${foto.name ? foto.name : foto}`"
                                            aspect-ratio="1.4" contain
                                            class="pb-0">
                                          </v-img>
                                        </v-col>
                                      </v-row>
                                      <!-- FOTO -->

                                      <v-row>
                                        <v-col v-show="
                                          habinhab('transferencia') ||
                                          habinhab('tarjeta')"
                                          cols="6" sm="6" md="6" class="pt-0 pb-0">
                                          <v-text-field
                                            v-model="editadoMed.nrovalor"
                                            @keyup="elMedioEsOk()"
                                            :color="temas.forms_titulo_bg"
                                            label="Nro Referencia">
                                          </v-text-field>
                                        </v-col>
                                        <v-col v-show="
                                          habinhab('transferencia') ||
                                          habinhab('efectivo') ||
                                          habinhab('tarjeta') ||
                                          habinhab('cheque propio') ||
                                          habinhab('chequera')"
                                          cols="6" sm="6" md="6" class="pt-0 pb-0">
                                          <v-text-field
                                            v-model="editadoMed.importe"
                                            @keyup="elMedioEsOk()"
                                            :color="temas.forms_titulo_bg"
                                            label="Importe">
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                    </v-container>
                                    <!-- FIN MEDIOS DE PAGO -->

                                  </v-card-text>
                                </v-card>
                              </v-dialog>
                            </template>

                            <template v-slot:item.activo="{ item }">
                              <v-chip label
                                :color="getColor(item.activo)"
                                dark>{{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>

                            <template v-slot:item.accion="{item}">
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small class="mr-2"
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="editarMed(item)" v-on="on">
                                    <v-icon>mdi-pencil</v-icon>
                                  </v-btn>
                                </template>
                                <span>Editar</span>
                              </v-tooltip>

                              <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                  <v-btn
                                    fab x-small
                                    class="mr-2"
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
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
                              <v-text-field
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

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>

            </v-dialog>
            <!-- FIN DEL PAGO -->

            <!--// ADMINISTRACION DE GASTOS // -->
            <v-dialog v-model="dialogGas" max-width="1260px">
              <template v-slot:activator="{}"></template>
              <v-data-table
                :headers="headersGas"
                :items="gastos"
                :search="search"
                dense
                class="elevation-3"
                :footer-props="footerProps10">
                <template v-slot:top>

                  <v-toolbar flat
                    :color="temas.forms_titulo_bg"
                    :dark="temas.forms_titulo_dark==true">
                    <v-btn icon @click="cerrarGas"
                      :color="temas.forms_close_bg"
                      :dark="temas.forms_close_dark==true">
                      <v-icon>mdi-arrow-left-circle</v-icon>
                    </v-btn>
                    <template v-slot:extension>
                      <v-btn
                        fab
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="nuevoGasto">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>

                    <v-toolbar-title class="body-1 white--text">
                      Gastos Programados
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>

                    <!-- Modal del diálogo para Alta y Edicion -->
                    <v-dialog v-model="dialogGasEdit" max-width="550px">
                      <template v-slot:activator="{ on }"></template>
                      <v-card>

                        <v-toolbar flat
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true">
                          <v-btn icon
                            :color="temas.forms_close_bg"
                            :dark="temas.forms_close_dark==true"
                            @click="cancelarGas">
                            <v-icon>mdi-arrow-left-circle</v-icon>
                          </v-btn>
                          <span class="headdline">{{ formTitleGas }}</span>
                          <v-spacer></v-spacer>

                          <v-btn v-show="gastoOk"
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            class="ma-2 white--text" @click="guardarGas">Guardar
                          </v-btn>

                        </v-toolbar>

                        <v-form ref="form">
                          <v-card-text>
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="12" md="12" class="pt-0">
                                  <v-autocomplete
                                    ref="tercerogastos"
                                    v-model="editadoGas.tercero_id"
                                    :items="itemsTerceros"
                                    :color="temas.forms_titulo_bg"
                                    :loading="isLoadingTerceros"
                                    :search-input.sync="searchTercerosGas"
                                    item-text="nombre"
                                    item-value="id"
                                    autofocus
                                    :disabled="gastoAgregaPeriodo==true"
                                    label="Proveedor"
                                    placeholder="Escriba para buscar"
                                    prepend-icon="mdi-database-search"
                                    @change="estaElGastoOk()">
                                  </v-autocomplete>
                                </v-col>
                                <v-col cols="5" sm="5" md="5" class="pt-0">
                                  <v-text-field
                                    ref="refvencimiento"
                                    type="date"
                                    v-model="editadoGas.vencimiento"
                                    :color="temas.forms_titulo_bg"
                                    label="Vencimiento"
                                    @change="cambioElVencimiento() && estaElGastoOk()">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="5" sm="5" md="5" class="pt-0">
                                  <v-text-field
                                    type="date"
                                    v-model="editadoGas.proximovencimiento"
                                    :color="temas.forms_titulo_bg"
                                    label="Próximo Vencimiento">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="2" sm="2" md="2" class="pt-0">
                                  <v-text-field
                                    disabled
                                    v-model="editadoGas.periodo"
                                    :color="temas.forms_titulo_bg"
                                    label="Per.Fiscal">
                                  </v-text-field>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="3" sm="3" md="3" class="pt-0">
                                  <v-text-field
                                    v-model="editadoGas.gravado"
                                    :color="temas.forms_titulo_bg"
                                    label="Gravado"
                                    @change="calculoElGasto() && estaElGastoOk()">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="3" sm="3" md="3" class="pt-0">
                                  <v-select v-show="esFiscal == true"
                                    label="Tasa de IVA"
                                    v-model="editadoGas.iva_id"
                                    :color="temas.forms_titulo_bg"
                                    :items="tasasIVA"
                                    item-value="afipiva_id"
                                    item-text="nombre"
                                    autocomplete
                                    return-object
                                    @change="calculoElGasto() && estaElGastoOk()">
                                  </v-select>
<!--
                                  <v-select
                                    label="Tasa de IVA"
                                    v-model="editadoGas.iva_id"
                                    :items="tasasIVA"
                                    item-value="id"
                                    item-text="nombre"
                                    :color="temas.forms_titulo_bg"
                                    autocomplete
                                    return-object
                                    @change="calculoElGasto()">
                                  </v-select>
-->
                                </v-col>
                                <v-col cols="3" sm="3" md="3" class="pt-0">
                                  <v-text-field
                                    v-model="editadoGas.iva"
                                    :color="temas.forms_titulo_bg"
                                    label="IVA"
                                    @change="calculoElGasto() && estaElGastoOk()">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="3" sm="3" md="3" class="pt-0">
                                  <v-text-field
                                    v-model="editadoGas.total"
                                    :color="temas.forms_titulo_bg"
                                    label="Total"
                                    @change="estaElGastoOk()">
                                  </v-text-field>
                                </v-col>

                              </v-row>
                              <v-row>
                                <v-col cols="7" sm="7" md="7" class="pt-0">
                                  <v-container fluid>
                                    <v-radio-group class="pt-0"
                                      v-model="editadoGas.fiscal" row>
                                      <v-radio value="1"
                                        :color="temas.forms_titulo_bg">
                                        <template v-slot:label>
                                          <div>
                                            <strong class="success--text">Fiscal</strong>
                                          </div>
                                        </template>
                                      </v-radio>
                                      <v-radio value="0"
                                        :color="temas.forms_titulo_bg">
                                        <template v-slot:label>
                                          <div>
                                            <strong class="primary--text">No Fiscal</strong>
                                          </div>
                                        </template>
                                      </v-radio>
                                    </v-radio-group>
                                  </v-container>
                                </v-col>
                              </v-row>

                              <v-row>
                                <v-col cols="3" sx="3" mx="3" class="pt-0">
                                  <v-text-field
                                    type="number"
                                    v-model="editadoGas.cuota"
                                    :color="temas.forms_titulo_bg"
                                    label="Cuota"
                                    @click="calculoCuotas()"
                                    @change="calculoCuotas()">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="3" sm="3" md="3" class="pt-0">
                                  <v-text-field
                                    type="number"
                                    v-model="editadoGas.cuotas"
                                    :color="temas.forms_titulo_bg"
                                    label="Cuotas Anuales"
                                    @click="calculoCuotas()"
                                    @change="calculoCuotas()">
                                  </v-text-field>
                                </v-col>
                                <v-col cols="6" sm="6" md="6" class="pt-0">
                                  <v-text-field
                                    :disabled="editadoGas.cuota>0 || editadoGas.cuotas>0"
                                    v-model="editadoGas.observ"
                                    :color="temas.forms_titulo_bg"
                                    label="Observaciones"
                                    counter maxlength="18"
                                    @chage="estaElGastoOk()">
                                  </v-text-field>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="5" sx="5" mx="5" class="pt-0">
                                  <v-text-field
                                    v-model="editadoGas.cpr"
                                    :color="temas.forms_titulo_bg"
                                    label="Comprobante"
                                    counter
                                    maxlength="19">
                                  </v-text-field>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                        </v-form>

                      </v-card>
                    </v-dialog>
                  </v-toolbar>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      v-model="search"
                      clearable
                      append-icon="search"
                      label="Buscar"
                      :color="temas.forms_titulo_bg"
                      class="pt-0"
                      single-line hide-details>
                    </v-text-field>
                  </v-col>

                </template>
                <template v-slot:item.vencimiento="{ item }">
                  <span disable dark>{{ formatoFechaCorta(item.vencimiento) }}</span>
                </template>
                <template v-slot:item.proximovencimiento="{ item }">
                  <span disable dark>{{ formatoFechaCorta(item.proximovencimiento) }}</span>
                </template>
                <template v-slot:item.total="{ item }">
                  <span disable dark>{{ formatoImporte(item.total) }}</span>
                </template>
                <template v-slot:item.fiscal="{ item }">
                  <v-chip
                    :color="getColor(item.fiscal)" dark>{{item.fiscal?'Sí':'No'}}
                  </v-chip>
                </template>
                <template v-slot:item.accion="{ item }">

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="!item.comprobante_id"
                        fab x-small class="mr-2"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="editarGas(item)" v-on="on">
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                    </template>
                    <span>Editar</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="!item.comprobante_id"
                        fab x-small class="mr-2"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="preguntoBorrarGasto(item)" v-on="on">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Borrar</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn
                        fab x-small class="mr-2"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="gastoAgregarPeriodo(item)" v-on="on">
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                    </template>
                    <span>Agregar Cuota/Igual Gasto</span>
                  </v-tooltip>

                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="!item.comprobante_id"
                        fab x-small class="mr-2"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="preguntoProcesarGasto(item)" v-on="on">
                        <v-icon>
                          mdi-playlist-check
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Generar Comprobante</span>
                  </v-tooltip>

                </template>
              </v-data-table>
            </v-dialog>
            <!-- FIN DE GASTOS -->

            <!--// ADMINISTRACION DE FALTANTES DE PEDIDOS // -->
            <v-dialog v-model="dialogFaltantes" max-width="1260px">
              <template v-slot:activator="{}"></template>
              <v-data-table
                :headers="headersFaltantes"
                :items="faltantes"
                :search="search"
                dense
                class="elevation-3"
                :footer-props="footerProps10">
                  <template v-slot:item.seleccionado="{ item }">
                    <v-chip label
                      :color="getColor(item.seleccionado)"
                      dark>{{item.seleccionado?'Sí':'No'}}
                    </v-chip>
                  </template>
                  <template v-slot:top>

                  <v-toolbar flat
                    :color="temas.forms_titulo_bg"
                    :dark="temas.forms_titulo_dark==true">
                    <v-btn icon @click="cerrarFaltantes"
                      :color="temas.forms_close_bg"
                      :dark="temas.forms_close_dark==true">
                      <v-icon>mdi-arrow-left-circle</v-icon>
                    </v-btn>
                    <template v-slot:extension>

                      <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                          <v-btn
                            fab class="mr-2"
                            :color="temas.cen_btns_bg"
                            :dark="temas.cen_btns_dark==true"
                            @click="generarCompra(item)" v-on="on">
                            <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                          </v-btn>
                        </template>
                        <span>Generar Compra</span>
                      </v-tooltip>
                    </template>

                    <v-toolbar-title class="body-1 white--text">
                      Artículos pedidos y que no fueron vendidos por falta de stock
                    </v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>

                  </v-toolbar>
                </template>
                <template v-slot:item.fecha="{ item }">
                  <span disable dark>{{ formatoFechaCorta(item.fecha) }}</span>
                </template>
                <template v-slot:item.faltante="{ item }">
                  <span disable dark>{{ formatoImporte(item.faltante) }}</span>
                </template>
                <template v-slot:item.accion="{ item }">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="!item.comprobante_id"
                        fab x-small class="mr-2"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="preguntoBorrarFaltante(item)" v-on="on">
                        <v-icon>mdi-delete</v-icon>
                      </v-btn>
                    </template>
                    <span>Borrar</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn v-show="!item.comprobante_id"
                        fab x-small class="mr-2"
                        :color="temas.cen_btns_bg"
                        :dark="temas.cen_btns_dark==true"
                        @click="seleccionarFaltante(item)" v-on="on">
                        <v-icon>mdi-checkbox-marked-circle-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>Seleccionar</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </v-dialog>
            <!-- FIN DE FALTANTES PEDIDOS -->

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
                    El proveedor puede haber cambiado reglas, precios o varios clientes pueden
                    estar comprando al mismo tiempo disminuyendo asi el stock disponible.<br>
                    En la columna <b>Error</b> se detalla el tipo de problema. Seleccione
                    <b>Arreglar Pedido</b> para que el sistema realice las modificaciones
                    necesarias por Ud.<br>
                    IMPORTANTE: Seran eliminadas las promociones que esten pausadas, o sin
                    unidades disponibles y las reglas que no coincidan.
                    <br>
                    Otra opcion es que edites el pedido y realices las modificaciones en los
                    artículos indicados.
                    <br>
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
                            label='¿Como califica al pedido?' outlined
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
                            label="Como califica la operacion?">
                          </v-rating>
                        </v-col>
                      </v-row>

                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
            <!-- FIN DE RECEPCION DE PEDIDOS -->
          </v-toolbar>

          <!-- BARRA DE BUSQUEDA -->
          <v-row class="pl-3">
            <v-col cols="3" sm="3">
              <v-text-field
                v-model="search"
                clearable
                append-icon="search"
                label="Buscar"
                :color="temas.forms_titulo_bg"
                class="pt-0"
                single-line hide-details>
              </v-text-field>
            </v-col>
            <v-col cols="9" sm="9">
              <span v-for="(fe, idx) in filtrosEstados" v-bind:key="idx">
                <v-badge
                  class="pt-2 pl-0 pr-0"
                  overlap
                  :content="fe.ctt"
                  :color="temas.forms_btn_add_bg"
                  :dark="temas.forms_btn_add_bg==true" rigth>
                  <v-chip
                    dense :value="fe" label
                    :color=
                    "fe.tip==filtroEstadoSel?temas.cen_card_activo_bg:temas.barra_principal_bg"
                    :dark=
                    "fe.tip==filtroEstadoSel?temas.cen_card_activo_dark:temas.barra_principal_dark"
                    class="ml-2 mini-font"
                    @click="setFiltroEstado(fe)">
                    {{ fe.tip }}
                  </v-chip>
                </v-badge>
              </span>
            </v-col>
          </v-row>
          <!-- FIN DE LA BARRA DE BUSQUEDA -->
<!--
          <v-col cols="12" sm="12">
            <v-text-field
              v-model="search"
              :color="temas.forms_titulo_bg"
              append-icon="search"
              label="Buscar"
              single-line hide-details>
            </v-text-field>
          </v-col>
-->
        </template>
        <template v-slot:expanded-item="{ headers, item }">
          <td :colspan="headers.length">
            <v-data-table v-if="filtroComprobanteSel!='Pagos'"
              :headers="headersItems"
              :items="item.items"
              dense
              :footer-props="footerProps200">
              <template v-slot:item.articulo.codigo="{ item }">
                <span>{{ item.articulo.codigo }}</span>
                <v-badge
                  inline
                  :content="item.articulo.iva.nombre"
                  color="temas.forms_btn_add_bg"
                  :dark="temas.forms_btn_add_bg==true" left>
                </v-badge>
              </template>
              <template v-slot:item.articulo.nombre="{ item }">
                <span disable dark> {{
                  item.articulo.codigo=='1@1' ? item.texto : item.articulo.nombre
                }}</span>
              </template>
              <template v-slot:item.cantidad="{ item }">
                <span disable dark>{{ formatoImporte(item.cantidad) }}</span>
              </template>
              <template v-slot:item.precio="{ item }">
                <v-badge v-if="item.texto=='Promocion'"
                  class="pt-2"
                  :content="'pro'"
                  :color="temas.forms_btn_add_bg"
                  :dark="temas.forms_btn_add_bg==true" left>
                </v-badge>
                <v-badge v-else-if="item.texto=='Regla'"
                  class="pt-2"
                  :content="'reg'"
                  :color="temas.forms_btn_add_bg"
                  :dark="temas.forms_btn_add_bg==true" left>
                </v-badge>
                <span disable dark>${{ formatoImporte(item.precio) }}</span>
              </template>
              <template v-slot:item.tasadescuento="{ item }">
                <span>{{ formatoImporte(item.tasadescuento) }}</span>
              </template>
              <template v-slot:item.importedescuento="{ item }">
                <span>${{ formatoImporte(item.importedescuento) }}</span>
              </template>
              <template v-slot:item.total="{ item }">
                <span>${{ formatoImporte(item.total) }}</span>
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
                <span>{{formatoFechaCorta(item.cancelado.comprobante.fecha)}}</span>
              </template>
              <template v-slot:item.cancelado.importe="{ item }">
                <span>${{ formatoImporte(item.cancelado.importe) }}</span>
              </template>
              <template v-slot:item.cancelado.pendiente="{ item }">
                <span>${{ formatoImporte(item.cancelado.pendiente)}}</span>
              </template>
            </v-data-table>
          </td>
        </template>

        <template v-slot:item.tercero.nombre="{ item }">
          <span>{{ item.tercero.nombre.substring(0,30)}}</span>
          <v-badge v-if="item.tercero.user!=null"
            class="pt-1 pl-2"
            :content="item.tercero.user.externo ? 'x' : 'g'"
            :color="item.tercero.user.externo ? 'black' : temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
        </template>

        <template v-slot:item.observaciones="{ item }">
          <span disable dark>
            {{item.observaciones=='PEDIDO DEL CLIENTE' ? 'La Empresa' : 'El Vendedor' }}
          </span>
        </template>
        <template v-slot:item.fecha="{ item }">
          <span disable dark>{{ formatoFechaCorta(item.fecha) }}</span>
        </template>

        <template v-slot:item.total="{ item }">
          <v-chip outlined label :color="getColorTotal(item)">
            <b>$ {{ formatoImporte(item.total) }}</b>
          </v-chip>
          <v-badge v-if="importada(item)"
            class="pt-2"
            :content="'i'"
            :color="temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true" rigth>
          </v-badge>
        </template>

        <template v-slot:item.pendientes[0].pendiente="{ item }">
          <span>
            <b>$ {{ formatoImporte(item.pendientes[0] ? item.pendientes[0].pendiente : 0) }}</b>
          </span>
        </template>
        <template v-slot:item.estado="{ item }">
          <v-rating v-if="item.rating>=1 && item.rating<=5"
            dense
            v-model="item.rating"
            :color="temas.barra_principal_bg"
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
            <b>{{ getEstado(item.estado,'e',item.pendientes[0], item.carga, item) }}</b>
          </v-chip>
        </template>

        <!-- BOTONES DE LA GRID PRINCIPAL-->
        <template v-slot:item.accion="{ item }">
          <v-menu bottom left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :color="temas.cen_btns_bg"
                :dark="temas.cen_btns_dark==true"
                icon v-bind="attrs" v-on="on" @click="setAcciones(item)">
                <v-icon
                  :color="temas.cen_btns_bg"
                  :dark="temas.cen_btns_dark==true">
                  mdi-dots-vertical
                </v-icon>
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
      <confirmacion v-model='msg.msgAccion'
        :title=this.msg.msgTitle
        :body=this.msg.msgBody
        :visible=this.msg.msgVisible
        :buttons=this.msg.msgButtons
        @click="msgRespuesta">
      </confirmacion>
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
import confirmacion from "./Forms/confirmacion.vue";
import impresiones from "./Forms/impresiones.vue";
import XLSX from 'xlsx';
import jsPDF from 'jspdf';

export default {
  components: {
    SBar,
    confirmacion,
    impresiones,
  },
  data: () => ({
    proveedorVinculado: 0,
    compraOk: false,
    gastoOk: false,
    progress: false,
    cprActual: null,  // para cuando esta modificando y no detecte que ya existe
    elMes: '',
    elAnio: '',
    anio: '',
    anios: [],
    meses: [],
    losMeses: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Set','Oct','Nov','Dic'],
    singleExpand: false,
    cambioElPrecio: 0,
    basadoEnCpr: false,      // si el comprobante actual esta basado en otro comprobante. ( fac/ped, rem/fac, etc)
    notificaEnBaseAOtro: [], // arreglo para realizar la notificacion de comprobantes.
    notificaOriginal: [],    // cuando es notificaEnBaseAOtro, debo marcar el comprobante padre.
    basadoEnOtroCpr: [],     // arreglo para grabar la en que comprobante esta basado el actual
    fecha: moment().format('YYYY-MM-DD'),
    vencimiento: moment().format('YYYY-MM-DD'),
    cfUser: '',
    coef: 1,  // para signar los comprobantes + o -
    modelo: 'compras',
    esFiscal: true,
    esCIN: false,
    ctacte: false,
    formTitle: '',
    formTitleArt: '',
    formTitleMed: '',
    formTitleGas: '',
    itemActual: null,
    itemActualItem: null,
    itemActualGasto: null,
    foto: [],
    excel: [],
    xlsCargado: false,
    compraExcel: {cuit:null,fecha:null,perfiscal:null,tipcpr:null,succpr:null,nrocpr:null,moneda:null,totalitems:null,
      tasades: null,impdes:null,retiva:null,retgan:null,retib:null,impint:null,nogravado:null,flete:null,gravado:null,exento:null,iva:null,total:null,
      items:[{
        codigo:null,micodigo:null,nombre:null,precio:0,tasdes:0,impdes:0,subtot:0,cantidad:0,total:0,tasaIVA:0
      }]
    },
    codigos: [],
    elMedioEstaOk: false,
    comprobantes: [
      { nombre: 'Facturas', total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 29 },
      { nombre: 'Créditos', total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 30 },
      { nombre: 'Débitos',  total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 31 },
      { nombre: 'Presup.',  total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 32 },
      { nombre: 'Remitos',  total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 33 },
      { nombre: 'Pedidos',  total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 34 },
      { nombre: 'Gastos',   total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 35 },
      { nombre: 'Pagos',    total: 0, ctt: 0, bg: '', dark: '', activo: true, pos: 36 },
    ],
    recepcion: {
      respuesta: '¡El pedido está correcto!',
      fechaenvio: '',
      fechallegada: '',
      observaciones: '¡El pedido está correcto!',
      calificacion: 5,
    },
    recepcionRespuestas: [
      '¡El pedido está correcto!',
      '¡Pedido correcto pero con demora!',
      '¡Productos rotos o mal embalados!',
      '¡No son los productos que compre!',
      'Informar otro problema'
    ],

    // filtro
    filtro: '',
    filtroComprobante: [1,6,14,128],
    filtroComprobanteSel: 'Facturas',
    filtroTercero_id: null,

    //pago
    pagoDeUnSoloComprobante: false,
    esUnPagoDeUnaFactura: false,
    medioDePagoId: 1,
    medioDePagoNombre: '',
    importePago: 0,
    totCancelado: 0,
    totValores: 0,
    valDiferencia: 0,
    totCheTerSel: 0,
    medpagwidth: 0,
    cttChePropEnPago: 0,
    chePropEnPagoMantener: false,
    pagoVinculado: false,
    medpag: [
      {id:1, nombre: 'Efectivo',         activo: true,  tipo:'CAJ', total: 0, idmdp: 1},
      {id:2, nombre: 'Tarj.de Crédito',  activo: true,  tipo:'TDC', total: 0, idmdp: 2},
      {id:3, nombre: 'Tarj.de Débito',   activo: true,  tipo:'TDD', total: 0, idmdp: 3},
      {id:4, nombre: 'Cuenta Corriente', activo: false, tipo:'CTE', total: 0, idmdp: 4},
      {id:5, nombre: 'Transferencia',    activo: true,  tipo:'TRA', total: 0, idmdp: 5},
      {id:6, nombre: 'Cheque de Tercero',activo: true,  tipo:'CHE', total: 0, idmdp: 6},
      {id:7, nombre: 'Cheque Propio',    activo: true,  tipo:'CHE', total: 0, idmdp: 6},
      {id:8, nombre: 'Mercado Pago',     activo: true,  tipo:'MEP', total: 0, idmdp: 7},
      {id:9, nombre: 'Todo Pago',        activo: true,  tipo:'TPA', total: 0, idmdp: 8},
      {id:10, nombre: 'Canje',           activo: false, tipo:'CJE', total: 0, idmdp: 9},
    ],
    cpr: '',
    tl: "text-lowercase",
    cprItems: [],
    depItems: [],
    uniItems: [],
    monItems: [],
    ivaItems: [],
    ivaTasas: [],
    dirItems: [],
    expanded: [],

    cueItems: [],
    cueProvItems: [],
    chraItems: [],
    cheItems: [],
    tarItems: [],

    lisValue: [],
    dirValue: [],
    medValue: [],
    lisObj: [],
    items: [],
    itemsAll: [],
    tasasIVA: [],
    articulos: [],
    valores: [],
    cartera: [],
    pendientes: [],
    pend: [],
    rastreo: [],
    gastos: [],
    selected: [],
    selectedCheque:[],
    acciones: [],
    faltantes: [],
    timeLine: [],
    selArtPedErr: [],
    accionesItems: [],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    imp: {
      tipcpr: '',
      items: [],
    },
    max25chars: v => v.length <= 25 || 'Input too long!',
    nombreRules: [
      (v) => !!v || 'El nombre es requerido',
      (v) => v.length <= 50 || 'Ingrese hasta 50 caracteres'
    ],
    footerProps: {'items-per-page-options': [5, 5, 15, 100]},
    footerProps8: {'items-per-page-options': [8]},
    footerProps10: {'items-per-page-options': [10]},
    footerProps200: {'items-per-page-options': [200]},
    busArt: '',
  //busArtSave: '',
    search: '',
    searchTerceros: '',
    searchTercerosGas: '',
    searchTercerosPag: '',
    dialogCab: false,
    dialogArt: false,
    dialogEditArt: false,
    dialogTasaArt: false,
    dialogMed: false,
    dialogPend: false,
    dialogRas: false,
    dialogGas: false,
    dialogGasEdit: false,
    dialogPag: false,
    dialogPagAnula: false,
    dialogCheDisp: false,
    dialogFaltantes: false,
    dialogRecepcion: false,
    dialogTimeLine: false,
    dialogCambiarPeriodoFiscal: false,
    dialogError: false,
    dialogImportarDesde: false,
    importarDesdeFormato: '',
    gastoAgregaPeriodo: false, // Si agrega periodo a un gasto 
    totalCabecera: 0,
    totalArticulos: 0,
    diferencia: 0,

    // definimos los headers de la datatables
    headers: [],
    headersNor: [
      //{ text: 'ID', value:'id', align: 'left', width: 70},
      { text: 'COMPROBANTE', value:'cpr', align: 'left', width: 180},
      { text: 'FECHA', value:'fecha', align: 'left', width: 89},
      { text: 'PFiscal', value:'perfiscal', align: 'left', width: 89},
      { text: 'PROVEEDOR', value:'tercero.nombre', align: 'left', width: 300},
      { text: 'PENDIENTE', value:'pendientes[0].pendiente', align: 'end', width: 150},
      { text: 'TOTAL', value:'total', align: 'end', width: 150},
      { text: 'ESTADO', value:'estado', align: 'left', width: 130},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersPed: [
      { text: 'COMPROBANTE', value:'cpr', align: 'left', width: 180},
      { text: 'FECHA', value:'fecha', align: 'left', width: 89},
      { text: 'PROVEEDOR', value:'tercero.nombre', align: 'left', width: 300},
      { text: 'TOTAL', value:'total', align: 'end', width: 150},
      { text: 'PEDIDO POR', value:'observaciones', align: 'left', width: 150},
      { text: 'ESTADO', value:'estado', align: 'left', width: 130},
      { text: 'ACCIONES', value: 'accion', sortable: false },
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
    headersGas: [
      { text: 'EMPRESA',     value: 'tercero.nombre',     align: 'left', width: 300},
      { text: 'PERIODO',     value: 'periodo',            align: 'left', width: 105},
      { text: 'OBSERV',      value: 'observ',             align: 'left', width: 170},
      { text: 'VENCIMIENTO', value: 'vencimiento',        align: 'left', width: 130},
      { text: 'PROX.VENC.',  value: 'proximovencimiento', align: 'left', width: 130},
      { text: 'TOTAL',       value: 'total',              align: 'end',  width: 130},
      { text: 'FISCAL',      value: 'fiscal',             align: 'left', width: 100},
//    { text: 'COMPROBANTE', value: 'comprobante', align: 'left', width: 180},
      { text: 'ACCIONES',    value: 'accion', sortable: false },
    ],
    headersFaltantes: [
      { text: 'COMPROBANTE',      value: 'cpr',                align: 'left', width: 180},
      { text: 'FECHA',            value: 'fecha',              align: 'left', width: 96},
      { text: 'CLIENTE',          value: 'cliente',            align: 'left', width: 230},
//    { text: 'CODIGO',           value: 'codigo',             align: 'left', width: 100},
      { text: 'ARTICULO',         value: 'articulo',           align: 'left', width: 420},
      { text: 'FALTARON VENDER',  value: 'faltante',           align: 'end',  width: 130},
      { text: 'Sel',              value: 'seleccionado',       align: 'end',  width: 30},
      { text: 'ACCIONES',         value: 'accion', sortable: false },
    ],
    headersCancelaciones: [
      { text: 'Cpr', value:'cancelado.comprobante.cpr', align: 'left', width: 150},
      { text: 'Observaciones', value:'concepto', align: 'left', width: 200},
      { text: 'Feccha', value:'cancelado.comprobante.fecha', align: 'end', width: 90},
      { text: 'Cancelado', value:'cancelado.importe', align: 'end', width: 120},
      { text: 'Pendiente', value:'cancelado.pendiente', align: 'end', width: 120},
    ],
    headersTasasDeIVA: [
      { text: 'TASA', value:'tasa', align: 'left', width: 90},
      { text: 'BASE', value:'base', align: 'right', width: 60},
      { text: 'IVA', value:'iva', align: 'right', width: 60},
    ],
    headersArt: [
      { text: 'Código',      value:'codigo', align: 'left', width: 150},
      { text: 'Descripción', value:'nombre', align: 'left', width: 343},
      { text: 'Ctt',         value:'cantidad', align: 'end', width: 100},
      { text: 'Precio',      value:'precio', align: 'end', width: 120},
      { text: '%Desc.',      value:'tasadescuento', align: 'end', width: 90},
      { text: 'Descuento',   value:'importedescuento', align: 'end', width: 120},
      { text: 'TOTAL',       value:'total', align: 'end', width: 150},
      { text: 'Acciones',    value: 'accion', sortable: false, width: 120 },
    ],
    headersArtExcel: [
      { text: 'Cód.Prov',    value:'codigo', align: 'left', width: 110},
      { text: 'Mi Cód.',     value:'micodigo', align: 'left', width: 110},
      { text: 'Descripción', value:'nombre', align: 'left', width: 300},
      { text: 'Ctt',         value:'cantidad', align: 'end', width: 100},
      { text: '%Desc.',      value:'tasdes', align: 'end', width: 90},
      { text: 'Descuento',   value:'impdes', align: 'end', width: 120},
      { text: 'Precio',      value:'precio', align: 'end', width: 120},
      { text: 'TOTAL',       value:'total', align: 'end', width: 150},
      { text: 'Acciones',    value:'accion', sortable: false },
    ],
    headersCartera: [
      { text: 'Banco',      value: 'nomban',           align: 'left', width: 240},
      { text: 'CUIT',       value: 'cuitlib',          align: 'left', width: 90},
      { text: 'Librador',   value: 'nomlib',           align: 'left', width: 240},
      { text: 'NroValor',   value: 'nrovalor',         align: 'end',  width: 120},
      { text: 'Fec.Fin.',   value: 'fechafinanciera',  align: 'left', width: 98},
      { text: 'Días',       value: 'dias',             align: 'end',  width: 90},
      { text: 'Importe',    value: 'importe',          align: 'end',  width: 150},
//    { text: 'Sel',        value: 'seleccionado',     align: 'center', width: 80},
      { text: 'Sel',        value: 'accion',           sortable: false },
    ],
    headersMed: [
      { text: 'MEDIO', value:'medioNombre',    align: 'left', width: 170},
      { text: 'OBSERVACIONES', value:'observ', align: 'left', width: 720},
      { text: 'TOTAL', value:'importe',        align: 'end',  width: 120},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersSelArt: [
      { text: 'ID', value:'id'},
      { text: 'CODIGO', value:'codigo'},
      { text: 'NOMBRE', value:'nombre'},
      { text: 'STOCK', value:'stock'},
      { text: 'PRECIO', value:'costo', align: 'end', width: 100},
    ],
    headersRas: [
      { text: 'PADRE',     value:'padre_id'}, 
      { text: 'ORIGEN',    value:'cpr1'},
      { text: 'TERCERO 1', value:'nombre1'},
      { text: 'HIJO',      value:'hijo_id'},
      { text: 'DESTINO',   value:'cpr2'},
      { text: 'TERCERO 2', value:'nombre2'},
    ],
    headersPend: [
      { text: 'CPR',         value:'cpr'}, 
      { text: 'VENCIMIENTO', value:'vencimiento'},
      { text: 'IMPORTE',     value:'importe'},
      { text: 'PENDIENTE',   value:'pendiente'},
      { text: 'A CANCELAR',  value:'acancelar'},
      { text: 'ACCIONES',    value: 'accion', sortable: false },
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
    editedIndex: -1,
    editedIndexArt: -1,
    editedIndexMed: -1,
    editedIndexGas: -1,
    afipSuc: '',
    afipNro: '',
    editado: {
      id: '',
      fecha: moment().format('YYYY-MM-DD'),
      perfiscal: '',
      cpr: '',
      tipo: '',
      tercero_id: '',
      nombre: '',
      comprobante_id: '',
      documento_id: '',
      medio_id: '',
      lista_id: '',
      deposito_id: '',
      vendedor: {id: null, nombre: 'MOSTRADOR'},
      moneda_id: 51,
      direccion_id: '',
      tasadescuento: 0,
      importedescuento: 0,
      retiva: 0,
      retgan: 0,
      retib: 0,
      impint: 0,
      nogravado: 0,
      flete: 0,
      gravado: 0,
      exento: 0,
      iva: 0,
      total: 0,
      poradcosto: 0,
      regstk: 0,
      vencimiento: moment().format('YYYY-MM-DD'),
      documento: '',
      documentoNumero: '',
      responsableAbrev: '',
      letra: '',
      activo: true,
      observaciones: '',
    },
    defaultItem: {
      id: '',
      fecha: moment().format('YYYY-MM-DD'),
      perfiscal: '',
      cpr: '',
      tipo: '',
      tercero_id: '',
      nombre: '',
      comprobante_id: '',
      documento_id: '',
      medio_id: '',
      lista_id: '',
      deposito_id: '',
      vendedor: {id: null, nombre: 'MOSTRADOR'},
      moneda_id: 51,
      direccion_id: '',
      tasadescuento: 0,
      importedescuento: 0,
      retiva: 0,
      retgan: 0,
      retib: 0,
      impint: 0,
      nogravado: 0,
      flete: 0,
      gravado: 0,
      exento: 0,
      iva: 0,
      total: 0,
      poradcosto: 0,
      regstk: 0,
      vencimiento: moment().format('YYYY-MM-DD'),
      documento: '',
      documentoNumero: '',
      responsableAbrev: '',
      letra: '',
      activo: true,
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
      moneda_id: '',
      monedaNombre: '',
      iva_id: '',
      ivaNombre: '',
      cantidad: 1,
      stock: 1,
      undstock: 1,
      costo: 0,
      costoanterior: 0,
      precio: 0,
      preciooriginal: 0,
      tasadescuento: 0,
      importedescuento: 0,
      decimales: 0,
      total: 0,
      texto: '',
      vencimiento: '',
      pubprecio: 0,
      pubtasdes: 0,
      pubenvio: 0,
      pubunidades: 0,
      pubestado: '',
      unidadesRegla: [],
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
      cantidad: 1,
      stock: 1,
      undstock: 1,
      costo: 0,
      costoanterior: 0,
      precio: 0,
      preciooriginal: 0,
      tasadescuento: 0,
      importedescuento: 0,
      decimales: 0,
      total: 0,
      texto: '',
      vencimiento: '',
      pubprecio: 0,
      pubtasdes: 0,
      pubenvio: 0,
      pubunidades: 0,
      pubestado: '',
      unidadesRegla: [],
    },
    editadoPend: {
      acancelar: '',
    },
    editadoMed: {
      id: null,
      caja_id: null,
      medio_id: null,
      cuentaorigen_id: null,
      cuentadestino_id: null,
      cuentacheque_id:   null,
      cuentatarjeta_id:  null,
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
      foto: null,
      importe: 0,
    },
    defaultItemMed: {
      id: null,
      caja_id: null,
      medio_id: null,
      cuentaorigen_id: null,
      cuentadestino_id: null,
      cuentacheque_id:   null,
      cuentatarjeta_id:  null,
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
      foto: null,
      importe: 0,
    },
    editadoGas: {
      id: null,
      tercero_id: null,
      observ: null,
      cuota: 0,
      cuotas: 0,
      periodo: null,
      vencimiento: null,
      proximovencimiento: null,
      gravado: 0,
      afipiva_id: 5,
      iva: 0,
      total: 0,
      pagado: 0,
      fiscal: 0,
      comprobante_id: null,
      fijo: false,
      cpr: '',
    },
    defaultItemGas: {
      id: null,
      tercero_id: null,
      observ: null,
      cuota: 0,
      cuotas: 0,
      periodo: null,
      vencimiento: null,
      proximovencimiento: null,
      total: 0,
      pagado: 0,
      fiscal: 0,
      comprobante_id: null,
      fijo: false,
      cpr: '',
    },

    selArt: [],
    seleccionarArticulo: false,
    descriptionLimit: 80,
    entriesTerceros: [],
    entriesTercerosPag: [],
    entriesArticulos: [],
    entriesMedios: [],
    tercerosUserId: [],
    isLoadingTerceros: false,
    isLoadingTercerosPag: false,
    isLoadingArticulos: false,
    isLoadingMedios: false,
    totalItems: 0,
    itemsCargadosGravado: 0,
    itemsCargadosIVA: 0,
    gravadoDiff: 0,
    ivaDiff: 0,
    editarItems: false,
    maxDiasChq: -1,
    laFechaDelChequeEstaOk: false,

    filtrosEstados: [],
    filtroEstadoSel: 'Todos',

    reglas: [],
    reglasDelTer: [],
    precioOrigen: 'Lista',  // Lista, Promocion, Regla, por defecto Lista = precios.precio
    reglaDescuento: 0,  // Descuento por Regla ( si hay )
    promoDescuento: 0,  // Descuento por Promo ( si hay )
    precioDescuento: 0, // Descuento de Regla, Promocion o de Item ( ingresado en Comrpas )
    cttMinima: 1,       // Cabtidad minima para aplicar la regla
    unidadesRegla: [], // Unidades minimas para aplicar en reglas

    contador: 1,
    yaMonto: false,

  }),

  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    //...mapMutations(['alert','closeAlert']),
    ...mapState([
      'sucursal',
      'sucursales',
      'sucursalDemo',
      'sucursalFiscal',
      'proveedor',
      'proveedores',
      'tema',
      'temas',
      'centrales',
      'notificaciones',
      'caja',
      'vinculosPadres', 
      'vinculosHijos',
      'empresa',
      'datosEmpresa',
      'tercero',
      'responsable',
      'cuit',
      'operario',
      'operarioVendedor',
      'operarioTerceroId',
      'operarioId',
      'level',
      'roles',
      'externo',
      'publicaciones'
    ]),


    itemsTerceros () {
      return this.entriesTerceros.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },


    itemsMedios () {
      return this.entriesMedios.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
      })
    },

    importeTotalDelPago() {
      return '$'+this.formatoImporte(this.editadoMed.importe)
    },
    totCheTerSelecc() {
      return '$'+this.formatoImporte(this.totCheTerSel)
    },
    totCheTerDiff() {
      return '$'+this.formatoImporte(this.editadoMed.importe-this.totCheTerSel)
    },
    editadoTotal() {
      return '$'+this.formatoImporte(this.editado.total)
    },
    editadoGravado() {
      return '$'+this.formatoImporte(this.editado.gravado)
    },
    editadoIva() {
      return '$'+this.formatoImporte(this.editado.iva)
    },
    itemsCargadosGravadoComputer() {
      return '$'+this.formatoImporte(this.itemsCargadosGravado)
    },
    itemsCargadosIVAComputer() {
      return '$'+this.formatoImporte(this.itemsCargadosIVA)
    },
    gravadoDiffComputer() {
      return '$'+this.formatoImporte(this.gravadoDiff)
    },
    ivaDiffComputer() {
      return '$'+this.formatoImporte(this.ivaDiff)
    },
    reglasComputer() {
      let res = ''
      if (this.editadoArt.unidadesRegla.length>0) {
        res = 'Reglas '
        for (let i=0; i<=this.editadoArt.unidadesRegla.length-1; i++) {
          res += this.editadoArt.unidadesRegla[i].unidades+'un/'+this.editadoArt.unidadesRegla[i].descuento+'% off | '
        }
        res = res.substring(0, res.length-2)
      }
      return res
    },

    promosComputer() {
      let res = ''
      if (this.editadoArt.pubprecio!=0) {
        res = 'Promo '+this.editadoArt.pubunidades+'un/'+this.editadoArt.pubtasdes+'% off '
      }
      return res
    }


  },


  watch: {
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
      this.comprobantes[6].bg    = this.$store.state.temas.cen_gastos_bg
      this.comprobantes[6].dark  = this.$store.state.temas.cen_gastos_dark
      this.comprobantes[7].bg    = this.$store.state.temas.cen_pagos_bg
      this.comprobantes[7].dark  = this.$store.state.temas.cen_pagos_dark
      this.comprobantes[0].activo = !this.sucursalDemo
      this.comprobantes[1].activo = !this.sucursalDemo
      this.comprobantes[2].activo = !this.sucursalDemo
      this.comprobantes[3].activo = this.sucursalDemo
      if (this.sucursalDemo) {
        if (this.centrales.compras_panel == 'Facturas' || this.centrales.compras_panel == 'Créditos' || this.centrales.compras_panel == 'Débitos') {
          this.selectTipoDeComprobante('Presup.')
        }
      } else {
        this.selectTipoDeComprobante('Facturas')
      }
    },


    searchTerceros (val) {
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      this.proveedorVinculado = 0
      let tipoProv = 0

      if (this.centrales.compras_panel=='Gastos') {
        tipoProv = 7    // PROVEEDOR GASTOS/IMPUESTOS
      } else {
        tipoProv = 2    // PROVEEDOR MERCADERIAS
      }
      return HTTP().get('/usersproveedores/false/'+tipoProv+'/'+this.operarioVendedor+'/'+this.operarioTerceroId+'/'+this.operarioId).then(({ data }) => {
        this.entriesTerceros = []
        this.tercerosUserId = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesTerceros.push(data[i].tercero)
          this.tercerosUserId.push(data[i].tercero_id)
        }
        if (val !== null && val !== '') {
          let ipos = this.entriesTerceros.findIndex( x => x.id == this.editado.tercero_id)
          let valor = this.tercerosUserId[ipos]
          return HTTP().get('/tercero/'+valor).then(({ data }) => {
            this.itemActual = data
            this.lisObj = [];
            let rid = data[0].tercero.responsable.id
            if (this.cfUser===1) { //EL USUARIO ES RESPONSABLE INSCRIPTO
              if (rid===1 || rid===2 || rid===9 || rid===11) {
                this.editado.letra = 'A'
                if (this.editado.cpr=='FAC') {
                  this.editado.comprobante_id = 1
                } else if (this.editado.cpr=='NDD') {
                  this.editado.comprobante_id = 2
                } else if (this.editado.cpr=='NDC') {
                  this.editado.comprobante_id = 3
                } else if (this.editado.cpr=='REC') {
                  this.editado.comprobante_id = 4 }
              } else {
                this.editado.letra = 'B'
                if (this.editado.cpr=='FAC') {
                  this.editado.comprobante_id = 6
                } else if (this.editado.cpr=='NDD') {
                  this.editado.comprobante_id = 7
                } else if (this.editado.cpr=='NDC') {
                  this.editado.comprobante_id = 8
                } else if (this.editado.cpr=='REC') {
                  this.editado.comprobante_id = 9
                }
              }
            } else if (this.cfUser===6) { //EL USUARIO ES MONOTRIBUTISTA
              this.editado.letra = 'C'
              if (this.editado.cpr=='FAC') {
                this.editado.comprobante_id = 14
              } else if (this.editado.cpr=='NDD') {
                this.editado.comprobante_id = 15
              } else if (this.editado.cpr=='NDC') {
                this.editado.comprobante_id = 16
              } else if (this.editado.cpr=='REC') {
                this.editado.comprobante_id = 17
              }
            }
            if (this.editado.cpr=='REM') {
              this.editado.letra = 'R'
              this.editado.comprobante_id = 125
            } else if (this.editado.cpr=='PED') {
              this.editado.letra = 'P'
              this.editado.comprobante_id = 126
            } else if (this.editado.cpr=='PAG') {
              this.editado.letra = 'P'
              this.editado.comprobante_id = 127
            }
            this.editado.nombre           = data[0].tercero.nombre;
            this.editado.documento        = data[0].tercero.documento.nombre;
            this.editado.documento_id     = data[0].tercero.documento.id;
            this.editado.documentoNumero  = data[0].tercero.cuit;
            this.editado.responsableAbrev = data[0].tercero.responsable.abrev;
            this.dirItems = []
            for (let i=0; i<= data[0].tercero.direcciones.length-1; i++) {
              this.dirItems.push(data[0].tercero.direcciones[i])
            }
            this.editado.direccion_id = this.dirItems[0].id
            this.ctacte = false
            if (this.editado.cpr=='FAC') {
              this.ctacte = true
            } else {
              this.ctacte = data[0].ctacte
            }
            return HTTP().get('/comprabuscoelvendedor/'+valor).then(({ data }) => {
              if (data.id !=null) {
                this.editado.vendedor = data
              }
              if (this.editado.cpr!=='PED') {
                this.medpag[3].activo       = this.ctacte
                this.editado.medio_id       = this.ctacte ? 4 : 1
                this.editado.deposito_id    = this.depItems[0].id
                return HTTP().get('/comprabuscosucursalproveedor/'+this.editado.tercero_id).then(({ data }) => {
                  this.afipSuc = data
                  if (this.itemActual[0].tercero.user!=null) {
                    if (this.editado.cpr=='FAC' || this.editado.cpr=='NDD' || this.editado.cpr=='NDC') {
                      let pos = this.vinculosPadres.findIndex ( x => x === this.itemActual[0].tercero.user.id && !this.itemActual[0].tercero.user.externo)
                      if (pos!=-1) {
                        this.compraOk = false
                        this.proveedorVinculado = this.vinculosPadres[pos]
                        this.msg.msgTitle = 'Proveedor Vinculado'
                        let m = 'Este proveedor esta vinculado.<br><br>'
                        if (this.editado.cpr=='FAC') {
                          m += 'Deberás realizar un pedido y enviárselo.<br>'
                          m += 'Cuando él lo acepte y facture, te llegará el comprobante a tu '
                          m += 'sistema de notificaciones para que lo puedas importar.<br><br>'
                        } else {
                          m += 'Deberás solicitar a tu proveedor que le realice la operación que estas necesitando.<br>'
                          m += 'Una vez que él la realice, gohu la enviará a su sistema de notificaciones para que '
                          m += 'la puedas importar.<br><br>'
                        }
                        m += 'Toda la información sera actualizada y aparejada.<br>'
                        this.msg.msgBody = m
                        this.msg.msgVisible = true
                        this.msg.msgAccion = 'proveedor vinculado'
                        this.msg.msgButtons = ['Aceptar']
                      } else {
                        this.compraOk = true
                      }
                    }
                  } else {
                    this.compraOk = true
                  }
                })
              } else {
                this.ctacte           = true
                this.editado.medio_id = 4
                this.medpag[3].activo = this.ctacte
                this.compraOk         = true
              }
            })
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTerceros = false))
    },


    searchTercerosPag (val) {
      if (this.isLoadingTercerosPag || this.editado.cpr!='PAG') return
      this.isLoadingTercerosPag = true
      return HTTP().get('/usersproveedores/false/2/'+this.operarioVendedor+'/'+this.operarioTerceroId+'/'+this.operarioId).then(({ data }) => {
        this.entriesTerceros = []
        this.tercerosUserId = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesTerceros.push(data[i].tercero)
          this.tercerosUserId.push(data[i].tercero_id)
        }
        if (val !== null && val !== '') {
          let ipos = this.entriesTerceros.findIndex( x => x.id == this.editado.tercero_id)
          let valor = this.tercerosUserId[ipos]
          return HTTP().get('/tercero/'+valor).then(({ data }) => {

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
            this.editado.nombre = data[0].tercero.nombre;
            this.editado.documento = data[0].tercero.documento.nombre;
            this.editado.documento_id = data[0].tercero.documento.id;
            this.editado.documentoNumero = data[0].tercero.cuit;
            this.editado.responsableAbrev = data[0].tercero.responsable.abrev;
            this.dirItems = []
            for (let i=0; i<= data[0].tercero.direcciones.length-1; i++) {
              this.dirItems.push(data[0].tercero.direcciones[i])
            }
            this.editado.direccion_id = this.dirItems[0].id

            this.ctacte = true

            this.maxDiasChq = 999999
            if (data[0].tercero.user) {
              this.maxDiasChq = data[0].tercero.user.maxdiaschq
            }
            let user = data[0].tercero.user ? data[0].tercero.user.id : null
            return HTTP().get('/pendientes/'+data[0].tercero.id+'/'+this.sucursal).then(( { data }) => {
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

              // busco los dias maximos para cheques
              return HTTP().post('/userterceroget/', {tercero: this.tercero,user: user,tipo: 1}).then(({data}) => {
                if (data.length) {
                  if (data[0].maxdiaschq>0) {
                    this.maxDiasChq = data[0].maxdiaschq
                  }
                }
              })
            })
          })
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTercerosPag = false))
    },


    searchTercerosGas (val) {
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      return HTTP().get('/usersproveedores/false/7/'+this.operarioVendedor+'/'+this.operarioTerceroId+'/'+this.operarioId).then(({ data }) => {
        this.entriesTerceros = []
        for (let i=0; i<= data.length-1; i++) {
          this.entriesTerceros.push(data[i].tercero)
        }
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingTerceros = false))
    },


    searchMedios (val) {
      if (this.isLoadingMedios) return
      this.isLoadingMedios = true
      return HTTP().get('/medios').then(({ data }) => {
        this.entriesMedios = data;
      })
      .catch(err => {
        console.log(err)
      })
      .finally(() => (this.isLoadingMedios = false))
    },

    search(val) {
      this.$store.commit("setCentrales", { compras_buscar: val }, { root: true });
      this.listarHTTP(false)
    }

  },


  beforeMount () {
    this.yaMonto = false
  },


  mounted () {
    //this.$events.listen('testEvent', eventData => console.log(eventData));
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      this.anio = moment().format('YYYY')
      this.leoAnios().then(data => {
        if (this.sucursalDemo) {
          this.comprobantes[0].activo = false
          this.comprobantes[1].activo = false
          this.comprobantes[2].activo = false
          this.comprobantes[3].actibo = this.rol(31, 'ver')
        } else {
          this.comprobantes[0].activo = this.rol(28, 'ver')   // FACTURAS
          this.comprobantes[1].activo = this.rol(29, 'ver')   // DEBITOS
          this.comprobantes[2].activo = this.rol(30, 'ver')   // CREDITOS
          this.comprobantes[3].activo = false                 // PRESUPUESTOS
          this.comprobantes[4].activo = this.rol(32, 'ver')   // REMITOS
          this.comprobantes[5].activo = this.rol(33, 'ver')   // PEDIDOS
          this.comprobantes[6].activo = this.rol(34, 'ver')   // GASTOS
          this.comprobantes[7].activo = this.rol(35, 'ver')   // PAGOS
        }
        this.$store.commit('closeAlert')
        moment.locale('es');
        if (this.externo) {
            this.$store.commit("setCentrales", { ventas_panel: 'Pedidos' }, { root: true });
            this.filtroComprobanteSel = 'Pedidos'
            this.selectTipoDeComprobante(this.filtroComprobanteSel)
        } else {
          if (this.centrales.compras_filtro!='') {
            this.filtro = this.centrales.compras_filtro
          }
          if (this.centrales.compras_panel=='') {
            this.selectTipoDeComprobante(this.filtroComprobanteSel)
          } else {
            this.selectTipoDeComprobante(this.centrales.compras_panel)
          }
        }
        if (this.centrales.compras_buscar!='') {
          this.search = this.centrales.compras_buscar
        }
        return HTTP().get('/afipcomprobantes').then(({ data }) => {
          data.forEach(element => {
            this.cprItems.push(element)
          })
          this.yaMonto = true
          this.cargoChequesDeTerceros()
        })
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
    this.comprobantes[6].bg    = this.$store.state.temas.cen_gastos_bg
    this.comprobantes[6].dark  = this.$store.state.temas.cen_gastos_dark
    this.comprobantes[7].bg    = this.$store.state.temas.cen_pagos_bg
    this.comprobantes[7].dark  = this.$store.state.temas.cen_pagos_dark

    //var self=this;
    //this.contador = 120
    //setInterval(function(){ self.actualizo()},1000) // 12 minutos

    return HTTP().get('/afipiva').then(({ data }) => {
      this.ivaTasas = []
      for (let i=0; i<=data.length-1; i++) {
        this.ivaTasas.push(data[i])
      }
      return HTTP().get('/afipmonedas').then(({ data }) => {
        this.monItems = data

        this.tasasIVA = []
        this.tasasIVA.push({nombre: '21%',            tasa:21,   base: 0, iva: 0, afipiva_id: 5})
        this.tasasIVA.push({nombre: '10.5%',          tasa:10.5, base: 0, iva: 0, afipiva_id: 4})
        this.tasasIVA.push({nombre: '0% (Ex/No Grav)',tasa:0,    base: 0, iva: 0, afipiva_id: 2})
        this.tasasIVA.push({nombre: '2.5%',           tasa:2.5,  base: 0, iva: 0, afipiva_id: 8})
        this.tasasIVA.push({nombre: '5%',             tasa:5,    base: 0, iva: 0, afipiva_id: 7})
        this.tasasIVA.push({nombre: '27%',            tasa:27,   base: 0, iva: 0, afipiva_id: 6})

        this.cargoCuentasDelUsuario()
        this.yaMonto = true
        this.listarHTTP()


//        return HTTP().get('/user/'+this.userId).then(({ data }) => {
          /*
          TENGO EL ID DE LA SUCURSAL DE LA BD EN 'sucursal'
          pero necesito la posicion que ocupa dentro
          de la matriz data[0].sucursales
          busco el Id de la sucursal en la matriz
          */
//          let psuc = data[0].sucursales.findIndex( x => x.id == this.sucursal)
//          for (let i=0; i<= data[0].sucursales[psuc].depositos.length-1; i++) {
//            this.depItems.push(data[0].sucursales[psuc].depositos[i])
//          }
//          this.editado.deposito_id = this.depItems[0].id
//          this.cfUser = Number(data[0].tercero.responsable.codigo)
//          this.tasasIVA.push({nombre: '21%',        tasa:21,   base: 0, iva: 0, afipiva_id: 5})
//          this.tasasIVA.push({nombre: '10.5%',      tasa:10.5, base: 0, iva: 0, afipiva_id: 4})
//          this.tasasIVA.push({nombre: '0% (Exento)',tasa:0,    base: 0, iva: 0, afipiva_id: 2})
//          this.tasasIVA.push({nombre: '2.5%',       tasa:2.5,  base: 0, iva: 0, afipiva_id: 8})
//          this.tasasIVA.push({nombre: '5%',         tasa:5,    base: 0, iva: 0, afipiva_id: 7})
//          this.tasasIVA.push({nombre: '27%',        tasa:27,   base: 0, iva: 0, afipiva_id: 6})

          // CARGO LAS CUENTAS BANCARIAS DEL USUARIO, DESPUES DESMENUSO EN EL PAGO
          // TARJETAS, CHEQUERAS, ETC. SEGUN SELECCIONE
//          this.cueItems = []
//          for (let i=0; i<=data[0].tercero.cuentas.length-1; i++) {
//            if (data[0].tercero.cuentas[i].activo) {
//              this.cueItems.push(data[0].tercero.cuentas[i])
//            }
//          }

//          var self=this;
//          setInterval(function(){
//            self.actualizo()
//          },120000) // 2 minutos

//        })
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
    ]),
    /////////////////////////
    // METODOS DE CABECERA //
    /////////////////////////

    closeForm(){
      router.push('/')
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

    queMesEs(mes) {
      this.elMes = mes
      let p = this.losMeses.indexOf(mes)
      p ++
      p = '0'+p
      p = p.substr(-2)
      return p
    },

    setAnio(anio) {
      if (anio) {
        this.anio = anio
      } else {
        this.anio = this.anio == null ? moment().format('YYYY') : this.anio
      }
      this.elAnio = this.anio
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
      if (this.yaMonto) {
        this.listarHTTP(false)
      }
    },


    setMes(mes) {
      this.elMes = mes
      if (this.yaMonto) {
        this.listarHTTP()
      }
      this.filtroEstadoSel = 'Todos'
    },



    setFiltroEstado(fe) {
      if (fe.tip=='Todos') {
        this.items = this.itemsAll
      } else {
        this.items = this.itemsAll.filter(x=>x.filtroEstado==fe.tip)
      }
      this.filtroEstadoSel = fe.tip
    },



    leoAnios() {
      return HTTP().post('anios/', {tipo: 'C'})
        .then(({ data }) => {
          this.anios = []
          this.meses = []
          this.periodos = []
          let pos = -1
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


    setRespuestaRecepcion() {
      this.recepcion.observaciones=this.recepcion.respuesta
      if (this.recepcion.respuesta=='¡El pedido está correcto!') {
        this.recepcion.calificacion = 5
      } else if (this.recepcion.respuesta=='¡Pedido correcto pero con demora!') {
        this.recepcion.calificacion = 4
      } else if (this.recepcion.respuesta=='¡Productos rotos o mal embalados!') {
        this.recepcion.calificacion = 3
      } else if (this.recepcion.respuesta=='¡No son los productos que compre!') {
        this.recepcion.calificacion = 2
      } else if (this.recepcion.respuesta=='Informar otro problema') {
        this.recepcion.calificacion = 1
      }
    },


    rol (i, accion) {
      if (this.externo && accion=='acceder') {
        return (i==5) ? true : false
      }
      if (this.sucursalDemo && i<3 ||
          !this.sucursalDemo && i==3) { 
            return false
          }
      if (this.$store.state.level==2) { return true }
      const op = this.$store.state.roles.map(el => el.opcion_id);
      const po = op.indexOf(i);
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
      return HTTP().post('/pedidorecepcion', { pedido: this.itemActual, novedad: novedad }).then(({ data }) => {
        this.dialogRecepcion = false
        if (data) {
          this.listarHTTP()
        }
      })
    },


    cargoChequesDeTerceros() {
      return HTTP().get('/chequesencartera/'+this.userId+'/'+this.sucursal).then(({ data }) =>{
        for (let i=0; i<=data.length-1; i++) {

          let d = 0
          let hoy = moment()
          d = hoy.diff(data[i].fechafinanciera, 'days')

          this.cartera.push({
            id:               data[i].id,
            codban:           data[i].codigo,
            nomban:           data[i].nomban==null ? '' : data[i].nomban.substr(0,25),
            cuitlib:          data[i].cuitlib,
            nomlib:           data[i].nomlib==null ? '' : data[i].nomlib.substr(0,25),
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
      })
    },



    cargoCuentasDelUsuario() {
      return HTTP().get('/user/'+this.userId).then(({ data }) => {
        this.depItems = []
        let psuc = data[0].sucursales.findIndex( x => x.id == this.sucursal)
        for (let i=0; i<= data[0].sucursales[psuc].depositos.length-1; i++) {
          this.depItems.push(data[0].sucursales[psuc].depositos[i])
        }
        this.editado.deposito_id = this.depItems[0].id
        this.cfUser = Number(data[0].tercero.responsable.codigo)
        // CARGO LAS CUENTAS BANCARIAS DEL USUARIO, DESPUES DESMENUSO EN EL PAGO
        // TARJETAS, CHEQUERAS, ETC. SEGUN SELECCIONE
        this.cueItems = []
        for (let i=0; i<=data[0].tercero.cuentas.length-1; i++) {
          if (data[0].tercero.cuentas[i].activo) {
            this.cueItems.push(data[0].tercero.cuentas[i])
          }
        }
      })
    },



    selectTipoDeComprobante(cual) {
      this.filtroComprobanteSel = cual
      this.$store.commit("setCentrales", { compras_panel: cual }, { root: true });
      if (cual=='Facturas') {
        this.filtroComprobante = [1,6,14]   // [1,6,14,128]
      } else if (cual=='Débitos') {
        this.filtroComprobante = [2,7,15]
      } else if (cual=='Créditos') {
        this.filtroComprobante = [3,8,16]
      } else if (cual=='Presup.') {
        this.filtroComprobante = [124]
      } else if (cual=='Remitos') {
        this.filtroComprobante = [125]
      } else if (cual=='Pedidos') {
        this.filtroComprobante = [126]
      } else if (cual=='Gastos') {
        this.filtroComprobante = [1,6,14,128]
      } else if (cual=='Pagos') {
        this.filtroComprobante = [127]
      }
      if (cual=='Pedidos') {
        this.headers = this.headersPed
      } else {
        this.headers = this.headersNor
      }
      if (this.yaMonto) {
        this.listarHTTP()
      }
    },


    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      if (item.cpr.substring(0,3)=='PED') {
        if (item.estado=='P' && item.regstk==1) {
          if (item.observaciones=='PEDIDO DEL VENDEDOR' && this.operarioVendedor) {
            this.acciones.push({nombre: 'Finalizar', icon: 'mdi-check-circle'})
            this.acciones.push({nombre: 'Anular Pedido', icon: 'mdi-backup-restore'})
          }
          if (item.observaciones=='PEDIDO DEL CLIENTE' && !this.operarioVendedor) {
            this.acciones.push({nombre: 'Artículos', icon: 'mdi-barcode'})
            this.acciones.push({nombre: 'Enviar al Proveedor', icon: 'mdi-file-send'})
            this.acciones.push({nombre: 'Anular Pedido', icon: 'mdi-backup-restore'})
          }
        }
        if (item.estado=='F') {
          this.acciones.push({nombre: 'Iniciar un reclamo', icon: 'mdi-file-send'})
        }
        if (item.estado=='E') {
          this.acciones.push({nombre: 'Recepción', icon: 'mdi-star'})
        }
        if (item.estado=='I') {
          this.acciones.push({nombre: 'Calificar', icon: 'mdi-star'})
        }
        this.acciones.push({nombre: 'Nuevo en base a este', icon: 'mdi-content-copy'})
        this.acciones.push({nombre: 'Timeline', icon: 'mdi-filmstrip'})
      }

      if (item.cpr.substring(0,3)=='FAC') {
        if (item.estado=='F' && item.tercero.user==null) {
          this.acciones.push({nombre: 'Imputar NDC', icon: 'mdi-file-percent'})
          this.acciones.push({nombre: 'Imputar NDD', icon: 'mdi-file-plus'})
        } else if (item.estado=='P') {
          this.acciones.push({nombre: 'Editar', icon: 'mdi-pencil'})
          this.acciones.push({nombre: 'Artículos', icon: 'mdi-barcode'})
        }
      }
      if ((item.cpr.substring(0,3)=='FAC' || item.cpr.substring(0,3)=='NDD' || item.cpr.substring(0,3)=='NDC') && (!item.estado=='A'))
      {
        this.acciones.push({nombre: 'Cambiar Período Fiscal', icon: 'mdi-calendar'})
      }

      if (item.estado=='P' && item.cpr.substring(0,3)!='PED') {
        this.acciones.push({nombre: 'Finalizar', icon: 'mdi-check-circle'})
      }

      if (this.pagar(item)) {
        this.acciones.push({nombre: 'Pagar', icon: 'mdi-sticker-emoji'})
      }

      if (item.cpr.substring(0,3)=='PAG') {
        if (item.estado=='F' && item.cpr.substring(0,3)=='PAG') {
          this.acciones.push({nombre: 'Anular Pago', icon: 'mdi-backup-restore'})
        }
      }

      this.acciones.push({nombre: 'Detalles', icon: 'mdi-glasses'})
      this.acciones.push({nombre: 'Imprimir', icon: 'mdi-printer'})
      this.acciones.push({nombre: 'Rastrear', icon: 'mdi-move-resize-variant'})

      if (item.tercero.user==null && !this.cancelado(item) &&item.observaciones==='COMPRA IMPORTADA')  {
        // NO ES UN PROVEEDOR ESTA VINCULADO ( CONTROL PARA MINORISTAS )
        this.acciones.push({nombre: 'Borrar', icon: 'mdi-delete'})
        this.acciones.push({nombre: 'Anular Comprobante', icon: 'mdi-backup-restore'})
      }


//      if (item.estado=='P' && item.cpr.substring(0,3)!='PED') {
//        this.acciones.push({nombre: 'Editar', icon: 'mdi-pencil'})
//        if (item.tercero.usersterceros[0].tipo_id!=7) { // Solo Terceros Proveedores
//          this.acciones.push({nombre: 'Artículos', icon: 'mdi-barcode'})
//        }
//      }
//      if (item.estado=='F' && item.cpr.substring(0,3)=='FAC' && item.tercero.user==null) {
//        this.acciones.push({nombre: 'Imputar NDC', icon: 'mdi-file-percent'})
//        this.acciones.push({nombre: 'Imputar NDD', icon: 'mdi-file-plus'})
//      }
//      if (item.estado=='P' && item.regstk==1 && item.cpr.substring(0,3)=='PED') {
//        if (item.observaciones=='PEDIDO DEL VENDEDOR' && this.operarioVendedor) {
//          this.acciones.push({nombre: 'Finalizar', icon: 'mdi-check-circle'})
//        }
//        if (item.observaciones=='PEDIDO DEL CLIENTE' && !this.operarioVendedor) {
//          this.acciones.push({nombre: 'Artículos', icon: 'mdi-barcode'})
//          this.acciones.push({nombre: 'Enviar al Proveedor', icon: 'mdi-file-send'})
//        }
//      }
//    if (item.estado=='P' && item.regstk==1 && item.cpr.substring(0,3)!='PED') {
//      this.acciones.push({nombre: 'Detalles', icon: 'mdi-glasses'})
//      this.acciones.push({nombre: 'Imprimir', icon: 'mdi-printer'})
//      this.acciones.push({nombre: 'Rastrear', icon: 'mdi-move-resize-variant'})
//      if (item.estado=='P' && item.cpr.substring(0,3)!='PED') {
//        this.acciones.push({nombre: 'Finalizar', icon: 'mdi-check-circle'})
//      }
//      if (this.pagar(item)) {
//        this.acciones.push({nombre: 'Pagar', icon: 'mdi-sticker-emoji'})
//      }
//      if (item.estado=='F' && item.cpr.substring(0,3)=='PED') {
//        this.acciones.push({nombre: 'Iniciar un reclamo', icon: 'mdi-file-send'})
//      }
//      if (item.estado=='E' && item.cpr.substring(0,3)=='PED') {
//        this.acciones.push({nombre: 'Recepción', icon: 'mdi-star'})
//      }
//      if (item.estado=='I' && item.cpr.substring(0,3)=='PED') {
//        this.acciones.push({nombre: 'Calificar', icon: 'mdi-star'})
//      }
//      if (item.estado=='F' && item.cpr.substring(0,3)=='PAG') {
//        this.acciones.push({nombre: 'Anular Pago', icon: 'mdi-backup-restore'})
//      }
//      if (item.tercero.user==null && !this.cancelado(item) &&item.observaciones==='COMPRA IMPORTADA')  {
//        // NO ES UN PROVEEDOR ESTA VINCULADO ( CONTROL PARA MINORISTAS )
//        this.acciones.push({nombre: 'Borrar', icon: 'mdi-delete'})
//        this.acciones.push({nombre: 'Anular Comprobante', icon: 'mdi-backup-restore'})
//      }
//      if (item.cpr.substr(0,3)=='PED') {
//        this.acciones.push({nombre: 'Nuevo en base a este', icon: 'mdi-content-copy'})
//        this.acciones.push({nombre: 'Timeline', icon: 'mdi-filmstrip'})
//      }
//      if (item.cpr.substring(0,3)=='FAC' || item.cpr.substring(0,3)=='NDD' || item.cpr.substring(0,3)=='NDC') {
//        this.acciones.push({nombre: 'Cambiar Período Fiscal', icon: 'mdi-calendar'})
//      }
    },


    selAccion(item) {
      if (item.nombre=='Nuevo en base a este') {
        this.nuevo('en base a este',this.itemActual)
      } else if (item.nombre=='Detalles') {
        this.printDetalles(this.itemActual)
      } else if (item.nombre=='Imprimir') {
        this.print(this.itemActual)
      } else if (item.nombre=='Rastrear') {
        this.rastrear(this.itemActual)
      } else if (item.nombre=='Editar') {
        this.editar(this.itemActual)
      } else if (item.nombre=='Borrar') {
        this.borrar(this.itemActual)
      } else if (item.nombre=='Artículos') {
        this.cargarArt(this.itemActual)
      } else if (item.nombre=='Finalizar') {
        this.finalizar(this.itemActual)
      } else if (item.nombre=='Pagar') {
        this.nuevo('pagocomprobante',this.itemActual)
      } else if (item.nombre=='Enviar al Proveedor') {
        this.puedoEnviarPedido(this.itemActual)
      } else if (item.nombre=='Anular Pago') {
        this.preguntoAnularPago(this.itemActual) 
      } else if (item.nombre=='Anular Pedido') {
        this.preguntoAnularPedido(this.itemActual) 
      } else if (item.nombre=='Anular Comprobante') {
        this.preguntoAnularComprobante(this.itemActual) 
      } else if (item.nombre==='Recepción') {
        this.recepcionPedido(this.itemActual)
      } else if (item.nombre==='Calificar') {
        this.recepcionPedido(this.itemActual)
      } else if (item.nombre==='Timeline') {
        this.leerTimeLine(this.itemActual)
      } else if (item.nombre==='Cambiar Período Fiscal') {
        this.cambiarPeriodoFiscal(this.itemActual)
      }
    },


    setAccionesItems(item) {
      this.itemActualItem = item
      this.accionesItems = []
      this.accionesItems.push({nombre: 'Editar', icon: 'mdi-pencil'})
      this.accionesItems.push({nombre: 'Borrar', icon: 'mdi-delete'})
    },


    async selAccionItem(item) {
      if (item.nombre=='Editar' && item.texto!='Promocion') {
        this.editarArt(this.itemActualItem)
      } else if (item.nombre=='Borrar') {
        this.preguntoBorrarItem(this.itemActualItem) 
      }
    },


    preguntoBorrarItem(item) {
      this.itemActual = item
      this.msg.msgTitle = 'Borrar Item'
      this.msg.msgBody = 'Desea borrar este Item?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
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


    cambiarPeriodoFiscal(item) {
      this.editado.id = item.id
      this.editado.perfiscal = item.perfiscal.substring(0,4)+'-'+item.perfiscal.substring(4,6)
      this.dialogCambiarPeriodoFiscal = true
    },


    confirmarCambioDePeriodo() {
      return HTTP().post('/cambiarperiododelcomprobante', {
        editado: this.editado })
        .then(({ data }) => {
          this.dialogCambiarPeriodoFiscal = false
          if (data) {
            this.mensaje('¡El período fiscal ha sido cambiado con éxito!', this.temas.forms_titulo_bg, 2000, false)
            this.leoAnios().then(data => {
              this.listarHTTP();
            })
          } else {
            this.mensaje('¡Se ha producido un error al intentar cambiar el período fiscal indicado.!', this.temas.forms_titulo_bg, 2000, false)
          }
        })
    },


    nuevo(que, item) {
      debugger
      this.$store.commit("setCentrales", { compras_panel: que }, { root: true });      
      for (let i=0; i<=this.medpag.length-1; i++) {
        this.medpag[i].total = 0 
      }
      for (let i=0; i<=this.tasasIVA.length-1; i++) {
        this.tasasIVA[i].base = 0 
        this.tasasIVA[i].iva = 0 
      }
      this.medpag[1].activo = this.sucursalDemo ? false : true
      this.medpag[2].activo = this.sucursalDemo ? false : true
      this.medpag[4].activo = this.sucursalDemo ? false : true
      this.medpag[6].activo = this.sucursalDemo ? false : true
      this.medpag[7].activo = this.sucursalDemo ? false : true
      this.medpag[8].activo = this.sucursalDemo ? false : true
      this.dialogCab = true;
      this.dialogArt = false;
      this.dialogEditArt = false;
      this.editedIndex = -1
      this.basadoEnCpr = false;         // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PAG, etc)
      this.notificaEnBaseAOtro = [];    // LIMPIO NOTIFICACIONES PARA NO TENER PROBLEMAS
      this.notificaOriginal = [];
      this.basadoEnOtroCpr = []
      this.searchTerceros = '';
      this.isLoadingTerceros = false;
      this.valDiferencia = 0;
      this.formTitleArt = 'Nuevo Item';
      this.formTitleMed = 'Nuevo Valor';
      this.formTitleGas = 'Nuevo Gasto';
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      if (que=='pagocomprobante') {
        this.medpag[3].activo = false
        this.editado = Object.assign({}, item );
      } else {
        this.editado = Object.assign({}, this.defaultItem);
      }
      this.afipSuc = ''
      this.afipNro = '00000000'
      this.editado.tipo = 'CO'
      this.editado.deposito_id = this.depItems[0].id
      this.editado.comprobante_id = null
      this.editado.fecha     = moment().format('YYYY-MM-DD');
      this.editado.perfiscal = moment().format('YYYY-MM');
      this.esFiscal          = true;

      if (que === 'Facturas' || que === 'Gastos') {

        let deQue = que==='Facturas' ? 'STOCK' : 'GASTO'
        this.formTitle   = 'Nuevo Comprobante de '+ deQue+ ' - Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'FAC';
        this.coef        = 1;
        if (que==='Gastos') {
          this.editado.regstk        = 0
          this.editado.observaciones = 'GASTO'
          this.editado.tipo          = 'GS'
          this.editado.deposito_id   = null
        } else {
          this.editado.regstk        = 1
          this.editado.observaciones = 'FACTURA DE COMPRA'
        }

      } else if (que === 'Créditos') {

        this.formTitle = 'Nueva NOTA DE CREDITO - Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'NDC';
        this.editado.observaciones = 'NOTA DE CREDITO'
        this.coef = -1;
        this.editado.regstk = 1

      } else if (que === 'Débitos') {

        this.formTitle = 'Nueva NOTA DE DEBITO - Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'NDD';
        this.editado.observaciones = 'NOTA DE DEBITO'
        this.coef = 1;
        this.editado.regstk = 1
      
      } else if (que === 'Presup.') {

        this.formTitle = 'Nuevo PRESUPUESTO Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'PRE';
        this.editado.observaciones = 'PRESUPUESTO'
        this.editado.comprobante_id = 124
        this.editado.regstk = this.sucursalDemo = 1 ? 1 : 0
        this.esFiscal = false;
        this.coef = 1;
        if (this.sucursalDemo) {
          this.medpag[1].activo = false
          this.medpag[2].activo = false
          this.medpag[4].activo = false
          this.medpag[7].activo = false
          this.medpag[8].activo = false
        }

      } else if (que === 'Remitos') {

        this.formTitle = 'Nuevo REMITO Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'REM';
        this.editado.observaciones = 'REMITO'
        this.coef = 1;
        this.esFiscal = false

      } else if (que === 'Pedidos' || que === 'en base a este' ) {

        this.formTitle = 'Nuevo PEDIDO '+this.empresa+' Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'PED';
        this.coef = 1;
        this.esFiscal = false;
        this.editado.comprobante_id = 126
        this.afipSuc = this.sucursalFiscal;
        this.editado.regstk = 1
        this.editado.observaciones = 'PEDIDO DEL CLIENTE'
        this.compraOk = true

        if (que === 'en base a este') {

          this.dialogCab = false;
          this.msg.msgTitle = 'Repetir Pedido'
          this.msg.msgBody = 'Se generara un nuevo pedido en base al seleccionado. ¿Confirma?'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'repetir pedido'
          this.msg.msgButtons = ['Cancelar','Aceptar']
        }

      } else if (que === 'Pagos' || que === 'pagocomprobante') {

        let tercero  = 0
        this.totCheTerSel = 0

        this.cartera = []
        this.valores = []
        this.pend = []
        this.cargoChequesDeTerceros()
        this.cargoCuentasDelUsuario()
        
        if (que === 'Pagos') {
          tercero = this.tercero_id
          this.formTitle                = 'Nuevo Pago '
          this.editado.cpr              = 'PAG';
          this.editado.observaciones    = 'PAGO'
          this.pagoDeUnSoloComprobante  = false
          this.esUnPagoDeUnaFactura     = false
          this.coef                     = 1;
          this.esFiscal                 = false;
          this.editado.comprobante_id   = 127
          this.afipSuc                  = this.sucursalFiscal;
          this.editado.regstk           = 0
          this.searchTerceros           = ''
          this.valDiferencia            = 0
          this.dialogCab                = false
          this.dialog                   = false
          this.dialogPag                = true
        
        } else if (que === 'pagocomprobante') {

          this.totCheTerSel             = 0
          tercero                       = item.tercero_id
          this.dialogCab                = false;
          this.formTitle                = 'Pago del Comprobante '+item.cpr+' - ('+item.tercero.nombre+')'
          this.esFiscal                 = false;
          this.coef                     = 1;

          this.maxDiasChq               = 999999;
          if (item.tercero.user) {
            this.maxDiasChq = item.tercero.user.maxdiaschq == null ? 999999 : item.tercero.user.maxdiaschq
          }

          this.editado.nombre           = this.editado.tercero.nombre
          this.pagoDeUnSoloComprobante  = true
          this.editado.id               = ''
          this.editado.fecha            = moment().format('YYYY-MM-DD')
          this.editado.perfiscal        = moment().format('YYYY-MM');
          this.editado.cpr              = 'PAG-P '+this.sucursalFiscal+'-00000000'
          this.editado.tipo             = 'PG'
          this.editado.user_id          = this.userId
          this.editado.sucursal_id      = this.sucursal
          this.editado.tercero_id       = item.tercero_id                           // ver
          this.editado.comprobante_id   = 127
          this.editado.documento_id     = item.documento_id
          this.editado.mediodepago_id   = null
          this.editado.lista_id         = null
          this.editado.deposito_id      = null
          this.editado.vendedor_id      = item.vendedor_id
          this.editado.moneda_id        = item.moneda_id
          this.editado.direccion_id     = item.direccion_id
          this.editado.tasadescuento    = 0
          this.editado.importedescuento = 0
          this.editado.retiva           = 0
          this.editado.retgan           = 0
          this.editado.retib            = 0
          this.editado.impint           = 0
          this.editado.nogravado        = 0
          this.editado.flete            = 0
          this.editado.gravado          = 0
          this.editado.exento           = 0
          this.editado.iva              = 0
          this.editado.total            = item.pendientes[0].pendiente
          this.editado.poradcosto       = 0
          this.editado.regstk           = 0
          this.editado.estado           = 'F'
          this.editado.carga            = 'M'
          this.editado.cae              = null
          this.editado.cae_vencimiento  = null
          this.editado.cae_codbar       = null
          this.editado.observaciones    = 'PAGO'
          this.editado.activo           = true
          this.editado.items            = []

          this.afipSuc                  = this.sucursalFiscal;
          this.searchTerceros           = ''
          this.dialog                   = false
          this.dialogRem                = false
          this.dialogPag                = true
          this.dialogNdcFac             = false
          this.isLoadingTerceros        = true   // PARA QUE NO BUSQUE EL TERCERO, YA LO TENGO
          this.basadoEnCpr              = true;  // SI EL CPR ESTA BASADO EN OTRO CPR. (FAC/PED, etc)
          this.basadoEnOtroCpr.push(item.id)

          // TOTALES DEL PAGO
          this.importePago   = item.pendientes[0].importe
          this.totCancelado  = item.pendientes[0].importe
          this.totValores    = item.pendientes[0].importe
          this.valDiferencia = 0

          this.pend          = []
          this.valores       = []
          this.cueProvtems   = []

          this.pend.push({
            id: item.pendientes[0].id,
            cpr: item.cpr,
            vencimiento: moment(item.pendientes[0].vencimiento).format('YYYY-MM-DD'),
            importe:   item.pendientes[0].importe,
            pendiente: item.pendientes[0].pendiente,
            acancelar: item.pendientes[0].pendiente,
            acciones:  ''
          })

          this.valores.push({ 
            id:                null,
            caja_id:           this.caja,
            medio_id:          1,
            cuentaorigen_id:   null,
            cuentadestino_id:  null,
            cuentacheque_id:   null,
            cuentatarjeta_id:  null,
            banco_id:          null,
            tarjeta_id:        null,
            cpringreso_id:     null,
            cpregreso_id:      item.id,
            librador_id:       null,
            librador_medio_id: null,
            cheque_id:         null,
            fechafinanciera:   null,
            fechasalida:       null,
            importe:           item.pendientes[0].pendiente,
            nrovalor:          null,
            tipo:              'D',
            observ:            'PAGO EN EFECTIVO',
            foto:              null,
            medioNombre:       'Efectivo',
            cuenta:            null,
            cuit:              null,
            nombre:            null,
          })

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
        }

        if (item!=undefined) {
          return HTTP().get('/tercerocuentas/'+item.tercero_id)
            .then(({ data }) =>{
              for (let i=0; i<=data[0].cuentas.length-1; i++) {
                this.cueProvItems.push(data[0].cuentas[i])
              }

              // busco los dias maximos para cheques
              let user = item.tercero.user ? item.tercero.user.id : null
              return HTTP().post('/userterceroget/', {
                  tercero: this.tercero,
                  user: user,
                  tipo: 1
                }).then(({data}) => {
                if (data.length) {
                  if (data[0].maxdiaschq>0) {
                    this.maxDiasChq = data[0].maxdiaschq
                  }
                }
              })
          })
        }
      }
    },


    editar(item) {
      this.itemsCargadosGravado = 0
      this.itemsCargadosIVA = 0
      for (let i=0; i<=item.items.length-1; i++) {
        this.itemsCargadosGravado += item.items[i].total
        this.itemsCargadosIVA += (item.items[i].total*(item.items[i].articulo.iva.tasa/100))
      }
      this.itemsCargadosGravado = this.roundTo(this.itemsCargadosGravado,2)
      this.itemsCargadosIVA = this.roundTo(this.itemsCargadosIVA,2)

      debugger
      this.dialogCab = true;
      this.dialogArt = false;
      this.dialogEditArt = false;
      this.editedIndex = this.items.indexOf(item)
      this.valDiferencia = 0;
      this.editado = Object.assign({}, item);
      this.afipSuc = this.editado.cpr.substring(7,4)
      this.afipNro = this.editado.cpr.substring(12,8)
      this.cprActual = this.editado.cpr
      this.pendientes = this.editado.pendientes
      if (this.pendientes.length>0) {
        this.editado.vencimiento = moment(this.pendientes[0].vencimiento).format('YYYY-MM-DD')
      }
      this.valores = this.editado.valoresEgresos                  // VER ESTO

      if (this.editado.afipiva.length>0) {
        for (let i=0; i<=this.editado.afipiva.length-1; i++) {
          let pos = this.tasasIVA.findIndex(x=>x.afipiva_id==this.editado.afipiva[i].afipiva_id)
          if (pos!=-1) {{
            this.tasasIVA[pos].base = this.editado.afipiva[pos].base
            this.tasasIVA[pos].iva = this.editado.afipiva[pos].iva
          }}
        }
      }
      for (let i=0; i <= this.valores.length-1; i++) {
        this.medpag[this.valores[i].medio_id-1].total += this.valores[i].importe
      }
      for (let i=0; i <= this.pendientes.length-1; i++) {
        //this.medpag[3].total += this.pendientes[i].pendiente
        this.medpag[3].total = this.editado.total
        this.vencimiento = moment(this.pendientes[i].vencimiento).format('YYYY-MM-DD');
      }
      let tcpr = this.editado.cpr.substr(0,3)
      this.formTitleArt = 'Nuevo Item';
      this.formTitleMed = 'Nuevo Valor';  //2020-09
      this.editado.perfiscal = this.editado.perfiscal.substr(0,4)+'-'+this.editado.perfiscal.substr(4,2)
      this.esFiscal = tcpr === 'FAC' || tcpr === 'NDD' || tcpr === 'NDC' || (tcpr === 'PRE' && this.sucursalDemo) ? true : false
      this.esCIN = tcpr === 'CIN'
      
      if (tcpr === 'FAC' || tcpr === 'NDD' || tcpr === 'NDC' || tcpr === 'REM' || tcpr === 'CIN' || tcpr === 'PRE') {
        this.coef = tcpr == 'NDC' ? -1: 1;
        if (this.editado.regstk==1) {
          this.formTitle = 'Editar Comprobante Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        } else {
          this.formTitle = 'Editar Gasto Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        }
        if (tcpr === 'REM') {
          this.formTitle = 'Editar Remito Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        }
      } else if (tcpr === 'PAG') {
        this.formTitle = 'Nuevo Pedido '+this.empresa+' Sucursal ('+this.sucursal+')'+ ' Caja ('+this.caja+')';
        this.editado.cpr = 'PED';
        this.coef = 1;
      }
      let pos = this.cprItems.findIndex( x => x.id === this.editado.comprobante_id )
      this.editado.comprobante_id = this.cprItems[pos].id
      this.afipSuc = this.editado.cpr.substr(6,4)
      this.afipNro = this.editado.cpr.substr(11,8)
      this.editado.fecha = moment(this.editado.fecha).format('YYYY-MM-DD');
      this.editado.cpr = this.editado.cpr.substring(0,3)
      this.searchTerceros = this.editado.tercero.nombre
    },


    borrar(item) {
      this.msg.msgTitle = 'Borrar Comprobante'
      this.msg.msgBody = 'Confirma Borrar el Comprobante?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar comprobante'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item
    },


    cancelar() {
      this.dialogCab = false;
      this.valores = []
      this.articulos = []
      this.pendientes = []
      this.editado = Object.assign({}, this.defaultItem);
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editedIndex = -1;
    },


    cerrarPag() {
      this.dialogPag = false;
    },


    cerrarTimeLine() {
      this.dialogTimeLine = false
    },


    guardarPag(item) {
      if (this.editado.cpr.substr(0,3)=='PAG') {
        this.msg.msgTitle = 'Confirmar el Pago' 
        this.msg.msgAccion = 'pagar comprobante'
        this.msg.msgBody = 'Confirma el Pago del Comprobante?'
        this.msg.msgVisible = true
        this.msg.msgButtons = ['Aceptar','Cancelar']
      } else {
        this.dialogPag = false
      }
      this.itemActual = item
    },


    guardar() {

      let elCompraId = this.editedIndex != -1 ? this.editado.id : null
      if (Number(this.medpag[0].total) !== 0) {
        if (this.valores.length==0) {
          this.valores.push({
            id:                null,
            caja_id:           this.caja,
            medio_id:          1,
            cuentaorigen_id:   null,
            cuentadestino_id:  null,
            cuentacheque_id:   null,
            cuentatarjeta_id:  null,
            banco_id:          null,
            tarjeta_id:        null,
            cpringreso_id:     null,
            cpregreso_id:      elCompraId,
            librador_id:       null,
            librador_medio_id: null,
            cheque_id:         null,
            fechafinanciera:   null,
            fechasalida:       null,
            importe:           (this.editado.total-this.medpag[3].total)*this.coef,
            nrovalor:          null,
            tipo:              'D',
            observ:            'PAGO EN EFECTIVO',
            foto:              null,
            medioNombre:       null,
            cuenta:            null,
            cuit:              null,
            nombre:            null,

          })
        } else {
          this.valores[0].id                = null 
          this.valores[0].caja_id           = this.caja
          this.valores[0].medio_id          = 1
          this.valores[0].cuentaorigen_id   = null
          this.valores[0].cuentadestino_id  = null
          this.valores[0].cuentacheque_id   = null
          this.valores[0].cuentatarjeta_id  = null
          this.valores[0].cpringreso_id     = null
          this.valores[0].cpregreso_id      = elCompraId
          this.valores[0].librador_id       = null
          this.valores[0].librador_medio_id = null
          this.valores[0].cheque_id         = null
          this.valores[0].fechafinanciera   = null
          this.valores[0].fechasalida       = null
          this.valores[0].importe           = (this.editado.total-this.medpag[3].total)*this.coef
          this.valores[0].nrovalor          = null
          this.valores[0].tipo              = 'D'
          this.valores[0].observ            = 'PAGO EN EFECTIVO'
        }
      } else {
        this.valores = []
      }
      if (Number(this.medpag[3].total) !== 0) {
        // Si es ctacte agrego en 'pendientes' para que grabe la cuenta corriente
        if (this.pendientes.length==0) {
          this.pendientes.push({ 
            comprobante_id: elCompraId,
            vencimiento:    moment(this.editado.vencimiento).format('YYYY-MM-DD'),
            importe:        this.medpag[3].total*this.coef,
            pendiente:      this.medpag[3].total*this.coef,
            concepto:       'EN CUENTA CORRIENTE'
          })
        } else {
          this.pendientes[0].vencimiento = moment(this.editado.vencimiento).format('YYYY-MM-DD')
          this.pendientes[0].importe     = this.medpag[3].total*this.coef
          this.pendientes[0].pendiente   = this.medpag[3].total*this.coef
        }
      } else {
        this.pendientes = []
      }

      if (this.editedIndex > -1) { // esta modificando
        this.id                 = this.editado.id;
        this.editado.valores    = this.valores
        this.editado.pendientes = this.pendientes
        this.editado.tasasIVA   = this.tasasIVA
        this.editado.cpr        = this.editado.cpr+'-'+this.editado.letra+' '+this.afipSuc+'-'+this.afipNro
        this.editarHTTP(this.editado);
      } else {
        this.altaHTTP();
      }
      this.cancelar();
    },


    listarHTTP:function(suc) {
      let perfiscal = ''
      if (this.elMes==undefined || this.elMes=='') return
      let m = this.queMesEs(this.elMes)
      perfiscal = this.anio+m
      this.progress = true
      let s = this.search==null||this.search=='' ? '' : this.search
      return HTTP().post('/'+this.modelo, {
        suc: this.sucursal, 
        cpr: this.filtroComprobante, 
        tip: this.filtroComprobanteSel,
        pro: this.filtroTercero_id,
        perfiscal: perfiscal,
        search: s,
        vendedor: null })
        .then(({ data }) => {
          this.filtrosEstados = []
          for (let i=0; i<=data.length-1; i++) {
            let a = this.getEstado(data[i].estado,'e',data[i].pendientes[0],data[i].carga, data[i])
            let b = ''
            if (a=='Facturado') {
              b = 'Facturados'
            } else if (a=='Anulado') {
              b = 'Anulados'
            } else if (a=='Enviado') {
              b = 'Enviados'
            } else if (a=='Retirado') {
              b = 'Retirados'
            } else if (a=='Finalizado') {
              b = 'Finalizados'
            } else if (a.substring(0,7)=='Vencido') {
              b = 'Vencidos'
            } else if (a.substring(0,8)=='A Vencer') {
              b = 'A Vencer'
            } else if (a=='Vence Hoy') {
              b = 'Vencen Hoy'
            } else if (a=='Pendiente') {
              b = 'Pendientes'
            } else if (a=='En Embalaje') {
              b = 'En Ambalaje'
            } else if (a=='Embalado') {
              b = 'Embalados'
            } else if (a=='En camino') {
              b = 'En Camino'
            }
            let p = this.filtrosEstados.findIndex(x => x.tip === b);
            if (p==-1) {
              this.filtrosEstados.push({tip: b, ctt: 1})
            } else {
              this.filtrosEstados[p].ctt ++
            }
            data[i].filtroEstado = b
          }
          if (this.filtrosEstados.length>1) {
            this.filtrosEstados.unshift({tip: 'Todos', ctt: data.length})
          }
          if (this.filtrosEstados.length>0)
            this.filtroEstadoSel = this.filtrosEstados[0].tip
          this.itemsAll = data
          this.items = data
          return HTTP().post('/comprasresumen', {
            suc:this.sucursal,
            cli:this.filtroTercero_id,
            per:perfiscal,
            search: s,})
            .then(({data})=>{
            for (let i=0; i<=this.comprobantes.length-1; i++) {
              this.comprobantes[i].total = 0
              this.comprobantes[i].ctt = 0
            }
            for (let i=0; i<=data.length-1; i++) {
              if (data[i].id==1 || data[i].id==6 || data[i].id == 14 || data[i].id == 128) {
                if (data[i].tipo=='GS') {
                  this.comprobantes[6].total += data[i].total
                  this.comprobantes[6].ctt   += data[i].ctt
                } else {
                  this.comprobantes[0].total += data[i].total
                  this.comprobantes[0].ctt   += data[i].ctt
                }
              } else if (data[i].id==2 || data[i].id==7 || data[i].id == 15) {
                if (data[i].tipo=='GS') {
                  this.comprobantes[6].total += data[i].total
                  this.comprobantes[6].ctt   += data[i].ctt
                } else {
                  this.comprobantes[2].total += data[i].total
                  this.comprobantes[2].ctt   += data[i].ctt
                }
              } else if (data[i].id==3 || data[i].id==8 || data[i].id == 16) {
                if (data[i].tipo=='GS') {
                  this.comprobantes[6].total += data[i].total
                  this.comprobantes[6].ctt   += data[i].ctt
                } else {
                  this.comprobantes[1].total += data[i].total
                  this.comprobantes[1].ctt   += data[i].ctt
                }
              } else if (data[i].id==124) {
                this.comprobantes[3].total += data[i].total
                this.comprobantes[3].ctt   += data[i].ctt
              } else if (data[i].id==125) {
                this.comprobantes[4].total += data[i].total
                this.comprobantes[4].ctt   += data[i].ctt
              } else if (data[i].id==126) {
                this.comprobantes[5].total += data[i].total
                this.comprobantes[5].ctt   += data[i].ctt
              } else if (data[i].id==127) {
                this.comprobantes[7].total += data[i].total
                this.comprobantes[7].ctt   += data[i].ctt
              }
            }
            this.progress = false
          })
        })
    },


    editarHTTP:function(data) {
      return HTTP().patch(`compras/${data.id}`, data)
        .then((data) => {
          if (data.data=='error') {
            this.mensaje('¡Opps, se ha producido un error!, el comprobante no se ha grabado.', this.temas.forms_titulo_bg, 2500) 
          } else {
            this.mensaje('¡Actualización Exitosa!', this.temas.forms_titulo_bg, 1500) 
          }
          this.listarHTTP()
      });
    },


    pagoHTTP:function(data) {
      debugger
      let pos = 0
      for (let i=0; i<=this.valores.length-1; i++) {
        //this.valores[i].fechafinanciera = moment().format('YYYY-MM-DD')
        if (this.valores[i].fechafinanciera!='') {
          if (this.valores[i].id != null) {         // es cuando es un cheque de tecero.
            this.valores[i].fechasalida = null
          } else {
            this.valores[i].fechasalida = moment().format('YYYY-MM-DD')
          }
        }
        pos = this.medpag.findIndex( x => x.id == this.valores[i].medio_id)
        this.valores[i].medio_id = this.medpag[pos].idmdp
      }
      data.valores             = this.valores
      data.pendientes          = this.pend
      data.total               = this.editado.total
      data.observaciones       = 'PAGO'
      data.notificacion        = 0,
      data.sucursal_id         = this.sucursal
      data.comprobante_id      = 127
      data.deposito_id         = null
      data.lista_id            = null
      data.tipo                = 'PG'
      data.user_id             = this.userId
      data.mediodepago_id      = null
      data.vendedor_id         = null
      data.estado              = 'F'
      data.carga               = 'M'
      data.notificaEnBaseAOtro = this.notificaEnBaseAOtro,
      data.notificaOriginal    = this.notificaOriginal,
      data.basadoEnOtroCpr     = this.basadoEnOtroCpr,
      this.dialogPag           = false

      return HTTP().post('pago', data).then(({data}) => {
        if (data=='error') {
          this.mensaje('¡Ha ocurrido un problema con el Pago!', this.temas.forms_titulo_bg, 1500)
        } else {
          this.mensaje('¡Pago realizado correctamente!', this.temas.forms_titulo_bg, 1500)
          return HTTP().get('/user/'+this.userId).then(({data}) => {
            if (data[0].tercero != null) {
              this.$store.commit('setDatosEmpresa', data[0], { root: true} )
            }
            this.listarHTTP();
          })
        }
      });
    },


    borrarHTTP:function(data) {
      return HTTP().delete(`compras/${data.id}`, data)
        .then(() => {
          this.listarHTTP()
        });
    },


    anularPagoHTTP:function() {
      debugger
      let userProv = this.itemActual.tercero.user!=null?this.itemActual.tercero.user.id:null
      return HTTP().post('anularpago', {
        id: this.itemActual.id,
        vinculado:this.pagoVinculado,
        reutilizacheques: this.chePropEnPagoMantener,
        userprov: userProv}).then(({data}) => {
        this.dialogPagAnula=false;
        debugger
        if (data.ok) {
          this.mensaje(data.aviso, this.temas.forms_titulo_bg, 2000)
        } else {
          this.mensaje(data.aviso, this.temas.forms_titulo_bg, 2000)
        }
        this.listarHTTP();
      });
    },


    anularPedidoHTTP:function(data) {
      debugger
      return HTTP().patch(`anulapedidoelcliente/${data.id}`).then(({data}) => {
        debugger
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.forms_titulo_bg, 1500) 
        } else {
          this.mensaje('¡El comprobante se ha Anulado con éxito!', this.temas.forms_titulo_bg, 1500) 
        }
        this.listarHTTP()
      });
    },


    anularComprobanteHTTP:function(data) {
      return HTTP().patch(`anularcomprobante/${data.id}`)  // ver
        .then(({data}) => {
          if (data=='error') {
            this.mensaje('¡Opps, se ha producido un error!', this.temas.forms_titulo_bg, 1500) 
          } else {
            this.mensaje('¡El comprobante se ha Anulado con éxito!', this.temas.forms_titulo_bg, 1500) 
          }
          this.listarHTTP()
        });
    },


    duplicarPedidoHTTP (item) {
      return HTTP().post('/duplicarpedido', { pedido: item, empresa: this.empresaId })
      .then(({ data }) => {
        this.listarHTTP();
      });
    },


    altaHTTP:function() {
      let fechaParaBarraDeAniosYMeses = this.editado.perfiscal+'-01'
      this.editado.estado = 'P'
      if (this.editado.cpr==='PED') {
        // CUANDO ES UN PEDIDO, NO ENVIO LOS ITEMS, SOLO LA CABECERA, LOS ITEMS SON ENVIADOS LUEGO DE SER CARGADOS
        this.articulos = []
      } else if (this.editado.cpr==='FAC') {

        // TODO LO QUE SE CARGUE COMO FAC VA EN CUENTA CORRIENTE
        this.valores = []
        this.pendientes.push({
          comprobante_id: null,
          vencimiento:    moment(this.editado.vencimiento).format('YYYY-MM-DD'),
          importe:        this.editado.total*this.coef,
          pendiente:      this.editado.total*this.coef,
          concepto:       'EN CUENTA CORRIENTE'
        })
      }
      return HTTP().post('/compranueva', {
        fecha:               this.editado.fecha,
        perfiscal:           this.editado.perfiscal,
        tipo:                this.editado.tipo,
        cpr:                 this.editado.cpr+'-'+this.editado.letra+' '+this.afipSuc+'-'+this.afipNro,
        user_id:             this.userId,
        sucursal_id:         this.sucursal,
        tercero_id:          this.editado.tercero_id,
        comprobante_id:      this.editado.comprobante_id,
        direccion_id:        this.editado.direccion_id,
        documento_id:        this.editado.documento_id,
        mediodepago_id:      null,                      //esto no va mas!
        deposito_id:         this.editado.deposito_id,
        vendedor_id:         this.editado.vendedor.id,  //null, //this.editado.tercero_id,  021201
        moneda_id:           this.editado.moneda_id,
        tasadescuento:       this.editado.tasadescuento,
        importedescuento:    this.editado.importedescuento*this.coef,
        retiva:              this.editado.retiva*this.coef,
        retgan:              this.editado.retgan*this.coef,
        retib:               this.editado.retib*this.coef,
        impint:              this.editado.impint*this.coef,
        nogravado:           this.editado.nogravado*this.coef,
        flete:               this.editado.flete*this.coef,
        gravado:             this.editado.gravado*this.coef,
        exento:              this.editado.exento*this.coef,
        iva:                 this.editado.iva*this.coef,
        total:               this.editado.total*this.coef,
        poradcosto:          this.editado.poradcosto*this.coef,
        regstk:              this.editado.regstk,
        estado:              this.editado.estado,
        activo:              true,
        observaciones:       this.editado.observaciones,
        articulos:           this.articulos,
        valores:             this.valores,
        pendientes:          this.pendientes,
        notificacion:        0,
        notificaEnBaseAOtro: 0,
        notificaOriginal:    0,
        gasto:               this.itemActualGasto,
        tasasIVA:            this.tasasIVA,
      }).then(({ data }) => {
        if (data=='error') {
          this.mensaje('¡Opps, se ha producido un error!', this.temas.forms_titulo_bg, 1500) 
        } else {
          this.mensaje('¡Alta Exitosa!', this.temas.forms_titulo_bg, 1500) 
        }
        return HTTP().get('/user/'+this.userId).then(({data}) => {
          if (data[0].tercero != null) {
            this.$store.commit('setDatosEmpresa', data[0], { root: true} )
          }
          let a = moment(fechaParaBarraDeAniosYMeses).format('YYYY')
          let m = moment(fechaParaBarraDeAniosYMeses).format('MMM')
          let pos1 = this.anios.findIndex(x => x === a);
          let pos2 = this.meses.findIndex(x => x === m);
          if (pos1==-1 || pos2==-1) {
            this.leoAnios().then(data => {
              this.listarHTTP();
            })
          } else {
            this.listarHTTP();
          }
        })
      });
    },


    enviarPedidoHTTP(item) {
      this.editedIndex = this.items.indexOf(item)
      if (this.items[this.editedIndex].tercero.user) {
        // TIENE QUE ENVIAR EL PEDIDO POR SISTEMA
        let novedad = {
          cpr_id: this.items[this.editedIndex].id,
          novedad: 'Envio del Pedido',
          rel_id: null,
          estado: 'N'
        }
        return HTTP().patch('/enviarpedido', {id:this.items[this.editedIndex].id,novedad: novedad,vendedor:false}).then(({data})=>{
          if (data = 'ok') {
            for (let i=0; i<=item.items.length-1; i++) {
              let pos = this.$store.state.publicaciones.findIndex( x => x.articulo_id == item.items[i].articulo_id)
              if (pos!=-1) {
                this.$store.commit('setActPublicacion', [{
                  articulo_id: item.items[i].articulo_id,
                  ctt: item.items[i].cantidad*-1 }],{root:true})
              }
            }
            this.mensaje('¡Pedido enviado correctamente!', this.temas.forms_titulo_bg, 1500)
          } else {
            this.mensaje('¡Ha ocurrido un problema con el envío del pedido!', this.temas.forms_titulo_bg, 1500)
          }
          this.listarHTTP();
        })
      } else  {
        // TIENE QUE ENVIAR EL PEDIDO POR MAIL
      }
    },


    afipsuc() {
      this.afipSuc = this.afipSuc.padStart(4,'0')
    },


    afipnro() {
      this.afipNro = this.afipNro.padStart(8,'0')
    },


    pagar(item) {
      if (!item.pendientes[0]) return false
      if (item.pendientes[0].pendiente>0 && item.estado=='F') {
        return true
      } else {
        return false
      }
    }, 


    cancelado(item) {
      if (!item.pendientes[0]) return true
      if (item.pendientes[0].pendiente==item.pendientes[0].importe) {
        return false
      } else {
        return true
      }
    }, 


    finalizar(item) {
      this.editedIndex = this.items.indexOf(item)

      debugger
      return HTTP().get('/comprachkfinalizar/'+item.id+'/'+this.sucursalDemo).then(({ data }) => {
        this.msg.msgTitle = 'Chequeo del Comprobante'

        debugger

        // si hay descuentos recalculo el gravado y el iva
        let gra = data[0].itemssiniva
        let iva = data[0].itemsconiva-data[0].itemssiniva
        let agr = data[0].agr
        let fle = data[0].fle
        let destas = data[0].tas
        let desimp = data[0].des

        gra -= gra*(data[0].tas/100)
        iva -= iva*(data[0].tas/100)

        // si ingreso flete (que es sin iva) recalculo el gravado y el iva
        let poradcosto = this.roundTo(((agr+fle)/gra)*100,6)
        gra += gra*(poradcosto/100)
        iva += iva*(poradcosto/100)

        let div = item.regstk==1 ? 3 : 2
        let con = (data[0].total+ gra+iva +data[0].valores)/div
        let txt = '<table><tr><td> &nbsp </td><td> &nbsp </td></tr>'
        if (div == 3) {
          txt += '<tr><td style="text-align:left">Total de items ingresados</td>'
          txt += '<td style="text-align:right"><b>$'+this.formatoImporte(gra+iva)+'</b></td></tr>'
        }
        txt += '<td style="text-align:left">Total del Comprobante</td>'
        txt += '<td style="text-align:right"><b>$'+this.formatoImporte(data[0].total)+'</b></td></tr>'
        txt += '<tr><td style="text-align:left">> Flete</td>'
        txt += '<td style="text-align:right">$'+this.formatoImporte(fle)+'</td></tr>'
        txt += '<tr><td style="text-align:left">> Descuento ('+this.formatoImporte(destas)+'%)</td>'
        txt += '<td style="text-align:right">$'+this.formatoImporte(desimp)+'</td></tr>'
//      txt += '<tr><td style="text-align:left">                            </td>'
//      txt += '<td style="text-align:right"><b>'+'-----------------------'+'</b></td></tr>'
//      txt += '<tr><td style="text-align:left">Total Items</td>'
//      txt += '<td style="text-align:right"><b>$'+this.formatoImporte(gra+iva+agr+fle)+'</b></td></tr>'
        txt += '<tr><td style="text-align:left">Total de Valores Ingresados</td>'
        txt += '<td style="text-align:right"><b>$'+this.formatoImporte(data[0].valores)+'</b></td></tr>'
        txt += '<tr><td> &nbsp </td><td> &nbsp </td></tr>'
        if (div == 3 && poradcosto!=0) {
          txt += '<b>HAY RECARGO EN COSTOS</b><br>'
          txt += 'Se le aplicará un <b>%'+this.formatoImporte(poradcosto)+'</b> adicional '
          txt += 'al costo de cada item correspondiente a conceptos por <b>$'+this.formatoImporte(agr+fle)+'</b> que no forman parte de los '
          txt += 'mismos, pero que son parte del total del Comprobante.<br>'
          if (data[0].artcamcos>0) {
            txt += 'Esto implica que <b>'+data[0].artcamcos+' artículo/s cambiarán sus costos. </b><br>'
            txt += 'Para confirmarlos ingrese en el módulo <i>Artículos</i>, opción <i>Cambios de Precios</i>, '
            txt += 'solapa <i>Precios Modificados por Compras</i><br><br>'
          }
        } else if (data[0].artcamcos>0) {
          // AVISO QUE HUBO CAMBIOS EN LOS COSTOS
          txt += '<br><b>HAY CAMBIOS EN COSTOS</b><br>'
          txt += '<b>'+data[0].artcamcos+' artículo/s cambiaron sus costos. </b><br>'
          txt += 'Para confirmarlos ingrese en el módulo <i>Artículos</i>, opción <i>Cambios de Precios</i>, '
          txt += 'solapa <i>Precios Modificados por Compras</i><br><br>'
        }

        let aaa = this.roundTo(con,2)
        let bbb = this.roundTo(data[0].total,2)
        if (aaa != bbb) {
          txt += '<tr><td>¡EL COMPROBANTE NO BALANCEA!</td></tr>'
          this.msg.msgButtons = ['Cancelar']
        } else {
          txt += '<tr><td>¡EL COMPROBANTE BALANCEA!, ¿Lo finaliza?</td></tr>'
          this.msg.msgButtons = ['Aceptar','Cancelar']
        }
        txt += '</table>'
        this.msg.msgBody = txt
        this.msg.msgVisible = true
        this.msg.msgAccion = 'finalizar comprobante'
        this.itemActual = item;
      });
    },


    finalizaCompra() {
      let fal = []
      return HTTP().get('/pedidossinstock/'+this.sucursalDemo).then(({ data }) => {
        let ids = this.itemActual.items.map(el => el.articulo_id)
        let pos = 0
        for (let i=0; i<=data.length-1; i++) {
          let rec = 0
          pos = ids.indexOf(data[i].artid)
          if (pos>=0) {
            rec = this.itemActual.items[pos].cantidad
          }
          fal.push({
            artid: data[i].artid,
            articulo: data[i].articulo.substr(0,35)+' ('+data[i].codigo+')',
            cliente: data[i].cliente_id,
            cpr: data[i].cpr,
            cprid: data[i].cprid,
            faltante: data[i].faltante,
            recibido: rec,
          })
        }
        return HTTP().patch('/comprafinalizar',{itemActual: this.itemActual, faltantes: fal}).then(({data})=>{
          this.msg.msgTitle   = 'Comprobante Finalizado'
          this.msg.msgBody    = 'EL COMPROBANTE HA FINALIZADO'
          this.msg.msgVisible = true
          this.msg.msgAccion  = 'Comprobante Finalizado'
          this.msg.msgButtons = ['Aceptar']
        })
      })
    },


    tasaDescuentoGlobal() {
      let ctt = Number(this.editadoArt.cantidad)
      let pre = Number(this.editadoArt.costo)
      let tde = Number(this.editado.tasadescuento)
      let ide = this.roundTo((ctt*pre),2)*(tde/100)
      this.editadoArt.importedescuento = ide
      this.editadoArt.total = this.roundTo(((ctt*pre)-ide),2)
      return this.editadoArt.total
    },


    selectPend(item) {
      let pos = this.pend.indexOf(item)
      if (this.pend[pos].acancelar!=0) {
        this.pend[pos].acancelar = 0
      } else {
        let totPendSel = 0
        for (let i=0; i<=this.pend.length-1; i++) {
          totPendSel += this.roundTo(this.pend[i].acancelar,2)
        }
        if ((totPendSel+this.pend[pos].pendiente)<this.editado.total) {
          this.pend[pos].acancelar = this.pend[pos].pendiente
        } else {
          this.pend[pos].acancelar = this.editado.total-totPendSel
        }
      }
      for (let i=0; i<=this.pend.length-1; i++) {
        this.totCancelado += this.roundTo(this.pend[i].acancelar,2)
      }
      this.calculosMed()
    },


    totalPago() {
      this.valDiferencia = Math.abs(this.editado.total)*-1
    },


    automaticoPend(item) {
      this.totCancelado = 0
      let tot = Number(this.editado.total)
      for (let i=0; i<=this.pend.length-1; i++) {
        this.pend[i].acancelar = 0
      }
      for (let i=0; i<=this.pend.length-1; i++) {
        if (tot >= this.pend[i].pendiente) {
          this.pend[i].acancelar = this.pend[i].pendiente
          this.totCancelado += this.pend[i].pendiente
          tot -= this.pend[i].pendiente
        } else if ( tot > 0 ) {
          this.pend[i].acancelar = tot
          this.totCancelado += tot
          tot = 0
        }
      }
    },


    limpiarSelPend(item) {
      this.totCancelado = 0
      for (let i=0; i<=this.pend.length-1; i++) {
        this.pend[i].acancelar = 0
      }
    },


    calculoIVA(cual, pos) {
      debugger
      this.editado.gravado    = 0
      this.editado.iva        = 0
      this.editado.retib      = Number(this.editado.retib)
      this.editado.retgan     = Number(this.editado.retgan)
      this.editado.retiva     = Number(this.editado.retiva)
      this.editado.impint     = Number(this.editado.impint)
      this.editado.exento     = Number(this.editado.exento)
      this.editado.nogravado  = Number(this.editado.nogravado)
      this.editado.flete      = Number(this.editado.flete)
      this.editado.poradcosto = Number(this.editado.poradcosto)
      for (let i=0; i<=this.tasasIVA.length-1; i++) {
        this.tasasIVA[i].base = Number(this.tasasIVA[i].base)
        this.tasasIVA[i].iva  = Number(this.tasasIVA[i].iva)
      }
      if (cual=='g') {
        if (cual==2) {
          this.tasasIVA[pos].iva = 0
        } else {
          this.tasasIVA[pos].iva = this.roundTo(this.tasasIVA[pos].base*(this.tasasIVA[pos].tasa/100),2)
        }
      } else if (cual=='i') {
        this.tasasIVA[pos].iva = this.roundTo((100*this.tasasIVA[pos].iva)/(this.tasasIVA[pos].tasa),2)
      }
//      let gra = 0
//      let iva = 0
//      for (let i=0; i<=this.tasasIVA.length-1; i++) {
//        gra += this.tasasIVA[i].base
//        iva += this.tasasIVA[i].iva
//      }
      for (let i=0; i<=this.tasasIVA.length-1; i++) {
        if (i==2) {
//        this.editado.exento = this.tasasIVA[i].base
          this.tasasIVA[i].base = this.editado.nogravado+this.editado.exento
        } else {
          this.editado.gravado += this.tasasIVA[i].base
          this.editado.iva += this.tasasIVA[i].iva
        }
      }

      this.gravadoDiff = this.itemsCargadosGravado-this.editado.gravado
      this.ivaDiff = this.itemsCargadosIVA-this.editado.iva
      if (cual=='tasadescuento') {
        this.editado.importedescuento = this.roundTo(this.editado.gravado*(this.editado.tasadescuento/100),2)
      } else if (cual=='importedescuento') {
        this.editado.tasadescuento = this.roundTo((this.editado.importedescuento*100)/this.editado.gravado,2)
      }

      // si hay descuentos recalculo el gravado y el iva
      this.editado.gravado -= this.editado.gravado*(this.editado.tasadescuento/100)
      this.editado.iva -= this.editado.iva*(this.editado.tasadescuento/100)

      // si ingreso flete (que es sin iva) recalculo el gravado y el iva
//    this.editado.poradcosto = this.roundTo(((this.editado.retiva+this.editado.retgan+this.editado.retib+this.editado.impint+this.editado.nogravado+this.editado.flete)/this.editado.gravado)*100,6)
      if (this.editado.gravado!=0) {
        this.editado.poradcosto = this.roundTo(((this.editado.flete)/this.editado.gravado)*100,6)
      }
      this.editado.gravado += this.editado.gravado*(this.editado.poradcosto/100)
      this.editado.iva += this.editado.iva*(this.editado.poradcosto/100)

      this.editado.total = this.roundTo(
        this.editado.retiva+
        this.editado.retgan+
        this.editado.retib+
        this.editado.impint+
        this.editado.nogravado+
        this.editado.gravado+
        this.editado.exento+
        this.editado.iva,2)
      this.calculos()
    },


    calculos(cual) {
      debugger
      let totpag = 0
      if (this.ctacte) {
        for (let i=0; i<=this.medpag.length-1; i++) {
          if (i!=3) {
            totpag += this.medpag[i].total
          }
        }
        this.medpag[3].total = this.roundTo((Number(this.editado.total) - Number(totpag)),2)
      } else {
        for (let i=0; i<=this.medpag.length-1; i++) {
          if (i!=0) {
            totpag += this.medpag[i].total
          }
        }
        this.medpag[0].total = this.roundTo((Number(this.editado.total) - Number(totpag)),2)
      }
      this.totalItems = 0
      for (let i=0; i<=this.articulos.length-1; i++) {
        this.totalItems += this.articulos[i].total
      }
    },


    puedoEnviarPedido(item) {
      return HTTP().get('/puedeenviarpedido/'+item.id).then(({data})=>{
        this.selArtPedErr = []
        for (let i=0; i<=data.length-1; i++) {
          let msg = ''
          if (data[i].texto=='Error en Regla') {
              msg = 'Error en Regla '
          } else {
            if (data[i].stock<0) {
              msg = 'Stock '
            }
            if (data[i].preciopedido!=data[i].precioactual) {
              msg += 'Precios '
            }
            if (data[i].pubestado!='P') {
              msg += 'Pub/pausada'
            }
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
          let proveedor = item.tercero.user ? item.tercero.user.id : null
          return HTTP().get('/comprasitems/'+item.id+'/'+proveedor).then(({ data }) => {
            this.msg.msgTitle = 'Enviar Pedido'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'Enviar Pedido'
            let txt = ''
            if (data.length==0) {
              this.msg.msgBody = '¡Este pedido no posee items!<br>Agrege items desde la opcion <i>Artículos</i> para poder enviar el pedido.'
              this.msg.msgButtons = ['Cerrar']
            } else {
              if (item.tercero.user) {
                txt = '¿Confirma enviar el pedido a <b>'+item.tercero.user.username +'</b>?<br><br> El pedido posee '+(data.length)+' item/s. '
                txt += 'y será enviado por sistema.<br>'+item.tercero.user.username+' lo recibirá '
                txt += 'al instante y podrá comenzar su procesamiento,<br>'
                txt += 'Cada acción que realice '+item.tercero.user.username+' sobre tu pedido te será notificada.<br><br>'
                txt += '¡Estate atento al boton de notificaciones!'
              } else {
                txt = '¿Confirma enviar el pedido a '+item.tercero.nombre+'?<br> El pedido posee '+(data.length)+' item/s.'
                txt = txt + 'El pedido será enviado por correo electrónico en formato Excel.'
              }
              this.msg.msgBody = txt
              this.msg.msgButtons = ['Aceptar','Cancelar']
            }
            this.itemActual = item;
          })
        }
      })
    },


    preguntoEnvio (item) {
      /*
      return HTTP().get('/puedeenviarpedido/'+item.id).then(({data})=>{
        let err = []
        for (let i=0; i<=data.length-1; i++) {
          if (data[i].stock<0) {
            err.push({codigo: data[i].codigo, nombre: data[i].nombre, stock:data[i].stock, err: 'Falta Stock'})
          } 
          if (data[i].preciopedido!=data[i].precioactual) {
            err.push({codigo: data[i].codigo, nombre: data[i].nombre, stock:data[i].stock, err: 'Diferencia de Precios'})
          }
        }
        if (err.length>0) {
          this.msg.msgTitle = 'Stock insuficiente en publicaciones o precios desactualizados'
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
          */
      /*})*/
    },


    arreglarPedido(){
      this.msg.msgTitle = 'Arreglar Pedido'
      this.msg.msgBody = 'Confirma arreglar el pedido?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'arreglar pedido'
      this.msg.msgButtons = ['Aceptar', 'Cancelar']
    },


    arreglarPedidoHTTP(){
      return HTTP().post('/arreglarpedido', { proveedor: this.itemActual.tercero.user.id, errores: this.selArtPedErr }).then(({ data }) => {
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
        this.listarHTTP()
      })
    },


    recepcionPedido (item) {
      this.itemActual = item;
      this.recepcion.respuesta = '¡El pedido está correcto!'
      this.recepcion.observaciones = '¡El pedido está correcto!'
      this.recepcion.fechaenvio = moment(item.enviollegada).format('YYYY-MM-DD')
      this.recepcion.fechallegada = moment().format('YYYY-MM-DD')
      this.recepcion.calificacion = 5
      this.dialogRecepcion = true
    },


    preguntoAnularPago(item) {
      // veo si se usaron cheques propios para anular el pago.
      // esto para preguntar si se reutilizan los numeros de los cheques utilizados.
      debugger
      this.itemActual = item
      this.pagoVinculado = item.tercero.user!=null?true:false
      return HTTP().post('puedoanularpago', {id: item.id, vinculado:this.pagoVinculado}).then(({data}) => {

        debugger
        if (!data.ok) { // NO PUEDE ANULAR EL PAGO, ES VINCUALDO Y EL PROVEEDOR YA USO LOS VALORES
          this.msg.msgTitle = 'No se puede Anular este Pago'
          this.msg.msgBody = data.aviso
          this.msg.msgVisible = true
          this.msg.msgAccion = 'imposible anular pago'
          this.msg.msgButtons = ['Aceptar']
        } else {
          this.cttChePropEnPago = 0
          for (let i=0; i<=item.valoresEgresos.length-1; i++) {
            if (item.valoresEgresos[i].cheque_id!=null) {
              this.cttChePropEnPago ++
            }
          }
          this.dialogPagAnula = true
        }
      });
    },

    preguntoAnularComprobante() {
      this.msg.msgTitle = 'Anular Comprobante'
      this.msg.msgBody = '¿Confirma Anular el Comprobante?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'anular comprobante'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    preguntoAnularPedido() {
      this.msg.msgTitle = 'Anular Pedido'
      this.msg.msgBody = '¿Confirma Anular el Peido?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'anular pedido'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    setFP(cual) {
      // EN BASE A cual, SETEO LA FORMA DE PAGO: EFEC, CHE.CARTERA, BANCO, RETENCION.
      this.editadoMed = Object.assign({}, this.defaultItemMed)
      if (this.cueProvItems.length==0 && (cual==2 || cual==3 || cual==5)) {
        this.msg.msgTitle = '¡No hay cuenta!'
        let m = 'No hay cuentas bancarias definidas en el Proveedor<br>'
        m += 'Se debe definir al menos una cuenta para que los valores '
        m += 'ingresados aquí imputen en la misma.<br>'
        m += 'Si Ud. tiene acceso a estas cuentas definala, caso'
        m += 'contrario comuniquese con el proveedor para que la defina<br>'
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'no hay cuenta bancaria en el proveedor'
        this.msg.msgButtons = ['Aceptar']
        this.itemActual = item
      } else {
        for (let i=0; i<=this.cueProvItems.length-1; i++) {
          if (this.cueProvItems[i].predeterminada) {
            this.editadoMed.cuentadestino_id = this.cueProvItems[0].id
          }
        }

      }
      this.editedIndexMed = -1
      this.dialogMed = true
      this.medioDePagoId = cual
      if (cual==1) {
        this.medpagwidth = 400    //efectivo
      } else if (cual==2 || cual==3) {
        // filtro de las cuentas definidas las tarjetas de crédito
        this.medpagwidth = 700    //tarjeta de debito o credito ( filtro )
        this.tarItems = []
        for (let i=0; i<=this.cueItems.length-1; i++) {
          for (let j=0; j<=this.cueItems[i].tarjetas.length-1; j++) {
            if ((cual==2 && !this.cueItems[i].tarjetas[j].debito) ||
                 cual==3 && this.cueItems[i].tarjetas[j].debito) {
              this.tarItems.push({
                id:          this.cueItems[i].tarjetas[j].id,
                numero:      this.cueItems[i].tarjetas[j].tarjeta_numero,
                vencimiento: this.cueItems[i].tarjetas[j].tarjeta_vencimiento,
                debito:      this.cueItems[i].tarjetas[j].debito,
                nombre:      this.cueItems[i].tarjetas[j].tarjeta.nombre,
                cuenta_id:   this.cueItems[i].id,
                banco_id:    this.cueItems[i].banco_id,
                pos:         i,
              })
            }
          }
        }
      } else if (cual==5) {
        this.medpagwidth = 800    //transferencia
        for (let i=0; i<=this.cueItems.length-1; i++) {
          if (this.cueItems[i].predeterminada) {
            this.editadoMed.cuentaorigen_id = this.cueItems[0].id
          }
        }
      } else if (cual==6) {
        this.medpagwidth = 1210   //cheques en cartera
      } else if (cual==7) {         
        this.medpagwidth = 910    //cheque propio
      } else if (cual==8) {
        this.medpagwidth = 500
      } else if (cual==9) {
        this.medpagwidth = 500
      } else if (cual==10) {
        this.medpagwidth = 500
      }
      this.calculosMed()
      this.editadoMed.importe = this.valDiferencia
      this.medioDePagoNombre = this.medpag[cual-1].nombre
      this.elMedioEsOk()
    },


    elMedioEsOk() {
      debugger
      this.elMedioEstaOk = true
      if (Number(this.editadoMed.importe)==0) {
        this.elMedioEstaOk = false
      }
      if (this.medioDePagoId==2 && this.editadoMed.tarjeta_id==null) {
        this.elMedioEstaOk = false
      }
      if (this.medioDePagoId==3 && this.editadoMed.tarjeta_id==null) {
        this.elMedioEstaOk = false
      }
      if (this.medioDePagoId==5 &&
        (this.editadoMed.cuentaorigen_id==null || this.editadoMed.cuentadestino_id==null)) {
        this.elMedioEstaOk = false
      }
      if (this.medioDePagoId==6) {
        if (this.editadoMed.importe < this.totCheTerSel) {
          this.elMedioEstaOk = false
        }
      }
      if (this.medioDePagoId==7) {
        if (this.editadoMed.cuentaorigen_id==null ||
            this.editadoMed.chequera_id==null ||
            this.editadoMed.cheque_id==null ||
            this.editadoMed.fechafinanciera==null ||
            !this.laFechaDelChequeEstaOk ) {
          this.elMedioEstaOk = false
        }
      }
      if (this.medioDePagoId==8) {
      }
      if (this.medioDePagoId==9) {
      }
      if (this.medioDePagoId==10) {
      }
    },


    setComoPaga(cual) {
      if (cual==0) { return }     // todavia no selecciono el proveedor
      // calculo la ctacte por diferencia si el proveedor es ctacte.
      let totpag = 0
      for (let i=0; i<= this.medpag.length-1; i++) {
        if (i==cual-1) {
          totpag += this.medpag[i].total
        }
      }
      this.medpag[cual-1].total = this.editado.total-(totpag)
      this.dialogPag               = true
      this.pagoDeUnSoloComprobante = true
      this.esUnPagoDeUnaFactura    = true
      if (this.valores.length == 0) {
        this.cargoValorInicialEnValores(this.caja, null, this.editado.total, cual)
      }
      this.cprBalanceado()
    },


    cargoValorInicialEnValores(caja, cpregreso, total, medio) {
      // puede ser cta cte o efectivo
      this.medpag[medio-1].total = this.editado.total
      let observ   = medio==1 ? 'COBRO EN EFECTIVO' : 'A CUENTA CORRIENTE'
      let medioNom = medio==1 ? 'Efectivo'          : 'Cuenta Corriente'
      this.valores.push({ 
        id:                null,
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
        tipo:              'D',
        observ:            observ,
        foto:              null,
        medioNombre:       medioNom,
        cuenta:            null,
        cuit:              null,
        nombre:            null,
      })
    },


    cprBalanceado() {
      let valores = 0
      for (let i=0; i<=this.medpag.length-1; i++) {
        valores += this.medpag[i].total
      }
      if (this.editado.total==valores) {
        return true
      } else {
        return false
      }
    },


    activerow (item) {
      this.$set(item, 'selected', true)
    },


    selCheTer (item) {
      this.item
    },


    verificoFechaDelCheque(item) {
      this.laFechaDelChequeEstaOk = true
      let d = 0
      let hoy = moment()
      d = hoy.diff(item.fechafinanciera, 'days')
      if (this.maxDiasChq!=999999) {
        if (d<0 && (Math.abs(d) > this.maxDiasChq)) {
          this.sayMensajeErrorFechaDelCheque(this.editado.nombre, d)
          this.laFechaDelChequeEstaOk = false
          return false
        }
      }
    },


    selectCartera(item) {
      this.laFechaDelChequeEstaOk = true
      if (this.maxDiasChq!=999999) {
        if (item.dias>0 && (Math.abs(item.dias) > this.maxDiasChq)) {
          this.sayMensajeErrorFechaDelCheque(this.itemActual.tercero.nombre, item.dias)
          this.laFechaDelChequeEstaOk = false
          return
        }
      }
      let pos = this.cartera.indexOf(item)
      this.totCheTerSel = 0
      if (pos>=0) {
        this.cartera[pos].seleccionado = this.cartera[pos].seleccionado == 1 ? 0 : 1
      }
      for (let i=0; i<=this.cartera.length-1; i++) {
        if (this.cartera[i].seleccionado==1) {
          this.totCheTerSel += this.roundTo(this.cartera[i].importe,2)
        }
      }
      this.elMedioEsOk()
      this.calculosMed()
    },


    sayMensajeErrorFechaDelCheque(tercero, dias) {
      debugger
      let m = ''
      let d = Math.abs(dias) - this.maxDiasChq
      this.msg.msgTitle = 'Error en los días del cheque!'
      m = 'El valor seleccionado se excede en '
      m += d
      m += d==1 ? ' día' : ' días.<br>'
      m += '<i>'+tercero+'</i> recibe cheques de hasta '+this.maxDiasChq
      m += ' días.'
      m += ' Lamentamos las molestias.'
      this.msg.msgBody  = m
      this.msg.msgVisible = true
      this.msg.msgAccion = 'error en los dias del cheque'
      this.msg.msgButtons = ['Aceptar']
    },


    seleccionAutomatica() {
      this.totCheTerSel = 0
      let sel = 0
      for (let i=0; i<=this.cartera.length-1; i++) {
        this.cartera[i].seleccionado = 0
      }
      this.cartera.sort(function (a, b) {
        if (moment(a.fechafinanciera).format('YYYYMMDD') > moment(b.fechafinanciera).format('YYYYMMDD')) {
          return 1;
        }
        if (moment(a.fechafinanciera).format('YYYYMMDD') < moment(b.fechafinanciera).format('YYYYMMDD')) {
          return -1;
        }
        return 0;
      });
      debugger
      for (let i=0; i<=this.cartera.length-1; i++) {
        if (sel+this.cartera[i].importe < this.editado.total) {
          if ((this.maxDiasChq!=999999) && (this.cartera[i].dias>0 && (Math.abs(this.cartera[i].dias) <= this.maxDiasChq))) {
            sel += this.cartera[i].importe
            this.cartera[i].seleccionado = 1
          }
        }
      }
      this.totCheTerSel = this.roundTo(sel,2)
      this.calculosMed()
    },


    limpiarSeleccion() {
      this.totCheTerSel = 0
      for (let i=0; i<=this.cartera.length-1; i++) {
        this.cartera[i].seleccionado = 0
      }
      this.elMedioEsOk()
      this.calculosMed()
    },


    habinhab(obj) {
      let retval = false
      let mp = this.medioDePagoId
      if (mp==1) {            //EFECTIVO
        if (obj=='efectivo') { retval = true }
      } else if (mp==2) {     //TARJETA DE CREDITO
        if (obj=='tarjeta') { retval = true }
      } else if (mp==3) {     //TARJETA DE DEBITO
        if (obj=='tarjeta') { retval = true }
      } else if (mp==5) {     //TRANSFERENCIA
        if (obj=='transferencia' || obj=='cuenta origen') { retval = true }
      } else if (mp==6) {     //CHEQUE DE TERCERO
        if (obj=='cheque de tercero') { retval = true }
      } else if (mp==7) {     //CHEQUE PROPIO
        if (obj=='cheque propio' || obj=='cuenta origen') { retval = true }
      }
      return retval
    },


    nuevoMed() {
      this.editedIndexMed = -1
      this.dialogMed = true
    },


    editarMed() {
    },


    editarPend(item) {
      this.itemActual = item
      this.editadoPend.acancelar = item.acancelar
      this.dialogPend = true
    },


    borrarMed(item) {
      let i = this.valores.indexOf(item)
      if (this.valores[i].medio_id==6) {
        let j = this.cartera.findIndex( x => x.id == this.valores[i].id)
        if (j!=-1) {
          this.cartera[j].seleccionado = 0
          this.totCheTerSel -= this.cartera[j].importe
        }
      }
      this.valores.splice(i,1);
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
      this.totCancelado = this.roundTo(totPen,2)
      this.totValores = this.roundTo(totVal,2)
      this.valDiferencia = this.roundTo(totPen-totVal,2)
    },


    selCuenta() {
      this.chraItems = []
      let xpos = this.cueItems.findIndex( x => x.id == this.editadoMed.cuentaorigen_id)
      if (this.cueItems[xpos].chequeras!=undefined) {
        for (let i=0; i<=this.cueItems[xpos].chequeras.length-1; i++) {
          this.chraItems.push({
            id:      this.cueItems[xpos].chequeras[i].id,
            nombre:  this.cueItems[xpos].chequeras[i].nombre,
            cheques: this.cueItems[xpos].chequeras[i].loscheques
          })
        }
      }
    },


    selChequera() {
      let xpos = this.chraItems.findIndex( x => x.id == this.editadoMed.chequera_id.id)
      this.cheItems = []
      for (let i=0; i<=this.chraItems[xpos].cheques.length-1; i++) {
        if (this.chraItems[xpos].cheques[i].comprobante_id == null) {
          this.cheItems.push({
            id:     this.chraItems[xpos].cheques[i].id,
            numero: this.chraItems[xpos].cheques[i].numero
          })
        }
      }
    },


    selCheque() {
    },


    guardarMed() {
      let elCompraId = this.editado.id != null ? this.editado.id : null
      let txt = ''
      let xcue1 = 0
      let xcue2 = 0
      let xtar = 0
      // MUEVE BANCOS ?
      if (this.editadoMed.cuentadestino_id!=null) {     
        xcue2 = this.cueProvItems.findIndex( x => x.id == this.editadoMed.cuentadestino_id)
      }
      if (this.editadoMed.cuentaorigen_id!=null) {     
        xcue1 = this.cueItems.findIndex( x => x.id == this.editadoMed.cuentaorigen_id)
        if (xcue1!=-1) {
          this.editadoMed.banco_id = this.cueItems[xcue1].banco.id
        }
      } else if (this.editadoMed.tarjeta_id!=null) {
        xtar = this.tarItems.findIndex( x => x.id == this.editadoMed.tarjeta_id)
        if (xtar!=-1) {
          // en tarItems[x].pos guardo la posicion del objeto en this.cueItems
          xcue1 = this.tarItems[xtar].pos
          this.editadoMed.cuentaorigen_id = this.cueItems[xcue1].id
          this.editadoMed.cuentatarjeta_id = this.cueItems[xcue1].id
          this.editadoMed.banco_id = this.cueItems[xcue1].banco.id
        }
      }
      if (this.medioDePagoId==1 ) {   // EFECTIVO) 
        txt = 'PAGO EN EFECTIVO'
      } else if (this.medioDePagoId==6) {
        // Debo borrar primero todos los cheques del array y luego egregar los de cartera.
        for (let i=0; i<=this.valores.length-1; i++) {
          if (this.valores[i].medio_id==6) {
            this.valores.splice(i--,1)
          }
        }
        for (let i=0; i<=this.cartera.length-1; i++) {
          if (this.cartera[i].seleccionado==1) {
            this.valores.push({ 
              id:                this.cartera[i].id,
              caja_id:           this.caja,
              medio_id:          6,
              cuentaorigen_id:   this.cartera[i].cuentaorigen_id,
              cuentadestino_id:  this.cartera[i].cuentadestino_id,
              cuentacheque_id:   null,
              cuentatarjeta_id:  null,
              banco_id:          this.cartera[i].banco_id,
              tarjeta_id:        null,
              cpregreso_id:      elCompraId,
              cpringreso_id:     null,
              librador_id:       null,
              librador_medio_id: null,
              cheque_id:         this.cartera[i].cheque_id,
              fechafinanciera:   moment(this.cartera[i].fechafinanciera).format('YYYY-MM-DD'),
              fechasalida:       moment().format('YYYY-MM-DD'),
              importe:           this.cartera[i].importe,
              nrovalor:          this.cartera[i].nrovalor,
              tipo:              'D',
              observ:            this.cartera[i].observ,
              foto:              null,
              medioNombre:       this.medioDePagoNombre,
              cuenta:            null,
              cuit:              null,
              nombre:            null,
            })
          }
        }
      } else if (this.medioDePagoId==2 || this.medioDePagoId==3) {   // TARJETA CRE Y DEB
        txt =  'T/'+this.cueItems[xcue1].tarjetas[xtar].tarjeta_numero+' - '
        txt += this.cueItems[xcue1].tarjetas[xtar].tarjeta.nombre+' ('
        txt += this.cueItems[xcue1].tarjetas[xtar].debito==1 ? 'Débito) - ' : 'Crédito) - '
        txt += this.cueItems[xcue1].banco.nombre.substring(0,15)+' - '
        txt += 'C/' + this.cueItems[xcue1].cuenta
      } else  if (this.medioDePagoId==5 ) {   // TRANSFERENCIA
        txt = 'Transf.desde/' + this.cueItems[xcue1].cuenta
        txt += ' hasta/' + this.cueProvItems[xcue2].cuenta
      } else  if (this.medioDePagoId==7 ) {   // CHEQUE PROPIO
        txt = this.cueItems[xcue1].banco.nombre+' - '
        txt += 'C/' + this.cueItems[xcue1].cuenta+' - '
//      txt += this.editadoMed.chequera_id.nombre+' - '
        txt += 'N/'+this.editadoMed.cheque_id.numero+' - '
        txt += 'F/'+this.editadoMed.fechafinanciera

        // marco el cheque para que quede como usado
        let idChequera = this.editadoMed.chequera_id.id
        for (let i=0; i<=this.cueItems[xcue1].chequeras.length-1; i++) {
          for (let j=0; j<=this.cueItems[xcue1].chequeras[i].loscheques.length-1; j++) {
            if (this.cueItems[xcue1].chequeras[i].loscheques[j].numero==this.editadoMed.cheque_id.numero) {
              this.cueItems[xcue1].chequeras[i].loscheques[j].comprobante_id = j
              break
            }
          }
        }

      }
      if (this.editedIndexMed == -1 && this.medioDePagoId!=6) {
        let fecfin = null
        if (this.editadoMed.fechafinanciera!=null) {
          fecfin = moment(this.editadoMed.fechafinanciera).format('YYYY-MM-DD')
        }
        this.valores.push({ 
          id:                null,
          caja_id:           this.caja,
          medio_id:          this.medioDePagoId,
          cuentaorigen_id:   this.editadoMed.cuentaorigen_id,
          cuentadestino_id:  this.editadoMed.cuentadestino_id,
          cuentacheque_id:   null,
          cuentatarjeta_id:  null,
          banco_id:          this.editadoMed.banco_id,
          tarjeta_id:        this.editadoMed.tarjeta_id==null ? null : this.editadoMed.tarjeta_id,
          cpregreso_id:      elCompraId,
          cpringreso_id:     null,
          librador_id:       null,
          librador_medio_id: null,
          cheque_id:         this.editadoMed.cheque_id==null ? null : this.editadoMed.cheque_id.id,
          fechafinanciera:   fecfin,
          fechasalida:       moment().format('YYYY-MM-DD'),
          importe:           this.editadoMed.importe,
          nrovalor:          this.editadoMed.cheque_id==null ? null : this.editadoMed.cheque_id.numero,      // puede ser otro: ejem, nro de transaccion o b.de depos.
          tipo:              'D',
          observ:            txt,
          foto:              null,
          medioNombre:       this.medioDePagoNombre,
          cuenta:            null,
          cuit:              null,
          nombre:            null,
        })
      }
      this.calculosMed()
      this.dialogMed = false
    },


    guardarPend(item) {
      this.itemActual.acancelar = item.acancelar
      this.editado.total = item.acancelar
      this.calculosMed()
      this.dialogPend = false
    },


    cancelarPend() {
      this.dialogPend = false;
    },


    cancelarSelArtPedErr() {
      this.dialogError = false
    },


    cancelarMed() {
      for (let i = 0; i<=this.cartera.length-1; i++) {
        this.cartera[i].seleccionado = 0
      }
      this.totCheTerSel = 0
      this.dialogMed = false;
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
    },


    isArray(array) {
      if (toString.call(array) === "[object Array]") {
        return true;
      } else if ( typeof array.length === "number" ) {
        return true;
      }
      return false;
    },


    buscarCpr() {
      debugger
      let pos = this.cprItems.findIndex( x => x.id === this.editado.comprobante_id )
      if (pos!=-1) {
        let cpr = this.cprItems[pos].abrev+' '+this.afipSuc+'-'+this.afipNro
        return HTTP().post('/compraexisteelcomprobante', { tercero_id: this.editado.tercero_id, cpr: cpr }).then(({data})=>{
          debugger
          if ((this.editedIndex==-1 && data) || (this.editedIndex!=-1 && cpr!=this.cprActual)) {
            this.msg.msgTitle = 'El comprobante ya existe!'
            this.msg.msgBody  = 'El comprobante ingresado '+cpr+' ya fue ingresado.' 
            this.msg.msgVisible = true
            this.msg.msgAccion = 'el comprobante ya existe'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.editado.cpr = cpr.substring(0,3)
          }
        });
      }
    },


    cerrarRas(item) {
      this.dialogRas = false
    },


    verGastos() {
      return HTTP().get('/usersgastos')
        .then(({ data }) => {
          this.gastos = data
          this.dialogGas = true
      });
    },


    verFaltantes(dialog) {
      return HTTP().get('/pedidossinstock/'+this.sucursalDemo)
        .then(({ data }) => {
          this.faltantes = []
          for (let i=0; i<=data.length-1; i++) {
            this.faltantes.push({
              articulo: data[i].articulo.substr(0,35)+' ('+data[i].codigo+')',
              artid: data[i].artid,
              cliente: data[i].cliente.substr(0,25),
              codigo: data[i].codigo,
              cpr: data[i].cpr,
              faltante: data[i].faltante,
              fecha: data[i].fecha,
              seleccionado: false,
            })
          }
          if (dialog) {
            this.dialogFaltantes = true
          }
      });
    },


    generarCompra(item) {
    },


    seleccionarFaltante(item) {
      let pos = this.faltantes.indexOf(item)
      if (pos>=0) {
        this.faltantes[pos].seleccionado = this.faltantes[pos].seleccionado == 1 ? 0 : 1
      }
    },


    nuevoGasto() {
      this.editedIndex = -1;
      this.editadoGas                    = Object.assign({}, this.defaultItemGas);
      this.editadoGas.tercero_id         = null
      this.editadoGas.vencimiento        = moment().format('YYYY-MM-DD')
      this.editadoGas.proximovencimiento = moment().format('YYYY-MM-DD')
      this.editadoGas.observ             = null
      this.editadoGas.periodo            = moment().format('YYYY-MM')
      this.editadoGas.iva_id             = 5
      this.editadoGas.gravado            = 0
      this.editadoGas.iva                = 0
      this.editadoGas.total              = 0
      this.editadoGas.pagado             = 0
      this.editadoGas.fiscal             = '1'
      this.editadoGas.comprobante_id     = null
      this.editadoGas.cpr                = ''
      this.dialogGasEdit                 = true
      this.gastoAgregaPeriodo            = false
      this.formTitleGas                  = 'Nuevo Gasto'
      this.gastoOk                       = false
    },


    gastoAgregarPeriodo(item) {
      return HTTP().get('/ultimacuota/'+item.tercero_id)
        .then(({ data }) => {

          this.editedIndexGas = -1;
          let ven     = moment(data[0].vencimiento)
          let venprox = moment(data[0].proximovencimiento)
          let dias    = venprox.diff(ven, 'days')
          let proxi   = moment(data[0].proximovencimiento,'YYYY-MM-DD').add(dias, 'day').format('YYYY-MM-DD')
          let cuota   = 0
          let cuotas  = 0
          this.editadoGas.tercero_id         = item.tercero_id
          this.editadoGas.vencimiento        = data[0].proximovencimiento.substr(0,10)
          this.editadoGas.proximovencimiento = proxi
          this.editadoGas.periodo            = moment(data[0].proximovencimiento).format('YYYY-MM')
          if (data[0].observ!= null) {
            if (data[0].observ.substr(0,5) == 'CUOTA') {
              cuota  = Number(data[0].observ.substr(6,3))  //CUOTA  001/012 2020
              cuotas = Number(data[0].observ.substr(10,3)) //CUOTAS 001/012 2020
              cuota ++
              if (cuota>cuotas) {
                cuota = 1
              }
              this.editadoGas.cuota  = cuota
              this.editadoGas.cuotas = cuotas
              this.calculoCuotas()
            } else {
              this.editadoGas.observ = data[0].observ
            }
          }
          this.editadoGas.iva_id         = data[0].iva_id
          this.editadoGas.gravado        = data[0].gravado
          this.editadoGas.iva            = data[0].iva
          this.editadoGas.total          = data[0].total
          this.editadoGas.pagado         = 0
          this.editadoGas.fiscal         = data[0].fiscal.toString()
          this.editadoGas.comprobante_id = null
          this.editadoGas.cpr            = ''
          this.dialogGasEdit             = true
          this.gastoAgregaPeriodo        = true
          this.formTitleGas              = 'Nuevo Gasto'
          this.gastoOk = true

          this.$nextTick(() => {
            const f = this.$refs.refvencimiento;
            f.focus();
          });

        })
    },


    listarGasHTTP:function() {
      const a = HTTP().get('/usersgastos')
        .then(({ data }) => {
          this.gastos = data;
      });
    },


    altaGasHTTP:function() {
      this.editadoGas.periodo = moment(this.editadoGas.vencimiento).format('YYYY-MM')
      let per = this.editadoGas.periodo.substr(0,4)+this.editadoGas.periodo.substr(5,2)
      return HTTP().post('/usersgastos', {
        tercero_id: this.editadoGas.tercero_id,
        periodo: per,
        fiscal: this.editadoGas.fiscal == '1' ? 1 : 0,
        observ: this.editadoGas.observ,
        cpr: this.editadoGas.cpr,
        vencimiento: this.editadoGas.vencimiento,
        proximovencimiento: this.editadoGas.proximovencimiento,
        iva_id: this.editadoGas.iva_id,
        gravado: this.editadoGas.gravado,
        iva: this.editadoGas.iva,
        total: this.editadoGas.total
        }).then(({ data }) => {
          this.listarGasHTTP();
        });
    },


    editarGasHTTP:function(data) {
      return HTTP().patch(`usersgastos/${data.id}`, data)
        .then(() => {
          this.mensaje('¡Actualización Exitosa!', this.temas.forms_titulo_bg, 1500) 
          this.listarGasHTTP();
        });       
    },


    borrarGasHTTP:function(id) {
      return HTTP().delete(`/usersgastos/${id}`)
        .then(() => {
          this.listarGasHTTP();
        });
    },


    editarGas (item) {
      this.formTitleGas      = 'Editar Gasto'
      this.editedIndexGas    = this.gastos.indexOf(item)  // si this.editIndex es = -1 es una alta.
      this.editadoGas.cuota  = 0
      this.editadoGas.cuotas = 0
      if (item.observ.substr(0,5)=='CUOTA') {
        this.editadoGas.cuota  = Number(item.observ.substr(6,3))
        this.editadoGas.cuotas = Number(item.observ.substr(10,3))
      }
      this.editadoGas.id                 = item.id
      this.editadoGas.tercero_id         = item.tercero_id
      this.editadoGas.periodo            = item.periodo.substr(0,4)+item.periodo.substr(4,2)
      this.editadoGas.observ             = item.observ
      this.editadoGas.vencimiento        = moment(item.vencimiento).format('YYYY-MM-DD')
      this.editadoGas.proximovencimiento = moment(item.proximovencimiento).format('YYYY-MM-DD')
      this.editadoGas.fiscal             = item.fiscal.toString()
      this.editadoGas.iva_id             = item.iva_id
      this.editadoGas.gravado            = item.gravado
      this.editadoGas.iva                = item.iva
      this.editadoGas.total              = item.total
      this.editadoGas.cpr                = item.cpr
      this.dialogGasEdit                 = true
      this.gastoOk                       = true
    },


    preguntoBorrarGasto (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+item.tercero.nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar gasto'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },


    preguntoBorrarFaltante (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Borra este aviso de faltante?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar faltante'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },


    preguntoProcesarGasto (item) {
      this.itemActualGasto = item
      this.msg.msgTitle = 'Generar Comprobante'
      let msg = '<br>Se generará un Comprobante para el Gasto<br><br>'
      msg += item.tercero.nombre+' '+item.observ+'<br><br>'
      msg += '¿Confirma?<br><br>'
      this.msg.msgBody = msg
      this.msg.msgVisible = true
      this.msg.msgAccion = 'procesar gasto'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },


    borrarGasto (item) {
      const index = this.gastos.indexOf(item);
      this.borrarGasHTTP(this.gastos[index].id);
      this.mensaje('¡Se eliminó el registro.!', this.temas.forms_titulo_bg, 1500) 
    },


    cancelarGas() {
      this.dialogGasEdit  = false;
      this.editadoGas     = Object.assign({}, this.defaultItemGas);
      this.editedIndexGas = -1;
    },


    guardarGas() {
      if (!this.$refs.form.validate()) {
        this.mensaje('¡Debe completar todos los datos!', this.temas.forms_titulo_bg, 1500) 
        return this.dialogGasEdit = true;
      }
      if (this.editedIndexGas > -1) { // esta modificando
        this.id = this.editadoGas.id;
        this.editarGasHTTP(this.editadoGas);
      } else {
        this.altaGasHTTP();
        this.mensaje('¡Alta Exitosa!', this.temas.forms_titulo_bg, 1500) 
      }
      this.cancelarGas();
    },


    cerrarGas(item) {
      this.dialogGas = false
    },


    cerrarFaltantes(item) {
      this.dialogFaltantes = false
    },


    cerrarGasEdit(item) {
      this.dialogGasEdit = false
    },


    calculoCuotas() {
      let observ = ''
      let cuota = this.editadoGas.cuota
      let cuotas = this.editadoGas.cuotas
      if ( Number(this.editadoGas.cuota)+Number(this.editadoGas.cuotas) > 0) {
        cuota  = '000'+cuota
        cuota  = cuota.slice(-3)
        cuotas = '000'+cuotas
        cuotas = cuotas.slice(-3)
        observ = 'CUOTA '+cuota+'/'+cuotas+' '
        observ += this.editadoGas.periodo.substr(0,4)
        //observ += this.editadoGas.periodo.substr(5,2)
      }
      this.editadoGas.observ = observ
    },


    procesarGastoHTTP(item) {
      let gravado     = 0
      let exento      = 0
      let iva         = 0
      let total       = item.total
      this.valores    = []
      this.articulos  = []
      this.pendientes = []
      let cpr         = ''
      let cpr_id      = 0
      if (item.fiscal==0) {
        if (item.cpr=='') {
          cpr = 'CIN-X'+' '+this.sucursalFiscal+'-'+'00000000'
        } else {
          cpr = item.cpr
        }
        cpr_id = 128
        exento = item.total
      } else {

        gravado = this.roundTo(total/1.21,2)
        iva = total - gravado
        
        if (item.cpr=='') {
          if (item.tercero.responsable_id == 1) {
            cpr = 'FAC-A'+' '+this.sucursalFiscal+'-'+'00000000'
            cpr_id = 1
          } else if (item.tercero.responsable_id == 6) {
            cpr = 'FAC-C'+' '+this.sucursalFiscal+'-'+'00000000'
            cpr_id = 14
          }
        } else {
          cpr = item.cpr
          if (item.cpr.substring(0,5)==='FAC-A') {
            cpr_id = 1
          } else if (item.cpr.substring(0,5)==='FAC-B') {
            cpr_id = 6
          } else if (item.cpr.substring(0,5)==='FAC-C') {
            cpr_id = 14
          }
        }
      }

      //item.periodo = item.periodo.substr(0,4)+item.periodo.substr(5,2)
      this.pendientes.push({ 
        comprobante_id: null,
        vencimiento:    moment().format('YYYY-MM-DD'),
        importe:        item.total,
        pendiente:      item.total,
        concepto:       'EN CUENTA CORRIENTE'
      })
       
      return HTTP().post('/compranueva', {
        fecha:               moment(item.vencimiento).format('YYYY-MM-DD'),
        perfiscal:           item.periodo,
        tipo:                'GS',
        cpr:                 cpr,
        user_id:             this.userId,
        sucursal_id:         this.sucursal,
        tercero_id:          item.tercero_id,
        comprobante_id:      cpr_id,
        direccion_id:        item.tercero.direccion_id,
        documento_id:        item.tercero.documento_id,
        mediodepago_id:      null,
        lista_id:            null,
        deposito_id:         null,
        vendedor_id:         null,
        moneda_id:           this.editado.moneda_id,
        tasadescuento:       0,
        importedescuento:    0,
        retiva:              0,
        retgan:              0,
        retib:               0,
        impint:              0,
        nogravado:           0,
        flete:               0,
        gravado:             gravado,
        exento:              exento,
        iva:                 iva,
        total:               total,
        poradcosto:          0,
        regstk:              0,
        estado:              'F',
        activo:              true,
        observaciones:       'GASTO '+item.observ,
        carga:               'I',
        articulos:           this.articulos,
        valores:             this.valores,
        pendientes:          this.pendientes,
        notificacion:        0,
        notificaEnBaseAOtro: 0,
        notificaOriginal:    0,
        gasto:               this.itemActualGasto,
        tasasIVA:            this.tasasIVA
      }).then(({ data }) => {
        this.listarGasHTTP();
        this.listarHTTP();
      });
    },


    //////////////////////
    // METODOS DE ITEMS //
    //////////////////////
    nuevoArt() {
      this.editedIndexArt = -1;
      this.dialogEditArt = true;
      this.uniItems = [];
      //this.busArt = this.busArtSave!='' ? this.busArtSave : ''
      this.busArt = ''
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.formTitleArt = 'Nuevo Item'
      this.seleccionarArticulo = false;
      //this.$refs.buscar.focus()
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },


    editarArt(item) {
      this.formTitleArt = 'Editar Item'
      this.seleccionarArticulo = false;
      this.editedIndexArt = this.articulos.indexOf(item)
      this.dialogEditArt = true
      this.busArt = this.articulos[this.articulos.indexOf(item)].codigo
      this.editadoArt = Object.assign({}, this.articulos[this.editedIndexArt] );
      this.buscarArt(true)
    },


    sumarRestar(item, cuanto) {
      this.editedIndexArt = this.articulos.indexOf(item)
      if (cuanto==-1 && this.articulos[this.editedIndexArt].cantidad==0) {
        return
      }
      let valor = Number(this.articulos[this.editedIndexArt].cantidad)
      valor += cuanto
      this.articulos[this.editedIndexArt].cantidad = valor
      if (this.editado.cpr.substring(0,3)=='PED') {
        this.articulos[this.editedIndexArt].total = this.articulos[this.editedIndexArt].precio*this.articulos[this.editedIndexArt].cantidad
      } else {
        this.articulos[this.editedIndexArt].total = this.articulos[this.editedIndexArt].costo*this.articulos[this.editedIndexArt].cantidad
      }
      this.calculosArt()
    },


    guardarArt(items) { // CONFIRMA EL GUARDADO EN LA BASE DE DATOS
      this.dialogArt = false;
      return HTTP().patch('/updateitems/'+this.items[this.editedIndex].id, { articulos: this.articulos }).then(({ data }) => {
        if (!data) {
          this.mensaje('¡Se ha producido un error en la grabación de los items!', this.temas.forms_titulo_bg, 1500)
        } else {
          this.mensaje('¡Items acutalizados correctamente!', this.temas.forms_titulo_bg, 1500)
        }
        this.listarHTTP();
      });
    },


    cancelarArt() {
      this.dialogArt = false;
      this.articulos = []
      this.editadoArt = Object.assign({}, this.defaultItemArt);
      this.editedIndexArt = -1;
    },


    cancelarEditArt() {
      this.dialogEditArt = false;
      this.editedIndexArt = -1;
    },


    calculosArt() {
      this.totalItems = 0
      for (let i=0; i<=this.articulos.length-1; i++) {

        let ctt = this.articulos[i].cantidad
        let costo = this.articulos[i].costo
        let decimales = this.articulos[i].decimales
        let precio = this.articulos[i].precio
        let tasdes = this.articulos[i].tasadescuento
        let impdes = (precio*(tasdes/100))
        precio = this.roundTo(precio,decimales)
        impdes = this.roundTo(impdes,decimales)

        if (this.editado.cpr.substring(0,3)=='PED') {
          this.totalItems += this.roundTo((precio-impdes)*ctt,decimales)

        } else {
          this.totalItems += this.roundTo((costo-impdes)*ctt,decimales)
        }
      }
      this.totalItems = this.roundTo(this.totalItems,2)
      this.diferencia = this.roundTo(this.totalCabecera - this.totalItems,2)
    },


    cargarArt(item) {
      this.isLoadingTerceros = true
      if (item.tercero.user==null) {
        this.proveedorVinculado = 0
      } else {
        this.proveedorVinculado = item.tercero.user.id          // ver que viene
      }
      if (this.itemActual.cpr.substring(0,3)=='PED') {
        this.headersArt[3].text  = 'Precio'
        this.headersArt[3].value = 'precio'
        } else {
        this.headersArt[3].text  = 'Costo'
        this.headersArt[3].value = 'costo'
      }

      this.editedIndex = this.items.indexOf(item)
      this.editado = this.items[this.items.indexOf(item)]
      this.totalCabecera = item.gravado+item.exento
      this.cpr = item.cpr
      this.dialogArt = true;
      this.articulos = [];
      this.editarItems = true

      // OJO, debo buscar el proveedor para sacar los precios, pero si es mayorista, el proveedor es el mismo
      let proveedor = item.tercero.user ? item.tercero.user.id : this.userId

      return HTTP().get('/comprasitems/'+item.id+'/'+proveedor).then(({ data }) => {
        this.totalItems = 0
        
        for (let i=0; i<=data.length-1; i++) {
          let max = 0
          let pos = this.$store.state.publicaciones.findIndex(x=>x.articulo_id == data[i].articulo_id)
          if (pos!=-1) {
            max = this.$store.state.publicaciones[pos].unidades
          }

          // el proveedor puede haber cambiado el precio
          // la consulta trae el preload de articulos y precios ( siempre actualizados )
          // por ello cuando edito el pedido cargo estos precios reemplazando los de la base de datos.
          let ctt       = data[i].cantidad

//        let costo     = data[i].articulo.precios[0].costo
//        let decimales = data[i].articulo.precios[0].decimales
//        let precio    = data[i].articulo.precios[0].precio

          let costo     = data[i].costo
          let decimales = data[i].articulo.precios[0].decimales
          let precio    = data[i].precio

          let tasdes    = data[i].tasadescuento
          let impdes    = (precio*(tasdes/100))
          let total     = 0
            
          precio = this.roundTo(precio,decimales)
          impdes = this.roundTo(impdes,decimales)
          if (this.itemActual.cpr.substring(0,3)=='PED') {
            total = this.roundTo((precio-impdes)*ctt,decimales)
          } else {
            total = this.roundTo((costo-impdes)*ctt,decimales)
          }
          impdes = this.roundTo(impdes*ctt,decimales)

          this.articulos.push({ 
            id:               data[i].id,
            comprobante_id:   data[i].comprobante_id,
            articulo_id:      data[i].articulo_id,
            codigo:           data[i].articulo.codigo,
            nombre:           data[i].articulo.nombre,
            deposito_id:      data[i].deposito_id,
            unidad_id:        data[i].unidad_id,
            moneda_id:        data[i].moneda_id,
            iva_id:           data[i].iva_id,
            ivatasa:          data[i].articulo.iva.nombre,
            cantidad:         Number(data[i].cantidad),
            stock:            Number(data[i].stock),
            costoanterior:    costo,
            costo:            costo,
            precio:           precio,
            preciooriginal:   precio,
            tasadescuento:    tasdes,
            importedescuento: impdes,
            total:            total,
            decimales:        decimales,
            texto:            data[i].texto,
            vencimiento:      '',
            padre_id:         data[i].padre_id,
            coeficiente:      data[i].coeficiente,
            esPromocion:      data[i].texto=='Promocion' ? true : false,
            cantidadMaxima:   max,
            cantidadCarrito:  max,
            estado:           'edit',
            undstock:         data[i].undstock,
            unidadesRegla:    [],
          })
          this.totalItems += total
        }

        // cargo las reglas del proveedor para con el usuario actual, solo si estas vinculado
        this.reglas = []
        let tagsDelTer = []
        if (this.itemActual.cpr.substring(0,3)=='PED' && this.itemActual.tercero.user!=undefined) {
          return HTTP().get('/leoelusertercero/'+this.itemActual.tercero.user.id+'/'+this.datosEmpresa.id).then(({ data }) => {
            if (data!=0) {
              return HTTP().post('/tercerotags', { userterceroid: data }).then(({ data }) => {
                for (let i=0; i<=data.length-1; i++) {
                  tagsDelTer.push(data[i].tag_id)
                }
                return HTTP().get('/reglas/'+this.itemActual.tercero.user.id+'/0').then(({ data }) => {
                  this.reglasDelTer = []
                  for (let i=0; i<=data.reglas.length-1; i++) {
                    if (data.reglas[i].activo) {
                      let tmpTer = data.reglas[i].tagster.split('|');
                      let tmpTerAp = []
                      for (let i=0; i<=tmpTer.length-1; i++) {
                        if (Number(tmpTer[i])!=0) {
                          tmpTerAp.push(Number(tmpTer[i]))
                        }
                      }
                      let hayOnda = tmpTerAp.filter( function (tag) {
                        return tagsDelTer.includes(tag)
                      });
                      if (hayOnda.length || tmpTerAp.length==0) { // length===0 TODOS LOS TERCEROS
                        let tmpPre = data.reglas[i].tagspre.split('|');
                        this.reglasDelTer.push({
                          user_id: this.itemActual.tercero.user.id,
                          descuento: data.reglas[i].descuento,
                          cttminima: data.reglas[i].cttminima,
                          unidades: data.reglas[i].unidades,
                          tagsPre: tmpPre
                        })
                      }
                    }
                  }
                  this.calculosArt()
                })
              })
            } else {
              this.calculosArt()
            }
          })
        } else {
          this.calculosArt()
        }
      })
    },


    buscarArt(estricto) {
      this.precioOrigen = 'Lista'
      this.precioDescuento = 0
      this.cttMinima = 0
      if (this.busArt == '') return
      let t = null
      if (this.editado.cpr.substr(0,3)!='PED') {
        if (this.editado.tercero.user != null) {
          t = this.editado.tercero.user.id
        }
      }
      let b = this.busArt
      let v  = []
      estricto = this.busArt.indexOf('@')!=-1 ? true : false

      if (this.editado.cpr.substr(0,3)=='PED') {
        v.push(this.editado.tercero.user.id)
      } else {
        if (this.proveedorVinculado==0) {
          v.push(this.userId)
        } else {
          v = this.$store.state.vinculosPadres
        }
      }
      let data1 = null
      debugger
      let proveedor = this.itemActual.tercero.user!=null ? this.itemActual.tercero.user.id : null
      return HTTP().post('/userarticulosfac', {search: b,vinculos:v,estricto:estricto,userex:proveedor }).then(({data})=>{
        debugger
        data1 = data
        if (data1.length===0) {
          this.mensaje('¡Codigo inexistente!', this.temas.forms_titulo_bg, 1000)
          this.$nextTick(() => {
            const f = this.$refs.buscar;
            f.focus();
          });
          return
        }
          
        // levanto los tags que el proveedor le asigno a este articulo
        this.unidadesRegla = []
        return HTTP().post('/buscolaregla', {
          artid: data1[0].id,
          userid: this.reglasDelTer.length ? this.reglasDelTer[0].user_id : null,
          reglas: this.reglasDelTer,
          creador: true }).then(({data}) => {
          this.unidadesRegla = data
          // INICIALIZO VALORES DE DESCUENTOS Y PRIMERA ASIGNACION. LUEGO CONTROLO X CANTIDAD
          if (data1.length==1) {
            let datos = {
              codigo: data1[0].codigo,
              articulo_id: data1[0].id,
              cantidad: 1,
              nombre: data1[0].nombre,
              codbar: data1[0].codbar,
              unidad_id: data1[0].unimedid,
              moneda_id: data1[0].monedaid,
              iva_id: data1[0].ivaid,
              monedaNombre: data1[0].simbolo,
              unidadNombre: data1[0].unimed,
              ivaNombre: data1[0].tasa+'%',
              costoanterior: this.roundTo(data1[0].costo, data1[0].decimales),
              costo: this.roundTo(data1[0].costo, data1[0].decimales),
              precio: this.roundTo(data1[0].precio, data1[0].decimales),
              preciooriginal: this.roundTo(data1[0].precio, data1[0].decimales),
              decimales: data1[0].decimales,
              tasadescuento: 0,
              importedescuento: 0,
              total: this.roundTo(data1[0].precio,data1[0].decimales),
              deposito_id: this.depItems[0].id,
              stock: data1[0].stock,
              undstock: data1[0].undstock,
              texto: '',
              pubprecioori: data1[0].pubprecioori,
              pubprecio: data1[0].pubprecio,
              pubtasdes: data1[0].pubtasdes,
              pubenvio: data1[0].pubenvio,
              pubunidades: data1[0].pubunidades,
              pubestado: data1[0].pubestado,
              unidadesRegla: this.unidadesRegla,
            }
            this.setItem('inicia', datos)

          } else if (data1.length>1) {

            this.selArt = []
            //this.busArtSave = this.busArt

            for (let i=0; i<=data1.length-1; i++) {

              // al costo tengo que restarle el poradcosto
              let costo = data1[i].costo
              if (this.editado.poradcosto>0) {
                costo = this.roundTo(( costo / (1+(this.editado.poradcosto/100)) ),4)
              }

              this.selArt.push({
                id:                data1[i].id,
                codigo:            data1[i].codigo,
                articulo_id:       data1[i].id,
                nombre:            data1[i].nombre,
                codbar:            data1[i].codbar,
                unidad_id:         data1[i].unimedid,
                moneda_id:         data1[i].monedaid,
                iva_id:            data1[i].ivaid,
                monedaNombre:      data1[i].simbolo,
                unidadNombre:      data1[i].unimed,
                ivaNombre:         data1[i].tasa+'%',
                costo:             costo,
                precio:            data1[i].precio,
                tasadesuento:      0,
                importedescuento:  0,
                deposito_id:       this.depItems[0].id,
                stock:             data1[i].stock == null ? 0 : data1[i].stock,
                undstock:          data1[i].undstock
              })
            }
            this.seleccionarArticulo = true;
            
          }
          this.cambioElPrecio = ''
          return HTTP().post('/cambioelprecio', { id: data1[0].id } )
          .then(({ data }) => {
            if (data>0) {
              this.cambioElPrecio = data
            }
          })
        })
      })
    },

    setItem(accion, dat) {
      // ESTE METODO SETEA Y ACTUALIZA EL ITEM.
      // INICIALIZO VALORES DE DESCUENTOS Y PRIMERA ASIGNACION. LUEGO CONTROLO X CANTIDAD
      debugger
      let descual = 'Lista'
      this.precioOrigen = 'Lista'
      this.unidadesRegla = dat.unidadesRegla
      this.cttminima = 1
      this.promoDescuento = dat.pubtasdes ? dat.pubtasdes : 0
      this.reglaDescuento = 0

      if (this.unidadesRegla.length>0) {
        // BUSCO EL DESCUENTO EN BASE A LAS UNIDADES
        this.descuentoEnBaseAUnidades() //// carga los valores this.reglaDescuento y this.cttMinima
        descual = this.reglaDescuento>0 ? 'Regla' : 'Lista' // si aplica Lista, Promo o Regla
        this.precioOrigen = descual
      }

      // QUE DESUENTO TOMO?, puede ser el de la regla o el de la promo, el que sea mayor
      if (dat.pubprecio && dat.pubestado!='U' && dat.pubunidades!=0 && this.reglaDescuento < this.promoDescuento && 
          this.editado.cpr.substring(0,3)=='PED') {
        descual = 'Promocion'
      }

      let pordes = 0
      if (descual=='Promocion') {
        pordes = this.promoDescuento
      } else if (descual=='Regla' || this.cttMinima==1) {
        pordes = this.reglaDescuento
      }

      let impdes = 0
      // al costo tengo que restarle el poradcosto
      let costo = this.roundTo(dat.precio, dat.decimales) // costo
      if (this.editado.poradcosto>0) {
        costo = this.roundTo(( costo / (1+(this.editado.poradcosto/100)) ),4)
      }

      if (accion=='inicia') {
        impdes = this.roundTo((dat.precio*dat.cantidad)*(pordes/100),dat.decimales)
        this.articulos = this.articulos.filter( x => x.codigo != dat.codigo)
        this.editadoArt.codigo           = dat.codigo;
        this.editadoArt.articulo_id      = dat.articulo_id;
        this.editadoArt.cantidad         = dat.cantidad;
        this.editadoArt.nombre           = dat.nombre;
        this.editadoArt.codbar           = dat.codbar;
        this.editadoArt.unidad_id        = dat.unidad_id
        this.editadoArt.moneda_id        = dat.moneda_id
        this.editadoArt.iva_id           = dat.iva_id
        this.editadoArt.monedaNombre     = dat.simbolo
        this.editadoArt.unidadNombre     = dat.unimed
        this.editadoArt.ivaNombre        = dat.ivaNombre
        this.editadoArt.costoanterior    = this.roundTo(dat.costoaterior, dat.decimales)
        this.editadoArt.costo            = this.roundTo(dat.costo, dat.decimales)
        this.editadoArt.precio           = this.roundTo(dat.precio, dat.decimales)
        this.editadoArt.preciooriginal   = this.roundTo(dat.preciooriginal, dat.decimales)
        this.editadoArt.decimales        = dat.decimales
        this.editadoArt.tasadescuento    = pordes
        this.editadoArt.importedescuento = impdes
        this.editadoArt.total            = this.roundTo((dat.precio*dat.cantidad)-impdes,dat.decimales)
        this.editadoArt.deposito_id      = this.depItems[0].id
        this.editadoArt.stock            = dat.stock
        this.editadoArt.undstock         = dat.undstock
        this.editadoArt.texto            = descual
        this.editadoArt.pubprecioori     = dat.pubprecioori
        this.editadoArt.pubprecio        = dat.pubprecio
        this.editadoArt.c        = dat.pubtasdes
        this.editadoArt.pubenvio         = dat.pubenvio
        this.editadoArt.pubunidades      = dat.pubunidades
        this.editadoArt.pubestado        = dat.pubestado
        this.editadoArt.unidadesRegla    = this.unidadesRegla

        // busco si aplica promocion para el articulo ingresado
        if (descual=='Promocion') {
          this.editadoArt.pubprecioori     = dat.pubprecio
          this.editadoArt.pubprecio        = dat.pubprecio
          this.editadoArt.pubtasdes        = dat.pubtasdes
          this.editadoArt.pubenvio         = dat.pubenvio
          this.editadoArt.pubunidades      = dat.pubunidades
          this.editadoArt.pubestado        = dat.pubestado
          this.editadoArt.importedescuento = impdes // this.roundTo(data1[0].costo-data1[0].pubprecio,2)
          this.editadoArt.tasadescuento    = dat.pubtasdes
          this.editadoArt.costo            = dat.pubprecio
          this.editadoArt.total            = dat.pubprecio
        }

        this.$refs.cantidad.focus()
        this.seleccionarArticulo = false

      } else if (accion=='guardar') {

        this.editadoArt.texto = descual
        this.editadoArt.tasadescuento = pordes

        // si el descuento viene distinto de cero es porque tomo una regla
        let ctt = Number(dat.cantidad)
        let pre = this.editado.cpr.substring(0,3)==='PED' ? Number(dat.precio) : Number(dat.costo)
        let txt = dat.texto

        // COMO TOMO LOS PRECIOS?
        // En 'texto' viene que precio leyo: 'Lista', 'Promocion' o 'Regla'
        // Puede ser una Compra normal o un pedido, compra normal tomo lista y reglas,
        // en pedidos tomo lista, reglas y promociones.
        // Como se cuando leyo una regla?, tasaDescuento!=0

        // OJO, SI ES PEDIDO HAGO CONTROL DE PROMOCIONES, SI ES FACTURA DE COMPRA CARGO NORMAL.
        if (this.editado.cpr.substring(0,3)==='PED') {
          if (txt=='Promocion') {
            if ((ctt > dat.pubunidades) && (dat.pubunidades!=0)) {
              this.actualizoItem(dat.pubunidades, pre, false)
              if (this.precioOrigen.substring(0,5)=='Regla' && ctt >= this.cttMinima) {
                dat.texto = 'Regla'
                this.actualizoItem(ctt-dat.pubunidades, pre, false)
              }
            } else {
              this.actualizoItem(ctt, pre, true)
            }
          } else {
            this.actualizoItem(ctt, pre, false)
          }
        } else {
          this.actualizoItem(ctt, pre, false)
        }

      }
    },

    guardarItem() {
      if (this.editadoArt.cantidad == 0) {
        this.$nextTick(() => {
          const f = this.$refs.cant;
          f.focus();
        });
        return 
      } else if (this.editadoArt.codigo == '') {
        this.$nextTick(() => {
          const f = this.$refs.buscar;
          f.focus();
        });
        return 
      }

      this.setItem('guardar', this.editadoArt)
      this.calculos()
      this.nuevoArt()
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },


    actualizoItem(ctt, pre, promo) {
      let pordes = 0
      let impdes = 0
      if (this.editadoArt.texto.substring(0,5)=='Regla') {
        for (let i=0; i<=this.unidadesRegla.length-1; i++) {
          if (ctt>=this.unidadesRegla[i].unidades) {
            pordes = this.unidadesRegla[i].descuento
            this.reglaDescuento = pordes
            this.editadoArt.texto = 'Regla'
          }
        }
      } else if (this.editadoArt.texto=='Promocion') {
        pordes = this.promoDescuento
      }

      if (this.editadoArt.texto.substring(0,5)=='Regla' && ctt>=this.cttMinima) {
        pordes = this.reglaDescuento
        this.editadoArt.texto = 'Regla'
      } else if (this.editadoArt.texto=='Promocion') {
        pordes = this.promoDescuento
      }
      impdes = (Number(ctt)*pre) * (pordes/100)
      this.articulos.unshift({
        id:               0,
        comprobante_id:   null,
        articulo_id:      this.editadoArt.articulo_id,
        codigo:           this.editadoArt.codigo,
        nombre:           this.editadoArt.nombre,
        deposito_id:      this.editadoArt.deposito_id,
        unidad_id:        this.editadoArt.unidad_id,
        moneda_id:        this.editadoArt.moneda_id,
        iva_id:           this.editadoArt.iva_id,
        ivatasa:          this.editadoArt.ivaNombre,
        cantidad:         Number(ctt),
        stock:            Number(ctt),
        costoanterior:    pre,
        costo:            pre, //this.editadoArt.costo,
        precio:           pre,
        preciooriginal:   this.editadoArt.preciooriginal,
        tasadescuento:    pordes,
        importedescuento: impdes,
        total:            (Number(ctt)*pre)-impdes,
        texto:            this.editadoArt.texto,
        vencimiento:      '',
        padre_id:         this.editadoArt.padre_id,
        coeficiente:      this.editadoArt.coeficiente,
        esPromocion:      promo,
        cantidadMaxima:   0,
        cantidadCarrito:  0,
        estado:           'new',
        undstock:         this.editadoArt.undstock,
      })
    },

    descuentoEnBaseAUnidades() {
      // Primero Ordeno por unidades
      this.unidadesRegla.sort((o1, o2) => {
        if (Number(o1.unidades)>Number(o2.unidades)) { return 1; }
        else if (Number(o1.unidades)<Number(o2.unidades)) { return -1; } 
        else { return 0; }
      })
      // carga los valores this.reglaDescuento y this.cttMinima
      for (let i=0; i<=this.unidadesRegla.length-1; i++) {
        if (this.editadoArt.cantidad>=this.unidadesRegla[i].unidades) {
          this.reglaDescuento = this.unidadesRegla[i].descuento
          this.cttMinima = this.unidadesRegla[0].unidades
        }
      }
    },

    sayCambioElPrecio() {
      this.msg.msgTitle = 'Cambio el Precio'
      let msg = 'Este artículo cambio de precio pero todavía no fue procesado.<br><br>'
      msg += 'Ingrese a la opción "Cambios de Precios" del menú "Artículos"<br>'
      msg += 'para procesar dicho cambio o continúe con el precio indicado.'
      this.msg.msgBody = msg
      this.msg.msgVisible = true
      this.msg.msgAccion = 'cambio el precio'
      this.msg.msgButtons = ['Aceptar']
    },

    selArtClick (item, row) {
      this.seleccionarArticulo = false;
      this.busArt = item.codigo
      this.buscarArt(true)
      this.$refs.cantidad.focus()
    },

    borrarItem(item) {
      this.busArt = ''
      let pos = this.articulos.indexOf(item)
      this.articulos.splice(pos,1);
      this.calculosArt()
    },

    borrarArt(item) {
      this.msg.msgTitle = 'Borrar Item'
      this.msg.msgBody = 'Desea borrar el item actual?'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item
    },

    buscoPrecio(idArt) {
      return HTTP().get('/precios/'+idArt+'/'+idLis)
        .then(({ data }) => {
          return data.precio
      })
    },

    cantidadItem() {
      // aca viene solo cuando es carga de compras, tomo el costo
      this.editadoArt.stock = Number(this.editadoArt.cantidad)
      this.editadoArt.undstock = Number(this.editadoArt.cantidad)*Number(this.editadoArt.undstock)
      this.editadoArt.importedescuento = (Number(this.editadoArt.cantidad)*(this.roundTo((Number(this.editadoArt.preciooriginal)-Number(this.editadoArt.costo)),2)))
      this.editadoArt.total = this.roundTo((Number(this.editadoArt.cantidad)*Number(this.editadoArt.costo)),2)
      return this.editadoArt.total
    },

    precioItem(cual) {
      let valor = cual=='costo' ? Number(this.editadoArt.costo) : Number(this.editadoArt.precio)
      this.editadoArt.stock = Number(this.editadoArt.cantidad)
      this.editadoArt.undstock = Number(this.editadoArt.cantidad)*Number(this.editadoArt.undstock)
      this.editadoArt.total = this.roundTo((Number(this.editadoArt.cantidad)*valor),2)
      return this.editadoArt.total
    },

    tasaDescuento() {
      let ctt = Number(this.editadoArt.cantidad)
      let pre = Number(this.editadoArt.costo)
      let tde = Number(this.editadoArt.tasadescuento)
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

    descuentoCabecera(cual) {
      if (cual=='tasa') {
        this.editado.importedescuento = this.roundTo(this.editado.gravado*(this.editado.tasadescuento/100),2)
      } else {
        this.editado.tasadescuento = this.roundTo((this.editado.importedescuento*100)/this.editado.gravado,2)
      }
    },

    importarDesde(donde) {
      this.importarDesdeFormato = donde
      this.dialogImportarDesde = true
    },


    cerrarImortarDesde() {
      this.dialogImportarDesde = false
    },


    cargarXls() {
      if (this.importarDesdeFormato=='Excel') {
        if (this.excel.name != undefined) {
          try {
            this.progress = true
            this.xlsCargado = true;
            let file = this.excel;
            let reader = new FileReader();
  
            this.codigos = []
            this.compraExcel = []
            reader.onload = async function (e) {
              let data = new Uint8Array(e.target.result);
              let workbook = XLSX.read(data, { type: "array" });
              let worksheet = workbook.Sheets[workbook.SheetNames[0]];
              let sheet = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
              let dataset = await this.parseFileContent(sheet);
            }.bind(this);
            reader.readAsArrayBuffer(file);
  
            return HTTP().post('compraexcelitems/', { items: this.compraExcel.items })
              .then(({ data }) => {
                if (data=='error') {
                } else {
  
                  return HTTP().post('compraexcelitems/', { items: this.compraExcel.items })
                  .then(({data}) => {
    
                    this.codigos = data
                    for (let i=0; i<=this.codigos.length-1; i++) {
                      this.compraExcel.items[i].micodigo = this.codigos[i].micodigo
                    }
                    this.progress = false
                  })
                }
              })
          } catch (exception) {
          }
        } else {
          this.xlsCargado = false;
        }

      } else if (this.importarDesdeFormato=='PDF') {

        if (this.excel.name != undefined) {
          try {
            this.progress = true
            this.xlsCargado = true;
            let doc = new jsPDF(this.excel)
            let content = doc.output()

            console.log(content)

          } catch (exception) {
          }
        }

      }

    },


    async parseFileContent(sheet) {
      let r = sheet[0]
      this.compraExcel.cuit       = sheet[0][1]
      this.compraExcel.fecha      = moment(sheet[1[1]]).format('YYYY/MM/DD')
      this.compraExcel.perfiscal  = sheet[2][1]
      this.compraExcel.tipcpr     = sheet[3][1]
      this.compraExcel.succpr     = sheet[4][1]
      this.compraExcel.nrocpr     = sheet[5][1]
      this.compraExcel.moneda     = sheet[6][1]
      this.compraExcel.totalitems = sheet[7][1]
      this.compraExcel.tasades    = sheet[8][1]
      this.compraExcel.impdes     = sheet[9][1]
      this.compraExcel.retiva     = sheet[10][1]
      this.compraExcel.retgan     = sheet[11][1]
      this.compraExcel.retib      = sheet[12][1]
      this.compraExcel.impint     = sheet[13][1]
      this.compraExcel.nogravado  = sheet[14][1]
      this.compraExcel.flete      = sheet[15][1]
      this.compraExcel.gravado    = sheet[16][1]
      this.compraExcel.exento     = sheet[17][1]
      this.compraExcel.iva        = sheet[18][1]
      this.compraExcel.total      = sheet[19][1]
      this.compraExcel.items      = []

      let lDone = true
      let i = 1
      while (lDone) {
        if (sheet[i][3]!=undefined) {
          this.compraExcel.items.push({
            codigo:   sheet[i][3],
            micodigo: sheet[i][3],
            nombre:   sheet[i][4],
            precio:   this.roundTo(sheet[i][5],2),
            tasdes:   this.roundTo(sheet[i][6],2),
            impdes:   this.roundTo(sheet[i][7],2),
            subtot:   this.roundTo(sheet[i][8],2),
            cantidad: this.roundTo(sheet[i][9],2),
            total:    this.roundTo(sheet[i][10],2),
            tasaIVA:  sheet[i][11]
          })
          i ++
        } else {
          lDone = false
        }
      }
    },


    //////////////////////////////
    // METODOS FUNCIONES VARIAS //
    //////////////////////////////
    roundTo(value, places){
     var power = Math.pow(10, places);
     return Math.round(value * power) / power;
    },


    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },


    getColorTotal (item) {
     return this.temas.barra_lateral_bg
    },


    getEstado (estado, accion, pend, carga, item) {
      let c = ''
      let e = ''
      let d = 0
      if (accion=='k') {
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
        } else if (estado==='F') {
          return this.temas.cen_estado_finalizado_dark
        } else if (estado==='A') {
          return this.temas.cen_estado_anulado_dark
        } else if (estado==='L') {
          return this.temas.cen_estado_pendiente_dark
        } else {
          return this.temas.cen_estado_pendiente_dark
        }
      }
      if (pend!==undefined && estado=='F') {
        let f1 = moment().format('YYYY-MM-DD')
        let f2 = moment(pend.vencimiento).format('YYYY-MM-DD')
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
        } else if (d<0) {
          e = 'A Vencer('+d+')'
          c = this.temas.cen_estado_avencer_bg
        }
      } else {
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
        } else if (estado==='I') {
          e = 'Retirado'
          c = this.temas.cen_estado_enviado_bg
        } else if (estado==='F') {
          e = 'Finalizado'
          c = this.temas.cen_estado_finalizado_bg
        } else if (estado==='V') {
          e = 'Enviado'
          c = this.temas.cen_estado_finalizado_bg
        } else if (estado==='A') {
          e = 'Anulado'
          c = this.temas.cen_estado_anulado_bg
        }
      }
      if (accion==='c') {
        return c
      } else {
        return e
      }
    },


    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },


    formatoFechaCorta(value) {
      return moment(String(value)).format('DD-MM-YY')
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


    msgRespuesta(op) {
      debugger
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='borrar item') {
          this.borrarItem(this.itemActual)
        } else if (this.msg.msgAccion=='borrar gasto') {
          this.borrarGasto(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS') {
          this.exportExcel() 
        } else if (this.msg.msgAccion=='Enviar Pedido') {
          this.enviarPedidoHTTP(this.itemActual) 
        } else if (this.msg.msgAccion=='finalizar comprobante') {
          this.finalizaCompra(this.itemActual) 
        } else if (this.msg.msgAccion=='Comprobante Finalizado') {
          this.listarHTTP()
        } else if (this.msg.msgAccion=='el comprobante ya existe') {
          this.$refs.afipNro.focus()
        } else if (this.msg.msgAccion=='pagar comprobante') {
          this.pagoHTTP(this.editado) 
        } else if (this.msg.msgAccion=='confirmar valores') {
          this.dialogPag = false
        } else if (this.msg.msgAccion=='procesar gasto') {
          this.procesarGastoHTTP(this.itemActualGasto) 
        } else if (this.msg.msgAccion=='proveedor vinculado') {
          this.$refs.proveedor.focus()
        } else if (this.msg.msgAccion=='borrar comprobante') {
          this.borrarHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='anular pago') {
          this.anularPagoHTTP()
        } else if (this.msg.msgAccion=='anular pedido') {
          this.anularPedidoHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='anular comprobante') {
          this.anularComprobanteHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='repetir pedido') {
          this.duplicarPedidoHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='arreglar pedido') {
          this.arreglarPedidoHTTP()
        }
      }
      this.msg.msgVisible = false;
    },


    fotoClick() {
      this.foto = this.foto.name == undefined ? this.foto.name : this.foto
    },


    importada(item) {
      return item.observaciones=='COMPRA IMPORTADA' ? true : false
    },


    estaElGastoOk() {
      this.gastoOk = true
      if (!this.editadoGas.tercero_id || !this.editadoGas.vencimiento || this.editadoGas.total<=0) {
        this.gastoOk = false
      }
    },


    calculoElGasto() {
      let p = this.editadoGas.iva_id.afipiva_id!=undefined ? this.editadoGas.iva_id.afipiva_id : this.editadoGas.iva_id
      let pos = this.tasasIVA.findIndex( x => x.afipiva_id == p)
      this.editadoGas.iva = this.roundTo(Number(this.editadoGas.gravado)*((this.tasasIVA[pos].tasa)/100),2)
      this.editadoGas.total = this.roundTo(Number(this.editadoGas.gravado) + Number(this.editadoGas.iva),2)
      this.estaElGastoOk()
    },


    cambioElVencimiento() {
      this.editadoGas.periodo = moment(this.editadoGas.vencimiento).format('YYYY-MM')
    },


    cancelaLinea() {
      this.nuevoArt()
      this.busArt = ''
      this.$nextTick(() => {
        const f = this.$refs.buscar;
        f.focus();
      });
    },


    mensaje(mensaje, color, tiempo, button) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },


    exportarAPDF() {
      this.msg.msgTitle = 'Exportar a PDF'
      this.msg.msgBody = 'Desea exportar los datos a PDF'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a PDF'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },


    exportarAXLS () {
      this.msg.msgTitle = 'Exportar a XLS'
      this.msg.msgBody = 'Desea exportar los datos a XLS'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a XLS'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },


    print(item) {
      this.$refs.impresion.comprasPrint(item, 'yo');
    },


    printDetalles(item) {
      this.$refs.impresion.comprasPrintDetalles(item);
    },
  },
};
</script>

<style scoped>
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
  .panel-font {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 110%;
  }
  .meses {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 95%;
  }
  .totales-font {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 135%;
    font-weight: bold;
  }
  .datos-font {
    font-family: Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 115%;
    font-weight: bold;
  }
  .noti-font {
    font-family: Verdana, Arial, Helvetica, sans-serif;
    font-size: 90%;
  }
  .mini-font {
    font-size: 75%;
  }
  .x1 {
    font-size: 95%;
    float:left;
  }
  .iva-font {
    font-size: 74%;
  }
  .readonly {
    background-color: yellowgreen
  } /*7614*/
</style> 