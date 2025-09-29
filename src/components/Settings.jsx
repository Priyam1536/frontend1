import React, { useState } from 'react';
import { Settings, Database, Zap, Shield, Globe, Mail, Palette, HardDrive, Cloud, Key, AlertTriangle, CheckCircle, Save } from 'lucide-react';

const AppSettings = () => {
  const [activeSection, setActiveSection] = useState('general');
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      appName: 'OreSense AI',
      defaultLanguage: 'en',
      timezone: 'America/Los_Angeles',
      autoSave: true,
      sessionTimeout: 30,
      maxConcurrentUsers: 100
    },
    database: {
      connectionString: 'mongodb://localhost:27017/oresense',
      backupFrequency: 'daily',
      retentionPeriod: 365,
      enableReplication: true,
      connectionPoolSize: 10,
      queryTimeout: 30
    },
    api: {
      rateLimit: 1000,
      requestTimeout: 30,
      enableCaching: true,
      cacheExpirationTime: 3600,
      logLevel: 'info',
      enableAPIDocumentation: true
    },
    security: {
      passwordMinLength: 8,
      requireSpecialChars: true,
      sessionDuration: 24,
      enableTwoFactor: true,
      allowedDomains: ['oresense.ai', 'partner.com'],
      maxLoginAttempts: 3
    },
    email: {
      smtpServer: 'smtp.gmail.com',
      smtpPort: 587,
      enableTLS: true,
      senderEmail: 'noreply@oresense.ai',
      senderName: 'OreSense AI System',
      dailyEmailLimit: 1000
    },
    performance: {
      enableCompression: true,
      cacheStaticAssets: true,
      minifyResources: true,
      enableCDN: false,
      maxFileUploadSize: 50,
      concurrentConnections: 1000
    }
  });

  const sections = [
    { id: 'general', label: 'General Settings', icon: Settings },
    { id: 'database', label: 'Database Configuration', icon: Database },
    { id: 'api', label: 'API Settings', icon: Zap },
    { id: 'security', label: 'Security Policies', icon: Shield },
    { id: 'email', label: 'Email Configuration', icon: Mail },
    { id: 'performance', label: 'Performance Optimization', icon: HardDrive }
  ];

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
    setUnsavedChanges(true);
  };

  const saveSettings = () => {
    // Save settings logic
    console.log('Settings saved:', settings);
    setUnsavedChanges(false);
    // Show success message
  };

  const resetSection = () => {
    // Reset current section to defaults
    setUnsavedChanges(true);
  };

  const renderSettingInput = (section, key, value, config) => {
    const handleChange = (newValue) => handleSettingChange(section, key, newValue);

    switch (config.type) {
      case 'boolean':
        return (
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => handleChange(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm text-gray-700">
              {value ? 'Enabled' : 'Disabled'}
            </span>
          </label>
        );
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {config.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'number':
        return (
          <input
            type="number"
            value={value}
            min={config.min}
            max={config.max}
            onChange={(e) => handleChange(parseInt(e.target.value) || 0)}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
      case 'array':
        return (
          <textarea
            value={Array.isArray(value) ? value.join(', ') : value}
            onChange={(e) => handleChange(e.target.value.split(',').map(s => s.trim()))}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Enter comma-separated values"
          />
        );
      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        );
    }
  };

  const sectionConfigs = {
    general: [
      { key: 'appName', label: 'Application Name', type: 'text', description: 'Display name for the application' },
      { key: 'defaultLanguage', label: 'Default Language', type: 'select', options: [
        { value: 'en', label: 'English' },
        { value: 'es', label: 'Spanish' },
        { value: 'fr', label: 'French' }
      ], description: 'Default language for new users' },
      { key: 'timezone', label: 'Default Timezone', type: 'text', description: 'Default timezone for the application' },
      { key: 'autoSave', label: 'Auto Save', type: 'boolean', description: 'Automatically save user work' },
      { key: 'sessionTimeout', label: 'Session Timeout (minutes)', type: 'number', min: 5, max: 480, description: 'User session timeout duration' },
      { key: 'maxConcurrentUsers', label: 'Max Concurrent Users', type: 'number', min: 1, max: 10000, description: 'Maximum number of concurrent users' }
    ],
    database: [
      { key: 'connectionString', label: 'Connection String', type: 'text', description: 'Database connection string' },
      { key: 'backupFrequency', label: 'Backup Frequency', type: 'select', options: [
        { value: 'hourly', label: 'Hourly' },
        { value: 'daily', label: 'Daily' },
        { value: 'weekly', label: 'Weekly' }
      ], description: 'How often to backup the database' },
      { key: 'retentionPeriod', label: 'Retention Period (days)', type: 'number', min: 1, max: 3650, description: 'How long to keep backups' },
      { key: 'enableReplication', label: 'Enable Replication', type: 'boolean', description: 'Enable database replication' },
      { key: 'connectionPoolSize', label: 'Connection Pool Size', type: 'number', min: 1, max: 100, description: 'Maximum database connections' },
      { key: 'queryTimeout', label: 'Query Timeout (seconds)', type: 'number', min: 1, max: 300, description: 'Maximum query execution time' }
    ],
    api: [
      { key: 'rateLimit', label: 'Rate Limit (requests/hour)', type: 'number', min: 1, max: 100000, description: 'API request rate limit per user' },
      { key: 'requestTimeout', label: 'Request Timeout (seconds)', type: 'number', min: 1, max: 300, description: 'Maximum API request duration' },
      { key: 'enableCaching', label: 'Enable Caching', type: 'boolean', description: 'Cache API responses for better performance' },
      { key: 'cacheExpirationTime', label: 'Cache Expiration (seconds)', type: 'number', min: 60, max: 86400, description: 'How long to cache responses' },
      { key: 'logLevel', label: 'Log Level', type: 'select', options: [
        { value: 'error', label: 'Error Only' },
        { value: 'warn', label: 'Warning' },
        { value: 'info', label: 'Info' },
        { value: 'debug', label: 'Debug' }
      ], description: 'API logging verbosity' },
      { key: 'enableAPIDocumentation', label: 'Enable API Documentation', type: 'boolean', description: 'Provide API documentation endpoint' }
    ],
    security: [
      { key: 'passwordMinLength', label: 'Minimum Password Length', type: 'number', min: 6, max: 32, description: 'Minimum characters required for passwords' },
      { key: 'requireSpecialChars', label: 'Require Special Characters', type: 'boolean', description: 'Passwords must contain special characters' },
      { key: 'sessionDuration', label: 'Session Duration (hours)', type: 'number', min: 1, max: 168, description: 'How long user sessions remain active' },
      { key: 'enableTwoFactor', label: 'Enable Two-Factor Authentication', type: 'boolean', description: 'Require 2FA for all users' },
      { key: 'allowedDomains', label: 'Allowed Email Domains', type: 'array', description: 'Email domains allowed for registration' },
      { key: 'maxLoginAttempts', label: 'Max Login Attempts', type: 'number', min: 1, max: 10, description: 'Maximum failed login attempts before lockout' }
    ],
    email: [
      { key: 'smtpServer', label: 'SMTP Server', type: 'text', description: 'Email server hostname' },
      { key: 'smtpPort', label: 'SMTP Port', type: 'number', min: 1, max: 65535, description: 'Email server port number' },
      { key: 'enableTLS', label: 'Enable TLS/SSL', type: 'boolean', description: 'Use encrypted email connections' },
      { key: 'senderEmail', label: 'Sender Email Address', type: 'text', description: 'Default sender email address' },
      { key: 'senderName', label: 'Sender Name', type: 'text', description: 'Default sender display name' },
      { key: 'dailyEmailLimit', label: 'Daily Email Limit', type: 'number', min: 1, max: 100000, description: 'Maximum emails sent per day' }
    ],
    performance: [
      { key: 'enableCompression', label: 'Enable Compression', type: 'boolean', description: 'Compress responses to reduce bandwidth' },
      { key: 'cacheStaticAssets', label: 'Cache Static Assets', type: 'boolean', description: 'Cache CSS, JS, and image files' },
      { key: 'minifyResources', label: 'Minify Resources', type: 'boolean', description: 'Minify CSS and JavaScript files' },
      { key: 'enableCDN', label: 'Enable CDN', type: 'boolean', description: 'Use Content Delivery Network for static assets' },
      { key: 'maxFileUploadSize', label: 'Max File Upload Size (MB)', type: 'number', min: 1, max: 1000, description: 'Maximum file upload size' },
      { key: 'concurrentConnections', label: 'Max Concurrent Connections', type: 'number', min: 1, max: 10000, description: 'Maximum simultaneous connections' }
    ]
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Application Settings</h1>
            <p className="text-gray-600 mt-1">Configure system-wide settings and preferences</p>
          </div>
          <div className="flex gap-3">
            {unsavedChanges && (
              <div className="flex items-center gap-2 px-3 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">Unsaved changes</span>
              </div>
            )}
            <button
              onClick={resetSection}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Reset Section
            </button>
            <button
              onClick={saveSettings}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4" />
              Save All Settings
            </button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Settings Navigation */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <h3 className="text-sm font-medium text-gray-600 mb-3">Settings Categories</h3>
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              {React.createElement(sections.find(s => s.id === activeSection)?.icon || Settings, 
                { className: "w-5 h-5 text-blue-600" }
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                {sections.find(s => s.id === activeSection)?.label}
              </h2>
            </div>

            <div className="space-y-8">
              {sectionConfigs[activeSection]?.map((config) => (
                <div key={config.key} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-900 mb-1">
                      {config.label}
                    </label>
                    {config.description && (
                      <p className="text-sm text-gray-600 mb-3">{config.description}</p>
                    )}
                  </div>
                  {renderSettingInput(activeSection, config.key, settings[activeSection][config.key], config)}
                </div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">System Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">Database</p>
                  <p className="text-xs text-green-700">Connected</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-green-900">API Service</p>
                  <p className="text-xs text-green-700">Running</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Cloud className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Storage</p>
                  <p className="text-xs text-blue-700">78% Used</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettings;