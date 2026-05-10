import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../../../shared/services/category';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './category.html',
  styleUrls: ['./category.css']
})
export class CategoryComponent implements OnInit {
  private categoryService = inject(CategoryService);

  displayColumns: string[] = ['id', 'name', 'description', 'actions'];
  dataSource = new MatTableDataSource<CategoryElement>();

  formCategory: CategoryElement = { id: 0, name: '', description: '' };
  isEditing = false;

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (data: any) => this.dataSource.data = data.categoryResponse?.category || [],
      error: (error: any) => console.log('Error:', error)
    });
  }

  saveCategory(): void {
    const category = {
      name: this.formCategory.name,
      description: this.formCategory.description
    };

    if (this.isEditing) {
      this.categoryService.updateCategory(this.formCategory.id, category).subscribe(() => {
        this.cleanForm();
        this.getCategories();
      });
    } else {
      this.categoryService.saveCategory(category).subscribe(() => {
        this.cleanForm();
        this.getCategories();
      });
    }
  }

  editCategory(category: CategoryElement): void {
    this.formCategory = { ...category };
    this.isEditing = true;
  }

  deleteCategory(id: number): void {
    if (confirm('¿Deseas eliminar esta categoría?')) {
      this.categoryService.deleteCategory(id).subscribe(() => this.getCategories());
    }
  }

  cleanForm(): void {
    this.formCategory = { id: 0, name: '', description: '' };
    this.isEditing = false;
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }
}

export interface CategoryElement {
  id: number;
  name: string;
  description: string;
}
