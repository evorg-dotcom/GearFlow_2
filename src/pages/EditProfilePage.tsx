import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Save, ArrowLeft, Upload, AlertTriangle, CheckCircle, Camera, Car } from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  vehicles_count: number;
}

const EditProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [vehiclesCount, setVehiclesCount] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .single();

      if (error) {
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') {
          await createProfile();
        } else {
          throw error;
        }
      } else {
        setProfile(data);
        setDisplayName(data.display_name || currentUser.email?.split('@')[0] || '');
        setAvatarUrl(data.avatar_url || '');
        setVehiclesCount(data.vehicles_count || 1);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile information');
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async () => {
    if (!currentUser) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: currentUser.id,
            display_name: currentUser.email?.split('@')[0] || 'User',
            avatar_url: null,
            vehicles_count: 1
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      setDisplayName(data.display_name || '');
      setAvatarUrl(data.avatar_url || '');
      setVehiclesCount(data.vehicles_count || 1);
    } catch (error: any) {
      console.error('Error creating profile:', error);
      setError('Failed to create profile');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !profile) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          display_name: displayName.trim() || null,
          avatar_url: avatarUrl.trim() || null,
          vehicles_count: vehiclesCount,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', currentUser.id);

      if (error) throw error;

      setSuccess('Profile updated successfully!');
      
      // Redirect to profile page after a short delay
      setTimeout(() => {
        navigate('/profile');
      }, 1500);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/profile');
  };

  const getUserInitials = () => {
    const name = displayName || currentUser?.email?.split('@')[0] || 'User';
    return name.substring(0, 2).toUpperCase();
  };

  const validateDisplayName = (name: string) => {
    if (name.length > 50) {
      return 'Display name must be 50 characters or less';
    }
    if (name.trim().length === 0) {
      return 'Display name cannot be empty';
    }
    return '';
  };

  const validateAvatarUrl = (url: string) => {
    if (url && !url.match(/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i)) {
      return 'Please enter a valid image URL (jpg, jpeg, png, gif, webp)';
    }
    return '';
  };

  const validateVehiclesCount = (count: number) => {
    if (count < 1) {
      return 'Vehicle count must be at least 1';
    }
    if (count > 50) {
      return 'Vehicle count cannot exceed 50';
    }
    if (!Number.isInteger(count)) {
      return 'Vehicle count must be a whole number';
    }
    return '';
  };
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={handleCancel}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-4 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Profile
        </button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Profile</h1>
        <p className="text-gray-600 mt-2">Update your profile information and preferences.</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400 mr-3" />
                <p className="text-green-800">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-red-400 mr-3" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="flex items-center space-x-6">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  onError={(e) => {
                    // If image fails to load, show initials instead
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <div className={`w-24 h-24 rounded-full border-4 border-gray-200 bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center ${avatarUrl ? 'hidden' : ''}`}>
                <span className="text-white text-xl font-bold">{getUserInitials()}</span>
              </div>
              <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-lg">
                <Camera className="h-4 w-4 text-gray-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900">Profile Picture</h3>
              <p className="text-sm text-gray-600">Add a photo to personalize your profile</p>
            </div>
          </div>

          {/* Avatar URL Input */}
          <div>
            <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Profile Picture URL (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Upload className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="url"
                id="avatarUrl"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="https://example.com/your-photo.jpg"
              />
            </div>
            {avatarUrl && validateAvatarUrl(avatarUrl) && (
              <p className="mt-1 text-sm text-red-600">{validateAvatarUrl(avatarUrl)}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              Enter a direct link to an image file (JPG, PNG, GIF, WebP)
            </p>
          </div>

          {/* Display Name */}
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-2">
              Display Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="displayName"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter your display name"
                maxLength={50}
              />
            </div>
            {displayName && validateDisplayName(displayName) && (
              <p className="mt-1 text-sm text-red-600">{validateDisplayName(displayName)}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              This is how your name will appear to other users. ({50 - displayName.length} characters remaining)
            </p>
          </div>

          {/* Vehicles Count */}
          <div>
            <label htmlFor="vehiclesCount" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Vehicles *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Car className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="vehiclesCount"
                required
                min="1"
                max="50"
                value={vehiclesCount}
                onChange={(e) => setVehiclesCount(parseInt(e.target.value) || 1)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Enter number of vehicles"
              />
            </div>
            {validateVehiclesCount(vehiclesCount) && (
              <p className="mt-1 text-sm text-red-600">{validateVehiclesCount(vehiclesCount)}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              How many vehicles do you own or work on? This helps us personalize your experience.
            </p>
          </div>
          {/* Email (Read-only) */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Email address cannot be changed here. Go to Account Settings to update your email.
            </p>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="px-6 py-3 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || !!validateDisplayName(displayName) || !!validateAvatarUrl(avatarUrl) || !!validateVehiclesCount(vehiclesCount)}
              className="px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;