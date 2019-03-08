import mongoose from 'mongoose'
import chalk from 'chalk';
import config from '../config'

// 数据库地址
let dbUrl = config.errInfo[config.env].path;
// 连接数据库
mongoose.connect(dbUrl, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;

db.once('open', () => {
	console.log(
		chalk.green('【mongodb】连接成功')
	);
})

db.on('error', function(error) {
	console.error(
		chalk.red('【mongodb】错误 ' + error)
	);
	mongoose.disconnect();
});

db.on('close', function() {
	console.log(
		chalk.red('【mongodb】断开，重新连接mongodb')
	);
	mongoose.connect(dbUrl, { server: { auto_reconnect: true } });
});

export default db;