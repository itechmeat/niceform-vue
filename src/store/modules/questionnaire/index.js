import axios from "axios";

import * as TYPES from "./types";

const namespaced = true;

const state = () => ({
  questionnaire: null,
  questions: [],
});

const getters = {
  [TYPES.GET_QUESTIONNAIRE]: (state) => state.questionnaire,
  [TYPES.GET_QUESTIONS]: (state) => state.questions,
};

const mutations = {
  [TYPES.SET_QUESTIONNAIRE]: (state, payload) => {
    state.questionnaire = payload;
  },

  [TYPES.SET_QUESTIONS]: (state) => {
    state.questions = state.questionnaire.questions.map((question) => {
      const result = { ...question };

      if (result.multiple) {
        result.multiple = result.multiple === "true";
      }

      if (result.multiline) {
        result.multiline = result.multiline === "true";
      }

      if (result.question_type === "text") {
        result.text = null;
      }

      return result;
    });
  },

  [TYPES.SET_QUESTION_TEXT]: (state, payload) => {
    const question = state.questions.find(
      (item) => item.identifier === payload.identifier
    );
    question.text = payload.text;
  },

  [TYPES.SET_QUESTION_VARIANT]: (state, payload) => {
    const question = state.questions.find(
      (item) => item.identifier === payload.identifier
    );

    const variant = question.choices.find(
      (choice) => choice.value === payload.variant.value
    );

    if (!variant || variant === -1) {
      return;
    }

    if (payload.variant.type === "checkbox") {
      variant.selected = payload.variant.selected;
    }

    if (payload.variant.type === "radio") {
      question.choices.forEach((item) => {
        item.selected = false;
      });
      variant.selected = true;
    }
  },
};

const actions = {
  async fetchQuestionnaire({ commit }) {
    try {
      const { data } = await axios.get("/api/questionnaire.json");
      if (!data || !data.questionnaire || data.questionnaire.length === 0) {
        return;
      }
      commit("SET_QUESTIONNAIRE", data.questionnaire);
      commit("SET_QUESTIONS");
    } catch (err) {
      console.error("fetchQuestionsList", err);
    }
  },
};

export default {
  namespaced,
  state,
  getters,
  mutations,
  actions,
};
