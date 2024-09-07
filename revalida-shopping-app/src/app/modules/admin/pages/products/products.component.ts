import { AfterContentInit, AfterViewChecked, AfterViewInit, Component, ElementRef, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Grid, h, html } from 'gridjs';
import 'gridjs/dist/theme/mermaid.css';
import { ProductsService } from '../../services/products.service';
import { map, Observable } from 'rxjs';
import { Product } from '../../../models/product.interface';
import { DataTable } from 'simple-datatables';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, AfterViewInit {
  
  @ViewChild('datatablesSimple', { static: false }) datatablesSimple!: ElementRef;
  @ViewChild('closeModalAdd') closeModalAdd !: ElementRef;
  @ViewChild('closeModalDelete') closeModalDelete !: ElementRef;
  @ViewChild('closeModalEdit') closeModalEdit !: ElementRef;
  @ViewChild('closeModalDeleteSel') closeModalDeleteSel !: ElementRef;
  adminSection: HTMLDivElement;
  productsList$: Observable<Product[]>;
  productForm: FormGroup;
  updateProductForm: FormGroup;
  categories: string[];
  itemImgValue: string;
  submitted: boolean = false;
  productIndex!: number;
  modalInstance: any; 
  deleteDescription: string;
  checkedItems: number[] = [];
  adminName: string | undefined;


  constructor(private fb: FormBuilder,
              private productsService: ProductsService,
              private messageService: MessageService) {

    this.adminSection = document.querySelector(".sb-nav-fixed") as HTMLDivElement;
    
    this.adminName = `${sessionStorage.getItem('first_name')} ${sessionStorage.getItem('last_name')}`;
    this.productsList$ = this.productsService.getProducts();
    this.productsList$.subscribe(
      data => console.log(data)
    )

    this.productForm = this.fb.group({
      item_img: ['', [Validators.required]],
      item_name: ['', Validators.required],
      category: ['Select category', Validators.required],  
      quantity: ['', Validators.required],
      unit_price: ['', Validators.required]
    });

    this.updateProductForm = this.fb.group({
      item_img: ['', [Validators.required]],
      item_name: ['', Validators.required],
      category: ['Select category', Validators.required],  
      quantity: ['', Validators.required],
      unit_price: ['', Validators.required]
    });

    this.categories = [
      "Food",
      "Drinks",
      "Hygiene",
      "Cooking Essentials"
    ]

    console.log(this.f['item_img'].value);
    this.itemImgValue = (this.f['item_img'].value) ? this.f['item_img'].value : 'default_item_img.jpg'; 
    this.deleteDescription = "these products";
  }

  ngOnInit(): void {
      // Access the sidebarToggle button
      const sidebarToggle = document.querySelector('#sidebarToggle') as HTMLElement;

      if(sidebarToggle) {
          // Uncomment the following block to persist sidebar toggle between refreshes
          // if(localStorage.getItem('sb|sidebar-toggle') === 'true') {
          //   document.querySelector(".sb-nav-fixed")?.classList.toggle('sb-sidenav-toggled');
          // }

          sidebarToggle.addEventListener('click', (event) => {
            event.preventDefault();
            // Toggle the class to show/hide sidebar
            document.querySelector(".sb-nav-fixed")?.classList.toggle('sb-sidenav-toggled');
            // Persist the state in localStorage
            localStorage.setItem('sb|sidebar-toggle', document.querySelector('.sb-nav-fixed')?.classList.contains('sb-sidenav-toggled').toString() as string);
          })
      }
  }

  ngAfterViewInit(): void {
    
    if(this.datatablesSimple) {
      // new DataTable(this.datatablesSimple.nativeElement, {
      //   searchable: true,
      //   columns: [
      //      // Sort the first column in ascending order
      //     // { select: 0, sort: "asc" },
      //     // { select: 1, sort: "asc" },

      //     // Set the second column as datetime string matching the format "DD/MM/YYY"
      //     // { select: 2 },

      //     // Disable sorting on the third and fourth columns
      //     // { select: [3, 4], sortable: false },
          
      //     // Set the fourth column as datetime string matching the format "DD/MM/YYY"
      //     // { select: 4, type: "date", format: "DD/MM/YYYY" },
         
      //     // Hide the fifth column
      //     // { select: 4, hidden: true },

      //     // Append a button to the sixth column
      //     // {
      //     //     select: 5,
      //     //     type: 'string',
      //     //     render: function(data, td, rowIndex, cellIndex) {
      //     //         return `${data}<button type='button' data-row='${rowIndex}'>Select</button>`;
      //     //     }
      //     // }
      //   ]
      // });
    }
  }


  uploadFile = (event: Event) => {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if(fileList){
      console.log("uploadFile: ", fileList[0].name)
      console.log("uploadFile: ", fileList[0].type)
      this.itemImgValue = fileList[0].name;
    }
  }

  get f() {
    return this.productForm.controls;
  }

  getIndex = (index: number) => {
    this.productIndex = index;
    this.deleteDescription = "this product";

    this.productsList$.pipe(
      map(products => products[index])
    ).subscribe(
      product => {
        this.deleteDescription = `${product.item_name}`;
      }
    );
  }

  loadURLToInputFiled = (url: string) => {
    this.getImgURL(url, (imgBlob: Blob)=>{
      // Load img blob to input
      // WIP: UTF8 character error
      let fileName = url;
      let file = new File([imgBlob], fileName,{type:"image/jpeg", lastModified:new Date().getTime()});
      let container = new DataTransfer(); 
      container.items.add(file);
      console.log(container.files[0]);
      (document.querySelector('#item-img-input-edit') as HTMLInputElement).files = container.files;
      
    })
  }

  // xmlHTTP return blob respond
  getImgURL = (url: string, callback:any) => {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        callback(xhr.response);
    };
    url = "assets/img/" + url;
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
  }

  populateEditForm = (index: number) => {
    this.productIndex = index;
    
    this.productsList$.pipe(
      map(products => products[index])
    ).subscribe(
      product => {
        this.itemImgValue = product.item_img;
        // console.log();
        // fetch(this.itemImgValue)
        //   .then((response) => {
        //     return response.blob()
        //   })
        //   .then((blob) => {
        //     console.log(blob);
        //     const file = new File([blob], this.itemImgValue, {type: "text/image"})
        //     console.log(file);
        //     this.productForm.patchValue({item_img: file});
        //   })

        this.loadURLToInputFiled(this.itemImgValue);
        this.productForm.patchValue({
          // item_img: product.item_img,
          item_name: product.item_name,
          category: product.category,
          quantity: product.quantity,
          unit_price: product.unit_price
        })
      }
    );
  }

  changeDeleteDesc = () => {
    this.deleteDescription = "these products";
  }

  capitalizeWord = (word: string) => {
    let words: string[] = word.split(' ');
    let capitalized = " ";
    words.forEach((token: string) => {
      capitalized += token.charAt(0).toUpperCase() + token.slice(1) + " ";
    })

    console.log(capitalized.trim());
    return capitalized;
  }

  onCheck = (index: number) => {
    if(this.checkedItems.includes(index)) {
      this.checkedItems = this.checkedItems.filter(
        (item) => item !== index
      );
    } else {
      this.checkedItems.push(index);
    }
  }

  onSubmitAdd = () => {
    this.submitted = true;
    const postData = {...this.productForm.getRawValue()};
    postData['item_name'] = this.capitalizeWord(postData['item_name']);
    postData['item_img'] = (postData['item_img'] as string).split('fakepath\\')[1];

    if(this.productForm.invalid){
      return;
    }

   this.productsService.checkIfProductExists(postData['item_name'] as string).subscribe(
    exists => {
      if(!exists) {
        
        this.productsService.addProduct(postData as Product).subscribe(
          response => {
            
            this.productsList$ = this.productsService.getProducts();
            this.closeModalAdd.nativeElement.click();
            this.messageService.add({ severity:'success', summary: 'Success', detail: 'New product has been added' });
          },
          error => {
            this.messageService.add({ severity:'error', summary: 'Error', detail: 'Failed to add new product' });
          }
        )
      } else {
        this.messageService.add({ severity:'error', summary: 'Error', detail: 'This product already exists' });
      }
    }
   );

   this.productForm.reset();
   this.productForm.patchValue({category: "Select category"});
   this.itemImgValue = "default_item_img.jpg";
   this.submitted = false;
  }

  onSubmitEdit = (index: number) => {
    this.submitted = true;
    const updatedProduct: Product = this.productForm.getRawValue();

    if(this.productForm.invalid && updatedProduct.item_img){
      return;
    }

    this.productsList$.pipe(
      map(products => products[index])
    ).subscribe(
      product => {
        updatedProduct.id = product.id;
        updatedProduct.item_img = (!updatedProduct.item_img) ? product.item_img : updatedProduct.item_img;
        this.productsService.updateProduct(updatedProduct as Product).subscribe(
          response => {
            console.log("Updated item: ", response);
            this.productsList$ = this.productsService.getProducts();
            this.closeModalEdit.nativeElement.click();
            this.messageService.add({ severity:'success', summary: 'Success', detail: 'Product has been updated' });
          },
          error => {
            this.messageService.add({ severity:'error', summary: 'Error', detail: 'Failed to update product' });
          }
        )
      }
    )

    this.submitted = false;
  }

  onSubmitDeleteItem = (index: number) => {
    
    this.productsList$.pipe(
      map(products => products[index])
    ).subscribe(
      product => {
        this.productsService.deleteProduct(product.id as string).subscribe(
          response => {
            console.log("Deleted item: ", response);
            this.closeModalDelete.nativeElement.click();
            this.productsList$ = this.productsService.getProducts();
            this.messageService.add({ severity:'success', summary: 'Success', detail: 'Product has been removed' });
          },
          error => {
            this.messageService.add({ severity:'error', summary: 'Error', detail: 'Failed to remove product' });
          }
        );
      }
    );
  }

  onSubmitDeleteSelected = () => {
    console.log(this.checkedItems);

    this.checkedItems.forEach((item) => {
      this.productsList$.pipe(
        map(products => products[item])
      ).subscribe(
        product => {
          this.productsService.deleteProduct(product.id as string).subscribe(
            response => {
              console.log("removed item: ", response);
              this.productsList$ = this.productsService.getProducts();
            },  
            error => {
              console.log(error);
              this.messageService.add({ severity:'error', summary: 'Error', detail: 'Failed to remove product' });
            }
          )
        }
      );
    });
    
    // this.productsList$ = this.productsService.getProducts();
    this.closeModalDeleteSel.nativeElement.click();
    this.messageService.add({ severity:'success', summary: 'Success', detail: `Removed ${this.checkedItems.length} products from inventory.` });
  }
  
}
