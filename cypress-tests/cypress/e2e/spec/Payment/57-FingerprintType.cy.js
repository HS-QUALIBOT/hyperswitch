import * as fixtures from "../../../fixtures/imports";
import State from "../../../utils/State";
import getConnectorDetails, * as utils from "../../configs/Payment/Utils";

let globalState;

describe("Payments Response - fingerprint_type field", () => {
  before("seed global state", () => {
    cy.task("getGlobalState").then((state) => {
      globalState = new State(state);
    });
  });

  after("flush global state", () => {
    cy.task("setGlobalState", globalState.data);
  });

  context("Setup", () => {
    it("should enable blocklist functionality using configs API", () => {
      const merchantId = globalState.get("merchantId");
      const key = `guard_blocklist_for_${merchantId}`;
      const value = "true";

      cy.setConfigs(globalState, key, value, "CREATE");
    });
  });

  context("Card - NoThreeDS payment should report fingerprint_type as fpan", () => {
    it("Create Payment Intent -> Confirm Payment -> Retrieve Payment", () => {
      let shouldContinue = true;

      cy.step("Create Payment Intent", () => {
        const data = getConnectorDetails(globalState.get("connectorId"))[
          "card_pm"
        ]["PaymentIntent"];

        cy.createPaymentIntentTest(
          fixtures.createPaymentBody,
          data,
          "no_three_ds",
          "automatic",
          globalState
        );

        if (!utils.should_continue_further(data)) {
          shouldContinue = false;
        }
      });

      cy.step("Confirm Payment", () => {
        if (!shouldContinue) {
          cy.task("cli_log", "Skipping step: Confirm Payment");
          return;
        }
        const confirmData = getConnectorDetails(globalState.get("connectorId"))[
          "card_pm"
        ]["No3DSAutoCapture"];

        cy.confirmCallTest(
          fixtures.confirmBody,
          confirmData,
          true,
          globalState
        );

        if (!utils.should_continue_further(confirmData)) {
          shouldContinue = false;
        }
      });

      cy.step("Retrieve Payment and assert fingerprint_type", () => {
        if (!shouldContinue) {
          cy.task("cli_log", "Skipping step: Retrieve Payment");
          return;
        }

        cy.getPaymentDetails(globalState).then((response) => {
          expect(response.status).to.equal(200);
          expect(response.body).to.have.property("fingerprint_type", "fpan");
          expect(response.body.fingerprint).to.not.be.null;
        });
      });
    });
  });

  context("Cleanup", () => {
    it("should disable blocklist functionality using configs API", () => {
      const merchantId = globalState.get("merchantId");
      const key = `guard_blocklist_for_${merchantId}`;
      const value = "true";

      cy.setConfigs(globalState, key, value, "DELETE");
    });
  });
});
