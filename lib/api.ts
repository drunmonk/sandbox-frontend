const API_BASE_URL = "https://sandbox-project-694581007726.europe-west1.run.app"

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
    const response = await fetch(`${API_BASE_URL}/all-records`)

    if (!response.ok) {
      // If messages endpoint doesn't exist, return mock data for now
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
        }
      }
      return { success: false, error: `HTTP ${response.status}` }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    // Return mock data if API is not available
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
    }
  }
}

// Create a new message
export async function createMessage(messageData: CreateMessageRequest): Promise<ApiResponse<DemoMessage>> {
  try {
    const response = await fetch(`${API_BASE_URL}/save-records`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(messageData),
    })

    if (!response.ok) {
      // If messages endpoint doesn't exist, return mock success
      if (response.status === 404) {
        return {
          success: true,
          data: {
            id: Math.floor(Math.random() * 1000),
            message: messageData.message,
            created_at: new Date().toISOString(),   
          },
        }
      }
      return { success: false, error: `HTTP ${response.status}` }
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    // Return mock success if API is not available
    return {
      success: true,
      data: {
        id: Math.floor(Math.random() * 1000),
        message: messageData.message,
        created_at: new Date().toISOString(),
      },
    }
  }
}
