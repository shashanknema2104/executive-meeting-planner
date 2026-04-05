import {
  users,
  meetings,
  type User,
  type UpsertUser,
  type Meeting,
  type InsertMeeting,
  type MeetingWithUser,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";

export interface IStorage {
  // User operations - mandatory for Replit Auth
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  
  // Meeting operations
  createMeeting(meeting: InsertMeeting): Promise<Meeting>;
  getMeetingsByUser(userId: string): Promise<Meeting[]>;
  getMeetingsByUserAndDate(userId: string, date: string): Promise<Meeting[]>;
  getMeetingsByDateRange(userId: string, startDate: string, endDate: string): Promise<Meeting[]>;
  getPublicMeetingsByUser(userId: string): Promise<MeetingWithUser[]>;
  getMeetingsByParticipant(email: string): Promise<Meeting[]>;
  getMeetingsByParticipantAndDate(email: string, date: string): Promise<Meeting[]>;
  getMeetingById(id: number): Promise<Meeting | undefined>;
  updateMeeting(id: number, meeting: Partial<InsertMeeting>): Promise<Meeting | undefined>;
  deleteMeeting(id: number, userId: string): Promise<boolean>;
  getTodaysMeetings(userId: string): Promise<Meeting[]>;
  getUpcomingMeetings(userId: string): Promise<Meeting[]>;
  getWeekMeetings(userId: string): Promise<Meeting[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations - mandatory for Replit Auth
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  // Meeting operations
  async createMeeting(meeting: InsertMeeting): Promise<Meeting> {
    const [newMeeting] = await db
      .insert(meetings)
      .values(meeting)
      .returning();
    return newMeeting;
  }

  async getMeetingsByUser(userId: string): Promise<Meeting[]> {
    return await db
      .select()
      .from(meetings)
      .where(eq(meetings.userId, userId))
      .orderBy(asc(meetings.date), asc(meetings.startTime));
  }

  async getMeetingsByUserAndDate(userId: string, date: string): Promise<Meeting[]> {
    return await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.userId, userId), eq(meetings.date, date)))
      .orderBy(asc(meetings.startTime));
  }

  async getMeetingsByDateRange(userId: string, startDate: string, endDate: string): Promise<Meeting[]> {
    return await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.userId, userId),
          gte(meetings.date, startDate),
          lte(meetings.date, endDate)
        )
      )
      .orderBy(asc(meetings.date), asc(meetings.startTime));
  }

  async getPublicMeetingsByUser(userId: string): Promise<MeetingWithUser[]> {
    return await db
      .select({
        id: meetings.id,
        title: meetings.title,
        description: meetings.description,
        date: meetings.date,
        startTime: meetings.startTime,
        endTime: meetings.endTime,
        userId: meetings.userId,
        isPublic: meetings.isPublic,
        participantEmails: meetings.participantEmails,
        createdAt: meetings.createdAt,
        updatedAt: meetings.updatedAt,
        user: users,
      })
      .from(meetings)
      .innerJoin(users, eq(meetings.userId, users.id))
      .where(and(eq(meetings.userId, userId), eq(meetings.isPublic, true)))
      .orderBy(asc(meetings.date), asc(meetings.startTime));
  }

  async getMeetingsByParticipant(email: string): Promise<Meeting[]> {
    const result = await db
      .select()
      .from(meetings)
      .where(sql`${meetings.participantEmails} @> ARRAY[${email}]::text[]`)
      .orderBy(asc(meetings.date), asc(meetings.startTime));
    return result;
  }

  async getMeetingsByParticipantAndDate(email: string, date: string): Promise<Meeting[]> {
    const result = await db
      .select()
      .from(meetings)
      .where(and(sql`${meetings.participantEmails} @> ARRAY[${email}]::text[]`, eq(meetings.date, date)))
      .orderBy(asc(meetings.startTime));
    return result;
  }

  async getMeetingById(id: number): Promise<Meeting | undefined> {
    const [meeting] = await db.select().from(meetings).where(eq(meetings.id, id));
    return meeting;
  }

  async updateMeeting(id: number, meetingData: Partial<InsertMeeting>): Promise<Meeting | undefined> {
    const [meeting] = await db
      .update(meetings)
      .set({ ...meetingData, updatedAt: new Date() })
      .where(eq(meetings.id, id))
      .returning();
    return meeting;
  }

  async deleteMeeting(id: number, userId: string): Promise<boolean> {
    const result = await db
      .delete(meetings)
      .where(and(eq(meetings.id, id), eq(meetings.userId, userId)));
    return result.rowCount > 0;
  }

  async getTodaysMeetings(userId: string): Promise<Meeting[]> {
    const today = new Date().toISOString().split('T')[0];
    const user = await this.getUser(userId);
    const userEmail = user?.email;
    
    // Get meetings where user is organizer or participant
    const organizedMeetings = await this.getMeetingsByUserAndDate(userId, today);
    const participantMeetings = userEmail ? await this.getMeetingsByParticipantAndDate(userEmail, today) : [];
    
    // Combine and deduplicate meetings
    const allMeetings = [...organizedMeetings, ...participantMeetings];
    const uniqueMeetings = allMeetings.filter((meeting, index, self) => 
      index === self.findIndex(m => m.id === meeting.id)
    );
    
    return uniqueMeetings.sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  async getUpcomingMeetings(userId: string): Promise<Meeting[]> {
    const today = new Date().toISOString().split('T')[0];
    const user = await this.getUser(userId);
    const userEmail = user?.email;
    
    // Get meetings where user is organizer
    const organizedMeetings = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.userId, userId), gte(meetings.date, today)))
      .orderBy(asc(meetings.date), asc(meetings.startTime));
    
    // Get meetings where user is participant
    const participantMeetings = userEmail ? await db
      .select()
      .from(meetings)
      .where(and(sql`${meetings.participantEmails} @> ARRAY[${userEmail}]::text[]`, gte(meetings.date, today)))
      .orderBy(asc(meetings.date), asc(meetings.startTime)) : [];
    
    // Combine and deduplicate meetings
    const allMeetings = [...organizedMeetings, ...participantMeetings];
    const uniqueMeetings = allMeetings.filter((meeting, index, self) => 
      index === self.findIndex(m => m.id === meeting.id)
    );
    
    return uniqueMeetings.sort((a, b) => {
      if (a.date === b.date) {
        return a.startTime.localeCompare(b.startTime);
      }
      return a.date.localeCompare(b.date);
    });
  }

  async getWeekMeetings(userId: string): Promise<Meeting[]> {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

    return this.getMeetingsByDateRange(userId, startDate, endDate);
  }
}

export const storage = new DatabaseStorage();
