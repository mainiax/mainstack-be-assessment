import { Router } from 'express';

import productRoutes from './products/product.routes';

const appRoutesV1: Router = Router();

appRoutesV1.use('/products', productRoutes);

export { appRoutesV1 };
