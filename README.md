# microservices-training
There are two separate projects in here the blog app and the ticketing app.

## Ticketing app

###Services
**Auth**(node + mongodb) --Uses--> NATS Streaming Server

**Tickets**(node + mongodb) --Uses--> NATS Streaming Server

**Orders**(node + mongodb) --Uses--> NATS Streaming Server

**Payment**(node + mongodb) --Uses--> NATS Streaming Server

**Expiration**(node + redis) --Uses--> NATS Streaming Server

## Docker
Remember to push images to docker hub. In microservice dir:

`docker build -t eeki/<microservice_name> .`

`docker push eeki/<microservice_name>`

## Npm
When publishing new npm package use following command:
`npm publish --access public`

## Kubernetes Secrets
In dev you need to set jwt key as secret to k8s e.g:
```shell
kubectl create secret generic jwt-secret --from-literal=JWT_KEY=supersecret
kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=<stripe_secret_key>
```
## Minikube development

```shell
# Install minikube
brew install minikube

# Configure minikube
minikube config set driver virtualbox
minikube config set disk-size 30GB

# You can see all the available minikube settings
minikube config -h

# Check that minikube configures are ok
minikube config view

# Start minikube
minikube start

# Show minikube info
vboxmanage showvminfo minikube

# Enable ingress controller
minikube addons enable ingress

# Enable metric server
minikube addons enable metrics-server

# Bind minikube ip address to some specific url (ticketing.dev):
# 1. Get your minikube ip
minikube ip
# 2. Add the following line to /etc/hosts
# <minkube_ip> ticketing.dev

```

### TODO
- create a terraform deployment to AWS and/or Google cloud with kustomization (dev and prod)
- Because nats streaming server is deprecated (https://github.com/nats-io/nats-streaming-server#warning--deprecation-notice-warning)
change to some other messaging system e.g JetStream or kafka
- Add Kustomize to kubernetes
