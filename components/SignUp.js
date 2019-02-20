import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Form from './styles/Form'
import ErrorMessage from './ErrorMessage'

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!,
    $password: String!,
    $name: String!
  ) {
    signup(
      email: $email,
      password: $password,
      name: $name
    ) {
      id
      name
      email
    }
  }
`

class SignUp extends Component {
  state = {
    email: '',
    name: '',
    password: '',
  }

  handleChange = (e) => {
    const { name, value } = e.target

    this.setState(() => ({
      [name]: value,
    }))
  }

  render() {
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(signup, { error, loading }) => {
          return (
            <Form method='POST' onSubmit={async (e) => {
              e.preventDefault()

              const res = await signup()

              this.setState(() => ({
                name: '',
                email: '',
                password: '',
              }))
            }}>
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign Up for An Account</h2>
                <ErrorMessage error={error} />
                <label htmlFor='email'>
                  Email
                  <input
                    type='email'
                    name='email'
                    placeholder='email'
                    value={this.state.email}
                    onChange={this.handleChange}
                  />
                </label>
                <label htmlFor='name'>
                  Name
                  <input
                    type='text'
                    name='name'
                    placeholder='name'
                    value={this.state.name}
                    onChange={this.handleChange}
                  />
                </label>
                <label htmlFor='password'>
                  Password
                  <input
                    type='password'
                    name='password'
                    placeholder='password'
                    value={this.state.password}
                    onChange={this.handleChange}
                  />
                </label>
                <button type='submit'>Sign Up!</button>
              </fieldset>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

export default SignUp
