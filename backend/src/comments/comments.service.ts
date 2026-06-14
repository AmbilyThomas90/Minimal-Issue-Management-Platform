import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { comments } from '../database/schema';
import { eq, asc } from 'drizzle-orm';

@Injectable()
export class CommentsService {
  constructor(private db: DatabaseService) {}

  async findByIssue(issueId: string) {
    return this.db.db.select().from(comments).where(eq(comments.issueId, issueId)).orderBy(asc(comments.createdAt));
  }

  async create(issueId: string, content: string, author: string) {
    const result = await this.db.db.insert(comments).values({ issueId, content, author }).returning();
    return result[0];
  }

  async remove(id: string) {
    await this.db.db.delete(comments).where(eq(comments.id, id));
    return { deleted: true };
  }
}