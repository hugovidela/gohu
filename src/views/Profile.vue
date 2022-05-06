<template>
  <v-layout align-start>
    <v-flex>

      <!-- Modal del diálogo para Alta y Edicion -->
      <v-dialog v-model="dialog" max-width="800px" :fullscreen="true" persistent>
        <template v-slot:activator="{ on }"></template>
        <v-card>

          <v-toolbar flat
            :color="temas.forms_titulo_bg"
            :dark="temas.forms_titulo_dark==true">
            <v-btn
              :color="temas.forms_close_bg"
              :dark="temas.forms_close_dark==true"
              icon @click="closeForm">
              <v-icon>mdi-arrow-left-circle</v-icon>
            </v-btn>

            <span class="body-2">Mi Perfil / {{operarioVendedor ? operario : empresa}}</span>
            <v-spacer></v-spacer>

            <v-btn
              :color="temas.cen_btns_bg"
              :dark="temas.cen_btns_dark==true"
              class="ma-2 white--text" @click="guardar">
              Guardar
            </v-btn>

          </v-toolbar>

          <v-form ref="form">
            <v-card-text>
              <v-container>

                <v-tabs :color="temas.forms_titulo_bg">

                  <v-tab href="#general" v-if="!operarioVendedor">
                    General
                  </v-tab>
                  <v-tab href="#operario" v-if="operarioVendedor">
                    Operario
                  </v-tab>
                  <v-tab href="#sucursales" v-if="!operarioVendedor && !externo">
                    Sucursales
                  </v-tab>
                  <v-tab href="#usuarios" v-if="!operarioVendedor && !externo">
                    Equipo
                  </v-tab>
                  <v-tab href="#tarjetascobros" v-if="!operarioVendedor && !externo">
                    Recargos en Tarjeta
                  </v-tab>
                  <v-tab href="#mediosdecobros" v-if="!operarioVendedor && !externo">
                    Medios de Cobros
                  </v-tab>
                  <v-tab href="#password">
                    Contraseña
                  </v-tab>
                  <v-tab href="#cprs" v-if="!operarioVendedor && !externo">
                    Comprobantes
                  </v-tab>
                  <v-tab href="#importaciones" v-if="!operarioVendedor && !externo">
                    Importaciones
                  </v-tab>
                  <v-tab href="#impuestos" v-if="!operarioVendedor && !externo">
                    Impuestos
                  </v-tab>

                  <!--
                    TAB GENERAL
                  -->
                  <v-tab-item value="general">
                    <v-row>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field
                          ref="username"
                          disabled
                          v-model="editado.username"
                          label="Razón Social"
                          required
                          :counter="80"
                          :maxlength="80">
                        </v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field
                          v-model="editado.email"
                          label="Correo Electrónico"
                          disabled
                          :counter="80"
                          :maxlength="80">
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row align="center">
                      <v-col cols="8" sm="8">
                        <v-select
                          v-model="rubValue"
                          :color="temas.forms_titulo_bg"
                          :item-color="temas.forms_titulo_bg"
                          :items="rubItems"
                          autofocus
                          disabled
                          chips
                          label="Rubros a los cuales pertenece el usuario"
                          multiple
                          outlined>
                        </v-select>
                      </v-col>

                      <v-col cols="3" sm="3" align="center" class="pt-6 md-6">
                        <v-file-input
                          v-model="logotipo1"
                          outlined
                          label="Avatar"
                          prepend-icon="mdi-camera"
                          :color="temas.forms_titulo_bg"
                          @change="avatarClick(1)">
                          <template v-slot:selection="{ text }">
                            {{ logotipo1.name }}
                          </template>
                        </v-file-input>
                      </v-col>
                      <v-col cols="1" sm="1" align="center" class="pb-7">
                        <v-avatar size="60px" class="mt-0">
                          <img alt="Avatar"
                          :src="`/images/${logotipo1.name}`">
                        </v-avatar>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="4" sx="4" mx="4">
                        <v-autocomplete
                          class="body-2"
                          v-model="editado.tercero_id"
                          :color="temas.forms_titulo_bg"
                          :items="itemsTerceros"
                          :loading="isLoadingTerceros"
                          :search-input.sync="searchTerceros"
                          :disabled="externo"
                          item-text="nombre"
                          item-value="id"
                          label="Tercero al cual esta ligado el usuario"
                          placeholder="Escriba para buscar"
                          prepend-icon="mdi-database-search">
                        </v-autocomplete>
                      </v-col>

                      <v-col cols="4" sx="4" mx="4">
                        <v-select
                          disabled
                          v-model="editado.tipo"
                          :color="temas.forms_titulo_bg"
                          :item-color="temas.forms_titulo_bg"
                          :items="tip"
                          item-value="id"
                          item-text="nombre"
                          label="Tipo de Usuario"
                          outlined>
                        </v-select>
                      </v-col>
                      <v-col cols="3" sm="3" align="center" class="md-6">
                        <v-file-input
                          v-model="logotipo2"
                          outlined
                          label="Logotipo"
                          prepend-icon="mdi-camera"
                          :color="temas.forms_titulo_bg"
                          @change="avatarClick(2)">
                          <template v-slot:selection="{ text }">
                            {{ logotipo2.name }}
                          </template>
                        </v-file-input>
                      </v-col>
<!--
                      <v-col cols="1" sm="1" align="center">
                        <v-avatar size="60px" class="mt-0">
                          <img alt="Avatar"
                          :src="`/images/${logotipo2.name ? logotipo2.name : logotipo2}`">
                        </v-avatar>
                      </v-col>
