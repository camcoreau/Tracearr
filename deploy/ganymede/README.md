# CamCore Tracearr on Ganymede

This stack deploys the CamCore-branded Tracearr application on the Ganymede Operations Host with separate TimescaleDB and Redis containers.

The application joins Ganymede's existing external `npm-backend` network. Only the Tracearr web container is reachable by Nginx Proxy Manager; the database and Redis services remain isolated on an internal Docker network.

## Prerequisites

- Docker Engine and Docker Compose on Ganymede
- Existing Docker network named `npm-backend`
- Access to `ghcr.io/camcoreau/tracearr:latest`
- Internal DNS record for `tracearr.camcore.network`

Confirm the proxy network exists:

```bash
docker network inspect npm-backend >/dev/null
```

## First deployment

```bash
cd /opt/camcore
sudo git clone https://github.com/camcoreau/Tracearr.git tracearr-source
cd /opt/camcore/tracearr-source/deploy/ganymede

cat > .env <<EOF
TZ=Australia/Melbourne
CORS_ORIGIN=https://tracearr.camcore.network
LOG_LEVEL=info
DB_PASSWORD=$(openssl rand -hex 32)
JWT_SECRET=$(openssl rand -hex 32)
COOKIE_SECRET=$(openssl rand -hex 32)
EOF

sudo docker compose pull
sudo docker compose up -d
sudo docker compose ps
```

Keep the generated `.env` file private and do not regenerate its values during routine updates.

## Nginx Proxy Manager

Create an internal proxy host with these settings:

- Domain: `tracearr.camcore.network`
- Scheme: `http`
- Forward hostname: `camcore-tracearr`
- Forward port: `3000`
- Websockets support: enabled
- Block common exploits: enabled
- SSL: use the normal CamCore internal certificate configuration

No host port is published because Nginx Proxy Manager reaches Tracearr directly through `npm-backend`.

## Verify

```bash
sudo docker compose ps
sudo docker logs --tail 100 camcore-tracearr
sudo docker exec camcore-tracearr curl -fsS http://127.0.0.1:3000/health
```

Then open `https://tracearr.camcore.network` and complete the initial administrator setup before connecting Cameron-Media Plex.

## Update

```bash
cd /opt/camcore/tracearr-source
sudo git pull
cd deploy/ganymede
sudo docker compose pull
sudo docker compose up -d
sudo docker image prune -f
```

## Back up

Tracearr stores its primary data in the named volumes:

- `camcore-tracearr-database`
- `camcore-tracearr-redis`
- `camcore-tracearr-backups`

Back up the database volume and the Tracearr backup volume before major upgrades.
