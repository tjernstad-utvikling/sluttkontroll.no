import React from 'react';
import { render } from 'react-dom';
import { Formik } from 'formik';
import Yup from 'yup';
import uuid from 'uuid';

const userData = {
    id: '1245234',
    email: 'jared@reason.nyc',
    pets: [
        {
            id: '3asdfasf',
            type: 'dog',
            name: 'Spot'
        },
        {
            id: 'asdfl123',
            type: 'cat',
            name: 'Felix'
        }
    ]
};

const schema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required!'),
    pets: Yup.array().of(
        Yup.object().shape(
            {
                name: Yup.number().required('Required'),
                type: Yup.number('Pet must be a number').required('Required')
            },
            'Pet is invalid'
        )
    )
});

const formikEnhancer = Formik({
    validationSchema: Yup.object().shape({
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required!'),
        pets: Yup.array().of(
            Yup.object().shape({
                name: Yup.string().required('Pets must have a name'),
                type: Yup.string().required()
            })
        )
    }),
    mapPropsToValues: (props) => ({
        email: props.user.email,
        pets: props.user.pets
    }),
    handleSubmit: (payload) => {
        console.log(reach(schema, 'pets.type'));
        schema
            .isValid(
                {
                    email: 'jared@palmer.net',
                    pets: [
                        {
                            type: 'thing',
                            name: 'thing'
                        }
                    ]
                },
                { abortEarly: false }
            )
            .then(
                (something, other) => console.log(something, other),
                (error) => console.log(error)
            );
    },
    displayName: 'MyForm'
});

class CustomPetInput extends React.Component {
    addPetBelow = () => {
        console.log(
            this.props.values.pets.findIndex((p) => p.id === this.props.id)
        );
        const pets = this.props.values.pets;
        pets.splice(
            this.props.values.pets.findIndex((p) => p.id === this.props.id) + 1,
            0,
            {
                id: uuid.v4(),
                name: '',
                type: 'dog'
            }
        );
        this.props.setValues({
            ...this.props.values,
            pets
        });
    };

    removePet = () => {
        this.props.setValues({
            ...this.props.values,
            pets: this.props.values.pets.filter(
                (pet) => pet.id !== this.props.id
            )
        });
    };

    handleChange = (e) => {
        const newPets = this.props.values.pets;
        newPets.find((p) => p.id === this.props.id)[e.target.name] =
            e.target.value;
        this.props.onChange('pets', newPets);
    };

    handleBlur = (e) => {
        const touchedPets = this.props.touched.pets;
        touchedPets.find((p) => p.id === this.props.id)[e.target.name] = true;
        this.props.setTouched({
            ...this.props.touched,
            pets: touchedPets
        });
    };

    render() {
        return (
            <div>
                <label htmlFor={this.props.id + '-type'}>Type</label>
                <select
                    type="text"
                    id={this.props.id + '-type'}
                    name="type"
                    value={this.props.type}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                </select>
                <label htmlFor={this.props.id + '-name'}>Name</label>
                <input
                    type="text"
                    id={this.props.id + '-name'}
                    name="name"
                    value={this.props.name}
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                />
                <button type="button" onClick={this.removePet}>
                    X
                </button>
                <button type="button" onClick={this.addPetBelow}>
                    +
                </button>
            </div>
        );
    }
}

const MyForm = ({
    values,
    handleChange,
    handleBlur,
    handleChangeValue,
    handleSubmit,
    setValues,
    touched,
    errors
}) =>
    console.log(errors) || (
        <form onSubmit={handleSubmit}>
            <label htmlFor="email" style={{ display: 'block' }}>
                Email
            </label>
            <input
                id="email"
                placeholder="Enter your email"
                type="text"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
            />
            {errors.email && touched.email && (
                <div style={{ color: 'red' }}>{errors.email}</div>
            )}
            <div style={{ marginTop: '1rem' }}>Pets</div>
            {values.pets.map((pet) => (
                <CustomPetInput
                    key={pet.id}
                    values={values}
                    errors={errors}
                    touched={touched}
                    {...pet}
                    setValues={setValues}
                    onChange={handleChangeValue}
                />
            ))}
            <button
                type="submit"
                style={{ display: 'block', marginTop: '1rem' }}>
                Submit
            </button>
        </form>
    );

const MyEnhancedForm = formikEnhancer(MyForm);


