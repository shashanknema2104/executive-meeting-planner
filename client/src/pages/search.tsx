import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Search as SearchIcon, User, Mail, AlertCircle } from "lucide-react";
import Sidebar from "@/components/sidebar";
import MeetingList from "@/components/meeting-list";
import type { User as UserType, MeetingWithUser } from "@shared/schema";

interface UserSearchResult {
  user: UserType;
  meetings: MeetingWithUser[];
}

export default function Search() {
  const [searchEmail, setSearchEmail] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResult, isLoading, error } = useQuery<UserSearchResult>({
    queryKey: ["/api/meetings/user", searchQuery],
    queryFn: async () => {
      // First search for user by email
      const userResponse = await fetch(`/api/users/search?email=${encodeURIComponent(searchQuery)}`);
      if (!userResponse.ok) {
        throw new Error('User not found');
      }
      const user = await userResponse.json();
      
      // Then get their public meetings
      const meetingsResponse = await fetch(`/api/meetings/user/${user.id}`);
      if (!meetingsResponse.ok) {
        throw new Error('Failed to fetch user meetings');
      }
      const meetingsData = await meetingsResponse.json();
      
      return {
        user: meetingsData.user,
        meetings: meetingsData.meetings
      };
    },
    enabled: !!searchQuery,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchEmail.trim()) {
      setSearchQuery(searchEmail.trim());
    }
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
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
                <h1 className="ml-2 text-lg font-semibold text-gray-900">TCS Executive Meeting Planner</h1>
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
                  Find Users
                </h2>
                <p className="mt-1 text-sm text-gray-500">Search for users and view their public meetings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Search Form */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                  <SearchIcon className="h-5 w-5 mr-2" />
                  Search Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="flex gap-4">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter user email address..."
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <Button type="submit" disabled={!searchEmail.trim() || isLoading}>
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Search Results */}
            {searchQuery && (
              <div className="space-y-6">
                {isLoading ? (
                  <Card>
                    <CardContent className="p-8">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-gray-500">Searching for user...</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : error ? (
                  <Card>
                    <CardContent className="p-8">
                      <div className="text-center">
                        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">User Not Found</h3>
                        <p className="text-gray-500">
                          No user found with the email address "{searchQuery}". 
                          Please check the email and try again.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : searchResult ? (
                  <>
                    {/* User Info */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-medium text-gray-900 flex items-center">
                          <User className="h-5 w-5 mr-2" />
                          User Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center space-x-4">
                          {searchResult.user.profileImageUrl ? (
                            <img
                              src={searchResult.user.profileImageUrl}
                              alt="Profile"
                              className="h-12 w-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                              <User className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {searchResult.user.firstName && searchResult.user.lastName
                                ? `${searchResult.user.firstName} ${searchResult.user.lastName}`
                                : searchResult.user.email}
                            </h3>
                            <p className="text-sm text-gray-500 flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {searchResult.user.email}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Public Meetings */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-medium text-gray-900">
                          Public Meetings
                        </CardTitle>
                        <p className="text-sm text-gray-500">
                          {searchResult.meetings.length === 0 ? "No public meetings available" :
                           `${searchResult.meetings.length} public meeting${searchResult.meetings.length !== 1 ? 's' : ''} visible`}
                        </p>
                      </CardHeader>
                      <CardContent>
                        {searchResult.meetings.length === 0 ? (
                          <div className="text-center py-8">
                            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">This user has no public meetings available</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {searchResult.meetings.map((meeting) => (
                              <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-sm font-medium text-gray-900">{meeting.title}</h4>
                                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                                    Public
                                  </Badge>
                                </div>
                                {meeting.description && (
                                  <p className="text-sm text-gray-600 mb-2">{meeting.description}</p>
                                )}
                                <div className="flex items-center text-xs text-gray-500 space-x-4">
                                  <span>{new Date(meeting.date).toLocaleDateString()}</span>
                                  <span>{formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : null}
              </div>
            )}

            {!searchQuery && (
              <Card>
                <CardContent className="p-8">
                  <div className="text-center">
                    <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Find Users</h3>
                    <p className="text-gray-500">
                      Enter a user's email address to search for their profile and view their public meetings.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
