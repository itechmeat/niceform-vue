<template>
  <div class="home">
    <div>
      <questionnaire-card :value="questionnaire" :number="numberOfQuestions" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import * as TYPES from "@/store/modules/questionnaire/types";
import QuestionnaireCard from "@/components/shared/QuestionnaireCard";

export default {
  name: "Home",

  components: {
    QuestionnaireCard,
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

    numberOfQuestions() {
      if (!this.questions) {
        return;
      }

      return this.questions.length;
    },
  },

  methods: {
    ...mapActions("questionnaire", ["fetchQuestionnaire"]),
  },
};
</script>

<style lang="scss" scoped>
$block: ".home";

#{$block} {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 60px);
}
</style>
