import {
    gql
} from 'apollo-server-express';

export default gql `
    extend type Query {
      getAllPosts: [Post!]!
      getPostById(id: ID!): Post!
      getPostsByLimitAndPage(page: Int, limit: Int): PostPaginator!
      getAuthenticatedUsersPosts(page: Int, limit: Int): PostPaginator! @isAuth
    },

    extend type Mutation {
        createNewPost(newPost: PostInput!): Post! @isAuth
        deletePostById(id: ID!): PostNotification! @isAuth
        editPostByID(updatedPost: PostInput!, id: ID!): Post! @isAuth
    }

    input PostInput {
        title:String!
        content: String!
        featuredImage: String
    }

    type Post {
        id: ID!
        title:String!
        content: String!
        updatedAt:String
        createdAt: String
        featuredImage: String
        author: User!
    }

    type PostPaginator {
        posts: [Post!]!
        paginator: PostLabels
    }

    type PostLabels {
        postCount: Int!
        perPage: Int!
        pageCount: Int!
        currentPage: Int!
        slNo: Int!
        hasPrevPage: Boolean!
        hasNextPage: Boolean!
        prev: Int
        next: Int
    }

    type PostNotification {
        id: ID!
        message: String!
        success: Boolean!
    }

`;