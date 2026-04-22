import State from "../../../utils/State";
import getConnectorDetails, {
  should_continue_further,
} from "../../configs/Payment/Utils";

let globalState;

describe("[Payment] [Connector Testing Data] [Payment Method: Card]", () => {
  context("[Payment] [No 3DS] [Capture: Automatic] [Adyen Connector Testing Data]", () => {
    let should_continue = true;

    before("seed global state", () => {
      cy.task("getGlobalState").then((state) => {
        globalState = new State(state);
      });
    });

    beforeEach(function () {
      if (!should_continue) {
        this.skip();
      }
    });

    after("flush global state", () => {
      cy.task("setGlobalState", globalState.data);
    });

    it("Create payment intent with connector_metadata", () => {
      const data = getConnectorDetails(globalState.get("connectorId"))[
        "card_pm"
      ]["ConnectorTestingData"];
      const req_data = data["Request"];
      const res_data = data["Response"];

      cy.paymentIntentCreateCall(
        globalState,
        req_data,
        res_data,
        "no_three_ds",
        "automatic"
      );

      if (should_continue) should_continue = should_continue_further(data);
    });

    it("Confirm payment intent with browser_info", () => {
      const data = getConnectorDetails(globalState.get("connectorId"))[
        "card_pm"
      ]["ConnectorTestingDataConfirm"];
      const req_data = data["Request"];

      cy.paymentConfirmCall(globalState, req_data, data);

      if (should_continue) should_continue = should_continue_further(data);
    });
  });
});
