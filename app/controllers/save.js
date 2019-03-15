import mongoose from 'mongoose'
import ErrInfoSchema from '../models/errInfo'
import { today } from '../utils/date'

export default (req, res, next) => {
    console.log('请求参数',req.url,req.body)
    const { headers, method, path, query, body, body: { phone } } = req;
    const todayModel = mongoose.model('info_' + today, ErrInfoSchema);// 创建当日模型
    try {
        todayModel.create(body, (err, docs) => {
            if (err) throw err;
            console.log('保存成功', phone);
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