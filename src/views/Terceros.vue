<template>
  <v-layout align-start>
    <v-flex>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        dense
        class="elevation-1"
        :footer-props="footerProps"
        @click:row="clickRow">
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
            <template v-slot:extension>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_dark==true"
                    class="mr-2"
                    @click="nuevoTercero" v-on="on">
                    <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </template>
                <span>Nuevo</span>
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
                    :color="temas.forms_btn_pdf_bg"
                    :dark="temas.forms_btn_pdf_dark==true"
                    class="mr-2"
                    @click="exportarAPDF" v-on="on">
                    <v-icon>mdi-file-outline</v-icon>
                  </v-btn>
                </template>
                <span>Enviar a PDF</span>
              </v-tooltip>

              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    fab
                    :color="temas.forms_btn_add_bg"
                    :dark="temas.forms_btn_add_dark==true"
                    class="mr-2"
                    @click="agregarTerceros" v-on="on">
                    <v-icon>mdi-account-multiple-plus</v-icon>
                  </v-btn>
                </template>
                <span>Incluir {{tipoTerPlurales}}</span>
              </v-tooltip>

            </template>

            <v-toolbar-title class="body-1 white--text">
              {{ $store.state.formTercerosTitulo=='Equipo' ? 'Mi' : 'Mis'}}
              {{ $store.state.formTercerosTitulo }}
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer></v-spacer>

            <!-- Modal del diálogo para Alta y Edicion -->
            <v-dialog v-model="dialog" max-width="800px" :fullscreen="true" persistent>
              <template v-slot:activator="{ on }"></template>
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
                  <v-btn v-show="cuentaYaAsignada==false"
                    :color="temas.cen_btns_bg"
                    :dark="temas.cen_btns_dark==true"
                    class="ma-2 white--text" @click="guardar">Guardar
                  </v-btn>
                </v-toolbar>
                <!-- para el EDICION-->
                <v-form ref="form">
                  <v-card-text>
                    <v-container>
                      <v-row>
                        <v-col cols="1" sm="1" md="1">
                          <v-text-field
                            :color="temas.forms_titulo_bg"
                            v-model="editado.id"
                            disabled
                            label='id'>
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-select
                            label="Tipo de Documento"
                            autofocus
                            :disabled="!puedeEditar"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.documento_id"
                            :items="itemsDocumentos"
                            item-value="id"
                            item-text="nombre"
                            autocomplete>
                          </v-select>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            ref="cuit"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.cuit"
                            :disabled="!puedeEditar"
                            v-on:keydown.tab="buscoDocumento"
                            label="Número"
                            required
                            :rules="cuitRules"
                            :counter="11"
                            :maxlength="11">
                          </v-text-field>
                        </v-col>
                        <v-col cols="5" sm="5" md="5">
                          <v-text-field
                            ref="nombre"
                            :color="temas.forms_titulo_bg"
                            v-model="editado.nombre"
                            :disabled="!puedeEditar"
                            label="Apellidos y Nombres"
                            required
                            :rules="nombreRules"
                            :counter="50"
                            :maxlength="50"
                            v-on:keydown.tab="buscoNombre"
                            @keyup="escribiendoNombre">
                          </v-text-field>
                        </v-col>
                        <v-col cols="2" sm="2" md="2">
                          <v-text-field
                            :color="temas.forms_titulo_bg"
                            v-model="editado.creador.username"
                            disabled
                            label="Creador">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-tabs key="pri" background-color="white" :color="temas.forms_titulo_bg"
                        v-model="tabInicial">
                        <v-tab href="#general">
                          Datos Generales
                        </v-tab>
                        <v-tab-item value="general">
                          <v-row>
                            <v-col cols="6" sm="6" md="6">
                              <v-text-field
                                v-model="editado.razon_social"
                                :disabled="!puedeEditar"
                                :color="temas.forms_titulo_bg"
                                label="Razón Social"
                                required
                                :rules="razon_socialRules"
                                :counter="80"
                                :maxlength="80">
                              </v-text-field>
                            </v-col>
                            <v-col cols="6" sx="6" mx="6">
                              <v-select
                                label="Cond.Fiscal"
                                :color="temas.forms_titulo_bg"
                                v-model="editado.responsable_id"
                                :disabled="!puedeEditar"
                                :items="itemsResponsables"
                                item-value="id"
                                item-text="nombre"
                                autocomplete>
                              </v-select>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="6" sm="6" md="6">
                              <v-textarea
                                v-model="editado.observaciones"
                                :color="temas.forms_titulo_bg"
                                label="Observaciones"
                                auto-grow
                                outlined
                                rows="3"
                                row-height="25"
                                shaped>
                              </v-textarea>
                            </v-col>
                            <v-col cols="5" sm="5" v-if="tipoTer === 'Cliente'">
                              <v-combobox
                                outlined
                                v-model="tagsValue"
                                :color="temas.forms_titulo_bg"
                                :items="tagsItems"
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
                          <v-row v-show="cual!=3">
                            <v-col cols="4" sx="4" mx="4" class="body-2">
                              <v-switch
                                :disabled="tipoTer=='Proveedor' && $store.state.tipo=='MI'"
                                label="Trabaja en Cuenta Corriente"
                                v-model="editado.ctacte"
                                :color="temas.forms_titulo_bg">
                              </v-switch>
                            </v-col>
                            <v-col cols="2" sx="2" mx="2" class="body-2">
                              <v-text-field
                                :disabled="tipoTer=='Proveedor' && $store.state.tipo=='MI'"
                                v-model="editado.diasvenc"
                                :color="temas.forms_titulo_bg"
                                label="Días de Vencimiento">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sx="2" mx="2" class="body-2">
                              <v-text-field
                                :disabled="tipoTer=='Proveedor'"
                                v-model="editado.bonificacionmaxima"
                                :color="temas.forms_titulo_bg"
                                label="% de Bonificación Máxima">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sx="2" mx="2" class="body-2">
                              <v-text-field
                                :disabled="tipoTer=='Proveedor'"
                                v-model="editado.creditomaximo"
                                :color="temas.forms_titulo_bg"
                                label="Crédito Máximo">
                              </v-text-field>
                            </v-col>
                            <v-col cols="2" sx="2" mx="2" class="body-2">
                              <v-text-field
                                :disabled="tipoTer=='Proveedor'"
                                v-model="editado.maxdiaschq"
                                :color="temas.forms_titulo_bg"
                                label="Máx.d/días de cheq.en Pagos">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row v-show="cual==3">
                            <v-col cols="3" sx="3" mx="3" class="body-2">
                              <v-select
                                label="Area Laboral"
                                autofocus
                                :disabled="!puedeEditar"
                                :color="temas.forms_titulo_bg"
                                v-model="editado.area"
                                :items="areas"
                                item-value="id"
                                item-text="nombre"
                                autocomplete>
                              </v-select>
                            </v-col>
                            <v-col cols="2" sx="2" mx="2" class="body-2">
                              <v-text-field v-show="editado.area=='V'"
                                v-model="editado.comision"
                                :color="temas.forms_titulo_bg"
                                label="% de Comisión">
                              </v-text-field>
                            </v-col>
                          </v-row>
                        </v-tab-item>

                        <v-tab href="#direccion">
                          direcciones
                        </v-tab>
                        <v-tab-item value="direccion">

                          <v-data-table
                            :headers="headersDir"
                            :items="direcciones"
                            dense
                            class="elevation-3">
                            <template v-slot:top>
                              <v-toolbar flat color="white">
                                <v-dialog v-model="dialogDir" max-width="500px">

                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-show="puedeEditar"
                                      fab @click="nuevaDireccion"
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      x-small>
                                      <v-icon>mdi-18px mdi-plus</v-icon>
                                    </v-btn>
                                  </template>

                                  <v-card>
                                    <v-toolbar flat
                                      :color="temas.forms_titulo_bg"
                                      :dark="temas.forms_titulo_dark==true">
                                      <v-btn
                                        icon @click="cancelarDir"
                                        :color="temas.forms_close_bg"
                                        :dark="temas.forms_close_dark==true">
                                        <v-icon>mdi-arrow-left-circle</v-icon>
                                      </v-btn>
                                      <span class="text--right">
                                        {{ formTitleDir }}
                                      </span>
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        v-if="(editadoDir.direccion &&
                                               editadoDir.postal_id)"
                                        color="teal accent-4" class="ma-2 white--text"
                                        @click="guardarDir(editadoDir)">
                                        Guardar
                                      </v-btn>
                                    </v-toolbar>

                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-text-field
                                              v-model="editadoDir.direccion"
                                              :color="temas.forms_titulo_bg"
                                              label="Dirección"
                                              required>
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-autocomplete
                                              ref="postal"
                                              class="body-2"
                                              v-model="editadoDir.postal_id"
                                              :color="temas.forms_titulo_bg"
                                              :items="itemsPostales"
                                              :loading="isLoadingPostales"
                                              :search-input.sync="searchPostales"
                                              item-text="nombre"
                                              item-value="id"
                                              label="Ciudad"
                                              placeholder="Escriba para buscar"
                                              prepend-icon="mdi-database-search">
                                            </v-autocomplete>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="6" sm="6" md="6">
                                            <v-select
                                              v-show="tipoTer=='Cliente'"
                                              label="Zona"
                                              :color="temas.forms_titulo_bg"
                                              v-model="editadoDir.lazona.zona_id"
                                              :items="itemsZonas"
                                              item-value="id"
                                              item-text="nombre"
                                              clearable
                                              autocomplete>
                                            </v-select>
                                          </v-col>
                                        </v-row>
                                      </v-container>
                                    </v-card-text>
                                  </v-card>
                                </v-dialog>
                              </v-toolbar>
                            </template>
                            <template v-slot:item.postal.nombre="{ item }">
                              <span>
                                {{ item.postal.nombre }} - (
                                {{ item.postal.codigo}}) -
                                {{ item.postal.provincia.nombre}} -
                                {{ item.postal.provincia.pais.nombre}}
                              </span>
                            </template>
                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                :dark="item.activo
                                ?temas.forms_btn_activo_dark==true
                                :temas.forms_btn_inactivo_dark==true">
                                {{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-btn
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="item.activo
                                ?temas.forms_btn_activo_dark==true
                                :temas.forms_btn_inactivo_dark==true"
                                @click="editarDir(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.forms_btn_activar_bg"
                                :dark="temas.forms_btn_activar_dark==true"
                                @click="activarDesactivarDir(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>

                        </v-tab-item>

                        <!-- CONTACTOS -->
                        <v-tab href="#contacto">contactos</v-tab>
                        <v-tab-item value="contacto">
                          <v-data-table
                            :headers="headersCon"
                            :items="contactos"
                            dense
                            class="elevation-3">
                            <template v-slot:top>

                              <v-toolbar flat color="white">
                                <v-dialog v-model="dialogCon" max-width="600px">

                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-show="puedeEditar"
                                      fab @click="nuevoContacto"
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      x-small>
                                      <v-icon>mdi-18px mdi-plus</v-icon>
                                    </v-btn>
                                  </template>

                                  <v-card>
                                    <v-toolbar flat
                                      :color="temas.forms_titulo_bg"
                                      :dark="temas.forms_titulo_dark==true">
                                      <v-btn
                                        icon @click="cancelarCon"
                                        :color="temas.forms_close_bg"
                                        :dark="temas.forms_close_dark==true">
                                        <v-icon>mdi-arrow-left-circle</v-icon>
                                      </v-btn>
                                      <span class="text--right">
                                        {{ formTitleCon }}
                                      </span>
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        v-if="(editadoCon.tipo_id &&
                                               editadoCon.observaciones)"
                                        color="teal accent-4" class="ma-2 white--text"
                                        @click="guardarCon(editadoCon)">
                                        Guardar
                                      </v-btn>
                                    </v-toolbar>

                                    <v-card-text>
                                      <v-container>
                                        <v-select
                                          label="Tipo de Contacto"
                                          v-model="editadoCon.tipo_id"
                                          :color="temas.forms_titulo_bg"
                                          :items="contactosTipos"
                                          item-value="id"
                                          item-text="nombre"
                                          autocomplete>
                                        </v-select>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-text-field
                                              v-model="editadoCon.observaciones"
                                              label="Observaciones"
                                              :color="temas.forms_titulo_bg"
                                              required
                                              :counter="60"
                                              :maxlength="60">
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                      </v-container>
                                    </v-card-text>
                                  </v-card>
                                </v-dialog>
                              </v-toolbar>
                            </template>
                            <template v-slot:item.icono="{ item }">
                              <v-btn
                                class="mr-2" fab x-small>
                                <v-icon dark>{{item.icono}}</v-icon>
                              </v-btn>
                            </template>
                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                dark>{{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="item.activo
                                ?temas.forms_btn_activo_dark==true
                                :temas.forms_btn_inactivo_dark==true"
                                @click="editarCon(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="item.activo
                                ?temas.forms_btn_activo_dark==true
                                :temas.forms_btn_inactivo_dark==true"
                                @click="preguntoBorrarCon(item)">
                                <v-icon dark>mdi-delete</v-icon>
                              </v-btn>
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.forms_btn_activar_bg"
                                :dark="temas.forms_btn_activar_dark==true"
                                @click="activarDesactivarCon(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-tab-item>

                        <v-tab href="#cuentasbancarias">Cuentas Bancarias</v-tab>
                        <v-tab-item value="cuentasbancarias">
                          <v-data-table
                            :headers="headersCuentas"
                            :items="cuentas"
                            dense
                            class="elevation-3">
                            <template v-slot:top>
                              <v-toolbar flat color="white">

                                <!-- CUENTAS -->
                                <v-dialog v-model="dialogCuenta" max-width="500px">

                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-show="puedeEditar"
                                      fab @click="dialogCuenta = !dialogCuenta"
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      x-small>
                                      <v-icon>mdi-18px mdi-plus</v-icon>
                                    </v-btn>
                                  </template>

                                  <v-card>

                                    <v-toolbar flat
                                      :color="temas.forms_titulo_bg"
                                      :dark="temas.forms_titulo_dark==true">
                                      <v-btn
                                        icon @click="cancelarCuenta"
                                        :color="temas.forms_close_bg"
                                        :dark="temas.forms_close_dark==true">
                                        <v-icon>mdi-arrow-left-circle</v-icon>
                                      </v-btn>
                                      <span class="text--right">
                                        {{ formTitleCuenta }}
                                      </span>
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        v-if="(editadoCuenta.banco_id &&
                                               editadoCuenta.nombre &&
                                               editadoCuenta.cuenta &&
                                               editadoCuenta.cbu)"
                                        color="teal accent-4" class="ma-2 white--text"
                                        @click="guardarCuenta(editadoCuenta)">
                                        Guardar
                                      </v-btn>
                                    </v-toolbar>

                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-select
                                              ref="banco"
                                              label="Banco"
                                              v-model="editadoCuenta.banco_id"
                                              :color="temas.forms_titulo_bg"
                                              :items="itemsBancos" item-value="id"
                                              item-text="nombre"
                                              autocomplete
                                              return-object>
                                            </v-select>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="8" sm="8" md="8">
                                            <v-text-field
                                              v-model="editadoCuenta.nombre"
                                              :color="temas.forms_titulo_bg"
                                              label="Nombre de la Cuenta"
                                              required :counter="30" :maxlength="30">
                                            </v-text-field>
                                          </v-col>
                                          <v-col cols="4" sm="4" md="4">
                                            <v-text-field
                                              v-model="editadoCuenta.abrev"
                                              :color="temas.forms_titulo_bg"
                                              label="Descripción"
                                              required :counter="5" :maxlength="5">
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-text-field
                                              v-model="editadoCuenta.cuenta"
                                              :color="temas.forms_titulo_bg"
                                              label="Nro de Cuenta"
                                              required :counter="20" :maxlength="20">
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-text-field
                                              v-model="editadoCuenta.cbu"
                                              :color="temas.forms_titulo_bg"
                                              label="CBU"
                                              required :counter="30" :maxlength="30">
                                            </v-text-field>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-switch
                                              label="Cuenta para recibir depositos"
                                              v-model="editadoCuenta.predeterminada"
                                              :color="temas.forms_titulo_bg">
                                            </v-switch>
                                          </v-col>
                                        </v-row>

                                      </v-container>
                                    </v-card-text>

                                  </v-card>
                                </v-dialog>
                                <!-- CUENTAS -->

                                <!-- CHEQUERAS -->
                                <v-dialog v-model="dialogChequera" max-width="900px">
                                  <v-card>

                                    <v-toolbar flat
                                      :color="temas.forms_titulo_bg"
                                      :dark="temas.forms_titulo_dark==true">
                                      <v-btn
                                        icon @click="cerrarChequeras"
                                        :color="temas.forms_close_bg"
                                        :dark="temas.forms_close_dark==true">
                                        <v-icon>mdi-arrow-left-circle</v-icon>
                                      </v-btn>
                                      <span class="text--right">
                                        Chequeras de la cuenta:
                                        {{ editedIndexCuenta!=-1 ?
                                          cuentas[editedIndexCuenta].nombre : ''
                                        }}
                                      </span>
                                    </v-toolbar>

                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-data-table
                                              :headers="headersChequeras"
                                              :items="chequeras"
                                              dense
                                              class="elevation-3">
                                              <template v-slot:top>
                                                <v-toolbar flat color="white">
                                                  <v-dialog
                                                    v-model="dialogChequeraEdit" max-width="1050px">

                                                    <template v-slot:activator="{ on, attrs }">
                                                      <v-btn v-show="puedeEditar"
                                                        fab @click="nuevaChequera"
                                                        :color="temas.cen_btns_bg"
                                                        :dark="temas.cen_btns_dark==true"
                                                        x-small>
                                                        <v-icon>mdi-18px mdi-plus</v-icon>
                                                      </v-btn>
                                                    </template>
                                                    <v-card>

                                                      <v-toolbar flat
                                                        :color="temas.forms_titulo_bg"
                                                        :dark="temas.forms_titulo_dark==true">
                                                        <v-btn
                                                          icon @click="cancelarChequeraEdit"
                                                          :color="temas.forms_close_bg"
                                                          :dark="temas.forms_close_dark==true">
                                                          <v-icon>mdi-arrow-left-circle</v-icon>
                                                        </v-btn>
                                                        <span class="text--right">
                                                          {{ formTitleChequera }}
                                                        </span>
                                                        <v-spacer></v-spacer>
                                                        <v-btn
                                                          v-if="(editadoChequera.nombre &&
                                                                editadoChequera.primer_numero)"
                                                          color="teal accent-4"
                                                          class="ma-2 white--text"
                                                          @click=
                                                          "guardarChequera(editadoChequera)">
                                                          Guardar
                                                        </v-btn>
                                                      </v-toolbar>

                                                      <v-card-text>
                                                        <v-container>
                                                          <v-row>
                                                            <v-col cols="7" sm="7" md="7">
                                                              <v-text-field
                                                                v-model=
                                                                "editadoChequera.nombre"
                                                                label="Nombre"
                                                                dense required
                                                                autofocus
                                                                :color="forms_titulo_bg"
                                                                :counter="40" :maxlength="40"
                                                                :disabled="editedIndexChequera!=-1">
                                                              </v-text-field>
                                                            </v-col>
                                                            <v-col cols="3" sm="3" md="3">
                                                              <v-text-field
                                                                v-model=
                                                                "editadoChequera.primer_numero"
                                                                label="Nro Inicial"
                                                                :color="forms_titulo_bg"
                                                                dense required
                                                                :counter="9" :maxlength="9"
                                                                :disabled="editedIndexChequera!=-1">
                                                              </v-text-field>
                                                            </v-col>
                                                            <v-col cols="2" sm="2" md="2">
                                                              <v-text-field
                                                                v-model=
                                                                "cttcheques"
                                                                label="Cantidad"
                                                                :color="forms_titulo_bg"
                                                                dense required
                                                                :counter="8" :maxlength="8"
                                                                :disabled="editedIndexChequera!=-1">
                                                              </v-text-field>
                                                            </v-col>
                                                          </v-row>
                                                          <v-row>
                                                            <v-col cols="12" sm="12" md="12">
                                                              <v-data-table
                                                                :headers="headersCheques"
                                                                :items="loscheques"
                                                                :footer-props="footerPropsCheques"
                                                                dense
                                                                class="elevation-3">
                                                              </v-data-table>
                                                            </v-col>
                                                          </v-row>
                                                        </v-container>
                                                      </v-card-text>
                                                    </v-card>

                                                  </v-dialog>
                                                </v-toolbar>
                                              </template>
                                              <template v-slot:item.activo="{ item }">
                                                <v-chip
                                                  :color="getColor(item.activo)"
                                                  dark>{{item.activo?'Sí':'No'}}
                                                </v-chip>
                                              </template>
                                              <template v-slot:item.accion="{item}">
                                                <v-btn v-show="puedeEditar"
                                                  class="mr-2" fab x-small
                                                  :color="temas.cen_btns_bg"
                                                  :dark="item.activo
                                                  ?temas.forms_btn_activo_dark==true
                                                  :temas.forms_btn_inactivo_dark==true"
                                                  @click="editarChequera(item)">
                                                  <v-icon dark>mdi-pencil</v-icon>
                                                </v-btn>
                                                <v-btn v-show="puedeEditar"
                                                  class="mr-2" fab x-small color="white"
                                                  @click="activarDesactivarChequera(item)">
                                                  <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                                                </v-btn>
                                              </template>
                                            </v-data-table>

                                          </v-col>
                                        </v-row>

                                      </v-container>
                                    </v-card-text>

                                  </v-card>
                                </v-dialog>
                                <!-- FIN CHEQUERAS -->

                                <!-- TARJETAS -->
                                <v-dialog v-model="dialogTarjeta" max-width="900px">
                                  <v-card>

                                    <v-toolbar flat
                                      :color="temas.forms_titulo_bg"
                                      :dark="temas.forms_titulo_dark==true">
                                      <v-btn
                                        icon @click="cerrarTarjetas"
                                        :color="temas.forms_close_bg"
                                        :dark="temas.forms_close_dark==true">
                                        <v-icon>mdi-arrow-left-circle</v-icon>
                                      </v-btn>
                                      <span
                                        class="text--right">Tarjetas de la cuenta:
                                        {{ editedIndexCuenta!=-1 ?
                                          cuentas[editedIndexCuenta].nombre : ''
                                        }}
                                      </span>
                                      <v-spacer></v-spacer>
                                    </v-toolbar>

                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-data-table
                                              :headers="headersTarjetas"
                                              :items="tarjetas"
                                              dense
                                              class="elevation-3">
                                              <template v-slot:top>
                                                <v-toolbar flat color="white">
                                                  <v-dialog
                                                    v-model="dialogTarjetaEdit" max-width="500px">

                                                    <template v-slot:activator="{ on, attrs }">
                                                      <v-btn v-show="puedeEditar"
                                                        fab @click="nuevaTarjeta"
                                                        :color="temas.cen_btns_bg"
                                                        :dark="temas.cen_btns_dark==true"
                                                        x-small>
                                                        <v-icon>mdi-18px mdi-plus</v-icon>
                                                      </v-btn>
                                                    </template>

                                                    <v-card>

                                                      <v-toolbar flat
                                                        :color="temas.forms_titulo_bg"
                                                        :dark="temas.forms_titulo_dark==true">
                                                        <v-btn
                                                          icon @click="cancelarTarjetaEdit"
                                                          :color="temas.forms_close_bg"
                                                          :dark="temas.forms_close_dark==true">
                                                          <v-icon>mdi-arrow-left-circle</v-icon>
                                                        </v-btn>
                                                        <span class="text--right">
                                                          {{ formTitleTarjeta }}
                                                        </span>
                                                        <v-spacer></v-spacer>
                                                        <v-btn
                                                          v-if="(editadoTarjeta.tarjeta_id &&
                                                               editadoTarjeta.tarjeta_numero &&
                                                               editadoTarjeta.tarjeta_vencimiento)"
                                                          color="teal accent-4"
                                                          class="ma-2 white--text"
                                                          @click=
                                                          "guardarTarjeta(editadoTarjeta)">
                                                          Guardar
                                                        </v-btn>
                                                      </v-toolbar>

                                                      <v-card-text>
                                                        <v-container>
                                                          <v-row>
                                                            <v-col cols="12" sm="12" md="12">
                                                              <v-select
                                                                ref="tarjeta"
                                                                label="Tarjeta"
                                                                :color="forms_titulo_bg"
                                                                v-model="editadoTarjeta.tarjeta_id"
                                                                :items="itemsTarjetas"
                                                                item-value="id"
                                                                item-text="nombre"
                                                                autocomplete
                                                                return-object>
                                                              </v-select>
                                                            </v-col>
                                                          </v-row>
                                                          <v-row>
                                                            <v-col cols="7" sm="7" md="7">
                                                              <v-text-field
                                                                v-model=
                                                                "editadoTarjeta.tarjeta_numero"
                                                                label="Numero"
                                                                :color="forms_titulo_bg"
                                                                required>
                                                              </v-text-field>
                                                            </v-col>
                                                          </v-row>
                                                          <v-row>
                                                            <v-col cols="9" sm="9" md="9">
                                                              <v-text-field
                                                                type="month"
                                                                dense
                                                                v-model=
                                                                "editadoTarjeta.tarjeta_vencimiento"
                                                                :color="forms_titulo_bg"
                                                                label="Vencimiento">
                                                              </v-text-field>
                                                            </v-col>
                                                          </v-row>
                                                          <v-row>
                                                            <v-switch
                                                              label="Es tarjeta de Débito"
                                                              :color="forms_titulo_bg"
                                                              dense
                                                              v-model=
                                                              "editadoTarjeta.debito">
                                                            </v-switch>
                                                          </v-row>
                                                        </v-container>
                                                      </v-card-text>
