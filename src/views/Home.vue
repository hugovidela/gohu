<template>
  <div id="app">
    <v-layout class="mt-0" row wrap justify-center>
      <v-flex>
        <v-container fluid v-if="$store.state.activo && $store.state.ofertas">
          <v-row v-if="$store.state.tipo=='MI' && !$store.state.hayCarrito">
            <div v-for="(prov, i) in $store.state.proveedores.slice(1)" :key="i">
<!--
              <v-hover>
                <v-avatar
                  v-if="hover || $store.state.proveedor.id===prov.id"
                  size="65px"
                  slot-scope="{ hover }">
                  <v-img
                    alt="Avatar"
                    :src="`/images/${prov.avatar}`"
                    @click="cambioProveedor(prov)">
                  </v-img>
                </v-avatar>
                <v-avatar v-else size="50px">
                  <v-img
                    :src="`/images/${prov.avatar}`"
                    @click="cambioProveedor(prov)">
                  </v-img>
                </v-avatar>
              </v-hover>
-->
              <v-avatar
                :size="$store.state.proveedor.id===prov.id ? '65px' : '50px'"
                class="mt-0 ml-2 mr-2">
                <v-img
                  alt="Avatar" :src="`/images/${prov.avatar}`"
                  @click="cambioProveedor(prov)">
                </v-img>
              </v-avatar>
            </div>
          </v-row>

          <v-row v-show="$store.state.publicaciones.length>0">
            <v-col cols="4" sm="4" md="4">
              <v-chip-group column v-if="publicacionesOReglas[0].ctt+publicacionesOReglas[1].ctt>0">
                <v-chip v-if="publicacionesOReglas[0].ctt>0"
                  class="ml-3 ma-2" outlined multiple
                  @click="filtrarPublicacionesOReglas(publicacionesOReglas[0])">
                  {{ publicacionesOReglas[0].nombre }}
                  <v-avatar v-if="publicacionesOReglas[0].sel">
                    <v-icon>mdi-checkbox-marked-circle</v-icon>
                  </v-avatar>
                </v-chip>
                <v-chip v-if="publicacionesOReglas[1].ctt>0"
                  class="ml-3 ma-2" outlined multiple
                  @click="filtrarPublicacionesOReglas(publicacionesOReglas[1])">
                  {{ publicacionesOReglas[1].nombre }}
                  <v-avatar v-if="publicacionesOReglas[1].sel">
                    <v-icon>mdi-checkbox-marked-circle</v-icon>
                  </v-avatar>
                </v-chip>
              </v-chip-group>
            </v-col>
          </v-row>

          <v-row v-if="publicacionesOReglas[0].sel==true">
            <v-col cols="4" sm="4" md="4">
              <div class="text-center" v-if="grupos.length>0">
                <v-chip-group column v-if="grupos.length>1">
                  <v-chip v-for="(gru, i) in grupos" :key="i"
                    class="ml-3 ma-2" outlined multiple
                    @click="filtrarPorGrupo(gru)">
                    {{ gru.nombre }}
                    <v-avatar v-if="gru.sel">
                      <v-icon>mdi-checkbox-marked-circle</v-icon>
                    </v-avatar>
                  </v-chip>
                </v-chip-group>
              </div>
            </v-col>

            <v-col cols="8" sm="8" md="8" class="pt-6" >
              <v-card v-if="carro.length>0 && publicacionesOReglas[0].sel==true"
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

          <!-- INICIA PULICACIONES -->
          <v-row v-show="$store.state.publicaciones.length>0 && publicacionesOReglas[0].sel==true">
            <v-col cols="12" sm="12" md="12">
              <v-card flat>
                <v-container fluid class="pt-0">
                  <v-row justify="start">
                    <v-col
                      v-for="(item,i) in $store.state.publicaciones" :key="i" :src="item.src">
                      <div class="contenedor-galeria">
                        <v-hover v-slot="{ hover}">
                          <v-card class="mx-auto my-12" max-width="250"
                            :elevation="hover ? 12 : 1"
                            open-delay="200"
                            :class="{ 'on-hover': hover }">
                            <template slot="progress"></template>
                            <v-btn class="mt-2 ml-2" v-if="item.detalles!=null"
                              fab x-small icon
                              @click="verDetallesDeLaPublicacion(item)">
                              <v-icon>mdi-format-align-justify</v-icon>
                            </v-btn>

                            <v-img v-if="item.fotos.length>0" height="150"
                              :eager="true"
                              :src="item.fotos[0].foto"
                              class="galeria__img mt-4 mb-4"
                              @click="verFotos(item)">
                            </v-img>
                            <v-img v-else height="100"
                              :src="`/images/Sin Imagen.jpg`">
                            </v-img>
<!--
                            <v-img v-if="item.fotos.length>0" height="150"
                              :src="`/images/${item.fotos[0].foto}`"
                              class="galeria__img mt-4 mb-4"
                              @click="verFotos(item)">
                            </v-img>
                            <v-img v-else height="100"
                              :src="`/images/Sin Imagen.jpg`">
                            </v-img>
