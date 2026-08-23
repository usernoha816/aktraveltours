/**
 * Safe JSON fetching utility that handles HTML responses, non-JSON responses,
 * network errors, and API error formats without throwing raw JSON parse errors.
 */

export interface ApiResponse<T = any> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

export async function safeFetchJson<T = any>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        ...(options?.headers || {}),
      },
    });

    const contentType = res.headers.get('content-type') || '';
    const text = await res.text();

    let parsedData: any = null;
    if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
      try {
        parsedData = JSON.parse(text);
      } catch (parseErr) {
        console.warn('JSON parse warning:', parseErr);
      }
    }

    if (!parsedData) {
      if (text.includes('<!DOCTYPE') || text.includes('<html') || contentType.includes('text/html')) {
        return {
          ok: false,
          status: res.status,
          error: 'The backend service returned HTML instead of a JSON response. The server may still be initializing.',
        };
      }

      return {
        ok: false,
        status: res.status,
        error: text || `Server returned status ${res.status}`,
      };
    }

    if (!res.ok || parsedData.success === false) {
      return {
        ok: false,
        status: res.status,
        data: parsedData,
        error: parsedData.error || `Request failed with HTTP status ${res.status}`,
      };
    }

    return {
      ok: true,
      status: res.status,
      data: parsedData,
    };
  } catch (networkErr: any) {
    console.error('Fetch network error:', networkErr);
    return {
      ok: false,
      status: 0,
      error: networkErr?.message || 'Network error connecting to the server.',
    };
  }
}
