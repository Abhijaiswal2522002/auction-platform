const https = require("https")
const http = require("http")

async function verifyDeployment() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000"

  console.log("🔍 Verifying AuctionHub deployment...")
  console.log(`📍 Base URL: ${baseUrl}`)

  const endpoints = [
    { path: "/api/health", name: "Health Check" },
    { path: "/api/auctions", name: "Auctions API" },
    { path: "/api/categories", name: "Categories API" },
    { path: "/status", name: "Status Page" },
    { path: "/", name: "Homepage" },
  ]

  const results = []

  for (const endpoint of endpoints) {
    try {
      console.log(`\n🧪 Testing ${endpoint.name}...`)

      const response = await makeRequest(`${baseUrl}${endpoint.path}`)

      if (response.statusCode >= 200 && response.statusCode < 400) {
        console.log(`✅ ${endpoint.name}: OK (${response.statusCode})`)
        results.push({ ...endpoint, status: "success", code: response.statusCode })
      } else {
        console.log(`❌ ${endpoint.name}: Failed (${response.statusCode})`)
        results.push({ ...endpoint, status: "error", code: response.statusCode })
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: Error - ${error.message}`)
      results.push({ ...endpoint, status: "error", error: error.message })
    }
  }

  // Summary
  console.log("\n📊 Deployment Verification Summary:")
  console.log("=".repeat(50))

  const successful = results.filter((r) => r.status === "success").length
  const total = results.length

  results.forEach((result) => {
    const status = result.status === "success" ? "✅" : "❌"
    const code = result.code ? `(${result.code})` : ""
    console.log(`${status} ${result.name} ${code}`)
  })

  console.log("=".repeat(50))
  console.log(`📈 Success Rate: ${successful}/${total} (${Math.round((successful / total) * 100)}%)`)

  if (successful === total) {
    console.log("\n🎉 All systems operational! Your AuctionHub platform is ready.")
    console.log(`🌐 Visit your platform: ${baseUrl}`)
    console.log(`📊 System status: ${baseUrl}/status`)
    console.log(`🚀 Launch page: ${baseUrl}/launch`)
  } else {
    console.log("\n⚠️  Some endpoints failed. Check the errors above.")
    process.exit(1)
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http

    const req = client.get(url, (res) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers,
      })
    })

    req.on("error", reject)
    req.setTimeout(10000, () => {
      req.destroy()
      reject(new Error("Request timeout"))
    })
  })
}

// Run verification
if (require.main === module) {
  verifyDeployment().catch(console.error)
}

module.exports = { verifyDeployment }
