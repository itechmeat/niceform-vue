import CONTENT from "../../../public/api/questionnaire.json";

const numberOfQuestions = CONTENT.questionnaire.questions.length;
const category = CONTENT.questionnaire.category_name_hyphenated
  .toLowerCase()
  .replace(/\u0026shy;/g, "-");

describe("The application", () => {
  it("should have a homescreen", () => {
    cy.visit("http://localhost:5000/");
    cy.contains(".card__title", CONTENT.questionnaire.name);
    cy.contains(".card__description", CONTENT.questionnaire.description);
    cy.contains(".card__number", `Number of questions: ${numberOfQuestions}`);
  });

  it("should redirect by click to questions", () => {
    cy.get(".card").click();
    cy.url().should(
      "include",
      `${category}/${CONTENT.questionnaire.identifier}`
    );
    cy.contains(".stepper__total", numberOfQuestions - 1);
  });

  it("should have should open the first question", () => {
    cy.contains(".feed", CONTENT.questionnaire.questions[0].headline);
    cy.contains(".stepper__current", "1");
  });

  it("should have should slide to the second question", () => {
    cy.get(".keyboard__control_right").click();
    cy.contains(".feed", CONTENT.questionnaire.questions[1].headline);
    cy.contains(".stepper__current", "2");
  });
});