-->
                            <v-divider class="mx-1"></v-divider>
                            <v-card-text class="pt-2 pb-2">
                              <div class="contenedor-galeria-fuente-importe">
                                ${{elPrecio(item,'original')}}
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

                                {{item.fotos[0].foto}}

                              </div>
                              <div>
                                <div class="contenedor-galeria-fuente-articulo">
                                  {{item.articulo.nombre}}
                                  {{item.fotos[0].redeable}}
                                </div>
                                <div class="contenedor-galeria-fuente-articulo">
                                  {{item.articulo.codigo}}
                                </div>
                              </div>
                            </v-card-text>
                            <v-divider class="mx-4"></v-divider>
                            <v-card-text>
                              <v-row>
                                <v-col cols="4" sm="4" md="4" class="pt-4">
                                  <v-tooltip bottom
                                     v-if="item.unidades>0
                                     && $store.state.operarioVendedor==false">
                                    <template v-slot:activator="{ on }">
                                      <v-btn
                                        class="ml-0"
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
                                        @click="agregarAlCarrito(item)" v-on="on">
                                        <v-icon dark>mdi-cart</v-icon>
                                      </v-btn>
                                    </template>
                                    <span>Enviar a pedidos</span>
                                  </v-tooltip>
                                </v-col>
                              </v-row>
                            </v-card-text>
                          </v-card>
                        </v-hover>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
          <!-- FINALIZA PUBLICACIONES-->

          <v-row v-show="reglasDelTer.length>0 && publicacionesOReglas[1].sel==true"
            class="pt-6">
            <v-col cols="12" sm="12" md="12">
              <v-card flat>
                <v-container fluid class="pt-0">
                  <v-row justify="start">
                    <v-col
                      v-for="(item,i) in reglasDelTer" :key="i">
                      <div class="contenedor-galeria">
                        <v-hover v-slot="{ hover}">
                          <v-card class="mx-auto my-12" max-width="250"
                            :elevation="hover ? 12 : 1"
                            open-delay="200"
                            :class="{ 'on-hover': hover }">

                            <v-system-bar :color="$store.state.temas.barra_principal_bg" dark>
                              <v-spacer></v-spacer>
                            </v-system-bar>

                            <template slot="progress"></template>
                            <v-divider class="mx-1"></v-divider>
                            <v-card-text class="pt-2 pb-2">
                              <div class="contenedor-galeria-fuente-importe">
                                <strong>{{item.nombre}}</strong>
                                <v-divider></v-divider>
                                <v-row v-for="(unds,iu) in item.unidades" :key="iu">
                                  <v-col cols="8"
                                    class="contenedor-galeria-fuente-final-unds pt-0 pb-0">
                                    <span>
                                      llevando <b>{{unds.unidades}} und/s.</b>
                                    </span>
                                  </v-col>
                                  <v-col cols="4" class="pt-0 pb-0">
                                    <span class="contenedor-galeria-fuente-descuento-unds">
                                      {{unds.descuento}}% desc.
                                    </span>
                                  </v-col>
                                </v-row>
                                <v-divider></v-divider>
                              </div>
                              <div class="contenedor-galeria-fuente-final mb-2 mt-0">
                                <div>
                                  Válido hasta el
                                  <strong>
                                    {{ formatoFechaCorta(item.vencimiento) }}
                                  </strong>
                                </div>
                              </div>
                              <div class="contenedor-galeria-fuente-final mb-2">
                                <div><strong>Detalles</strong></div>
                                <div>
                                  {{ item.descripcion }}
                                </div>
                              </div>
                              <div
                                :class="item.activo ?
                                'caption green--text font-weight-bold':
                                'caption red--text font-weight-bold'">
                                {{item.activo ? 'Activa' : 'Pausada'}}
                              </div>
                            </v-card-text>
                          </v-card>
                        </v-hover>
                      </div>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card>
            </v-col>
          </v-row>

        </v-container>

        <!-- DIALOGO DETALLES DE LA PUBLICACION -->
        <v-dialog v-model="dialogDetalles" max-width="700px" persistent
          v-show="$store.state.activo">
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
          v-show="$store.state.activo">
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

        <!-- GRAFICOS -->
        <v-row v-show="$store.state.graficos">
          <v-card flat class="pt-0">
            <v-card-text>
              <v-row align="center" justify="center" class="pl-8">
                <v-btn-toggle v-model="toggle_exclusive" mandatory>
                  <v-btn v-for="(g, i) in grafTip" :key="i"
                    outlined small class="ma-2 text-capitalize"
                    :color="$store.state.temas.forms_btn_add_bg"
                    :dark="$store.state.temas.barra_principal_dark"
                    @click="grafPreparo(g)">
                    {{ g }}
                  </v-btn>
                </v-btn-toggle>
              </v-row>
            </v-card-text>
          </v-card>
        </v-row>

        <v-row v-show="$store.state.graficos"
          class="pt-0" align="center" justify="center">
          <v-col cols="12" sm="12" md="12">
            <v-card tile outlined class="mx-auto text-center" max-width="1200">
              <v-card-text>
                <v-sheet>
                  <v-sparkline
                    :value="grafVal"
                    :labels="grafLab"
                    :color="$store.state.temas.barra_principal_bg"
                    :dark="$store.state.temas.barra_principal_dark"
                    height="80"
                    label-size="4"
                    padding="24"
                    stroke-linecap="round"
                    smooth>
                    <template v-slot:label="item">
                      {{ item.value }}
                    </template>
                  </v-sparkline>
                </v-sheet>
              </v-card-text>
              <v-card-text>
                <v-btn icon @click="grafAnterior" v-show="this.grafSel!='Anual'">
                  <v-icon>mdi-arrow-left-bold-circle-outline</v-icon>
                </v-btn>
                {{grafSay}}
                <v-btn icon @click="grafSiguiente" v-show="this.grafSel!='Anual'">
                  <v-icon>mdi-arrow-right-bold-circle-outline</v-icon>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <!-- FIN DE GRAFICOS -->

        <!-- MENSAJE INICIAL ESTO DEBERIA IR -->
        <v-container fluid v-show="
          $store.state.inicial && $store.state.activo && !$store.state.ofertas">
          <v-card flat height="1550" width="1200" class="pt-0">
            <v-card-text class="contenedor-galeria-fuente-final pt-0">
              ¡Gracias por confiar en nosotros!<br><br>
              <div v-if="!$store.state.externo">
                Ahora tienes que cofigurar tu cuenta, ¡es fácil!.<br><br>
                <b>gohu</b> ya la inicializó, creó dos sucursales, una de producción
                y la otra de puebas, ambas con sus respectivos depósitos de stock.<br>
                También se te asignó el cliente CONSUMIDOR FINAL y tu primer proveedor:
                <b>gohu</b>.
                <br><br>
                Ahora vamos a necesitar que completes toda la información necesaria
                para que puedas comenzar a trabajar rapidamente.<br><br>
                Ve a tu perfil: icono
                <v-icon>account_box</v-icon> de la barra principal,
                y define los siguientes datos:<br><br>
                <li> Carga tus certificados digitales de AFIP. Te permitirán realizar comprobantes
                  electrónicos y leer datos de contribuyentes al momento de cargar Clientes y
                  Proveedores.</li><br>
                <li> Revisa los nombres de las sucursales y depósitos asignados automaticamente,
                puedes agregar los que necesites.</li><br>
                <li> Si vas a utilizar más de una sucursal, define un <i>tema</i> distinto para
                cada una de ellas. ¡Vas a poder identificarlas mas claramente!.</li><br>
                <li>Carga tu avatar y el logo de tu Empresa, estos se imprimirán en los listados
                  y comprobantes oficiales.
                </li><br>
                <li>
                  Revisa tu porcentaje de remarcación global.
                  <b>gohu</b> permite administrar estos porcentajes en forma muy flexible,
                  por Marcas, por Grupos e incluso por cada artículo.
                </li><br>
                <li>
                  En <b>gohu</b> ya existen una gran cantidad de CUIT's cargados.
                  Puedes ingresar a Clientes y Proveedores para ver si ellos ya existen en nuestas
                  bases de datos desde boton <i>Incluir</i> de la barra principal del formulario
                  correspondiente. De todas formas, si necesitas cargar cuentas que aún no estén en
                  <b>gohu</b>, el sistema las importa desde AFIP. Solo deberás ingresar el CUIT
                  al momento de la carga. ¡Tambien puedes importarlos!, sigue leyendo.
                </li><br>
                <li>¡Importa tus datos!. Ingresa al menú <i>Configuración</i> >
                  <i>Migración de Datos</i> y revisa la solapa <i>Reglas para importar</i>.
                  Allí esta toda la información que necesitas para que prepares tus archivos Excel.
                  <br><b>gohu</b> te permitirá importar Artículos, Marcas, Grupos, Clientes y
                  Proveedores, con sus saldos inciales de Cuentas Corrientes.<br><br>
                  Muchos usuarios que ya utilizan <b>gohu</b> recurren a las migraciones
                  al momento de cargar grandes cantidades de datos, por ejemplo, un lista
                  de artículos nuevos de un proveedor. Es un proceso mucho mas rápido.<br><br>
                </li>

                <li>¡Organiza tus artículos!. Define grupos y subgrupos y asignalos a tus
                  artículos o a los de tus proveedores, puedes hacerlo facilmente y en forma masiva
                  desde la opción <i>Artículos/Cambios Masivos</i>
                </li><br><br>

                Te recordamos que puedes <i>vincularte</i> con tus
                <span v-if="$store.state.tipo=='MD'">
                  clientes
                </span>
                <span v-else>
                  proveedores
                </span>
                que utilicen <b>gohu</b>, podrás compartir datos ahorrando tiempo y recursos.<br>
                <br><br>


              </div>
              <div v-else-if="$store.state.externo">
                <div v-if="$store.state.tipo=='MD'">
                  Intentamos facilitar la operatoria comercial con tus clientes.<br><br>
                  Invita a tus clientes para que se unan a <b>gohu</b> y hacer que todos
                  ellos formen parte de tu <i>Granja Comercial</i>.<br>
                  Luego ingresa al icono <v-icon>mdi-share-variant</v-icon> de la barra principal
                  y comienza a vincularte con ellos. Quizás ya varios de ellos ya esten allí.
                  <br><br>

                  ¡Sube tus artículos y precios a <b>gohu</b>.<br>
                  Agrega fotos a tus artículos y realiza publicaciones.<br>
                  Administra y asigna Grupos, Marcas a tus Artículos.
                  Puedes hacerlo artículo por artículo o en forma masiva.<br><br>

                  Tus clientes vinculados accederán en forma automática a tus Artículos, Precios
                  y Promociones, y podrán realizarte pedidos,<br> que recibirás
                  en formato Excel para que los imprimas o los importes a tu sistema.<br>

                  Nunca más tendrás que administrar tus precios en Excel o PDF para enviarselos
                  por correo tus clientes.
                  <br><br>
                  Ve a tu perfil y carga tu avatar y el logo de tu Empresa para que tus clientes
                  puedan identificarte mejor.<br><br>

                  Si decides ser usuario <b>gohu</b> activarás la versión <b>interpyme</b>.<br>
                  Un completo sistema de gestión comercial donde todas las operaciones con tus
                  clientes van por sistema.<br>
                  Ahorrarás mucho tiempo de carga y evitarás errores.<br><br>


                </div>
                <div v-else>
                  Intentamos facilitar la operatoria comercial con tus proveedores.<br><br>
                  Ingresa al icono <v-icon>mdi-share-variant</v-icon> de la barra principal
                  y comienza a vincularte con ellos.<br><br>
                  Algunos requerirán autorización y otros serán de acceso libre.<br>
                  Una vez vinculado se activará un proceso <i>espejo</i> donde todos sus<br>
                  artículos, precios, promociones se reflajarán automaticamente
                  en tu sistema.<br>
                  <b>¡Siempre estarás actualizado!</b><br><br>
                  Los proveedores marcados con (g) son administrados por <b>gohu</b><br>
                  Recibimos sus listas de precios diariamente y las procesamos para que<br>
                  los tengas actualizadas todos los días.<br><br>
                  Invita a tus proveedores preferidos a ser parte de <b>gohu</b>.<br>
                  O envíanos un correo a <b>admin@gohu.com.ar</b> informándonos de cuales son.<br>
                  Los contactaremos y acordaremos para obtener sus listas y así poder<br>
                  administrarlas, para que tengas todo el tiempo la información actualizada
                  en un solo lugar.<br><br>
                  Ve a tu perfil y carga tu avatar y el logo de tu Empresa para que tus<br>
                  proveedores puedan identificarte mejor.
                </div>
              </div>
              <div>
                <br>
                <v-btn tile outlined class="text-none" @click="noVerMasElMensajeInicial()">
                  ¡No ver mas este mensaje!
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-container>
        <!-- FIN DIALOGO INICIAL -->

        <!--
        <v-container fluid v-show="$store.state.tipo=='UG' && !$store.state.activo">
          <v-card height="1550" width="1200" class="mx-auto">
            <v-list-item>
              <v-list-item-avatar color="grey">
                <v-img height="40" width="40" src="/images/logoGoHu.jpg"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="caption">
                  Gohu {{ $store.state.tipo }} {{ $store.state.activo }}
                </v-list-item-title>
                <v-list-item-subtitle></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-card-text class="text--primary">
              <div>
                <br>
                <b>gohu</b> es un ERP fácil de utilizar y donde todo esta integrado.<br><br>
                El objetivo de <b>gohu</b> es intentar facilitar y optimizar las operaciones
                de las empresas. ¿Como? Uniendo y compartiendo esfuerzos<br><br>

                Para lograr este objetivo <b>gohu</b> implemento un sistema de
                <i><b>vinculaciones</b></i> que permiten agilizar enormemente sus operatoria
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
              </div>
              <div v-show="!yaEstaNotificado">
                <br>
                <v-btn class="text-capitalize" @click="notificar(1)">
                  Bienvenidos !!!
                </v-btn>
              </div>
              <div v-show="yaEstaNotificado">
                <br>
                <b>Gohu ya esta notificado de su pedido. En breve sera contactado por mail para
                avanzar con el registro y configuracion del sistema. Revise su correo. Desde ya,
                muchas gracias por apoyarnos.</b>
              </div>

            </v-card-text>
          </v-card>
        </v-container>
        -->

        <!-- USUARIOS UG PERO SIN ACTIVAR PRESENTACION -->
        <v-container fluid v-show="isLoggedIn && !$store.state.activo">
          <v-card width="1270" class="mx-auto">
            <v-img
              class="ml-4"
              height="50"
              width="50"
              src="/images/logoGoHu.jpg">
            </v-img>
            <v-card-title v-show="!estaNotificado" class="contenedor-galeria-fuente-final">
              ¡Hola!<b>{{ $store.state.empresa }}</b>
            </v-card-title>
            <v-card-subtitle v-show="!estaNotificado" class="contenedor-galeria-fuente-final">
              Necesitamos que completes tu cuenta.
            </v-card-subtitle>
            <v-card-text class="contenedor-galeria-fuente-final">

              <div v-if="estaNotificado">
                <b>Gohu ya esta notificado de su pedido.<br>
                En breve sera contactado por mail para
                avanzar con el registro y configuración de tu cuenta.<br><br>
                Desde ya, muchas gracias por apoyarnos.</b>
              </div>
              <div v-else>
                <div v-if="$store.state.externo">
                  Has decidido utlilizar <b>la plataforma externa</b> de <b>gohu</b>.<br>
                  Si eres minorista podras ver los precios y promociones de todos tus
                  proveedores y realizarles pedidos.<br>
                  Si eres mayorista o productor podras importar tus artículos, administrar tus
                  precios y realizar promociones para que tus clientes puedan realizarte
                  pedidos.<br><br>
                  Recordamos que el acceso <b>externo</b> a <b>gohu</b> es totalmente gratuito.
                  <br><br>
                </div>
                <div v-else>
                  <b>gohu</b> trabaja bajo requerimientos AFIP, por lo tanto para poder
                  realizar operaciones en el sistema deberás
                  estar registrado en el organismo y tener activos tus certificados digitales.<br>
                  Estos certificados te permitrán realizar comprobantes electrónicos y acceder
                  desde AFIP a los datos de tus Clientes y Proveedores, ahorrado
                  tiempo de carga y evitando errores.<br><br>
                  Si posees tu certificado puede ser un buen momento para subirlo a nuestro
                  servidor, o si lo deseas puedes hacerlo más tarde desde tu perfil.<br>
                  Si no posees el certificado no hay problema, puedes generarlo en cualquier
                  momento e incluso, con mucho gusto, podemos generarlo por vos.<br><br>
                  Ingresa tu CUIT para ver como estan tus registros.<br><br>
                  <div v-if="$store.state.tipo=='UE'">
                    No obstante te invitamos a ver nuestros <b>videos</b>, quizas <b>gohu</b>
                    pueda ser de tu utilidad.<br><br>
                  </div>
                </div>
              </div>

              <div v-show="!estaNotificado">
                <v-row>
                  <v-col cols="6" sm="6" md="6" class="pt-0">
                    <span><b class="contenedor-galeria-fuente-final">Tu identificación</b></span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="2" sm="2" md="2" class="pt-0">
                    <v-text-field class="contenedor-galeria-fuente-final"
                      v-model="datosUE.cuit"
                      v-on:keydown.tab="buscoDocumento"
                      :color="$store.state.temas.forms_titulo_bg"
                      label="Tu CUIT (sin guiones)"
                      outlined required clearable autofocus
                      :rules="cuitRules"
                      :counter="11"
                      :maxlength="11"
                      @change="valido() && buscoDocumento()">
                    </v-text-field>
                  </v-col>
                  <v-col cols="3" sm="3" md="3" class="pt-0">
                    <v-file-input class="contenedor-galeria-fuente-final"
                      outlined
                      :color="$store.state.temas.forms_titulo_bg"
                      prepend-icon="mdi-file"
                      v-model="datosUE.crt"
                      label="Archivo CRT">
                      Archivo CRT
                    </v-file-input>
                  </v-col>
                  <v-col cols="3" sm="3" md="3" class="pt-0">
                    <v-file-input class="contenedor-galeria-fuente-final"
                      outlined
                      :color="$store.state.temas.forms_titulo_bg"
                      prepend-icon="mdi-file"
                      v-model="datosUE.key"
                      label="Archivo KEY">
                      Archivo KEY
                    </v-file-input>
                  </v-col>
                  <v-col cols="3" sm="3" md="3" class="pt-4 contenedor-galeria-fuente-final">
                    <span color='warning' v-if="datosUE.dondeEncontreLosDatos!=''">
                      Datos encontrados en
                      <strong class="red--text text--lighten-1">
                        {{ datosUE.dondeEncontreLosDatos }}
                      </strong>
                    </span>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="6" sm="6" md="6" class="pt-0">
                    <v-text-field class="contenedor-galeria-fuente-final"
                      v-model="datosUE.nombre"
                      label="Nombre"
                      required outlined disabled
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="nombreRules"
                      :counter="50" :maxlength="50"
                      @change="valido()"
                      @keyup="escribiendoNombre">
                    </v-text-field>
                  </v-col>
                  <v-col cols="6" sm="6" md="6" class="pt-0">
                    <v-text-field class="contenedor-galeria-fuente-final"
                      v-model="datosUE.razonsocial"
                      label="Razón Social"
                      outlined disabled
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="razonsocialRules"
                      :counter="80" :maxlength="80"
                      @change="valido()">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="3" sx="3" mx="3" class="pt-0">
                    <v-select class="contenedor-galeria-fuente-final"
                      label="Cond.Fiscal"
                      v-model="datosUE.responsable_id"
                      :items="itemsResponsables"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="responsableRules"
                      outlined disabled
                      item-value="id"
                      item-text="nombre"
                      @change="valido()">
                    </v-select>
                  </v-col>
                  <v-col cols="2" sm="2" md="2" class="pt-0">
                    <v-select class="contenedor-galeria-fuente-final"
                      label="Tipo de Documento"
                      v-model="datosUE.documento_id"
                      :items="itemsDocumentos"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="documentoRules"
                      outlined disabled
                      item-value="id"
                      item-text="nombre"
                      @change="valido()">
                    </v-select>
                  </v-col>
                  <v-col cols="4" sm="4" md="4" class="pt-0 pb-0">
                    <v-text-field class="contenedor-galeria-fuente-final"
                      v-model="datosUE.direccion"
                      label="Dirección"
                      :color="$store.state.temas.forms_titulo_bg"
                      :counter="40"
                      :maxlength="40"
                      outlined disabled
                      @change="valido()">
                    </v-text-field>
                  </v-col>
                  <v-col cols="3" sm="3" md="3" class="pt-0 pb-0">
                    <v-text-field class="contenedor-galeria-fuente-final"
                      v-model="datosUE.postalNombre"
                      label="Ciudad"
                      :color="$store.state.temas.forms_titulo_bg"
                      :counter="40"
                      :maxlength="40"
                      outlined disabled
                      @change="valido()">
                    </v-text-field>
                  </v-col>
                </v-row>
