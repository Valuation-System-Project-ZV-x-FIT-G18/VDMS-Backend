import { SetMetadata } from '@nestjs/common';
import { ManagerRole } from '../../entities/manager.entity';

export const Roles = (...roles: ManagerRole[]) => SetMetadata('roles', roles);
