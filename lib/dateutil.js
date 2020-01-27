let months = [
    "January", "Febuary", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

let DateUtil = {};
DateUtil.intToMonth = function(month) {
    if (month < 1 || month > 12) {
        throw new Error("invalid integer value for month")
    }
    return months[month-1];
};
module.exports = DateUtil;