-->
                    </v-row>

                    <v-row>
                      <v-col cols="2" sm="2" md="2">
                        <v-text-field
                          disabled
                          ref="porrem"
                          outlined
                          v-model="editado.porrem"
                          :color="temas.forms_titulo_bg"
                          label="% de Remarcación Global">
                        </v-text-field>
                      </v-col>

                      <v-col cols="2" sx="2" mx="2" class="pl-0">
                        <v-select
                          v-model="editado.timeout_refresh"
                          :disabled="externo"
                          :color="temas.forms_titulo_bg"
                          :item-color="temas.forms_titulo_bg"
                          :items="timeoutRefreshList"
                          item-value="id"
                          item-text="segundos"
                          label="Seg p/refrescar Notificaciones"
                          outlined>
                        </v-select>
                      </v-col>
                      <v-col cols="4" sx="4" mx="4">
                        <v-switch
                          label="Publicar precios con IVA"
                          v-model="editado.preciosconiva"
                          :color="temas.forms_titulo_bg">
                        </v-switch>
                      </v-col>
                      <v-col class="pl-9 pb-4" cols="3" sm="3" align="center">
                        <v-img
                          :aspect-ratio="16/9"
                          :width="100"
                          :src="`/images/${logotipo2.name}`">
                        </v-img>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="2" sx="2" mx="2" class="pt-0" v-show="!externo">
                        <v-radio-group
                          v-model="editado.faeproduccion" column outlined>
                          <div>Facturación Electrónica</div>
                          <v-radio label="Producción"   value="P"
                            :color="temas.forms_titulo_bg"
                            class="pl-6 pt-2">
                          </v-radio>
                          <v-radio label="Homologacion" value="H"
                            :color="temas.forms_titulo_bg"
                            class="pl-6"></v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-12 pl-6" v-show="!externo">
                        <v-text-field
                          v-model="editado.faevencimiento"
                          outlined
                          type="date"
                          disabled
                          :color="temas.forms_titulo_bg"
                          label="Vencim.del Certificado">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-12 pl-6" v-show="!externo">
                        <v-text-field
                          v-model="editado.faearchivocrt"
                          outlined
                          disabled
                          :color="temas.forms_titulo_bg"
                          label="Archivo CRT">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-12 pl-6" v-show="!externo">
                        <v-text-field
                          v-model="editado.faearchivokey"
                          outlined
                          disabled
                          :color="temas.forms_titulo_bg"
                          label="Archivo KEY">
                        </v-text-field>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-12 pl-6" v-show="!externo">
                        <v-btn
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="ma-2 white--text" @click="chequearAfip">
                          Chequear Servidores AFIP
                        </v-btn>
                      </v-col>
                    </v-row>

                    <v-row v-if="editado.tipo=='MD'">
                      <v-col cols="12" sx="12" mx="12" class="pt-0 pb-0">
                        <v-checkbox
                          :color="temas.cen_btns_bg"
                          v-model="editado.accesolibre"
                          label=
                          "¿Libre Acceso?, cualquier usuario minorista podrá acceder a sus
                          artículos, precios y promociones sin necesidad de que los autorices.">
                        </v-checkbox>
                      </v-col>
                    </v-row>
                    <v-row class="pt-0">
                      <v-col cols="5" sx="5" mx="5" class="pt-0 pb-0 pr-0" v-show="!externo">
                        <v-checkbox
                          :disabled="cttArticulosAnclados>0"
                          :color="temas.cen_btns_bg"
                          v-model="editado.anclarcostos"
                          :label="`¿Anclar Precios al Dolar? (${cttArticulosAnclados}
                          Artículos/Anclados)`">
                        </v-checkbox>
                      </v-col>
                      <v-col cols="5" sx="5" mx="5" class="pt-0 pb-0 pl-0" v-show="!externo">
                        <v-checkbox
                          :color="temas.cen_btns_bg"
                          v-model="editado.desanclarautomaticamente"
                          label=
                          "Utilizar el costo anclado solo cuando sea mayor al último costo
                          cargado.">
                        </v-checkbox>
                      </v-col>
                      <v-col cols="2" sx="2" mx="2" class="pt-0 pb-0 pl-0" v-show="!externo">
                        <v-btn
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="mt-5 white--text" @click="dialogAnclarUsd=true">
                          ¿Como funciona?
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row class="pt-0">
                    </v-row>
                    <v-row class="pt-0">
                      <v-dialog v-model="dialogAnclarUsd" max-width="800px">
                        <v-card>
                          <v-toolbar flat
                            :color="temas.forms_titulo_bg"
                            :dark="temas.forms_titulo_dark==true">
                            <v-btn
                              icon @click="dialogAnclarUsd=false"
                              :color="temas.forms_close_bg"
                              :dark="temas.forms_close_dark==true">
                              <v-icon>mdi-arrow-left-circle</v-icon>
                            </v-btn>
                            <span class="text--right">
                              Anclar costos al precio del Dolar
                            </span>
                            <v-spacer></v-spacer>
                          </v-toolbar>
                          <v-card-text>
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="12">
                                  <span>
                                    <i>Esta característica funciona solo para aquellos artículos
                                    con moneda Pesos.</i><br><br>
                                    Esta funcionalidad te permitirá anclar tus costos
                                    al valor del dolar blue vendedor.<br><br>
                                    Cuando inicias este proceso sobre un artículo, el sistema
                                    toma el costo actual, lo divide por el valor
                                    del dolar del momento y lo almacena en la base de datos.
                                    Este valor permanecera fijo y, cada vez que se requiera
                                    el artículo, lo multiplicará por la cotizacion leída desde
                                    <i>wwww.dolarsi.com</i>.
                                    <br>
                                    El valor del dolar se actualiza todos los dias desde
                                    www.dolarsi.com entre las 10 y 15 hrs, y lo hace cada 15
                                    minutos, para asegurarnos de que siempre este actualizado.
                                    <br><br>
                                    Es común que un costo en pesos supere al incremento del dolar.
                                    <br>
                                    Para ello podrás configurar que <i>el costo anclado solo se
                                    utilice si el costo del artículo es menor.</i>
                                    Entonces, si actualizas un costo y este resulta mayor al
                                    calculado por el ancla, se tomara el nuevo costo que
                                    ingresaste.
                                    <br><br>
                                    Veamos un pequeño ejemplo: <br>
                                    Supongamos que un artículo tiene un costo de $ 700.00, y la
                                    cotización del dolar es de $ 100.00.<br>Entonces el costo
                                    anclado en dolares será de usd 7.00.<br>
                                    De ahora en más el costo del artículo será: 7.00 * la
                                    cotización del dolar blue del momento, <i>siempre y cuando
                                    el costo actual en pesos no haya superado
                                    dicho valor y este activada la opción
                                    'Utilizar costo anclado solo cuando sea mayor al último
                                    costo anclado'</i><br><br>
                                    NOTA: <b>Es muy importante que tengas actualizado el costo del
                                    artículo al momento de anclarlo.</b><br>
                                    <br>
                                  </span>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                        </v-card>
                      </v-dialog>

                    </v-row>

                    <v-row>
                      <v-col cols="12" sx="12" mx="12">
                        <v-textarea
                          v-model="editado.observ"
                          :color="temas.forms_titulo_bg"
                          label="Describe tu empresa, tus formas de comercialización, etc.
                          Para que tus clientes sepan quién eres y como trabajas"
                          auto-grow
                          outlined
                          rows="3"
                          row-height="25"
                          shaped>
                        </v-textarea>
                      </v-col>
                    </v-row>

                  </v-tab-item>
                  <!--
                    TAB OPERADORES
                  -->
                  <v-tab-item value="operario">
                    <v-row>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field
                          ref="username"
                          disabled
                          v-model="editado.username"
                          label="Razón Social"
                          required
                          :counter="80"
                          :maxlength="80">
                        </v-text-field>
                      </v-col>
                      <v-col cols="6" sm="6" md="6">
                        <v-text-field
                          v-model="editado.email"
                          label="Correo Electrónico"
                          disabled
                          :counter="80"
                          :maxlength="80">
                        </v-text-field>
                      </v-col>
                    </v-row>

                    <v-row align="center">
                      <v-col cols="6" sx="6" mx="6">
                        <v-autocomplete
                          class="body-2"
                          v-model="editado.tercero_id"
                          disabled
                          :color="temas.forms_titulo_bg"
                          :items="itemsTerceros"
                          :loading="isLoadingTerceros"
                          :search-input.sync="searchTerceros"
                          item-text="nombre"
                          item-value="id"
                          label="Tercero al cual esta ligado el usuario"
                          placeholder="Escriba para buscar"
                          prepend-icon="mdi-database-search">
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="3" sm="3" align="center" class="md-6">
                        <v-file-input
                          v-model="logotipo1"
                          outlined
                          label="Avatar"
                          prepend-icon="mdi-camera"
                          :color="temas.forms_titulo_bg"
                          @change="avatarClick(1)">
                          <template v-slot:selection="{ text }">
                            {{ logotipo1.name }}
                          </template>
                        </v-file-input>
                      </v-col>
                      <v-col cols="1" sm="1" align="center">
                        <v-avatar size="60px" class="mt-0">
                          <img alt="Avatar"
                          :src="`/images/${logotipo1.name}`">
                        </v-avatar>
                      </v-col>
                    </v-row>

                  </v-tab-item>

                  <!--
                    TAB SUCURSALES
                  -->
                  <v-tab-item value="sucursales">
                    <v-data-table
                      :headers="headersSuc"
                      :items="suc"
                      dense
                      class="elevation-3 mt-3">
                      <template v-slot:top>
                        <v-toolbar flat
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true">
                          <v-dialog v-model="dialogSuc" max-width="800px">
                            <template v-slot:activator="{ on, attrs }">

                              <v-btn fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="nuevaSucursal">
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                              <v-toolbar-title class="body-1 white--text pl-4">
                                Sucursales
                              </v-toolbar-title>

                            </template>
                            <v-card>

                              <v-toolbar flat
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true">
                                <v-btn
                                  icon @click="cancelarSuc"
                                  :color="temas.forms_close_bg"
                                  :dark="temas.forms_close_dark==true">
                                  <v-icon>mdi-arrow-left-circle</v-icon>
                                </v-btn>
                                <span class="text--right">
                                  {{ formTitleSuc }}
                                </span>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="teal accent-4" class="ma-2 white--text"
                                  @click="guardarSuc(editadoSuc)">
                                  Guardar
                                </v-btn>
                              </v-toolbar>

                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="7" sm="7" md="7">
                                      <v-text-field
                                        v-model="editadoSuc.nombre"
                                        :color="temas.forms_titulo_bg"
                                        label="Nombre"
                                        autofocus
                                        required
                                        :counter="40"
                                        :maxlength="40">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="3" sm="3" md="3">
                                      <v-text-field
                                        v-model="editadoSuc.abreviado"
                                        :color="temas.forms_titulo_bg"
                                        label="Abreviado"
                                        required
                                        :counter="10"
                                        :maxlength="10">
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="2" sm="2" md="2">
                                      <v-text-field
                                        v-model="editadoSuc.fiscal"
                                        @change="sucFiscal()"
                                        :color="temas.forms_titulo_bg"
                                        label="Fiscal"
                                        required
                                        :counter="4"
                                        :maxlength="4">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="2" sm="2" md="2">
                                      <v-text-field
                                        v-model="editadoSuc.manual"
                                        @change="sucManual()"
                                        :color="temas.forms_titulo_bg"
                                        label="Manual"
                                        required
                                        :counter="4"
                                        :maxlength="4">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="5" sx="5" mx="5">
                                      <v-switch
                                        label="Activa Facturación Electrónica"
                                        v-model="editadoSuc.electronica"
                                        :color="temas.forms_titulo_bg">
                                      </v-switch>
                                    </v-col>
                                    <v-col cols="3" sx="3" mx="3">
                                      <v-switch
                                        label="Es Sucursal Demo"
                                        v-model="editadoSuc.sucursaldemo"
                                        :color="temas.forms_titulo_bg">
                                      </v-switch>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" sx="12" mx="12">
                                      <span class="headline">Depósitos</span>
                                      <v-data-table
                                        :headers="headersDep"
                                        :items="dep"
                                        dense
                                        class="elevation-3"
                                        hide-default-footer>
                                        <template v-slot:top>
                                          <v-toolbar flat
                                            :color="temas.forms_titulo_bg"
                                            :dark="temas.forms_titulo_dark==true">
                                            <v-dialog v-model="dialogDep" max-width="450px">
                                              <template v-slot:activator="{ on, attrs }">
                                                <v-btn fab x-small
                                                  :color="temas.cen_btns_bg"
                                                  :dark="temas.cen_btns_dark==true"
                                                  @click="nuevoDeposito">
                                                  <v-icon>mdi-plus</v-icon>
                                                </v-btn>
                                              </template>
                                              <v-card>
                                                <v-card-title>
                                                  <span
                                                    class="headline">{{ formTitleDep }}
                                                  </span>
                                                </v-card-title>
                                                <v-card-text>
                                                  <v-container>
                                                    <v-row>
                                                      <v-col cols="12" sm="12" md="12">
                                                        <v-text-field
                                                          v-model="editadoDep.nombre"
                                                          :color="temas.forms_titulo_bg"
                                                          label="Nombre"
                                                          required
                                                          :counter="30"
                                                          :maxlength="30">
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
                                                    @click="cancelarDep">
                                                    Cancelar
                                                  </v-btn>
                                                  <v-btn
                                                    :color="temas.cen_btns_bg"
                                                    :dark="temas.cen_btns_dark==true"
                                                    text
                                                    @click="guardarDep(editadoDep)">
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
                                            dark>{{item.activo?'Sí':'No'}}
                                          </v-chip>
                                        </template>
                                        <template v-slot:item.accion="{item}">
                                          <v-btn
                                            class="mr-2" fab x-small
                                            :color="temas.forms_btn_editar_bg"
                                            :dark="temas.forms_btn_editar_dark==true"
                                            @click="editarDep(item)">
                                            <v-icon dark>mdi-pencil</v-icon>
                                          </v-btn>
                                          <v-btn
                                            class="mr-2" fab x-small
                                            :color="temas.forms_btn_activar_bg"
                                            :dark="temas.forms_btn_activar_dark==true"
                                            @click="activarDesactivarDep(item)">
                                            <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                                          </v-btn>
                                        </template>
                                      </v-data-table>
                                    </v-col>
<!--
                                    <v-col cols="5" sx="5" mx="5"
                                      class="d-flex justify-center"
                                      label="Color"
                                      dense>
                                      <v-color-picker
                                        v-model="editadoSuc.color"
                                        :color="temas.forms_titulo_bg"
                                        hide-inputs>
                                      </v-color-picker>
                                    </v-col>
-->
                                  </v-row>
                                  <v-row>
                                    <!--
                                    <v-col cols="6" sm="6" md="6" class="pt-0">
                                      <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                        <v-file-input
                                          v-model="logotipo2"
                                          outlined
                                          label="Avatar"
                                          prepend-icon="mdi-camera"
                                          :color="temas.forms_titulo_bg"
                                          @change="avatarClick(2)">
                                          <template v-slot:selection="{ text }">
                                            {{ logotipo2.name ? logotipo2.name : logotipo2 }}
                                          </template>
                                        </v-file-input>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="12" sm="12" md="12">
                                          <v-container fluid>
                                            <v-row justify="space-around">
                                              <v-col cols="6" sm="6" align="center">
                                                <v-avatar size="120px" class="mt-0">
                                                  <img alt="Avatar"
                                                  :src="`/images/${logotipo2.name ?
                                                  logotipo2.name : logotipo2}`">
                                                </v-avatar>
                                              </v-col>
                                            </v-row>
                                          </v-container>
                                        </v-col>
                                      </v-row>
                                    </v-col>
                                    -->
                                    <v-col cols="6" sm="6" md="6">
                                      <v-select
                                        v-model="editadoSuc.tema"
                                        :color="temas.forms_titulo_bg"
                                        :item-color="temas.forms_titulo_bg"
                                        :items="lostemas"
                                        dense
                                        label="Tema"
                                        outlined
                                        class="pt-3">
                                      </v-select>
                                    </v-col>
                                  </v-row>

                                </v-container>
                              </v-card-text>
<!--
                              <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn
                                  text @click="cancelarSuc"
                                  :color="temas.cen_btns_bg"
                                  :dark="temas.cen_btns_dark==true">
                                  Cancelar
                                </v-btn>
                                <v-btn
                                  text @click="guardarSuc(editadoSuc)"
                                  :color="temas.cen_btns_bg"
                                  :dark="temas.cen_btns_dark==true">
                                  Guardar
                                </v-btn>
                              </v-card-actions>
-->
                            </v-card>
                          </v-dialog>
                        </v-toolbar>
                      </template>
                      <template v-slot:item.electronica="{ item }">
                        <v-chip
                          :color="getColor(item.electronica)"
                          dark>{{item.electronica?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.activo="{ item }">
                        <v-chip
                          :color="getColor(item.activo)" dark>{{item.activo?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.sucursaldemo="{ item }">
                        <v-chip
                          :color="getColor(item.sucursaldemo)"
                          dark>{{item.sucursaldemo?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.accion="{item}">

                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_editar_bg"
                          :dark="temas.forms_btn_editar_dark==true"
                          @click="editarSuc(item)">
                          <v-icon dark>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_activar_bg"
                          :dark="temas.forms_btn_activar_dark==true"
                          @click="activarDesactivarSuc(item)">
                          <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                        </v-btn>

                      </template>
                    </v-data-table>
                  </v-tab-item>

                  <!--
                    TAB USUARIOS
                  -->
                  <v-tab-item value="usuarios">

                    <v-data-table
                      :headers="headersUsr"
                      :items="usr"
                      dense
                      class="elevation-3 pt-3">
                      <template v-slot:top>
                        <v-toolbar flat
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true">
                          <v-dialog v-model="dialogUsr" max-width="700px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="nuevoUsuario">
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                              <v-toolbar-title class="body-1 white--text pl-4">
                                Equipo
                              </v-toolbar-title>
                            </template>
                            <v-card>
                              <v-toolbar flat
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true">
                                <v-btn
                                  icon @click="cancelarUsr"
                                  :color="temas.forms_close_bg"
                                  :dark="temas.forms_close_dark==true">
                                  <v-icon>mdi-arrow-left-circle</v-icon>
                                </v-btn>
                                <span class="text--right">
                                  {{ formTitleUsr }}
                                </span>
                                <v-spacer></v-spacer>
                                <v-btn
                                  color="teal accent-4" class="ma-2 white--text"
                                  @click="guardarUsr(editadoUsr)">
                                  Guardar
                                </v-btn>
                              </v-toolbar>

                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-text-field
                                        v-model="editadoUsr.username"
                                        :color="temas.forms_titulo_bg"
                                        label="Nombre"
                                        autofocus
                                        required
                                        :counter="40"
                                        :maxlength="40">
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-text-field
                                        v-model="editadoUsr.email"
                                        :color="temas.forms_titulo_bg"
                                        :rules="emailRules"
                                        label="correo"
                                        required
                                        :counter="40"
                                        :maxlength="40">
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col v-show="editedIndexUsr<0" cols="12" sm="12" md="12">
                                      <v-text-field
                                        v-model="editadoUsr.password"
                                        :color="temas.forms_titulo_bg"
                                        label="Password Inicial"
                                        type="password"
                                        required
                                        :counter="40"
                                        :maxlength="40">
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="3" sx="3" mx="3">
                                      <v-select
                                        label="Nivel"
                                        v-model="editadoUsr.level"
                                        :color="temas.forms_titulo_bg"
                                        :item-color="temas.forms_titulo_bg"
                                        :items="niveles"
                                        item-value="level"
                                        item-text="nombre"
                                        autocomplete
                                        return-object>
                                      </v-select>
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
                                  text @click="cancelarUsr">
                                  Cancelar
                                </v-btn>
                                <v-btn
                                  :color="temas.cen_btns_bg"
                                  :dark="temas.cen_btns_dark==true"
                                  text @click="guardarUsr(editadoUsr)">
                                  Guardar
                                </v-btn>
                              </v-card-actions>
                              -->
                            </v-card>
                          </v-dialog>

                        </v-toolbar>
                      </template>
                      <template v-slot:item.activo="{ item }">
                        <v-chip
                          :color="getColor(item.activo)" dark>{{item.activo?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.accion="{item}">
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_editar_bg"
                          :dark="temas.forms_btn_editar_dark==true"
                          @click="editarUsr(item)">
                          <v-icon dark>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_activar_bg"
                          :dark="temas.forms_btn_activar_dark==true"
                          @click="activarDesactivarUsr(item)">
                          <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-tab-item>

                  <!--
                    TAB TARJETAS COBROS
                  -->
                  <v-tab-item value="tarjetascobros">
                    <div>
                      <v-row>
                        <v-col cols="3" sx="3" mx="3">
                          <v-text-field
                            :color="temas.forms_titulo_bg"
                            type="number"
                            v-model="editado.maxdiaschq"
                            label="Máximo de días de cheques en pagos"
                            required>
                          </v-text-field>
                        </v-col>
                      </v-row>
                    </div>
                    <v-data-table
                      :headers="headersMediosCobro"
                      :items="medios"
                      dense
                      class="elevation-3 pt-3">
                      <template v-slot:top>
                        <v-toolbar flat
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true">

                          <v-dialog v-model="dialogMedio" max-width="700px">
                            <template v-slot:activator="{ on, attrs }">

                              <v-btn fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="nuevoMedio">
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                              <v-toolbar-title class="body-1 white--text pl-4">
                                Recargos en Tarjetas
                              </v-toolbar-title>

                            </template>
                            <v-card>
                              <v-card-title>
                                <span class="headline">{{ formTitleMedio }}</span>
                              </v-card-title>
                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12" class="pt-0">
                                      <v-select
                                        label="Tarjeta"
                                        v-model="editadoMedio.tarjeta_id"
                                        :color="temas.forms_titulo_bg"
                                        :item-color="temas.forms_titulo_bg"
                                        :items="tarjetas"
                                        item-value="id"
                                        item-text="nombre"
                                        autocomplete
                                        return-object>
                                      </v-select>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12" class="pt-0">
                                      <v-select
                                        label="Cuenta"
                                        v-model="editadoMedio.cuenta_id"
                                        :color="temas.forms_titulo_bg"
                                        :item-color="temas.forms_titulo_bg"
                                        :items="cueItems"
                                        item-value="id"
                                        :item-text="cueItems=>
                                          `
                                          ${cueItems.banco.nombre} -Cuenta:
                                          ${cueItems.cuenta} -
                                          ${cueItems.nombre}
                                          `"
                                        autocomplete
                                        return-object>
                                      </v-select>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="3" sx="3" mx="3">
                                      <v-switch
                                        label="Débito"
                                        v-model="editadoMedio.debito"
                                        :color="temas.forms_titulo_bg"
                                        @click="setDebitoCredito()">
                                      </v-switch>
                                    </v-col>
                                    <v-col cols="2" sx="2" mx="2">
                                      <v-text-field
                                        label="Cuotas"
                                        type="number"
                                        v-model="editadoMedio.cuotas"
                                        :disabled="editadoMedio.debito"
                                        :color="temas.forms_titulo_bg">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="2" sx="2" mx="2">
                                      <v-text-field
                                        label="% de Interés"
                                        v-model="editadoMedio.interes"
                                        :disabled="editadoMedio.debito"
                                        :color="temas.forms_titulo_bg">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="2" sx="2" mx="2">
                                      <v-text-field
                                        label="% de Recargo"
                                        v-model="editadoMedio.recargo"
                                        :disabled="!editadoMedio.debito"
                                        :color="temas.forms_titulo_bg">
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
                                  text @click="cancelarMedio">
                                  Cancelar
                                </v-btn>
                                <v-btn
                                  :color="temas.cen_btns_bg"
                                  :dark="temas.cen_btns_dark==true"
                                  text @click="guardarMedio(editadoUsr)">
                                  Guardar
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>

                        </v-toolbar>
                      </template>
                      <template v-slot:item.activo="{ item }">
                        <v-chip
                          :color="getColor(item.activo)" dark>{{item.activo?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.debito="{ item }">
                        <v-chip
                          :color="getColor(item.debito)" dark>{{item.debito?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.interes="{ item }">
                          %{{ formatoImporte(item.interes) }}
                      </template>
                      <template v-slot:item.recargo="{ item }">
                          %{{ formatoImporte(item.recargo) }}
                      </template>
                      <template v-slot:item.accion="{item}">
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_editar_bg"
                          :dark="temas.forms_btn_editar_dark==true"
                          @click="editarMedio(item)">
                          <v-icon dark>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_activar_bg"
                          :dark="temas.forms_btn_activar_dark==true"
                          @click="activarDesactivarMedio(item)">
                          <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-tab-item>

                  <!--
                    TAB MEDIOS DE COBRO
                  -->
                  <v-tab-item value="mediosdecobros">
                    <v-data-table
                      :headers="headersMediosCobro"
                      :items="medios"
                      dense
                      class="elevation-3 pt-3">
                      <template v-slot:top>
                        <v-toolbar flat
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true">

                          <v-dialog v-model="dialogMedio" max-width="700px">
                            <template v-slot:activator="{ on, attrs }">

                              <v-btn fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="nuevoMedio">
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                              <v-toolbar-title class="body-1 white--text pl-4">
                                Medios de Cobros
                              </v-toolbar-title>

                            </template>
                            <v-card>
                              <v-card-title>
                                <span class="headline">{{ formTitleMedio }}</span>
                              </v-card-title>
                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12" class="pt-0">
                                      <v-select
                                        label="Tarjeta"
                                        v-model="editadoMedio.tarjeta_id"
                                        :color="temas.forms_titulo_bg"
                                        :item-color="temas.forms_titulo_bg"
                                        :items="tarjetas"
                                        item-value="id"
                                        item-text="nombre"
                                        autocomplete
                                        return-object>
                                      </v-select>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12" class="pt-0">
                                      <v-select
                                        label="Cuenta"
                                        v-model="editadoMedio.cuenta_id"
                                        :color="temas.forms_titulo_bg"
                                        :item-color="temas.forms_titulo_bg"
                                        :items="cueItems"
                                        item-value="id"
                                        :item-text="cueItems=>
                                          `
                                          ${cueItems.banco.nombre} -Cuenta:
                                          ${cueItems.cuenta} -
                                          ${cueItems.nombre}
                                          `"
                                        autocomplete
                                        return-object>
                                      </v-select>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="3" sx="3" mx="3">
                                      <v-switch
                                        label="Débito"
                                        v-model="editadoMedio.debito"
                                        :color="temas.forms_titulo_bg"
                                        @click="setDebitoCredito()">
                                      </v-switch>
                                    </v-col>
                                    <v-col cols="2" sx="2" mx="2">
                                      <v-text-field
                                        label="Cuotas"
                                        type="number"
                                        v-model="editadoMedio.cuotas"
                                        :disabled="editadoMedio.debito"
                                        :color="temas.forms_titulo_bg">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="2" sx="2" mx="2">
                                      <v-text-field
                                        label="% de Interés"
                                        v-model="editadoMedio.interes"
                                        :disabled="editadoMedio.debito"
                                        :color="temas.forms_titulo_bg">
                                      </v-text-field>
                                    </v-col>
                                    <v-col cols="2" sx="2" mx="2">
                                      <v-text-field
                                        label="% de Recargo"
                                        v-model="editadoMedio.recargo"
                                        :disabled="!editadoMedio.debito"
                                        :color="temas.forms_titulo_bg">
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
                                  text @click="cancelarMedio">
                                  Cancelar
                                </v-btn>
                                <v-btn
                                  :color="temas.cen_btns_bg"
                                  :dark="temas.cen_btns_dark==true"
                                  text @click="guardarMedio(editadoUsr)">
                                  Guardar
                                </v-btn>
                              </v-card-actions>
                            </v-card>
                          </v-dialog>

                        </v-toolbar>
                      </template>
                      <template v-slot:item.activo="{ item }">
                        <v-chip
                          :color="getColor(item.activo)" dark>{{item.activo?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.debito="{ item }">
                        <v-chip
                          :color="getColor(item.debito)" dark>{{item.debito?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.interes="{ item }">
                          %{{ formatoImporte(item.interes) }}
                      </template>
                      <template v-slot:item.recargo="{ item }">
                          %{{ formatoImporte(item.recargo) }}
                      </template>
                      <template v-slot:item.accion="{item}">
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_editar_bg"
                          :dark="temas.forms_btn_editar_dark==true"
                          @click="editarMedio(item)">
                          <v-icon dark>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_activar_bg"
                          :dark="temas.forms_btn_activar_dark==true"
                          @click="activarDesactivarMedio(item)">
                          <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-tab-item>

                  <!--
                    TAB PASSWORD
                  -->
                  <v-tab-item value="password">
                    <v-row class="pt-3">
                      <v-col cols="3" sm="3">
                        <v-btn
                          :color="temas.cen_btns_bg"
                          :dark="temas.cen_btns_dark==true"
                          class="ma-2 white--text" @click="cambiarPassword">
                          Cambiar Contraseña
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-dialog v-model="dialogPassword" max-width="400px">
                        <v-card>
                          <v-toolbar flat
                            :color="temas.forms_titulo_bg"
                            :dark="temas.forms_titulo_dark==true">
                            <v-btn
                              icon @click="cancelarCambiarPassword"
                              :color="temas.forms_close_bg"
                              :dark="temas.forms_close_dark==true">
                              <v-icon>mdi-arrow-left-circle</v-icon>
                            </v-btn>
                            <span class="text--right">
                              Cambiar Contraseña
                            </span>
                            <v-spacer></v-spacer>
                            <v-btn
                              color="teal accent-4" class="ma-2 white--text"
                              @click="confirmarCambiarPassword">
                              Confirmar
                            </v-btn>
                          </v-toolbar>

                          <v-card-text>
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="12" md="12" class="pt-6">
                                  <v-text-field
                                    v-model="ope.password0"
                                    autofocus
                                    label="Contraseña Anterior"
                                    hint="Hasta 15 caracteres"
                                    counter
                                    required
                                    :maxlength="15">
                                  </v-text-field>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12" sm="12">
                                  <v-text-field
                                    v-model="ope.password1"
                                    label="Nueva Contraseña"
                                    hint="Hasta 15 caracteres"
                                    counter
                                    required
                                    :maxlength="15">
                                  </v-text-field>
                                </v-col>
                              </v-row>
                              <v-row>
                                <v-col cols="12" sm="12">
                                  <v-text-field
                                    v-model="ope.password1"
                                    label="De nuevo para verfificar"
                                    hint="Hasta 15 caracteres"
                                    counter
                                    required
                                    :maxlength="15">
                                  </v-text-field>
                                </v-col>
                              </v-row>

                            </v-container>
                          </v-card-text>
                        </v-card>
                      </v-dialog>
                    </v-row>

                  </v-tab-item>

                  <!--
                    TAB COMPROBANTES
                  -->
                  <v-tab-item value="cprs">

                    <v-container fluid>
                      <v-row justify="start">
                        <v-col v-for="(cd, i) in cprsDefs" v-bind:key="i" cols="6">
                          <v-card
                            tile outlined
                            class="pt-0 pb-0">
                            <v-card-title class="pt-1 pb-0 text-h6 font-weight-light">
                              {{ cd.nombre }}
                            </v-card-title>
                            <v-card-text>
                              <v-container>
                                <v-row>
                                  <v-col cols="12" sm="12" md="12" class="pl-0 pr-0">
                                    <v-textarea
                                      v-model="cd.mje"
                                      outlined
                                      label="Texto al pie del comprobante">
                                    </v-textarea>
                                  </v-col>
                                </v-row>
                                <v-row class="pt-0">
                                  <p><b>Textos especiales</b></p>
                                </v-row>
                                <v-row>
                                  <tbody>
                                    <tr v-for="(not, i2) in cd.notas" v-bind:key="i2"
                                      class="caption pt-0">
                                      <td class="pt-0">{{not.mje}}</td>
                                      <td class="det-font-bold">
                                        % {{ formatoImporte(not.pje) }}
                                      </td>
                                    </tr>
                                  </tbody>

                                  <div v-for="(not, i2) in cd.notas" v-bind:key="i2">
                                    <!--
                                    <v-col cols="12">
                                      <v-card tile outlined :max-width="250" :min-width="250"
                                        class="text--center">
                                        <v-card-title>
                                          <v-icon left>mdi-file</v-icon>
                                          <span class="cpr">
                                            {{ not.mje )}}<br>
                                          </span>
                                        </v-card-title>
                                        <v-card-text class="pt-0 pb-0 pl-4 caption text--primary"
                                          v-if="nov.comprobante!=null">
                                          <div class="pt-2 pl-0"
                                            v-if="nov.comprobante.vinculoHijo.length>0
                                            && nov.comprobante.cpr.substr(0,3)=='FAC'">
                                            Origen: {{nov.comprobante.vinculoHijo[0].padre.cpr}}
                                          </div>
                                        </v-card-text>

                                        <v-card-actions class="text--center">
                                          <v-tooltip bottom>
                                            <template v-slot:activator="{ on }">
                                              <v-btn
                                                fab x-small outlined
                                                class="mr-1 ml-2"
                                                @click="impCpr(nota, nov)" v-on="on">
                                                <v-icon>mdi-arrow-down-bold-circle-outline</v-icon>
                                              </v-btn>
                                            </template>
                                            <span>Descargar e Imputar</span>
                                          </v-tooltip>
                                        </v-card-actions>
                                      </v-card>
                                    </v-col>
                                    -->
                                  </div>
                                </v-row>
                              </v-container>
                            </v-card-text>
                          </v-card>
                        </v-col>
                      </v-row>
                    </v-container>

                    <!--
                    <v-data-table
                      :headers="headersCprs"
                      :items="cprs"
                      dense
                      class="elevation-3 pt-3"
                      :footer-props="footerProps15">
                      <template v-slot:top>
                        <v-toolbar flat
                          :color="temas.forms_titulo_bg"
                          :dark="temas.forms_titulo_dark==true">
                          <v-dialog v-model="dialogCpr" max-width="800px">
                            <template v-slot:activator="{ on, attrs }">
                              <v-btn fab x-small
                                :color="temas.cen_btns_bg"
                                :dark="temas.cen_btns_dark==true"
                                @click="nuevoCpr">
                                <v-icon>mdi-plus</v-icon>
                              </v-btn>
                            </template>
                            <v-card>
                              <v-toolbar flat
                                :color="temas.forms_titulo_bg"
                                :dark="temas.forms_titulo_dark==true">
                                <v-btn
                                  icon @click="cancelarCpr"
                                  :color="temas.forms_close_bg"
                                  :dark="temas.forms_close_dark==true">
                                  <v-icon>mdi-arrow-left-circle</v-icon>
                                </v-btn>
                                <span class="text--right">
                                  {{ formTitleCpr }}
                                </span>
                                <v-spacer></v-spacer>
                                <v-btn v-show="cprsError==false && editadoCpr.observ!=null"
                                  color="teal accent-4" class="ma-2 white--text"
                                  @click="guardarCpr(editadoCpr)">
                                  Guardar
                                </v-btn>
                              </v-toolbar>
                              <v-card-text>
                                <v-container>
                                  <v-row>
                                    <v-col cols="12" sx="12" mx="12">
                                      <v-radio-group row
                                        :disabled="editedIndexCpr!=-1"
                                        v-model="editadoCpr.tipo">
                                        <v-radio
                                          label="Mensaje sobre Descuentos"
                                          value="D"
                                          :color="temas.forms_titulo_bg"
                                          @click="clickMensajeTipo">
                                        </v-radio>
                                        <v-radio
                                          label="Mensaje al pie del Comprobante"
                                          value="M"
                                          :color="temas.forms_titulo_bg"
                                          @click="clickMensajeTipo">
                                        </v-radio>
                                      </v-radio-group>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="6" sx="6" mx="6">
                                      <v-select
                                        label="Comprobante"
                                        v-model="editadoCpr.cpr"
                                        :color="temas.forms_titulo_bg"
                                        :item-color="temas.forms_titulo_bg"
                                        :items="cprsDef"
                                        item-value="id"
                                        item-text="nombre"
                                        autocomplete
                                        @change="controloCprs">
                                      </v-select>
                                    </v-col>
                                    <v-col cols="2" sx="2" mx="2">
                                      <v-text-field
                                        :disabled="!seleccionaPorcentaje"
                                        v-model="editadoCpr.porcentaje"
                                        label="% Descuento"
                                        required>
                                      </v-text-field>
                                    </v-col>
                                  </v-row>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-textarea
                                        v-model="editadoCpr.observ"
                                        outlined
                                        label="Observaciones">
                                      </v-textarea>
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
                          :color="getColor(item.activo)" dark>{{item.activo?'Sí':'No'}}
                        </v-chip>
                      </template>
                      <template v-slot:item.accion="{item}">
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_editar_bg"
                          :dark="temas.forms_btn_editar_dark==true"
                          @click="editarCpr(item)">
                          <v-icon dark>mdi-pencil</v-icon>
                        </v-btn>
                        <v-btn
                          class="mr-2" fab x-small
                          :color="temas.forms_btn_activar_bg"
                          :dark="temas.forms_btn_activar_dark==true"
                          @click="activarDesactivarUsr(item)">
                          <v-icon dark>mdi-checkbox-marked-outline</v-icon>
                        </v-btn>
                      </template>
                    </v-data-table>
                    -->
                  </v-tab-item>

                  <!--
                    TAB IMPORTACIONES
                  -->
                  <v-tab-item value="importaciones">

                    <v-container fluid>
                      <v-row justify="start">

                        <v-data-table
                          :headers="headersJSONArt"
                          :items="JSONArt"
                          dense
                          class="elevation-3 pt-3">
                          <template v-slot:top>
                            <v-toolbar flat
                              :color="temas.forms_titulo_bg"
                              :dark="temas.forms_titulo_dark==true">
                              <v-dialog v-model="dialogJSONArt" max-width="800px">
                                <template v-slot:activator="{ on, attrs }">
                                  <v-btn fab x-small
                                    :color="temas.cen_btns_bg"
                                    :dark="temas.cen_btns_dark==true"
                                    @click="nuevoJSONArt">
                                    <v-icon>mdi-plus</v-icon>
                                  </v-btn>
                                  <v-toolbar-title class="body-1 white--text pl-4">
                                    Importaciones
                                  </v-toolbar-title>
                                </template>
                                <v-card>
                                  <v-toolbar flat
                                    :color="temas.forms_titulo_bg"
                                    :dark="temas.forms_titulo_dark==true">
                                    <v-btn
                                      icon @click="cancelarJSONArt"
                                      :color="temas.forms_close_bg"
                                      :dark="temas.forms_close_dark==true">
                                      <v-icon>mdi-arrow-left-circle</v-icon>
                                    </v-btn>
                                    <span class="text--right">
                                      {{ formTitleJSONArt }}
                                    </span>
                                    <v-spacer></v-spacer>
                                    <v-btn
                                      color="teal accent-4" class="ma-2 white--text"
                                      @click="guardarJSONArt(JSONArt)">
                                      Guardar
                                    </v-btn>
                                  </v-toolbar>
                                  <v-card-text>
                                    <v-container>
                                      <v-row>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.comienza"
                                            label="Fila en la que comienzan los datos"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.codigo"
                                            label="Columna en donde esta el código"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.nombre"
                                            label="Columna en donde esta el nombre"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.precio"
                                            label="Columna en donde esta el precio"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.tasaiva"
                                            label="Columna en donde esta la tasa de IVA"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.marca"
                                            label="Columna en donde esta la Marca"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                      </v-row>
                                      <v-row>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.grupo"
                                            label="Columna en donde esta el Grupo"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-text-field
                                            v-model="editadoJSONArt.moneda"
                                            label="Columna en donde esta la Moneda"
                                            required>
                                          </v-text-field>
                                        </v-col>
                                        <v-col cols="4" sx="4" mx="4">
                                          <v-switch
                                            label="Precios con IVA"
                                            v-model="editadoJSONArt.coniva"
                                            :color="temas.forms_titulo_bg">
                                          </v-switch>
                                        </v-col>
                                      </v-row>
                                    </v-container>
                                  </v-card-text>
                                </v-card>
                              </v-dialog>
                            </v-toolbar>
                          </template>
                          <template v-slot:item.accion="{item}">
                            <v-btn
                              class="mr-2" fab x-small
                              :color="temas.forms_btn_editar_bg"
                              :dark="temas.forms_btn_editar_dark==true"
                              @click="editarJSONArt(item)">
                              <v-icon dark>mdi-pencil</v-icon>
                            </v-btn>
                          </template>
                        </v-data-table>

                      </v-row>
                    </v-container>

                  </v-tab-item>

                  <!--
                    TAB IMPUESTOS
                  -->
                  <v-tab-item value="impuestos">

                    <v-container fluid>
                      <v-row justify="start">
                        <v-col cols="6" sx="6" mx="6">
                          <v-switch
                            label="¿Eres Agente de Percepción de IVA? (RG 3337)
                            Se incluirá el item en cada facturas que realices"
                            v-model="editado.haceperiva"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                        <v-col cols="2" sx="2" mx="2">
                          <v-text-field
                            v-model="editado.porperiva"
                            :color="temas.forms_titulo_bg"
                            :enabled="editado.haceperiva"
                            label="% de Per.IVA">
                          </v-text-field>
                        </v-col>
                      </v-row>
                      <v-row justify="start">
                        <v-col cols="6" sx="6" mx="6">
                          <v-switch
                            label="¿Eres Agente de Percepción de IIBB?
                            Se incluirá el item en cada facturas que realices"
                            v-model="editado.haceperiibb"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                        <v-col cols="2" sx="2" mx="2">
                          <v-text-field
                            v-model="editado.nroiibb"
                            :color="temas.forms_titulo_bg"
                            :enabled="editado.haceperiva"
                            label="Nr.Ag.Ret.IIBB">
                          </v-text-field>
                        </v-col>
                        <v-col cols="4" sm="4" md="4">
<!--
                          disabled
                          v-model="editado.tipo"
                          :color="temas.forms_titulo_bg"
                          :item-color="temas.forms_titulo_bg"
                          :items="tip"
                          item-value="id"
                          item-text="nombre"
                          label="Tipo de Usuario"
                          outlined>
-->
                          <v-select
                            label="Cód.Actividad"
                            v-model="editado.codactiibb_id"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            :items="ibItems"
                            item-value="id"
                            item-text="nombre">
                          </v-select>
                        </v-col>

                      </v-row>
                      <v-row justify="start">
                        <v-col cols="6" sx="6" mx="6">
                          <v-switch
                            label="¿Eres Agente de Retencion de Ganancias?
                            Se incluirá el item en cada pago que realices"
                            v-model="editado.esageretgan"
                            :color="temas.forms_titulo_bg">
                          </v-switch>
                        </v-col>
                        <v-col cols="2" sx="2" mx="2">
                          <v-select
                            label="Concepto"
                            v-model="editado.conceptogan_id"
                            :color="temas.forms_titulo_bg"
                            :item-color="temas.forms_titulo_bg"
                            :items="cueItems"
                            item-value="id"
                            :item-text="iibbItems=>
                              `
                              ${cueItems.banco.nombre} -Cuenta:
                              ${cueItems.cuenta} -
                              ${cueItems.nombre}
                              `"
                            autocomplete
                            return-object>
                          </v-select>
                        </v-col>
                      </v-row>
                    </v-container>

                  </v-tab-item>

                </v-tabs>
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
import { mapGetters, mapMutations, mapState, mapActions } from 'vuex';
import router from '../router';
import SBar from './Forms/snackbar.vue';
import Confirmacion from "./Forms/confirmacion.vue"
import moment from 'moment';

// import Register from ' ./views/Register';

export default {
  components: {
    SBar,
    Confirmacion,
  },

  data: () => ({
    dialogPassword: false,
    cttArticulosAnclados: 0,
    searchRub: '',
    rubDisp: [],
    selected: [],
    eltema: '',
    lostemas: ['Normal','Noche','Dia','Primavera','Verano','Otoño','Invierno','Pastel'],
    usernameRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 80) || 'Ingrese hasta 80 caracteres',
    ],      
    emailRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 80) || 'Ingrese hasta 80 caracteres',
    ],      
    email: 
      value => {
        const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return pattern.test(value) || 'Invalid e-mail.'
      },
    
    //cuenta_id: '',
    footerProps15: {'items-per-page-options': [15]},
    comprobantes: [],
    cueItems: [],
    ibItems: [],
    ganItems: [],
    tarjetas: [],
    bancos: [],
    rubItems: [],
    medios: [],
    rubValue: [],
    rubObj: [],
    ope: {
      password0: '',
      password1: '',
      password2: '',
    },
    suc: [],
    dep: [],
    usr: [],
    vin: [],
    cprs: [],
    cprsError: false,
    seleccionaPorcentaje: false,
    cprsDefs: [
      {id: 'FAC', nombre: 'Facturas',     mje: '', notas: []},
      {id: 'NDD', nombre: 'N.de Debito',  mje: '', notas: []},
      {id: 'NDC', nombre: 'N.de Crédito', mje: '', notas: []},
      {id: 'REM', nombre: 'Remitos',      mje: '', notas: []},
      {id: 'PRE', nombre: 'Presupuestos', mje: '', notas: []},
      {id: 'PED', nombre: 'Pedidos',      mje: '', notas: []},
      {id: 'PAG', nombre: 'Pagos',        mje: '', notas: []},
      {id: 'REC', nombre: 'Recibos',      mje: '', notas: []}],
    cprsDef: [
      {id: 'FAC', nombre: 'FACTURAS'},
      {id: 'NDD', nombre: 'NOTAS DE DEBITO'},
      {id: 'NDC', nombre: 'NOTAS DE CREDITO'},
      {id: 'REM', nombre: 'REMITOS'},
      {id: 'PRE', nombre: 'PRESUPUESTOS'},
      {id: 'PED', nombre: 'PEDIDOS'},
      {id: 'PAG', nombre: 'PAGOS'},
      {id: 'REC', nombre: 'RECIBOS'}],
    registros: 0,
    tip: [
      {id:'IP',nombre:'Importador/Productor'},
      {id:'MD',nombre:'Mayorista/Distribuidor'},
      {id:'MI',nombre:'Minorista'}],
    niveles: [
      {level: 2, nombre: 'Administrativo'},
      {level: 3, nombre: 'Vendedor'},
//    {level: 5, nombre: 'Cliente'}
      ],
    headersUsr: [
      { text: 'NOMBRE', value:'username'},
      { text: 'MAIL', value: 'email'},
      { text: 'NIVEL', value: 'level'},
      { text: 'ACTIVO', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersMediosCobro: [
      { text: 'Tarjeta', value:'tarjetanombre'},
      { text: 'Banco', value:'banconombre'},
      { text: 'Débito', value:'debito'},
      { text: 'Cuotas', value:'cuotas'},
      { text: '%Interés', value:'interes'},
      { text: '%Recargo', value:'recargo'},
      { text: 'Activo', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersSuc: [
      { text: 'NOMBRE', value:'nombre'},
      { text: 'ABREV', value:'abreviado'},
      { text: 'SUC.', value:'fiscal'},
      { text: 'MANUAL', value:'manual'},
      { text: 'ELECTRONICA', value:'electronica'},
      { text: 'DEMO', value:'sucursaldemo'},
      { text: 'ACTIVO', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersDep: [
      { text: 'NOMBRE', value:'nombre'},
      { text: 'ACTIVO', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersVin: [
      { text: 'NID',       value:'user.id', align: 'end', width: 75},
      { text: 'NOMBRE',    value:'user.username', align: 'left', width: 275},
      { text: 'TIPO',      value:'user.tipo'},
      { text: 'USUARIO',   value:'user.externo'},
      { text: 'VINCULADO', value:'vinculado'},
      { text: 'ACTIVO',    value:'activo'},
//    { text: 'ARTICULOS', value: 'articulos'},
//    { text: 'REGISTROS', value: 'registros'},
//    { text: 'OPERACIONES', value: 'operaciones'},
//    { text: 'CUENTA A USAR', value: 'cuenta.cuenta'},
//    { text: 'ACTIVO', value: 'activo'},
      { text: 'ACCIONES', value: 'accion', sortable: false },
    ],
    headersCprs: [
      { text: 'ID',          value:'id',         align: 'end',  width: 75},
      { text: 'Comprobante', value:'cpr',        align: 'left', width: 125},
      { text: 'Tipo',        value:'tipoNombre', align: 'left', width: 255},
      { text: 'Observ',      value:'observ',     align: 'left', width: 275},
      { text: '%',           value:'porcentaje', align: 'end',  width: 75},
      { text: 'ACTIVO',      value:'activo'},
      { text: 'ACCIONES',    value:'accion',     sortable: false },
    ],
    headersJSONArt: [
      { text: 'Comienza', value:'comienza', align: 'end',  width: 105},
      { text: 'Codigo',   value:'codigo',   align: 'left', width: 105},
      { text: 'Nombre',   value:'nombre',   align: 'left', width: 105},
      { text: 'Precio',   value:'precio',   align: 'left', width: 105},
      { text: 'TasaIva',  value:'tasaiva',  align: 'left', width: 105},
      { text: 'Marca',    value:'marca',    align: 'left', width: 105},
      { text: 'Grupo',    value:'grupo',    align: 'left', width: 105},
      { text: 'Moneda',   value:'moneda',   align: 'left', width: 105},
      { text: 'C/IVA',    value:'coniva',   align: 'left', width: 105},
      { text: 'ACCIONES', value:'accion',   sortable: false },
    ],

    timeoutRefreshList: [],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    editedIndexUsr: -1,
    editedIndexMedio: -1,
    editedIndexSuc: -1,
    editedIndexDep: -1,
    editedIndexVin: -1,
    editedIndexCpr: -1,
    editedIndexJSONArt: -1,
    loading: false,
    searchTerceros: '',     // para el cuadro de búsqueda de datatables
    dialog: true,
    dialogUsr: false,
    dialogMedio: false,
    dialogSuc: false,
    dialogDep: false,
    dialogCue: false,
    dialogCpr: false,
    dialogJSONArt: false,
    dialogAnclarUsd: false,
    editedIndex: -1,
    editado: {
      id: null,
      username: null,
      email: null,
      tercero_id: null,
      tipo: null,
      porrem: null,
      avatar: [],
      timeout_refresh: null,
      preciosconiva: false,
      faeproduccion: null,
      faevencimiento: null,
      faearchivocrt: null,
      faearchivokey: null,
      observ: null,
      maxdiaschq: null,
      accesolibre: 0,
      anclarcostos: 0,
      desanclarautomaticamente: 0,
      haceperiva: null,
      porperiva: null,
      haceperiibb: null,
      codactiibb_id: null,
      nroiibb: null,
      esageretgan: null,
      conceptogan_id: null,
    },
    editadoUsr: {
      id: null,
      activo: null,
      username: null,
      password: null,
      email: null,
      level: null,
      user_id: null
    },
    defaultItemUsr: {
      id: null,
      activo: null,
      username: null,
      password: null,
      email: null,
      level: null,
      user_id: null
    },
    editadoMedio: {
      activo: 1,
      cuenta_id: null,
//    banco_id: null,
//    banconombre: null,
      cuotas: 0,
      debito: 0,
      id: 0,
      interes: 0,
      recargo: 0,
      tarjeta_id: null,
      tarjetanombre: null,
      user_id: 0,
    },
    defaultItemMedio: {
      activo: 1,
      cuenta_id: null,
//    banco_id: null,
//    banconombre: null,
      cuotas: 0,
      debito: 0,
      id: 0,
      interes: 0,
      recargo: 0,
      tarjeta_id: null,
      tarjetanombre: null,
      user_id: 0,
    },
    logotipo1: {name: ''},
    logotipo2: {name: ''},
    editadoSuc: {
      abreviado: null,
      color: null,
      electronica: null,
      fiscal: null,
      manual: null,
      iniactividad: null,
      nombre: null,
      sucursaldemo: null,
      user_id: null,
      activo: null,
      depositos: [],
      logotipo: ['Sin Imagen.jpg'],
      tema: '',
    },
    defaultItemSuc: {
      abreviado: null,
      color: null,
      electronica: null,
      fiscal: null,
      manual: null,
      iniactividad: null,
      nombre: null,
      sucursaldemo: null,
      user_id: null,
      activo: null,
      depositos: [],
      logotipo: 'Sin Imagen.jpg',
      tema: '',
    },
    editadoDep: {
      nombre: null,
      activo: null,
    },
    defaultItemDep: {
      nombre: null,
      activo: null,
    },
    editadoCpr: {
      id: null,
      user_id: null,
      cpr: null,
      tipo: null,
      observ: null,
      porcentaje: null,
      activo: null,
    },
    defaultItemTip: {
      id: null,
      user_id: null,
      cpr: null,
      tipo: null,
      observ: null,
      porcentaje: null,
    },
    activo: null,
    editadoJSONArt: { comienza:1, codigo:'A', nombre:'B', precio:'C', tasaiva:'D', marca:'E', grupo:'F', moneda:'G', coniva:0 },
    defaultJSONArt: { comienza:1, codigo:'A', nombre:'B', precio:'C', tasaiva:'D', marca:'E', grupo:'F', moneda:'G', coniva:0 },
    JSONArt: [],
    descriptionLimit: 60,
    entriesTerceros: [],
    isLoadingTerceros: false,
  }),
  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState([
      'sucursal',
      'sucursales',
      'sucursalFiscal',
      'sucursalManual',
      'temas',
      'notificaciones',
      'caja',
      'vinculosPadres', 
      'vinculosHijos',
      'tipo',
      'externo',
      'empresa',
      'datosEmpresa',
      'operario',
      'operarioTerceroId',
      'operarioId',
      'operarioVendedor',
      'tercero',
      'level',
      'porRem',
      'timeoutRefresh'
    ]),    

    formTitle () {
      return 'Mi Perfil';
    },
    formTitleUsr () {
      return this.editedIndexUsr === -1 ? 'Nuevo Usuario' : 'Editar Usuario';
    },
    formTitleCpr () {
      return this.editedIndexCpr === -1 ? 'Nuevo Mensaje en Comprobante' : 'Editar Mensaje en Comprobante';
    },
    formTitleMedio () {
      return this.editedIndexMedio === -1 ? 'Nuevo Medio de Cobro' : 'Editar Medio de Cobro';
    },
    formTitleSuc () {
      return this.editedIndexSuc === -1 ? 'Nueva Sucursal' : 'Editar Sucursal';
    },
    formTitleDep () {
      return this.editedIndexDep === -1 ? 'Nuevo Depósito' : 'Editar Depósito';
    },
    formTitleJSONArt () {
      return this.editedIndexJSONArt === -1 ? 'Nueva Fila' : 'Editar Fila';
    },
    itemsTerceros () {
      return this.entriesTerceros.map(entry => {
        const nombre = entry.nombre.length > this.descriptionLimit
          ? entry.nombre.slice(0, this.descriptionLimit) + '...'
          : entry.nombre
        return Object.assign({}, entry, { nombre })
        })
      },    
  },
  watch: {
    searchTerceros (val) {
      // Items have already been loaded
      // if (this.entriesPaises.length > 0) return
      // Items have already been requested
      if (this.isLoadingTerceros) return
      this.isLoadingTerceros = true
      // Lazily load input items
      return HTTP().get('/terceros')
        .then(({ data }) => {
          this.entriesTerceros = data;
        })
        .catch(err => {
          console.log(err)
        })
        .finally(() => (
          this.isLoadingTerceros = false
        ))
    },

  },
  mounted() {

    if (!this.isLoggedIn) {
      return router.push('/login');
    }
    this.dialog = true;  

    this.timeoutRefreshList = []
    for (let i=10; i<=360; i++) {
      this.timeoutRefreshList.push(i)
    }

    debugger
    if (this.operarioVendedor) {
      
      debugger
      return HTTP().get('/user/'+this.operarioId).then(({ data }) => {
        this.editado   = data[0]
        this.logotipo1.name = data[0].avatar
      })
    
    } else {

      debugger
      return HTTP().get('/user/'+this.userId).then(({ data }) => {

        debugger
        this.editado   = data[0]
        this.logotipo1.name = data[0].avatar
        this.logotipo2.name = data[0].logotipo
        this.value     = []
        this.usr       = data[0].users
        this.suc       = data[0].sucursales

        this.cprs      = data[0].cprs

        for (let i=0; i<=data[0].cprs.length-1; i++) {
          let pos = this.cprsDefs.findIndex(x=>x.id == data[0].cprs[i].cpr)
          if (data[0].cprs[i].tipo=='M') {
            this.cprsDefs[pos].mje = data[0].cprs[i].observ
          } else {
            this.cprsDefs[pos].notas.push({
              id: data[0].cprs[i].id, 
              mje: data[0].cprs[i].observ, 
              pje: data[0].cprs[i].porcentaje
            })
          }
        }

        for (let i=0; i<= this.cprs.length-1; i++) {
          if (this.cprs[i].tipo == 'D') {
            this.cprs[i].tipoNombre = 'Mensaje sobre Descuentos'
          } else if (this.cprs[i].tipo == 'M') {
            this.cprs[i].tipoNombre = 'Mensaje al pie del comprobante'
          }
        }

        this.rubValue = []
        data[0].usersrubros.forEach(element => {
          this.rubValue.push(element.rubro.nombre)
        });

        this.vin       = data[0].vinculos
        for (let i=0; i<= this.vin.length-1; i++) {
          this.vin[i].estabaVinculado = this.vin[i].vinculado
        }

        this.editado.faevencimiento = moment(this.editado.faevencimiento).format('YYYY-MM-DD')
        this.editado.faearchivocrt = this.userId+'.crt'
        this.editado.faearchivokey = this.userId+'.key'
        this.editado.faeproduccion = this.editado.faeproduccion==1 ? 'P' : 'H'

        for (let i=0; i<= this.vin.length-1; i++) {
          //this.vin[i].vinculadooriginal = this.vin[i].vinculado
          this.vin[i].registros = 0
        }

        let desde = 0
        if (this.vin.length>0) {
          desde = this.vin[0].user_id_desde
        }

        return HTTP().post(`articulosavincular`, { usrdes: desde, usrhas: null, }).then ((res) => {
          this.registros = res.data.cttreg
          return HTTP().get('/rubrosall').then(({ data }) => {
            this.rubItems = [];
            this.rubObj = [];
            data.forEach(element => {
              this.rubItems.push(element.nombre)
              this.rubObj.push(element)
            })
            return HTTP().get('/tarjetascobros').then(({ data }) => {
              debugger
              this.medios = []
              for (let i=0; i<=data.length-1; i++) {
                this.medios.push(data[i])
              }
              return HTTP().get('/tarjetas').then(({ data }) => {
                this.tarjetas = []
                for (let i=0; i<=data.length-1; i++) {
                  this.tarjetas.push(data[i])
                }
                return HTTP().get('/bancos').then(({ data }) => {
                  this.bancos = []
                  for (let i=0; i<=data.length-1; i++) {
                    this.bancos.push(data[i])
                  }
                  return HTTP().get('/tercerocuentas/'+this.$store.state.tercero).then(({ data }) => {
                    for (let i=0; i<=data[0].cuentas.length-1; i++) {
                      this.cueItems.push(data[0].cuentas[i])
                    }
                    return HTTP().get('/codactiibb').then(({data}) => {
                      debugger
                      this.ibItems = []
                      for (let i=0; i<=data.length-1; i++) {
                        this.ibItems.push({id: data[i].id, nombre: data[i].nombre})
                      }
                      return HTTP().get('/afipcomprobantes/').then(({ data }) => {
                        for (let i=0; i<=data.length-1; i++) {
                          this.comprobantes.push({id: data[i].id, nombre: data[i].nombre})
                        }
                        return HTTP().get('/configarticulosexcel/').then(({ data }) => {
                          this.JSONArt = []
                          for (let i=0; i<=data.length-1; i++) {
                            this.JSONArt.push({
                              comienza: data[i].comienza,
                              codigo: data[i].codigo,
                              nombre: data[i].nombre,
                              precio: data[i].precio,
                              tasaiva: data[i].tasaiva,
                              marca: data[i].marca,
                              grupo: data[i].grupo,
                              moneda: data[i].moneda,
                              coniva: data[i].coniva
                            })
                          }
                            debugger
                          return HTTP().post('/articulosanclados').then(({ data }) => {
                            debugger
                            this.cttArticulosAnclados = data[0].anclados
                          })
                        })
                      })
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
  methods: {
    ...mapActions('authentication', ['logout']),
    ...mapMutations([
      'setSucursal',
      'setSucursales',
      'setSucursalFiscal',
      'setSucursalManual',
      'setNotificaciones',
      'setCaja',
      'setVinculasPadres',
      'setVinculasHijos',
      'setEmpresa',
      'setOperario',
      'setLevel',
      'setPorRem',
      'setTimeoutRefresh',
      'setProveedor',
      'setProveedores',
    ]),

    
    
    
    
    closeForm() {
      this.dialog = false;
      //window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');
    },
    
    
    
    
    
    vinhab(item) {
      if (item.user.tipo=='MIX' && item.vinculado==true) {
        return true
      } else if (this.$store.state.tipo=='IP' && item.user.tipo=='MD') {
        return true
      } else if (this.$store.state.tipo=='MD' && item.user.tipo=='MI') { // && item.vinculado) {
        return true
      } else {
        return false
      }
    },
    
    


/*
    cargoCuentas(item) {
      if (item.cuenta) {
        this.editedIndexCue = this.vin.indexOf(item); // si this.editIndex es = -1 es una alta.
        return HTTP().get('/tercerocuentas/'+item.cuenta.tercero_id)
          .then(({ data }) => {
            for (let i=0; i<=data[0].cuentas.length-1; i++) {
              this.cueItems.push(data[0].cuentas[i])
            }
            this.dialogCue = true
//          this.cuenta_id = this.vin[this.editedIndexCue].cuenta_id
          })
      }
    },
*/  





    avatarClick(cual) {
      if (cual==1) {
        this.logotipo1.name = this.logotipo1.name
      } else if (cual==2) {
        this.logotipo2.name = this.logotipo2.name
      }
    },
    
    
    
    
    
    getColor (activo) {
      return (activo === 1) ? this.temas.forms_btn_activo_bg : this.temas.forms_btn_inactivo_bg
    },
    
    
    
    
    
    cancelarUsr() {
      this.dialogUsr = false;
      this.editadoUsr = Object.assign({}, this.defaultItemUsr);
      this.editedIndexUsr = -1;
    },





    cancelarCpr() {
      this.dialogCpr = false;
      this.editadoCpr = Object.assign({}, this.defaultItemCpr);
      this.editedIndexCpr = -1;
    },





    cancelarJSONArt() {
      this.dialogJSONArt = false;
      this.editadoJSONArt = Object.assign({}, this.defaultJSONArt);
      this.editedIndexJSONArt = -1;
    },





    cancelarMedio() {
      this.dialogMedio = false;
      this.editadoMedio = Object.assign({}, this.defaultItemMedio);
      this.editedIndexMedio = -1;
    },





    cambiarPassword() {
      this.dialogPassword = true
    },




    cancelarCambiarPassword() {
      this.dialogPassword = false
    },





    confirmarCambiarPassword() {
      this.dialogPassword = false
      return HTTP().post(`auth/changepassword`, {
        oldpwd: this.ope.password0,
        newpwd: this.ope.password1,
        uid: this.userId
      }).then((data) => {
        if (data.data==false) {
          this.mensaje('¡Opss, se ha producido un error al intentar cambiar la contraseña', this.temas.forms_titulo_bg, 2500) 
        } else {
          this.mensaje('¡Contraseña actualizada con exito!', this.temas.forms_titulo_bg, 1500) 
        }
      })
    },





    cancelarCue() {
      this.dialogCue = false;
    },

    


/*
    corespondeSeleccionarCuenta(item) {
      return (item.cuenta ? true : false )
      return true
//      if (this.editado.tipo=='IP' && item.user.tipo=='MD') {
//        return true
//      } else if (this.editado.tipo=='MD' && item.user.tipo=='MI') {
//        return true
//      } else { return false }
    },
*/  




    cancelarSuc() {
      this.dialogSuc = false;
      this.editadoSuc = Object.assign({}, this.defaultItemSuc);
      this.editedIndexSuc = -1;
    },
    
    
    
    
    
    cancelarDep() {
      this.dialogDep = false;
      this.editadoDep = Object.assign({}, this.defaultItemDep);
      this.editedIndexDep = -1;
    },





    guardar() {

      this.editado.suc    = this.suc;
      this.editado.users  = this.usr;
      this.editado.vin    = this.vin;
      this.editado.medios = this.medios;
      this.editado.json   = this.JSONArt;
      let aux = [];
      for(let i=0; i<=this.rubValue.length-1; i++ ) {
        for(let j=0; j<=this.rubObj.length-1; j++) {
          if(this.rubValue[i]===this.rubObj[j].nombre) {
            aux.push(this.rubObj[j])
            break
          }
        }
      }
      this.editado.rubros = aux;
      this.editarHTTP(this.editado);
      this.dialog = false;
      window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');

    },





    editarHTTP:function(data) {
      
      debugger
      for (let i=0; i<=data.suc.length-1; i++) {
        if (data.suc[i].id == this.sucursal) {
          this.$store.commit('setTemas', data.suc[i].tema, { root: true })
          break
        }
      }
      this.$store.commit('setTimeoutRefresh',           data.timeout_refresh, { root: true } )
      this.$store.commit('setSucursales',               data.suc, { root: true })
      this.$store.commit('setTipo',                     data.tipo, { root: true })
      this.$store.commit('setPublicarPreciosConIVA',    data.preciosconiva, { root: true } )
      this.$store.commit('setAvatar',                   this.logotipo1.name, { root: true } )
      this.$store.commit('setAnclarCostos',             data.anclarcostos, { root: true })
      this.$store.commit('setDesanclarAutomaticamente', data.desanclarautomaticamente, { root: true })
      let profile = data
      
      profile.avatar   = this.logotipo1.name
      profile.logotipo = this.logotipo2.name

      debugger
      if (this.operarioVendedor==true) {
        
        return HTTP().patch(`user/${profile.id}`, {profile: profile, operarioVendedor: true})
          .then((data) => {
            if (data==false) {
              this.mensaje('¡Opss, se ha producido un error al intentar actualizar su perfil', this.temas.forms_titulo_bg, 2500) 
            } else {
              this.mensaje('¡Perfil actualizado con éxito!', this.temas.forms_titulo_bg, 1500) 
            }
            this.dialog = false;
        })
      
      } else {

        debugger
        return HTTP().patch(`user/${profile.id}`, {profile: profile, operarioVendedor: false}).then((data) => {
          debugger
          if (data==false) {
            this.mensaje('¡Opss, se ha producido un error al intentar actualizar su perfil', this.temas.forms_titulo_bg, 2500) 
          } else {
            this.mensaje('¡Perfil actualizado con éxito!', this.temas.forms_titulo_bg, 1500) 
            // ACTUALIZO EL NUEVO PROVEEDOR
            // ( ESTO NO VA MAS DESDE QUE LAS VINCULACIONES NO SE MANEJAN MAS DESDE EL PROFILE)
            /*
            return HTTP().get('/vinculos/true').then(({ data }) => {    // vinculospadres
              this.$store.commit('setVinculosPadres', data[0], { root: true });
              this.$store.commit('setVinculosHijos', data[1], { root: true });
              let losProv = []
              if (this.operarioVendedor==false) {
                losProv.push({
                  avatar: 'Sin Avatar.jpg',
                  id: 0,
                  nombre: 'SIN SELECCIONAR',
                  preciosconiva: 0,
                  tercero_id: null,
                  administragohu: false,
                })
              }
              for (let i=0; i<= data[0].length-1; i++) {
                if (data[0][i].vinculado && !data[0][i].pausado) {
                  losProv.push({
                    avatar: data[0][i].avatar,
                    id: data[0][i].user_id,
                    nombre: data[0][i].nombre,
                    preciosconiva: data[0][i].preciosconiva,
                    tercero_id: data[0][i].tercero_id,
                    administragohu: data[0][i].administragohu,
                  })
                }
              }
              this.$store.commit('setProveedor'   , losProv[0] , { root: true})
              this.$store.commit('setProveedores' , losProv , { root: true})
              this.dialog = false;

            })
            */
          }
        })
      }
    },





    editarUsr (item) {
      this.editadoUsr = Object.assign({}, item);
      this.editedIndexUsr = this.usr.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogUsr = true;
    },





    editarCpr (item) {
      this.editadoCpr = Object.assign({}, item);
      this.editedIndexCpr = this.cprs.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogCpr = true;
    },





    editarJSONArt (item) {
      debugger
      this.editadoJSONArt = Object.assign({}, item);
      this.editedIndexJSONArt = this.JSONArt.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogJSONArt = true;
    },





    editarMedio (item) {
      this.editadoMedio = Object.assign({}, item);
      this.editedIndexMedio = this.medios.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogMedio = true;
    },





    editarSuc (item) {
      // ACA DEBO CARGAR EL ARREGLO DEP QUE ESTA DENTRO DE SUCURSALES.
      this.editadoSuc = Object.assign({}, item);
      this.dep = this.editadoSuc.depositos;
      this.editedIndexSuc = this.suc.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.logotipo2 = this.editadoSuc.logotipo
      this.dialogSuc = true;
    },





    activarDesactivarSuc(item) {
      item.activo = item.activo ? 0 : 1;
    },





    activarDesactivarUsr(item) {
      item.activo = item.activo ? 0 : 1;
    },





    activarDesactivarMedio(item) {
      item.activo = item.activo ? 0 : 1;
    },





    activarDesactivarTip(item) {
      item.activo = item.activo ? 0 : 1;
    },





    activarDesactivarDep(item) {
      item.activo = item.activo ? 0 : 1;
    },





    activarDesactivarVin(item) {
      item.vinculado = item.vinculado ? 0 : 1
    },





    activarDesactivar(item) {
      item.activo = item.activo ? 0 : 1
    },





    editarDep (item) {
      this.editadoDep = Object.assign({}, item);
      this.editedIndexDep = this.dep.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.dialogDep = true;
    },





    nuevoUsr() {
      this.dialogUsr = true;
      this.editadoUsr = Object.assign({}, this.defaultItemUsr);
    },





    nuevoMedio() {
      this.dialogMedio = true;
      this.editadoMedio = Object.assign({}, this.defaultItemMedio);
      this.editedIndexMedio = -1;

    },





    nuevoUsuario() {
      this.dialogUsr = true;
      this.editadoUsr = Object.assign({}, this.defaultItemUsr);
    },





    nuevoCpr() {
      this.editadoCpr = Object.assign({}, this.defaultItemCpr);
      this.editadoCpr.tipo = 'D'
      this.dialogCpr = true;
      this.cprsError = true
      this.editedIndexCpr = -1
    },





    nuevoJSONArt() {
      this.editadoJSONArt = Object.assign({}, this.defaultJSONArt);
      this.dialogJSONArt = true;
      this.editedIndexJSONArt = -1
    },





    clickMensajeTipo() {
      this.seleccionaPorcentaje = false
      if (this.editadoCpr.tipo=='M') {
        this.editadoCpr.porcentaje = 0
      } else {
        this.seleccionaPorcentaje = true
      }
    },





    controloCprs() {
      let hayDupli = false
      for (let i=0; i<=this.cprs.length-1; i++) {
        let c = this.editadoCpr.cpr
        if (this.editadoCpr.tipo=='M') {
          let dupli = this.cprs.filter(function(e){
            return (e.tipo=='M' && e.cpr==c)
          })
          if (dupli.length>=1) {
            hayDupli = true
            break
          }
        }
      }
      this.cprsError = false
      if (hayDupli) {
        this.msg.msgTitle = '¡Error!'
        let m = 'Ya ha definido un mensaje de pie para este tipo de comprobante<br>'
        this.msg.msgBody = m
        this.msg.msgVisible = true
        this.msg.msgAccion = 'nada'
        this.msg.msgButtons = ['Aceptar']
        this.cprsError = true
      }
    },





    nuevaSucursal() {
      this.dialogSuc = true;
      this.editadoSuc = Object.assign({}, this.defaultItemSuc);
      this.dep = []
    },





    nuevoDeposito() {
      this.dialogDep = true;
      this.editadoDep = Object.assign({}, this.defaultItemDep);
    },




/*
    guardarCue(item) {
      this.vin[this.editedIndexCue].cuenta_id = this.cuenta_id
      let pos = 0
      for (let i=0; i<=this.cueItems.length-1; i++) {
        if (this.cueItems[i].id == this.cuenta_id) {
          pos = i
          break
        }
      }
      this.vin[this.editedIndexCue].cuenta = this.cueItems[pos]
      this.dialogCue = false;
    },
*/




    guardarUsr(item) {
      if (this.editedIndexUsr > -1) { // esta modificando
        this.usr[this.editedIndexUsr].username = this.editadoUsr.username;
        this.usr[this.editedIndexUsr].password = this.editadoUsr.password;
        this.usr[this.editedIndexUsr].email = this.editadoUsr.email;
        this.usr[this.editedIndexUsr].activo = this.editadoUsr.activo;
        this.usr[this.editedIndexUsr].level = this.editadoUsr.level;
        this.usr[this.editedIndexUsr].user_id = this.userId;
      } else {
        this.usr.push({ 
          activo: 1,
          username: this.editadoUsr.username,
          password: this.editadoUsr.password,
          email: this.editadoUsr.email,
          activo: 1,
          level: this.editadoUsr.level,
          user_id: this.userId,
          id: 0
        })
      }
      this.dialogUsr = false;
    },





    guardarCpr(item) {
      if (this.editedIndexCpr > -1) { // esta modificando
        this.cprs[this.editedIndexCprs].id = this.editadoCpr.id
        this.cprs[this.editedIndexCprs].cpr = this.editadoCpr.cpr
        this.cprs[this.editedIndexCprs].tipo = this.editadoCpr.tipo
        this.cprs[this.editedIndexCprs].tipoNombre = this.editadoCpr.tipo=='M' ? 'Mensaje al pie del Comprobante' : 'Mensaje sobre Descuentos'
        this.cprs[this.editedIndexCprs].observ = this.editadoCpr.observ
        this.cprs[this.editedIndexCprs].porcentaje = this.editadoUsr.porcentaje
        this.cprs[this.editedIndexCprs].activo = this.activo
      } else {
        this.cprs.push({ 
          cpr: this.editadoCpr.cpr,
          tipo: this.editadoCpr.tipo,
          observ: this.editadoCpr.observ,
          tipoNombre: this.editadoCpr.tipo=='M' ? 'Mensaje al pie del Comprobante' : 'Mensaje sobre Descuentos',
          activo: 1,
          id: 0
        })
      }
      this.dialogCpr = false;
    },





    guardarJSONArt(item) {
      debugger
      if (this.editedIndexJSONArt > -1) { // esta modificando
        this.JSONArt[this.editedIndexJSONArt].comienza = this.editadoJSONArt.comienza
        this.JSONArt[this.editedIndexJSONArt].codigo   = this.editadoJSONArt.codigo
        this.JSONArt[this.editedIndexJSONArt].nombre   = this.editadoJSONArt.nombre
        this.JSONArt[this.editedIndexJSONArt].precio   = this.editadoJSONArt.precio
        this.JSONArt[this.editedIndexJSONArt].tasaiva  = this.editadoJSONArt.tasaiva
        this.JSONArt[this.editedIndexJSONArt].marca    = this.editadoJSONArt.marca
        this.JSONArt[this.editedIndexJSONArt].grupo    = this.editadoJSONArt.grupo
        this.JSONArt[this.editedIndexJSONArt].moneda   = this.editadoJSONArt.moneda
        this.JSONArt[this.editedIndexJSONArt].coniva   = this.editadoJSONArt.coniva
      } else {
        this.JSONArt.push({ 
          comienza: this.editadoJSONArt.comienza,
          codigo:   this.editadoJSONArt.codigo,
          nombre:   this.editadoJSONArt.nombre,
          precio:   this.editadoJSONArt.precio,
          tasaiva:  this.editadoJSONArt.tasaiva,
          marca:    this.editadoJSONArt.marca,
          grupo:    this.editadoJSONArt.grupo,
          moneda:   this.editadoJSONArt.moneda,
          coniva:   this.editadoJSONArt.coniva,
        })
      }
      this.dialogJSONArt = false;
    },





    guardarMedio(item) {

      debugger
      let postar = null
      let posban = null
      let tarjetanombre = ''
      let banconombre = ''

      if (typeof this.editadoMedio.tarjeta_id === 'object' && this.editadoMedio.tarjeta_id != null) {
        this.editadoMedio.tarjeta_id = this.editadoMedio.tarjeta_id.id
      }
      if (typeof this.editadoMedio.banco_id === 'object' && this.editadoMedio.banco_id != null ) {
        this.editadoMedio.banco_id = this.editadoMedio.banco_id.id
      }
      if (typeof this.editadoMedio.cuenta_id === 'object' && this.editadoMedio.cuenta_id != null ) {
        this.editadoMedio.cuenta_id = this.editadoMedio.cuenta_id.id
        let pos = this.cueItems.findIndex(x=>x.id==this.editadoMedio.cuenta_id)
        banconombre = this.cueItems[pos].banco.nombre
      }

      postar = this.tarjetas.findIndex(x=>x.id == this.editadoMedio.tarjeta_id)
//      for (let i=0; i<=this.tarjetas.length-1; i++) {
//        if (this.tarjetas[i].id == this.editadoMedio.tarjeta_id) {
//          postar = i
//          break
//        }
//      }
      if (postar!=-1) {
        tarjetanombre = this.tarjetas[postar].nombre
      }

//     for (let i=0; i<=this.bancos.length-1; i++) {
//       if (this.bancos[i].id == this.editadoMedio.banco_id) {
//         posban = i
//         break
//       }
//     }
//     if (posban!=null) {
//       banconombre = this.bancos[posban].nombre
//     }

      if (this.editedIndexMedio > -1) { // esta modificando
        this.medios[this.editedIndexMedio].activo        = this.editadoMedio.activo;
//      this.medios[this.editedIndexMedio].banco_id      = this.editadoMedio.banco_id;
        this.medios[this.editedIndexMedio].banconombre   = banconombre;
        this.medios[this.editedIndexMedio].cuenta_id     = this.editadoMedio.cuenta_id;
        this.medios[this.editedIndexMedio].cuotas        = this.editadoMedio.cuotas;
        this.medios[this.editedIndexMedio].debito        = this.editadoMedio.debito
        this.medios[this.editedIndexMedio].id            = this.editadoMedio.id
        this.medios[this.editedIndexMedio].interes       = this.editadoMedio.interes;
        this.medios[this.editedIndexMedio].recargo       = this.editadoMedio.recargo;
        this.medios[this.editedIndexMedio].user_id       = this.editadoMedio.user_id;
        this.medios[this.editedIndexMedio].tarjeta_id    = this.editadoMedio.tarjeta_id;
        this.medios[this.editedIndexMedio].tarjetanombre = tarjetanombre
      } else {
        this.medios.push({ 
          activo: Number(this.editadoMedio.activo),
//          banco_id: this.editadoMedio.banco_id,
          banconombre: banconombre,
          cuenta_id: Number(this.editadoMedio.cuenta_id),
          cuotas: Number(this.editadoMedio.cuotas),
          debito: Number(this.editadoMedio.debito),
          id: 0,
          interes: Number(this.editadoMedio.interes),
          recargo: Number(this.editadoMedio.recargo),
          user_id: this.userId,
          tarjeta_id: this.editadoMedio.tarjeta_id,
          tarjetanombre: tarjetanombre,
        })
      }
      this.dialogMedio = false;
    },





    guardarSuc(item) {
      if (this.editedIndexSuc > -1) { // esta modificando
        this.suc[this.editedIndexSuc].nombre       = this.editadoSuc.nombre;
        this.suc[this.editedIndexSuc].color        = this.editadoSuc.color;
        this.suc[this.editedIndexSuc].abreviado    = this.editadoSuc.abreviado;
        this.suc[this.editedIndexSuc].fiscal       = this.editadoSuc.fiscal;
        this.suc[this.editedIndexSuc].manual       = this.editadoSuc.manual;
        this.suc[this.editedIndexSuc].electronica  = this.editadoSuc.electronica
        this.suc[this.editedIndexSuc].sucursaldemo = this.editadoSuc.sucursaldemo
//      this.suc[this.editedIndexSuc].logotipo     = this.logotipo2.name ? this.logotipo2.name : this.logotipo2
        this.suc[this.editedIndexSuc].tema         = this.editadoSuc.tema
      } else {
        this.suc.push({ 
          activo:       1,
          abreviado:    this.editadoSuc.abreviado,
          color:        null, //this.editadoSuc.color.hexa,
          depositos:    this.dep,
          electronica:  this.editadoSuc.electronica,
          fiscal:       this.editadoSuc.fiscal,
          manual:       this.editadoSuc.manual,
          id:           0,
          nombre:       this.editadoSuc.nombre,
          sucursaldemo: this.editadoSuc.sucursaldemo,
          user_id:      this.userId,
          logotipo:     this.logotipo2.name ? this.logotipo2.name : this.logotipo2,
          tema:         this.editadoSuc.tema
        })
      }
      this.dialogSuc = false;
    },





    guardarDep(item) {
      if (this.editedIndexDep > -1) { // esta modificando
        this.editadoSuc.depositos[this.editedIndexDep].nombre = this.editadoDep.nombre;
      } else {
        this.dep.push({
          activo: 1,
          id: 0,
          nombre: this.editadoDep.nombre,
          sucursal_id: this.editadoSuc.id
        })
      }
      this.dialogDep = false;
    },





    preguntoBorrarUsr (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.editedIndexUsr = this.Usr.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+this.usr[this.editedIndexUsr].nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar usuario'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },





    preguntoBorrarDep (item) {
      // este viene del form y activa el componente confirmacion, luego este va a msgRespuesta con lo confirmado
      this.editedIndexDep = this.dep.indexOf(item); // si this.editIndex es = -1 es una alta.
      this.msg.msgTitle = 'Borrar'
      this.msg.msgBody = 'Confirma borrar '+this.dep[this.editedIndexDep].nombre
      this.msg.msgVisible = true
      this.msg.msgAccion = 'borrar deposito'
      this.msg.msgButtons = ['Aceptar','Cancelar']
      this.itemActual = item;
    },

    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },

    setDebitoCredito() {
      if (this.editadoMedio.debito) {
        this.editadoMedio.cuotas = 1
        this.editadoMedio.interes = 0
      } else {
        this.editadoMedio.recargo = 0
      }
    },

    msgRespuesta(op) {

      if (op==='Aceptar') {

        if (this.msg.msgAccion=='borrar deposito') {

          this.borrarDeposito(this.itemActual)

/*
        } else if (this.msg.msgAccion=='vincular articulos') {

          HTTP().post(`articulosavinculargeneracion`, {
            usrdes: this.itemActual.user_id_desde,
            usrhas: this.itemActual.user_id_hasta,
          })
          .then((res) => {

            this.msg.msgTitle = 'Artículos y Precios Vinculados.'
            let msg = 'Se han vinculado '+res.data+' artículos.'
            this.msg.msgBody = msg
            this.msg.msgVisible = true
            this.msg.msgAccion = 'Articulos Vinculados con Exito'
            this.msg.msgButtons = ['Aceptar']

          })
          this.itemActual.articulos = 1
          */

        } else if (this.msg.msgAccion=='Articulos Vinculados con Exito') {
          this.msg.msgVisible = false

/*
        } else if (this.msg.msgAccion=='Desvincular articulos') {
          this.itemActual.articulos = 0
*/

        } else if (this.msg.msgAccion=='actualizar perfil') {

          this.editado.suc    = this.suc;
          this.editado.users  = this.usr;
          this.editado.vin    = this.vin;
          this.editado.medios = this.medios;
          let aux = [];
          for(let i=0; i<=this.rubValue.length-1; i++ ) {
            for(let j=0; j<=this.rubObj.length-1; j++) {
              if(this.rubValue[i]===this.rubObj[j].nombre) {
                aux.push(this.rubObj[j])
                break
              }
            }
          }
          this.editado.rubros = aux;
          this.editarHTTP(this.editado);
          this.dialog = false;
          window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/');

        }

      }
      this.msg.msgVisible = false;
    },





    borrarDeposito (item) {
      const index = this.dep.indexOf(item);
      this.dep.splice(index, 1)
    },




    chequearAfip() {
      return HTTP().post('chequearafip', {
        cuit: this.datosEmpresa.cuit,
        produccion: this.editado.faeproduccion=='P' ? true : false,
      }, { timeout: 3000} )
      .then((res) => {

        this.msg.msgTitle = 'Servicio de AFIP'
        let msg = ''
        if (res.data=='error') {
          msg = 'El servicio de AFIP esta INACTIVO' 
          msg += '<br>Deberá esperar a que se reestablezca o en su defecto realizar '
          msg += 'comprobantes manuales.'
        } else {
          msg += '<br>Los servidores de AFIP estan ACTIVOS y respondieron correctamente.<br><br>'
          msg += 'Si aún así, la emisión o consulta de comprobantes electrónicos presentan problemas, '
          msg += 'espere y vuelva a intentar<br>'
        }
        this.msg.msgBody    = msg
        this.msg.msgVisible = true
        this.msg.msgAccion  = 'Servicio de AFIP'
        this.msg.msgButtons = ['Aceptar']

      })

    },





    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },





    sucFiscal() {
      this.editadoSuc.fiscal = this.editadoSuc.fiscal.padStart(4,'0')
    },





    sucManual() {
      this.editadoSuc.manual = this.editadoSuc.manual.padStart(4,'0')
    },


  },
};
</script>