<!--
                <v-row>
                  <v-col cols="12" sm="12" md="12" class="pt-0">
                    <v-row>
                      <v-col cols="12" sm="12" md="12" class="pt-0">
                        <b class="contenedor-galeria-fuente-final">DATOS PARA VINCULACION</b>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="12" md="12" class="pt-0">
                        Una de las principales caracteristicas de <b>gohu</b> es permitir que
                        sus usuarios se <i>vinculen.</i><br>
                        Esta vinculación permite compartir datos y operaciones entre los
                        usuarios del sistema.<br>
                        La unica regla es que los usuarios definidos como <i>Mayoristas</i>
                        solo se podrán vincular con aquellos definidos como <i>Minoristas
                        </i> y viceversa.<br><br>

                        <b>Artículos, Precios y Promociones...</b><br>
                        Se terminó la era de enviar o recibir listas de precios por correo.<br>
                        Cada modificación de artículos y/o precios que realice tu proveedor,
                        se replicarán en forma instantánea en tu sistema.<br>
                        <br><br>

                        <b>Operaciones...</b><br>
                        Todas las operaciones entre usuarios <i>vinculados</i> irán por dentro
                        del sistema.<br>
                        Veamos un ejemplo típico: <br><br>
                        Realizas un pedido, tu proveedor lo recibe, lo descarga, lo factura,
                        y en ese instante el sistema te envía la factura.<br>
                        La recibes, la descargas y automaticamente se te actualizarán todos los
                        datos, IVA, stocks, ctas.ctes, etc..<br>
                        <i>¡Te ahorraste tener que cargar la compra!</i><br>
                        Luego pagas la factura, ingresas los valores, y cuando confirmas el pago
                        el sistema se lo envia a tu proveedor.<br>
                        El lo recibe, lo descarga, se emite un recibo automatico cancelando tu
                        cuenta corriente e ingresando a su sistema los valores que le enviaste.<br>
                        Y..., circuito finalizado.<br>
                        ¡Al menos interesante! ¿no?
                        <br><br>

                        <div v-if="$store.state.externo">
                        En cualquier momento podras cambiar a usuario <b>gohu</b><br>
                        Aquí la interacción con los otros usuarios será total.<br>
                        Operaciones de ventas, compras, recibos, pagos, etc,
                        irán por dentro del sistema simplificando enormemente<br> la carga de
                        comprobantes, ahorrando tiempo y evitando errores.
                        <br><br>
                        </div>

                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
-->
                <v-row>
                  <v-col cols="8" sm="8" md="8" class="pt-0">
                    <v-select class="contenedor-galeria-fuente-final"
                      v-model="rubValue"
                      :items="rubItems"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="rubrosRules"
                      multiple outlined chips required
                      label="¿A que Rubros perteneces?"
                      @change="valido()">
                    </v-select>
                  </v-col>
                  <v-col cols="4" sx="4" mx="4" class="pt-0">
                    <v-select class="contenedor-galeria-fuente-final"
                      v-model="datosUE.tipodeusuario"
                      :items="tip"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="comercializacionRules"
                      item-value="id"
                      item-text="nombre"
                      label="¿Como comercializas tus productos y/o servicios?"
                      outlined required
                      @change="valido()">
                    </v-select>
                  </v-col>
                </v-row>

                <v-row v-if="datosUE.tipodeusuario=='MD'">
                  <v-col cols="12" sm="12" md="12" class="pt-0">
                    <v-checkbox
                      :color="$store.state.temas.cen_btns_bg"
                      v-model="datosUE.accesolibre"
                      label=
                      "¿Activas Libre Acceso?, cualquier usuario podrá vincularse contigo sin
                      esperar de tu aprobación.">
                    </v-checkbox>
                  </v-col>
                </v-row>

                <v-row v-show="$store.state.tipo=='UG'">
                  <v-col cols="6" sm="6" md="6" class="pt-0">
                    <span class="contenedor-galeria-fuente-final">
                      <b>Datos de tu Negocio</b><br>
                      Cuando inicializas <b>gohu</b> el sistema genera dos sucursales.
                      Una operativa y la otra de prueba o demo. Ingresa los datos de la sucusal
                      operativa.
                    </span>
                  </v-col>
                </v-row>

                <v-row v-if="$store.state.tipo=='UG'">
                  <v-col cols="6" sm="6" md="6" class="pt-0">
                    <v-text-field class="contenedor-galeria-fuente-final"
                      v-model="datosUE.sucursalNombre"
                      label="Nombre de tu Sucursal/Negocio Unico"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="sucursalNombreRules"
                      required outlined
                      :counter="50"
                      :maxlength="50"
                      @change="valido()">
                    </v-text-field>
                  </v-col>
                  <v-col cols="3" sm="3" md="3" class="pt-0">
                    <v-text-field class="contenedor-galeria-fuente-final"
                      v-model="datosUE.sucursalAbreviado"
                      label="Nombre Abreviado"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="sucursalNombreAbreviado"
                      :counter="10"
                      :maxlength="10"
                      required outlined
                      @change="valido()">
                    </v-text-field>
                  </v-col>
                  <v-col cols="3" sm="3" md="3" class="pt-0">
                    <v-text-field class="contenedor-galeria-fuente-final"
                      v-model="datosUE.sucursalFiscal"
                      label="Código Fiscal de AFIP"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="codigoFiscalAfip"
                      :counter="4"
                      :maxlength="4"
                      required outlined
                      @change="nroSucursal() && valido()">
                    </v-text-field>
                  </v-col>
                </v-row>

                <v-row v-if="$store.state.tipo=='UG'">
                  <v-col cols="2" sm="2" md="2" class="pt-0">
                    <v-text-field class="contenedor-galeria-fuente-final"
                      type="date"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="inicioDeActividad"
                      v-model="datosUE.sucursalInicioDeActividad"
                      required outlined
                      label="Inicio de Actividades"
                      @change="valido()">>
                    </v-text-field>
                  </v-col>
                  <v-col cols="2" sm="2" md="2" class="pt-0">
                    <v-text-field class="contenedor-galeria-fuente-final"
                      type="number"
                      v-model="datosUE.porRemarcacion"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="porRemarcacion"
                      label="% de Rem.Global"
                      required outlined
                      @change="valido()">>
                    </v-text-field>
                  </v-col>
