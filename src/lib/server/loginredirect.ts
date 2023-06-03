import type { RequestEvent } from "@sveltejs/kit";

export const handleLoginRedirect = (url: URL, message = "You must be logged in to access this page") => {
    const redirectTo = url.pathname + url.search;
    return `/login?redirectTo=${redirectTo}&message=${message}`
}  

export const handleIdLoginRedirect = (code: string, redirectTo: string) => {
    return `/login/${code}?redirectTo=${redirectTo}`
}  
