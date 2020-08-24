<template>
  <article
    v-shortkey="{ left: ['arrowleft'], right: ['arrowright'] }"
    class="feed"
    @shortkey="navigate"
  >
    <div class="feed__line">
      <slot />
    </div>
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
  overflow: hidden;
  width: 100vw;
  height: 100vh;

  &__line {
    position: relative;
    width: 500px;
    max-width: calc(100% - 32px);
    height: calc(100vh - 32px);
    margin: 0 auto;
    perspective: 500px;
    transform-style: preserve-3d;
  }
}
</style>
