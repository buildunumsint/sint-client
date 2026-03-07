/** Read at runtime so Fly secrets work: server uses process.env, client uses window.__NEXT_PUBLIC_ENV__ (injected by root layout). */
function getBaseUrl(): string {
  if (typeof window !== "undefined") {
    const env = (window as unknown as { __NEXT_PUBLIC_ENV__?: { NEXT_PUBLIC_API_BASE_URL?: string } }).__NEXT_PUBLIC_ENV__;
    if (env?.NEXT_PUBLIC_API_BASE_URL != null) return env.NEXT_PUBLIC_API_BASE_URL;
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "";
}

const baseUrl = getBaseUrl();
const API_BASE_PATH = "/api/v1";
const apiUrl = baseUrl + API_BASE_PATH;

const DEMO_VIDEO_SRC =
"https://customer-21jbwk0hhhjihrde.cloudflarestream.com/e6faf9d7d55cb99df4ffbdec606efdcf/iframe?poster=https%3A%2F%2Fcustomer-21jbwk0hhhjihrde.cloudflarestream.com%2Fe6faf9d7d55cb99df4ffbdec606efdcf%2Fthumbnails%2Fthumbnail.jpg%3Ftime%3D%26height%3D600";


export { apiUrl, API_BASE_PATH, baseUrl, DEMO_VIDEO_SRC };