<template>
  <label class="ui-checkbox">
    <input
      type="checkbox"
      :name="name"
      :value="value"
      class="ui-checkbox__radio"
    />
    <span v-if="variant" class="ui-checkbox__variant">
      {{ variant }}
    </span>
    <span class="ui-checkbox__label">
      {{ label }}
    </span>
  </label>
</template>

<script>
export default {
  name: "UiCheckbox",

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
$block: ".ui-checkbox";

#{$block} {
  display: block;
}
</style>
