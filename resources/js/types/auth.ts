export type User = {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    roles?: string[];
    permissions?: string[];
    created_at?: string;
    updated_at?: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
};
