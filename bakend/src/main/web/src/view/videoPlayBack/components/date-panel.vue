<template>
<div class="trackCalendar videoPlay">
    <div class="calendar" v-for="(item, index) in calendarList" :key="index">
        <div>
            <div class="calendar_title">
                <span class="fl ml12 cursor" type="text" @click="prevMonth">
                    <i class="ivu-icon ivu-icon-ios-arrow-back"></i>
                </span>
                {{item.curYear}}年<span>{{item.curMonth}}月</span>
                <span class="fr mr12 cursor" type="text" @click="nextMonth">
                    <i class="ivu-icon ivu-icon-ios-arrow-forward"></i>
                </span>
            </div>
            <div class="sign_cal">
                <div class="sign_row clearfix"><div class="th_1 fwb fl">日</div>
                    <div class="th_2 fwb fl">一</div>
                    <div class="th_3 fwb fl">二</div>
                    <div class="th_4 fwb fl">三</div>
                    <div class="th_5 fwb fl">四</div>
                    <div class="th_6 fwb fl">五</div>
                    <div class="th_7 fwb fl">六</div>
                </div>
                <div class="sign_row clearfix" v-for="(week, index) in item.dates" :key="index">
                    <template v-for="(day, index) in week">
                        <div :key="index" v-if="day.haveDate" @click="clickOneDay(day)" class="cursor" :class="{ 'calendar_record': true, 'otherMonth': (day.date.getMonth()+1)!=item.curMonth ,'haveDate':day.haveDate,'on':day.date==flagDate}">
                            <div class="dayBox"></div>
                            <label style="margin-right: 6px;cursor: pointer">{{day.date.getDate()}}</label>
                        </div>
                        <div :key="index" v-else :class="{ 'calendar_record': true, 'otherMonth': (day.date.getMonth()+1)!=item.curMonth}" style="cursor: not-allowed">
                            <label style="color; #888;cursor: not-allowed">{{day.date.getDate()}}</label>
                        </div>
                    </template>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    "name": "datePanel",
    "props": {
        "value": {
            "type": Date,
            "default": new Date(new Date().getTime() - 518400000)
        },
        "hasdata": {
            "type": Array,
            "default": []
        }
    },
    data () {
        return {
            "calendarList": [],
            "flagDate": ""
        };
    },
    "watch": {
        value (newval) {
            this.getCalendarList(this.value);
        },
        hasdata (newval) {
            this.getCalendarList(this.value);
        }
    },
    mounted () {
        this.getCalendarList(this.value);
    },
    "methods": {
        getCalendarList (date) {
            const self = this;
            self.value = date;
            let calendarList = [];
            let dateFormat = date.Format("yyyy-MM");
            let startDate = new Date(dateFormat);//开始时间
            let startMonth = startDate.getMonth();//开始月份
            startDate.setMonth(startMonth);
            let month = startDate.Format("yyyy-MM");
            calendarList.unshift({
                "month": month,
                "curYear": month.split("-")[0],
                "curMonth": month.split("-")[1],
                "dates": self.calendar({
                    "month": month
                })
            });
            self.calendarList = calendarList;
        },
        calendar (data) {
            const self = this;
            let curMonth = parseInt(data.month.split("-")[1]);
            let calendar = [[], [], [], [], [], []];
            let startDate = new Date(data.month);
            let dayNum = (new Date(new Date(startDate.getTime()+31*60*60*24*1000).Format("yyyy/MM/01 00:00:00")).getTime()-new Date(startDate.Format("yyyy/MM/01 00:00:00")).getTime())/60/60/1000/24;
            let startDay = startDate.getDay();//获取当月第一天是周几
            for (let i = -startDay, len = (42 - startDay), num = 0; i < len; i++) {
                let date = new Date(data.month);
                date.setDate(i + 1);
                let week = date.getDay();
                calendar[num][week % 7] = {
                    "date": date,
                    "active": false,
                    "haveDate": self.hasdata.indexOf(date.Format("yyyy-MM-dd")) != -1 ? true : false
                };
                if (week % 7 == 6) num++;
            }
            return calendar;
        },
        prevMonth () {
            const self = this;
            let month = self.value.getMonth();
            if (month) {
                self.value.setMonth(month - 1);
            } else {
                self.value.setFullYear(self.value.getFullYear() - 1);
                self.value.setMonth(11);
            }
            self.getCalendarList(self.value);
            self.$emit("on-change",self.value);
        },
        nextMonth () {
            const self = this;
            let month = self.value.getMonth();
            if (month <= 10) {
                self.value.setMonth(month + 1);
            } else {
                self.value.setFullYear(self.value.getFullYear() + 1);
                self.value.setMonth(0);
            }
            self.getCalendarList(self.value);
            self.$emit("on-change",self.value);
        },
        clickOneDay (day) {
            const self = this;
            self.flagDate=day.date;
            self.$emit("on-click-one",day);
        }
    }
};
</script>