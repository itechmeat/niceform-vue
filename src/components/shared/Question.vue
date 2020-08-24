<template>
  <section v-if="formattedValue" :class="classes">
    <header class="question__header">
      <small class="question__number">{{ ownIndex + 1 }}</small>
      <h2 class="question__title">
        {{ formattedValue.headline }}
        <sup v-if="formattedValue.required" class="question__required">*</sup>
      </h2>
    </header>

    <div class="question__form">
      <div
        v-if="formattedValue.question_type === 'multiple-choice'"
        :class="[
          'question__options',
          'question__options_multiple',
          { 'question__options_with-columns': hasColumns },
        ]"
        v-shortkey="hotKeys"
        @shortkey="navigate"
      >
        <ui-variant
          v-for="(option, index) in formattedValue.choices"
          :key="index"
          :type="typeOfControl"
          :name="formattedValue.identifier"
          :value="option.value"
          :label="option.label"
          :variant="getCharNum(index)"
          :checked="option.selected"
          :active="activeVariantIndex === index"
          @change="change"
        />
      </div>

      <div
        v-else-if="formattedValue.question_type === 'text'"
        class="question__options"
      >
        <component :is="'ui-' + typeOfControl" :value="formattedValue.text" />
      </div>

      <div v-else class="question__options">
        :(
      </div>
    </div>
  </section>
</template>

<script>
import { getCharsList, getCharByIndex } from "@/libs/utils";

const CHARS_TO_COLUMNS = 20;

export default {
  name: "Question",

  props: {
    value: {
      type: Object,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    ownIndex: {
      type: Number,
      required: true,
    },
    activeIndex: {
      type: Number,
      required: true,
    },
  },

  data() {
    return {
      formattedValue: null,
      activeVariantIndex: null,
    };
  },

  mounted() {
    this.formatValue(this.value);
  },

  computed: {
    classes() {
      const result = [
        "question",
        { question_active: this.ownIndex === this.activeIndex },
      ];

      if (this.ownIndex < this.activeIndex) {
        result.push(`question_prev`);
        result.push(`question_prev-${this.activeIndex - this.ownIndex}`);
      }

      if (this.ownIndex > this.activeIndex) {
        result.push(`question_next`);
        result.push(`question_next-${this.ownIndex - this.activeIndex}`);
      }

      return result;
    },

    typeOfControl() {
      if (this.formattedValue.question_type === "text") {
        if (!this.formattedValue.multiline) {
          return "input";
        }
        return "textarea";
      }
      if (this.formattedValue.question_type === "multiple-choice") {
        if (!this.formattedValue.multiple) {
          return "radio";
        }
        return "checkbox";
      }
      return "unknown";
    },

    hasColumns() {
      if (
        !this.value ||
        !this.value.choices ||
        this.value.choices.length === 0
      ) {
        return;
      }

      return (
        this.value.choices.every(
          (choice) => choice.label.length < CHARS_TO_COLUMNS
        ) && this.value.choices.length > 2
      );
    },

    hotChars() {
      const chars = getCharsList().slice(0, this.formattedValue.choices.length);
      return chars.map((char) => char.toLowerCase());
    },

    hotKeys() {
      if (this.activeIndex !== this.ownIndex) {
        return;
      }

      const result = {
        up: ["arrowup"],
        down: ["arrowdown"],
        enter: ["enter"],
      };

      this.hotChars.forEach((char) => {
        result[char] = [char];
      });

      return result;
    },
  },

  watch: {
    activeIndex: {
      immediate: true,
      handler(val) {
        if (val === this.ownIndex) {
          return;
        }
        this.activeVariantIndex = null;
      },
    },
  },

  methods: {
    formatValue(val) {
      if (!val) {
        return;
      }

      const result = { ...val };

      if (result.multiple) {
        result.multiple = result.multiple === "true";
      }

      if (result.multiline) {
        result.multiline = result.multiline === "true";
      }

      if (result.question_type === "text") {
        result.text = null;
      }

      this.formattedValue = result;
    },

    getCharNum(index) {
      return getCharByIndex(index);
    },

    change(val) {
      const variant = this.formattedValue.choices.find(
        (choice) => choice.value === val.value
      );

      if (!variant || variant === -1) {
        return;
      }

      if (val.type === "checkbox") {
        variant.selected = val.selected;
      }

      if (val.type === "radio") {
        this.formattedValue.choices.forEach((item) => {
          item.selected = false;
        });
        variant.selected = true;

        this.submit();
      }
    },

    navigate(val) {
      if (val.srcKey === "down") {
        if (
          this.activeVariantIndex === null ||
          this.activeVariantIndex === this.formattedValue.choices.length - 1
        ) {
          this.activeVariantIndex = 0;
          return;
        }

        this.activeVariantIndex++;
        return;
      }

      if (val.srcKey === "up") {
        if (!this.activeVariantIndex) {
          this.activeVariantIndex = this.formattedValue.choices.length;
        }

        this.activeVariantIndex--;
        return;
      }

      if (val.srcKey === "enter") {
        if (!this.activeVariantIndex) {
          this.$emit("submit");
        }
        return;
      }

      if (this.hotChars.includes(val.srcKey)) {
        const index = this.hotChars.findIndex((char) => char === val.srcKey);

        if (this.typeOfControl === "radio") {
          this.formattedValue.choices.forEach((item) => {
            item.selected = false;
          });
          this.formattedValue.choices[index].selected = true;

          this.submit();
        }

        if (this.typeOfControl === "checkbox") {
          this.formattedValue.choices[index].selected = !this.formattedValue
            .choices[index].selected;
        }
      }
    },

    submit() {
      setTimeout(() => {
        this.$emit("submit");
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
$block: ".question";

#{$block} {
  position: absolute;
  top: 50%;
  right: 0;
  left: 0;
  padding: 16px 48px;
  border: 1px solid #4bb1a9;
  background: #fff;
  line-height: 1.25;
  text-align: left;
  opacity: 0;
  transition: transform 0.4s ease-in-out, opacity 0.4s ease-in-out;

  &:not(#{$block}_active) {
    pointer-events: none;
  }

  &_active {
    opacity: 1;
    transform: translate(0, -50%) rotate3d(100, 0, 0, 0deg) scale(1);
  }

  &_prev {
    transform: translate(-120%, -50%) rotateY(-45deg) scale(0.5);

    &-1 {
      opacity: 0.5;
      transform: translate(-86%, -50%) rotateY(-25deg) scale(0.9);
    }
  }

  &_next {
    transform: translate(120%, -50%) rotateY(45deg) scale(0.5);

    &-1 {
      opacity: 0.5;
      transform: translate(86%, -50%) rotateY(25deg) scale(0.9);
    }
  }

  &__header {
    position: relative;
  }

  &__number {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 2px;
    right: calc(100% + 8px);
    font-size: 18px;
    font-weight: 500;
    color: #999;

    &::after {
      content: ".";
      display: inline;
    }
  }

  &__title {
    margin: 0 0 16px;
    font-size: 20px;
    font-weight: 500;
  }

  &__options {
    &_multiple {
      display: grid;
      grid-row-gap: 8px;
      grid-column-gap: 24px;
      width: max-content;
    }

    &_with-columns {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>
