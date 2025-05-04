import { create } from 'zustand';
import { BaxUser, Deal } from '@/lib/types';
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

interface DealsState {
	properties: Deal[];
	loading: boolean;
	setProperties: (p: Deal[]) => void;
	getProperties: () => void;
	setLoading: (s: boolean) => void;
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
		} finally {
			set({ loading: false });
		}
	},
}));

export const useGeneralAppStateStore = create<GeneralState>((set) => ({
	isDashboard: false,
	view: VIEWS.property_list,
	setIsDashboard: (s: boolean) => set({ isDashboard: s }),
	setView: (s: (typeof VIEWS)[keyof typeof VIEWS]) => set({ view: s }),
}));

export const useDealsStore = create<DealsState>((set) => ({
	properties: [],
	loading: false,
	setLoading: (val: boolean) => set({ loading: val }),
	setProperties: (properties: Deal[]) => set({ properties }),
	getProperties: async () => {
		try {
			set({ loading: true });
			console.log('calling properties');
			const res = await axios.get('/api/property');
			const { properties } = res.data.result.data;

			set({ properties });
		} catch (err) {
			console.log(err);
		} finally {
			set({ loading: false });
		}
	},
}));
