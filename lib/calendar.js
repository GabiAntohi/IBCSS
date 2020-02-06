const DateUtil = require('./dateutil');
const Calendar = require('../models/calendar.model');
const moment = require('moment');

module.exports = {
    generateYearSchedule: function(year, nthDay, weekdayAsString, hour, minute) {
        return DateUtil.generateDates(year, nthDay, weekdayAsString)
            .map(function (date) {
                date.minute(minute).hour(hour);
                return new Calendar({
                    timestamp: date.unix(),
                    year: year,
                    published: false,
                    title: "",
                    description: "",
                });
            });
    },
    getYearSchedule: function (year) {
        return Calendar.find(
            {
                year: year
            },
            undefined,
            {
                sort: {
                    timestamp: 1
                }
            })
            .exec();
    },
    /**
     * @param timestamp Number
     */
    createTimeInfo: function (timestamp) {
        let time = moment.unix(timestamp);
        return {
            minute: time.minute(),
            hour: time.hour(),
            day: time.day(),
            dayText: time.format('Do'),
            month: time.month(),
            monthText: moment.months()[time.month()],
            year: time.year()
        }
    }
};