import { useState } from 'react';
import type { Token } from '../types';

interface Props {
  token: Token;
  size?: number;
}

export function TokenIcon({ token, size = 32 }: Props) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!imgFailed) {
    return (
      <img
        src={token.logo}
        alt={token.symbol}
        width={size}
        height={size}
        className="rounded-full object-cover shrink-0"
        onError={() => setImgFailed(true)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white shrink-0"
      style={{ width: size, height: size, background: token.color, fontSize: size * 0.38 }}
    >
      {token.symbol[0]}
    </div>
  );
}
