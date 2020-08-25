<template>
  <div class="home">
    <feed v-if="questionnaire" @left="prevQuestion" @right="nextQuestion">
      <question
        v-for="(question, index) in questionnaire.questions"
        :key="question.identifier"
        :value="question"
        :own-index="index"
        :active-index="activeQuestionIndex"
        :number="index + 1"
        :wrong="isShaking && activeQuestionIndex === index"
        @submit="nextQuestion"
      />
    </feed>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// import * as TYPES from "@/store/modules/questionnaire/types";
import Feed from "@/components/shared/Feed";
import Question from "@/components/shared/Question";

export default {
  name: "Home",

  components: {
    Feed,
    Question,
  },

  data() {
    return {
      selectedProgram: "",
      activeQuestionIndex: 0,
      isShaking: false,
    };
  },

  mounted() {
    this.fetchQuestionnaire();
  },

  computed: {
    ...mapGetters("questionnaire", {
      questionnaire: "GET_QUESTIONNAIRE",
    }),

    canNext() {
      if (this.questionnaire.questions.length === 0) {
        return;
      }

      const question = this.questionnaire.questions[this.activeQuestionIndex];

      return (
        !question.required ||
        (question.choices && question.choices.some((item) => item.selected)) ||
        (question.text && question.text.length > 0)
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
    },

    nextQuestion() {
      if (
        this.activeQuestionIndex >= this.questionnaire.questions.length - 1 ||
        !this.canNext
      ) {
        this.shake();
        return;
      }
      this.activeQuestionIndex++;
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
