import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { issues, comments } from '../database/schema';
import { eq, desc, ilike, or, and, SQL } from 'drizzle-orm';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';

@Injectable()
export class IssuesService {
  constructor(private db: DatabaseService) {}

  // 🔹 GET ALL ISSUES (FIXED FILTER LOGIC)
  async findAll(search?: string, status?: string, priority?: string) {
    const conditions: SQL[] = [];

    if (search) {
      conditions.push(
        or(
          ilike(issues.title, `%${search}%`),
          ilike(issues.description, `%${search}%`),
        ) as SQL,
      );
    }

    if (status) {
      conditions.push(eq(issues.status, status as any));
    }

    if (priority) {
      conditions.push(eq(issues.priority, priority as any));
    }

    return this.db.db
      .select()
      .from(issues)
      .where(conditions.length ? and(...conditions) : undefined) // ✅ FIX HERE
      .orderBy(desc(issues.createdAt));
  }

  // 🔹 GET SINGLE ISSUE
  async findOne(id: string) {
    const result = await this.db.db
      .select()
      .from(issues)
      .where(eq(issues.id, id));

    if (!result[0]) {
      throw new NotFoundException(`Issue ${id} not found`);
    }

    return result[0];
  }

  // 🔹 CREATE ISSUE
  async create(dto: CreateIssueDto) {
    const result = await this.db.db
      .insert(issues)
      .values(dto)
      .returning();

    return result[0];
  }

  // 🔹 UPDATE ISSUE
  async update(id: string, dto: UpdateIssueDto) {
    const result = await this.db.db
      .update(issues)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(issues.id, id))
      .returning();

    if (!result[0]) {
      throw new NotFoundException(`Issue ${id} not found`);
    }

    return result[0];
  }

  // 🔹 DELETE ISSUE
  async remove(id: string) {
    await this.db.db.delete(issues).where(eq(issues.id, id));
    return { deleted: true };
  }

  //  FIX: ADD COMMENT (THIS WAS MISSING → CAUSES YOUR 404 ISSUE)
 async addComment(
  issueId: string,
  body: { content: string; author?: string },
) {
  const result = await this.db.db
    .insert(comments)
    .values({
      issueId,
      content: body.content,
      author: body.author || 'Anonymous',
      createdAt: new Date(),
    })
    .returning();

  return result[0];
}
  //  OPTIONAL: GET COMMENTS
  async getComments(issueId: string) {
    return this.db.db
      .select()
      .from(comments)
      .where(eq(comments.issueId, issueId))
      .orderBy(desc(comments.createdAt));
  }
// 🔹 ANALYZE ISSUE
async analyzeIssue(id: string) {
  try {
    console.log('Analyze called for ID:', id);

    const result = await this.db.db
      .select()
      .from(issues)
      .where(eq(issues.id, id));

    const issue = result[0];

    console.log('Issue:', issue);

    if (!issue) {
      throw new NotFoundException(`Issue ${id} not found`);
    }

    // Temporary AI Analysis Response
    // Replace this later with Gemini API integration
    return {
      issueId: issue.id,
      title: issue.title,
      analysis: {
        severity: 'High',
        possibleCauses: [
          'Backend API error',
          'Database connection issue',
          'Validation failure',
        ],
        suggestedFixes: [
          'Check backend logs',
          'Verify database connection',
          'Review validation rules',
        ],
        priority: issue.priority,
      },
    };
  } catch (error) {
    console.error('Analyze Error:', error);
    throw error;
  }
}

}
