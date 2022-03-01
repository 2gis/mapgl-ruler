# mapgl-ruler

Ruler plugin for [Mapgl](https://docs.2gis.com/en/mapgl/overview)

## Usage

Install with NPM

```shell
npm install mapgl-ruler
```

Import the RulerClass to your project and use it:

```typescript
import { Ruler } from '@2gis/mapgl-ruler';

const map = new mapgl.Map('container', {
    center: [55.31878, 25.23584],
    zoom: 13,
    key: 'Your API access key',
});

const ruler = new Ruler(map, { 
    points: [
        [55.31878, 25.23584],
        [55.35878, 25.23584],
        [55.35878, 25.26584],
    ]
});
```

## Contributing

Mapgl-ruler uses github-flow to accept & merge fixes and improvements. Basic process is:
- Fork the repo.
- Create a branch.
- Add or fix some code.
- **Run testing suite with `npm run test` and make sure nothing is broken**
- Add some tests for your new code or fix broken tests.
- Run `npm run build` to build distribution files.
- Commit & push.
- Create a new pull request to original repo.

Pull requests with failing tests will not be accepted. Also, if you add or modify packages to `package.json`, make sure you use `npm` and update `package-lock.lock`.

## Tests

### Run tests
```shell
docker-compose up --build test
```

### Update screenshots
```shell
docker-compose up --build screenshot-update
```
