export async function onRequest({ request, env }) {
    const url = new URL(request.url);
    const method = request.method;
    const path = url.pathname.replace("/api", ""); // Only if /api is a local prefix
    const body = await request.text(); // Get raw request body
  
    const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
  
    // Construct message: <timestamp><method><path><body>
    const encoder = new TextEncoder();
    const message = `${timestamp}${method}${path}${body}`;
  
    // Import HMAC secret key
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(env.HMAC_SECRET),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"]
    );
  
    // Sign the message
    const sigBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
    const signature = Array.from(new Uint8Array(sigBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  
    // Forward the request to your backend
    const backendUrl = `https://sandbox-project-694581007726.europe-west1.run.app${path}`;
  
    const backendResponse = await fetch(backendUrl, {
      method,
      headers: {
        "Content-Type": request.headers.get("Content-Type") || "application/json",
        "x-signature": signature,
        "x-timestamp": timestamp.toString(),
      },
      body,
    });
  
    return backendResponse;
  }
  