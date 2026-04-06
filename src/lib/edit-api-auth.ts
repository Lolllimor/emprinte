import { timingSafeEqual } from 'crypto';

import { NextResponse } from 'next/server';

/** Server-side secret: EDIT_API_TOKEN or NEXT_PUBLIC_EDIT_API_TOKEN for small setups. */
export function getExpectedEditToken(): string | undefined {
  const a = process.env.EDIT_API_TOKEN?.trim();
  const b = process.env.NEXT_PUBLIC_EDIT_API_TOKEN?.trim();
  return a || b;
}

/**
 * Require Bearer or X-Edit-Token matching getExpectedEditToken().
 * Returns a NextResponse error, or null if authorized.
 */
export function requireEditApiAuth(request: Request): NextResponse | null {
  const expected = getExpectedEditToken();
  if (!expected) {
    return NextResponse.json(
      {
        error: 'Server misconfigured',
        message:
          'Set EDIT_API_TOKEN in the environment (and NEXT_PUBLIC_EDIT_API_TOKEN for the admin UI if needed).',
      },
      { status: 503 },
    );
  }

  const auth = request.headers.get('authorization');
  const xToken = request.headers.get('x-edit-token');
  let provided: string | undefined;
  if (auth?.toLowerCase().startsWith('bearer ')) {
    provided = auth.slice(7).trim();
  } else if (xToken?.trim()) {
    provided = xToken.trim();
  }

  if (!provided) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message:
          'Missing edit token. Use Authorization: Bearer <token> or X-Edit-Token.',
      },
      { status: 401 },
    );
  }

  try {
    const aBuf = Buffer.from(provided, 'utf8');
    const bBuf = Buffer.from(expected, 'utf8');
    if (aBuf.length !== bBuf.length || !timingSafeEqual(aBuf, bBuf)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Invalid edit token.' },
        { status: 401 },
      );
    }
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return null;
}
