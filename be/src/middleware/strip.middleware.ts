import { strip } from '../config/app'
import stripString from '../utils/stripString'



//todo: find a better way of using the config file
export default async function stripMiddleware(req: any, res: any, next: any) {
    const {password} = req.body
    if(password !== null) {
        req.body.password = stripString(password)
        next();
    }

    next();
}