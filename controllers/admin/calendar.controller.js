const Calendar = require('../../models/calendar.model');

let CalendarController = {};
CalendarController.index = function (req, res, next) {
    res.render('admin/calendar/index', { title: 'Index' });
};

module.exports = CalendarController;