<template>
  <label class="ui-input">
    <input
      :value="value"
      :type="type"
      class="ui-input__field"
      @keyup.enter="submit"
    />
  </label>
</template>

<script>
export default {
  name: "UiInput",

  props: {
    value: {
      type: String,
      default: () => undefined,
    },
    type: {
      type: String,
      default: () => undefined,
    },
  },

  methods: {
    submit() {
      console.log("!!");
    },
  },
};
</script>

<style lang="scss" scoped>
$block: ".ui-input";

#{$block} {
  &__field {
    width: 100%;
    padding: 6px 16px;
    font-size: 20px;
  }
}
</style>
