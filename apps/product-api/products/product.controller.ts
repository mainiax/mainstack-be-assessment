import { Response, Request, NextFunction } from 'express';
import Product from '../../models/product.model';
import { IProduct, IProductPayload } from './product.types';
import { PaginationResult } from '../shared/types';
import { NotFoundException } from '../shared/utils/exceptions';
import { cloudinaryFileUploader } from '../shared/utils/cloudinary-uploader';
import { FilterQuery } from 'mongoose';

export const getProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const page = parseInt(req.query.page as string) || 1;
	const limit = parseInt(req.query.limit as string) || 10;
	const searchString = (req.query.q as string) || '';

	const filters: FilterQuery<IProduct> = {};

	if (searchString) filters.$text = { $search: searchString };

	try {
		const products: PaginationResult<IProduct> = await Product.paginate(
			filters,
			{ page, limit }
		);

		res.message = 'products retrieved successfully';
		res.status(200).json(products);
	} catch (error) {
		return next(error);
	}
};

export const getProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const id = req.params.id;

	try {
		const product: IProduct | null = await Product.findOne({
			_id: id,
		});

		if (!product) {
			throw new NotFoundException('NotFoundException', () => ({
				message: 'product does not exist',
			}));
		}

		res.message = 'products retrieved successfully';
		res.status(200).json(product);
	} catch (error) {
		return next(error);
	}
};

export const updateProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const id = req.params.id;
		const body: IProductPayload = req.body;
		const imagePath = req.file?.path;
		let url: string | null = null;

		if (imagePath) {
			const result = await cloudinaryFileUploader(imagePath, {
				folder: 'product_images',
			});

			result && (url = result.url);
		}

		const product: IProduct | null = await Product.findOneAndUpdate(
			{ _id: id },
			{ ...body, ...(url && { imageUrl: url }) },
			{ new: true }
		);

		if (!product) {
			throw new NotFoundException('NotFoundException', () => ({
				message: 'product does not exist',
			}));
		}

		res.message = 'products updated successfully';
		res.status(200).json(product);
	} catch (error) {
		return next(error);
	}
};

export const createProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const body: IProductPayload = req.body;
		const imagePath = req.file!.path;

		const { url } = await cloudinaryFileUploader(imagePath, {
			folder: 'product_images',
		});

		const product: IProduct = await Product.create({
			...body,
			imageUrl: url,
		});

		res.message = 'product created successfully';
		res.status(201).json(product);
	} catch (error) {
		return next(error);
	}
};

export const deleteProduct = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const {
			params: { id },
		} = req;

		const product: typeof Product | null = await Product.findOne({
			_id: id,
		});

		if (!product) {
			throw new NotFoundException('NotFoundException', () => ({
				message: 'product does not exist',
			}));
		}

		await product.delete();

		res.message = 'products deleted successfully';
		res.status(200).json(product);
	} catch (error) {
		return next(error);
	}
};
