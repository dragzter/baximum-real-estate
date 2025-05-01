import mongoose, { Schema } from 'mongoose';

const BaxUserSchema: Schema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		nickname: {
			type: String,
			required: true,
		},
		id: {
			type: String,
			required: true,
		},
		sub: {
			type: String,
			required: true,
		},
		isAdmin: {
			type: Boolean,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		picture: {
			type: String,
			default: 'https://i.pravatar.cc/150?img=65',
		},
		createdAt: {
			type: Date,
			default: Date.now,
		},
		properties: {
			type: [String],
			default: [],
		},
	},
	{ collection: 'bax-users' }
);

export default BaxUserSchema;
