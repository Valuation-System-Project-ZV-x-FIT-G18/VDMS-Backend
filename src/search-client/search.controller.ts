import { Controller, Get, Query } from '@nestjs/common'; // NestJS HTTP decorators
import { SearchService } from './search.service'; // business logic

@Controller('search') // all routes prefixed /search
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  /* GET /search?q=<value>&type=nic|project_id
     Returns the loan applicant info or a "not found" flag */
  @Get()
  search(@Query('q') query: string, @Query('type') type: string) {
    return this.searchService.search(query, type); // delegate to service
  }
}
