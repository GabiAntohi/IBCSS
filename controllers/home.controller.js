const Blog = require('../models/blog.model');
const CalendarUtil = require('../lib/calendar');
const moment = require('moment');

let HomeController = {};
HomeController.index = function (req, res, next) {
    let now = moment();
    let year = now.year();
    let month = now.month();
    let blogs = Blog.find().exec();
    let schedule = CalendarUtil.getYearSchedule(year);
    Promise.all([blogs, schedule])
        .then(function (results) {
            let docs = results[0];
            let calendar = results[1];
            let blogPosts = [];
            let postSize = 1;
            for (let i = 0; i < 3; i += postSize) {
                blogPosts.push(docs.slice(i, i + postSize));
            }

            let timeInfo = calendar.map(function (entry) {
                return CalendarUtil.createTimeInfo(entry.timestamp);
            });

            res.render('index', {
                title: 'Irish Cactus and Succulent Society',
                blogs: blogPosts,
                calendar: calendar,
                timeInfo: timeInfo,
                currentYear: year,
                currentMonth: month
            });
        });
};

module.exports = HomeController;