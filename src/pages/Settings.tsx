
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';


import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "../components/ui/alert-dialog";
import { Toggle } from '../components/ui/toggle';

// =====================
// Settings Page Component
// =====================
const Settings: React.FC = () => {
  // ---------------------
  // State Management
  // ---------------------
  const [username, setUsername] = React.useState(() => localStorage.getItem('username') || '');
  const [password, setPassword] = React.useState('');
  const [pendingUsername, setPendingUsername] = React.useState<string | null>(null);
  const [pendingPassword, setPendingPassword] = React.useState<string | null>(null);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(() => localStorage.getItem('darkMode') === 'true');
  const [saveMessage, setSaveMessage] = React.useState('');
  const [dob, setDob] = React.useState(() => localStorage.getItem('dob') || '');
  const [activeTab, setActiveTab] = React.useState<'style' | 'account'>('style');
  const [activeStatus, setActiveStatus] = React.useState(() => {
    const stored = localStorage.getItem('activeStatus');
    return stored === null ? true : stored === 'true';
  });
  const tabRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const navigate = useNavigate();

  // ---------------------
  // Handlers
  // ---------------------
  // Keyboard navigation for tabs
  const handleTabKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      tabRefs.current[(idx + 1) % 2]?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      tabRefs.current[(idx + 1) % 2 === 0 ? 1 : 0]?.focus();
    }
  };

  // Save settings to localStorage
  // Save handler (with confirm dialog for username/password)
  const handleSave = (opts?: { username?: string; password?: string }) => {
    const newUsername = opts?.username ?? username;
    const newPassword = opts?.password ?? password;
    localStorage.setItem('username', newUsername);
    localStorage.setItem('darkMode', darkMode.toString());
    localStorage.setItem('activeStatus', activeStatus.toString());
    if (newPassword) {
      localStorage.setItem('password', newPassword); // Never store plain passwords in real apps!
    }
    if (dob) {
      localStorage.setItem('dob', dob);
    }
    setSaveMessage('Settings saved!');
    setTimeout(() => setSaveMessage(''), 2000);
    setPassword('');
  };

  // Intercept account form submit for username/password changes
  const handleAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const storedUsername = localStorage.getItem('username') || '';
    const storedPassword = localStorage.getItem('password') || '';
    const usernameChanged = username !== storedUsername;
    const passwordChanged = password && password !== storedPassword;
    if (usernameChanged || passwordChanged) {
      setPendingUsername(usernameChanged ? username : null);
      setPendingPassword(passwordChanged ? password : null);
      setShowConfirm(true);
    } else {
      handleSave();
    }
  };

  const handleConfirm = () => {
    handleSave({
      username: pendingUsername !== null ? pendingUsername : username,
      password: pendingPassword !== null ? pendingPassword : password,
    });
    setShowConfirm(false);
    setPendingUsername(null);
    setPendingPassword(null);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingUsername(null);
    setPendingPassword(null);
  };

  // ---------------------
  // Render
  // ---------------------
  return (
    <div className="flex justify-center items-center min-h-[80vh]">
      <Card className="w-full max-w-5xl p-12 pl-32 rounded-2xl min-h-[80vh]">
        {/* Header Section */}
        <Header username={username} />

        {/* Tabs Section */}
        <div className="flex mb-8" role="tablist" aria-label="Settings Tabs">
          <TabList
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            tabRefs={tabRefs}
            handleTabKeyDown={handleTabKeyDown}
          />
          <div className="flex-1 pr-4">
            {/* Style Tab Panel */}
            <TabPanelStyle
              active={activeTab === 'style'}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              handleSave={handleSave}
              saveMessage={saveMessage}
            />
            {/* Account Tab Panel */}
            <TabPanelAccount
              active={activeTab === 'account'}
              username={username}
              setUsername={setUsername}
              dob={dob}
              setDob={setDob}
              password={password}
              setPassword={setPassword}
              activeStatus={activeStatus}
              setActiveStatus={setActiveStatus}
              handleSave={handleSave}
              saveMessage={saveMessage}
              onSubmit={handleAccountSubmit}
            />
          </div>
        </div>
      </Card>
      {/* Confirm Dialog for username/password change */}
      <AlertDialog open={showConfirm} onOpenChange={open => { if (!open) handleCancel(); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Changes</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingUsername && pendingPassword && (
                <>Are you sure you want to change your username and password?</>
              )}
              {pendingUsername && !pendingPassword && (
                <>Are you sure you want to change your username?</>
              )}
              {!pendingUsername && pendingPassword && (
                <>Are you sure you want to change your password?</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button variant="destructive" onClick={handleConfirm}>Confirm</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Back to Homepage Button */}
      <Button
        className="fixed bottom-8 right-8 z-50 px-6 py-8 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg shadow-lg transition-colors duration-200"
        onClick={() => navigate('/')}
        aria-label="Back to Homepage"
      >
        Back to Homepage
      </Button>
    </div>
  );
};

// =====================
// Header Component
// =====================
interface HeaderProps {
  username: string;
}
const Header: React.FC<HeaderProps> = ({ username }) => (
  <div className="flex items-center justify-between mb-8 w-full">
    <div className="flex items-center">
      <img src="/public/vite.svg" alt="Avatar" className="w-12 h-12 rounded-full mr-4" />
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your WeConnect account</p>
      </div>
    </div>
    <div className="flex items-center gap-3">
      <span className="font-semibold text-lg text-gray-700 dark:text-gray-200 truncate max-w-[160px]" title={username}>{username}</span>
      <img
        src="/public/vite.svg"
        alt="User Avatar"
        className="w-10 h-10 rounded-full border-2 border-blue-400 object-cover"
      />
    </div>
  </div>
);

// =====================
// Tab List Component
// =====================
interface TabListProps {
  activeTab: 'style' | 'account';
  setActiveTab: React.Dispatch<React.SetStateAction<'style' | 'account'>>;
  tabRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  handleTabKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => void;
}
const TabList: React.FC<TabListProps> = ({ activeTab, setActiveTab, tabRefs, handleTabKeyDown }) => (
  <div className="flex flex-col w-60 mr-8 border-r border-gray-200 dark:border-gray-700 py-2">
    <button
      ref={el => { tabRefs.current[0] = el; }}
      id="tab-style"
      role="tab"
      aria-selected={activeTab === 'style'}
      aria-controls="tabpanel-style"
      tabIndex={activeTab === 'style' ? 0 : -1}
      className={`mx-4 my-2 px-4 py-3 text-left font-semibold focus:outline-none transition-colors duration-200 rounded-lg mb-2 ${activeTab === 'style' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]'}`}
      onClick={() => setActiveTab('style')}
      onKeyDown={e => handleTabKeyDown(e, 0)}
      type="button"
    >
      Style
    </button>
    <button
      ref={el => { tabRefs.current[1] = el; }}
      id="tab-account"
      role="tab"
      aria-selected={activeTab === 'account'}
      aria-controls="tabpanel-account"
      tabIndex={activeTab === 'account' ? 0 : -1}
      className={`mx-4 my-2 px-4 py-3 text-left font-semibold focus:outline-none transition-colors duration-200 rounded-lg ${activeTab === 'account' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#333]'}`}
      onClick={() => setActiveTab('account')}
      onKeyDown={e => handleTabKeyDown(e, 1)}
      type="button"
    >
      Account
    </button>
  </div>
);

// =====================
// Style Tab Panel Component
// =====================
interface TabPanelStyleProps {
  active: boolean;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => void;
  saveMessage: string;
}
const TabPanelStyle: React.FC<TabPanelStyleProps> = ({ active, darkMode, setDarkMode, handleSave, saveMessage }) => (
  <div
    id="tabpanel-style"
    role="tabpanel"
    aria-labelledby="tab-style"
    hidden={!active}
  >
    {active && (
      <form
        onSubmit={e => { e.preventDefault(); handleSave(); }}
        aria-label="Style settings form"
      >
        <div className="flex items-center justify-between mb-6">
          <Label htmlFor="darkMode" className="font-medium">Dark Mode</Label>
          <Toggle
            id="darkMode"
            pressed={darkMode}
            onPressedChange={setDarkMode}
            aria-label="Enable dark mode"
            className="data-[state=on]:bg-blue-500 data-[state=off]:bg-gray-300 dark:data-[state=off]:bg-gray-700 w-12 h-6 rounded-full relative transition-colors duration-200"
          >
            <span
              className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200 ${darkMode ? 'translate-x-6' : ''}`}
            />
          </Toggle>
        </div>
        <Button
          type="submit"
          className="w-full py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg shadow-md transition-colors duration-200"
          aria-label="Save style settings"
        >
          Save Style Settings
        </Button>
        {saveMessage && (
          <div className="mt-4 text-green-600 text-center" role="status">{saveMessage}</div>
        )}
      </form>
    )}
  </div>
);

// =====================
// Account Tab Panel Component
// =====================
interface TabPanelAccountProps {
  active: boolean;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  dob: string;
  setDob: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  activeStatus: boolean;
  setActiveStatus: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => void;
  saveMessage: string;
  onSubmit: (e: React.FormEvent) => void;
}
const TabPanelAccount: React.FC<TabPanelAccountProps> = ({
  active,
  username,
  setUsername,
  dob,
  setDob,
  password,
  setPassword,
  activeStatus,
  setActiveStatus,
  handleSave,
  saveMessage,
  onSubmit,
}) => (
  <div
    id="tabpanel-account"
    role="tabpanel"
    aria-labelledby="tab-account"
    hidden={!active}
  >
    {active && (
      <form
        onSubmit={onSubmit}
        aria-label="Account settings form"
      >
        <div className="mb-6 flex items-center justify-between bg-green-50 dark:bg-green-950 border-2 border-green-300 dark:border-green-800 rounded-xl px-4 py-3 shadow-sm">
          <Label htmlFor="activeStatus" className="font-medium text-green-700 dark:text-green-300">Active Status</Label>
          <Toggle
            id="activeStatus"
            pressed={activeStatus}
            onPressedChange={setActiveStatus}
            aria-label="Toggle active status"
            className="data-[state=on]:bg-blue-500 data-[state=off]:bg-gray-300 dark:data-[state=off]:bg-gray-700 w-12 h-6 rounded-full relative transition-colors duration-200"
          >
            <span
              className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200 ${activeStatus ? 'translate-x-6' : ''}`}
            />
          </Toggle>
        </div>
        <div className="mb-6">
          <Label htmlFor="username" className="font-medium">Change Username</Label>
          <Input
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="mt-2 bg-gray-100 dark:bg-[#3a3b3c] border-0 focus:ring-2 focus:ring-blue-400"
            aria-label="Change username"
          />
        </div>
        <div className="mb-6">
          <Label htmlFor="dob" className="font-medium">Date of Birth</Label>
          <Input
            id="dob"
            type="date"
            value={dob}
            onChange={e => setDob(e.target.value)}
            className="mt-2 bg-gray-100 dark:bg-[#3a3b3c] border-0 focus:ring-2 focus:ring-blue-400"
            aria-label="Change date of birth"
          />
        </div>
        <div className="mb-8">
          <Label htmlFor="password" className="font-medium">Change Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter new password"
            className="mt-2 bg-gray-100 dark:bg-[#3a3b3c] border-0 focus:ring-2 focus:ring-blue-400"
            aria-label="Change password"
          />
        </div>
        <Button
          type="submit"
          className="w-full py-3 rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-lg shadow-md transition-colors duration-200"
          aria-label="Save account changes"
        >
          Save Changes
        </Button>
        {saveMessage && (
          <div className="mt-4 text-green-600 text-center" role="status">{saveMessage}</div>
        )}
      </form>
    )}
  </div>
);

export default Settings;
