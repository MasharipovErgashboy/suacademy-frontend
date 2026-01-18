// Authentication utility functions

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface User {
    id: number;
    username: string;
    email: string;
    nationality: string;
    is_verified: boolean;
    is_premium: boolean;
    image: string | null;
    subscription?: {
        plan: string;
        is_active: boolean;
        end_date: string;
    } | null;
    stats?: {
        watched_count: number;
        history: Array<{
            title: string;
            slug: string;
            image: string | null;
            finished_at: string;
            rating?: number;
            comment?: string;
        }>;
    };
    student_id?: string;
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("access_token");
    return !!token;
};

// Get access token
export const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
};

// Get refresh token
export const getRefreshToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh_token");
};

// Save tokens
export const saveTokens = (tokens: AuthTokens): void => {
    localStorage.setItem("access_token", tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
};

// Save user data
export const saveUser = (user: User): void => {
    localStorage.setItem("user", JSON.stringify(user));
};

// Get user data
export const getUser = (): User | null => {
    if (typeof window === "undefined") return null;
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

// Logout
export const logout = (): void => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/";
};

// Fetch with authentication wrapper
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    let token = getToken();
    const nationality = typeof window !== "undefined" ? localStorage.getItem("nationality") : "uz";

    const getHeaders = (accessToken: string | null) => {
        const headers = {
            "Content-Type": "application/json",
            "Accept-Language": nationality || "uz",
            ...options.headers,
        } as Record<string, string>;

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }
        return headers;
    };

    let response = await fetch(url, { ...options, headers: getHeaders(token) });

    // Handle token expiration/invalid session
    if (response.status === 401 && token) {
        const refreshToken = getRefreshToken();

        if (refreshToken) {
            try {
                // Attempt to refresh the token
                const refreshResponse = await fetch(`${API_BASE_URL}/refresh/`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ refresh: refreshToken }),
                });

                if (refreshResponse.ok) {
                    const data = await refreshResponse.json();
                    saveTokens({
                        access: data.access,
                        refresh: data.refresh || refreshToken // Use new refresh token if provided, else keep old one
                    });

                    // Retry the original request with new token
                    token = data.access;
                    response = await fetch(url, { ...options, headers: getHeaders(token) });
                } else {
                    // Refresh failed
                    logout();
                }
            } catch (error) {
                console.error("Token refresh error:", error);
                logout();
            }
        } else {
            // No refresh token available
            logout();
        }
    }

    return response;
};

// API base URL
export const API_BASE_URL = "http://127.0.0.1:8000/auth";
export const BACKEND_URL = "http://127.0.0.1:8000";
