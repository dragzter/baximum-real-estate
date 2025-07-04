import { create } from "zustand";
import { BaxUser, Deal, DealPatch } from "@/lib/types";
import axios from "axios";
import { VIEWS } from "@/lib/utils";

interface UserState {
	user: BaxUser;
	setUser: (u: BaxUser) => void;
	getUser: (u: BaxUser) => Promise<void>;
	loading: boolean;
	isAdmin: boolean;
	getIsAdmin: (id: string) => Promise<void>;
}

interface GeneralState {
	isDashboard: boolean;
	setIsDashboard: (b: boolean) => void;
	investor: boolean;
	setIsInvestor: (s: boolean) => void;
	view: (typeof VIEWS)[keyof typeof VIEWS];
	setView: (s: (typeof VIEWS)[keyof typeof VIEWS]) => void;
}

interface DealsState {
	properties: Deal[];
	loading: boolean;
	deleteLoading: boolean;
	getLoading: boolean;
	setProperties: (p: Deal[]) => void;
	getProperties: () => void;
	setLoading: (s: boolean) => void;
	deleteDeal: (id: string) => void;
	updateDeal: (id: string, data: DealPatch) => void;
	getProperty: (id: string) => Promise<Deal>;
}

export const useUserStore = create<UserState>((set) => ({
	user: {} as BaxUser,
	loading: false,
	isAdmin: false,
	getIsAdmin: async (id: string) => {
		try {
			const response = await axios.get(`/api/login/admin/${id}`);
			set({ isAdmin: response.data });
		} catch (error) {
			console.log(error);
		}
	},
	setUser: (user: BaxUser) => set({ user }),
	getUser: async (user: BaxUser) => {
		try {
			set({ loading: true });
			let _saveUser;

			const resp = await axios.get(`/api/login/${user.id}`);

			if (resp.data.id) {
				_saveUser = resp;
			}

			if (resp.data.status === 204) {
				// No user is saved, post the user
				const postResponse = await axios.post("/api/login/", { user });
				if (postResponse.data.response.success) {
					_saveUser = postResponse.data.response.data.user;
				}
			}

			if (_saveUser.id) {
				const adminResp = await axios.get("/api/login/admin/" + _saveUser.id);
				_saveUser.isAdmin = adminResp.data.data.isAdmin;
			}

			if (_saveUser) {
				set({ user: _saveUser, loading: false, isAdmin: _saveUser.isAdmin });
			}
		} catch (err) {
			console.log(err);
		} finally {
			set({ loading: false });
		}
	},
}));

export const useGeneralAppStateStore = create<GeneralState>((set) => ({
	isDashboard: false,
	view: VIEWS.dashboard,
	investor: false,
	setIsInvestor: (s: boolean) => set({ investor: s }),
	setIsDashboard: (s: boolean) => set({ isDashboard: s }),
	setView: (s: (typeof VIEWS)[keyof typeof VIEWS]) => set({ view: s }),
}));

export const useDealsStore = create<DealsState>((set, get) => ({
	properties: [],
	loading: false,
	deleteLoading: false,
	getLoading: false,
	updateDeal: async (id: string, updateData: DealPatch) => {
		try {
			const res = await axios.patch("/api/property/update/" + id, { updateData });

			if (res.data.success) {
				get().getProperties();
			}
		} catch (error) {
			console.log(error);
		}
	},
	deleteDeal: async (id: string) => {
		try {
			set({ deleteLoading: true });

			const res = await axios.delete("/api/property/" + id);

			if (res.data.success) {
				set((state) => ({
					properties: state.properties.filter((prop) => prop.id !== id),
				}));
			}
		} catch (error) {
			console.log(error);
		} finally {
			set({ deleteLoading: false });
		}
	},
	getProperty: async (id: string): Promise<Deal> => {
		try {
			set({ deleteLoading: true });

			const res = await axios.get("/api/property/" + id);

			if (res.data.success) {
				get().getProperties();
			}

			return res.data.data.property as Deal;
		} catch (error) {
			console.log(error);
		} finally {
			set({ deleteLoading: false });
		}
	},
	setLoading: (val: boolean) => set({ loading: val }),
	setProperties: (properties: Deal[]) => set({ properties }),
	getProperties: async () => {
		try {
			set({ loading: true });
			const res = await axios.get("/api/property");
			const { properties } = res.data.result.data;

			set({ properties });
		} catch (err) {
			console.log(err);
		} finally {
			set({ loading: false });
		}
	},
}));