<!--
                                                      <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn v-show="puedeEditar
                                                          && editedIndexTarjeta==-1"
                                                          :color="temas.cen_btns_bg"
                                                          :dark="temas.cen_btns_dark==true"
                                                          text
                                                          @click="cancelarTarjetaEdit">
                                                          Cancelar
                                                        </v-btn>
                                                        <v-btn v-show="puedeEditar
                                                          && editedIndexTarjeta==-1"
                                                          :color="temas.cen_btns_bg"
                                                          :dark="temas.cen_btns_dark==true"
                                                          text
                                                          @click="guardarTarjeta(editadoTarjeta)">
                                                          Guardar
                                                        </v-btn>
                                                        <v-btn v-show="puedeEditar
                                                          && editedIndexTarjeta!=-1"
                                                          :color="temas.cen_btns_bg"
                                                          :dark="temas.cen_btns_dark==true"
                                                          text
                                                          @click="cancelarTarjetaEdit">
                                                          Cerrar
                                                        </v-btn>
                                                      </v-card-actions>
-->
                                                    </v-card>
                                                  </v-dialog>
                                                </v-toolbar>
                                              </template>
                                              <template v-slot:item.activo="{ item }">
                                                <v-chip
                                                  :color="getColor(item.activo)"
                                                  dark>{{item.activo?'Sí':'No'}}
                                                </v-chip>
                                              </template>
                                              <template v-slot:item.debito="{ item }">
                                                <v-chip
                                                  dark>{{item.debito?'De débito':'De crédito'}}
                                                </v-chip>
                                              </template>
                                              <template v-slot:item.accion="{item}">
                                                <v-btn v-show="puedeEditar"
                                                  class="mr-2" fab x-small
                                                  :color="temas.cen_btns_bg"
                                                  :dark="temas.cen_btns_dark==true"
                                                  @click="editarTarjeta(item)">
                                                  <v-icon dark>mdi-pencil</v-icon>
                                                </v-btn>
                                                <v-btn v-show="puedeEditar"
                                                  class="mr-2" fab x-small color="white"
                                                  @click="activarDesactivarChequera(item)">
                                                  <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                                                </v-btn>
                                              </template>
                                            </v-data-table>
                                          </v-col>
                                        </v-row>

                                      </v-container>
                                    </v-card-text>
<!--
                                    <v-card-actions>
                                      <v-spacer></v-spacer>
                                      <v-btn
                                        :color="temas.cen_btns_bg"
                                        :dark="temas.cen_btns_dark==true"
                                        text @click="cerrarTarjetas">
                                        Cerrar
                                      </v-btn>
                                    </v-card-actions>
