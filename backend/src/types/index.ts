
import type {Request,Response} from 'express'
export interface Handler {
    req: Request,
    res: Response
}
