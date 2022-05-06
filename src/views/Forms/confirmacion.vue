<template>
  <v-row justify="center">
    <v-dialog v-model="visible" max-height="400" max-width="500">
      <v-card>
        <v-card-title class="title-font">{{title}}</v-card-title>
        <v-card-text class="body-font"><span v-html="body"></span></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-show="buttons.indexOf('Incorporar')>=0"
            color="green" dark autofocus
            class="btn-font"
            @click="handleClick('Incorporar')">
            Incorporar
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Aceptar')>=0"
            color="indigo darken-2"
            dark autofocus
            class="btn-font"
            @click="handleClick('Aceptar')">
            Aceptar
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Cancelar')>=0"
            color="grey" dark
            class="btn-font"
            @click="handleClick('Cancelar')">
            Cancelar
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Ignorar')>=0"
            color="blue" dark
            class="btn-font"
            @click="handleClick('Ignorar')">
            Ignorar
          </v-btn>
          <v-btn
            v-show="buttons.indexOf('Cerrar')>=0"
            color="black" dark
            class="btn-font"
            @click="handleClick('Cerrar')">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

/* eslint-disable */
export default {
  props: {
    title: String,
    body: String,
    visible: Boolean,
    buttons: Array,
  },

  data: () => ({
  }),
  methods: {
    handleClick(op) {
      this.$emit('click', op);
    },
  },
};
</script>

<style scoped>
  .title-font {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 120%;
  }
  .body-font {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 90%;
  }
  .btn-font {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
    'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 80%;
  }
</style>
