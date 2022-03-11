import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {ConfirmDialogComponent} from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  const mockDialogRef = {
    close: jasmine.createSpy('close')
  };

  const test_title = 'test title';
  const test_message = 'test message';
  const test_button = 'OK';
  const test_cancel = 'CANCEL';
  const test_type = 'CONFIRM';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmDialogComponent],
      imports: [MatDialogModule],
      providers: [
        {provide: MatDialogRef, useValue: mockDialogRef},
        {
          provide: MAT_DIALOG_DATA, useValue: {
            title: test_title,
            message: test_message,
            button: test_button,
            cancel: test_cancel,
            type: test_type
          }
        },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogComponent);
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
});
