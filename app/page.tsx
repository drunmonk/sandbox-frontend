import MessageForm from "@/components/MessageForm"
import MessagesTable from "@/components/MessagesTable"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-zinc-50 p-4">
      <Card className="w-full max-w-lg rounded-2xl drop-shadow">
        <CardHeader>
          <CardTitle className="text-center text-zinc-900">Sandbox Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <MessageForm />
          <MessagesTable />
        </CardContent>
      </Card>
    </main>
  )
}
