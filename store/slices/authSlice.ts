interface User {
    id: number;
    username: string;
    email: string;
    token: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
    error: string | null;
} 