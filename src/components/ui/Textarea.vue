<template>
  <label class="ui-textarea">
    <textarea :value="value" class="ui-textarea__field" />
  </label>
</template>

<script>
export default {
  name: "UiTextarea",

  props: {
    value: {
      type: String,
      default: () => undefined,
    },
  },
};
</script>

<style lang="scss" scoped>
$block: ".ui-textarea";

#{$block} {
  &__field {
    width: 100%;
    height: 80px;
    min-height: 80px;
    max-height: 150px;
    padding: 6px 16px;
    font-size: 20px;
    resize: vertical;
  }
}
</style>
