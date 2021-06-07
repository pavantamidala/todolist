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
  editedTodoIndex = 0;
  showButtons = false;
  paginationNumber = 10;
  optionsArray: any = [];
  displayTodos: any = []
  dropdownSelectedValue: any;
  searchString:any;
  showPagination = true;
  constructor() {}

  ngOnInit() {
    this.setInitialLocalStorageData();
    this.getLocalStorageData();
    this.initializePagination(this.paginationNumber);
    this.selectDropdownChangeEvent(1);
    this.dropdownSelectedValue = 1;
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
    debugger;
    if (form.valid) {
      if (this.edited) {
        this.saveEditedTodo(form);
        this.initializePagination(this.paginationNumber);
        this.selectDropdownChangeEvent(this.dropdownSelectedValue)
        this.dropdownSelectedValue = this.dropdownSelectedValue;
        this.clearFormValues(form);
        this.showValidations = false;
        this.closeForm();
        return;
      } else {
        this.saveTodo(form);
      }

      this.showValidations = false;
      this.initializePagination(this.paginationNumber);
      this.selectDropdownChangeEvent(this.optionsArray.length);
      this.dropdownSelectedValue = this.optionsArray.length;
      this.clearFormValues(form);
      this.closeForm();
    } else {
      this.showValidations = true;
    }
  }
  saveEditedTodo(form: NgForm) {
    this.attachDetails(form);
    this.allTodos.splice(this.editedTodoIndex, 1, form.value);
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
      this.editedTodoIndex = index;
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
    this.displayTodos = this.displayTodos.filter((obj: any) => {
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
    debugger;
    if (form.valid) {
      this.basePagination(num);
      this.selectDropdownChangeEvent(1);
      this.dropdownSelectedValue = 1;
    }
  }

  basePagination(num: any) {
    // debugger;
    this.paginationNumber = Number(num);
    let totalOptions = Math.ceil(
      this.allTodos.length / this.paginationNumber
    );
    this.optionsArray = this.noOfOptionsForSelectDropdown(totalOptions);
  }

  initializePagination(num: any) {
    // debugger;
    this.basePagination(num);
  }

  noOfOptionsForSelectDropdown(number: any): Array<number> {
    let arr = [];
    for (let i = 1; i <= number; i++) {
      arr.push(i);
    }
    return arr;
  }
  selectDropdownChangeEvent(e: any) {
    // debugger;
    let value = Number(e);
    if (value === 1) {
      this.displayTodos = this.allTodos.slice(0, this.paginationNumber);
    } else {
      this.setPagination(value);
    }
  }
  setPagination(value: number) {
    // debugger;
    this.displayTodos = this.allTodos.slice(
      (value - 1) * this.paginationNumber,
      value * this.paginationNumber
    );
  }
  searchStringChangeEvent(e:any){
  // debugger
  this.searchString = e.value
  if(this.searchString){
    this.displayTodos = this.allTodos.filter((obj:any) => {
      return obj.description.includes(this.searchString);
    });
    this.showPagination = false
  }else{
    this.initializePagination(this.paginationNumber)
    this.selectDropdownChangeEvent(this.dropdownSelectedValue)
    this.showPagination = true
  }
}
}
