<template>
  <v-dialog v-model="visible" persistent max-height="1000" max-width="1000">
    <template v-slot:activator="{}"></template>
    <v-card>
      <v-toolbar flat
        :color="temas.forms_titulo_bg"
        :dark="temas.forms_titulo_dark==true">
        <v-btn
          icon @click="handleClick('Cancelar')"
          :color="temas.forms_close_bg"
          :dark="temas.forms_close_dark==true">
          <v-icon>mdi-arrow-left-circle</v-icon>
        </v-btn>
        <span class="text--right">
          {{title}} para: {{to}}
        </span>
        <v-spacer></v-spacer>
        <span class="text--right">
          <v-btn
            :color="temas.cen_btns_bg"
            :dark="temas.cen_btns_dark==true"
            class="ma-2 white--text"
            @click="handleClick('Enviar')">
            Enviar
          </v-btn>
        </span>
      </v-toolbar>
      <v-card-title
        class="headline">
      </v-card-title>
      <v-card-text>
        <div>
          <v-textarea
            v-model="body"
            :color="temas.forms_titulo_bg"
            label="Texto del Mail" auto-grow outlined rows="10" row-height="5" shaped>
          </v-textarea>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable */

import { mapState } from 'vuex';

export default {
  props: {
    token: String,
    host: String,
    username: String,
    password: String,
    to: String,
    from: String,
    subject: String,
    body: String,
    title: String,
    visible: Boolean,
    buttons: Array,
  },
  data: () => ({
  }),
  computed: {
    ...mapState([
      'tema',
      'temas',
    ]),
  },
  methods: {
    handleClick(op) {
      //token: '20b444a2-b3af-4eb8-bae7-911f6097521c',
      debugger
      if (op === 'Enviar') {
        debugger
        Email.send({
          token: '4a720391-3103-4352-ac74-d48f13f1a13b',
          Host: 'smtp.gmail.com',
          Username: 'gohuapp',
          Password: 'gmail021201',
          To: this.to,
          From: 'gohuapp@gmail.com',
          Subject: this.subject,
          Body: this.body,
        }).then((data)=>{
          debugger
          this.$emit('click', op)
        }
        ).catch((err)=>{
          debugger
          console.log(err)
          this.$emit('click', 'error')
        });
      } else if (op === 'Cancelar') {
        this.$emit('click', op);
      }
    },
  },
};
</script>
