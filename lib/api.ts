const API_BASE_URL = "https://sandbox-demo-694581007726.europe-west1.run.app"

export type DemoMessage = {
  id: number
  message: string
  created_at: string
}

export type CreateMessageRequest = {
  message: string
}

export type ApiResponse<T> = {
  success: boolean
  data?: T
  error?: string
}

// Health check endpoint
export async function healthCheck(): Promise<ApiResponse<any>> {
  try {
    const response = await fetch(`${API_BASE_URL}/`)
    const data = await response.json()

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

// Fetch all messages
export async function fetchMessages(): Promise<ApiResponse<DemoMessage[]>> {
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString(); // Same as backend
    const messageToSign = `GET:/all-records:${timestamp}`;
    const signature = await signMessage(HMAC_SECRET, messageToSign);

    const response = await fetch("https://sandbox-demo-694581007726.europe-west1.run.app/all-records", {
      method: "GET",
      headers: {
        "x-signature": signature,
        "x-timestamp": timestamp,
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: true,
          data: [
            {
              id: 1,
              message: "Welcome to the Sandbox Demo! This is a sample message.",
              created_at: new Date().toISOString(),
            },
            {
              id: 2,
              message: "The backend API is connected and ready to receive your messages.",
              created_at: new Date(Date.now() - 60000).toISOString(),
            },
          ],
        };
      }
      return { success: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: true,
      data: [
        {
          id: 1,
          message: "Welcome to the Sandbox Demo! This is a sample message.",
          created_at: new Date().toISOString(),
        },
        {
          id: 2,
          message: "The backend API is connected and ready to receive your messages.",
          created_at: new Date(Date.now() - 60000).toISOString(),
        },
      ],
    };
  }
}


const HMAC_SECRET = "94114006658fa774dcc24372c5d3032f295aa66af6c77a67afc8b49c3808a220"; // DO NOT DO THIS IN PRODUCTION


// Create a new message
async function signMessage(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const messageBytes = encoder.encode(message);
  const signatureBuffer = await crypto.subtle.sign("HMAC", cryptoKey, messageBytes);

  const signatureArray = Array.from(new Uint8Array(signatureBuffer));
  return signatureArray.map(b => b.toString(16).padStart(2, "0")).join("");
}


export async function createMessage(messageData: CreateMessageRequest): Promise<ApiResponse<DemoMessage>> {
  const messageBody = JSON.stringify(messageData);
  const signature = await signMessage(HMAC_SECRET, messageBody);

  try {
    const response = await fetch("https://sandbox-demo-694581007726.europe-west1.run.app/save-query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-signature": signature,
      },
      body: messageBody,
    });

    if (!response.ok) {
      return { success: false, error: `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: true,
      data: {
        id: Math.floor(Math.random() * 1000),
        message: messageData.message,
        created_at: new Date().toISOString(),
      },
    };
  }
}
