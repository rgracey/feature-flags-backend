import { ApiProperty } from "@nestjs/swagger";

export class EvaluationContextDto {
    @ApiProperty({
        example: "something-123",
        description: 'A stable identifier for the entity being evaluated which is ensures consistent evaluation results',
    })
    readonly stableId: string;

    @ApiProperty({
        description: 'Attributes to be used for evaluation',
        type: Object,
        additionalProperties: true,
    })
    readonly attributes: {
        readonly [key: string]: any;
    }
}