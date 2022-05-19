# mapgl-ruler

Ruler plugin for [Mapgl](https://docs.2gis.com/en/mapgl/overview)

## Usage

Install with NPM

```shell
npm install @2gis/mapgl-ruler
```

### Use ruler directly

Import the Ruler class to your project and use it:

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

### Use ruler via RulerControl

Import the RulerControl class to your project and use it:

```typescript
import { RulerControl } from "@2gis/mapgl-ruler";

const map = new mapgl.Map('container', {
    center: [55.31878, 25.23584],
    zoom: 13,
    key: 'Your API access key',
});

const control = new RulerControl(map, { position: 'centerRight' })
```

## Contributing

Mapgl-ruler uses github-flow to accept & merge fixes and improvements. Basic process is:
- Fork the repo.
- Create a branch.
- Add or fix some code.
- **Run testing suite with `npm run docker:test` and make sure nothing is broken**
- Add some tests for your new code or fix broken tests.
- Commit & push.
- Create a new pull request to original repo.

Pull requests with failing tests will not be accepted.
Also, if you modify packages or add them to `package.json`, make sure you use `npm`, update `package-lock.json` and build new version of base docker image.
## Tests

### Run tests
```shell
npm run docker:test
```

### Update screenshots
```shell
npm run docker:screenshot:update
```
