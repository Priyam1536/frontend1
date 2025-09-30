import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Mail, Shield, MoreHorizontal, Search, Filter, Edit, Trash2, Crown, User } from 'lucide-react';
import { teamAPI } from '../utils/api';

const TeamManagement = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inviteForm, setInviteForm] = useState({ email: '', role: 'Viewer', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rolePermissions = {
    Admin: ['Full Access', 'User Management', 'System Settings', 'Export Data'],
    Analyst: ['Create Reports', 'View All Data', 'Export Data'],
    Collaborator: ['View Shared Projects', 'Comment', 'Basic Export'],
    Viewer: ['View Only', 'Basic Reports']
  };

  // Fetch team members and invitations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (activeTab === 'team' || activeTab === '') {
          const members = await teamAPI.getMembers();
          setTeamMembers(members);
        } else if (activeTab === 'invitations') {
          const invitations = await teamAPI.getInvitations();
          setPendingInvitations(invitations);
        }
      } catch (error) {
        console.error('Error fetching team data:', error);
        setError('Failed to load team data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Handle tab change with data fetching
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Handle form input change
  const handleInviteInputChange = (e) => {
    const { name, value } = e.target;
    setInviteForm({ ...inviteForm, [name]: value });
  };

  // Send invitation
  const handleSendInvite = async () => {
    try {
      setIsSubmitting(true);
      const { email, role, message } = inviteForm;
      
      const result = await teamAPI.inviteMember(email, role, message);
      
      // Add new invitation to the list
      setPendingInvitations([...pendingInvitations, result.invitation]);
      
      // Reset form and close modal
      setInviteForm({ email: '', role: 'Viewer', message: '' });
      setShowInviteModal(false);
      
      // Show success message (you could implement a toast notification here)
      alert('Invitation sent successfully');
    } catch (error) {
      console.error('Error sending invitation:', error);
      alert(`Failed to send invitation: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Resend invitation
  const handleResendInvitation = async (invitationId) => {
    try {
      await teamAPI.resendInvitation(invitationId);
      
      // Refresh invitations list
      const updatedInvitations = await teamAPI.getInvitations();
      setPendingInvitations(updatedInvitations);
      
      alert('Invitation resent successfully');
    } catch (error) {
      console.error('Error resending invitation:', error);
      alert(`Failed to resend invitation: ${error.message}`);
    }
  };

  // Cancel invitation
  const handleCancelInvitation = async (invitationId) => {
    try {
      if (window.confirm('Are you sure you want to cancel this invitation?')) {
        await teamAPI.cancelInvitation(invitationId);
        
        // Remove from list
        setPendingInvitations(pendingInvitations.filter(inv => inv.id !== invitationId));
        
        alert('Invitation cancelled successfully');
      }
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      alert(`Failed to cancel invitation: ${error.message}`);
    }
  };

  // Update team member role or status
  const handleUpdateMember = async (memberId, updates) => {
    try {
      await teamAPI.updateMember(memberId, updates);
      
      // Update local state
      setTeamMembers(teamMembers.map(member => 
        member.id === memberId ? { ...member, ...updates } : member
      ));
      
      alert('Team member updated successfully');
    } catch (error) {
      console.error('Error updating team member:', error);
      alert(`Failed to update team member: ${error.message}`);
    }
  };

  // Remove team member
  const handleRemoveMember = async (memberId) => {
    try {
      if (window.confirm('Are you sure you want to remove this team member?')) {
        await teamAPI.removeMember(memberId);
        
        // Remove from list
        setTeamMembers(teamMembers.filter(member => member.id !== memberId));
        
        alert('Team member removed successfully');
      }
    } catch (error) {
      console.error('Error removing team member:', error);
      alert(`Failed to remove team member: ${error.message}`);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'Admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'Analyst':
        return <Shield className="w-4 h-4 text-blue-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      Active: 'bg-green-100 text-green-800',
      Inactive: 'bg-gray-100 text-gray-800',
      Pending: 'bg-yellow-100 text-yellow-800',
      Expired: 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status}
      </span>
    );
  };

  // Format date to "X time ago" format
  const formatLastActive = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} minutes ago`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours} hours ago`;
    } else {
      const days = Math.floor(diffMins / 1440);
      return `${days} days ago`;
    }
  };

  // Filter team members based on search term
  const filteredTeamMembers = teamMembers.filter(member => {
    return (
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Filter invitations based on search term
  const filteredInvitations = pendingInvitations.filter(invitation => {
    return (
      invitation.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const InviteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Invite Team Member</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={inviteForm.email}
              onChange={handleInviteInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="colleague@company.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select 
              name="role"
              value={inviteForm.role}
              onChange={handleInviteInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Viewer">Viewer</option>
              <option value="Collaborator">Collaborator</option>
              <option value="Analyst">Analyst</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message (Optional)</label>
            <textarea
              name="message"
              value={inviteForm.message}
              onChange={handleInviteInputChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a personal message..."
            />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setShowInviteModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleSendInvite}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={!inviteForm.email || isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Invite'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-full overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-600 mt-1">Manage users, collaborators, and permissions</p>
          </div>
          <button
            onClick={() => setShowInviteModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => handleTabChange('team')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'team'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Team Members ({teamMembers.length})
            </button>
            <button
              onClick={() => handleTabChange('invitations')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'invitations'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Pending Invitations ({pendingInvitations.length})
            </button>
            <button
              onClick={() => handleTabChange('roles')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'roles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Roles & Permissions
            </button>
          </nav>
        </div>
      </div>

      {/* Search and Filter */}
      {activeTab !== 'roles' && (
        <div className="mb-6 flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      )}

      {/* Loading and Error States */}
      {loading && (
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Team Members Tab */}
      {activeTab === 'team' && !loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            {filteredTeamMembers.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Member</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Role</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Last Active</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Projects</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTeamMembers.map((member) => (
                    <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-medium">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {getRoleIcon(member.role)}
                          <span>{member.role}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{getStatusBadge(member.status)}</td>
                      <td className="py-4 px-6 text-gray-600">{formatLastActive(member.lastActive)}</td>
                      <td className="py-4 px-6 text-gray-600">{member.projects}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => {
                              const newRole = prompt("Enter new role (Admin, Analyst, Collaborator, Viewer):", member.role);
                              if (newRole && ['Admin', 'Analyst', 'Collaborator', 'Viewer'].includes(newRole)) {
                                handleUpdateMember(member.id, { role: newRole });
                              }
                            }}
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => handleRemoveMember(member.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <MoreHorizontal className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No team members match your search.' : 'No team members found. Invite someone to get started!'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Pending Invitations Tab */}
      {activeTab === 'invitations' && !loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            {filteredInvitations.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Email</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Role</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Invited By</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Date</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Status</th>
                    <th className="text-left py-3 px-6 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvitations.map((invitation) => (
                    <tr key={invitation.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <span className="font-medium">{invitation.email}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">{invitation.role}</td>
                      <td className="py-4 px-6 text-gray-600">{invitation.invitedBy}</td>
                      <td className="py-4 px-6 text-gray-600">{invitation.invitedDate}</td>
                      <td className="py-4 px-6">{getStatusBadge(invitation.status)}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button 
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                            onClick={() => handleResendInvitation(invitation.id)}
                            disabled={invitation.status !== 'Expired' && invitation.status !== 'Pending'}
                          >
                            Resend
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                            onClick={() => handleCancelInvitation(invitation.id)}
                          >
                            Cancel
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No invitations match your search.' : 'No pending invitations.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Roles & Permissions Tab */}
      {activeTab === 'roles' && !loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(rolePermissions).map(([role, permissions]) => (
            <div key={role} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-4">
                {getRoleIcon(role)}
                <h3 className="text-lg font-semibold text-gray-900">{role}</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">Permissions:</p>
                {permissions.map((permission, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{permission}</span>
                  </div>
                ))}
              </div>
              <button className="mt-4 w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                Edit Permissions
              </button>
            </div>
          ))}
        </div>
      )}

      {showInviteModal && <InviteModal />}
    </div>
  );
};

export default TeamManagement;