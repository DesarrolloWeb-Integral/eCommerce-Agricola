import { useState } from 'react';

import { useToast } from '../../../shared/hooks/useToast';
import { getUserById } from '../services';
import type { UserProfile } from '../types';

interface UseGetUserByIdReturn {
  user: UserProfile | null;
  getUser: (userId: string) => Promise<void>;
}

export function useGetUserById(): UseGetUserByIdReturn {
  const [user, setUser] = useState<UserProfile | null>(null);
  const { showToast } = useToast();

  async function getUser(userId: string): Promise<void> {
    setUser(null);

    try {
      const userProfile = await getUserById(userId);

      setUser(userProfile);

      showToast('Usuario obtenido correctamente.', {
        type: 'success',
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Ocurrió un error al obtener el usuario.';

      showToast(message, {
        type: 'error',
      });
    }
  }

  return {
    user,
    getUser,
  };
}
