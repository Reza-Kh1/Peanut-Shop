import {
    IsString,
    IsEmail,
    MinLength,
    MaxLength,
    ValidatorConstraint,
    Validate,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

interface UserLikeObject {
    password?: string;
    googleId?: string;
}

@ValidatorConstraint({ name: 'eitherPasswordOrGoogleId', async: false })
class EitherPasswordOrGoogleIdConstraint implements ValidatorConstraintInterface {
    validate(_: any, args: ValidationArguments) {
        const obj = args.object as UserLikeObject;
        return !!(obj.password || obj.googleId);

    }
    defaultMessage(_args: ValidationArguments) {
        return 'حداقل رمز عبور یا گوگل ایدی الزامی است';
    }
}

export class LoginDto {
    @ApiProperty({ example: 'ali' })
    @IsString()
    @MinLength(3, { message: 'نام باید حداقل 3 کاراکتر باشد' })
    @MaxLength(30, { message: 'نام باید حداکثر 30 کاراکتر باشد' })
    username!: string;

    @ApiProperty({ example: 'ali@example.com' })
    @IsEmail({}, { message: 'ایمیل معتبر نیست' })
    email!: string;

    @ApiProperty({ example: '123', required: false, description: 'There is no need for a password when the user logs in with a Google account.' })
    @IsString()
    password?: string;

    @ApiProperty({ example: '710927351', required: false, description: 'There is no need for a googleId when the user logs in with a Password.' })
    @IsString()
    googleId?: string;

    @Validate(EitherPasswordOrGoogleIdConstraint)
    dummyFieldForValidation?: string;
}
