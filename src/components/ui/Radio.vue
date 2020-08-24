<template>
  <label class="ui-radio">
    <input type="radio" :name="name" :value="value" class="ui-radio__radio" />
    <span v-if="variant" class="ui-radio__variant">
      {{ variant }}
    </span>
    <span class="ui-radio__label">
      {{ label }}
    </span>
  </label>
</template>

<script>
export default {
  name: "UiRadio",

  props: {
    value: {
      type: String,
      default: () => undefined,
    },
    type: {
      type: String,
      default: () => undefined,
    },
    name: {
      type: String,
      default: () => undefined,
    },
    label: {
      type: String,
      default: () => undefined,
    },
    variant: {
      type: String,
      default: () => undefined,
    },
  },
};
</script>

<style lang="scss" scoped>
$block: ".ui-radio";

#{$block} {
}
</style>
