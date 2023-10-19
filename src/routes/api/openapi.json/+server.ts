import api from "$api";
import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

export const prerender = true;

export const GET = (async (evt) => json(await api.openapi(evt))) satisfies RequestHandler;