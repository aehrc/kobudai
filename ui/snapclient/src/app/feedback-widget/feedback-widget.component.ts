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

import { Component, Inject, OnInit, SecurityContext } from '@angular/core';
import {APP_CONFIG, AppConfig} from '../app.config';
import {MatDialogRef} from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-feedback-widget',
  templateUrl: './feedback-widget.component.html',
  styleUrls: ['./feedback-widget.component.css']
})
export class FeedbackWidgetComponent implements OnInit {
  feedbackUrl: SafeResourceUrl | null;

  constructor(@Inject(APP_CONFIG) private config: AppConfig,
              private sanitizer: DomSanitizer,
              public dialogRef: MatDialogRef<FeedbackWidgetComponent>) {
    const sanitizedUrl = sanitizer.sanitize(SecurityContext.URL, config.feedbackUrl);
    this.feedbackUrl = sanitizedUrl && sanitizer.bypassSecurityTrustResourceUrl(sanitizedUrl);
  }

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRef.close();
  }
}
