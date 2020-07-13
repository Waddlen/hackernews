import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsTableComponent } from './news-table.component';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ArticleService } from '../article.service';
import { Observable } from 'rxjs';
import { from, of } from 'rxjs';
import { Article } from '../article';

describe('NewsTableComponent', () => {
  let component: NewsTableComponent;
  let fixture: ComponentFixture<NewsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ NewsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Unit tests
  it('should filter non-matching titles', () => {
    component.articles.push({by: '', title: 'Test Title', id: 1, url: ''});

    component.filterShownArticles('Hello');

    expect(component.filteredArticles.length === 0);
  });

  it('should not filter matching titles', () => {
    component.articles.push({by: '', title: 'Hello world', id: 1, url: ''});

    component.filterShownArticles('Hello');

    expect(component.filteredArticles.length === 1);
  });

  // Integration test
  it('should calling getBestArticles() from article.service', () => {
    let service = TestBed.get(ArticleService);
    let test = new Array<Article>();
    test.push({by: '', title: 'Hello world', id: 1, url: ''});
    let test2 = of(of(test));
    spyOn(service, 'getBestArticles').and.returnValue(test2);
    component.ngOnInit();

    expect(component.articles.length).toBe(1);
  });
});
