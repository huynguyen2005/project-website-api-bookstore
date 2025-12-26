module.exports = {
    // Book
    "GET /api/v1/admin/book": "book_view",
    "GET /api/v1/admin/book/:id": "book_detail",
    "POST /api/v1/admin/book/create": "book_create",
    "PUT /api/v1/admin/book/edit/:id": "book_edit",
    "DELETE /api/v1/admin/book/delete/:id": "book_delete",

    // Book Category
    "GET /api/v1/admin/book-category/list": null,
    "GET /api/v1/admin/book-category": "bookCategory_view",
    "GET /api/v1/admin/book-category/:id": "bookCategory_detail",
    "POST /api/v1/admin/book-category/create": "bookCategory_create",
    "PUT /api/v1/admin/book-category/edit/:id": "bookCategory_edit",
    "DELETE /api/v1/admin/book-category/delete/:id": "bookCategory_delete",

    // Author
    "GET /api/v1/admin/author/list": null,
    "GET /api/v1/admin/author": "author_view",
    "GET /api/v1/admin/author/:id": "author_detail",
    "POST /api/v1/admin/author/create": "author_create",
    "PUT /api/v1/admin/author/edit/:id": "author_edit",
    "DELETE /api/v1/admin/author/delete/:id": "author_delete",

    // Publisher
    "GET /api/v1/admin/publisher": "publisher_view",
    "GET /api/v1/admin/publisher/:id": "publisher_detail",
    "POST /api/v1/admin/publisher/create": "publisher_create",
    "PUT /api/v1/admin/publisher/edit/:id": "publisher_edit",
    "DELETE /api/v1/admin/publisher/delete/:id": "publisher_delete",

    // Payment Method
    "GET /api/v1/admin/payment-method/list": null,
    "GET /api/v1/admin/payment-method": "paymentMethod_view",
    "GET /api/v1/admin/payment-method/:id": "paymentMethod_detail",
    "POST /api/v1/admin/payment-method/create": "paymentMethod_create",
    "PUT /api/v1/admin/payment-method/edit/:id": "paymentMethod_edit",
    "DELETE /api/v1/admin/payment-method/delete/:id": "paymentMethod_delete",

    // Carrier
    "GET /api/v1/admin/carrier": "carrier_view",
    "GET /api/v1/admin/carrier/:id": "carrier_detail",
    "POST /api/v1/admin/carrier/create": "carrier_create",
    "PUT /api/v1/admin/carrier/edit/:id": "carrier_edit",
    "DELETE /api/v1/admin/carrier/delete/:id": "carrier_delete",

    // Blog
    "GET /api/v1/admin/blog": "blog_view",
    "GET /api/v1/admin/blog/:id": "blog_detail",
    "POST /api/v1/admin/blog/create": "blog_create",
    "PUT /api/v1/admin/blog/edit/:id": "blog_edit",
    "DELETE /api/v1/admin/blog/delete/:id": "blog_delete",

    // Role
    "GET /api/v1/admin/role/list": null,
    "GET /api/v1/admin/role": "role_view",
    "GET /api/v1/admin/role/:id": "role_detail",
    "POST /api/v1/admin/role/create": "role_create",
    "PUT /api/v1/admin/role/edit/:id": "role_edit",
    "DELETE /api/v1/admin/role/delete/:id": "role_delete",
    "POST /api/v1/admin/role/permission": "role_permission",

    // Cover Type
    "GET /api/v1/admin/cover-type/list": null,
    "GET /api/v1/admin/cover-type": "coverType_view",
    "GET /api/v1/admin/cover-type/:id": "coverType_detail",
    "POST /api/v1/admin/cover-type/create": "coverType_create",
    "PUT /api/v1/admin/cover-type/edit/:id": "coverType_edit",
    "DELETE /api/v1/admin/cover-type/delete/:id": "coverType_delete",

    // Distributor
    "GET /api/v1/admin/distributor/list": null,
    "GET /api/v1/admin/distributor": "distributor_view",
    "GET /api/v1/admin/distributor/:id": "distributor_detail",
    "POST /api/v1/admin/distributor/create": "distributor_create",
    "PUT /api/v1/admin/distributor/edit/:id": "distributor_edit",
    "DELETE /api/v1/admin/distributor/delete/:id": "distributor_delete",

    // Account
    "GET /api/v1/admin/account": "account_view",
    "GET /api/v1/admin/account/:id": "account_detail",
    "POST /api/v1/admin/account/create": "account_create",
    "PUT /api/v1/admin/account/edit/:id": "account_edit",
    "DELETE /api/v1/admin/account/delete/:id": "account_delete",

    //Order
    "GET /api/v1/admin/orders": "order_view",
    "GET /api/v1/admin/orders/:id": "order_detail",
    "PUT /api/v1/admin/orders/:id/status": "order_edit_status",
};
