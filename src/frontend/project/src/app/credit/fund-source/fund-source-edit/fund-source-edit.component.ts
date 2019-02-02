import { CreditFundSourcePUTModel } from './../../../service/models';
import { UnAuthorized } from './../../../common/unauthorized-error';
import { Forbidden } from './../../../common/forbidden';
import { BadInput } from 'src/app/common/bad-input';
import { AppError } from 'src/app/common/app-error';
import { SourceService } from 'src/app/service/credit/source.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CreditFundSourceGETModel } from 'src/app/service/models';
import { BehaviorSubject } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { NotFound } from 'src/app/common/not-found';
import { ServerError } from 'src/app/common/serve-error';

@Component({
  selector: 'app-fund-source-edit',
  templateUrl: './fund-source-edit.component.html',
  styleUrls: ['./fund-source-edit.component.scss']
})
export class FundSourceEditComponent implements OnInit {

  loading = false;
  loading_del = false;
  private _data = new BehaviorSubject<CreditFundSourceGETModel>({
    id: 0,
    source_name: '',
    description: '',
    url: '',
    is_deleted: false,
    added: '',
    updated: '',
    uuid: ''
  });

  modal = false;
  modal_update = false;

  @Input()
  set source(value: CreditFundSourceGETModel) {
    this._data.next(value);
  };

  get source() {
    return this._data.getValue();
  }

  messages: { message: string, type: string }[] = [];
  uuid: string;

  form = new FormGroup({
    source_name: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(30)
    ]),
    extra_description: new FormControl("", [
      Validators.required
    ]),
    is_deleted: new FormControl(false, [
      Validators.required
    ]),
    description: new FormControl("")
  });

  constructor(private _router: Router, private _sourceService: SourceService) { }

  toggle_modal() {
    return this.modal = !this.modal;
  }
  toggle_modal_update() {
    return this.modal_update = !this.modal_update;
  }

  throw_error(error: AppError) {
    if (error instanceof BadInput) {
      return this.messages.splice(0, 0, { message: 'You have entered invalid data or fund is limited. All fields and required and must be valid.', type: 'error' });
    }
    if (error instanceof Forbidden) {
      return this.messages.splice(0, 0, { message: 'You don\'t have permission for this action.', type: 'error' });
    }
    if (error instanceof NotFound) {
      return this.messages.splice(0, 0, { message: '404 Not Found', type: 'error' });
    }
    if (error instanceof UnAuthorized) {
      this._router.navigate(['/login'])
      return this.messages.splice(0, 0, { message: 'You are not logged in.', type: 'error' });
    }
    if (error instanceof ServerError) {
      return this.messages.splice(0, 0, { message: 'Internal server error.', type: 'error' });
    }
    return this.messages.splice(0, 0, { message: 'An expected error occured.', type: 'error' });
  }

  ngOnInit() {
    this._data.subscribe(
      x => {
        console.log(this.uuid)
        this.uuid = this.source.uuid;
        this.form.setValue({
          source_name: this.source.source_name,
          extra_description: "",
          is_deleted: false,
          description: ""
        })
      }
    );
  }

  onSubmit() {
    if (this.form.valid) {
      this.loading = true;
      this._sourceService.update_source(this.form.value, this.uuid)
        .subscribe(
          (next: CreditFundSourcePUTModel) => {
            this.loading = false;
            console.log('Updated')
            return this.messages.splice(0, 0, { message: 'Credit Fund Source has been UPDATED successfuly.', type: 'positive' });
          },
          (error: AppError) => {
            this.loading = false;
            return this.throw_error(error);
          }
        )
    }
  }

  onDelete() {
    if (this.form.valid) {
      this.loading_del = true;
      this.form.get('is_deleted').setValue(true);
      this._sourceService.delete_source(this.form.value, this.uuid)
        .subscribe((next: CreditFundSourcePUTModel) => {
          this.loading_del = false;
          console.log(this.form.value)
          this.messages.splice(0, 0, { message: 'Credit Fund Source has been DELETED successfuly.', type: 'positive' });
        },
          (error: AppError) => {
            this.loading_del = false;
            return this.throw_error(error);
          }
        )
    }
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this._data.unsubscribe();
  }

  onReset() {
    this.messages = [];
    this.form.reset();
  }

}
