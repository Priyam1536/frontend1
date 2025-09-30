import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Camera, Edit, Save, X, Bell, Shield, Globe, Palette, Loader, AlertCircle } from 'lucide-react';
import { userAPI } from '../utils/api';
import { useNotification } from './NotificationSystem.jsx';

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError } = useNotification();
  
  // Default profile data structure
  const defaultProfileData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    department: '',
    position: '',
    joinDate: '',
    bio: '',
    avatar: ''
  };

  const defaultPreferences = {
    notifications: {
      emailAlerts: true,
      pushNotifications: false,
      weeklyReports: true,
      projectUpdates: true,
      teamNotifications: false
    },
    display: {
      theme: 'light',
      language: 'en',
      timezone: 'America/Los_Angeles',
      dateFormat: 'MM/DD/YYYY',
      numberFormat: 'US'
    },
    privacy: {
      profileVisibility: 'team',
      activitySharing: true,
      dataSharing: false,
      twoFactorAuth: false
    }
  };

  const [profileData, setProfileData] = useState(defaultProfileData);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [tempData, setTempData] = useState(defaultProfileData);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  // Fetch profile data from backend
  useEffect(() => {
    async function fetchProfileData() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await userAPI.getProfile();
        
        if (response.success) {
          setProfileData(response.profileData);
          setPreferences(response.profileData.preferences || defaultPreferences);
          setTempData(response.profileData);
        } else {
          setError('Failed to load profile data');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setError('Failed to load profile data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchProfileData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setTempData({ ...profileData });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // Include preferences in the update
      const updatedData = {
        ...tempData,
        preferences: preferences
      };
      
      const response = await userAPI.updateProfile(updatedData);
      
      if (response.success) {
        setProfileData(response.profileData);
        setIsEditing(false);
        showSuccess('Profile updated successfully');
      } else {
        setError('Failed to update profile');
        showError('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.message || 'Failed to update profile');
      showError(error.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (category, field, value) => {
    setPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user types
    setPasswordError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setPasswordError('All fields are required');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setIsSaving(true);
      setPasswordError('');
      
      const response = await userAPI.updatePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );
      
      if (response.success) {
        showSuccess('Password updated successfully');
        // Reset form
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        setPasswordError(response.message || 'Failed to update password');
        showError(response.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError(error.message || 'Failed to update password');
      showError(error.message || 'Failed to update password');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile Information', icon: User },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'activity', label: 'Activity History', icon: Calendar }
  ];

  const ActivityHistory = () => {
    // This could be fetched from the backend in the future
    const activities = [
      { date: '2024-01-20', action: 'Created LCA report for Aluminum Production', type: 'report' },
      { date: '2024-01-19', action: 'Updated team parameters for Mining Operations', type: 'parameter' },
      { date: '2024-01-18', action: 'Invited new team member: Bob Smith', type: 'team' },
      { date: '2024-01-17', action: 'Exported environmental impact analysis', type: 'export' },
      { date: '2024-01-16', action: 'Completed LCA comparison for Steel vs Aluminum', type: 'analysis' }
    ];

    return (
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">{activity.action}</p>
              <p className="text-sm text-gray-500">{activity.date}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              activity.type === 'report' ? 'bg-blue-100 text-blue-800' :
              activity.type === 'parameter' ? 'bg-green-100 text-green-800' :
              activity.type === 'team' ? 'bg-purple-100 text-purple-800' :
              activity.type === 'export' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {activity.type}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <Loader className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading profile data...</p>
      </div>
    );
  }

  // Show error state
  if (error && !profileData.firstName) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-screen">
        <AlertCircle className="w-10 h-10 text-red-500 mb-4" />
        <p className="text-red-600 font-medium mb-2">Error loading profile</p>
        <p className="text-gray-600">{error}</p>
        <button 
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Profile & Preferences</h1>
        <p className="text-gray-600 mt-1">Manage your personal information, preferences, and account settings</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Card */}
        <div className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profileData.avatar || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-gray-600">{profileData.position}</p>
              <p className="text-sm text-gray-500 mt-1">{profileData.department}</p>
            </div>
            
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{profileData.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{profileData.phone || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{profileData.location || 'Not set'}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Joined {profileData.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            
            {/* Profile Information Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
                  {!isEditing ? (
                    <button
                      onClick={handleEdit}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={isSaving}
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Save Changes
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                    <p className="flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      value={isEditing ? tempData.firstName : profileData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      disabled={!isEditing || isSaving}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      value={isEditing ? tempData.lastName : profileData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      disabled={!isEditing || isSaving}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={isEditing ? tempData.email : profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      disabled={!isEditing || isSaving}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={isEditing ? tempData.phone : profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      disabled={!isEditing || isSaving}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={isEditing ? tempData.location : profileData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      disabled={!isEditing || isSaving}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                    <input
                      type="text"
                      value={isEditing ? tempData.position : profileData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      disabled={!isEditing || isSaving}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      rows="3"
                      value={isEditing ? tempData.bio : profileData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      disabled={!isEditing || isSaving}
                      className={`w-full px-3 py-2 border rounded-lg ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h3>
                
                <div className="space-y-8">
                  {/* Notifications */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Bell className="w-4 h-4" />
                      Notifications
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(preferences.notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between py-2">
                          <span className="text-sm text-gray-700">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={value}
                              onChange={(e) => handlePreferenceChange('notifications', key, e.target.checked)}
                              className="sr-only peer"
                              disabled={isSaving}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 disabled:opacity-50"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Display */}
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Display Settings
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                        <select
                          value={preferences.display.theme}
                          onChange={(e) => handlePreferenceChange('display', 'theme', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isSaving}
                        >
                          <option value="light">Light</option>
                          <option value="dark">Dark</option>
                          <option value="auto">Auto</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                        <select
                          value={preferences.display.language}
                          onChange={(e) => handlePreferenceChange('display', 'language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isSaving}
                        >
                          <option value="en">English</option>
                          <option value="es">Spanish</option>
                          <option value="fr">French</option>
                          <option value="de">German</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  {/* Save button for preferences */}
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Preferences
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Security & Privacy</h3>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600 mb-4">Add an extra layer of security to your account</p>
                    <button 
                      className={`px-4 py-2 ${preferences.privacy.twoFactorAuth ? 'bg-green-600' : 'bg-blue-600'} text-white rounded-lg hover:${preferences.privacy.twoFactorAuth ? 'bg-green-700' : 'bg-blue-700'} transition-colors`}
                      onClick={() => handlePreferenceChange('privacy', 'twoFactorAuth', !preferences.privacy.twoFactorAuth)}
                    >
                      {preferences.privacy.twoFactorAuth ? 'Enabled' : 'Enable 2FA'}
                    </button>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Change Password</h4>
                    <p className="text-sm text-gray-600 mb-4">Update your account password regularly</p>
                    
                    {passwordError && (
                      <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
                        <p className="text-sm">{passwordError}</p>
                      </div>
                    )}
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isSaving}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isSaving}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          disabled={isSaving}
                        />
                      </div>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Change Password'
                        )}
                      </button>
                    </form>
                  </div>
                  
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Privacy Settings</h4>
                    <div className="space-y-3 mt-4">
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700">Profile Visibility</span>
                        <select
                          value={preferences.privacy.profileVisibility}
                          onChange={(e) => handlePreferenceChange('privacy', 'profileVisibility', e.target.value)}
                          className="px-3 py-2 border border-gray-300 rounded-lg"
                          disabled={isSaving}
                        >
                          <option value="public">Public</option>
                          <option value="team">Team Only</option>
                          <option value="private">Private</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700">Activity Sharing</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.privacy.activitySharing}
                            onChange={(e) => handlePreferenceChange('privacy', 'activitySharing', e.target.checked)}
                            className="sr-only peer"
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-700">Data Sharing for Analytics</span>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={preferences.privacy.dataSharing}
                            onChange={(e) => handlePreferenceChange('privacy', 'dataSharing', e.target.checked)}
                            className="sr-only peer"
                            disabled={isSaving}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleSave}
                      className="mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Privacy Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Activity History</h3>
                <ActivityHistory />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;