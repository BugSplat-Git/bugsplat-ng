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
        <h2>Send Feedback</h2>
        <label for="title">Title</label>
        <input id="title" type="text" [(ngModel)]="title" placeholder="Summarize your feedback" />
        <label for="description">Description</label>
        <textarea id="description" [(ngModel)]="description" rows="4" placeholder="Tell us more..."></textarea>
        <label for="attachment">Attachment (optional)</label>
        <input id="attachment" type="file" (change)="onFileSelected($event)" />
        <div class="actions">
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
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .dialog {
      background: #fff;
      border-radius: 8px;
      padding: 24px;
      width: 400px;
      max-width: 90vw;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
    }
    .dialog h2 {
      margin: 0 0 8px;
    }
    label {
      font-weight: 600;
      font-size: 0.85rem;
      text-align: left;
    }
    input[type="text"], textarea {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-family: inherit;
      font-size: 0.9rem;
    }
    textarea {
      resize: vertical;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 8px;
    }
    .btn {
      padding: 8px 20px;
      border-radius: 4px;
      font-size: 0.9rem;
      cursor: pointer;
      width: auto;
    }
    .btn.cancel {
      background: #e1e1e1;
      color: #333;
    }
    .btn.cancel:hover {
      background: #ccc;
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
