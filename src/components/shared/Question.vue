<template>
  <section
    v-if="formattedValue"
    :class="['question', { question_active: active }]"
  >
    <header class="question__header">
      <small class="question__number">{{ number }}</small>
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
    active: Boolean,
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
      if (!this.active) {
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
    active: {
      immediate: true,
      handler(val) {
        if (val) {
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

        setTimeout(() => {
          this.$emit("submit");
        }, 500);
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

          setTimeout(() => {
            this.$emit("submit");
          }, 500);
        }

        if (this.typeOfControl === "checkbox") {
          this.formattedValue.choices[index].selected = !this.formattedValue
            .choices[index].selected;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$block: ".question";

#{$block} {
  max-width: 460px;
  margin: 32px auto;
  padding: 16px 48px;
  border: 1px solid #4bb1a9;
  background: #fff;
  line-height: 1.25;
  text-align: left;

  &_active {
    border-color: #0f68d2;
    box-shadow: 0 0 8px #0f68d2;
  }

  &__header {
    position: relative;
  }

  &__number {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 3px;
    right: calc(100% + 8px);
    font-size: 20px;
    font-weight: 500;
    color: #999;

    &::after {
      content: ".";
      display: inline;
    }
  }

  &__title {
    margin: 0 0 16px;
    font-size: 24px;
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
