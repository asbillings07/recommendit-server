const mockingoose = require('mockingoose');

const user = require('../models/user');
const { createUser } = require('../services/userFunctions');
const { users } = require('./mockData')

describe('User Model Functions', () => {
    test('should return user from DB', async () => {
        const _doc = {
            // _id: '507f191e810c19729de860few8',
            firstName: 'Billy',
            lastName: 'Bob',
            password: 'test1234',
            email: 'test@email.com',
            roles: [],
            savedRecommendations: [],
            ratings: [],
            comments: []
        }

        mockingoose(user).toReturn(_doc, 'findOne')
        const foundUser = await user.findOne({ email: 'test@email.com' });
        expect(foundUser.firstName).toBe('Billy');
        expect(foundUser.lastName).toBe('Bob');
        expect(foundUser.email).toBe('test@email.com');
    });

    test('Should create new user in DB', async () => {
        const _doc = {
            firstName: 'test',
            lastName: 'user',
            password: 'test1234',
            email: 'name@email.com',
            roles: [],
            savedRecommendations: [],
            ratings: [],
            comments: []
        }

        mockingoose(user).toReturn(_doc, 'create')

        const createdUser = await user.create(_doc)
        expect(createdUser.firstName).toBe('test');
        expect(createdUser.lastName).toBe('user');
        expect(createdUser.email).toBe('name@email.com');
    });

    test('should update existing user in DB', async () => {
        const body = {
            _id: '507f191e810c19729de860few8',
            firstName: 'Bill',
            lastName: 'Smith',
            email: 'test@bill.com',
        };
        mockingoose(user).toReturn(body, 'updateOne')

        const updatedUser = await user.updateOne({ _id: '507f191e810c19729de860few8' }, body)
        expect(updatedUser.firstName).toBe('Bill');
        expect(updatedUser.lastName).toBe('Smith');
        expect(updatedUser.email).toBe('test@bill.com');
    });

    test('should delete user from DB', async () => {
        const currentUser = {
            firstName: 'test',
            lastName: 'user',
            password: 'test1234',
            email: 'name@email.com',
            roles: [],
            savedRecommendations: [],
            ratings: [],
            comments: []
        };
        mockingoose(user).toReturn(currentUser, 'updateOne')
        const createdUser = await user.create(currentUser);
        const deletedUser = await user.deleteOne({ _id: createdUser._id })
        expect(deletedUser).toBeUndefined();
    });

    test('find user in DB by Obj', async () => {
        const newUser = {
            firstName: 'Bill',
            lastName: 'Bob',
            password: 'test1234',
            email: 'name@email.com'
        };
        mockingoose(user).toReturn(newUser, 'findOne')

        const createdUser = await user.create(newUser)
        const foundUser = await user.findOne({ email: createdUser.email });
        expect(foundUser.firstName).toBe('Bill');
        expect(foundUser.lastName).toBe('Bob');
    });

    test('should update user photo with new information provided by the user', async () => {
        const newUser = {
            firstName: 'Bill',
            lastName: 'Bob',
            password: 'test1234',
            email: 'name@email.com'
        };
        const body = {
            photoName: '',
            photoUrl: '',
        };
        mockingoose(user).toReturn(newUser, 'updateOne')

        const createdUser = await user.create(newUser)
        const updatedUser = await user.updateOne({ _id: createdUser._id }, body);
        expect(updatedUser.photoName).toBeUndefined();
        expect(updatedUser.photoUrl).toBeUndefined();
    });
});