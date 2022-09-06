import {Component, OnInit} from '@angular/core';
import {HeroInterface} from "../shared/types/hero.interface";
import {HeroService} from "../hero.service";

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})

export class HeroesComponent implements OnInit {

  heroes: HeroInterface[] = [];

  constructor(private heroService: HeroService) {
  }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    this.heroService.getHeroes().subscribe({
      next: (res: HeroInterface[]) => {
        this.heroes = res;
      },
      error: (err) => console.log(err)
    });
  }

  add(name: string): void {
    name = name.trim();
    if (!name) {
      return;
    }
    this.heroService.addHero({name} as HeroInterface)
      .subscribe({
        next: (res: HeroInterface) => {
          this.heroes.push(res);
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  delete(hero: HeroInterface): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
