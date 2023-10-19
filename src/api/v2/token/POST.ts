import { db } from "$lib/server/database"
import { error } from "@sveltejs/kit"
import { randomUUID } from "crypto"
import {z} from "sveltekit-api"
import type { RouteModifier } from "sveltekit-api";

export const Input = z.object({
  grant_type: z.union([z.literal('authorization_code'), z.literal('refresh_token')]).describe('authorization_code or refresh_token'),
  code: z.string().optional().describe('authorization_code'),
  refreshToken: z.string().optional().describe('refresh_token')
})

export const Output = z.object({
  access_token: z.string().describe('Bearer token'),
  expires_in: z.number().describe('seconds until token expires'),
  refresh_token: z.string().describe('refresh token'),
  token_type: z.literal('Bearer').describe('Bearer')
})

export const Error = {
  400: error(400, 'invalid request'),
}

export const Modifier: RouteModifier = (r) => {
	r.tags = ["Auth"];
	r.operationId = "login";
	return r;
};

export default async function (
  input: z.infer<typeof Input>,
): Promise<z.infer<typeof Output>> {
    const parsed = Input.safeParse(input)
    if (!parsed.success) {
        throw Error[400]
    }

    const { grant_type, code, refreshToken } = parsed.data

    if (grant_type === 'authorization_code') {
      if (!code || typeof code !== 'string') {
        throw Error[400]
      }
      const pre = await db.authorizedAppSession.findUnique({
          where: {
              authToken: code,
          },
          select: {
              id: true,
              userAppManager: {
                  select: {
                      app: {
                          select: {
                              id: true,
                          }
                      }
                  }
              }
          }
      })
      if (!pre) {
        throw Error[400]
      }
      const auth = await db.authorizedAppSession.update({
          where: {
              id: pre.id,
          },
          data: {
              authToken: randomUUID(),
              refreshToken: randomUUID(),
              expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          },
          select: {
              authToken: true,
              refreshToken: true,
              expiresAt: true,
          }
      })
      const data = {
          access_token: auth.authToken,
          expires_in: Math.floor((auth.expiresAt.getTime() - Date.now()) / 1000),
          refresh_token: auth.refreshToken,
          token_type: 'Bearer' as const,
      }
      // return new Response(JSON.stringify(data), {headers: {'Content-Type': 'application/json'}})
      return data
    } 
    else if (grant_type === 'refresh_token') {
      if (!refreshToken || typeof refreshToken !== 'string') {
        throw Error[400]
      }
      const pre = await db.authorizedAppSession.findUnique({
          where: {
              refreshToken,
          },
          select: {
              id: true,
              userAppManager: {
                  select: {
                      app: {
                          select: {
                              id: true,
                          }
                      }
                  }
              }
          }
      })
      if (!pre) {
        throw Error[400]
      }
      const auth = await db.authorizedAppSession.update({
          where: {
              id: pre.id,
          },
          data: {
              refreshToken: randomUUID(),
              authToken: randomUUID(),
              expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          },
          select: {
              authToken: true,
              refreshToken: true,
              expiresAt: true,
          }
      })
      const data = {
          access_token: auth.authToken,
          expires_in: Math.floor((auth.expiresAt.getTime() - Date.now()) / 1000),
          refresh_token: auth.refreshToken,
          token_type: 'Bearer' as const,
      }
      return data
  }
  throw Error[400]
}