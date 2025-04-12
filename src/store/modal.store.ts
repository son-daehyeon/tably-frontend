import { create } from 'zustand';

type Modal =
  | 'space'
  | 'reserve'
  | 'reservation-detail'
  | 'reservation-cancel'
  | 'return-picture'
  | 'upload-return-picture';

interface Type<T = unknown> {
  modal: Modal | null;
  props?: T;
}

interface Action {
  open: <T>(modal: Modal, props?: T) => void;
  close: () => void;
}

const initialState: Type = {
  modal: null,
  props: undefined,
};

export const useModalStore = create<Type & Action>((set) => ({
  ...initialState,
  open: (modal, props) => set({ modal, props }),
  close: () => set({ modal: null }),
}));
