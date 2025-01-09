import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
            description: 'API for managing users, posts, and comments',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Post: {
                    type: 'object',
                    properties: {
                        content: {
                            type: 'string',
                            required: true
                        },
                        title: {
                            type: 'string',
                            required: true
                        },
                        likes: {
                            type: 'array',
                            items: {
                                type: 'string'
                            }
                        },
                        numLikes: {
                            type: 'number',
                            default: 0
                        },
                        comments: {
                            type: 'number',
                            default: 0
                        },
                        ownerId: {
                            type: 'string',
                            required: true
                        },
                        userName: {
                            type: 'string',
                            required: true
                        },
                        userImg: {
                            type: 'string',
                            required: true
                        },
                        postImg: {
                            type: 'string',
                            required: true
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            default: new Date().toISOString()
                        }
                    }
                },
                Comment: {
                    type: 'object',
                    properties: {
                        content: {
                            type: 'string',
                            required: true
                        },
                        postId: {
                            type: 'string',
                            required: true
                        },
                        ownerId: {
                            type: 'string',
                            required: true
                        },
                        userName: {
                            type: 'string',
                            required: true
                        },
                        img: {
                            type: 'string',
                            required: true
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            default: new Date().toISOString()
                        }
                    }
                },
                Auth: {
                    type: 'object',
                    properties: {
                        email: {
                            type: 'string',
                            required: true
                        },
                        password: {
                            type: 'string',
                            required: true
                        },
                        userName: {
                            type: 'string',
                            required: true
                        }
                    }
                }
            }
        },
        servers: [
            {
                url: 'http://localhost:4000/api',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;