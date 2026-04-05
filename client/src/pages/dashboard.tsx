import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CalendarDays,
  Clock,
  Users,
  Plus,
  Search,
  Video,
  Handshake,
  Lightbulb,
} from "lucide-react";
import { format } from "date-fns";
import Sidebar from "@/components/sidebar";
import CreateMeetingModal from "@/components/create-meeting-modal";
import { useState } from "react";
import type { Meeting } from "@shared/schema";

interface Stats {
  todayMeetings: number;
  weekMeetings: number;
  upcomingMeetings: number;
  contacts: number;
}

export default function Dashboard() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery<Stats>({
    queryKey: ["/api/stats"],
  });

  const { data: todayMeetings, isLoading: meetingsLoading } = useQuery<
    Meeting[]
  >({
    queryKey: ["/api/meetings/today"],
  });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getMeetingIcon = (index: number) => {
    const icons = [Video, Handshake, Lightbulb];
    const Icon = icons[index % icons.length];
    return Icon;
  };

  const getMeetingColor = (index: number) => {
    const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500"];
    return colors[index % colors.length];
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
            <div className="py-6 md:flex md:items-center md:justify-between">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                  Dashboard
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your meetings and schedule effectively
                </p>
              </div>
              <div className="mt-4 flex md:mt-0 md:ml-4">
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4 -ml-1 mr-2" />
                  New Meeting
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {/* Quick Stats */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <CalendarDays className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Today's Meetings
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {statsLoading ? "-" : stats?.todayMeetings || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          This Week
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {statsLoading ? "-" : stats?.weekMeetings || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                        <Clock className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Upcoming
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {statsLoading ? "-" : stats?.upcomingMeetings || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Contacts
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {statsLoading ? "-" : stats?.contacts || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Today's Schedule */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-lg font-medium text-gray-900">
                      Today's Schedule
                    </CardTitle>
                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                      Your meetings for today,{" "}
                      {format(new Date(), "MMMM d, yyyy")}
                    </p>
                  </CardHeader>
                  <CardContent className="p-6">
                    {meetingsLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : !todayMeetings?.length ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          No meetings scheduled for today
                        </p>
                      </div>
                    ) : (
                      <div className="flow-root">
                        <ul className="-mb-8">
                          {todayMeetings.map((meeting, index) => {
                            const Icon = getMeetingIcon(index);
                            const isLast = index === todayMeetings.length - 1;

                            return (
                              <li key={meeting.id}>
                                <div className="relative pb-8">
                                  {!isLast && (
                                    <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"></span>
                                  )}
                                  <div className="relative flex space-x-3">
                                    <div>
                                      <span
                                        className={`h-8 w-8 rounded-full ${getMeetingColor(index)} flex items-center justify-center ring-8 ring-white`}
                                      >
                                        <Icon className="h-3 w-3 text-white" />
                                      </span>
                                    </div>
                                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                                      <div>
                                        <p className="text-sm text-gray-900 font-medium">
                                          {meeting.title}
                                        </p>
                                        {meeting.description && (
                                          <p className="text-sm text-gray-500">
                                            {meeting.description}
                                          </p>
                                        )}
                                        <p className="text-xs text-gray-400 mt-1">
                                          <Clock className="inline h-3 w-3 mr-1" />
                                          {formatTime(meeting.startTime)} -{" "}
                                          {formatTime(meeting.endTime)}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Calendar Widget */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader className="border-b border-gray-200">
                    <CardTitle className="text-lg font-medium text-gray-900">
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3">
                    <button
                      onClick={() => setIsCreateModalOpen(true)}
                      className="w-full bg-primary/10 border border-primary/20 rounded-lg p-4 text-left hover:bg-primary/20 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                          <Plus className="h-4 w-4 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            Schedule Meeting
                          </p>
                          <p className="text-sm text-gray-500">
                            Create a new meeting quickly
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => (window.location.href = "/search")}
                      className="w-full bg-green-50 border border-green-200 rounded-lg p-4 text-left hover:bg-green-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                          <Search className="h-4 w-4 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            Find Colleagues
                          </p>
                          <p className="text-sm text-gray-500">
                            Search for team members
                          </p>
                        </div>
                      </div>
                    </button>

                    <button
                      onClick={() => (window.location.href = "/calendar")}
                      className="w-full bg-purple-50 border border-purple-200 rounded-lg p-4 text-left hover:bg-purple-100 transition-colors"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">
                            Calendar View
                          </p>
                          <p className="text-sm text-gray-500">
                            See full month calendar
                          </p>
                        </div>
                      </div>
                    </button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>

      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
}
