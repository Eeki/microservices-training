import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { NextPageContext } from 'next'
import { getEnvVariable } from '../libs/env'

const buildClient = ({ req }: NextPageContext): AxiosInstance => {
  const options: AxiosRequestConfig =
    typeof window === 'undefined'
      ? // We are on the server
        {
          baseURL: getEnvVariable('INGRESS_ADDRESS'),
          headers: req?.headers,
        }
      : // We are on the browser
        {}
  return axios.create(options)
}

export default buildClient
