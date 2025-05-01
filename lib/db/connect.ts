import mongoose from 'mongoose';

const connection: { isConnected?: number } = {};

async function connect() {
	if (connection.isConnected) {
		console.log('We are connected already, returning.');
		return;
	}

	const db = await mongoose.connect(process.env.MONGODB_URI!, {
		dbName: 'rpgavatarDB',
	});
	connection.isConnected = db.connections[0].readyState;
}

export default connect;
