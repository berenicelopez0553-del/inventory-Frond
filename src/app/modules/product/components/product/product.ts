import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ProductService } from '../../../shared/services/product';
import { CategoryService } from '../../../shared/services/category';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
CommonModule,
  FormsModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatButtonModule,
  MatIconModule,
  MatTableModule,
  MatSelectModule
  ],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class ProductComponent implements OnInit {

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  ngOnInit(): void {
    this.getProducts();
    this.getCategories();
  }

  displayColumns: string[] = ['id', 'picture', 'name', 'description', 'price', 'account', 'category', 'actions'];
  dataSource=new MatTableDataSource<ProductElement>();
  categories: any[] = [];

  formProduct: ProductForm = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    account: 0,
    picture: '',
    categoryId: 0
  };

  isEditing = false;

  getProducts(): void {
    this.productService.getProducts()
      .subscribe((data:any) => {
        console.log("respuesta products:", data);
        this.processProductsResponse(data);
      }, (error:any) => {
        console.log("Error:", error);
      });
  }

  processProductsResponse(resp: any): void {
    console.log('RESPUESTA COMPLETA:', resp);

    this.dataSource.data = resp.productResponse?.product || [];

    console.log('DATOS CARGADOS:', this.dataSource.data);
  }

  getCategories(): void {
    this.categoryService.getCategories()
      .subscribe((data:any) => {
        console.log("respuesta categories:", data);
        this.categories = data.categoryResponse?.category || [];
      }, (error:any) => {
        console.log("Error:", error);
      });
  }

  saveProduct(): void {
    const product = {
      name: this.formProduct.name,
      description: this.formProduct.description,
      price: this.formProduct.price,
      account: this.formProduct.account,
      picture: this.formProduct.picture,
      stock: this.formProduct.account,
      category: { id: this.formProduct.categoryId }
    };

    if (this.isEditing) {
      this.productService.updateProduct(this.formProduct.id, product)
        .subscribe((data:any) => {
          console.log("producto actualizado:", data);
          this.cleanForm();
          this.getProducts();
        }, (error:any) => {
          console.log("Error:", error);
        });
    } else {
      this.productService.saveProduct(product)
        .subscribe((data:any) => {
          console.log("producto guardado:", data);
          this.cleanForm();
          this.getProducts();
        }, (error:any) => {
          console.log("Error:", error);
        });
    }
  }

  editProduct(product: ProductElement): void {
    this.formProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      account: product.account || product.stock || 0,
      picture: product.picture || '',
      categoryId: product.category?.id || 0
    };
    this.isEditing = true;
  }

  deleteProduct(id: number): void {
    if (confirm('¿Deseas eliminar este producto?')) {
      this.productService.deleteProduct(id)
        .subscribe((data:any) => {
          console.log("producto eliminado:", data);
          this.getProducts();
        }, (error:any) => {
          console.log("Error:", error);
        });
    }
  }

  cleanForm(): void {
    this.formProduct = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      account: 0,
      picture: '',
      categoryId: 0
    };
    this.isEditing = false;
  }

  applyFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.formProduct.picture = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

}

interface ProductForm {
  id: number;
  name: string;
  description: string;
  price: number;
  account: number;
  picture: string;
  categoryId: number;
}

export interface ProductElement {
  id: number;
  name: string;
  description: string;
  price: number;
  account?: number;
  stock?: number;
  picture?: string;
  category?: any;
}
