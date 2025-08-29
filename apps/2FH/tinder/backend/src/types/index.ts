export interface Context {
    user?: {
        id: string;
        email?: string;
    };
    req?: {
        nextUrl?: {
            protocol: string;
            host: string;
        };
    };
}
