export interface Post {
    user: string;
    id?: string;
    title: string;
    slug: string;
    body: string;
    userId?: string;
    image: string;
    category: string[];
    relative?: Post[]
    createdAt?: string;
    updatedAt?: string;
}