import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { format, isSameDay } from "date-fns";
import Sidebar from "@/components/sidebar";
import CreateMeetingModal from "@/components/create-meeting-modal";
import MeetingList from "@/components/meeting-list";
import type { Meeting } from "@shared/schema";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: meetings, isLoading } = useQuery<Meeting[]>({
    queryKey: ["/api/meetings"],
  });

  const { data: selectedDateMeetings, isLoading: dateLoading } = useQuery<
    Meeting[]
  >({
    queryKey: [
      "/api/meetings/date",
      selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
    ],
    queryFn: async () => {
      if (!selectedDate) return [];
      const response = await fetch(
        `/api/meetings/date/${format(selectedDate, "yyyy-MM-dd")}`,
      );
      if (!response.ok) throw new Error("Failed to fetch meetings");
      return response.json();
    },
    enabled: !!selectedDate,
  });

  const getDaysWithMeetings = () => {
    if (!meetings) return [];
    return meetings.map((meeting) => new Date(meeting.date));
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
                  <CalendarIcon className="h-3 w-3 text-white" />
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
                  Calendar
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  View and manage your meeting schedule
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calendar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-900">
                      {selectedDate
                        ? format(selectedDate, "MMMM yyyy")
                        : "Calendar"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                      modifiers={{
                        meeting: getDaysWithMeetings(),
                      }}
                      modifiersClassNames={{
                        meeting: "bg-primary/20 text-primary-foreground",
                      }}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Selected Date Meetings */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg font-medium text-gray-900">
                      {selectedDate
                        ? format(selectedDate, "EEEE, MMMM d, yyyy")
                        : "Select a date"}
                    </CardTitle>
                    {selectedDate && (
                      <p className="text-sm text-gray-500">
                        {dateLoading
                          ? "Loading..."
                          : selectedDateMeetings?.length === 0
                            ? "No meetings scheduled"
                            : `${selectedDateMeetings?.length} meeting${selectedDateMeetings?.length !== 1 ? "s" : ""} scheduled`}
                      </p>
                    )}
                  </CardHeader>
                  <CardContent>
                    {!selectedDate ? (
                      <div className="text-center py-8">
                        <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">
                          Select a date to view meetings
                        </p>
                      </div>
                    ) : dateLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : (
                      <MeetingList
                        meetings={selectedDateMeetings || []}
                        showDate={false}
                        emptyMessage="No meetings scheduled for this date"
                      />
                    )}
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
        defaultDate={
          selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined
        }
      />
    </div>
  );
}
