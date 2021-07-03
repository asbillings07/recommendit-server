const createAddModel = async (topModel, topModelId, insertModel, data, prop) => {
    try {
        const doc = await insertModel.create(data)
        console.log('created:', doc)
        await topModel.findByIdAndUpdate(
            topModelId,
            { $push: { [prop]: doc._id } },
            { new: true, useFindAndModify: false }
        )
        return doc
        // res.status(201).json({
        //     success: true,
        //     error: false,
        //     message: `${prop} created successfully`,
        //     [prop]: doc
        // })
    } catch (err) {
        console.log(err)
        throw new error(err.message)
        // res.status(400).json({ success: false, error: true, errorMessage: err })
    }
}

module.exports = {
    createAddModel
}