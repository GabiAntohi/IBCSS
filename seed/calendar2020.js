const CalendarUtil = require("../lib/calendar");
const mongoose = require("mongoose");
const moment = require('moment');

const info = {
    1: {
        title: "Potting process discussion",
        description: "Michael Harrington will take us through the preparation of potting mixes and the potting process with many tips along the way",
    },
    2: {
        title: "Some cacti of Northern Argentina",
        description: "This remote high altitude environment is home to many endemics. A slide presentation will highlight some of its gems.",
    },
    3: {
        title: "Cactus and Succulent identification",
        description: "Bring at least five cacti or succulents whose names you don’t know and we’ll do our best! Reference books will be available.\n" +
            "\n" +
            "This will only work if you bring plants, so please make the effort.",
    },
    4: {
        title: "Pre-show plants display",
        description: "Bring your ten favourite plants and put them on the bench! This is not competitive but does provide a chance to share plants that are not show-worthy or don’t fit a class. We all have them  so bring them along and make it an interesting evening. It will also help you to get ready for the Show ",
    },
    5: {
        title: "Potting process discussion",
        description: "Michael Harrington will take us through the preparation of potting mixes and the potting process with many tips along the way",
    },
    6: {
        title: "The Cactus and Succulent Show in the National Botanic Gardens.",
        description: "All hands on deck!\n" +
            "\n" +
            "Staging from 17:00 to 20:00 on Friday evening and from 9:00 on Saturday morning. Judging commences at 11:00.\n" +
            "\n" +
            "There will also be a plant sale.",
    },
};

mongoose
    .connect("mongodb://localhost:27017/ibcss")
    .then(function () {
        let year = 2020;
        let defaultNthDay = 2;
        let defaultWeekday = 'Thursday';
        let defaultHour = 19;
        let defaultMinute = 30;

        let promises = CalendarUtil.generateYearSchedule(year, defaultNthDay, defaultWeekday, defaultHour, defaultMinute)
            .map((obj) => {
                let time = moment.unix(obj.timestamp);
                let month = time.month();
                if (month in info) {
                    obj.title = info[month].title;
                    obj.description = info[month].description;
                    obj.published = true;
                } else {
                    obj.published = false;
                }
                return obj.save();
            });

        Promise.all(promises)
            .then(function (obj) {
                mongoose.disconnect();
            });
    });
