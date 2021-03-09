import {Request, Response, NextFunction, Router} from 'express';
import {crypto, _} from '../utility';
// import * as moment from 'moment';
import Base from './Base';

import ping from './ping';
import user from './user';
import tea from './tea';
import doc from './doc';
import admin from './admin';

import db from '../db';


/**
 * Every request intercepts the token and sets the session user from the userId again
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @param {e.NextFunction} next
 * @returns {boolean}
 */
export const middleware = async (req: Request, res: Response, next: NextFunction) => {
  // check token
  const token = req.cookies['token'] || req.headers['token'];
  // console.log(token);
  req['session'] = {} as any;
  if(token){

    const DB = await db.create();
    const _db = DB.getModel('AdminUser');
    const one = await _db.findOne({token: token});
    if(one){
      req['session'].user = {
        username: one.username,
        
      };
    }
 
  }
  next();
}

const router = Router();
router.use('/ping', Base.setRouter([{
  path : '/',
  method : 'get',
  router : ping
}]));
router.use('/user', user);
router.use('/tea', tea);
router.use('/doc', doc);
router.use('/admin', admin);


router.use((req, res) => {
  return res.sendStatus(403);
})

export default router