import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Meeting } from "@shared/schema";

interface MeetingListProps {
  meetings: Meeting[];
  showDate?: boolean;
  emptyMessage?: string;
}

export default function MeetingList({ meetings, showDate = true, emptyMessage = "No meetings found" }: MeetingListProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteMeetingMutation = useMutation({
    mutationFn: async (meetingId: number) => {
      await apiRequest("DELETE", `/api/meetings/${meetingId}`);
    },
    onSuccess: () => {
      toast({
        title: "Meeting deleted",
        description: "The meeting has been successfully deleted.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/meetings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/meetings/today"] });
      queryClient.invalidateQueries({ queryKey: ["/api/meetings/upcoming"] });
      queryClient.invalidateQueries({ queryKey: ["/api/meetings/week"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete meeting",
        variant: "destructive",
      });
    },
  });

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDelete = (meetingId: number, meetingTitle: string) => {
    if (window.confirm(`Are you sure you want to delete "${meetingTitle}"?`)) {
      deleteMeetingMutation.mutate(meetingId);
    }
  };

  if (meetings.length === 0) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {meetings.map((meeting) => (
        <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="text-sm font-medium text-gray-900">{meeting.title}</h3>
                {meeting.isPublic ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                    Public
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 text-xs">
                    Private
                  </Badge>
                )}
              </div>
              
              {meeting.description && (
                <p className="text-sm text-gray-600 mb-2">{meeting.description}</p>
              )}
              
              {meeting.participantEmails && meeting.participantEmails.length > 0 && (
                <div className="text-xs text-gray-500 mb-2">
                  <span className="font-medium">Participants: </span>
                  {meeting.participantEmails.join(', ')}
                </div>
              )}
              
              <div className="flex items-center text-xs text-gray-500 space-x-4">
                {showDate && (
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(meeting.date)}
                  </span>
                )}
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(meeting.id, meeting.title)}
                disabled={deleteMeetingMutation.isPending}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
