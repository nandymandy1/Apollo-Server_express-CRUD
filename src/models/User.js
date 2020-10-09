import {
    model,
    Schema
} from 'mongoose';

const UserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatarImage: {
        type: String,
        default: 'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png'
    }
}, {
    timestamps: true
});

const User = model('users', UserSchema);

export default User;