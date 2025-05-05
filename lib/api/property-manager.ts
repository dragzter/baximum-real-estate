import connect from '@/lib/db/connect';
import { ApiResponse, Deal, DealPatch } from '@/lib/types';
import PropertyModel from '@/lib/db/schema/property';
import { DeleteResult } from 'mongoose';

export function propertyManager(debug = false) {
	async function c() {
		await connect();
	}

	function _debug(err) {
		if (debug) {
			console.log(err);
		}
	}

	/**
	 * Save a provided property. The function will perform a fuzzy search using regex in an effort
	 * to eliminate some instances of duplication.
	 *
	 * This is only a rudimentary inoculation. A more sophisticated method would be to employ
	 * GeoLocation or standardizing addresses when inputting them on the client. These methods
	 * are out of scope for the time being.
	 * @param p
	 */
	async function s(
		p: Deal
	): Promise<ApiResponse<{ existingProperty: Deal } | { newProperty: Deal }>> {
		try {
			await c();

			const existing = await PropertyModel.findOne({
				address: { $regex: new RegExp(p.address, 'i') },
			});

			if (existing) {
				return {
					success: false,
					message:
						'Property with this address exists. The existing property was attached to this' +
						' response.',
					data: {
						existingProperty: existing as Deal,
					},
				};
			}

			const _property = new PropertyModel(p);
			await _property.save();

			return {
				success: true,
				message: 'Property saved successfully.',
				data: {
					newProperty: _property as Deal,
				},
			};
		} catch (err) {
			_debug(err);
			return {
				success: false,
				error: err,
				message: 'Save failed.  Read the error or the server console for more information.',
			};
		}
	}

	/**
	 * This PATCHes an existing document in the DB.
	 * @param id
	 * @param updateData
	 */
	async function u(
		id: string,
		updateData: DealPatch
	): Promise<ApiResponse<{ updatedRecord: Deal }>> {
		try {
			await c(); // Connect if necessary

			console.log('handler update', updateData);

			const single = await PropertyModel.findOne({ id });

			console.log('single', single);

			const property = await PropertyModel.findOneAndUpdate(
				{ id }, // We search on the user defined ID - defined at create time (in the form).
				{ $set: updateData },
				{ new: true }
			);

			if (property) {
				return {
					message: 'Update successful.',
					success: true,
					data: {
						updatedRecord: property as Deal,
					},
				};
			} else {
				return {
					success: false,
					message: 'Update failed.',
				};
			}
		} catch (err) {
			_debug(err);
			return {
				success: false,
				message:
					'Update failed.  Read the error or read the server console for more information.',
				error: err,
			};
		}
	}

	/**
	 * Delete 1 record based on id.
	 * https://mongoosejs.com/docs/5.x/docs/api/model.html#model_Model.deleteOne
	 * @param id
	 */
	async function d(id: string): Promise<ApiResponse<{ query: DeleteResult }>> {
		try {
			await c();

			const resp = await PropertyModel.deleteOne({ id });

			return {
				success: true,
				message: 'Property deleted successfully.',
				data: {
					query: resp as DeleteResult,
				},
			};
		} catch (err) {
			_debug(err);

			return {
				success: false,
				error: err,
				message: 'Delete unsuccessful',
			};
		}
	}

	/**
	 * Find all properties and return them.
	 */
	async function ga(): Promise<ApiResponse<{ properties: Deal[] }>> {
		try {
			await c();

			const properties = await PropertyModel.find();

			return {
				success: true,
				data: {
					properties: properties as Deal[],
				},
			};
		} catch (err) {
			_debug(err);

			return {
				success: false,
				error: err,
			};
		}
	}

	async function g(id: string): Promise<ApiResponse<{ property: Deal | null }>> {
		try {
			await c();

			const property = (await PropertyModel.findOne({ id })
				.lean()
				.exec()) as unknown as Deal | null;

			if (!property) {
				return {
					success: false,
					message: 'Property not found.',
				};
			}

			console.log(property.purchase_date);

			return {
				success: true,
				data: {
					property: property as Deal,
				},
			};
		} catch (err) {
			_debug(err);

			return {
				success: false,
				message: 'There was a problem with the GET request.',
				error: err,
			};
		}
	}

	return {
		save: (p: Deal) => s(p),
		get: (id: string) => g(id),
		getAll: () => ga(),
		delete: (id: string) => d(id),
		update: (id: string, propertyData: DealPatch) => u(id, propertyData),
	};
}
