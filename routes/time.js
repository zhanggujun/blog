var getTime = function(date,type){
    var year = date.getFullYear();
    var month = addZero((date.getMonth()+1));
    var day = addZero(date.getDate());
    var hh = addZero(date.getHours());
    var mm = addZero(date.getMinutes());
    var ss = addZero(date.getSeconds());
    switch (type){
        case 'year':
                return year;
            break;
        case 'month':
                return year+'-'+month;
            break;
        case 'day':
                return year+'-'+month+'-'+day;
            break;
        case 'hh':
                return year+'-'+month+'-'+day+' '+hh;
            break;
        case 'mm':
                return year+'-'+month+'-'+day+' '+hh+':'+mm;
            break;
        default:
                return year+'-'+month+'-'+day+' '+hh+':'+mm+':'+ss;
            break;
    }
};
var addZero = function(str){
    return str<10?'0'+str:str;
};
module.exports = getTime;