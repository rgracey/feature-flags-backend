import { Injectable } from '@nestjs/common';
import { CreateSegmentDto } from '../dtos';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Segment } from '../entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AuthorisationService } from 'src/authorisation';
import { SegmentWithKeyAlreadyExistsError } from '../errors';
import { RulesService } from 'src/rules';

@Injectable()
export class SegmentsService {
    constructor(
        @InjectRepository(Segment)
        private readonly segmentsRepository: EntityRepository<Segment>,
        private readonly entityManager: EntityManager,
        private readonly authorisationService: AuthorisationService,
        private readonly rulesService: RulesService,
    ) { }

    /**
     * Find a segment by its key for a specific project
     * @param userId the ID of the user getting the segment
     * @param projectId the ID of the project the segment belongs to
     * @param segmentKey the key of the segment to retrieve
     * @returns the segment if found, null otherwise
     */
    async getSegmentByKey(
        userId: string,
        projectId: string,
        segmentKey: string
    ) {
        if (!(await this.authorisationService.canGetSegments(userId, projectId))) {
            throw new Error('User does not have access to get segments in this project');
        }

        return this.segmentsRepository.findOne({
            project: { id: projectId },
            key: segmentKey,
        });
    }

    /**
     * Create a new segment in a project
     * @param userId the ID of the user creating the segment
     * @param projectId the ID of the project the segment is being created in
     * @param createSegmentDto the data to create the segment with
     * @returns the newly created segment
     */
    async createSegment(userId: string, projectId: string, createSegmentDto: CreateSegmentDto) {
        if (!(await this.authorisationService.canCreateSegment(userId, projectId))) {
            throw new Error('User does not have access to create segments in this project');
        }

        await this.entityManager.transactional(async (em) => {
            const existingSegment = await this.segmentsRepository.findOne({
                project: { id: projectId },
                key: createSegmentDto.key,
            });

            if (existingSegment) {
                throw new SegmentWithKeyAlreadyExistsError(createSegmentDto.key);
            }

            const segment = this.segmentsRepository.create({
                name: createSegmentDto.name,
                description: createSegmentDto.description,
                key: createSegmentDto.key,
                project: projectId,
                createdBy: userId,
            });
            await em.persistAndFlush(segment);

            await this.rulesService.upsertRules(userId, segment.id, createSegmentDto.rules);
        });

        return this.getSegmentByKey(userId, projectId, createSegmentDto.key);
    }
}
