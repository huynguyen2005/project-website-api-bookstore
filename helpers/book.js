module.exports.calculateNewPrice = (book) => {
    book.newPrice = book.price - (book.price * (book.discountPercent / 100));
};