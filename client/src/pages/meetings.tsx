import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Plus } from "lucide-react";
import { useState } from "react";
import Sidebar from "@/components/sidebar";
import CreateMeetingModal from "@/components/create-meeting-modal";
import MeetingList from "@/components/meeting-list";
import type { Meeting } from "@shared/schema";

export default function Meetings() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: allMeetings, isLoading: allLoading } = useQuery<Meeting[]>({
    queryKey: ["/api/meetings"],
  });

  const { data: todayMeetings, isLoading: todayLoading } = useQuery<Meeting[]>({
    queryKey: ["/api/meetings/today"],
  });

  const { data: upcomingMeetings, isLoading: upcomingLoading } = useQuery<
    Meeting[]
  >({
    queryKey: ["/api/meetings/upcoming"],
  });

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
                  My Meetings
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage all your meetings
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
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                <TabsTrigger value="all">All Meetings</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-900">
                      All Meetings
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {allLoading
                        ? "Loading..."
                        : allMeetings?.length === 0
                          ? "No meetings found"
                          : `${allMeetings?.length} meeting${allMeetings?.length !== 1 ? "s" : ""} total`}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {allLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : (
                      <MeetingList
                        meetings={allMeetings || []}
                        showDate={true}
                        emptyMessage="No meetings found. Create your first meeting to get started."
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="today">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-900">
                      Today's Meetings
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {todayLoading
                        ? "Loading..."
                        : todayMeetings?.length === 0
                          ? "No meetings today"
                          : `${todayMeetings?.length} meeting${todayMeetings?.length !== 1 ? "s" : ""} today`}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {todayLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : (
                      <MeetingList
                        meetings={todayMeetings || []}
                        showDate={false}
                        emptyMessage="No meetings scheduled for today."
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upcoming">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-900">
                      Upcoming Meetings
                    </CardTitle>
                    <p className="text-sm text-gray-500">
                      {upcomingLoading
                        ? "Loading..."
                        : upcomingMeetings?.length === 0
                          ? "No upcoming meetings"
                          : `${upcomingMeetings?.length} upcoming meeting${upcomingMeetings?.length !== 1 ? "s" : ""}`}
                    </p>
                  </CardHeader>
                  <CardContent>
                    {upcomingLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : (
                      <MeetingList
                        meetings={upcomingMeetings || []}
                        showDate={true}
                        emptyMessage="No upcoming meetings scheduled."
                      />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
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
