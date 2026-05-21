import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InterviewService } from '../../../core/services/interview.service';
import { Interview } from '../../../core/models/interview.model';

@Component({
  selector: 'app-interview-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section>
      <h2>Interviste Disponibili</h2>
      
      <div class="upload-section">
        <h3>Crea una nuova intervista</h3>
        <input 
          [(ngModel)]="title" 
          placeholder="Titolo intervista" 
          class="input-field"
        />
        <textarea 
          [(ngModel)]="description" 
          placeholder="Descrizione (opzionale)" 
          class="textarea-field"
        ></textarea>
        <textarea 
          [(ngModel)]="markdown" 
          placeholder="Incolla il contenuto Markdown..." 
          class="textarea-field large"
        ></textarea>
        <button (click)="createInterview()" class="btn btn-primary">
          ✨ Crea Intervista
        </button>
      </div>
      
      <div class="interviews-grid" *ngIf="interviews.length > 0">
        <div *ngFor="let interview of interviews" class="interview-card">
          <h3>{{ interview.title }}</h3>
          <p>{{ interview.description }}</p>
          <p class="meta">{{ interview.questions.length }} domande</p>
          <a [routerLink]="['/interview', interview.id]" class="btn btn-secondary">
            Inizia Intervista →
          </a>
        </div>
      </div>
      
      <p *ngIf="interviews.length === 0" class="no-data">
        Nessuna intervista disponibile. Creane una!
      </p>
    </section>
  `,
  styles: [`
    section {
      padding: 20px;
    }
    
    h2 {
      color: #333;
      margin-bottom: 30px;
    }
    
    .upload-section {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 40px;
      border: 2px solid #ddd;
    }
    
    .upload-section h3 {
      margin-top: 0;
      color: #555;
    }
    
    .input-field, .textarea-field {
      width: 100%;
      padding: 10px;
      margin: 10px 0;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
      box-sizing: border-box;
    }
    
    .textarea-field.large {
      min-height: 200px;
      resize: vertical;
    }
    
    .interviews-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .interview-card {
      background: white;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: transform 0.2s;
    }
    
    .interview-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.15);
    }
    
    .interview-card h3 {
      margin-top: 0;
      color: #007bff;
    }
    
    .meta {
      color: #999;
      font-size: 14px;
      margin: 10px 0;
    }
    
    .btn {
      display: inline-block;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      text-decoration: none;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background: #007bff;
      color: white;
      width: 100%;
      margin-top: 10px;
    }
    
    .btn-primary:hover {
      background: #0056b3;
    }
    
    .btn-secondary {
      background: #28a745;
      color: white;
      width: 100%;
    }
    
    .btn-secondary:hover {
      background: #218838;
    }
    
    .no-data {
      text-align: center;
      color: #999;
      padding: 40px 0;
    }
  `]
})
export class InterviewListComponent implements OnInit {
  interviews: Interview[] = [];
  title: string = '';
  description: string = '';
  markdown: string = '';

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.loadInterviews();
  }

  loadInterviews(): void {
    this.interviewService.listInterviews().subscribe({
      next: (data) => this.interviews = data,
      error: (err) => console.error('Error loading interviews', err)
    });
  }

  createInterview(): void {
    if (!this.title || !this.markdown) {
      alert('Titolo e contenuto Markdown sono obbligatori');
      return;
    }
    
    this.interviewService.createInterview(this.title, this.description, this.markdown).subscribe({
      next: (interview) => {
        this.interviews.unshift(interview);
        this.title = '';
        this.description = '';
        this.markdown = '';
        alert('Intervista creata con successo!');
      },
      error: (err) => {
        console.error('Error creating interview', err);
        alert('Errore nella creazione dell\'intervista');
      }
    });
  }
}
