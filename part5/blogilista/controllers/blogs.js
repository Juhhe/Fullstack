const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', {username: 1, name: 1})
    console.log(blogs)
      
    response.json(blogs)
  } catch (exception) {
    response.status(400).end()
  }
})

blogRouter.post('/', async (request, response) => {

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id) {
      return response.status(401).json({error: 'token invalid'})
    }

    const user = await User.findById(decodedToken.id)


    const blog = new Blog({
      id: request.body.id,
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes || 0,
      user: user._id
    })
    try {
      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
  
      response.status(201).json(savedBlog)
    } catch (exception) {
      response.status(400).end()
    }
  }
  catch (exception) {
    return response.status(401).end()
  }
})

blogRouter.delete('/:id', async (request, response) => {

  try {
    const user = request.user

    const blog = await Blog.findById(request.params.id)

    if(blog.user.toString() === user.id.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      response.status(204).end()
    }

  } catch (exception) {
    response.status(401).json({error: 'token invalid'})
  }
})

blogRouter.put('/:id', async (request, response) => {

  const newBlog = request.body

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { new: true })
    response.json(updatedBlog)
  } catch (exception) {
    response.status(400).end()
  }
})


module.exports = blogRouter