import { NextResponse } from "next/server"
import { getAuthSession } from "@/lib/auth"
import { pusherServer } from "@/lib/pusher"

export async function POST(request: Request) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.text()
    const params = new URLSearchParams(body)
    const socketId = params.get("socket_id")
    const channel = params.get("channel_name")

    if (!socketId || !channel) {
      return NextResponse.json({ error: "Missing socket_id or channel_name" }, { status: 400 })
    }

    // Authorize user for private channels
    const authResponse = pusherServer.authorizeChannel(socketId, channel, {
      user_id: session.user.id,
      user_info: {
        name: session.user.name,
        username: session.user.username,
        avatar: session.user.avatar,
      },
    })

    return NextResponse.json(authResponse)
  } catch (error) {
    console.error("Pusher auth error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
