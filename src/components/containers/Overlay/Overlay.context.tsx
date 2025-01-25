import { createContext } from '../../../signals/createContext.tsx';

export const [useOverlayId, OverlayIdProvider] = createContext((props: { id: string }) => props.id);
