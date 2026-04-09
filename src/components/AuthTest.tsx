import React, { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';

export const AuthTest: React.FC = () => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('test123456');
  const [firstName, setFirstName] = useState('Test');
  const [lastName, setLastName] = useState('User');
  const [isRegistering, setIsRegistering] = useState(false);
  
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    userFriendlyError,
    login, 
    register, 
    logout, 
    createTestUser,
    clearError 
  } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    try {
      if (isRegistering) {
        await register(email, password, firstName, lastName, 'admin');
      } else {
        await login(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  };

  const handleCreateTestUser = async () => {
    clearError();
    await createTestUser();
  };

  if (isAuthenticated && user) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user.firstName}!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Role:</strong> {user.role}</p>
              <p><strong>Permissions:</strong> {user.permissions?.join(', ')}</p>
            </div>
            <Button onClick={logout} variant="outline" className="w-full">
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{isRegistering ? 'Register' : 'Login'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {userFriendlyError && (
            <Alert variant="destructive">
              <AlertDescription>{userFriendlyError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegistering && (
              <>
                <Input
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <Input
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </>
            )}
            
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Loading...' : (isRegistering ? 'Register' : 'Login')}
            </Button>
          </form>
          
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRegistering(!isRegistering)}
              className="w-full"
            >
              {isRegistering ? 'Already have an account? Login' : "Don't have an account? Register"}
            </Button>
            
            <Button
              type="button"
              variant="secondary"
              onClick={handleCreateTestUser}
              disabled={isLoading}
              className="w-full"
            >
              Create Test User (test@example.com / test123456)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
