import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class TimeTrackingDto {
    @IsNotEmpty({
        message: 'username is required',
    })
    username: string;

    @IsNotEmpty({
        message: 'type is required',
    })
    type: number;
}
