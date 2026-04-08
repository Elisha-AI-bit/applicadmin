import React, { useState } from 'react';
import { createAdminUser, createDefaultAdmin, createAdminUsers, type AdminUser } from '../lib/adminService';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Shield, UserPlus, Users, CheckCircle, AlertCircle } from 'lucide-react';

export const AdminManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [createdAdmins, setCreatedAdmins] = useState<AdminUser[]>([]);
  
  // Form state for single admin
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    department: '',
    phone: ''
  });

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    clearMessages();
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    clearMessages();

    try {
      const admin = await createAdminUser(
        formData.email,
        formData.password,
        formData.firstName,
        formData.lastName,
        {
          department: formData.department || undefined,
          phone: formData.phone || undefined
        }
      );
      
      setCreatedAdmins(prev => [...prev, admin]);
      setSuccess(`Admin user "${admin.email}" created successfully!`);
      
      // Reset form
      setFormData({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        department: '',
        phone: ''
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create admin user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateDefaultAdmin = async () => {
    setIsLoading(true);
    clearMessages();

    try {
      const admin = await createDefaultAdmin();
      setCreatedAdmins(prev => [...prev, admin]);
      setSuccess('Default admin user created successfully!');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create default admin');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMultipleAdmins = async () => {
    setIsLoading(true);
    clearMessages();

    const sampleAdmins = [
      {
        email: 'john.admin@schoolapp.com',
        password: 'admin123456',
        firstName: 'John',
        lastName: 'Admin',
        department: 'Academic Affairs'
      },
      {
        email: 'sarah.admin@schoolapp.com',
        password: 'admin123456',
        firstName: 'Sarah',
        lastName: 'Administrator',
        department: 'Student Services'
      },
      {
        email: 'mike.admin@schoolapp.com',
        password: 'admin123456',
        firstName: 'Mike',
        lastName: 'Admin',
        department: 'Finance'
      }
    ];

    try {
      const admins = await createAdminUsers(sampleAdmins);
      setCreatedAdmins(prev => [...prev, ...admins]);
      setSuccess(`${admins.length} admin users created successfully!`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create multiple admins');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Admin User Management</h1>
          <p className="text-muted-foreground">Create and manage administrative users</p>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Quick Admin Creation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Default Admin User</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Email: admin@schoolapp.com<br />
                Password: admin123456
              </p>
              <Button 
                onClick={handleCreateDefaultAdmin}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Creating...' : 'Create Default Admin'}
              </Button>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Sample Admin Users</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Create 3 sample admin users for testing
              </p>
              <Button 
                onClick={handleCreateMultipleAdmins}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? 'Creating...' : 'Create Sample Admins'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Create Custom Admin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
                />
                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
                />
              </div>
              
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
              
              <Input
                type="password"
                placeholder="Password (min 6 chars)"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
                minLength={6}
              />
              
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="Department (optional)"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                />
                <Input
                  placeholder="Phone (optional)"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Creating Admin...' : 'Create Admin User'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Created Admins List */}
      {createdAdmins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Created Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {createdAdmins.map((admin) => (
                <div key={admin.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{admin.firstName} {admin.lastName}</p>
                      <p className="text-sm text-muted-foreground">{admin.email}</p>
                      {admin.department && (
                        <p className="text-xs text-muted-foreground">{admin.department}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default">Admin</Badge>
                    <Badge variant="secondary">{admin.permissions.length} permissions</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Permissions Info */}
      <Card>
        <CardHeader>
          <CardTitle>Admin Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {[
              'read', 'write', 'delete', 'manage_users', 'manage_schools',
              'manage_programs', 'manage_applications', 'manage_payments',
              'manage_settings', 'view_reports', 'export_data'
            ].map((permission) => (
              <Badge key={permission} variant="outline" className="justify-center">
                {permission.replace('_', ' ').toUpperCase()}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
