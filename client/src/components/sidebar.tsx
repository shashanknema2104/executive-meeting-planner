import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Calendar, Home, Users, Search, User, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "My Meetings", href: "/meetings", icon: Users },
  { name: "Find Users", href: "/search", icon: Search },
  { name: "Profile", href: "/profile", icon: User },
];

export default function Sidebar() {
  const [location, setLocation] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
      <div className="flex flex-col flex-grow bg-white border-r border-gray-200 pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            {/* --- START: CUSTOM LOGO IMAGE --- */}
            <img
              className="h-8 w-8 object-contain" // Adjust h-8 and w-8 for your logo's size. object-contain keeps aspect ratio.
              src="/TCS_NewLogo_Final_CMYK_Black.png" // IMPORTANT: Update this path to your logo file
              alt="Your Company Logo Icon" // Always use descriptive alt text for accessibility
            />
            {/* --- END: CUSTOM LOGO IMAGE --- */}

            <h1 className="ml-3 text-sm font-semibold text-gray-900">
              TCS Executive Meeting Planner
            </h1>
          </div>
        </div>

        <div className="mt-8 flex-1 flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;

              return (
                <button
                  key={item.name}
                  onClick={() => setLocation(item.href)}
                  className={cn(
                    isActive
                      ? "bg-primary/10 border-r-2 border-primary text-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-l-md w-full text-left",
                  )}
                >
                  <Icon
                    className={cn(
                      isActive
                        ? "text-primary"
                        : "text-gray-400 group-hover:text-gray-500",
                      "mr-3 h-5 w-5",
                    )}
                  />
                  {item.name}
                </button>
              );
            })}
          </nav>

          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <div className="flex-shrink-0 group block w-full">
              <div className="flex items-center">
                {user?.profileImageUrl ? (
                  <img
                    src={user.profileImageUrl}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                )}
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email || "User"}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center"
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
