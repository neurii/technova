import { authMiddleware } from "@propelauth/nextjs/server/app-router";

export const middleware = authMiddleware;

export const config = {
  matcher: [
    '/api/auth/(.*)', // Protect API authentication routes
    '/((?!_next/static|_next/image|favicon.ico).*)', // Optional: Avoid matching static assets
  ],
};
