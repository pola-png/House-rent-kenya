export const dynamic = 'force-static'

const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"></svg>`

export async function GET() {
  return new Response(SVG, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

