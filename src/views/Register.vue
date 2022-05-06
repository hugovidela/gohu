<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex>
        <v-img
          height="100"
          width="200"
          src="/images/logoGoHu.jpg">
        </v-img>
        <v-row>
          <v-col cols="4" sm="4" md="4">
            <v-card tile>
              <v-card-title>
                <b>Registro</b>
              </v-card-title>
              <v-card-text class="pl-4 pt-4 pb-4 caption"
                :color="$store.state.temas.notif_cprs_btn_bg"
                :dark="$store.state.temas.notif_cprs_btn_dark==true">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                      <v-text-field
                        label="Nombre de Usuario"
                        :rules="usernameRules"
                        :value="registerUsername"
                        @input="setRegisterUsername"
                        autofocus clearable counter maxlength="40" required>
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                      <v-text-field
                        ref="mail"
                        label="E-mail"
                        :rules="emailRules"
                        :value="registerEmail"
                        @input="setRegisterEmail"
                        required counter
                        @change="revisoSiEstaElMail(1)">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                      <v-text-field
                        :append-icon="show ? 'visibility' : 'visibility_off'"
                        :rules="[passRules.required, passRules.min]"
                        :type="show ? 'text' : 'password'"
                        label="Password"
                        hint="Hasta 15 caracteres"
                        counter required
                        @click:append="show = !show"
                        :value="registerPassword"
                        @input="setRegisterPassword">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                      <v-text-field
                        ref="mailrecomendo"
                        label="Recormendado por (e-mail)"
                        :rules="emailRecomendo"
                        :value="registerEmailRecomendo"
                        @input="setRegisterEmailRecomendo"
                        @change="revisoSiEstaElMail(2)"
                        @blur="revisoSiEstaElMail(2)">
                      </v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
                      <v-select
                        :value="registerTipo"
                        @input="setRegisterTipo"
                        :items="tipoUsuarioItems"
                        label="Tipo de Usuario">
                      </v-select>
                    </v-col>
                    <v-col cols="12" sm="12" md="12" class="pt-0 pb-0">
<!--
                      <v-btn
                        v-show="validado()"
                        :color="$store.state.temas.forms_titulo_bg"
                        :dark="$store.state.temas.forms_titulo_dark==true"
                        @click="register"
                        :disabled="!valid">
                        <v-icon class="mr-2">account_circle</v-icon>
                        Registrarse
                      </v-btn>
-->
                      <v-btn
                        v-show="validado()"
                        :color="$store.state.temas.forms_titulo_bg"
                        :dark="$store.state.temas.forms_titulo_dark==true"
                        @click="register">
                        <v-icon class="mr-2">account_circle</v-icon>
                        Registrarse
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="12" md="12" class="pt-0">
                      <v-alert type="error" :value="registerError"
                        v-show="registerError">
                        {{registerError}}
                      </v-alert>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
              <v-card-actions>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col cols="8" sm="8" md="8" class="pt-0">
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <b>gohu</b> Sistema de Administración Comercial.<br><br>
                Pusimos especial énfasis en la sencilléz, y que al mismo
                tiempo abarcara todas las necesidades de un negocio <i>tipo</i>:
                Compras, ventas, Stock's, Ctas.Ctes, Bancos, Testoreria, etc.<br><br>
                El sistema se integra con AFIP, permitiendo realizar comprobantes
                electrónicos y permite también buscar en el padrón del organismo al
                momento de cargar Clientes, Proveedores, Transportistas, etc.

                <br><br>
                Al momento de registrarse, los usuarios deberán indicar de que
                forma comercializan sus artículos: <i>Mayorista</i> o <i>Minorista</i>.
                A su vez, estos dos grupos podran ser <i><b>gohu ERP</b> (versión full)</i>
                o <i><b>gohu Precios</b></i> (versión precios y pedidos)
                <br><br>
                En <b>gohu ¡los usuarios se pueden vincular!</b>.<br>
                La vincuación es un <i>espejo</i> que se genera entre los usuarios Mayoristas
                y Minoristas vinculados.<br><br>
                Los Minoristas acceden a los Artículos, Precios y Promociones de sus
                Mayoristas en tiempo real, y cada acción que el Mayorista realice sobre sus
                artículos, se verá reflejada automaticamente en todos sus Minoristas vinculados.
                <br>En cuanto a las Operaciones: Pedidos, Facturas, NDD's, NDC's,
                Pagos, etc van por dentro del sistema entre los usuarios vinculados.
                Esto permite ahorrar mucho tiempo y evitar errores, ya que al ser transferidos los
                comprobantes de un usuario a otro, estos quedan <i>espejados</i>.<br>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-flex>
      <Confirmacion v-model='msg.msgAccion'
        :title=this.msg.msgTitle
        :body=this.msg.msgBody
        :visible=this.msg.msgVisible
        :buttons=this.msg.msgButtons
        @click="msgRespuesta">
      </Confirmacion>
    </v-layout>
  </v-container>

