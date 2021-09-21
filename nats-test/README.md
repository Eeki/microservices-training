# NATS test
## This project is just for testing the NATS steaming server technology

To get this working you need to do a temporary port forwarding to the nats pod port 4222 to localhost e.g
```shell
# 1. get the nats pod name
kubectl get pods

# 2. Do the port forwarding
kubectl port-forward nats-depl-XXX-XXX 4222:4222
```

***Note!***
Nats streaming server monitoring is running in `<hostname>:8222/streaming`
e.g: http://localhost:8222/streaming

Some detail information for the subscriptions e.g:
http://localhost:8222/streaming/channelsz?subs=1
