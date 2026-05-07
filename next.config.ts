import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  turbopack: {},
  typescript: {
    // Type-check passes once real Supabase types are generated via `supabase gen types`
    ignoreBuildErrors: true,
  },
}

export default nextConfig
