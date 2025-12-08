module.exports = (keyword) => {
    const objectSearch = {
        keyword: ""
    };
    if(keyword){
        objectSearch.keyword = keyword;
        const regex = new RegExp(keyword, "i");
        objectSearch.regex = regex;
    }
    return objectSearch;
};

