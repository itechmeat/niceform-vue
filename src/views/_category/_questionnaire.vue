<template>
  <div class="home">
    <feed
      v-if="questions"
      :can-navigate="
        currentQuestion && currentQuestion.question_type !== 'text'
      "
      @left="prevQuestion()"
      @right="nextQuestion()"
    >
      <question
        v-for="(question, index) in questions"
        :key="question.identifier"
        :value="question"
        :own-index="index"
        :active-index="activeQuestionIndex"
        :number="index + 1"
        :wrong="isShaking && activeQuestionIndex === index"
        @submit="nextQuestion"
      />
    </feed>

    <keyboard ref="keyboard" @click="handleKeyboardClick" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import * as TYPES from "@/store/modules/questionnaire/types";
import Feed from "@/components/shared/Feed";
import Question from "@/components/shared/Question";
import Keyboard from "@/components/shared/Keyboard";

export default {
  name: "QuestionnairePage",

  components: {
    Feed,
    Question,
    Keyboard,
  },

  data() {
    return {
      activeQuestionIndex: 0,
      isShaking: false,
    };
  },

  mounted() {
    this.fetchQuestionnaire();
  },

  computed: {
    ...mapGetters("questionnaire", {
      questionnaire: TYPES.GET_QUESTIONNAIRE,
      questions: TYPES.GET_QUESTIONS,
    }),

    currentQuestion() {
      if (this.questions.length === 0) {
        return;
      }

      return this.questions[this.activeQuestionIndex];
    },

    canNext() {
      if (!this.currentQuestion) {
        return;
      }

      return (
        !this.currentQuestion.required ||
        (this.currentQuestion.choices &&
          this.currentQuestion.choices.some((item) => item.selected)) ||
        (this.currentQuestion.text && this.currentQuestion.text.length > 0)
      );
    },
  },

  methods: {
    ...mapActions("questionnaire", ["fetchQuestionnaire"]),

    prevQuestion() {
      if (this.activeQuestionIndex === 0) {
        return;
      }
      this.activeQuestionIndex--;
      this.$refs.keyboard.handleKey("left");
    },

    nextQuestion() {
      if (this.activeQuestionIndex >= this.questions.length || !this.canNext) {
        this.shake();
        return;
      }
      this.activeQuestionIndex++;
      this.$refs.keyboard.handleKey("right");
    },

    handleKeyboardClick(key) {
      switch (key) {
        case "right":
          this.nextQuestion();
          break;
        case "left":
          this.prevQuestion();
          break;
      }
    },

    shake() {
      this.isShaking = true;

      setTimeout(() => {
        this.isShaking = false;
      }, 500);
    },
  },
};
</script>
