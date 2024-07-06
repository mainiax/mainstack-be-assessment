import express from 'express';
import cors from 'cors';
import {
	exceptionHandler,
	httpExceptionHandler,
	notFoundExceptionHandler,
	badRequestExceptionHandler,
	forbiddenExceptionHandler,
} from './shared/utils/exception-handlers';
import { httpInterceptor } from './shared/utils/http-interceptor';
import { appRoutesV1 } from './app.routes';
import connectDB from './shared/config/db.config';

import swaggerUI from 'swagger-ui-express';
import swaggerSpec from './swagger';

require('dotenv').config();

const app = express();

const PORT: string | number = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
// Serve Swagger documentation
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));

app.use(httpInterceptor);
app.use('/api/v1', appRoutesV1);

app.use(badRequestExceptionHandler);
app.use(forbiddenExceptionHandler);
app.use(notFoundExceptionHandler);
app.use(httpExceptionHandler);
app.use(exceptionHandler);

connectDB().then(() =>
	app.listen(PORT, () =>
		console.log(`Server running on http://localhost:${PORT}`)
	)
);
