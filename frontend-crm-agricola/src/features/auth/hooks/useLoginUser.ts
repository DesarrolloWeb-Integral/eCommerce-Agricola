import { useToast } from '../../../shared/hooks/useToast';
import { loginUser } from '../services';
import type { AuthenticatedUser, LoginUserData } from '../types';
import { useAuth } from './useAuth';

interface UseLoginUserReturn {
  login: (userData: LoginUserData) => Promise<AuthenticatedUser | null>;
}

export function useLoginUser(): UseLoginUserReturn {
  const { showToast } = useToast();
  const { loginSession } = useAuth();

  async function login(userData: LoginUserData): Promise<AuthenticatedUser | null> {
    try {
      await loginUser(userData);

      const authenticatedUser = await loginSession();

      showToast('Inicio de sesión exitoso.', {
        type: 'success',
      });

      return authenticatedUser;
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Ocurrió un error al iniciar sesión.';

      showToast(message, {
        type: 'error',
      });

      return null;
    }
  }

  return {
    login,
  };
}
