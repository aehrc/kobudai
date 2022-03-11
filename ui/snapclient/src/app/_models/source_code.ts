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

import {Source} from './source';

/** Row from Source containing code to be mapped */
export class SourceCode {
  id?: string;
  code: string;
  display: string;
  source?: Source;
  index: string; // imported row index

  constructor(code: string, display: string, source: Source, index: string) {
    this.code = code;
    this.display = display;
    this.source = source;
    this.index = index;
  }
}
