import { createContext } from 'react';
import type { Dispatch } from 'react';
import type { BundleAction, BundleState } from '../types/bundle';
import type { Product } from '../types/product';

export interface BundleContextValue {
  products: Product[];
  bundle: BundleState;
  initialBundle: BundleState;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  dispatch: Dispatch<BundleAction>;
}

export const BundleContext = createContext<BundleContextValue | undefined>(undefined);