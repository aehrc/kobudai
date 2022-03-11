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

import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {AutomapDialogComponent} from './automap-dialog.component';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('AutomapDialogComponent', () => {
  let component: AutomapDialogComponent;
  let fixture: ComponentFixture<AutomapDialogComponent>;
  let el: DebugElement;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  const test_title = 'test title';
  const test_message = 'test message';
  const test_button = 'OK';
  const test_cancel = 'CANCEL';
  const test_automapPercent = 0;
  const test_error = 'I AM AN ERROR';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutomapDialogComponent],
      imports: [MatDialogModule],
      providers: [
        {provide: MatDialogRef, useValue: mockDialogRef},
        {
          provide: MAT_DIALOG_DATA, useValue: {
            title: test_title,
            message: test_message,
            button: test_button,
            cancel: test_cancel,
            automapPercent: test_automapPercent,
            error: test_error
          }
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomapDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain title', () => {
    expect(component.data.title).toBe(test_title);
  });

  it('should contain message', () => {
    expect(component.data.message).toBe(test_message);
  });

  it('should contain button text', () => {
    expect(component.data.button).toBe(test_button);
  });

  it('should contain progress bar', () => {
    expect(component.data.automapPercent).toBe(test_automapPercent);
    const expected_increase = test_automapPercent + 50;
    component.data.automapPercent += 50;
    expect(component.data.automapPercent).toBe(expected_increase);
  });

  it('should show OK button', () => {
    el = fixture.debugElement.query(By.css('button'));
    expect(el).toBeTruthy();
    expect(el.nativeElement.textContent).toBe(test_button);
  });
});
