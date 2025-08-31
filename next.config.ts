// next.config.ts
import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const withMDX = createMDX({}) // no providerImportSource

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
}

export default withMDX(nextConfig)
