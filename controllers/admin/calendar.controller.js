const Calendar = require('../../models/calendar.model');
const moment = require('moment');

let CalendarController = {};
CalendarController.index = function (req, res, next) {
    let now = moment();
    let year = now.year();
    let opt = {sort: "month"};
    let query = Calendar.find({year: year});
    query.exec(function (err, entries) {
        if (err) {
            next(err)
        }
        if (entries.length === 0) {
            for (let i = 1; i < 13; i++) {
                let entry = new Calendar({
                    month: i,
                    year: year,
                    published: false,
                    title: "",
                    description: "",
                });
                entry.save();
                entries.push(entry);
            }
        } else if (entries.length !== 12) {
            next(new Error("Calendar in an invalid state"))
        }
        console.log("roll with "+entries.length);
        console.log(entries);
        res.render('admin/calendar/index', { title: 'Manage Calendar', layout: false, calendar: entries});
    });
};

module.exports = CalendarController;