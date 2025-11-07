export const dynamic = 'force-static'

const BASE64_1X1_PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NgYGD4DwABBAEA9noN2QAAAABJRU5ErkJggg=='

export async function GET() {
  const body = Buffer.from(BASE64_1X1_PNG, 'base64')
  return new Response(body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}

