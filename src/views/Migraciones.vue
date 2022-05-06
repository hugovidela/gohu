<template>
  <v-layout align-start>
    <v-flex>

      <v-dialog v-model="dialog" :fullscreen="true" persistent>
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
          <v-row>
            <v-col cols="4">
              <span class="headdline">
                Migraciones de Datos / {{empresa}}
              </span>
            </v-col>
            <v-col cols="8">
              <v-progress-linear v-if="progress==true"
                class="mt-2"
                height="10"
                indeterminate
                :color="temas.barra_principal_bg">
              </v-progress-linear>
            </v-col>
          </v-row>
        </v-toolbar>

        <v-card>
          <form method="POST" action="upload" enctype="multipart/form-data">
            <v-card-text class="pb-0">
              <v-container class="pb-0">
                <v-tabs background-color="white" :color="temas.forms_titulo_bg">

                  <v-tab href="#articulos" @click="setTab('articulos')">
                    Artículos
                  </v-tab>

                  <v-tab-item value="articulos">
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
                        <template v-slot:item.codigo="{ item }">
                          <span disable dark class="minifont">{{ item.codigo }}</span>
                        </template>
                        <template v-slot:item.nombre="{ item }">
                          <span disable dark class="minifont">{{ item.nombre }}</span>
                        </template>
                        <template v-slot:item.marca.nombre="{ item }">
                          <span disable dark class="minifont">{{ item.marca.nombre }}</span>
                        </template>
                        <template v-slot:item.grupo.nombre="{ item }">
                          <span disable dark class="minifont">{{ item.grupo.nombre }}</span>
                        </template>
                        <template v-slot:item.moneda="{ item }">
                          <span disable dark class="minifont">{{ item.moneda }}</span>
                        </template>
                        <template v-slot:item.tasiva="{ item }">
                          <span disable dark class="minifont">
                            %{{formatoImporte(item.tasiva)}}
                          </span>
                        </template>
                        <template v-slot:item.precio="{ item }">
                          <span disable dark class="minifont">
                            ${{formatoImporte(item.precio)}}
                          </span>
                        </template>
                        <template v-slot:item.estado="{ item }">
                          {{ item.estado=='M' ? 'Excl.' : 'Nuevo' }}
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
                    </v-card>
                  </v-tab-item>

                  <v-tab href="#marcas" @click="setTab('marcas')">
                    Marcas
                  </v-tab>

                  <v-tab-item value="marcas">
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
                                  @click="importarMar">
                                  Importar
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                      </v-form>

                      <v-data-table
                        v-model="selected"
                        :headers="headersMarcas"
                        :items="items"
                        :single-select="false"
                        :search="search"
                        item-key="codigo"
                        :show-select="showModificarDatos"
                        dense
                        class="elevation-3 pt-0"
                        :footer-props="footerProps">
                        <template v-slot:item.nombre="{ item }">
                          {{ item.nombre.substring(0,10) }}
                        </template>
                        <template v-slot:item.precio="{ item }">
                          $ {{ formatoImporte(item.precio) }}
                        </template>
<!--
                        <template v-slot:item.estado="{ item }">
                          {{ item.estado=='M' ? 'No se Importa' : 'Se Importa' }}
                        </template>
