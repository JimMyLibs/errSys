import mongoose from 'mongoose'
import ErrInfoSchema from '../models/errInfo'
import { today } from '../utils/date'

export default (req, res, next) => {
    const { headers, method, path, query, body, body: {
        data, data: { phone }
    } } = req;
    try{
        if(!phone) throw '手机号不能为空'
    }catch(err){
        return res.send({
            respCode: '10001',
            message: err,
            data: {},
        })
    }
    const todayModel = mongoose.model('info_'+today, ErrInfoSchema);// 创建当日模型
    try {
        todayModel.create(data, (err, docs) => {
            if(err) throw err;
            console.log('保存成功',phone);
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