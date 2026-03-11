import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FeedbackData {
  title: string;
  description: string;
  attachments: File[];
}

@Component({
  selector: 'app-feedback-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="overlay" (click)="close.emit()">
      <div class="dialog" (click)="$event.stopPropagation()">
        <div class="dialog-header">
          <h2>Send Feedback</h2>
        </div>
        <div class="dialog-body">
          <label for="title">Title</label>
          <input id="title" type="text" [(ngModel)]="title" placeholder="Summarize your feedback" />
          <label for="description">Description</label>
          <textarea id="description" [(ngModel)]="description" rows="4" placeholder="Tell us more..."></textarea>
          <label for="attachment">Attachment (optional)</label>
          <input id="attachment" type="file" (change)="onFileSelected($event)" />
        </div>
        <div class="dialog-footer">
          <button class="btn cancel" (click)="close.emit()">Cancel</button>
          <button class="btn submit" [disabled]="!title.trim()" (click)="onSubmit()">Submit</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .dialog {
      background: #fff;
      width: 440px;
      max-width: 90vw;
      box-shadow: 0.3em 0.3em 1em rgba(0, 0, 0, 0.3);
      overflow: hidden;
    }
    .dialog-header {
      padding: 20px 24px 12px;
      text-align: center;
    }
    .dialog-header h2 {
      margin: 0;
      color: #007bff;
    }
    .dialog-body {
      padding: 0 24px 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    label {
      font-weight: 600;
      font-size: 0.85rem;
      text-align: left;
      margin-top: 4px;
    }
    input[type="text"], textarea {
      width: 100%;
      padding: 10px;
      border: 2px solid rgb(225, 225, 225);
      font-family: inherit;
      font-size: 0.9rem;
      transition: 220ms all ease-in-out;
    }
    input[type="text"]:focus, textarea:focus {
      outline: none;
      border-color: #007bff;
    }
    textarea {
      resize: vertical;
    }
    input[type="file"] {
      font-family: inherit;
      font-size: 0.85rem;
    }
    .dialog-footer {
      background: rgb(225, 225, 225);
      padding: 16px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
    .btn {
      padding: 10px 24px;
      font-size: 0.9rem;
      font-family: inherit;
      cursor: pointer;
      border: none;
      transition: 220ms all ease-in-out;
      width: auto;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .btn.cancel {
      background: #fff;
      color: #333;
    }
    .btn.cancel:hover {
      background: rgb(245, 245, 245);
    }
    .btn.submit {
      background: #007bff;
      color: #fff;
    }
    .btn.submit:hover {
      background: #0056b3;
    }
    .btn.submit:disabled {
      background: #99c9ff;
      cursor: not-allowed;
    }
  `]
})
export class FeedbackDialogComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<FeedbackData>();

  title = '';
  description = '';
  attachments: File[] = [];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.attachments = Array.from(input.files);
    }
  }

  onSubmit(): void {
    this.submit.emit({
      title: this.title,
      description: this.description,
      attachments: this.attachments,
    });
  }
}
