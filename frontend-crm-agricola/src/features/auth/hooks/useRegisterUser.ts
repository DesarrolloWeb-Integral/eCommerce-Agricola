import { useToast } from '../../../shared/hooks/useToast'
import { registerUser } from '../services/auth.service'
import type { RegisterUserData } from '../types'

interface UseRegisterUserReturn {
  registerNewUser: (userData: RegisterUserData) => Promise<boolean>
}

export function useRegisterUser(): UseRegisterUserReturn {
  const { showToast } = useToast()

  async function registerNewUser(userData: RegisterUserData): Promise<boolean> {
    try {
      const response = await registerUser(userData)

      showToast(response.message, {
        type: 'success',
      })

      return true
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Ocurrió un error al registrar al usuario.'

      showToast(message, {
        type: 'error',
      })

      return false
    }
  }

  return {
    registerNewUser,
  }
}