</template>

<script>
/* eslint-disable */
import HTTP from '../http';
import { mapState, mapMutations, mapActions } from 'vuex';
import Confirmacion from "./Forms/confirmacion.vue";

export default {
  components: {
    Confirmacion,
  },
  /* eslint-disable */
  data: () => ({
    valid: true,
    show: false,
    tipoUsuario: '',
    tipoUsuarioItems: ['Usuario Gohu','Usuario Externo', 'Usuario Tienda'],
    itemsResponsables: [],
    itemsDocumentos: [],
    documento_id: '',
    documentoNumero: '',
    responsable_id: '',
    nombreEmpresa: '',
    msg: {
      msgAccion: null,
      msgVisible: false,
      msgTitle: '',
      msgBody: '',
      msgButtons: ['']
    },
    elMailExiste: false,
    usernameRules: [
      v => !!v || 'El nombre es requerido',
      v => (v && v.length <= 40) || 'Hasta 40 caraceres',
    ],
    passRules: {
      required: value => !!value || 'Requerido',
      min: v => v.length >= 3 || 'Míninmo 3 caracters',
    },
    emailRules: [
      v => !!v || 'E-mail es requerido',
      v => /.+@.+\..+/.test(v) || 'E-mail debe ser válido',
    ],
    emailRecomendo: [
      v => /.+@.+\..+/.test(v) || 'El E-mail del recomendado puede ir vacío',
    ],
  }),

  computed: {
    ...mapState('authentication', [
      'registerUsername',
      'registerEmail',
      'registerEmailRecomendo',
      'registerPassword',
      'registerTipo',
      'registerUserId',
      'registerError',
    ],['temas']),
  },

  methods: {
    ...mapMutations('authentication', [
      'setRegisterUsername',
      'setRegisterEmail',
      'setRegisterEmailRecomendo',
      'setRegisterPassword',
      'setRegisterTipo',
      'setRegisterUserId',
    ]),
    ...mapActions('authentication', [
      'register',
    ]),


    validado() {
      debugger
      if (this.$store.state.authentication.registerUsername!=null &&
          this.$store.state.authentication.registerEmail!=null &&
          this.$store.state.authentication.registerPassword!=null && 
          this.$store.state.authentication.registerTipo!=null &&
          !this.elMailExiste )
        { return true } 
      else 
        { return false }
    },


    revisoSiEstaElMail(cual) {
      debugger
      let aBuscar = cual==1 ? this.$store.state.authentication.registerEmail : this.$store.state.authentication.registerEmailRecomendo
      this.elMailExiste = false
      return HTTP().post('/existeelmail', {mail: aBuscar}).then(({ data }) => {
        debugger
        if (data && cual==1) {
          this.msg.msgTitle = 'Existe el Mail'
          this.msg.msgBody = 'El mail ingresado ya existe en gohu!<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'existe el mail'
          this.msg.msgButtons = ['Aceptar']
          this.elMailExiste = true
          this.$refs.mail.focus()
        } else if ( !data && cual==2 && this.$store.state.authentication.registerEmailRecomendo) {
          this.msg.msgTitle = 'No existe el Mail'
          this.msg.msgBody = 'El mail ingresado no existe en gohu!<br>'
          this.msg.msgVisible = true
          this.msg.msgAccion = 'no existe el mail'
          this.msg.msgButtons = ['Aceptar']
          this.elMailExiste = true
          this.$refs.mailrecomendo.focus()
        }
      })
      .catch(err => {
        console.log(err)
      })
    },


    msgRespuesta(op) {
      this.msg.msgVisible = false;
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
  .titulo-proveedor {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 110%;
  }
  .titulo-notificacion {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
  }
  .contenedor-galeria-fuente-importe {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
  }
  .contenedor-galeria-fuente-descuento {
    /*font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 100%;
    color: red;
  }
  .contenedor-galeria-fuente-final {
    /*font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;*/
    /*font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;*/
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 150%;
    color: black;
    font-weight: 200%;
  }

</style>