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
  CheckCircle2,
  Compass,
  Home,
  LogOut,
  Sliders,
  CheckCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import profileService from '../services/profileService';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/common/Card';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import Input from '../components/common/Input';
import Alert from '../components/common/Alert';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();

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
          setInterestsError('Unable to load interest tags. Please check database connection.');
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
        setProfileSuccess('Profile display name updated successfully in Supabase.');
      }
    } catch (err) {
      setProfileError(err.message || 'Failed to update profile.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const toggleInterest = (tagId) => {
    setSelectedInterestIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
    setInterestsSuccess(null);
  };

  const handleInterestsSubmit = async () => {
    setInterestsSuccess(null);
    setInterestsError(null);
    setIsUpdatingInterests(true);

    try {
      const response = await profileService.updateUserInterests(selectedInterestIds);
      if (response?.success) {
        setInterestsSuccess(`Saved ${selectedInterestIds.length} personalized interest preference${selectedInterestIds.length === 1 ? '' : 's'}.`);
      }
    } catch (err) {
      setInterestsError(err.message || 'Failed to save interest preferences.');
    } finally {
      setIsUpdatingInterests(false);
    }
  };

  const outdoorInterests = allInterests.filter((t) => t.category === 'OUTDOOR');
  const indoorInterests = allInterests.filter((t) => t.category === 'INDOOR');

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Profile Identity Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-low/80 backdrop-blur-2xl border border-white/10 shadow-glass flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary-container text-white flex items-center justify-center font-bold text-2xl shadow-glow">
            {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold font-display text-on-surface tracking-tight">
                {user?.displayName || 'User Profile'}
              </h1>
              <Badge variant={user?.role === 'ADMIN' ? 'caution' : 'primary'} size="sm">
                {user?.role || 'USER'}
              </Badge>
            </div>
            <p className="text-sm text-outline font-medium">{user?.email}</p>
            <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1">
              <Calendar className="w-3.5 h-3.5 text-tertiary" />
              <span>Member Account • Supabase PostgreSQL Verified</span>
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          icon={LogOut}
          onClick={logout}
          className="text-error border-error/30 hover:bg-error-container/20"
        >
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column (5 cols): Profile Settings Form */}
        <div className="md:col-span-5 space-y-6">
          <Card className="border-white/10 shadow-glass">
            <CardHeader className="border-b border-white/5 bg-surface-container-low/40">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-primary" />
                Display Settings
              </CardTitle>
              <CardDescription>Modify your public profile identification name.</CardDescription>
            </CardHeader>

            <CardContent className="pt-6">
              <form onSubmit={handleProfileSubmit} className="space-y-4">
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

                <Input
                  label="Display Name"
                  id="profile-display-name"
                  type="text"
                  icon={User}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                  required
                />

                <Input
                  label="Account Email (Fixed)"
                  id="profile-email-fixed"
                  type="email"
                  icon={Mail}
                  value={user?.email || ''}
                  disabled
                  helperText="Primary email cannot be changed."
                />

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  icon={Save}
                  isLoading={isUpdatingProfile}
                  className="w-full mt-2"
                >
                  Save Profile Changes
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Account Security Card */}
          <Card className="border-white/10 shadow-glass">
            <CardHeader className="border-b border-white/5 bg-surface-container-low/40">
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4 text-optimal" />
                Security & Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs pt-4">
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-outline">Authentication Method</span>
                <span className="font-semibold text-on-surface">Application JWT + Bcrypt</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-white/5">
                <span className="text-outline">Database Storage</span>
                <span className="font-semibold text-optimal">Supabase PostgreSQL (SSL)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-outline">Access Guard</span>
                <span className="font-semibold text-primary">Role Based ({user?.role})</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column (7 cols): Activity Interest Preferences */}
        <div className="md:col-span-7 space-y-6">
          <Card className="border-white/10 shadow-glass">
            <CardHeader className="border-b border-white/5 bg-surface-container-low/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-tertiary" />
                  Activity Interest Tags
                </CardTitle>
                <CardDescription>
                  Select your favorite pursuits to prioritize matching recommendations.
                </CardDescription>
              </div>

              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-tabular self-start sm:self-auto">
                {selectedInterestIds.length} Selected
              </span>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
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
                <div className="space-y-4">
                  <LoadingSkeleton variant="rectangle" count={3} />
                </div>
              ) : (
                <>
                  {/* Category 1: Outdoor Recreation */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 font-display">
                      <Compass className="w-3.5 h-3.5" /> Outdoor Recreation & Nature
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {outdoorInterests.map((tag) => {
                        const isSelected = selectedInterestIds.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleInterest(tag.id)}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all select-none border active:scale-95 shadow-specular-inset ${
                              isSelected
                                ? 'bg-primary-container text-on-primary-container border-primary shadow-glow font-semibold'
                                : 'bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border-white/10'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-outline'}`} />
                            <span>{tag.name}</span>
                            {isSelected && <Check className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category 2: Indoor Comforts */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5 font-display">
                      <Home className="w-3.5 h-3.5" /> Indoor Comforts & Cultural Pursuits
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {indoorInterests.map((tag) => {
                        const isSelected = selectedInterestIds.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleInterest(tag.id)}
                            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all select-none border active:scale-95 shadow-specular-inset ${
                              isSelected
                                ? 'bg-purple-500/30 text-purple-200 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)] font-semibold'
                                : 'bg-surface-container-high/60 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high border-white/10'
                            }`}
                          >
                            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-purple-300' : 'bg-outline'}`} />
                            <span>{tag.name}</span>
                            {isSelected && <Check className="w-3 h-3" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="bg-surface-container-lowest/70 border-t border-white/5 py-4 flex items-center justify-between">
              <span className="text-xs text-outline">
                {selectedInterestIds.length === 0
                  ? 'No interests selected'
                  : `${selectedInterestIds.length} preference${selectedInterestIds.length === 1 ? '' : 's'} staged`}
              </span>
              <Button
                variant="primary"
                size="sm"
                icon={CheckCheck}
                isLoading={isUpdatingInterests}
                onClick={handleInterestsSubmit}
              >
                Sync Preferences
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
