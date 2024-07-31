import { API } from 'sveltekit-api';
import { version, author } from '../../package.json';

export default new API(
	import.meta.glob('./**/*.ts'),
	{
		openapi: '3.1.0',
		info: {
			title: 'Cardboard API',
			version: version,
			description:
				'Cardboard is a third party OpenID provider for multiple services. Currently supports Guilded.',
			contact: author,
			license: {
				name: 'MIT',
				url: 'https://github.com/cardboard-ink/cardboard/blob/main/LICENSE'
			}
		},
		externalDocs: {
			url: 'https://cardboard.gitbook.io'
		},
		servers: [
			{
				url: '{protocol}://{host}',
				variables: {
					protocol: {
						default: 'https',
						enum: ['http', 'https']
					},
					host: {
						default: 'cardboard.ink'
					}
				}
			}
		]
	},
	'/api',
	(r) => {
		r.registerComponent('securitySchemes', 'bearerAuth', {
			type: 'http',
			scheme: 'bearer',
			description: 'Cardboard currently supports Guilded to authenticate users.'
		});
	}
);
