const createSlug = (title: String) => {
    return title.toLowerCase().replace(/\s+/g, '-');
}

export {
    createSlug
}