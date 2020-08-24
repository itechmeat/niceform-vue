<template>
  <article
    v-shortkey="{ up: ['meta', 'arrowup'], down: ['meta', 'arrowdown'] }"
    class="feed"
    @shortkey="navigate"
  >
    <slot />
  </article>
</template>

<script>
export default {
  name: "Feed",

  methods: {
    navigate(e) {
      this.$emit(e.srcKey);
    },
  },
};
</script>

<style lang="scss" scoped>
$block: ".feed";

#{$block} {
  padding: 20px;
}
</style>
