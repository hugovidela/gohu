<template>
  <v-row justify="center">
    <v-dialog v-model="visible" persistent max-height="400" max-width="500">
      <v-card>
        <v-card-title
          class="headline">{{ title }}
        </v-card-title>
        <v-card-text><span {{ body }}></span></v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            v-show="buttons.indexOf('Cerrar')>=0"
            color="black"
            dark
            @click="handleClick('Cerrar')">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>

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
