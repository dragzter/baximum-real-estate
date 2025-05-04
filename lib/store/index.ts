import { create } from 'zustand';
import { BaxUser } from '@/lib/types';
import axios from 'axios';
import { VIEWS } from '@/lib/utils';

interface UserState {
	user: BaxUser;
	setUser: (u: BaxUser) => void;
	getUser: (id: string) => Promise<void>;
	loading: boolean;
}

interface GeneralState {
	isDashboard: boolean;
	setIsDashboard: (b: boolean) => void;
	view: (typeof VIEWS)[keyof typeof VIEWS];
	setView: (s: (typeof VIEWS)[keyof typeof VIEWS]) => void;
}

export const useUserStore = create<UserState>((set) => ({
	user: {} as BaxUser,
	loading: false,
	setUser: (user: BaxUser) => set({ user }),
	getUser: async (id: string) => {
		try {
			set({ loading: true });
			const resp = await axios.get(`/api/login/${id}`);

			set({ user: resp?.data, loading: false });
		} catch (err) {
			console.log(err);
		}
	},
}));

export const useGeneralAppStateStore = create<GeneralState>((set) => ({
	isDashboard: false,
	view: VIEWS.property_list,
	setIsDashboard: (s: boolean) => set({ isDashboard: s }),
	setView: (s: (typeof VIEWS)[keyof typeof VIEWS]) => set({ view: s }),
}));
