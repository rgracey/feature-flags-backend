import { ApiProperty } from "@nestjs/swagger";

export class EvaluationResultDto {
    constructor(value: any, valueType: string) {
        this.value = value;
        this.valueType = valueType;
    }

    @ApiProperty({ example: "true", description: "The evaluated value of the feature flag" })
    readonly value: any;

    @ApiProperty({
        example: "string",
        enum: ["string", "number", "boolean", "json"],
        description: "The data type of the evaluated value",
    })
    readonly valueType: string;
}