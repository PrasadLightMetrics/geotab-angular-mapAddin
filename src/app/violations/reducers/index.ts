import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';

import { reducer as ViolationTableReducer, State as ViolationTableState } from './violation-table.reducers';
import { reducer as AssetViolationTableReducer, State as AssetViolationTableState } from './asset-violation-table.reducers';

export interface State {
  violationFilter: ViolationTableState;
  assetViolationFilter: AssetViolationTableState;
}

export {  ViolationTableState, AssetViolationTableState };

export const reducers: ActionReducerMap<State> = {
  violationFilter: ViolationTableReducer,
  assetViolationFilter: AssetViolationTableReducer,
};

// Selectors
export const getViolationState = createFeatureSelector<State>('Violation');
export const getAssetViolationState = createFeatureSelector<State>('Violation');

export const getViolationTableState = createSelector(getViolationState, (state: State) => state.violationFilter);

export const getAssetViolationTableState = createSelector(getAssetViolationState, (state: State) => state.assetViolationFilter);
