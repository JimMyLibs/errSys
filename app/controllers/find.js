import mongoose from 'mongoose'
import ErrInfoSchema from '../models/errInfo'
import ErrInfoDB from '../../db/errInfo'
import { today, rangeDate } from '../utils/date'

export default async (req, res, next) => {
    const { headers, method, path, query, body, body: {
        data, data: {
            phone, userId, date, errMsg
        }
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
    let args = {};
    Object.keys(data).map(item=>{
        if(data[item] && item != 'date'){
            args[item] = data[item];
        }
        if(item == 'errMsg'){
            args[item] = {'$regex':new RegExp(errMsg, 'i')}
        }
    })
    const findDay = date || today;
    console.log('查询条件',args, findDay)
    if(findDay.constructor == Array){// 时间数组：时间范围
        let allLogs = [];
        console.log('date[0],date[1]',rangeDate(date[0],date[1]))
        await Promise.all(rangeDate(date[0],date[1]).map(async item=>{
            const todayModel = mongoose.model('info_' + item, ErrInfoSchema);// 创建当日模型
            try {
                await todayModel.find(args, { _id: 0, __v: 0 }, (err, docs) => {
                    if (err) throw err;
                    allLogs = allLogs.concat(docs);// 汇总数据
                    console.log('查询成功', item);
                })
            } catch (err) {
                return res.send({
                    respCode: '10002',
                    message: err.message,
                    data: {},
                })
            }
        }))
        return res.send({
            respCode: '10000',
            message: 'success',
            data: {
                logs:allLogs
            },
        })
    }else{// 时间点
        const todayModel = mongoose.model('info_' + findDay, ErrInfoSchema);// 创建当日模型
        try {
            await todayModel.find(args, { _id: 0, __v: 0 }, (err, docs) => {
                if (err) throw err;
                console.log('查询成功', phone);
                return res.send({
                    respCode: '10000',
                    message: 'success',
                    data: {
                        logs:docs
                    },
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
}