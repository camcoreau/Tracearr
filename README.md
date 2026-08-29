# CamCore Tracearr

Private streaming-access monitoring and policy visibility for Cameron-Media,
maintained for **CamCore — Cameron Family Secure Network**.

[![CI](https://github.com/camcoreau/Tracearr/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/camcoreau/Tracearr/actions/workflows/ci.yml)
[![CamCore image](https://github.com/camcoreau/Tracearr/actions/workflows/camcore-image.yml/badge.svg?branch=main)](https://github.com/camcoreau/Tracearr/actions/workflows/camcore-image.yml)
[![Licence: AGPL-3.0](https://img.shields.io/badge/licence-AGPL--3.0-blue.svg)](LICENSE)

> **CamCore is a privately owned and operated family technology network that
> delivers secure, reliable and professionally managed digital services for the
> Cameron household, Cameron-Media and associated family operations.**

**Built for Home. Engineered Like Enterprise.**

## Service identity

| Surface         | CamCore contract                                                      |
| --------------- | --------------------------------------------------------------------- |
| Service         | CamCore Tracearr                                                      |
| Service family  | CamCore Infrastructure / Cameron-Media                                |
| Purpose         | Private streaming-access monitoring, analytics and policy enforcement |
| Private route   | `https://tracearr.camcore.network`                                    |
| Runtime host    | Ganymede Operations Host                                              |
| Container image | `ghcr.io/camcoreau/tracearr`                                          |
| Health endpoint | `/health` on the application container                                |
| Support         | `https://camcore.au/support`                                          |

Tracearr brings Plex, Jellyfin and Emby activity into one interface. Its
upstream functionality includes live sessions, playback and library analytics,
stream mapping, alerts, trust scoring and account-sharing detection. CamCore's
current deployment contract is centred on Cameron-Media Plex.

## CamCore-maintained downstream

The CamCore layer is deliberately narrow and reviewable:

- CamCore browser, logo, favicon and PWA identity;
- Cameron-Media-oriented service descriptions;
- a CamCore GHCR image workflow;
- a Ganymede Compose deployment with explicit network and storage boundaries;
- environment examples, health checks, backup guidance and rollback targets.

The underlying application is developed by the
[Tracearr project](https://github.com/connorgallopo/Tracearr). CamCore does not
claim authorship of the upstream application or its documentation.

## Repository, image, deployment and live state

These states are related, but they are not interchangeable:

| State           | What it proves                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------------- |
| Repository      | The default branch contains reviewed source, branding and a deployment contract.                                 |
| Published image | The image workflow completed and pushed `latest` and `sha-*` tags for that revision.                             |
| Deployment      | A specific image tag or digest was applied on Ganymede with the required networks, secrets and volumes.          |
| Live service    | The private route and `/health` endpoint were checked after deployment and the expected data remained available. |

A commit or merged pull request does not prove deployment or live health. The
CamCore image workflow currently runs on every push to `main`, including a
documentation-only merge, so workflow completion must be reported separately
from an intentional production rollout.

## Runtime architecture

The source-controlled deployment is defined in
[`deploy/ganymede/compose.yaml`](deploy/ganymede/compose.yaml).

```text
Private client
     |
     v
Nginx Proxy Manager on npm-backend
     |
     v
CamCore Tracearr :3000
     |
     +-- PostgreSQL 18.1 / TimescaleDB 2.25.0
     |
     +-- Redis 8
         (data services remain on an internal network)
```

Only the Tracearr application joins the existing external `npm-backend`
network. TimescaleDB and Redis remain on the internal
`camcore-tracearr-internal` network. The Compose contract publishes no host
port; Nginx Proxy Manager reaches the application directly through
`npm-backend`.

Persistent state uses these named volumes:

| Volume                      | Purpose                      |
| --------------------------- | ---------------------------- |
| `camcore-tracearr-database` | TimescaleDB application data |
| `camcore-tracearr-redis`    | Redis persistence            |
| `camcore-tracearr-backups`  | Tracearr-created backups     |

## Image and release contract

Successful builds publish:

```text
ghcr.io/camcoreau/tracearr:latest
ghcr.io/camcoreau/tracearr:sha-<commit>
```

The current Compose contract defaults to the mutable `latest` tag. That is a
source fact, not evidence that the latest image has been deployed.

For a controlled update:

1. confirm the workflow completed for the intended commit;
2. record the currently deployed image tag and digest;
3. prefer the corresponding `sha-*` tag as the immutable test and rollback
   reference;
4. back up persistent data before a material upgrade;
5. apply the image without replacing the existing volumes or networks;
6. verify the container, health endpoint and private route.

## Security boundary

- Tracearr is an administrator-operated private service. Do not expose its
  route as a public CamCore service.
- The web container is the only service attached to `npm-backend`; the database
  and Redis services stay isolated.
- Keep `DB_PASSWORD`, `JWT_SECRET` and `COOKIE_SECRET` in the deployment secret
  store or private `.env` file. Never commit populated values.
- Protect streaming history, IP/geolocation information, user details, API keys
  and backups as sensitive operational data.
- Complete the initial administrator setup before connecting Cameron-Media
  Plex.
- Report source-security issues according to [`SECURITY.md`](SECURITY.md).

## Deployment

The complete procedure is in the
[Ganymede deployment guide](deploy/ganymede/README.md). At minimum:

1. confirm Docker, Docker Compose and the external `npm-backend` network are
   present;
2. back up the existing database and Tracearr backup volumes;
3. record the current image tag or digest;
4. create a private `.env` from
   [`deploy/ganymede/.env.example`](deploy/ganymede/.env.example) and generate
   distinct random values for every required secret;
5. validate the rendered Compose configuration;
6. pull and start the intended image;
7. verify the application before treating the rollout as complete.

```bash
cd deploy/ganymede
docker compose --env-file .env config
docker compose pull
docker compose up -d
docker compose ps
```

Do not regenerate deployment secrets during a routine update.

## Verification

Repository validation:

```bash
corepack enable
pnpm install --frozen-lockfile
pnpm format:check
pnpm lint
pnpm typecheck
pnpm translations:check
pnpm test
pnpm build
```

Post-deployment validation on Ganymede:

```bash
docker compose -f deploy/ganymede/compose.yaml ps
docker logs --tail 100 camcore-tracearr
docker exec camcore-tracearr curl -fsS http://127.0.0.1:3000/health
```

Then confirm the private route opens, the expected Cameron-Media connection is
healthy, historical data remains available and the database and Redis do not
publish host ports.

## Backup and rollback

Before a material update, back up `camcore-tracearr-database` and
`camcore-tracearr-backups`; include `camcore-tracearr-redis` when preserving its
durable state is required. Record the deployed image digest alongside the
backup.

To roll back:

1. select the previous known-good `sha-*` tag or digest;
2. keep the same secret values, networks and named volumes;
3. recreate only the Tracearr application with the previous image;
4. restore persistent data only when an incompatible migration requires it;
5. repeat the container, `/health`, private-route and data checks.

## Repository map

| Path                                                                         | Purpose                                         |
| ---------------------------------------------------------------------------- | ----------------------------------------------- |
| [`apps/web/`](apps/web/)                                                     | Tracearr web interface and CamCore identity     |
| [`apps/server/`](apps/server/)                                               | Tracearr API and background services            |
| [`deploy/ganymede/`](deploy/ganymede/)                                       | CamCore deployment contract and operating guide |
| [`docker/`](docker/)                                                         | Upstream container and development definitions  |
| [`.github/workflows/camcore-image.yml`](.github/workflows/camcore-image.yml) | CamCore image publication                       |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml)                       | Linting, type checking and automated tests      |

## Support, ownership and upstream

For CamCore deployment, access or operational matters, use
[CamCore Support](https://camcore.au/support).

For general application behaviour, documentation and upstream defects, use the
Tracearr project's resources:

- [Source repository](https://github.com/connorgallopo/Tracearr)
- [Documentation](https://docs.tracearr.com)
- [Issue tracker](https://github.com/connorgallopo/Tracearr/issues)
- [Releases](https://github.com/connorgallopo/Tracearr/releases)

CamCore maintains only its downstream branding, image workflow, deployment
contract and operational guidance. Tracearr and its original source remain the
work of Connor Gallopo and upstream contributors.

## Licence

This downstream remains subject to the upstream
[GNU Affero General Public License v3.0](LICENSE). Retain the upstream licence,
copyright notices and source availability when distributing modified builds.
