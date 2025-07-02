import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';
import { Link } from 'react-router-dom';
import { User, Mail, Calendar, Edit, Activity, Car, MessageSquare, Wrench, AlertTriangle, CheckCircle } from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  vehicles_count: number;
  created_at: string;
  updated_at: string;
}

interface UserStats {
  diagnosticsCount: number;
  communityPosts: number;
  joinedDate: string;
  lastActive: string;
}

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
      fetchUserStats();
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
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile information');
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
            avatar_url: null
          }
        ])
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error('Error creating profile:', error);
      setError('Failed to create profile');
    }
  };

  const fetchUserStats = async () => {
    if (!currentUser) return;

    try {
      // Fetch actual diagnostic count
      const { count: diagnosticsCount, error: diagnosticsError } = await supabase
        .from('diagnostic_issues')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.id);

      if (diagnosticsError) {
        console.error('Error fetching diagnostics count:', diagnosticsError);
      }

      // Fetch actual community posts count
      const { count: communityPostsCount, error: postsError } = await supabase
        .from('community_posts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', currentUser.id);

      if (postsError) {
        console.error('Error fetching community posts count:', postsError);
      }

      const actualStats: UserStats = {
        diagnosticsCount: diagnosticsCount || 0,
        communityPosts: communityPostsCount || 0,
        joinedDate: currentUser.created_at || new Date().toISOString(),
        lastActive: new Date().toISOString()
      };
      setStats(actualStats);
    } catch (error: any) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getDisplayName = () => {
    return profile?.display_name || currentUser?.email?.split('@')[0] || 'User';
  };

  const getUserInitials = () => {
    const name = getDisplayName();
    return name.substring(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h3 className="text-lg font-semibold text-red-800">Error Loading Profile</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-32"></div>
        <div className="relative px-6 pb-6">
          <div className="flex items-end space-x-6 -mt-16">
            {/* Profile Avatar */}
            <div className="relative">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <span className="text-white text-3xl font-bold">{getUserInitials()}</span>
                </div>
              )}
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{getDisplayName()}</h1>
                  <p className="text-gray-600 flex items-center mt-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {currentUser?.email}
                  </p>
                  <p className="text-gray-500 flex items-center mt-1">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {formatDate(stats?.joinedDate || new Date().toISOString())}
                  </p>
                </div>
                <Link
                  to="/profile/edit"
                  className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Diagnostics Run</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.diagnosticsCount || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Community Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.communityPosts || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Car className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Vehicles</p>
              <p className="text-2xl font-bold text-gray-900">{profile?.vehicles_count || 1}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Activity className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Status</p>
              <p className="text-sm font-medium text-green-600 flex items-center">
                <CheckCircle className="h-4 w-4 mr-1" />
                Active
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      

      {/* Account Information */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">Profile Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Display Name:</span>
                <span className="text-gray-900">{getDisplayName()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="text-gray-900">{currentUser?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Vehicles:</span>
                <span className="text-gray-900">{profile?.vehicles_count || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since:</span>
                <span className="text-gray-900">{formatDate(stats?.joinedDate || new Date().toISOString())}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated:</span>
                <span className="text-gray-900">{formatDate(profile?.updated_at || new Date().toISOString())}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-2">Account Status</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Account Type:</span>
                <span className="text-gray-900">Free</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email Verified:</span>
                <span className="text-green-600 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verified
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Two-Factor Auth:</span>
                <span className="text-gray-500">Not Enabled</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Login:</span>
                <span className="text-gray-900">Today</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;