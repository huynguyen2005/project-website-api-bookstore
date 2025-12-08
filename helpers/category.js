let cnt = 0;
function createTree(categories, parentId = "") {
    const tree = [];
    categories.forEach(item => {
        if (item.parentId == parentId) {
            cnt++;
            const newItem = item.toObject ? item.toObject() : { ...item };
            newItem.index = cnt;
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
    cnt = 0;
    const newCategories = createTree(categories);
    return newCategories;
};


module.exports.getParent = (categories, item) => {
    const result = [];
    result.push(item);
    let parentId = item.parentId;
    while(parentId){
        const parent = categories.find(p => p.id == parentId);
        if(!parent) break;
        result.push(parent);
        parentId = parent.id;
    }
    return result;
};