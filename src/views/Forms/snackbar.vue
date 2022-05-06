<template>
  <div class="text-center ma-2">
    <v-snackbar
      v-model="snackbar.visible"
      timeout="-1"
      :multi-line="snackbar.multiline === true"
      :color="snackbar.color">
      {{ snackbar.text }}
      <v-btn v-if="snackbar.button" color="info" text="" dark="" @click.native="closeAlert">
        Cerrar
      </v-btn>
    </v-snackbar>

<!--
    <v-snackbar
      v-model="snackbar.visible"
      :timeout="snackbar.timeout"
      :multi-line="snackbar.multiline === true"
      :color="snackbar.color">
      {{ snackbar.text }}
      <v-btn v-if="snackbar.button" color="info" text="" dark="" @click.native="closeAlert">
        Cerrar
      </v-btn>
    </v-snackbar>
-->
  </div>

</template>
<script>

import { mapMutations } from 'vuex';

export default {
  computed: {
    snackbar() {
      return this.$store.state.snackbar;
    },
  },
  methods: {
    ...mapMutations(['closeAlert']),
  },
};
</script>
