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

import {Component, Inject, OnInit} from '@angular/core';
import {APP_CONFIG, AppConfig} from '../app.config';
import {FeedbackWidgetComponent} from "../feedback-widget/feedback-widget.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  provider: string;
  providerUrl: string;
  tos: string;
  privacy: string;
  canFeedback: boolean;

  constructor(@Inject(APP_CONFIG) private config: AppConfig, public dialog: MatDialog) {
    this.provider = config.provider;
    this.providerUrl = config.providerUrl;
    this.tos = config.termsOfServiceUrl;
    this.privacy = config.privacyPolicyUrl;
    this.canFeedback = !!config.feedbackUrl;
  }

  ngOnInit(): void {
  }

  showFeedback() : boolean{
    this.dialog.open(FeedbackWidgetComponent, {
      height: '600px',
      width: '800px',
      closeOnNavigation: true
    });
    return false;
  }
}

