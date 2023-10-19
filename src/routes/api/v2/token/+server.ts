import api from "$api";
import type { RequestHandler } from "./$types";

export const POST = async (evt) => api.handle(evt) satisfies RequestHandler;