<!--
                  <v-col cols="2" sx="2" mx="2" class="pt-0">
                    <v-select class="contenedor-galeria-fuente-final"
                      v-model="datosUE.sucursalRefresco"
                      :color="$store.state.temas.forms_titulo_bg"
                      :item-color="$store.state.temas.forms_titulo_bg"
                      :items="timeoutRefreshList"
                      item-value="id"
                      item-text="segundos"
                      label="Segundos para refrescar"
                      required outlined
                      @change="valido()">>
                    </v-select>
                  </v-col>
-->
<!--
                  <v-col cols="3" sx="3" mx="3" class="pt-0">
                    <v-text-field class="contenedor-galeria-fuente-final"
                      type="number"
                      v-model="datosUE.diaDeFacturacion"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="diaDeFacturacion"
                      label="Día del mes para recibir la factura de GOHU"
                      required outlined
                      @change="valido()">>
                    </v-text-field>
                  </v-col>
-->
                  <v-col cols="3" sx="3" mx="3" class="pt-0">
                    <v-text-field class="contenedor-galeria-fuente-final"
                      :color="$store.state.temas.forms_titulo_bg"
                      :rules="nombreDelDeposito"
                      v-model="datosUE.sucursalDepositoNombre"
                      required outlined
                      label="Nombre del Depósito (Stock)"
                      :counter="30"
                      :maxlength="30"
                      @change="valido()">>
                    </v-text-field>
                  </v-col>
                  <v-col cols="2" sx="2" mx="2" class="pt-0">
                    <v-select class="contenedor-galeria-fuente-final"
                      v-model="datosUE.sucursalTema"
                      :color="$store.state.temas.forms_titulo_bg"
                      :item-color="$store.state.temas.forms_titulo_bg"
                      :items="lostemas"
                      required outlined
                      label="Tema"
                      @change="valido()">>
                    </v-select>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sx="12" mx="12" class="pt-0">
                    <v-textarea
                      v-model="datosUE.observ"
                      :color="$store.state.temas.forms_titulo_bg"
                      label="Describe brevemente tu empresa, tus formas de comercialización, etc.
                             Lo que aquí escribas es lo que verán el resto de los usuarios en el
                             panel de vinculaciones."
                      auto-grow
                      outlined
                      rows="3"
                      row-height="25"
                      shaped>
                    </v-textarea>
                  </v-col>
                </v-row>

                <div v-show="formOk==true">
                  <!--
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-0 contenedor-galeria-fuente-final">
                      <div v-if="$store.state.externo">
                        Una vez registrado, podras ingresar a tu perfil para ver a todos los
                        usuarios compatibles.<br>
                        Ellos serán notificados de tu registro, asique a la brevedad, ¡tendrás
                        novedades!.<br>
                      </div>
                      <div v-else>
                        Se enviará una notificación a <b>gohu</b> de tu registro.<br>
                        A la brevedad nos contactaremos a tu correo electrónico para avisarte
                        que su cuenta esta lista para ser utilizada.<br>
                      </div>
                      <br><br>
                    </v-col>
                  </v-row>
                  -->
                  <v-row>
                    <v-col cols="12" sx="12" mx="12" class="pt-0">
                      <v-btn
                        class="contenedor-galeria-fuente-final"
                        @click="guardarUE">
                        Guardar Datos y enviar Notificación
                      </v-btn>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-container>

      </v-flex>
    </v-layout>
    <impresiones ref="impresion"></impresiones>
    <Confirmacion v-model='msg.msgAccion'
      :title=this.msg.msgTitle
      :body=this.msg.msgBody
      :visible=this.msg.msgVisible
      :buttons=this.msg.msgButtons
      @click="msgRespuesta">
    </Confirmacion>
  </div>

</template>


<script>
 /* eslint-disable */
import HTTP from '../http';
import router from '../router';
import { mapGetters, mapMutations, mapState } from 'vuex';
import SBar from './Forms/snackbar.vue';
import moment from 'moment';
import Confirmacion from "./Forms/confirmacion.vue";
import impresiones from "./Forms/impresiones.vue";

