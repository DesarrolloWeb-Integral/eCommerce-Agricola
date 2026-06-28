import { registerAs } from '@nestjs/config'

function getRequiredEnvironmentVariable(name: string): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`La variable de entorno requerida "${name}" no está definida.`)
  }

  return value
}

export const jwtConfig = registerAs('jwt', () => ({
  accessSecret: getRequiredEnvironmentVariable('JWT_ACCESS_SECRET'),
  accessExpiresIn: getRequiredEnvironmentVariable('JWT_ACCESS_EXPIRES_IN'),
  refreshSecret: getRequiredEnvironmentVariable('JWT_REFRESH_SECRET'),
  refreshExpiresIn: getRequiredEnvironmentVariable('JWT_REFRESH_EXPIRES_IN'),
}))
