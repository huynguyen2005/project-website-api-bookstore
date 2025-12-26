module.exports.calculateNewPrice = (book) => {
    return book.price - (book.price * (book.discountPercent / 100));
};