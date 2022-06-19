interface Env {
  __STATIC_CONTENT: KVNamespace

  POLL: DurableObjectNamespace
  USER: KVNamespace

  SESSION_SECRET: string
}
