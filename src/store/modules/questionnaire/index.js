import axios from "axios";

import * as TYPES from "./types";

const namespaced = true;

const state = () => ({
  questionnaire: null,
});

const getters = {
  [TYPES.GET_QUESTIONNAIRE]: (state) => state.questionnaire,
};

const mutations = {
  [TYPES.SET_QUESTIONNAIRE]: (state, payload) => {
    state.questionnaire = payload;
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
