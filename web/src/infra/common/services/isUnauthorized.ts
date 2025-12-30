import { ApolloError } from '@apollo/client';

/**
 * Returns true if an Apollo error indicates the user is not authenticated.
 *
 * We support multiple shapes because different parts of the app (and/or Apollo)
 * may surface the HTTP status code differently:
 * - error.extensions.exception.status (legacy)
 * - error.extensions.originalError.statusCode (Nest / GraphQL)
 * - error.extensions.code === 'UNAUTHENTICATED' (GraphQL spec-ish)
 * - networkError (HTTP 401)
 */
export function isUnauthorizedApolloError(err: unknown): boolean {
  const apolloErr = err as ApolloError | undefined;

  // 1) GraphQL errors array
  const graphQLErrors = apolloErr?.graphQLErrors ?? [];
  for (const gqlErr of graphQLErrors as any[]) {
    const code = gqlErr?.extensions?.code;
    const exceptionStatus = gqlErr?.extensions?.exception?.status;
    const originalStatusCode = gqlErr?.extensions?.originalError?.statusCode;
    if (code === 'UNAUTHENTICATED' || exceptionStatus === 401 || originalStatusCode === 401) {
      return true;
    }
  }

  // 2) networkError (REST-ish / transport layer)
  const networkError: any = apolloErr?.networkError;
  const statusCode = networkError?.statusCode ?? networkError?.status;
  if (statusCode === 401) {
    return true;
  }

  // 3) Some call sites may pass a raw GraphQL response / error object
  const anyErr: any = err;
  if (anyErr?.extensions?.code === 'UNAUTHENTICATED') return true;
  if (anyErr?.extensions?.exception?.status === 401) return true;
  if (anyErr?.extensions?.originalError?.statusCode === 401) return true;

  return false;
}

