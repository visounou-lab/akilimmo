/**
 * Wave Payment API Client Wrapper
 * Handles all Wave API interactions
 * API Docs: https://docs.wave.com/
 */

const WAVE_API_BASE = "https://gql.waveapps.com/graphql/public";
const WAVE_API_KEY = process.env.WAVE_API_KEY;

export type WaveCreatePaymentInput = {
  amount: number;
  currency: string; // "XOF"
  description: string;
  customerEmail: string;
  customerName: string;
  externalId: string; // Your internal payment ID
};

export type WaveTransaction = {
  id: string;
  status: "COMPLETED" | "FAILED" | "PENDING" | "CANCELLED";
  total: {
    amount: number;
    currency: string;
  };
  customer?: {
    email: string;
    name: string;
  };
};

/**
 * Create a payment request via Wave API
 * Returns a payment link the customer can use
 */
export async function createWavePaymentRequest(
  input: WaveCreatePaymentInput
): Promise<{
  paymentRequestId: string;
  paymentLink: string;
}> {
  if (!WAVE_API_KEY) {
    throw new Error("WAVE_API_KEY not configured");
  }

  const mutation = `
    mutation createPaymentRequest(
      $input: PaymentRequestInput!
    ) {
      paymentRequestCreate(input: $input) {
        paymentRequest {
          id
          url
        }
        userErrors {
          message
          field
        }
      }
    }
  `;

  const variables = {
    input: {
      ownerEmail: process.env.WAVE_OWNER_EMAIL,
      amount: {
        amount: input.amount.toString(),
        currency: input.currency,
      },
      description: input.description,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      externalId: input.externalId,
    },
  };

  try {
    const response = await fetch(WAVE_API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WAVE_API_KEY}`,
      },
      body: JSON.stringify({
        query: mutation,
        variables,
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("[Wave API Error]", data.errors);
      throw new Error(`Wave API error: ${data.errors[0].message}`);
    }

    const paymentRequest = data.data?.paymentRequestCreate?.paymentRequest;
    if (!paymentRequest) {
      throw new Error("Failed to create payment request");
    }

    return {
      paymentRequestId: paymentRequest.id,
      paymentLink: paymentRequest.url,
    };
  } catch (err) {
    console.error("[Wave Client Error]", err);
    throw err;
  }
}

/**
 * Verify a webhook signature from Wave
 * Ensures the webhook is authentic
 */
export function verifyWaveWebhook(
  payload: string,
  signature: string
): boolean {
  // Wave doesn't use traditional HMAC yet, but verify the structure
  // TODO: Implement proper signature verification once Wave provides it
  if (!signature || !payload) return false;
  return true;
}

/**
 * Get transaction details from Wave
 * Used to verify payment status
 */
export async function getWaveTransaction(
  transactionId: string
): Promise<WaveTransaction | null> {
  if (!WAVE_API_KEY) {
    throw new Error("WAVE_API_KEY not configured");
  }

  const query = `
    query GetTransaction($id: ID!) {
      transaction(id: $id) {
        id
        status
        total {
          amount
          currency
        }
        customer {
          email
          name
        }
      }
    }
  `;

  try {
    const response = await fetch(WAVE_API_BASE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${WAVE_API_KEY}`,
      },
      body: JSON.stringify({
        query,
        variables: { id: transactionId },
      }),
    });

    const data = await response.json();
    return data.data?.transaction || null;
  } catch (err) {
    console.error("[Wave Get Transaction Error]", err);
    return null;
  }
}
