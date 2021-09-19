# microservices-training
There are two separate projects in here the blog app and the ticketing app.

## Ticketing app

###Services
**Auth**(node + mongodb) --Uses--> NATS Streaming Server

**Tickets**(node + mongodb) --Uses--> NATS Streaming Server

**Orders**(node + mongodb) --Uses--> NATS Streaming Server

**Payment**(node + mongodb) --Uses--> NATS Streaming Server

**Expiration**(node + redis) --Uses--> NATS Streaming Server

### Deployment
TODO: create a terraform deployment to AWS and/or Google cloud with kustomization (dev and prod)

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

# Enable metric server
minikube addons enable metrics-server
```

