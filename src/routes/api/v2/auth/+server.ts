import api from "$api";
import type { RequestHandler } from "./$types";

export const GET = async (evt) => api.handle(evt) satisfies RequestHandler;