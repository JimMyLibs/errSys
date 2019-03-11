Date.prototype.Format = function (fmt = 'yyyy-MM-dd') {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "w+" : this.getDay(), //week
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
export const today = new Date().Format('yyyy-MM-dd');
export const dateFormat = (date=new Date(),fmt = 'yyyy-MM-dd')=>{
    const d = new Date(date);
    return d.Format(fmt);
} 
export const dateTimeFormat = (date=new Date(),fmt = 'yyyy-MM-dd hh:ss')=>{
    const d = new Date(date);
    return d.Format(fmt);
} 

// 时间格式化
export const dateValFormat = (date) => {
    const dateString = new Date(date),
        month = (dateString.getMonth() + 1) < 10 ? '0' + (dateString.getMonth() + 1) : (dateString.getMonth() + 1),
        day = dateString.getDate() < 10 ? '0' + dateString.getDate() : dateString.getDate();
    return dateString.getFullYear() + '-' + month + '-' + day
}
// 日期范围
export const rangeDate = (min, max) => {
    let days = (new Date(max) - new Date(min)) / 1000 / 60 / 60 / 24,
    len = Math.floor(days),
    dates = [];

    for (let i = 0; i <= len; i++) {
        dates.push(dateValFormat(new Date(min).getTime() + 1000 * 60 * 60 * 24 * i));
    }
    return dates;
}