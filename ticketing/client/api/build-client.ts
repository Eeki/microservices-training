import axios, { AxiosInstance, AxiosRequestConfig } from 'axios'
import { NextPageContext } from 'next'

// TODO do a kubernetes external name service
//  that will map the long url (ingress-nginx-controller.ingress-nginx.svc.cluster.local) to nginx-ingress-srv

const buildClient = ({ req }: NextPageContext): AxiosInstance => {
  const options: AxiosRequestConfig =
    typeof window === 'undefined'
      ? {
          baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
          headers: req?.headers,
        }
      : {}
  return axios.create(options)
}

export default buildClient
