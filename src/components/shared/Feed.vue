<template>
  <article
    v-shortkey="{ left: ['arrowleft'], right: ['arrowright'] }"
    v-touch:swipe="handleSwipe"
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

    handleSwipe(e) {
      if (e === "left") {
        this.$emit("right");
      }

      if (e === "right") {
        this.$emit("left");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/_mixins";

$block: ".feed";

#{$block} {
  overflow: hidden;

  @include display-less(tablet) {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &__line {
    position: relative;

    @include display-less(tablet) {
      width: 100%;
      height: 100%;
      background: var(--color-dark);
    }

    @include display(tablet) {
      width: 500px;
      max-width: calc(100% - 32px);
      height: calc(100vh - 32px);
      margin: 0 auto;
      perspective: 500px;
      transform-style: preserve-3d;
    }
  }
}
</style>
