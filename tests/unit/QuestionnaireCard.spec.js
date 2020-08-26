import { shallowMount } from "@vue/test-utils";
import QuestionnaireCard from "@/components/shared/QuestionnaireCard.vue";

const props = {
  value: {
    id: 40,
    identifier: "ewBzTS",
    name: "Privathaftpflichtversicherung",
    description:
      "Um Dein persönliches Privathaftpflichtversicherungs-Angebot zu erstellen, benötigen wir noch ein paar Informationen von Dir.",
    category: "pri-vat-haft-pflicht",
  },
  number: 12,
};

const stubs = ["router-link"];

describe("QuestionnaireCard.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(QuestionnaireCard, {
      propsData: props,
      stubs,
    });
  });

  it("renders", () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("should have the correct title", () => {
    expect(wrapper.find("h3").text()).toBe(props.value.name);
  });

  it("can have the correct description", () => {
    expect(wrapper.find(".card__description").text()).toBe(
      props.value.description
    );
  });

  it("can dont have any description", () => {
    props.value.description = null;

    wrapper = shallowMount(QuestionnaireCard, {
      propsData: props,
      stubs,
    });

    expect(wrapper.find(".card__description").text()).not.toBe(true);
  });

  it("should have a counter of questions", () => {
    expect(wrapper.find(".card__number").text()).toBe(
      "Number of questions: " + props.number
    );
  });
});
