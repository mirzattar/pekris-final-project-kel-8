# pekris-final-project-kel-8

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run 
```

To type check:

```bash
bun check
```

## API configuration

The client uses `http://localhost:3000` during development and the deployed API in production. Set `VITE_API_URL` to override the base URL. The API server's `CORS_ORIGIN` must allow the client origin.

Run `bun fmt` to format the code.

This project was created using `bun init` in bun v1.4.5. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
