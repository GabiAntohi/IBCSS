const Calendar = require('../../models/calendar.model');
const moment = require('moment');

function getYearSchedule(year) {
    return Calendar.find(
        {
            year: year
        },
        undefined,
        {
            sort: {
                month: 1
            }
        })
        .exec();
}

let CalendarController = {};
CalendarController.index = function (req, res) {
    let year = moment().year();
    res.redirect("/admin/calendar/"+year)
};

CalendarController.edit = function (req, res, next) {
    if (typeof req.params.year == "undefined") {
        res.redirect("/admin/calendar");
        return
    }
    let year = req.params.year;
    if (year.length !== 4) {
        throw new Error("invalid year")
    }

    // Fetch years calendar, or create default unpublished entries
    getYearSchedule(year)
        .then(function (entries) {
        if (entries.length === 0) {
            let created = [];
            for (let i = 0; i < 12; i++) {
                let entry = new Calendar({
                    month: i,
                    year: year,
                    published: false,
                    title: "",
                    description: "",
                });
                created.push(entry.save());
            }
            return Promise.all(created);
        } else if (entries.length !== 12) {
            next(new Error("Calendar in an invalid state"))
        } else {
            return entries
        }
    }, function (err) {
        throw err;
    })
        .then(function (entries) {
            // Render page with calendar entries
            res.render('admin/calendar/edit', {
                title: 'Manage Calendar',
                layout: false,
                calendar: entries,
                year: year
            });
        })
};

// Update request. We'll have an array of calendar objects coming in.
// Ensure we haven't lost/gained anything.
CalendarController.submitEdit = function (req, res, next) {
    let year = req.params.year;
    getYearSchedule(year)
        .then(function (entries) {
        if (entries.length === 0) {
            throw new Error("calendar does not exist");
        } else if (req.body.calendar.length !== entries.length) {
            throw new Error("missing form fields")
        }

        // Iterate over entries and apply updates
        let updates = [];
        for (let i = 0; i < entries.length - 1; i++) {
            let entry = entries[i];
            let formEntry = req.body.calendar[i];

            // published is checkbox, which is omitted if not set.
            let published = typeof formEntry.published != "undefined";
            if (entry.published !== published) {
                entry.published = published
            }
            if (entry.title !== formEntry.title) {
                entry.title = formEntry.title
            }
            if (entry.description !== formEntry.description) {
                entry.description = formEntry.description
            }
            updates.push(entry.save())
        }
        return Promise.all(updates)
    }, function (err) {
        throw err;
    })
        .then(function () {
            // Redirect to manage view
            res.redirect('/admin/calendar/' + year);
        }, function (err) {
            throw err;
        });
};

module.exports = CalendarController;