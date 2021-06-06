import { Component, OnInit } from '@angular/core';
import { FormGroup, NgForm } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit {
  allTodos: any = [];
  showValidations = false;
  showForm = false;
  edited = false;
  currentIndex = 0;
  showButtons = false;
  paginationNumber = 10;
  numberOfOptions = 0;
  optionsArray: any = [];
  displayedTodos: any;
  selectedValue: any;
  searchString:any;
  showPagination = true;
  constructor() {}

  ngOnInit() {
    this.setInitialLocalStorageData();
    this.getLocalStorageData();
    this.initializePagination(this.paginationNumber);
    this.selectChangeEvent(1);
    this.selectedValue = 1;
  }
  setInitialLocalStorageData() {
    const response = localStorage.getItem('allTodosArray');
    if (response === null) {
      localStorage.setItem('allTodosArray', this.allTodos);
    }
  }

  setDataToLocalStorage() {
    localStorage.setItem('allTodosArray', JSON.stringify(this.allTodos));
  }

  getLocalStorageData() {
    const response = localStorage.getItem('allTodosArray');
    if (response !== null) {
      this.allTodos = JSON.parse(response);
    }
  }
  todo = {
    description: '',
  };
  date = new Date();
  clickHandle(form: NgForm) {
    // debugger;
    if (form.valid) {
      if (this.edited) {
        this.saveEditedTodo(form);
      } else {
        this.saveTodo(form);
      }

      this.showValidations = false;
      this.initializePagination(this.paginationNumber);
      this.selectChangeEvent(this.optionsArray.length);
      this.selectedValue = this.optionsArray.length;
      this.clearFormValues(form);
      this.closeForm();
    } else {
      this.showValidations = true;
    }
  }
  saveEditedTodo(form: NgForm) {
    this.attachDetails(form);
    this.allTodos.splice(this.currentIndex, 1, form.value);
    this.setDataToLocalStorage();
    this.edited = false;
  }
  
  attachDetails(form: NgForm) {
    form.value.completed = false;
    form.value.id = this.date.getMilliseconds() + Math.random();
    form.value.date = this.date
  }
  saveTodo(form: NgForm) {
    this.attachDetails(form);
    this.allTodos.push(form.value);
    this.setDataToLocalStorage();
  }
  clearFormValues(form: NgForm) {
    this.todo.description = '';
  }
  openForm() {
    // this.clearFormValues()
    this.showForm = true;
  }
  closeForm() {
    this.todo.description = ""
    this.showForm = false;
    this.edited = false;
  }
  today = new Date()
  editHandle(id: number) {
    debugger
    const editedTodo = this.allTodos.find((obj: any, index: number) => {
      this.currentIndex = index;
      return obj.id === id;
    });
    this.todo.description = editedTodo.description;
    this.openForm();
    this.edited = true;
  }
  deleteHandle(id: number) {
    // debugger;
    this.allTodos = this.allTodos.filter((obj: any) => {
      return obj.id !== id;
    });
    this.displayedTodos = this.displayedTodos.filter((obj: any) => {
      return obj.id !== id;
    });
    this.initializePagination(this.paginationNumber);
    this.setDataToLocalStorage();
  }

  changedCheckBox(e: any, id: number) {
    let value = e.target.checked;
    let index = 0;
    let currentlyCheckedObj = this.allTodos.find((obj: any, i: number) => {
      index = i;
      return obj.id === id;
    });
    if (value === true) {
      currentlyCheckedObj.completed = true;
    } else {
      currentlyCheckedObj.completed = false;
    }
    this.allTodos.splice(index, 1, currentlyCheckedObj);
    this.setDataToLocalStorage();
  }

  changedPaginationNumber(num: any, form?: any) {
    // debugger;
    if (form.valid) {
      this.basePagination(num);
      this.selectChangeEvent(1);
      this.selectedValue = 1;
    }
  }

  basePagination(num: any) {
    // debugger;
    this.paginationNumber = Number(num);
    this.numberOfOptions = Math.ceil(
      this.allTodos.length / this.paginationNumber
    );
    this.optionsArray = this.dynamicNoOfOptions(this.numberOfOptions);
  }

  initializePagination(num: any) {
    // debugger;
    this.basePagination(num);
  }

  dynamicNoOfOptions(number: any): Array<number> {
    let arr = [];
    for (let i = 1; i <= number; i++) {
      arr.push(i);
    }
    return arr;
  }
  selectChangeEvent(e: any) {
    // debugger;
    let value = Number(e);
    if (value === 1) {
      this.displayedTodos = this.allTodos.slice(0, this.paginationNumber);
    } else {
      this.setPagination(value);
    }
  }
  setPagination(value: number) {
    // debugger;
    this.displayedTodos = this.allTodos.slice(
      (value - 1) * this.paginationNumber,
      value * this.paginationNumber
    );
  }
  searchChangeEvent(e:any){
  // debugger
  this.searchString = e.value
  if(this.searchString){
    this.displayedTodos = this.allTodos.filter((obj:any) => {
      return obj.description.includes(this.searchString);
    });
    this.showPagination = false
  }else{
    this.initializePagination(this.paginationNumber)
    this.selectChangeEvent(this.selectedValue)
    this.showPagination = true
  }
}
}