-->
                                  </v-card>
                                </v-dialog>
                                <!-- FIN TARJETAS -->

                              </v-toolbar>
                            </template>
                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                dark>{{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.predeterminada="{ item }">
                              <v-chip
                                :color="getColor(item.predeterminada)"
                                dark>{{item.predeterminada?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="editarCuenta(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="cargoChequeras(item)">
                                <v-icon dark>mdi-bank</v-icon>
                              </v-btn>
                              <v-btn
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="cargoTarjetas(item)">
                                <v-icon dark>mdi-credit-card</v-icon>
                              </v-btn>
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="preguntoBorrarCuenta(item)">
                                <v-icon dark>mdi-delete</v-icon>
                              </v-btn>
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small color="white"
                                @click="activarDesactivarCuenta(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>

                        </v-tab-item>

<!--
                        <v-tab href="#promociones" v-show="cual==1">
                          Promociones
                        </v-tab>
                        <v-tab-item value="promociones">

                          <v-data-table
                            :headers="headersPromo"
                            :items="promo"
                            dense
                            class="elevation-3">
                            <template v-slot:top>
                              <v-toolbar flat color="white">
                                <v-dialog v-model="dialogPromo" max-width="700px">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      fab @click="nuevaPromo"
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      x-small>
                                      <v-icon>mdi-18px mdi-plus</v-icon>
                                    </v-btn>
                                  </template>
                                  <v-card>
                                    <v-card-title>
                                      <span class="headline">{{ formTitlePromo }}</span>
                                    </v-card-title>
                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-select
                                              ref="promo"
                                              label="Promo"
                                              :color="temas.forms_titulo_bg"
                                              v-model="editadoPromo.user_promo_id"
                                              :items="itemsPromos" item-value="id"
                                              item-text="nombre"
                                              autocomplete
                                              return-object>
                                            </v-select>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="3" sm="3" md="3">
                                            <v-text-field
                                              v-model="editadoPromo.porrem"
                                              label="% de Remarcación"
                                              :color="temas.forms_titulo_bg"
                                              required>
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
                                        @click="cancelarPromo">
                                        Cancelar
                                      </v-btn>
                                      <v-btn
                                        :color="temas.cen_btns_bg"
                                        :dark="temas.cen_btns_dark==true"
                                        text
                                        @click="guardarPromo(editadoPromo)">
                                        Guardar
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </v-toolbar>
                            </template>
                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                :dark="item.activo
                                ?temas.forms_btn_activo_dark==true
                                :temas.forms_btn_inactivo_dark==true">
                                {{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-btn
                                class="mr-2" fab dark x-small color="cyan"
                                @click="editarPromo(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                class="mr-2" fab x-small color="white"
                                @click="activarDesactivarPromo(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-tab-item>
-->
                        <v-tab href="#mediosdepago" v-show="cual==1">
                          Medios de Pago ( en construcción )
                        </v-tab>
                        <v-tab-item value="mediosdepago">

                          <v-data-table
                            :headers="headersPromo"
                            :items="promo"
                            dense
                            class="elevation-3">
                            <template v-slot:top>
                              <v-toolbar flat color="white">
                                <v-dialog v-model="dialogPromo" max-width="700px">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn
                                      fab @click="nuevaPromo"
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      x-small>
                                      <v-icon>mdi-18px mdi-plus</v-icon>
                                    </v-btn>
                                  </template>
                                  <v-card>
                                    <v-card-title>
                                      <span class="headline">{{ formTitlePromo }}</span>
                                    </v-card-title>
                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-select
                                              ref="promo"
                                              label="Promo"
                                              :color="temas.forms_titulo_bg"
                                              v-model="editadoPromo.user_promo_id"
                                              :items="itemsPromos" item-value="id"
                                              item-text="nombre"
                                              autocomplete
                                              return-object>
                                            </v-select>
                                          </v-col>
                                        </v-row>
                                        <v-row>
                                          <v-col cols="3" sm="3" md="3">
                                            <v-text-field
                                              v-model="editadoPromo.porrem"
                                              label="% de Remarcación"
                                              :color="temas.forms_titulo_bg"
                                              required>
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
                                        @click="cancelarPromo">
                                        Cancelar
                                      </v-btn>
                                      <v-btn
                                        :color="temas.cen_btns_bg"
                                        :dark="temas.cen_btns_dark==true"
                                        text
                                        @click="guardarPromo(editadoPromo)">
                                        Guardar
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                              </v-toolbar>
                            </template>
                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                :dark="item.activo
                                ?temas.forms_btn_activo_dark==true
                                :temas.forms_btn_inactivo_dark==true">
                                {{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-btn
                                class="mr-2" fab dark x-small color="cyan"
                                @click="editarPromo(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn
                                class="mr-2" fab x-small color="white"
                                @click="activarDesactivarPromo(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-tab-item>

                        <!-- ESTE TAB SE ACTIVA SI ESTOY EN VENDEDORES Y NO ES INSERT -->
                        <v-tab href="#acceso" v-show="cual==3 && editedIndex!=-1">
                          Accesos
                        </v-tab>
                        <v-tab-item value="acceso">
                        </v-tab-item>

                        <v-tab-item value="acceso">
                          <v-row>
                            <v-col cols="4" sm="4" md="4" v-show="!terUser.username==null">
                              <v-btn
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                class="ma-2 white--text" @click="generaracceso()">
                                Generar Acceso al Sistema
                              </v-btn>
                            </v-col>
                            <v-col cols="4" sm="4" md="4" v-show="!terUser.username==null">
                              <v-btn
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                class="ma-2 white--text" @click="roles()">
                                Roles del Usuario
                              </v-btn>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="4" sm="4" md="4" v-show="dialogAcceso">
                              <v-text-field
                                ref="mail"
                                v-model="terUser.email"
                                v-on:keydown.tab="buscoMail"
                                label="Email"
                                placeholder="Email"
                                :counter="40"
                                :maxlength="40"
                                :rules="emailRules">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="4" sm="4" md="4" v-show="dialogAcceso">
<!--
                              <v-text-field
                                v-model="terUser.password"
                                :append-icon="show ? 'visibility' : 'visibility_off'"
                                :rules="[passRules.required, passRules.min]"
                                :type="show ? 'text' : 'password'"
                                label="Contraseña"
                                hint="Hasta 15 caracteres"
                                counter
                                required
                                clearable
                                :maxlength="15"
                                @click:append="show = !show">
                              </v-text-field>
-->
                              <v-text-field
                                v-model="terUser.password"
                                :append-icon="show ? 'visibility' : 'visibility_off'"
                                :type="show ? 'text' : 'password'"
                                label="Contraseña"
                                hint="Hasta 15 caracteres"
                                counter
                                required
                                clearable
                                :maxlength="15"
                                @click:append="show = !show">
                              </v-text-field>
                            </v-col>
                          </v-row>
                          <v-row>
                            <v-col cols="4" sm="4" md="4"
                              v-show=
                              "terUser.username==null &&
                              terUser.email!=null &&
                              terUser.password!=null">
                              <v-btn
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                class="ma-2 white--text" @click="guardaracceso()">
                                Guardar Acceso al Sistema
                              </v-btn>
                            </v-col>
                          </v-row>
                          <v-row justify="center" v-show="terUser.username!=null">
                            <v-col cols="12" sm="12" md="12">
                              <v-card max-width="1000"
                                style="height: 410px;"
                                v-scroll.self="onScroll"
                                :elevation=0
                                class="overflow-y-auto"
                                max-height="600">
                                <v-card-text>
                                  <v-treeview
                                    return-object
                                    item-key="id"
                                    hoverable activatable dense
                                    :color="temas.forms_titulo_bg"
                                    :item-color="temas.forms_titulo_bg"
                                    :items="opTree">
<!--
                                    <template slot="append" slot-scope="{ item }">

                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">

                                        <v-btn v-show="userId==1"
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

                                          <v-btn v-if="!edit" v-show="userId==1"
                                            class="mr-2" fab
                                            x-small
                                            :color="temas.cen_btns_bg"
                                            :dark="temas.cen_btns_dark==true"
                                            @click="delChild(item)" v-on="on">
                                            <v-icon>mdi-delete</v-icon>
                                          </v-btn>

                                        </template>
                                        <span>Borrar Grupo</span>
                                      </v-tooltip>

                                    </template>
-->
                                    <template slot="label" slot-scope="{ item }">

                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                          <v-btn
                                            class="mr-2" fab x-small
                                            :color="item.acceder ? temas.forms_titulo_bg :
                                            temas.forms_titulo_bg"
                                            :dark="item.acceder ? temas.forms_titulo_dark : false"
                                            @click="rol(item, 'acceder')">
                                            <v-icon dark>mdi-arrow-right-box</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Acceder</span>
                                      </v-tooltip>

                                      <v-tooltip bottom>
                                        <template v-slot:activator="{ on, attrs }">
                                          <v-btn
                                            v-show="item.tipo!='M'&&item.tipo!='I'&&item.tipo=='A'"
                                            class="mr-2" fab x-small
                                            :color="item.agregar ? temas.forms_titulo_bg :
                                            temas.forms_titulo_bg"
                                            :dark="item.agregar ? temas.forms_titulo_dark : false"
                                            @click="rol(item,'agregar')">
                                            <v-icon dark>mdi-plus</v-icon>
                                          </v-btn>
                                        </template>
                                        <span>Agregar</span>
                                      </v-tooltip>

                                      <v-btn
                                        v-show="item.tipo!='M' && item.tipo!='I' && item.tipo=='A'"
                                        class="mr-2" fab x-small
                                        :color="item.editar ? temas.forms_titulo_bg :
                                        temas.forms_titulo_bg"
                                        :dark="item.editar ? temas.forms_titulo_dark : false"
                                        @click="rol(item,'editar')">
                                        <v-icon dark>mdi-pencil</v-icon>
                                      </v-btn>
                                      <v-btn
                                        v-show="item.tipo!='M' && item.tipo!='I' && item.tipo=='A'"
                                        class="mr-2" fab x-small
                                        :color="item.desactivar ? temas.forms_titulo_bg :
                                        temas.forms_titulo_bg"
                                        :dark="item.desactivar ? temas.forms_titulo_dark : false"
                                        @click="rol(item,'desactivar')">
                                        <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                                      </v-btn>

                                      <span>
                                        {{item.nombre}}
                                      </span>

                                    </template>
                                  </v-treeview>
                                </v-card-text>
                              </v-card>
                            </v-col>
<!--
                            <v-col cols="3" sm="3" md="3">
                              <template v-slot:activator="{ on }"></template>
                              <v-card v-show="panel2">
                                <v-toolbar flat
                                  :color="temas.forms_titulo_bg"
                                  :dark="temas.forms_titulo_dark==true">
                                  <span class="headdline">{{ formTitle }}</span>
                                  <v-spacer></v-spacer>

                                  <v-btn
                                    class="mr-2" fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="grabar" v-on="on">
                                    <v-icon>mdi-content-save</v-icon>
                                  </v-btn>

                                  <v-btn
                                    class="mr-2" fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="cancelar">
                                    <v-icon>mdi-window-close</v-icon>
                                  </v-btn>

                                </v-toolbar>
                                <v-form ref="form">
                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                          <v-text-field
                                            :disabled="userId!=1"
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
                                          <v-switch v-show="userId==1"
                                            label="Activo"
                                            dense
                                            v-model="editado.activo"
                                            :color="temas.forms_titulo_bg">
                                          </v-switch>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                          <v-text-field v-show="userId!=1"
                                            v-model="editado.porrem"
                                            :color="temas.forms_titulo_bg"
                                            autofocus
                                            label="% de Remarcación"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                    </v-container>
                                  </v-card-text>
                                </v-form>
                              </v-card>
                            </v-col>
-->
                          </v-row>
                        </v-tab-item>

                        <!-- ESTE TAB SE ACTIVA SI ESTOY EN VENDEDORES Y NO ES INSERT -->
                        <v-tab href="#zonas" v-show="cual==3 && editedIndex!=-1">
                          Zonas
                        </v-tab>
                        <v-tab-item value="zonas">
                          <v-data-table
                            :headers="headersZonas"
                            :items="tercerosZonas"
                            dense
                            :single-expand="singleExpand"
                            :expanded.sync="expanded"
                            show-expand
                            class="elevation-3">
                            <template v-slot:top>
                              <v-toolbar flat color="white">

                                <!-- ZONAS -->
                                <v-dialog v-model="dialogZona" max-width="500px">
                                  <template v-slot:activator="{ on, attrs }">
                                    <v-btn v-show="puedeEditar"
                                      fab @click="dialogZona = !dialogZona"
                                      :color="temas.cen_btns_bg"
                                      :dark="temas.cen_btns_dark==true"
                                      x-small>
                                      <v-icon>mdi-18px mdi-plus</v-icon>
                                    </v-btn>
                                  </template>
                                  <v-card>
                                    <v-card-title>
                                      <span class="headline">{{ formTitleZona }}</span>
                                    </v-card-title>
                                    <v-card-text>
                                      <v-container>
                                        <v-row>
                                          <v-col cols="12" sm="12" md="12">
                                            <v-select
                                              ref="zona"
                                              label="Zona"
                                              v-model="editadoZona.zona_id"
                                              :color="temas.forms_titulo_bg"
                                              :items="itemsZonas" item-value="id"
                                              item-text="nombre"
                                              autocomplete
                                              return-object>
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
                                        text
                                        @click="cancelarZona">
                                        Cancelar
                                      </v-btn>
                                      <v-btn
                                        :color="temas.cen_btns_bg"
                                        :dark="temas.cen_btns_dark==true"
                                        text
                                        @click="guardarZona(editadoZona)">
                                        Guardar
                                      </v-btn>
                                    </v-card-actions>
                                  </v-card>
                                </v-dialog>
                                <!-- ZONAS -->

                              </v-toolbar>
                            </template>

                            <!-- EL EXPAND DE LAS CLIENTES DE CADA ZONA -->
                            <template v-slot:expanded-item="{ headers, item }">
                              <td :colspan="headers.length">
                                <v-data-table
                                  :headers="headersClieXZonas"
                                  :items="item.clientes"
                                  dense
                                  hide-default-footer>
                                  <template v-slot:item.usertercero.tercero.nombre="{ item }">
                                    <span disable dark> {{
                                      item.usertercero.tercero.nombre
                                    }}</span>
                                  </template>
                                  <template v-slot:item.tercerodireccion.direccion="{ item }">
                                    <span>
                                      {{ item.tercerodireccion.direccion }}
                                    </span>
                                  </template>
                                  <template v-slot:item.tercerodireccion.postal.nombre="{ item }">
                                    <span>
                                      {{ item.tercerodireccion.postal.nombre }} (
                                      {{ item.tercerodireccion.postal.codigo }}) -
                                      {{ item.tercerodireccion.postal.provincia.nombre}}
                                    </span>
                                  </template>
<!--
-->
                                </v-data-table>
                              </td>
                            </template>
                            <!-- FIN DEL EXPAND DE LOS CLIENTES POR CADA ZONA -->

                            <template v-slot:item.activo="{ item }">
                              <v-chip
                                :color="getColor(item.activo)"
                                dark>{{item.activo?'Sí':'No'}}
                              </v-chip>
                            </template>
                            <template v-slot:item.accion="{item}">
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="editarZona(item)">
                                <v-icon dark>mdi-pencil</v-icon>
                              </v-btn>
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="preguntoBorrarZona(item)">
                                <v-icon dark>mdi-delete</v-icon>
                              </v-btn>
                              <v-btn v-show="puedeEditar"
                                class="mr-2" fab x-small color="white"
                                @click="activarDesactivarCuenta(item)">
                                <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                              </v-btn>
                            </template>
                          </v-data-table>
                        </v-tab-item>
                      </v-tabs>
                    </v-container>
                  </v-card-text>
                </v-form>
              </v-card>
            </v-dialog>
          </v-toolbar>
          <v-row>
            <v-col cols="6" sm="6" class="pl-6">  <!-- Barra de búsqueda  -->
              <v-text-field
                v-model="search"
                append-icon="search"
                :color="temas.forms_titulo_bg"
                label="Buscar"
                single-line hide-details>
              </v-text-field>
            </v-col>
            <v-col cols="6" sm="6" class="pt-3 pr-5">
              <v-combobox
                v-model="tagsValue"
                :color="temas.forms_titulo_bg"
                :items="tagsItems"
                clearable
                @change="seleccionoTag()"
                label="Filtar por Tag">
              </v-combobox>

            </v-col>
          </v-row>
        </template>
        <template v-slot:item.tercero.nombre="{ item }">
          <span>{{ item.tercero.nombre}}</span>
          <v-badge v-if="item.tercero.user!=null"
            class="pt-1 pl-2"
            :content="item.tercero.user.externo ? 'x' : 'g'"
            :color="item.tercero.user.externo ? 'black' : temas.forms_btn_add_bg"
            :dark="temas.forms_btn_add_bg==true">
          </v-badge>
        </template>
        <template v-slot:item.ctacte="{ item }">
          <v-chip
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            {{item.ctacte?'Sí':'No'}}
          </v-chip>
        </template>
        <template v-slot:item.tercero.user.activo="{ item }">
          <v-chip
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            {{bloqueado(item)}}
          </v-chip>
        </template>
        <template v-slot:item.activo="{ item }">
          <v-chip
            :color="getColor(item.activo)"
            :dark="item.activo
            ?temas.forms_btn_activo_dark==true
            :temas.forms_btn_inactivo_dark==true">
            {{item.activo?'Sí':'No'}}
          </v-chip>
        </template>
        <template v-slot:item.area="{ item }">
          <v-chip
            :color="getColor(item.activo)"
            :dark="item.activo
            ?temas.forms_btn_activo_dark==true
            :temas.forms_btn_inactivo_dark==true">
            {{getArea(item.area)}}
          </v-chip>
        </template>

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
        </template>
      </v-data-table>

      <!-- INCLUSION DE TERCEROS -->
      <v-dialog v-model="dialogAgregarTerceros" max-width="900px" persistent>
        <template v-slot:activator="{}"></template>
        <v-card>
          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              icon @click="cerrarAsignarNuevosTerceros"
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>
            <span class="text--right">
              Incluir {{ tipoTerPlurales }}
            </span>
            <v-spacer></v-spacer>
            <v-spacer></v-spacer>
            <span class="text--right">
              <v-btn v-show="tercerosSeleccionados.length>0"
                :color="temas.cen_btns_bg"
                :dark="temas.cen_btns_dark==true"
                class="ma-2 white--text" @click="asignarNuevosTerceros">
                Confirmar {{ tipoTerPlurales }}
                <v-badge
                  :content='tercerosSeleccionados.length'
                  :color="temas.forms_btn_add_bg"
                  :dark="temas.forms_btn_add_bg==true">
                </v-badge>
              </v-btn>
            </span>
          </v-toolbar>

          <v-form ref="art">
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sx="12" mx="12">
                    <v-data-table
                      v-model="tercerosSeleccionados"
                      :headers="headersTerceros"
                      :search="searchNuevosClientes"
                      :items="terceros"
                      :single-select="false"
                      item-key="id"
                      show-select dense
                      class="elevation-1"
                      @toggle-select-all="selectAll">
                      <template v-slot:top>
                        <v-text-field class="pl-5 pt-5 pb-5"
                          v-model="searchNuevosClientes"
                          append-icon="search"
                          :color="temas.forms_titulo_bg"
                          label="Buscar"
                          clearable
                          single-line hide-details>
                        </v-text-field>
                      </template>
                    </v-data-table>
                  </v-col>
                </v-row>

              </v-container>
            </v-card-text>
          </v-form>
        </v-card>
      </v-dialog>
      <!-- ASIGNAR TERCEROS -->

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

/* https://medium.com/js-dojo/how-to-build-a-reusable-vuejs-modal-component-fc8d7f3b4735 */

/* eslint-disable */
import HTTP from '../http';
import { mapGetters, mapMutations, mapState } from 'vuex';
import router from '../router';
import moment from 'moment';
import SBar from './Forms/snackbar.vue';
import XLSX from 'xlsx'
import jsPDF from 'jspdf'
import Confirmacion from "./Forms/confirmacion.vue"
import Mail from "./Forms/mail.vue";

export default {
  components: {
    SBar,
    Confirmacion,
    Mail,
  },
  data: () => ({
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
    esUsuarioGohu: false,
    tercerosSeleccionados: [],
    cuentaYaAsignada: false,
    scrollInvoked: 0,
    show: false,
    opcion: '',
    opcion_id: '',
    opItems: [],
    opTree: [],
    modelo: 'usersclientes',
    cual: 1,
    tipoTer: '', // Cliente, Proveedor, Vendedor, Librador y que otros?
    tipoTerPlurales: '',
    reglas: [],
    reglasArmadas: [],
    terUser: {
      id: null,
      username: null,
      email: null,
      password: null,
    },
    tabInicial: 'pri',
    terceroAIncorporar: '',
    itemActual: null,
    cttcheques: 0,
    acciones: [],
    puedeEditar: true,
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    nombreRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 50) || 'Ingrese hasta 50 caracteres',
    ],      
    razon_socialRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 80) || 'Ingrese hasta 80 caracteres',
    ],
    cuitRules: [
      v => !!v || 'El cuit es requerido',
      v => (v && v.length <= 11) || 'Ingrese hasta 11 caracteres',
    ],
    searchPostales: '',       // para el cuadro de búsqueda de datatables
    searchBancos: '',         // para el cuadro de búsqueda de datatables
    searchPromos: '',         // para el cuadro de búsqueda de datatables
    loading: false,
    searchTag: '',
    terceroTipoSeleccionado: [],
    tercerosTipos: [],
    cuentas: [],
    contactos: [],
    contactosTipos: [],
    tagsItems: [],
    tagsValue: [],
    tagsObj: [],
    expanded: [],
    areas: [
      {id: 'A', nombre: 'Administrativo'}, 
      {id: 'V', nombre: 'Vendedor'},
      {id: 'L', nombre: 'Logistica'}],
    footerProps: {'items-per-page-options': [9, 12, 15, 100]},
    footerPropsCheques: {'items-per-page-options': [5]},
    search: '',         // para el cuadro de búsqueda de datatables  
    searchNuevosClientes: '',
    dialog: false,      // para que la ventana de dialogo o modal no aparezca automáticamente
    dialogDir: false,
    dialogCon: false,
    dialogPromo: false,
    dialogCuenta: false,
    dialogZona: false,
    dialogTarjeta: false,
    dialogTarjetaEdit: false,
    dialogChequera: false, 
    dialogChequeraEdit: false,
    dialogAcceso: false,
    dialogAgregarTerceros: false,
    singleExpand: false,
    items: [],
    itemsAll: [],
    promo: [],
    userPromos: [],
    chequeras: [],
    tarjetas: [],
    loscheques: [],
    terceros: [],
    headers: [
      { text: 'Código', value: 'id', width: 90, align: 'right', sortable: false },
      { text: 'Nombre', value:'tercero.nombre', width: 360},
      { text: 'Fiscal', value:'tercero.responsable.abrev', width: 90},
      { text: 'Doc', value:'tercero.documento.nombre', width: 160},
      { text: 'Nro', value:'tercero.cuit', width: 60},
      { text: 'CtaCte', value:'ctacte', width: 90},
      { text: 'Activo', value:'activo', width: 70},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersDir: [
      { text: 'DIRECCION', value:'direccion', width: 250},
      { text: 'CIUDAD', value:'postal.nombre', width: 450},
      { text: 'ACTIVO', value:'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersCon: [
      { text: 'ICONO', value:'icono'},
      { text: 'OBSERVACIONES', value:'observaciones'},
      { text: 'ACTIVO', value:'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersPromo: [
      { text: 'NOMBRE', value:'promo.nombre'},
      { text: '% REM', value:'porrem'},
      { text: 'ACTIVO', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersCuentas: [
      { text: 'BANCO', value:'banco.nombre', align: 'left', width: 250},
      { text: 'NOMBRE', value:'nombre', align: 'left', width: 150},
      { text: 'CUENTA', value:'cuenta'},
      { text: 'CBU', value:'cbu'},
      { text: 'PREDET.', value:'predeterminada'},
      { text: 'ACTIVO', value:'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersZonas: [
      { text: 'ZONA', value:'nombre', align: 'left', width: 350},
      { text: 'CLIENTES', value:'clientes.length', align: 'end'},
      { text: 'ACTIVO', value:'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersChequeras: [
      { text: 'NOMBRE', value:'nombre'},
      { text: 'PRIM.NUM', value: 'primer_numero'},
      { text: 'CTT.CHEQUES', value: 'loscheques.length'},
      { text: 'DISPONIBES', value: 'libres'},
      { text: 'ACTIVO', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersCheques: [
      { text: 'NUMERO', value: 'numero', align: 'right', width: 50},
      { text: 'COMPROBANTE', value:'comprobante.cpr', align: 'left', width: 120},
      { text: 'ENTREGADO A', value:'comprobante.tercero.nombre', align: 'left', width: 210},
      { text: 'ESTADO', value:'estado', align: 'left', width: 50},
      { text: 'OBSERV.', value:'observaciones', align: 'left', width: 100},
    ],
    headersTarjetas: [
      { text: 'TARJETA', value:'tarjeta.nombre'},
      { text: 'NUMERO', value:'tarjeta_numero'},
      { text: 'VENCIM', value:'tarjeta_vencimiento'},
      { text: 'DEBITO', value:'debito'},
      { text: 'ACTIVO', value:'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersTerceros: [
      { text: 'NOMBRE', value:'nombre', width: 320},
      { text: 'DOCUMENTO', value:'doc', width: 120},
    ],
    headersClieXZonas: [
      { text: 'ID', value:'usertercero.tercero.id', width: 50},
      { text: 'NOMBRE', value:'usertercero.tercero.nombre', width: 180},
      { text: 'DIRECCION', value:'tercerodireccion.direccion', width: 120},
      { text: 'CIUDAD', value:'tercerodireccion.postal.nombre', width: 240},
//      { text: 'ALTURA', value:'tercerodireccion.numero', width: 40},
    ],

    editedIndex: -1,
    editedIndexDir: -1,
    editedIndexCon: -1,
    editedIndexPromo: -1,
    editedIndexCuenta: -1,
    editedIndexChequera: -1,
    editedIndexTarjeta: -1,
    editedIndexZona: -1,
    direcciones: {
      id: null,
      direccion: null,
      postal_id: null,
      activo: null,
    },
    editadoDir: {
      id: null,
      direccion: null,
      postal_id: null,
      activo: null,
      lazona: { 
        id: null, 
        tercerodireccion_id: null,
        usertercero_id: null,
        zona_id: null,
        zonas: {
          id: null,
          nombre: null } },      
      activo: null,
    },
    defaultItemDir: {
      id: null,
      direccion: null,
      postal_id: null,
      activo: null,
      lazona: { 
        id: null, 
        tercerodireccion_id: null,
        usertercero_id: null,
        zona_id: null,
        zonas: {
          id: null,
          nombre: null } },      
      activo: null,
    },
    con: {
      tipo_id: null,
      icono: null,
      observaciones: null,
      activo: null,
    },
    editadoCon: {
      tipo_id: null,
      icono: null,
      observaciones: null,
      activo: null,
    },
    defaultItemCon: {
      tipo_id: null,
      icono: null,
      observaciones: null,
      activo: null,
    },
    editadoPromo: {
      activo: null,
      id: null,
      nombre: null,
      porrem: null,
      user_tercero_id: null,
      user_id: null,
    },
    defaultItemPromo: {
      activo: null,
      id: null,
      nombre: null,
      porrem: null,
      user_tercero_id: null,
      user_id: null,
    },    
    editadoCuenta: {
      id: null,
      tercero_id: null,
      banco_id: null,
      nombre: null,
      abrev: null,
      cuenta: null,
      cbu: null,
      predeterminada: null,
      activo: true,
    },
    defaultItemCuenta: {
      id: null,
      tercero_id: null,
      banco_id: null,
      nombre: null,
      abrev: null,
      cuenta: null,
      cbu: null,
      predeterminada: null,
      activo: true,
    },
    editadoChequera: {
      activo: true,
      cheques: 0,
      loscheques: [],
      id: null,
      nombre: null,
      primer_numero: null,
      tercerocuenta_id: null,
    },
    defaultChequera: {
      activo: true,
      cheques: 0,
      loscheques: [],
      id: null,
      nombre: null,
      primer_numero: null,
      tercerocuenta_id: null,
    },
    editadoTarjeta: {
      activo: true,
      id: null,
      tarjeta_id: null,
      tarjeta_numero: null,
      tarjeta_vencimiento: null,
      tercerocuenta_id: null,
    },
    defaultTarjeta: {
      activo: true,
      id: null,
      tarjeta_id: null,
      tarjeta_numero: null,
      tarjeta_vencimiento: null,
      tercerocuenta_id: null,
    },
    editado: {
      id: null,
      tercero_id: null,
      nombre: null,
      razon_social: null,
      responsable_id: 5,
      documento_id: 25,
      cuit: null,
      observaciones: null,
      ctacte: 0,
      diasvenc: 0,
      creditomaximo: 0,
      bonificacionmaxima: 0,
      maxdiaschq: 0,
      comision: 0,
      creador: { username: '' },
      activo: true,
      area: '',
      user: {
        id: null,
        username: null,
      },
      cuentas: [],
    },
    defaultItem: {
      id: null,
      nombre: null,
      razon_social: null,
      responsable_id: 5,
      documento_id: 25,
      cuit: null,
      observaciones: null,
      ctacte: false,
      diasvenc: 0,
      creditomaximo: 0,
      bonificacionmaxima: 0,
      maxdiaschq: 0,
      comision: 0,
      creador: { username: '' },
      activo: true,
      area: '',
      user: {
        id: null,
        username: null,
      },
      cuentas: [],
    },
    editadoZona: {
      id: null,
      nombre: null,
      activo: null,
    },
    defaultZona: {
      id: null,
      nombre: null,
      activo: null,
    },
    descriptionLimit: 60,
    entriesPostales: [],
    isLoadingPostales: false,

    itemsBancos: [],
    itemsTarjetas: [],
    itemsResponsables: [],
    itemsDocumentos: [],
    itemsPromos: [],
    itemsZonas: [],
    tercerosZonas: [],

    passRules: {
      required: value => !!value || 'Requerido',
      min: v => v.length >= 3 || 'Míninmo 3 caracters',
    },
    usernameRules: [
      v => !!v || 'El nopmbre es requerido',
      v => (v && v.length <= 40) || 'Hasta 40 caraceres',
    ],
    emailRules: [
      v => !!v || 'E-mail es requerido',
      v => /.+@.+\..+/.test(v) || 'E-mail debe ser válido',
    ],

  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId' ]),
    ...mapMutations(['alert','closeAlert','setTerceros','setDatosEmpresaCuentas']),
    ...mapState([
      'temas',
      'datosEmpresa',
      'tipo',
      'level',
      'sucursal',
      'sucursales',
      'operario',
      'operarioId',
      'operarioVendedor',
      'operarioTerceroId',
      ]),

    formTitle () {
      return this.editedIndex === -1 ? 'Nuevo '+this.tipoTer : 'Editar '+this.tipoTer;
    },
    formTitleDir () {
      return this.editedIndexDir === -1 ? 'Nueva Direccion' : 'Editar Dirección';
    },
    formTitleCon () {
      return this.editedIndexCon === -1 ? 'Nuevo Contacto' : 'Editar Contacto';
    },
    formTitlePromo () {
      return this.editedIndexPromo === -1 ? 'Asignar Promoción' : 'Editar Promoción';
    },
    formTitleCuenta () {
      return this.editedIndexCuenta === -1 ? 'Nueva Cuenta Bancaria' : 'Editar Cuenta Bancaria';
    },
    formTitleZona () {
      return this.editedIndexZona === -1 ? 'Nueva Zona' : 'Editar Zona';
    },
    formTitleChequera () {
      return this.editedIndexChequera === -1 ? 'Nueva Chequera' : 'Editar Chequera';
    },
    formTitleTarjeta () {
      return this.editedIndexTarjeta === -1 ? 'Nueva Tarjeta' : 'Editar Tarjeta';
    },
    itemsPostales () {
      return this.entriesPostales.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre+' ('+entry.codigo+') -'+entry.provincia.nombre
        return Object.assign({}, entry, { nombre })
        })
      },
  },
  watch: {
    // ESTE WATCH ES PARA RE-INICIALIZAR EL MISMO FORMULARIO YA CARGADO
    '$route.path': function(val, oldVal){
      this.init_component();
    },

//  '$store.state.sucursal' () {
//  },

    dialogDir (val) {
      val || this.cancelarDir();
    },
    dialogCon (val) {
      val || this.cancelarCon();
    },
    dialogPromo (val) {
      val || this.cancelarPromo();
    },
    dialogCuenta (val) {
      val || this.cancelarCuenta();
    },
    dialogZona (val) {
      val || this.cancelarZona();
    },
    dialogChequeraEdit (val) {
      val || this.cancelarChequeraEdit();
    },

    searchPostales (val) {
      if (this.isLoadingPostales) return
      this.isLoadingPostales = true
      if (val==null && this.editadoDir.postal_id!=null) {
        val = this.editadoDir.postal.nombre
      } else {
      }
      return HTTP().post('/postales', {bus: val})
        .then(({ data }) => {
          this.entriesPostales = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (this.isLoadingPostales = false))
    },
  },

  mounted () {
    if (!this.isLoggedIn) {
      return router.push('/login');
    } else {
      //cargo los tags disponibles
      return HTTP().get('/tercerostipos').then(({ data }) => {
        this.tercerosTipos = data;
        return HTTP().get('/contactostipos').then(({ data }) => {
          this.contactosTipos = data;
          return HTTP().get('/bancos').then(({ data }) => {
            this.itemsBancos = data
            return HTTP().get('/tarjetas').then(({ data }) => {
              this.itemsTarjetas = data
              return HTTP().get('/afipresponsables').then(({ data }) => {
                this.itemsResponsables = data;
                return HTTP().get('/afipdocumentos').then(({ data }) => {
                  this.itemsDocumentos = data;
                  return HTTP().get('/zonas').then(({ data }) => {
                    this.itemsZonas = data;
                    return HTTP().get('/tagsterceros').then(({ data }) => {
                      this.tagsItems = []
                      this.tagsValue = []
                      data.forEach(el => { this.tagsItems.push(el.nombre) });
                      data.forEach(el => { this.tagsObj.push(el)});
                    })
                  })
                })
              })
            })
          })
        })
      })
    }
  },

  created () {
    this.init_component()
    if (this.cual==3) {
      this.opcion_id = 0
      return HTTP().get('/opciones').then(({ data }) => {
        for (let i=0; i<=data.length-1; i++) {
          this.opItems.push ( {
            id:         data[i].id,
            nombre:     data[i].nombre,
            tipo:       data[i].tipo,
            activo:     data[i].activo,
            opcion_id:  data[i].opcion_id,
            acceder:    false,
            agregar:    false,
            editar:     false,
            desactivar: false,
            state:      false, 
          })
          if (this.opcion_id==0) {
            this.opcion_id = data[0].opcion_id
          }
        }
      })
    }
  },

  methods: {
    closeForm(){
      router.push('/')
    },

    onScroll () {
      this.scrollInvoked++
    },

    init_component() {
      this.headersDir = [
        { text: 'DIRECCION', value:'direccion', width: 250},
        { text: 'CIUDAD', value:'postal.nombre', width: 450},
        { text: 'ACTIVO', value:'activo'},
        { text: 'ACCIONES', value: 'accion', sortable: false },
      ]
      let a = this.$store.state.route.fullPath.substring(1,this.$store.state.route.fullPath.length)
      if (a==='usersclientes') {
        this.tipoTer = 'Cliente'
        this.tipoTerPlurales = 'Clientes'
        this.cual = 1
        this.headersDir = [
          { text: 'DIRECCION', value:'direccion', width: 250},
          { text: 'CIUDAD', value:'postal.nombre', width: 450},
          { text: 'ZONA', value:'lazona.zonas.nombre'},
          { text: 'ACTIVO', value:'activo'},
          { text: 'ACCIONES', value: 'accion', sortable: false },
        ]
      } else if (a==='usersproveedores') {
        this.tipoTer = 'Proveedor'
        this.tipoTerPlurales = 'Proveedores'
        this.cual = 2
      } else if (a==='usersequipo') {
        this.tipoTer = 'Equipo'
        this.tipoTerPlurales = 'Equipo'
        this.cual = 3
      } else if (a==='userstransportistas') {
        this.tipoTer = 'Transportista'
        this.tipoTerPlurales = 'Transportistas'
        this.cual = 4
      } else if (a==='userspuntosderetiros') {
        this.tipoTer = 'Puntos de Retiro'
        this.tipoTerPlurales = 'Puntos de Retiros'
        this.cual = 6
      } else if (a==='userstercerosgastos') {
        this.tipoTer = 'Terceros Gastos'
        this.tipoTerPlurales = 'Terceros Gastos'
        this.cual = 7
      }
      this.modelo = a;

      if (this.cual!=3) {
        this.headers = [
          { text: 'Código', value: 'id', width: 90, align: 'right', sortable: false },
          { text: 'Nombre', value:'tercero.nombre', width: 360},
          { text: 'Fiscal', value:'tercero.responsable.abrev', width: 90},
          { text: 'Doc', value:'tercero.documento.nombre', width: 160},
          { text: 'Nro', value:'tercero.cuit', width: 60},
          { text: 'CtaCte', value:'ctacte', width: 90},
          { text: 'Activo', value:'activo', width: 90},
        ]
        if (this.userId==1) {
          this.headers.push(
            { text: 'Bloqueado', value: 'tercero.user.activo', width: 110 }
          )
        }
        this.headers.push(
          { text: 'ACCIONES', value: 'accion', sortable: false }
        )
      } else {
        this.headers = [
          { text: 'Código', value: 'id', width: 90, align: 'right', sortable: false },
          { text: 'Nombre', value:'tercero.nombre', width: 360},
          { text: 'Fiscal', value:'tercero.responsable.abrev', width: 90},
          { text: 'Doc', value:'tercero.documento.nombre', width: 160},
          { text: 'Nro', value:'tercero.cuit', width: 60},
          { text: 'Area', value:'area', width: 90},
          { text: 'Activo', value:'activo', width: 70},
          { text: 'ACCIONES', value: 'accion', sortable: false },
        ]
      }
      this.listarHTTP();
    },

    clickRow(value) {
      if (value.tercero_id==2) {  // CONSUMIDOR FINAL, CUENTA GENERAL, NO SE MODIFICA
        return
      }
      this.itemActual = value
      this.puedeEditar = false
      if (this.itemActual.tercero.creador.id == this.userId) {
        this.puedeEditar = true
      }
      this.editar(this.itemActual)
    },

    setAcciones(item) {
      this.itemActual = item
      this.acciones = []
      this.puedeEditar = false
      // Puede editar cuando el usuario del tercero es = al usuario actual
      if (this.itemActual.tercero.creador.id == this.userId && this.itemActual.tercero.id!=2) {
        this.puedeEditar = true
      }
      if (this.itemActual.tercero.id!=2) {
        this.acciones.push({nombre: 'Editar', icon: 'mdi-pencil'})
        this.acciones.push({nombre: 'Desactivar', icon: 'mdi-checkbox-marked-outline'})
      }
      if (this.tipoTer === 'Cliente' && !this.itemActual.tercero.user && this.itemActual.tercero.id!=2) {
        this.acciones.push({nombre: 'Invitar a usar GOHU', icon: 'mdi-checkbox-marked-outline'})
      }
      this.acciones.push({nombre: 'Datos Fiscales', icon: 'mdi-television-guide'})
      if (this.tipoTer === 'Cliente' && this.userId==1) {
        if (moment(this.itemActual.tercero.user.vencimiento).format('YYYY-MM-DD')<moment().format('YYYY-MM-DD')) {
          this.acciones.push({nombre: 'Desbloquear Licencia', icon: 'mdi-thumb-up-outline'})
        } else {
          this.acciones.push({nombre: 'Bloquear Licencia', icon: 'mdi-thumb-down-outline'})
        }
      }
    },

    selAccion(item) {
      if (item.nombre=='Editar' || item.nombre=='Ver') {
        this.editar(this.itemActual)
      } else if (item.nombre=='Desactivar') {
        this.desactivarTercero(this.itemActual)
      } else if (item.nombre=='Invitar a usar GOHU') {
        this.invitar()
      } else if (item.nombre=='Datos Fiscales') {
        return HTTP().post('/datosfiscales/', { id: this.itemActual.tercero_id }).then(( data ) => {});
      } else if (item.nombre=='Bloquear Licencia') {
        this.bloquear(this.itemActual)
      } else if (item.nombre=='Desbloquear Licencia') {
        this.desbloquear(this.itemActual)
      }
    },

    generaracceso() {
      this.dialogAcceso = true
      this.$refs.mail.focus()
    },

    guardaracceso() {
      this.msg.msgTitle = 'Guardar Acceso'
      this.msg.msgBody = 'Confirma guardar el acceso para el vendedor '+this.editado.nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'guardar acceso'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    roles() {
    },

    cargoChequeras(item) {
      this.dialogChequera = true
      this.editedIndexCuenta = this.cuentas.indexOf(item);
      this.chequeras = [];
      let che = item.chequeras;
      let lib = 0
      for (let i=0; i<=che.length-1; i++) {
        lib = 0
        for (let j=0; j<=che[i].loscheques.length-1; j++) {
          if (che[i].loscheques[j].comprobante_id==null) {
            lib ++
          }
        }
        this.chequeras.push({
          activo:                che[i].activo,
          cheques:               che[i].cheques,
          loscheques:            che[i].loscheques,
          id:                    che[i].id,
          nombre:                che[i].nombre,
          primer_numero:         che[i].primer_numero,
          tercerocuenta_id:      che[i].tercerocuenta_id,
          libres:                lib
        })
      }
    },

    veoChequeras(item) {
      this.dialogChequera = true
      this.editedIndexChequera = this.chequeras.indexOf(item)
      this.chequeras = [];
      let che = item.chequeras;
      let lib = 0
      for (let i=0; i<=che.length-1; i++) {
        lib = 0
        for (let j=0; j<=che[i].loscheques.length-1; j++) {
          if (che[i].loscheques[j].comprobante_id==null) {
            lib ++
          }
        }
        this.chequeras.push({
          activo:                che[i].activo,
          cheques:               che[i].cheques,
          loscheques:            che[i].loscheques,
          id:                    che[i].id,
          nombre:                che[i].nombre,
          primer_numero:         che[i].primer_numero,
          tercerocuenta_id:      che[i].tercerocuenta_id,
          libres:                lib
        })
      }
    },

    cargoTarjetas(item) {
      this.dialogTarjeta = true
      this.editedIndexCuenta = this.cuentas.indexOf(item);
      this.tarjetas = item.tarjetas;
    },

    chequeraEdit(item) {
      this.dialogChequeraEdit = true
    },

    nuevoTercero() {
      this.tabInicial = 'pri';
      this.editedIndex = -1;
      this.editado = Object.assign({}, this.defaultItem);
      this.dialog = true;
      this.puedeEditar = true
      this.direcciones = [];
      this.con = [];
      this.cuentas = [];
      this.terceroTipoSeleccionado = []
    },

    nuevaDireccion() {
      this.dialogDir = true;
      //this.editadoDir = this.defaultItemDir;
      this.editadoDir = Object.assign({}, this.defaultItemDir);
    },

    nuevoContacto() {
      this.dialogCon = true;
      this.editadoCon = Object.assign({}, this.defaultItemCon);
    },

    nuevaPromo() {
      this.dialogPromo = true;
      this.editadoPromo = Object.assign({}, this.defaultItemPromo);
    },

    nuevaChequera() {
      this.editedIndexChequera = -1;
      this.dialogChequeraEdit = true;
      this.editadoChequera = Object.assign({}, this.defaultChequera);
      this.loscheques = []
    },

    nuevaTarjeta() {
      this.editedIndexTarjeta = -1;
      this.dialogTarjetaEdit = true;
      this.editadoTarjeta = Object.assign({}, this.defaultTarjeta);
      this.tarjetas = []
    },

    escribiendoNombre() {
      if (this.editedIndex===-1) {
        this.editado.razon_social = this.editado.nombre
      }
    },

    desactivarTercero(item) {
      HTTP().post('userterceropuededesactivar', {tercero_id: item.tercero_id}).then ((data) => {
        let m = ''
        if (data.data!=0) {
          this.msg.msgTitle = 'Error al Desactivar Cuenta'
          m = 'Esta cuenta posee un saldo de $'+this.formatoImporte(data.data)+' en Cuenta Corriente<br>'
          m += 'Debe cancelarlos para poder desactivarla<br>'
          this.msg.msgAccion = 'error al desactivar tercero'
          this.msg.msgButtons = ['Aceptar']
        } else if (data.data==0) {
          this.msg.msgTitle = 'Desactivar Cuenta'
          m = '¿Confirma desactivar a '+item.tercero.razon_social+'?<br><br>'
          m += 'Solo permanecerá invisible, y en cualquier momento podra volver a activarla'
          this.msg.msgAccion = 'desactivar tercero'
          this.msg.msgButtons = ['Aceptar','Cancelar']
        }
        this.msg.msgBody = m
        this.msg.msgVisible = true
      })
    },

    bloquear(item) {
      this.msg.msgTitle = 'Bloquear Cuenta'
      this.msg.msgAccion = 'bloquear cuenta'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.msg.msgBody = '¿Confirma bloquear a '+item.tercero.razon_social+'?<br><br>'
      this.msg.msgVisible = true
    },

    desbloquear(item) {
      this.msg.msgTitle = 'Desbloquear Cuenta'
      this.msg.msgAccion = 'desbloquear cuenta'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.msg.msgBody = '¿Confirma desbloquear a '+item.tercero.razon_social+'?<br><br>'
      this.msg.msgVisible = true
    },

    bloquearCuentaHTTP(item) {
      HTTP().post('bloqueardesbloquearcuenta', {user_id: item.tercero.user.id, bloquear: true})
        .then ((data) => {
          if (data.data=='error') {
            this.mensaje('¡Opps, se ha producido un error en el bloqueo de esta cuenta!', this.temas.forms_titulo_bg, 2500) 
          } else {
            this.mensaje('¡Cuenta bloqueada exitosamente!', this.temas.forms_titulo_bg, 1500) 
            this.listarHTTP()
          }
        }).catch((err)=>{
          this.mensaje('¡Opps, se ha producido un error en el bloqueo de esta cuenta!', this.temas.forms_titulo_bg, 2500) 
        })
    },

    desbloquearCuentaHTTP(item) {
      HTTP().post('bloqueardesbloquearcuenta', {user_id: item.tercero.user.id, bloquear: false})
        .then ((data) => {
          if (data.data=='error') {
            this.mensaje('¡Opps, se ha producido un error al desbloquear esta cuenta!', this.temas.forms_titulo_bg, 2500) 
          } else {
            this.mensaje('¡Cuenta desbloqueada exitosamente!', this.temas.forms_titulo_bg, 1500) 
            this.listarHTTP()
          }
        }).catch((err)=>{
          this.mensaje('¡Opps, se ha producido un error en desbloquear esta cuenta!', this.temas.forms_titulo_bg, 2500) 
        })
    },

    desactivarTerceroHTTP(item) {
      return HTTP().post('usertercero', {usertercero_id: item.id, tipo_id: this.cual}).then ((data) => {
        if (data.data=='error') {
          this.mensaje('¡Opps, se ha producido un error en el desactivacion de esta cuenta!', this.temas.forms_titulo_bg, 2500) 
        } else {
          this.mensaje('¡Cuenta desactivada exitosamente!', this.temas.forms_titulo_bg, 1500) 
          this.listarHTTP()
        }
      }).catch((err)=>{
        this.mensaje('¡Opps, se ha producido un error en el desactivacion de esta cuenta!', this.temas.forms_titulo_bg, 2500) 
      })
    },

    activarDesactivarCuenta(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },

    bloqueado(item) {
      let a = item.tercero.user.vencimiento.substring(0,10)
      let b = moment().format('YYYY-MM-DD')
      return a<b?'Sí':'No'
    },

    activarDesactivarPromo(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },

    activarDesactivarDir(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },

    activarDesactivarCon(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },

    activarDesactivarChequera(item) {
      const valor = item.activo ? 0 : 1;
      item.activo = valor
    },

    msgRespuesta(op) {
      if (op==='Aceptar' || op==='Incorporar') {
        if (this.msg.msgAccion=='borrar direccion') {
          this.borrarDireccion(this.itemActual)
        } else if (this.msg.msgAccion=='borrar contacto') {
          this.borrarContacto(this.itemActual)
        } else if (this.msg.msgAccion=='borrar zona') {
          this.borrarZona(this.itemActual)
        } else if (this.msg.msgAccion=='exportar a PDF') {
          alert('exportando a PDF...')
        } else if (this.msg.msgAccion=='exportar a XLS') {
          alert('exportando a XLS...')
        } else if (this.msg.msgAccion=='desactivar tercero') {
          this.desactivarTerceroHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='bloquear cuenta') {
          this.bloquearCuentaHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='desbloquear cuenta') { 
          this.desbloquearCuentaHTTP(this.itemActual)
        } else if (this.msg.msgAccion=='Incorporar cuenta') {

          let tip = ''
          if (this.tipoTer === 'Cliente') {
            tip = '1'
          } else if (this.tipoTer === 'Proveedor') {
            tip = '2'
          } else if (this.tipoTer === 'Equipo') {
            tip = '3'
          } else if (this.tipoTer === 'Transportista') {
            tip = '4'
          } else if (this.tipoTer === 'Puntos de Retiro') {
            tip = '6'
          } else if (this.tipoTer === 'Terceros Gastos') {
            tip = '7'
          }

          // REALIZA LA INCORPORACION
          return HTTP().post('/terceroincorporar', {
            user_id: this.userId,
            tercero_id: this.terceroAIncorporar,
            tipo_id: tip
            }).then(({ data }) => {
              this.msg.msgVisible = false;
              this.cancelar();
              this.listarHTTP();
            });
        } else if (this.msg.msgAccion=='guardar acceso') {
          this.guardarAccesoHTTP(this.itemActual)
        }

      } else if (op==='Cancelar') {
        if (this.msg.msgAccion=='incorporar cuenta') {
          this.cancelar();
        }
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

    getArea (area) {
      if (area==='V') {
        return 'Vendedor'
      } else if (area==='A') {
        return 'Adminisración'
      } else if (area==='L') {
        return 'Logística'
      }
    },

    buscoNombre(event) {
      const nom = event.target.value
      return HTTP().get(`/${this.modelo}/exists/${nom}`)
        .then(({ data }) => {
          if(data.length>0) {
            this.mensaje('¡El nombre ingresado ya existe.!', this.temas.forms_titulo_bg, 1500) 
            this.$refs.nombre.focus()
          }
      });
    },

    listarHTTP() {
      return HTTP().get(this.modelo+'/false/'+this.cual+'/'+this.operarioVendedor+'/'+this.operarioTerceroId+'/'+this.operarioId)
        .then(({ data }) => {
          this.items = data;
          this.itemsAll = data;
      });
    },

    seleccionoTag() {
      if (this.tagsValue==undefined) {
        this.items = this.itemsAll
      } else {
        this.items = []
        for (let i=0; i<=this.itemsAll.length-1; i++) {
          let pos = this.itemsAll[i].tags.findIndex(x => x.nombre == this.tagsValue)
          if (pos!=-1) {
            this.items.push(this.itemsAll[i])
          }
        }
      }
    },

    altaHTTP() {
      let tipo = 0
      if (     this.tipoTer === 'Cliente')          { tipo = 1 }
      else if (this.tipoTer === 'Proveedor')        { tipo = 2 }
      else if (this.tipoTer === 'Equipo')           { tipo = 3 }
      else if (this.tipoTer === 'Transportista')    { tipo = 4 }
      else if (this.tipoTer === 'Puntos de Retiro') { tipo = 6 }
      else if (this.tipoTer === 'Terceros Gastos')  { tipo = 7 }

      return HTTP().post('/'+this.modelo, {
        nombre: this.editado.nombre,
        razon_social: this.editado.razon_social,
        responsable_id: this.editado.responsable_id,
        documento_id: this.editado.documento_id,
        cuit: this.editado.cuit,
        observaciones: this.editado.observaciones,
        ctacte: this.editado.ctacte,
        diasvenc: this.editado.diasvenc,
        bonificacionmaxima: this.editado.bonificacionmaxima,
        creditomaximo: this.editado.creditomaximo,
        maxdiaschq: this.editado.maxdiaschq,
        comision: this.editado.comision,
        creador_id: this.userId,
        activo: true,
        tipo: tipo,
        area: this.editado.area,
        direcciones: this.direcciones,
        contactos: this.contactos,
        cuentas: this.cuentas,
        tags: this.editado.tags,
        }).then(({ data }) => {
          // vuelvo a cargar los tags por si agrego alguno
          return HTTP().get('/tagsterceros').then(({ data }) => {
            this.tagsItems = []
            this.tagsValue = []
            data.forEach(el => { this.tagsItems.push(el.nombre) });
            data.forEach(el => { this.tagsObj.push(el)});
            this.listarHTTP();
          })

        });
    },

    editarHTTP:function(data) {
      // actualizo datosEmpresa.cuentas, por si agrego alguna cuenta y se tenga que reflejar en pagos.
      this.$store.commit('setDatosEmpresaCuentas'  , data.cuentas, { root: true} )
      return HTTP().patch(`${this.modelo}/${data.tercero_id}`, data).then(( data ) => {
        this.mensaje('¡Actualización Exitosa!', this.temas.forms_titulo_bg, 1500) 
        // vuelvo a cargar los tags por si agrego alguno
        return HTTP().get('/tagsterceros').then(({ data }) => {
          this.tagsItems = []
          this.tagsValue = []
          data.forEach(el => { this.tagsItems.push(el.nombre) });
          data.forEach(el => { this.tagsObj.push(el)});
          this.listarHTTP();
        })
      });
    },

    borrarHTTP:function(id) {
      return HTTP().delete(`/${this.modelo}/${id}`).then(() => {
        this.listarHTTP();
      });
    },

    guardarAccesoHTTP() {
      return HTTP().post('/guardaraccesovendedor', {
        username: this.editado.nombre,
        email: this.terUser.email,
        password: this.terUser.password,
        tercero_id: this.editado.id,
        user_id: this.userId,
        level: 3,
        tipo: this.tipo,
        activo: 1,
        sucursales: this.sucursales,
        }).then(({ data }) => {
          this.dialogAcceso = false
          this.terUser.id = null
          this.terUser.username = this.editado.nombre
          this.terUser.email = this.terUser.email
          this.terUser.password = null
        });
    },

    editar (item) {
      return HTTP().get('/reglas/'+this.userId+'/0').then(({ data }) => {
        debugger
        this.reglas = data.reglas;
        this.reglasArmadas = data.reglasArmadas;
        this.editedIndex = this.items.indexOf(item);    // si this.editIndex es = -1 es una alta.
        this.editado.id = item.id
        this.editado.tercero_id = item.tercero_id
        this.editado.nombre = item.tercero.nombre
        this.editado.razon_social = item.tercero.razon_social
        this.editado.responsable_id = item.tercero.responsable_id
        this.editado.documento_id = item.tercero.documento_id
        this.editado.cuit = item.tercero.cuit
        this.editado.observaciones = item.observaciones
        this.editado.ctacte = item.ctacte
        this.editado.diasvenc = item.diasvenc
        this.editado.creditomaximo = item.creditomaximo
        this.editado.bonificacionmaxima = item.bonificacionmaxima
        this.editado.maxdiaschq = item.maxdiaschq,
        this.editado.comision = item.comision
        this.editado.creador.username = ''
        this.editado.activo = item.activo
        this.editado.area = item.area

        this.tagsValue = []
        item.tags.forEach(el => { this.tagsValue.push(el.nombre) });

        if(item.tercero.user) {
          this.editado.user.id = item.tercero.user.id
          this.editado.user.username = item.tercero.user.username
        }
      
        this.esUsuarioGohu = item.tercero.user ? true : false
        this.tercerosZonas = []
        for (let i=0; i<=item.zonas.length-1; i++) {
          this.tercerosZonas.push({
            id:             item.zonas[i].id,
            usertercero_id: item.zonas[i].usertercero_id,
            zona_id:        item.zonas[i].zona.id,
            nombre:         item.zonas[i].zona.nombre,
            activo:         item.zonas[i].activo,
            clientes:       item.zonas[i].clientes,
          })
        }

        this.usertereroid = item.id
        this.dialog = true

        this.terceroTipoSeleccionado = item.terceroTipos
        this.cuentas = item.tercero.cuentas

        this.terUser.id       = null
        this.terUser.username = null
        this.terUser.email    = null
        this.terUser.password = null
        if (item.tercero.user) {
          this.terUser.id       = item.tercero.user.id
          this.terUser.username = item.tercero.user.username
          this.terUser.email    = item.tercero.user.email
          this.terUser.password = item.tercero.user.password
        }

        this.lis = item.terceroListas;
        return HTTP().get('/direcciones/'+this.editado.tercero_id+'/'+item.id).then(({ data }) => {
          this.direcciones = data;
          debugger
          return HTTP().get('/contactos/'+this.editado.tercero_id).then(({ data }) => {
            debugger
            this.contactos = [];
            for(let i=0; i<=data.length-1; i++) {
              this.contactos.push({
                tipo_id: data[i].contacto_tipo_id, 
                observaciones: data[i].observaciones,
                icono: data[i].contactoTipo.icono,
                activo: data[i].activo
              })
            }
            if (this.cual==3 && this.editado.user!=null) {
              return HTTP().post('/roles',{user: this.editado.user.id,sucursal: this.sucursal}).then(({ data }) => {
                for (let j=0; j<=this.opItems.length-1; j++) {
                  this.opItems[j].acceder = false
                  this.opItems[j].agregar = false
                  this.opItems[j].editar = false
                  this.opItems[j].desactivar = false
                }
                for (let i=0; i<=data.length-1; i++) {
                  for (let j=0; j<=this.opItems.length-1; j++) {
                    if (data[i].opcion_id == this.opItems[j].id) {
                      this.opItems[j].acceder = data[i].acceder
                      this.opItems[j].agregar = data[i].agregar
                      this.opItems[j].editar = data[i].editar
                      this.opItems[j].desactivar = data[i].desactivar
                      break
                    }
                  }
                }
                this.fetchOpciones()
              })
            }
          })
        });
      })
    },

    editarDir (item) {
      /*
      this.editadoDir = Object.assign({}, item);
      if (item.zona) {
        for (let i=0; i<=item.zona.length-1; i++) {
          if (item.zona[i].usertercero_id == this.itemActual.id) {
            this.editadoDir.zona_id = item.zona[i].zona_id
          }
        }
      } else {
        let z = { id:null,tercerodireccion_id:null,usertercero_id:null,zona_id:null,zonas:{id:null,nombre:null}}
        this.editadoDir.zona = z
      }
      this.editedIndexDir = this.direcciones.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogDir = true;
      */
      this.editadoDir = Object.assign({}, item);
      if (item.lazona) {
        this.editadoDir.lazona.zona_id = item.lazona.zona_id
      } else {
        this.editadoDir.lazona = {
          id:null,tercerodireccion_id:null,usertercero_id:null,zona_id:null,zonas:{id:null,nombre:null}
        }
      }
      this.editedIndexDir = this.direcciones.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogDir = true;
    },

    editarCon (item) {
      this.editadoCon = Object.assign({}, item);
      this.editedIndexCon = this.contactos.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogCon = true;
    },

    editarPromo (item) {
      this.editadoPromo = Object.assign({}, item);
      this.editedIndexPromo = this.lis.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogPromo = true;
    },

    editarCuenta (item) {
      this.editadoCuenta = Object.assign({}, item);
      this.editedIndexCuenta = this.cuentas.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogCuenta = true;
    },

    editarZona (item) {
      this.editadoZona = Object.assign({}, item);
      this.editedIndexZona = this.tercerosZonas.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogZona = true;
    },

    editarTarjeta (item) {
      this.editadoTarjeta = Object.assign({}, item);
      this.editedIndexTarjeta = this.tarjetas.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogTarjetaEdit = true;
    },

    editarChequera (item) {
      this.editadoChequera = Object.assign({}, item);
      this.editedIndexChequera = this.chequeras.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogChequeraEdit = true;
      this.loscheques = item.loscheques
    },

    preguntoBorrarCon (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.editedIndexCon = this.contactos.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+this.contactos[this.editedIndexCon].observaciones
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar contacto'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },

    preguntoBorrarCuenta (item) {
      this.editedIndexCuenta = this.cuentas.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+this.direcciones[this.editedIndexCuenta].nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar item'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },

    preguntoBorrarZona (item) {
      this.editedIndexZona = this.tercerosZonas.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar la zona '+this.tercerosZonas[this.editedIndexZona].nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar zona'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },

    exportarAPDF () {
      this.msg.msgTitle = 'Exportar a PDF'
      this.msg.msgBody = 'Desea exportar los datos a PDF'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'exportar a PDF'
      this.msg.msgButtons = ['Aceptar','Cancelar']
    },

    exportarAXLS () {
      return HTTP().get('/revisocuits', { timeout: 33333000 })  // SACAR ESTO, ES SOLO PARA IMPORTAR CUITS ALEATORIOS
        .then(({ data }) => {
          let dat = []
          for (let i=0; i<=data.length-1; i++) {
            if (data[i].cuit.datosGenerales) {
              dat.push({
                cuit:      data[i].cuit.datosGenerales.idPersona,
                nombre:    data[i].cuit.datosGenerales.razonSocial,
                direccion: data[i].cuit.datosGenerales.domicilioFiscal.direccion,
                codpostal: data[i].cuit.datosGenerales.domicilioFiscal.codPostal,
                provincia: data[i].cuit.datosGenerales.domicilioFiscal.idProvincia,
              })
            } else if (data[i].cuit.errorConstancia) {
//              dat.push({
//                cuit:      data[i].cuit.errorConstancia.idPersona,
//                nombre:    data[i].cuit.errorConstancia.error[0],
//                direccion: null,
//                codpostal: null,
//                provincia: null,
//              })
            }
          }
          let d = XLSX.utils.json_to_sheet(dat)
          const workbook = XLSX.utils.book_new()
          const filename = 'clientes'
          XLSX.utils.book_append_sheet(workbook, d, filename)
          XLSX.writeFile(workbook, `${filename}.xlsx`)
        })

/*
      let datos = []
      for (let i=0; i<=this.items.length-1; i++) {
        datos.push({
          id: this.items[i].tercero_id,
          nombre: this.items[i].tercero.nombre,
          documento: this.items[i].tercero.cuit,
          ctacte: this.items[i].ctacte==1 ? 'Si' : 'No',
          credito: this.items[i].creditomaximo,
          diasVen: this.items[i].diasvenc,
          direccion: this.items[i].tercero.direcciones[0].direccion,
//        ciudad: this.items[i].tercero.direcciones[0].postal.nombre,
        })
      }

      let data = XLSX.utils.json_to_sheet(datos)
      const workbook = XLSX.utils.book_new()
      const filename = 'clientes'
      XLSX.utils.book_append_sheet(workbook, data, filename)
      XLSX.writeFile(workbook, `${filename}.xlsx`)


//      this.msg.msgTitle = 'Exportar a XLS'
//      this.msg.msgBody = 'Desea exportar los datos a XLS'
//      this.msg.msgVisible = true
//      this.msg.msgAccion = 'exportar a XLS'
//      this.msg.msgButtons = ['Aceptar','Cancelar']
  
  */
    
    },

    agregarTerceros() {
      this.dialogAgregarTerceros = true
      return HTTP().get('/todoslosterceros/'+this.cual).then(({ data }) => {
        this.terceros = data;
      })
    },

    asignarNuevosTerceros() {
      return HTTP().post('/asignarnuevosterceros', {nuevos: this.tercerosSeleccionados,tipo_id: this.cual}).then(({data})=>{
        this.dialogAgregarTerceros = false
        this.tercerosSeleccionados = []
        if (data=='error') {
          this.mensaje('¡Opps!, Se ha producido un error!', this.temas.forms_titulo_bg, 2500) 
        } else {
          this.mensaje('¡La operación se ha realizado con éxito!', this.temas.forms_titulo_bg, 1500) 
          this.listarHTTP()
        }
      })

    },

    borrar (item) {
      const index = this.items.indexOf(item);
      this.borrarHTTP(this.items[index].id);
      this.mensaje('¡Se eliminó el registro.!', this.temas.forms_titulo_bg, 1500) 
    },

    borrarDireccion (item) {
      const index = this.direcciones.indexOf(item);
      this.direcciones.splice(index, 1)
    },

    borrarContacto (item) {
      const index = this.contactos.indexOf(item);
      this.contactos.splice(index, 1)
    },

    borrarZona (item) {
      const index = this.tercerosZonas.indexOf(item);
      this.tercerosZonas.splice(index, 1)
    },

    cancelar() {
      this.dialog = false;
      this.editado = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
    },

    cancelarDir() {
      this.dialogDir = false;
      this.editadoDir = Object.assign({}, this.defaultItemDir);
      this.editedIndexDir = -1;
    },

    cancelarPromo() {
      this.dialogPromo = false;
      this.editadoPromo = Object.assign({}, this.defaultItemPromo);
      this.editedIndexPromo = -1;
    },

    cancelarCon() {
      this.dialogCon = false;
      this.editadoCon = Object.assign({}, this.defaultItemCon);
      this.editedIndexCon = -1;
    },

    cancelarCuenta() {
      this.dialogCuenta = false;
      this.editadoCuenta = Object.assign({}, this.defaultItemCuenta);
      this.editedIndexCuenta = -1;
    },

    cancelarChequeraEdit() {
      this.dialogChequeraEdit = false
    },

    cancelarTarjetaEdit() {
      this.dialogTarjetaEdit = false
    },

    cancelarZona() {
      this.dialogZona = false;
      this.editadoZona = Object.assign({}, this.defaultItemZona);
      this.editedIndexZona = -1;
    },

    guardar() {
      if (this.editado.user) {
        if (this.editado.user.id == this.userId) {
          let hayCuentaPredeterminada = false
          if (this.cuentas.length>0) {
            for (let i=0; i<=this.cuentas.length-1; i++) {
              if (this.cuentas[i].predeterminada) {
                hayCuentaPredeterminada = true
              }
            }
            if (!hayCuentaPredeterminada) {
              this.msg.msgTitle = 'Atención!'
              this.msg.msgBody = 'Debe especificar una cuenta bancaria como predeterminada!.<br>Para que sus clientes sepan con que cuenta operar.'
              this.msg.msgVisible = true
              this.msg.msgAccion = 'Cuenta Bancaria Predeterminada'
              this.msg.msgButtons = ['Aceptar']
              this.dialog = true
              return
            }
          } else {
            this.mensaje('¡Debe ingresar cuentas bancarias si quiere que sus clientes la utilicen para realizarle pagos!', this.temas.forms_titulo_bg, 3500) 
          }
        }
      }

      this.editado.responsable_id = this.editado.responsable_id;
      this.editado.documento_id = this.editado.documento_id;
      this.editado.tipos = this.terceroTipoSeleccionado;
      this.editado.direcciones = this.direcciones;
      this.editado.contactos = this.contactos;
      this.editado.cuentas = this.cuentas;
      this.editado.promos = this.promos;
      this.editado.tercerosZonas = this.tercerosZonas;
      this.editado.usertercero_id = this.usertereroid;
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
      if (this.editedIndex > -1) { // esta modificando
        this.id = this.editado.id;
        this.editarHTTP(this.editado);
      } else {
        this.altaHTTP();
        this.mensaje('¡Alta Exitosa!', this.temas.forms_titulo_bg, 1500) 
      }
      this.cancelar();
    },

    guardarDir(item) {
      let zon = this.itemsZonas.find(e => e.id == item.lazona.zona_id);
      if (zon == undefined) {
        zon = {id: null, nombre: null}
      }
      if (this.editedIndexDir > -1) { // esta modificando
        this.direcciones[this.editedIndexDir].direccion = this.editadoDir.direccion;
        this.direcciones[this.editedIndexDir].postal_id = this.$refs.postal.selectedItem.id;
        this.direcciones[this.editedIndexDir].lazona.zona_id = this.editadoDir.lazona.zona_id
        let z = null 
        let tipoEquipo = this.getArea(this.editado.area)
        if (tipoEquipo!='Vendedor' && zon!=undefined) {
          z = { 
            id: null,
            tercerodireccion_id: this.direcciones[this.editedIndexDir].id,
            usertercero_id: null,
            zona_id: tipoEquipo!='Vendedor' ? this.editadoDir.lazona.zona_id : null,
            zonas: {
              id: tipoEquipo!='Vendedor' ? zon.id : '',
              nombre: tipoEquipo!='Vendedor' ? zon.nombre : '' 
            }
          }
        } else {
          z = {id:null,tercerodireccion_id:null,usertercero_id:null,zona_id:null,zonas:{id:null,nombre:null }}
        }
        this.direcciones[this.editedIndexDir].lazona = z
      } else {
        let tipoEquipo = this.getArea(this.editado.area)
        this.direcciones.push({ 
          id: 0,
          direccion: this.editadoDir.direccion,
          postal: this.$refs.postal.selectedItem,
          postal_id: this.editadoDir.postal_id,
          activo: 1,
          zona_id: this.tipoTer !='Vendedor' ? this.editadoDir.lazona.zona_id : null,
          lazona: { 
            id: null,
            tercerodireccion_id: null,
            usertercero_id: null,
            zona_id: this.tipoTer !='Vendedor' ? this.editadoDir.lazona.zona_id : null,
            zonas: {
              id: this.tipoTer !='Vendedor' ? zon.id : null,
              nombre: this.tipoTer !='Vendedor' ? zon.nombre : null
            }
          },
        })
      }
      this.cancelarDir();
    },

    guardarCon(item) {
      let c = this.contactosTipos.find(e => e.id == this.editadoCon.tipo_id);
      if (this.editedIndexCon > -1) { // esta modificando
        this.contactos[this.editedIndexCon].tipo_id = this.editadoCon.tipo_id;
        this.contactos[this.editedIndexCon].icono = c.icono;
        this.contactos[this.editedIndexCon].observaciones = this.editadoCon.observaciones;
      } else {
        this.contactos.push({ 
          tipo_id: this.editadoCon.tipo_id, 
          observaciones: this.editadoCon.observaciones,
          icono: c.icono,
          activo: 1 
        })
      }
      this.dialogCon = false
    },

    guardarPromo(item) {
      let mUserTerceroId = 0
      if (this.editedIndex>=0) {
        mUserTerceroId = this.items[this.editedIndex].id;  
      }
      if (this.editedIndexPromo > -1) { // esta modificando
        this.promo[this.editedIndexPromo].nombre = this.editadoPromo.user_id;
      } else {
        this.promo.push({ 
          activo: 1,
          porrem: this.editadoPromo.porrem,
          user_id: this.editadoPromo.user_id,
          user_tercero_id: mUserTerceroId,
        })
      }
      this.dialogPromo = false;
    },

    guardarCuenta(item) {
      let mTerceroId = 0
      if (this.editedIndex>=0) {
        mTerceroId = this.items[this.editedIndex].tercero_id;
      }
      if (this.editedIndexCuenta > -1) { // esta modificando
        if (this.editadoCuenta.predeterminada) {
          for (let i=0; i<=this.cuentas.length-1; i++) {
            this.cuentas[i].predeterminada = 0
          }
        }
        this.cuentas[this.editedIndexCuenta].banco          = this.editadoCuenta.banco
        this.cuentas[this.editedIndexCuenta].nombre         = this.editadoCuenta.nombre
        this.cuentas[this.editedIndexCuenta].abrev          = this.editadoCuenta.abrev
        this.cuentas[this.editedIndexCuenta].banco_id       = this.editadoCuenta.banco_id
        this.cuentas[this.editedIndexCuenta].cuenta         = this.editadoCuenta.cuenta
        this.cuentas[this.editedIndexCuenta].cbu            = this.editadoCuenta.cbu
        this.cuentas[this.editedIndexCuenta].predeterminada = this.editadoCuenta.predeterminada
      } else {
        this.cuentas.push({ 
          id:             null,
          tercero_id:     mTerceroId,
          banco_id:       this.editadoCuenta.banco_id.id,
          nombre:         this.editadoCuenta.nombre,
          abrev:          this.editadoCuenta.abrev,
          cuenta:         this.editadoCuenta.cuenta,
          cbu:            this.editadoCuenta.cbu,
          predeterminada: this.editadoCuenta.predeterminada,
          activo:         1,
          banco:          this.editadoCuenta.banco_id,
          created_at:     null,
          updated_at:     null,
          chequeras:      [],
        })
      }
      this.dialogCuenta = false;
      this.editadoCuenta = Object.assign({}, this.defaultItemCuenta);
      this.editedIndexCuenta = -1;
    },

    guardarChequera(item) {
      let ch = []
      if (this.editedIndexChequera==-1) {
        this.editedIndexChequera = this.chequeras.length
        this.cuentas[this.editedIndexCuenta].chequeras.push({
          activo: true,
          cheques: 0,
          loscheques: [],
          id: null,
          nombre: null,
          primer_numero: null,
          tercero_id: null,
        })
        for (let i=Number(item.primer_numero); i<(Number(item.primer_numero)+Number(this.cttcheques)); i++) {
          ch.push({
            activo: 1,
            chequera_id: this.editedIndexChequera,
            comprobante_id: null,
            numero: i,
          })
        }
      } else {
        ch = this.cuentas[this.editedIndexCuenta].chequeras[this.editedIndexChequera].cheques
      }
      let x = this.editedIndexCuenta
      let y = this.editedIndexChequera
      this.cuentas[x].chequeras[y].activo        = item.activo
      this.cuentas[x].chequeras[y].cheques       = ch.length
      this.cuentas[x].chequeras[y].loscheques    = ch
      this.cuentas[x].chequeras[y].id            = null
      this.cuentas[x].chequeras[y].nombre        = item.nombre
      this.cuentas[x].chequeras[y].primer_numero = item.primer_numero
//    this.cuentas[x].chequeras[y].tercero_id    = item.tercero_id
      this.chequeras = this.cuentas[x].chequeras
      this.dialogChequeraEdit = false
    },

    guardarTarjeta(item) {
      if (this.editedIndexTarjeta==-1) {
        this.editedIndexTarjeta = this.cuentas[this.editedIndexCuenta].tarjetas.length
        this.cuentas[this.editedIndexCuenta].tarjetas.push({
          activo: null,
          debito: null,
          id: null,
          tarjeta: null,
          tarjeta_id: null,
          tarjeta_numero: null,
          tarjeta_vencimiento: null,
          tercerocuenta_id: null,
        })
      }
      let x = this.editedIndexCuenta
      let y = this.editedIndexTarjeta
      this.cuentas[x].tarjetas[y].activo              = item.activo
      this.cuentas[x].tarjetas[y].debito              = item.debito
      this.cuentas[x].tarjetas[y].id                  = item.id
      this.cuentas[x].tarjetas[y].tarjeta_id          = item.tarjeta_id.id
      this.cuentas[x].tarjetas[y].tarjeta             = item.tarjeta_id
      this.cuentas[x].tarjetas[y].tarjeta_numero      = item.tarjeta_numero
      this.cuentas[x].tarjetas[y].tarjeta_vencimiento = item.tarjeta_vencimiento
      this.cuentas[x].tarjetas[y].tercerocuenta_id    = item.tercerocuenta_id
      this.tarjetas = this.cuentas[x].tarjetas
      this.dialogTarjetaEdit = false
    },

    guardarZona(item) {
      let mUserTerceroId = 0
      if (this.editedIndex>=0) {
        mUserTerceroId = this.items[this.editedIndex].id;
      }
      if (this.editedIndexZona > -1) { // esta modificando
        this.tercerosZonas[this.editedIndexZona].zona_id = this.editadoZona.zona_id
      } else {
        this.tercerosZonas.push({ 
          id:             null,
          usertercero_id: mUserTerceroId,
          zona_id:        this.editadoZona.zona_id.id,
          nombre:         this.editadoZona.zona_id.nombre,
          activo:         1,
        })
      }
      this.dialogZona = false;
      this.editadoZona = Object.assign({}, this.defaultItemZona);
      this.editedIndexZona = -1;
    },

    cerrarChequeras(item) {
      this.dialogChequera = false
      this.editadoChequera = Object.assign({}, this.defaultChequera);
      this.editedIndexChequera = -1;
      this.editado.cuentas[this.editedIndexCuenta].chequeras = this.chequeras
    },

    cerrarTarjetas(item) {
      this.dialogTarjeta = false
      this.editadoTarjeta = Object.assign({}, this.defaultTarjeta);
      this.editedIndexTarjeta = -1;
      this.editado.cuentas[this.editedIndexCuenta].tarjetas = this.tarjetas
    },

    guardarChequeras(item) {
      this.dialogChequera = false
    },

    buscoDocumento (event) {
      this.cuentaYaAsignada = false
      if (this.editedIndex===-1) {  // SOLO SI ES UNA ALTA, VER QUE PASA SI CAMBIO EL DOCUMENTO
        const doc = event.target.value;
        if (doc=='') { return }
        return HTTP().get(`/tercerodocumento/${this.editado.documento_id}/${doc}/${this.cual}`).then(({data})=>{
          if (data=='existe') {
            this.terceroAIncorporar = null
            this.msg.msgTitle = 'Atención'
            this.msg.msgBody = '¡Ya tiene activa esta cuenta!<br>Ingrese su nombre o CUIT en <i>Buscar</i> del fomulario principal para encontrarla.'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'La cuenta ya existe'
            this.msg.msgButtons = ['Aceptar']
            this.cuentaYaAsignada = true
            this.$refs.cuit.focus()
          } else {
            if (this.editado.documento_id==25 || this.editado.documento_id==26) { // CUIT O CUIL
              // BUSCO EN AFIP Y NO ESTA!
              if (data=='') {
                this.terceroAIncorporar = null
                this.msg.msgTitle = 'Cuenta Inexistente en AFIP'
                this.msg.msgBody = 'AFIP no reconoce este CUIT!'
                this.msg.msgVisible = true
                this.msg.msgAccion = 'CUIT Error'
                this.msg.msgButtons = ['Aceptar']
                this.cuentaYaAsignada = true
                this.$refs.cuit.focus()
              } else {
                if (data.errorConstancia!=undefined) {
                  this.terceroAIncorporar = null
                  this.msg.msgTitle = 'Error en Constancia AFIP '
                  let msg = data.errorConstancia.apellido+','+data.errorConstancia.apellido+'<br>'
                  msg += data.errorConstancia.error[0]
                  this.msg.msgBody = msg
                  this.msg.msgVisible = true
                  this.msg.msgAccion = 'Cuenta ya incorporada'
                  this.msg.msgButtons = ['Aceptar']
                  this.cuentaYaAsignada = true
                } else if (data.datosGenerales==undefined) {           // ECONTRO EN LA BASE DE DATOS
                  this.terceroAIncorporar = data[0].id
                  return HTTP().get(`/estaenusertercero/${data.id}`).then(({ data }) =>{
                    if (data) {
                      this.terceroAIncorporar = null
                      this.msg.msgTitle = 'Esta cuenta ya existe '
                      this.msg.msgBody = 'Esta cuenta ya esta incorporada en su base de datos!'
                      this.msg.msgVisible = true
                      this.msg.msgAccion = 'Cuenta ya incorporada'
                      this.msg.msgButtons = ['Aceptar']
                      this.cuentaYaAsignada = true
                    } else {
                      this.msg.msgTitle = 'Esta cuenta ya existe '
                      this.msg.msgBody = 'Esta cuenta ya Existe en la base de datos global. Desea incorporarla a la suya?'
                      this.msg.msgVisible = true
                      this.msg.msgAccion = 'Incorporar cuenta'
                      this.msg.msgButtons = ['Incorporar','Cancelar']
                    }
                  })
                } else if (data.datosGenerales!=undefined) {
                  // VIENE DESDE LA AFIP
                  if (data.datosGenerales.apellido!=undefined) {
                    this.editado.nombre = data.datosGenerales.apellido+' '+data.datosGenerales.nombre
                  } else if (data.datosGenerales.razonSocial!=undefined) {
                    this.editado.nombre = data.datosGenerales.razonSocial
                  }
                  this.editado.razon_social = this.editado.nombre
                  this.editado.documento_id = 25
                  if (data.datosMonotributo!=undefined) {
                    this.editado.responsable_id = 6
                  } else {
                    this.editado.responsable_id = 1
                  }
                  let dire = data.datosGenerales.domicilioFiscal.direccion
                  return HTTP().post('/buscarocrearpostal', {
                    cod: data.datosGenerales.domicilioFiscal.codPostal,
                    nom: data.datosGenerales.domicilioFiscal.descripcionProvincia,
                    prov: data.datosGenerales.domicilioFiscal.idProvincia
                  }).then(({ data }) => {

                    let pos = this.direcciones.findIndex(x=>x.direccion==dire)
                    if (pos==-1) {
                      this.direcciones.push({
                        id: 0,
                        direccion: dire,
                        postal: data[0],
                        postal_id: data[0].id,
                        activo: 1,
                        zona_id: null,
                        zona: { id: null, tercerodireccion_id: null, usertercero_id: null, zona_id: null,
                          zonas: { id: null, nombre: null }
                        }
                      })
                    }
                  })
                }
              }
            }
          }
        })
      }
    },

    buscoMail (event) {
      const correo = event.target.value;
      if (correo=='') { return }
      const a = HTTP().get(`/terceromail/${correo}`).then(({ data }) => {
        if(data) {
          this.$refs.mail.focus()
          this.msg.msgTitle = 'Este correo electronico ya existe '
          this.msg.msgBody = 'Este correo electronico ya existe en la base de datos!'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'Correo ya existe'
          this.msg.msgButtons = ['Aceptar']
        }
      });
    },

    cerrarAsignarNuevosTerceros() {
      this.dialogAgregarTerceros = false
    },

    async fetchOpciones() {
      let aux = [];
      for (let i=0; i<=this.opItems.length-1; i++) {
        aux.push({
          id:         this.opItems[i].id,
          nombre:     this.opItems[i].nombre,
          tipo:       this.opItems[i].tipo,
          activo:     this.opItems[i].activo,
          opcion_id:  this.opItems[i].opcion_id,
          acceder:    this.opItems[i].acceder,
          agregar:    this.opItems[i].agregar,
          editar:     this.opItems[i].editar,
          desactivar: this.opItems[i].desactivar,
          state:  { disabled: this.opItems[i].activo===1 ? false : true }
        })
      }

      function getNestedChildren2(arr, opcion_id) {
        var out = []
        for(var i in arr) {
          if(arr[i].opcion_id === opcion_id) {
            var children = getNestedChildren2(arr, arr[i].id);
              if(children.length) {
                arr[i].children = children;
              }
              out.push(arr[i]);
            }
          }
          return out
        }
      this.opTree = getNestedChildren2(aux,0)
      return
    },

    selectAll(event) {
      if (event.value) {
        this.tercerosSeleccionados = this.terceros
      } else {
        this.tercerosSeleccionados = []
      }
    },

    invitar() {
      let a = this.itemActual
      let mail = ''
      for (let i=0; i<=this.itemActual.tercero.contactos.length-1; i++) {
        if (this.itemActual.tercero.contactos[i].contacto_tipo_id==1 && 
            this.itemActual.tercero.contactos[i].activo==1) {
            mail = this.itemActual.tercero.contactos[i].observaciones
        }
      }

      let body = ''
      this.mail.token = "4a720391-3103-4352-ac74-d48f13f1a13b"
      this.mail.Host = "smtp.gmail.com"
      this.mail.username = "gohuapp"
      this.mail.password = "gmail021201"
      this.mail.to = mail
      this.mail.from = "gohuapp@gmail.com"
      this.mail.subject = '¡Usa GOHU y conectate con nosotros!'
      this.mail.sub
      this.mail.title = 'Invitación para usar GOHU'
      this.mail.visible = true

      body  = '\nEstimado '+this.itemActual.tercero.nombre+'\n\n'
      body += 'Te invitamo a registrarte en GOHU: www.gohu.com.ar'+'\n\n'
      body += 'Podrás hacernos pedidos desde ahí y estar siempre actualizados con nuestros precios y promociones\n'
      body += 'Es totalmente gratuito\n'
      body += 'Registrate, vinculate y aprovecha las ventajas de estar siempre actualizado\n\n'
      body += 'Desde ya, un gran abrazo, '+this.datosEmpresa.razon_social
      body += '\n'

      this.mail.body = body
      this.mail.accion = 'Confirma enviar correo?'
      this.mail.buttons = ['Enviar','Cancelar']
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

    rol (item, accion) {
      if (accion=='acceder') {
        item.acceder = !item.acceder
      } else if (accion=='agregar') {
        item.agregar = !item.agregar
      } else if (accion=='editar') {
        item.editar = !item.editar
      } else if (accion=='desactivar') {
        item.desactivar = !item.desactivar
      }
      return HTTP().post('/rol', {
        item:item,
        accion:accion,
        tercero:this.itemActual.tercero_id,
        sucursal:this.sucursal
      }).then(({data})=>{
        this.mensaje('¡Operación Exitosa!', this.temas.forms_titulo_bg, 1500) 
      });
    },

    removeTag(item) {
      this.tagsValue.splice(this.tagsValue.indexOf(item), 1);
      this.tagsValue = [...this.tagsValue];
    },

    checkRegla() {
      // no se tienen que repetir el mismo tag en distintas reglas para los mismos clientes

      // TAGS PARA CLIENTES
      // 1) Busco en que reglas estan los tags de este cliente, si la regla estas vacia para clientes esta incluida.
      // 2) Me fijo si en estas reglas estan repetidos los articulos, si es asi hay error.

      let reglasTmp = []
      for (let i=0; i<=this.reglas.length-1; i++) {
        if (this.reglas[i].tagster=='') {
          // si el tagter == '' es porque incluye a todos los clientes, la tomo
          reglasTmp.push(this.reglas[i].id)
        } else {
          // si la regla tiene tag, la busco en los tags del cliente
          for (let j=0; j<=this.tagsValue.length-1; j++) {  
            let pos = this.tagsObj.findIndex(x=>x.nombre==this.tagsValue[j])
            if (this.tagsObj[pos].id==Number(this.reglas[i].tagster)) {
              reglasTmp.push(this.reglas[i].id)
            }
          }
        }
      }

      // Ahora recorro reglasTmp para ver si estan los mismos articulos

      //let reglasInc = this.reglasArmadas.filter( function (r) {
        //  return reglasTmp.includes(r)
      //}); 
      /*
      let ra = []
      for (let i=0; i<=this.reglasArmadas.length-1; i++) {
        for (let j=0; j<=reglasTmp.length-1; j++) {
          if (this.reglasArmadas[i].regla == reglasTmp[j]) {
            ra.push(this.reglasArmadas[i])
          }
        }
      }
      */
     
      // AHORA DEBO VER SI LOS ARTICULOS EN LAS REGLAS SE REPITEN!.
      let art = [];
      let err = []
      let p1 = -1;
      let p2 = -1;
      let sale =false;
      for (let i=0; i<=reglasTmp.length-1; i++) {
        p1 = this.reglasArmadas.findIndex(x=>x.regla==reglasTmp[i])
        if (p1!=-1) {
          for (let j=0; j<=this.reglasArmadas[p1].pre.length-1; j++) {
            p2 = art.findIndex(x=>x == this.reglasArmadas[p1].pre[j].articulo_id)
            if (p2==-1) {
              art.push(this.reglasArmadas[p1].pre[j].articulo_id)
            } else {
              sale = true
              break
            }
          }
          if (sale) {
            err.push(reglasTmp[i])
          }
          sale = false
//        if (sale) break
        }
      }

      /*
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

      */
      //if (mensajeDeError.length>0) {
      if (err.length>0) {
        this.msg.msgTitle = '¡Este tag genera conflico!'
        let txt = '<b>'+this.tagsValue[this.tagsValue.length-1]+'</b> '
        txt += 'entra en conflicto en las siguientes reglas definidas:<br><b>'
        for (let i=0; i<=reglasTmp.length-1; i++) {
          let pos = this.reglasArmadas.findIndex(x=>x.regla==reglasTmp[i])
          txt += this.reglasArmadas[pos].nombre+'<br>'
        }
        txt += '</b>'
        txt += '<br>RECORDAMOS QUE: Un artículo no podrá pertenecer a más de una regla '
        txt += 'en las cuales el cliente sea el mismo.'
        this.tagsValue.pop()
        this.msg.msgBody = txt
        this.msg.msgVisible = true
        this.msg.msgAccion = 'conflicto'
        this.msg.msgButtons = ['Aceptar']
      }
    },

    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    }

  }

};
// 4553
</script>
