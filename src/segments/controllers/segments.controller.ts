import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SegmentsService } from '../services';
import { AuthUser, AuthUserDto, JwtGuard } from 'src/authentication';
import { CreateSegmentDto } from '../dtos';

@ApiTags('segments')
@Controller({ path: 'projects/:projectId/segments', version: '1' })
export class SegmentsController {
    constructor(
        private readonly segmentsService: SegmentsService,
    ) { }

    @ApiOperation({ summary: 'Create a new segment in a project' })
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post()
    async createSegment(
        @AuthUser() user: AuthUserDto,
        @Param('projectId') projectId: string,
        @Body() createSegmentDto: CreateSegmentDto
    ) {
        return this.segmentsService.createSegment(user.id, projectId, createSegmentDto);
    }

    @ApiOperation({ summary: 'Get a specific segment by its key'})
    @ApiBearerAuth()
    @UseGuards(JwtGuard)
    @Post(':segmentKey')
    async getSegmentByKey(
        @AuthUser() user: AuthUserDto,
        @Param('projectId') projectId: string,
        @Param('segmentKey') segmentKey: string
    ) {
        return this.segmentsService.getSegmentByKey(user.id, projectId, segmentKey);
    }
}
