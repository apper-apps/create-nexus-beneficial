import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import GlobalSearch from "@/components/organisms/GlobalSearch";
const Header = ({ onMenuClick }) => {
const [showGlobalSearch, setShowGlobalSearch] = useState(false);

  // Global keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowGlobalSearch(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="glass-card border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden h-10 w-10 p-0"
          >
            <ApperIcon name="Menu" size={20} />
          </Button>
        </div>
        
<div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="h-10 w-10 p-0 relative">
            <ApperIcon name="Bell" size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              const { logout } = require('react').useContext(require('../../App').AuthContext);
              logout();
            }}
            className="h-10 px-3 text-slate-300 hover:text-white"
          >
            <ApperIcon name="LogOut" size={16} />
            <span className="ml-2">Logout</span>
          </Button>
          
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <ApperIcon name="User" size={16} className="text-white" />
          </div>
        </div>
      </div>

      {/* Global Search Modal */}
      <GlobalSearch 
        isOpen={showGlobalSearch}
        onClose={() => setShowGlobalSearch(false)}
      />
    </header>
  );
};

export default Header;