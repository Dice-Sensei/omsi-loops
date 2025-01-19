export namespace Base64 {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  export const encode = (value: string | object): string => {
    const str = typeof value === 'string' ? value : JSON.stringify(value);
    const bytes = encoder.encode(str);

    let binary = '';
    for (let i = 0; i < bytes.length; ++i) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  export const decode = <T = string>(value: string): T => {
    try {
      const binary = atob(value);

      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; ++i) {
        bytes[i] = binary.charCodeAt(i);
      }

      const str = decoder.decode(bytes);

      try {
        return JSON.parse(str) as T;
      } catch {
        return str as T;
      }
    } catch {
      throw new Error('Invalid Base64 string.');
    }
  };
}
