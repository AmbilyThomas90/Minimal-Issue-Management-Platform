import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';

import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  // 🔹 GET all issues
  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('status') status?: string,
    @Query('priority') priority?: string,
  ) {
    return this.issuesService.findAll(search, status, priority);
  }

  // 🔹 GET single issue
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.issuesService.findOne(id);
  }

  // 🔹 CREATE issue
  @Post()
  create(@Body() dto: CreateIssueDto) {
    return this.issuesService.create(dto);
  }

  // 🔹 UPDATE issue
  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateIssueDto) {
    return this.issuesService.update(id, dto);
  }

  // 🔹 DELETE issue
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.issuesService.remove(id);
  }

  //  FIX: ADD COMMENT ROUTE (THIS FIXES YOUR 404 ERROR)
  @Post(':id/comments')
  addComment(
    @Param('id') id: string,
    @Body() body: { content: string },
  ) {
    return this.issuesService.addComment(id, body);
  }

  // OPTIONAL: GET COMMENTS
  @Get(':id/comments')
  getComments(@Param('id') id: string) {
    return this.issuesService.getComments(id);
  }
}