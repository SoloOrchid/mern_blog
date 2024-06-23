import DOMPurify from 'dompurify';
import api from '@/Utils/api';


const getPostByUser = async (username: string) => {
    const post = await api(`posts/${username}`, {
        method: 'GET',
        maxBodyLength: Infinity,
        credentials: 'include',
    });

    return post.json()
}

// Handle post creation
const createPost = async (title: string, body: string, category: string[], file: File) => {

    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', title);
    formData.append('body', DOMPurify.sanitize(body));
    formData.append('category', JSON.stringify(category));

    const post = await api('posts', {
        method: 'POST',
        maxBodyLength: Infinity,
        credentials: 'include',
        body: formData
    });

    return post.json()
};

const updatePost = async (username: string, slug: string, title: string, body: string, category: string[]) => {
    const post = await api(`posts/${username}/${slug}`, {
        method: 'PUT',
        maxBodyLength: Infinity,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: title,
            body: DOMPurify.sanitize(body),
            category: category
        })
    });

    return post.json()
};

const destroyPost = async (username: string, slug: string) => {
    const post = await api(`posts/${username}/${slug}`, {
        method: 'DELETE',
        maxBodyLength: Infinity,
        credentials: 'include',
    });

    return post
};

// Handle preview of the post
const previewPost = (title: string, body: string) => {
    try {
        // Store the preview data in sessionStorage
        const articleData = {
            title: title,
            body: DOMPurify.sanitize(body),
        };
        sessionStorage.setItem('previewArticle', JSON.stringify(articleData));
        window.open('/preview')
    } catch (error) {
        console.error('Error previewing post:', error);
    }
};

export {
    getPostByUser,
    createPost,
    updatePost,
    destroyPost,
    previewPost
}
