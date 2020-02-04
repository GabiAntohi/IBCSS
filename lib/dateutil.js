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
module.exports = DateUtil;