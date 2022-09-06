import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";
import {HeroInterface} from "../shared/types/hero.interface";
import {HeroService} from "../hero.service";

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  hero: HeroInterface | undefined;

  constructor(private route: ActivatedRoute, private heroService: HeroService, private location: Location) {
  }

  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    const id = parseInt(this.route.snapshot.paramMap.get('id')!, 10);
    this.heroService.getHero(id).subscribe({
      next: (res: HeroInterface) => {
        this.hero = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero).subscribe({
        next: () => {
          this.goBack();
        },
        error: (err) => {
          console.log(err);
        }
      });
    }
  }
}
