import { Injectable } from '@angular/core';
import {RecipeModel} from './recipe.model';

@Injectable({
  providedIn: 'root'
})
export class RecipesService {
  private recipes: RecipeModel[] = [
    {
      id: 'r1',
      title: 'Schnitzel',
      imageUrl: 'assets/images/recipes/schnitzel.jpeg',
      ingredients: ['French Fries', 'Pork Meat', 'Salad']
    },
    {
      id: 'r2',
      title: 'Spaghetti',
      imageUrl: 'assets/images/recipes/spaghetti.jpeg',
      ingredients: ['Spaghetti', 'Meat', 'Tomatoes']
    }
  ];
  constructor() { }

  getAllRecepies() {
    return [...this.recipes];
  }
  getRecipe(recipeId: string) {
    return {...this.recipes.find(recipe => recipe.id === recipeId)};
  }
  deleteRecipe(recipeId: string) {
    this.recipes = this.recipes.filter(recipe => recipe.id !== recipeId);
  }
}
