import { create } from 'zustand';
import { BaxUser } from '@/lib/types';
import axios from 'axios';

interface UserState {
	user: BaxUser;
	setUser: (u: BaxUser) => void;
	getUser: (id: string) => Promise<void>;
	loading: boolean;
}

interface GeneralState {
	isDashboard: boolean;
	setIsDashboard: (b: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
	user: {} as BaxUser,
	loading: false,
	setUser: (user: BaxUser) => set({ user }),
	getUser: async (id: string) => {
		try {
			set({ loading: true });
			const resp = await axios.get(`/api/login/${id}`);

			set({ user: resp?.data.response, loading: false });
		} catch (err) {
			console.log(err);
		}
	},
}));

export const useGeneralAppStateStore = create<GeneralState>((set) => ({
	isDashboard: false,
	setIsDashboard: (s: boolean) => set({ isDashboard: s }),
}));
