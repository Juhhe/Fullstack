const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



const initialBlogs = [
    {
        title: '1',
        author: 'First',
        url: 'www.1.com',
        likes: 1
    },
    {
        title: '2',
        author: 'Second',
        url: 'www.2.com',
        likes: 2
    }
]


blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

getToken = async () => {
    const users = await usersInDb()
    const token = jwt.sign({ username: users[0].username, id: users[0].id }, process.env.SECRET)
    return token
}

// Database has one user and two blogs initially
beforeEach(async () => {

    // Save user
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('testPassword', 10)
    const user = new User({ username: 'InitialUser', passwordHash })
    await user.save()

    // Set user for blogs and save them
    await Blog.deleteMany({})
    const blogObjects = initialBlogs.map(blog => new Blog({ ...blog, user: user._id }))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('all blogs are jsons', async () => {

    const blogsInitially = await blogsInDb()

    const response = await api.get('/api/blogs')

    expect(response.type).toBe('application/json')
    expect(response.body.length).toBe(blogsInitially.length)
})

test('blogs have id', async () => {

    const response = await api.get('/api/blogs')
    expect(response.body[0].id).toBeDefined()
})

test('blog can be posted', async () => {
    
    const blogsInitially = await blogsInDb()

    const token = await getToken()

    const newBlog = {
        title: '3',
        author: 'Third',
        url: 'www.3.com',
        likes: 3
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(blogsInitially.length + 1)
})

test('without token the blog posting sends 401 unauthorized', async () => {

    await api
        .post('/api/blogs')
        .send(initialBlogs[0])
        .expect(401)
})

test('blog has 0 likes by default', async () => {

    const blogsInitially = await blogsInDb()

    const token = await getToken()

    const newBlog = {
        title: '3',
        author: 'Third',
        url: 'www.3.com'
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(201)
        
    const response = await api.get('/api/blogs')

    expect(response.body[blogsInitially.length].likes).toBe(0)
})

test('blog requires title and url', async () => {

    const token = await getToken()

    const newBlogs = [
        {
        title: '3',
        author: 'Third'
        },
        {
        author: 'Fourth',
        url: 'www.4.com'
        }
    ]


    await api
        .post('/api/blogs')
        .send(newBlogs[0])
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

    await api
        .post('/api/blogs')
        .send(newBlogs[1])
        .set('Authorization', `Bearer ${token}`)
        .expect(400)
})

test('blog can be deleted', async () => {

    const token = await getToken()

    const blogsInitially = await blogsInDb()
    const blogToDelete = blogsInitially[0]

    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(blogsInitially.length - 1)
})

test('blog can be updated', async () => {

    const token = await getToken()
    
    const blogsInitially = await blogsInDb()
    const blogToUpdate = blogsInitially[0]

    const updatedBlog = {
        title: '1',
        author: 'First',
        url: 'www.1.com',
        likes: 5
    }

    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

    const response = await api.get('/api/blogs')

    expect(response.body[0].likes).toBe(5)
})



describe('user tests', () => {

    test('user can be created', async () => {
        const usersAtStart = await usersInDb()
        const newUser = {
            username: 'test',
            name: 'Test User',
            password: 'test'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
    })

    test('user cannot be created with too short username', async () => {
        const usersAtStart = await usersInDb()
        const newUser = {
            username: 'te',
            name: 'Test User',
            password: 'test'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('user cannot be created with too short password', async () => {
        const usersAtStart = await usersInDb()
        const newUser = {
            username: 'test',
            name: 'Test User',
            password: 'te'
        }
        
        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })

    test('user cannot be created with duplicate username', async () => {
        const usersAtStart = await usersInDb()
        const newUser = {
            username: 'InitialUser',
            name: 'Test User',
            password: 'test'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        const usersAtEnd = await usersInDb()
        expect(usersAtEnd.length).toBe(usersAtStart.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})