var Blog = require("../models/blog.model");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/ibcss");

var blogs = [
    new Blog({
        imagePath:
            'https://images.pexels.com/photos/37076/pots-plants-cactus-succulent.jpg',
        title: 'vacationing with plants',
        content:
            'Consequatur quisquam quia nam nesciunt. Omnis at qui recusandae saepe vitae modi fugit. In quae maxime adipisci ullam dolores. Nostrum sed quaerat soluta.',
        author: "Dana",
        tag: "cactus"
    }),
    new Blog({
        imagePath:
            'https://images.pexels.com/photos/953194/pexels-photo-953194.jpeg',
        title: 'Lady and the cactus',
        content:
            'Consequatur quisquam quia nam nesciunt. Omnis at qui recusandae saepe vitae modi fugit. In quae maxime adipisci ullam dolores. Nostrum sed quaerat soluta.',
        author: "Dana"
    }),
    new Blog({
        imagePath:
            'https://images.pexels.com/photos/37076/pots-plants-cactus-succulent.jpg',
        title: 'some plants grow big',
        content:
            'Consequatur quisquam quia nam nesciunt. Omnis at qui recusandae saepe vitae modi fugit. In quae maxime adipisci ullam dolores. Nostrum sed quaerat soluta.',
        author: "Dana",
        tag: "cactus"

    }),
    new Blog({
        imagePath:
            'https://images.pexels.com/photos/1054014/pexels-photo-1054014.jpeg',
        title: 'new blog',
        content:
            'Consequatur quisquam quia nam nesciunt. Omnis at qui recusandae saepe vitae modi fugit. In quae maxime adipisci ullam dolores. Nostrum sed quaerat soluta.',
        author: "Dana",
        tag: "succulent"
    }),
    new Blog({
        imagePath:
            'https://images.pexels.com/photos/39314/cacti-leaf-cactus-plant-thorns-39314.jpeg',
        title: 'Spike Succulent',
        content:
            'Consequatur quisquam quia nam nesciunt. Omnis at qui recusandae saepe vitae modi fugit. In quae maxime adipisci ullam dolores. Nostrum sed quaerat soluta.',
        author: "Ana",
        tag: "succulent"
    }),
    new Blog({
        imagePath:
            'https://images.pexels.com/photos/209771/pexels-photo-209771.jpeg',
        title: 'Erotic Flower',
        content:
            'Consequatur quisquam quia nam nesciunt. Omnis at qui recusandae saepe vitae modi fugit. In quae maxime adipisci ullam dolores. Nostrum sed quaerat soluta.',
        author: "Dana",
        tag: "euphorbia"
    })
];

var done = 0;
for (var i = 0; i < blogs.length; i++) {
    blogs[i].save(function (err, result) {
        done++;
        if (done === blogs.length) {
            exit();
        }
    });
}


function exit() {
    mongoose.disconnect();

}
