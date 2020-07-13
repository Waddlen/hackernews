import { Component, OnInit } from '@angular/core';
import { Article } from '../article';
import { ArticleService } from '../article.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-news-table',
  templateUrl: './news-table.component.html',
  styleUrls: ['./news-table.component.css']
})
export class NewsTableComponent implements OnInit {
  public articles =  new Array<Article>();
  public filteredArticles =  new Array<Article>();
  displayedColumns: string[] = ['position', 'title'];

  constructor(private service: ArticleService) {}

  ngOnInit(): void {
    // Subscribe to changes to search bar text
    this.service.myTextObs.subscribe(text => this.filterShownArticles(text));

    // Prepare article list
    this.service.getBestArticles()
      .subscribe(response => {
        response.subscribe(response2 => {
          this.articles = response2;
          this.filteredArticles = this.articles;
        });
    });
  }

  // Only show articles containing substring
  filterShownArticles(text: string) {
    const tempArticles = new Array<Article>();

    for (const art of this.articles) {
      if (art.title.toLowerCase().includes(text)) {
        tempArticles.push(art);
      }
    }
    this.filteredArticles = tempArticles;
  }
}
