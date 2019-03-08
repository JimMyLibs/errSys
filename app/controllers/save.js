import mongoose from 'mongoose'
import ErrInfoSchema from '../models/errInfo'
import { today } from '../utils/date'

export default async (req, res, next) => {
    const { headers, method, path, query, body, body:{
        data, data: {
            phone, userId, errMsg
        }
    }  } = req;
    console.log('data____',data)
    const todayModel = mongoose.model(today,ErrInfoSchema);// 创建当日模型
    try{
        await todayModel.create(data,err=>{
            throw Error(err);
        });
        res.send({
            respCode: '10000',
            message: 'success',
            data,
        })
    }catch(err){
        res.send({
            respCode: '10001',
            message: err.message,
            data:{},
        })
    }
}