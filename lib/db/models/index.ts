import mongoose from 'mongoose';
import BaxUserSchema from '@/lib/db/schema/user';

export const UserModel = mongoose.model('BaxUserModel', BaxUserSchema);
