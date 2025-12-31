module.exports = {
    // Book
    "GET /api/v1/admin/books": "book_view",
    "GET /api/v1/admin/books/:id": "book_detail",
    "POST /api/v1/admin/books": "book_create",
    "PUT /api/v1/admin/books/:id": "book_edit",
    "DELETE /api/v1/admin/books/:id": "book_delete",

    // Book Category
    "GET /api/v1/admin/book-categories/list": null,
    "GET /api/v1/admin/book-categories": "bookCategory_view",
    "GET /api/v1/admin/book-categories/:id": "bookCategory_detail",
    "POST /api/v1/admin/book-categories": "bookCategory_create",
    "PUT /api/v1/admin/book-categories/:id": "bookCategory_edit",
    "DELETE /api/v1/admin/book-categories/:id": "bookCategory_delete",

    // Author
    "GET /api/v1/admin/authors/list": null,
    "GET /api/v1/admin/authors": "author_view",
    "GET /api/v1/admin/authors/:id": "author_detail",
    "POST /api/v1/admin/authors": "author_create",
    "PUT /api/v1/admin/authors/:id": "author_edit",
    "DELETE /api/v1/admin/authors/:id": "author_delete",

    // Publisher
    "GET /api/v1/admin/publishers": "publisher_view",
    "GET /api/v1/admin/publishers/:id": "publisher_detail",
    "POST /api/v1/admin/publishers": "publisher_create",
    "PUT /api/v1/admin/publishers/:id": "publisher_edit",
    "DELETE /api/v1/admin/publishers/:id": "publisher_delete",

    // Payment Method
    "GET /api/v1/admin/payment-methods/list": null,
    "GET /api/v1/admin/payment-methods": "paymentMethod_view",
    "GET /api/v1/admin/payment-methods/:id": "paymentMethod_detail",
    "POST /api/v1/admin/payment-methods": "paymentMethod_create",
    "PUT /api/v1/admin/payment-methods/:id": "paymentMethod_edit",
    "DELETE /api/v1/admin/payment-methods/:id": "paymentMethod_delete",

    // Carrier
    "GET /api/v1/admin/carriers": "carrier_view",
    "GET /api/v1/admin/carriers/:id": "carrier_detail",
    "POST /api/v1/admin/carriers": "carrier_create",
    "PUT /api/v1/admin/carriers/:id": "carrier_edit",
    "DELETE /api/v1/admin/carriers/:id": "carrier_delete",

    // Blog
    "GET /api/v1/admin/blogs": "blog_view",
    "GET /api/v1/admin/blogs/:id": "blog_detail",
    "POST /api/v1/admin/blogs": "blog_create",
    "PUT /api/v1/admin/blogs/:id": "blog_edit",
    "DELETE /api/v1/admin/blogs/:id": "blog_delete",

    // Role
    "GET /api/v1/admin/roles/list": null,
    "GET /api/v1/admin/roles": "role_view",
    "GET /api/v1/admin/roles/:id": "role_detail",
    "POST /api/v1/admin/roles": "role_create",
    "PUT /api/v1/admin/roles/:id": "role_edit",
    "DELETE /api/v1/admin/roles/:id": "role_delete",
    "POST /api/v1/admin/roles/permission": "role_permission",

    // Cover Type
    "GET /api/v1/admin/cover-types/list": null,
    "GET /api/v1/admin/cover-types": "coverType_view",
    "GET /api/v1/admin/cover-types/:id": "coverType_detail",
    "POST /api/v1/admin/cover-types": "coverType_create",
    "PUT /api/v1/admin/cover-types/:id": "coverType_edit",
    "DELETE /api/v1/admin/cover-types/:id": "coverType_delete",

    // Distributor
    "GET /api/v1/admin/distributors/list": null,
    "GET /api/v1/admin/distributors": "distributor_view",
    "GET /api/v1/admin/distributors/:id": "distributor_detail",
    "POST /api/v1/admin/distributors": "distributor_create",
    "PUT /api/v1/admin/distributors/:id": "distributor_edit",
    "DELETE /api/v1/admin/distributors/:id": "distributor_delete",

    // Account
    "GET /api/v1/admin/accounts": "account_view",
    "GET /api/v1/admin/accounts/:id": "account_detail",
    "POST /api/v1/admin/accounts": "account_create",
    "PUT /api/v1/admin/accounts/:id": "account_edit",
    "DELETE /api/v1/admin/accounts/:id": "account_delete",

    // Order
    "GET /api/v1/admin/orders": "order_view",
    "GET /api/v1/admin/orders/:id": "order_detail",
    "PUT /api/v1/admin/orders/:id/status": "order_edit",
};
