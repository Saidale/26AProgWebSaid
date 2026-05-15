export function logRequest(req: Request) {
    const url = new URL(req.url);
    const date = new Date().toISOString();
    console.log(`[${date}] ${req.method} ${url.pathname}`);
}