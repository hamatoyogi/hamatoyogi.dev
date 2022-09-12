# hamatoyogi dot dev

The codebase behind hamatoyogi.dev

---

### Creating components

Place new components inside the `/src/components` directory.

We **highly recommend** for you to follow a directory-based approach when creating new components. That is, create a new directory inside of `/src/components` such as `/src/components/HelloWorld`, then place your component logic inside. The structure should look like this:

```
components
└── HelloWorld
    ├── HelloWorld.astro
    └── index.ts
```

You'll notice we also threw in a `index.ts` file. This is where you should export the component as a **named export**:

```ts
// index.ts

export { default as HelloWorld } from './HelloWorld.astro';
```

Doing a directory-based approach and named export is good for two reasons:

1. It compartamentalizes **all** component logic into discrete folders (including styles or extra scripts)
2. It prevents you from accidently renaming a component later on in the project (named exports help with naming consistency).

When you want to use `<HelloWorld />`, you can import it using our handy-dandy import aliases:

```ts
import { HelloWorld } from '@component/HelloWorld';
```

Again, we'll talk about import aliasing in more detail in a bit!

---
