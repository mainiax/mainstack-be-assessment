import { FilterQuery, Schema, model } from 'mongoose';
import {
	PaginationParams,
	PaginationResult,
} from '../product-api/shared/types';
import { IProduct } from '../product-api/products/product.types';
import { paginationPlugin } from '../product-api/shared/utils/mongoose-plugins/pagination.plugin';
import MongooseDelete, { SoftDeleteModel } from 'mongoose-delete';

const productSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		category: {
			type: String,
			required: true,
			trim: true,
		},
		description: {
			type: String,
			trim: true,
		},
		stock: {
			type: Number,
			required: true,
			min: 0,
			default: 0,
		},
		imageUrl: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{
		toJSON: {
			transform(_, ret) {
				delete ret.deleted;
				delete ret.deletedAt;
				delete ret.__v;
			},
		},
		timestamps: true,
	}
);

productSchema.index({ name: 'text' });
productSchema.plugin(paginationPlugin);
productSchema.plugin(MongooseDelete, {
	overrideMethods: 'all',
	deletedAt: true,
});

export default model<IProduct, SoftDeleteModel<IProduct>>(
	'product',
	productSchema
) as SoftDeleteModel<IProduct> & {
	paginate: (
		filter: FilterQuery<IProduct>,
		paginationParams: PaginationParams
	) => Promise<PaginationResult<IProduct>>;
};
