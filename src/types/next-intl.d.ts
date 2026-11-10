declare module "next-intl/server" {
  export function getRequestConfig(handler: (context: { requestLocale: Promise<string | undefined> }) => Promise<unknown>): unknown;
}

declare module "next-intl/middleware" {
  const createMiddleware: (config: unknown) => (request: unknown) => unknown;
  export default createMiddleware;
}
