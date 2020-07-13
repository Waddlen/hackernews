import { Component, OnInit } from '@angular/core';
import { ArticleService } from '../article.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  previewText = '';

  constructor(private service: ArticleService) {}

  ngOnInit(): void {
  }

  onEnter() {
    this.service.updateMyText(this.previewText);
  }

}
