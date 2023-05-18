const lodash = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (favorite, blog) => {
        if (favorite.likes > blog.likes) {
            return favorite
        }
        return blog
    }
    return blogs.reduce(reducer, {})
}

const mostBlogs = (blogs) => {
    const authors = lodash.countBy(blogs, 'author')
    const author = lodash.maxBy(lodash.keys(authors), i => authors[i])
    return {
        author: author,
        blogs: authors[author]
    }
}

const mostLikes = (blogs) => {
    const authors = lodash.groupBy(blogs, 'author')
    const author = lodash.maxBy(lodash.keys(authors), i => totalLikes(authors[i]))

    return {
        author: author,
        likes: totalLikes(authors[author])
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}