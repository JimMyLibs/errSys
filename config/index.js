var path = require('path');
const env = process.env.NODE_ENV || 'development';
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

module.exports = {
	env,
	errInfo: {
		development: {
			path: 'mongodb://127.0.0.1:27017/errInfo'
		},
		production: {
			path: 'mongodb://127.0.0.1:27017/errInfo'
		}
	},
	mysql: {
		development: {
			host: '127.0.0.1',
			port: 3306,
			database:'mysql',// 数据库名
			username:'root',
			password:'1234'
		},
		production: {
			host: '127.0.0.1',
			port: 3306,
			database:'node_mysql',// 数据库名
			username:'node_mysql',
			password:'node_mysql192389590'
		}
	},
	dir: {
		allCsv : resolve('../../../../backups/errInfo/'),
		csv : resolve('public/csv/'),
		json : resolve('public/json/'),
	},
	email: {
		development: {
			host: "smtp.exmail.qq.com",
			secureConnection: true, // use SSL
			port: 465, // SMTP 端口
			auth: {
				user: "",
				pass: ""
			}
		},
		production: {
			host: "smtp.exmail.qq.com",
			secureConnection: true, // use SSL
			port: 465, // SMTP 端口
			auth: {
				user: "",
				pass: ""
			}
		}
	},
	superAdmin: {
		username: '', 
		password: '', 
	},
	wechat: {
		appid: '', 
		secret: '', 
	},	
}