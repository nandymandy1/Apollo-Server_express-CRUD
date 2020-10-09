import {
    ApolloError
} from 'apollo-server-express';

import {
    NewPostValidationRules
} from '../../validators';

const myCustomLabels = {
    totalDocs: 'postCount',
    docs: 'posts',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator'
};

export default {
    Query: {
        getAllPosts: async (_, {}, {
            Post
        }) => {
            let posts = await Post.find().populate('author');
            return posts;
        },
        getPostById: async (_, {
            id
        }, {
            Post
        }) => {
            try {
                let post = await Post.findById(id);
                if (!post) {
                    throw new Error("Post not found.");
                }
                await post.populate('author').execPopulate();
                return post;
            } catch (err) {
                throw new ApolloError(err.message);
            }
        },
        getPostsByLimitAndPage: async (_, {
            page,
            limit
        }, {
            Post
        }) => {

            const options = {
                page: page || 1,
                limit: limit || 10,
                sort: {
                    createdAt: -1
                },
                populate: 'author',
                customLabels: myCustomLabels
            };

            let posts = await Post.paginate({}, options);
            return posts;
        },
        getAuthenticatedUsersPosts: async (_, {
            page,
            limit
        }, {
            Post,
            user
        }) => {
            const options = {
                page: page || 1,
                limit: limit || 10,
                sort: {
                    createdAt: -1
                },
                populate: 'author',
                customLabels: myCustomLabels
            };

            let posts = await Post.paginate({
                author: user._id.toString()
            }, options);
            return posts;
        }
    },
    Mutation: {
        createNewPost: async (_, {
            newPost
        }, {
            Post,
            user
        }) => {
            await NewPostValidationRules.validate(newPost, {
                abortEarly: false
            });

            let result = await Post.create({
                ...newPost,
                author: user._id
            });
            await result.populate('author').execPopulate();
            return result;
        },
        editPostByID: async (_, {
            id,
            updatedPost
        }, {
            Post,
            user
        }) => {
            await NewPostValidationRules.validate(updatedPost, {
                abortEarly: false
            });
            try {
                let editedPost = await Post.findOneAndUpdate({
                    _id: id,
                    author: user._id.toString()
                }, {
                    ...updatedPost
                }, {
                    new: true
                });

                if (!editedPost) {
                    throw new Error("Unable to edit the post.");
                }

                return editedPost;
            } catch (err) {
                throw new ApolloError(err.message, 400);
            }
        },
        deletePostById: async (_, {
            id
        }, {
            Post,
            user
        }) => {
            try {
                let deletedPost = await Post.findOneAndDelete({
                    _id: id,
                    author: user._id.toString()
                });

                if (!deletedPost) {
                    throw new Error("Unable to deleted the post.");
                }

                return {
                    success: true,
                    id: deletedPost.id,
                    message: "Your posts is deleted.",
                }
            } catch (err) {
                console.log("DELETED_ERR", err);
                throw new ApolloError(err.message);
            }
        }
    }
}