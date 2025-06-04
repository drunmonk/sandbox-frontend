"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createMessage } from "@/lib/api"
import { mutate } from "swr"

type FormValues = {
  message: string
}

export default function MessageForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>()

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSubmitting(true)
      setSubmitStatus(null)

      const result = await createMessage({ message: data.message })

      if (result.success) {
        // Optimistically clear the textarea
        reset()
        setSubmitStatus({ type: "success", message: "Message sent successfully!" })

        // Trigger revalidation of the messages data
        mutate("demo_messages")
      } else {
        setSubmitStatus({ type: "error", message: result.error || "Failed to send message" })
      }
    } catch (error) {
      setSubmitStatus({ type: "error", message: "An unexpected error occurred" })
    } finally {
      setIsSubmitting(false)

      // Clear status message after 3 seconds
      setTimeout(() => setSubmitStatus(null), 3000)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          className="min-h-[100px]"
          {...register("message", {
            required: "Message is required",
            maxLength: {
              value: 280,
              message: "Message cannot exceed 280 characters",
            },
          })}
        />
        {errors.message && <p className="text-sm text-red-500">{errors.message.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>

      {submitStatus && (
        <div className={`text-sm text-center ${submitStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {submitStatus.message}
        </div>
      )}
    </form>
  )
}
