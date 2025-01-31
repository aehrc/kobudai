/*
 * Copyright © 2022 SNOMED International
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {IAppState} from '../app.state';
import {createSelector} from '@ngrx/store';
import {IFhirState} from './fhir.reducer';

const selectModules = (state: IAppState) => state.fhir;

export const selectReleaseList = createSelector(
    selectModules,
    (state: IFhirState) => state.editionToVersionsMap
);

export const selectConceptSearchList = createSelector(
    selectModules,
    (state: IFhirState) => state.matches
);

export const selectSuggestions = createSelector(
    selectModules,
    (state: IFhirState) => state.suggests
);

export const selectConceptHierarcy = createSelector(
    selectModules,
    (state: IFhirState) => state.nodes
);

export const selectConceptProperties = createSelector(
    selectModules,
    (state: IFhirState) => state.properties
);

export const selectModuleProperties = createSelector(
    selectModules,
    (state: IFhirState) => state.moduleProperties
);

export const selectFhirError = createSelector(
    selectModules,
    (state: IFhirState) => state.errorMessage
);
