"use client"

import { useState } from "react"
import useSWR from "swr"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { fetchMessages, healthCheck } from "@/lib/api"

const PAGE_SIZE = 10

export default function MessagesTable() {
  const [currentPage, setCurrentPage] = useState(1)

  // Health check to verify API connection
  const { data: healthData } = useSWR("health_check", healthCheck, {
    refreshInterval: 30000, // Check every 30 seconds
  })

  const {
    data: apiResponse,
    error,
    isLoading,
  } = useSWR("demo_messages", fetchMessages, {
    refreshInterval: 10000, // Refresh every 10 seconds
  })

  if (error) {
    return <div className="text-red-500">Error loading messages: {error.message}</div>
  }

  if (isLoading) {
    return <div className="text-center py-4">Loading messages...</div>
  }

  const messages = apiResponse?.data || []
  const totalMessages = messages.length
  const totalPages = Math.ceil(totalMessages / PAGE_SIZE)

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const endIndex = startIndex + PAGE_SIZE
  const currentMessages = messages.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-4">
      {/* API Status Indicator */}
      <div className="text-xs text-center">
        <span
          className={`inline-flex items-center gap-1 ${healthData?.success ? "text-green-600" : "text-yellow-600"}`}
        >
          <div className={`w-2 h-2 rounded-full ${healthData?.success ? "bg-green-500" : "bg-yellow-500"}`} />
          {healthData?.success ? "API Connected" : "Using Mock Data"}
        </span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">ID</TableHead>
              <TableHead>Message</TableHead>
              <TableHead className="w-36">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentMessages.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-4">
                  No messages found
                </TableCell>
              </TableRow>
            ) : (
              currentMessages.map((message) => (
                <TableRow key={message.id}>
                  <TableCell>{message.id}</TableCell>
                  <TableCell className="max-w-[200px] break-words">{message.message}</TableCell>
                  <TableCell className="text-xs">{formatDate(message.created_at)}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
