import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InterviewService } from '../../../core/services/interview.service';
import { Interview } from '../../../core/models/interview.model';
import { Question } from '../../../core/models/question.model';

@Component({
  selector: 'app-interview-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="interview-container" *ngIf="interview">
      <div class="header">
        <h1>{{ interview.title }}</h1>
        <p class="description">{{ interview.description }}</p>
        <div class="progress-bar">
          <div class="progress-fill" [style.width.%]="getProgressPercentage()"></div>
        </div>
        <p class="progress-text">{{ currentQuestion + 1 }} di {{ interview.questions.length }} domande</p>
      </div>
      
      <div class="question-section" *ngIf="currentQuestionObject">
        <div class="question-header">
          <h2>{{ currentQuestionObject.title }}</h2>
          <span class="question-number">Domanda {{ currentQuestion + 1 }}/{{ interview.questions.length }}</span>
        </div>
        
        <p class="question-description" *ngIf="currentQuestionObject.description">
          {{ currentQuestionObject.description }}
        </p>
        
        <textarea 
          [(ngModel)]="answers[currentQuestionObject.id]"
          placeholder="Scrivi la tua risposta qui..." 
          class="answer-textarea"
        ></textarea>
        
        <div class="button-group">
          <button 
            (click)="previousQuestion()" 
            [disabled]="currentQuestion === 0"
            class="btn btn-secondary"
          >
            ← Precedente
          </button>
          
          <button 
            (click)="saveAnswer()"
            class="btn btn-primary"
          >
            💾 Salva Risposta
          </button>
          
          <button 
            (click)="nextQuestion()" 
            [disabled]="currentQuestion === interview.questions.length - 1"
            class="btn btn-secondary"
          >
            Successiva →
          </button>
        </div>
      </div>
      
      <div class="completion-section" *ngIf="currentQuestion === interview.questions.length - 1">
        <h3>📥 Esporta le tue risposte</h3>
        <div class="export-buttons">
          <button (click)="exportJSON()" class="btn btn-success">
            ⬇️ JSON
          </button>
          <button (click)="exportCSV()" class="btn btn-success">
            ⬇️ CSV
          </button>
        </div>
      </div>
    </div>
    
    <div class="loading" *ngIf="!interview">
      Caricamento intervista...
    </div>
  `,
  styles: [`
    .interview-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
    }
    
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    
    .header h1 {
      margin: 0 0 10px 0;
      font-size: 28px;
    }
    
    .description {
      margin: 10px 0;
      opacity: 0.9;
    }
    
    .progress-bar {
      background: rgba(255,255,255,0.3);
      height: 8px;
      border-radius: 4px;
      overflow: hidden;
      margin: 15px 0;
    }
    
    .progress-fill {
      background: white;
      height: 100%;
      transition: width 0.3s ease;
    }
    
    .progress-text {
      font-size: 14px;
      margin: 10px 0 0 0;
    }
    
    .question-section {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 30px;
      margin-bottom: 20px;
    }
    
    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 15px;
    }
    
    .question-header h2 {
      margin: 0;
      color: #333;
      flex: 1;
    }
    
    .question-number {
      background: #007bff;
      color: white;
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      white-space: nowrap;
    }
    
    .question-description {
      color: #666;
      font-size: 14px;
      line-height: 1.6;
      margin: 15px 0;
      background: #f9f9f9;
      padding: 15px;
      border-left: 4px solid #007bff;
      border-radius: 4px;
    }
    
    .answer-textarea {
      width: 100%;
      min-height: 200px;
      padding: 15px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: 'Monaco', 'Courier New', monospace;
      font-size: 14px;
      resize: vertical;
      box-sizing: border-box;
      line-height: 1.5;
    }
    
    .answer-textarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0,123,255,0.1);
    }
    
    .button-group {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    
    .btn {
      flex: 1;
      padding: 12px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .btn-primary {
      background: #007bff;
      color: white;
    }
    
    .btn-primary:hover:not(:disabled) {
      background: #0056b3;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    
    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
    }
    
    .completion-section {
      background: #d4edda;
      border: 1px solid #c3e6cb;
      border-radius: 8px;
      padding: 20px;
      margin-top: 20px;
      text-align: center;
    }
    
    .completion-section h3 {
      color: #155724;
      margin-top: 0;
    }
    
    .export-buttons {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    
    .btn-success {
      background: #28a745;
      color: white;
      padding: 10px 20px;
    }
    
    .btn-success:hover {
      background: #218838;
    }
    
    .loading {
      text-align: center;
      padding: 40px;
      color: #999;
      font-size: 16px;
    }
  `]
})
export class InterviewDetailComponent implements OnInit {
  interview: Interview | null = null;
  currentQuestion: number = 0;
  answers: { [key: number]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private interviewService: InterviewService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.loadInterview(id);
    });
  }

  loadInterview(id: number): void {
    this.interviewService.getInterview(id).subscribe({
      next: (interview) => {
        this.interview = interview;
        this.loadAnswers();
      },
      error: (err) => console.error('Error loading interview', err)
    });
  }

  loadAnswers(): void {
    if (!this.interview) return;
    
    this.interview.questions.forEach(question => {
      this.interviewService.getAnswer(question.id).subscribe({
        next: (answer) => {
          this.answers[question.id] = answer.content || '';
        },
        error: () => {
          this.answers[question.id] = '';
        }
      });
    });
  }

  get currentQuestionObject(): Question | undefined {
    return this.interview?.questions[this.currentQuestion];
  }

  previousQuestion(): void {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
    }
  }

  nextQuestion(): void {
    if (this.interview && this.currentQuestion < this.interview.questions.length - 1) {
      this.currentQuestion++;
    }
  }

  saveAnswer(): void {
    if (!this.currentQuestionObject) return;
    
    this.interviewService.saveAnswer(
      this.currentQuestionObject.id,
      this.answers[this.currentQuestionObject.id]
    ).subscribe({
      next: () => alert('Risposta salvata!'),
      error: (err) => {
        console.error('Error saving answer', err);
        alert('Errore nel salvataggio della risposta');
      }
    });
  }

  exportJSON(): void {
    if (!this.interview) return;
    
    this.interviewService.exportJSON(this.interview.id).subscribe({
      next: (blob) => this.downloadFile(blob, `interview-${this.interview!.id}.json`),
      error: (err) => console.error('Error exporting JSON', err)
    });
  }

  exportCSV(): void {
    if (!this.interview) return;
    
    this.interviewService.exportCSV(this.interview.id).subscribe({
      next: (blob) => this.downloadFile(blob, `interview-${this.interview!.id}.csv`),
      error: (err) => console.error('Error exporting CSV', err)
    });
  }

  downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getProgressPercentage(): number {
    if (!this.interview) return 0;
    return ((this.currentQuestion + 1) / this.interview.questions.length) * 100;
  }
}
