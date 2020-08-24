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
        @submit="nextQuestion"
      />
    </feed>
  </div>
</template>

<script>
import axios from "axios";
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
      questionnaire: null,
      activeQuestionIndex: 0,
    };
  },

  mounted() {
    this.fetchQuestionsList();
  },

  computed: {
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
    async fetchQuestionsList() {
      try {
        const { data } = await axios.get("/api/questionnaire.json");
        if (!data || !data.questionnaire || data.questionnaire.length === 0) {
          return;
        }
        // console.log(
        //   data.questionnaire.questions.map((item) => item.description)
        // );
        this.questionnaire = data.questionnaire;
      } catch (err) {
        console.error("fetchQuestionsList", err);
      }
    },

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
        return;
      }
      this.activeQuestionIndex++;
    },
  },
};
</script>
