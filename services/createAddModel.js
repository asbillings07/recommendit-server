const createAddModel = async (topModel, topModelId, insertModel, data, prop) => {
    try {
        const createdDoc = await new insertModel(data)
        const savedDoc = await createdDoc.save()
        console.log('created:', savedDoc)
        await topModel.findByIdAndUpdate(
            topModelId,
            { $push: { [prop]: savedDoc._id } },
            { new: true, useFindAndModify: false }
        )
        return savedDoc
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