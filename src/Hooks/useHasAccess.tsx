import { getPermissions } from '../Utils/Roles';
import { useAuth } from './useAuth';
import { isNull } from 'lodash';
export const useHasAccess = () => {
  const { user } = useAuth();
  const hasPermissions = (Roles: string[]) => {
    if (!user.role) {
      return false;
    }
    if (user) {
      return user?.permissions && user?.permissions?.length > 0
        ? user?.permissions?.includes(Roles[0])
        : getPermissions[user.role].includes(Roles[0]);
    } else {
      return false;
    }
  };

  const hasRole = (role: string) => {
    return true;
  };

  return {
    hasPermissions,
    hasRole,
  };
};
