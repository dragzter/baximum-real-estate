import connect from '@/lib/db/connect';
import { UserModel } from '@/lib/db/models';
import { ApiResponse, BaxUser } from '@/lib/types';

export function userController() {
	async function _c() {
		try {
			await connect();
		} catch (err) {
			throw err;
		}
	}

	async function isAdmin(id: string): Promise<ApiResponse<{ isAdmin: boolean }>> {
		try {
			const user = await g(id);

			if (user) {
				return {
					success: true,
					data: { isAdmin: user.isAdmin as boolean },
				};
			} else {
				return {
					success: true,
					data: { isAdmin: false },
					message: 'User not found',
				};
			}
		} catch (err) {
			return {
				success: false,
				error: err as Error,
			};
		}
	}

	function isNewAdmin(userEmail: string) {
		return process.env.NEXT_PUBLIC_ADMIN_LIST?.split(',').includes(userEmail) || false;
	}

	async function su(user: BaxUser): Promise<ApiResponse<{ user: BaxUser }>> {
		await _c();

		try {
			const existingUser = await g(user.sub);

			if (existingUser) {
				console.log('existing user: ', existingUser);
				return {
					success: true,
					data: { user: existingUser },
				};
			}

			const newUser: BaxUser = {
				sub: user.sub,
				name: user.name,
				picture: user.picture,
				nickname: user.nickname,
				id: user.sub as string,
				isAdmin: isNewAdmin(user.email) as boolean,
				email: user.email,
				properties: [],
			};

			const _user = new UserModel(newUser);
			await _user.save();

			return {
				success: true,
				data: { user: newUser },
			};
		} catch (err) {
			return {
				success: false,
				error: err as Error,
			};
		}
	}

	async function g(id: string): Promise<BaxUser | null> {
		await _c();

		return (await UserModel.findOne({ id }).lean().exec()) as BaxUser | null;
	}

	return {
		save: (user: BaxUser) => su(user),
		get: (id: string) => g(id),
		isAdmin: (id: string) => isAdmin(id),
	};
}
