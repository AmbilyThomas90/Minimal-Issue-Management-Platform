import { Controller, Get, Post, Param } from '@nestjs/common';
import { AnalysisService } from './analysis.service';

@Controller('issues/:issueId/analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  findAll(@Param('issueId') issueId: string) {
    return this.analysisService.findByIssue(issueId);
  }

  @Post()
  generate(@Param('issueId') issueId: string) {
    return this.analysisService.generate(issueId);
  }
}