import {Component, OnInit} from '@angular/core';
import {RecipesService} from './recipes.service';
import {RecipeModel} from './recipe.model';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.page.html',
  styleUrls: ['./recipes.page.scss'],
})
export class RecipesPage {
  recipes: RecipeModel[];

  constructor(private recipesService: RecipesService) {
  }

  ionViewWillEnter() {
    this.recipes = this.recipesService.getAllRecepies();
  }

}
