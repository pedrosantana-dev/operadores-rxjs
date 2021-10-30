import { DialogEditProductComponent } from './dialog-edit-product/dialog-edit-product.component';
import { Component } from '@angular/core';
import { ProductsService } from "./products.service";
import { Product } from "./product";
import { Observable } from "rxjs";
import { filter, switchMap } from "rxjs/operators";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  simpleReqProductsObs$!: Observable<Product[]>;
  productsErrorHandling!: Product[];
  productsLoading!: Product[];
  bLoading: boolean = false;
  productsIds!: Product[];
  newlyProducts: Product[] = [];
  productsToDelete!: Product[];
  productsToEdit!: Product[];


  constructor(private productService: ProductsService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog) {
  }

  ngOnInit() {
  }

  getSimpleHttpRequest() {
    this.simpleReqProductsObs$ = this.productService.getProducts();
  }

  getProductsWithErrorHandling() {
    this.productService.getProductsError()
      .subscribe((prods) => {
        this.productsErrorHandling = prods;
      }, (err) => {
        console.log(err);
        console.log("Mensagem: " + err.error.message);
        console.log("Status code: " + err.status);
        let config = new MatSnackBarConfig();
        config.duration = 2000;
        config.panelClass = ['snack_error'];

        if (err.status === 0)
          this.snackBar.open('Não foi possível se conectar ao servidor', '', config);
        else
          this.snackBar.open(err.error.message, '', config);
      });
  }

  getProductsWithErrorHandlingOK() {
    this.productService.getProductsDeley()
      .subscribe((prods) => {
        this.productsErrorHandling = prods;

        let config = new MatSnackBarConfig();
        config.duration = 2000;
        config.panelClass = ['snack_ok'];
        this.snackBar.open('Produtos carregados com sucesso!', '', config);

      }, (err) => {
        console.log(err);

      });
  }

  getProductsLoading() {
    this.bLoading = true;
    this.productService.getProductsDeley()
      .subscribe((prods) => {
        this.productsLoading = prods;
        this.bLoading = false;
      }, (err) => {
        this.bLoading = false;
      });
  }

  loadName(id: string) {
    this.productService.getProductName(id)
      .subscribe((name) => {
        let index = this.productsIds.findIndex(p => p._id === id);
        if (index >= 0) {
          this.productsIds[index].name = name;
        }
      });
  }

  getProductsIds() {
    this.productService.getProductsIds()
      .subscribe((ids) => {
        this.productsIds = ids.map(id => ({ _id: id, name: '', department: '', price: 0 }))
      });
  }

  saveProduct(name: string, department: string, price: string) {
    let p = { name, department, price: Number(price) };
    this.productService.saveProduct(p)
      .subscribe((p) => {
        console.log(p);
        this.newlyProducts.push(p);
      }, (err) => {
        console.log(err);
        let config = new MatSnackBarConfig();
        config.duration = 2000;
        config.panelClass = ['snack_error'];

        if (err.status === 0)
          this.snackBar.open('Não foi possível se conectar ao servidor', '', config);
        else
          this.snackBar.open(err.error.message, '', config);
      })
  }

  loadProductsToDelete() {
    this.productService.getProducts()
      .subscribe((prods) => {
        this.productsToDelete = prods;
      });
  }

  deleteProduct(p: Product) {
    this.productService.deleteProduct(p)
      .subscribe((res) => {
        let i = this.productsToDelete.findIndex(prod => prod._id == p._id);
        if (i >= 0)
          this.productsToDelete.splice(i, 1);
      }, (err) => {
        console.log(err);
      })
  }

  loadProductsToEdit() {
    this.productService.getProducts()
      .subscribe((prods) => {
        this.productsToEdit = prods;
      });
  }

  editProduct(p: Product) {
    // let newProduct: Product = Object.assign({}, p);
    let newProduct: Product = { ...p };
    let dialogRef = this.dialog.open(DialogEditProductComponent, { width: '400px', data: newProduct });
    dialogRef.afterClosed()
      .pipe(
        filter((prod: Product) => prod != undefined),
        switchMap((prod: Product) => this.productService.editProduct(prod))
      )
      .subscribe((res: Product) => {
        // console.log(res);
        /* if (res) {
          this.productService.editProduct(res)
            .subscribe(
              (resp) => {
                let i = this.productsToEdit.findIndex(prod => p._id == prod._id);
                if (i >= 0) {
                  this.productsToEdit[i] = resp;
                }
              },
              (err) => console.error(err)
            )
        } */
        let i = this.productsToEdit.findIndex(prod => p._id == prod._id);
        if (i >= 0) {
          this.productsToEdit[i] = res;
        }
      },
        (err) => console.error(err));
  }
}
