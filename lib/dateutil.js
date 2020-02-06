const moment = require('moment');
let months = [
    "January", "Febuary", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

let DateUtil = {};
DateUtil.intToMonth = function(month) {
    if (month < 0 || month > 11) {
        throw new Error("invalid integer value for month")
    }
    return months[month];
};

DateUtil.generateDates = function(year, nthDay, weekdayAsString) {
    let weekdayToFind = moment().day(weekdayAsString).weekday();
    let dates = [];
    for (let i = 0; i < 12; i++) {
        let startOfMonth = moment().year(year).month(i).startOf('month');
        let firstChosenDay = startOfMonth.clone();

        // Advance until first occurance of 'weekdayToFind'.
        while(firstChosenDay.weekday() !== weekdayToFind) {
            firstChosenDay.add(1, 'day');
        }
        let chosenDay = firstChosenDay.clone().add(nthDay-1, 'week');
        dates.push(chosenDay)
    }
    return dates
};

module.exports = DateUtil;