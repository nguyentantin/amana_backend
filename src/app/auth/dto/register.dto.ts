import { IsEmail, IsNotEmpty, IsNumber, IsString, Matches } from 'class-validator';
import { Unique } from '../../../core/validations/unique';
import { NeolabEmailRegex } from '../../../core/constants/neolab-email-regex';
import { User } from '../../user/dto/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exist } from '../../../core/validations/exist';
import { Department } from '../../department/dto/department.entity';
import { IsValidDate } from '../../../core/validations/is-valid-date';

export class RegisterDto {
    @ApiProperty({
        required: true,
        description: 'email',
    })
    @IsEmail({}, {
        message: 'Email format is invalid',
    })
    @IsNotEmpty({
        message: 'Email is required',
    })
    @Unique(User, { message: 'Email is already use' })
    @Matches(NeolabEmailRegex, {
        message: 'Email must be belongs to Neo-lab',
    })
    readonly email: string;

    @ApiProperty({
        required: true,
        description: 'name',
    })
    @IsString()
    @IsNotEmpty()
    readonly name: string;

    @ApiProperty({
        required: true,
        description: 'password',
    })
    @IsString()
    @IsNotEmpty()
    readonly password: string;

    @ApiProperty({
        required: true,
        description: 'Department Id',
    })
    @Exist(Department, {
        message: 'Department does not exist',
    })
    @IsNumber()
    @IsNotEmpty()
    departmentId: number;

    @ApiProperty({
        required: true,
        description: 'User birthday',
    })
    @IsValidDate()
    @IsNotEmpty()
    birthday: string;
}
