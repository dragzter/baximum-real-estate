import connect from '@/lib/db/connect';
import { ApiResponse, Deal, DealPatch } from '@/lib/types';
import PropertyModel from '@/lib/db/schema/property';

export function propertyManager() {
	async function c() {
		await connect();
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
			console.log(err);
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
			const property = await PropertyModel.findOneAndUpdate(
				{ id }, // We search on the user defined ID - defined at create time (in the form).
				{ $set: updateData },
				{ new: true }
			);

			return {
				message: 'Update successful.',
				success: true,
				data: {
					updatedRecord: property as Deal,
				},
			};
		} catch (err) {
			console.log(err);
			return {
				success: false,
				message:
					'Update failed.  Read the error or read the server console for more information.',
				error: err,
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
			console.log(err);
		}
	}

	async function g(id: string): Promise<Deal | null> {
		try {
			await c();

			return (await PropertyModel.findOne({ id }).lean().exec()) as unknown as Deal | null;
		} catch (err) {
			console.log(err);
		}
	}

	return {
		save: (p: Deal) => s(p),
		get: (id: string) => g(id),
		getAll: () => ga(),
		update: (id: string, propertyData: DealPatch) => u(id, propertyData),
	};
}