export default {
  components: {
    SBar,
    Confirmacion,
    impresiones,
  },

  data: () => ({
    //cuentaYaAsignada: false,
    //terceroAIncorporar: null,
    toggle_exclusive: false,
    grafTip: [
      'Diario',
      'Semanal',
      'Mensual',
//    'Bimestral',
//    'Trimestral',
//    'Cuatrimestral',
//    'Semestral',
      'Anual'],
    grafSel: '',
    grafSay: '',
    grafVal: [],
    grafLab: [],
    grafDes: '',
    grafHas: '',
    grupos: [],
    publicacionesOReglas: [{sel: true, nombre: 'Publicaciones', ctt: 0}, {sel: false, nombre: 'Tus Descuentos', ctt: 0}],
    carro: [],
    totalCarro: 0,
    ctt: 0,
    cuitRules: [
      v => !!v || 'El cuit es requerido',
      v => (v && v.length <= 11) || 'Ingrese hasta 11 caracteres',
    ],
    nombreRules: [
      v => !!v || 'Este dato es requerido',
      v => (v && v.length <= 50) || 'Ingrese hasta 50 caracteres',
    ],
    razonsocialRules: [
      v => !!v || 'Este dato es requerido',
      v => (v && v.length <= 80) || 'Ingrese hasta 80 caracteres',
    ],
    responsableRules: [
      v => !!v || 'Seleccione una condición de la lista',
    ],
    documentoRules: [
      v => !!v || 'Seleccione un tipo de documento de la lista',
    ],
    rubrosRules: [
      v => (v && v.length>0) || 'Seleccione un rubro o los que necesite de la lista',
    ],
    comercializacionRules: [
      v => !!v || 'Seleccione un tipo de comercialización',
    ],
    ciudadRules: [
      v => !!v || 'Seleccione una ciudad',
    ],
    sucursalNombreRules: [
      v => !!v || 'Ingrese un nombre para la sucursal/casa central',
    ],
    sucursalNombreAbreviado: [
      v => !!v || 'Ingrese un nombre abreviado para la sucursal/casa central',
    ],
    codigoFiscalAfip: [
      v => !!v || 'Ingrese el código fiscal AFIP para esta sucursal o casa central',
    ],
    inicioDeActividad: [
      v => !!v || 'Ingrese el código fiscal AFIP para esta sucursal o casa central',
    ],
    porRemarcacion: [
      v => !!v || 'Algo tiene que ganar, ingrese que porcentaje',
    ],
    diaDeFacturacion: [
      v => (v>=1 && v<=28) || 'Valores mínimos y máximos ( 1..28 )',
    ]
    ,
    nombreDelDeposito: [
      v => !!v || 'Nombre del depósito para administrar sus stocks',
      v => (v && v.length <= 30) || 'Ingrese hasta 30 caracteres',
    ],
    formOk: false,
    lostemas: ['Normal','Noche','Dia','Primavera','Verano','Otoño','Invierno','Pastel'],
    detPub: '',
    dialogDetalles: false,
    dialogVerFotos: false,
    direccion: '',
    dir: [],
    timeoutRefreshList: [],
    itemsResponsables: [],
    itemsDocumentos: [],
    rubValue: [],
    rubItems: [],
    rubObj: [],
    fotos: [],
    logotipo: 'Sin Imagen.jpg',
//  selectValue: '',

    datosUE: {
      id: '',
      nombre: '',
      razonsocial: '',
      responsable_id: '',
      documento_id: '',
      cuit: '',
      rubValue: [],
      tipodeusuario: '',
      direccion: '',
      postal_id: '',
      postalNombre: '',
      porRemarcacion: 25,
      sucursalNombre: 'CENTRAL',
      sucursalAbreviado: 'CENTRAL',
      sucursalFiscal: '0000',
      sucursalInicioDeActividad: moment().format('YYYY-MM-DD'),
      sucursalElectronica: 0,
      sucursalRefresco: 120,
      sucursalDepositoNombre: 'CENTRAL',
      sucursalTema: 'Invierno',
      sucursalLogotipo: 'Sin Imagen.jpg',
      crt: { name: '' },
      key: { name: '' },
      estaEnUserTercero: false,
      dondeEncontreLosDatos: '',
      observ: '',
      diaDeFacturacion: 10,
      accesolibre: false,
    },
    tip: [
      {id:'MD',nombre:'Soy Mayorista/Distribuidor'},
      {id:'MI',nombre:'Soy Minorista'}],
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },

    noti: [],
    estaNotificado: true,
    sayCarrusel: false,
    model: 0,
    dialogFacPed: false,
    headersFactibilidadPed: [
      { text: 'CODIGO', value: 'codigo', align: 'left', width: 120 },
      { text: 'DESCRIPCION', value: 'nombre', align: 'left', width: 420},
      { text: 'CTT.PEDIDA', value: 'ctt', align: 'end', width: 120},
      { text: 'STOCK', value: 'stock', align: 'end', width: 120},
      { text: 'DEFERENCIA', value:'diff', align: 'end', width: 120},
    ],
    factibilidadPedidos: [],
    headersNotas: [
      { text: 'Usuario', value:'userdesde.username'},
      { text: 'Comprobante', value:'comprobante.cpr'},
      { text: 'Total', value:'comprobante.total'},
    ],
    reglas: [],
    reglasDelTer: [],

  }),





  created() {
    moment.locale('es');
    if (this.isLoggedIn) {
      return HTTP().get('/gohuestanotificado')
        .then(({ data }) => {
          this.estaNotificado = data;
        })
    } else {
      let a = this.$store.state.datosPanel.ventasDelDia
      this.$store.commit('setSucursal', null, { root: true });
      this.$store.commit('setSucursales', null , { root: true })
      this.$store.commit('setSucursalFiscal', null , { root: true })
      this.$store.commit('setTema', null , { root: true })
      this.$store.commit('setTemas', null , { root: true })
      this.$store.commit('setLogotipo', null , { root: true })
      this.$store.commit('setCarrusel', [] , { root: true })
      this.$store.commit('setCaja', null , { root: true })
      this.$store.commit('setEmpresa', null, { root: true })
      this.$store.commit('setRubros', null, { root: true })
      this.$store.commit('setOperario', null, { root: true })
      this.$store.commit('setLevel', null, { root: true })
      this.$store.commit('setResponsable', null, { root: true })
      this.$store.commit('setCuit', null, { root: true })
      this.$store.commit('setActivo', null, { root: true })
      this.$store.commit('setNotificaciones', null, { root: true })
      this.$store.commit('setNotificacionesgohu', null, { root: true })
      this.$store.commit('setVinculosPadres', null, { root: true });
      this.$store.commit('setVinculosHijos', null, { root: true });
      this.$store.commit('setTipo', null , { root: true })
      this.$store.commit('setContadorBloqueado', false, { root: true })
      this.$store.commit('setHayCarrito', false, { root: true })
    }

    //let a = this.userId;
    //let b = this.sucursal;
    //let c = this.sucursales;
    //let d = this.notificaciones;
    //this.noti = this.$store.state.notificaciones.notas;
    //this.item = this.notificaciones;
  },  





  computed: {
    ...mapGetters('authentication', ['isLoggedIn', 'userName', 'userId']),
    ...mapState('authentication', ['loginEmail','loginPassword','loginUserId','loginError'],
      [ 'sucursal',
        'sucursales',
        'sucursalFiscal',
        'proveedor',
        'proveedores',
        'tema',
        'temas',
        'logotipo',
        'notificaciones',
        'caja',
        'empresa',
        'datosEmpresa',
        'operario',
        'level',
        'tipo',
        'activo',
        'datosPanel',
        'carrusel',
        'rubros',
        'contadorBloqueado',
        'publicaciones',
        'actPublicacion',
        'hayCarrito',
        'publicarpreciosconiva',
        'operarioVendedor',
        'graficos',
        'graficosDatos',
        'inicial',
        'ofertas'
      ]),

  },





  watch: {
    '$store.state.proveedor' () {
      this.gruposArt()
    },
  },





  mounted() {
    this.search = "2";
    if (!this.isLoggedIn) { return }
    
    this.timeoutRefreshList = []
    for (let i=10; i<=360; i++) {
      this.timeoutRefreshList.push(i)
    }
    this.datosUE.nombre = this.$store.state.empresa
    this.datosUE.razonsocial = this.$store.state.empresa
    this.gruposArt()
    return HTTP().get('/afipresponsables').then(({ data }) => {
      this.itemsResponsables = data;
      return HTTP().get('/afipdocumentos').then(({ data }) => {
        this.itemsDocumentos = data;
        return HTTP().get('/rubrosall').then(({ data }) => {
          this.rubItems = [];
          this.rubObj = [];
          data.forEach(element => {
            this.rubItems.push(element.nombre)
            this.rubObj.push(element)
          })
        })
      })
    })
  },





  methods: {
    //...mapActions('authentication', ['logout']),
    ...mapMutations([
        'alert',
        'closeAlert',
        'setAvatar',
        'datosPanel',
        'setActivo',
        'setCaja',
        'setCarrusel',
        'setCuit',
        'setEmpresa',
        'setLevel',
        'SetLogotipo',
        'setNotificaciones',
        'actNotificacion',
        'setOperario',
        'setOperarioId',
        'setPorRem',
        'setResponsable',
        'setRubros',
        'setSucursal',
        'setSucursales',
        'setSucursalDemo',
        'setSucursalFiscal',
        'setTema',
        'setTemas',
        'setTipo',
        'setTercero',
        'setVinculosPadres',
        'setContadorBloqueado',
        'actDetallesPublicacion',
        'setPublicacionLoQuieroOn',
        'setPublicacionLoQuieroOff',
        'setHayCarrito',
        'setPublicaciones',
        'setCttPublicacion',
        'setVaciarCarro',
        'setInicial',
      ]),





    elPrecio(item, cual) {
      let pre = item.precio
      if (cual=='original') {
        pre = item.preciooriginal
      }
      //let p = this.formatMoney(pre)
      let p = this.formatoImporte(pre)
      if (this.$store.state.proveedor.preciosconiva) {
//      p = this.formatMoney(pre*(1+(item.articulo.iva.tasa/100)))
        p = this.formatoImporte(pre*(1+(item.articulo.iva.tasa/100)))
      }
      return p
    },





    valido() {
      this.formOk = true
      if (this.$store.state.tipo=='UE') {
        if (this.datosUE.nombre == '' ||
            this.datosUE.razonsocial == '' ||
            this.datosUE.responsable_id == '' ||
            this.datosUE.documento_id == '' ||
            this.datosUE.cuit == '' ||
            this.datosUE.direccion == '' ||
            this.datosUE.postal_id == '' ) 
            { this.formOk = false }
        return true
      } else if (this.$store.state.tipo=='UG') {
        if (this.datosUE.nombre == '' ||
            this.datosUE.razonsocial == '' ||
            this.datosUE.responsable_id == '' ||
            this.datosUE.documento_id == '' ||
            this.datosUE.cuit == '' ||
            this.datosUE.tipodeusuario == '' ||
            this.datosUE.direccion == '' ||
            this.datosUE.postal_id == '' ||
            (Number(this.datosUE.diaDeFacturacion)<0 || Number(this.datosUE.diaDeFacturacion>28)) ||
            this.datosUE.porRemarcacion == '' ||
            this.datosUE.sucursalNombre == '' ||
            this.datosUE.sucursalAbreviado == '' ||
            this.datosUE.sucursalFiscal == '' ||
            this.datosUE.sucursalInicioDeActividad == '' ||
//          this.datosUE.sucursalElectronica == '' ||
            this.datosUE.sucursalRefresco == '' ||
            this.datosUE.sucursalDepositoNombre == '' ||
            this.datosUE.sucursalTema == ''
            )
            { this.formOk = false }

      }
    },




    getEstadoNota (estado, accion) {
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





    seleccionoClick() {
      this.datosUE.sucursalLogotipo = this.logotipo.name
    },





    guardarUE() {
      this.msg.msgTitle = 'Guardar Datos'
      this.msg.msgBody = 'Confirma los datos ingresados'
      this.msg.msgVisible = true
      this.msg.msgAccion = 'confirmar registro'
      this.msg.msgButtons = ['Cancelar','Aceptar']
    },





    guardarHTTP() {
      let rub = []
      for (let i=0; i<=this.rubValue.length-1; i++) {
        for(let j=0; j<=this.rubObj.length-1; j++) {
          if (this.rubValue[i]==this.rubObj[j].nombre) {
            rub.push(this.rubObj[j].id)
          }
        }
      }

      // SI ES UN USUARIO EXTERNO, PONGO SU % DE REMARCACION EN CERO.
      // YA QUE SU PERFIL NO PERMITE MODIFICARLOS.
      // ENTONCES SI IMPORTA ARTICULOS DEBERAN SER CON PRECIOS FINALES ( CON O SIN IVA) PERO FINALES.
      if (this.$store.state.externo) {
        this.datosUE.porRemarcacion = 0
      }

      return HTTP().post('/nuevousuario/', { tipo: this.$store.state.tipo, datos: this.datosUE, rubros: rub})
        .then(({ data }) => {

          if (data!='error') {

            return HTTP().get('/user/'+data.creador_id).then(({data}) => {
              let rub = []

              for (let i=0; i<=data[0].rubros.length-1; i++) {
                rub.push({id: data[0].rubros[i].id, nombre: data[0].rubros[i].nombre})
              }
              this.$store.commit('setRubros', rub, { root: true })
              this.$store.commit('setTipo', data[0].tipo , { root: true })
              this.$store.commit('setPorRem', data[0].porrem , { root: true })
              this.$store.commit('setTimeoutRefresh', data[0].timeout_refresh , { root: true})
              this.$store.commit('setEmpresa', data[0].username, { root: true })
              this.$store.commit('setTercero', data[0].tercero_id, { root: true })
              this.$store.commit('setOperario', 'ADM', { root: true })
              this.$store.commit('setOperarioId', data[0].id, { root: true })
              this.$store.commit('setSucursal', data[0].sucursales[0].id, { root: true })
              this.$store.commit('setSucursales', data[0].sucursales, { root: true })
              this.$store.commit('setSucursalDemo', data[0].sucursales[0].sucursaldemo , { root: true })
              this.$store.commit('setSucursalFiscal', data[0].sucursales[0].fiscal, { root: true })
              this.$store.commit('setTema', data[0].sucursales[0].tema, { root: true })
              this.$store.commit('setTemas', data[0].sucursales[0].tema, { root: true })
              this.$store.commit('setLogotipo', data[0].sucursales[0].logotipo, { root: true })

              return HTTP().get('/userscaja/'+data[0].sucursales[0].id).then(({data}) => {

                if (data.length>0) {
                  this.$store.commit('setCaja', data[0].id, { root: true });
                } else {
                  this.$store.commit('setCaja', data.id, { root: true });
                }

               this.mensaje('¡La operación se ha realizado con éxito!', this.$store.state.temas.forms_titulo_bg, 1500)
               router.push('/login');
              
              }).catch(() => {
                
                this.$store.commit('setLoginError', 'Ha ocurrido un error, verifique sus datos.');
              
              });

            })

          } else {
            
            this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2500)

          }


        }).catch((e) => {
          
          console.log(e)
          this.mensaje('¡Ops, algo ha pasado, reintente y si el error continúa, contacte con gohu!', this.$store.state.temas.forms_titulo_bg, 2500) 

        })
    
    },





    mensaje(mensaje, color, tiempo) {
      this.$store.commit("alert", {color:color,text:mensaje,timeout:tiempo,button:false});
      setTimeout(() => { this.$store.commit("closeAlert") }, tiempo);
    },





    fecha(f) {
      let a = f.substring(8,10)+'/'+f.substring(5,7)+'/'+f.substring(0,4)+' '+f.substring(11,19)
      return a
    },





    escribiendoNombre() {
      this.datosUE.razonsocial = this.datosUE.nombre
    },





    loQuiero(item) {
      // PRIMERO BUSCO LA POSICION DE LA PUBLICACION
//    let pos = -1
//    for (let i=0; i<=this.$store.state.publicaciones.length-1; i++) {
//      if (this.$store.state.publicaciones[i].id==item.id) {
//        pos = i
//        break
//      }
//    }
      let pos = this.$store.state.publicaciones.findIndex(x=>x.id == item.id)
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



    filtrarPublicacionesOReglas(por) {
      debugger
      if (por.nombre == 'Publicaciones') {
        this.publicacionesOReglas[1].sel = false
        this.publicacionesOReglas[0].sel = true
      } else {
        this.publicacionesOReglas[0].sel = false
        this.publicacionesOReglas[1].sel = true
      }
    },



    filtrarPorGrupo(grp) {

      for (let i=0; i<=this.grupos.length-1; i++) {
        this.grupos[i].sel = this.grupos[i].id == grp.id ? true : false
      }

      //alert(3)
      debugger
      return HTTP().post('/publicaciones/', 
        {proveedor: this.$store.state.proveedor.id, filtro: grp.id, adm: false}).then(({ data }) => {
          debugger
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
          debugger

          this.$store.commit('setPublicaciones', pub, { root: true });
          this.$store.commit('setGrupoCarrito', grp.id, { root: true });
      })

    },





    gruposArt() {
      this.grupos = []
      if (this.$store.state.proveedor) {
        return HTTP().post('/gruposart', { proveedor: this.$store.state.proveedor.id }).then(({ data }) => {
          if (data.length>1) {
            this.grupos = [{id: 9999999, nombre: 'Todos', sel: true}]
            for (let i=0; i<=data.length-1; i++) {
              this.grupos.push({ id: data[i].id, nombre: data[i].nombre, sel: false, })
            }
          }
        }).catch(({ err }) => {
          this.grupos = []
        })
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
      this.totalCarro = 0
      for (let i=0; i<=this.carro.length-1; i++) {
        this.totalCarro += this.carro[i].precio * this.carro[i].ctt
      }
      let a = this.loQuiero(item)
      this.$store.commit('setHayCarrito', true, { root: true })
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

      debugger
      return HTTP().post('generarpedidocarrito', {
        proveedor: this.$store.state.proveedor.id,
        sucursales: this.$store.state.sucursales,
        sucursal: this.$store.state.sucursal,
        cart: this.carro,
        vendedor: this.operarioVendedor,
        }).then(({ data }) => {

          debugger

          this.mensaje(data, this.$store.state.temas.card_ventas_bg, 1500)
          this.vaciarCarrito()
        })
        .catch((e) => {
          this.mensaje(e, this.$store.state.temas.card_ventas_bg, 1500) 
      });

    },





    vaciarCarrito() {
      this.carro = []
      this.$store.commit('setVaciarCarro', false, { root: true })
      this.$store.commit('setHayCarrito', false, { root: true })
    },





    msgRespuesta(op) {
      if (op==='Aceptar') {
        if (this.msg.msgAccion=='confirmar registro') {
          this.guardarHTTP('guardar datos ue')
        }
      } else if (op==='Cancelar') {
      }
      this.msg.msgVisible = false;
    },





    totalNota(nota) {
      if (nota.comprobante.pendientes.length) {
        if (nota.comprobante.pendientes[0].pendiente==0) {
//        return this.formatMoney(nota.comprobante.pendientes[0].importe)
          return this.formatoImporte(nota.comprobante.pendientes[0].importe)
        } else {
//        return this.formatMoney(nota.comprobante.pendientes[0].pendiente)
          return this.formatoImporte(nota.comprobante.pendientes[0].pendiente)
        }
      } else {
//      return this.formatMoney(nota.comprobante.total)
        return this.formatoImporte(nota.comprobante.total)
      }
    },





    afipsuc() {
      this.datosUE.sucursalFiscal = this.datosUE.sucursalFiscal.padStart(4,'0')
    },





    leido(it) {
      debugger
      return HTTP().post('/borrarnotificacion', { nota: it } )
        .then(({ data }) => {
        it.estado = 'R'
        let n = []
        for (let i=0; i<= this.$store.state.notificaciones.length-1; i++) {
          if (this.$store.state.notificaciones[i].id!=it.id) {
            n.push(this.$store.state.notificaciones[i])
          }
        }
        this.$store.commit('setNotificaciones', n, { root: true });
        this.mensaje('¡Notificacion borrada!', this.$store.state.temas.forms_titulo_bg, 1500) 
      }).catch((e) => {
        console.log(e)
        this.mensaje('¡La Notificacion no se ha podido eliminar!', this.$store.state.temas.forms_titulo_bg, 1500) 
      })
    },





    impCpr(it) {

      // Si es efectivo debo agregar el pago en 'valores' para que grabe en efectivo
      let articulos = []
      let pendientes = []
      let valores = []

      for (let i=0; i<=it.comprobante.items.length-1; i++) {
        articulos.push(it.comprobante.items[i])
        articulos[i].deposito_id = null
      }

      const a = HTTP().get('/empresa/'+it.user_id_desde)
        .then(({ data }) => {
          
          this.$store.commit('actNotificacion', it.id, { root: true });
          if (it.comprobante.tipo=='CO') {

            let novedad = {
              cpr_id: it.comprobante.id,
              novedad: 'Recepción del pedido',
              rel_id: null,
              estado: 'N',
              accion: 'ACTUALIZA',
            }

            return HTTP().post('/nuevaventa', {
              fecha: it.comprobante.fecha.substring(0,10),
              perfiscal: it.comprobante.perfiscal,
              tipo: 'VE',
              cpr: it.comprobante.cpr,
              user_id: this.userId,
              sucursal_id: this.$store.state.sucursal,
              tercero_id: data[0].tercero_id,
              comprobante_id: it.comprobante.comprobante_id,
              direccion_id: it.userdesde.tercero.direcciones[0].id,
              documento_id: it.comprobante.documento_id,
              mediodepago_id: it.comprobante.mediodepago_id,
              lista_id: null,
              deposito_id: null,
              vendedor_id: null,
              moneda_id: it.comprobante.moneda_id,
              tasadescuento: it.comprobante.tasadescuento,
              importedescuento: it.comprobante.importedescuento,
              retiva: 0,
              retgan: 0,
              retib: 0,
              gravado: it.comprobante.gravado,
              exento: it.comprobante.exento,
              iva: it.comprobante.iva,
              total: it.comprobante.total,
              regstk: true,
              estado: 'P',
              activo: true,
              articulos: articulos,
              valores: [],
              pendientes: [],
              notificacion: it.id,
              anotadorId: null,
              espejo: [],
              novedad: novedad,
            }).then(({ data }) => {
              this.mensaje('¡Importación Exitosa!', this.$store.state.temas.forms_titulo_bg, 1500) 
            });

          } else if (it.comprobante.tipo=='VE') {

            if (it.comprobante.observaciones=='VENTA DE CHEQUES') {

              pendientes = []
              articulos = []
              valores = []

              for (let i=0; i<=it.comprobante.valoresEgresos.length-1; i++) {
                it.comprobante.valoresEgresos[i].fechafinanciera = moment(it.comprobante.valoresEgresos[i].fechafinanciera).format('YYYY-MM-DD')
                it.comprobante.valoresEgresos[i].fechasalida = null
              }

              return HTTP().post('/compranueva', {
                fecha: it.comprobante.fecha.substring(0,10),
                perfiscal: it.comprobante.perfiscal.substr(0,4)+'-'+it.comprobante.perfiscal.substr(4,2),
                tipo: 'CO',
                cpr: 'CIN-X '+this.$store.state.sucursalFiscal+'-00000000',
                user_id: this.userId,
                sucursal_id: this.$store.state.sucursal,
                tercero_id: data[0].tercero.id,
                comprobante_id: it.comprobante.comprobante_id,
                direccion_id: it.comprobante.direccion_id,
                documento_id: it.comprobante.tercero.documento_id,
                mediodepago_id: 1,
                lista_id: null,
                deposito_id: null,   // mando como null, luego la api vera a que deposito de la sucursal imputa.
                vendedor_id: null,
                moneda_id: it.comprobante.moneda_id,
                tasadescuento: 0, importedescuento: 0, retiva: 0, retgan: 0, retib: 0, gravado: 0, exento: 0, iva: 0,
                total: it.comprobante.total,
                observaciones: 'COMPRA DE CHEQUES',
                regstk: false,
                estado: 'F',
                activo: true,
                articulos: [],
                valores: it.comprobante.valoresEgresos,                 // ESTO ESTA MAL, PUEDE VENIR EN EFECTIVO U OTROS VALORES
                pendientes:  [],
                notificaEnBaseAOtro: [],
                notificacion: it.id,
                gasto: null,
              }).then(({ data }) => {
                this.mensaje('¡Importación Exitosa!', this.$store.state.temas.forms_titulo_bg, 1500) 
              });


            } else {

              // REGLA, CUANDO SE RECIBE UN COMPROBANTE DE VENTA DE UN PROVEEDOR, ( FAC PED )
              // SIEMPRE SE AGREGARA EN LA CUENTA CORRIENTE PARA QUE LUEGO SE REALICE EL PAGO.
              // SALVO QUE EL CREDITO NO SEA SUFICIENTE, EN ESE CASO SE AGREGA TAMBIEN EFECTIVO EN VALORES.
              let venc = moment().format('YYYY-MM-DD')
              let obsv = ''
              if (it.comprobante.pendientes.length>0) {
                venc = moment(it.comprobante.pendientes[0].vencimiento).format('YYYY-MM-DD')
              }
              // ACA TENGO QUE AGREGAR PENDIENTES SI HAY Y/O VALORES SI TAMBIEN HAY
              // ESTAN EL IT.COMPROBANTE.PENDIENTES Y IT.COMPROBANTE.VALORESINGRESOS
              if (it.comprobante.cpr.substr(0,3)!='PED') {
                obsv = 'COMPRAS'
                if (it.comprobante.pendientes.length>0) {
                  pendientes.push({ 
                    vencimiento: venc,
                    importe: it.comprobante.pendientes[0].importe,
                    pendiente: it.comprobante.pendientes[0].pendiente,
                    concepto: 'EN CUENTA CORRIENTE'
                  })
                }
                if (it.comprobante.valoresIngresos.length>0) {
                  valores.push(it.comprobante.valoresIngresos)
                }
              } else {
                obsv = 'PEDIDO'
              }

              // INVIERTO EL SINGNO ( VER SI CUANDO VIENE NDC VIENEN POSITIVOS )
              let coef = 1
              if (it.comprobante.cpr.substr(0,3)=='NDC') {
                coef = -1
              }
              for (let i=0; i<=articulos.length-1; i++) {
                articulos[i].stock = Math.abs(articulos[i].stock) * coef
              }

              return HTTP().post('/compranueva', {
                fecha: it.comprobante.fecha.substring(0,10),
                perfiscal: it.comprobante.perfiscal.substr(0,4)+'-'+it.comprobante.perfiscal.substr(4,2),
                tipo: 'CO',
                cpr: it.comprobante.cpr,
                user_id: this.userId,
                sucursal_id: this.$store.state.sucursal,
                tercero_id: data[0].tercero.id,
                comprobante_id: it.comprobante.comprobante_id,
                direccion_id: it.comprobante.direccion_id,
                documento_id: it.comprobante.tercero.documento_id,
                mediodepago_id: it.comprobante.mediodepago_id,
                lista_id: null,
                deposito_id: null,   // mando como null, luego la api vera a que deposito de la sucursal imputa.
                vendedor_id: null,
                moneda_id: it.comprobante.moneda_id,
                tasadescuento: it.comprobante.tasadescuento,
                importedescuento: it.comprobante.importedescuento,
                retiva: 0,
                retgan: 0,
                retib: 0,
                gravado: it.comprobante.gravado,
                exento: it.comprobante.exento,
                iva: it.comprobante.iva,
                total: it.comprobante.total,
                observaciones: obsv,
                regstk: true,
                estado: 'F',
                activo: true,
                articulos: articulos,
                valores: valores,                 // ESTO ESTA MAL, PUEDE VENIR EN EFECTIVO U OTROS VALORES
                pendientes: pendientes,
                notificacion: it.id,
              }).then(({ data }) => {
                this.mensaje('¡Importación Exitosa!', this.$store.state.temas.forms_titulo_bg, 1500) 
              });

            }

          } else if (it.comprobante.tipo=='PG') {

            it.sucursalFiscal = this.$store.state.sucursalFiscal
            it.sucursal       = this.$store.state.sucursal
            it.caja           = this.$store.state.caja
            let notificacion  = this.$store.state.notificaciones

            return HTTP().post('/importarrecibo', { it, notificacion })
              .then(({ data }) => {
                this.mensaje('¡Importación Exitosa!', this.$store.state.temas.card_ventas_bg, 1500) 
            });

          }

      })
    },





/*
    notificar(cual) {
      return HTTP().patch('notificaragohu', {plan: cual})
        .then(({ data }) => {
          this.estaNotificado = true
        })
        .catch((e) => {
        });
    },
*/




    verDetallesDeLaPublicacion(item) {
      this.detPub = item.detalles
      this.dialogDetalles = true
    },





    verFotos(item) {
      this.fotos = item.fotos
      this.dialogVerFotos = true
    },





    cerrarDetallesPublicacion() {
      this.dialogDetalles = false
    },





    cerrarFotosDeLaPublicacion() {
      this.dialogVerFotos = false
    },





    grafPreparo(op) {
      this.grafSel = op
      if (op=='Diario') {
        this.grafDes = moment().startOf('month').format('YYYY-MM-DD');
        this.grafHas = moment().format('YYYY-MM-DD');
      } else if (op=='Semanal') {
        this.grafDes = moment().startOf('month').format('YYYY-MM-DD');
        this.grafHas = moment().format('YYYY-MM-DD');
      } else if (op=='Mensual') {
        this.grafDes = moment().startOf('year').format('YYYY-MM-DD');
        this.grafHas = moment().format('YYYY-MM-DD');
      } else if (op=='Anual') {
        this.grafDes = "2021-01-01";
        this.grafHas = moment().format("YYYY-MM-DD");
      }
      this.grafMuestro()
    },



    grafAnterior() {
      if (this.grafSel=='Diario') {
        let f = moment(this.grafDes).subtract(1, 'months').format('YYYY-MM-DD');
        this.grafDes = moment(f).startOf('month').format('YYYY-MM-DD');
        this.grafHas = moment(f).endOf('month').format('YYYY-MM-DD');
      } else if (this.grafSel=='Semanal') {
        let f = moment(this.grafDes).subtract(1, 'months').format('YYYY-MM-DD');
        this.grafDes = moment(f).startOf('month').format('YYYY-MM-DD');
        this.grafHas = moment(f).endOf('month').format('YYYY-MM-DD');
      } else if (this.grafSel=='Mensual') {
        let f = moment(this.grafDes).subtract(1, 'years').format('YYYY-MM-DD');
        this.grafDes = moment(f).startOf('years').format('YYYY-MM-DD');
        this.grafHas = moment(f).endOf('years').format('YYYY-MM-DD');
      }
      this.grafMuestro()
    },



    grafSiguiente() {
      if (this.grafSel=='Diario') {
        let f = moment(this.grafDes).add(1, 'months').format('YYYY-MM-DD');
        this.grafDes = moment(f).startOf('month').format('YYYY-MM-DD');
        this.grafHas = moment(f).endOf('month').format('YYYY-MM-DD');
      } else if (this.grafSel=='Semanal') {
        let f = moment(this.grafDes).add(1, 'months').format('YYYY-MM-DD');
        this.grafDes = moment(f).startOf('month').format('YYYY-MM-DD');
        this.grafHas = moment(f).endOf('month').format('YYYY-MM-DD');
      } else if (this.grafSel=='Mensual') {
        let f = moment(this.grafDes).add(1, 'years').format('YYYY-MM-DD');
        this.grafDes = moment(f).startOf('years').format('YYYY-MM-DD');
        this.grafHas = moment(f).endOf('years').format('YYYY-MM-DD');
      }
      this.grafMuestro()
    },



    grafMuestro() {
      let a = this.$store.state.graficosDatos
      let desde = this.grafDes
      let hasta = this.grafHas
      this.grafLab = []
      this.grafVal = []
      
      debugger
      if (this.grafSel=='Diario') {
        
        this.grafSay = moment(this.grafDes).format('MMM YYYY')
        while (desde <= hasta) {
          let pos = a.findIndex(x=>x.fecha===desde)
          if (pos!=-1) {
            this.grafLab.push(a[pos].fecha.substring(8))
            this.grafVal.push(a[pos].total)
          }
          desde = moment(desde).add(1, 'days').format('YYYY-MM-DD')
        }

      } else if (this.grafSel=='Semanal') {

        this.grafSay = moment(this.grafDes).format('MMM YYYY')
        while (desde <= hasta) {
          let week = moment(desde).weeks()
          let posdia = a.findIndex(x=>x.fecha===desde)
          let posweek = this.grafLab.findIndex(x=>x===week)
          if (posweek==-1) {
            this.grafLab.push(week)
            if (posdia!=-1) {
              this.grafVal.push(a[posdia].total)
            }
          } else {
            if (posdia!=-1) {
              this.grafVal[posweek]+=a[posdia].total
            }
          }
          desde = moment(desde).add(1, 'days').format('YYYY-MM-DD')
        }
        for (let i=0; i<=this.grafLab.length-1; i++) {
          this.grafLab[i]+=' ($'+this.formatoImporte(this.grafVal[i])+')'
        }

      } else if (this.grafSel=='Mensual') {

        this.grafSay = moment(this.grafDes).format('YYYY')
        while (desde <= hasta) {
          let month = moment(desde).format('MMM')
          let posdia = a.findIndex(x=>x.fecha===desde)
          let posmonth = this.grafLab.findIndex(x=>x===month)
          if (posmonth==-1) {
            this.grafLab.push(moment(desde).format('MMM'))
            if (posdia!=-1) {
              this.grafVal.push(a[posdia].total)
            } else {
              this.grafVal.push(0)
            }
          } else {
            if (posdia!=-1) {
              this.grafVal[posmonth]+=a[posdia].total
            }
          }
          desde = moment(desde).add(1, 'days').format('YYYY-MM-DD')
        }

      } else if (this.grafSel=='Anual') {

        this.grafSay = moment(this.grafDes).format('YYYY')
        while (desde <= hasta) {
          let year = moment(desde).format('YYYY')
          let posdia = a.findIndex(x=>x.fecha===desde)
          let posyear = this.grafLab.findIndex(x=>x===year)
          if (posyear==-1) {
            this.grafLab.push(moment(desde).format('YYYY'))
            if (posdia!=-1) {
              this.grafVal.push(a[posdia].total)
            } else {
              this.grafVal.push(0)
            }
          } else {
            if (posdia!=-1) {
              this.grafVal[posyear]+=a[posdia].total
            }
          }
          desde = moment(desde).add(1, 'days').format('YYYY-MM-DD')
        }

      }
    },


/*
    aceptarVinculo(nota) {
      this.$store.commit('actNotificacion', nota.id, { root: true });
      return HTTP().patch('vinculoconfirmarrechazar/'+nota.id, { 
        estado: 'R', 
        activo: true,
        user_id_desde: nota.user_id_desde,
        user_id_hasta: nota.user_id_hasta,
      }).then(({ data }) => {
      })
      .catch((e) => {});
    },
*/


/*
    activarRechazarUsuario(nota, sino) {
      return HTTP().patch('activarrechazarusuario/'+nota.user_id_desde, {activo: sino})
      .then(({ data }) => {
        })
      .catch((e) => {});
    },
*/



/*
    rechazarVinculo(nota) {
      let a = this.notificaciones[1].estado='R'
      return HTTP().patch('vinculoconfirmarrechazar/'+nota.id, { 
        estado: 'R', 
        activo: false,
        user_id_desde: nota.user_id_desde,
        user_id_hasta: nota.user_id_hasta,
      }).then(({ data }) => {
      }).catch((e) => {});
    },
*/




/*
    buscoDocumento (event) {
      const doc = event.target.value;
      if (doc=='') { return }
      const a = HTTP().get(`/tercerodocumento/${doc}`)
        .then(({ data }) => {
          if(data) {
            this.terceroAIncorporar = data.id
            this.msg.msgTitle = 'Esta cuenta ya existe '

            let msg = 'Esta cuenta ya Existe en la base de datos.<br><br>'
            msg += 'Esto es porque algún usuario ya cargo sus datos para realizar alguna operación<br>'
            msg += 'No es necesario que complete este formulario<br>'
            this.msg.msgBody = msg

            this.msg.msgVisible = true
            this.msg.msgAccion = 'Completar el registro'
            this.msg.msgButtons = ['Aceptar']
          }
      });
    },
*/





    buscoDocumento () {

      //this.cuentaYaAsignada = false
      if (this.datosUE.cuit=='') { return }

      return HTTP().get(`/tercerodocumento/${25}/${this.datosUE.cuit}/${1}`)
        .then(({ data }) => {

          if (data=='') { // VACIO ES POR QUE NO ECONTRO NI EN LA BASE DE DATOS NI EN AFIP

            //this.terceroAIncorporar = null
            this.msg.msgTitle = 'Cuenta Inexistente en AFIP'
            this.msg.msgBody = 'AFIP no reconoce este CUIT!'
            this.msg.msgVisible = true
            this.msg.msgAccion = 'CUIT Error'
            this.msg.msgButtons = ['Aceptar']
            //this.cuentaYaAsignada = true
          
          } else {

            if (data.errorConstancia!=undefined) {  // ECONTRO EN AFIP Y NO EN LA BASE DE DATOS

              //this.terceroAIncorporar = null
              this.msg.msgTitle = 'Error en Constancia AFIP '
              let msg = ''
              for (let i=0; i<=data.errorConstancia.error.length-1; i++) {
                msg += data.errorConstancia.error[i]+'<br>'
              }
              this.msg.msgBody = msg
              this.msg.msgVisible = true
              this.msg.msgAccion = 'Error en CUIT'
              this.msg.msgButtons = ['Aceptar']
              //this.cuentaYaAsignada = true

            } else if (data.datosGenerales==undefined) {           // ECONTRO EN LA BASE DE DATOS

              //this.terceroAIncorporar = data[0].id

              // CARGO VALORES DESDE LA BASE DE DATOS
              this.datosUE.id = data[0].id
              this.datosUE.nombre = data[0].nombre
              this.datosUE.razonsocial = data[0].razon_social
              this.datosUE.responsable_id = data[0].responsable_id
              this.datosUE.direccion = data[0].direcciones[0].direccion
              this.datosUE.postal_id = data[0].direcciones[0].postal.id
              this.datosUE.postalNombre = data[0].direcciones[0].postal.nombre
              this.datosUE.documento_id = 25
              this.datosUE.estaEnuserTercero = false
              this.datosUE.dondeEncontreLosDatos = 'GOHU'
              
              return HTTP().get(`/estaenusertercero/${data[0].id}`)
                .then(({ data }) =>{
                  if (data) {
                    this.datosUE.estaEnUserTercero = true
                  }
              })
            
            } else if (data.datosGenerales!=undefined) {
              
              // VIENE DESDE LA AFIP
              if (data.datosGenerales.apellido!=undefined) {
                this.datosUE.nombre = data.datosGenerales.apellido+' '+data.datosGenerales.nombre
                this.datosUE.razonsocial = data.datosGenerales.apellido+' '+data.datosGenerales.nombre
              } else if (data.datosGenerales.razonSocial!=undefined) {
                this.datosUE.nombre = data.datosGenerales.razonSocial
                this.datosUE.razonsocial = data.datosGenerales.razonSocial
              }

              this.datosUE.dondeEncontreLosDatos = 'AFIP'
              this.datosUE.documento_id = 25
              if (data.datosMonotributo!=undefined) {
                this.datosUE.responsable_id = 6
              } else {
                this.datosUE.responsable_id = 1
              }
              this.datosUE.direccion = data.datosGenerales.domicilioFiscal.direccion

              let dom=''
              if (data.datosGenerales.domicilioFiscal.localidad!=undefined) {
                dom = data.datosGenerales.domicilioFiscal.localidad
              } else if (data.datosGenerales.domicilioFiscal.descripcionProvincia!=undefined) {
                dom = data.datosGenerales.domicilioFiscal.descripcionProvincia
              }

              return HTTP().post('/buscarocrearpostal', {
                cod: data.datosGenerales.domicilioFiscal.codPostal,
                nom: dom,
                prov: data.datosGenerales.domicilioFiscal.idProvincia })
                .then(({ data }) => {
                  this.datosUE.postal_id = data[0].id
                  this.datosUE.postalNombre = data[0].nombre
              })

            }
          }
      })
    },





    noVerMasElMensajeInicial() {
      return HTTP().post('/novermaselmensajeinicial',{timeout: 5000}).then(({ data }) => {
        if (data=='ok') {
          this.mensaje('¡Mensaje inicial desactivado!', this.$store.state.temas.forms_titulo_bg, 2500)
          this.$store.commit('setInicial', 0, { root: true });  
        } else {
          this.mensaje('¡Opps, el mensaje inicial no se ha podido desactivar!', this.$store.state.temas.forms_titulo_bg, 2500)
        }
      })
    },





    cambioProveedor(cual) {

      if (cual) {

        if (cual.id == 0) {

          this.$store.commit('setPublicaciones', [], { root: true });
          this.$store.commit('setProveedor', 0, { root: true });

        } else {

          return HTTP().post('/releoproveedorparaelstate/', {proveedor: cual.id}).then(({ data })=>{

            this.$store.commit('setProveedor', data[0], { root: true });

            this.$store.commit('setPublicaciones', [], { root: true });
            this.$store.commit('setGrupoCarrito', 9999999, { root: true });
            let filGrp = 9999999 //this.GrupoCarrito ? this.grupoCarrito : 9999999

            //alert(4)
            debugger
            return HTTP().post('/publicaciones/', { proveedor: cual.id, filtro: filGrp }).then(({ data }) => {

              debugger
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

//              for (let i=0; i<=pub.length-1; i++) {
//                for (let j=0; j<=pub[i].fotos.length-1; j++) {
//                  let bytes = new Uint8Array(pub[i].fotos[j].foto);
//                  let binary = bytes.reduce((data, b) => data += String.fromCharCode(b), '');
//                  this.pub[i].fotos[j].foto = "data:image/jpeg;base64," + btoa(binary);
//                }
//              }

              this.$store.commit('setPublicaciones', pub, { root: true });
              this.publicacionesOReglas[0].ctt = pub.length

              // cargo las reglas del proveedor para con el usuario actual, solo si estas vinculado
              this.reglas = []
              let tagsDelTer = []

              return HTTP().get('/leoelusertercero/'+cual.id+'/'+this.$store.state.datosEmpresa.id).then(({ data }) => {

                if (data!=0) {

                  return HTTP().post('/tercerotags', { userterceroid: data }).then(({ data }) => {
                    for (let i=0; i<=data.length-1; i++) {
                      tagsDelTer.push(data[i].tag_id)
                    }
                    return HTTP().get('/reglas/'+cual.id+'/0').then(({ data }) => {

                      debugger
                      this.reglasDelTer = []
                      for (let i=0; i<=data.reglas.length-1; i++) {
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
                            user_id: cual.id,
                            nombre: data.reglas[i].nombre,
                            descripcion: data.reglas[i].descripcion,
                            descuento: data.reglas[i].descuento,
                            vencimiento: data.reglas[i].vencimiento,
                            cttminima: data.reglas[i].cttminima,
                            unidades: data.reglas[i].unidades,
                            activo: data.reglas[i].activo,
                            tagsPre: tmpPre
                          })
                        }
                      }
                      this.publicacionesOReglas[1].ctt = this.reglasDelTer.length
                    })
                  })
                }
              })
            })
          })
        }
      }
    },





    nroSucursal() {
      this.datosUE.sucursalFiscal = this.datosUE.sucursalFiscal.padStart(4,'0')
    },




/*
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
*/




    formatoImporte(value) {
      let val = (value/1).toFixed(2).replace('.', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    },





    formatoFechaCorta(value) {
      return moment(String(value)).format('DD-MM-YY')
    },





  }
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
    /*font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;*/
    font-family: 'Roboto', sans-serif;
    font-size: 14px;
    font-weight: 400;
  }
  .contenedor-galeria-fuente-importe {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
  }
  .contenedor-galeria-fuente-descuento {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    color: red;
  }
  .contenedor-galeria-fuente-final-unds {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
    color: black;
    font-weight: 150%;
  }
  .contenedor-galeria-fuente-descuento-unds {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
    color: red;
  }
  .contenedor-galeria-fuente-ivasiniva {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    color: gray;
  }
  .contenedor-galeria-fuente-final {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    color: black;
    font-weight: 150%;
  }

</style>