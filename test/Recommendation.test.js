const mockingoose = require('mockingoose')
const recommendation = require('../models/recommendation')
const user = require('../models/user')
const { recommendations } = require('./mockData');

describe('recommendation model functions', () => {
    test('Should create new user in DB', async () => {
        const _doc = {
            userid: '123ddk93hd93',
            title: 'Hardees',
            description: 'it is a great place',
            location: '123 main street'
        }

        mockingoose(recommendation).toReturn(_doc, 'create')

        const rec = await recommendation.create(_doc);
        expect(rec.title).not.toBeUndefined();
        expect(rec.description).not.toBeUndefined();
        expect(rec.location).not.toBeUndefined();
    });

    test('should get all the recommendations in empty DB', async () => {
        const recs = await recommendation.find({});
        expect(recs).toBeUndefined();
    });

    test('should get a recommendation with a user', async () => {
        const recUser = {
            firstName: 'test',
            lastName: 'user',
            password: 'test1234',
            email: 'name@email.com',
        }

        const _docRec = {
            userid: 'kasdlj2k2k4',
            title: 'Hardees',
            description: 'it is a great place',
            location: '123 main street'
        }

        mockingoose(user).toReturn(recUser, 'create')
        mockingoose(recommendation).toReturn(_docRec, 'create')

        const newRecUser = await user.create(recUser)

        const rec = await recommendation.create({
            userid: newRecUser._id,
            title: 'Hardees',
            description: 'it is a great place',
            location: '123 main street'
        })

        expect(rec.userid).toBe(newRecUser._id);
        expect(rec.title).toBe(_docRec.title);
        expect(rec.description).toBe(_docRec.description);
        expect(rec.location).toBe(_docRec.location);
    });
})