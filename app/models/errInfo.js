// 引入建模的工具模块
import mongoose from 'mongoose'
// 创建模式对象
const errInfoSchema = new mongoose.Schema({
	phone: {type: String,default:''},// 手机
	userId: {type: String,default:''},// userId
	projectName: {type: String,default:''},// 项目名称
	errMsg: {type: String,default:''},// 错误信息
	dateTime: {type: Date,default: Date.now()},
	os: {type: String,default:''},// 系统
	os_version: {type: String,default:''},// 系统版本
	browser: {type: String,default:''},// 浏览器
	browser_version: {type: String,default:''},// 浏览器版本
	meta: {
		createAt: {type: Date,default: Date.now()},
		updateAt: {type: Date,default: Date.now()}
	}
})
// 每次保存数据之前都会调用这个方法
errInfoSchema.pre('save',function (next) {
	// 判断数据是否是新添加的
	if (this.isNew) {
		this.dateTime = this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.dateTime = this.meta.updateAt = Date.now();
	}
	next();
})
// 每次查询数据之前都会调用这个方法
errInfoSchema.pre('find',function (next) {	
	next();
})
// 这都是实例方法
errInfoSchema.methods = {
	fn1: (_password,fn)=> {

	}
}

// 这都是静态方法
errInfoSchema.statics = {
	// 返回数据库中所有的数据
	findAll: function (fn) {
		return this
			.find({})
			// 按照更新时间排序
			.sort("meta.updateAt")
			.exec(fn);
	},
	// 单条数据的查询
	findById: function (id,fn) {
		return this.findOne({errInfo_id:id});
	},
}

errInfoSchema.indexes([{phone: 1}]);// 创建索引

// 将模式输出
export default errInfoSchema;