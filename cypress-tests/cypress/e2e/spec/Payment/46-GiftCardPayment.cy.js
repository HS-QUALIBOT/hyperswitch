import * as fixtures from "../../../fixtures/imports";
import State from "../../../utils/State";
import getConnectorDetails, * as utils from "../../configs/Payment/Utils";

let globalState;

describe("Gift Card Payment - Adyen Givex", () => {
  before("seed global state", () => {
    cy.task("getGlobalState").then((state) => {
      globalState = new State(state);
    });
  });

  after("flush global state", () => {
    cy.task("setGlobalState", globalState.data);
  });

  afterEach("flush global state", () => {
    cy.task("setGlobalState", globalState.data);
  });

  context("Givex gift card - successful balance check", () => {
    it("Create and Confirm Givex Gift Card Payment -> Retrieve Payment", () => {
      let shouldContinue = true;

      cy.step("Create and Confirm Givex Gift Card Payment", () => {
        const data = getConnectorDetails(globalState.get("connectorId"))[
          "gift_card_pm"
        ]["GivexGiftCard"];

        cy.createConfirmPaymentTest(
          fixtures.createConfirmPaymentBody,
          data,
          "no_three_ds",
          "automatic",
          globalState
        );

        if (!utils.should_continue_further(data)) {
          shouldContinue = false;
        }
      });

      cy.step("Retrieve Payment", () => {
        if (!shouldContinue) {
          cy.task("cli_log", "Skipping step: Retrieve Payment");
          return;
        }
        const data = getConnectorDetails(globalState.get("connectorId"))[
          "gift_card_pm"
        ]["GivexGiftCard"];

        cy.retrievePaymentCallTest({ globalState, data });
      });
    });
  });

  context("Givex gift card - insufficient balance", () => {
    it("Create and Confirm Givex Gift Card Payment with insufficient balance -> Retrieve Payment", () => {
      let shouldContinue = true;

      cy.step(
        "Create and Confirm Givex Gift Card Payment (Insufficient Balance)",
        () => {
          const data = getConnectorDetails(globalState.get("connectorId"))[
            "gift_card_pm"
          ]["GivexGiftCardInsufficientBalance"];

          cy.createConfirmPaymentTest(
            fixtures.createConfirmPaymentBody,
            data,
            "no_three_ds",
            "automatic",
            globalState
          );

          if (!utils.should_continue_further(data)) {
            shouldContinue = false;
          }
        }
      );

      cy.step("Retrieve Payment", () => {
        if (!shouldContinue) {
          cy.task("cli_log", "Skipping step: Retrieve Payment");
          return;
        }
        const data = getConnectorDetails(globalState.get("connectorId"))[
          "gift_card_pm"
        ]["GivexGiftCardInsufficientBalance"];

        cy.retrievePaymentCallTest({ globalState, data });
      });
    });
  });

  context("Givex gift card - currency mismatch", () => {
    it("Create and Confirm Givex Gift Card Payment with currency mismatch -> Retrieve Payment", () => {
      let shouldContinue = true;

      cy.step(
        "Create and Confirm Givex Gift Card Payment (Currency Mismatch)",
        () => {
          const data = getConnectorDetails(globalState.get("connectorId"))[
            "gift_card_pm"
          ]["GivexGiftCardCurrencyMismatch"];

          cy.createConfirmPaymentTest(
            fixtures.createConfirmPaymentBody,
            data,
            "no_three_ds",
            "automatic",
            globalState
          );

          if (!utils.should_continue_further(data)) {
            shouldContinue = false;
          }
        }
      );

      cy.step("Retrieve Payment", () => {
        if (!shouldContinue) {
          cy.task("cli_log", "Skipping step: Retrieve Payment");
          return;
        }
        const data = getConnectorDetails(globalState.get("connectorId"))[
          "gift_card_pm"
        ]["GivexGiftCardCurrencyMismatch"];

        cy.retrievePaymentCallTest({ globalState, data });
      });
    });
  });
});
