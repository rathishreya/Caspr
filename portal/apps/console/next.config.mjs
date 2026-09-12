/** @type {import('next').NextConfig} */
const nextConfig = {
  // Workspace packages ship TypeScript source rather than a build step. One fewer artefact
  // to keep in sync, and the tokens stay one file rather than a file and its compiled copy.
  transpilePackages: ['@caspr-portal/domain', '@caspr-portal/tokens', '@caspr-portal/db'],
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  // Linting is a workspace-level gate (`npm run gate`), never a step inside the build —
  // a build that lints is a build that fails for a reason nobody deploying cares about.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'DENY' },
          // The console holds the customer email list, seven social tokens and three ad
          // credentials — build spec §7. It has no business being embedded anywhere.
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
