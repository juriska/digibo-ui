export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export const initialLoadingState: LoadingState = {
  loading: false,
  error: null
};
