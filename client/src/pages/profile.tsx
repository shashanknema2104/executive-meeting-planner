import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, User, Mail, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/sidebar";

export default function Profile() {
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Mobile header */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between bg-white border-b border-gray-200 px-4 py-1.5">
            <div className="flex items-center">
              <div className="ml-2 flex items-center">
                <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                  <Calendar className="h-3 w-3 text-white" />
                </div>
                <h1 className="ml-2 text-lg font-semibold text-gray-900">
                  TCS Executive Meeting Planner
                </h1>
              </div>
            </div>
          </div>
        </div>

        {/* Page header */}
        <div className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="py-6">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Profile
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-3xl mx-auto">
              {/* Profile Information */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      {user?.profileImageUrl ? (
                        <img
                          src={user.profileImageUrl}
                          alt="Profile"
                          className="h-20 w-20 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-20 w-20 bg-gray-300 rounded-full flex items-center justify-center">
                          <User className="h-10 w-10 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-medium text-gray-900">
                          {user?.firstName && user?.lastName
                            ? `${user.firstName} ${user.lastName}`
                            : user?.email || "Unknown User"}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <Mail className="h-4 w-4 mr-2" />
                          {user?.email || "No email available"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <p className="text-sm text-gray-900">
                          {user?.firstName || "Not specified"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <p className="text-sm text-gray-900">
                          {user?.lastName || "Not specified"}
                        </p>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <p className="text-sm text-gray-900">
                          {user?.email || "Not available"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Member Since
                        </label>
                        <p className="text-sm text-gray-900">
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Updated
                        </label>
                        <p className="text-sm text-gray-900">
                          {user?.updatedAt
                            ? new Date(user.updatedAt).toLocaleDateString()
                            : "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Account Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">
                    Account Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Sign Out
                        </h4>
                        <p className="text-sm text-gray-500">
                          Sign out of your account
                        </p>
                      </div>
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* App Information */}
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="text-lg font-medium text-gray-900">
                    About TCS Executive Meeting Planner
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">
                      TCS Executive Meeting Planner is a professional meeting
                      scheduler designed to help you manage your time
                      effectively and collaborate with others.
                    </p>
                    <p className="text-sm text-gray-600">
                      You can create meetings, view your schedule, and search
                      for other users' public meetings to coordinate better.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
