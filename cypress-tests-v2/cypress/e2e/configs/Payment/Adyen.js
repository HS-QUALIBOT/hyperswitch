import { getCustomExchange } from "./_Reusable";

const successfulNo3DSCardDetails = {
  card_number: "4917610000000000",
  card_exp_month: "03",
  card_exp_year: "2030",
  card_holder_name: "joseph Doe",
  card_cvc: "737",
};

const connectorMetadata = {
  adyen: {
    testing: {
      holder_name: "Test Override Name",
    },
  },
};

const browserInfo = {
  user_agent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  accept_header: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
  language: "en-US",
  color_depth: 24,
  screen_height: 1080,
  screen_width: 1920,
  time_zone: -180,
  java_enabled: false,
  java_script_enabled: true,
  ip_address: "127.0.0.1",
};

const billingAddress = {
  address: {
    line1: "123 Test St",
    line2: "",
    line3: "",
    city: "Amsterdam",
    state: "North Holland",
    zip: "1000AA",
    country: "NL",
    first_name: "Test",
    last_name: "User",
  },
};

const shippingAddress = {
  address: {
    line1: "123 Test St",
    line2: "",
    line3: "",
    city: "Amsterdam",
    state: "North Holland",
    zip: "1000AA",
    country: "NL",
    first_name: "Test",
    last_name: "User",
  },
};

export const connectorDetails = {
  card_pm: {
    PaymentIntent: getCustomExchange({
      Request: {
        amount_details: {
          order_amount: 1000,
          currency: "EUR",
        },
        billing: billingAddress,
        shipping: shippingAddress,
      },
      Response: {
        status: 200,
        body: {
          status: "requires_payment_method",
        },
      },
    }),
    No3DSAutoCapture: getCustomExchange({
      Request: {
        payment_method_data: {
          card: successfulNo3DSCardDetails,
        },
        payment_method_type: "card",
        payment_method_subtype: "credit",
        customer_acceptance: null,
      },
      Response: {
        status: 200,
        body: {
          status: "succeeded",
        },
      },
    }),
    ConnectorTestingData: getCustomExchange({
      Request: {
        amount_details: {
          order_amount: 1000,
          currency: "EUR",
        },
        billing: billingAddress,
        connector_metadata: connectorMetadata,
        customer_acceptance: null,
      },
      Response: {
        status: 200,
        body: {
          status: "requires_payment_method",
        },
      },
    }),
    ConnectorTestingDataConfirm: getCustomExchange({
      Request: {
        payment_method: "card",
        payment_method_data: {
          card: successfulNo3DSCardDetails,
        },
        browser_info: browserInfo,
        customer_acceptance: null,
      },
      Response: {
        status: 200,
        body: {
          status: "succeeded",
        },
      },
    }),
  },
};
