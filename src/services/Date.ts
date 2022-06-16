export default class DateUtil {

    static time = () => {
        return Math.floor(new Date().getTime() / 1000);
    }

    static getMondaysWithDateRange = (start: number, end: number) => {
        var current  = end
        var results = [];
        while (current >= start) {
            current = DateUtil.getMonday(current);
            results.push(current)
            current = current - 7 * 3600 * 24;
        }

        return results.sort((b, a) => b - a);
    }

    static getDayonWeek = ()=>{
        const today = DateUtil.time();
        let monday = DateUtil.getMonday(today);
        let results = [];
        while(monday <= today){
            results.push(monday);
            monday += 3600 *24;
        }
        return results;
    }

    static getExactDay(t: number){
        const day = new Date(t * 1000);
        const time  = Math.floor(day.getTime()/1000);
        return time - day.getHours()*3600 - day.getMinutes()*60 - day.getSeconds();
    }

    static getMondayInMonth = (ts: number) => {
        var start_month = DateUtil.beginMonth(ts);

        var current  = DateUtil.endMonth(ts);
        var results = [];
        while (current >= start_month) {
            current = DateUtil.getMonday(current);
            results.push(current)
            current = current - 7 * 3600 * 24;
        }

        return results;
    }


    static getMonday(d?: number) {
        if (!d) {
            d = DateUtil.time()
        }
        var date = new Date(d * 1000);
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        var day = date.getDay();
        
    
    
        var diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    
        date.setDate(diff);
        date.setMilliseconds(0);
        date.setMinutes(0);
        date.setHours(0);
        date.setSeconds(0);
        var time = Math.round(new Date(date).getTime() / 1000);
        return time;
    }

    static beginMonth(d: number) {
        var date = new Date(d * 1000);
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      
        date.setDate(0);
        date.setMilliseconds(0);
        date.setMinutes(0);
        date.setHours(0);
        date.setSeconds(0);
        var time = Math.round(new Date(date).getTime() / 1000);
        return time;
    }
    

    static endMonth(d: number) {
        var date = new Date(d * 1000);
        date = new Date(date.getFullYear(), date.getMonth() + 1, date.getDate())
      
        date.setDate(0);
        date.setMilliseconds(0);
        date.setMinutes(0);
        date.setHours(0);
        date.setSeconds(0);
        var time = Math.round(new Date(date).getTime() / 1000);
        return time;
    }

}