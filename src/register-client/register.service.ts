import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { LoanApplicant } from '../entities/loan-applicant.entity';
import { UserRole } from '../enums/user-role.enum';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class RegisterService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(LoanApplicant)
    private readonly loanRepo: Repository<LoanApplicant>,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.userRepo.findOne({
      where: [{ nic: dto.nic }, { email: dto.email }],
    });
    if (existingUser) {
      if (existingUser.role !== UserRole.LOAN_APPLICANT) {
        throw new ConflictException('A user with this NIC or email already exists');
      }

      const existingApplicant = await this.loanRepo.findOne({
        where: { user: { user_id: existingUser.user_id } },
        relations: ['user'],
      });

      return {
        success: true,
        userId: existingUser.user_id,
        loanApplicantId: existingApplicant?.loan_applicant_id ?? null,
        message: 'Loan applicant already exists',
      };
    }

    /* Generate next user ID like usr001, usr002, ... */
    const userCount = await this.userRepo.count();
    const userId = `usr${String(userCount + 1).padStart(3, '0')}`;

    /* Generate next loan applicant ID like loa001, loa002, ... */
    const loanCount = await this.loanRepo.count();
    const loanId = `loa${String(loanCount + 1).padStart(3, '0')}`;

    /* Hash password before storing */
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    /* Create & save the user record */
    const userData: DeepPartial<User> = {
      user_id: userId,
      nic: dto.nic,
      email: dto.email,
      password: hashedPassword,
      role: UserRole.LOAN_APPLICANT,
      full_name: dto.fullName,
      first_name: dto.firstName,
      last_name: dto.lastName,
      name_with_initials: dto.nameWithInitials,
      date_of_birth: dto.dateOfBirth || undefined,
      phone: dto.phone,
      street_address: dto.streetAddress,
      city: dto.city,
      district: dto.district,
      province: dto.province,
      postal_code: dto.postalCode || undefined,
    };
    const user = this.userRepo.create(userData);
    await this.userRepo.save(user);

    /* Create & save the loan applicant record linked to the user */
    const applicantData: DeepPartial<LoanApplicant> = {
      loan_applicant_id: loanId,
      user,
    };
    const applicant = this.loanRepo.create(applicantData);
    await this.loanRepo.save(applicant);

    return { success: true, userId, loanApplicantId: loanId };
  }
}
