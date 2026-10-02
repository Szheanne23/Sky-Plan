import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Shield, 
  Calendar, 
  Tag, 
  Check, 
  Save, 
  RefreshCw, 
  Sun, 
  CloudRain, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import Spinner from '../components/common/Spinner';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(null);
  const [profileError, setProfileError] = useState(null);

  const [allInterests, setAllInterests] = useState([]);
  const [selectedInterestIds, setSelectedInterestIds] = useState([]);
  const [isLoadingInterests, setIsLoadingInterests] = useState(true);
  const [isUpdatingInterests, setIsUpdatingInterests] = useState(false);
  const [interestsSuccess, setInterestsSuccess] = useState(null);
  const [interestsError, setInterestsError] = useState(null);

  // Sync display name if user context updates
  useEffect(() => {
    if (user?.displayName) {
      setDisplayName(user.displayName);
    }
  }, [user]);

  // Load available system interest tags and user's currently selected tags
  useEffect(() => {
    let isMounted = true;

    async function loadInterests() {
      setIsLoadingInterests(true);
      try {
        const [allRes, userRes] = await Promise.all([
          profileService.getAllInterests(),
          profileService.getUserInterests(),
        ]);

        if (isMounted) {
          setAllInterests(allRes?.data?.interests || []);
          setSelectedInterestIds(userRes?.data?.selectedIds || []);
        }
      } catch (err) {
        if (isMounted) {
          setInterestsError('Unable to load interest tags. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingInterests(false);
        }
      }
    }

    loadInterests();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);

    if (!displayName.trim()) {
      setProfileError('Display name cannot be blank.');
      return;
    }

    setIsUpdatingProfile(true);
    try {
      const response = await profileService.updateProfile({ displayName: displayName.trim() });
      if (response?.success) {
        updateUser({ displayName: response.data.profile.display_name });
        setProfileSuccess('Profile information updated successfully.');
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const toggleInterest = (id) => {
    setSelectedInterestIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
    setInterestsSuccess(null);
  };

  const handleSaveInterests = async () => {
    setIsUpdatingInterests(true);
    setInterestsSuccess(null);
    setInterestsError(null);

    try {
      const response = await profileService.updateUserInterests(selectedInterestIds);
      if (response?.success) {
        setSelectedInterestIds(response.data.selectedIds || []);
        setInterestsSuccess('Your activity interest preferences have been saved.');
      }
    } catch (err) {
      setInterestsError(err.message || 'Failed to save interest preferences.');
    } finally {
      setIsUpdatingInterests(false);
    }
  };

  // Group interest tags by category
  const outdoorTags = allInterests.filter((t) => t.category === 'OUTDOOR');
  const indoorTags = allInterests.filter((t) => t.category === 'INDOOR');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-sky-800 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          <span>User Profile & Personalization</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Account & Activity Preferences</h1>
        <p className="text-sm text-slate-500">
          Manage your personal details and configure activity interest tags to customize your recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-sky-100 shadow-glass overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sky-50/70 via-white to-slate-50/70">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-sky-600" />
                Personal Profile
              </CardTitle>
              <CardDescription>Your registered identity</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {profileSuccess && (
                <Alert variant="success" onClose={() => setProfileSuccess(null)}>
                  {profileSuccess}
                </Alert>
              )}
              {profileError && (
                <Alert variant="error" onClose={() => setProfileError(null)}>
                  {profileError}
                </Alert>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <Input
                  label="Display Name"
                  id="profile-displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  icon={User}
                  disabled={isUpdatingProfile}
                />

                <Input
                  label="Email Address"
                  id="profile-email"
                  value={user?.email || ''}
                  icon={Mail}
                  disabled
                  helperText="Email cannot be changed."
                />

                <div className="space-y-1.5">
                  <label className="block text-sm font-medium text-slate-700">Account Role</label>
                  <div className="flex items-center gap-2">
                    <Badge variant={user?.role === 'ADMIN' ? 'warning' : 'primary'} size="md">
                      <Shield className="w-3.5 h-3.5" />
                      {user?.role || 'USER'}
                    </Badge>
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    className="w-full justify-center"
                    isLoading={isUpdatingProfile}
                    icon={Save}
                  >
                    Update Profile
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Activity Interest Preferences */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-sky-100 shadow-glass overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sky-50/70 via-white to-slate-50/70 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="w-4 h-4 text-sky-600" />
                  Activity Interest Tags
                </CardTitle>
                <CardDescription>
                  Select the activities you enjoy. The recommendation engine evaluates these against forecast conditions.
                </CardDescription>
              </div>

              <div className="flex items-center gap-2">
                <Badge variant="neutral">
                  {selectedInterestIds.length} Selected
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {interestsSuccess && (
                <Alert variant="success" onClose={() => setInterestsSuccess(null)}>
                  {interestsSuccess}
                </Alert>
              )}
              {interestsError && (
                <Alert variant="error" onClose={() => setInterestsError(null)}>
                  {interestsError}
                </Alert>
              )}

              {isLoadingInterests ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <Spinner size="lg" color="sky" />
                  <p className="text-xs font-medium text-slate-500">Loading available interest tags...</p>
                </div>
              ) : allInterests.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-sm">
                  No interest tags available at this time.
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Outdoor Category */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700">
                      <Sun className="w-4 h-4 text-teal-600" />
                      <span>Outdoor Recreation</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {outdoorTags.map((tag) => {
                        const isSelected = selectedInterestIds.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleInterest(tag.id)}
                            className={`p-3 rounded-xl text-left border transition-all duration-200 flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-teal-50/90 border-teal-300 ring-1 ring-teal-400 shadow-xs'
                                : 'bg-white/70 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <span className={`text-sm font-semibold block ${isSelected ? 'text-teal-950' : 'text-slate-800'}`}>
                                {tag.name}
                              </span>
                              <span className="text-xs text-slate-500 line-clamp-2">{tag.description}</span>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-teal-600 text-white' : 'border border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Indoor Category */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700">
                      <CloudRain className="w-4 h-4 text-indigo-600" />
                      <span>Indoor & Cultural Activities</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {indoorTags.map((tag) => {
                        const isSelected = selectedInterestIds.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleInterest(tag.id)}
                            className={`p-3 rounded-xl text-left border transition-all duration-200 flex items-start justify-between gap-3 ${
                              isSelected
                                ? 'bg-indigo-50/90 border-indigo-300 ring-1 ring-indigo-400 shadow-xs'
                                : 'bg-white/70 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/80'
                            }`}
                          >
                            <div className="space-y-0.5">
                              <span className={`text-sm font-semibold block ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                                {tag.name}
                              </span>
                              <span className="text-xs text-slate-500 line-clamp-2">{tag.description}</span>
                            </div>
                            <div
                              className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white'
                              }`}
                            >
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Changes take effect in recommendations immediately upon saving.
              </span>
              <Button
                variant="primary"
                size="md"
                onClick={handleSaveInterests}
                isLoading={isUpdatingInterests}
                disabled={isLoadingInterests}
                icon={Save}
              >
                Save Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
