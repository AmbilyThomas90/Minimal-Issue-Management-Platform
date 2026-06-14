import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('issues/:issueId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll(@Param('issueId') issueId: string) {
    return this.commentsService.findByIssue(issueId);
  }

  @Post()
  create(@Param('issueId') issueId: string, @Body() body: { content: string; author: string }) {
    return this.commentsService.create(issueId, body.content, body.author);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commentsService.remove(id);
  }
}