import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const GET = (async ({ url }) => {
	const doc = new URL(url);
	doc.pathname = "/api/openapi.json";
	throw redirect(301, `https://api-spec.pages.dev/rapidoc?url=${doc.toString()}`);
}) satisfies RequestHandler;