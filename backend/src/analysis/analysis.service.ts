import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { DatabaseService } from '../database/database.service';
import { analyses, issues, comments } from '../database/schema';
import { eq, desc } from 'drizzle-orm';

@Injectable()
export class AnalysisService {
  private genAI: GoogleGenerativeAI;

  constructor(private db: DatabaseService) {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  }

  async generate(issueId: string) {
    // Fetch the issue
    const issueResult = await this.db.db.select().from(issues).where(eq(issues.id, issueId));
    const issue = issueResult[0];
    if (!issue) throw new Error('Issue not found');

    // Fetch comments
    const issueComments = await this.db.db.select().from(comments).where(eq(comments.issueId, issueId));

    // Build prompt
    const commentText = issueComments.length
      ? issueComments.map(c => `- ${c.author}: ${c.content}`).join('\n')
      : 'No comments yet.';

    const prompt = `
You are a technical project manager. Analyze the following issue and its discussion thread.

ISSUE TITLE: ${issue.title}
STATUS: ${issue.status}
PRIORITY: ${issue.priority}
DESCRIPTION: ${issue.description}

DISCUSSION:
${commentText}

Provide a structured analysis with:
1. Root Cause Analysis (likely causes)
2. Impact Assessment (who/what is affected)
3. Recommended Next Steps (concrete action items)
4. Estimated Complexity (low/medium/high with reasoning)

Be concise and practical.
    `;

    const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const content = result.response.text();

    // Save to database
    const saved = await this.db.db.insert(analyses).values({ issueId, content }).returning();
    return saved[0];
  }

  async findByIssue(issueId: string) {
    return this.db.db.select().from(analyses).where(eq(analyses.issueId, issueId)).orderBy(desc(analyses.createdAt));
  }
}