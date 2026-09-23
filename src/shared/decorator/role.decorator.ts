import { SetMetadata } from '@nestjs/common';

import { UserRole } from 'src/auth/enum/enum.auth';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);
