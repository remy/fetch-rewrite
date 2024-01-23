declare enum FetchMethodName {
  JSON = 'json',
  TEXT = 'text',
  ARRAY_BUFFER = 'arrayBuffer',
  BLOB = 'blob',
}

type Modify = {
  [K in FetchMethodName]?: (arg: unknown) => any | Promise<any>;
};

type FetchOptions = {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';
  headers?: Record<string, string>;
  mode?: 'cors' | 'no-cors' | 'same-origin';
  credentials?: 'omit' | 'same-origin' | 'include';
  body?: any;
  cache?:
    | 'default'
    | 'no-store'
    | 'reload'
    | 'no-cache'
    | 'force-cache'
    | 'only-if-cached';
  redirect?: 'follow' | 'error' | 'manual';
  referrer?: string;
  referrerPolicy?:
    | 'no-referrer'
    | 'no-referrer-when-downgrade'
    | 'origin'
    | 'origin-when-cross-origin'
    | 'unsafe-url';
  keepalive?: boolean;
  signal?: AbortSignal | null;
  priority?: 'auto' | 'high' | 'low';
};

type RewriteFunction = (
  fetch: (
    resource: string | URL | Request,
    options?: FetchOptions
  ) => Promise<Response>,
  resource: string | URL | Request,
  options?: FetchOptions
) => string | URL;

type WithModify = { modify: Modify; rewrite?: never };
type WithRewrite = { rewrite: string | URL | RewriteFunction; modify?: never };

type Base = {
  query?: string | RegExp;
  path?: string | RegExp;
  origin?: string | RegExp;
};

// FIXME this doesn't work and I don't really know TS tell enough to know why
type AtLeastOne<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  U[keyof U];

type QueryPathOrigin = AtLeastOne<Base>;

export type Rule = QueryPathOrigin & (WithModify | WithRewrite);

export type Rules = Rule[];
