function createTree(categories, parentId = "") {
    const tree = [];
    categories.forEach(item => {
        if (item.parentId == parentId) {
            const newItem = item.toObject();
            const children = createTree(categories, item.id);
            if (children.length) {
                newItem.children = children;
            }
            tree.push(newItem);
        }
    });
    return tree;
};

module.exports.createTree = (categories) => {
    const newCategories = createTree(categories);
    return newCategories;
};

