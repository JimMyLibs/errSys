import mongoose from 'mongoose'
import chalk from 'chalk';
import config from '../config'

// 数据库地址
let dbUrl = config.errInfo[config.env].path;
// 连接数据库
const errInfo = mongoose.createConnection(dbUrl, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

errInfo.once('open', async () => {
	console.log(
		chalk.green('【errInfo】连接成功')
	);
})

errInfo.on('error', function(error) {
	console.error(
		chalk.red('【errInfo】错误 ' + error)
	);
	mongoose.disconnect();
});

errInfo.on('close', function() {
	console.log(
		chalk.red('【errInfo】断开，重新连接errInfo')
	);
	mongoose.connect(dbUrl, { server: { auto_reconnect: true } });
});

export default errInfo