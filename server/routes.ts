import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertMeetingSchema } from "@shared/schema";
import { z } from "zod";
import archiver from "archiver";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Meeting routes
  app.post('/api/meetings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const meetingData = insertMeetingSchema.parse({
        ...req.body,
        userId,
      });
      
      const meeting = await storage.createMeeting(meetingData);
      res.json(meeting);
    } catch (error) {
      console.error("Error creating meeting:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid meeting data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create meeting" });
      }
    }
  });

  app.get('/api/meetings', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const meetings = await storage.getMeetingsByUser(userId);
      res.json(meetings);
    } catch (error) {
      console.error("Error fetching meetings:", error);
      res.status(500).json({ message: "Failed to fetch meetings" });
    }
  });

  app.get('/api/meetings/today', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const meetings = await storage.getTodaysMeetings(userId);
      res.json(meetings);
    } catch (error) {
      console.error("Error fetching today's meetings:", error);
      res.status(500).json({ message: "Failed to fetch today's meetings" });
    }
  });

  app.get('/api/meetings/upcoming', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const meetings = await storage.getUpcomingMeetings(userId);
      res.json(meetings);
    } catch (error) {
      console.error("Error fetching upcoming meetings:", error);
      res.status(500).json({ message: "Failed to fetch upcoming meetings" });
    }
  });

  app.get('/api/meetings/week', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const meetings = await storage.getWeekMeetings(userId);
      res.json(meetings);
    } catch (error) {
      console.error("Error fetching week meetings:", error);
      res.status(500).json({ message: "Failed to fetch week meetings" });
    }
  });

  app.get('/api/meetings/date/:date', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { date } = req.params;
      const meetings = await storage.getMeetingsByUserAndDate(userId, date);
      res.json(meetings);
    } catch (error) {
      console.error("Error fetching meetings for date:", error);
      res.status(500).json({ message: "Failed to fetch meetings for date" });
    }
  });

  app.get('/api/meetings/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get public meetings where user is organizer
      const organizedMeetings = await storage.getPublicMeetingsByUser(userId);
      
      // Get meetings where user is participant (if they have an email)
      const participantMeetings = user.email ? await storage.getMeetingsByParticipant(user.email) : [];
      
      // Combine and deduplicate meetings, only show public ones for participants
      const allMeetings = [
        ...organizedMeetings,
        ...participantMeetings.filter(meeting => meeting.isPublic)
      ];
      
      const uniqueMeetings = allMeetings.filter((meeting, index, self) => 
        index === self.findIndex(m => m.id === meeting.id)
      );
      
      // Convert participant meetings to MeetingWithUser format
      const meetingsWithUser = uniqueMeetings.map(meeting => ({
        ...meeting,
        user: user
      }));

      res.json({ user, meetings: meetingsWithUser });
    } catch (error) {
      console.error("Error fetching user meetings:", error);
      res.status(500).json({ message: "Failed to fetch user meetings" });
    }
  });

  app.get('/api/users/search', async (req, res) => {
    try {
      const { email } = req.query;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Email parameter is required" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error searching user:", error);
      res.status(500).json({ message: "Failed to search user" });
    }
  });

  app.put('/api/meetings/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const meetingId = parseInt(req.params.id);
      
      const existingMeeting = await storage.getMeetingById(meetingId);
      if (!existingMeeting || existingMeeting.userId !== userId) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      const updateData = insertMeetingSchema.partial().parse(req.body);
      const meeting = await storage.updateMeeting(meetingId, updateData);
      res.json(meeting);
    } catch (error) {
      console.error("Error updating meeting:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid meeting data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update meeting" });
      }
    }
  });

  app.delete('/api/meetings/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const meetingId = parseInt(req.params.id);
      
      const deleted = await storage.deleteMeeting(meetingId, userId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Meeting not found" });
      }

      res.json({ message: "Meeting deleted successfully" });
    } catch (error) {
      console.error("Error deleting meeting:", error);
      res.status(500).json({ message: "Failed to delete meeting" });
    }
  });

  app.get('/api/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      const [todayMeetings, weekMeetings, upcomingMeetings] = await Promise.all([
        storage.getTodaysMeetings(userId),
        storage.getWeekMeetings(userId),
        storage.getUpcomingMeetings(userId),
      ]);

      const stats = {
        todayMeetings: todayMeetings.length,
        weekMeetings: weekMeetings.length,
        upcomingMeetings: upcomingMeetings.length,
        contacts: 0, // This could be extended to track user connections
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Temporary download endpoint
  app.get('/download-source', (req, res) => {
    const root = path.resolve('.');
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', 'attachment; filename="tcs-meeting-planner.zip"');

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => res.status(500).send(err.message));
    archive.pipe(res);
    archive.glob('**/*', {
      cwd: root,
      ignore: [
        'node_modules/**', '.git/**', 'dist/**', '.local/**',
        '.cache/**', '.upm/**', 'package-lock.json',
        '*.zip', '*.tar.gz', '.replit', 'replit.nix', 'generated-icon.png'
      ]
    });
    archive.finalize();
  });

  const httpServer = createServer(app);
  return httpServer;
}
