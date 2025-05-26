import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { getAuthSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getAuthSession()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("files") as File[]

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 })
    }

    const uploadedFiles = []

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist, that's fine
      console.log("Uploads directory already exists or created")
    }

    for (const file of files) {
      try {
        // Validate file
        if (!file.type.startsWith("image/")) {
          return NextResponse.json({ error: `File ${file.name} is not an image` }, { status: 400 })
        }

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          return NextResponse.json({ error: `File ${file.name} is too large (max 5MB)` }, { status: 400 })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const randomString = Math.random().toString(36).substring(2, 15)
        const extension = file.name.split(".").pop()?.toLowerCase() || "jpg"
        const filename = `${timestamp}-${randomString}.${extension}`

        // Convert file to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Save file
        const filepath = join(uploadsDir, filename)
        await writeFile(filepath, buffer)

        // Store file info
        uploadedFiles.push({
          filename,
          originalName: file.name,
          size: file.size,
          type: file.type,
          url: `/uploads/${filename}`,
        })

        console.log(`Successfully uploaded: ${filename}`)
      } catch (fileError) {
        console.error(`Error processing file ${file.name}:`, fileError)
        return NextResponse.json({ error: `Failed to process file ${file.name}` }, { status: 500 })
      }
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 })
  }
}

// Configure the API route to handle larger payloads
export const runtime = "nodejs"
export const dynamic = "force-dynamic"
