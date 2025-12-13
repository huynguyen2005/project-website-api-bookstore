const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const blogSchema = new mongoose.Schema(
    {
        title: String,
        content: String,
        thumbnail: String,
        status: {
            type: String,
            default: "active"
        },
        position: Number,
        slug: {
            type: String,
            slug: "title",
            unique: true
        },
        createdBy: {
            account_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Account"
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        },
        updatedBy: [
            {
                account_id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Account"
                },
                updatedAt: Date
            }
        ]
    }
);

const Blog = mongoose.model("Blog", blogSchema, "blogs");

module.exports = Blog;