-->
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
                    </v-card>
                  </v-tab-item>

                  <v-tab href="#grupos" @click="setTab('grupos')">
                    Grupos
                  </v-tab>

                  <v-tab-item value="grupos">
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
                                  @click="importarGru">
                                  Importar
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                      </v-form>

                      <v-data-table
                        v-model="selected"
                        :headers="headersMarcas"
                        :items="items"
                        :single-select="false"
                        :search="search"
                        item-key="codigo"
                        :show-select="showModificarDatos"
                        dense
                        class="elevation-3 pt-0"
                        :footer-props="footerProps">
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
                    </v-card>
                  </v-tab-item>

                  <v-tab href="#clientesyproveedores" @click="setTab('clientesyproveedores')">
                    Clientes y Proveedores
                  </v-tab>

                  <v-tab-item value="clientesyproveedores">
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
                                  @click="importarCliPro">
                                  Importar
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                      </v-form>

                      <v-data-table
                        v-model="selected"
                        :headers="headersCuentas"
                        :items="items"
                        :single-select="false"
                        :search="search"
                        item-key="codigo"
                        :show-select="showModificarDatos"
                        dense
                        class="elevation-3 pt-0"
                        :footer-props="footerProps">
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
                    </v-card>
                  </v-tab-item>

                  <v-tab href="#reglas" @click="setTab('reglas')">
                    Reglas para Importar
                  </v-tab>

                  <v-tab-item value="reglas">
                    <v-card>
                      <v-form ref="form">
                        <v-card-text class="pt-1 pb-1">
                          <v-container>
                            <v-row>
                              <v-col cols="12" sm="12" md="12">
                                <p class="titulofont"><b>Reglas generales</b></p>
                                <p class="bigfont">
                                1) Los archivos a importar deben ser en formato Excel<br>
                                2) No deben haber lineas vacias, ni al comienzo ni intercaladas<br>
                                3) Verifique que no haya códigos repetidos. Excel brinda
                                herramientas para poder verificar esto.
                                No obstante, en caso de haberlos, el sistema los obvia.<br>
                                </p>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" sm="12" md="12">
                                <p class="titulofont"><b>Artículos</b></p>
                                <p class="bigfont">Definir las primeras seis columnas con los
                                  siguientes datos:<br>
                                <br>
                                <b>Columna A</b> Código del Artículo (No debe contener el
                                caracter <b>@</b>) - 35 caracteres máximo.
                                <br>
                                <b>Columna B</b> Nombre del Artículo (No debe contener el
                                caracter <b>%</b>) - 100 caraceres máximo.
                                <br>
                                <b>Columna C</b> Precio del Artículo ( Sin impuestos )
                                - 10 dígitos para enteros y 4 para decimales.<br>
                                <b>Columna D</b> Tasa de IVA ( 21% sino se informa )
                                - 2 dígitos para enteros y 2 para decimales.
                                <br>
                                <b>Columna E</b> Marca del Artículo (*)
                                - 50 caracteres máximo.<br>
                                <b>Columna F</b> Grupo del Artículo (*)
                                - 50 caracteres máximo.<br>
                                <b>Columna G</b> Código de Moneda, PES/DOL/etc (*)
                                - 3 caracteres máximo.<br><br>
                                * Columnas que pueden ir vacías, si es así se asignarán valores
                                por defecto.<br>
                                Puede no asignar estos valores y utilizar , luego de cargar el
                                archivo, la opción <b>Modificar Datos</b> que se presenta
                                al pie del formulario.<br>
                                Otra alternativa es asignar el valor 1 (uno) en las columnas E y F,
                                y PES en la columna G.<br>
                                Para el caso de <i>Marca</i> se asignará 'Genérica' y para
                                <i>Grupo</i> se asignará 'General'<br><br>
                                NOTAS: <b>gohu</b> analiza repeticiónes de códigos de artículos,
                                pero no de nombres o descripciones de los mismos.<br>
                                El caracter <b>@</b> se asignará al final de cada codigo agregando
                                tambien su número de usuario.<br>
                                Ej: el código 304 sera 304@{{this.userId}}. {{this.userId}}
                                es su número de usuario.
                                </p>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" sm="12" md="12">
                                <p class="titulofont"><b>Marcas</b></p>
                                <p class="bigfont">Aquí debe especificar solo el nombre de cada
                                  marca en la columna A del libro.<br>
                                  El nombre de la marca no debe superar los 50 caracteres
                                  como máximo.<br>
                                  El sistema exluirá las que ya existen en su base de datos.
                                </p>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" sm="12" md="12">
                                <p class="titulofont"><b>Grupos</b></p>
                                <p class="bigfont">Al igual que en <i>Marcas</i>, aquí también
                                  debe especificar el nombre de cada grupo en la <b>columna A</b>
                                  del libro.<br>
                                  Pero en este caso tiene algunas particularidades.<br>
                                  Como todos sabemos, los grupos pueden tener subgrupos, y éstos
                                  subgrupos sus subgrupos, y así hasta los que necesite
                                  definir.<br>
                                  Entonces deberá, <b>siempre y solo en la columna A</b>,
                                  especificar estos grupos y subgrupos separándolos con el
                                  caracter <b>></b><br>
                                  El nombre de cada grupo o subgrupo no debe superar los 50
                                  caracteres como máximo.<br>
                                  <br>
                                  <i>IMPORTANTE:</i> Siempre se deberá comenzar con un grupo
                                  <i>raíz</i> o <i>principal</i>, será el grupo <i>padre</i>
                                  y no deberá contener el caracater <b>></b>.<br>
                                  En el caso de ya haber difinidop un grupo padre, el ingresado
                                  como tal en la planilla de excel sera hijo del ya existente.
                                  <br>
                                  Veamos un ejemplo:<br>
                                  INDUMENTARIA<br>
                                  INDUMENTARIA > REMERAS<br>
                                  INDUMENTARIA > REMERAS > HOMBRE<br>
                                  INDUMENTARIA > REMERAS > MUJER<br>
                                  <br>
                                  <b>Es muy importante que ordenes tus datos.<br>Marcas y grupos
                                  cargados y asignados correctamente permitirán a tus clientes
                                  encontrar mas rápido y mejor tus productos.</b>
                                </p>
                              </v-col>
                            </v-row>
                            <v-row>
                              <v-col cols="12" sm="12" md="12">
                                <p class="titulofont"><b>Clientes y Proveedores</b></p>
                                <p class="bigfont">
                                  Cada vez que necesites cargar un Cliente o un Proveedor,
                                  <b>gohu</b> buscará primero en nuestras Bases de Datos para
                                  ver si algún otro usuario ya cargo el CUIT correspondiente,
                                  de ser así, se te asignará para que puedas utilizarlo,
                                  caso contrario <b>gohu</b> buscará en AFIP para importarlo.<br>
                                  <i>NOTA: Solo se comparten los datos basicos de cada CUIT:
                                  Nombre o Razón Social, Condición de IVA, Dirección, etc.
                                  </i><br>
                                  <b>IMPORTANTE</b> Este proceso puede demorar,
                                  ya que cada CUIT que no exista en nuestras Bases de Datos
                                  tendrá que ser importado desde AFIP.
                                  <br><br>
                                  Definir las primeras seis columnas con los siguientes datos:<br>
                                  <br>
                                  <b>Columna A</b> Número de CUIT/CUIL (sin guiones)
                                  <br>
                                  <b>Columna B</b> El caracter <b>C</b> si es un Cliente o
                                  <b>P</b> si es un proveedor, si es ambos puede ingresar
                                  <b>CP</b>
                                  <br>
                                  <b>Columna C</b> Ingrese <b>1</b> si trabaja en Cuenta Corriente.
                                  <br>
                                  <b>Columna D</b> Dias de vencimiento de cada comprobante en
                                  Cuenta Corriente. ( solo se almacenará si <b>D</b> es <b>1</b>)
                                  <br>
                                  <b>Columna E</b> Importe del crédito máximo habilitado para
                                  Cuenta Corriente. ( solo se almacenará si <b>D</b> es <b>1</b>)
                                  <br>
                                  <b>Columna F</b> Saldo inicial de Cuenta Corriente.
                                  (se generará un registro en la Cuenta Corriente con el saldo
                                  indicado, solo si <b>D</b> es <b>1</b>)
                                  <br>
                                </p>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                      </v-form>
                    </v-card>
                  </v-tab-item>
                </v-tabs>
              </v-container>
            </v-card-text>
          </form>

        </v-card>
      </v-dialog>

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
//import helpers from '../helpers';
import axios from 'axios';
import XLSX from 'xlsx';
import Confirmacion from "./Forms/confirmacion.vue"
import SBar from './Forms/snackbar.vue';
//const Helpers = use('Helpers')

