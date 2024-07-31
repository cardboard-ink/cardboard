import { db } from '$lib/server/database';
import { error, redirect } from '@sveltejs/kit';
import { z, type RouteModifier } from 'sveltekit-api';

export const Modifier: RouteModifier = (r) => {
  r.tags = ["Auth"];
	r.operationId = "auth";
	return r;
};

export const Query = z.object({
  client_id: z.string().describe('client id'),
  redirect_uri: z.string().describe('redirect uri'),
  response_type: z.string().describe('response type'),
  scope: z.string().describe('scope').nullable().default(null).describe('scope'),
  state: z.string().describe('state').nullable().default(null).describe('state'),
})

export const Error = {
  400: error(400, 'invalid request'),
  404: error(404, 'app not found')
}

export const Output = z.object({})

export default async function (
  query: z.infer<typeof Query>,
): Promise<z.infer<typeof Output>> {
  const parsed = Query.safeParse(query)
  if (!parsed.success) {
    throw Error[400]
  }

  const { client_id, redirect_uri, response_type, scope, state } = parsed.data

  const app = await db.app.findUnique({
    where: {
      id: client_id
    }
  });

  if (!app) {
    throw Error[404]
  }

	redirect(
    		302,
    		`/a/${app.vanityCode}?redirect_uri=${redirect_uri}&scope=${scope}&state=${state}&response_type=${response_type}`
    	);
}
