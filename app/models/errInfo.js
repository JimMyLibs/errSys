// 引入建模的工具模块
import mongoose from 'mongoose'
// 创建模式对象
const errInfoSchema = new mongoose.Schema({
	phone: { type: String, default: '' },// 手机
	remark: { type: String, default: '' },// 自定义备注

	// baseData
	user_id: { type: String, default: '' },// 未登录区分用户
	device_id: { type: String, default: '' },// 已登录区分用户
	platform: { type: String, default: '' },// 平台: js
	time: { type: Date, default: '' },// 前端发送时间
	appkey: { type: String, default: '' },
	// info
	type: { type: String, default: '' },
	event_id: { type: String, default: '' },// event_id为事件id，为事件采集需求表中协定的名称
	event_entry: { type: String, default: '' },// event_entry （默认为2）触发时机，1.页面加载；2.按钮点击；10.按钮点击；13、H5渠道引流落地上传cookie_id,UA,UTM，
	session_id: { type: String, default: '' },// 会话id
	app_version: { type: String, default: '' },// 应用版本
	channel: { type: String, default: '' },// 渠道H5
	project_id: { type: String, default: '' },// 项目名称
	os: { type: String, default: '' },// 系统
	os_version: { type: String, default: '' },// 系统版本
	browser_brand: { type: String, default: '' },// 浏览器
	browser_version: { type: String, default: '' },// 浏览器版本
	referer_domain: { type: String, default: '' },
	url: { type: String, default: '' }, // url参数为当前页面url，通常不需要该参数，但是在单页应用中，页面跳转事件的处理时，建议带上该参数
	ref: { type: String, default: '' },
	attributes:  {// attributes为当前事件属性对象，{n: '产品名称', v: loanUsage},
		type: [{ n: String, v: String, _id: false }],
		default: [{ n: '', v: '' }]
	},
	meta: {
		createAt: { type: Date, default: Date.now() },
		updateAt: { type: Date, default: Date.now() }
	}
})
// 每次保存数据之前都会调用这个方法
errInfoSchema.pre('save', function (next) {
	// 判断数据是否是新添加的
	if (this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
})
// 每次查询数据之前都会调用这个方法
errInfoSchema.pre('find', function (next) {
	next();
})
// 这都是实例方法
errInfoSchema.methods = {
	fn1: (_password, fn) => {

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
	findById: function (id, fn) {
		return this.findOne({ errInfo_id: id });
	},
}

errInfoSchema.indexes([{ phone: 1 }]);// 创建索引

// 将模式输出
export default errInfoSchema;