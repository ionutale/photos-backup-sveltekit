photos gcp service

IaC with terraform
GC Storage
Cloud run
Mongodb


# REST API

## Create image with width and height

```
curl --location 'http://localhost:5173/api/images?filename=rb43-Pizzeria-La-Vecchianella-dishes.jpg&q=80&w=500&h=450&fm=avif'
```

## Create image with crop
```
curl --location 'http://localhost:5173/api/images?filename=rb43-Pizzeria-La-Vecchianella-dishes.jpg&q=80&w=300&h=100&fm=avif&cx=80&cy=180'
```