export default {
  components: {
    Confirmacion,
    SBar,
  },  
  data: () => ({

    file: '',
    tab: 'articulos',
    uploadPercentage: 0,
    cfgExcel: [],

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
    xlsMarcas: [],    // marcas leidos en excel
    xlsGrupos: [],    // grupos leidos en excel
    misMarcas: [],     // mis marcas
    misGrupos: [],    // mis grupos
    rubItems: [],
    rubValue: [],
    monItems: [],
    usersGrupos: [],
    rubro_id: '',
    rubro: '',
    moneda: '',
    nuevoXls: [],
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
    headers: [
      { text: 'CODIGO', value: 'codigo',       align: 'left', width: 100 , sortable: true},
      { text: 'NOMBRE', value: 'nombre',       align: 'left', width: 300 , sortable: true},
      { text: 'MARCA',  value: 'marca.nombre', align: 'left', width: 100 , sortable: true},
      { text: 'GRUPO',  value: 'grupo.nombre', align: 'left', width: 240 , sortable: true},
//    { text: 'MARCA',  value: 'marca',        align: 'left', width: 100 , sortable: true},
//    { text: 'GRUPO',  value: 'grupo',        align: 'left', width: 240 , sortable: true},
      { text: 'MON',    value: 'moneda',       align: 'left', width: 50  , sortable: true},
      { text: 'IVA',    value: 'tasiva',       align: 'end',  width: 50  , sortable: true},
      { text: 'PRECIO', value: 'precio',       align: 'end',  width: 120 , sortable: true},
//    { text: 'ESTADO', value:'estado',       align: 'left', width: 50  , sortable: true},
    ],
    headersMarcas: [
      { text: 'NOMBRE', value:'nombre',        align: 'left', width: 300 , sortable: true},
    ],
    headersCuentas: [
      { text: 'CUIT',   value:'cuit',          align: 'left', width: 300 , sortable: true},
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

      debugger

      let formData = new FormData();
      formData.append('file', this.nuevoXls );
      formData.append('user', this.userId );
      formData.append('rubro', this.rubro.id );
      formData.append('vinculosHijos', this.$store.state.vinculosHijos);

      this.progress = true
      debugger
      await HTTP().post('/importararticulos', 
        formData, {
          onUploadProgress: function( progressEvent ) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded/progressEvent.total))*100);
          }.bind(this)
        })
        .then(({ data }) => { 
          debugger
          this.progress = false
          if (data=='error') {
            this.msg.msgTitle = 'Error'
            let m = 'Se ha producido un error.<br>Revise si el archivo excel cumple con los requerimientos'
            m += 'de importación y vuelva a intentar.'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'aceptar'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.msg.msgTitle = '¡PERFECTO!'
            let m = '¡Se ha agregado '+data+ ' nuevos artículos!<br>'
            m += 'Puede consultar en <b>Artículos</b> para verlos.'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'aceptar'
            this.msg.msgButtons = ['Aceptar']
          }

        })

    },





    async importarMar() {
      this.progress = true
      await HTTP().post('/importarmarcas', 
        { items: this.items }, {
          onUploadProgress: function( progressEvent ) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded/progressEvent.total))*100);
          }.bind(this)
        })
        .then(({ data }) => { 

          this.progress = false
          if (data=='error') {
            this.msg.msgTitle = 'Opps, se ha producido un error!'
            let m = '¡Rivise si el archivo excel contempla los requerimientos y vuelva a intentar.<br>'
            m += 'si el error persiste contáctese con soporte.'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'aceptar'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.mensaje('Ha agregado '+data+' nuevas Marcas.',this.temas.forms_titulo_bg,1500)
          }

        })


      /*
      let formData = new FormData();
      formData.append('file', this.nuevoXls );
      formData.append('user', this.userId );
      formData.append('items', this.items )
      this.progress = true
      await HTTP().post('/importarmarcas', 
        formData, {
          onUploadProgress: function( progressEvent ) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded/progressEvent.total))*100);
          }.bind(this)
        })
        .then(({ data }) => { 

          this.progress = false
          if (data=='error') {
            this.msg.msgTitle = 'Opps, se ha producido un error!'
            let m = '¡Rivise si el archivo excel contempla los requerimientos y vuelva a intentar.<br>'
            m += 'si el error persiste contáctese con soporte.'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'aceptar'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.mensaje('Ha agregado '+data+' nuevas Marcas.',this.temas.forms_titulo_bg,1500)
          }

        })

      */

    },





    async importarGru() {
      let formData = new FormData();
      formData.append('file', this.nuevoXls );
      formData.append('user', this.userId );
      formData.append('rubro', this.rubro.id );
      this.progress = true
      await HTTP().post('/importargrupos', 
        formData, {
          onUploadProgress: function( progressEvent ) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded/progressEvent.total))*100);
          }.bind(this)
        })
        .then(({ data }) => {

          this.progress = false
          if (data=='error') {
            this.msg.msgTitle = 'Opps, se ha producido un error!'
            let m = '¡Rivise si el archivo excel contempla los requerimientos y vuelva a intentar.<br>'
            m += 'si el error persiste contáctese con soporte.'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'aceptar'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.mensaje('Ha agregado '+data+' nuevos Grupos.',this.temas.forms_titulo_bg,1500)
          }

        })

    },





    async importarCliPro() {
      let formData = new FormData();
      formData.append('file', this.nuevoXls );
      formData.append('user', this.userId );
      formData.append('rubro', this.rubro.id );
      this.progress = true
      debugger
      await HTTP().post('/importarclientesyproveedores', 
        formData, {
          onUploadProgress: function( progressEvent ) {
            this.uploadPercentage = parseInt(Math.round((progressEvent.loaded/progressEvent.total))*100);
          }.bind(this)
        })
        .then(({ data }) => {

          debugger
          this.progress = false
          if (data=='error') {
            this.msg.msgTitle = 'Opps, se ha producido un error!'
            let m = '¡Rivise si el archivo excel contempla los requerimientos y vuelva a intentar.<br>'
            m += 'si el error persiste contáctese con soporte.'
            this.msg.msgBody = m
            this.msg.msgVisible = true
            this.msg.msgAccion = 'aceptar'
            this.msg.msgButtons = ['Aceptar']
          } else {
            this.mensaje('Ha agregado '+data+' nuevos Clientes y Proveedores.',this.temas.forms_titulo_bg,1500)
          }

        })

    },





    cargarXls() {

      if (this.nuevoXls.name != undefined) {

        try {

          debugger
          let url = ''
          if (this.tab=='articulos') {
            url = 'configarticulosexcel'
          } else if (this.tab=='grupos') {
            url = 'configgruposexcel'
          } else if (this.tab=='marcas') {
            url = 'configmarcasexcel'
          } else if (this.tab=='clientesyproveedores') {
            url = 'configtercerosexcel'
          }

          let a = HTTP().get('/'+url)
            .then(({ data }) => {

              debugger
              this.cfgExcel = data

              this.progress = true
              this.xlsCargado = true;
              let file = this.nuevoXls;
              let reader = new FileReader();

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
              if (this.tab=='articulos') {

                return HTTP().post('/userarticulosimp')
                  .then(({ data }) => {

                    debugger
                    this.misMarcas = []
                    this.misGrupos = []
                    this.xlsMarcas = []
                    this.xlsGrupos = []
                    let pos = null
                
                    if (data) {
                  
                      for (let i=0; i<=data.length-1; i++) {
                        this.mios.push({ codigo: data[i].codigo })
                      }

                      // LEVANTO LAS MARCAS QUE TENGO DEFINIDAS Y LAS PONGO EN MISMARCAS
                      return HTTP().get('/usermarcasimp')
                        .then(({ data }) => {
                          if (data) {
                            for (let i=0; i<=data.length-1; i++) {
                              this.misMarcas.push({id: data[i].id, nombre: data[i].nombre})
                            }
                          }

                          // LEVANTO LOS GRUPOS QUE TENGO DEFINIDO Y LOS PONGO EN MIS GRUPOS
                          return HTTP().get('/gruposrubros/'+this.rubro_id)
                            .then(response => {

                              debugger
                              let aux = [];
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

                              this.usersGrupos = getNestedChildren2(aux,0)
                              let armoObjeto = []
                              if (this.usersGrupos.length>0) {
                                let armoObjeto = this.puedoDesactivar(this.usersGrupos)
                                //this.mios = this.strDeGrupos(armoObjeto)
                              } else {
                                //this.mios = []
                              }

                              if (armoObjeto.length>0) {
                                this.misGrupos = this.strDeGrupos(armoObjeto)
                              }
                              this.items = []

                              // AHORA VOY POR LOS ARTICULOS DE EXCEL
                              let err = false
                              debugger
                              for (let i=0; i<=this.itemsExcel.length-1; i++) {

                                pos = this.mios.find( x => x.codigo == this.itemsExcel[i].codigo)
                                if (pos!=undefined) {
                                  this.itemsExcel[i].estado = 'M'
                                  this.encontradosXls ++
                                } else {
                                  this.aImportar ++
                                }

                                pos = this.xlsMarcas.find(x => x == this.itemsExcel[i].marca.nombre)
                                if (pos==undefined) {
                                  this.xlsMarcas.push(this.itemsExcel[i].marca.nombre)
                                  this.itemsExcel[i].marca = {id:0, nombre: this.itemsExcel[i].marca.nombre }
                                } else {
                                  this.itemsExcel[i].marca = {id:0, nombre: pos }
                                }

                                pos = this.xlsGrupos.find(x => x == this.itemsExcel[i].grupo.nombre)
                                if (pos==undefined) {
                                  this.xlsGrupos.push(this.itemsExcel[i].grupo.nombre)
                                  this.itemsExcel[i].grupo = {id:0, nombre: this.itemsExcel[i].grupo.nombre }
                                } else {
                                  this.itemsExcel[i].grupo = {id:0, nombre: pos }
                                }

                              }

                              this.items = this.itemsExcel.filter(function(it) {
                                return it.estado == 'N'
                              })

                              this.progress = false

                              if (err) {
                                this.aImportar = 0
                                this.msg.msgTitle = '¡Hay errores!'
                                let m = 'El archivo de Excel seleccionado no contempla los requerimientos<br>'
                                m += 'necesarios para ser importado.<br>'
                                m += 'Revise por favor la documentación y como esta cargado su archivo.<br>'
                                this.msg.msgBody = m
                                this.msg.msgVisible = true
                                this.msg.msgAccion = 'aceptar'
                                this.msg.msgButtons = ['Aceptar']
                              } else if (this.aImportar==0) {
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
                                  m = '¡Se ha encontrado un articulo nuevo para ser importado!.<br><br>'
                                } else {
                                  this.msg.msgTitle = '¡Hay artículos nuevos!'
                                  m = '¡Se han encontrado '+this.aImportar+' artículos nuevos para ser importados!.<br><br>'
                                }
                                m += 'Revisa la lista y presiona en <b>IMPORTAR</b> para agregarlos a tu sistema.<br>'
                                if (this.vinculosHijos.length==1) {
                                  m += 'Ademas se agregarán también en tu usuario vinculado.<br>'
                                } else {
                                  m += 'Ademas se agregarán también en tus <b>'+this.vinculosHijos.length+'</b> usuarios vinculados.<br>'
                                }
//                                m += 'activando <b>Modificar datos de la Grilla</b> en e pie del formulario.'
                                this.msg.msgBody = m
                                this.msg.msgVisible = true
                                this.msg.msgAccion = 'aceptar'
                                this.msg.msgButtons = ['Aceptar']
                              }
                            })  // then gruposrubros
                        }) // then usermarcasimp
                    }
                  })
                  .catch(err => {
                    console.log(err)
                  })
            
              } else if ( this.tab == 'marcas') {

                return HTTP().get('/usermarcasimp')
            
                  .then(({ data }) => {
  
                    if (data) {
                      for (let i=0; i<=data.length-1; i++) {
                        this.mios.push({ 
                          nombre: data[i].nombre,
                        })
                      }

                      this.items = []
                      this.encontrados = 0
                      for (let i=0; i<=this.itemsExcel.length-1; i++) {
                        if (this.mios.findIndex(x => x.nombre == this.itemsExcel[i].nombre)==-1) {
                          this.aImportar ++
                          this.items.push({
                            estado: 'N',
                            seleccionado: false,
                            nombre: this.itemsExcel[i].nombre
                          })
                        } else {
                          this.encontradosXls ++
                        }
                      }
  
                      this.progress = false
                      if (this.aImportar==0) {
                        this.msg.msgTitle = 'No hay Marcas nuevas'
                        let m = '¡Todas las Marcas especificadas en el archivo de Excel seleccionado<br>'
                        m += 'ya existen en la base de datos. No se pueden volver a Importar.'
                        this.msg.msgBody = m
                        this.msg.msgVisible = true
                        this.msg.msgAccion = 'aceptar'
                        this.msg.msgButtons = ['Aceptar']
                      } else {
                        let m = ''
                        if (this.aImportar==1) {
                          this.msg.msgTitle = '¡Hay una nueva Marca!'
                          m = '¡Se ha encontrado una marca nueva para ser importada.<br>'
                        } else {
                          this.msg.msgTitle = '¡Hay marcas nuevas!'
                          m = '¡Se han encontrado '+this.aImportar+' marcas nuevas para ser importadas.<br>'
                        }
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

              } else if ( this.tab == 'grupos') {

                // ORDENO EL ARRAY DE GRUPOS PARA QUE SE PAREZA A: PADRE > HIJO > NIETO

                return HTTP().get('/gruposrubros/'+this.rubro_id)
                  .then(response => {
                    let aux = [];
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

                  this.usersGrupos = getNestedChildren2(aux,0)
                  if (this.usersGrupos.length>0) {
                    let armoObjeto = this.puedoDesactivar(this.usersGrupos)
                    this.mios = this.strDeGrupos(armoObjeto)
                  } else {
                    this.mios = []
                  }

                  this.items = []
                  this.encontrados = 0
                  for (let i=0; i<=this.itemsExcel.length-1; i++) {
                    if (this.mios.find( x => x === this.itemsExcel[i].nombre ) === undefined) {
                      this.aImportar ++
                      this.items.push({
                        estado: 'N',
                        seleccionado: false,
                        nombre: this.itemsExcel[i].nombre
                      })
                    } else {
                      this.encontradosXls ++
                    }
                  }
  
                  this.progress = false
                  if (this.aImportar==0) {
                    this.msg.msgTitle = 'No hay Grupos nuevos'
                    let m = '¡Todas los Grupos especificados en el archivo de Excel seleccionado<br>'
                    m += 'ya existen en la base de datos. No se pueden volver a Importar.'
                    this.msg.msgBody = m
                    this.msg.msgVisible = true
                    this.msg.msgAccion = 'aceptar'
                    this.msg.msgButtons = ['Aceptar']
                  } else {
                    let m = ''
                    if (this.aImportar==1) {
                      this.msg.msgTitle = '¡Hay un nuevo Grupo!'
                      m = '¡Se ha encontrado un grupo nuevo para ser importado.<br>'
                    } else {
                      this.msg.msgTitle = '¡Hay grupos nuevos!'
                      m = '¡Se han encontrado '+this.aImportar+' grupos nuevos para ser importados.<br>'
                    }
                    this.msg.msgBody = m
                    this.msg.msgVisible = true
                    this.msg.msgAccion = 'aceptar'
                    this.msg.msgButtons = ['Aceptar']
                  }
                })
                .catch(err => {
                  console.log(err)
                })
          
              } else if ( this.tab == 'clientesyproveedores') {

                // ORDENO EL ARRAY DE GRUPOS PARA QUE SE PAREZA A: PADRE > HIJO > NIETO
                debugger
                return HTTP().get('/tercerosimp')
            
                  .then(({ data }) => {
  
                    debugger
                    if (data) {
                      for (let i=0; i<=data.length-1; i++) {
                        this.mios.push({ 
                          cuit: data[i].cuit,
                        })
                      }

                      debugger
                      this.items = []
                      this.encontrados = 0
                      for (let i=0; i<=this.itemsExcel.length-1; i++) {
                        if (this.mios.findIndex(x => x.cuit == this.itemsExcel[i].cuit)==-1) {
                          this.aImportar ++
                          this.items.push({
                            estado: 'N',
                            seleccionado: false,
                            cuit: this.itemsExcel[i].cuit
                          })
                        } else {
                          this.encontradosXls ++
                        }
                      }
  
                      this.progress = false
                      if (this.aImportar==0) {
                        this.msg.msgTitle = 'No hay Cuentas nuevas'
                        let m = '¡Todas las Cuentas especificadas en el archivo de Excel seleccionado<br>'
                        m += 'ya existen en la base de datos. No se pueden volver a Importar.'
                        this.msg.msgBody = m
                        this.msg.msgVisible = true
                        this.msg.msgAccion = 'aceptar'
                        this.msg.msgButtons = ['Aceptar']
                      } else {
                        let m = ''
                        if (this.aImportar==1) {
                          this.msg.msgTitle = '¡Hay una nueva Cuenta!'
                          m = '¡Se ha encontrado una cuenta nueva para ser importada.<br>'
                        } else {
                          this.msg.msgTitle = '¡Hay cuentas nuevas!'
                          m = '¡Se han encontrado '+this.aImportar+' cuentas nuevas para ser importadas.<br>'
                        }
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

              }
            })

        } catch (exception) {
        }
      } else {
        this.xlsCargado = false;
      }
    },





    setTab(cual) {
      this.items = []
      this.tab = cual
      let ids = []
      let g = []

      g.push('FERRETERIA')
      g.push('FERRETERIA > FIJACIONES')
      g.push('FERRETERIA > FIJACIONES > TORNILLOS')
      g.push('FERRETERIA > FIJACIONES > BULONES')
      g.push('FERRETERIA > PINTURERIA')
      g.push('FERRETERIA > PINTURERIA > PINTURAS')
      g.push('FERRETERIA > PINTURERIA > PINTURAS > LATEX')
      g.push('FERRETERIA > PINTURERIA > PINTURAS > AL AGUA')
      g.push('FERRETERIA > PINTURERIA > PINCELES')

      ids.push({nombre:'FERRETERIA',id:0})

      if (this.tab == 'reglas') {

        for (let i=1; i<=g.length-1; i++) {

          let renglon = g[i]
          let lDone = true
          let grupo = ''
          let padre = 0

          while (lDone) {
            let pos = renglon.indexOf('>')
            if (pos!=-1) {
              grupo = renglon.substring(0,pos-1).trim()

              // busco si ya agrego, si esta saco el id, sino agrego en marcador de id
              let posids = ids.findIndex(i => i.nombre === grupo);
              if (posids!=-1) {
                padre = posids //ids[posids].id
              } else {
                ids.push({nombre: grupo, id: ids.length+1})
              }
              renglon = renglon.substring(pos+1, renglon.length).trim()

            } else {

              grupo = renglon
              let posids = ids.findIndex(i => i.nombre === grupo);
              if (posids!=-1) {
                padre = ids[posids].id
              } else {
                ids.push({nombre: grupo, id: padre })
              }

              lDone = false

            }
          }

          // veo cuantos > hay en el renglon
          //for (let j=0; j<=renglon.length-1; j++) {
          //  if (renglon[j]=='>') {
          //    niveles ++
          //  }
          //}

          // ahora ciclo los niveles
          //for (let j=0; j<=niveles-1; j++) {
            //grupo =
          //} 
          
        }

      }

    },





    async parseFileContent(sheet) {

      let abc = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

      this.itemsExcel = []
      if (this.tab=='articulos') {
        
        for (let i=0; i<=this.cfgExcel.length-1; i++) {
  
          // cargo las columnas donde estan los datos
          let pcod    = this.cfgExcel[i].codigo
          let pnom    = this.cfgExcel[i].nombre
          let pgru    = this.cfgExcel[i].grupo
          let pmar    = this.cfgExcel[i].marca
          let pprecio = this.cfgExcel[i].precio
          let pconiva = this.cfgExcel[i].coniva
          let ptasiva = this.cfgExcel[i].tasaiva
          let pmoneda = this.cfgExcel[i].moneda
  
          // paso a variables las posiciones de las columnas, 'A'=1', 'B'=2, etc.
          let ccod = pcod != '' ? abc.indexOf(pcod) : -1
          let cnom = pnom != '' ? abc.indexOf(pnom) : -1
          let cgru = pgru != '' ? abc.indexOf(pgru) : -1
          let cmar = pmar != '' ? abc.indexOf(pmar) : -1
          let cpre = pprecio != '' ? abc.indexOf(pprecio) : -1
          let civa = ptasiva != '' ? abc.indexOf(ptasiva) : -1
          let cmon = pmoneda != '' ? abc.indexOf(pmoneda) : -1
  
          // si no se definieron en el json estas columnas salgo, ( corregir el json )
          if (ccod==-1 || cnom==-1 || cpre==-1) {
            return 0
          }
  
          for (let j=Number(this.cfgExcel[i].comienza)-1; j<=sheet.length-1; j++) {
  
            let r = sheet[j]
            if (r[ccod]!=undefined && r[cnom]!=undefined && r[cpre]!=undefined && !isNaN(r[cpre])) {
  
              let cod = r[ccod].toString()
              let arr = cod.split('')
              let pos = 0
              let res = ''
              for (let k=arr.length-1; k>=0; k--) {
                if (arr[k]!=' ') {
                  pos = k
                  break
                }
              }
              for (let k=0; k<=pos; k++) {
                res = res + arr[k]
              }
              res = res + '@' + this.userId
  
              let precio = r[cpre]
              if (pconiva=='S') {
                if (ptasiva!='') {
                  precio = precio / (1+(ptasiva/100))
                } else {
                  precio = precio / (1.21)
                }
              }

              let grupo =  cgru==-1 ? 'GENERAL'  : r[cgru]
              let marca =  cmar==-1 ? 'GENERICA' : r[cmar]
              let tasiva = civa==-1 ? '21'       : r[civa]
              let moneda = cmon==-1 ? 'PES'      : r[cmon]
  
              this.itemsExcel.push({
                codigo: res,
                nombre: r[cnom],
                marca:  { id: 0, nombre: marca },
                grupo:  { id: 0, nombre: grupo },
                precio: precio,
                tasiva: r[civa] == null ? 21 : tasiva,
                moneda: r[cmon] == null ? 'PES' : moneda,
                estado: 'N',
                seleccionado: false
              })
            }
          }
        }

      } else if (this.tab=='marcas') {

        for (let i=0; i<=this.cfgExcel.length-1; i++) {
  
          // cargo la columna donde estan los datos
          let pnom    = this.cfgExcel[i].nombre
            // paso a variables las posiciones de las columnas, 'A'=1', 'B'=2, etc.
          let cnom = pnom != '' ? abc.indexOf(pnom) : -1
            // si no se definieron en el json estas columnas salgo, ( corregir el json )
          if (cnom==-1) { return 0 }
          for (let j=Number(this.cfgExcel[i].comienza)-1; j<=sheet.length-1; j++) {
            let r = sheet[j]
            if (r[cnom]!=undefined) {
              this.itemsExcel.push({
                nombre: r[0].trim(),
                estado: 'N',
                seleccionado: false
              })
            }
          }
        }

      } else if (this.tab=='grupos') {

        for (let i=0; i<=this.cfgExcel.length-1; i++) {
  
          // cargo la columna donde estan los datos
          let pnom    = this.cfgExcel[i].nombre
            // paso a variables las posiciones de las columnas, 'A'=1', 'B'=2, etc.
          let cnom = pnom != '' ? abc.indexOf(pnom) : -1
            // si no se definieron en el json estas columnas salgo, ( corregir el json )
          if (cnom==-1) { return 0 }
          for (let j=Number(this.cfgExcel[i].comienza)-1; j<=sheet.length-1; j++) {
            let r = sheet[j]
            if (r[cnom]!=undefined) {
              this.itemsExcel.push({
                nombre: r[0].trim(),
                estado: 'N',
                seleccionado: false
              })
            }
          }
        }

      } else if (this.tab=='clientesyproveedores') {

        for (let i=0; i<=this.cfgExcel.length-1; i++) {
  
          // cargo la columna donde estan los datos
          let pnom    = this.cfgExcel[i].nombre
            // paso a variables las posiciones de las columnas, 'A'=1', 'B'=2, etc.
          let cnom = pnom != '' ? abc.indexOf(pnom) : -1
            // si no se definieron en el json estas columnas salgo, ( corregir el json )
          if (cnom==-1) { return 0 }
          for (let j=Number(this.cfgExcel[i].comienza)-1; j<=sheet.length-1; j++) {
            let r = sheet[j]
            if (r[cnom]!=undefined) {
              this.itemsExcel.push({
                nombre: r[0].trim(),
                estado: 'N',
                seleccionado: false
              })
            }
          }
        }
      }
      this.registrosXls = this.itemsExcel.length;
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




/*
    async fetchGrupos(item) {
      this.rubro_id = item.id
      return HTTP().get('/gruposrubros/'+item.id)
      .then(response => {
        let aux = [];
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
        this.usersGrupos = getNestedChildren2(aux,0)
        return
      })
    },
*/
    
    puedoDesactivar(item) {
      function buscoNodo(arr) {
        let ids = []
        ids.push({nombre: arr.name})
        if (arr.children!=undefined) {
          for (let i=0; i<=arr.children.length-1; i++) {
            ids.push(buscoNodo(arr.children[i]))
          }
        }
        return ids
      }
      let it = []
      for (let j=0; j<=item.length-1; j++) {
        it.push(buscoNodo(item[j]))
      }
      return it
    },
/*
    strDeGrupos(item) {
      let anterior = ''
      function buscoNodo(arr, anterior) {
        let dat = []
        if (anterior.length>0) {
          dat.push(anterior+'>'+arr[0].nombre)
        } else {
          dat.push(arr[0].nombre)
        }
        for (let i=0; i<=arr.length-1; i++) {
          if (arr[i].length>0) {
            //anterior += arr[i-1].nombre
            dat.push(buscoNodo(arr[i], anterior))
          } else {
            anterior = arr[i].nombre
          }
        }
        return dat
      }
      return buscoNodo(item, anterior)
    },
*/

    strDeGrupos(item) {

      let dat = []
      let pat1 = '' //item[0].nombre
      let pat2 = ''
      let pat3 = ''
      let pat4 = ''
      let pat5 = ''
      let pat6 = ''
      let pat7 = ''
      //dat.push(pat1)

      for (let i=0; i<=item.length-1; i++ ) {
        if (item[i].length>0) {
          for (let j=0; j<=item[i].length-1; j++) {
            if (!item[i][j].length) {
              dat.push(item[i][j].nombre)
              pat1 = item[i][j].nombre
            } else {
              for (let k=0; k<=item[i][j].length-1; k++) {
                if (!item[i][j][k].length) {
                  dat.push(pat1+' > '+ item[i][j][k].nombre)
                  pat2 = pat1+' > '  + item[i][j][k].nombre
                } else {
                  for (let l=0; l<=item[i][j][k].length-1; l++) {
                    if (!item[i][j][k][l].length) {
                      dat.push(pat2+' > '+ item[i][j][k][l].nombre)
                      pat3 = pat2+' > '  + item[i][j][k][l].nombre
                    } else {
                      for (let m=0; m<=item[i][j][k][l].length-1; m++) {
                        if (!item[i][j][k][l][m].length) {
                          dat.push(pat3+' > '+ item[i][j][k][l][m].nombre)
                          pat4 = pat3+' > '  + item[i][j][k][l][m].nombre
                        } else {
                          for (let n=0; n<=item[i][j][k][l][m].length-1; n++) {
                            if (!item[i][j][k][l][m][n].length) {
                              dat.push(pat4+' > '+ item[i][j][k][l][m][n].nombre)
                              pat5 = pat4+' > '  + item[i][j][k][l][m][n].nombre
                            } else {
                              for (let o=0; o<=item[i][j][k][l][m][n].length-1; o++) {
                                if (!item[i][j][k][l][m][n][o].length) {
                                  dat.push(pat5+' > '+ item[i][j][k][l][m][n][o].nombre)
                                  pat6 = pat5+' > '  + item[i][j][k][l][m][n][o].nombre
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      return dat
    },


  }
};

</script>

<style scoped>
  .titulofont {
    /*font-family: Verdana, Arial, Helvetica, sans-serif;*/
    /*font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;*/
    font-family: Graphik,sans-serif;
    font-size: 150%;
  }
  .minifont {
    /*font-family: Verdana, Arial, Helvetica, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 84%;
  }
  .bigfont {
    font-family: Graphik,sans-serif;
    font-size: 1.115rem;
    line-height: 1.8rem;
    color: gray;
  }
</style>