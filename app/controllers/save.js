import mongoose from 'mongoose'
import ErrInfoSchema from '../models/errInfo'
import { today } from '../utils/date'

export default async (req, res, next) => {
    const { headers, method, path, query, body, body: {
        data, data: {
            phone, userId, errMsg
        }
    } } = req;
    const todayModel = mongoose.model('info_'+today, ErrInfoSchema);// 创建当日模型
    try {
        await todayModel.create(data, (err, docs) => {
            if(err) throw err;
            console.log('保存成功',phone);
        })
        return res.send({
            respCode: '10000',
            message: 'success',
            data,
        })
    } catch (err) {
        return res.send({
            respCode: '10001',
            message: err.message,
            data: {},
        })
    }
}