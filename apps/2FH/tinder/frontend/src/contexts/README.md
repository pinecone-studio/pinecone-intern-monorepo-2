# Authentication Context

This directory contains the authentication context and provider for the Tinder application.

## Files

- `AuthContext.tsx` - Defines the authentication context interface and hook
- `README.md` - This documentation file

## Usage

### 1. AuthProvider Setup

The `AuthProvider` is already integrated into the app layout and wraps all components. It provides:

- User authentication state
- JWT token management
- Login/logout functionality
- Persistent storage (localStorage)

### 2. Using the Auth Context

In any component, you can access the authentication state using the `useAuth` hook:

```tsx
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, token, isAuthenticated, login, logout, updateUser } = useAuth();

  // Access user information
  console.log('User:', user);
  console.log('Token:', token);
  console.log('Is authenticated:', isAuthenticated);

  // Login a user
  const handleLogin = () => {
    const userData = {
      id: '123',
      email: 'user@example.com',
      name: 'John Doe',
      avatar: 'https://example.com/avatar.jpg'
    };
    const userToken = 'jwt-token-here';
    
    login(userData, userToken);
  };

  // Logout
  const handleLogout = () => {
    logout();
  };

  // Update user information
  const handleUpdateUser = () => {
    updateUser({ name: 'New Name' });
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.name}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
    </div>
  );
};
```

### 3. User Interface

The `User` interface includes:

```tsx
interface User {
  id: string;           // Unique user identifier
  email: string;        // User's email address
  name?: string;        // User's display name (optional)
  avatar?: string;      // User's avatar URL (optional)
}
```

### 4. AuthContext Methods

- `login(user: User, token: string)` - Logs in a user with their data and JWT token
- `logout()` - Logs out the current user and clears stored data
- `updateUser(userData: Partial<User>)` - Updates the current user's information
- `user: User | null` - Current user data
- `token: string | null` - Current JWT token
- `isAuthenticated: boolean` - Whether the user is currently authenticated

### 5. Persistence

The authentication state is automatically persisted to localStorage and restored when the app loads. The stored data includes:

- User information (stored as JSON)
- JWT token (stored as string)

### 6. Error Handling

The AuthProvider includes error handling for corrupted localStorage data and will automatically clear invalid data on initialization.

## Example Component

See `src/components/auth/AuthExample.tsx` for a complete example of how to use the authentication context.