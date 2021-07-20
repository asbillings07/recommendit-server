
const isObjectEqual = (idOne, idTwo) => {
    if (typeof idOne === 'string' && typeof idTwo === 'string') {
        return idOne === idTwo
    } else if (typeof idOne === 'object' && typeof idTwo === 'object') {
        return idOne.toHexString() === idTwo.toHexString()
    }
    return idOne.toHexString() === idTwo
}

module.exports = { isObjectEqual }