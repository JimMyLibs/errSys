import mongoose from 'mongoose'
import ErrInfoSchema from '../models/errInfo'
import { today } from '../utils/date'

export default async (req, res, next) => {
    const { headers, method, path, query, body, body: {
        data, data: {
            phone, userId, date
        }
    } } = req;
    const findDay = date || today
    const todayModel = mongoose.model('info_' + findDay, ErrInfoSchema);// 创建当日模型
    try {
        await todayModel.find(data, { _id: 0, __v: 0 }, (err, docs) => {
            if (err) throw err;
            console.log('查询成功', phone);
            return res.send({
                respCode: '10000',
                message: 'success',
                data: docs,
            })
        })
    } catch (err) {
        return res.send({
            respCode: '10001',
            message: err.message,
            data: {},
        })
    }
}