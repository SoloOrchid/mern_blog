export interface User {
    profile: {
        id: number;
        name: string;
        userName: string;
        email: string;
        dob: string;
        roles: string[];
    };
    bookmarked: {
        title: string;
        body: string;
        slug: string;
        user: string;
        file: string;
    }[],
    commented: {
        title: string;
        body: string;
        slug: string;
        user: string;
    }[]
}