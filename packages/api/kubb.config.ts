import { defineConfig } from '@kubb/core'
import { pluginClient } from '@kubb/plugin-client'
import { pluginFaker } from '@kubb/plugin-faker'
import { pluginOas, schemaKeywords } from '@kubb/plugin-oas'
import { pluginReactQuery } from '@kubb/plugin-react-query'
import { pluginTs } from '@kubb/plugin-ts'
import { pluginZod } from '@kubb/plugin-zod'

import { pluginMockClientRoutes } from './plugins/mock-client-routes'

const group = { type: 'tag' } as const
const unknownType = 'unknown'
const paramsType = 'object'
const pathParamsType = 'object'
const parser = 'zod'
const clientImportPath = '../../../client'

export default defineConfig([
	{
		name: 'base',
		plugins: [
			pluginOas({
				collisionDetection: true,
				group,
				output: { barrelType: 'propagate', path: 'schemas' },
			}),
			pluginClient({
				parser,
				group,
				importPath: clientImportPath,
				output: { barrelType: 'propagate', path: 'clients' },
				paramsType,
				pathParamsType,
			}),
			pluginTs({
				enumType: 'inlineLiteral',
				group,
				integerType: 'number',
				output: { barrelType: 'propagate', path: 'types' },
				syntaxType: 'interface',
				unknownType,
			}),
			pluginFaker({
				emptySchemaType: 'void',
				group,
				output: { barrelType: false, path: 'mocks' },
				transformers: {
					schema({ name }, defaultSchemas) {
						if (name === 'unsubscribeEmailQueryResponse') {
							return [{ keyword: schemaKeywords.void }]
						}

						return defaultSchemas
					},
				},
				unknownType,
			}),
			pluginMockClientRoutes(),
			pluginZod({
				group,
				mini: true,
				output: { barrelType: 'propagate', path: 'zod' },
				unknownType,
				version: '4',
			}),
			pluginReactQuery({
				parser,
				client: { importPath: clientImportPath },
				group,
				output: { barrelType: 'propagate', path: 'hooks' },
				paramsType,
				pathParamsType,
			}),
		],
		input: { path: '../../api/src/openapi.yaml' },
		output: {
			clean: true,
			extension: { '.ts': '' },
			format: 'oxfmt',
			path: './base/codegen',
		},
	},
	{
		name: 'database',
		plugins: [
			pluginOas({
				collisionDetection: true,
				group,
				output: { barrelType: 'propagate', path: 'schemas' },
			}),
			pluginClient({
				parser,
				group,
				importPath: clientImportPath,
				output: { barrelType: 'propagate', path: 'clients' },
				paramsType,
				pathParamsType,
			}),
			pluginTs({
				enumType: 'inlineLiteral',
				group,
				integerType: 'number',
				output: { barrelType: 'propagate', path: 'types' },
				syntaxType: 'interface',
				unknownType,
			}),
			pluginZod({
				group,
				mini: true,
				output: { barrelType: 'propagate', path: 'zod' },
				unknownType,
				version: '4',
			}),
		],
		input: { path: '../../api/src/database/openapi.yaml' },
		output: {
			clean: true,
			extension: { '.ts': '' },
			format: 'oxfmt',
			path: './database/codegen',
		},
	},
])
