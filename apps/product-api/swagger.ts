import swaggerJSDoc, { Options, SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
	openapi: '3.0.0',
	info: {
		title: 'TodoList',
		version: '1.0.0',
		description: 'TodoList',
	},
	servers: [
		{
			url: '/api/v1',
			description: 'Base URL for API version 1',
		},
	],
	components: {
		schemas: {
			Product: {
				type: 'object',
				properties: {
					id: {
						type: 'string',
					},
					name: {
						type: 'string',
					},
					price: {
						type: 'number',
					},
					category: {
						type: 'string',
					},
					description: {
						type: 'string',
					},
					stock: {
						type: 'number',
					},
					image: {
						type: 'object',
						properties: {
							originalname: { type: 'string' },
							mimetype: { type: 'string' },
							size: { type: 'number' },
						},
					},
				},
				required: ['id', 'name', 'price', 'category', 'stock'],
			},
			ProductCreate: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
					},
					price: {
						type: 'number',
					},
					category: {
						type: 'string',
					},
					description: {
						type: 'string',
					},
					stock: {
						type: 'number',
					},
					image: {
						type: 'string',
						format: 'binary',
					},
				},
				required: ['name', 'price', 'category', 'stock', 'image'],
			},
			ProductUpdate: {
				type: 'object',
				properties: {
					name: {
						type: 'string',
					},
					price: {
						type: 'number',
					},
					category: {
						type: 'string',
					},
					description: {
						type: 'string',
					},
					stock: {
						type: 'number',
					},
					image: {
						type: 'string',
						format: 'binary',
					},
				},
			},

			PaginatedResponse: {
				type: 'object',
				properties: {
					status_code: { type: 'integer' },
					success: { type: 'boolean' },
					message: { type: 'string' },
					data: {
						type: 'object',
						properties: {
							data: {
								type: 'array',
								items: {},
							},
							count: { type: 'integer' },
							total: { type: 'integer' },
							totalPages: { type: 'integer' },
							currentPage: { type: 'integer' },
						},
					},
				},
			},

			SuccessResponse: {
				type: 'object',
				properties: {
					status_code: { type: 'integer' },
					success: { type: 'boolean' },
					message: { type: 'string' },
					data: { type: 'object' },
				},
			},
		},
	},
};

const options: Options = {
	swaggerDefinition,
	apis: [
		'./**/*.routes.ts', // Include all TypeScript route files within product-api
	],
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
