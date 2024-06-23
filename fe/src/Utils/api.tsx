export default async function api(uri: string, config: object) {
    const res = await fetch(`http://localhost:3000/${uri}`, {
        ...config
    }).then(res => res)
        .catch(err => {
            throw new Error(`Error ${res.body}`)
        })

    if(res.status >= 400) {
        throw new Error(`Error ${res.body}`)
    }

    return res
}