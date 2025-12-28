module.exports.createTree = (categories) => {
    const map = new Map();
    const tree = [];

    categories.forEach(item => {
        const obj = item.toObject();
        obj.children = [];
        map.set(item._id.toString(), obj);
    });

    categories.forEach(item => {
        const parentId = item.parentId?.toString();
        const id = item._id.toString();

        if (parentId && map.has(parentId)) {
            map.get(parentId).children.push(map.get(id));
        } else {
            tree.push(map.get(id));
        }
    });

    return tree;
};
