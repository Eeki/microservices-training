import getConfig from 'next/config'

export const getEnvVariable = (name: string): string => {
  const { publicRuntimeConfig } = getConfig()
  const variable = publicRuntimeConfig[name]

  if (!variable) {
    throw new Error(`Cannot get env variable ${name}`)
  }

  return variable
}
