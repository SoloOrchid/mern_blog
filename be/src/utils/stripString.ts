const stripString = (string: string) => {
    return string.toLowerCase().replace('<>?', '') //todo: lookup some good regex for this
}

export default stripString;