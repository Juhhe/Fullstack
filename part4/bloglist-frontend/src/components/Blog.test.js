import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders content', async () => {
    const blog = {
        title: 'testi',
        author: 'Test Author',
        url: 'http://www.testurl.com',
        likes: 0,
        user: {
            name: 'Test User',
            username: 'testuser'
        }
    }

    render(<Blog blog={blog} />)
    
    const findTitle = screen.getByText('testi', { exact: false })
    expect(findTitle).toBeDefined()

    const findAuthor = screen.getByText('Test Author', { exact: false })
    expect(findAuthor).toBeDefined()
    

    const findUrl = screen.queryByText('http://www.testurl.com')
    expect(findUrl).toBeNull()
    
    const findLikes = screen.queryByText('0')
    expect(findLikes).toBeNull()

})

test('clicking the button calls event handler once', async () => {

    const blog = {
        title: 'testi',
        author: 'Test Author',
        url: 'http://www.testurl.com',
        likes: 0,
        user: {
            name: 'Test User',
            username: 'testuser'
        }
    }
    
    const mockHandler = jest.fn()


    render(<Blog blog={blog} handleLike={mockHandler} />)

    const button = screen.getByText('view')

    const user = userEvent.setup()

    const getItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem')
    getItemSpy.mockImplementation((key) => {
        if (key === 'loggedBlogappUser') {
            return JSON.stringify(user)
        }
    })

    await user.click(button)

    const findTitle = screen.getByText('testi', { exact: false })
    expect(findTitle).toBeDefined()

    const findAuthor = screen.getByText('Test Author', { exact: false })
    expect(findAuthor).toBeDefined()

    const findUrl = screen.getByText('http://www.testurl.com', { exact: false })
    expect(findUrl).toBeDefined()
    
    const findLikes = screen.getByText('0', { exact: false })
    expect(findLikes).toBeDefined()

    getItemSpy.mockRestore()

})

test('clicking the like button twice calls event handler twice', async () => {
    const blog = {
        title: 'testi',
        author: 'Test Author',
        url: 'http://www.testurl.com',
        likes: 0,
        user: {
            name: 'Test User',
            username: 'testuser'
        }
    }
    
    const mockHandler = jest.fn()


    render(<Blog blog={blog} handleLike={mockHandler} />)

    const button = screen.getByText('view')

    const user = userEvent.setup()

    const getItemSpy = jest.spyOn(window.localStorage.__proto__, 'getItem')
    getItemSpy.mockImplementation((key) => {
        if (key === 'loggedBlogappUser') {
            return JSON.stringify(user)
        }
    })

    await user.click(button)
    
    const likeButton = screen.getByText('like')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockHandler.mock.calls).toHaveLength(2)
    

    getItemSpy.mockRestore()

})

test('calling blog form sends correct info as props', async () => {

    const title = 'testi'
    const author = 'Test Author'
    const url= 'http://www.testurl.com'

    const user = userEvent.setup()

    const createBlog = jest.fn()

    const { container } = render(<BlogForm createBlog={createBlog} />)

    const titleInput = container.querySelector('#title-input')
    const authorInput = container.querySelector('#author-input')
    const urlInput = container.querySelector('#url-input')

    const createButton = screen.getByText('create')

    await user.type(titleInput, title)
    await user.type(authorInput, author)
    await user.type(urlInput, url)

    await user.click(createButton)

    expect(createBlog.mock.calls).toHaveLength(1)
    expect(createBlog.mock.calls[0][0].title).toBe(title)
    expect(createBlog.mock.calls[0][0].author).toBe(author)
    expect(createBlog.mock.calls[0][0].url).toBe(url)

})





