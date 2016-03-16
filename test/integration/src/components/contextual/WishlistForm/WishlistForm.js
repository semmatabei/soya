import React from 'react';

import style from './style.css';

import TextField from '../../common/TextField/TextField';
import { required, minSelected, requiredCheckbox, optional } from '../../../validator/general.js';

export default class WishlistForm extends React.Component {
  render() {
    return <div className={style.form}>
      <h3>{this.props.formName}</h3>
      <h4>Goals</h4>
      <TextField form={this.props.form} name={['goals', 'professional']} label="Professional"
                 changeValidators={[required]}
                 reduxStore={this.props.reduxStore} config={this.props.config} />
      <div>
        <h5>Material</h5>
        <TextField form={this.props.form} name={['goals', 'material', 'lodging']} label="Lodging"
                   changeValidators={[required]}
                   reduxStore={this.props.reduxStore} config={this.props.config} />
        <TextField form={this.props.form} name={['goals', 'material', 'electronics']} label="Electronics"
                   changeValidators={[required]}
                   reduxStore={this.props.reduxStore} config={this.props.config} />
        <TextField form={this.props.form} name={['goals', 'material', 'furniture']} label="Furniture"
                   changeValidators={[required]}
                   reduxStore={this.props.reduxStore} config={this.props.config} />
      </div>
      <div>
        <h5>Personality</h5>
        <TextField form={this.props.form} name={['goals', 'personality', 'anger']} label="Anger"
                   changeValidators={[required]}
                   reduxStore={this.props.reduxStore} config={this.props.config} />
        <TextField form={this.props.form} name={['goals', 'personality', 'patience']} label="Patience"
                   changeValidators={[required]}
                   reduxStore={this.props.reduxStore} config={this.props.config} />
      </div>
      <h4>Places Visited</h4>
      <div>
        <h5>SEA</h5>
        <TextField form={this.props.form} name={['visited', 0, 0]} label="Indonesia"
                   reduxStore={this.props.reduxStore} config={this.props.config} />
        <TextField form={this.props.form} name={['visited', 0, 1]} label="Malaysia"
                   reduxStore={this.props.reduxStore} config={this.props.config} />
        <h5>Europe</h5>
        <TextField form={this.props.form} name={['visited', 1, 0]} label="Germany"
                   reduxStore={this.props.reduxStore} config={this.props.config} />
      </div>
      <h4>Games</h4>
      <div>
        <h5>Game 1</h5>
        <TextField form={this.props.form} name={['games', 0, 'name']} label="Name"
                   reduxStore={this.props.reduxStore} config={this.props.config} />
        <TextField form={this.props.form} name={['games', 0, 'genre']} label="Genre"
                   reduxStore={this.props.reduxStore} config={this.props.config} />
        <div>
          <h6>Review 1</h6>
          <TextField form={this.props.form} name={['games', 0, 'reviews', 0, 'reviewer']} label="Reviewer"
                     reduxStore={this.props.reduxStore} config={this.props.config} />
          <TextField form={this.props.form} name={['games', 0, 'reviews', 0, 'score']} label="Score"
                     reduxStore={this.props.reduxStore} config={this.props.config} />
        </div>
        <div>
          <h6>Review 2</h6>
          <TextField form={this.props.form} name={['games', 0, 'reviews', 1, 'reviewer']} label="Reviewer"
                     reduxStore={this.props.reduxStore} config={this.props.config} />
          <TextField form={this.props.form} name={['games', 0, 'reviews', 1, 'score']} label="Score"
                     reduxStore={this.props.reduxStore} config={this.props.config} />
        </div>

        <h5>Game 1</h5>
        <TextField form={this.props.form} name={['games', 1, 'name']} label="Name"
                   reduxStore={this.props.reduxStore} config={this.props.config} />
        <TextField form={this.props.form} name={['games', 1, 'genre']} label="Genre"
                   reduxStore={this.props.reduxStore} config={this.props.config} />
        <div>
          <h6>Reviews</h6>
          <TextField form={this.props.form} name={['games', 1, 'reviews', 0, 'reviewer']} label="Reviewer"
                     reduxStore={this.props.reduxStore} config={this.props.config} />
          <TextField form={this.props.form} name={['games', 1, 'reviews', 0, 'score']} label="Score"
                     reduxStore={this.props.reduxStore} config={this.props.config} />
        </div>
      </div>
      <button onClick={this.handleSubmit.bind(this)}>Submit</button>
    </div>;
  }

  submit(result) {
    console.log('VALIDATION RESULT', result);
  }

  formWideValidate(data) {
    console.log('FORM-WIDE-VALIDATE', data);
  }

  handleSubmit() {
    this.props.form.submit(
      this.submit.bind(this),
      this.formWideValidate.bind(this)
    );
  }
}