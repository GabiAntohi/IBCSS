var Product = require("../models/product.model");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ibcss");

var products = [
    new Product({
        imagePath:
            'https://images.pexels.com/photos/1445418/pexels-photo-1445418.jpeg',
        name: 'Tiger Succulent',
        description:
            'Consequatur quisquam quia nam nesciunt. Omnis at qui recusandae saepe vitae modi fugit. In quae maxime adipisci ullam dolores. Nostrum sed quaerat soluta.',
        price: 42
    }),
    new Product({
        imagePath:
            'https://images.pexels.com/photos/953194/pexels-photo-953194.jpeg',
        name: 'Alien Succulent',
        description:
            'Consequatur quisquam quia nam nesciunt. Omnis at qui recusandae saepe vitae modi fugit. In quae maxime adipisci ullam dolores. Nostrum sed quaerat soluta.',
        price: 15
    }),
    new Product({
        imagePath:
            'https://images.pexels.com/photos/6728/nature-desert-plants-lighting-6728.jpg',
        name: 'Triffid Cacti',
        description:
            'Consequatur quisquam quia nam nesciunt. Omnis at qui recusandae saepe vitae modi fugit. In quae maxime adipisci ullam dolores. Nostrum sed quaerat soluta.',
        price: 25
    }),
    new Product({
        imagePath:
            'https://images.pexels.com/photos/1054014/pexels-photo-1054014.jpeg',
        name: 'LV-426 Cacti',
        description:
            'Consequatur quisquam quia nam nesciunt. Omnis at qui recusandae saepe vitae modi fugit. In quae maxime adipisci ullam dolores. Nostrum sed quaerat soluta.',
        price: 19
    }),
    new Product({
        imagePath:
            'https://images.pexels.com/photos/39314/cacti-leaf-cactus-plant-thorns-39314.jpeg',
        name: 'Spike Succulent',
        description:
            'Consequatur quisquam quia nam nesciunt. Omnis at qui recusandae saepe vitae modi fugit. In quae maxime adipisci ullam dolores. Nostrum sed quaerat soluta.',
        price: 12
    }),
    new Product({
        imagePath:
            'https://images.pexels.com/photos/209771/pexels-photo-209771.jpeg',
        name: 'Erotic Flower',
        description:
            'Consequatur quisquam quia nam nesciunt. Omnis at qui recusandae saepe vitae modi fugit. In quae maxime adipisci ullam dolores. Nostrum sed quaerat soluta.',
        price: 45
    })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
    products[i].save(function (err, result) {
        done++;
        if (done === products.length) {
            exit();
        }
    });
}


function exit() {
    mongoose.disconnect();

}
