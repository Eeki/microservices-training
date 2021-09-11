# microservices-training
There are two separate projects in here the blog app and the ticketing app.


## Docker
Remember to push images to docker hub. In microservice dir:

`docker build -t eeki/<microservice_name> .`

`docker push eeki/<microservice_name>`

## Npm
When publishing new npm package use following command:
`npm publish --access public`
