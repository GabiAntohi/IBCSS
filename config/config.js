module.exports = {
    mongoURI:
        'mongodb://localhost:27017/ibcss',
//        'mongodb+srv://petyus:12345@petyus01-a0req.mongodb.net/ibcss?retryWrites=true&w=majority',
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY
};
