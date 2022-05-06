<!--
<template>
  <v-container>
    <v-dialog max-width="500px">
      <template v-slot:activator="{}"></template>
      <v-card>
        <v-card-title>
          <span class="text-h6 font-weight-bold pb-6">
            Ingresar
          </span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            :value="loginEmail"
            @input="setLoginEmail"
            autofocus
            outlined
            label="Email"
            placeholder="Email">
          </v-text-field>
          <v-text-field
            :value="loginPassword"
            @input="setLoginPassword"
            outlined
            label="Password"
            placeholder="Password"
            type="password"
            autocomplete="new-password">
          </v-text-field>
          <v-alert type="error" v-model="login.error">
            {{login.errormsg}}
          </v-alert>
        </v-card-text>
        <v-card-actions class="text--center">
          <v-btn @click="login" color="info" dark large class="ml-2 mb-6">
            <v-icon class="mr-2">fingerprint</v-icon>
            Ingresar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    -->

    <!--
    <v-layout row wrap>
      <v-flex xs6 offset-xs3>
        <v-img
          height="125"
          width="200"
          src="/images/logoGoHu.jpg">
        </v-img>
        <h1>Ingreso</h1>
        <v-text-field
          label="Email"
          placeholder="Email"
          :value="loginEmail"
          @input="setLoginEmail">
        </v-text-field>

        <v-text-field
          label="Password"
          placeholder="Password"
          type="password"
          autocomplete="new-password"
          :value="loginPassword"
          @input="setLoginPassword">
        </v-text-field>

        <v-alert type="error" :value="loginError">
          {{loginError}}
        </v-alert>

        <v-btn @click="login"
          :color="$store.state.temas.forms_titulo_bg"
          :dark="$store.state.temas.forms_titulo_dark==true">
          <v-icon class="mr-2"
            :color="$store.state.temas.barra_principal_botonapp_bg"
            :dark="$store.state.temas.barra_principal_botonapp_dark==true">
            fingerprint</v-icon>
          Ingresar
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
-->
  <template>
    <v-container>
      <v-layout wrap>
        <v-flex sm12 md6 offset-md3>
          <v-card elevation="4" light tag="section" tile>
            <v-card-title>
              <v-layout align-center justify-space-between>
                <v-flex>
                  <v-img height="50" width="70" src="/images/logoGoHu.jpg">
                  </v-img>
                </v-flex>
              </v-layout>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <p>Ingrese su usuario y contraseña</p>
              <v-form>
                <v-text-field
                  outline
                  autofocus
                  label="correo electrónico"
                  type="text"
                  :value="loginEmail"
                  @input="setLoginEmail">
                </v-text-field>
                <v-text-field
                  outline
                  hide-details
                  :value="loginPassword"
                  @input="setLoginPassword"
                  label="Contraseña"
                  type="password">
                </v-text-field>
              </v-form>
            </v-card-text>
            <v-alert type="error" :value="loginError">
             {{loginError}}
            </v-alert>
            <v-divider></v-divider>
            <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
              <v-btn @click="login" color="info" dark large class="ml-0 mb-0 text-none">
                <v-icon class="mr-2">fingerprint</v-icon>
                Ingresar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
        <v-flex sm12 md6 offset-md3>
          <v-layout align-center justify-space-between>
            <p class="caption my-3">
              <a href="#">Privacy Policy</a>
              |
              <a href="#">Terms of Service</a>
            </p>
            <p class="caption my-3">Powered by <b>gohu</b></p>
          </v-layout>
        </v-flex>
      </v-layout>
    </v-container>
  </template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState('authentication', ['loginEmail', 'loginPassword', 'loginUserId', 'loginError'],
      [
        'sucursal',
        'sucursales',
        'sucursalFiscal',
        'notificaciones',
        'caja',
        'temas',
        'empresa',
        'tercero',
        'operario',
        'level',
      ]),
  },
  methods: {
    ...mapMutations('authentication', [
      'setLoginEmail',
      'setLoginPassword',
      'setLoginUserId'],
      [
        'setSucursal',
        'setSucursales',
        'setSucursalFiscal',
        'setNotificaciones',
        'setCaja',
        'setTemas',
        'setEmpresa',
        'setTercero',
        'setOperario',
        'setLevel',
      ]),
    ...mapActions('authentication', [
      'login',
    ]),
  },
};
</script>

<style>

</style>
