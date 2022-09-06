import {Component, OnInit} from '@angular/core';
import {HeroInterface} from "../shared/types/hero.interface";
import {HeroService} from "../hero.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  heroes: HeroInterface[] = [];

  constructor(private heroService: HeroService) {
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe({
      next: (res: HeroInterface[]) => {
        this.heroes = res.slice(1, 5);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
